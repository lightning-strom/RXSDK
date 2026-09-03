//
//  RXWXTool.h
//  RXWXSDK
//
//  Created by 陈汉 on 2022/5/30.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

static NSString *const sdkVersion = @"3.8.3";

@interface RXWXTool : NSObject

@property (nonatomic, copy) NSString *universallink;
@property (nonatomic, strong) NSMutableDictionary *extDic;

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 保存universallink
 */
+ (void)saveUniversallink:(NSString *)universallink;

+ (NSData *)urlScaledToDataBytes:(long)bytes withImageUrl:(NSString *)imageUrl;
+ (NSData *)urlToData:(NSString *)imageUrl;
//异步下载
+ (void)asyurlToData:(NSString *)imageUrl withHandler:(void (^)(NSURLResponse* response, NSData* data, NSError* connectionError)) handler;
+ (NSData *)dataScaleToBytes:(long)bytes withImageData:(NSData *)imageData;

/** 返回当前控制器 */
- (UIViewController *)currentViewController;

/**
 * 生成二维码图
 * tString:   内容
 * tSize:     大小
 * fillColor: 填充色
 * iconImage: 中间小图标
 */
+ (UIImage *)rxQRCodeForString:(NSString *)tString
                          size:(CGSize)tSize
                     fillColor:(UIColor *)tFillColor
                     iconImage:(UIImage * _Nullable)tIconImage;

/**
 * view生成image
 */
+ (UIImage *)makeImageWithView:(UIView *)view withSize:(CGSize)size;

+ (instancetype)rxwx_modelWithDictionary:(NSDictionary *)dictionary;

// jsonString 转 dic
+ (NSDictionary *)rxwx_stringToDictionary:(NSString *)jsonString;

@end

NS_ASSUME_NONNULL_END
