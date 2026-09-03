//
//  RXTikTokService.h
//  RXTikTokSDK
//
//  Created by 陈汉 on 2023/7/29.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <RXSDK_Pure/RXSDK_Pure.h>

NS_ASSUME_NONNULL_BEGIN

// 分享类型
typedef NS_ENUM(NSUInteger, RXTTShareType) {
    RXTTShareTypeImage = 0,     // 图片类型
    RXTTShareTypeVideo = 1,     // 视频类型
};

// 在TikTok中的状态
typedef NS_ENUM(NSUInteger, RXTTShareTypeLandedPageType) {
    RXTTShareTypeLandedPageTypeClip = 0,      // 修剪状态
    RXTTShareTypeLandedPageTypeEdit = 1,      // 编辑状态
    RXTTShareTypeLandedPageTypePublish = 2,   // 发布状态
};


@interface RXTikTokService : NSObject

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 注册TikTok
 */
- (void)TTRegistWithApplication:(UIApplication *)application
                  launchOptions:(NSDictionary *)launchOptions;

/**
 * 处理跳转参数 openUrl 方式
 */
- (BOOL)TTApplication:(UIApplication *)application
              openURL:(NSURL *)url
              options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options;

/**
 * TikTok 登录
 */
- (void)login;

/**
 * TikTok 分享
 * @param type 分享类型
 * @param landedPageType 在TikTok中的状态
 * @param localIdentifiers 分享资源
 * 您的应用程序在相册中向开放平台共享的视频或图像的本地标识符。内容必须是所有图像或视频。
 * 图像或视频的宽高比应在:[1/2.2,2.2]之间
 * 当“mediaType”为“Image”时:
 * 图像数量应多于1，最多为12。
 * 当“mediaType”为“Video”时:
 * 总视频时长应大于3秒。
 * 共享视频不超过12个
 * 带有品牌标志或水印的视频将导致视频被删除或帐户被禁。确保您的应用程序共享没有水印的内容。
 */
- (void)sendShareWithType:(RXTTShareType)type
           landedPageType:(RXTTShareTypeLandedPageType)landedPageType
                  hashTag:(NSString *)hasTag
         localIdentifiers:(NSArray *)localIdentifiers
                 complete:(void(^)(NSDictionary *response, NSDictionary *error))complete;

/**
 * TikTok 分享
 * @note 首次调用会拉起授权弹框
 * @note 使用该功能需要在 info.plist 中添加 Privacy - Photo Library Usage Description 相册权限说明
 * @param type 分享类型
 * @param landedPageType 在TikTok中的状态
 * @param medias 分享资源，支持 url、本地路径
 * 内容必须是图像或视频。
 * 图像或视频的宽高比应在:[1/2.2,2.2]之间
 * 当“mediaType”为“Image”时:
 * 图像数量应多于1，最多为12。
 * 当“mediaType”为“Video”时:
 * 总视频时长应大于3秒。
 * 共享视频不超过12个
 * 带有品牌标志或水印的视频将导致视频被删除或帐户被禁。确保您的应用程序共享没有水印的内容。
 */
- (void)shareWithType:(RXTTShareType)type
       landedPageType:(RXTTShareTypeLandedPageType)landedPageType
              hashTag:(NSString *)hasTag
               medias:(NSArray *)medias
             complete:(RequestComplete)complete;

@end

NS_ASSUME_NONNULL_END
