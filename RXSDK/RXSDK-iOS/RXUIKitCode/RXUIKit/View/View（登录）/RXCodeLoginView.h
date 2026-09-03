//
//  RXCodeLoginView.h
//  RXUIKit
//
//  Created by 陈汉 on 2023/2/6.
//

#import <UIKit/UIKit.h>
#import "RXLoginUIConfig.h"
#import "RXUICommonHeader.h"

NS_ASSUME_NONNULL_BEGIN

typedef NSDictionary *_Nullable(^LoginTypeBlock)(NSDictionary *loginEvent, LoginType loginType);
typedef void(^LoginComplete)(NSDictionary *response, RX_CommonRequestError *error);

@interface RXCodeLoginView : UIView

@property (nonatomic, copy) LoginTypeBlock loginTypeBlock;
@property (nonatomic, copy) LoginComplete loginComplete;

- (instancetype)initWithAccount:(NSString *)account;

@end

NS_ASSUME_NONNULL_END
