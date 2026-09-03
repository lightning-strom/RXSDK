//
//  RXPlayerFeedbackPreviewView.h
//  RXUIKit-OS
//
//  Created by root11 on 2024/8/18.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXPlayerFeedbackPreviewView : UIView

/**
* 初始化
* picArray 图片数组，可以是UIImage/网络图片/本地视频/网络视频，混合
* index 第几张图片
*/
- (instancetype)initWithPicArray:(NSArray *)picArray index:(NSInteger)index;

@end

NS_ASSUME_NONNULL_END
