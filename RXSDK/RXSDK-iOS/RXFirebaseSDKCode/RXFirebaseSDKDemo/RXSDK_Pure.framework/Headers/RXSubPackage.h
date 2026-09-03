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

/** AliDNS  **/
@property (nonatomic, assign) BOOL aAliDNS;

/** TencentDNS  **/
@property (nonatomic, assign) BOOL aTencentDNS;

/** Adjust  **/
@property (nonatomic, assign) BOOL aAdjust;
@property (nonatomic, strong) NSString *adid;

/** Firebase  **/
@property (nonatomic, assign) BOOL aFirebase;
@property (nonatomic, strong) NSString *instanceId;

@end

NS_ASSUME_NONNULL_END
