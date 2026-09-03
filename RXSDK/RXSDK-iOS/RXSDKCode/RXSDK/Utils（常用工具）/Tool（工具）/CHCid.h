//
//  CHCid.h
//  RXSDK
//
//  Created by 陈汉 on 2023/6/5.
//

#import <Foundation/Foundation.h>
#import "RXPublicHeader.h"

NS_ASSUME_NONNULL_BEGIN

@interface CHCid : NSObject

/**
 * 设备启动时间C
 */
+ (NSString *)getCTimeInsec;

/**
 * 获取国家C
 */
+ (NSString *)getCCountryCode;

/**
 * 获取语言C
 */
+ (NSString *)getCLanguage;

/**
 * 获取设备名称C
 */
+ (NSString *)getCDeviceName;

/**
 * 获取系统版本C
 */
+ (NSString *)getCSystemVersion;

/**
 * 获取设备 MachineC
 */
+ (NSString *)getCMachine;

/**
 * 获取运营商C
 */
+ (NSString* )getCCarrierInfo;

/**
 * 获取物理内存容量C
 */
+ (NSString *)getCMemory;

/**
 * 获取硬盘容量容量C
 */
+ (NSString *)getCDisk;

/**
 * 获取系统更新时间C
 */
+ (NSString *)getCSysFileTime;

/**
 * 获取设备 ModelC
 */
+ (NSString *)getCModel;

/**
 * 获取设备时区C
 */
+ (NSString *)getCTimeZone;

/**
 * 获取设备 mnt_id C
 */
+ (NSString *)getCMntId;

/**
 * 获取设备初始化时间C
 */
+ (NSString *)getCFileInitTime;

/**
 * 查询是否需要更新客户端缓存的c
 */
+ (void)checkCUpdateWithComplete:(RequestComplete)complete;

/**
 * 获取cid
 */
+ (void)getCidWithComplete:(RequestComplete)complete;

@end

NS_ASSUME_NONNULL_END
