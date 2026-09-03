//
//  RXAntiAddictionView.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/28.
//

#import "RXAntiAddictionView.h"
#import "RXCommonTool.h"

@interface RXAntiAddictionView ()

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UILabel *desLbl;
@property (nonatomic, strong) UIButton *confirmBtn;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, strong) NSString *desStr; // 描述文字
@property (nonatomic, strong) NSString *titleStr; // 标题
@property (nonatomic, assign) AntiBtnType btnType;
@property (nonatomic, copy) AntiBlock block;

@end

@implementation RXAntiAddictionView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithDesStr:(NSString *)desStr
                         title:(NSString *)title
                       btnType:(AntiBtnType)btnType
                         block:(AntiBlock)block
{
    self = [super initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXCommonTool getInterfaceOrientation];
        self.desStr = desStr;
        self.titleStr = title;
        self.btnType = btnType;
        self.block = block;
        
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

        CGFloat desH = [self.desStr heightForFont:self.desLbl.font width:294];
        CGFloat bgH = desH + 150;
        
        self.bgView.sd_layout.bottomSpaceToView(self, window.frame.size.height / 2 - bgH / 2);
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [UIView animateWithDuration:0.15 animations:^{
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        CGFloat desH = [self.desStr heightForFont:self.desLbl.font width:294];
        CGFloat bgH = desH + 150;
        self.bgView.sd_layout.bottomSpaceToView(self, -bgH);
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
    [self.bgView sd_addSubviews:@[self.titleLbl, self.desLbl, self.confirmBtn]];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    // 文字高度
    CGFloat desH = [self.desStr heightForFont:_desLbl.font width:294];
    CGFloat bgH = desH + 150;
    
    _bgView.sd_layout.centerXEqualToView(window)
    .bottomSpaceToView(self, -bgH)
    .widthIs(335)
    .heightIs(bgH);
    
    _titleLbl.sd_layout.topSpaceToView(self.bgView, 22)
    .leftSpaceToView(self.bgView, 0)
    .rightSpaceToView(self.bgView, 0)
    .heightIs(24);
    
    _desLbl.sd_layout.topSpaceToView(self.titleLbl, 20)
    .leftSpaceToView(self.bgView, 20)
    .rightSpaceToView(self.bgView, 20)
    .heightIs(desH);
    
    _confirmBtn.sd_layout.topSpaceToView(self.desLbl, 24)
    .centerXEqualToView(self.bgView)
    .widthIs(142)
    .heightIs(40);
     
    [self layoutSubviews];
}

#pragma mark -- <actions>
- (void)confirmBtnAction
{
//    if (_btnType == AntiBtnType_login) {
//        if (self.block) {
//            self.block();
//        }
//    } else
    if (_btnType == AntiBtnType_logout) {
        exit(0);
    } else {
        if (self.block) {
            self.block();
        }
        [self hide];
    }
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor colorWithHexString:@"fafafa"];
        _bgView.layer.cornerRadius = 6;
    }
    return _bgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = self.titleStr;
        _titleLbl.font = [UIFont boldSystemFontOfSize:20];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UILabel *)desLbl
{
    if (!_desLbl) {
        _desLbl = [[UILabel alloc] init];
        _desLbl.textColor = [UIColor colorWithHexString:@"737373"];
        _desLbl.numberOfLines = 0;
        _desLbl.text = self.desStr;
        _desLbl.font = [UIFont systemFontOfSize:14];
    }
    return _desLbl;
}

- (UIButton *)confirmBtn
{
    if (!_confirmBtn) {
        _confirmBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_confirmBtn setBackgroundImage:[UIImage bundleImageNamed:@"confirmBtnBg"] forState:UIControlStateNormal];
        NSString *title = @"退出游戏";
//        if (self.btnType == AntiBtnType_login) {
//            title = @"进入游戏";
//        } else
        if (self.btnType == AntiBtnType_default) {
            title = @"知道了";
        }
        [_confirmBtn setTitle:title forState:UIControlStateNormal];
        [_confirmBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _confirmBtn.titleLabel.font = [UIFont systemFontOfSize:16];
        [_confirmBtn addTarget:self action:@selector(confirmBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _confirmBtn;
}

@end
