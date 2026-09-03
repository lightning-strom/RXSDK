//
//  RXOSLoginChangeBtn.m
//  RXUIKit-OS
//
//  Created by 陈汉 on 2024/7/5.
//

#import "RXOSLoginChangeBtn.h"
#import "RXOSCommonTool.h"

@implementation RXOSLoginChangeBtn

- (void)layoutSubviews
{
    [super layoutSubviews];
    
//    if (!RXAC) {
//        self.imageView.frame = CGRectMake(0, 9.5, 16, 16);
//    } else {
//        self.imageView.frame = CGRectMake(0, 10, 16, 16);
//    }
    
    CGFloat titleW = [self.titleLabel.text widthForFont:self.titleLabel.font];
    
    self.titleLabel.frame = CGRectMake((CGRectGetWidth(self.frame) - titleW) / 2, 0, titleW + 20, self.frame.size.height);
    
    if ([RXOSCommonTool isRTL]) {
        self.imageView.frame = CGRectMake(CGRectGetMaxX(self.titleLabel.frame) - 10, 7, 16, 16);
    } else {
        self.imageView.frame = CGRectMake(CGRectGetMinX(self.titleLabel.frame) - 20, 7, 16, 16);
    }
}

@end
