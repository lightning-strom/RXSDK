//
//  RXWKInsideController.h
//  RXUIKit
//
//  Created by 陈汉 on 2025/1/20.
//

#import <UIKit/UIKit.h>
#import "RXInsideWebView.h"
#import "RXUserCenterConfig.h"
#import "RXUICommonHeader.h"
#import "RXServiceBackBtn.h"

typedef enum : NSUInteger {
    InsideServiceType_chat,
    InsideServiceType_center,
} InsideServiceType;

NS_ASSUME_NONNULL_BEGIN

@interface RXWKInsideController : UIViewController

@property (nonatomic, strong) RXInsideWebView *webView;
@property (nonatomic, strong) RXServiceBackBtn *closeBtn;
@property (nonatomic, assign) InsideServiceType type;

// 最大化
- (void)showView;

@end

NS_ASSUME_NONNULL_END
