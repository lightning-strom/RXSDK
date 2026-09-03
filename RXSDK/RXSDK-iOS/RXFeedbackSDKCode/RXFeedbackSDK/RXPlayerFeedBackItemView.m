//
//  RXPlayerFeedBackItemView.m
//  RXUIKit-OS
//
//  Created by root11 on 2024/7/23.
//

#import "RXPlayerFeedBackItemView.h"
#import "RXFeedbackTool.h"
//#import "UIView+RXFeedbackShade.h"

@implementation RXPlayerFeedBackItemView

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
    
    [self addSubview:self.backImageView];
    [self addSubview:self.playImageView];
    [self addSubview:self.countLabel];
    
}

- (void)layoutSubviews{
    self.backImageView.frame = self.bounds;
    self.playImageView.frame = CGRectMake((self.bounds.size.width - 30)/2, (self.bounds.size.height - 30)/2, 30, 30);
    self.countLabel.frame = CGRectMake(0, 0, self.frame.size.width, self.frame.size.height);
}

/// 背景图
/// - Parameter image: image
- (void)setBackImage:(UIImage *)image{
    self.backImageView.image = image;
}


/// 上传进度
/// - Parameter progress: 进度值
- (void)setProgress:(double)progress{
    self.countLabel.text = [NSString stringWithFormat:@"%.2f",progress];
}



#pragma mark - lazy load
- (UIImageView *)backImageView{
    if (!_backImageView) {
        _backImageView = [[UIImageView alloc] init];
        _backImageView.contentMode = UIViewContentModeScaleAspectFill;
        _backImageView.backgroundColor = [UIColor clearColor];
        _backImageView.image = [UIImage rxFeedbackBundleImageNamed:@"rx_feedback_addImage"];
    }
    return _backImageView;
}

- (UIImageView *)playImageView{
    if (!_playImageView) {
        _playImageView = [[UIImageView alloc] init];
        _playImageView.contentMode = UIViewContentModeScaleAspectFit;
        _playImageView.backgroundColor = [UIColor clearColor];
        _playImageView.image = [UIImage rxFeedbackBundleImageNamed:@"rx_feedback_play"];
    }
    return _playImageView;
}


- (UILabel *)countLabel{
    if (!_countLabel) {
        _countLabel = [[UILabel alloc] init];
        _countLabel.backgroundColor = [UIColor clearColor];
        _countLabel.textColor = [UIColor blackColor];
        _countLabel.textAlignment = NSTextAlignmentCenter;
        _countLabel.font = [UIFont boldSystemFontOfSize:RXUScaleWidth(10)];
    }
    return _countLabel;
}


@end
