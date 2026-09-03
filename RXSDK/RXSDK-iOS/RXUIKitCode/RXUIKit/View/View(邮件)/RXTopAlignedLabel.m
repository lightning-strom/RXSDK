//
//  RXTopAlignedLabel.m
//  RXUIKit-OS
//
//  Created by root11 on 2024/7/24.
//

#import "RXTopAlignedLabel.h"

@implementation RXTopAlignedLabel

- (void)drawTextInRect:(CGRect)rect {
    // 获取文本的大小
    CGSize textSize = [self textRectForBounds:rect limitedToNumberOfLines:self.numberOfLines].size;
    
    // 调整文本的绘制区域，使其位于顶部
    CGRect textRect = CGRectMake(rect.origin.x,
                                 rect.origin.y,
                                 rect.size.width,
                                 textSize.height);
    
    [super drawTextInRect:textRect];
}

@end
