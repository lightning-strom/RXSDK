//
//  RXIMRTCAuthInfo.h
//  RXIMSdk
//
//  Created by 魏永健 on 2022/12/20.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXIMRTCAuthInfo : NSObject

@property (nonatomic, copy) NSString *userid;

@property (nonatomic, copy) NSString *appid;

@property (nonatomic, copy) NSString *nonce;

@property (nonatomic, copy) NSString *channelid;

@property (nonatomic, copy) NSString *token;

@property (nonatomic, copy) NSString *timestamp;

@property (nonatomic, strong) NSArray *gslb;

@end

NS_ASSUME_NONNULL_END
