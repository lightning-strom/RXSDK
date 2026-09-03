//
//  RXToolKit.h
//  RXPublicToolKit
//
//  Created by 陈汉 on 2022/9/19.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RXWebViewDelegate <NSObject>

/**
 * 加载中
 * @param urlStr 加载地址
 * @param schemeParams 携带的参数
 */
- (void)rx_decidePolicyForNavigationAction:(NSString * _Nullable)urlStr schemeParams:(NSDictionary * _Nullable)schemeParams;

/**
 * 加载完成
 * @param urlStr 加载地址
 * @param schemeParams 携带的参数
 */
- (void)rx_didFinishNavigation:(NSString * _Nullable)urlStr schemeParams:(NSDictionary * _Nullable)schemeParams;

/**
 * 加载结果
 * @note code = 200 时为加载成功不回调，失败时返回 code
 * @param code 错误码
 */
- (void)rx_decidePolicyForNavigationResponse:(NSInteger)code;

/**
 * 关闭 webView
 */
- (void)rx_closeWebView;

@end

@interface RXToolKit : NSObject

@property (nonatomic, weak) id <RXWebViewDelegate> webViewDelegate;

/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 获取userAgent
 */
- (void)getUserAgent:(void(^)(id _Nullable result))complete;

/**
 * 请求相册权限
 * @note 首次调用会拉起授权弹框
 * @note 使用该功能需要在 info.plist 中添加 Privacy - Photo Library Usage Description 相册权限说明
 */
- (void)isCanVisitPhotoLibrary:(void(^)(BOOL result))result;

/**
 * 保存图片到相册
 * @param img 类型支持 UIImage/NSdata（图片二进制）/NSString（图片url或本地路径）
 */
- (void)saveImage:(id)img
         complete:(void(^)(BOOL result))complete;

/**
 * 保存图片到相册
 * @note 可设置二维码
 */
- (void)saveImage:(id)img
              url:(NSString *)url
            width:(NSInteger)width
           height:(NSInteger)height
                x:(NSInteger)x
                y:(NSInteger)y
         complete:(void(^)(BOOL result))complete;

/**
 * 保存视频到相册
 * @param video 图片url或本地路径
 */
- (void)saveVideo:(NSString *)video
         complete:(void(^)(BOOL result))complete;

/**
 * 跳转到app设置页面
 */
+ (void)jumpAppSetting;

/**
 * 异步下载
 */
+ (void)asyurlToData:(NSString *)imageUrl withHandler:(void (^)(NSURLResponse* response, NSData* data, NSError* connectionError)) handler;

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

/**
 * OpenWebView
 */
- (void)openWebView:(NSString *)url;

/**
 * CloseWebView
 */
- (void)closeWebView;

@end

NS_ASSUME_NONNULL_END
