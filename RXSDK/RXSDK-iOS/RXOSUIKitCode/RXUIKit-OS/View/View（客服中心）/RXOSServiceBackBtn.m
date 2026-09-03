//
//  RXOSServiceBackBtn.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/6/27.
//

#import "RXOSServiceBackBtn.h"

@implementation RXOSServiceBackBtn

- (void)layoutSubviews
{
    [super layoutSubviews];
    
    self.imageView.frame = CGRectMake(17, 7, 41, 41);
    
    self.titleLabel.frame = CGRectMake(0, CGRectGetMaxY(self.imageView.frame), CGRectGetWidth(self.frame), 16);
    self.titleLabel.textAlignment = NSTextAlignmentCenter;
}

@end
