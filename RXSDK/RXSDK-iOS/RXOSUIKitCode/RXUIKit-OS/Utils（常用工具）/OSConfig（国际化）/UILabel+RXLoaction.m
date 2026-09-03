//
//  UILabel+RXLoaction.m
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/16.
//

#import "UILabel+RXLoaction.h"
#import "RXLocation.h"
#import <objc/runtime.h>
#import "RXOSUserUtility.h"

@implementation UILabel (RXLoaction)

//重写initialize
+ (void)initialize
{
    Class class = [self class];
//    SEL originalSelector = @selector(setShadowOffset:);
    SEL originalSelector = @selector(setShadowOffset:);
    SEL swizzledSelector = @selector(setOSText:);
    Method originalMethod = class_getInstanceMethod(class, originalSelector);
    Method swizzledMethod = class_getInstanceMethod(class, swizzledSelector);
    BOOL didAddMethod = class_addMethod(class,
                            originalSelector,
                            method_getImplementation(swizzledMethod),
                            method_getTypeEncoding(swizzledMethod));

    if (didAddMethod) {
        class_replaceMethod(class,
                            swizzledSelector,
                            method_getImplementation(originalMethod),
                            method_getTypeEncoding(originalMethod));
    } else {
        method_exchangeImplementations(originalMethod, swizzledMethod);
    }
}

- (void)setOSText:(CGRect)string
{
    NSString *osStr = [RXLocation osLaunguage:self.text];
    if (osStr.length > 0) {
        [self setText:osStr];        
    }
}

- (void)layoutSubviews
{
    if ([RXOSUserUtility sharedManager].osVersible) return;
    [super layoutSubviews];
    self.shadowOffset = CGSizeMake(0, 0);
//    btn.titleLabel.shadowOffset = CGSizeMake(0, 0);
}

@end
