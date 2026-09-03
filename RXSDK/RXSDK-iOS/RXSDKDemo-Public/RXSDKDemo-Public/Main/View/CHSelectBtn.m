//
//  CHSelectBtn.m
//  RXSDKDemo-Public
//
//  Created by 陈汉 on 2024/1/2.
//

#import "CHSelectBtn.h"

@implementation CHSelectBtn

- (void)layoutSubviews
{
    self.titleLabel.frame = CGRectMake(0, 0, CGRectGetWidth(self.frame) - 11, CGRectGetHeight(self.frame));
    self.titleLabel.textAlignment = NSTextAlignmentRight;
    
    self.imageView.frame = CGRectMake(CGRectGetWidth(self.frame) - 4, 3, 4, 8);
    self.imageView.image = [UIImage imageNamed:@"rightIcon"];
    
}

@end
