//
//  RXAttributeLabel.h
//  RXUIKit
//
//  Created by 陈汉 on 2023/1/29.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RXAttributeLabelDelegate <NSObject>

- (void)rxAttributeClick:(NSString *)text offset:(NSInteger)offset;

@end

@interface RXAttributeLabel : UIView

/**
 * 展示的文字
 */
@property (nonatomic, strong) NSString *text;
/**
 * 点击的文字数组
 */
@property (nonatomic, strong) NSArray *clickTextlist;
/**
 * 点击文字颜色
 */
@property (nonatomic, strong) UIColor *clickTextColor;
/**
 * 文字颜色
 */
@property (nonatomic, strong) UIColor *textColor;
/**
 * 字号
 */
@property (nonatomic, strong) UIFont *font;

/**
 * text普通文字对齐方式(富文本对齐方式可以使用 setClickText:withFont:textAlignment:)
 */
@property (nonatomic, assign) NSTextAlignment textAlignment;

/**
 * 换行方式
 */
@property (nonatomic, assign) NSLineBreakMode breakMode;

/**
 * 显示方式，四边边距，调整从左上、右上、左下、右下显示
 */
@property (nonatomic, assign) UIEdgeInsets textInsets;

/**
 * 当前设置的文字是否垂直居中，YES是，NO不是，每次设置文字后需重新调用
 */
@property (nonatomic, assign) BOOL verticalCenter;


@property (nonatomic, weak) id <RXAttributeLabelDelegate> delegate;


/// 设置点击文字与对应的字体,如果设置了clickTextlist，则无需调用此方法
/// - Parameters:
///   - clickTextlist: 点击文字集合
///   - font: 字体
///   - textAlignmentt: 对齐方式
- (void)setClickText:(NSArray *)clickTextlist withFont:(UIFont *)font textAlignment:(NSTextAlignment)textAlignmentt;


@end

NS_ASSUME_NONNULL_END
