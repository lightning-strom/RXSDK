//
//  Tool.h
//  RXSDKDemo
//
//  Created by 陈汉 on 2023/5/11.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface Tool : NSObject

@property (nonatomic, assign) NSInteger interface;

@property (nonatomic, assign) BOOL isAudit;
/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

- (NSString *)getLanguage:(NSString *)language;

/**
 * 系统alert提示
 */
- (void)alertWithTitle:(NSString *)title
               content:(NSString *)content
          sureBtnTitle:(NSString *)btnTitle;

/**
 * 获取状态栏高度
 */
+ (CGFloat)getStatusBarHeight;

/**
 * 获取当前时间字符串
 */
- (NSString *)getTime;

//md5加密然后转大写
+ (NSString *)md532BitUpperWithStr:(NSString *)str;

// NSDictionary 转 UTF-8 字符串
+ (NSString *)dictionaryToUTF8String:(NSDictionary *)dictionary;

@end

NS_ASSUME_NONNULL_END
