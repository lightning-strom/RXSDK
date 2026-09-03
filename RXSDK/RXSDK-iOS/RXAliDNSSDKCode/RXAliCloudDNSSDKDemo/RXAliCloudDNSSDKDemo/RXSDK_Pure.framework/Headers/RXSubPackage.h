//
//  RXSubPackage.h
//  RXSDK-Pure
//
//  Created by 陈汉 on 2025/9/24.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXSubPackage : NSObject

+ (instancetype)sharedSDK;

@property (nonatomic, assign) BOOL aAliDNS;
@property (nonatomic, assign) BOOL aTencentDNS;

@end

NS_ASSUME_NONNULL_END
