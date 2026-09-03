//
//  RXRequest.h
//  RXPushSDK
//
//  Created by 陈汉 on 2022/2/16.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXRequest : NSObject

+ (void)requestWithUrl:(NSString *)urlString requestType:(NSString *)type dictionary:(NSDictionary *)dictionary SuccessBlock:(void(^)(NSDictionary *responseObject))successBlock ErrorBlock:(void(^)(id error))errorBlock;

@end

NS_ASSUME_NONNULL_END
