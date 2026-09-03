//
//  RXLoginBtn.m
//  RXSDK
//
//  Created by 陈汉 on 2021/9/29.
//

#import "RXLoginBtn.h"

@implementation RXLoginBtn

- (void)layoutSubviews
{
    [super layoutSubviews];
    
    self.imageView.frame = CGRectMake(self.titleLabel.frame.origin.x - 25, self.frame.size.height / 2 - 8.5, 17, 17);
}

@end
