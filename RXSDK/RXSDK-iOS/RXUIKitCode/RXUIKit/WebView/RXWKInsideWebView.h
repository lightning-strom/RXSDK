//
//  RXWKInsideWebView.h
//  RXUIKit
//
//  Created by 陈汉 on 2025/1/20.
//

#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>
#import <RXSDK_Pure/RXSDK_Pure.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXWKInsideWebView : UIView

@property (nonatomic, strong) WKWebView *webView;

- (NSString *)setCookie;

- (instancetype)initWithWebView:(WKWebView *)webView;

@end

NS_ASSUME_NONNULL_END
