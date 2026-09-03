//
//  RXOSUILoginConfig.m
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/15.
//

#import "RXOSUILoginConfig.h"
#import "RXOSUserUtility.h"

@implementation RXOSUILoginConfig

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.isShowClose = YES;
        self.needRealAuth = NO;
        self.isQuickButtonBarVisible = YES;
        self.canCloseRealAuth = YES;
        self.loginViewType = 0;
        self.keyboardType = 1;
        self.language_default = @"ZH";
        self.setShowPrivacy = YES;
        
//        UIImage *image = [RXOSUserUtility sharedManager].logoImage;
//        if (image) {
//            self.logoImage = image;
//        }
    }
    return self;
}

//- (void)setLogoImage:(UIImage *)logoImage
//{
//    _logoImage = logoImage;
//    [RXOSUserUtility saveLogoImage:logoImage];
//}

@end
