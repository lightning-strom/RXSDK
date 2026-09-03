//
//  RXADJThirdPartySharing.h
//  RXAdjustSDK
//
//  Created by 陈汉 on 2023/8/12.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RXADJThirdPartySharing : NSObject

@property (nonatomic, nullable, readonly, strong) NSNumber *enabled;
@property (nonatomic, nonnull, readonly, strong) NSMutableDictionary *granularOptions;
@property (nonatomic, nonnull, readonly, strong) NSMutableDictionary *partnerSharingSettings;

@property (nonatomic, strong) NSMutableArray *granularPName;
@property (nonatomic, strong) NSMutableArray *granularKeys;
@property (nonatomic, strong) NSMutableArray *granularValues;

@property (nonatomic, strong) NSMutableArray *partnerPName;
@property (nonatomic, strong) NSMutableArray *partnerKeys;
@property (nonatomic, strong) NSMutableArray *partnerValues;

- (nullable id)initWithIsEnabledNumberBool:(nullable NSNumber *)isEnabledNumberBool;

- (void)addGranularOption:(nonnull NSString *)partnerName
                      key:(nonnull NSString *)key
                    value:(nonnull NSString *)value;

- (void)addPartnerSharingSetting:(nonnull NSString *)partnerName
                             key:(nonnull NSString *)key
                           value:(BOOL)value;

@end

NS_ASSUME_NONNULL_END
