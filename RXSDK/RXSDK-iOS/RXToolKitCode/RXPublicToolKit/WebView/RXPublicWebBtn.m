//
//  RXPublicWebBtn.m
//  RXPublicToolKit
//
//  Created by 陈汉 on 2024/5/16.
//

#import "RXPublicWebBtn.h"

@implementation RXPublicWebBtn

- (void)layoutSubviews
{
    [super layoutSubviews];
    
    self.imageView.frame = CGRectMake(4, 4, CGRectGetHeight(self.frame) - 8, CGRectGetHeight(self.frame) - 8);
    
//    self.titleLabel.frame = CGRectMake(CGRectGetMaxX(self.imageView.frame) + 4, 0, CGRectGetWidth(self.frame) - CGRectGetWidth(self.imageView.frame) - 4 - 4, CGRectGetHeight(self.frame));
}

@end
