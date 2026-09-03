//
//  RXADJThirdPartySharing.m
//  RXAdjustSDK
//
//  Created by 陈汉 on 2023/8/12.
//

#import "RXADJThirdPartySharing.h"

@implementation RXADJThirdPartySharing

- (nullable id)initWithIsEnabledNumberBool:(nullable NSNumber *)isEnabledNumberBool {
    self = [super init];
    if (self == nil) {
        return nil;
    }

    _enabled = isEnabledNumberBool;
    _granularOptions = [[NSMutableDictionary alloc] init];
    _partnerSharingSettings = [[NSMutableDictionary alloc] init];
    _granularPName = [NSMutableArray array];
    _granularKeys = [NSMutableArray array];
    _granularValues = [NSMutableArray array];
    _partnerPName = [NSMutableArray array];
    _partnerKeys = [NSMutableArray array];
    _partnerValues = [NSMutableArray array];
    

    return self;
}

- (void)addGranularOption:(nonnull NSString *)partnerName
                      key:(nonnull NSString *)key
                    value:(nonnull NSString *)value {

    [_granularPName addObject:partnerName];
    [_granularKeys addObject:key];
    [_granularValues addObject:key];
    
    NSMutableDictionary *partnerOptions = [self.granularOptions objectForKey:partnerName];
    if (partnerOptions == nil) {
        partnerOptions = [[NSMutableDictionary alloc] init];
        [self.granularOptions setObject:partnerOptions forKey:partnerName];
    }

    [partnerOptions setObject:value forKey:key];
}

- (void)addPartnerSharingSetting:(nonnull NSString *)partnerName
                             key:(nonnull NSString *)key
                           value:(BOOL)value {

    [_partnerPName addObject:partnerName];
    [_partnerKeys addObject:key];
    [_partnerValues addObject:key];
    
    NSMutableDictionary *partnerSharingSetting = [self.partnerSharingSettings objectForKey:partnerName];
    if (partnerSharingSetting == nil) {
        partnerSharingSetting = [[NSMutableDictionary alloc] init];
        [self.partnerSharingSettings setObject:partnerSharingSetting forKey:partnerName];
    }
    
    [partnerSharingSetting setObject:[NSNumber numberWithBool:value] forKey:key];
}

@end
