//
//  RXDestroyAccountView.m
//  RXSDK
//
//  Created by 陈汉 on 2021/12/20.
//

#import "RXDestroyAccountView.h"
#import "RXCommonTool.h"

@interface RXDestroyAccountView ()

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *desLbl;
@property (nonatomic, strong) UIButton *button1;
@property (nonatomic, strong) UIButton *button2;
@property (nonatomic, strong) UIButton *closeBtn;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, assign) DestroyType desType;
@property (nonatomic, strong) NSString *reason;  // 拒绝理由
@property (nonatomic, copy) DestroyClickBlock clickBlock;

@end

@implementation RXDestroyAccountView

- (instancetype)initWithType:(DestroyType)type reason:(NSString *)reason clickBlock:(DestroyClickBlock)clickBlock
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXCommonTool getInterfaceOrientation];
        self.clickBlock = clickBlock;
        self.desType = type;
        self.reason = reason;
        
        [self setUI];
        [self show];
        
        // 监听屏幕旋转（横竖屏）
//        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDeviceOrientationDidChange)
//                             name:UIDeviceOrientationDidChangeNotification
//                                                       object:nil];
    }
    return self;
}

- (BOOL)onDeviceOrientationDidChange{
    //获取当前设备Device
    UIDevice *device = [UIDevice currentDevice] ;
    //识别当前设备的旋转方向
    switch (device.orientation) {
        case UIDeviceOrientationLandscapeLeft:
            NSLog(@"屏幕向左橫置");
            self.orientation = 2;
            [self layoutViews];
            break;

        case UIDeviceOrientationLandscapeRight:
            NSLog(@"屏幕向右橫置");
            self.orientation = 2;
            [self layoutViews];
            break;

        case UIDeviceOrientationPortrait:
            NSLog(@"屏幕直立");
            self.orientation = 1;
            [self layoutViews];
            break;

        case UIDeviceOrientationPortraitUpsideDown:
            NSLog(@"屏幕直立，上下顛倒");
            self.orientation = 1;
            [self layoutViews];
            break;

        default:
            NSLog(@"无法识别");
            break;
    }
    return YES;
}

- (void)show
{
    [UIView animateWithDuration:0.15 animations:^{
        UIView *window = [UIApplication sharedApplication].keyWindow;
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.6];

        self.bgView.sd_layout.bottomSpaceToView(self, window.frame.size.height / 2 - 226 / 2);
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [UIView animateWithDuration:0.15 animations:^{
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        self.bgView.sd_layout.bottomSpaceToView(self, -226);
        [self layoutSubviews];
    }];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.15 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [self removeFromSuperview];
    });
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self sd_addSubviews:@[self.bgView]];
    [self.bgView sd_addSubviews:@[self.desLbl, self.button1, self.button2, self.closeBtn]];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    CGFloat bgW = 335;
    CGFloat bgH = 226;
    
    _bgView.sd_layout.centerXEqualToView(window)
    .bottomSpaceToView(self, -bgH)
    .widthIs(bgW)
    .heightIs(bgH);
    
    _desLbl.sd_layout.topSpaceToView(self.bgView, 20)
    .leftSpaceToView(self.bgView, 20)
    .rightSpaceToView(self.bgView, 20)
    .heightIs(150);
    
    if (self.desType == DestroyType_refuse) {
        _button1.sd_layout.bottomSpaceToView(self.bgView, 12)
        .centerXEqualToView(self.bgView)
        .widthIs(142)
        .heightIs(40);
    } else {
        _button1.sd_layout.bottomSpaceToView(self.bgView, 12)
        .leftSpaceToView(self.bgView, 20)
        .widthIs(142)
        .heightIs(40);
    }

    _button2.sd_layout.bottomEqualToView(self.button1)
    .leftSpaceToView(self.button1, 10)
    .widthIs(142)
    .heightIs(40);
    
    _closeBtn.sd_layout.topSpaceToView(self.bgView, 12)
    .rightSpaceToView(self.bgView, 8)
    .widthIs(30)
    .heightEqualToWidth();
    
    [self layoutSubviews];
}

#pragma mark -- <actions>
- (void)buttonAction1
{
    [[RXDestroyAccountService sharedSDK] repealDestroyAccountWithComplete:^(NSDictionary * _Nullable response, RXCommonRequestError * _Nullable error) {
        ToastView *toast = [[ToastView alloc] init];
        NSString *msg;
        if ([response[@"code"] integerValue] == 0) {
            msg = @"撤销注销成功";
        } else {
            msg = error.responesObject[@"msg"];
        }
        [toast showWithTitle:msg andY:__MainScreen_Height / 2];
        [self hide];
    }];
}

- (void)buttonAction2
{
    [self hide];
}

- (void)closeBtnAction
{
    [self hide];
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor colorWithHexString:@"fafafa"];
//        _bgView.backgroundColor = [UIColor redColor];
        _bgView.layer.cornerRadius = 6;
    }
    return _bgView;
}

- (UILabel *)desLbl
{
    if (!_desLbl) {
        _desLbl = [[UILabel alloc] init];
        NSString *text;
        if (self.desType == DestroyType_unRepeal || self.desType == DestroyType_repeal) {
            text = @"    尊敬的玩家，该账号已提交注销申请，请您不要登录和使用该账号，以确保注销的顺利完成，如需撤销注销申请，请点击下方按钮进行撤销操作。";
        } else {
            text = [NSString stringWithFormat:@"尊敬的玩家，您提交的注销申请被拒绝。\n拒绝理由：%@", self.reason];
        }
        _desLbl.text = text;
        _desLbl.numberOfLines = 0;
        _desLbl.textAlignment = NSTextAlignmentCenter;
        _desLbl.font = [UIFont systemFontOfSize:16];
    }
    return _desLbl;
}

- (UIButton *)button1
{
    if (!_button1) {
        _button1 = [UIButton buttonWithType:UIButtonTypeCustom];
        NSString *title = @"撤销注销";
        if (self.desType == DestroyType_unRepeal) {
            _button1.userInteractionEnabled = NO;
            [_button1 setBackgroundImage:[UIImage bundleImageNamed:@"btnBg_unSelect"] forState:UIControlStateNormal];
        } else if (self.desType == DestroyType_repeal) {
            _button1.userInteractionEnabled = YES;
            [_button1 setBackgroundImage:[UIImage bundleImageNamed:@"btnBg2"] forState:UIControlStateNormal];
        } else if (self.desType == DestroyType_refuse) {
            title = @"知道了";
        }
        [_button1 setTitle:title forState:UIControlStateNormal];
        [_button1 setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _button1.titleLabel.font = [UIFont systemFontOfSize:16];
        [_button1 addTarget:self action:@selector(buttonAction1) forControlEvents:UIControlEventTouchUpInside];
    }
    return _button1;
}

- (UIButton *)button2
{
    if (!_button2) {
        _button2 = [UIButton buttonWithType:UIButtonTypeCustom];
        if (self.desType == DestroyType_refuse) {
            _button2.hidden = YES;
        }
        [_button2 setBackgroundImage:[UIImage bundleImageNamed:@"btnBg1"] forState:UIControlStateNormal];
        [_button2 setTitle:@"继续登录" forState:UIControlStateNormal];
        [_button2 setTitleColor:[UIColor colorWithHexString:@"31B14E"] forState:UIControlStateNormal];
        _button2.titleLabel.font = [UIFont systemFontOfSize:16];
        [_button2 addTarget:self action:@selector(buttonAction2) forControlEvents:UIControlEventTouchUpInside];
    }
    return _button2;
}

- (UIButton *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_closeBtn setImage:[UIImage bundleImageNamed:@"close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(closeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

@end
