//
//  RXOSDragView.h
//  RXUIKit
//
//  Created by 陈汉 on 2023/6/28.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXOSDragView : UIView

@property (nonatomic, strong) UIImageView *redTip;
@property (nonatomic, strong) UIImageView *clickImgView;
@property (nonatomic, assign) CGFloat dragHeight;

- (instancetype)initWithFrame:(CGRect)frame vc:(UIViewController *)vc;
- (void)setActionBlock:(void(^)(void))block;

@end

NS_ASSUME_NONNULL_END
