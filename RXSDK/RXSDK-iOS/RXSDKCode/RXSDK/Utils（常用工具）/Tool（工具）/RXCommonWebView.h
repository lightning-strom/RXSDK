//
//  RXCommonWebView.h
//  RXSDK
//
//  Created by 陈汉 on 2023/6/10.
//

#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>

NS_ASSUME_NONNULL_BEGIN

typedef void(^WebViewComplete)(NSDictionary *response);

@interface RXCommonWebView : UIView

@property (nonatomic, strong) NSString *urlStr;
@property (nonatomic, strong) NSMutableDictionary *params;
@property (nonatomic, strong) WKWebView *webView;
@property (nonatomic, copy) WebViewComplete complete;

- (void)setCookie;

@end

NS_ASSUME_NONNULL_END
