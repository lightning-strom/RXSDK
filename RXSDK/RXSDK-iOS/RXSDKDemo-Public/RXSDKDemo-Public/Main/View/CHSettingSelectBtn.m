//
//  CHSettingSelectBtn.m
//  RXSDKDemo-Public
//
//  Created by 陈汉 on 2024/1/3.
//

#import "CHSettingSelectBtn.h"

@implementation CHSettingSelectBtn

- (void)layoutSubviews
{
    self.imageView.frame = CGRectMake(0, 3, 16, 16);
    
    self.titleLabel.frame = CGRectMake(24, 0, CGRectGetWidth(self.frame) - 24, CGRectGetHeight(self.frame));
}

@end
