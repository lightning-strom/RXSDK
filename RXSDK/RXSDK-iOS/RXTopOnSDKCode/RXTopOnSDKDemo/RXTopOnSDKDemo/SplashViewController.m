//
//  SplashViewController.m
//  RXTopOnSDKDemo
//
//  Created by root11 on 2024/5/29.
//

#import "SplashViewController.h"


@interface SplashViewController ()<RXTopOnATAdLoadingrDelegate,RXTopOnATSplashDelegate>
@property (copy, nonatomic) NSDictionary<NSString *, NSString *> *placementIDs;
@property (copy, nonatomic) NSString *placementID;

@end

@implementation SplashViewController

- (void)dealloc{
    
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.placementID = self.placementIDs[@"AdMob"];
//    self.placementID = self.placementIDs[@"Baidu"];
    
    self.title = @"开屏广告";
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

- (NSDictionary<NSString *,NSString *> *)placementIDs {
    
    return @{
        @"ADX":                   @"b62b419273e429",
        @"All":                   @"b62b40ff8aed6a",
        @"AdMob":                 @"b62e9ee8eb2d0b",
        @"Kuaishou":              @"b62b41922b6663",
        @"GDT":                   @"b62b41ef152d42",
        @"Baidu":                 @"b62b41ef0b0e1b",
        @"CSJ":                   @"b62b41eefa70a8",
        @"Sigmob":                @"b62b41c8d7ac74",
        @"Mintegral":             @"b62b41c7818614",
        @"Cross Promotion":       @"b62b4192b9efaa",
        @"Pangle":                @"b62b41521d52d1",
        @"Klevin":                @"b62b415211bd15",
        @"HeaderBidding":         @"b62b4126caa479",
        @"Bigo":                @"b63909d7b39cac",
        @"vungle":                @"b63a5518f4820c",
    };
}

#pragma mark - Action
- (void)btnClick:(UIButton *)btn {
    if (btn.tag == 100) {
        [self loadSplashAd];
    }else if (btn.tag == 101) {
        [self checkAd];
    }else if (btn.tag == 102) {
        [self showSplashAd];
    }else{
        NSLog(@"其他");
    }
}


- (UIInterfaceOrientation)currentInterfaceOrientation {
    if (@available(iOS 13.0, *)) {
        UIWindow *firstWindow = [[[UIApplication sharedApplication] windows] firstObject];
        if (firstWindow == nil) { return UIInterfaceOrientationUnknown; }
        
        UIWindowScene *windowScene = firstWindow.windowScene;
        if (windowScene == nil){ return UIInterfaceOrientationUnknown; }
        
        return windowScene.interfaceOrientation;
    } else {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
        return UIApplication.sharedApplication.statusBarOrientation;
#pragma clang diagnostic pop
    }
}

// 由于系统的变动，提供两个获取 keyWindow的方法，选择一个适合来
- (UIWindow *)getKeyWindowMethodOne {
    if (@available(iOS 13.0, *)) {
        for (UIWindowScene* windowScene in [UIApplication sharedApplication].connectedScenes) {
            if (windowScene.activationState == UISceneActivationStateForegroundActive)
            {
                for (UIWindow *window in windowScene.windows)
                {
                    if (window.isKeyWindow)
                    {
                        return window;
                    }
                }
            }
        }
    } else {
        // 添加到当前window上，并置顶到最上层
        UIWindow * window = [UIApplication sharedApplication].delegate.window;
        if (window) {
            return window;
        }
        return [UIApplication sharedApplication].keyWindow;
    }
    return nil;
}

- (UIWindow *)getKeyWindowMethodTwo {
    if ( @available(iOS 13.0, *) ) {
        UIWindow *mainWindow = [UIApplication sharedApplication].windows.firstObject;
        [mainWindow makeKeyWindow];
        return mainWindow;
    } else {
        UIWindow *mainWindow = [UIApplication sharedApplication].keyWindow;
        return mainWindow;
    }
}

// 加载广告
- (void)loadSplashAd {
    UIInterfaceOrientation deviceOrientaion = [self currentInterfaceOrientation];
    BOOL landscape = UIInterfaceOrientationIsLandscape(deviceOrientaion);
    
    // 开屏广告底部自定义的containerView
    UILabel *label = nil;
    label = [[UILabel alloc] initWithFrame:CGRectMake(.0f, .0f, landscape ? 120 : UIScreen.mainScreen.bounds.size.width, landscape ? UIScreen.mainScreen.bounds.size.height : 100.0f)];
    label.text = @"Container";
    label.textColor = [UIColor redColor];
    label.backgroundColor = [UIColor whiteColor];
    label.textAlignment = NSTextAlignmentCenter;
    
    NSMutableDictionary *mutableDict = [NSMutableDictionary dictionary];
    // 设置开屏广告中支持广告源设置加载超时时间，并不是整个广告位请求的时间
    [mutableDict setValue:@5.5 forKey:kATSplashExtraTolerateTimeoutKey];
    
    [[RXTopOnATAdManager sharedSDK] loadADWithPlacementID:self.placementID
                                                 extra:mutableDict
                                         containerView:label];
    [RXTopOnATAdManager sharedSDK].loadingDelegate = self;
    [RXTopOnATAdManager sharedSDK].splashDelegate = self;
    
    // 从你们的TopOn后台导出的兜底广告源进行设置
    //导出格式如：{\"unit_id\":1331013,\"nw_firm_id\":22,\"adapter_class\":\"ATBaiduSplashAdapter\",\"content\":\"{\\\"button_type\\\":\\\"0\\\",\\\"ad_place_id\\\":\\\"7852632\\\",\\\"app_id\\\":\\\"e232e8e6\\\"}\"}
    // [[ATAdManager sharedManager] loadADWithPlacementID:self.placementID extra:extra delegate:self containerView:label defaultAdSourceConfig:self.defaultAdSourceConfigStr];
}

// 检查广告缓存，是否iReady
- (void)checkAd {
    // 获取广告位的状态对象
    ATCheckLoadModel *checkLoadModel = [[RXTopOnATAdManager sharedSDK] checkSplashLoadStatusForPlacementID:self.placementID];
    NSLog(@"CheckLoadModel.isLoading:%d--- isReady:%d",checkLoadModel.isLoading,checkLoadModel.isReady);

    // 查询该广告位的所有缓存信息
    NSArray *caches = [[RXTopOnATAdManager sharedSDK] getSplashValidAdsForPlacementID:self.placementID];
    NSLog(@"ValidAds.count:%ld--- ValidAds:%@",caches.count,caches);

    // 判断当前是否存在可展示的广告
    BOOL ready = [[RXTopOnATAdManager sharedSDK] splashReadyForPlacementID:self.placementID];
    
    if (ready) {
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
    [[RXTopOnATAdManager sharedSDK] entrySplashScenarioWithPlacementID:self.placementID scene:KTopOnSplashSceneID];
}

// show展示开屏广告
- (void)showSplashAd {
    // 到达场景
    [self entryAdScenario];

    if ([[RXTopOnATAdManager sharedSDK] splashReadyForPlacementID:self.placementID]) {
        // 根据实际情况选择获取到的keyWindow的方法 getKeyWindowMethodOne 和 getKeyWindowMethodTwo
        UIWindow *mainWindow = [self getKeyWindowMethodOne];
        // 自定义跳过按钮，注意需要在广告倒计时 splashCountdownTime: 回调中实现按钮文本的变化处理
    //    self.skipButton = [UIButton buttonWithType:UIButtonTypeCustom];
    //    self.skipButton.backgroundColor = [[UIColor whiteColor] colorWithAlphaComponent:0.3];
    //    self.skipButton.frame = CGRectMake([UIScreen mainScreen].bounds.size.width - 80 - 20, 50, 80, 21);
    //    self.skipButton.layer.cornerRadius = 10.5;
    //    self.skipButton.titleLabel.font = [UIFont systemFontOfSize:14];
        
        NSMutableDictionary *mutableDict = [NSMutableDictionary dictionary];
        
        /* 多数平台已经不支持自定义跳过按钮，目前支持更改自定义跳过按钮有穿山甲(TT)，直投、ADX、原生作开屏和游可盈，具体需要运行看实际效果
        // 自定义跳过按钮倒计时时长，毫秒单位
        [mutableDict setValue:@50000 forKey:kATSplashExtraCountdownKey];
        // 自定义跳过按钮
        [mutableDict setValue:self.skipButton forKey:kATSplashExtraCustomSkipButtonKey];
        // 自定义跳过按钮倒计时回调间隔
        [mutableDict setValue:@500 forKey:kATSplashExtraCountdownIntervalKey];
        */
        [[RXTopOnATAdManager sharedSDK] showSplashWithPlacementID:self.placementID scene:KTopOnSplashSceneID window:mainWindow inViewController:self extra:mutableDict];
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

- (void)didFinishLoadingSplashADWithPlacementID:(NSString *)placementID isTimeout:(BOOL)isTimeout { 
    
}

- (void)didTimeoutLoadingSplashADWithPlacementID:(NSString *)placementID { 
    
}

- (void)splashCountdownTime:(NSInteger)countdown forPlacementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)splashDeepLinkOrJumpForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra result:(BOOL)success { 
    
}

- (void)splashDetailDidClosedForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)splashDidClickForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)splashDidCloseForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)splashDidShowFailedForPlacementID:(NSString *)placementID error:(NSError *)error extra:(NSDictionary *)extra { 
    
}

- (void)splashDidShowForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)splashZoomOutViewDidClickForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

- (void)splashZoomOutViewDidCloseForPlacementID:(NSString *)placementID extra:(NSDictionary *)extra { 
    
}

@end
