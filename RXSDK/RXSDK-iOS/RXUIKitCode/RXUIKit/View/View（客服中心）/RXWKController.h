//
//  RXWKController.h
//  RXUIKit
//
//  Created by 陈汉 on 2023/7/4.
//

#import <UIKit/UIKit.h>
#import "RXWKWebView.h"
#import "RXUserCenterConfig.h"
#import "RXUICommonHeader.h"
#import "RXServiceBackBtn.h"

typedef enum : NSUInteger {
    ServiceType_chat,
    ServiceType_center,
    ServiceType_default,
} ServiceType;

NS_ASSUME_NONNULL_BEGIN

@interface RXWKController : UIViewController

@property (nonatomic, strong) RXWKWebView *webView;
@property (nonatomic, strong) RXServiceBackBtn *closeBtn;
@property (nonatomic, assign) ServiceType type;
@property (nonatomic, strong) NSString *url;
@property (nonatomic, strong) NSString *viewTag;

// 最大化
- (void)showView;

- (void)hide;

@end

NS_ASSUME_NONNULL_END
