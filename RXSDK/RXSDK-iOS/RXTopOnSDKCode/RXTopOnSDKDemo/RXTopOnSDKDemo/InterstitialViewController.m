//
//  InterstitialViewController.m
//  RXTopOnSDKDemo
//
//  Created by root11 on 2024/5/29.
//

#import "InterstitialViewController.h"

@interface InterstitialViewController ()<RXTopOnATAdLoadingrDelegate,RXTopOnATInterstitialDelegate>
@property(nonatomic, strong) NSDictionary<NSString*, NSString*>* placementIDs_fullScreen;
@property(nonatomic, strong) NSDictionary<NSString*, NSString*>* placementIDs_inter;
@property(nonatomic, strong) NSDictionary<NSString*, NSString*>* placementIDs;
@property (copy, nonatomic) NSString *placementID;
@property (assign, nonatomic) BOOL isAuto;

@end

@implementation InterstitialViewController
- (void)dealloc{
    
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.placementIDs = self.placementIDs_inter;
    self.placementID = self.placementIDs[@"AdMob"];
//    self.placementID = self.placementIDs[@"Baidu"];
    
    self.title = @"插屏广告";
    self.view.backgroundColor = [UIColor whiteColor];
    for (int i = 0; i < 5; i ++) {
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
        }else if (i == 3) {
            [btn setTitle:@"默认非自动" forState:UIControlStateNormal];
        }else if (i == 4) {
            [btn setTitle:@"修改为自动并下载" forState:UIControlStateNormal];
        }else{
            NSLog(@"其他");
        }
    }
}

- (NSDictionary<NSString *,NSString *> *)placementIDs_fullScreen {
    
    return  @{
        @"ADX":                   @"b62b419284c817",
        @"All":                   @"b62ea0f6f852d5",
        @"AdMob":                 @"b62b41f080cfc5",
        @"Mintegral":             @"b62ea0e75a82b1",
        @"Mintegral(Video)":      @"b62b41f097c8db",
        @"CSJ":                   @"b62b41f07070f3",
        @"CSJ(Video)":            @"b62b41f063412d",
        @"Facebook":              @"b62b41f0553690",
        @"Inmobi":                @"b62b41f030901b",
        @"Chartboost":            @"b62b41eff5b54d",
        @"Tapjoy":                @"b62b41efdde828",
        @"Ironsource":            @"b62b41efcdbc79",
        @"Vungle":                @"b62b41efbf3ef5",
        @"Adcolony":              @"b62b41efb0e9c1",
        @"Baidu":                 @"b62b41ef1e9eee",
        @"Unity Ads":             @"b62b41eed9ad16",
        @"Maio":                  @"b62b41eeac0263",
        @"Nend":                  @"b62b41c92cac3c",
        @"Nend(Video)":           @"b62ea0fb0be9d4",
        @"Nend(Full Screen)":     @"b62b41c91ab1f5",
        @"HeaderBidding":         @"b62b41c90295eb",
        @"Sigmob":                @"b62b41c7c855f2",
        @"Sigmob(RV)":            @"b62b41c8b3c4bc",
        @"Kuaishou":              @"b62b41c8970e49",
        @"Cross Promotion":       @"b62b41c87a5a53",
        @"Ogury":                 @"b62b41c84a8af2",
        @"Start.io":              @"b62b41c813565a",
        @"Start.io(Video)":       @"b62b41c80658a7",
        @"Fyber":                 @"b62b41c7e9cb9a",
        @"Helium":                @"b62b41929728f3",
        @"Kidoz":                 @"b62b4191fbc981",
        @"MyTarget":              @"b62b4191d5d73b",
        @"Pangle":                @"b62b4152262689",
        @"Klevin":                @"b62b4151fb009a",
        @"GDT":                   @"b62ea0e42354d1",
        @"Applovin":              @"b62b40f9335d25",
        @"Bigo":                   @"b63909d52edaa2",
    };
}

- (NSDictionary<NSString *,NSString *> *)placementIDs_inter {
    return @{
        @"All":                   @"b62ea0f6f852d5",
        @"AdMob":                 @"b62b41f080cfc5",
        @"Mintegral":             @"b62ea0e75a82b1",
        @"Mintegral-(Video)":     @"b62b41f097c8db",
        @"CSJ":                   @"b62b41f07070f3",
        @"CSJ-(Video)":           @"b62b41f063412d",
        @"Facebook":              @"b62b41f0553690",
        @"Inmobi":                @"b62b41f030901b",
        @"Chartboost":            @"b62b41eff5b54d",
        @"Tapjoy":                @"b62b41efdde828",
        @"Ironsource":            @"b62b41efcdbc79",
        @"Vungle":                @"b62b41efbf3ef5",
        @"Adcolony":              @"b62b41efb0e9c1",
        @"Baidu":                 @"b62b41ef1e9eee",
        @"Unity Ads":             @"b62b41eed9ad16",
        @"Maio":                  @"b62b41eeac0263",
        @"Nend":                  @"b62b41c92cac3c",
        @"Nend-(Video)":          @"b62ea0fb0be9d4",
        @"Nend-(Full Screen)":    @"b62b41c91ab1f5",
        @"HeaderBidding":         @"b62b41c90295eb",
        @"Sigmob":                @"b62b41c7c855f2",
        @"Sigmob-(RV)":           @"b62b41c8b3c4bc",
        @"Kuaishou":              @"b62b41c8970e49",
        @"Cross Promotion":       @"b62b41c87a5a53",
        @"Ogury":                 @"b62b41c84a8af2",
        @"StartApp":              @"b62b41c813565a",
        @"StartApp-(Video)":      @"b62b41c80658a7",
        @"Fyber":                 @"b62b41c7e9cb9a",
        @"Helium":                @"b62b41929728f3",
        @"Kidoz":                 @"b62b4191fbc981",
        @"MyTarget":              @"b62b4191d5d73b",
        @"Pangle":                @"b62b4152262689",
        @"Klevin":                @"b62b4151fb009a",
        @"GDT":                   @"b62ea0e42354d1",
        @"Applovin":              @"b62b40f9335d25",
        @"Bigo":                   @"b63909d52edaa2",
    };
}

#pragma mark - Action
- (void)btnClick:(UIButton *)btn {
    if (btn.tag == 100) {
        [self loadAd];
    }else if (btn.tag == 101) {
        [self checkAd];
    }else if (btn.tag == 102) {
        [self showInterstitialAd];
    }else if (btn.tag == 103) {
        self.isAuto = NO;
        [self.view makeToast:@"设置为非自动"];
        
        //MARK: 移除无需全自动加载广告位
        [[RXTopOnATAdManager sharedSDK] autoInterstitial_removeAutoLoadAdPlacementIDArray:@[self.placementID]];
    }else if (btn.tag == 104) {
        self.isAuto = YES;
        [self.view makeToast:@"设置为自动"];
        
        //MARK: 全自动加载广告，下一步直接点击展示广告
        // 设置LocalExtra 自定义参数，会在代理的Extra回传，可以用于该广告位的自定义规则匹配，参数可参考
        [RXTopOnATAdManager sharedSDK].loadingDelegate = self;
        [RXTopOnATAdManager sharedSDK].interstitialDelegate = self;
        [[RXTopOnATAdManager sharedSDK] setLocalExtra:@{} placementID:self.placementID];
        [[RXTopOnATAdManager sharedSDK] autoInterstitial_addAutoLoadAdPlacementIDArray:@[self.placementID]];
    }else{
        NSLog(@"其他");
    }
}

// 加载广告
- (void)loadAd {
    CGSize size = CGSizeMake(CGRectGetWidth(self.view.bounds) - 30.0f, 300.0f);
    NSDictionary *extraDic = @{
        // 设置半屏插屏广告大小，支持平台：快手，可能会影响展示效果
        kATInterstitialExtraAdSizeKey:[NSValue valueWithCGSize:size],
    };

    if (_isAuto) {//全自动直接展示
        [[RXTopOnATAdManager sharedSDK] autoInterstitial_showAutoLoadInterstitialWithPlacementID:self.placementID scene:KTopOnInterstitialSceneID inViewController:self];
    } else {
        [[RXTopOnATAdManager sharedSDK] loadADWithPlacementID:self.placementID extra:extraDic];
    }
    [RXTopOnATAdManager sharedSDK].loadingDelegate = self;
    [RXTopOnATAdManager sharedSDK].interstitialDelegate = self;
}

// 检查广告缓存，是否iReady
- (void)checkAd {
    // 获取广告位的状态对象
    ATCheckLoadModel *checkLoadModel = [[RXTopOnATAdManager sharedSDK] checkInterstitialLoadStatusForPlacementID:self.placementID];
    NSLog(@"CheckLoadModel.isLoading:%d--- isReady:%d",checkLoadModel.isLoading,checkLoadModel.isReady);

    // 查询该广告位的所有缓存信息
    NSArray *array = [[RXTopOnATAdManager sharedSDK] getInterstitialValidAdsForPlacementID:self.placementID];
    NSLog(@"ValidAds.count:%ld--- ValidAds:%@",array.count,array);
    
    // 判断当前是否存在可展示的广告
    BOOL isReady = [[RXTopOnATAdManager sharedSDK] interstitialReadyForPlacementID:self.placementID];
    
    if (_isAuto) {
        isReady = [[RXTopOnATAdManager sharedSDK] autoInterstitial_autoLoadInterstitialReadyForPlacementID:self.placementID];
    }
    
    if (isReady) {
        NSLog(@"广告准备好了");
        [self.view makeToast:@"广告准备好了"];
    }else{
        NSLog(@"广告未准备好");
        [self.view makeToast:@"广告未准备好"];
    }
}

// 统计到达场景
- (void)entryAdScenario {
    /* 为了统计场景到达率，相关信息可查阅 iOS高级设置说明 -> 广告场景 在满足广告触发条件时调用“进入广告场景”方法，https://docs.toponad.com/#/zh-cn/ios/NetworkAccess/scenario/scenario
    比如： ** 广告场景是在清理结束后弹出广告，则在清理结束时调用；
    * 1、先调用 entryxxx
    * 2、在判断 Ready的状态是否可展示
    * 3、最后调用 show 展示 */
    if (self.isAuto) { //Auto loading mode
        [[RXTopOnATAdManager sharedSDK] autoInterstitial_entryAdScenarioWithPlacementID:self.placementID scenarioID:KTopOnInterstitialSceneID];
    }else { //Manual loading mode
        [[RXTopOnATAdManager sharedSDK] entryInterstitialScenarioWithPlacementID:self.placementID scene:KTopOnInterstitialSceneID];
    }
}

// 展示广告
- (void)showInterstitialAd {
    // 到达场景
    [self entryAdScenario];
    if (self.isAuto) { //Auto loading mode
        if ([[RXTopOnATAdManager sharedSDK] autoInterstitial_autoLoadInterstitialReadyForPlacementID:self.placementID]) {
           [[RXTopOnATAdManager sharedSDK] autoInterstitial_showAutoLoadInterstitialWithPlacementID:self.placementID scene:KTopOnInterstitialSceneID inViewController:self];
       }
    } else { //Manual loading mode
       if ([[RXTopOnATAdManager sharedSDK] interstitialReadyForPlacementID:self.placementID]) {
           [[RXTopOnATAdManager sharedSDK] showInterstitialWithPlacementID:self.placementID scene:KTopOnInterstitialSceneID inViewController:self];
       } else {
           // reload AD
           [self loadAd];
       }
    }
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

- (void)interstitialDeepLinkOrJumpForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra result:(BOOL)success { 
    
}

- (void)interstitialDidClickForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)interstitialDidCloseForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)interstitialDidEndPlayingVideoForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)interstitialDidFailToPlayVideoForPlacementID:(NSString *)placementID error:(NSError *)error extra:(NSDictionary *)extra { 
    
}

- (void)interstitialDidShowForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)interstitialDidStartPlayingVideoForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)interstitialFailedToShowForPlacementID:(NSString *)placementID error:(NSError *)error extra:(NSDictionary *)extra { 
    
}


@end
