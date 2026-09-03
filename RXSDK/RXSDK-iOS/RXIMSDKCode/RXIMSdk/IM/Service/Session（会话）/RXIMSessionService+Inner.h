//
//  RXIMSessionService+Inner.h
//  RXIMSdk
//
//  Created by weiyongjian on 2022/2/18.
//


#ifdef RXIMSDK
#import <RXIMSdk/RXIMSdk.h>
#else
#import <RXIMSdk_business/RXIMSdk_business.h>
#endif
#import "RXIMSessionServer.h"
#import "RXIMSession.h"
#import "RXIMSessionService.h"


NS_ASSUME_NONNULL_BEGIN

@interface RXIMSessionService (Inner)

/**
 * 接收消息处理
 */
- (void)receiveMessageHandle:(NSArray *)msgs;

-(RXIMSession *)sessionServerToSession:(RXIMSessionServer *)serverModel;

- (void)fetchConversationListInternal:(void (^)(RXIMError *error))completionHandler;

- (NSMutableDictionary *)getSetedImsExt:(NSString *)covId;

@end

NS_ASSUME_NONNULL_END
