//
//  RXLoginAlertView.m
//  RXUIKit
//
//  Created by 陈汉 on 2022/3/18.
//

#import "RXLoginAlertView.h"
#import "RXUICommonTool.h"

typedef void(^ClickBlock)(NSInteger type);

@interface RXLoginAlertView ()

@property (nonatomic, strong) UIView *bgView;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, strong) UILabel *contentLbl;
@property (nonatomic, strong) UIButton *leftBtn;
@property (nonatomic, strong) UIButton *rightBtn;
@property (nonatomic, copy) ClickBlock block;

@end

@implementation RXLoginAlertView

- (instancetype)initWithTitile:(NSString *)title
                       content:(NSString *)content
                         block:(void(^)(NSInteger type))block
{
    self = [super initWithFrame:CGRectMake(0, 0, [UIApplication sharedApplication].keyWindow.frame.size.width, [UIApplication sharedApplication].keyWindow.frame.size.height)];
    if (self) {
        self.backgroundColor = [[UIColor blackColor] colorWithAlphaComponent:0.5];
        [[UIApplication sharedApplication].keyWindow addSubview:self];
        self.block = block;
        
        [self setUI:title content:content];
    }
    return self;
}

- (void)setUI:(NSString *)title content:(NSString *)content
{
    [self addSubview:self.bgView];
//    [self.bgView sd_addSubviews:@[self.titleLbl, self.contentLbl, self.leftBtn, self.rightBtn]];
//    
//    UIView *window = [UIApplication sharedApplication].keyWindow;
//    
//    _bgView.sd_layout.centerXEqualToView(window)
//    .topSpaceToView(self, window.frame.size.height / 2 - 155 / 2)
//    .widthIs(311)
//    .heightIs(155);
//    
//    _titleLbl.sd_layout.topSpaceToView(self.bgView, 24)
//    .leftSpaceToView(self.bgView, 0)
//    .rightSpaceToView(self.bgView, 0)
//    .heightIs(22);
//
//    _contentLbl.sd_layout.topSpaceToView(self.titleLbl, 6)
//    .leftSpaceToView(self.bgView, 0)
//    .rightSpaceToView(self.bgView, 0)
//    .heightIs(22);
//
//    _leftBtn.sd_layout.bottomSpaceToView(self.bgView, 24)
//    .leftSpaceToView(self.bgView, 16)
//    .widthIs(136)
//    .heightIs(40);
//
//    _rightBtn.sd_layout.bottomEqualToView(self.leftBtn)
//    .rightSpaceToView(self.bgView, 16)
//    .widthIs(136)
//    .heightIs(40);
    
    [self layoutSubviews];
    
    self.titleLbl.text = title;
    self.contentLbl.text = content;
}

- (void)hide
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [self removeFromSuperview];
    
}

#pragma mark -- <actions>
- (void)leftBtnAction
{
    if (self.block) {
        self.block(0);
    }
    [self hide];
}

- (void)rightBtnAction
{
    if (self.block) {
        self.block(1);
    }
    [self hide];
}

#pragma mark -- <lazy>
- (UIView *)bgView
{
    if (!_bgView) {
        _bgView = [[UIView alloc] init];
        _bgView.backgroundColor = [UIColor whiteColor];
        _bgView.layer.cornerRadius = 8;
    }
    return _bgView;
}

- (UILabel *)titleLbl
{
    if (!_titleLbl) {
        _titleLbl = [[UILabel alloc] init];
        _titleLbl.textColor = [UIColor blackColor];
        _titleLbl.font = [UIFont boldSystemFontOfSize:16];
        _titleLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _titleLbl;
}

- (UILabel *)contentLbl
{
    if (!_contentLbl) {
        _contentLbl = [[UILabel alloc] init];
        _contentLbl.font = [UIFont systemFontOfSize:14];
        _contentLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _contentLbl;
}

- (UIButton *)leftBtn
{
    if (!_leftBtn) {
        _leftBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_leftBtn setTitle:@"取消" forState:UIControlStateNormal];
        [_leftBtn setTitleColor:[UIColor colorWithHexString:@"31B14E"] forState:UIControlStateNormal];
        _leftBtn.titleLabel.font = [UIFont systemFontOfSize:14];
        _leftBtn.layer.cornerRadius = 6;
        _leftBtn.layer.borderColor = [UIColor colorWithHexString:@"31B14E"].CGColor;
        _leftBtn.layer.borderWidth = 0.5;
        [_leftBtn addTarget:self action:@selector(leftBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _leftBtn;
}

- (UIButton *)rightBtn
{
    if (!_rightBtn) {
        _rightBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_rightBtn setTitle:@"删除" forState:UIControlStateNormal];
        [_rightBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _rightBtn.backgroundColor = [UIColor colorWithHexString:@"31B14E"];
        _rightBtn.titleLabel.font = [UIFont systemFontOfSize:14];
        _rightBtn.layer.cornerRadius = 6;
        [_rightBtn addTarget:self action:@selector(rightBtnAction) forControlEvents:UIControlEventTouchUpInside];
    }
    return _rightBtn;
}

@end
