//
//  RXPlayerFeedbackPictureView.h
//  RXUIKit-OS
//
//  Created by root11 on 2024/8/17.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RXPlayerFeedbackPictureViewDelegate <NSObject>

- (void)singleTapHiddenView;

@end

@interface RXPlayerFeedbackPictureView : UIView

/**
 * 初始化
 * picArray 图片数组
 */
- (instancetype)initWithFrame:(CGRect)frame object:(NSObject *)object;

@property (nonatomic, weak) id<RXPlayerFeedbackPictureViewDelegate> delegate;

- (void)plaverViewIsVisable;

@end

NS_ASSUME_NONNULL_END
