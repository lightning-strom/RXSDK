//
//  RXInsideWebViewManager.m
//  RXUIKit
//
//  Created by 陈汉 on 2025/1/20.
//

#import "RXInsideWebViewManager.h"
#import "RXUICommonHeader.h"
#import "RXWKInsideController.h"
#import "RXInsideUserCenterView.h"

@interface RXInsideWebViewManager ()

@property (nonatomic, strong) RXWKInsideController *serviceCenter;
@property (nonatomic, strong) RXWKInsideController *chatService;

@end

@implementation RXInsideWebViewManager

static RXInsideWebViewManager *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXInsideWebViewManager alloc] init];
    });
    return sharedSDK;
}

- (void)fetchJSInfoWithMethod:(NSString *)method
                         info:(id)info
                      webView:(WKWebView *)webView
{
    if ([method isEqualToString:@"openHelpCenter"]) {
        
//        [RXUIUserUtility sharedManager].userCenterConfig = config;
        if ([RXUIUserUtility sharedManager].isShowServiceCenter) {
            [self.serviceCenter showView];
        } else {
    //        self.serviceCenter = [[RXServiceCenterView alloc] initWithConfig:config type:ServiceType_center complete:complete];
            
            self.serviceCenter = [[RXWKInsideController alloc] init];
            self.serviceCenter.type = InsideServiceType_center;
            self.serviceCenter.modalPresentationStyle = UIModalPresentationFullScreen;
            [[UIViewController currentViewController] presentViewController:self.serviceCenter animated:NO completion:nil];
        }
        
    } else if ([method isEqualToString:@"openCustomerService"]) {
        
//        [RXUIUserUtility sharedManager].userCenterConfig = config;
        if ([RXUIUserUtility sharedManager].isShowServiceCenter) {
            [self.chatService showView];
        } else {
    //        self.serviceCenter = [[RXServiceCenterView alloc] initWithConfig:config type:ServiceType_chat complete:complete];
            
            self.chatService = [[RXWKInsideController alloc] init];
            self.chatService.type = InsideServiceType_chat;
            self.chatService.modalPresentationStyle = UIModalPresentationFullScreen;
            [[UIViewController currentViewController] presentViewController:self.chatService animated:NO completion:nil];
        }
        
    } else if ([method isEqualToString:@"openUserCenter"]) {
        
        RXUserCenterConfig *config = [[RXUserCenterConfig alloc] init];
        RXInsideUserCenterView *userCenter = [[RXInsideUserCenterView alloc] initWithConfig:config complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            
        }];
    } else if ([method isEqualToString:@"openSystemWebView"]) {
        
        NSString *url = [NSString stringWithFormat:@"%@", info];
        if (url.length > 0) {
            [[UIApplication sharedApplication] openURL:[NSURL URLWithString:url] options:nil completionHandler:nil];
        }
        
    }
}

@end
