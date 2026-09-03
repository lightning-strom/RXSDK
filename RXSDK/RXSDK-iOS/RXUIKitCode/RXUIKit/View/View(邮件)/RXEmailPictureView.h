//
//  RXEmailPictureView.h
//  RXUIKit-OS
//
//  Created by root11 on 2024/8/17.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RXEmailPictureViewDelegate <NSObject>

- (void)singleTapHiddenView;

@end

@interface RXEmailPictureView : UIView

/**
 * 初始化
 * picArray 图片数组
 * index 第几张图片
 */
- (instancetype)initWithFrame:(CGRect)frame urlString:(NSString *)urlString;

@property (nonatomic, weak) id<RXEmailPictureViewDelegate> delegate;

@end

NS_ASSUME_NONNULL_END
