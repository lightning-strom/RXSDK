//
//  RXADJAdRevenue.m
//  RXAdjustSDK
//
//  Created by 陈汉 on 2023/8/12.
//

#import "RXADJAdRevenue.h"

@interface RXADJAdRevenue()

@property (nonatomic, strong) NSMutableDictionary *mutableCallbackParameters;

@property (nonatomic, strong) NSMutableDictionary *mutablePartnerParameters;

@end

@implementation RXADJAdRevenue

- (nullable id)initWithSource:(NSString *)source {
    self = [super init];
    if (self == nil) {
        return nil;
    }

    _source = source;
    
    self.callbackKeys = [NSMutableArray array];
    self.callbackValues = [NSMutableArray array];
    self.partnerKeys = [NSMutableArray array];
    self.partnerValues = [NSMutableArray array];
    
    return self;
}

- (void)setRevenue:(double)amount currency:(NSString *)currency {
    NSNumber *revenue = [NSNumber numberWithDouble:amount];

    _revenue = revenue;
    @synchronized (self) {
        _currency = [currency copy];
    }
}

- (void)setAdImpressionsCount:(int)adImpressionsCount {
    NSNumber *nAdImpressionsCount = [NSNumber numberWithInt:adImpressionsCount];
    _adImpressionsCount = nAdImpressionsCount;
}

- (void)setAdRevenueNetwork:(nonnull NSString *)adRevenueNetwork {
    @synchronized (self) {
        _adRevenueNetwork = [adRevenueNetwork copy];
    }
}

- (void)setAdRevenueUnit:(nonnull NSString *)adRevenueUnit {
    @synchronized (self) {
        _adRevenueUnit = [adRevenueUnit copy];
    }
}

- (void)setAdRevenuePlacement:(nonnull NSString *)adRevenuePlacement {
    @synchronized (self) {
        _adRevenuePlacement = [adRevenuePlacement copy];
    }
}

- (void)addCallbackParameter:(nonnull NSString *)key
                       value:(nonnull NSString *)value
{
    @synchronized (self) {
        NSString *immutableKey = [key copy];
        NSString *immutableValue = [value copy];


        if (self.mutableCallbackParameters == nil) {
            self.mutableCallbackParameters = [[NSMutableDictionary alloc] init];
        }

        [self.mutableCallbackParameters setObject:immutableValue forKey:immutableKey];
        
        [self.callbackKeys addObject:key];
        [self.callbackValues addObject:value];
    }
}

- (void)addPartnerParameter:(nonnull NSString *)key
                      value:(nonnull NSString *)value
{
    @synchronized (self) {
        NSString *immutableKey = [key copy];
        NSString *immutableValue = [value copy];

        if (self.mutablePartnerParameters == nil) {
            self.mutablePartnerParameters = [[NSMutableDictionary alloc] init];
        }

        [self.mutablePartnerParameters setObject:immutableValue forKey:immutableKey];
        
        [self.partnerKeys addObject:key];
        [self.partnerValues addObject:value];
    }
}

- (NSDictionary *)callbackParameters {
    @synchronized (self) {
        return (NSDictionary *)self.mutableCallbackParameters;
    }
}

- (NSDictionary *)partnerParameters {
    @synchronized (self) {
        return (NSDictionary *)self.mutablePartnerParameters;
    }
}

- (BOOL)isValid {
    return self.source != nil && [self.source length] > 0;
}

@end
