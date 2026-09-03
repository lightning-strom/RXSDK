//
//  RXLoginChangeBtn.m
//  RXUIKit
//
//  Created by 陈汉 on 2024/6/6.
//

#import "RXLoginChangeBtn.h"
#import "RXUICommonTool.h"
@implementation RXLoginChangeBtn

- (void)layoutSubviews
{
    [super layoutSubviews];
    
    if (RXAC) {
        self.imageView.frame = CGRectMake(0, 9.5, 16, 16);
    } else {
        self.imageView.frame = CGRectMake(0, 10, 16, 16);
    }
    
    
    self.titleLabel.frame = CGRectMake(17, 0, self.frame.size.width - 17, self.frame.size.height);
}

@end
