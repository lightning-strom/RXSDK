//
//  RXPublicWebViewNaviBarView.m
//  RXPublicToolKit
//
//  Created by 陈汉 on 2024/5/15.
//

#import "RXPublicWebViewNaviBarView.h"
#import "RXToolPrivate.h"

@interface RXPublicWebViewNaviBarView ()

@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UIView *line;

@end

@implementation RXPublicWebViewNaviBarView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        [self setUI];
    }
    return self;
}

#pragma mark -- <setUI>
- (void)setUI
{
    [self addSubview:self.naviBar];
    [self.naviBar addSubview:self.titleLbl];
    [self.naviBar addSubview:self.backBtn];
    [self.naviBar addSubview:self.closeBtn];
    [self addSubview:self.line];
    
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    _naviBar.frame = CGRectMake(0, 0, CGRectGetWidth(window.frame), RXToolAC ? 44 : kRXToolNavigationAndStatusHeight);
    
    if ([RXToolPrivate isRTL]) {
        _closeBtn.frame = CGRectMake(RXToolAC ? 37 : 18, RXToolAC ? 6 : kRXToolStatusBarHeight + 4, 26, 26);
        
        _backBtn.frame = CGRectMake(CGRectGetWidth(_naviBar.frame) - (RXToolAC ? 61 : 42), CGRectGetMinY(_closeBtn.frame), 26, 26);
        
        _titleLbl.frame = CGRectMake(CGRectGetMaxX(_closeBtn.frame), CGRectGetMinY(_backBtn.frame), CGRectGetWidth(_naviBar.frame) - CGRectGetMaxX(_closeBtn.frame) - 26, CGRectGetHeight(_backBtn.frame));
    } else {
        _backBtn.frame = CGRectMake(RXToolAC ? 37 : 18, RXToolAC ? 6 : kRXToolStatusBarHeight + 4, 26, 26);
        
        _closeBtn.frame = CGRectMake(CGRectGetWidth(_naviBar.frame) - (RXToolAC ? 61 : 42), CGRectGetMinY(_backBtn.frame), 26, 26);
        
        _titleLbl.frame = CGRectMake(CGRectGetMaxX(_backBtn.frame), CGRectGetMinY(_backBtn.frame), CGRectGetWidth(_naviBar.frame), CGRectGetHeight(_backBtn.frame));
    }
    
    _line.frame = CGRectMake(0, CGRectGetHeight(self.frame) - 1, CGRectGetWidth(self.frame), 0.5);
}

- (void)setTitleStyle:(RXPublicWebviewTitleStyle)titleStyle
{
    _titleStyle = titleStyle;
    
    if (titleStyle == RXPublicWebviewTitleStyleLeft) {
        if ([RXToolPrivate isRTL]) {
            _titleLbl.textAlignment = NSTextAlignmentRight;
        } else {
            _titleLbl.textAlignment = NSTextAlignmentLeft;
        }
    } else {
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
}

- (void)setTitleStr:(NSString *)title
{
    _titleStr = title;
    _titleLbl.text = title;
}

- (void)setIsShowBackBtn:(BOOL)isShowBackBtn
{
    CGFloat width = 0;
    if (isShowBackBtn) {
        _backBtn.hidden = NO;
        width = 26;
    } else {
        _backBtn.hidden = YES;
    }
    
    if ([RXToolPrivate isRTL]) {
        _backBtn.frame = CGRectMake(CGRectGetWidth(_naviBar.frame) - (RXToolAC ? 61 : 42), CGRectGetMinY(_closeBtn.frame), width, 26);
        
        CGFloat btnSpace = width == 0 ? 26 : CGRectGetWidth(_naviBar.frame) - CGRectGetMinX(_backBtn.frame) - 4;
        
        _titleLbl.frame = CGRectMake(CGRectGetMaxX(_closeBtn.frame), CGRectGetMinY(_backBtn.frame), CGRectGetWidth(_naviBar.frame) - CGRectGetMaxX(_closeBtn.frame) - btnSpace, CGRectGetHeight(_backBtn.frame));
    } else {
        _backBtn.frame = CGRectMake(RXToolAC ? 37 : 18, RXToolAC ? 6 : kRXToolStatusBarHeight + 5, width, 26);
        
        _titleLbl.frame = CGRectMake(0, CGRectGetMinY(_backBtn.frame), CGRectGetWidth(_naviBar.frame), CGRectGetHeight(_backBtn.frame));
    }
}

#pragma mark -- <actions>
- (void)backBtnAction:(UIButton *)btn
{
    if (self.backBlock) {
        self.backBlock();
    }
}

- (void)closeBtnAction:(UIButton *)btn
{
    if (self.closeBlock) {
        self.closeBlock();
    }
}

#pragma mark -- <lazy>
- (UIView *)naviBar
{
    if (!_naviBar) {
        _naviBar = [[UIView alloc] init];
//        _naviBar.backgroundColor = [UIColor colorWithHexString:@"#E0FFFC"];
        _naviBar.backgroundColor = [UIColor whiteColor];
    }
    return _naviBar;
}

- (RXPublicWebBtn *)backBtn
{
    if (!_backBtn) {
        _backBtn = [RXPublicWebBtn buttonWithType:UIButtonTypeCustom];

        UIImage *backImage = [RXToolPrivate rxToolBundleImageNamed:@"rx_back"];
        if ([RXToolPrivate isRTL]) {
            UIImage *flipImage = [UIImage imageWithCGImage:backImage.CGImage scale:backImage.scale orientation:UIImageOrientationDown];
            [_backBtn setImage:flipImage forState:UIControlStateNormal];
        } else {
            [_backBtn setImage:backImage forState:UIControlStateNormal];
        }
        
        [_backBtn addTarget:self action:@selector(backBtnAction:) forControlEvents:UIControlEventTouchUpInside];
        [_backBtn setTitleColor:[UIColor blackColor] forState:normal];
    }
    return _backBtn;
}

- (RXPublicWebBtn *)closeBtn
{
    if (!_closeBtn) {
        _closeBtn = [RXPublicWebBtn buttonWithType:UIButtonTypeCustom];
        [_closeBtn setImage:[RXToolPrivate rxToolBundleImageNamed:@"rx_close"] forState:UIControlStateNormal];
        [_closeBtn addTarget:self action:@selector(closeBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _closeBtn;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
        _titleLbl.font = [UIFont systemFontOfSize:18];
        _titleLbl.textColor = [UIColor blackColor];
    }
    return _titleLbl;
}

- (UIView *)line
{
    if (!_line) {
        _line = [[UIView alloc] init];
        _line.backgroundColor = [UIColor grayColor];
    }
    return _line;
}

@end
