//
//  CHHallViewController.m
//  RXSDKDemo-Public
//
//  Created by 陈汉 on 2024/1/3.
//

#import "CHHallViewController.h"
#import "CHMarco.h"
#import <Photos/Photos.h>
#import "RXSelectPayViewController.h"
#import "RXSelectShareViewController.h"
#import "RXPayViewController.h"
#import "RXShareViewController.h"

@interface CHHallViewController () <UIImagePickerControllerDelegate, UINavigationControllerDelegate>

@property (nonatomic, strong) UIButton *backBtn;
@property (nonatomic, strong) UIButton *backBtn1;
@property (nonatomic, strong) UIImageView *bgView;
@property (nonatomic, strong) UIImageView *tipBgView;
@property (nonatomic, strong) UIImagePickerController *imagePickerVC;
@property (nonatomic, strong) UIButton *serviceCenterBtn;
@property (nonatomic, strong) UIButton *userCenterBtn;
@property (nonatomic, strong) UIButton *shareBtn;
@property (nonatomic, strong) UIButton *payBtn;
@property (nonatomic, strong) UIButton *emailBtn;

@end

@implementation CHHallViewController

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
    [self setUI];
}

#pragma mark -- setUI
- (void)setUI
{
    [self.view sd_addSubviews:@[self.bgView, self.tipBgView, self.backBtn, self.backBtn1, self.serviceCenterBtn, self.userCenterBtn, self.shareBtn, self.payBtn, self.emailBtn]];
    
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
    
    _tipBgView.sd_layout.centerXEqualToView(self.view)
    .centerYEqualToView(self.view)
    .widthIs(tipBgW)
    .heightIs(tipBgH);
    
    _backBtn1.sd_layout.topSpaceToView(self.view, isAC ? 50 : 114)
    .rightSpaceToView(self.view, isAC ? 30 : 30)
    .widthIs(40)
    .heightEqualToWidth();
    
    _backBtn.sd_layout.topSpaceToView(_backBtn1, 12)
    .rightSpaceToView(self.view, isAC ? 30 : 30)
    .widthIs(40)
    .heightEqualToWidth();
    
    if (isAC) {
        CGFloat btnX = CGRectGetWidth(self.view.frame) / 2 - 177 - 2;
        _serviceCenterBtn.sd_layout.bottomSpaceToView(self.view, 50)
        .leftSpaceToView(self.view, btnX)
        .widthIs(177)
        .heightIs(46);
        
        _userCenterBtn.sd_layout.bottomSpaceToView(self.view, 50)
        .leftSpaceToView(self.view, btnX + 177 + 4)
        .widthIs(177)
        .heightIs(46);
        
        _shareBtn.sd_layout.bottomSpaceToView(_serviceCenterBtn, 10)
        .rightEqualToView(_serviceCenterBtn)
        .widthIs(167)
        .heightIs(46);
        
        if ([Tool sharedSDK].isAudit) {
            _emailBtn.sd_layout.bottomSpaceToView(_userCenterBtn, 10)
            .leftEqualToView(_userCenterBtn)
            .widthIs(167)
            .heightIs(46);
            
        }else{
            _payBtn.sd_layout.bottomSpaceToView(_userCenterBtn, 10)
            .leftEqualToView(_userCenterBtn)
            .widthIs(167)
            .heightIs(46);
            
            _emailBtn.sd_layout.bottomSpaceToView(_shareBtn, 10)
            .rightEqualToView(_serviceCenterBtn)
            .widthIs(167)
            .heightIs(46);
        }
        
    } else {
        _userCenterBtn.sd_layout.bottomSpaceToView(self.view, 70)
        .centerXEqualToView(self.view)
        .widthIs(215)
        .heightIs(44);
        
        _serviceCenterBtn.sd_layout.bottomSpaceToView(self.view, 120)
        .centerXEqualToView(self.view)
        .widthIs(215)
        .heightIs(44);
        
        _shareBtn.sd_layout.bottomSpaceToView(self.view, 170)
        .centerXEqualToView(self.view)
        .widthIs(215)
        .heightIs(44);
        
        if ([Tool sharedSDK].isAudit) {
            _emailBtn.sd_layout.bottomSpaceToView(self.view, 220)
            .centerXEqualToView(self.view)
            .widthIs(215)
            .heightIs(44);
            
        }else{
            _payBtn.sd_layout.bottomSpaceToView(self.view, 220)
            .centerXEqualToView(self.view)
            .widthIs(215)
            .heightIs(44);
            
            _emailBtn.sd_layout.bottomSpaceToView(self.view, 270)
            .centerXEqualToView(self.view)
            .widthIs(215)
            .heightIs(44);
        }
    }
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
    UIViewController *vc = self.navigationController.childViewControllers[1];
    [self.navigationController popToViewController:vc animated:YES];
}

- (void)backBtnAction1
{
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)tapAction:(UITapGestureRecognizer *)tap
{
    [self imagePicker];
}

- (void)userBtnAction
{
    if ([CHUtility sharedManager].isOS) {
        [[RXOSUIKitService sharedSDK] userCenterWithConfig:nil complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            if (!error) {
                NSString *type = response[@"type"];
                if ([type isEqualToString:@"switch_user"]) {
                    [self.navigationController popViewControllerAnimated:YES];
                }
            }
        }];
    } else {
        [[RXUIKitService sharedSDK] userCenterWithConfig:nil complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            if (!error) {
                NSString *type = response[@"type"];
                if ([type isEqualToString:@"switch_user"]) {
                    [self.navigationController popViewControllerAnimated:YES];
                }
            }
        }];
    }
}

- (void)serviceBtnAction
{
    if ([CHUtility sharedManager].isOS) {
        [[RXOSUIKitService sharedSDK] serviceCenterWithConfig:nil complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                    
        }];
    } else {
        RXUserCenterConfig *config = [[RXUserCenterConfig alloc] init];
        [[RXUIKitService sharedSDK] serviceCenterWithConfig:config complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {

        }];
    }
}

- (void)shareBtnAction{
    if ([CHUtility sharedManager].isDebug) {
        RXSelectShareViewController *shareVC = [[RXSelectShareViewController alloc] init];
        [self.navigationController pushViewController:shareVC animated:YES];
    }else{
        RXShareViewController *vc = [[RXShareViewController alloc] init];
        [self.navigationController pushViewController:vc animated:YES];
    }
}

- (void)payBtnAction{
    if ([CHUtility sharedManager].isDebug) {
        RXSelectPayViewController *payVC = [[RXSelectPayViewController alloc] init];
        [self.navigationController pushViewController:payVC animated:YES];
    }else{
        RXPayViewController *vc = [[RXPayViewController alloc] init];
        [self.navigationController pushViewController:vc animated:YES];
    }
}

- (void)emailBtnAction{
    if ([CHUtility sharedManager].isDebug) {
        [[RXOSUIKitService sharedSDK] showEmailViewWithCpUserId:@"442132347" withComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            
        }];
    }else{
        [[RXOSUIKitService sharedSDK] showEmailViewWithCpUserId:@"442132347" withComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            
        }];
    }
}

#pragma mark -- lazy
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

- (UIButton *)backBtn1
{
    if (!_backBtn1) {
        _backBtn1 = [UIButton buttonWithType:UIButtonTypeCustom];
        [_backBtn1 setImage:kImageNamed(@"hall_back") forState:normal];
        [_backBtn1 addTarget:self action:@selector(backBtnAction1) forControlEvents:UIControlEventTouchUpInside];
    }
    return _backBtn1;
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

- (UIButton *)serviceCenterBtn
{
    if (!_serviceCenterBtn) {
        _serviceCenterBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_serviceCenterBtn setTitle:@"帮助中心" forState:normal];
        _serviceCenterBtn.titleLabel.font = [UIFont systemFontOfSize:18];
        [_serviceCenterBtn setTitleColor:[UIColor colorWithHexString:@"#F4F4F4"] forState:normal];
        if ([Tool sharedSDK].interface == 1) {
            [_serviceCenterBtn setBackgroundImage:kImageNamed(@"hall_left") forState:normal];
        } else {
            [_serviceCenterBtn setBackgroundImage:kImageNamed(@"login_normal") forState:normal];
        }
        [_serviceCenterBtn addTarget:self action:@selector(serviceBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _serviceCenterBtn;
}

- (UIButton *)userCenterBtn
{
    if (!_userCenterBtn) {
        _userCenterBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_userCenterBtn setTitle:@"用户中心" forState:normal];
        _userCenterBtn.titleLabel.font = [UIFont systemFontOfSize:18];
        [_userCenterBtn setTitleColor:[UIColor colorWithHexString:@"#F4F4F4"] forState:normal];
        if ([Tool sharedSDK].interface == 1) {
            [_userCenterBtn setBackgroundImage:kImageNamed(@"hall_right") forState:normal];
        } else {
            [_userCenterBtn setBackgroundImage:kImageNamed(@"login_normal") forState:normal];
        }
        [_userCenterBtn addTarget:self action:@selector(userBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _userCenterBtn;
}

- (UIButton *)shareBtn{
    if (!_shareBtn) {
        _shareBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_shareBtn setTitle:@"分享方式" forState:normal];
        _shareBtn.titleLabel.font = [UIFont systemFontOfSize:18];
        [_shareBtn setTitleColor:[UIColor colorWithHexString:@"#F4F4F4"] forState:normal];
        if ([Tool sharedSDK].interface == 1) {
            [_shareBtn setBackgroundImage:kImageNamed(@"login_normal") forState:normal];
        } else {
            [_shareBtn setBackgroundImage:kImageNamed(@"login_normal") forState:normal];
        }
        [_shareBtn addTarget:self action:@selector(shareBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _shareBtn;
}

- (UIButton *)payBtn{
    if (!_payBtn) {
        _payBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_payBtn setTitle:@"支付方式" forState:normal];
        _payBtn.titleLabel.font = [UIFont systemFontOfSize:18];
        [_payBtn setTitleColor:[UIColor colorWithHexString:@"#F4F4F4"] forState:normal];
        if ([Tool sharedSDK].interface == 1) {
            [_payBtn setBackgroundImage:kImageNamed(@"login_normal") forState:normal];
        } else {
            [_payBtn setBackgroundImage:kImageNamed(@"login_normal") forState:normal];
        }
        [_payBtn addTarget:self action:@selector(payBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _payBtn;
}

- (UIButton *)emailBtn{
    if (!_emailBtn) {
        _emailBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_emailBtn setTitle:@"访问邮箱" forState:normal];
        _emailBtn.titleLabel.font = [UIFont systemFontOfSize:18];
        [_emailBtn setTitleColor:[UIColor colorWithHexString:@"#F4F4F4"] forState:normal];
        if ([Tool sharedSDK].interface == 1) {
            [_emailBtn setBackgroundImage:kImageNamed(@"login_normal") forState:normal];
        } else {
            [_emailBtn setBackgroundImage:kImageNamed(@"login_normal") forState:normal];
        }
        [_emailBtn addTarget:self action:@selector(emailBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _emailBtn;
}

@end
