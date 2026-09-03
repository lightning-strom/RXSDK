//
//  RXWKController.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/7/4.
//

#import "RXWKController.h"
#import "RXServiceBackBtn.h"
#import "RXWKWebView.h"
#import "RXDragView.h"
#import "RXWKController.h"

#define WebViewTag 90000

typedef void(^Complete)(NSDictionary *response, RX_CommonRequestError *error);

@interface RXWKController ()

@property (nonatomic, copy) Complete complete;
@property (nonatomic, strong) RXUserCenterConfig *config;
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) NSDictionary *loginData;
//@property (nonatomic, strong) RXOSWKWebView *webView;
@property (nonatomic, strong) RXDragView *dragView;
@property (nonatomic, assign) NSInteger ori;
@property (nonatomic, assign) BOOL isShowCloseBtn;

@end

@implementation RXWKController

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    
    [RXUIUserUtility sharedManager].isShowServiceCenter = YES;
    
    self.ori = RXAC ? 2 : 1;
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(hide) name:RXUINoti_closeWebView1 object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(minimized) name:RXUINoti_minimized object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(showView) name:RXUINoti_maxmized object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(setCloseVisible:) name:RXUINoti_userCenterClose object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDeviceOrientationDidChange)
                                                 name:UIDeviceOrientationDidChangeNotification
                                               object:nil];
}

- (BOOL)onDeviceOrientationDidChange{
    //获取当前设备Device
    UIDevice *device = [UIDevice currentDevice];
    //识别当前设备的旋转方向
    switch (device.orientation) {
        case UIDeviceOrientationLandscapeLeft:
            NSLog(@"屏幕向左橫置");
//            self.orientation = 2;
            if (self.ori == 2) {
                
            } else {
                self.ori = 2;
                [self layoutViews];
            }
            break;

        case UIDeviceOrientationLandscapeRight:
            NSLog(@"屏幕向右橫置");
//            self.orientation = 2;
            if (self.ori == 2) {
                
            } else {
                self.ori = 2;
                [self layoutViews];
            }
            break;

        case UIDeviceOrientationPortrait:
            NSLog(@"屏幕直立");
//            self.orientation = 1;
            if (self.ori == 1) {
                
            } else {
                self.ori = 1;
                [self layoutViews];
            }
            break;

        case UIDeviceOrientationPortraitUpsideDown:
            NSLog(@"屏幕直立，上下顛倒");
//            self.orientation = 1;
//            [self layoutViews];
            break;

        default:
            NSLog(@"无法识别");
            break;
    }
    return YES;
}

- (void)layoutViews
{
    if (!_config.orientationVisible) return;
    
    UIView *window = [UIApplication sharedApplication].keyWindow;
    _webView.frame = CGRectMake(0, 0, window.frame.size.height, window.frame.size.width);
    
    [_webView layoutViews];
    if (kRXIphoneX) {
        _closeBtn.frame = CGRectMake(CGRectGetMaxY(self.view.frame) - 100, CGRectGetWidth(self.view.frame) - 100, 75, 75);
    } else {
        _closeBtn.frame = CGRectMake(CGRectGetMaxY(_webView.frame) - 100, CGRectGetWidth(_webView.frame) - 100, 75, 75);
    }
    [self.view layoutSubviews];
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    self.config = [RXUIUserUtility sharedManager].userCenterConfig;
    
    NSString *bgColor = @"#DEF8FD";
    if (!self.config.setLightTheme) {
        bgColor = @"#183C41";
    }
    
    self.isShowCloseBtn = YES;
    
    self.view.backgroundColor = [UIColor colorWithHexString:bgColor];
    
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    if (!_webView) {
        __weak __typeof__(self) weakSelf = self;
        _webView = [[RXWKWebView alloc] initWithFrame:window.frame];
        _webView.isService = YES;
        _webView.userCenterConfig = self.config;
        _webView.needRefreshToken = YES;
        _webView.needOri = YES;
        _webView.visibleHUD = YES;
        _webView.backgroundColor = [UIColor clearColor];
        _webView.webView.backgroundColor = [UIColor clearColor];
        _webView.tag = WebViewTag;
        _webView.complete = ^(NSDictionary * _Nonnull response) {
            if (weakSelf.complete) {
                weakSelf.complete(response, nil);
            }
        };
        _webView.close = ^{
            [weakSelf hide];
        };
        [self.view addSubview:self.webView];
       
        [self.view addSubview:self.closeBtn];

        _closeBtn.frame = CGRectMake(CGRectGetMaxX(self.view.frame) - 100, CGRectGetHeight(self.view.frame) - 100, 75, 75);
    }
    
    if (self.type == ServiceType_center) {
        _webView.naviBar.hidden = YES;
        [_webView showNavi:NO];
    } else if (self.type == ServiceType_chat) {
        self.closeBtn.hidden = YES;
        _webView.naviBar.hidden = NO;
        [_webView showNavi:YES];
        _webView.titleLbl.text = @"客服";
        _webView.titleLbl.textColor = [UIColor whiteColor];
        _webView.closeBtn.hidden = YES;
        _webView.line.hidden = YES;
        _webView.naviBar.backgroundColor = [UIColor colorWithHexString:@"#2E354B"];
    } else {
        _webView.naviBar.hidden = YES;
        [_webView showNavi:NO];
    }
    
    [self loadWebView];
}

- (void)loadWebView
{
    NSString *domain = [[RXService sharedSDK] getFirstBaseUrl];
    if (![[domain substringWithRange:NSMakeRange(domain.length - 1, 1)] isEqualToString:@"/"]) {
        domain = [NSString stringWithFormat:@"%@/", domain];
    }
//    self.webView.urlStr = [NSString stringWithFormat:@"%@static/passport/#/userCenter", domain];
    if (self.type == ServiceType_chat) {
//        self.webView.urlStr = @"http://10.10.2.116:4043/static/service/";    // 客服
        NSString *theme = @"dark";
        if (self.config.setLightTheme) {
            theme = @"light";
            _webView.naviBar.backgroundColor = [UIColor whiteColor];
        }
//        self.webView.urlStr = [NSString stringWithFormat:@"%@static/service/#/welcome?theme=%@", domain, theme];
        
        NSString *getToken = [NSString stringWithFormat:@"%@", [[NSUserDefaults standardUserDefaults] valueForKey:@"rx_access"]];
        NSString *domain = [[RXService sharedSDK] getFirstBaseUrl];
        if (![[domain substringWithRange:NSMakeRange(domain.length - 1, 1)] isEqualToString:@"/"]) {
            domain = [NSString stringWithFormat:@"%@/", domain];
        }
        
        NSString *url = [NSString stringWithFormat: @"%@static/service#/welcome?theme=%@ruixue-accesstoken=%@&ruixue-channelid=%@&ruixue-cpid=%@&ruixue-productid=%@", domain, theme, getToken, [RXUIUserUtility sharedManager].channelId, [RXUIUserUtility sharedManager].cpid, [RXUIUserUtility sharedManager].productId];
        
//        NSString *url = [NSString stringWithFormat: @"http://10.10.2.131:4043/static/service#/welcome?ruixue-accesstoken=%@&ruixue-channelid=%@&ruixue-cpid=%@&ruixue-productid=%@", getToken, [RXUIUserUtility sharedManager].channelId, [RXUIUserUtility sharedManager].cpid, [RXUIUserUtility sharedManager].productId];
        
        RXUserCenterConfig *config = [RXUIUserUtility sharedManager].userCenterConfig;
        if (config.transmit_args && config.transmit_args.length > 0) {
            url = [NSString stringWithFormat:@"%@&param_ui=%@", url, config.transmit_args];
        }
        if (config.game_user_id && config.game_user_id.length > 0) {
            url = [NSString stringWithFormat:@"%@&game_user_id=%@", url, config.game_user_id];
        }
        if (config.nickname && config.nickname.length > 0) {
            url = [NSString stringWithFormat:@"%@&nickname=%@", url, config.nickname];
        } else {
            NSDictionary *loginData = [RXUIUserUtility sharedManager].loginData;
            url = [NSString stringWithFormat:@"%@&nickname=%@", url, loginData[@"nickname"]];
        }
        if (config.head_img_url && config.head_img_url.length > 0) {
            url = [NSString stringWithFormat:@"%@&head_img_url=%@", url, config.head_img_url];
        }
        if (config.queue_name && config.queue_name.length > 0) {
            url = [NSString stringWithFormat:@"%@&queue_name=%@", url, config.queue_name];
        }
        
        self.webView.urlStr = url;
        
    } else if (self.type == ServiceType_center) {
//        self.webView.urlStr = @"https://10.10.3.219:8083/static/passport/#/helpcenter/questioncatalogue";  // 帮助中心
//        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(6 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
//            self.webView.urlStr = [NSString stringWithFormat:@"%@static/passport/#/helpcenter/questioncatalogue-new", domain];
//        });
        self.webView.urlStr = [NSString stringWithFormat:@"%@static/passport/#/helpcenter/questioncatalogue-new", domain];
        
//        self.webView.urlStr = [NSString stringWithFormat:@"https://ddddd", domain];
    } else {
        self.webView.urlStr = self.url;
    }
    
    // 5 秒后页面没加载完成显示返回按钮
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        if (self.isShowCloseBtn) {
            self.closeBtn.hidden = NO;
        }
    });
}

- (void)hide
{
    [RXUIUserUtility sharedManager].isShowServiceCenter = NO;
    [RXHUD hideWebHUD];
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self dismissViewControllerAnimated:NO completion:nil];
    [self removeFromParentViewController];
    
    dispatch_async(dispatch_get_global_queue(0, 0), ^{

    });
}

- (void)closeBtnAction
{
    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
    
    NSString *errorMsg = [RXErrorTool getRXErrorMsg:RXLimitError_closeView];
    err.responesObject = @{@"msg" : errorMsg,
                           @"code" : @(RXLimitError_closeView)
    };
    
    if (self.complete) {
        self.complete(nil, err);
    }
    [self hide];
}

#pragma mark -- <notiActions>
- (void)setCloseVisible:(NSNotification *)noti
{
    NSDictionary *dic = noti.userInfo;
    BOOL isHide = [dic[@"isShowClose"] boolValue];
    self.isShowCloseBtn = isHide;
    self.closeBtn.hidden = !isHide;
}

- (void)minimized
{
    [self dismissViewControllerAnimated:NO completion:nil];
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    
    if (!self.dragView) {
        self.dragView = [[RXDragView alloc] initWithFrame:CGRectMake(CGRectGetMaxX(window.frame) - 100, CGRectGetHeight(window.frame) - 100, 75, 75) vc:[UIViewController currentViewController]];
        __weak __typeof__(self) weakSelf = self;
        [self.dragView setActionBlock:^{
//            weakSelf.hidden = NO;
//            weakSelf.dragView.hidden = YES;
//            weakSelf.dragView.redTip.hidden = YES;
            [weakSelf showView];
        }];
        [[UIApplication sharedApplication].keyWindow addSubview:self.dragView];
    } else {
        self.dragView.hidden = NO;
    }
}

// 最大化
- (void)showView
{
    if (!self.dragView.hidden) {
        [[UIViewController currentViewController] presentViewController:self animated:NO completion:nil];
        self.dragView.hidden = YES;
        self.dragView.redTip.hidden = YES;
    }
}

- (RXServiceBackBtn *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [RXServiceBackBtn buttonWithType:UIButtonTypeCustom];
        _closeBtn.adjustsImageWhenHighlighted = NO;
        [_closeBtn setImage:[UIImage rxBundleImageNamed:@"rx_service_back"] forState:UIControlStateNormal];
        _closeBtn.layer.cornerRadius = 16;
        _closeBtn.backgroundColor = [UIColor whiteColor];
        [_closeBtn setTitle:@"返回游戏" forState:UIControlStateNormal];
        [_closeBtn setTitleColor:[UIColor colorWithHexString:@"161616"] forState:UIControlStateNormal];
        _closeBtn.titleLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightMedium];
        [_closeBtn addTarget:self action:@selector(closeBtnAction) forControlEvents:UIControlEventTouchUpInside];
        _closeBtn.hidden = YES;
    }
    return _closeBtn;
}

@end

