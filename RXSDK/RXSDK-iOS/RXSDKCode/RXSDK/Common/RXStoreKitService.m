//
//  RXStoreKitService.m
//  RXSDK
//
//  Created by 陈汉 on 2023/7/17.
//

#import "RXStoreKitService.h"
#import <StoreKit/StoreKit.h>
#import "RXCommonTool.h"

typedef void(^Complete)(void);

@interface RXStoreKitService () <SKStoreProductViewControllerDelegate>

@property (nonatomic, copy) Complete complete;

@end

@implementation RXStoreKitService

static RXStoreKitService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXStoreKitService alloc] init];
    });
    return sharedSDK;
}

/**
 * 应用内拉起App页面评分
 */
- (void)inAppStoreReview:(NSString *)appid
                complete:(void(^)(void))complete
{
    self.complete = complete;
    
    SKStoreProductViewController *storeProductViewController = [[SKStoreProductViewController alloc] init];
    storeProductViewController.delegate = self;

    [storeProductViewController loadProductWithParameters:@{SKStoreProductParameterITunesItemIdentifier:appid} completionBlock:^(BOOL result, NSError * _Nullable error) {
           if (error){
               NSLog(@"error %@ with userInfo %@",error,[error userInfo]);
           }else{
               [[UIViewController currentViewController] presentViewController:storeProductViewController animated:YES completion:nil];
           }
    }];
}

// Appstore 取消按钮的回调
-(void)productViewControllerDidFinish:(SKStoreProductViewController *)viewController
{
    if (self.complete) {
        self.complete();
    }
    [viewController dismissViewControllerAnimated:YES completion:nil];
}

/**
 * 跳转到App Store评分
 * @param writeReview 是否直接拉起评论页，默认不拉起
 */
- (void)toAppStoreReview:(NSString *)appid
             writeReview:(BOOL)writeReview
{
    NSString *url = [NSString stringWithFormat:@"itms-apps://itunes.apple.com/app/id%@", appid];
    
    if (writeReview) {
        url = [NSString stringWithFormat:@"%@?action=write-review", url];
    }
    
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:url] options:nil completionHandler:nil];
}

/**
 * 应用内评分弹框
 */
- (void)alertAppReview
{
    if (__IPHONE_10_3){
            // 打开次数一年不能多于3次。（开发期间可以无限制弹出，方便测试）
            [SKStoreReviewController requestReview];
       } else {
            NSLog (@"系统版本不支持此方法");
    }
}

@end
