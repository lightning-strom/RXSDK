//
//  RewardViewController.m
//  RXTopOnSDKDemo
//
//  Created by root11 on 2024/5/29.
//

#import "RewardViewController.h"

@interface RewardViewController ()<RXTopOnATAdLoadingrDelegate,RXTopOnATRewardedVideoDelegate>
@property(nonatomic, strong) NSDictionary<NSString*, NSString*>* placementIDs;
@property (copy, nonatomic) NSString *placementID;
@property (assign, nonatomic) BOOL isAuto;

@end

@implementation RewardViewController
- (void)dealloc{
    
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.placementID = self.placementIDs[@"AdMob"];
    
    self.title = @"激励视频";
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

- (NSDictionary<NSString *,NSString *> *)placementIDs {
    
    return @{
        @"ADX":                 @"b62f34d5a45756",
        @"All":                 @"b62b41255c3e2c",
        @"Facebook":            @"b62b420baaefb0",
        @"AdMob":               @"b62b420ba3c661",
        @"Inmobi":              @"b62b420b961317",
        @"Applovin":            @"b62b420b7892f0",
        @"Chartboost":          @"b62b420b54a52f",
        @"Tapjoy":              @"b62b420b4dd3fe",
        @"Ironsource":          @"b62b420b3efdd3",
        @"Unity Ads":           @"b62b420b30d814",
        @"Vungle":              @"b62b420b1abf65",
        @"Adcolony":            @"b62b420b0c5834",
        @"CSJ":                 @"b62b41f69c74b2",
        @"Maio":                @"b62b41eeb7dee7",
        @"GDT":                 @"b62b41cf44427c",
        @"Baidu":               @"b62b41cd87f52e",
        @"HeaderBidding":       @"b62b41c8ed1ea7",
        @"Sigmob":              @"b62b41c8c2aec9",
        @"Kuaishou":            @"b62b41c8a53dea",
        @"Cross Promotion":     @"b62b41c888e74d",
        @"Ogury":               @"b62b41c85790d0",
        @"Start.io":            @"b62b41c819c298",
        @"Fyber":               @"b62b41c7f059aa",
        @"Helium":              @"b62b4192ab2383",
        @"Kidoz":               @"b62b41920cdfc5",
        @"MyTarget":            @"b62b4191e45505",
        @"Pangle":              @"b62b41523c054c",
        @"Klevin":              @"b62b4151eccfb8",
        @"Mintegral":           @"b62ea26d71bc99",
        @"Yandex":              @"b62ea26f1b377f",
        @"Nend":                @"b62ea27069e21c",
        @"Bigo":                @"b63909d8be8c86",
    };
}


#pragma mark - Action
- (void)btnClick:(UIButton *)btn {
    if (btn.tag == 100) {
        [self loadAd];
    }else if (btn.tag == 101) {
        [self checkAd];
    }else if (btn.tag == 102) {
        [self showRewardVideoAd];
    }else if (btn.tag == 103) {
        self.isAuto = NO;
        //MARK: 移除无需全自动加载广告位
        [[RXTopOnATAdManager sharedSDK] removeAutoLoadAdPlacementIDArray:@[self.placementID]];
        [self.view makeToast:@"设置为非自动"];
    }else if (btn.tag == 104) {
        self.isAuto = YES;
        //MARK: 加载全自动广告，下一步直接点击展示广告
        [RXTopOnATAdManager sharedSDK].loadingDelegate = self;
        [RXTopOnATAdManager sharedSDK].rewardDelegate = self;
        [[RXTopOnATAdManager sharedSDK] addAutoLoadAdPlacementIDArray:@[self.placementID]];
        [self.view makeToast:@"设置为自动"];
    }else{
        NSLog(@"其他");
    }
}

// 加载广告
- (void)loadAd {
    NSDictionary *extra = @{
        /// 以下几个key参数适用于广告平台的服务端激励验证，将被透传
        kATAdLoadingExtraMediaExtraKey:@"media_val",
        kATAdLoadingExtraUserIDKey:@"rv_test_user_id",
        kATAdLoadingExtraRewardNameKey:@"reward_Name",
        kATAdLoadingExtraRewardAmountKey:@(3),
        
        /// 仅游可赢平台可用，当前准备展示广告的rootVC
//        kATExtraInfoRootViewControllerKey:self,
        /// 仅游可赢平台可用， 触发的激励类型，1：复活；2：签到；3：道具；4：虚拟货币；5：其他；不设置，则默认为5
//        kATRewardedVideoKlevinRewardTriggerKey : @1,
        /// 仅游可赢平台可用， 激励卡秒时长
//        kATRewardedVideoKlevinRewardTimeKey : @3,
    };
    [[RXTopOnATAdManager sharedSDK] loadADWithPlacementID:self.placementID extra:extra];
    [RXTopOnATAdManager sharedSDK].loadingDelegate = self;
    [RXTopOnATAdManager sharedSDK].rewardDelegate = self;
}

// 检查广告缓存，是否iReady
- (void)checkAd {
    // 获取广告位的状态对象
    ATCheckLoadModel *checkLoadModel = [[RXTopOnATAdManager sharedSDK] checkRewardedVideoLoadStatusForPlacementID:self.placementID];
    NSLog(@"CheckLoadModel.isLoading:%d--- isReady:%d",checkLoadModel.isLoading,checkLoadModel.isReady);

    // 查询该广告位的所有缓存信息
    NSArray *array = [[RXTopOnATAdManager sharedSDK] getRewardedVideoValidAdsForPlacementID:self.placementID];
    NSLog(@"ValidAds.count:%ld--- ValidAds:%@",array.count,array);

    // 判断当前是否存在可展示的广告
    BOOL isready = [[RXTopOnATAdManager sharedSDK] rewardedVideoReadyForPlacementID:self.placementID];
    if (self.isAuto) {
        isready = [[RXTopOnATAdManager sharedSDK] autoLoadRewardedVideoReadyForPlacementID:self.placementID];
    }
    
    if (isready) {
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
        [[RXTopOnATAdManager sharedSDK] entryAdScenarioWithPlacementID:self.placementID scenarioID:KTopOnRewardedVideoSceneID];
    }else { //Manual loading mode
        [[RXTopOnATAdManager sharedSDK] entryRewardedVideoScenarioWithPlacementID:self.placementID scene:KTopOnRewardedVideoSceneID];
    }
}

// 展示广告
- (void)showRewardVideoAd {
    // 到达场景
    [self entryAdScenario];
    
    if (self.isAuto) { //Auto loading mode
        if ([[RXTopOnATAdManager sharedSDK] autoLoadRewardedVideoReadyForPlacementID:self.placementID]) {
            [[RXTopOnATAdManager sharedSDK] showAutoLoadRewardedVideoWithPlacementID:self.placementID scene:KTopOnRewardedVideoSceneID inViewController:self];
        }
    }else { //Manual loading mode
        if ([[RXTopOnATAdManager sharedSDK] rewardedVideoReadyForPlacementID:self.placementID]) {
            [[RXTopOnATAdManager sharedSDK] showRewardedVideoWithPlacementID:self.placementID scene:KTopOnRewardedVideoSceneID inViewController:self];
        } else {
//            reload Ads
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

- (void)rewardedVideoDidClickForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)rewardedVideoDidCloseForPlacementID:(NSString *)placementID rewarded:(BOOL)rewarded extra:(NSDictionary *)extra { 
    
}

- (void)rewardedVideoDidDeepLinkOrJumpForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra result:(BOOL)success { 
    
}

- (void)rewardedVideoDidEndPlayingForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)rewardedVideoDidFailToPlayForPlacementID:(NSString *)placementID error:(NSError *)error extra:(NSDictionary *)extra { 
    
}

- (void)rewardedVideoDidRewardSuccessForPlacemenID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)rewardedVideoDidStartPlayingForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}



@end
