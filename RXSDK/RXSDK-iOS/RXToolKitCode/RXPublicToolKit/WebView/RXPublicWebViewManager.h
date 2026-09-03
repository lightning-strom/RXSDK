//
//  RXPublicWebViewManager.h
//  RXPublicToolKit
//
//  Created by 陈汉 on 2024/5/15.
//

#import <Foundation/Foundation.h>
#import <WebKit/WebKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef void(^WebViewComplete)(NSDictionary *response);

@interface RXPublicWebViewManager : NSObject

@property (nonatomic, copy) WebViewComplete complete;
@property (nonatomic, strong) NSDictionary *cookies;

+ (instancetype)sharedSDK;

- (void)fetchJSInfoWithMethod:(NSString *)method
                         info:(id)info
                      webView:(WKWebView *)webView;

@end

NS_ASSUME_NONNULL_END
