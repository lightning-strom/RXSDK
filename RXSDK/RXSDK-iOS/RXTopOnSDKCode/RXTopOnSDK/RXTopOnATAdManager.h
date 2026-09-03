//
//  RXTopOnATAdManager.h
//  RXTopOnSDK
//
//  Created by root11 on 2024/5/25.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <AnyThinkRewardedVideo/AnyThinkRewardedVideo.h>
#import <AnyThinkInterstitial/AnyThinkInterstitial.h>
#import <AnyThinkSplash/AnyThinkSplash.h>
#import <AnyThinkBanner/AnyThinkBanner.h>
#import <AnyThinkNative/AnyThinkNative.h>

#pragma mark - 广告加载相关代理方法
@protocol RXTopOnATAdLoadingrDelegate <NSObject>
/**
 * 对应广告位中某一个广告源开始加载广告的回调
 * placementId：广告位Id
 * extra：广告附加参数
 */
- (void)didStartLoadingADSourceWithPlacementID:(NSString *)placementID extra:(NSDictionary*)extra;

/**
 * 对应广告位中某一个广告源加载广告成功的回调
 * placementId：广告位Id
 * extra：广告附加参数
 */
- (void)didFinishLoadingADSourceWithPlacementID:(NSString *)placementID extra:(NSDictionary*)extra;

/**
 * 对应广告位中某一个广告源加载广告失败的回调
 * placementId：广告位Id
 * extra：广告附加参数
 * error：广告加载失败信息
 */
- (void)didFailToLoadADSourceWithPlacementID:(NSString*)placementID extra:(NSDictionary*)extra error:(NSError*)error;

/**
 * 对应广告位中某一个广告源竞价广告开始开始竞价的回调
 * placementId：广告位Id
 * extra：广告附加参数
 */
- (void)didStartBiddingADSourceWithPlacementID:(NSString *)placementID extra:(NSDictionary*)extra;

/**
 * 对应广告位中某一个广告源竞价广告开始竞价成功的回调
 * placementId：广告位Id
 * extra：广告附加参数
 */
- (void)didFinishBiddingADSourceWithPlacementID:(NSString *)placementID extra:(NSDictionary*)extra;

/**
 * 对应广告位中某一个广告源竞价广告失败的回调
 * placementId：广告位Id
 * extra：广告附加参数
 * error：广告加载失败信息
 */
- (void)didFailBiddingADSourceWithPlacementID:(NSString*)placementID extra:(NSDictionary*)extra error:(NSError*)error;

/**
 * 对应广告位广告加载成功回调
 * placementId：广告位Id
 */
-(void) didFinishLoadingADWithPlacementID:(NSString *)placementID;

/**
 * 对应广告位广告加载失败回调
 * placementId：广告位Id
 * error：广告加载失败信息
 */
-(void) didFailToLoadADWithPlacementID:(NSString*)placementID error:(NSError*)error;



@end

#pragma mark - 激励视频相关代理方法、激励广告全自动加载相关代理方法
@protocol RXTopOnATRewardedVideoDelegate <NSObject>

/**
 * 激励视频广告奖励下发
 */
-(void) rewardedVideoDidRewardSuccessForPlacemenID:(NSString *)placementID extra:(NSDictionary *)extra;

/**
 * 激励视频广告播放开始
 */
-(void) rewardedVideoDidStartPlayingForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra;

/**
 * 激励视频广告播放结束
 */
-(void) rewardedVideoDidEndPlayingForPlacementID:(NSString*)placementID extra:(NSDictionary *)extra;

/**
 * 激励视频广告播放失败
 */
-(void) rewardedVideoDidFailToPlayForPlacementID:(NSString*)placementID error:(NSError*)error extra:(NSDictionary *)extra;

/**
 * 激励视频广告关闭
 */
-(void) rewardedVideoDidCloseForPlacementID:(NSString*)placementID rewarded:(BOOL)rewarded extra:(NSDictionary *)extra;

/**
 * 激励视频广告点击
 */
-(void) rewardedVideoDidClickForPlacementID:(NSString*)placementID extra:(NSDictionary *)extra;

/**
 * 激励视频广告点击跳转是否为Deeplink形式，目前只针对TopOn Adx的广告返回
 */
- (void)rewardedVideoDidDeepLinkOrJumpForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra result:(BOOL)success;

@end

#pragma mark - 插屏广告代理方法、插屏广告全自动加载代理方法
@protocol RXTopOnATInterstitialDelegate <NSObject>
/**
 插屏广告展示成功
 */
- (void)interstitialDidShowForPlacementID:(NSString *)placementID
                                    extra:(NSDictionary *)extra;

/**
 插屏广告点击
 */
- (void)interstitialDidClickForPlacementID:(NSString *)placementID
                                     extra:(NSDictionary *)extra;

/**
 插屏广告关闭
 */
- (void)interstitialDidCloseForPlacementID:(NSString *)placementID
                                     extra:(NSDictionary *)extra;

/**
 插屏广告展示失败
 */
- (void)interstitialFailedToShowForPlacementID:(NSString *)placementID
                                         error:(NSError*)error
                                         extra:(NSDictionary *)extra;

/**
 插屏视频广告播放开始
 */
- (void)interstitialDidStartPlayingVideoForPlacementID:(NSString *)placementID
                                                 extra:(NSDictionary *)extra;

/**
 插屏视频广告播放结束
 */
- (void)interstitialDidEndPlayingVideoForPlacementID:(NSString *)placementID
                                               extra:(NSDictionary *)extra;

/**
 插屏视频广告播放失败
 */
- (void)interstitialDidFailToPlayVideoForPlacementID:(NSString *)placementID
                                               error:(NSError*)error
                                               extra:(NSDictionary *)extra;

/**
 插屏广告点击跳转是否为Deeplink形式，目前只针对TopOn Adx的广告返回
 */
- (void)interstitialDeepLinkOrJumpForPlacementID:(NSString *)placementID
                                           extra:(NSDictionary *)extra
                                          result:(BOOL)success;

@end

#pragma mark - 开屏广告相关代理方法
@protocol RXTopOnATSplashDelegate <NSObject>
/**
 开屏广告位广告加载成功回调
 placementId：广告位Id
 isTimeout：加载是否超时
 */
- (void)didFinishLoadingSplashADWithPlacementID:(NSString *)placementID
                                      isTimeout:(BOOL)isTimeout;

/**
 开屏广告位广告加载超时回调
 placementId：广告位Id
 */
- (void)didTimeoutLoadingSplashADWithPlacementID:(NSString *)placementID;

/**
 Splash广告展示成功
 */
- (void)splashDidShowForPlacementID:(NSString *)placementID
                              extra:(NSDictionary *)extra;

/**
 Splash广告点击
 */
- (void)splashDidClickForPlacementID:(NSString *)placementID
                               extra:(NSDictionary *)extra;

/**
 Splash广告关闭
 */
- (void)splashDidCloseForPlacementID:(NSString *)placementID
                               extra:(NSDictionary *)extra;

/**
 Splash广告小窗口点击，针对穿山甲开屏点睛广告和广点通开屏V+广告返回
 */
- (void)splashZoomOutViewDidClickForPlacementID:(NSString *)placementID
                                          extra:(NSDictionary *)extra;

/**
 Splash广告小窗口关闭，针对穿山甲开屏点睛广告和广点通开屏V+广告返回
 */
- (void)splashZoomOutViewDidCloseForPlacementID:(NSString *)placementID
                                          extra:(NSDictionary *)extra;

/**
 Splash广告点击跳转是否为Deeplink形式，目前只针对TopOn Adx的广告返回
 */
- (void)splashDeepLinkOrJumpForPlacementID:(NSString *)placementID
                                     extra:(NSDictionary *)extra
                                    result:(BOOL)success;

/**
 Splash 广告展示失败，目前支持穿山甲、广点通和百度
 */
- (void)splashDidShowFailedForPlacementID:(NSString *)placementID
                                    error:(NSError *)error
                                    extra:(NSDictionary *)extra;

/**
 Splash 广告关闭详情页回调，目前支持穿山甲、广点通、百度和快手
 */
- (void)splashDetailDidClosedForPlacementID:(NSString *)placementID
                                      extra:(NSDictionary *)extra;

/**
 Splash 广告倒计时回调。当实现了自定义跳过按钮和倒计时相关参数，此回调会在倒计时开始后触发。目前支持 TopOn MyOffer、 TopOn Adx 和 TopOn OnlineApi 广告。
 */
- (void)splashCountdownTime:(NSInteger)countdown
             forPlacementID:(NSString *)placementID
                      extra:(NSDictionary *)extra;

@end


#pragma mark - 横幅广告相关代理方法

@protocol RXTopOnATBannerDelegate <NSObject>
/**
 bannerView展示成果
 */
- (void)bannerView:(ATBannerView *)bannerView didShowAdWithPlacementID:(NSString *)placementID extra:(NSDictionary *)extra;

/**
 bannerView点击
 */
- (void)bannerView:(ATBannerView *)bannerView didClickWithPlacementID:(NSString *)placementID extra:(NSDictionary *)extra;

/**
 bannerView自动刷新
 */
- (void)bannerView:(ATBannerView *)bannerView didAutoRefreshWithPlacement:(NSString *)placementID extra:(NSDictionary *)extra;

/**
 bannerView自动刷新失败
 */
- (void)bannerView:(ATBannerView *)bannerView failedToAutoRefreshWithPlacementID:(NSString *)placementID error:(NSError *)error;

/**
 bannerView点击关闭按钮
 */
- (void)bannerView:(ATBannerView *)bannerView didTapCloseButtonWithPlacementID:(NSString *)placementID extra:(NSDictionary *)extra;

/**
 bannerView点击跳转是否为Deeplink形式，目前只针对TopOn Adx的广告返回
 */
- (void)bannerView:(ATBannerView *)bannerView didDeepLinkOrJumpForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra result:(BOOL)success;


@end

#pragma mark - 原生广告相关代理
@protocol RXTopOnNativeDelegate <NSObject>
/**
 Native广告展示成功
 */
- (void)didShowNativeAdInAdView:(ATNativeADView *)adView
                    placementID:(NSString *)placementID
                          extra:(NSDictionary *)extra;

/**
 Native广告点击
 */
- (void)didClickNativeAdInAdView:(ATNativeADView *)adView
                     placementID:(NSString *)placementID
                           extra:(NSDictionary *)extra;

/**
 Native视频广告开始播放
 */
- (void)didStartPlayingVideoInAdView:(ATNativeADView *)adView
                         placementID:(NSString *)placementID
                               extra:(NSDictionary *)extra;

/**
 Native视频广告结束播放
 */
- (void)didEndPlayingVideoInAdView:(ATNativeADView *)adView
                       placementID:(NSString *)placementID
                             extra:(NSDictionary *)extra;

/**
 Native广告中关闭按钮点击
 */
- (void)didTapCloseButtonInAdView:(ATNativeADView *)adView
                      placementID:(NSString *)placementID
                            extra:(NSDictionary *)extra;

/**
 Native广告点击关闭详情页
 */
- (void)didCloseDetailInAdView:(ATNativeADView *)adView
                   placementID:(NSString *)placementID
                         extra:(NSDictionary *)extra;

/**
 Native广告点击跳转是否为Deeplink形式，目前只针对TopOn Adx的广告返回
 */
- (void)didDeepLinkOrJumpInAdView:(ATNativeADView *)adView
                      placementID:(NSString *)placementID
                            extra:(NSDictionary*)extra
                           result:(BOOL)success;

/**
 Native进入全屏视频广告
 */
- (void)didEnterFullScreenVideoInAdView:(ATNativeADView *)adView
                            placementID:(NSString *)placementID
                                  extra:(NSDictionary *)extra;

/**
 Native退出全屏视频广告
 */
- (void)didExitFullScreenVideoInAdView:(ATNativeADView *)adView
                           placementID:(NSString *)placementID
                                 extra:(NSDictionary *)extra;


@end


NS_ASSUME_NONNULL_BEGIN

@interface RXTopOnATAdManager : NSObject

#pragma mark - 各个代理属性
/**
 * 广告加载代理，无论加载哪个广告必须指定此代理
 */
@property (nonatomic, weak) id <RXTopOnATAdLoadingrDelegate> loadingDelegate;

/**
 * 激励广告相关代理、激励广告全自动加载 展示相关代理
 */
@property (nonatomic, weak) id <RXTopOnATRewardedVideoDelegate> rewardDelegate;

/**
 * 插屏广告、插屏广告全自动加载 展示相关代理
 */
@property (nonatomic, weak) id <RXTopOnATInterstitialDelegate> interstitialDelegate;

/**
 * 开屏广告 展示相关代理
 */
@property (nonatomic, weak) id <RXTopOnATSplashDelegate> splashDelegate;

/**
 * 横幅广告 展示相关代理
 */
@property (nonatomic, weak) id <RXTopOnATBannerDelegate> bannerDelegate;

/**
 * 原生广告 展示相关代理
 */
@property (nonatomic, weak) id <RXTopOnNativeDelegate> nativeDelegate;
/**
 * 原生广告视图的对象
 */
@property (nonatomic, strong) ATNativeADView *adView;


#pragma mark - 初始化方法
/**
 * 获取SDK实例（单例）
 */
+ (instancetype)sharedSDK;

/**
 * 加载视频广告
 * @param placementID 需全自动加载广告位Id
 * @param extra 本地参数
 */
- (void)loadADWithPlacementID:(NSString *)placementID
                        extra:(NSDictionary *)extra;


#pragma mark - 激励视频相关方法
/**
 * 判断当前是否存在可展示的广告
 */
- (BOOL)rewardedVideoReadyForPlacementID:(NSString *)placementID;

/**
 * 获取当前广告位的状态对象 ATCheckLoadModel
 *
 *ATCheckLoadModel：广告位的状态对象
 
 方法    参数    说明
 isLoading    -    判断当前广告位是否正在加载广告
 isReady    -    判断当前广告位是否存在可展示的广告，与autoLoadRewardedVideoReadyForPlacementID方法作用相同
 adOfferInfo    -    获取当前广告位优先级最高的广告缓存信息，主要包含第三方聚合平台的id信息 回调信息说明
 */
- (ATCheckLoadModel *)checkRewardedVideoLoadStatusForPlacementID:(NSString *)placementID;

/**
 查询广告位的所有缓存信息
 */
- (NSArray<NSDictionary *> *)getRewardedVideoValidAdsForPlacementID:(NSString *)placementID;

/**
 * 展示该广告位激励视频广告
 * @param placementID 需展示的广告位Id
 * @param viewController 展示广告的viewController
 */
- (void)showRewardedVideoWithPlacementID:(NSString *)placementID
                        inViewController:(UIViewController *)viewController;

/**
 * 展示该广告位激励视频广告
 * @param placementID 需展示的广告位Id
 * @param scene 场景id
 * @param viewController 展示广告的viewController
 */
- (void)showRewardedVideoWithPlacementID:(NSString *)placementID
                                   scene:(NSString *)scene
                        inViewController:(UIViewController*)viewController;

/**
 * 对应广告位进入业务场景缓存状态统计
 * @param placementID 广告位Id
 * @param scene 广告展示场景，可从后台创建场景参数和使用请参考 业务场景缓存状态统计
 */
- (void)entryRewardedVideoScenarioWithPlacementID:(NSString *)placementID
                                            scene:(NSString *)scene;



#pragma mark - 激励视频广告全自动加载相关方法
/**
 * 添加需全自动加载广告位
 * @param placementIDArray 需全自动加载广告位Id数组
 */
- (void)addAutoLoadAdPlacementIDArray:(NSArray <NSString *> *)placementIDArray;

/**
 * 移除无需全自动加载广告位
 * @param placementIDArray 无需全自动加载广告位Id数组
 */
- (void)removeAutoLoadAdPlacementIDArray:(NSArray<NSString *> *)placementIDArray;

/**
 * 对指定广告位设置本地参数
 * @param placementID 广告位Id
 * @param extra 本地参数
 *
 * LocalExtra本地参数预定义Key取值
 * 方法    说明
 kATAdLoadingExtraUserIDKey    （可选）用于服务器激励，用户唯一ID
 kATAdLoadingExtraMediaExtraKey    （可选）用于服务器激励，用户自定义数据
 */
- (void)setLocalExtra:(NSDictionary * _Nullable)extra placementID:(NSString *)placementID;

/**
 * 判断该广告位是否存在可展示的广告
 * @param placementID 需查询的广告位Id
 */
- (BOOL)autoLoadRewardedVideoReadyForPlacementID:(NSString *)placementID;

/**
 * 查询该广告位的所有缓存信息
 * @param placementID 需查询的广告位Id
 */
- (NSArray<NSDictionary *> *)checkValidAdCachesWithPlacementID:(NSString *)placementID;

/**
 * 展示该广告位激励视频广告
 * @param placementID 需展示的广告位Id
 * @param viewController 展示广告的viewController
 */
- (void)showAutoLoadRewardedVideoWithPlacementID:(NSString*)placementID inViewController:(UIViewController*)viewController;

/**
 * 展示该广告位激励视频广告
 * @param placementID 需展示的广告位Id
 * @param scene 场景id
 * @param viewController 展示广告的viewController
 */
- (void)showAutoLoadRewardedVideoWithPlacementID:(NSString*)placementID scene:( NSString* _Nullable )scene inViewController:(UIViewController*)viewController;

/**
 * 对应广告位进入业务场景缓存状态统计
 * @param placementID 广告位Id
 * @param scenarioID 广告展示场景，可从后台创建场景参数和使用请参考 业务场景缓存状态统计
 */
- (void)entryAdScenarioWithPlacementID:(NSString *)placementID scenarioID:(NSString *)scenarioID;


#pragma mark - 插屏广告相关方法
/**
 * 判断当前是否存在可展示的广告
 * placementId：TopOn的广告位id
 */
- (BOOL)interstitialReadyForPlacementID:(NSString *)placementID;

/**
 获取当前广告位的状态对象ATCheckLoadModel
 placementId：TopOn的广告位id
 ATCheckLoadModel：广告位的状态对象，属性说明如下：
 属性    说明
 isLoading    判断当前广告位是否正在加载广告
 isReady    判断当前广告位是否存在可展示的广告，与interstitialReadyForPlacementID方法作用相同
 adOfferInfo    获取当前广告位优先级最高的广告缓存信息，主要包含第三方聚合平台的id信息 回调信息说明
 */
- (ATCheckLoadModel *)checkInterstitialLoadStatusForPlacementID:(NSString *)placementID;

/**
 查询该广告位的所有缓存信息
 placementId：TopOn的广告位id
 */
- (NSArray<NSDictionary *> *)getInterstitialValidAdsForPlacementID:(NSString *)placementID;

/**
 展示插屏广告
 placementId：TopOn的广告位id
 inViewController:展示广告的window
 */
- (void)showInterstitialWithPlacementID:(NSString *)placementID
                       inViewController:(UIViewController *)viewController;

/**
 展示插屏广告
 placementId：TopOn的广告位id
 scene:场景id
 inViewController:展示广告的window
 */
- (void)showInterstitialWithPlacementID:(NSString *)placementID
                                  scene:(NSString *)scene
                       inViewController:(UIViewController *)viewController;

/**
 进入业务场景当前广告位缓存状态统计。其中scene是指广告展示场景（非必传，可以直接传null），可从后台创建场景参数和使用请参考 业务场景缓存状态统计
 */
- (void)entryInterstitialScenarioWithPlacementID:(NSString *)placementID
                                           scene:(NSString *)scene;


#pragma mark - 插屏广告全自动加载相关方法
/**
 添加需全自动加载广告位
 placementIds：需全自动加载广告位Id数组
 */
- (void)autoInterstitial_addAutoLoadAdPlacementIDArray:(NSArray <NSString *> *)placementIDArray;

/**
 移除无需全自动加载广告位
 placementIds：无需全自动加载广告位Id数组
 */
- (void)autoInterstitial_removeAutoLoadAdPlacementIDArray:(NSArray<NSString *> *)placementIDArray;

/**
 对指定广告位设置本地参数
 placementId：广告位Id
 localExtra：本地参数
 LocalExtra本地参数预定义Key取值
 方法    说明
 kATAdLoadingExtraUserIDKey    （可选）用于服务器激励，用户唯一ID
 kATAdLoadingExtraMediaExtraKey    （可选）用于服务器激励，用户自定义数据
 */
- (void)autoInterstitial_setLocalExtra:(NSDictionary * _Nullable)extra placementID:(NSString *)placementID;

/**
 判断该广告位是否存在可展示的广告
 placementId：需查询的广告位Id
 */
- (BOOL)autoInterstitial_autoLoadInterstitialReadyForPlacementID:(NSString *)placementID;

/**
 获取广告位的状态
 ATCheckLoadModel对象的API说明见下方
 placementId：需查询的广告位Id
 */
- (NSArray<NSDictionary *> *)autoInterstitial_checkValidAdCachesWithPlacementID:(NSString *)placementID;

/**
 查询该广告位的所有缓存信息
 placementId：需查询的广告位Id
 ATCheckLoadModel：广告位的状态对象

 方法    参数    说明
 isLoading    -    判断当前广告位是否正在加载广告
 isReady    -    判断当前广告位是否存在可展示的广告，与autoLoadInterstitialReadyForPlacementID方法作用相同
 adOfferInfo    -    获取当前广告位优先级最高的广告缓存信息，主要包含第三方聚合平台的id信息 回调信息说明
 */
- (ATCheckLoadModel *)autoInterstitial_checkInterstitialLoadStatusForPlacementID:(NSString *)placementID;

/**
 展示该广告位插屏广告
 inViewController：展示广告的viewController
 placementId：需展示的广告位Id
 */
- (void)autoInterstitial_showAutoLoadInterstitialWithPlacementID:(NSString*)placementID inViewController:(UIViewController*)viewController;

/**
 展示该广告位插屏广告
 inViewController：展示广告的viewController
 placementId：需展示的广告位Id
 scene:展示广告的场景ID
 */
- (void)autoInterstitial_showAutoLoadInterstitialWithPlacementID:(NSString*)placementID scene:( NSString* _Nullable )scene inViewController:(UIViewController*)viewController;

/**
 对应广告位进入业务场景缓存状态统计
 placementId：广告位Id
 scenario：广告展示场景，可从后台创建场景参数和使用请参考 业务场景缓存状态统计
 */
- (void)autoInterstitial_entryAdScenarioWithPlacementID:(NSString *)placementID scenarioID:(NSString *)scenarioID;


#pragma mark - 开屏广告相关方法
/**
 Splash的加载方法
 placementId：TopOn的开屏广告位id
 extra：本地配置参数
 containerView：底部视图
 注意：广告加载超时时间默认为5s
 */
- (void)loadADWithPlacementID:(NSString *)placementID
                        extra:(NSDictionary *)extra
                containerView:(UIView * _Nullable)containerView;

/**
 Splash的加载方法
 placementId：TopOn的开屏广告位id
 extra：本地配置参数
 containerView：底部视图
 defaultAdSourceConfig：兜底开屏配置信息，只用于解决应用安装后的首次开屏加载超时
 注意：广告加载超时时间默认为5s
 */
- (void)loadADWithPlacementID:(NSString *)placementID
                        extra:(NSDictionary *)extra
                containerView:(UIView * _Nullable)containerView
        defaultAdSourceConfig:(NSString *)defaultAdSourceConfig;

/**
 判断当前是否存在可展示的广告
 placementId：TopOn的开屏广告位id
 */
- (BOOL)splashReadyForPlacementID:(NSString *)placementID;

/**
 获取当前广告位的状态对象ATCheckLoadModel
 placementId：TopOn的开屏广告位id
 ATCheckLoadModel对象的API说明见下方
 ATCheckLoadModel：广告位的状态对象，属性说明如下：

 属性    说明
 isLoading    判断当前广告位是否正在加载广告
 isReady    判断当前广告位是否存在可展示的广告，与 splashReadyForPlacementID 方法作用相同
 adOfferInfo    获取当前广告位优先级最高的广告缓存信息，主要包含第三方聚合平台的id信息 回调信息说明
 */
- (ATCheckLoadModel *)checkSplashLoadStatusForPlacementID:(NSString *)placementID;

/**
 查询该广告位的所有缓存信息
 placementId：TopOn的开屏广告位id
 */
- (NSArray<NSDictionary *> *)getSplashValidAdsForPlacementID:(NSString *)placementID;

/**
 展示Splash广告
 placementId：TopOn的开屏广告位id
 scene:展示广告的场景ID
 window:展示广告的window
 */
- (void)showSplashWithPlacementID:(NSString *)placementID scene:(NSString *)scene
                           window:(UIWindow *)window
                            extra:(NSDictionary *)extra;

/**
 展示Splash广告
 placementId：TopOn的开屏广告位id
 scene:展示广告的场景ID
 window:展示广告的window
 extra：本地配置参数
 */
- (void)showSplashWithPlacementID:(NSString *)placementID scene:(NSString *)scene
                           window:(UIWindow *)window
                           inViewController:(UIViewController*)viewController
                            extra:(NSDictionary *)extra;

/**
 获取广告平台的各项参数
 placementId：TopOn的开屏广告位id
 */
- (void)checkAdSourceList:(NSString*)placementID;

/**
 进入业务场景当前广告位缓存状态统计。其中scene是指广告展示场景（非必传，可以直接传null），可从后台创建场景参数和使用请参考 业务场景缓存状态统计
 */
- (void)entrySplashScenarioWithPlacementID:(NSString *)placementID
                                     scene:(NSString *)scene;


#pragma mark 横幅广告相关方法
/**
 获取横幅广告视图
 placementId：TopOn的广告位id
 */
- (nullable ATBannerView *)retrieveBannerViewForPlacementID:(NSString *)placementID;

/**
 获取横幅广告视图
 placementId：TopOn的广告位id
 extra：本地配置参数
 */
- (nullable ATBannerView *)retrieveBannerViewForPlacementID:(NSString *)placementID
                                                      extra:(NSDictionary *)extra;

/**
 获取横幅广告视图
 placementId：TopOn的广告位id
 scene：场景id，没有可传空 @""
 */
- (nullable ATBannerView *)retrieveBannerViewForPlacementID:(NSString *)placementID
                                                      scene:(NSString *)scene;

/**
 6.2.90新增，原生自渲染广告用作横幅广告获取横幅广告视图元素
 placementId：TopOn的广告位id
 scene：场景id，没有可传空 @""
 nativeMixBannerViewBlock：获取横幅广告视图的block
 */
- (nullable ATBannerView *)retrieveBannerViewForPlacementID:(NSString *)placementID
                                                      scene:(NSString *)scene
                                   nativeMixBannerViewBlock:(nullable NativeMixBannerViewBlock)nativeMixBannerViewBlock;

/**
 6.2.90新增，原生自渲染广告用作横幅广告 获取横幅广告视图元素
 placementId：TopOn的广告位id
 config：扩展配置
 nativeMixBannerViewBlock：获取横幅广告视图的block
 */
- (nullable ATBannerView *)retrieveBannerViewForPlacementID:(NSString *)placementID
                                                      config:(ATShowConfig *)config
                                   nativeMixBannerViewBlock:(nullable NativeMixBannerViewBlock)nativeMixBannerViewBlock;

/**
 判断当前是否存在可展示的广告
 placementId：TopOn的广告位id
 */
- (BOOL)bannerAdReadyForPlacementID:(NSString *)placementID;

/**
 获取当前广告位的状态对象ATCheckLoadModel
 placementId：TopOn的广告位id
 ATCheckLoadModel对象的API说明见下方
 */
- (ATCheckLoadModel *)checkBannerLoadStatusForPlacementID:(NSString *)placementID;

/**
 查询该广告位的所有缓存信息
 placementId：TopOn的广告位id
 */
- (NSArray<NSDictionary *> *)getBannerValidAdsForPlacementID:(NSString *)placementID;

/**
 统计用户到达该场景的几率，呈现在后台的数据 数据报表 -> 漏斗分析报表 -> 到达广告场景 ，所以建议开发者在正确的地方进行调用。
 placementId：广告位Id
 scene：广告展示场景，可从后台创建场景参数 使用请参考 业务场景缓存状态统计
 */
- (void)entryBannerScenarioWithPlacementID:(NSString *)placementID scene:(NSString *)scene;

#pragma mark - 原生广告相关方法
/**
 设置logoView的位置，默认为右下角
 */
- (void)setPreferredAdLogoPosition:(ATAdLogoPosition)position;

/**
 获取Native广告素材
 placementId：TopOn的广告位id
 */
- (ATNativeAdOffer *)getNativeAdOfferWithPlacementID:(NSString *)placementID;

/**
 获取Native广告素材
 placementId：TopOn的广告位id
 scene：场景id
 */
- (ATNativeAdOffer *)getNativeAdOfferWithPlacementID:(NSString *)placementID
                                               scene:(NSString *)scene;

/**
 判断当前是否存在可展示的广告
 placementId：TopOn的广告位id
 */
- (BOOL)nativeAdReadyForPlacementID:(NSString *)placementID;

/**
 获取当前广告位的状态对象ATCheckLoadModel
 placementId：TopOn的广告位id
 ATCheckLoadModel对象的API说明见下方
 */
- (ATCheckLoadModel *)checkNativeLoadStatusForPlacementID:(NSString *)placementID;

/**
 查询该广告位的所有缓存信息
placementId：TopOn的广告位id
 */
- (NSArray<NSDictionary *> *)getNativeValidAdsForPlacementID:(NSString *)placementID;

/**
 进入业务场景当前广告位缓存状态统计。其中scenario是指广告展示场景（非必传，可以直接传null），可从后台创建场景参数和使用请参考 业务场景缓存状态统计
 */
- (void)entryNativeScenarioWithPlacementID:(NSString *)placementID
                                     scene:(NSString *)scene;

@end

NS_ASSUME_NONNULL_END
