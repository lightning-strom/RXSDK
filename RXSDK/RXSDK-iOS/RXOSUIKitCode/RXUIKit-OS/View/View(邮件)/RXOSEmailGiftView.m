//
//  RXOSEmailGiftView.m
//  RXUIKit-OS
//
//  Created by root11 on 2024/7/23.
//

#import "RXOSEmailGiftView.h"
#import "RXOSCommonTool.h"
#import "UIView+RXOSShade.h"

@implementation RXOSEmailGiftView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        [self setUpView];
    }
    return self;
}

- (void)setUpView{
    self.layer.cornerRadius = 6;
    self.layer.masksToBounds = YES;
    self.layer.borderWidth = 1;
    self.layer.borderColor = HexRGBAlpha(0xE1E1E1, 1).CGColor;
    
    [self addSubview:self.imageView];
    [self addSubview:self.tipLabel];
    [self addSubview:self.countLable];
    
}

- (void)layoutSubviews{
    self.imageView.frame = CGRectMake(8, 4, self.frame.size.width - 16, self.frame.size.width - 16);
    self.tipLabel.frame = CGRectMake(self.frame.size.width * 1/2, 0, self.frame.size.width * 1/2, self.frame.size.width * 0.26);
    self.tipLabel.layer.mask = [UIView drawCornerRadiusWithRect:CGRectMake(0, 0, self.frame.size.width * 1/2, self.frame.size.width * 0.26) corners:UIRectCornerBottomLeft size:CGSizeMake(self.frame.size.width * 1/2, self.frame.size.width * 0.26)];
    self.countLable.frame = CGRectMake(3, CGRectGetMaxY(self.imageView.frame), self.frame.size.width - 6, self.frame.size.width - CGRectGetMaxY(self.imageView.frame));
}

- (void)setGiftDic:(NSDictionary *)dic{
    NSURL *url = [NSURL URLWithString:dic[@"icon"]];
    NSData *data = [NSData dataWithContentsOfURL:url];
    self.imageView.image = [UIImage imageWithData:data];
    
    self.countLable.text = [NSString stringWithFormat:@"%@",dic[@"count_format"]];
}

/// 设置状态
/// - Parameter status: status 1-已读 2-已领 3-未读
- (void)setStatus:(NSInteger)status{
    if (status == 2) {
        self.tipLabel.hidden = NO;
    }else{
        self.tipLabel.hidden = YES;
    }
}

/// 意见反馈加载道具
/// - Parameter NSDictionary: 道具信息
- (void)setPropDic:(NSDictionary *)propInfo{
    NSURL *url = [NSURL URLWithString:propInfo[@"icon"]];
    NSData *data = [NSData dataWithContentsOfURL:url];
    self.imageView.image = [UIImage imageWithData:data];
    
    self.countLable.text = [NSString stringWithFormat:@"%@",propInfo[@"count"]];
}

/// 意见反馈设置状态
/// - Parameter get_prop: status 1-已领取 2-未领取
- (void)setGet_prop:(NSInteger)get_prop{
    if (get_prop == 1) {
        self.tipLabel.hidden = NO;
    }else{
        self.tipLabel.hidden = YES;
    }
}


#pragma mark - lazy load
- (UIImageView *)imageView{
    if (!_imageView) {
        _imageView = [[UIImageView alloc] init];
        _imageView.contentMode = UIViewContentModeScaleAspectFit;
        _imageView.backgroundColor = [UIColor clearColor];
    }
    return _imageView;
}

- (UILabel *)tipLabel{
    if (!_tipLabel) {
        _tipLabel = [[UILabel alloc] init];
        _tipLabel.backgroundColor = HexRGBAlpha(0xFFD95A, 1);
        _tipLabel.textColor = [UIColor blackColor];
        _tipLabel.text = [RXLocation osLaunguage:@"已领"];
        _tipLabel.font = [UIFont systemFontOfSize:8];
        _tipLabel.textAlignment = NSTextAlignmentCenter;
    }
    return _tipLabel;
}

- (UILabel *)countLable{
    if (!_countLable) {
        _countLable = [[UILabel alloc] init];
        _countLable.backgroundColor = [UIColor clearColor];
        _countLable.textColor = HexRGBAlpha(0x20C0B3, 1);
        _countLable.text = @"--";
        _countLable.textAlignment = NSTextAlignmentRight;
        _countLable.font = [UIFont systemFontOfSize:9];
    }
    return _countLable;
}


@end
