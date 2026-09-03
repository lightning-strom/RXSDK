//
//  RXGPMService.h
//  RXGPMSDK
//
//  Created by root11 on 2024/8/27.
//

#import <Foundation/Foundation.h>

#pragma mark - 注意！！！GPM指标由自定义SDK与UWA两种方式上传，SDK直接在此类中执行定时获取并上传；UWA在C#获取主库中的开关与时间间隔，并创建定时器上传。如需修改，则需要修改SDK与C#两处

typedef void(^GetFPSAndJANK)(int FPS, int JANK);

NS_ASSUME_NONNULL_BEGIN

@interface RXGPMService : NSObject

//单例
+ (instancetype)sharedSDK;

//获取所有的信息并返回properties字典,DEVICE_ID在主库中获取
- (void)getAllInfoWithCompletion:(void(^)(NSDictionary *propertiesDict))completion;

//获取当前FPS与JANK卡顿
- (void)getCurrentFPSAndJankWithBlock:(void(^)(int FPS, int JANK))complete;

//获取当前应用占用的内存
- (double)memoryUsage;

//获取当前电池剩余电量
- (int)getBatteryLevel;

//获取当前电池总容量x
- (double)getBatteryCapacity;

//获取当前功率x
- (double)getCurrentPower;

//获取当前设备电流x
- (int)getCurrent;

//获取电池当前温度x
- (double)getBatteryTemperature;

//获取CPU温度x
- (int)getCPUTemperature;

//获取CPU温度x
- (int)getGPUTemperature;

//获取CPU使用率
- (float)getCpuUsage;

/**
 * 获取设备型号
 */
- (NSString *)rxGetiPhoneDeviceType;

//系统版本
- (NSString *)getSystemVersion;

//设备分辨率
- (NSString *)getScreenResolution;

//图片API名称
- (NSString *)getGraphicsAPI;

//判断是否为模拟器
- (BOOL)getIsSimulator;

//是否越狱
- (BOOL)getIsRoot;

//获取CPU核心数量
- (NSUInteger)getCPUCoreCount;

//获取GPU名称
- (NSString *)getGPUModel;

//RAM大小
- (NSUInteger)getRAMSizeInMB;

//ROM大小
- (NSUInteger)getROMSizeInMB;

@end

NS_ASSUME_NONNULL_END
