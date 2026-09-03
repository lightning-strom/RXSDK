//
//  RXOSWebViewController.h
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/16.
//

#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXOSWebViewController : UIViewController

@property (nonatomic, strong) NSString *urlStr;
@property (nonatomic, strong) WKWebView *webView;

@end

NS_ASSUME_NONNULL_END
