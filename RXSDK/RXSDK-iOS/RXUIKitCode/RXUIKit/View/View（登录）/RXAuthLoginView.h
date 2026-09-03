//
//  RXAuthLoginView.h
//  RXSDK
//
//  Created by 陈汉 on 2021/10/14.
//

#import <UIKit/UIKit.h>
#import "RXUICommonHeader.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^LoginCallBack)(NSDictionary *response, RXCommonRequestError *error);

@interface RXAuthLoginView : UIView

- (instancetype)initWithPrivacy1:(NSString *)privacy1
                        privacy2:(NSString *)privacy2
                        callBack:(LoginCallBack)callBack;

@end

NS_ASSUME_NONNULL_END
