//
//  RXUserCenterView.h
//  RXUIKit
//
//  Created by 陈汉 on 2023/4/26.
//

#import <UIKit/UIKit.h>
#import "RXUserCenterConfig.h"
#import "RXUICommonHeader.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXUserCenterView : UIView

@property (nonatomic, strong) UILabel *usernameLbl;

- (instancetype)initWithConfig:(RXUserCenterConfig *)config
                      complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

- (void)setCookie;

- (void)hide;

@end

NS_ASSUME_NONNULL_END
