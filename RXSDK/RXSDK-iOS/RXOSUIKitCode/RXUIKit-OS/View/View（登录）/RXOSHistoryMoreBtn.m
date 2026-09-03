//
//  RXOSHistoryMoreBtn.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/6/1.
//

#import "RXOSHistoryMoreBtn.h"

@implementation RXOSHistoryMoreBtn

- (void)layoutSubviews
{
    [super layoutSubviews];
    
    self.imageView.frame = CGRectMake(14, 8, 18, 18);
    self.imageView.layer.cornerRadius = 9;
    
    self.titleLabel.frame = CGRectMake(36, 0, self.frame.size.width - 36, self.frame.size.height);
}

@end
