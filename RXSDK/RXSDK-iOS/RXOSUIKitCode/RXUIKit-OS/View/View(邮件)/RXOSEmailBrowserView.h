//
//  RXOSEmailBrowserView.h
//  RXUIKit-OS
//
//  Created by root11 on 2024/8/18.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXOSEmailBrowserView : UIView

/**
* 初始化
* picArray 图片数组
* index 第几张图片
*/
- (instancetype)initWithPicArray:(NSArray *)picArray index:(NSInteger)index;

@end

NS_ASSUME_NONNULL_END
