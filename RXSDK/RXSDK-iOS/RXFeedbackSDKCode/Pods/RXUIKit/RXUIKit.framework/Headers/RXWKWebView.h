//
//  RXWKWebView.h
//  RXUIKit
//
//  Created by 陈汉 on 2023/4/27.
//

#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>
#import "RXCloseBtn.h"
#import "RXUserCenterConfig.h"
#import <RXSDK_Pure/RXSDK_Pure.h>

NS_ASSUME_NONNULL_BEGIN

typedef void(^WebViewComplete)(NSDictionary *response);
typedef void(^WebViewClose)(void);
typedef void(^CloseComplete)(RX_CommonRequestError *error);

@interface RXWKWebView : UIView

@property (nonatomic, strong) NSString *urlStr;
@property (nonatomic, strong) WKWebView *webView;
@property (nonatomic, copy) WebViewComplete complete;
@property (nonatomic, copy) WebViewClose close;
@property (nonatomic, copy) CloseComplete rightClose;
@property (nonatomic, strong) UIView *naviBar;
@property (nonatomic, strong) RXCloseBtn *backBtn;
@property (nonatomic, strong) RXCloseBtn *closeBtn;
@property (nonatomic, strong) UIView *line;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, assign) BOOL visibleHUD;
@property (nonatomic, strong) RXUserCenterConfig *userCenterConfig;
@property (nonatomic, assign) BOOL isUserCenter;
@property (nonatomic, assign) BOOL needRefreshToken;
@property (nonatomic, assign) BOOL needOri;
@property (nonatomic, assign) BOOL isService;
@property (nonatomic, strong) NSString *protocolKey;
@property (nonatomic, strong) NSArray *protocolKeyList;

- (NSString *)setCookie;

- (void)showNavi:(BOOL)show;

- (void)layoutViews;

@end

NS_ASSUME_NONNULL_END
