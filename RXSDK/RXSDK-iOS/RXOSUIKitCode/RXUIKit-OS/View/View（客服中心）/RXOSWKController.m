//
//  RXOSWKController.m
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/7/4.
//

#import "RXOSWKController.h"
#import "RXOSServiceBackBtn.h"
#import "RXOSWKWebView.h"
#import "RXOSDragView.h"
#import "RXOSWKController.h"

#define WebViewTag 90000

typedef void(^Complete)(NSDictionary *response, RX_CommonRequestError *error);

@interface RXOSWKController ()

@property (nonatomic, copy) Complete complete;
@property (nonatomic, strong) RXOSUserCenterConfig *config;
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) NSDictionary *loginData;
//@property (nonatomic, strong) RXOSWKWebView *webView;
@property (nonatomic, strong) RXOSDragView *dragView;
@property (nonatomic, assign) NSInteger ori;
@property (nonatomic, assign) BOOL isShowCloseBtn;

@end

@implementation RXOSWKController

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    
    [RXOSUserUtility sharedManager].isShowServiceCenter = YES;
    
    self.ori = RXAC ? 2 : 1;
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(hide) name:RXUINoti_closeWebView1 object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(minimized) name:RXUINoti_minimized object:nil];
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
    
    self.config = [RXOSUserUtility sharedManager].userCenterConfig;
    
    NSString *bgColor = @"#DEF8FD";
    if (!self.config.setLightTheme) {
        bgColor = @"#183C41";
    }
    
    self.isShowCloseBtn = YES;
    
    self.view.backgroundColor = [UIColor colorWithHexString:bgColor];

    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    if (!_webView) {
        __weak __typeof__(self) weakSelf = self;
        _webView = [[RXOSWKWebView alloc] initWithFrame:window.frame];
        _webView.webView.scrollView.scrollEnabled = NO;
        _webView.visibleHUD = YES;
        _webView.needOri = YES;
        _webView.needRefreshToken = YES;
        _webView.userCenterConfig = self.config;
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

        if ([RXOSCommonTool isRTL]) {
            _closeBtn.frame = CGRectMake(CGRectGetMinX(self.view.frame) + (RXAC ? 60 : 25), CGRectGetHeight(self.view.frame) - 100, 75, 75);
        } else {
            _closeBtn.frame = CGRectMake(CGRectGetMaxX(self.view.frame) - 100, CGRectGetHeight(self.view.frame) - 100, 75, 75);
        }
        
    }
    
    if (self.type == ServiceType_center) {
        _webView.naviBar.hidden = YES;
        [_webView showNavi:NO];
    } else if (self.type == ServiceType_chat) {
//        _closeBtn.hidden = YES;
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
//        self.webView.urlStr = @"http://10.10.2.116:4043/static/service/#/welcome";    // 客服
        NSString *theme = @"dark";
        if (self.config.setLightTheme) {
            theme = @"light";
            _webView.naviBar.backgroundColor = [UIColor whiteColor];
        }
        self.webView.urlStr = [NSString stringWithFormat:@"%@static/service/#/welcome?theme=%@", domain, theme];
    } else if (self.type == ServiceType_center) {
//        self.webView.urlStr = @"https://10.10.2.45:8083/static/passport/#/helpcenter/questioncatalogue";  // 客服中心首页
        self.webView.urlStr = [NSString stringWithFormat:@"%@static/passport/#/helpcenter/questioncatalogue-new", domain];
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
    [RXOSUserUtility sharedManager].isShowServiceCenter = NO;
    [RXOSHUD hideWebHUD];
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self dismissViewControllerAnimated:NO completion:nil];
    [self removeFromParentViewController];
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
        CGFloat dragViewX = CGRectGetMaxX(window.frame) - 100;
        if ([RXOSCommonTool isRTL]) {
            dragViewX = CGRectGetMaxX(window.frame) + (RXAC ? 60 : 25);
        } else {
            dragViewX = CGRectGetMaxX(window.frame) - 100;
        }
        
        self.dragView = [[RXOSDragView alloc] initWithFrame:CGRectMake(CGRectGetMaxX(window.frame) - 100, CGRectGetHeight(window.frame) - 100, 75, 75) vc:[UIViewController currentViewController]];
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
//    self.view.hidden = NO;
    [[UIViewController currentViewController] presentViewController:self animated:NO completion:nil];
    self.dragView.hidden = YES;
    self.dragView.redTip.hidden = YES;
}

- (RXOSServiceBackBtn *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [RXOSServiceBackBtn buttonWithType:UIButtonTypeCustom];
        _closeBtn.adjustsImageWhenHighlighted = NO;
        
        UIImage *closeImage = [UIImage rxOSBundleImageNamed:@"rx_service_back"];
        if ([RXOSCommonTool isRTL]) {
            UIImage *flipImage = [UIImage imageWithCGImage:closeImage.CGImage scale:closeImage.scale orientation:UIImageOrientationDown];
            [_closeBtn setImage:flipImage forState:UIControlStateNormal];
        } else {
            [_closeBtn setImage:closeImage forState:UIControlStateNormal];
        }
        
        _closeBtn.layer.cornerRadius = 16;
        _closeBtn.backgroundColor = [UIColor whiteColor];
        [_closeBtn setTitle:[RXLocation osLaunguage:@"返回游戏"] forState:UIControlStateNormal];
        [_closeBtn setTitleColor:[UIColor colorWithHexString:@"161616"] forState:UIControlStateNormal];
        _closeBtn.titleLabel.font = [UIFont systemFontOfSize:14 weight:UIFontWeightMedium];
        [_closeBtn addTarget:self action:@selector(closeBtnAction) forControlEvents:UIControlEventTouchUpInside];
        _closeBtn.hidden = YES;
    }
    return _closeBtn;
}

@end
