//
//  RXSelectShareViewController.m
//  RXSDKDemo-Public
//
//  Created by root11 on 2024/6/24.
//

#import "RXSelectShareViewController.h"
#import "RXShareViewController.h"
#import "RXSharePlatformViewController.h"
#import "CHMarco.h"

@interface RXSelectShareViewController ()
@property (nonatomic, strong) UIButton *settedBtn;
@property (nonatomic, strong) UIButton *customBtn;

@end

@implementation RXSelectShareViewController

- (void)viewWillDisappear:(BOOL)animated{
    [super viewWillDisappear:animated];
    self.navigationController.navigationBar.hidden = YES;
}

- (void)viewWillAppear:(BOOL)animated{
    [super viewDidAppear:animated];
    self.navigationController.navigationBar.hidden = NO;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    [self setUI];
}

- (void)setUI{
    //navigation
    self.navigationController.navigationBar.tintColor = [UIColor blackColor];
    self.title = @"请选择分享示例类型";
    self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"back_black"] style:UIBarButtonItemStylePlain target:self action:@selector(backClick)];
    self.view.backgroundColor = [UIColor whiteColor];
    //btn
    [self.view sd_addSubviews:@[self.settedBtn, self.customBtn]];
    
    if ([Tool sharedSDK].interface == 1) {//横屏
        self.settedBtn.sd_layout.centerXEqualToView(self.view)
            .centerYEqualToView(self.view)
            .widthIs(167)
            .heightIs(46);
        
        self.customBtn.sd_layout.leftEqualToView(self.settedBtn)
            .topSpaceToView(self.settedBtn, 10)
            .widthIs(167)
            .heightIs(46);
    } else {//竖屏
        self.settedBtn.sd_layout.centerXEqualToView(self.view)
            .centerYEqualToView(self.view)
            .widthIs(215)
            .heightIs(44);
        
        self.customBtn.sd_layout.leftEqualToView(self.settedBtn)
            .topSpaceToView(self.settedBtn, 10)
            .widthIs(215)
            .heightIs(44);
    }
    
}

#pragma mark - action
- (void)backClick{
    [self.navigationController popViewControllerAnimated:YES];
}

- (void)settedBtnAction{
    RXShareViewController *vc = [[RXShareViewController alloc] init];
    [self.navigationController pushViewController:vc animated:YES];
}

- (void)customBtnAction{
    RXSharePlatformViewController *vc = [[RXSharePlatformViewController alloc] init];
    [self.navigationController pushViewController:vc animated:YES];
}

#pragma mark - lazy load

- (UIButton *)settedBtn{
    if (!_settedBtn) {
        _settedBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_settedBtn setTitle:@"固定参数分享示例" forState:normal];
        _settedBtn.titleLabel.font = [UIFont systemFontOfSize:18];
        [_settedBtn setTitleColor:[UIColor colorWithHexString:@"#F4F4F4"] forState:normal];
        if ([Tool sharedSDK].interface == 1) {
            [_settedBtn setBackgroundImage:kImageNamed(@"login_normal") forState:normal];
        } else {
            [_settedBtn setBackgroundImage:kImageNamed(@"login_normal") forState:normal];
        }
        [_settedBtn addTarget:self action:@selector(settedBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _settedBtn;
}

- (UIButton *)customBtn{
    if (!_customBtn) {
        _customBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_customBtn setTitle:@"埋点参数分享示例" forState:normal];
        _customBtn.titleLabel.font = [UIFont systemFontOfSize:18];
        [_customBtn setTitleColor:[UIColor colorWithHexString:@"#F4F4F4"] forState:normal];
        if ([Tool sharedSDK].interface == 1) {
            [_customBtn setBackgroundImage:kImageNamed(@"login_normal") forState:normal];
        } else {
            [_customBtn setBackgroundImage:kImageNamed(@"login_normal") forState:normal];
        }
        [_customBtn addTarget:self action:@selector(customBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _customBtn;
}

@end
