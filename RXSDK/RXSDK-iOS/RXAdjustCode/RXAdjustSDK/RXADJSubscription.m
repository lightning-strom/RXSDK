//
//  RXADJSubscription.m
//  RXAdjustSDK
//
//  Created by 陈汉 on 2023/8/12.
//

#import "RXADJSubscription.h"

@interface RXADJSubscription()

@property (nonatomic, strong) NSMutableDictionary *mutableCallbackParameters;

@property (nonatomic, strong) NSMutableDictionary *mutablePartnerParameters;

@end

@implementation RXADJSubscription

- (nullable id)initWithPrice:(nonnull NSDecimalNumber *)price
                    currency:(nonnull NSString *)currency
               transactionId:(nonnull NSString *)transactionId
                  andReceipt:(nonnull NSData *)receipt {
    self = [super init];
    if (self == nil) {
        return nil;
    }

    _price = [price copy];
    _currency = [currency copy];
    _transactionId = [transactionId copy];
    _receipt = [receipt copy];
    _billingStore = @"iOS";
    
    self.callbackKeys = [NSMutableArray array];
    self.callbackValues = [NSMutableArray array];
    self.partnerKeys = [NSMutableArray array];
    self.partnerValues = [NSMutableArray array];
    
    return self;
}

- (void)setTransactionDate:(NSDate *)transactionDate {
    @synchronized (self) {
        _transactionDate = [transactionDate copy];
    }
}

- (void)setSalesRegion:(NSString *)salesRegion {
    @synchronized (self) {
        _salesRegion = [salesRegion copy];
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

        if ([self.mutableCallbackParameters objectForKey:immutableKey]) {
            
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

        if ([self.mutablePartnerParameters objectForKey:immutableKey]) {
            
        }

        [self.mutablePartnerParameters setObject:immutableValue forKey:immutableKey];
        
        [self.partnerKeys addObject:key];
        [self.partnerValues addObject:value];
    }
}

- (nonnull NSDictionary *)callbackParameters {
    return [self.mutableCallbackParameters copy];
}

- (nonnull NSDictionary *)partnerParameters {
    return [self.mutablePartnerParameters copy];
}

@end
