#import "UwaGpmUnityShotGlue.h"

#import <Foundation/Foundation.h>

// Unity iOS headers (available in exported Xcode project / UnityFramework).
#include <UnityAppController.h>
#include "Unity/UnityRendering.h"
#include "DisplayManager.h"

#if __has_include(<Metal/Metal.h>)
#import <Metal/Metal.h>
#endif

// Render delegate base types used by UWA_SDK already.
#include "RenderPluginDelegate.h"

// #define UWA_GLUE_LOG(fmt, ...) NSLog((@"[UWAGPMGlue] " fmt), ##__VA_ARGS__)
#define UWA_GLUE_LOG(...) ((void)0)

// Bridge functions implemented in libuwa_gpm.a (UwaGpmNative).
extern "C" {
    void UwaGpmIosUnityShot_OnFrameResolved_Metal(void* mtlTexture, void* mtlCommandBuffer);
    void UwaGpmIosUnityShot_Reset();
}

@interface UWAGpmUnityShotFeeder : RenderPluginDelegate
@end

@implementation UWAGpmUnityShotFeeder

- (void)onBeforeMainDisplaySurfaceRecreate:(struct RenderingSurfaceParams*)params
{
    // Match UWA_SDK behavior: enabling CVTextureCache often makes the main surface/readback
    // path more stable across Unity/iOS versions.
    if (params)
    {
        params->useCVTextureCache = true;
        UWA_GLUE_LOG(@"onBeforeMainDisplaySurfaceRecreate useCVTextureCache=1");
    }
}

- (void)onFrameResolved
{
#if __has_include(<Metal/Metal.h>)
    UnityDisplaySurfaceBase* ss = GetAppController().mainDisplay.surface;
    if (!ss)
    {
        UWA_GLUE_LOG(@"onFrameResolved skip: mainDisplay.surface=nil");
        return;
    }

    if (ss->api != apiMetal)
    {
        UWA_GLUE_LOG(@"onFrameResolved skip: api=%d (not Metal)", (int)ss->api);
        return;
    }

    UnityDisplaySurfaceMTL* mtl = (UnityDisplaySurfaceMTL*)ss;

    // Prefer resolved target RT; fallback to systemColorRB only when target is unavailable.
    id<MTLTexture> tex = (id<MTLTexture>)mtl->targetColorRT;
    const char* source = "targetColorRT";
    if (tex == nil)
    {
        tex = (id<MTLTexture>)mtl->systemColorRB;
        source = "systemColorRB";
    }

    id<MTLCommandBuffer> cb = (id<MTLCommandBuffer>)UnityCurrentMTLCommandBuffer();
    if (tex == nil || cb == nil)
    {
        UWA_GLUE_LOG(@"onFrameResolved skip: source=%s tex=%p cb=%p", source, tex, cb);
        return;
    }

    if (tex.textureType != MTLTextureType2D)
    {
        UWA_GLUE_LOG(@"onFrameResolved skip: source=%s textureType=%lu tex=%p", source, (unsigned long)tex.textureType, tex);
        return;
    }

    if (tex.sampleCount != 1)
    {
        UWA_GLUE_LOG(@"onFrameResolved skip: source=%s sampleCount=%lu tex=%p", source, (unsigned long)tex.sampleCount, tex);
        return;
    }

    // Extra safety: never feed framebufferOnly textures into the bridge.
    if ([tex respondsToSelector:@selector(framebufferOnly)] && tex.framebufferOnly)
    {
        UWA_GLUE_LOG(@"onFrameResolved skip: source=%s framebufferOnly=1 tex=%p w=%llu h=%llu fmt=%lu usage=0x%lx", source, tex,
                     (unsigned long long)tex.width,
                     (unsigned long long)tex.height,
                     (unsigned long)tex.pixelFormat,
                     (unsigned long)tex.usage);
        return;
    }

    UWA_GLUE_LOG(@"onFrameResolved feed: source=%s tex=%p w=%llu h=%llu fmt=%lu usage=0x%lx cb=%p", source, tex,
                 (unsigned long long)tex.width,
                 (unsigned long long)tex.height,
                 (unsigned long)tex.pixelFormat,
                 (unsigned long)tex.usage,
                 cb);

    UwaGpmIosUnityShot_OnFrameResolved_Metal((__bridge void*)tex, (__bridge void*)cb);
#endif
}

@end

static UWAGpmUnityShotFeeder* g_feeder = nil;
static bool g_registered = false;

extern "C" void UwaGpmUnityShotGlue_Register()
{
    if (g_registered)
    {
        UWA_GLUE_LOG(@"Register skip: already registered");
        return;
    }

    g_feeder = [[UWAGpmUnityShotFeeder alloc] init];

    // Chain into existing render delegate (same as UwaTools.mm does).
    id oldDelegate = GetAppController().renderDelegate;
    RenderPluginArrayDelegate* rad = [[RenderPluginArrayDelegate alloc] init];
    rad.delegateArray = [NSArray array];

    if (GetAppController().renderDelegate != nil)
        rad.delegateArray = [rad.delegateArray arrayByAddingObject:GetAppController().renderDelegate];

    rad.delegateArray = [rad.delegateArray arrayByAddingObject:g_feeder];
    GetAppController().renderDelegate = rad;

    g_registered = true;
    UWA_GLUE_LOG(@"Register done: feeder=%p oldDelegate=%p newDelegate=%p", g_feeder, oldDelegate, GetAppController().renderDelegate);
}

extern "C" void UwaGpmUnityShotGlue_Unregister()
{
    // Unity doesn't provide a clean way to remove a single delegate from RenderPluginArrayDelegate
    // without owning the entire chain. Keeping this API for future improvements.
    UWA_GLUE_LOG(@"Unregister called");
    UwaGpmIosUnityShot_Reset();
}
