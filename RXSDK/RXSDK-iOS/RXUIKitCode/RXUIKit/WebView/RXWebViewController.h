//
//  RXWebViewController.h
//  RXSDK
//
//  Created by 陈汉 on 2021/10/21.
//

#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXWebViewController : UIViewController

@property (nonatomic, strong) NSString *urlStr;
@property (nonatomic, strong) WKWebView *webView;

@end

NS_ASSUME_NONNULL_END
