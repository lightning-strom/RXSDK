//
//  RXOSUserCenterView.h
//  RXUIKit
//
//  Created by 陈汉 on 2023/4/26.
//

#import <UIKit/UIKit.h>
#import "RXOSWKWebView.h"
#import "RXOSUserCenterConfig.h"
#import "RXOSCommonHeader.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXOSUserCenterView : UIView

@property (nonatomic, strong) UILabel *usernameLbl;
@property (nonatomic, strong) NSString *urlStr;
@property (nonatomic, strong) RXOSWKWebView *webView;

- (instancetype)initWithConfig:(RXOSUserCenterConfig *)config
                      complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

- (void)hide;

@end

NS_ASSUME_NONNULL_END
