//
//  RXOSWKController.h
//  RXUIKit-OS
//
//  Created by 陈汉 on 2023/7/4.
//

#import <UIKit/UIKit.h>
#import "RXOSWKWebView.h"
#import "RXOSUserCenterConfig.h"
#import "RXOSCommonHeader.h"
#import "RXOSServiceBackBtn.h"

typedef enum : NSUInteger {
    ServiceType_chat,
    ServiceType_center,
    ServiceType_default,
} ServiceType;

NS_ASSUME_NONNULL_BEGIN

@interface RXOSWKController : UIViewController

@property (nonatomic, strong) RXOSWKWebView *webView;
@property (nonatomic, strong) RXOSServiceBackBtn *closeBtn;
@property (nonatomic, assign) ServiceType type;
@property (nonatomic, strong) NSString *url;
@property (nonatomic, strong) NSString *viewTag;

// 最大化
- (void)showView;

- (void)hide;

@end

NS_ASSUME_NONNULL_END
