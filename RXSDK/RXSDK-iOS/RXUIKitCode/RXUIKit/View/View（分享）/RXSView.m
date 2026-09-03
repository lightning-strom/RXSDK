//
//  RXSView.m
//  RXShareKit
//
//  Created by 陈汉 on 2022/5/25.
//

#import "RXSView.h"
#import "RXSBtn.h"
#import "RXUICommonTool.h"

#define BtnTag 100000

@interface RXSView ()

@property (nonatomic, strong) UIView *tapBgView;
@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UIImageView *topImgView;
@property (nonatomic, strong) UIView *line;
@property (nonatomic, strong) UIButton *cancelBtn;
@property (nonatomic, strong) NSArray *shareTypes;
@property (nonatomic, strong) UIScrollView *mScrollView;
@property (nonatomic, assign) BOOL needRound;
@property (nonatomic, copy) RXShareClickBlock block;

@end

@implementation RXSView

- (instancetype)initWithShareTypes:(NSArray *)shareTypes
                             round:(BOOL)round
                        clickBlock:(RXShareClickBlock)clickBlock
{
    self = [super initWithFrame:[UIApplication sharedApplication].keyWindow.frame];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        
        self.shareTypes = shareTypes;
        self.needRound = round;
        self.block = clickBlock;
        
        [self setUI];
        [self show];
    }
    return self;
}

- (void)show
{
    [UIView animateWithDuration:0.1 animations:^{
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.4];
        CGFloat bgW = __MainScreen_Width - 351;
        CGFloat topX = __MainScreen_Width - bgW / 2 - 9 - 217;
        self.bgView.frame = CGRectMake(bgW / 2, __MainScreen_Height - 20 - 254, 351, 254);
        
        self.topImgView.frame = CGRectMake(topX, __MainScreen_Height - 20 - 254 - 49, 217, 169);
        [self layoutSubviews];
    }];
}

- (void)hide
{
    [UIView animateWithDuration:0.1 animations:^{
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0];
        CGFloat bgW = __MainScreen_Width - 351;
        CGFloat topX = __MainScreen_Width - bgW / 2 - 9 - 217;
        self.bgView.frame = CGRectMake(bgW / 2, __MainScreen_Height, 351, 254);
        self.topImgView.frame = CGRectMake(topX, __MainScreen_Height, 217, 169);
        [self layoutSubviews];
    }];
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.15 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [[NSNotificationCenter defaultCenter] removeObserver:self];
        [self removeFromSuperview];
        
    });
}

#pragma mark -- setUI
- (void)setUI
{
    [self addSubview:self.tapBgView];
    [self addSubview:self.bgView];
    [_bgView addSubview:self.titleLbl];
    [self addSubview:self.topImgView];
    [_bgView addSubview:self.line];
    [_bgView addSubview:self.cancelBtn];
    [_bgView addSubview:self.mScrollView];
    
    CGFloat bgW = __MainScreen_Width - 351;
    _bgView.frame = CGRectMake(bgW / 2, __MainScreen_Height, 351, 254);
    _titleLbl.frame = CGRectMake(25, 32, 50, 40);
    CGFloat topX = __MainScreen_Width - bgW / 2 - 9 - 217;
    _topImgView.frame = CGRectMake(topX, __MainScreen_Height, 217, 169);
    _line.frame = CGRectMake(19, _bgView.frame.size.height - 57, 313, 1);
    _cancelBtn.frame = CGRectMake(0, _line.frame.origin.y + 1, 351, 58);
    _mScrollView.frame = CGRectMake(0, _titleLbl.frame.size.height + _titleLbl.frame.origin.y + 20, 351, 94);
    
    CGFloat space = (CGRectGetWidth(_bgView.frame) - 64 * self.shareTypes.count) / (self.shareTypes.count + 1);
    for (int i = 0; i < self.shareTypes.count; i++) {
        RXSBtn *shareBtn = [RXSBtn buttonWithType:UIButtonTypeCustom];
        CGFloat sbX = 20 + (17 + 64) * i;
        sbX = space + (space + 64) * i;
        if (self.shareTypes.count >= 4) {
            sbX = 20 + (17 + 64) * i;
        }
        shareBtn.frame = CGRectMake(sbX, 0, 64, 64);
        shareBtn.tag = BtnTag + i;
        shareBtn.backgroundColor = [UIColor colorWithHexString:@"f8f8f8"];
        shareBtn.layer.cornerRadius = self.needRound ? 32 : 12;
        [shareBtn setImage:[UIImage rxBundleImageNamed:[RXSTool getShareImage:[self.shareTypes[i] integerValue]]] forState:UIControlStateNormal];
        [shareBtn addTarget:self action:@selector(shareBtnAction:) forControlEvents:UIControlEventTouchUpInside];
        [_mScrollView addSubview:shareBtn];
        
        UILabel *shareLbl = [[UILabel alloc] initWithFrame:CGRectMake(shareBtn.frame.origin.x, shareBtn.frame.origin.y + shareBtn.frame.size.height + 8, shareBtn.frame.size.width, 20)];
        shareLbl.font = [UIFont systemFontOfSize:12];
        shareLbl.textAlignment = NSTextAlignmentCenter;
        shareLbl.text = [RXSTool getShareTitle:[self.shareTypes[i] integerValue]];
        [_mScrollView addSubview:shareLbl];
    }
    
    CGFloat msW = 15 * 2 + 64 * self.shareTypes.count + 16 * (self.shareTypes.count - 1);
    _mScrollView.contentSize = CGSizeMake(msW, 0);
    
    [self layoutSubviews];
}

#pragma mark -- actions
- (void)shareBtnAction:(UIButton *)btn
{
    NSInteger i = btn.tag - BtnTag;
    if (self.block) {
        self.block([self.shareTypes[i] integerValue]);
    }
}

- (void)cancelBtnAction:(UIButton *)btn
{
    [self hide];
}

- (void)tapAction:(UITapGestureRecognizer *)tap
{
    [self hide];
}

#pragma mark -- lazy
- (UIView *)tapBgView
{
    if (!_tapBgView) {
        _tapBgView = [[UIView alloc] initWithFrame:self.frame];
        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapAction:)];
        [_tapBgView addGestureRecognizer:tap];
    }
    return _tapBgView;
}

- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor whiteColor];
        _bgView.layer.cornerRadius = 16;
    }
    return _bgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.text = @"分享到";
        _titleLbl.font = [UIFont boldSystemFontOfSize:16];
    }
    return _titleLbl;
}

- (UIImageView *)topImgView
{
    if (!_topImgView) {
        _topImgView = [[UIImageView alloc] init];
        _topImgView.image = [UIImage rxBundleImageNamed:@"RXShare_bg"];
    }
    return _topImgView;
}

- (UIView *)line
{
    if (!_line) {
        _line = [[UIView alloc] init];
        _line.backgroundColor = [UIColor colorWithHexString:@"f7f7f7"];
    }
    return _line;
}

- (UIButton *)cancelBtn
{
    if (!_cancelBtn) {
        _cancelBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_cancelBtn setTitle:@"取消分享" forState:UIControlStateNormal];
        [_cancelBtn setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
        _cancelBtn.titleLabel.font = [UIFont boldSystemFontOfSize:16];
        [_cancelBtn addTarget:self action:@selector(cancelBtnAction:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _cancelBtn;
    
}

- (UIScrollView *)mScrollView
{
    if (!_mScrollView) {
        _mScrollView = [[UIScrollView alloc] init];
        _mScrollView.showsHorizontalScrollIndicator = NO;
    }
    return _mScrollView;
}

@end
