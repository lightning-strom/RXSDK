//
//  RXOSAreaBtn.m
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/19.
//

#import "RXOSAreaBtn.h"
#import "NSString+RXOSAddition.h"

@implementation RXOSAreaBtn

- (void)layoutSubviews
{
    [super layoutSubviews];
    
    CGFloat titleW = [self.titleLabel.text widthForFont:self.titleLabel.font] + 1;
    
    self.titleLabel.frame = CGRectMake(0, 0, titleW, CGRectGetHeight(self.frame));
    
    self.imageView.frame = CGRectMake(CGRectGetMaxX(self.titleLabel.frame) - 5, 3, 23, 23);
}

@end
