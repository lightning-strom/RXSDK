//
//  RXPriView.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/2/14.
//

#import "RXPriView.h"
#import "RXPrivacyView.h"
#import "RXUICommonTool.h"
#import "RXAttributeLabel.h"
#import "RXCommonWKWebView.h"

@interface RXPriView () <RXAttributeLabelDelegate>

@property (nonatomic, assign) NSInteger orientation;  // 屏幕方向 1竖屏 2横屏
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) RXAttributeLabel *desLbl;
@property (nonatomic, strong) UIButton *closeBtn;
@property (nonatomic, strong) UIButton *agreeBtn;
@property (nonatomic, strong) UIButton *cancelBtn;

@end

@implementation RXPriView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)init
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.orientation = [RXUICommonTool getInterfaceOrientation];
        
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

#pragma mark -- <setUI>
- (void)setUI
{
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.closeBtn];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.desLbl];
    [self.bgView addSubview:self.cancelBtn];
    [self.bgView addSubview:self.agreeBtn];
    
    [self layoutViews];
}

- (void)layoutViews
{
    
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    _bgView.frame = CGRectMake(0, 0, [RXUICommonTool getScreenWidth], RXAC ? 198 : 195);
    _bgView.center = window.center;
    
    _titleLbl.frame = CGRectMake(0, 21, CGRectGetWidth(_bgView.frame), 24);
    
    CGFloat desY = CGRectGetMaxY(_titleLbl.frame) + 20;
    if ([RXUIUserUtility sharedManager].privacieTitles.count >= 3) {
        desY -= 9;
    }
    _desLbl.frame = CGRectMake(RXAC ? 29 : 25, RXAC ? desY : desY - 5, CGRectGetWidth(_bgView.frame) - (RXAC ? 58 : 50) + 10, 48);
        
    _closeBtn.frame = CGRectMake(304, 20, 16, 16);
    
    _cancelBtn.frame = CGRectMake(RXAC ? 29 : 25, CGRectGetHeight(_bgView.frame) - (RXAC ? 43 + 29 : 43 + 25), RXAC ? 146 : 143, RXAC ? 43 : 43);
    
    _agreeBtn.frame = CGRectMake(CGRectGetWidth(_bgView.frame) - (RXAC ? CGRectGetWidth(_cancelBtn.frame) + 29 : CGRectGetWidth(_cancelBtn.frame) + 25), CGRectGetMinY(_cancelBtn.frame), CGRectGetWidth(_cancelBtn.frame), CGRectGetHeight(_cancelBtn.frame));
    
    [self layoutSubviews];
}

- (void)show
{
    self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
    [RXUICommonTool showWithAnimate:self.bgView animate:NO];
    
    [self layoutSubviews];
//    [RXUICommonTool transformWithView:self.bgView];
//    [UIView animateWithDuration:0.1 animations:^{
//        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
//        
//        [RXUICommonTool showWithAnimate:self.bgView];
//        
//        [self layoutSubviews];
//    }];
}

- (void)hide
{
//    [UIView animateWithDuration:0.1 animations:^{
//        UIView *window = [UIApplication sharedApplication].keyWindow;
//        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
//        self.bgView.sd_layout.topSpaceToView(self, window.frame.size.height);
//        [self layoutSubviews];
//    }];
//
//    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.15 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
    
//    });
}

#pragma mark -- <actions>
- (void)agreeBtnAction
{
    if (self.isQuickLogin) {
        if (self.quickAgreeBlock) {
            self.quickAgreeBlock();
        }
    } else {
        if (self.agreeBlock) {
            self.agreeBlock();
        }
    }

    [self hide];
}

#pragma mark -- <RXAttributeLabelDelegate>
- (void)rxAttributeClick:(NSString *)text offset:(NSInteger)offset
{
    NSString *url = @"";
    NSArray *privacies = [RXUIUserUtility sharedManager].privacies;
    NSArray *privacieTitles = [RXUIUserUtility sharedManager].privacieTitles;
    
    if (privacieTitles.count > 0) {
        for (int i = 0; i < privacieTitles.count; i++) {
            if ([text isEqualToString:privacieTitles[i]]) {
                if (privacies && privacies.count > 0) {
                    NSString *title = privacieTitles[i];
                    title = [title stringByReplacingOccurrencesOfString:@"《" withString:@""];
                    title = [title stringByReplacingOccurrencesOfString:@"》" withString:@""];
                    RXCommonWKWebView *webView = [[RXCommonWKWebView alloc] initWithUrl:privacies[i] title:title content:nil];
                }
            }
        }
    } else {
        if ([text isEqualToString:@"用户协议"]) {
            if (privacies && privacies.count > 0) {
                url = privacies[0];
                RXCommonWKWebView *webView = [[RXCommonWKWebView alloc] initWithUrl:url title:@"用户协议" content:nil];
            } else {
                NSMutableDictionary *dic = [[NSUserDefaults standardUserDefaults] valueForKey:@"rx_legal"];
                NSMutableArray *terms = dic[@"terms"];
                NSString *content = @"";
                for (int i = 0; i < terms.count; i++) {
                    NSMutableDictionary *termInfo = terms[i];
                    NSString *key = termInfo[@"key"];
                    if ([key isEqualToString:@"00001"]) {
                        content = termInfo[@"content"];
                    }
                }
                RXCommonWKWebView *webView = [[RXCommonWKWebView alloc] initWithUrl:nil title:@"用户协议" content:content];
            }
            
        } else if ([text isEqualToString:@"隐私政策"]) {
            if (privacies && privacies.count > 1) {
                url = privacies[1];
                RXCommonWKWebView *webView = [[RXCommonWKWebView alloc] initWithUrl:url title:@"隐私政策" content:nil];
            } else {
                NSMutableDictionary *dic = [[NSUserDefaults standardUserDefaults] valueForKey:@"rx_legal"];
                NSMutableArray *terms = dic[@"terms"];
                NSString *content = @"";
                for (int i = 0; i < terms.count; i++) {
                    NSMutableDictionary *termInfo = terms[i];
                    NSString *key = termInfo[@"key"];
                    if ([key isEqualToString:@"00002"]) {
                        content = termInfo[@"content"];
                    }
                }
                RXCommonWKWebView *webView = [[RXCommonWKWebView alloc] initWithUrl:nil title:@"隐私政策" content:content];
            }
        }
    }
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor whiteColor];
        _bgView.layer.cornerRadius = 4;
    }
    return _bgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = @"用户协议和隐私政策";
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.font = [UIFont systemFontOfSize:21 weight:UIFontWeightMedium];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (RXAttributeLabel *)desLbl
{
    if (!_desLbl) {
        _desLbl = [[RXAttributeLabel alloc] init];
        
        NSArray *privacieTitles = [RXUIUserUtility sharedManager].privacieTitles;
        NSArray *clickTextList = @[@"用户协议", @"隐私政策"];
        NSString *title = @"请确认已阅读并同意";
        if (privacieTitles.count > 0) {
            for (int i = 0; i < privacieTitles.count; i++) {
                if (i == 0) {
                    title = [NSString stringWithFormat:@"%@ %@", title, privacieTitles[i]];
                } else {
                    title = [NSString stringWithFormat:@"%@、%@", title, privacieTitles[i]];
                }
            }
            clickTextList = privacieTitles;
        } else {
            title = @"请确认已阅读并同意 用户协议、隐私政策";
        }
        
        _desLbl.text = title;
        _desLbl.clickTextlist = clickTextList;
        _desLbl.clickTextColor = [UIColor colorWithHexString:@"20C0B3"];
        _desLbl.textColor = [UIColor colorWithHexString:@"000000"];
        _desLbl.delegate = self;
        _desLbl.font = [UIFont systemFontOfSize:15 weight:UIFontWeightRegular];
    }
    return _desLbl;
}

- (UIButton *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        _closeBtn.adjustsImageWhenHighlighted = NO;
        [_closeBtn setImage:[UIImage rxBundleImageNamed:@"rx_close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(hide) forControlEvents:UIControlEventTouchUpInside];
        _closeBtn.hidden = YES;
    }
    return _closeBtn;
}

- (UIButton *)agreeBtn
{
    if (!_agreeBtn) {
        _agreeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_agreeBtn setTitle:@"同意" forState:UIControlStateNormal];
        [_agreeBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        [_agreeBtn setBackgroundColor:[UIColor colorWithHexString:@"#20C0B3"]];
        [_agreeBtn setTitleColor:[UIColor colorWithHexString:@"#F2FFFB"] forState:UIControlStateNormal];
        _agreeBtn.titleLabel.font = [UIFont systemFontOfSize:18 weight:UIFontWeightMedium];
        _agreeBtn.layer.cornerRadius = 4;
        [_agreeBtn addTarget:self action:@selector(agreeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _agreeBtn;
}

- (UIButton *)cancelBtn
{
    if (!_cancelBtn) {
        _cancelBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_cancelBtn setTitle:@"不同意" forState:UIControlStateNormal];
        [_cancelBtn setTitleColor:[UIColor colorWithHexString:@"#20C0B3"] forState:UIControlStateNormal];
        _cancelBtn.titleLabel.font = [UIFont systemFontOfSize:18 weight:UIFontWeightMedium];
        _cancelBtn.layer.borderColor = [UIColor colorWithHexString:@"#20C0B3"].CGColor;
        _cancelBtn.layer.borderWidth = 1;
        _cancelBtn.layer.cornerRadius = 4;
        [_cancelBtn addTarget:self action:@selector(hide) forControlEvents:UIControlEventTouchUpInside];
    }
    return _cancelBtn;
}

@end
