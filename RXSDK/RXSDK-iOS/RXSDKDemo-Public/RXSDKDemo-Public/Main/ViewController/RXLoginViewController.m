//
//  RXLoginViewController.m
//  RXSDKDemo-Public
//
//  Created by root11 on 2024/6/27.
//

#import "RXLoginViewController.h"
#import "ViewController.h"
#import "CHMarco.h"
#import <objc/runtime.h>
#import <RXSDK_Pure/RX_CommonNetworkExcuteManager.h>
#import <RXSDK_Pure/RXConfig.h>

#define SelectViewTag 100000

@interface RXLoginViewController ()<UITextFieldDelegate>

@property (nonatomic, strong) UIButton *startBtn;

@property (nonatomic, strong) UIView *topBgView;
@property (nonatomic, strong) UIImageView *topImageView;
@property (nonatomic, strong) UIButton *backBtn;
@property (nonatomic, strong) UILabel *topTitleLbl;
@property (nonatomic, strong) UILabel *topDesLbl;
@property (nonatomic, strong) UIView *tapDebugView;

@property (nonatomic, strong) UIView *bottomBgView;
@property (nonatomic, strong) UITextField *accountTextField;
@property (nonatomic, strong) UITextField *passwrodTextField;

@end

@implementation RXLoginViewController

- (void)viewWillDisappear:(BOOL)animated{
    [super viewWillDisappear:animated];
    self.navigationController.navigationBar.hidden = YES;
}

- (void)viewWillAppear:(BOOL)animated{
    [super viewDidAppear:animated];
    self.navigationController.navigationBar.hidden = YES;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    [self setUI];
}

#pragma mark -- setUI
- (void)setUI
{
    [self.view sd_addSubviews:@[self.topBgView, self.topImageView,  self.backBtn, self.topTitleLbl, self.topDesLbl, self.bottomBgView]];
    
    _topBgView.sd_layout.topSpaceToView(self.view, 0)
    .leftSpaceToView(self.view, 0)
    .rightSpaceToView(self.view, 0)
    .heightIs(kScaleWidth(150) + kStatusBarHeight);
    
    _topImageView.sd_layout.topSpaceToView(self.view, 50)
    .rightSpaceToView(self.view, 16)
    .widthIs(kScaleWidth(128))
    .heightEqualToWidth();
    
    _backBtn.sd_layout.topSpaceToView(self.view, kScaleWidth(65))
    .leftSpaceToView(self.view, 24)
    .widthIs(18)
    .heightIs(18);
    
    _topTitleLbl.sd_layout.topSpaceToView(self.view, kScaleWidth(63))
    .leftSpaceToView(_backBtn, 8)
    .widthIs(200)
    .heightIs(22);
    
    _topDesLbl.sd_layout.topSpaceToView(_topTitleLbl, 8)
    .leftEqualToView(_topTitleLbl)
    .widthIs(200)
    .heightIs(16);
    
    _bottomBgView.sd_layout.topSpaceToView(_topBgView, -15)
    .bottomSpaceToView(self.view, 0)
    .leftSpaceToView(self.view, 0)
    .rightSpaceToView(self.view, 0);
    
    [_bottomBgView addSubview:self.startBtn];
    [_bottomBgView addSubview:self.accountTextField];
    [_bottomBgView addSubview:self.passwrodTextField];
    
    UIView *lineView1 = [[UIView alloc] init];
    lineView1.backgroundColor = [UIColor colorWithHexString:@"#EAEAEA"];
    
    UIView *lineView2 = [[UIView alloc] init];
    lineView2.backgroundColor = [UIColor colorWithHexString:@"#EAEAEA"];
    
    [_bottomBgView addSubview:lineView1];
    [_bottomBgView addSubview:lineView2];
    
    _accountTextField.sd_layout.topSpaceToView(_bottomBgView, kScaleWidth(10))
    .leftSpaceToView(_bottomBgView, kScaleWidth(30))
    .rightSpaceToView(_bottomBgView, kScaleWidth(30))
    .heightIs(60);
    
    lineView1.sd_layout.topSpaceToView(_accountTextField, 0)
    .leftEqualToView(_accountTextField)
    .rightEqualToView(_accountTextField)
    .heightIs(1);
    
    _passwrodTextField.sd_layout.topSpaceToView(_accountTextField, kScaleWidth(10))
    .leftSpaceToView(_bottomBgView, kScaleWidth(30))
    .rightSpaceToView(_bottomBgView, kScaleWidth(30))
    .heightIs(60);
    
    lineView2.sd_layout.topSpaceToView(_passwrodTextField, 0)
    .leftEqualToView(_passwrodTextField)
    .rightEqualToView(_passwrodTextField)
    .heightIs(1);
    
    _startBtn.sd_layout.topSpaceToView(lineView2, 20)
    .leftSpaceToView(_bottomBgView, 39)
    .rightSpaceToView(_bottomBgView, 39)
    .heightIs(54);
    
    [self.view layoutSubviews];
    
    [self.topBgView.layer addSublayer:[UIView setGradualChangingColor:self.topBgView fromColor:[UIColor colorWithHexString:@"#70E1DA"] toColor:[UIColor colorWithHexString:@"#4AC4CE"] gradualType:GradualTypeHorizontal]];
    
    self.bottomBgView.layer.mask = [UIView drawCornerRadiusWithRect:CGRectMake(0, 0, self.bottomBgView.width_sd, self.bottomBgView.height_sd) corners:UIRectCornerTopLeft | UIRectCornerTopRight size:CGSizeMake(15, 15)];
}

#pragma mark -- actions

- (void)backBtnAction
{
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)startBtnAction:(UIButton *)btn
{
    NSMutableDictionary *paramDict = [NSMutableDictionary dictionary];
    [paramDict setValue:_accountTextField.text forKey:@"account"];
    [paramDict setValue:[Tool md532BitUpperWithStr:_passwrodTextField.text] forKey:@"password"];
    [paramDict setValue:@"zh" forKey:@"language"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"api/v1/gwapi/login/pwd?" andParams:paramDict requsetMethod:RequestMethod_Post];
    request.baseUrl = @"http://haiqi-test.ruixuecloud.com/";
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        [CHUtility sharedManager].isDebug = YES;
        ViewController *vc = [[ViewController alloc] init];
        [self.navigationController pushViewController:vc animated:YES];
        
    } failure:^(RX_CommonRequestError * _Nullable error) {
        if ([[error.responesObject allKeys] containsObject:@"msg"]) {
            [self.view makeToast:error.responesObject[@"msg"] duration:2.0 position:CSToastPositionCenter];
        }else{
            [self.view makeToast:@"登录失败" duration:2.0 position:CSToastPositionCenter];
        }
        
    }];

    
    
}

#pragma mark -- lazy
- (UIView *)topBgView
{
    if (!_topBgView) {
        _topBgView = [[UIView alloc] init];
    }
    return _topBgView;
}

- (UIImageView *)topImageView
{
    if (!_topImageView) {
        _topImageView = [[UIImageView alloc] init];
        _topImageView.image = kImageNamed(@"main_bg");
    }
    return _topImageView;
}

- (UIButton *)backBtn
{
    if (!_backBtn) {
        _backBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_backBtn setImage:kImageNamed(@"back") forState:UIControlStateNormal];
        [_backBtn addTarget:self action:@selector(backBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _backBtn;
}

- (UILabel *)topTitleLbl
{
    if (!_topTitleLbl) {
        _topTitleLbl = [[UILabel alloc] init];
        _topTitleLbl.textColor = [UIColor whiteColor];
        _topTitleLbl.font = [UIFont boldSystemFontOfSize:32];
        _topTitleLbl.text = @"Welcome";
    }
    return _topTitleLbl;
}

- (UILabel *)topDesLbl
{
    if (!_topDesLbl) {
        _topDesLbl = [[UILabel alloc] init];
        _topDesLbl.textColor = [UIColor whiteColor];
        _topDesLbl.font = [UIFont systemFontOfSize:12];
        _topDesLbl.text = [NSString stringWithFormat:@"version - %@", Version];
    }
    return _topDesLbl;
}

- (UIView *)bottomBgView
{
    if (!_bottomBgView) {
        _bottomBgView = [[UIView alloc] init];
        _bottomBgView.backgroundColor = [UIColor colorWithHexString:@"#F6F5FA"];
    }
    return _bottomBgView;
}

- (UIButton *)startBtn
{
    if (!_startBtn) {
        _startBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_startBtn setTitle:@"登录" forState:UIControlStateNormal];
        _startBtn.titleLabel.font = [UIFont boldSystemFontOfSize:20];
        _startBtn.titleLabel.textColor = [UIColor colorWithHexString:@"#C1C0C7"];
        [_startBtn setBackgroundColor:[UIColor colorWithHexString:@"#70E1DA"]];
        [_startBtn addTarget:self action:@selector(startBtnAction:) forControlEvents:UIControlEventTouchUpInside];
        _startBtn.layer.cornerRadius = 15;
    }
    return _startBtn;
}

- (UITextField *)accountTextField{
    if (!_accountTextField) {
        _accountTextField = [[UITextField alloc] init];
        _accountTextField.delegate = self;
        _accountTextField.borderStyle = UITextBorderStyleNone;
        _accountTextField.backgroundColor = [UIColor clearColor];
        _accountTextField.textColor = [UIColor blackColor];
        _accountTextField.placeholder = @"请输入账号";
        _accountTextField.keyboardType = UIKeyboardTypeASCIICapable;
        _accountTextField.autocorrectionType = UITextAutocorrectionTypeNo;
    }
    return _accountTextField;
}

- (UITextField *)passwrodTextField{
    if (!_passwrodTextField) {
        _passwrodTextField = [[UITextField alloc] init];
        _passwrodTextField.delegate = self;
        _passwrodTextField.borderStyle = UITextBorderStyleNone;
        _passwrodTextField.backgroundColor = [UIColor clearColor];
        _passwrodTextField.textColor = [UIColor blackColor];
        _passwrodTextField.placeholder = @"请输入密码 ";
        _passwrodTextField.keyboardType = UIKeyboardTypeASCIICapable;
        _passwrodTextField.autocorrectionType = UITextAutocorrectionTypeNo;
    }
    return _passwrodTextField;
}

#pragma mark - textfield delegate
- (BOOL)textFieldShouldReturn:(UITextField *)textField{
    [textField resignFirstResponder];
    return YES;
}

#pragma mark - touch
- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event{
    [self.view endEditing:YES];
}

@end
