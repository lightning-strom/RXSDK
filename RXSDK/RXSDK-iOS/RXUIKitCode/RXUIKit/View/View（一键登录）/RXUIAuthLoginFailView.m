//
//  RXUIAuthLoginFailView.m
//  RXUIKit
//
//  Created by 陈汉 on 2024/9/13.
//

#import "RXUIAuthLoginFailView.h"
#import "RXCloseBtn.h"
#import "RXQuickLoginView.h"
#import "RXLoginViewManager.h"

@interface RXUIAuthLoginFailView ()

@property (nonatomic, strong) NSMutableDictionary *loginExt;
@property (nonatomic, strong) RXLoginUIConfig *loginConfig;
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UILabel *contentLbl;
@property (nonatomic, strong) NSString *titleStr;
@property (nonatomic, strong) NSString *contentStr;
@property (nonatomic, strong) RXCloseBtn *closeBtn;
@property (nonatomic, strong) UIImageView *imgView;
@property (nonatomic, strong) UIImageView *arrowImgView;

@end

@implementation RXUIAuthLoginFailView

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (instancetype)initWithConfig:(RXLoginUIConfig *)config
                        titile:(NSString *)title
                       content:(NSString *)content
                    loginEvent:(LoginTypeBlock)loginEvent
                      complete:(LoginComplete)complete
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        self.loginComplete = complete;
        self.loginConfig = config;
        self.loginTypeBlock = [RXUIUserUtility sharedManager].loginTypeBlock;
        self.titleStr = title;
        self.contentStr = content;
        
        NSDictionary *loginExt = [NSDictionary dictionary];
        if (self.loginTypeBlock) {
            loginExt = self.loginTypeBlock(loginExt, LoginTypeAuth);
            self.loginExt = [NSMutableDictionary dictionaryWithDictionary:loginExt];
        }
        
        [self setUI];
        [self show];
        
        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapAction:)];
        [self addGestureRecognizer:tap];
    }
    return self;
}

- (void)tapAction:(UITapGestureRecognizer *)tap
{
    [self hide];
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self addSubview:self.bgView];
    [self.bgView addSubview:self.imgView];
    [self.bgView addSubview:self.closeBtn];
    [self.bgView addSubview:self.titleLbl];
    [self.bgView addSubview:self.contentLbl];
    [self.bgView addSubview:self.arrowImgView];
    
    [self layoutViews];
}

- (void)layoutViews
{
    UIView *window = [UIApplication sharedApplication].keyWindow;
    
    CGFloat bgH = RXAC ? 323 : 360;
  
    _bgView.frame = CGRectMake(0, 0, [RXUICommonTool getScreenWidth], bgH);
    _bgView.center = window.center;
    
    CGFloat imgWH = RXAC ? 134 : 164;
    _imgView.frame = CGRectMake(CGRectGetWidth(_bgView.frame) / 2 - imgWH / 2, RXAC ? 20 : 28, imgWH, imgWH);
    
    _titleLbl.frame = CGRectMake(0, RXAC ? 151 : 188, CGRectGetWidth(_bgView.frame), 20);
    
    _contentLbl.frame = CGRectMake(0, CGRectGetMaxY(_titleLbl.frame) + (RXAC ? 9.5 : 9.5), CGRectGetWidth(_bgView.frame), 14);
    
    _closeBtn.frame = CGRectMake(RXAC ? 323 : 302.5, RXAC ? 13.5 : 11.5, 21, 21);
    
    CGFloat arrorW = RXAC ? 27 : 27;
    CGFloat arrorH = RXAC ? 22 : 22;
    _arrowImgView.frame = CGRectMake(CGRectGetWidth(_bgView.frame) / 2 - arrorW / 2, CGRectGetMaxY(_contentLbl.frame) + (RXAC ? 14.5 : 14.5), arrorW, arrorH);
    
    RXQuickLoginView *quickLoginView = [[RXQuickLoginView alloc] initWithLoginConfig:self.loginConfig viewType:RXUserType_auth loginEvent:self.loginTypeBlock complete:self.loginComplete];
    quickLoginView.quickBgView.hidden = NO;
    quickLoginView.frame = CGRectMake((CGRectGetWidth(_bgView.frame) - [RXUICommonTool getScreenWidth]) / 2, CGRectGetMaxY(_contentLbl.frame) + (RXAC ? 55 : 55), [RXUICommonTool getScreenWidth], 40);
    quickLoginView.viewType = RXUserType_account;
    
    __weak __typeof__(self) weakSelf = self;
    quickLoginView.clickBlock = ^(LoginType loginType) {
        if (loginType == LoginTypeAuth) {
            NSDictionary *loginExt = [NSDictionary dictionary];
            if (weakSelf.loginTypeBlock) {
                loginExt = weakSelf.loginTypeBlock(loginExt, loginType);
                [[RXLoginViewManager sharedSDK] fetchLoginEvent:loginType loginInfo:loginExt complete:self.loginComplete];
            }
        } else {
            NSDictionary *loginExt = [NSDictionary dictionary];
            if (weakSelf.loginTypeBlock) {
                loginExt = weakSelf.loginTypeBlock(loginExt, loginType);
                [[RXLoginViewManager sharedSDK] fetchLoginEvent:loginType loginInfo:loginExt complete:self.loginComplete];
            }
        }
        [weakSelf hide];
    };
    
    [self.bgView addSubview:quickLoginView];
    
    [self layoutSubviews];
    
    [quickLoginView startInfiniteAnimationForLabel:nil];
}

- (void)show
{
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

#pragma mark -- actions
- (void)closeBtnAction
{
    [self hide];
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
//        _titleLbl.text = self.titleStr;
        _titleLbl.text = @"一键登录失败";
        _titleLbl.textColor = [UIColor colorWithHexString:@"#4D4D4D"];
        _titleLbl.font = [UIFont boldSystemFontOfSize:18.5];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UILabel *)contentLbl
{
    if (!_contentLbl) {
        _contentLbl = [[UILabel alloc] init];
//        _contentLbl.text = self.contentStr;
        _contentLbl.textColor = [UIColor colorWithHexString:@"#555555"];
        _contentLbl.font = [UIFont systemFontOfSize:15];
        _contentLbl.textAlignment = NSTextAlignmentCenter;
        
        NSString *fullText = @"请选择下方其他登录方式重试";
        NSString *colorText = @"其他登录方式";
        
        NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc] initWithString:fullText];
        
        NSRange colorRange = [fullText rangeOfString:colorText];
        [attributedString addAttribute:NSForegroundColorAttributeName
                                 value:[UIColor colorWithHexString:@"#F74D79"] // 设置烟灰色
                                 range:colorRange];

        // 应用富文本到 label
        _contentLbl.attributedText = attributedString;
    }
    return _contentLbl;
}

- (RXCloseBtn *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [RXCloseBtn buttonWithType:UIButtonTypeCustom];
        _closeBtn.adjustsImageWhenHighlighted = NO;
        [_closeBtn setImage:[UIImage rxBundleImageNamed:@"rx_close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(closeBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

- (UIImageView *)imgView
{
    if (!_imgView) {
        _imgView = [[UIImageView alloc] init];
        _imgView.image = [UIImage rxBundleImageNamed:@"rx_login_auth_error"];
    }
    return _imgView;
}

- (UIImageView *)arrowImgView
{
    if (!_arrowImgView) {
        _arrowImgView = [[UIImageView alloc] init];
        _arrowImgView.image = [UIImage rxBundleImageNamed:@"rx_login_auth_arrow"];
    }
    return _arrowImgView;
}

@end
