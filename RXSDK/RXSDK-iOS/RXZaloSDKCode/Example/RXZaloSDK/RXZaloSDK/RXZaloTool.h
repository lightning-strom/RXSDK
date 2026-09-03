//
//  RXZaloTool.h
//  RXZaloSDK
//
//  Created by 陈汉 on 2024/3/22.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXZaloTool : NSObject

+ (NSString *)generateCodeVerifier;

+ (NSString *)generateCodeChallengeWithCodeVerifier:(NSString *)codeVerifier;

+ (BOOL)isZaloInstalled;

@end

NS_ASSUME_NONNULL_END
