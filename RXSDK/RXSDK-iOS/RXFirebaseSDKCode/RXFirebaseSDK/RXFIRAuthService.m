//
//  RXFIRAuthService.m
//  RXFirebaseSDK
//
//  Created by 陈汉 on 2024/6/3.
//

#import "RXFIRAuthService.h"
//#import <FirebaseAuth/FirebaseAuth.h>

@interface RXFIRAuthService ()

//@property (nonatomic, strong) FIRAuth *handle;

@end

@implementation RXFIRAuthService

static RXFIRAuthService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXFIRAuthService alloc] init];
    });
    return sharedSDK;
}

/**
 * 授权登录
 */
- (void)signInWithEmail
{
//    [[FIRAuth auth] createUserWithEmail:@"chenhanmail1@163.com"
//                               password:@"111111"
//                             completion:^(FIRAuthDataResult * _Nullable authResult,
//                                          NSError * _Nullable error) {
//        NSLog(@"");
//    }];
//    
//    [[FIRAuth auth] signInWithEmail:@"chenhanmail1@163.com"
//                           password:@"111111"
//                         completion:^(FIRAuthDataResult * _Nullable authResult,
//                                      NSError * _Nullable error) {
//        NSLog(@"");
//    }];
}

/**
 * 监听授权
 */
- (void)addAuthStateDidChangeListener
{
//    [[FIRAuth auth] removeAuthStateDidChangeListener:_handle];
//    self.handle = [[FIRAuth auth] addAuthStateDidChangeListener:^(FIRAuth * _Nonnull auth, FIRUser * _Nullable user) {
//        NSLog(@"");
//    }];
}

@end
