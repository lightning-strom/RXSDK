//
//  RXAccountBtn.m
//  RXUIKit
//
//  Created by 陈汉 on 2022/3/9.
//

#import "RXAccountBtn.h"
#import "NSString+RXAddition.h"

@implementation RXAccountBtn

- (void)layoutSubviews
{
    [super layoutSubviews];
    
    CGFloat w = [self.titleLabel.text widthForFont:self.titleLabel.font] + 22 + 2;
    
    self.imageView.frame = CGRectMake(10, 10, 22, 22);
    
    self.titleLabel.frame = CGRectMake(22 + 12, 0, self.frame.size.width - 22, self.frame.size.height);
}

@end
