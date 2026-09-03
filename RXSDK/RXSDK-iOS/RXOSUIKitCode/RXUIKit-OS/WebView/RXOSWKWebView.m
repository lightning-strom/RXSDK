//
//  RXOSWKWebView.m
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/16.
//

#import "RXOSWKWebView.h"
#import "RXOSCommonTool.h"
#import "RXOSCommonHeader.h"
#import "RXOSWebViewManager.h"
#import "RXOSWebLoadingView.h"
#import <RXSDK_Pure/RX_CommonNetworkExcuteManager.h>

@interface RXOSWKWebView () <WKNavigationDelegate, WKUIDelegate>

@property (nonatomic, strong) UIImageView *logoImageView;
@property (nonatomic, strong) RXOSWebLoadingView *loadingView;
@property (nonatomic, strong) NSString *loginData;
@property (nonatomic, strong) NSString *jsJsonStr;

@end

@implementation RXOSWKWebView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
//        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        [self setUI];
        [self loadRequest];
        
        [self show];
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(isShowClose:) name:RXUINoti_resetPwd object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(setCloseVisible:) name:RXUINoti_userCenterClose object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(isShowBack:) name:RXUINoti_userCenterBack object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(closeWebView:) name:RXUINoti_closeWebView object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(setNaviBarVisible:) name:RXUINoti_setNaviBarVisible object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(setNaviTitle:) name:RXUINoti_setTitle object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(syncInfo:) name:RXUINoti_syncInfo object:nil];
    }
    return self;
}

- (void)show
{
    [UIView animateWithDuration:0.1 animations:^{
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        
//        [RXOSCommonTool showWithAnimate:self];
        
        [self layoutSubviews];
    }];
}

- (void)hide
{
    if (self.close) {
        self.close();
    }
    
    [RXOSHUD hideWebHUD];
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
}

#pragma mark -- <notiActions>
- (void)syncInfo:(NSNotification *)noti
{
    NSMutableDictionary *loginDic = [NSMutableDictionary dictionaryWithDictionary:[RXOSUserUtility sharedManager].loginData];
    if (!loginDic || loginDic.allKeys.count <= 0) {
        loginDic = [NSMutableDictionary dictionaryWithDictionary:[RXOSUserUtility sharedManager].apiLoginData];
    }
    if (!loginDic || loginDic.allKeys.count <= 0) {
        NSDictionary *loginData = [[NSUserDefaults standardUserDefaults] valueForKey:keyUser_loginData];
        loginDic = loginData[@"loginData"][@"data"];
    }
    
    [RXOSUserUtility sharedManager].loginData = loginDic;
    
    NSString *jsonStr2 = [RXOSCommonTool getJsonString:loginDic];
    jsonStr2 = [jsonStr2 stringByReplacingOccurrencesOfString:@"\n" withString:@""];
    NSString *baseInfoJs2 = [NSString stringWithFormat:@"%@", jsonStr2];
    
    self.loginData = baseInfoJs2;
}

- (void)setNaviTitle:(NSNotification *)noti
{
    NSDictionary *dic = noti.userInfo;
    NSString *title = dic[@"title"];
    
    self.titleLbl.text = title;
}

- (void)setCloseVisible:(NSNotification *)noti
{
    NSDictionary *dic = noti.userInfo;
    BOOL isShowClose = [dic[@"isShowClose"] boolValue];
    
    if (!isShowClose) {
        self.closeBtn.hidden = YES;
    } else {
        self.closeBtn.hidden = NO;
    }
}

- (void)setNaviBarVisible:(NSNotification *)noti
{
    NSDictionary *dic = noti.userInfo;
    BOOL isShowNaviBar = [dic[@"isShowNaviBar"] boolValue];
    
    if (!isShowNaviBar) {
        [self showNavi:NO];
    } else {
        [self showNavi:YES];
    }
}

- (void)isShowClose:(NSNotification *)noti
{
    NSDictionary *dic = noti.userInfo;
    BOOL isShowClose = [dic[@"isShowClose"] boolValue];
    
    if (!isShowClose) {
        self.closeBtn.hidden = YES;
    } else {
        self.closeBtn.hidden = NO;
    }
}

- (void)isShowBack:(NSNotification *)noti
{
    NSDictionary *dic = noti.userInfo;
    BOOL isShowClose = [dic[@"isShowBack"] boolValue];
    
    if (!isShowClose) {
        self.backBtn.hidden = YES;
    } else {
        self.backBtn.hidden = NO;
    }
}

- (void)closeWebView:(NSNotification *)noti
{
    NSDictionary *dic = noti.userInfo;
    NSString *viewTag = dic[@"viewTag"];
    
    if (viewTag.length > 0) {
        if (viewTag == self.viewTag) {
            [self hide];
        }
    } else {
        if (self.tag != 90000) {
            [self hide];
        }
    }
}

- (void)setNeedOri:(BOOL)needOri
{
    if (kRXIphoneX) {
        _needOri = needOri;
    }
    if (needOri) {
        _webView.backgroundColor = [UIColor colorWithHexString:@"181E2F"];
    } else {
        _webView.backgroundColor = [UIColor whiteColor];
    }
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self addSubview:self.webView];
    [self addSubview:self.naviBar];
    [self.naviBar addSubview:self.logoImageView];
    [self.naviBar addSubview:self.titleLbl];
    [self.naviBar addSubview:self.backBtn];
    [self.naviBar addSubview:self.closeBtn];
    [self.naviBar addSubview:self.line];
    
//    UIWindow *window = [UIApplication sharedApplication].keyWindow;
//    
//    _naviBar.frame = CGRectMake(0, 0, window.frame.size.width, RXAC ? 44 : kRXNavigationAndStatusHeight);
//    
//    _webView.frame = CGRectMake(0, CGRectGetMaxY(_naviBar.frame), window.frame.size.width, window.frame.size.height - _naviBar.frame.size.height);
//    
//    if (@available(iOS 11.0, *)) {
//        _webView.scrollView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
//    } else {
//        // Fallback on earlier versions
//    }
//    
////    _logoImageView.frame = CGRectMake(CGRectGetWidth(_naviBar.frame) / 2 - 100 / 2, RXAC ? 11 : kRXStatusBarHeight + 7, 100, 24);
////    _logoImageView.center = _naviBar.center;
//    _titleLbl.frame = CGRectMake(0, RXAC ? 0 : kRXStatusBarHeight, CGRectGetWidth(_naviBar.frame), RXAC ? 44 : 44);
//    
//    _line.frame = CGRectMake(0, CGRectGetMaxY(_titleLbl.frame), CGRectGetWidth(_naviBar.frame), 1);
//    
//    _backBtn.frame = CGRectMake(RXAC ? 27 : 22, RXAC ? 8 : kRXStatusBarHeight + 2, 28, 28);
//    
//    _closeBtn.frame = CGRectMake(CGRectGetWidth(_naviBar.frame) - (RXAC ? 59 : 54), RXAC ? 8 : kRXStatusBarHeight + 2, 28, 28);
//    
//    if ([ISPAD isEqualToString:@"iPad"]) {
//        _naviBar.frame = CGRectMake(0, 0, window.frame.size.width, 57);
////        _logoImageView.frame = CGRectMake(CGRectGetWidth(_naviBar.frame) / 2 - 100 / 2, CGRectGetHeight(_naviBar.frame) / 2 - 12, 100, 24);
//    //    _logoImageView.center = _naviBar.center;
//        
//        _backBtn.frame = CGRectMake(RXAC ? 29 : 25, CGRectGetHeight(_naviBar.frame) / 2 - 8, 28, 28);
//        
//        _closeBtn.frame = CGRectMake(CGRectGetWidth(_naviBar.frame) - 52, CGRectGetHeight(_naviBar.frame) / 2 - 8, 28, 28);
//    }
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    NSLog(@"%f %f", window.frame.size.width, window.frame.size.height);
    
    _naviBar.frame = CGRectMake(0, 0, window.frame.size.width, RXAC ? 44 : kRXNavigationAndStatusHeight + 4);
    NSLog(@"bool%@", RXAC ? @"YES" : @"NO");
    CGFloat naviY = CGRectGetMaxY(_naviBar.frame);
    CGFloat naviH = _naviBar.frame.size.height;
    if (_naviBar.hidden) {
        naviY = 0;
        naviH = 0;
    }
    
    if (self.needOri) {
        _webView.frame = CGRectMake(0, naviY, window.frame.size.height, window.frame.size.width - naviH);
    } else {
        _webView.frame = CGRectMake(0, naviY, window.frame.size.width, window.frame.size.height - naviH);
    }
    
    if (@available(iOS 11.0, *)) {
        _webView.scrollView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
    } else {
        // Fallback on earlier versions
    }
    
//    _logoImageView.frame = CGRectMake(CGRectGetWidth(_naviBar.frame) / 2 - 100 / 2, RXAC ? 11 : kRXStatusBarHeight + 7, 100, 24);
//    _logoImageView.center = _naviBar.center;
    _titleLbl.frame = CGRectMake(0, RXAC ? 0 : kRXStatusBarHeight, CGRectGetWidth(_naviBar.frame), RXAC ? 44 : 44);
    
    _line.frame = CGRectMake(0, CGRectGetMaxY(_titleLbl.frame), CGRectGetWidth(_naviBar.frame), 1);
    
    if ([RXOSCommonTool isRTL]) {
        _backBtn.frame = CGRectMake(CGRectGetWidth(_naviBar.frame) - (RXAC ? 59 : 54), RXAC ? 8 : kRXStatusBarHeight + 2, 28, 28);
        
        _closeBtn.frame = CGRectMake(RXAC ? 27 : 22, RXAC ? 8 : kRXStatusBarHeight + 2, 28, 28);
    } else {
        _backBtn.frame = CGRectMake(RXAC ? 27 : 22, RXAC ? 8 : kRXStatusBarHeight + 2, 28, 28);
        
        _closeBtn.frame = CGRectMake(CGRectGetWidth(_naviBar.frame) - (RXAC ? 59 : 54), RXAC ? 8 : kRXStatusBarHeight + 2, 28, 28);
    }
    
    if ([ISPAD isEqualToString:@"iPad"]) {
        _naviBar.frame = CGRectMake(0, 0, window.frame.size.width, 57);
        _logoImageView.frame = CGRectMake(CGRectGetWidth(_naviBar.frame) / 2 - 100 / 2, CGRectGetHeight(_naviBar.frame) / 2 - 12, 100, 24);
    //    _logoImageView.center = _naviBar.center;
        
        if ([RXOSCommonTool isRTL]) {
            _backBtn.frame = CGRectMake(CGRectGetWidth(_naviBar.frame) - 52, CGRectGetHeight(_naviBar.frame) / 2 - 8, 28, 28);
            
            _closeBtn.frame = CGRectMake(RXAC ? 29 : 25, CGRectGetHeight(_naviBar.frame) / 2 - 8, 28, 28);
        } else {
            _backBtn.frame = CGRectMake(RXAC ? 29 : 25, CGRectGetHeight(_naviBar.frame) / 2 - 8, 28, 28);
            
            _closeBtn.frame = CGRectMake(CGRectGetWidth(_naviBar.frame) - 52, CGRectGetHeight(_naviBar.frame) / 2 - 8, 28, 28);
        }
    }
    
    [self layoutSubviews];
}

- (void)loadRequest{
    NSString *encodeRequest = [self.urlStr stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet characterSetWithCharactersInString:@"!@$^%*+,;'\"`<>()[]{}\\| "].invertedSet];

    NSURL *url = [NSURL URLWithString:encodeRequest];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url
                                                           cachePolicy:NSURLRequestReloadIgnoringLocalCacheData
                                                       timeoutInterval:40.0];
    [self.webView loadRequest:request];
    
//    NSString *filePath = [[NSBundle mainBundle] pathForResource:@"captcha" ofType:@"html"];
//    NSString *htmlString = [NSString stringWithContentsOfFile:filePath encoding:NSUTF8StringEncoding error:nil];
//    NSURL *url = [[NSURL alloc] initWithString:filePath];
//    [self.webView loadHTMLString:htmlString baseURL:url];
//    [self.webView setJavascriptCloseWindowListener:^{
//        NSLog(@"window.close called");
//    } ];
}

- (void)showNavi:(BOOL)show
{
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    if (show) {
        _naviBar.frame = CGRectMake(0, 0, window.frame.size.width, RXAC ? 44 : kRXNavigationAndStatusHeight);
        _naviBar.hidden = NO;
        
        _webView.frame = CGRectMake(0, CGRectGetMaxY(_naviBar.frame), window.frame.size.width, window.frame.size.height - _naviBar.frame.size.height);
        
//        _loadingView = [[RXOSWebLoadingView alloc] initWithFrame:CGRectMake(0, CGRectGetMaxY(_naviBar.frame), CGRectGetWidth(window.frame), CGRectGetHeight(window.frame) - CGRectGetHeight(_naviBar.frame))];
        
    } else {
        _naviBar.frame = CGRectMake(0, 0, 0, 0);
        _naviBar.hidden = YES;
        
        if (self.isUserCenter) {
            _webView.frame = CGRectMake(0, CGRectGetMaxY(_naviBar.frame), _webView.frame.size.width, _webView.frame.size.height);
        } else {
            _webView.frame = CGRectMake(0, CGRectGetMaxY(_naviBar.frame), window.frame.size.width, window.frame.size.height);
        }
        
        
//        _loadingView = [[RXOSWebLoadingView alloc] initWithFrame:CGRectMake(0, CGRectGetMaxY(_naviBar.frame), CGRectGetWidth(window.frame), CGRectGetHeight(window.frame) - CGRectGetHeight(_naviBar.frame))];
    }
    
    if (!_loadingView) {
        _loadingView = [[RXOSWebLoadingView alloc] initWithFrame:CGRectMake(0, CGRectGetMaxY(_naviBar.frame), CGRectGetWidth(window.frame), CGRectGetHeight(window.frame) - CGRectGetHeight(_naviBar.frame))];
//        _loadingView.backgroundColor = [UIColor colorWithHexString:@"2E354B"];
        
        RXOSUserCenterConfig *config = [RXOSUserUtility sharedManager].userCenterConfig;
        
        NSString *bgColor = @"#DEF8FD";
        if (!config.setLightTheme) {
            bgColor = @"#183C41";
        }
        
        _loadingView.backgroundColor = [UIColor colorWithHexString:bgColor];

        [self addSubview:_loadingView];
    }
    
    if (!_visibleHUD) {
        _loadingView.hidden = YES;
    }
}
- (void)setUrlStr:(NSString *)urlStr
{
    _urlStr = urlStr;
    
    if (!self.needRefreshToken) {
        [self registJSFunction];
        [self regisOCToJS];
        [self setCookie];
        [self loadRequest];
        
        return;
    }
    
    [RXOSCommonTool refreshToken:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if (!error) {
            [self registJSFunction];
            [self regisOCToJS];
            [self setCookie];
            [self loadRequest];
        } else {
//            NSDictionary *errorDic = (NSDictionary *)error.responesObject;
//            NSInteger code = [errorDic[@"code"] integerValue];
//            if (code == -1) {
                [self registJSFunction];
                [self regisOCToJS];
                [self setCookie];
                [self loadRequest];
//            } else {
//                NSString *msg = errorDic[@"msg"];
//                [RXOSHUD showErrorText:msg];
//            }
        }
    }];
}

- (void)refreshWebView
{
    [self setCookie];
    [self.webView reload];
}

#pragma mark - 创建桥接
// js调用oc
- (void)registJSFunction
{
    // 打开webView
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"openWebView"];
    
    // 打开webView controller
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"openWebViewController"];
    
    // 打开safari
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"openSystemWebView"];
    
    // 获取初始化及登录数据
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"getInitParams"];
    
    // 通用回调
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"invokeNativeCallback"];
    
    // 重新登录
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"logBackIn"];
    
    // 点击客服
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"openChatService"];
    
    // 控制关闭按钮
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"setCloseVisible"];
    
    // 控制返回按钮
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"setBackVisible"];
    
    // 忘记密码成功
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"resetpwdSuccess"];
    
    // 最小化
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"minimized"];
    
    // 关闭webView
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"closeWebView"];
    
    // 关闭webView controller
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"closeWebViewController"];
    
    // 展示红点
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"showTip"];
    
    // 隐藏原生头
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"setNaviBarVisible"];
    
    // 获取数据
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"getNativeInitParams"];
    
    // 同步用户信息
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"syncInfo"];
    
    // 设置标题
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"setTitle"];
    
    // 刷新token
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"refreshAccessToken"];
    
    // 上报反馈日志
    [self.webView.configuration.userContentController addScriptMessageHandler:self name:@"reportUserLog"];
}

// oc调用js
- (void)regisOCToJS
{
//    [self.webView evaluateJavaScript: @"OCCallJSMethod('jsonString')"
//               completionHandler:^(id response, NSError * error) {
//            NSLog(@"response: %@, \nerror: %@", response, error);
//     }];
}

- (void)setCookie
{
    RXOSUILoginConfig *config = [RXOSUserUtility sharedManager].loginConfig;
    NSString *setLanguage = [[NSUserDefaults standardUserDefaults] valueForKey:keyUser_setLanguage];
    if (setLanguage && setLanguage.length > 0) {
        config.language_default = setLanguage;
    }
    
    NSMutableDictionary *baseInfo = [NSMutableDictionary dictionary];
    [baseInfo setValue:[RXOSUserUtility sharedManager].cpid forKey:@"cpid"];
    [baseInfo setValue:[RXOSUserUtility sharedManager].productId forKey:@"productid"];
    [baseInfo setValue:[RXOSUserUtility sharedManager].channelId forKey:@"channelid"];
    [baseInfo setValue:[[RXService sharedSDK] getFirstBaseUrl] forKey:@"domain"];
    [baseInfo setValue:[[RXApiService sharedSDK] getDeviceIDInKeychain] forKey:@"devicecode"];
    [baseInfo setValue:[[RXApiService sharedSDK] getTimeZoneOffset] forKey:@"tzoffset"];
    [baseInfo setValue:config.language_default forKey:@"language"];
    [baseInfo setValue:[RXOSCommonTool getCountryCode] forKey:@"country_code"];
    [baseInfo setValue:[[RXPrivateService sharedSDK] getRequestArea] forKey:@"area"];
    [baseInfo setValue:sdkVersion forKey:@"version"];

    NSString *jsonStr1 = [RXOSCommonTool getJsonString:baseInfo];
    jsonStr1 = [jsonStr1 stringByReplacingOccurrencesOfString:@"\n" withString:@""];
    NSString *baseInfoJs1 = [NSString stringWithFormat:@"%@", jsonStr1];

    NSMutableDictionary *loginDic = [NSMutableDictionary dictionaryWithDictionary:[RXOSUserUtility sharedManager].loginData];
    if (!loginDic || loginDic.allKeys.count <= 0) {
        loginDic = [NSMutableDictionary dictionaryWithDictionary:[RXOSUserUtility sharedManager].apiLoginData];
    }
    if (!loginDic || loginDic.allKeys.count <= 0) {
        NSDictionary *loginData = [[NSUserDefaults standardUserDefaults] valueForKey:keyUser_loginData];
        loginDic = loginData[@"loginData"][@"data"];
    }
    
    [RXOSUserUtility sharedManager].loginData = loginDic;
    
    NSString *jsonStr2 = [RXOSCommonTool getJsonString:loginDic];
    jsonStr2 = [jsonStr2 stringByReplacingOccurrencesOfString:@"\n" withString:@""];
    NSString *baseInfoJs2 = [NSString stringWithFormat:@"%@", jsonStr2];
    
    self.loginData = baseInfoJs2;
    
    NSMutableDictionary *userCenterProfile = [NSMutableDictionary dictionaryWithDictionary:[RXOSUserUtility sharedManager].inProfile[@"user_center"]];
    if (self.userCenterConfig.setConfigParams && self.userCenterConfig.setConfigParams.allKeys.count > 0) {
        userCenterProfile = [NSMutableDictionary dictionaryWithDictionary:self.userCenterConfig.setConfigParams];
    }
    
    NSString *theme = @"light";
    if (!self.userCenterConfig.setLightTheme) {
        theme = @"dark";
    }
    
    [userCenterProfile setValue:theme forKey:@"theme"];

    NSString *jsonStr3 = [RXOSCommonTool getJsonString:userCenterProfile];
    jsonStr3 = [jsonStr3 stringByReplacingOccurrencesOfString:@"\n" withString:@""];
    NSString *baseInfoJs3 = [NSString stringWithFormat:@"%@", jsonStr3];

    // 设备信息
    NSMutableDictionary *device = [NSMutableDictionary dictionary];
    [device setValue:RXAC ? @(1) : @(2) forKey:@"orientation"]; // 屏幕方向 横屏1 竖屏2
    
    if ([ISPAD isEqualToString:@"iPad"]) {
        [device setValue:@(20) forKey:@"naviBarHeight"]; // 安全区高度
        [device setValue:@(1) forKey:@"isPad"]; // 是否是pad
    } else {
        [device setValue:@(kRXStatusBarHeight) forKey:@"naviBarHeight"]; // 安全区高度
        [device setValue:@(0) forKey:@"isPad"]; // 是否是pad
    }
    [device setValue:kRXIphoneX ? @(1) : @(0) forKey:@"hasSafeZone"]; // 是否有刘海 1有 2没有
    [device setValue:@(kRXTabbarSafeBottomMargin) forKey:@"tabbarSafeHeight"]; // 底部安全区高度
    
    NSString *jsonStr4 = [RXOSCommonTool getJsonString:device];
    jsonStr4 = [jsonStr4 stringByReplacingOccurrencesOfString:@"\n" withString:@""];
    NSString *baseInfoJs4 = [NSString stringWithFormat:@"%@", jsonStr4];
    
    // 登录方式
    NSArray *methods = config.loginTypes;
    NSData *methodsJsonData = [NSJSONSerialization dataWithJSONObject:methods options:NSJSONWritingPrettyPrinted error:nil];
    NSString *jsonStr5 = [[NSString alloc] initWithData:methodsJsonData encoding:NSUTF8StringEncoding];
    jsonStr5 = [jsonStr5 stringByReplacingOccurrencesOfString:@"\n" withString:@""];
    NSString *baseInfoJs5 = [NSString stringWithFormat:@"%@", jsonStr5];
    
    // cp透传数据
    NSMutableDictionary *cpData = [NSMutableDictionary dictionary];
    RXOSUserCenterConfig *userConfig = [RXOSUserUtility sharedManager].userCenterConfig;
    [cpData setValue:userConfig.transmit_args forKey:@"transmit_args"];
    [cpData setValue:userConfig.game_user_id forKey:@"game_user_id"];
    [cpData setValue:userConfig.nickname forKey:@"nickname"];
    [cpData setValue:userConfig.head_img_url forKey:@"head_img_url"];
    [cpData setValue:userConfig.queue_name forKey:@"queue_name"];

    NSString *jsonStr6 = [RXOSCommonTool getJsonString:cpData];
    jsonStr6 = [jsonStr6 stringByReplacingOccurrencesOfString:@"\n" withString:@""];
    NSString *baseInfoJs6 = [NSString stringWithFormat:@"%@", jsonStr6];
    
    // 设置密码等级
    NSMutableDictionary *passwordStrength = [NSMutableDictionary dictionary];
    NSString *pwdType = @"default";
    
    switch ([RXOSUserUtility sharedManager].passwordType) {
        case 0:
            pwdType = @"default";
            break;
        case 1:
            pwdType = @"custom";
            break;
        case 2:
            pwdType = @"average";
            break;
        case 3:
            pwdType = @"strong";
            break;
        default:
            pwdType = @"default";
            break;
    }
    
    [passwordStrength setValue:pwdType forKey:@"password_type"];
    [passwordStrength setValue:[RXOSUserUtility sharedManager].pwdPattern forKey:@"pattern"];
    
    NSString *jsonStr7 = [RXOSCommonTool getJsonString:passwordStrength];
    jsonStr7 = [jsonStr7 stringByReplacingOccurrencesOfString:@"\n" withString:@""];
    NSString *baseInfoJs7 = [NSString stringWithFormat:@"%@", jsonStr7];
    
    // 协议声明
    NSMutableDictionary *protocolDic = [NSMutableDictionary dictionary];
    [protocolDic setValue:self.protocolKey forKey:@"key"];
    [protocolDic setValue:self.protocolKeyList forKey:@"key_list"];
    
    NSString *jsonStr8 = [RXOSCommonTool getJsonString:protocolDic];
    jsonStr8 = [jsonStr8 stringByReplacingOccurrencesOfString:@"\n" withString:@""];
    NSString *baseInfoJs8 = [NSString stringWithFormat:@"%@", jsonStr8];
    
    // 海外实名认证
    NSMutableDictionary *realAuthDic = [NSMutableDictionary dictionary];
    [realAuthDic setValue:self.closeBtn.hidden ? @NO : @YES forKey:@"closeVisible"];
    [realAuthDic setValue:[self.region uppercaseString] forKey:@"region"];
    
    NSString *jsonStr9 = [RXOSCommonTool getJsonString:realAuthDic];
    jsonStr9 = [jsonStr9 stringByReplacingOccurrencesOfString:@"\n" withString:@""];
    NSString *baseInfoJs9 = [NSString stringWithFormat:@"%@", jsonStr9];
    
    // 请求头信息
    NSMutableDictionary *requestHeaderDic = [NSMutableDictionary dictionaryWithDictionary:[RX_CommonNetworkExcuteManager headParams]];
    NSString *baseInfoJs10 = @"";
    if ([requestHeaderDic isKindOfClass:[NSDictionary class]] && requestHeaderDic.allKeys.count > 0) {
        NSString *jsonStr10 = [RXOSCommonTool getJsonString:requestHeaderDic];
        jsonStr10 = [jsonStr10 stringByReplacingOccurrencesOfString:@"\n" withString:@""];
        baseInfoJs10 = [NSString stringWithFormat:@"%@", jsonStr10];
    }
    
    NSMutableDictionary *jsonDic = [NSMutableDictionary dictionary];
    [jsonDic setValue:baseInfoJs1 forKey:@"api_params"];
    [jsonDic setValue:baseInfoJs2 forKey:@"login_data"];
    [jsonDic setValue:baseInfoJs3 forKey:@"config_params"];
    [jsonDic setValue:baseInfoJs4 forKey:@"device"];
    [jsonDic setValue:baseInfoJs5 forKey:@"methods"];
    [jsonDic setValue:baseInfoJs6 forKey:@"custom_params"];
    [jsonDic setValue:baseInfoJs7 forKey:@"passwordStrength"];
    [jsonDic setValue:baseInfoJs8 forKey:@"protocol"];
    [jsonDic setValue:baseInfoJs9 forKey:@"real_auth"];
    [jsonDic setValue:baseInfoJs10 forKey:@"request_headers"];
    [jsonDic setValue:@(self.userCenterConfig.setSyncInfoEnable) forKey:@"setSyncInfoEnable"];

    // 初始化数据
    NSMutableDictionary *initDic = [NSMutableDictionary dictionaryWithDictionary:[[RXService sharedSDK] getConfigData]];
    
    if ([initDic isKindOfClass:[NSDictionary class]] && initDic.allKeys.count > 0) {
        NSString *jsonStr11 = [RXOSCommonTool getJsonString:initDic];
        jsonStr11 = [jsonStr11 stringByReplacingOccurrencesOfString:@"\n" withString:@""];
        NSString *baseInfoJs11 = [NSString stringWithFormat:@"%@", jsonStr11];
        
        [jsonDic setValue:baseInfoJs11 forKey:@"init_data"];
    }
    
//    NSString *jsonStr = [RXOSCommonTool getJsonString:jsonDic];
    //    NSString *baseInfoJs = [NSString stringWithFormat:@"window.iOSInfo=%@", jsonStr];
    
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:jsonDic options:kNilOptions error:nil];
    NSString *jsonStr = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    
//        NSString *jsStr = [NSString stringWithFormat:@"getInitParams('%@')", jsonStr];
    NSString *jsStr = [NSString stringWithFormat:@"var getInitParams = %@", jsonStr];
    self.jsJsonStr = jsStr;
//
    WKUserScript *cookieScript = [[WKUserScript alloc] initWithSource:jsStr injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:YES];
    [self.webView.configuration.userContentController addUserScript:cookieScript];
}

#pragma mark - webView delegate
#pragma mark - 需要响应身份验证时调用 同样在block中需要传入用户身份凭证
// 页面开始加载时调用
- (void)webView:(WKWebView *)webView didStartProvisionalNavigation:(WKNavigation *)navigation
{
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    if (!_visibleHUD) {
        [RXOSHUD showHUDWithOffset:CGRectMake(CGRectGetWidth(window.frame) / 2 - 20, CGRectGetMinY(self.frame) + CGRectGetMinY(self.webView.frame) + (CGRectGetHeight(self.webView.frame) / 2) - 20, 40, 40)];
    } else {
        _loadingView.hidden = NO;
        [RXOSHUD showHUDWithOffset:CGRectMake(CGRectGetWidth(window.frame) / 2 - 20, CGRectGetMinY(self.frame) + CGRectGetMinY(self.webView.frame) + (CGRectGetHeight(self.webView.frame) / 2) - 20, 40, 40)];
    }
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:self.urlStr forKey:@"url"];
    [dic setValue:@"begin" forKey:@"state"];
    [self addLogWithProperties:dic];
}

- (void)webView:(WKWebView *)webView didReceiveAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition, NSURLCredential * _Nullable))completionHandler {
    
    NSString *type = @"noCredential";
    if ([challenge.protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust]) {
//        判断服务器采用的验证方法
        if (challenge.previousFailureCount == 0) {
//        如果没有错误的情况下 创建一个凭证，并使用证书
            NSURLCredential *credential = [NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust];
            completionHandler(NSURLSessionAuthChallengeUseCredential, credential);
            
            type = @"useCredential";
        } else {
//        验证失败，取消本次验证
            completionHandler(NSURLSessionAuthChallengeUseCredential, nil);
        }
    } else {
        completionHandler(NSURLSessionAuthChallengeUseCredential, nil);
    }
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:self.urlStr forKey:@"url"];
    [dic setValue:@"decidePolicy" forKey:@"state"];
    [dic setValue:type forKey:@"type"];
    [self addLogWithProperties:dic];
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation{
    [RXOSHUD hideWebHUD];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        self.loadingView.hidden = YES;
//        [self showNavi:NO];
    });
    
#pragma mark -禁止用户选择
//    [webView evaluateJavaScript:@"document.documentElement.style.webkitUserSelect='none';" completionHandler:nil];
//    [webView evaluateJavaScript:@"document.activeElement.blur();" completionHandler:nil];
//#pragma mark -禁止缩放手势
//    NSString *injectionJSString = @"var script = document.createElement('meta');"
//    "script.name = 'viewport';"
//    "script.content=\"width=device-width, user-scalable=no\";"
//    "document.getElementsByTagName('head')[0].appendChild(script);";
//    [webView evaluateJavaScript:injectionJSString completionHandler:nil];

    [self.webView evaluateJavaScript:@"document.title" completionHandler:^(id _Nullable result, NSError * _Nullable error) {
        NSLog(@"网页抓取结果:%@", result);
        self.titleLbl.text = result;
    }];
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:self.urlStr forKey:@"url"];
    [dic setValue:@"success" forKey:@"state"];
    [self addLogWithProperties:dic];
}

- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler {
    NSURL *URL = navigationAction.request.URL;
    NSString *scheme = [URL scheme];
    NSString *absoluteString = [navigationAction.request.URL.absoluteString stringByRemovingPercentEncoding];
    NSLog(@"URLSTRING: %@", absoluteString);
    
    NSString *type = @"allow";
    if (navigationAction.navigationType == WKNavigationTypeLinkActivated) {
        type = @"cancel";
        decisionHandler(WKNavigationActionPolicyCancel);
    } else {
        decisionHandler (WKNavigationActionPolicyAllow);
    }
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:self.urlStr forKey:@"url"];
    [dic setValue:@"decidePolicy" forKey:@"state"];
    [dic setValue:type forKey:@"type"];
    [self addLogWithProperties:dic];
    
    return ;//不添加会崩溃
}

- (void)webView:(WKWebView *)webView didFailNavigation:(WKNavigation *)navigation withError:(NSError *)error
{
    NSLog(@"加载失败 %@", error.userInfo);
    
    @try {
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:self.urlStr forKey:@"url"];
        [dic setValue:@"fail" forKey:@"state"];
        [dic setValue:error.localizedDescription forKey:@"error"];
        [self addLogWithProperties:dic];
    } @catch (NSException *exception) {
        
    } @finally {
        
    }
}

- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(WKNavigation *)navigation withError:(NSError *)error
{
    NSLog(@"加载失败 %@", error.userInfo);
    
    @try {
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:self.urlStr forKey:@"url"];
        [dic setValue:@"fail" forKey:@"state"];
        [dic setValue:error.localizedDescription forKey:@"error"];
        [self addLogWithProperties:dic];
    } @catch (NSException *exception) {
        
    } @finally {
        
    }
}

- (void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message {
    // message.name  添加监听的方法名
    [RXOSWebViewManager sharedSDK].complete = self.complete;
    [[RXOSWebViewManager sharedSDK] fetchJSInfoWithMethod:message.name info:message.body webView:self.webView];
    
    if ([message.name isEqualToString:@"getNativeInitParams"]) {
        
        [self.webView evaluateJavaScript:[NSString stringWithFormat:@"getNativeInitParams('%@')", self.loginData]
                       completionHandler:^(id response, NSError * error) {
            NSLog(@"response: %@, \nerror: %@", response, error);
        }];
    }
}

- (void)webView:(WKWebView *)webView didReceiveServerRedirectForProvisionalNavigation:(WKNavigation *)navigation
{
    @try {
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:self.urlStr forKey:@"url"];
        [dic setValue:@"didReceiveServerRedirectForProvisionalNavigation" forKey:@"state"];
        [self addLogWithProperties:dic];
    } @catch (NSException *exception) {
        
    } @finally {
        
    }
}

- (void)webView:(WKWebView *)webView didCommitNavigation:(WKNavigation *)navigation
{
    @try {
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:self.urlStr forKey:@"url"];
        [dic setValue:@"didCommitNavigation" forKey:@"state"];
        [self addLogWithProperties:dic];
    } @catch (NSException *exception) {
        
    } @finally {
        
    }
}

- (void)webViewWebContentProcessDidTerminate:(WKWebView *)webView
{
    @try {
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:self.urlStr forKey:@"url"];
        [dic setValue:@"webViewWebContentProcessDidTerminate" forKey:@"state"];
        [self addLogWithProperties:dic];
    } @catch (NSException *exception) {
        
    } @finally {
        
    }
}

- (void)webView:(WKWebView *)webView authenticationChallenge:(NSURLAuthenticationChallenge *)challenge shouldAllowDeprecatedTLS:(WK_SWIFT_UI_ACTOR void (^)(BOOL))decisionHandler
{
    @try {
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:self.urlStr forKey:@"url"];
        [dic setValue:@"authenticationChallenge" forKey:@"state"];
        [self addLogWithProperties:dic];
    } @catch (NSException *exception) {
        
    } @finally {
        
    }
}

//didBecomeDownload
- (void)webView:(WKWebView *)webView navigationAction:(WKNavigationAction *)navigationAction didBecomeDownload:(WKDownload *)download
API_AVAILABLE(ios(14.5)){
    @try {
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:self.urlStr forKey:@"url"];
        [dic setValue:@"navigationAction" forKey:@"state"];
        [self addLogWithProperties:dic];
    } @catch (NSException *exception) {
        
    } @finally {
        
    }
}

- (void)webView:(WKWebView *)webView navigationResponse:(WKNavigationResponse *)navigationResponse didBecomeDownload:(WKDownload *)download
API_AVAILABLE(ios(14.5)){
    @try {
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:self.urlStr forKey:@"url"];
        [dic setValue:@"navigationResponse" forKey:@"state"];
        [self addLogWithProperties:dic];
    } @catch (NSException *exception) {
        
    } @finally {
        
    }
}

#pragma mark -- <actions>
- (void)backBtnAction:(UIButton *)btn
{
    if ([self.webView canGoBack]) {
        [self.webView goBack];
    } else {
        [self hide];
    }
}

- (void)closeBtnAction:(UIButton *)btn
{
    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
    
    NSString *errorMsg = [RXErrorTool getRXErrorMsg:RXLimitError_closeView];
    err.responesObject = @{@"msg" : errorMsg,
                           @"code" : @(RXLimitError_closeView)
    };
    if (self.rightClose) {
        self.rightClose(err);
    }
    [self hide];
}

- (void)addLogWithProperties:(NSMutableDictionary *)properties
{
    @try {
        if (self.userCenterConfig.openWebViewLog) {
            [properties setValue:self.jsJsonStr forKey:@"js_params"];
            [[RXLogService sharedSDK] addLogSingleWithEvent:log_userCenter distinctId:@"" properties:properties];
        }
    } @catch (NSException *exception) {
        
    } @finally {
            
    }
}

#pragma mark -- <lazy>
- (WKWebView *)webView
{
    if (!_webView) {
        UIWindow *window = [UIApplication sharedApplication].keyWindow;
        WKWebViewConfiguration *wkWebConfig = [[WKWebViewConfiguration alloc] init];
//        NSString *jSString = [NSString stringWithFormat:@"var meta = document.createElement('meta'); meta.setAttribute('name', 'viewport'); meta.setAttribute('content', 'width=%f'); document.getElementsByTagName('head')[0].appendChild(meta);", window.frame.size.width];
//        WKUserScript *wkUserScript = [[WKUserScript alloc] initWithSource:jSString injectionTime:WKUserScriptInjectionTimeAtDocumentEnd forMainFrameOnly:YES];
//        [wkWebConfig.userContentController addUserScript:wkUserScript];
        
        _webView = [[WKWebView alloc] initWithFrame:CGRectZero configuration:wkWebConfig];
        _webView.backgroundColor = [UIColor whiteColor];
        _webView.navigationDelegate = self;
    }
    return _webView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.backgroundColor = [UIColor whiteColor];
//        _titleLbl.font = [UIFont systemFontOfSize:18 weight:UIFontWeightMedium];
        _titleLbl.font = [UIFont systemFontOfSize:18 weight:UIFontWeightMedium];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UIView *)naviBar
{
    if (!_naviBar) {
        _naviBar = [[UIView alloc] init];
//        _naviBar.backgroundColor = [UIColor colorWithHexString:@"#E0FFFC"];
        _naviBar.backgroundColor = [UIColor whiteColor];
    }
    return _naviBar;
}

- (UIImageView *)logoImageView
{
    if (!_logoImageView) {
        _logoImageView = [[UIImageView alloc] init];
        RXOSUILoginConfig *config = [RXOSUserUtility sharedManager].loginConfig;

        if ([config.logoImage isKindOfClass:[UIImage class]]) {
            _logoImageView.image = config.logoImage;
        } else {
            _logoImageView.image = [RXOSCommonTool getImageFromURL:(NSString *)config.logoImage];
        }
    }
    return _logoImageView;
}

- (RXOSCloseBtn *)backBtn
{
    if (!_backBtn) {
        _backBtn = [RXOSCloseBtn buttonWithType:UIButtonTypeCustom];
        
        UIImage *backImage = [UIImage rxOSBundleImageNamed:@"rx_back"];
        if ([RXOSCommonTool isRTL]) {
            UIImage *flipImage = [UIImage imageWithCGImage:backImage.CGImage scale:backImage.scale orientation:UIImageOrientationDown];
            [_backBtn setImage:flipImage forState:UIControlStateNormal];
        } else {
            [_backBtn setImage:backImage forState:UIControlStateNormal];
        }
        
        [_backBtn addTarget:self action:@selector(backBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _backBtn;
}

- (RXOSCloseBtn *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [RXOSCloseBtn buttonWithType:UIButtonTypeCustom];
        [_closeBtn setImage:[UIImage rxOSBundleImageNamed:@"rx_close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(closeBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

- (UIView *)line
{
    if (!_line) {
        _line = [[UIView alloc] init];
        _line.backgroundColor = [UIColor colorWithHexString:@"ececec"];
    }
    return _line;
}

@end
