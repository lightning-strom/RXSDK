//
//  RXPublicWebView.h
//  RXPublicToolKit
//
//  Created by 陈汉 on 2024/4/9.
//

#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>
#import "RXPublicWebViewNaviBarView.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^ResultBlock)(NSString *resultUrl);
typedef void(^WebViewComplete)(NSDictionary *response);

@interface RXPublicWebView : UIViewController

@property (nonatomic, strong) NSString *urlStr;
@property (nonatomic, strong) NSString *titleStr;
@property (nonatomic, assign) BOOL isShowBackBtn;
@property (nonatomic, strong) WKWebView *webView;
@property (nonatomic, assign) RXPublicWebviewTitleStyle titleStyle;
@property (nonatomic, strong) RXPublicWebViewNaviBarView *naviBar;
@property (nonatomic, strong) NSString *resultUrl;
@property (nonatomic, copy) ResultBlock resultBlock;
@property (nonatomic, copy) WebViewComplete complete;

- (void)dismiss;

/**
 * 设置写入数据
 */
- (NSString *)setCookie:(NSDictionary *)cookie;

@end

NS_ASSUME_NONNULL_END
