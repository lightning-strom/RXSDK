//
//  RXADJTool.m
//  RXAdjustSDK
//
//  Created by 陈汉 on 2023/8/10.
//

#import "RXADJTool.h"
#import <objc/runtime.h>

@implementation RXADJTool

+ (ADJLogLevel)getADJLogLevel:(RXADJLogLevel)rxLogLevel
{
    switch (rxLogLevel) {
        case RXADJLogLevelInfo:
            return ADJLogLevelInfo;
        case RXADJLogLevelWarn:
            return ADJLogLevelWarn;
        case RXADJLogLevelDebug:
            return ADJLogLevelDebug;
        case RXADJLogLevelError:
            return ADJLogLevelError;
        case RXADJLogLevelAssert:
            return ADJLogLevelAssert;
        case RXADJLogLevelVerbose:
            return ADJLogLevelVerbose;
        case RXADJLogLevelSuppress:
            return ADJLogLevelSuppress;
        default:
            return ADJLogLevelInfo;
    }
}

+ (ADJEvent *)getADJEvent:(RXADJEvent *)rxEvent
{
    ADJEvent *adjEvent = [[ADJEvent alloc] initWithEventToken:rxEvent.eventToken];
    
    // 记录事件收入
    if (rxEvent.isSetRevenue) {
        [adjEvent setRevenue:rxEvent.amount currency:rxEvent.currency];
    }
    
    // 事件去重
    if (rxEvent.isSetTransactionId) {
        [adjEvent setTransactionId:rxEvent.transactionId];
    }
    
    // 回传参数
    if (rxEvent.callbackMutableParameters.allKeys.count > 0) {
        for (int i = 0; i < rxEvent.callbackMutableParameters.allKeys.count; i++) {
            NSString *key = rxEvent.callbackMutableParameters.allKeys[i];
            [adjEvent addCallbackParameter:key value:[rxEvent.callbackMutableParameters valueForKey:key]];
        }
    }
    
    // 合作伙伴参数
    if (rxEvent.partnerMutableParameters.allKeys.count > 0) {
        for (int i = 0; i < rxEvent.partnerMutableParameters.allKeys.count; i++) {
            NSString *key = rxEvent.partnerMutableParameters.allKeys[i];
            [adjEvent addPartnerParameter:key value:[rxEvent.partnerMutableParameters valueForKey:key]];
        }
    }
    
    // 添加回传标识符
    if (rxEvent.isSetCallbackId) {
        [adjEvent setCallbackId:rxEvent.callbackId];
    }
    
    return adjEvent;
}

+ (ADJSubscription *)getADJSubscription:(RXADJSubscription *)subscription
{
    ADJSubscription *adjSubscription = [[ADJSubscription alloc] initWithPrice:subscription.price
                                                                     currency:subscription.currency
                                                                transactionId:subscription.transactionId
                                                                   andReceipt:subscription.receipt];
    
    [adjSubscription setTransactionDate:subscription.transactionDate];
    [adjSubscription setSalesRegion:subscription.salesRegion];
    
    if (subscription.callbackKeys.count > 0) {
        for (int i = 0; i < subscription.callbackKeys.count; i++) {
            [subscription addCallbackParameter:subscription.callbackKeys[i] value:subscription.callbackValues[i]];
        }
    }
    
    if (subscription.partnerKeys.count > 0) {
        for (int i = 0; i < subscription.partnerKeys.count; i++) {
            [subscription addPartnerParameter:subscription.partnerKeys[i] value:subscription.partnerValues[i]];
        }
    }
    
    return adjSubscription;
}

+ (RXADJEventSuccess *)getRXEventSuccess:(ADJEventSuccess *)adjEventSuccess
{
    RXADJEventSuccess *rxEventSuccess = [[RXADJEventSuccess alloc] init];
    rxEventSuccess.message = adjEventSuccess.message;
    rxEventSuccess.timeStamp = adjEventSuccess.timeStamp;
    rxEventSuccess.adid = adjEventSuccess.adid;
    rxEventSuccess.eventToken = adjEventSuccess.eventToken;
    rxEventSuccess.callbackId = adjEventSuccess.callbackId;
    rxEventSuccess.jsonResponse = adjEventSuccess.jsonResponse;
    
    return rxEventSuccess;
}

+ (RXADJEventFailure *)getRXEventFailure:(ADJEventFailure *)adjEventFailure
{
    RXADJEventFailure *rxEventFailure = [[RXADJEventFailure alloc] init];
    rxEventFailure.message = adjEventFailure.message;
    rxEventFailure.timeStamp = adjEventFailure.timeStamp;
    rxEventFailure.adid = adjEventFailure.adid;
    rxEventFailure.eventToken = adjEventFailure.eventToken;
    rxEventFailure.callbackId = adjEventFailure.callbackId;
    rxEventFailure.willRetry = adjEventFailure.willRetry;
    rxEventFailure.jsonResponse = adjEventFailure.jsonResponse;
    
    return rxEventFailure;
}

+ (RXADJSessionSuccess *)getRXSessionSuccess:(ADJSessionSuccess *)adjSessionSuccess
{
    RXADJSessionSuccess *rxSessionSuccess = [[RXADJSessionSuccess alloc] init];
    rxSessionSuccess.message = adjSessionSuccess.message;
    rxSessionSuccess.timeStamp = adjSessionSuccess.timeStamp;
    rxSessionSuccess.adid = adjSessionSuccess.adid;
    rxSessionSuccess.jsonResponse = adjSessionSuccess.jsonResponse;
    
    return rxSessionSuccess;
}

+ (RXADJSessionFailure *)getRXSessionFailure:(ADJSessionFailure *)adjSessionFailure
{
    RXADJSessionFailure *rxSessionFailure = [[RXADJSessionFailure alloc] init];
    rxSessionFailure.message = adjSessionFailure.message;
    rxSessionFailure.timeStamp = adjSessionFailure.timeStamp;
    rxSessionFailure.adid = adjSessionFailure.adid;
    rxSessionFailure.willRetry = adjSessionFailure.willRetry;
    rxSessionFailure.jsonResponse = adjSessionFailure.jsonResponse;
    
    return rxSessionFailure;
}

+ (RXADJAttribution *)getADJAttribution:(ADJAttribution *)adjAttribution
{
    RXADJAttribution *rxAttribution = [[RXADJAttribution alloc] init];
    rxAttribution.trackerToken = adjAttribution.trackerToken;
    rxAttribution.trackerName = adjAttribution.trackerName;
    rxAttribution.network = adjAttribution.network;
    rxAttribution.campaign = adjAttribution.campaign;
    rxAttribution.adgroup = adjAttribution.adgroup;
    rxAttribution.creative = adjAttribution.creative;
    rxAttribution.clickLabel = adjAttribution.clickLabel;
    rxAttribution.adid = adjAttribution.adid;
    rxAttribution.costType = adjAttribution.costType;
    rxAttribution.costAmount = adjAttribution.costAmount;
    rxAttribution.costCurrency = adjAttribution.costCurrency;
    
    return rxAttribution;
}

//model转化为字典
+ (NSDictionary *)dicFromObject:(NSObject *)object {
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    unsigned int count;
    objc_property_t *propertyList = class_copyPropertyList([object class], &count);
    
    for (int i = 0; i < count; i++) {
        objc_property_t property = propertyList[i];
        const char *cName = property_getName(property);
        NSString *name = [NSString stringWithUTF8String:cName];
        NSObject *value = [object valueForKey:name];//valueForKey返回的数字和字符串都是对象
        
        if ([value isKindOfClass:[NSString class]] || [value isKindOfClass:[NSNumber class]]) {
            //string , bool, int ,NSinteger
            [dic setObject:value forKey:name];
            
        } else if ([value isKindOfClass:[NSArray class]]) {
            //数组或字典
            [dic setObject:[RXADJTool arrayWithObject:value] forKey:name];
        } else if ([value isKindOfClass:[NSDictionary class]]) {
            //数组或字典
            [dic setObject:[RXADJTool dicWithObject:value] forKey:name];
        } else if (value == nil) {
            //null
            //[dic setObject:[NSNull null] forKey:name];//这行可以注释掉?????
        } else {
            //model
            [dic setObject:[RXADJTool dicFromObject:value] forKey:name];
        }
    }
    
    return [dic copy];
}

+ (NSArray *)arrayWithObject:(id)object {
    //数组
    NSMutableArray *array = [NSMutableArray array];
    NSArray *originArr = (NSArray *)object;
    if ([originArr isKindOfClass:[NSArray class]]) {
        for (NSObject *object in originArr) {
            if ([object isKindOfClass:[NSString class]]||[object isKindOfClass:[NSNumber class]]) {
                //string , bool, int ,NSinteger
                [array addObject:object];
            } else if ([object isKindOfClass:[NSArray class]]) {
                //数组或字典
                [array addObject:[RXADJTool arrayWithObject:object]];
            } else if ([object isKindOfClass:[NSDictionary class]]) {
                //数组或字典
                [array addObject:[RXADJTool dicWithObject:object]];
            } else {
                //model
                [array addObject:[RXADJTool dicFromObject:object]];
            }
        }
        return [array copy];
    }
    return array.copy;
}

+ (NSDictionary *)dicWithObject:(id)object {
    //字典
    NSDictionary *originDic = (NSDictionary *)object;
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    if ([object isKindOfClass:[NSDictionary class]]) {
        for (NSString *key in originDic.allKeys) {
            id object = [originDic objectForKey:key];
            if ([object isKindOfClass:[NSString class]]||[object isKindOfClass:[NSNumber class]]) {
                //string , bool, int ,NSinteger
                [dic setObject:object forKey:key];
            } else if ([object isKindOfClass:[NSArray class]]) {
                //数组或字典
                [dic setObject:[RXADJTool arrayWithObject:object] forKey:key];
            } else if ([object isKindOfClass:[NSDictionary class]]) {
                //数组或字典
                [dic setObject:[RXADJTool dicWithObject:object] forKey:key];
            } else {
                //model
                [dic setObject:[RXADJTool dicFromObject:object] forKey:key];
            }
        }
        return [dic copy];
    }
    return dic.copy;
}

@end
