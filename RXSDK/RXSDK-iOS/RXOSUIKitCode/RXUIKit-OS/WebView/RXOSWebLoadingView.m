//
//  RXOSWebLoadingView.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/6/28.
//

#import "RXOSWebLoadingView.h"
#import "RXOSCommonTool.h"

@interface RXOSWebLoadingView ()

@end

@implementation RXOSWebLoadingView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    
    if (self) {
        [self setUI];
    }
    
    return self;
}

- (void)setUI
{
//    [self addSubview:self.mImageView];
//    [self addSubview:self.loadingLbl];
    
    _mImageView.frame = CGRectMake(CGRectGetWidth(self.frame) / 2 - 49, CGRectGetHeight(self.frame) / 2 - 49, 98, 98);
    
    _loadingLbl.frame = CGRectMake(0, CGRectGetMaxY(_mImageView.frame) + 4, CGRectGetWidth(self.frame), 20);
    
}

- (UIImageView *)mImageView
{
    if (!_mImageView) {
        _mImageView = [[UIImageView alloc] init];
        _mImageView.image = [UIImage rxOSBundleImageNamed:@"rx_service_loading"];
    }
    return _mImageView;
}

- (UILabel *)loadingLbl
{
    if (!_loadingLbl) {
        _loadingLbl = [[UILabel alloc] init];
        _loadingLbl.text = @"加载中...";
        _loadingLbl.font = [UIFont systemFontOfSize:16 weight:UIFontWeightRegular];
        _loadingLbl.textColor = [UIColor colorWithHexString:@"#A6AEC7"];
        _loadingLbl.textAlignment = NSTextAlignmentCenter;
    }
    return _loadingLbl;
}

@end
