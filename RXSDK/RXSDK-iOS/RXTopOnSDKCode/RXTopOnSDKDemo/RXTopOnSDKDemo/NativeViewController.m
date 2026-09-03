//
//  NativeViewController.m
//  RXTopOnSDKDemo
//
//  Created by root11 on 2024/5/29.
//

#import "NativeViewController.h"
#import "ATUtilitiesTool.h"

@interface NativeViewController ()<RXTopOnATAdLoadingrDelegate,RXTopOnNativeDelegate>
@property (copy, nonatomic) NSDictionary<NSString *, NSString *> *placementIDs_native;
@property (copy, nonatomic) NSDictionary<NSString *, NSString *> *placementIDs_draw;
@property (copy, nonatomic) NSDictionary<NSString *, NSString *> *placementIDs_preRoll;
@property (copy, nonatomic) NSDictionary<NSString *, NSString *> *placementIDs;
@property (copy, nonatomic) NSString *placementID;

@end

@implementation NativeViewController
- (void)dealloc{
    
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.placementIDs = self.placementIDs_native;
    self.placementID = self.placementIDs[@"AdMob"];
    
    self.title = @"原生广告";
    self.view.backgroundColor = [UIColor whiteColor];
    for (int i = 0; i < 3; i ++) {
        UIButton *btn = [UIButton buttonWithType:UIButtonTypeCustom];
        [btn setBackgroundColor:[UIColor blueColor]];
        [btn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        [btn setFrame:CGRectMake(10, 88 + i * 60, 150, 50)];
        btn.tag = 100 + i;
        [btn addTarget:self action:@selector(btnClick:) forControlEvents:UIControlEventTouchUpInside];
        [self.view addSubview:btn];
        if (i == 0) {
            [btn setTitle:@"点击加载广告" forState:UIControlStateNormal];
        }else if (i == 1) {
            [btn setTitle:@"点击准备广告" forState:UIControlStateNormal];
        }else if (i == 2) {
            [btn setTitle:@"点击展示广告" forState:UIControlStateNormal];
        }else{
            NSLog(@"其他");
        }
    }
}

- (NSDictionary<NSString *,NSString *> *)placementIDs_native {
    return @{
        @"ADX模板":                   @"b6329582f88dcb",
        @"ADX自渲染":                   @"b62b41927c34b6",
        @"All":                       @"b62b420bc116db",
        @"Facebook":                  @"b62b420c00ebc4",
        @"AdMob":                     @"b62b420bf038e3",
        @"Inmobi":                    @"b62b420be79b6d",
        @"Mintegral":                 @"b62b420bd30120",
        @"GDT":                       @"b62b420b041609",
        @"CSJ":                       @"b62b41eed70150",
        @"Header Bidding":            @"b62b41c9114d7d",
        @"Baidu":                     @"b62b41c8e14151",
        @"Kuaishou":                  @"b62b41c8340233",
        @"Cross Promotion":           @"b62b4192c5b5bb",
        @"Pangle":                    @"b62b41524379fe",
        @"Sigmob":                    @"b62b4151a7b236",
        @"Klevin":                    @"b62b415198f735",
        @"MyTarget":                  @"b62b4125af318d",
        @"Vungle":                    @"b62b41257a99ad",
        @"Nend":                      @"b62ea207862e3c",
        @"Bigo":                @"b63909d9a254cd",
    };
}

- (NSDictionary<NSString *,NSString *> *)placementIDs_draw {
    return @{
        @"CSJ(Draw)":                 @"b62b41eec64f1e",
        @"Kuaishou(Draw)":            @"b62b41c8313009",
    };
}
- (NSDictionary<NSString *,NSString *> *)placementIDs_preRoll {
    return @{
        @"CSJ":                       @"b62b41eed70150"
    };
}


#pragma mark - Action
- (void)btnClick:(UIButton *)btn {
    if (btn.tag == 100) {
        [self loadAd];
    }else if (btn.tag == 101) {
        [self checkAd];
    }else if (btn.tag == 102) {
        [self showAd];
    }else{
        NSLog(@"其他");
    }
}

//广告加载
- (void)loadAd {
    CGSize size = CGSizeMake(kScreenW, 350);
    if ([self.placementIDs_draw.allValues containsObject:self.placementID]) {
        size = self.view.frame.size;
    }
    
    NSDictionary *extra = @{
        /*
            模板广告size，透传给广告平台，广告平台会返回相近尺寸的最优模板广告
            如没有特定size要求，可传入高度 0，由平台适配宽度返回合适的高度
        */
        kATExtraInfoNativeAdSizeKey:[NSValue valueWithCGSize:size]
    };
    [[RXTopOnATAdManager sharedSDK] loadADWithPlacementID:self.placementID extra:extra];
    [RXTopOnATAdManager sharedSDK].loadingDelegate = self;
    [RXTopOnATAdManager sharedSDK].nativeDelegate = self;
}

//检查广告缓存
- (void)checkAd {
    // 获取广告位的状态对象
    ATCheckLoadModel *checkLoadModel = [[RXTopOnATAdManager sharedSDK] checkNativeLoadStatusForPlacementID:self.placementID];
    NSLog(@"CheckLoadModel.isLoading:%d--- isReady:%d",checkLoadModel.isLoading,checkLoadModel.isReady);
    
    // 查询该广告位的所有缓存信息
    NSArray *array = [[RXTopOnATAdManager sharedSDK] getNativeValidAdsForPlacementID:self.placementID];
    NSLog(@"ValidAds.count:%ld--- ValidAds:%@",array.count,array);
    
    // 判断当前是否存在可展示的广告
    BOOL isReady = [[RXTopOnATAdManager sharedSDK] nativeAdReadyForPlacementID:self.placementID];
    
    if (isReady) {
        NSLog(@"广告准备好了");
        [self.view makeToast:@"广告准备好了"];
    }else{
        NSLog(@"广告未准备好");
        [self.view makeToast:@"广告未准备好"];
    }
}

- (void)entryAdScenario {
    /* 为了统计场景到达率，相关信息可查阅 iOS高级设置说明 -> 广告场景 在满足广告触发条件时调用“进入广告场景”方法，
    比如： ** 广告场景是在清理结束后弹出广告，则在清理结束时调用；
    * 1、先调用 entryxxx
    * 2、在判断 Ready的状态是否可展示
    * 3、最后调用 show 展示 */
    [[RXTopOnATAdManager sharedSDK] entryNativeScenarioWithPlacementID:self.placementID scene:KTopOnNativeSceneID];
}

//广告展示
- (void)showAd {
    // 到达场景
    [self entryAdScenario];
    
    // 判断广告isReady状态
    BOOL ready = [[RXTopOnATAdManager sharedSDK] nativeAdReadyForPlacementID:self.placementID];
    if (ready == NO) {
        [self.view makeToast:@"广告未准备好"];
        return;
    }
    
    // 初始化config配置
    ATNativeADConfiguration *config = [self getNativeADConfiguration];
    // 获取offer广告对象
    ATNativeAdOffer *offer = [[RXTopOnATAdManager sharedSDK] getNativeAdOfferWithPlacementID:self.placementID scene:KTopOnNativeSceneID];
    NSDictionary *offerDict = [ATUtilitiesTool getNativeAdOfferExtraDic:offer];
    NSLog(@"🔥--原生广告素材：%@",offerDict);
    
    //后续自定义view展示对应的原生广告素材.....
}

- (ATNativeADConfiguration *)getNativeADConfiguration {
    ATNativeADConfiguration *config = [[ATNativeADConfiguration alloc] init];
    config.ADFrame = CGRectMake(0, kNavigationBarHeight, kScreenW, 350);
    // 给视频播放器进行预约束，建议在后面添加到自定义视图的时候，再次进行一次约束
    config.mediaViewFrame = CGRectMake(0, kNavigationBarHeight + 150.0f, kScreenW, 350 - kNavigationBarHeight - 150);
    config.delegate = [RXTopOnATAdManager sharedSDK];
    // 开启模板广告自适应高度
    config.sizeToFit = YES;
    config.rootViewController = self;
    return config;
}

#pragma mark - delegate

- (void)didFailBiddingADSourceWithPlacementID:(NSString *)placementID extra:(NSDictionary *)extra error:(NSError *)error {
    
}

- (void)didFailToLoadADSourceWithPlacementID:(NSString *)placementID extra:(NSDictionary *)extra error:(NSError *)error { 
    
}

- (void)didFailToLoadADWithPlacementID:(NSString *)placementID error:(NSError *)error { 
    
}

- (void)didFinishBiddingADSourceWithPlacementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)didFinishLoadingADSourceWithPlacementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)didFinishLoadingADWithPlacementID:(NSString *)placementID { 
    
}

- (void)didStartBiddingADSourceWithPlacementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)didStartLoadingADSourceWithPlacementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)didClickNativeAdInAdView:(ATNativeADView *)adView placementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)didCloseDetailInAdView:(ATNativeADView *)adView placementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)didDeepLinkOrJumpInAdView:(ATNativeADView *)adView placementID:(NSString *)placementID extra:(NSDictionary *)extra result:(BOOL)success { 
    
}

- (void)didEndPlayingVideoInAdView:(ATNativeADView *)adView placementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)didEnterFullScreenVideoInAdView:(ATNativeADView *)adView placementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)didExitFullScreenVideoInAdView:(ATNativeADView *)adView placementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)didShowNativeAdInAdView:(ATNativeADView *)adView placementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)didStartPlayingVideoInAdView:(ATNativeADView *)adView placementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)didTapCloseButtonInAdView:(ATNativeADView *)adView placementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

@end
