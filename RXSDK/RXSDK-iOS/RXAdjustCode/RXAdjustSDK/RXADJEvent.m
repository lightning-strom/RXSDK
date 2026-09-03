//
//  RXADJEvent.m
//  RXAdjustSDK
//
//  Created by 陈汉 on 2023/8/10.
//

#import "RXADJEvent.h"

@interface RXADJEvent ()

@end

@implementation RXADJEvent

+ (RXADJEvent *)eventWithEventToken:(NSString *)eventToken {
    return [[RXADJEvent alloc] initWithEventToken:eventToken];
}

- (id)initWithEventToken:(NSString *)eventToken {
    self = [super init];
    if (self == nil) {
        return nil;
    }

    self.callbackMutableParameters = [NSMutableDictionary dictionary];
    self.partnerMutableParameters = [NSMutableDictionary dictionary];
    
    if (eventToken && eventToken.length > 0) {
        _eventToken = [eventToken copy];
    }

    return self;
}

- (void)setRevenue:(double)amount currency:(nonnull NSString *)currency
{
    _amount = amount;
    _currency = currency;
    _isSetRevenue = YES;
}

- (void)setTransactionId:(nonnull NSString *)transactionId
{
    _transactionId = transactionId;
    _isSetTransactionId = YES;
}

- (void)addCallbackParameter:(nonnull NSString *)key value:(nonnull NSString *)value
{
    [_callbackMutableParameters setValue:key forKey:value];
}

- (void)addPartnerParameter:(nonnull NSString *)key value:(nonnull NSString *)value
{
    [_partnerMutableParameters setValue:key forKey:value];
}

- (void)setCallbackId:(nonnull NSString *)callbackId
{
    _callbackId = callbackId;
    _isSetCallbackId = YES;
}

@end
