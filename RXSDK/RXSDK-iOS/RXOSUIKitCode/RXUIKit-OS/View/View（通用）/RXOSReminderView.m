//
//  RXOSReminderView.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/3/21.
//

#import "RXOSReminderView.h"
#import "RXOSCommonTool.h"

@interface RXOSReminderView ()

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UILabel *desLbl;
@property (nonatomic, strong) UIButton *confirmBtn;
@property (nonatomic, strong) UIButton *cancelBtn;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, strong) NSString *desStr; // 描述文字
@property (nonatomic, strong) NSString *titleStr; // 标题
@property (nonatomic, copy) ConfirmBlock confirmBlock;

@end

@implementation RXOSReminderView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithDesStr:(NSString *)desStr
                         title:(NSString *)title
                      complete:(ConfirmBlock)complete
{
    self = [super initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXOSCommonTool getInterfaceOrientation];
        self.desStr = desStr;
        self.titleStr = title;
        self.confirmBlock = complete;
        
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
    UIDevice *device = [UIDevice currentDevice];
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
    [RXOSCommonTool transformWithView:self.bgView];
    [UIView animateWithDuration:0.1 animations:^{
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        
        [RXOSCommonTool showWithAnimate:self.bgView];
        
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
    
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.desLbl];
    [self.bgView addSubview:self.confirmBtn];
    [self.bgView addSubview:self.cancelBtn];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    CGFloat bgW = [RXOSCommonTool getScreenWidth];
    CGFloat bgH = RXAC ? 179 : 179;

    _bgView.frame = CGRectMake(0, CGRectGetHeight(window.frame), bgW, bgH);
    _bgView.center = window.center;
    
    _titleLbl.frame = CGRectMake(0, 21, CGRectGetWidth(_bgView.frame), 24);
    
    _desLbl.frame = CGRectMake(RXAC ? 29 : 25, CGRectGetMaxY(_titleLbl.frame) + 18, CGRectGetWidth(_bgView.frame) - (RXAC ? 58 : 50), 20);
    
//    _confirmBtn.frame = CGRectMake(0, CGRectGetMaxY(_desLbl.frame) + 26, 132, 40);
    _cancelBtn.frame = CGRectMake(RXAC ? 29 : 25, CGRectGetHeight(_bgView.frame) - 27 - 43, RXAC ? 156 : 143, 43);
    
    _confirmBtn.frame = CGRectMake(CGRectGetWidth(_bgView.frame) - CGRectGetWidth(_cancelBtn.frame) - (RXAC ? 29 : 25), CGRectGetMinY(_cancelBtn.frame), CGRectGetWidth(_cancelBtn.frame), CGRectGetHeight(_cancelBtn.frame));
    
    [self layoutSubviews];
}

#pragma mark -- <actions>
- (void)confirmBtnAction
{
    if (self.confirmBlock) {
        self.confirmBlock();
    }
    [self hide];
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor whiteColor];
        _bgView.layer.cornerRadius = 5;
    }
    return _bgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = self.titleStr;
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.font = [UIFont systemFontOfSize:21 weight:UIFontWeightMedium];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UILabel *)desLbl
{
    if (!_desLbl) {
        _desLbl = [[UILabel alloc] init];
        _desLbl.textColor = [UIColor colorWithHexString:@"282828"];
        _desLbl.numberOfLines = 0;
        _desLbl.text = self.desStr;
        _desLbl.font = [UIFont systemFontOfSize:15 weight:UIFontWeightRegular];
        _desLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _desLbl;
}

- (UIButton *)confirmBtn
{
    if (!_confirmBtn) {
        _confirmBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_confirmBtn setBackgroundColor:[UIColor colorWithHexString:@"#20C0B3"]];
        [_confirmBtn setTitle:[RXLocation osLaunguage:@"确认"] forState:UIControlStateNormal];
        [_confirmBtn setTitleColor:[UIColor colorWithHexString:@"#F2FFFB"] forState:UIControlStateNormal];
        _confirmBtn.titleLabel.font = [UIFont systemFontOfSize:18 weight:UIFontWeightMedium];
        [_confirmBtn addTarget:self action:@selector(confirmBtnAction) forControlEvents:UIControlEventTouchUpInside];
        
        _confirmBtn.layer.cornerRadius = 5;
    }
    return _confirmBtn;
}

- (UIButton *)cancelBtn
{
    if (!_cancelBtn) {
        _cancelBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_cancelBtn addTarget:self action:@selector(hide) forControlEvents:UIControlEventTouchUpInside];
        [_cancelBtn setTitle:[RXLocation osLaunguage:@"取消"] forState:UIControlStateNormal];
        _cancelBtn.titleLabel.font = [UIFont systemFontOfSize:18 weight:UIFontWeightMedium];
        [_cancelBtn setTitleColor:[UIColor colorWithHexString:@"20C0B3"] forState:UIControlStateNormal];
        
        _cancelBtn.layer.borderColor = [UIColor colorWithHexString:@"20C0B3"].CGColor;
        _cancelBtn.layer.borderWidth = 1;
        _cancelBtn.layer.cornerRadius = 5;
    }
    return _cancelBtn;
}

@end

