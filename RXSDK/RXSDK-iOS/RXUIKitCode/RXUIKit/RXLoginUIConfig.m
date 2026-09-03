//
//  RXLoginUIConfig.m
//  RXUIKit
//
//  Created by 陈汉 on 2023/3/15.
//

#import "RXLoginUIConfig.h"
#import "RXUIUserUtility.h"

@implementation RXLoginUIConfig

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.isShowClose = YES;
        self.needRealAuth = YES;
        self.isQuickButtonBarVisible = YES;
        self.canCloseRealAuth = NO;
        self.loginViewType = 0;
        self.keyboardType = 1;
        
//        UIImage *image = [RXUIUserUtility sharedManager].logoImage;
//        if (image) {
//            self.logoImage = image;
//        }
    }
    return self;
}

//- (void)setLogoImage:(UIImage *)logoImage
//{
//    _logoImage = logoImage;
//    [RXUIUserUtility saveLogoImage:logoImage];
//}

- (void)setKeyboardType:(NSInteger)keyboardType
{
    _keyboardType = 1;
}

- (void)setLoginViewType:(NSInteger)loginViewType
{
    _loginViewType = loginViewType;
}

//- (void)setNeedRealAuth:(BOOL)needRealAuth
//{
//    _needRealAuth = YES;
//}
//
//- (void)setCanCloseRealAuth:(BOOL)canCloseRealAuth
//{
//    _canCloseRealAuth = NO;
//}

@end
