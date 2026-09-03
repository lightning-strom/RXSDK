//
//  RXOSWKWebView.h
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/6/16.
//

#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>
#import "RXOSCloseBtn.h"
#import "RXOSUserCenterConfig.h"
#import "RXOSCommonTool.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^WebViewComplete)(NSDictionary *response);
typedef void(^WebViewClose)(void);
typedef void(^CloseComplete)(RX_CommonRequestError *error);

@interface RXOSWKWebView : UIView

@property (nonatomic, strong) NSString *urlStr;
@property (nonatomic, strong) WKWebView *webView;
@property (nonatomic, copy) RequestComplete commonComplete;
@property (nonatomic, copy) WebViewComplete complete;
@property (nonatomic, copy) WebViewClose close;
@property (nonatomic, copy) CloseComplete rightClose;
@property (nonatomic, strong) UIView *naviBar;
@property (nonatomic, strong) RXOSCloseBtn *backBtn;
@property (nonatomic, strong) RXOSCloseBtn *closeBtn;
@property (nonatomic, strong) RXOSUserCenterConfig *userCenterConfig;
@property (nonatomic, strong) UIView *line;
@property (nonatomic, strong) UILabel *titleLbl;
@property (nonatomic, assign) BOOL visibleHUD;
@property (nonatomic, assign) BOOL isUserCenter;
@property (nonatomic, assign) BOOL needRefreshToken;
@property (nonatomic, assign) BOOL needOri;
@property (nonatomic, strong) NSString *protocolKey;
@property (nonatomic, strong) NSString *region;
@property (nonatomic, strong) NSArray *protocolKeyList;
@property (nonatomic, strong) NSString *viewTag;

- (void)setCookie;

- (void)showNavi:(BOOL)show;

- (void)layoutViews;

- (void)refreshWebView;

@end

NS_ASSUME_NONNULL_END
