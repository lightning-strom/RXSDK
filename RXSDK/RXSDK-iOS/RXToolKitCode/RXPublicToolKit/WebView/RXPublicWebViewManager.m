//
//  RXPublicWebViewManager.m
//  RXPublicToolKit
//
//  Created by 陈汉 on 2024/5/15.
//

#import "RXPublicWebViewManager.h"
#import "RXPublicWebView.h"
#import "RXToolExtension.h"
#import "RXToolPrivate.h"

@implementation RXPublicWebViewManager

static RXPublicWebViewManager *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXPublicWebViewManager alloc] init];
    });
    return sharedSDK;
}

- (void)fetchJSInfoWithMethod:(NSString *)method
                         info:(id)info
                      webView:(WKWebView *)webView
{
    if ([method isEqualToString:@"openWebView"]) {
        
        RXPublicWebView *webView = [[RXPublicWebView alloc] init];
        webView.modalPresentationStyle = UIModalPresentationFullScreen;
        
        webView.urlStr = info;
        
        [[RXToolPrivate currentViewController].navigationController presentViewController:webView animated:YES completion:nil];
        
    } else if ([method isEqualToString:@"setCloseVisible"]) {
        
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:@([info boolValue]) forKey:@"isShowClose"];
        [[NSNotificationCenter defaultCenter] postNotificationName:RXToolNoti_showClose object:nil userInfo:dic];
        
    } else if ([method isEqualToString:@"setBackVisible"]) {
        
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:@([info boolValue]) forKey:@"isShowBack"];
        [[NSNotificationCenter defaultCenter] postNotificationName:RXToolNoti_showBack object:nil userInfo:dic];
        
    } else if ([method isEqualToString:@"getInitParams"]) {
                
        NSString *jsonStr = [RXToolExtension getJsonString:self.cookies];
        
        NSString *jsStr = [NSString stringWithFormat:@"getInitParams('%@')", jsonStr];
        [webView evaluateJavaScript:jsStr completionHandler:^(id response, NSError * error) {
               NSLog(@"response: %@, \nerror: %@", response, error);
        }];
        
    } else if ([method isEqualToString:@"closeWebView"]) {
        
        [[NSNotificationCenter defaultCenter] postNotificationName:RXToolNoti_closeWebView object:nil userInfo:nil];
        
    } else if ([method isEqualToString:@"setNaviBarVisible"]) {
        
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:@([info boolValue]) forKey:@"isShowNaviBar"];
        [[NSNotificationCenter defaultCenter] postNotificationName:RXToolNoti_setNaviBarVisible object:nil userInfo:nil];
        
    } else if ([method isEqualToString:@"setTitle"]) {
        
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setValue:info forKey:@"title"];
        [[NSNotificationCenter defaultCenter] postNotificationName:RXToolNoti_setTitle object:nil userInfo:dic];
        
    } else if ([method isEqualToString:@"invokeNativeCallback"]) {
        NSDictionary *dic = [RXToolPrivate dictionaryWithJsonString:info];
        NSString *method = dic[@"type"];
        if (self.complete) {
            self.complete(dic);
            [[NSNotificationCenter defaultCenter] postNotificationName:RXToolNoti_closeWebView object:nil userInfo:dic];
        } else {
            [[NSNotificationCenter defaultCenter] postNotificationName:RXToolNoti_closeWebView object:nil userInfo:dic];
        }
    }
}

@end
