//
//  CHLoginViewController.m
//  RXSDKDemo-Public
//
//  Created by 陈汉 on 2024/1/3.
//

#import "CHLoginViewController.h"
#import "CHMarco.h"
#import <Photos/Photos.h>
#import "CHHallViewController.h"

@interface CHLoginViewController () <UIImagePickerControllerDelegate, UINavigationControllerDelegate>

@property (nonatomic, strong) UIButton *loginBtn;
@property (nonatomic, strong) UIButton *backBtn;
@property (nonatomic, strong) UIButton *backBtn1;
@property (nonatomic, strong) UIImageView *bgView;
@property (nonatomic, strong) UIImageView *tipBgView;
@property (nonatomic, strong) UIImagePickerController *imagePickerVC;

@end

@implementation CHLoginViewController

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    
//    self.navigationController.navigationBar.hidden = YES;
    
    if (@available(iOS 16.0, *)) {
        
        dispatch_async(dispatch_get_main_queue(), ^{
            // 主线程更新

            [self setNeedsUpdateOfSupportedInterfaceOrientations];

        });

    } else {
        [[UIDevice currentDevice] setValue:[NSNumber numberWithInt:UIInterfaceOrientationUnknown] forKey:@"orientation"];
        [[UIDevice currentDevice] setValue:[NSNumber numberWithInt:UIInterfaceOrientationLandscapeRight] forKey:@"orientation"];
    }
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
    self.view.backgroundColor = [UIColor whiteColor];
    
    [self setUI];
}

#pragma mark -- setUI
- (void)setUI
{
    [self.view sd_addSubviews:@[self.bgView, self.tipBgView, self.loginBtn, self.backBtn]];
    
    _bgView.sd_layout.leftEqualToView(self.view)
    .leftEqualToView(self.view)
    .rightEqualToView(self.view)
    .bottomEqualToView(self.view);
    
    CGFloat tipBgW = 600;
    CGFloat tipBgH = 275;
    BOOL isAC = YES;
    if ([Tool sharedSDK].interface == 1) {
        _bgView.image = kImageNamed(@"login_bg1");
        _tipBgView.image = kImageNamed(@"login_tip1");
    } else {
        _bgView.image = kImageNamed(@"login_bg2");
        _tipBgView.image = kImageNamed(@"login_tip2");
        
        tipBgW = 275;
        tipBgH = 600;
        
        isAC = NO;
    }
    
    _loginBtn.sd_layout.bottomSpaceToView(self.view, isAC ? 50 : 70)
    .centerXEqualToView(self.view)
    .widthIs(297)
    .heightIs(46);
    
    _tipBgView.sd_layout.centerXEqualToView(self.view)
    .centerYEqualToView(self.view)
    .widthIs(tipBgW)
    .heightIs(tipBgH);
    
    _backBtn.sd_layout.topSpaceToView(self.view, isAC ? 50 : 114)
    .rightSpaceToView(self.view, isAC ? 30 : 30)
    .widthIs(40)
    .heightEqualToWidth();
}

#pragma mark -- imagePicker
- (void)imagePicker
{
    if (@available(iOS 14, *)) {
        PHAuthorizationStatus status = [PHPhotoLibrary authorizationStatusForAccessLevel:PHAccessLevelReadWrite];
        if (status != PHAuthorizationStatusAuthorized) { // 未授权
            [PHPhotoLibrary requestAuthorizationForAccessLevel:PHAccessLevelReadWrite handler:^(PHAuthorizationStatus status) {
                switch (status) {
                    case PHAuthorizationStatusLimited:
                        NSLog(@"limited");
                        break;
                    case PHAuthorizationStatusDenied:
                        NSLog(@"denied");
                        break;
                    case PHAuthorizationStatusAuthorized:
                        NSLog(@"authorized");
                        [self pushIntoAlbumAction];
                        break;
                    default:
                        break;
                }
            }];
        } else {
            [self pushIntoAlbumAction];
        }
        
    } else {
        PHAuthorizationStatus authStatus = [PHPhotoLibrary authorizationStatus];
        if (authStatus != PHAuthorizationStatusAuthorized) // 未授权
        {
            [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status) {
                if (status != PHAuthorizationStatusAuthorized)  //已授权
                {
                    NSLog(@"用户拒绝访问相册！");
                }
                else
                {
                    NSLog(@"用户允许访问相册！");
                }
            }];
        }
    }
}

- (void)pushIntoAlbumAction
{
//    [RXHUD showHUD];
    dispatch_async(dispatch_get_main_queue(), ^{
        // 主线程
        self.imagePickerVC.modalPresentationStyle = UIModalPresentationOverFullScreen;
        UIImagePickerControllerSourceType sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
        if ([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypePhotoLibrary]) {
            self.imagePickerVC.sourceType = sourceType;
            [self.navigationController presentViewController:self.imagePickerVC animated:YES completion:nil];
            [RXHUD hideHUD];
        }else{
            NSLog(@"模拟器中无法打开照相机, 请在真机中使用!");
        }
    });
}

- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary<UIImagePickerControllerInfoKey,id> *)info{
    [picker dismissViewControllerAnimated:YES completion:nil];
    
    NSString *type = [info objectForKey:UIImagePickerControllerMediaType];
    UIImage *image = [info objectForKey:UIImagePickerControllerOriginalImage];
    
    _bgView.image = image;
}

#pragma mark -- actions
- (void)backBtnAction
{
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)tapAction:(UITapGestureRecognizer *)tap
{
    [self imagePicker];
}

- (void)loginBtnAction
{
    if ([CHUtility sharedManager].isOS) {
        RXOSUILoginConfig *config = [[RXOSUILoginConfig alloc] init];
        config.loginTypes = [CHUtility sharedManager].loginTypes;
        config.logoImage = [UIImage imageNamed:@"logo"];
        config.loginViewType = [CHUtility sharedManager].loginType;
        config.privacieTitles = @[@"用户协议", @"隐私政策"];
        config.privacies = @[@"https://anhvcpo.weilekuiming.com/static/landing/#/v1/legal/terms/290/818/00001?lang=zh", @"https://anhvcpo.weilekuiming.com/static/landing/#/v1/legal/terms/290/818/00002?lang=zh"];
    //    config.privacies = @[@"https://www.baidu.com", @"https://www.baidu.com"];
//        config.needRealAuth = YES;
//        config.needSetPassword = YES;
//        config.canCloseRealAuth = YES;
        config.language_default = [CHUtility sharedManager].language;
        config.keyboardType = 3;
//        if ([Tool sharedSDK].isAudit) {
//            config.isAudit = YES;
//        }else{
            config.isAudit = NO;
//        }
        [[RXService sharedSDK] setLanguage:[CHUtility sharedManager].language];
        
        [[RXOSUIKitService sharedSDK] setLoginViewWithConfig:config
                                                  loginEvent:^NSDictionary * _Nonnull(NSDictionary * _Nonnull loginEvent, LoginType loginType) {
            NSMutableDictionary *loginExt = [NSMutableDictionary dictionary];
            switch (loginType) {
                case LoginTypeW:
                    [loginExt setValue:@"wx5d34c56f0c58e881" forKey:@"appid"];
                    break;
                case LoginTypeFacebook:
                    [loginExt setValue:@{} forKey:@"ext"];
                    break;
                case LoginTypeLine:
                    [loginExt setValue:@{} forKey:@"ext"];
                    break;
                case LoginTypeGoogle:
                    [loginExt setValue:@"875255664003-eorr371qavp578ro0beafnfudr4upf1c.apps.googleusercontent.com" forKey:@"appid"];
                    break;
                case LoginTypeZalo:
                    [loginExt setValue:@{} forKey:@"ext"];
                    break;
                case LoginTypeTikTok:
                    [loginExt setValue:@{} forKey:@"ext"];
                    break;
                case LoginTypeSnapChat:
                    [loginExt setValue:@{} forKey:@"ext"];
                    break;
                case LoginTypeInstagram:
                    [loginExt setValue:@{} forKey:@"ext"];
                    break;
                case LoginTypeReddit:
                    [loginExt setValue:@{} forKey:@"ext"];
                    break;
                default:
                    break;
            }
            return loginExt;
        } complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            if (!error) {
                NSData *data = [NSJSONSerialization dataWithJSONObject:response options:NSJSONWritingPrettyPrinted error:nil];
                NSString *dicStr = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
                NSData *devicetoken = [[NSUserDefaults standardUserDefaults] valueForKey:@"deciceToken"];
                [[RXPushService sharedSDK] registerDeviceToken:devicetoken complete:^(NSDictionary * _Nonnull response, NSDictionary * _Nonnull error) {
                    if (error == nil) {
                        NSLog(@"上报devicetoken成功");
                    }else{
                        NSLog(@"上报devicetoken失败");
                    }
                }];
                
                CHHallViewController *hallVC = [[CHHallViewController alloc] init];
                [self.navigationController pushViewController:hallVC animated:YES];
            } else {
                if ([error.responesObject[@"code"] integerValue] == 6010) {
                    
                } else {
                    [RXHUD showErrorText:error.responesObject[@"msg"]];
                }
            }
        }];
    } else {
        RXLoginUIModel *loginConfig = [[RXLoginUIModel alloc] init];
//        loginConfig.loginMethods = @[@"username", @"captchacode", @"wechat", @"guest", @"apple", @"quickphone"];
//        loginConfig.logoImage = [UIImage imageNamed:@"图片名称"];
        loginConfig.loginMethods = [CHUtility sharedManager].loginTypes;
        loginConfig.logoImage = [UIImage imageNamed:@"logo"];
//        config.loginViewType = [CHUtility sharedManager].loginType;
        loginConfig.wxAppid = @"wx5d34c56f0c58e881";
        
        loginConfig.privacieTitles = @[@"用户协议", @"隐私政策"];
        loginConfig.privacies = @[@"https://anhvcpo.weilekuiming.com/static/landing/#/v1/legal/terms/290/818/00001?lang=zh", @"https://anhvcpo.weilekuiming.com/static/landing/#/v1/legal/terms/290/818/00002?lang=zh"];
        loginConfig.quickphoneKey = @"X5tTAE1YuJP2PNWI1TaBC2ZC+GlKTy14wZudrDChkG3gLBZS8g2Fm8rrkMGKgWHtVVnLhT4sH5GMUMvcpI1cxQCLte9zmqJzMnyfX+T/RfNODf8kherbqlYqvhQ0SlLciehLS8zG+pKiRVKV9n1MR44ktJFNftTP/UKGw0d0Rh83n8M8mtDKIJXgc/UpKnWdhZ5BaXHbUYMMfQRbHdDmPqGSK64RRVS9uWmJ3Btykbdbwj8K7/8A1r4gJtbx8TOK9Jx8P8gbYLs=";
        loginConfig.needRealAuth = YES;
//        loginConfig.canCloseRealAuth = NO;
        
        NSString *loginOpenid = [[NSUserDefaults standardUserDefaults] valueForKey:@"loginOpenid"];
        if (loginOpenid.length > 0) {
    //        loginConfig.loginOpenid = loginOpenid;
        }
        
        NSString *loginMethod = [[NSUserDefaults standardUserDefaults] valueForKey:@"loginMethod"];
        if (loginMethod.length > 0) {
            loginConfig.method = loginMethod;
        }
        loginConfig.canCloseRealAuth = YES;
        
        [[RXUIKitService sharedSDK] showLoginViewWithConfig:loginConfig complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            if (!error) {
                [[NSUserDefaults standardUserDefaults] setValue:response[@"data"][@"login_openid"] forKey:@"loginOpenid"];
                [[NSUserDefaults standardUserDefaults] setValue:response[@"data"][@"login_method"] forKey:@"loginMethod"];
                
                NSData *data = [NSJSONSerialization dataWithJSONObject:response options:NSJSONWritingPrettyPrinted error:nil];
                NSString *dicStr = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
                NSData *devicetoken = [[NSUserDefaults standardUserDefaults] valueForKey:@"deciceToken"];
                [[RXPushService sharedSDK] registerDeviceToken:devicetoken complete:^(NSDictionary * _Nonnull response, NSDictionary * _Nonnull error) {
                    if (error == nil) {
                        NSLog(@"上报devicetoken成功");
                    }else{
                        NSLog(@"上报devicetoken失败");
                    }
                }];
                
                CHHallViewController *hallVC = [[CHHallViewController alloc] init];
                [self.navigationController pushViewController:hallVC animated:YES];
            } else {
                if ([error.responesObject[@"code"] integerValue] == 6010) {
                    
                } else {
                    [RXHUD showErrorText:error.responesObject[@"msg"]];
                }
            }
        }];
    }
}

#pragma mark -- lazy
- (UIButton *)loginBtn
{
    if (!_loginBtn) {
        _loginBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_loginBtn setTitle:@"开始登录" forState:normal];
        _loginBtn.titleLabel.font = [UIFont systemFontOfSize:18];
        [_loginBtn setTitleColor:[UIColor colorWithHexString:@"#F4F4F4"] forState:normal];
        if ([Tool sharedSDK].interface == 1) {
            [_loginBtn setBackgroundImage:kImageNamed(@"login_btnBg") forState:normal];
        } else {
            [_loginBtn setBackgroundImage:kImageNamed(@"login_normal") forState:normal];
        }
        [_loginBtn addTarget:self action:@selector(loginBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _loginBtn;
}

- (UIImageView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIImageView alloc] init];
    }
    return _bgView;
}

- (UIImageView *)tipBgView
{
    if (!_tipBgView) {
        _tipBgView = [[UIImageView alloc] init];
        _tipBgView.userInteractionEnabled = YES;
        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapAction:)];
        [_tipBgView addGestureRecognizer:tap];
    }
    return _tipBgView;
}

- (UIButton *)backBtn
{
    if (!_backBtn) {
        _backBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_backBtn setImage:kImageNamed(@"login_back") forState:normal];
        [_backBtn addTarget:self action:@selector(backBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _backBtn;
}

- (UIImagePickerController *)imagePickerVC
{
    if (!_imagePickerVC) {
        _imagePickerVC = [[UIImagePickerController alloc] init];
        _imagePickerVC.modalPresentationStyle= UIModalPresentationOverFullScreen;
        _imagePickerVC.delegate = self;
    }
    return _imagePickerVC;
}

@end
