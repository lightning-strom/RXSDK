//
//  RXMoreLoginBtn.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/3/16.
//

#import "RXMoreLoginBtn.h"

@implementation RXMoreLoginBtn

- (void)layoutSubviews
{
    [super layoutSubviews];
    
    self.imageView.frame = CGRectMake(0, 0, 59, 59);
    
    self.titleLabel.frame = CGRectMake(0, 64, self.frame.size.width, 17);
    self.titleLabel.textAlignment = NSTextAlignmentCenter;
}

@end
