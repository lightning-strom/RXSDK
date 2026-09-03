//
//  RXSBtn.m
//  RXShareKit
//
//  Created by 陈汉 on 2022/5/27.
//

#import "RXSBtn.h"

@implementation RXSBtn

- (void)layoutSubviews
{
    [super layoutSubviews];
    
    self.imageView.frame = CGRectMake(self.frame.size.width / 6, self.frame.size.width / 6, self.frame.size.width / 3 * 2, self.frame.size.height / 3 * 2);
}

@end
