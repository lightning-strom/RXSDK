//
//  RXOSAccountBtn.m
//  RXUIKit
//
//  Created by 陈汉 on 2022/3/9.
//

#import "RXOSAccountBtn.h"
#import "NSString+RXOSAddition.h"

@implementation RXOSAccountBtn

- (void)layoutSubviews
{
    [super layoutSubviews];
    
    self.imageView.frame = CGRectMake(CGRectGetWidth(self.frame) / 2 - 15, CGRectGetHeight(self.frame) / 2 - 15, 30, 30);

}

@end
