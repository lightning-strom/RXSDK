//
//  JXQRCodeNavigationView.m
//  MisApp-iOS
//
//  Created by wjy on 2021/9/18.
//

#import "JXQRCodeNavigationView.h"

@implementation JXQRCodeNavigationView

#pragma mark - <lazy>
- (UIButton *)cancelBtn
{
    if (!_cancelBtn) {
        _cancelBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_cancelBtn setTitle:@"取消" forState:UIControlStateNormal];
        [_cancelBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        _cancelBtn.titleLabel.font = [UIFont systemFontOfSize:16];
    }
    return _cancelBtn;
}


- (UILabel *)mTitleLabel
{
    if (!_mTitleLabel) {
        _mTitleLabel = [[UILabel alloc] init];
        _mTitleLabel.text = @"扫一扫";
        _mTitleLabel.textColor = [UIColor whiteColor];
        _mTitleLabel.font = [UIFont systemFontOfSize:17];
        _mTitleLabel.textAlignment = NSTextAlignmentCenter;
    }
    return _mTitleLabel;
}


- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        [self setUI];
    }
    return self;
}


#pragma mark - <setUI>
- (void)setUI
{
//    [self addSubview:self.cancelBtn];
    [self addSubview:self.mTitleLabel];
    
    _cancelBtn.frame = CGRectMake(20, 24, 52, 42);
    _mTitleLabel.frame = CGRectMake(0, 40, [UIApplication sharedApplication].keyWindow.frame.size.width, 24);
}



@end
