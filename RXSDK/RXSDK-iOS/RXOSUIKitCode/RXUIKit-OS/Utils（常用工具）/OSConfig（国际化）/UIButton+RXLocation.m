//
//  UIButton+RXLocation.m
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/20.
//

#import "UIButton+RXLocation.h"
#import "RXLocation.h"
#import <objc/runtime.h>
#import "RXOSUserUtility.h"

static const char Btn_ImgViewStyle_Key;
static const char Btn_ImgSize_key;
static const char Btn_ImgSpace_key;

@interface UIButton ()

@end

@implementation UIButton (RXLoaction)

+ (void)load
{
    
}

//重写initialize
+ (void)initialize
{
    Method m1 = class_getInstanceMethod([self class], @selector(setTintColor:));
    Method m2 = class_getInstanceMethod([self class], @selector(layoutSubviews1:));
    method_exchangeImplementations(m1, m2);
}

- (void)layoutSubviews1:(UIColor *)color
{
    NSString *osStr = [RXLocation osLaunguage:self.titleLabel.text];
    if (osStr.length > 0) {
        [self setTitle:osStr forState:UIControlStateNormal];
    }
}

- (void)layoutSubviews
{
    if ([RXOSUserUtility sharedManager].osVersible) return;
    [super layoutSubviews];
//    self.titleLabel.shadowOffset = CGSizeMake(0, 0);
}


@end
