//
//  RXInsideUserCenterView.h
//  RXUIKit
//
//  Created by 陈汉 on 2025/1/20.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "RXUserCenterConfig.h"
#import "RXUICommonHeader.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXInsideUserCenterView : UIView

@property (nonatomic, strong) UILabel *usernameLbl;

- (instancetype)initWithConfig:(RXUserCenterConfig *)config
                      complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

- (void)setCookie;

- (void)hide;

@end

NS_ASSUME_NONNULL_END
