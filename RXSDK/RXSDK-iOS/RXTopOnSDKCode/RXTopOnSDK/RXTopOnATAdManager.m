//
//  RXTopOnATAdManager.m
//  RXTopOnSDK
//
//  Created by root11 on 2024/5/25.
//

#import "RXTopOnATAdManager.h"


@interface RXTopOnATAdManager ()<ATAdLoadingDelegate,ATRewardedVideoDelegate,ATInterstitialDelegate,ATSplashDelegate,ATBannerDelegate,ATNativeADDelegate>

@end

@implementation RXTopOnATAdManager

static RXTopOnATAdManager *sharedSDK = nil;

#pragma mark - 公用的初始化方法
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
    }
    return self;
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

/**
 * 加载激励视频广告
 * @param placementID 需全自动加载广告位Id
 * @param extra 本地参数
 */
- (void)loadADWithPlacementID:(NSString *)placementID
                        extra:(NSDictionary *)extra{
    [[ATAdManager sharedManager] loadADWithPlacementID:placementID extra:extra delegate:self];
}

#pragma mark =====================================================================================
#pragma mark - 激励视频相关方法
/**
 * 判断当前是否存在可展示的广告
 */
- (BOOL)rewardedVideoReadyForPlacementID:(NSString *)placementID{
    return [[ATAdManager sharedManager] rewardedVideoReadyForPlacementID:placementID];
}

/**
 * 获取当前广告位的状态对象 ATCheckLoadModel
 */
- (ATCheckLoadModel *)checkRewardedVideoLoadStatusForPlacementID:(NSString *)placementID{
    return [[ATAdManager sharedManager] checkRewardedVideoLoadStatusForPlacementID:placementID];
}

/**
 查询广告位的所有缓存信息
 */
- (NSArray<NSDictionary *> *)getRewardedVideoValidAdsForPlacementID:(NSString *)placementID{
    return [[ATAdManager sharedManager] getRewardedVideoValidAdsForPlacementID:placementID];
}

/**
 * 展示该广告位激励视频广告
 * @param placementID 需展示的广告位Id
 * @param viewController 展示广告的viewController
 */
- (void)showRewardedVideoWithPlacementID:(NSString *)placementID
                        inViewController:(UIViewController *)viewController{
    [[ATAdManager sharedManager] showRewardedVideoWithPlacementID:placementID inViewController:viewController delegate:self];
}

/**
 * 展示该广告位激励视频广告
 * @param placementID 需展示的广告位Id
 * @param scene 场景id
 * @param viewController 展示广告的viewController
 */
- (void)showRewardedVideoWithPlacementID:(NSString *)placementID
                                   scene:(NSString *)scene
                        inViewController:(UIViewController*)viewController{
    [[ATAdManager sharedManager] showRewardedVideoWithPlacementID:placementID scene:scene inViewController:viewController delegate:self];
}

/**
 * 对应广告位进入业务场景缓存状态统计
 * @param placementID 广告位Id
 * @param scene 广告展示场景，可从后台创建场景参数和使用请参考 业务场景缓存状态统计
 */
- (void)entryRewardedVideoScenarioWithPlacementID:(NSString *)placementID
                                            scene:(NSString *)scene{
    [[ATAdManager sharedManager] entryRewardedVideoScenarioWithPlacementID:placementID scene:scene];
}

#pragma mark - 激励视频广告全自动加载相关方法
/**
 * 添加需全自动加载广告位
 * @param placementIDArray 需全自动加载广告位Id数组
 */
- (void)addAutoLoadAdPlacementIDArray:(NSArray <NSString *> *)placementIDArray{
    [[ATRewardedVideoAutoAdManager sharedInstance] addAutoLoadAdPlacementIDArray:placementIDArray];
}

/**
 * 移除无需全自动加载广告位
 * @param placementIDArray 无需全自动加载广告位Id数组
 */
- (void)removeAutoLoadAdPlacementIDArray:(NSArray<NSString *> *)placementIDArray{
    [[ATRewardedVideoAutoAdManager sharedInstance] removeAutoLoadAdPlacementIDArray:placementIDArray];
}

/**
 * 对指定广告位设置本地参数
 * @param placementID 广告位Id
 * @param extra 本地参数
 */
- (void)setLocalExtra:(NSDictionary * _Nullable)extra placementID:(NSString *)placementID{
    [[ATRewardedVideoAutoAdManager sharedInstance] setLocalExtra:extra placementID:placementID];
}

/**
 * 判断该广告位是否存在可展示的广告
 * @param placementID 需查询的广告位Id
 */
- (BOOL)autoLoadRewardedVideoReadyForPlacementID:(NSString *)placementID{
    return [[ATRewardedVideoAutoAdManager sharedInstance] autoLoadRewardedVideoReadyForPlacementID:placementID];
}

/**
 * 查询该广告位的所有缓存信息
 * @param placementID 需查询的广告位Id
 */
- (NSArray<NSDictionary *> *)checkValidAdCachesWithPlacementID:(NSString *)placementID{
    return [[ATRewardedVideoAutoAdManager sharedInstance] checkValidAdCachesWithPlacementID:placementID];
}

/**
 * 展示该广告位激励视频广告
 * @param placementID 需展示的广告位Id
 * @param viewController 展示广告的viewController
 */
- (void)showAutoLoadRewardedVideoWithPlacementID:(NSString*)placementID inViewController:(UIViewController*)viewController{
    [[ATRewardedVideoAutoAdManager sharedInstance] showAutoLoadRewardedVideoWithPlacementID:placementID inViewController:viewController delegate:self];
}

/**
 * 展示该广告位激励视频广告
 * @param placementID 需展示的广告位Id
 * @param scene 场景id
 * @param viewController 展示广告的viewController
 */
- (void)showAutoLoadRewardedVideoWithPlacementID:(NSString*)placementID scene:( NSString* _Nullable )scene inViewController:(UIViewController*)viewController{
    [[ATRewardedVideoAutoAdManager sharedInstance] showAutoLoadRewardedVideoWithPlacementID:placementID scene:scene inViewController:viewController delegate:self];
}

/**
 * 对应广告位进入业务场景缓存状态统计
 * @param placementID 广告位Id
 * @param scenarioID 广告展示场景，可从后台创建场景参数和使用请参考 业务场景缓存状态统计
 */
- (void)entryAdScenarioWithPlacementID:(NSString *)placementID scenarioID:(NSString *)scenarioID{
    [[ATRewardedVideoAutoAdManager sharedInstance] entryAdScenarioWithPlacementID:placementID scenarioID:scenarioID];
}

#pragma mark - 插屏广告相关方法
/**
 * 判断当前是否存在可展示的广告
 * placementId：TopOn的广告位id
 */
- (BOOL)interstitialReadyForPlacementID:(NSString *)placementID{
    return [[ATAdManager sharedManager] interstitialReadyForPlacementID:placementID];
}

/**
 获取当前广告位的状态对象ATCheckLoadModel
 placementId：TopOn的广告位id
 ATCheckLoadModel：广告位的状态对象，属性说明如下：
 属性    说明
 isLoading    判断当前广告位是否正在加载广告
 isReady    判断当前广告位是否存在可展示的广告，与interstitialReadyForPlacementID方法作用相同
 adOfferInfo    获取当前广告位优先级最高的广告缓存信息，主要包含第三方聚合平台的id信息 回调信息说明
 */
- (ATCheckLoadModel *)checkInterstitialLoadStatusForPlacementID:(NSString *)placementID{
    return [[ATAdManager sharedManager] checkInterstitialLoadStatusForPlacementID:placementID];
}

/**
 查询该广告位的所有缓存信息
 placementId：TopOn的广告位id
 */
- (NSArray<NSDictionary *> *)getInterstitialValidAdsForPlacementID:(NSString *)placementID{
    return [[ATAdManager sharedManager] getInterstitialValidAdsForPlacementID:placementID];
}

/**
 展示Splash广告
 placementId：TopOn的广告位id
 inViewController:展示广告的window
 */
- (void)showInterstitialWithPlacementID:(NSString *)placementID
                       inViewController:(UIViewController *)viewController{
    [[ATAdManager sharedManager] showInterstitialWithPlacementID:placementID inViewController:viewController delegate:self];
}

/**
 展示Splash广告
 placementId：TopOn的广告位id
 scene:场景id
 inViewController:展示广告的window
 */
- (void)showInterstitialWithPlacementID:(NSString *)placementID
                                  scene:(NSString *)scene
                       inViewController:(UIViewController *)viewController{
    [[ATAdManager sharedManager] showInterstitialWithPlacementID:placementID scene:scene inViewController:viewController delegate:self];
}

/**
 进入业务场景当前广告位缓存状态统计。其中scene是指广告展示场景（非必传，可以直接传null），可从后台创建场景参数和使用请参考 业务场景缓存状态统计
 */
- (void)entryInterstitialScenarioWithPlacementID:(NSString *)placementID
                                           scene:(NSString *)scene{
    [[ATAdManager sharedManager] entryInterstitialScenarioWithPlacementID:placementID scene:scene];
}

#pragma mark - 插屏广告全自动加载相关方法
/**
 添加需全自动加载广告位
 placementIds：需全自动加载广告位Id数组
 */
- (void)autoInterstitial_addAutoLoadAdPlacementIDArray:(NSArray <NSString *> *)placementIDArray{
    [[ATInterstitialAutoAdManager sharedInstance] addAutoLoadAdPlacementIDArray:placementIDArray];
}

/**
 移除无需全自动加载广告位
 placementIds：无需全自动加载广告位Id数组
 */
- (void)autoInterstitial_removeAutoLoadAdPlacementIDArray:(NSArray<NSString *> *)placementIDArray{
    [[ATInterstitialAutoAdManager sharedInstance] removeAutoLoadAdPlacementIDArray:placementIDArray];
}

/**
 对指定广告位设置本地参数
 placementId：广告位Id
 localExtra：本地参数
 LocalExtra本地参数预定义Key取值
 方法    说明
 kATAdLoadingExtraUserIDKey    （可选）用于服务器激励，用户唯一ID
 kATAdLoadingExtraMediaExtraKey    （可选）用于服务器激励，用户自定义数据
 */
- (void)autoInterstitial_setLocalExtra:(NSDictionary * _Nullable)extra placementID:(NSString *)placementID{
    [[ATInterstitialAutoAdManager sharedInstance] setLocalExtra:extra placementID:placementID];
}

/**
 判断该广告位是否存在可展示的广告
 placementId：需查询的广告位Id
 */
- (BOOL)autoInterstitial_autoLoadInterstitialReadyForPlacementID:(NSString *)placementID{
    return [[ATInterstitialAutoAdManager sharedInstance] autoLoadInterstitialReadyForPlacementID:placementID];
}

/**
 获取广告位的状态
 ATCheckLoadModel对象的API说明见下方
 placementId：需查询的广告位Id
 */
- (NSArray<NSDictionary *> *)autoInterstitial_checkValidAdCachesWithPlacementID:(NSString *)placementID{
    return [[ATInterstitialAutoAdManager sharedInstance] checkValidAdCachesWithPlacementID:placementID];
}

/**
 查询该广告位的所有缓存信息
 placementId：需查询的广告位Id
 ATCheckLoadModel：广告位的状态对象

 方法    参数    说明
 isLoading    -    判断当前广告位是否正在加载广告
 isReady    -    判断当前广告位是否存在可展示的广告，与autoLoadInterstitialReadyForPlacementID方法作用相同
 adOfferInfo    -    获取当前广告位优先级最高的广告缓存信息，主要包含第三方聚合平台的id信息 回调信息说明
 */
- (ATCheckLoadModel *)autoInterstitial_checkInterstitialLoadStatusForPlacementID:(NSString *)placementID{
    return [[ATInterstitialAutoAdManager sharedInstance] checkInterstitialLoadStatusForPlacementID:placementID];
}

/**
 展示该广告位插屏广告
 inViewController：展示广告的viewController
 placementId：需展示的广告位Id
 */
- (void)autoInterstitial_showAutoLoadInterstitialWithPlacementID:(NSString*)placementID inViewController:(UIViewController*)viewController{
    [[ATInterstitialAutoAdManager sharedInstance] showAutoLoadInterstitialWithPlacementID:placementID inViewController:viewController delegate:self];
}

/**
 展示该广告位插屏广告
 inViewController：展示广告的viewController
 placementId：需展示的广告位Id
 scene:展示广告的场景ID
 */
- (void)autoInterstitial_showAutoLoadInterstitialWithPlacementID:(NSString*)placementID scene:( NSString* _Nullable )scene inViewController:(UIViewController*)viewController{
    [[ATInterstitialAutoAdManager sharedInstance] showAutoLoadInterstitialWithPlacementID:placementID scene:scene inViewController:viewController delegate:self];
}

/**
 对应广告位进入业务场景缓存状态统计
 placementId：广告位Id
 scenario：广告展示场景，可从后台创建场景参数和使用请参考 业务场景缓存状态统计
 */
- (void)autoInterstitial_entryAdScenarioWithPlacementID:(NSString *)placementID scenarioID:(NSString *)scenarioID{
    [[ATInterstitialAutoAdManager sharedInstance] entryAdScenarioWithPlacementID:placementID scenarioID:scenarioID];
}


#pragma mark - 开屏广告相关方法
/**
 Splash的加载方法
 placementId：TopOn的开屏广告位id
 extra：本地配置参数
 delegate：代理对象
 containerView：底部视图
 注意：广告加载超时时间默认为5s
 */
- (void)loadADWithPlacementID:(NSString *)placementID
                        extra:(NSDictionary *)extra
                containerView:(UIView * _Nullable)containerView{
    [[ATAdManager sharedManager] loadADWithPlacementID:placementID extra:extra delegate:self containerView:containerView];
}

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
        defaultAdSourceConfig:(NSString *)defaultAdSourceConfig{
    [[ATAdManager sharedManager] loadADWithPlacementID:placementID extra:extra delegate:self containerView:containerView defaultAdSourceConfig:defaultAdSourceConfig];
}

/**
 判断当前是否存在可展示的广告
 placementId：TopOn的开屏广告位id
 */
- (BOOL)splashReadyForPlacementID:(NSString *)placementID{
    return [[ATAdManager sharedManager] splashReadyForPlacementID:placementID];
}

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
- (ATCheckLoadModel *)checkSplashLoadStatusForPlacementID:(NSString *)placementID{
    return [[ATAdManager sharedManager] checkSplashLoadStatusForPlacementID:placementID];
}

/**
 查询该广告位的所有缓存信息
 placementId：TopOn的开屏广告位id
 */
- (NSArray<NSDictionary *> *)getSplashValidAdsForPlacementID:(NSString *)placementID{
    return [[ATAdManager sharedManager] getSplashValidAdsForPlacementID:placementID];
}

/**
 展示Splash广告  v6.2.92+
 placementId：TopOn的开屏广告位id
 scene:展示广告的场景ID
 window:展示广告的window
 */
- (void)showSplashWithPlacementID:(NSString *)placementID scene:(NSString *)scene
                           window:(UIWindow *)window
                            extra:(NSDictionary *)extra{
    [[ATAdManager sharedManager] showSplashWithPlacementID:placementID scene:scene window:window extra:extra delegate:self];
}

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
                            extra:(NSDictionary *)extra{
    [[ATAdManager sharedManager] showSplashWithPlacementID:placementID scene:scene window:window inViewController:viewController extra:extra delegate:self];
}

/**
 获取广告平台的各项参数
 placementId：TopOn的开屏广告位id
 */
- (void)checkAdSourceList:(NSString*)placementID{
    [[ATAdManager sharedManager] checkAdSourceList:placementID];
}

/**
 进入业务场景当前广告位缓存状态统计。其中scene是指广告展示场景（非必传，可以直接传null），可从后台创建场景参数和使用请参考 业务场景缓存状态统计
 */
- (void)entrySplashScenarioWithPlacementID:(NSString *)placementID
                                     scene:(NSString *)scene{
    [[ATAdManager sharedManager] entrySplashScenarioWithPlacementID:placementID scene:scene];
}

#pragma mark 横幅广告相关方法
/**
 获取横幅广告视图
 placementId：TopOn的广告位id
 */
- (nullable ATBannerView *)retrieveBannerViewForPlacementID:(NSString *)placementID{
    return [[ATAdManager sharedManager] retrieveBannerViewForPlacementID:placementID];
}

/**
 获取横幅广告视图
 placementId：TopOn的广告位id
 extra：本地配置参数
 */
- (nullable ATBannerView *)retrieveBannerViewForPlacementID:(NSString *)placementID
                                                      extra:(NSDictionary *)extra{
    return [[ATAdManager sharedManager] retrieveBannerViewForPlacementID:placementID extra:extra];
}

/**
 获取横幅广告视图
 placementId：TopOn的广告位id
 scene：场景id，没有可传空 @""
 */
- (nullable ATBannerView *)retrieveBannerViewForPlacementID:(NSString *)placementID
                                                      scene:(NSString *)scene{
    return [[ATAdManager sharedManager] retrieveBannerViewForPlacementID:placementID scene:scene];
}

/**
 6.2.90新增，原生自渲染广告用作横幅广告获取横幅广告视图元素
 placementId：TopOn的广告位id
 scene：场景id，没有可传空 @""
 nativeMixBannerViewBlock：获取横幅广告视图的block
 */
- (nullable ATBannerView *)retrieveBannerViewForPlacementID:(NSString *)placementID
                                                      scene:(NSString *)scene
                                   nativeMixBannerViewBlock:(nullable NativeMixBannerViewBlock)nativeMixBannerViewBlock{
    return [[ATAdManager sharedManager] retrieveBannerViewForPlacementID:placementID scene:scene nativeMixBannerViewBlock:nativeMixBannerViewBlock];
}

/**
 6.2.90新增，原生自渲染广告用作横幅广告 获取横幅广告视图元素
 placementId：TopOn的广告位id
 config：扩展配置
 nativeMixBannerViewBlock：获取横幅广告视图的block
 */
- (nullable ATBannerView *)retrieveBannerViewForPlacementID:(NSString *)placementID
                                                      config:(ATShowConfig *)config
                                   nativeMixBannerViewBlock:(nullable NativeMixBannerViewBlock)nativeMixBannerViewBlock{
    return [[ATAdManager sharedManager] retrieveBannerViewForPlacementID:placementID config:config nativeMixBannerViewBlock:nativeMixBannerViewBlock];
}

/**
 判断当前是否存在可展示的广告
 placementId：TopOn的广告位id
 */
- (BOOL)bannerAdReadyForPlacementID:(NSString *)placementID{
    return [[ATAdManager sharedManager] bannerAdReadyForPlacementID:placementID];
}

/**
 获取当前广告位的状态对象ATCheckLoadModel
 placementId：TopOn的广告位id
 ATCheckLoadModel对象的API说明见下方
 */
- (ATCheckLoadModel *)checkBannerLoadStatusForPlacementID:(NSString *)placementID{
    return [[ATAdManager sharedManager] checkBannerLoadStatusForPlacementID:placementID];
}

/**
 查询该广告位的所有缓存信息
 placementId：TopOn的广告位id
 */
- (NSArray<NSDictionary *> *)getBannerValidAdsForPlacementID:(NSString *)placementID{
    return [[ATAdManager sharedManager] getBannerValidAdsForPlacementID:placementID];
}

/**
 统计用户到达该场景的几率，呈现在后台的数据 数据报表 -> 漏斗分析报表 -> 到达广告场景 ，所以建议开发者在正确的地方进行调用。
 placementId：广告位Id
 scene：广告展示场景，可从后台创建场景参数 使用请参考 业务场景缓存状态统计
 */
- (void)entryBannerScenarioWithPlacementID:(NSString *)placementID scene:(NSString *)scene{
    [[ATAdManager sharedManager] entryBannerScenarioWithPlacementID:placementID scene:scene];
}

#pragma mark - 原生广告相关方法
/**
 设置logoView的位置，默认为右下角
 */
- (void)setPreferredAdLogoPosition:(ATAdLogoPosition)position{
    [ATAPI sharedInstance].preferredAdLogoPosition = position;
}

/**
 获取Native广告素材
 placementId：TopOn的广告位id
 */
- (ATNativeAdOffer *)getNativeAdOfferWithPlacementID:(NSString *)placementID{
    return [[ATAdManager sharedManager] getNativeAdOfferWithPlacementID:placementID];
}

/**
 获取Native广告素材
 placementId：TopOn的广告位id
 scene：场景id
 */
- (ATNativeAdOffer *)getNativeAdOfferWithPlacementID:(NSString *)placementID
                                               scene:(NSString *)scene{
    return [[ATAdManager sharedManager] getNativeAdOfferWithPlacementID:placementID scene:scene];
}

/**
 判断当前是否存在可展示的广告
 placementId：TopOn的广告位id
 */
- (BOOL)nativeAdReadyForPlacementID:(NSString *)placementID{
    return [[ATAdManager sharedManager] nativeAdReadyForPlacementID:placementID];
}

/**
 获取当前广告位的状态对象ATCheckLoadModel
 placementId：TopOn的广告位id
 ATCheckLoadModel对象的API说明见下方
 */
- (ATCheckLoadModel *)checkNativeLoadStatusForPlacementID:(NSString *)placementID{
    return [[ATAdManager sharedManager] checkNativeLoadStatusForPlacementID:placementID];
}

/**
 查询该广告位的所有缓存信息
placementId：TopOn的广告位id
 */
- (NSArray<NSDictionary *> *)getNativeValidAdsForPlacementID:(NSString *)placementID{
    return [[ATAdManager sharedManager] getNativeValidAdsForPlacementID:placementID];
}

/**
 进入业务场景当前广告位缓存状态统计。其中scenario是指广告展示场景（非必传，可以直接传null），可从后台创建场景参数和使用请参考 业务场景缓存状态统计
 */
- (void)entryNativeScenarioWithPlacementID:(NSString *)placementID
                                     scene:(NSString *)scene{
    [[ATAdManager sharedManager] entryNativeScenarioWithPlacementID:placementID scene:scene];
}


#pragma mark =====================================================================================
#pragma mark - 加载广告代理 ATAdLoadingDelegate
- (void)didStartLoadingADSourceWithPlacementID:(NSString *)placementID extra:(NSDictionary*)extra {
    if ([self.loadingDelegate respondsToSelector:@selector(didStartLoadingADSourceWithPlacementID:extra:)]) {
        [self.loadingDelegate didStartLoadingADSourceWithPlacementID:placementID extra:extra];
    }
}

- (void)didFinishLoadingADSourceWithPlacementID:(NSString *)placementID extra:(NSDictionary*)extra {
    if ([self.loadingDelegate respondsToSelector:@selector(didFinishLoadingADSourceWithPlacementID:extra:)]) {
        [self.loadingDelegate didFinishLoadingADSourceWithPlacementID:placementID extra:extra];
    }
}

- (void)didFailToLoadADSourceWithPlacementID:(NSString*)placementID extra:(NSDictionary*)extra error:(NSError*)error {
    if ([self.loadingDelegate respondsToSelector:@selector(didFailToLoadADSourceWithPlacementID:extra:error:)]) {
        [self.loadingDelegate didFailToLoadADSourceWithPlacementID:placementID extra:extra error:error];
    }
}

// bidding
- (void)didStartBiddingADSourceWithPlacementID:(NSString *)placementID extra:(NSDictionary*)extra {
    if ([self.loadingDelegate respondsToSelector:@selector(didStartBiddingADSourceWithPlacementID:extra:)]) {
        [self.loadingDelegate didStartBiddingADSourceWithPlacementID:placementID extra:extra];
    }
}

- (void)didFinishBiddingADSourceWithPlacementID:(NSString *)placementID extra:(NSDictionary*)extra {
    if ([self.loadingDelegate respondsToSelector:@selector(didFinishBiddingADSourceWithPlacementID:extra:)]) {
        [self.loadingDelegate didFinishBiddingADSourceWithPlacementID:placementID extra:extra];
    }
}

- (void)didFailBiddingADSourceWithPlacementID:(NSString*)placementID extra:(NSDictionary*)extra error:(NSError*)error {
    if ([self.loadingDelegate respondsToSelector:@selector(didFailBiddingADSourceWithPlacementID:extra:error:)]) {
        [self.loadingDelegate didFailBiddingADSourceWithPlacementID:placementID extra:extra error:error];
    }
}

-(void) didFinishLoadingADWithPlacementID:(NSString *)placementID {
    if ([self.loadingDelegate respondsToSelector:@selector(didFinishLoadingADWithPlacementID:)]) {
        [self.loadingDelegate didFinishLoadingADWithPlacementID:placementID];
    }
}

-(void) didFailToLoadADWithPlacementID:(NSString*)placementID error:(NSError*)error {
    if ([self.loadingDelegate respondsToSelector:@selector(didFailToLoadADWithPlacementID:error:)]) {
        [self.loadingDelegate didFailToLoadADWithPlacementID:placementID error:error];
    }
}

#pragma mark - 激励视频代理方法、激励广告全自动加载代理方法 ATRewardedVideoDelegate
/**
 * 激励视频广告奖励下发
 */
-(void) rewardedVideoDidRewardSuccessForPlacemenID:(NSString *)placementID extra:(NSDictionary *)extra{
    if ([self.rewardDelegate respondsToSelector:@selector(rewardedVideoDidRewardSuccessForPlacemenID:extra:)]) {
        [self.rewardDelegate rewardedVideoDidRewardSuccessForPlacemenID:placementID extra:extra];
    }
}

/**
 * 激励视频广告播放开始
 */
-(void) rewardedVideoDidStartPlayingForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra {
    if ([self.rewardDelegate respondsToSelector:@selector(rewardedVideoDidStartPlayingForPlacementID:extra:)]) {
        [self.rewardDelegate rewardedVideoDidStartPlayingForPlacementID:placementID extra:extra];
    }
}

/**
 * 激励视频广告播放结束
 */
-(void) rewardedVideoDidEndPlayingForPlacementID:(NSString*)placementID extra:(NSDictionary *)extra {
    if ([self.rewardDelegate respondsToSelector:@selector(rewardedVideoDidEndPlayingForPlacementID:extra:)]) {
        [self.rewardDelegate rewardedVideoDidEndPlayingForPlacementID:placementID extra:extra];
    }
}

/**
 * 激励视频广告播放失败
 */
-(void) rewardedVideoDidFailToPlayForPlacementID:(NSString*)placementID error:(NSError*)error extra:(NSDictionary *)extra {
    if ([self.rewardDelegate respondsToSelector:@selector(rewardedVideoDidFailToPlayForPlacementID:error:extra:)]) {
        [self.rewardDelegate rewardedVideoDidFailToPlayForPlacementID:placementID error:error extra:extra];
    }
}

/**
 * 激励视频广告关闭
 */
-(void) rewardedVideoDidCloseForPlacementID:(NSString*)placementID rewarded:(BOOL)rewarded extra:(NSDictionary *)extra {
    if ([self.rewardDelegate respondsToSelector:@selector(rewardedVideoDidCloseForPlacementID:rewarded:extra:)]) {
        [self.rewardDelegate rewardedVideoDidCloseForPlacementID:placementID rewarded:rewarded extra:extra];
    }
}

/**
 * 激励视频广告点击
 */
-(void) rewardedVideoDidClickForPlacementID:(NSString*)placementID extra:(NSDictionary *)extra {
    if ([self.rewardDelegate respondsToSelector:@selector(rewardedVideoDidClickForPlacementID:extra:)]) {
        [self.rewardDelegate rewardedVideoDidClickForPlacementID:placementID extra:extra];
    }
}

/**
 * 激励视频广告点击跳转是否为Deeplink形式，目前只针对TopOn Adx的广告返回
 */
- (void)rewardedVideoDidDeepLinkOrJumpForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra result:(BOOL)success {
    if ([self.rewardDelegate respondsToSelector:@selector(rewardedVideoDidDeepLinkOrJumpForPlacementID:extra:result:)]) {
        [self.rewardDelegate rewardedVideoDidDeepLinkOrJumpForPlacementID:placementID extra:extra result:success];
    }
}

#pragma mark - 插屏广告代理方法、插屏广告全自动代理方法 ATInterstitialDelegate
/**
 插屏广告展示成功
 */
- (void)interstitialDidShowForPlacementID:(NSString *)placementID
                                    extra:(NSDictionary *)extra{
    if ([self.interstitialDelegate respondsToSelector:@selector(interstitialDidShowForPlacementID:extra:)]) {
        [self.interstitialDelegate interstitialDidShowForPlacementID:placementID extra:extra];
    }
}

/**
 插屏广告点击
 */
- (void)interstitialDidClickForPlacementID:(NSString *)placementID
                                     extra:(NSDictionary *)extra{
    if ([self.interstitialDelegate respondsToSelector:@selector(interstitialDidClickForPlacementID:extra:)]) {
        [self.interstitialDelegate interstitialDidClickForPlacementID:placementID extra:extra];
    }
}

/**
 插屏广告关闭
 */
- (void)interstitialDidCloseForPlacementID:(NSString *)placementID
                                     extra:(NSDictionary *)extra{
    if ([self.interstitialDelegate respondsToSelector:@selector(interstitialDidCloseForPlacementID:extra:)]) {
        [self.interstitialDelegate interstitialDidCloseForPlacementID:placementID extra:extra];
    }
}

/**
 插屏广告展示失败
 */
- (void)interstitialFailedToShowForPlacementID:(NSString *)placementID
                                         error:(NSError*)error
                                         extra:(NSDictionary *)extra{
    if ([self.interstitialDelegate respondsToSelector:@selector(interstitialFailedToShowForPlacementID:error:extra:)]) {
        [self.interstitialDelegate interstitialFailedToShowForPlacementID:placementID error:error extra:extra];
    }
}

/**
 插屏视频广告播放开始
 */
- (void)interstitialDidStartPlayingVideoForPlacementID:(NSString *)placementID
                                                 extra:(NSDictionary *)extra{
    if ([self.interstitialDelegate respondsToSelector:@selector(interstitialDidStartPlayingVideoForPlacementID:extra:)]) {
        [self.interstitialDelegate interstitialDidStartPlayingVideoForPlacementID:placementID extra:extra];
    }
}

/**
 插屏视频广告播放结束
 */
- (void)interstitialDidEndPlayingVideoForPlacementID:(NSString *)placementID
                                               extra:(NSDictionary *)extra{
    if ([self.interstitialDelegate respondsToSelector:@selector(interstitialDidEndPlayingVideoForPlacementID:extra:)]) {
        [self.interstitialDelegate interstitialDidEndPlayingVideoForPlacementID:placementID extra:extra];
    }
}

/**
 插屏视频广告播放失败
 */
- (void)interstitialDidFailToPlayVideoForPlacementID:(NSString *)placementID
                                               error:(NSError*)error
                                               extra:(NSDictionary *)extra{
    if ([self.interstitialDelegate respondsToSelector:@selector(interstitialDidFailToPlayVideoForPlacementID:error:extra:)]) {
        [self.interstitialDelegate interstitialDidFailToPlayVideoForPlacementID:placementID error:error extra:extra];
    }
}

/**
 插屏广告点击跳转是否为Deeplink形式，目前只针对TopOn Adx的广告返回
 */
- (void)interstitialDeepLinkOrJumpForPlacementID:(NSString *)placementID
                                           extra:(NSDictionary *)extra
                                          result:(BOOL)success{
    if ([self.interstitialDelegate respondsToSelector:@selector(interstitialDeepLinkOrJumpForPlacementID:extra:result:)]) {
        [self.interstitialDelegate interstitialDeepLinkOrJumpForPlacementID:placementID extra:extra result:success];
    }
}


#pragma mark - 开屏广告代理方法 ATSplashDelegate
- (void)didFinishLoadingSplashADWithPlacementID:(NSString *)placementID
                                      isTimeout:(BOOL)isTimeout{
    if ([self.splashDelegate respondsToSelector:@selector(didFinishLoadingSplashADWithPlacementID:isTimeout:)]) {
        [self.splashDelegate didFinishLoadingSplashADWithPlacementID:placementID isTimeout:isTimeout];
    }
}

- (void)didTimeoutLoadingSplashADWithPlacementID:(NSString *)placementID{
    if ([self.splashDelegate respondsToSelector:@selector(didTimeoutLoadingSplashADWithPlacementID:)]) {
        [self.splashDelegate didTimeoutLoadingSplashADWithPlacementID:placementID];
    }
}

/**
 Splash广告展示成功
 */
- (void)splashDidShowForPlacementID:(NSString *)placementID
                              extra:(NSDictionary *)extra{
    if ([self.splashDelegate respondsToSelector:@selector(splashDidShowForPlacementID:extra:)]) {
        [self.splashDelegate splashDidShowForPlacementID:placementID extra:extra];
    }
}

/**
 Splash广告点击
 */
- (void)splashDidClickForPlacementID:(NSString *)placementID
                               extra:(NSDictionary *)extra{
    if ([self.splashDelegate respondsToSelector:@selector(splashDidClickForPlacementID:extra:)]) {
        [self.splashDelegate splashDidClickForPlacementID:placementID extra:extra];
    }
}

/**
 Splash广告关闭
 */
- (void)splashDidCloseForPlacementID:(NSString *)placementID
                               extra:(NSDictionary *)extra{
    if ([self.splashDelegate respondsToSelector:@selector(splashDidCloseForPlacementID:extra:)]) {
        [self.splashDelegate splashDidCloseForPlacementID:placementID extra:extra];
    }
}

/**
 Splash广告小窗口点击，针对穿山甲开屏点睛广告和广点通开屏V+广告返回
 */
- (void)splashZoomOutViewDidClickForPlacementID:(NSString *)placementID
                                          extra:(NSDictionary *)extra{
    if ([self.splashDelegate respondsToSelector:@selector(splashZoomOutViewDidClickForPlacementID:extra:)]) {
        [self.splashDelegate splashZoomOutViewDidClickForPlacementID:placementID extra:extra];
    }
}

/**
 Splash广告小窗口关闭，针对穿山甲开屏点睛广告和广点通开屏V+广告返回
 */
- (void)splashZoomOutViewDidCloseForPlacementID:(NSString *)placementID
                                          extra:(NSDictionary *)extra{
    if ([self.splashDelegate respondsToSelector:@selector(splashZoomOutViewDidCloseForPlacementID:extra:)]) {
        [self.splashDelegate splashZoomOutViewDidCloseForPlacementID:placementID extra:extra];
    }
}

/**
 Splash广告点击跳转是否为Deeplink形式，目前只针对TopOn Adx的广告返回
 */
- (void)splashDeepLinkOrJumpForPlacementID:(NSString *)placementID
                                     extra:(NSDictionary *)extra
                                    result:(BOOL)success{
    if ([self.splashDelegate respondsToSelector:@selector(splashDeepLinkOrJumpForPlacementID:extra:result:)]) {
        [self.splashDelegate splashDeepLinkOrJumpForPlacementID:placementID extra:extra result:success];
    }
}

/**
 Splash 广告展示失败，目前支持穿山甲、广点通和百度
 */
- (void)splashDidShowFailedForPlacementID:(NSString *)placementID
                                    error:(NSError *)error
                                    extra:(NSDictionary *)extra{
    if ([self.splashDelegate respondsToSelector:@selector(splashDidShowFailedForPlacementID:error:extra:)]) {
        [self.splashDelegate splashDidShowFailedForPlacementID:placementID error:error extra:extra];
    }
}

/**
 Splash 广告关闭详情页回调，目前支持穿山甲、广点通、百度和快手
 */
- (void)splashDetailDidClosedForPlacementID:(NSString *)placementID
                                      extra:(NSDictionary *)extra{
    if ([self.splashDelegate respondsToSelector:@selector(splashDetailDidClosedForPlacementID:extra:)]) {
        [self.splashDelegate splashDetailDidClosedForPlacementID:placementID extra:extra];
    }
}

/**
 Splash 广告倒计时回调。当实现了自定义跳过按钮和倒计时相关参数，此回调会在倒计时开始后触发。目前支持 TopOn MyOffer、 TopOn Adx 和 TopOn OnlineApi 广告。
 */
- (void)splashCountdownTime:(NSInteger)countdown
             forPlacementID:(NSString *)placementID
                      extra:(NSDictionary *)extra{
    if ([self.splashDelegate respondsToSelector:@selector(splashCountdownTime:forPlacementID:extra:)]) {
        [self.splashDelegate splashCountdownTime:countdown forPlacementID:placementID extra:extra];
    }
}

#pragma mark - 横幅广告代理方法 ATBannerDelegate
/**
 bannerView展示成果
 */
- (void)bannerView:(ATBannerView *)bannerView didShowAdWithPlacementID:(NSString *)placementID extra:(NSDictionary *)extra{
    if ([self.bannerDelegate respondsToSelector:@selector(bannerView:didShowAdWithPlacementID:extra:)]) {
        [self.bannerDelegate bannerView:bannerView didShowAdWithPlacementID:placementID extra:extra];
    }
}

/**
 bannerView点击
 */
- (void)bannerView:(ATBannerView *)bannerView didClickWithPlacementID:(NSString *)placementID extra:(NSDictionary *)extra{
    if ([self.bannerDelegate respondsToSelector:@selector(bannerView:didClickWithPlacementID:extra:)]) {
        [self.bannerDelegate bannerView:bannerView didClickWithPlacementID:placementID extra:extra];
    }
}



/**
 bannerView自动刷新
 */
- (void)bannerView:(ATBannerView *)bannerView didAutoRefreshWithPlacement:(NSString *)placementID extra:(NSDictionary *)extra{
    if ([self.bannerDelegate respondsToSelector:@selector(bannerView:didAutoRefreshWithPlacement:extra:)]) {
        [self.bannerDelegate bannerView:bannerView didAutoRefreshWithPlacement:placementID extra:extra];
    }
}

/**
 bannerView自动刷新失败
 */
- (void)bannerView:(ATBannerView *)bannerView failedToAutoRefreshWithPlacementID:(NSString *)placementID error:(NSError *)error{
    if ([self.bannerDelegate respondsToSelector:@selector(bannerView:didAutoRefreshWithPlacement:extra:)]) {
        [self.bannerDelegate bannerView:bannerView failedToAutoRefreshWithPlacementID:placementID error:error];
    }
}

/**
 bannerView点击关闭按钮
 */
- (void)bannerView:(ATBannerView *)bannerView didTapCloseButtonWithPlacementID:(NSString *)placementID extra:(NSDictionary *)extra{
    if ([self.bannerDelegate respondsToSelector:@selector(bannerView:didTapCloseButtonWithPlacementID:extra:)]) {
        [self.bannerDelegate bannerView:bannerView didTapCloseButtonWithPlacementID:placementID extra:extra];
    }
}

/**
 bannerView点击跳转是否为Deeplink形式，目前只针对TopOn Adx的广告返回
 */
- (void)bannerView:(ATBannerView *)bannerView didDeepLinkOrJumpForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra result:(BOOL)success{
    if ([self.bannerDelegate respondsToSelector:@selector(bannerView:didDeepLinkOrJumpForPlacementID:extra:result:)]) {
        [self.bannerDelegate bannerView:bannerView didDeepLinkOrJumpForPlacementID:placementID extra:extra result:success];
    }
}

#pragma mark - 原生广告相关代理方法 ATNativeADDelegate
/**
 Native广告展示成功
 */
- (void)didShowNativeAdInAdView:(ATNativeADView *)adView
                    placementID:(NSString *)placementID
                          extra:(NSDictionary *)extra{
    if ([self.nativeDelegate respondsToSelector:@selector(didShowNativeAdInAdView:placementID:extra:)]) {
        [self.nativeDelegate didShowNativeAdInAdView:adView placementID:placementID extra:extra];
    }
}

/**
 Native广告点击
 */
- (void)didClickNativeAdInAdView:(ATNativeADView *)adView
                     placementID:(NSString *)placementID
                           extra:(NSDictionary *)extra{
    if ([self.nativeDelegate respondsToSelector:@selector(didClickNativeAdInAdView:placementID:extra:)]) {
        [self.nativeDelegate didClickNativeAdInAdView:adView placementID:placementID extra:extra];
    }
}

/**
 Native视频广告开始播放
 */
- (void)didStartPlayingVideoInAdView:(ATNativeADView *)adView
                         placementID:(NSString *)placementID
                               extra:(NSDictionary *)extra{
    if ([self.nativeDelegate respondsToSelector:@selector(didStartPlayingVideoInAdView:placementID:extra:)]) {
        [self.nativeDelegate didStartPlayingVideoInAdView:adView placementID:placementID extra:extra];
    }
}

/**
 Native视频广告结束播放
 */
- (void)didEndPlayingVideoInAdView:(ATNativeADView *)adView
                       placementID:(NSString *)placementID
                             extra:(NSDictionary *)extra{
    if ([self.nativeDelegate respondsToSelector:@selector(didEndPlayingVideoInAdView:placementID:extra:)]) {
        [self.nativeDelegate didEndPlayingVideoInAdView:adView placementID:placementID extra:extra];
    }
}

/**
 Native广告中关闭按钮点击
 */
- (void)didTapCloseButtonInAdView:(ATNativeADView *)adView
                      placementID:(NSString *)placementID
                            extra:(NSDictionary *)extra{
    if ([self.nativeDelegate respondsToSelector:@selector(didTapCloseButtonInAdView:placementID:extra:)]) {
        [self.nativeDelegate didTapCloseButtonInAdView:adView placementID:placementID extra:extra];
    }
}

/**
 Native广告点击关闭详情页
 */
- (void)didCloseDetailInAdView:(ATNativeADView *)adView
                   placementID:(NSString *)placementID
                         extra:(NSDictionary *)extra{
    if ([self.nativeDelegate respondsToSelector:@selector(didCloseDetailInAdView:placementID:extra:)]) {
        [self.nativeDelegate didCloseDetailInAdView:adView placementID:placementID extra:extra];
    }
}

/**
 Native广告点击跳转是否为Deeplink形式，目前只针对TopOn Adx的广告返回
 */
- (void)didDeepLinkOrJumpInAdView:(ATNativeADView *)adView
                      placementID:(NSString *)placementID
                            extra:(NSDictionary*)extra
                           result:(BOOL)success{
    if ([self.nativeDelegate respondsToSelector:@selector(didDeepLinkOrJumpInAdView:placementID:extra:result:)]) {
        [self.nativeDelegate didDeepLinkOrJumpInAdView:adView placementID:placementID extra:extra result:success];
    }
}

/**
 Native进入全屏视频广告
 */
- (void)didEnterFullScreenVideoInAdView:(ATNativeADView *)adView
                            placementID:(NSString *)placementID
                                  extra:(NSDictionary *)extra{
    if ([self.nativeDelegate respondsToSelector:@selector(didEnterFullScreenVideoInAdView:placementID:extra:)]) {
        [self.nativeDelegate didEnterFullScreenVideoInAdView:adView placementID:placementID extra:extra];
    }
}

/**
 Native退出全屏视频广告
 */
- (void)didExitFullScreenVideoInAdView:(ATNativeADView *)adView
                           placementID:(NSString *)placementID
                                 extra:(NSDictionary *)extra{
    if ([self.nativeDelegate respondsToSelector:@selector(didExitFullScreenVideoInAdView:placementID:extra:)]) {
        [self.nativeDelegate didExitFullScreenVideoInAdView:adView placementID:placementID extra:extra];
    }
}



@end
