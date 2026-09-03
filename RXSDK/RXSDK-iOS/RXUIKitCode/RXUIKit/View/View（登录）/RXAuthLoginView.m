////
////  RXAuthLoginView.m
////  RXSDK
////
////  Created by 陈汉 on 2021/10/14.
////
//
//#import "RXAuthLoginView.h"
//#import <ATAuthSDK/ATAuthSDK.h>
//#import "RXUICommonHeader.h"
//#import "RXAlphaDrawView.h"
//
//@interface RXAuthLoginView ()
//
//@property (nonatomic, strong) TXCustomModel *customModel;
//@property (nonatomic, strong) NSString *privacy1;
//@property (nonatomic, strong) NSString *privacy2;
//@property (nonatomic, copy) LoginCallBack callBack;
//
//@end
//
//@implementation RXAuthLoginView
//
//- (instancetype)initWithPrivacy1:(NSString *)privacy1
//                        privacy2:(NSString *)privacy2
//                        callBack:(LoginCallBack)callBack
//{
//    self = [super init];
//    if (self) {
//        self.privacy1 = privacy1;
//        self.privacy2 = privacy2;
//        self.callBack = callBack;
//        
//        [self configATAuth];
//    }
//    return self;
//}
//
//- (void)clickBgAction
//{
//    [[TXCommonHandler sharedInstance] cancelLoginVCAnimated:YES complete:^{
//        NSLog(@"关闭一键登录页面");
//    }];
//}
//
//- (void)configATAuth
//{
//    [[TXCommonHandler sharedInstance] setAuthSDKInfo:atauth_appkey
//                                            complete:^(NSDictionary * _Nonnull resultDic) {
//        NSLog(@"设置秘钥结果：%@", resultDic);
//        //环境检查，异步返回
//        [[TXCommonHandler sharedInstance] checkEnvAvailableWithAuthType:PNSAuthTypeLoginToken
//                                                               complete:^(NSDictionary * _Nullable resultDic) {
//            NSLog(@"环境检查返回：%@", resultDic);
//            if ([PNSCodeSuccess isEqualToString:[resultDic objectForKey:@"resultCode"]] == YES) {
//                [[TXCommonHandler sharedInstance] accelerateLoginPageWithTimeout:3.0 complete:^(NSDictionary * _Nonnull resultDic) {
//                    NSLog(@"为后面授权页拉起加个速，加速结果：%@", resultDic);
//                    if ([PNSCodeSuccess isEqualToString:[resultDic objectForKey:@"resultCode"]] == NO) {
//                        [SVProgressHUD showInfoWithStatus:@"获取授权失败，请使用其他方式登录"];
//                    } else {
//                        [self didLoginWithATAuth];
//                    }
//                }];
//            } else {
//                [SVProgressHUD showInfoWithStatus:@"获取授权失败，请使用其他方式登录"];
//            }
//        }];
//    }];
//}
//
//// 一键登录
//- (void)didLoginWithATAuth
//{
//    [[TXCommonHandler sharedInstance] getLoginTokenWithTimeout:3.0
//                                                    controller:[UIViewController currentViewController]
//                                                         model:self.customModel
//                                                      complete:^(NSDictionary * _Nonnull resultDic) {
//        NSString *resultCode = [resultDic objectForKey:@"resultCode"];
//        if ([PNSCodeLoginControllerPresentSuccess isEqualToString:resultCode]) {
//            NSLog(@"授权页拉起成功回调：%@", resultDic);
//        } else if ([PNSCodeLoginControllerClickCancel isEqualToString:resultCode] ||
//                   [PNSCodeLoginControllerClickCheckBoxBtn isEqualToString:resultCode] ||
//                   [PNSCodeLoginControllerClickProtocol isEqualToString:resultCode]) {
//            NSLog(@"页面点击事件回调：%@", resultDic);
//        } else if ([PNSCodeLoginControllerClickLoginBtn isEqualToString:resultCode]) {
////            [SVProgressHUD show];
//        } else if ([PNSCodeLoginControllerClickChangeBtn isEqualToString:resultCode]) {
//            [[TXCommonHandler sharedInstance] cancelLoginVCAnimated:YES complete:^{
//                NSLog(@"关闭一键登录页面");
//            }];
//        } else if ([PNSCodeSuccess isEqualToString:resultCode]) {
//            NSLog(@"获取LoginToken成功回调：%@", resultDic);
//            NSString *token = [resultDic objectForKey:@"token"];
//                    
//            [RXUIUserUtility sharedManager].aliAuthToken = token;
//            
//            NSMutableDictionary *extDic = [NSMutableDictionary dictionaryWithDictionary:[RXUIUserUtility sharedManager].extDic];
//            [extDic setValue:token forKey:@"access_token"];
//            
//            [[RXService sharedSDK] loginWithExtDic:extDic username:nil password:nil loginOpenId:nil loginType:LoginTypeAuth];
//            [[TXCommonHandler sharedInstance] cancelLoginVCAnimated:YES complete:^{
//                NSLog(@"关闭一键登录页面");
//            }];
//            
//        } else {
//            NSLog(@"获取LoginToken或拉起授权页失败回调：%@", resultDic);
//            //失败后跳转到登录界面
//            [SVProgressHUD showInfoWithStatus:@"获取授权失败，请使用其他方式登录"];
//        }
//    }];
//}
//
//- (NSString *)getSDCardType
//{
//    if ([TXCommonUtils isChinaMobile]) {
//        return @"中国移动";
//    } else if ([TXCommonUtils isChinaUnicom]) {
//        return @"中国联通";
//    } else return @"中国电信";
//}
//
//- (NSAttributedString *)attributedStringWithTitle:(NSString *)title
//                                            color:(NSString *)color
//                                             font:(UIFont *)font
//{
//    NSMutableParagraphStyle *style = [[NSMutableParagraphStyle alloc] init];
//    style.alignment = NSTextAlignmentCenter;
//    
//    NSAttributedString *attr = [[NSAttributedString alloc] initWithString:title attributes:@{
//        NSForegroundColorAttributeName:[UIColor colorWithHexString:color],
//        NSFontAttributeName:font,
//        NSParagraphStyleAttributeName:style
//    }];
//    
//    return attr;
//}
//
//- (TXCustomModel *)customModel
//{
//    if (!_customModel) {
//        _customModel = [[TXCustomModel alloc] init];
////        _customModel.alertBarIsHidden = YES;
//        _customModel.alertTitleBarColor = [UIColor clearColor];
//        _customModel.alertTitle = [[NSAttributedString alloc] initWithString:@"" attributes:@{NSForegroundColorAttributeName : UIColor.whiteColor,NSFontAttributeName : [UIFont systemFontOfSize:15.0]}];
//        _customModel.alertCloseImage = [UIImage bundleImageNamed:@"close"];
//        _customModel.alertCornerRadiusArray = @[@6,@6,@6,@6];
//        // 号码
//        _customModel.numberColor = [UIColor blackColor];
//        _customModel.numberFont = [UIFont systemFontOfSize:20];
//        _customModel.numberFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
//            frame = CGRectMake(106, 10, 160, 30);
//            return frame;
//        };
//        // slogan
//        _customModel.sloganText = [self attributedStringWithTitle:[NSString stringWithFormat:@"%@提供认证服务", [self getSDCardType]] color:@"737373" font:[UIFont systemFontOfSize:12]];;
//        _customModel.sloganFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
//            frame = CGRectMake(100, 35, 130, 24);
//            return frame;
//        };
//        // 登录
//        _customModel.loginBtnText = [[NSAttributedString alloc] initWithString:@"使用本机号码一键登录" attributes:@{NSForegroundColorAttributeName : UIColor.whiteColor,NSFontAttributeName : [UIFont systemFontOfSize:15.0]}];
//        _customModel.loginBtnBgImgs = @[[UIImage bundleImageNamed:@"login_btn_normal"], [UIImage bundleImageNamed:@"login_btn_unable"], [UIImage bundleImageNamed:@"login_btn_press"]];
//        _customModel.loginBtnFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
//            frame = CGRectMake(76, 100, 180, 30);
//            return frame;
//        };
//        
//        _customModel.contentViewFrameBlock = ^CGRect(CGSize screenSize, CGSize contentSize, CGRect frame) {
//
//            CGFloat alertWidth = 335;
//            CGFloat alertHeight = 280;
//            CGFloat alertX = __MainScreen_Width / 2 - alertWidth / 2;
//            CGFloat alertY = __MainScreen_Height / 2 - alertHeight / 2;
//
//                return CGRectMake(alertX, alertY, alertWidth, alertHeight);
//            };
//        // 协议
//        _customModel.checkBoxIsHidden = YES;
//        _customModel.privacyPreText = @"点击使用本机号一键登录表示您已阅读并同意";
//        _customModel.privacyOne = @[@"《用户服务协议》", self.privacy1];
//        _customModel.privacyTwo = @[@"《隐私保护政策》", self.privacy2];
//        _customModel.privacyNavBackImage = [UIImage bundleImageNamed:@"close"];
//        _customModel.privacyOperatorPreText = @"《";
//        _customModel.privacyOperatorSufText = @"》";
//        _customModel.privacyAlignment = NSTextAlignmentCenter;
//        _customModel.privacyFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
//            return CGRectMake(20, 175, 300, 30);
//        };
//        
//        // 其他登录方式
//        _customModel.changeBtnTitle = [self attributedStringWithTitle:@"使用其他登录方式" color:@"AFBAD3" font:[UIFont systemFontOfSize:13]];
//        _customModel.changeBtnFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
//            frame = CGRectMake(113, 140, 110, 20);
//            return frame;
//        };
//        // 自定义view
////        RXAlphaDrawView *bgView = [[RXAlphaDrawView alloc] initWithFrame:CGRectMake(0, 0, __MainScreen_Width, __MainScreen_Height)];
////
////        __weak __typeof__(RXAlphaDrawView *) weakBgView = bgView;
////        bgView.clickBlock = ^{
////            UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(clickBgAction)];
////            [weakBgView addGestureRecognizer:tap];
////        };
////
////        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
////            [[UIApplication sharedApplication].keyWindow addSubview:bgView];
////
////        });
//        
//        // 横竖屏切换
//        _customModel.supportedInterfaceOrientations = UIInterfaceOrientationMaskAll;
//    }
//    return _customModel;
//}
//
//@end
