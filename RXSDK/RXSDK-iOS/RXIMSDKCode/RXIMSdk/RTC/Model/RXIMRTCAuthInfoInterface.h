//
//  RXIMRTCAuthInfoInterface.h
//  RXIMSdk
//
//  Created by 魏永健 on 2022/12/20.
//

#import "RXIMBaseInterfaceModel.h"
#import "RXIMRTCAuthInfo.h"

NS_ASSUME_NONNULL_BEGIN

@interface RXIMRTCAuthInfoInterface : RXIMBaseInterfaceModel

@property (nonatomic, strong) RXIMRTCAuthInfo *data;

@end

NS_ASSUME_NONNULL_END
