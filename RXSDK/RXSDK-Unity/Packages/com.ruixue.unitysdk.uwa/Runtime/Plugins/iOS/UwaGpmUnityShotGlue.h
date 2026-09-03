#pragma once

// Unity-side glue for UWA GPM iOS screenshots.
//
// This file is compiled inside a Unity iOS build (Assets/Plugins/iOS or a Unity package).
// It hooks into Unity's render delegate and feeds Metal objects (texture + command buffer)
// into the static lib (libuwa_gpm.a) via the bridge APIs.
//
// Usage from C# (iOS only):
//   [DllImport("__Internal")] static extern void UwaGpmUnityShotGlue_Register();
//   UwaGpmUnityShotGlue_Register();

#ifdef __cplusplus
extern "C" {
#endif

// Install the render delegate (safe to call multiple times).
void UwaGpmUnityShotGlue_Register();

// Uninstall is currently a no-op (kept for completeness).
void UwaGpmUnityShotGlue_Unregister();

#ifdef __cplusplus
}
#endif
