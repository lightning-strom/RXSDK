//
//  RXInsideWebViewManager.h
//  RXUIKit
//
//  Created by 陈汉 on 2025/1/20.
//

#import <Foundation/Foundation.h>
#import <WebKit/WebKit.h>
#import <RXSDK_Pure/RXSDK_Pure.h>

NS_ASSUME_NONNULL_BEGIN

typedef void(^WebViewComplete)(NSDictionary *response);

@interface RXInsideWebViewManager : NSObject

@property (nonatomic, copy) WebViewComplete complete;

+ (instancetype)sharedSDK;

- (void)fetchJSInfoWithMethod:(NSString *)method
                         info:(id)info
                      webView:(WKWebView *)webView;

@end

NS_ASSUME_NONNULL_END
