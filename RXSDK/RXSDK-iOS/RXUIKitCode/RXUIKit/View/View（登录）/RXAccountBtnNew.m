//
//  RXAccountBtnNew.m
//  RXUIKit
//
//  Created by 陈汉 on 2024/12/26.
//

#import "RXAccountBtnNew.h"

@implementation RXAccountBtnNew

- (void)layoutSubviews
{
    [super layoutSubviews];
    
    CGFloat imgWH = 39;
    
    self.imageView.frame = CGRectMake((CGRectGetWidth(self.frame) - imgWH) / 2, 0, imgWH, imgWH);
    
    self.titleLabel.frame = CGRectMake(0, 40, self.frame.size.width, 18);
}

@end
