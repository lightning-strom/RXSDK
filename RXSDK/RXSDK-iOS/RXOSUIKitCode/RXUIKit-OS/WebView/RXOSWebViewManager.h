//
//  RXOSWebViewManager.h
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/16.
//

#import <Foundation/Foundation.h>
#import <WebKit/WebKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef void(^WebViewComplete)(NSDictionary *response);

@interface RXOSWebViewManager : NSObject

@property (nonatomic, copy) WebViewComplete complete;

+ (instancetype)sharedSDK;

- (void)fetchJSInfoWithMethod:(NSString *)method
                         info:(id)info
                      webView:(WKWebView *)webView;
@end

NS_ASSUME_NONNULL_END
