//
//  RXDestroyAccountView.m
//  RXSDK
//
//  Created by 陈汉 on 2021/12/20.
//

#import "RXDestroyAccountView.h"

@interface RXDestroyAccountView ()

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UILabel *desLbl;
@property (nonatomic, strong) UIButton *button1;
@property (nonatomic, strong) UIButton *button2;
@property (nonatomic, strong) UIButton *closeBtn;
@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, assign) DestroyType desType;
@property (nonatomic, strong) NSString *reason;  // 拒绝理由
@property (nonatomic, strong) NSString *btnTitle;  // 自定义按钮标题
@property (nonatomic, copy) DestroyClickBlock clickBlock;
@property (nonatomic, copy) DIYDestroyClickBlock diyClickBlock;
@property (nonatomic, assign) BOOL isDIY;

@end

@implementation RXDestroyAccountView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithType:(DestroyType)type reason:(NSString *)reason clickBlock:(DestroyClickBlock)clickBlock
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXUICommonTool getInterfaceOrientation];
        self.clickBlock = clickBlock;
        self.desType = type;
        self.reason = reason;
        self.isDIY = NO;
        
        [self setUI];
        [self show];
        
        // 监听屏幕旋转（横竖屏）
//        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onDeviceOrientationDidChange)
//                             name:UIDeviceOrientationDidChangeNotification
//                                                       object:nil];
    }
    return self;
}

- (instancetype)initWithBtnTitle:(NSString *)btnTitle reason:(NSString *)reason diyClickBlock:(DIYDestroyClickBlock)diyClickBlock
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXUICommonTool getInterfaceOrientation];
        self.diyClickBlock = diyClickBlock;
        self.btnTitle = btnTitle;
        self.reason = reason;
        self.isDIY = YES;
        
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
    [RXUICommonTool transformWithView:self.bgView];
    [UIView animateWithDuration:0.1 animations:^{
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        [RXUICommonTool showWithAnimate:self.bgView];

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
    [self.bgView addSubview:self.button1];
    [self.bgView addSubview:self.button2];
    [self.bgView addSubview:self.closeBtn];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    CGFloat bgW = [RXUICommonTool getScreenWidth];
    CGFloat bgH = RXAC ? 259 : 282;
    
    _bgView.frame = CGRectMake(0, 0, bgW, bgH);
    _bgView.center = window.center;
    
    _titleLbl.frame = CGRectMake(0, 21, bgW, 24);
    
    _desLbl.frame = CGRectMake(RXAC ? 29 : 25, CGRectGetMaxY(_titleLbl.frame) + 18, bgW - (RXAC ? 58 : 50), 86);

    _button1.frame = CGRectMake(RXAC ? 29 : 25, bgH - (RXAC ? 27 + 43 : 25 + 48), RXAC ? 146 : 143, RXAC ? 43 : 48);
    
    _button2.frame = CGRectMake(bgW - (RXAC ? 146 + 29 : 143 + 25), CGRectGetMinY(_button1.frame), CGRectGetWidth(_button1.frame), CGRectGetHeight(_button1.frame));
    
    _closeBtn.frame = CGRectMake(bgW - 40, 16, 16, 16);
    
    [self layoutSubviews];
}

#pragma mark -- <actions>
- (void)buttonAction1
{
    [[RXDestroyAccountService sharedSDK] repealDestroyAccountWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        NSString *msg;
        if ([response[@"code"] integerValue] == 0) {
//            msg = @"撤销注销成功";
            // 撤销注销后修改位运算，flag第六位改为0
            NSMutableDictionary *loginData = [NSMutableDictionary dictionaryWithDictionary:[RXUIUserUtility sharedManager].loginData];
            int flag = [loginData[@"flag"] intValue];
            flag = flag & ~(1 << 5);
            
            [loginData setValue:@(flag) forKey:@"flag"];
            [RXUIUserUtility sharedManager].loginData = loginData;
            
        } else {
            msg = error.responesObject[@"msg"];
            [RXHUD showErrorText:msg];
        }
        
        
        if (self.isDIY) {
            if (self.diyClickBlock) {
                self.diyClickBlock(@"撤销注销");
            }
        } else {
            if (self.clickBlock) {
                self.clickBlock(DestroyClickType_repeal);
            }
        }
        
        [self hide];
    }];
}

- (void)buttonAction2
{
    if (self.isDIY) {
        if (self.diyClickBlock) {
            self.diyClickBlock(self.btnTitle);
        }
    } else {
        if (self.clickBlock) {
            DestroyClickType clickType = DestroyClickType_normal;
            
            RXLoginUIConfig *config = [RXUIUserUtility sharedManager].loginConfig;
            clickType = DestroyClickType_login;
            if ([config.deregisterType isEqualToString:@"logout"] || [self.deregisterType isEqualToString:@"logout"]) {
                clickType = DestroyClickType_logout;
            }
            
            self.clickBlock(clickType);
        }
    }
   
    [self hide];
}

- (void)closeBtnAction
{
    [self hide];
}

- (void)setDeregisterType:(NSString *)deregisterType
{
    NSString *title = @"继续登录";
    if ([deregisterType isEqualToString:@"logout"]) {
        title = @"退出登录";
    }
    
    _deregisterType = deregisterType;
    
    [_button2 setTitle:title forState:UIControlStateNormal];
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor colorWithHexString:@"fafafa"];
//        _bgView.backgroundColor = [UIColor redColor];
        _bgView.layer.cornerRadius = 5;
    }
    return _bgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.text = @"已提交注销申请";
        _titleLbl.font = [UIFont systemFontOfSize:21 weight:UIFontWeightMedium];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UILabel *)desLbl
{
    if (!_desLbl) {
        _desLbl = [[UILabel alloc] init];
        NSString *text;
        if (self.desType == DestroyType_unRepeal || self.desType == DestroyType_repeal) {
            text = @"尊敬的玩家，该账号已提交注销申请，请您不要登录和使用该账号，以确保注销的顺利完成，如需撤销注销申请，请点击下方按钮进行撤销操作。";
        } else {
            text = [NSString stringWithFormat:@"尊敬的玩家，您提交的注销申请被拒绝。\n拒绝理由：%@", self.reason];
        }
        _desLbl.text = text;
        _desLbl.numberOfLines = 0;
        _desLbl.textColor = [UIColor blackColor];
//        _desLbl.textAlignment = NSTextAlignmentCenter;
        _desLbl.font = [UIFont systemFontOfSize:15 weight:UIFontWeightRegular];
    }
    return _desLbl;
}

- (UIButton *)button1
{
    if (!_button1) {
        _button1 = [UIButton buttonWithType:UIButtonTypeCustom];
        NSString *title = @"撤销注销";

        
        if (self.isDIY) {
            _button1.userInteractionEnabled = YES;
        } else {
            if (self.desType == DestroyType_unRepeal) {
                _button1.userInteractionEnabled = NO;
                [_button1 setBackgroundImage:[UIImage rxBundleImageNamed:@"btnBg_unSelect"] forState:UIControlStateNormal];
            } else if (self.desType == DestroyType_repeal) {
                _button1.userInteractionEnabled = YES;
                [_button1 setBackgroundImage:[UIImage rxBundleImageNamed:@"btnBg2"] forState:UIControlStateNormal];
            } else if (self.desType == DestroyType_refuse) {
                title = @"知道了";
            }
        }
        
        [_button1 setTitle:title forState:UIControlStateNormal];
        [_button1 setTitleColor:[UIColor colorWithHexString:@"#F2FFFB"] forState:UIControlStateNormal];
        [_button1 setBackgroundColor:[UIColor colorWithHexString:@"#20C0B3"]];
        _button1.titleLabel.font = [UIFont systemFontOfSize:18 weight:UIFontWeightMedium];
        _button1.layer.borderWidth = 1;
        _button1.layer.borderColor = [UIColor colorWithHexString:@"#20C0B3"].CGColor;
        _button1.layer.cornerRadius = 5;
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
//        [_button2 setBackgroundImage:[UIImage rxBundleImageNamed:@"btnBg1"] forState:UIControlStateNormal];
        
        RXLoginUIConfig *config = [RXUIUserUtility sharedManager].loginConfig;
        NSString *title = @"继续登录";
        
        if (self.isDIY) {
            title = self.btnTitle;
        } else {
            if ([config.deregisterType isEqualToString:@"logout"] || [self.deregisterType isEqualToString:@"logout"]) {
                title = @"退出登录";
            }
        }
        
        [_button2 setTitle:title forState:UIControlStateNormal];
        [_button2 setTitleColor:[UIColor colorWithHexString:@"20C0B3"] forState:UIControlStateNormal];
        _button2.titleLabel.font = [UIFont systemFontOfSize:18 weight:UIFontWeightMedium];
        _button2.layer.borderWidth = 1;
        _button2.layer.borderColor = [UIColor colorWithHexString:@"#20C0B3"].CGColor;
        _button2.layer.cornerRadius = 5;
        [_button2 addTarget:self action:@selector(buttonAction2) forControlEvents:UIControlEventTouchUpInside];
    }
    return _button2;
}

- (UIButton *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_closeBtn setImage:[UIImage rxBundleImageNamed:@"close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(closeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

@end
