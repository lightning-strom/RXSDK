//
//  RXGPMService.m
//  RXGPMSDK
//
//  Created by root11 on 2024/8/27.
//

#import "RXGPMService.h"
#import <UIKit/UIKit.h>
//CADisplayLink
#import <QuartzCore/QuartzCore.h>
//占用内存
#import <mach/mach.h>
#import <mach/task.h>
#import <mach/task_info.h>
//电流
//#import <IOKit/IOKitLib.h>
#import <sys/utsname.h>//设备型号
#import <Metal/Metal.h>//GPU型号
#include <sys/sysctl.h>//RAM ROM
//GraphicsAPI图形API
#import <Metal/Metal.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RXNotificationCenter.h>
#import <RXSDK_Pure/RXSubPackage.h>

typedef void(^GPMBlock)(NSDictionary *);

@interface RXGPMService ()

@property (nonatomic) CADisplayLink *displayLink;
@property (nonatomic) NSUInteger frameCount;
@property (nonatomic) NSTimeInterval lastUpdateTime;
@property (nonatomic) NSTimeInterval frameRate;
@property (nonatomic) NSUInteger backCount;//每次等于2时返回FPS

@property (nonatomic, copy) GetFPSAndJANK fpsAndJankBlock;

@end


@implementation RXGPMService


static RXGPMService *sharedSDK = nil;

+ (instancetype)sharedSDK {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedSDK = [[self alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        // 初始化属性
        [RXSubPackage sharedSDK].aRXGPM = YES;
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(gpmAction:) name:rxUserDefault_rx_gpm object:nil];
    }
    return self;
}

#pragma mark -- from main framework
- (void)gpmAction:(NSNotification *)noti
{
    GPMBlock callback = noti.userInfo[@"callback"];
    
    [self getAllInfoWithCompletion:callback];
}

- (void)regist
{
    NSLog(@"RXGPMSDK 初始化成功");
}

+ (instancetype)allocWithZone:(struct _NSZone *)zone {
    static dispatch_once_t once_Token;
    dispatch_once(&once_Token, ^{
        sharedSDK = [super allocWithZone:zone];
        
    });
    return sharedSDK;
}

- (id)copyWithZone:(NSZone *)zone {
    return sharedSDK;
}

- (id)mutableCopyWithZone:(NSZone *)zone {
    return sharedSDK;
}

//获取所有的信息并返回properties字典
- (void)getAllInfoWithCompletion:(void(^)(NSDictionary *propertiesDict))completion{
    __block NSMutableDictionary *propertiesDict = [NSMutableDictionary dictionary];
    [propertiesDict setValue:@([self memoryUsage]) forKey:@"gpm_process_memory_mb"];
    [propertiesDict setValue:@([self getBatteryLevel]) forKey:@"gpm_battery_level"];
    [propertiesDict setValue:@([self getBatteryCapacity]) forKey:@"gpm_battery_capacity"];
    [propertiesDict setValue:@([self getCurrentPower]) forKey:@"gpm_power"];
    [propertiesDict setValue:@([self getCurrent]) forKey:@"gpm_current"];
    [propertiesDict setValue:@([self getBatteryTemperature]) forKey:@"gpm_battery_temp"];
    [propertiesDict setValue:@([self getCPUTemperature]) forKey:@"gpm_cpu_temp"];
    [propertiesDict setValue:@([self getGPUTemperature]) forKey:@"gpm_gpu_temp"];
    [propertiesDict setValue:@([self getCpuUsage]) forKey:@"gpm_cpu_usage"];
    
    [propertiesDict setValue:[self rxGetiPhoneDeviceType] forKey:@"DEVICE_MODEL"];
    [propertiesDict setValue:[self getSystemVersion] forKey:@"SYSTEM"];
    [propertiesDict setValue:[self getScreenResolution] forKey:@"RESOLUTION"];
    [propertiesDict setValue:[self getGraphicsAPI] forKey:@"GRAPHIC_API"];
    [propertiesDict setValue:[self getIsSimulator] ? @(true) : @(false) forKey:@"EMULATOR"];
    [propertiesDict setValue:[self getIsRoot] ? @(true) : @(false) forKey:@"ROOT"];
    [propertiesDict setValue:@([self getCPUCoreCount]) forKey:@"CPU_CORE"];
    [propertiesDict setValue:[self getGPUModel] forKey:@"GPU_MODEL"];
    [propertiesDict setValue:@([self getRAMSizeInMB]) forKey:@"RAM_MB"];
    [propertiesDict setValue:@([self getROMSizeInMB]) forKey:@"ROM_GB"];
    
    [self getCurrentFPSAndJankWithBlock:^(int FPS, int JANK) {
        [propertiesDict setValue:@(FPS) forKey:@"gpm_fps"];
        [propertiesDict setValue:@(JANK) forKey:@"gpm_jank"];
        if (completion) {
            completion(propertiesDict);
        }
    }];
}

//获取FPS和JANK
- (void)getCurrentFPSAndJankWithBlock:(void (^)(int, int))complete{
    self.fpsAndJankBlock = complete;
    self.frameCount = 0;
    self.lastUpdateTime = CACurrentMediaTime();
    self.frameRate = 0.0;
    self.backCount = 0;
        
    self.displayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(updateFrameRate)];
    [self.displayLink addToRunLoop:NSRunLoop.mainRunLoop forMode:NSDefaultRunLoopMode];
}

- (void)updateFrameRate {
    NSUInteger frameCount = self.frameCount;
    NSTimeInterval currentTime = CACurrentMediaTime();
    NSTimeInterval elapsedTime = currentTime - self.lastUpdateTime;
    
    if (elapsedTime >= 1.0) {
        self.frameRate = frameCount / elapsedTime;
        self.frameCount = 0;
        self.lastUpdateTime = currentTime;
        
        self.backCount ++;
        if (self.backCount == 2) {//返回FPS和JANK卡顿
            self.fpsAndJankBlock(round(self.frameRate), self.frameRate - 60);
            [self stopDisplayLink];
        }
    }
    
    self.frameCount++;
}

- (void)stopDisplayLink {
    [self.displayLink invalidate];
    self.displayLink = nil;
}

- (double)memoryUsage {
    int64_t memoryUsageInByte = 0;
    task_vm_info_data_t vmInfo;
    mach_msg_type_number_t count = TASK_VM_INFO_COUNT;
    kern_return_t kernelReturn = task_info(mach_task_self(), TASK_VM_INFO, (task_info_t) &vmInfo, &count);
    if (kernelReturn == KERN_SUCCESS) {
        memoryUsageInByte = (int64_t)vmInfo.phys_footprint;
        // 将字节转换为兆字节（MB），并使用double类型进行计算
        double memoryUsageInMB = (double)memoryUsageInByte / (1024.0 * 1024.0);
        // 保留四位小数
        memoryUsageInMB = round(memoryUsageInMB * 10000.0) / 10000.0;
        return memoryUsageInMB;
    }
    return 0.0; // 返回double类型的0
}

//获取当前电池剩余电量
- (int)getBatteryLevel {
    UIDevice *device = [UIDevice currentDevice];
    // 从iOS 5开始，默认就是开启电池监控的，但这里显式调用也不会有问题
    [device setBatteryMonitoringEnabled:YES];
    // 获取电池电量（0.0到1.0之间）
    CGFloat batteryLevel = [device batteryLevel];
    return batteryLevel * 100.0;
}

//获取当前电池总容量
- (double)getBatteryCapacity {
    return 0.0;
}

//获取当前设备功率
- (double)getCurrentPower{
    return 0.0;
}

//获取当前设备电流
- (int)getCurrent{
    return 0;
}

//获取电池当前温度
- (double)getBatteryTemperature {
    return 0.0;
}

//获取CPU温度
- (int)getCPUTemperature {
    return 0;
}

//获取CPU温度
- (int)getGPUTemperature {
    return 0;
}

//获取CPU使用率
- (float)getCpuUsage{
    kern_return_t kr;
    task_info_data_t tinfo;
    mach_msg_type_number_t task_info_count;

    task_info_count = TASK_INFO_MAX;
    kr = task_info(mach_task_self(), TASK_BASIC_INFO, (task_info_t)tinfo, &task_info_count);
    if (kr != KERN_SUCCESS) {
        return -1;
    }

    task_basic_info_t      basic_info;
    thread_array_t         thread_list;
    mach_msg_type_number_t thread_count;

    thread_info_data_t     thinfo;
    mach_msg_type_number_t thread_info_count;

    thread_basic_info_t basic_info_th;
    uint32_t stat_thread = 0; // Mach threads

    basic_info = (task_basic_info_t)tinfo;

    // get threads in the task
    kr = task_threads(mach_task_self(), &thread_list, &thread_count);
    if (kr != KERN_SUCCESS) {
        return -1;
    }
    if (thread_count > 0)
        stat_thread += thread_count;

    long tot_sec = 0;
    long tot_usec = 0;
    float tot_cpu = 0;
    int j;

    for (j = 0; j < thread_count; j++)
    {
        thread_info_count = THREAD_INFO_MAX;
        kr = thread_info(thread_list[j], THREAD_BASIC_INFO,
                         (thread_info_t)thinfo, &thread_info_count);
        if (kr != KERN_SUCCESS) {
            return -1;
        }

        basic_info_th = (thread_basic_info_t)thinfo;

        if (!(basic_info_th->flags & TH_FLAGS_IDLE)) {
            tot_sec = tot_sec + basic_info_th->user_time.seconds + basic_info_th->system_time.seconds;
            tot_usec = tot_usec + basic_info_th->user_time.microseconds + basic_info_th->system_time.microseconds;
            tot_cpu = tot_cpu + basic_info_th->cpu_usage / (float)TH_USAGE_SCALE * 100.0;
        }

    } // for each thread

    kr = vm_deallocate(mach_task_self(), (vm_offset_t)thread_list, thread_count * sizeof(thread_t));
    assert(kr == KERN_SUCCESS);

    return tot_cpu;
}

/**
 * 获取设备型号
 */
- (NSString *)rxGetiPhoneDeviceType{
    struct utsname systemInfo;
    uname(&systemInfo);
    NSString *platform = [NSString stringWithCString:systemInfo.machine encoding:NSASCIIStringEncoding];
    return platform;
}

//系统版本
- (NSString *)getSystemVersion {
    UIDevice *device = [UIDevice currentDevice];
    return [NSString stringWithFormat:@"%@ %@", device.systemName, device.systemVersion];
}

//设备分辨率
- (NSString *)getScreenResolution {
    UIScreen *screen = [UIScreen mainScreen];
    CGSize screenSize = screen.nativeBounds.size;
    return [NSString stringWithFormat:@"%dx%d",(int)screenSize.width,(int)screenSize.height];
}

//图片API版本
- (NSString *)getGraphicsAPI{
    if (MTLCreateSystemDefaultDevice()) {
        return @"Metal";
    } else {
        if ([[UIApplication sharedApplication] respondsToSelector:@selector(openGLES2Context)]) {
                    // Check if OpenGL ES 2.0 is available
            EAGLContext *context = [[EAGLContext alloc] initWithAPI:kEAGLRenderingAPIOpenGLES2];
            if (context != nil) {
                return @"OpenGL ES 2.0.";
            } else {
                return @"OpenGL ES 1.x.";
            }
        } else {
            return @"";
        }
    }
}
   

//判断是否为模拟器
- (BOOL)getIsSimulator{
    BOOL isSimulator = NO;
    NSString *deviceName = [[UIDevice currentDevice] name];
    if ([deviceName rangeOfString:@" Simulator"].location != NSNotFound) {
        isSimulator = YES;
    }
    return isSimulator;
}

//是否越狱
- (BOOL)getIsRoot{
    BOOL isRooted = NO;
    // 检查是否存在越狱工具
    NSString *jailbreakPath = @"/Applications/Cydia.app";
    if ([[NSFileManager defaultManager] fileExistsAtPath:jailbreakPath]) {
        isRooted = YES;
    }

    // 检查是否有某些特殊权限
    if (getuid() == 0) {
        isRooted = YES;
    }
    return isRooted;
}

//获取CPU核心数量
- (NSUInteger)getCPUCoreCount{
    return [[NSProcessInfo processInfo] processorCount];
}

//获取GPU名称
- (NSString *)getGPUModel{
    // 创建一个CAMetalLayer对象
    CAMetalLayer *metalLayer = [CAMetalLayer layer];
    // 获取图形API的信息
    NSString *graphicsAPI = metalLayer.device.name;
    //此处会返回图形设备的名称，居然就是GPU的型号名称，无需在调用getGPUInfo
    return graphicsAPI;
    
//    return [self getGPUInfo:[self rxGetiPhoneDeviceType]];
}

- (NSUInteger)getMemorySizeInMB:(const char *)property {
    int mib[2] = {CTL_HW, property};
    int64_t physical_memory = 0;
    size_t length = sizeof(physical_memory);
    sysctl(mib, 2, &physical_memory, &length, NULL, 0);
    return physical_memory / (1024 * 1024);
}

//RAM大小
- (NSUInteger)getRAMSizeInMB{
    return [self getMemorySizeInMB:HW_PHYSMEM];
}

//ROM大小
- (NSUInteger)getROMSizeInMB{
//    return [self getMemorySizeInMB:HW_PHYSMEM];
    // 获取文件管理器实例
    NSFileManager *fileManager = [NSFileManager defaultManager];
    
    // 获取文件系统的根目录
    NSDictionary *attributes = [fileManager attributesOfFileSystemForPath:NSHomeDirectory() error:nil];
    
    if (attributes) {
        // 获取总容量
        NSNumber *fileSystemSizeInBytes = [attributes objectForKey:NSFileSystemSize];
        // 获取可用容量
        NSNumber *freeFileSystemSizeInBytes = [attributes objectForKey:NSFileSystemFreeSize];
        
        // 转换为 GB 单位
        double totalSpace = [fileSystemSizeInBytes doubleValue] / (1024.0 * 1024.0 * 1024.0);
//            double freeSpace = [freeFileSystemSizeInBytes doubleValue] / (1024.0 * 1024.0 * 1024.0);
        return (int)totalSpace;
    } else {
        return 0;
    }
}

/**
 * 根据设备型号获取GPU信息，需要持续更新
 */
- (NSString *)getGPUInfo:(NSString *)deviceModel{
    NSDictionary *deviceGPUInfo = @{
        // iPhone 系列
        @"iPhone6,1": @"iPhone 5s, GPU: Apple A7, PowerVR G6430",
        @"iPhone6,2": @"iPhone 5s, GPU: Apple A7, PowerVR G6430",
        @"iPhone7,2": @"iPhone 6, GPU: Apple A8, PowerVR GX6450",
        @"iPhone7,1": @"iPhone 6 Plus, GPU: Apple A8, PowerVR GX6450",
        @"iPhone8,1": @"iPhone 6s, GPU: Apple A9, PowerVR GT7600",
        @"iPhone8,2": @"iPhone 6s Plus, GPU: Apple A9, PowerVR GT7600",
        @"iPhone8,4": @"iPhone SE (1st generation), GPU: Apple A9, PowerVR GT7600",
        @"iPhone9,1": @"iPhone 7, GPU: Apple A10 Fusion, PowerVR GT7600 Plus (6-core)",
        @"iPhone9,3": @"iPhone 7, GPU: Apple A10 Fusion, PowerVR GT7600 Plus (6-core)",
        @"iPhone9,2": @"iPhone 7 Plus, GPU: Apple A10 Fusion, PowerVR GT7600 Plus (6-core)",
        @"iPhone9,4": @"iPhone 7 Plus, GPU: Apple A10 Fusion, PowerVR GT7600 Plus (6-core)",
        @"iPhone10,1": @"iPhone 8, GPU: Apple A11 Bionic, Apple-designed 3-core",
        @"iPhone10,4": @"iPhone 8, GPU: Apple A11 Bionic, Apple-designed 3-core",
        @"iPhone10,2": @"iPhone 8 Plus, GPU: Apple A11 Bionic, Apple-designed 3-core",
        @"iPhone10,5": @"iPhone 8 Plus, GPU: Apple A11 Bionic, Apple-designed 3-core",
        @"iPhone10,3": @"iPhone X, GPU: Apple A11 Bionic, Apple-designed 3-core",
        @"iPhone10,6": @"iPhone X, GPU: Apple A11 Bionic, Apple-designed 3-core",
        @"iPhone11,8": @"iPhone XR, GPU: Apple A12 Bionic, Apple-designed 4-core",
        @"iPhone11,2": @"iPhone XS, GPU: Apple A12 Bionic, Apple-designed 4-core",
        @"iPhone11,4": @"iPhone XS Max, GPU: Apple A12 Bionic, Apple-designed 4-core",
        @"iPhone11,6": @"iPhone XS Max, GPU: Apple A12 Bionic, Apple-designed 4-core",
        @"iPhone12,1": @"iPhone 11, GPU: Apple A13 Bionic, Apple-designed 4-core",
        @"iPhone12,3": @"iPhone 11 Pro, GPU: Apple A13 Bionic, Apple-designed 4-core",
        @"iPhone12,5": @"iPhone 11 Pro Max, GPU: Apple A13 Bionic, Apple-designed 4-core",
        @"iPhone12,8": @"iPhone SE (2nd generation), GPU: Apple A13 Bionic, Apple-designed 4-core",
        @"iPhone13,1": @"iPhone 12 mini, GPU: Apple A14 Bionic, Apple-designed 4-core",
        @"iPhone13,2": @"iPhone 12, GPU: Apple A14 Bionic, Apple-designed 4-core",
        @"iPhone13,3": @"iPhone 12 Pro, GPU: Apple A14 Bionic, Apple-designed 4-core",
        @"iPhone13,4": @"iPhone 12 Pro Max, GPU: Apple A14 Bionic, Apple-designed 4-core",
        @"iPhone14,4": @"iPhone 13 mini, GPU: Apple A15 Bionic, Apple-designed 4-core",
        @"iPhone14,5": @"iPhone 13, GPU: Apple A15 Bionic, Apple-designed 4-core",
        @"iPhone14,2": @"iPhone 13 Pro, GPU: Apple A15 Bionic, Apple-designed 5-core",
        @"iPhone14,3": @"iPhone 13 Pro Max, GPU: Apple A15 Bionic, Apple-designed 5-core",
        @"iPhone14,6": @"iPhone SE (3rd generation), GPU: Apple A15 Bionic, Apple-designed 4-core",
        @"iPhone14,7": @"iPhone 14, GPU: Apple A15 Bionic, Apple-designed 5-core",
        @"iPhone14,8": @"iPhone 14 Plus, GPU: Apple A15 Bionic, Apple-designed 5-core",
        @"iPhone15,2": @"iPhone 14 Pro, GPU: Apple A16 Bionic, Apple-designed 5-core",
        @"iPhone15,3": @"iPhone 14 Pro Max, GPU: Apple A16 Bionic, Apple-designed 5-core",
        @"iPhone15,4": @"iPhone 15, GPU: Apple A16 Bionic, Apple-designed 5-core",
        @"iPhone15,5": @"iPhone 15 Plus, GPU: Apple A16 Bionic, Apple-designed 5-core",
        @"iPhone16,1": @"iPhone 15 Pro, GPU: Apple A17 Pro, Apple-designed 6-core",
        @"iPhone16,2": @"iPhone 15 Pro Max, GPU: Apple A17 Pro, Apple-designed 6-core",
        // iPad 系列
        @"iPad6,11": @"iPad (5th generation), GPU: Apple A9, PowerVR GT7600",
        @"iPad6,12": @"iPad (5th generation), GPU: Apple A9, PowerVR GT7600",
        @"iPad7,5": @"iPad (6th generation), GPU: Apple A10 Fusion, PowerVR GT7600 Plus",
        @"iPad7,6": @"iPad (6th generation), GPU: Apple A10 Fusion, PowerVR GT7600 Plus",
        @"iPad7,11": @"iPad (7th generation), GPU: Apple A10 Fusion, PowerVR GT7600 Plus",
        @"iPad7,12": @"iPad (7th generation), GPU: Apple A10 Fusion, PowerVR GT7600 Plus",
        @"iPad11,6": @"iPad (8th generation), GPU: Apple A12 Bionic, Apple-designed 4-core",
        @"iPad11,7": @"iPad (8th generation), GPU: Apple A12 Bionic, Apple-designed 4-core",
        @"iPad12,1": @"iPad (9th generation), GPU: Apple A13 Bionic, Apple-designed 4-core",
        @"iPad12,2": @"iPad (9th generation), GPU: Apple A13 Bionic, Apple-designed 4-core",
        @"iPad13,18": @"iPad (10th generation), GPU: Apple A14 Bionic, Apple-designed 4-core",
        @"iPad13,19": @"iPad (10th generation), GPU: Apple A14 Bionic, Apple-designed 4-core",
        @"iPad4,1": @"iPad Air (1st generation), GPU: Apple A7, PowerVR G6430",
        @"iPad4,2": @"iPad Air (1st generation), GPU: Apple A7, PowerVR G6430",
        @"iPad4,3": @"iPad Air (1st generation), GPU: Apple A7, PowerVR G6430",
        @"iPad5,3": @"iPad Air 2, GPU: Apple A8X, PowerVR GXA6850",
        @"iPad5,4": @"iPad Air 2, GPU: Apple A8X, PowerVR GXA6850",
        @"iPad11,3": @"iPad Air (3rd generation), GPU: Apple A12 Bionic, Apple-designed 4-core",
        @"iPad11,4": @"iPad Air (3rd generation), GPU: Apple A12 Bionic, Apple-designed 4-core",
        @"iPad13,1": @"iPad Air (4th generation), GPU: Apple A14 Bionic, Apple-designed 4-core",
        @"iPad13,2": @"iPad Air (4th generation), GPU: Apple A14 Bionic, Apple-designed 4-core",
        @"iPad13,16": @"iPad Air (5th generation), GPU: Apple M1, Apple-designed 8-core",
        @"iPad13,17": @"iPad Air (5th generation), GPU: Apple M1, Apple-designed 8-core",
        @"iPad2,5": @"iPad mini (1st generation), GPU: Apple A5, PowerVR SGX543MP2",
        @"iPad2,6": @"iPad mini (1st generation), GPU: Apple A5, PowerVR SGX543MP2",
        @"iPad2,7": @"iPad mini (1st generation), GPU: Apple A5, PowerVR SGX543MP2",
        @"iPad4,4": @"iPad mini 2, GPU: Apple A7, PowerVR G6430",
        @"iPad4,5": @"iPad mini 2, GPU: Apple A7, PowerVR G6430",
        @"iPad4,6": @"iPad mini 2, GPU: Apple A7, PowerVR G6430",
        @"iPad4,7": @"iPad mini 3, GPU: Apple A7, PowerVR G6430",
        @"iPad4,8": @"iPad mini 3, GPU: Apple A7, PowerVR G6430",
        @"iPad4,9": @"iPad mini 3, GPU: Apple A7, PowerVR G6430",
        @"iPad5,1": @"iPad mini 4, GPU: Apple A8, PowerVR GX6450",
        @"iPad5,2": @"iPad mini 4, GPU: Apple A8, PowerVR GX6450",
        @"iPad11,1": @"iPad mini (5th generation), GPU: Apple A12 Bionic, Apple-designed 4-core",
        @"iPad11,2": @"iPad mini (5th generation), GPU: Apple A12 Bionic, Apple-designed 4-core",
        @"iPad14,1": @"iPad mini (6th generation), GPU: Apple A15 Bionic, Apple-designed 5-core",
        @"iPad14,2": @"iPad mini (6th generation), GPU: Apple A15 Bionic, Apple-designed 5-core",
        @"iPad6,3": @"iPad Pro (9.7-inch), GPU: Apple A9X, PowerVR Series 7 (12-core)",
        @"iPad6,4": @"iPad Pro (9.7-inch), GPU: Apple A9X, PowerVR Series 7 (12-core)",
        @"iPad6,7": @"iPad Pro (12.9-inch) (1st generation), GPU: Apple A9X, PowerVR Series 7 (12-core)",
        @"iPad6,8": @"iPad Pro (12.9-inch) (1st generation), GPU: Apple A9X, PowerVR Series 7 (12-core)",
        @"iPad7,1": @"iPad Pro (12.9-inch) (2nd generation), GPU: Apple A10X Fusion, Apple-designed 12-core",
        @"iPad7,2": @"iPad Pro (12.9-inch) (2nd generation), GPU: Apple A10X Fusion, Apple-designed 12-core",
        @"iPad7,3": @"iPad Pro (10.5-inch), GPU: Apple A10X Fusion, Apple-designed 12-core",
        @"iPad7,4": @"iPad Pro (10.5-inch), GPU: Apple A10X Fusion, Apple-designed 12-core",
        @"iPad8,1": @"iPad Pro (11-inch) (1st generation), GPU: Apple A12X Bionic, Apple-designed 7-core",
        @"iPad8,2": @"iPad Pro (11-inch) (1st generation), GPU: Apple A12X Bionic, Apple-designed 7-core",
        @"iPad8,3": @"iPad Pro (11-inch) (1st generation), GPU: Apple A12X Bionic, Apple-designed 7-core",
        @"iPad8,4": @"iPad Pro (11-inch) (1st generation), GPU: Apple A12X Bionic, Apple-designed 7-core",
        @"iPad8,5": @"iPad Pro (12.9-inch) (3rd generation), GPU: Apple A12X Bionic, Apple-designed 7-core",
        @"iPad8,6": @"iPad Pro (12.9-inch) (3rd generation), GPU: Apple A12X Bionic, Apple-designed 7-core",
        @"iPad8,7": @"iPad Pro (12.9-inch) (3rd generation), GPU: Apple A12X Bionic, Apple-designed 7-core",
        @"iPad8,8": @"iPad Pro (12.9-inch) (3rd generation), GPU: Apple A12X Bionic, Apple-designed 7-core",
        @"iPad8,9": @"iPad Pro (11-inch) (2nd generation), GPU: Apple A12Z Bionic, Apple-designed 8-core",
        @"iPad8,10": @"iPad Pro (11-inch) (2nd generation), GPU: Apple A12Z Bionic, Apple-designed 8-core",
        @"iPad8,11": @"iPad Pro (12.9-inch) (4th generation), GPU: Apple A12Z Bionic, Apple-designed 8-core",
        @"iPad8,12": @"iPad Pro (12.9-inch) (4th generation), GPU: Apple A12Z Bionic, Apple-designed 8-core",
        @"iPad13,4": @"iPad Pro (11-inch) (3rd generation), GPU: Apple M1, Apple-designed 8-core",
        @"iPad13,5": @"iPad Pro (11-inch) (3rd generation), GPU: Apple M1, Apple-designed 8-core",
        @"iPad13,6": @"iPad Pro (11-inch) (3rd generation), GPU: Apple M1, Apple-designed 8-core",
        @"iPad13,7": @"iPad Pro (11-inch) (3rd generation), GPU: Apple M1, Apple-designed 8-core",
        @"iPad13,8": @"iPad Pro (12.9-inch) (5th generation), GPU: Apple M1, Apple-designed 8-core",
        @"iPad13,9": @"iPad Pro (12.9-inch) (5th generation), GPU: Apple M1, Apple-designed 8-core",
        @"iPad13,10": @"iPad Pro (12.9-inch) (5th generation), GPU: Apple M1, Apple-designed 8-core",
        @"iPad13,11": @"iPad Pro (12.9-inch) (5th generation), GPU: Apple M1, Apple-designed 8-core",
        @"iPad14,3": @"iPad Pro (11-inch) (4th generation), GPU: Apple M2, Apple-designed 10-core",
        @"iPad14,4": @"iPad Pro (11-inch) (4th generation), GPU: Apple M2, Apple-designed 10-core",
        @"iPad14,5": @"iPad Pro (12.9-inch) (6th generation), GPU: Apple M2, Apple-designed 10-core",
        @"iPad14,6": @"iPad Pro (12.9-inch) (6th generation), GPU: Apple M2, Apple-designed 10-core",
        @"iPad15,1": @"iPad (10th generation), GPU: Apple A14 Bionic, Apple-designed 4-core",
        @"iPad15,2": @"iPad (10th generation), GPU: Apple A14 Bionic, Apple-designed 4-core",
        @"iPad15,3": @"iPad Air (5th generation), GPU: Apple M1, Apple-designed 8-core",
        @"iPad15,4": @"iPad Air (5th generation), GPU: Apple M1, Apple-designed 8-core",
        // 其他设备
        // ...
    };
    
    NSString *gpuInfo = deviceGPUInfo[deviceModel];
    if (gpuInfo) {
        return gpuInfo;
    } else {
        return @"未知设备型号";
    }
}


@end
