//
//  BannerViewController.m
//  RXTopOnSDKDemo
//
//  Created by root11 on 2024/5/29.
//

#import "BannerViewController.h"

@interface BannerViewController ()<RXTopOnATAdLoadingrDelegate,RXTopOnATBannerDelegate>
@property(nonatomic, strong) NSDictionary<NSString*, NSString*>* placementIDs;
@property (copy, nonatomic) NSString *placementID;
@property (nonatomic, strong) UIView *adView;
@property(nonatomic, readonly) CGSize adSize;
@property (nonatomic, strong) ATBannerView *bannerView;

@end

@implementation BannerViewController

- (void)dealloc{
    
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.placementID = self.placementIDs[@"AdMob"];
    
    self.title = @"横幅广告";
    self.view.backgroundColor = [UIColor whiteColor];
    for (int i = 0; i < 4; i ++) {
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
            [btn setTitle:@"移除广告" forState:UIControlStateNormal];
        }else{
            NSLog(@"其他");
        }
    }
    
    _adSize = CGSizeMake(CGRectGetWidth(self.view.bounds), 250.0f);
    
}

- (NSDictionary<NSString *,NSString *> *)placementIDs {
    return @{
        @"ADX":               @"b62b4192930123",
        @"All":               @"b62b420af2495a",
        @"Applovin":          @"b62b420ae88f2d",
        @"AdMob":             @"b62b420ae05bb4",
        @"CSJ":               @"b62b420ad701a7",
        @"Facebook":          @"b62b41f04bf88e",
        @"Inmobi":            @"b62b41f0477eeb",
        @"Baidu":             @"b62b41ef2d8032",
        @"Unity Ads":         @"b62b41eeed7c11",
        @"Nend":              @"b62b41c939ccd6",
        @"HeaderBidding":     @"b62b41c8e4b841",
        @"Mintegral":         @"b62b41c866b80b",
        @"Fyber":             @"b62b41c7e08ddc",
        @"Start.io":          @"b62b41c7d0076f",
        @"Chartboost":        @"b62b41c79c29a0",
        @"Vungle":            @"b62b41c799f611",
        @"Adcolony":          @"b62b41c7913cee",
        @"Cross Promotion":   @"b62b4192bc2351",
        @"Kidoz":             @"b62b41920adccf",
        @"Pangle":            @"b62b41522d24a3",
        @"MyTarget":          @"b62b4191d37ee7",
        @"GDT":               @"b62ea19b2d10b7",
        @"Yandex":            @"b62ea19cb6e482",
        @"Bigo":                @"b63909d6ca2269",
    };
}


#pragma mark - Action
- (void)btnClick:(UIButton *)btn {
    if (btn.tag == 100) {
        [self loadBannerAdView];
    }else if (btn.tag == 101) {
        [self checkAd];
    }else if (btn.tag == 102) {
        [self showBanner];
    }else if (btn.tag == 103) {
        [self removeAd];
    }else{
        NSLog(@"其他");
    }
}

// 加载广告
- (void)loadBannerAdView {
    /* Admob自适应横幅设置，需要先引入头文件：#import <GoogleMobileAds/GoogleMobileAds.h>
    //GADCurrentOrientationAnchoredAdaptiveBannerAdSizeWithWidth 自适应
    //GADPortraitAnchoredAdaptiveBannerAdSizeWithWidth 竖屏
    //GADLandscapeAnchoredAdaptiveBannerAdSizeWithWidth 横屏
    GADAdSize admobSize = GADCurrentOrientationAnchoredAdaptiveBannerAdSizeWithWidth(CGRectGetWidth(self.view.bounds));
    */
    
    /*
     注意不同平台的横幅广告有一定限制，例如配置的穿山甲横幅广告640*100，为了能填充完屏幕宽，计算高度H = (屏幕宽 *100)/640；那么在load的extra的size为（屏幕宽：H）。
     
     Note that banner ads on different platforms have certain restrictions. For example, the configured CSJ(TT) banner AD is 640*100. In order to fill the screen width, the height H = (screen width *100)/640 is calculated. Then the extra size of the load is (screen width: H).
     */

    NSDictionary *dict = @{
        // 设置请求的广告尺寸大小
        kATAdLoadingExtraBannerAdSizeKey:[NSValue valueWithCGSize:_adSize],
        // 仅Nend平台支持
//        kATAdLoadingExtraBannerSizeAdjustKey:@NO,
//        // 仅Admob平台支持，自适应横幅大小
//        kATAdLoadingExtraAdmobBannerSizeKey:[NSValue valueWithCGSize:admobSize.size],
//        kATAdLoadingExtraAdmobAdSizeFlagsKey:@(admobSize.flags)
    };
    [[RXTopOnATAdManager sharedSDK] loadADWithPlacementID:self.placementID extra:dict];
    [RXTopOnATAdManager sharedSDK].loadingDelegate = self;
    [RXTopOnATAdManager sharedSDK].bannerDelegate = self;
}

// 检查广告缓存，是否iReady
- (void)checkAd {
    // 获取广告位的状态对象
    ATCheckLoadModel *checkLoadModel = [[RXTopOnATAdManager sharedSDK] checkBannerLoadStatusForPlacementID:self.placementID];
    NSLog(@"CheckLoadModel.isLoading:%d--- isReady:%d",checkLoadModel.isLoading,checkLoadModel.isReady);

    // 查询该广告位的所有缓存信息
    NSArray *array = [[RXTopOnATAdManager sharedSDK] getBannerValidAdsForPlacementID:self.placementID];
    NSLog(@"ValidAds.count:%ld--- ValidAds:%@",array.count,array);

    // 判断当前是否存在可展示的广告
    BOOL isReady = [[RXTopOnATAdManager sharedSDK] bannerAdReadyForPlacementID:self.placementID];
    
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
    [[RXTopOnATAdManager sharedSDK] entryBannerScenarioWithPlacementID:self.placementID scene:KTopOnBannerSceneID];
}

- (void)showBanner {
    // 到达场景
    [self entryAdScenario];
    
    // 判断广告ready状态
    if ([[RXTopOnATAdManager sharedSDK] bannerAdReadyForPlacementID:self.placementID]) {
        // 移除可能存在的旧BannerView
        NSInteger tag = 3333;
        [[self.view viewWithTag:tag] removeFromSuperview];
        
        ATBannerView *bannerView = [[RXTopOnATAdManager sharedSDK] retrieveBannerViewForPlacementID:self.placementID scene:KTopOnBannerSceneID];
        if (bannerView != nil) {
//            bannerView.delegate = self;
            bannerView.presentingViewController = self;
            bannerView.translatesAutoresizingMaskIntoConstraints = NO;
            bannerView.tag = tag;
            self.bannerView = bannerView;
           
            self.adView = [[UIView alloc]init];
            self.adView.backgroundColor = randomColor;
            [self.adView addSubview:bannerView];
            [self.adView setFrame:CGRectMake(0, 328, kScreenW, 250)];
            [self.view addSubview:self.adView];
            
            bannerView.frame = CGRectMake(0, 0, _adSize.width, _adSize.height);
            
        } else {
            NSLog(@"BannerView is nil for placementID:%@", self.placementID);
        }
    } else {
        NSLog(@"Banner ad's not ready for placementID:%@", self.placementID);
    }
}

// 移除广告BannerView
- (void)removeAd {
    if (self.adView && self.adView.superview) {
        [self.adView removeFromSuperview];
        self.bannerView = nil;
        self.adView = nil;
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

- (void)bannerView:(ATBannerView *)bannerView didAutoRefreshWithPlacement:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)bannerView:(ATBannerView *)bannerView didClickWithPlacementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)bannerView:(ATBannerView *)bannerView didDeepLinkOrJumpForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra result:(BOOL)success { 
    
}

- (void)bannerView:(ATBannerView *)bannerView didShowAdWithPlacementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)bannerView:(ATBannerView *)bannerView didTapCloseButtonWithPlacementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    // 收到点击关闭按钮回调,需要自行移除bannerView
    [self removeAd];
}

- (void)bannerView:(ATBannerView *)bannerView failedToAutoRefreshWithPlacementID:(NSString *)placementID error:(NSError *)error { 
    
}


@end
