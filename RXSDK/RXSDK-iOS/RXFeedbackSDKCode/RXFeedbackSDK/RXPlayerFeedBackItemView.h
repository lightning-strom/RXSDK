//
//  RXPlayerFeedBackItemView.h
//  RXUIKit-OS
//
//  Created by root11 on 2024/7/23.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXPlayerFeedBackItemView : UIView

@property (nonatomic, strong) UIImageView *backImageView;
@property (nonatomic, strong) UIImageView *playImageView;
@property (nonatomic, strong) UILabel *countLabel;


/// 背景图
/// - Parameter image: image
- (void)setBackImage:(UIImage *)image;


/// 上传进度
/// - Parameter progress: 进度值
- (void)setProgress:(double)progress;

@end

NS_ASSUME_NONNULL_END
