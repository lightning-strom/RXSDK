//
//  RXIAPService.m
//  RXSDK
//
//  Created by 陈汉 on 2022/4/8.
//

#import "RXIAPService.h"
#import "RXCommonTool.h"
#import "RXLogService.h"
#import <RXSDK_Pure/RXSDK_Pure-swift.h>
#import <objc/message.h>
#import "RXIAPManager.h"
#import "RXLogManager.h"
#import "RXBDAManager.h"

typedef void(^ProductInfoBlock)(NSArray<SKProduct *> *productInfoList);
typedef void(^IAPBlock)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error);

@interface RXIAPService() <SKPaymentTransactionObserver, SKPaymentTransactionObserver, SKProductsRequestDelegate>

@property (nonatomic, copy) NSString *selectProductID;
@property (nonatomic, copy) NSString *tradeNo;
@property (nonatomic, strong) NSMutableDictionary *orderInfo;
@property (nonatomic, copy) NSString* sandboxNum;

@property (nonatomic, strong) SKProductsRequest *productsRequest;
@property (nonatomic, strong) SKProduct *product;
@property (nonatomic, assign) NSInteger reCount;
@property (nonatomic, assign) BOOL isRefer; // 是否是查询
@property (nonatomic, copy) ProductInfoBlock productInfoBlock;
@property (nonatomic, copy) IAPBlock iapBlock;
@property (nonatomic, copy) NSString *errorJsonStr;
@property (nonatomic,strong) UIWindow *keyWindow;

@property (nonatomic, assign) NSInteger maxCount;  // 最大重试数
@property (nonatomic, assign) NSInteger duration;
@property (nonatomic, assign) NSInteger hudDuration;
@property (nonatomic, strong) NSTimer *timer;
@property (nonatomic, strong) NSTimer *hudTimer;
@property (nonatomic, strong) NSArray *fibArr;
@property (nonatomic, copy) IAPBlock reBlock;
@property (nonatomic, assign) BOOL isRe;
@property (nonatomic, assign) BOOL isOrder; // 是否下单时触发
@property (nonatomic, assign) BOOL isCloseTimer;
@property (nonatomic, assign) NSInteger interval;

@property (nonatomic, strong) NSDictionary *orderDic;
@property (nonatomic, copy) RequestComplete complete;
@property (nonatomic, assign) BOOL isSubscribeRestore; // 是否是订阅补单触发的 restoreCompletedTransactions

@end

@implementation RXIAPService

static RXIAPService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXIAPService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.reCount = 0;
        self.keyWindow = [UIApplication sharedApplication].keyWindow;
        
        self.duration = 0;
        self.hudDuration = 0;
        self.maxCount = 7;
        self.interval = 300;
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(sk2Success:) name:@"sk2Success" object:nil];
    }
    return self;
}

#pragma mark -- timer
-(void)addMTimer
{
    if (!_timer) {
        _timer = [NSTimer timerWithTimeInterval:self.duration target:self selector:@selector(timerAction) userInfo:nil repeats:YES];
        [[NSRunLoop mainRunLoop] addTimer:_timer forMode:NSRunLoopCommonModes];
        [_timer fire];
    }
}

-(void)addHudTimer
{
    if (!_hudTimer) {
        _hudTimer = [NSTimer timerWithTimeInterval:1 target:self selector:@selector(hudTimerAction) userInfo:nil repeats:YES];
        [[NSRunLoop mainRunLoop] addTimer:_hudTimer forMode:NSRunLoopCommonModes];
        [_hudTimer fire];
    }
}

- (void)hudTimerAction
{
    self.hudDuration++;
    if (self.hudDuration >= 6) {
        NSString *title = @"因网络不稳定，您的订单可能会延迟到账，请耐心等待或联系客服。";
        if ([RXConfig sharedManager].isOS) {
            title = @"Due to the unstable network, your order may be delayed. Please wait patiently or contact customer service.";
        }
        
        [self closeHudTime];
    }
}

- (void)timerAction
{
    NSLog(@"补单   %ld", self.duration);
    // 同时检查普通订单和订阅订单的本地凭证
    NSDictionary *orderInfo = [RXIAPService getReceiptData];
    if (orderInfo == nil) {
        orderInfo = [RXIAPService getSubscribeReceiptData];
    }
    if (orderInfo != nil) {
        if (self.reCount > self.maxCount) {
            // 根据订单类型清除对应的本地凭证
            NSString *timerOrderType = [NSString stringWithFormat:@"%@", orderInfo[@"ext"][@"order_type"]];
            if ([timerOrderType isEqualToString:@"subscribe"]) {
                [[RXIAPService sharedSDK] removeSubscribeReceiptData];
            } else {
                [[RXIAPService sharedSDK] removeLocReceiptData];
            }
            self.reCount = 0;
            [self closeTime];
            return;
        }
        if (self.reCount == 0) {
            
            [self addHudTimer];
        }
        // 记录重试次数
        self.reCount++;
        self.isRe = YES;
        // 补单：订阅订单统一从苹果重新获取凭证再验证，SK1 用 restore，SK2 用 restoreSubscriptionReceipts
        NSString *reOrderType = [NSString stringWithFormat:@"%@", orderInfo[@"ext"][@"order_type"]];
        if ([reOrderType isEqualToString:@"subscribe"]) {
            if ([RXUserUtility sharedManager].sk2) {
                if (@available(iOS 15.0, *)) {
                    StoreKit2Manager *s2 = [[StoreKit2Manager alloc] init];
                    [s2 restoreSubscriptionReceiptsWithCompletion:^(NSArray<NSString *> * _Nullable receiptList) {
                        if ([receiptList isKindOfClass:[NSArray class]] && receiptList.count > 0) {
                            NSMutableDictionary *response = [NSMutableDictionary dictionary];
                            if ([NSString rx_isNullToString:receiptList[0]].length > 0) {
                                [response setValue:receiptList[0] forKey:@"jws"];
                            }
                            NSMutableArray *jwsList = [NSMutableArray arrayWithArray:receiptList];
                            [self sk2VerifyJws:response jwsList:jwsList isRe:YES isOrder:NO];
                        }
                    }];
                }
            } else {
                self.isSubscribeRestore = YES;
                [[SKPaymentQueue defaultQueue] restoreCompletedTransactions];
            }
        } else {
            [[RXIAPService sharedSDK] verifyTransactionResult:orderInfo transaction:nil];
        }
        // 重新设置补单间隔
        if (self.reCount < self.fibArr.count) {
            self.duration = [self.fibArr[self.reCount] integerValue];
        } else {
            self.duration = [self.fibArr[self.fibArr.count - 1] integerValue];
        }
        [self closeTime];
    } else {
        self.isRe = NO;
        [self closeTime];
    }
}

- (void)closeTime
{
    self.isCloseTimer = YES;
    if (self.timer.isValid) {
        [self.timer invalidate];
        self.timer = nil;
    }
}

- (void)closeHudTime
{
    if (self.hudTimer.isValid) {
        [self.hudTimer invalidate];
        self.hudTimer = nil;
    }
}

//计算 Fibonacci 数列
- (NSArray *)fibonacci:(int)n
{
    if (n < 2) {
        return nil;
    }
    NSMutableArray *arrayM = @[@(0), @(5)].mutableCopy;
    for (int i = 2; i < n; ++i) {
        NSInteger fib1 = [arrayM[i - 2] integerValue];
        NSInteger fib2 = [arrayM[i - 1] integerValue];
        if (fib1 + fib2 > UINT16_MAX) {
            break;
        }
//        NSLog(@"fib  %@", @(fib1 + fib2));
        [arrayM addObject:@(fib1 + fib2)];
    }
    return arrayM;
}

#pragma mark
+ (void)checkOrderStatus:(void(^)(BOOL success))result
{
    // 检查普通订单
    NSDictionary *orderInfo = [RXIAPService getReceiptData];
    if (orderInfo != nil) {
        [RXIAPService sharedSDK].reCount++;
        [[RXIAPService sharedSDK] verifyTransactionResult:orderInfo transaction:nil];
        return;
    }
    
    // 检查订阅订单：统一从苹果重新获取凭证再验证，SK1 用 restore，SK2 用 restoreSubscriptionReceipts
    NSDictionary *subscribeOrderInfo = [RXIAPService getSubscribeReceiptData];
    if (subscribeOrderInfo != nil) {
        [RXIAPService sharedSDK].reCount++;
        if ([RXUserUtility sharedManager].sk2) {
            if (@available(iOS 15.0, *)) {
                StoreKit2Manager *s2 = [[StoreKit2Manager alloc] init];
                [s2 restoreSubscriptionReceiptsWithCompletion:^(NSArray<NSString *> * _Nullable receiptList) {
                    if ([receiptList isKindOfClass:[NSArray class]] && receiptList.count > 0) {
                        NSMutableDictionary *response = [NSMutableDictionary dictionary];
                        if ([NSString rx_isNullToString:receiptList[0]].length > 0) {
                            [response setValue:receiptList[0] forKey:@"jws"];
                        }
                        NSMutableArray *jwsList = [NSMutableArray arrayWithArray:receiptList];
                        [[RXIAPService sharedSDK] sk2VerifyJws:response jwsList:jwsList isRe:YES isOrder:NO];
                    }
                }];
            }
        } else {
            [RXIAPService sharedSDK].isSubscribeRestore = YES;
            [[SKPaymentQueue defaultQueue] restoreCompletedTransactions];
        }
    }
}

/**
 * 补单
 * @param maxCount 最大重试数，默认5次
 */
- (void)reFailOrderWithMaxCount:(NSInteger)maxCount
                       complete:(RequestComplete)complete
{
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        self.maxCount = maxCount;
        self.reBlock = complete;
        self.fibArr = [self fibonacci:UINT16_MAX];
        
        // 同时检查普通订单和订阅订单的本地凭证
        NSDictionary *orderInfo = [RXIAPService getReceiptData];
        if (orderInfo == nil) {
            orderInfo = [RXIAPService getSubscribeReceiptData];
        }

        if (orderInfo != nil) {
            self.fibArr = [self fibonacci:INT8_MAX];
            // timer 首次触发时，订阅订单会在 timerAction 中调用 restoreCompletedTransactions
            [self addMTimer];
        }
    });
}

/**
 * 查询是否需要补单
 */
- (BOOL)checkHasFailedOrder
{
    if ([RXUserUtility sharedManager].sk2) {
        if (@available(iOS 15.0, *)) {
        } else {
            [[SKPaymentQueue defaultQueue] addTransactionObserver:self];
        }
    } else {
        [[SKPaymentQueue defaultQueue] addTransactionObserver:self];
    }
    
    
    // 同时检查普通订单和订阅订单是否有未完成的补单
    NSDictionary *orderInfo = [RXIAPService getReceiptData];
    NSDictionary *subscribeOrderInfo = [RXIAPService getSubscribeReceiptData];
    
    if (orderInfo || subscribeOrderInfo) {

//        [self.productsRequest start];
        return YES;
    }
    return NO;
}

/**
 * 设置重复下单间隔，单位秒（s），默认300s
 * 防止结果回调前重复下单导致订单验证错误
 */
- (void)setInterval:(NSInteger)interval
{
    _interval = interval;
}

#pragma mark
/**
 * iap
 */
- (void)iap:(NSDictionary *)dict complete:(RequestComplete)complete
{
    BOOL isExchange = [dict[@"exchange"] boolValue];
    if (isExchange) {
        [[RXIAPManager sharedSDK] exchangeWithDic:dict complete:complete];
    } else {
        [self requestWithDict:dict completeHandle:complete];
    }
}

- (void)requestWithDict:(NSDictionary*)dict completeHandle:(RequestComplete)handle
{
    if ([RXUserUtility sharedManager].sk2) {
        if (@available(iOS 15.0, *)) {
            // 查询未结束订单
            [self sk2UnfinishUncompletedTransactionsWithOrderInfo:dict completeHandle:handle];
        } else {
            [[SKPaymentQueue defaultQueue] addTransactionObserver:self];
            
            [self fetchOrderWithDict:dict completeHandle:handle];
        }
    } else {
        [[SKPaymentQueue defaultQueue] addTransactionObserver:self];
        
        [self fetchOrderWithDict:dict completeHandle:handle];
    }
}

/**
 * storekit2 查询
 */
- (void)sk2UnfinishUncompletedTransactionsWithOrderInfo:(NSDictionary *)orderInfo
                                         completeHandle:(RequestComplete)handle
{
    // 查询未结束订单
    if ([RXUserUtility sharedManager].sk2) {
        if (@available(iOS 15.0, *)) {
            StoreKit2Manager *s2 = [[StoreKit2Manager alloc] init];
            [s2 finishUncompletedTransactionsWithCompletion:^(NSArray<NSString *> * _Nullable receiptList) {
                @try {
                    if ([receiptList isKindOfClass:[NSArray class]] && receiptList.count > 0) {
                        
                        // 有未结束订单先校验
                        NSMutableDictionary *response = [NSMutableDictionary dictionary];
                        if ([NSString rx_isNullToString:receiptList[0]].length > 0) {
                            [response setValue:receiptList[0] forKey:@"jws"];
                        }
                        NSMutableArray *jwsList = [NSMutableArray arrayWithArray:receiptList];
                        [self sk2VerifyJws:response jwsList:jwsList isRe:YES isOrder:YES];
                        
                        return;
                    }
                    
                    if ([orderInfo isKindOfClass:[NSDictionary class]] && orderInfo.allKeys.count > 0) {
                        self.orderDic = orderInfo;
                        self.complete = handle;
                        
                        [self fetchOrderWithDict:orderInfo completeHandle:handle];
                    }
                    
                } @catch (NSException *exception) {
                    if ([orderInfo isKindOfClass:[NSDictionary class]] && orderInfo.allKeys.count > 0) {
                        [self fetchOrderWithDict:orderInfo completeHandle:handle];
                    }
                } @finally {
                    
                }
            }];
        }
    }
}

- (void)fetchOrderWithDict:(NSDictionary*)dict completeHandle:(RequestComplete)handle
{
    self.iapBlock = handle;
    // 同时检查普通订单和订阅订单是否有未完成的补单
    NSDictionary *orderInfo = [RXIAPService getReceiptData];
    if (orderInfo == nil) {
        orderInfo = [RXIAPService getSubscribeReceiptData];
    }
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:dict];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_openId] forKey:@"openid"];
    [dic setValue:@(1) forKey:@"callback_from"]; // 成功后的回调是否是客户端发起 客户端发起传: 1
    
    NSString *type = [RXIAPManager fetchType:dict[@"hq_type"]];

    [dic setValue:type forKey:@"hq_type"];
    
    BOOL mod = [RXUserUtility boolForKey:keyUserData_uploadMod];
    if (mod && [NSString rx_isNullToString:[RXCommonTool rxGetiPhoneDeviceType]].length > 0) {
        [dic setValue:[RXCommonTool rxGetiPhoneDeviceType] forKey:@"device_model"];
    }
    
    if (orderInfo != nil) {
        [RXIAPService checkOrderStatus:^(BOOL success) {
            if (success) {
                [self requestingWithDict:dic];
            } else {
                if (self.iapBlock) {
                    NSDictionary *userInfo = @{@"code" : @(RXIAPError_reFail),
                                               @"msg" : [RXErrorTool getRXErrorMsg:RXIAPError_reFail],
                    };
                    
                    RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
                    rxError.responesObject = userInfo;
                    
                    if (rxError != nil) {
                        rxError.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:rxError.responesObject];
                    }
                    
                    if (self.iapBlock) {
                        self.iapBlock(nil, rxError);
                    }
                    
                    [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                                   bodyDic:@{}
                                                                    action:rxlog_error_iap
                                                                       url:@""
                                                                      code:rxError.responesObject[@"code"] == nil ? -123 : [rxError.responesObject[@"code"] integerValue]
                                                                       msg:rxError.responesObject[@"msg"]
                                                                 thirdType:type
                                                                 thirdcode:-123
                                                                  thirdmsg:@""
                                                                   traceid:@""];
                }
            }
        }];
    } else {
        [self requestingWithDict:dic];
    }
}

- (void)requestingWithDict:(NSDictionary *)dict
{
    self.sandboxNum = [NSString stringWithFormat:@"%@", dict[@"env"]];
    self.tradeNo = dict[@"trade_no"];
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:dict];
    [dic setValue:@(1) forKey:@"callback_from"];
    NSString *type = [RXIAPManager fetchType:dict[@"hq_type"]];

    [dic setValue:type forKey:@"hq_type"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_openId] forKey:@"openid"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_source] forKey:@"source"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_subchannelid] forKey:@"sub_channel_id"];
    [dic setValue:@([RXUserUtility sharedManager].age) forKey:@"age"];
    
    NSString *currencySymbol = [NSString stringWithFormat:@"%@", dic[@"currency_symbol"]];
    if ([NSString rx_isNullToString:currencySymbol].length > 0) {
        [dic setValue:currencySymbol forKey:@"currency_symbol"];
    } else {
        [dic setValue:[RXUserUtility sharedManager].currencySymbol forKey:@"currency_symbol"];
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/ke/order" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"下单成功:\n %@", responseObject);
        
        NSDictionary *dataDic = responseObject[@"data"];
        NSDictionary *dicm = [NSDictionary dictionaryWithDictionary:[dataDic objectForKey:@"ext"]];
        self.orderInfo = [NSMutableDictionary dictionaryWithDictionary:dataDic];
        self.selectProductID = [NSString stringWithFormat:@"%@", [dicm objectForKey:@"third_tag"]].copy;
        
        [RXUserUtility setValue:[NSMutableDictionary dictionaryWithDictionary:self.orderInfo] ForKey:keyUserData_orderInfo];
        [RXUserUtility setValue:self.sandboxNum ForKey:keyUserData_sanboxNum];
        [RXUserUtility setValue:self.selectProductID ForKey:keyUserData_selectProductID];
        [RXUserUtility setValue:[NSString stringWithFormat:@"%@", dict[@"is_debug"]] ForKey:keyUserData_isDebug];
//        [RXUserUtility setValue:@([RXCommonTool getTimestamp]) ForKey:keyUserData_creatOrder];
//        [RXUserUtility setBool:NO ForKey:keyUserData_orderFinished];
        
        NSMutableDictionary *orderInfo = [NSMutableDictionary dictionary];
        if (self.orderInfo && self.orderInfo.allKeys.count > 0) {
            orderInfo = [NSMutableDictionary dictionaryWithDictionary:self.orderInfo];
        }
        
        NSMutableDictionary *properties = [NSMutableDictionary dictionary];
//        [properties setValue:self.orderInfo forKey:@"order"];
        for (int i = 0; i < self.orderInfo.allKeys.count; i++) {
            if (self.orderInfo.allValues[i]) {
                [properties setValue:self.orderInfo.allValues[i] forKey:self.orderInfo.allKeys[i]];
            }
        }
        [properties setValue:@"下单成功" forKey:@"state"];
        [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_requestproduct distinctId:@"" properties:properties];
        
        if ([type isEqualToString:@"iap"]) {
            [self startRequestProducts];
        } else {
            
        }

    } failure:^(RX_CommonRequestError * _Nullable error) {
        if (self.iapBlock) {
            self.iapBlock(nil, error);
        }
    
//        [self startRequestProducts];
        NSLog(@"下单失败:\n %@", error.error);
        NSMutableDictionary *properties = [NSMutableDictionary dictionary];
        [properties setValue:error.responesObject forKey:@"order"];
        [properties setValue:@"下单失败" forKey:@"state"];
        [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_requestproduct distinctId:@"" properties:properties];
    }];
}

- (void)startRequestProducts
{
    if ([RXUserUtility sharedManager].sk2) {
        if (@available(iOS 15.0, *)) {
            [[SKPaymentQueue defaultQueue] removeTransactionObserver:self];
            
            StoreKit2Manager *s2 = [[StoreKit2Manager alloc] init];
            
//            NSMutableDictionary *s2Dic = [NSMutableDictionary dictionary];
//            [s2Dic setValue:@"com.night7.diamond108" forKey:@"productID"];
//            [s2Dic setValue:self.selectProductID forKey:@"productID"];
            
            [s2 finishUncompletedTransactionsWithCompletion:^(NSArray<NSString *> * _Nullable receiptList) {
                [s2 fetchProductsWithOrderInfo:self.selectProductID completionHandler:^(BOOL success, NSError * _Nullable error) {
                    if (success) {
                        
                        NSMutableDictionary *properties = [NSMutableDictionary dictionary];
                        //                    [properties setValue:self.orderInfo forKey:@"order"];
                        for (int i = 0; i < self.orderInfo.allKeys.count; i++) {
                            if (self.orderInfo.allValues[i]) {
                                [properties setValue:self.orderInfo.allValues[i] forKey:self.orderInfo.allKeys[i]];
                            }
                        }
                        [properties setValue:@"" forKey:@"productid"];
                        [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_getproduct distinctId:@"" properties:properties];
                        
                        //                    [s2 purchaseProductsWithCompletionHandler:^(NSError * _Nullable error) {
                        //                        NSLog(@"结果");
                        //                    }];c2f85fb7-cf0b-4153-9c51-64da96278c29
                        
                        NSString *fetchOrderId = [RXCommonTool orderIdToUid:self.orderInfo[@"order_no"]];
                        
                        [s2 purchaseProductsWithUid:fetchOrderId completionHandler:^(NSDictionary<NSString *,id> * _Nullable response, NSError * _Nullable error) {
                            NSInteger code = [response[@"code"] integerValue];
                            NSString *msg = response[@"msg"];
                            NSString *uuid = [NSString stringWithFormat:@"%@", response[@"uuid"]];
                            
                            NSLog(@"sk2 uid = %@", uuid);
                            
                            // iap 成功
                            if (code == 0) {
                                //                            // 保存凭证
                                //                            NSMutableDictionary *order = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_orderInfo]];
                                //                            self.orderInfo = order;
                                //                            self.sandboxNum = [RXUserUtility valueForKey:keyUserData_sanboxNum];
                                //                            self.selectProductID = [RXUserUtility valueForKey:keyUserData_selectProductID];
                                //
                                //                            NSMutableDictionary *dictInfo = [NSMutableDictionary dictionaryWithDictionary:self.orderInfo];
                                //                            [dictInfo setValue:response[@"jws"] forKey:@"store_kit_2_jws"];
                                //                            [dictInfo setValue:self.selectProductID forKey:@"selectProductID"];
                                //                            [dictInfo setValue:@([[RXUserUtility valueForKey:keyUserData_isDebug] integerValue]) forKey:@"is_debug"];
                                //                            [dictInfo setValue:@([self.sandboxNum integerValue]) forKey:@"env"];
                                //
                                //                            //1.保存订单号和凭证到本地.
                                //                            [RXUserUtility setValue:dictInfo ForKey:keyUserData_orderInfo];
                                //                            [self saveReceiptData:dictInfo];
                                //
                                //                            [self verifyTransactionResult:dictInfo transaction:nil];
                                //
                                //                            NSMutableDictionary *properties = [NSMutableDictionary dictionary];
                                //            //                [properties setValue:self.orderInfo forKey:@"order"];
                                //                            for (int i = 0; i < self.orderInfo.allKeys.count; i++) {
                                //                                if (self.orderInfo.allValues[i]) {
                                //                                    [properties setValue:self.orderInfo.allValues[i] forKey:self.orderInfo.allKeys[i]];
                                //                                }
                                //                            }
                                //                            [properties setValue:@"交易完成" forKey:@"state"];
                                //                            if (response[@"jws"]) {
                                //                                [properties setValue:response[@"jws"] forKey:@"jws"];
                                //                            }
                                //
                                //                            [properties setValue:uuid forKey:@"uuid"];
                                //
                                //                            [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_transactions distinctId:@"" properties:properties];
                                
                            } else if (code == -1) {
                                NSDictionary *userInfo = @{@"code" : @(RXIAPError_noProducts),
                                                           @"msg" : [RXErrorTool getRXErrorMsg:RXIAPError_noProducts]
                                };
                                RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
                                rxError.responesObject = userInfo;
                                
                                if (rxError != nil) {
                                    rxError.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:rxError.responesObject];
                                }
                                
                                if (self.iapBlock) {
                                    self.iapBlock(nil, rxError);
                                }
                                
                                NSMutableDictionary *properties = [NSMutableDictionary dictionary];
                                //        [properties setValue:self.orderInfo forKey:@"order"];
                                for (int i = 0; i < self.orderInfo.allKeys.count; i++) {
                                    if (self.orderInfo.allValues[i]) {
                                        [properties setValue:self.orderInfo.allValues[i] forKey:self.orderInfo.allKeys[i]];
                                    }
                                }
                                [properties setValue:@"" forKey:@"productid"];
                                [properties setValue:uuid forKey:@"uuid"];
                                [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_getproduct distinctId:@"" properties:properties];
                                
                                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                                               bodyDic:@{}
                                                                                action:rxlog_error_iap
                                                                                   url:@""
                                                                                  code:rxError.responesObject[@"code"] == nil ? -123 : [rxError.responesObject[@"code"] integerValue]
                                                                                   msg:rxError.responesObject[@"msg"]
                                                                             thirdType:@"iap"
                                                                             thirdcode:-123
                                                                              thirdmsg:@""
                                                                               traceid:@""];
                            } else if (code == -2) {
                                NSDictionary *userInfo = @{@"code" : @(RXIAPError_default),
                                                           @"msg" : msg
                                };
                                RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
                                rxError.responesObject = userInfo;
                                
                                if (self.iapBlock) {
                                    self.iapBlock(nil, rxError);
                                }
                                
                                NSMutableDictionary *properties = [NSMutableDictionary dictionary];
                                //                [properties setValue:self.orderInfo forKey:@"order"];
                                for (int i = 0; i < self.orderInfo.allKeys.count; i++) {
                                    if (self.orderInfo.allValues[i]) {
                                        [properties setValue:self.orderInfo.allValues[i] forKey:self.orderInfo.allKeys[i]];
                                    }
                                }
                                [properties setValue:[NSString stringWithFormat:@"交易失败--%@", msg] forKey:@"state"];
                                [properties setValue:@(code) forKey:@"code"];
                                [properties setValue:uuid forKey:@"uuid"];
                                [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_transactions distinctId:@"" properties:properties];
                                
                                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                                               bodyDic:@{}
                                                                                action:rxlog_error_iap
                                                                                   url:@""
                                                                                  code:rxError.responesObject[@"code"] == nil ? -123 : [rxError.responesObject[@"code"] integerValue]
                                                                                   msg:rxError.responesObject[@"msg"]
                                                                             thirdType:@"iap"
                                                                             thirdcode:-123
                                                                              thirdmsg:@""
                                                                               traceid:@""];
                            } else if (code == -3) {
                                NSDictionary *userInfo = @{@"code" : @(RXIAPError_cancel),
                                                           @"msg" : [RXErrorTool getRXErrorMsg:RXIAPError_cancel],
                                };
                                RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
                                rxError.responesObject = userInfo;
                                
                                if (rxError != nil) {
                                    rxError.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:rxError.responesObject];
                                }
                                
                                if (self.iapBlock) {
                                    self.iapBlock(nil, rxError);
                                }
                                
                                NSMutableDictionary *properties = [NSMutableDictionary dictionary];
                                //                [properties setValue:self.orderInfo forKey:@"order"];
                                for (int i = 0; i < self.orderInfo.allKeys.count; i++) {
                                    if (self.orderInfo.allValues[i]) {
                                        [properties setValue:self.orderInfo.allValues[i] forKey:self.orderInfo.allKeys[i]];
                                    }
                                }
                                [properties setValue:@"交易取消" forKey:@"state"];
                                [properties setValue:@(code) forKey:@"code"];
                                [properties setValue:uuid forKey:@"uuid"];
                                [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_transactions distinctId:@"" properties:properties];
                                
                                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                                               bodyDic:@{}
                                                                                action:rxlog_error_iap
                                                                                   url:@""
                                                                                  code:rxError.responesObject[@"code"] == nil ? -123 : [rxError.responesObject[@"code"] integerValue]
                                                                                   msg:rxError.responesObject[@"msg"]
                                                                             thirdType:@"iap"
                                                                             thirdcode:-123
                                                                              thirdmsg:@""
                                                                               traceid:@""];
                            } else if (code == -5) {
                                NSDictionary *userInfo = @{@"code" : @(RXIAPError_default),
                                                           @"msg" : msg
                                };
                                RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
                                rxError.responesObject = userInfo;
                                
                                if (self.iapBlock) {
                                    self.iapBlock(nil, rxError);
                                }
                                
                                NSMutableDictionary *properties = [NSMutableDictionary dictionary];
                                //                [properties setValue:self.orderInfo forKey:@"order"];
                                for (int i = 0; i < self.orderInfo.allKeys.count; i++) {
                                    if (self.orderInfo.allValues[i]) {
                                        [properties setValue:self.orderInfo.allValues[i] forKey:self.orderInfo.allKeys[i]];
                                    }
                                }
                                [properties setValue:@"交易失败--未知错误" forKey:@"state"];
                                [properties setValue:@(code) forKey:@"code"];
                                [properties setValue:uuid forKey:@"uuid"];
                                [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_transactions distinctId:@"" properties:properties];
                                
                                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                                               bodyDic:@{}
                                                                                action:rxlog_error_iap
                                                                                   url:@""
                                                                                  code:rxError.responesObject[@"code"] == nil ? -123 : [rxError.responesObject[@"code"] integerValue]
                                                                                   msg:rxError.responesObject[@"msg"]
                                                                             thirdType:@"iap"
                                                                             thirdcode:-123
                                                                              thirdmsg:@""
                                                                               traceid:@""];
                            }
                        }];
                        
                    } else {
                        NSLog(@"获取商品失败");
                        dispatch_async(dispatch_get_main_queue(),^{
                            NSString *title = @"没有商品";
                            //                        if ([RXConfig sharedManager].isOS) {
                            //                            title = @"Not found product";
                            //                        }
                            
                            NSDictionary *userInfo = @{@"code" : @(RXIAPError_noProducts),
                                                       @"msg" : [RXErrorTool getRXErrorMsg:RXIAPError_noProducts]
                            };
                            RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
                            rxError.responesObject = userInfo;
                            
                            if (rxError != nil) {
                                rxError.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:rxError.responesObject];
                            }
                            
                            if (self.iapBlock) {
                                self.iapBlock(nil, rxError);
                            }
                            
                            [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                                           bodyDic:@{}
                                                                            action:rxlog_error_iap
                                                                               url:@""
                                                                              code:rxError.responesObject[@"code"] == nil ? -123 : [rxError.responesObject[@"code"] integerValue]
                                                                               msg:rxError.responesObject[@"msg"]
                                                                         thirdType:@"iap"
                                                                         thirdcode:-123
                                                                          thirdmsg:@""
                                                                           traceid:@""];
                        });
                        
                        NSMutableDictionary *properties = [NSMutableDictionary dictionary];
                        //                    [properties setValue:self.orderInfo forKey:@"order"];
                        for (int i = 0; i < self.orderInfo.allKeys.count; i++) {
                            if (self.orderInfo.allValues[i]) {
                                [properties setValue:self.orderInfo.allValues[i] forKey:self.orderInfo.allKeys[i]];
                            }
                        }
                        [properties setValue:@"" forKey:@"productid"];
                        [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_getproduct distinctId:@"" properties:properties];
                    }
                }];
            }];
        } else {
            [[SKPaymentQueue defaultQueue] addTransactionObserver:self];
            NSArray *productIDArray = [[NSArray alloc] initWithObjects:self.selectProductID, nil];
            NSSet *sets = [[NSSet alloc] initWithArray:productIDArray];
            
            self.isRefer = NO;
            self.productsRequest = [[SKProductsRequest alloc] initWithProductIdentifiers:sets];
            self.productsRequest.delegate = self;
            [self.productsRequest start];
        }
    } else {
        [[SKPaymentQueue defaultQueue] addTransactionObserver:self];
        NSArray *productIDArray = [[NSArray alloc] initWithObjects:self.selectProductID, nil];
//        NSArray *productIDArray = [[NSArray alloc] initWithObjects:@"", nil];
        NSSet *sets = [[NSSet alloc] initWithArray:productIDArray];
        
        self.isRefer = NO;
        self.productsRequest = [[SKProductsRequest alloc] initWithProductIdentifiers:sets];
        self.productsRequest.delegate = self;
        [self.productsRequest start];
    }
}

- (void)sk2Success:(NSNotification *)noti
{
    NSDictionary *response = noti.object;
    
    NSMutableArray *jwsList = [NSMutableArray array];
    if (response[@"jwsList"]) {
        jwsList = [NSMutableArray arrayWithArray:response[@"jwsList"]];
    }
    
    [self sk2VerifyJws:response jwsList:jwsList isRe:NO isOrder:NO];
}

/**
 * @param isRe 是否补单
 * @param isOrder 是否下单时触发
 */
- (void)sk2VerifyJws:(NSDictionary *)response jwsList:(NSMutableArray *)jwsList isRe:(BOOL)isRe isOrder:(BOOL)isOrder
{
    self.isOrder = isOrder;
    self.isRe = isRe;
    
    // 保存凭证
    NSMutableDictionary *order = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_orderInfo]];
    self.orderInfo = order;
    self.sandboxNum = [RXUserUtility valueForKey:keyUserData_sanboxNum];
    self.selectProductID = [RXUserUtility valueForKey:keyUserData_selectProductID];
    
    NSMutableDictionary *dictInfo = [NSMutableDictionary dictionaryWithDictionary:self.orderInfo];
    [dictInfo setValue:response[@"jws"] forKey:@"store_kit_2_jws"];
    if (jwsList.count > 1) {
        [dictInfo setValue:jwsList forKey:@"jws_list"];
    }
    [dictInfo setValue:self.selectProductID forKey:@"selectProductID"];
    [dictInfo setValue:@([[RXUserUtility valueForKey:keyUserData_isDebug] integerValue]) forKey:@"is_debug"];
    [dictInfo setValue:@([self.sandboxNum integerValue]) forKey:@"env"];
    
    // SK2：从 StoreKit2Manager 回调中获取价格和币种，用于验证订单接口
    if ([NSString rx_isNullToString:[NSString stringWithFormat:@"%@", response[@"price"]]].length > 0) {
        [dictInfo setValue:[NSString stringWithFormat:@"%@", response[@"price"]] forKey:@"price"];
    }
    if ([NSString rx_isNullToString:[NSString stringWithFormat:@"%@", response[@"currency"]]].length > 0) {
        [dictInfo setValue:[NSString stringWithFormat:@"%@", response[@"currency"]] forKey:@"currency"];
    }
    
    //1.保存订单号和凭证到本地.
    [RXUserUtility setValue:dictInfo ForKey:keyUserData_orderInfo];
    [self saveReceiptData:dictInfo];

    [self verifyTransactionResult:dictInfo transaction:nil];
    
    NSMutableDictionary *properties = [NSMutableDictionary dictionary];
//                [properties setValue:self.orderInfo forKey:@"order"];
    for (int i = 0; i < self.orderInfo.allKeys.count; i++) {
        if (self.orderInfo.allValues[i]) {
            [properties setValue:self.orderInfo.allValues[i] forKey:self.orderInfo.allKeys[i]];
        }
    }
    
    NSString *state = @"交易完成";
    if (isRe) {
        state = @"补单";
        if (isOrder) {
            state = @"补单--下单";
        } else {
            state = @"补单--登录";
        }
    }
    [properties setValue:state forKey:@"state"];
    if (response[@"jws"]) {
        [properties setValue:response[@"jws"] forKey:@"jws"];
    }
    
    if (response[@"uuid"]) {
        [properties setValue:[NSString stringWithFormat:@"%@", response[@"uuid"]] forKey:@"uuid"];
    }
    
    if (jwsList.count > 0) {
        [properties setValue:jwsList forKey:@"jwsList"];
    }
    
    [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_transactions distinctId:@"" properties:properties];
}

/**
 * 查询商品信息
 * @param productIdArr 商品id
 */
- (void)getProductInfoWithProductIdArr:(NSArray *)productIdArr
                              complete:(void(^)(NSArray<SKProduct *> *productInfoList))complete
{
    self.isRefer = YES;
    self.productInfoBlock = complete;
    NSSet *productSets = [[NSSet alloc] initWithArray:productIdArr];
    self.productsRequest = [[SKProductsRequest alloc] initWithProductIdentifiers:productSets];
    self.productsRequest.delegate = self;
    [self.productsRequest start];
}

/**
 * 查询商品信息
 * @note 获取账号所在地区用
 * @param productIdArr 商品id
 */
- (void)getLocalProductInfoWithProductIdArr:(NSArray *)productIdArr
                                    timeout:(NSInteger)timeout
                                   complete:(void(^)(NSArray<SKProduct *> *productInfoList))complete
{
    self.isRefer = YES;
    self.productInfoBlock = complete;
    NSSet *productSets = [[NSSet alloc] initWithArray:productIdArr];
    self.productsRequest = [[SKProductsRequest alloc] initWithProductIdentifiers:productSets];
    self.productsRequest.delegate = self;
    [self.productsRequest start];
    
    // 添加2秒超时处理
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(timeout * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        if (self.productInfoBlock) {
            self.productInfoBlock(@[]);
            self.productInfoBlock = nil;
        }
        [self.productsRequest cancel];
    });
}

/**
 * 获取地区 货币符号
 * @param productId 商品 id
 * @param timeout 请求超时时间，默认 2 秒，小于 0 为默认时间
 */
- (void)getLocaleIdentifierWithProductId:(NSString *)productId
                                 timeout:(NSInteger)timeout
                                complete:(RequestComplete)complete
{
    __block BOOL isBlock = NO;
    
    NSInteger requestTimeout = 2;
    if (timeout > 0) {
        requestTimeout = timeout;
    }
    
    if ([NSString rx_isNullToString:productId].length > 0) {
        [self getLocalProductInfoWithProductIdArr:@[productId] timeout:requestTimeout complete:^(NSArray<SKProduct *> * _Nonnull productInfoList) {
            
            // 防止特殊情况同时回调多次
            if (isBlock) {
                return;
            }
            
            @try {
                if (productInfoList.count > 0) {
                    SKProduct *sk = productInfoList[0];
                    NSLocale *locale = sk.priceLocale;
                    NSString *currency = locale.localeIdentifier.description;
                    
                    NSArray *components = [currency componentsSeparatedByString:@"@"];
                    if (components.count > 1) {
                        NSString *area = components[0];
                        NSString *cur = components[1];
                        
                        NSMutableDictionary *res = [NSMutableDictionary dictionary];
                        NSMutableDictionary *resData = [NSMutableDictionary dictionary];
                        if ([NSString rx_isNullToString:area].length > 0) {
                            [resData setValue:area forKey:@"area"];
                        }
                   
                        if ([NSString rx_isNullToString:cur].length > 0) {
                            NSString *curStr = [cur stringByReplacingOccurrencesOfString:@"currency=" withString:@""];
                            [resData setValue:curStr forKey:@"currency"];
                        }
                        
                        [resData setValue:currency forKey:@"product_info"];
                        
                        if (resData.allKeys.count > 0) {
                            [res setValue:resData forKey:@"data"];
                        }
                        
                        [res setValue:@(0) forKey:@"code"];
                        
                        if (complete) {
                            complete(res, nil);
                            isBlock = YES;
                        }
                    } else {
                        NSDictionary *userInfo = @{@"code" : @(RXIAPError_noProducts),
                                                   @"msg" : [RXErrorTool getRXErrorMsg:RXIAPError_noProducts]
                        };
                        RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
                        rxError.responesObject = userInfo;
                        
                        if (complete) {
                            complete(nil, rxError);
                            isBlock = YES;
                        }
                    }
                    
                } else {
                    NSDictionary *userInfo = @{@"code" : @(RXIAPError_noProducts),
                                               @"msg" : [RXErrorTool getRXErrorMsg:RXIAPError_noProducts]
                    };
                    RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
                    rxError.responesObject = userInfo;
                    
                    if (complete) {
                        complete(nil, rxError);
                        isBlock = YES;
                    }
                }
            } @catch (NSException *exception) {
                NSDictionary *userInfo = @{@"code" : @(RXIAPError_noProducts),
                                           @"msg" : [RXErrorTool getRXErrorMsg:RXIAPError_noProducts]
                };
                RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
                rxError.responesObject = userInfo;
                
                if (complete) {
                    complete(nil, rxError);
                    isBlock = YES;
                }
            } @finally {
                
            }
            
        }];
    } else {
        NSDictionary *userInfo = @{@"code" : @(RXIAPError_noProducts),
                                   @"msg" : [RXErrorTool getRXErrorMsg:RXIAPError_noProducts]
        };
        RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
        rxError.responesObject = userInfo;
        
        if (complete) {
            complete(nil, rxError);
        }
    }
}

/**
 * 获取初始化保存的计费点
 */
- (NSDictionary *)getProductInfo{
    return [[RXIAPManager sharedSDK] getProductInfo];
}

#pragma mark
- (void)productsRequest:(SKProductsRequest *)request didReceiveResponse:(SKProductsResponse *)response
{
    NSLog(@"接收商品信息");
    
    NSArray *products = response.products;
    if (products.count == 0) {
        if (self.isRefer) {
            if (self.productInfoBlock) {
                self.productInfoBlock([NSMutableArray arrayWithArray:products].copy);
            }
            return;
        }
        dispatch_async(dispatch_get_main_queue(),^{
            NSString *title = @"没有商品";
//            if ([RXConfig sharedManager].isOS) {
//                title = @"Not found product";
//            }

            NSDictionary *userInfo = @{@"code" : @(RXIAPError_noProducts),
                                       @"msg" : [RXErrorTool getRXErrorMsg:RXIAPError_noProducts]
            };
            RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
            rxError.responesObject = userInfo;
            
            if (rxError != nil) {
                rxError.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:rxError.responesObject];
            }
            
            if (self.iapBlock) {
                self.iapBlock(nil, rxError);
            }
            
            [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                           bodyDic:@{}
                                                            action:rxlog_error_iap
                                                               url:@""
                                                              code:rxError.responesObject[@"code"] == nil ? -123 : [rxError.responesObject[@"code"] integerValue]
                                                               msg:rxError.responesObject[@"msg"]
                                                         thirdType:@"iap"
                                                         thirdcode:-123
                                                          thirdmsg:@""
                                                           traceid:@""];
        });
        
        NSMutableDictionary *properties = [NSMutableDictionary dictionary];
//        [properties setValue:self.orderInfo forKey:@"order"];
        for (int i = 0; i < self.orderInfo.allKeys.count; i++) {
            if (self.orderInfo.allValues[i]) {
                [properties setValue:self.orderInfo.allValues[i] forKey:self.orderInfo.allKeys[i]];
            }
        }
        [properties setValue:@"" forKey:@"productid"];
        [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_getproduct distinctId:@"" properties:properties];
        
        NSLog(@"pro info");
        NSLog(@"SKProduct 描述信息：%@, \n", self.product.description);
        NSLog(@"localizedTitle 产品标题：%@", self.product.localizedTitle);
        NSLog(@"localizedDescription 产品描述信息：%@",self.product.localizedDescription);
        NSLog(@"p：%@",self.product.price);
        NSLog(@"productIdentifier Product id：%@",self.product.productIdentifier);
    } else {
        if (self.isRefer) {
            // 保存商品信息
            for (int i = 0; i < products.count; i++) {
                SKProduct *skP = products[i];
                // 获取商品币种
                NSLocale *locale = skP.priceLocale;
                NSString *currency = locale.localeIdentifier;
                NSArray *currencyArr = [currency componentsSeparatedByString:@"="];
                if (currencyArr.count > 1) {
                    currency = currencyArr[1];
                }
                // 获取商品金额
                NSString *price = [skP.price description];
                
                NSString *identifier = skP.productIdentifier;
                
                NSMutableDictionary *productDic = [NSMutableDictionary dictionary];
                [productDic setValue:price forKey:@"price"];
                [productDic setValue:currency forKey:@"currency"];
                
                [[RXUserUtility sharedManager].productInfoDic setValue:productDic forKey:identifier];
            }
            
            if (self.productInfoBlock) {
                self.productInfoBlock([NSMutableArray arrayWithArray:products].copy);
            }
            return;
        }
        self.product = products.firstObject;
        SKProduct *requestProduct = nil;
        for (SKProduct *pro in products) {

            NSLog(@"%@", [pro description]);
            NSLog(@"%@", [pro localizedTitle]);
            NSLog(@"%@", [pro localizedDescription]);
            NSLog(@"%@", [pro price]);
            NSLog(@"%@", [pro productIdentifier]);

            // 如果后台消费条目的ID与我这里需要请求的一样（用于确保订单的正确性）
            if([pro.productIdentifier isEqualToString:self.selectProductID]){
                requestProduct = pro;
            }
        }

        // SK1：从 SKProduct 获取价格和币种，用于验证订单接口
        // 订阅类型优先使用优惠价格（introductoryPrice），没有优惠则使用正常价格
        if (requestProduct) {
            NSString *productPrice = [requestProduct.price stringValue];
            NSString *productCurrency = @"";
            NSLocale *priceLocale = requestProduct.priceLocale;
            NSString *currencyCode = [priceLocale objectForKey:NSLocaleCurrencyCode];
            if ([NSString rx_isNullToString:currencyCode].length > 0) {
                productCurrency = currencyCode;
            }
            
            NSString *curOrderType = [NSString stringWithFormat:@"%@", self.orderInfo[@"ext"][@"order_type"]];
            if ([curOrderType isEqualToString:@"subscribe"]) {
                if (@available(iOS 11.2, *)) {
                    if (requestProduct.introductoryPrice && requestProduct.introductoryPrice.price) {
                        productPrice = [requestProduct.introductoryPrice.price stringValue];
                    }
                }
            }
            
            [self.orderInfo setValue:productPrice forKey:@"price"];
            [self.orderInfo setValue:productCurrency forKey:@"currency"];
            [RXUserUtility setValue:[NSMutableDictionary dictionaryWithDictionary:self.orderInfo] ForKey:keyUserData_orderInfo];
        }

        // 发送请求
        SKMutablePayment *payment = [SKMutablePayment paymentWithProduct:requestProduct];
        
        payment.applicationUsername = self.orderInfo[@"order_no"];
        [[SKPaymentQueue defaultQueue] addPayment:payment];
        
        NSMutableDictionary *properties = [NSMutableDictionary dictionary];
//        [properties setValue:self.orderInfo forKey:@"order"];
        for (int i = 0; i < self.orderInfo.allKeys.count; i++) {
            if (self.orderInfo.allValues[i]) {
                [properties setValue:self.orderInfo.allValues[i] forKey:self.orderInfo.allKeys[i]];
            }
        }
        [properties setValue:self.product.productIdentifier forKey:@"productid"];
        [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_getproduct distinctId:@"" properties:properties];
        
        NSLog(@"pro info");
        NSLog(@"SKProduct 描述信息：%@", self.product.description);
        NSLog(@"localizedTitle 产品标题：%@", self.product.localizedTitle);
        NSLog(@"localizedDescription 产品描述信息：%@",self.product.localizedDescription);
        NSLog(@"p：%@",self.product.price);
        NSLog(@"productIdentifier Product id：%@",self.product.productIdentifier);
    }
}

#pragma mark
- (void)paymentQueue:(nonnull SKPaymentQueue *)queue updatedTransactions:(NSArray *)transactions
{
    for (SKPaymentTransaction *transaction in transactions) {
        switch (transaction.transactionState) {
            case SKPaymentTransactionStatePurchasing:
            {
                NSMutableDictionary *properties = [NSMutableDictionary dictionary];
//                [properties setValue:self.orderInfo forKey:@"order"];
                for (int i = 0; i < self.orderInfo.allKeys.count; i++) {
                    if (self.orderInfo.allValues[i]) {
                        [properties setValue:self.orderInfo.allValues[i] forKey:self.orderInfo.allKeys[i]];
                    }
                }
                [properties setValue:@"正在交易中" forKey:@"state"];
                [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_transactions distinctId:@"" properties:properties];
                break;
            }
            case SKPaymentTransactionStatePurchased:
            {
                NSLog(@"dddd = %@", transaction.payment.applicationUsername);
                NSMutableDictionary *properties = [NSMutableDictionary dictionary];
//                [properties setValue:self.orderInfo forKey:@"order"];
                for (int i = 0; i < self.orderInfo.allKeys.count; i++) {
                    if (self.orderInfo.allValues[i]) {
                        [properties setValue:self.orderInfo.allValues[i] forKey:self.orderInfo.allKeys[i]];
                    }
                }
                [properties setValue:@"交易完成" forKey:@"state"];
                
                NSString *curReceipt =  [transaction.transactionReceipt base64EncodedStringWithOptions:NSDataBase64EncodingEndLineWithLineFeed];
                NSURL *receiptURL = [[NSBundle mainBundle] appStoreReceiptURL];
                NSData *receiptData = [NSData dataWithContentsOfURL:receiptURL];
                NSString *receipt = [receiptData base64EncodedStringWithOptions:0];
                
                if ([NSString rx_isNullToString:curReceipt].length > 0) {
                    [properties setValue:curReceipt forKey:@"curReceipt"];
                }
                if ([NSString rx_isNullToString:receipt].length > 0) {
                    [properties setValue:receipt forKey:@"receipt"];
                }
                
                [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_transactions distinctId:@"" properties:properties];
                [self buyAppleStoreProductSucceedWithZhifumentTransaction:transaction eReceipt:@"" eCurReceipt:@""];
                break;
            }
            case SKPaymentTransactionStateFailed:
            {
                NSLog(@"iap失败 : %@", transaction.error);
                NSString *title = @"失败";
                
                NSString *errorMsg = @"";
                if (transaction.error.code == SKErrorUnknown) {
                    errorMsg = transaction.error.localizedDescription;
                } else if (transaction.error.code == SKErrorClientInvalid) {
                    errorMsg = @"client is not allowed to issue the request, etc";
                } else if (transaction.error.code == SKErrorPaymentCancelled) {
                    errorMsg = @"user cancelled the request, etc";
                } else if (transaction.error.code == SKErrorPaymentInvalid) {
                    errorMsg = @"purchase identifier was invalid, etc";
                } else if (transaction.error.code == SKErrorPaymentNotAllowed) {
                    errorMsg = @"this device is not allowed to make the payment";
                } else if (transaction.error.code == SKErrorStoreProductNotAvailable) {
                    errorMsg = @"Product is not available in the current storefront";
                } else if (transaction.error.code == SKErrorCloudServicePermissionDenied) {
                    errorMsg = @"user has not allowed access to cloud service information";
                } else if (transaction.error.code == SKErrorCloudServiceNetworkConnectionFailed) {
                    errorMsg = @"the device could not connect to the nework";
                } else if (transaction.error.code == SKErrorCloudServiceRevoked) {
                    errorMsg = @"user has revoked permission to use this cloud service";
                } else if (transaction.error.code == SKErrorPrivacyAcknowledgementRequired) {
                    errorMsg = @"The user needs to acknowledge Apple's privacy policy";
                } else if (transaction.error.code == SKErrorUnauthorizedRequestData) {
                    errorMsg = @"The app is attempting to use SKPayment's requestData property, but does not have the appropriate entitlement";
                } else if (transaction.error.code == SKErrorInvalidOfferIdentifier) {
                    errorMsg = @"The specified subscription offer identifier is not valid";
                } else if (transaction.error.code == SKErrorInvalidSignature) {
                    errorMsg = @"The cryptographic signature provided is not valid";
                } else if (transaction.error.code == SKErrorMissingOfferParams) {
                    errorMsg = @"One or more parameters from SKPaymentDiscount is missing";
                } else if (transaction.error.code == SKErrorInvalidOfferPrice) {
                    errorMsg = @"The price of the selected offer is not valid (e.g. lower than the current base subscription price)";
                } else if (transaction.error.code == SKErrorOverlayCancelled) {
                    errorMsg = @"An error code that indicates the cancellation of an overlay";
                } else if (transaction.error.code == SKErrorOverlayInvalidConfiguration) {
                    errorMsg = @"An error code that indicates the overlay’s configuration is invalid";
                } else if (transaction.error.code == SKErrorOverlayTimeout) {
                    errorMsg = @"timeout";
                } else if (transaction.error.code == SKErrorIneligibleForOffer) {
                    errorMsg = @"User is not eligible for the subscription offer";
                } else if (transaction.error.code == SKErrorUnsupportedPlatform) {
                    errorMsg = @"An error code that indicates the current platform doesn’t support overlays";
                } else if (transaction.error.code == SKErrorOverlayPresentedInBackgroundScene) {
                    errorMsg = @"Client tried to present an SKOverlay in UIWindowScene not in the foreground";
                } else {
                    errorMsg = transaction.error.localizedDescription;
                }
                
                NSMutableDictionary *properties = [NSMutableDictionary dictionary];
//                [properties setValue:self.orderInfo forKey:@"order"];
                for (int i = 0; i < self.orderInfo.allKeys.count; i++) {
                    if (self.orderInfo.allValues[i]) {
                        [properties setValue:self.orderInfo.allValues[i] forKey:self.orderInfo.allKeys[i]];
                    }
                }
                [properties setValue:[NSString stringWithFormat:@"交易失败--%@", errorMsg] forKey:@"state"];
                [properties setValue:@(transaction.error.code) forKey:@"code"];
                
                BOOL needFinish = YES;
                
                if (transaction.error.code == SKErrorPaymentCancelled) {
                    NSString *curReceipt =  [transaction.transactionReceipt base64EncodedStringWithOptions:NSDataBase64EncodingEndLineWithLineFeed];
                    NSURL *receiptURL = [[NSBundle mainBundle] appStoreReceiptURL];
                    NSData *receiptData = [NSData dataWithContentsOfURL:receiptURL];
                    NSString *receipt = [receiptData base64EncodedStringWithOptions:0];
                    NSDictionary *userInfo = @{@"code" : @(RXIAPError_cancel),
                                               @"msg" : [RXErrorTool getRXErrorMsg:RXIAPError_cancel],
                                               @"thirdmsg" : errorMsg,
                                               @"thirdcode" : @(transaction.error.code)
                    };
                    RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
                    rxError.responesObject = userInfo;
                    
                    if (rxError != nil) {
                        rxError.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:rxError.responesObject];
                    }
                    
                    if (self.iapBlock) {
                        self.iapBlock(nil, rxError);
                    }
                    
                    [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                                   bodyDic:@{}
                                                                    action:rxlog_error_iap
                                                                       url:@""
                                                                      code:rxError.responesObject[@"code"] == nil ? -123 : [rxError.responesObject[@"code"] integerValue]
                                                                       msg:rxError.responesObject[@"msg"]
                                                                 thirdType:@"iap"
                                                                 thirdcode:rxError.responesObject[@"thirdcode"] == nil ? -123 : [rxError.responesObject[@"thirdcode"] integerValue]
                                                                  thirdmsg:rxError.responesObject[@"thirdmsg"]
                                                                   traceid:@""];
                } else if (transaction.error.code == 0) {
                    needFinish = NO;
                    
                    NSString *curReceipt =  [transaction.transactionReceipt base64EncodedStringWithOptions:NSDataBase64EncodingEndLineWithLineFeed];
                    NSURL *receiptURL = [[NSBundle mainBundle] appStoreReceiptURL];
                    NSData *receiptData = [NSData dataWithContentsOfURL:receiptURL];
                    NSString *receipt = [receiptData base64EncodedStringWithOptions:0];
                    
                    if ([NSString rx_isNullToString:curReceipt].length > 0) {
                        [properties setValue:curReceipt forKey:@"curReceipt"];
                    }
                    if ([NSString rx_isNullToString:receipt].length > 0) {
                        [properties setValue:receipt forKey:@"receipt"];
                    }
                    
                    [self buyAppleStoreProductSucceedWithZhifumentTransaction:transaction eReceipt:receipt eCurReceipt:curReceipt];
                    
//                    NSDictionary *userInfo = @{@"code" : @(RXIAPError_iapFail),
//                                               @"msg" : [RXErrorTool getRXErrorMsg:RXIAPError_iapFail],
//                                               @"thirdmsg" : errorMsg,
//                                               @"thirdcode" : @(transaction.error.code)
//                    };
//                    RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
//                    rxError.responesObject = userInfo;
//                    
//                    if (self.iapBlock) {
//                        self.iapBlock(nil, rxError);
//                    }
                } else {
                    NSDictionary *userInfo = @{@"code" : @(RXIAPError_iapFail),
                                               @"msg" : [RXErrorTool getRXErrorMsg:RXIAPError_iapFail],
                                               @"thirdmsg" : errorMsg,
                                               @"thirdcode" : @(transaction.error.code)
                    };
                    RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
                    rxError.responesObject = userInfo;
                    
                    if (rxError != nil) {
                        rxError.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:rxError.responesObject];
                    }
                    
                    if (self.iapBlock) {
                        self.iapBlock(nil, rxError);
                    }
                    
                    [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                                   bodyDic:@{}
                                                                    action:rxlog_error_iap
                                                                       url:@""
                                                                      code:rxError.responesObject[@"code"] == nil ? -123 : [rxError.responesObject[@"code"] integerValue]
                                                                       msg:rxError.responesObject[@"msg"]
                                                                 thirdType:@"iap"
                                                                 thirdcode:rxError.responesObject[@"thirdcode"] == nil ? -123 : [rxError.responesObject[@"thirdcode"] integerValue]
                                                                  thirdmsg:rxError.responesObject[@"thirdmsg"]
                                                                   traceid:@""];
                }
                
                [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_transactions distinctId:@"" properties:properties];
                
                if (needFinish) {
                    [[SKPaymentQueue defaultQueue] finishTransaction:transaction];
                }
                break;
            }
            case SKPaymentTransactionStateRestored:
            {
                NSMutableDictionary *properties = [NSMutableDictionary dictionary];
//                [properties setValue:self.orderInfo forKey:@"order"];
                for (int i = 0; i < self.orderInfo.allKeys.count; i++) {
                    if (self.orderInfo.allValues[i]) {
                        [properties setValue:self.orderInfo.allValues[i] forKey:self.orderInfo.allKeys[i]];
                    }
                }
                [properties setValue:@"恢复" forKey:@"state"];
                [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_transactions distinctId:@"" properties:properties];
                
                // 订阅补单场景二：付款成功但苹果回调失败，通过 restoreCompletedTransactions 恢复购买
                // 从订阅独立存储中读取订单信息，匹配订单号后走验证流程
                NSDictionary *subscribeReceipt = [RXIAPService getSubscribeReceiptData];
                if (self.isSubscribeRestore && subscribeReceipt != nil) {
                    NSString *savedOrderNo = [NSString stringWithFormat:@"%@", subscribeReceipt[@"order_no"]];
                    NSString *restoreOrderType = [NSString stringWithFormat:@"%@", subscribeReceipt[@"ext"][@"order_type"]];
                    
                    if ([restoreOrderType isEqualToString:@"subscribe"] && [NSString rx_isNullToString:savedOrderNo].length > 0) {
                        [properties setValue:@"订阅恢复补单" forKey:@"state"];
                        [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_transactions distinctId:@"" properties:properties];
                        
                        // 恢复订阅订单信息到 orderInfo，确保后续验证使用正确的订单号
                        self.orderInfo = [NSMutableDictionary dictionaryWithDictionary:subscribeReceipt];
                        [RXUserUtility setValue:self.orderInfo ForKey:keyUserData_orderInfo];
                        
                        [self buyAppleStoreProductSucceedWithZhifumentTransaction:transaction eReceipt:@"" eCurReceipt:@""];
                        self.isSubscribeRestore = NO;
                        break;
                    }
                }
                
                NSDictionary *userInfo = @{@"code" : @(RXIAPError_repeat),
                                           @"msg" : [RXErrorTool getRXErrorMsg:RXIAPError_repeat],
                                           @"thirdmsg" : transaction.error.localizedDescription ?: @"未知错误",
                                           @"thirdcode" : @(transaction.error.code)
                };
                RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
                rxError.responesObject = userInfo;
                
                if (rxError != nil) {
                    rxError.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:rxError.responesObject];
                }
                
                if (self.iapBlock) {
                    self.iapBlock(nil, rxError);
                }
                
                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                               bodyDic:@{}
                                                                action:rxlog_error_iap
                                                                   url:@""
                                                                  code:rxError.responesObject[@"code"] == nil ? -123 : [rxError.responesObject[@"code"] integerValue]
                                                                   msg:rxError.responesObject[@"msg"]
                                                             thirdType:@"iap"
                                                             thirdcode:rxError.responesObject[@"thirdcode"] == nil ? -123 : [rxError.responesObject[@"thirdcode"] integerValue]
                                                              thirdmsg:rxError.responesObject[@"thirdmsg"]
                                                               traceid:@""];
                
                [[SKPaymentQueue defaultQueue] finishTransaction:transaction];
                break;
            }
            case SKPaymentTransactionStateDeferred:
            {
                NSMutableDictionary *properties = [NSMutableDictionary dictionary];
//                [properties setValue:self.orderInfo forKey:@"order"];
                for (int i = 0; i < self.orderInfo.allKeys.count; i++) {
                    if (self.orderInfo.allValues[i]) {
                        [properties setValue:self.orderInfo.allValues[i] forKey:self.orderInfo.allKeys[i]];
                    }
                }
                [properties setValue:@"交易延迟" forKey:@"state"];
                [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_transactions distinctId:@"" properties:properties];
                
                break;
            }
            default:
            {
//                NSMutableDictionary *properties = [NSMutableDictionary dictionary];
//                [properties setValue:self.orderInfo forKey:@"order"];
//                for (int i = 0; i < self.orderInfo.allKeys.count; i++) {
//                    if (self.orderInfo.allValues[i]) {
//                        [properties setValue:self.orderInfo.allValues[i] forKey:self.orderInfo.allKeys[i]];
//                    }
//                }
//                [properties setValue:@"交易失败" forKey:@"state"];
//                [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_transactions distinctId:@"" properties:properties];
//                
//                NSDictionary *userInfo = @{@"code" : @(RXIAPError_iapFail),
//                                           @"msg" : [RXErrorTool getRXErrorMsg:RXIAPError_iapFail],
//                                           @"thirdmsg" : transaction.error.localizedDescription,
//                                           @"thirdcode" : @(transaction.error.code)
//                };
//                RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
//                rxError.responesObject = userInfo;
//                
//                if (self.iapBlock) {
//                    self.iapBlock(nil, rxError);
//                }
                
                NSMutableDictionary *properties = [NSMutableDictionary dictionary];
//                [properties setValue:self.orderInfo forKey:@"order"];
                for (int i = 0; i < self.orderInfo.allKeys.count; i++) {
                    if (self.orderInfo.allValues[i]) {
                        [properties setValue:self.orderInfo.allValues[i] forKey:self.orderInfo.allKeys[i]];
                    }
                }
                
                NSString *curReceipt =  [transaction.transactionReceipt base64EncodedStringWithOptions:NSDataBase64EncodingEndLineWithLineFeed];
                NSURL *receiptURL = [[NSBundle mainBundle] appStoreReceiptURL];
                NSData *receiptData = [NSData dataWithContentsOfURL:receiptURL];
                NSString *receipt = [receiptData base64EncodedStringWithOptions:0];
                
                if ([NSString rx_isNullToString:curReceipt].length > 0) {
                    [properties setValue:curReceipt forKey:@"curReceipt"];
                }
                if ([NSString rx_isNullToString:receipt].length > 0) {
                    [properties setValue:receipt forKey:@"receipt"];
                }

                [properties setValue:[NSString stringWithFormat:@"交易失败--default--%@", transaction.error.localizedDescription] forKey:@"state"];
                [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_transactions distinctId:@"" properties:properties];
                
                [self buyAppleStoreProductSucceedWithZhifumentTransaction:transaction eReceipt:receipt eCurReceipt:curReceipt];
                
                break;
            }
        }
    }
}

- (void)buyAppleStoreProductSucceedWithZhifumentTransaction:(SKPaymentTransaction *)transaction eReceipt:(NSString *)eReceipt eCurReceipt:(NSString *)eCurReceipt
{
    NSString *curReceipt =  [transaction.transactionReceipt base64EncodedStringWithOptions:NSDataBase64EncodingEndLineWithLineFeed];
    NSURL *receiptURL = [[NSBundle mainBundle] appStoreReceiptURL];
    NSData *receiptData = [NSData dataWithContentsOfURL:receiptURL];
    NSString *receipt = [receiptData base64EncodedStringWithOptions:0];
    NSString *order_no = self.orderInfo[@"order_no"];
    if ([NSString rx_isNullToString:transaction.payment.applicationUsername].length > 0) {
        order_no = transaction.payment.applicationUsername;
    }
    
    if ([NSString rx_isNullToString:eReceipt].length > 0) {
        receipt = eReceipt;
    }
    if ([NSString rx_isNullToString:eCurReceipt].length > 0) {
        curReceipt = curReceipt;
    }
    
    [self checkAppStoreResultWithBase64String:curReceipt andReceipt:receipt order_no:order_no transaction:transaction];
}

- (void)checkAppStoreResultWithBase64String:(NSString *)curReceipt andReceipt:(NSString *)receipt order_no:(NSString *)order_no transaction:(SKPaymentTransaction *)transaction
{
    NSMutableDictionary *order = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_orderInfo]];
    self.orderInfo = order;
    if (order_no.length > 0) {
        [self.orderInfo setValue:order_no forKey:@"order_no"];
    }
    self.sandboxNum = [RXUserUtility valueForKey:keyUserData_sanboxNum];
    self.selectProductID = [RXUserUtility valueForKey:keyUserData_selectProductID];
    
    NSMutableDictionary *dictInfo = [NSMutableDictionary dictionaryWithDictionary:self.orderInfo];
    [dictInfo setValue:curReceipt forKey:@"curReceipt"];
    [dictInfo setValue:receipt forKey:@"receipt"];
    [dictInfo setValue:self.selectProductID forKey:@"selectProductID"];
    [dictInfo setValue:@([[RXUserUtility valueForKey:keyUserData_isDebug] integerValue]) forKey:@"is_debug"];
    [dictInfo setValue:@([self.sandboxNum integerValue]) forKey:@"env"];
    
    if (transaction) {
        if ([transaction.transactionIdentifier isKindOfClass:[NSString class]] && [NSString rx_isNullToString:transaction.transactionIdentifier].length > 0) {
            [dictInfo setValue:transaction.transactionIdentifier forKey:@"transactionid"];
        }
    }
    
    //1.保存订单号和凭证到本地.
    
    if ([NSString rx_isNullToString:receipt].length > 0) {
        [RXUserUtility setValue:dictInfo ForKey:keyUserData_orderInfo];
        [self saveReceiptData:dictInfo];

        [self verifyTransactionResult:dictInfo transaction:transaction];
    } else {
        // 凭证为空，根据订单类型清除对应的本地凭证
        NSString *emptyOrderType = [NSString stringWithFormat:@"%@", self.orderInfo[@"ext"][@"order_type"]];
        if ([emptyOrderType isEqualToString:@"subscribe"]) {
            [self removeSubscribeReceiptData];
        } else {
            [self removeLocReceiptData];
        }
        
        NSDictionary *userInfo = @{@"code" : @(RXIAPError_iapFail),
                                   @"msg" : [RXErrorTool getRXErrorMsg:RXIAPError_iapFail],
                                   @"thirdmsg" : transaction.error.localizedDescription,
                                   @"thirdcode" : @(transaction.error.code)
        };
        RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
        rxError.responesObject = userInfo;
            
        if (rxError != nil) {
            rxError.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:rxError.responesObject];
        }
        
        if (self.iapBlock) {
            self.iapBlock(nil, rxError);
        }
        
        [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                       bodyDic:@{}
                                                        action:rxlog_error_iap
                                                           url:@""
                                                          code:rxError.responesObject[@"code"] == nil ? -123 : [rxError.responesObject[@"code"] integerValue]
                                                           msg:rxError.responesObject[@"msg"]
                                                     thirdType:@"appstore"
                                                     thirdcode:rxError.responesObject[@"thirdcode"] == nil ? -123 : [rxError.responesObject[@"thirdcode"] integerValue]
                                                      thirdmsg:rxError.responesObject[@"thirdmsg"]
                                                       traceid:@""];
        
        [[SKPaymentQueue defaultQueue] finishTransaction:transaction];
    }
}

#pragma mark
- (void)verifyTransactionResult:(NSDictionary *)dictInfo transaction:(SKPaymentTransaction *)transaction
{
    NSMutableDictionary *properties = [NSMutableDictionary dictionary];
//    [properties setValue:self.orderInfo forKey:@"order"];
    for (int i = 0; i < self.orderInfo.allKeys.count; i++) {
        if (self.orderInfo.allValues[i]) {
            [properties setValue:self.orderInfo.allValues[i] forKey:self.orderInfo.allKeys[i]];
        }
    }
    [properties setValue:@"开始验证" forKey:@"state"];
    [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_notify distinctId:@"" properties:properties];
    
//    return;
    if([dictInfo objectForKey:@"ext"]){
        
        NSString *notifyUrl = dictInfo[@"notify_url"];
//
        NSMutableDictionary *dict = [NSMutableDictionary dictionary];
        [dict setValue:dictInfo[@"order_no"] forKey:@"order_no"];
//        [dict setValue:dictInfo[@"receipt"] forKey:@"receipt"];
//        [dict setValue:dictInfo[@"curReceipt"] forKey:@"curReceipt"];
        [dict setValue:dictInfo[@"curReceipt"] forKey:@"receipt"];
        [dict setValue:dictInfo[@"receipt"] forKey:@"curReceipt"];
        [dict setValue:dictInfo[@"sandBox"] forKey:@"sandBox"];
        
        if ([NSString rx_isNullToString:[NSString stringWithFormat:@"%@", dictInfo[@"transactionid"]]].length > 0) {
            [dict setValue:dictInfo[@"transactionid"] forKey:@"transactionid"];
        }
        
        [dict setValue:@([dictInfo[@"env"] integerValue]) forKey:@"env"];
        [dict setValue:@([dictInfo[@"is_debug"] integerValue]) forKey:@"is_debug"];
        [dict setValue:dictInfo[@"store_kit_2_jws"] forKey:@"store_kit_2_jws"];
        
        if (dictInfo[@"jws_list"]) {
            [dict setValue:dictInfo[@"jws_list"] forKey:@"jws_list"];
        }
        
        // 订阅类型支付新增 original 参数
        NSString *verifyOrderType = [NSString stringWithFormat:@"%@", dictInfo[@"ext"][@"order_type"]];
        if ([verifyOrderType isEqualToString:@"subscribe"]) {
            [dict setValue:@"1" forKey:@"original"];
        }
        
        // 验证订单接口新增价格和币种参数
        NSString *verifyPrice = [NSString stringWithFormat:@"%@", dictInfo[@"price"]];
        NSString *verifyCurrency = [NSString stringWithFormat:@"%@", dictInfo[@"currency"]];
        if ([NSString rx_isNullToString:verifyPrice].length > 0) {
            [dict setValue:@([verifyPrice integerValue]) forKey:@"price"];
        }
        if ([NSString rx_isNullToString:verifyCurrency].length > 0) {
            [dict setValue:verifyCurrency forKey:@"currency"];
        }
        
//        notifyUrl = [notifyUrl stringByReplacingOccurrencesOfString:@"https" withString:@"http"];
        
        RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:notifyUrl andParams:dict requsetMethod:RequestMethod_Post];
        request.baseUrl = [RXConfig sharedManager].apiDomain;
        request.headParams = [RX_CommonNetworkExcuteManager headParams];
        
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dict options:NSJSONWritingPrettyPrinted error:nil];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        
        NSLog(@"iap请求参数 %@", jsonString);
        
        [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
            // 验证成功，根据订单类型清除对应的本地凭证
            NSString *successOrderType = [NSString stringWithFormat:@"%@", dictInfo[@"ext"][@"order_type"]];
            if ([successOrderType isEqualToString:@"subscribe"]) {
                [self removeSubscribeReceiptData];
            } else {
                [self removeLocReceiptData];
            }
            self.duration = 0;
            self.reCount = 0;
            self.isRe = NO;
            [self closeHudTime];
            NSString *title = @"成功";
            
            if (self.iapBlock) {
                self.iapBlock(responseObject, nil);
            }
            if (self.reBlock) {
                self.reBlock(responseObject, nil);
            }
            NSLog(@"验证成功:\n %@", responseObject);
            
            if (transaction) {
                [[SKPaymentQueue defaultQueue] finishTransaction:transaction];
            }
            
            NSMutableDictionary *properties = [NSMutableDictionary dictionary];
//            [properties setValue:self.orderInfo forKey:@"order"];
            for (int i = 0; i < self.orderInfo.allKeys.count; i++) {
                if (self.orderInfo.allValues[i]) {
                    [properties setValue:self.orderInfo.allValues[i] forKey:self.orderInfo.allKeys[i]];
                }
            }
            [properties setValue:@"成功" forKey:@"state"];
            [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_iapresult distinctId:@"" properties:properties];
            
            // 上报支付事件
            NSInteger amount = [self.orderInfo[@"price"] integerValue];
            [[RXBDAManager sharedSDK] trackEssentialEventWithNameWithEvent:@"purchase" params:@{@"amount" : @(amount)}];
            
        } failure:^(RX_CommonRequestError * _Nullable error) {
            
            NSMutableDictionary *properties = [NSMutableDictionary dictionary];
//            [properties setValue:self.orderInfo forKey:@"order"];
            for (int i = 0; i < self.orderInfo.allKeys.count; i++) {
                if (self.orderInfo.allValues[i]) {
                    [properties setValue:self.orderInfo.allValues[i] forKey:self.orderInfo.allKeys[i]];
                }
            }
            [properties setValue:@"失败" forKey:@"state"];
            if ([error.responesObject isKindOfClass:[NSDictionary class]]) {
                [properties setValue:error.responesObject forKey:@"error"];
            }
            [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_iapresult distinctId:@"" properties:properties];
            
            NSInteger errorCode = [error.responesObject[@"code"] integerValue];
            // 重试
            if (errorCode == 152407 || errorCode == 152401 || errorCode == 182001 || errorCode == 142601 || errorCode == 142602 || errorCode == 152403 || errorCode == 152404 || (errorCode >= 1000 && errorCode <= 2000)) {
                NSLog(@"");
            } else {
                if (self.isRe && self.isOrder) {
                    [self iap:self.orderDic complete:self.complete];
                }
                
                // 验证失败（不可重试的错误码），根据订单类型清除对应的本地凭证
                NSString *failOrderType = [NSString stringWithFormat:@"%@", dictInfo[@"ext"][@"order_type"]];
                if ([failOrderType isEqualToString:@"subscribe"]) {
                    [self removeSubscribeReceiptData];
                } else {
                    [self removeLocReceiptData];
                }
                self.duration = 0;
                self.reCount = 0;
                self.isRe = NO;
                self.isOrder = NO;
                [self closeHudTime];
            }
            
            if (!self.isCloseTimer) {
                self.timer = [NSTimer timerWithTimeInterval:self.duration target:self selector:@selector(timerAction) userInfo:nil repeats:YES];
                [[NSRunLoop mainRunLoop] addTimer:self.timer forMode:NSRunLoopCommonModes];
                [self.timer fire];
            } else {
                [self closeTime];
            }
            
            NSLog(@"验证失败:\n %@",error.error);
            
            if (transaction) {
                [[SKPaymentQueue defaultQueue] finishTransaction:transaction];
            }
            
//            [self addMTimer];
            
//            if (!_timer) {
                
//            }
            
            NSDictionary *orderInfo = [RXIAPService getReceiptData];
            if (orderInfo == nil) {
                orderInfo = [RXIAPService getSubscribeReceiptData];
            }
            if ([error.responesObject isKindOfClass:[NSDictionary class]]) {
                NSMutableDictionary *resultMutableDic = [NSMutableDictionary dictionaryWithDictionary:error.responesObject];
                [resultMutableDic setValue:orderInfo forKey:@"orderInfo"];
                error.responesObject = resultMutableDic;
            }
            
            if (!self.isRe) {
//                if (errorCode != 152407 || errorCode != 152401) {
//                } else {
//
//                }
//                if (errorCode == 152407 || errorCode == 152401 || errorCode == 182001 || errorCode == 142601 || errorCode == 142602 || errorCode == 152403 || errorCode == 152404) {
//                    
//                } else {
//                    
//                }
                
                RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
                NSMutableDictionary *errorRes = [NSMutableDictionary dictionaryWithDictionary:error.responesObject];
                [errorRes setValue:dict forKey:@"orderInfo"];
                rxError.responesObject = errorRes;
                
                if (self.iapBlock) {
                    self.iapBlock(nil, rxError);
                }
            }
            
            if (self.isRe && self.reBlock) {
                self.reBlock(nil, error);
            }
        }];
    } else {
        // 数据格式错误（不含ext），根据订单类型清除对应的本地凭证
        NSString *noExtOrderType = [NSString stringWithFormat:@"%@", dictInfo[@"ext"][@"order_type"]];
        if ([noExtOrderType isEqualToString:@"subscribe"]) {
            [self removeSubscribeReceiptData];
        } else {
            [self removeLocReceiptData];
        }
        NSLog(@"数据格式错误不含ext");
    }
}

#pragma mark
static NSString *const kSaveReceiptData = @"kSaveReceiptData";
static NSString *const kSaveSubscribeReceiptData = @"kSaveSubscribeReceiptData"; // 订阅订单独立存储 key，与普通订单互不干扰

// 根据 order_type 将凭证保存到不同的存储 key，订阅订单使用独立存储避免与普通订单冲突
- (void)saveReceiptData:(NSDictionary *)receiptData {
    NSString *orderType = [NSString stringWithFormat:@"%@", receiptData[@"ext"][@"order_type"]];
    if ([orderType isEqualToString:@"subscribe"]) {
        NSString *key = [NSString stringWithFormat:@"%@%@", [RXUserUtility valueForKey:keyUserData_productId], kSaveSubscribeReceiptData];
        [[NSUserDefaults standardUserDefaults] setValue:receiptData forKey:key];
        [[NSUserDefaults standardUserDefaults] synchronize];
    } else {
        NSString *string_3 = [NSString stringWithFormat:@"%@%@", [RXUserUtility valueForKey:keyUserData_productId], kSaveReceiptData];
        [[NSUserDefaults standardUserDefaults] setValue:receiptData forKey:string_3];
        [[NSUserDefaults standardUserDefaults] synchronize];
    }
}

+ (NSDictionary *)getReceiptData {
    NSString * string_3 = [NSString stringWithFormat:@"%@%@", [RXUserUtility valueForKey:keyUserData_productId], kSaveReceiptData];
    return [[NSUserDefaults standardUserDefaults] valueForKey:string_3];
}

- (void)removeLocReceiptData {
    NSString * string_3 = [NSString stringWithFormat:@"%@%@", [RXUserUtility valueForKey:keyUserData_productId], kSaveReceiptData];
    [[NSUserDefaults standardUserDefaults] removeObjectForKey:string_3];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

// 获取订阅订单本地凭证
+ (NSDictionary *)getSubscribeReceiptData {
    NSString *key = [NSString stringWithFormat:@"%@%@", [RXUserUtility valueForKey:keyUserData_productId], kSaveSubscribeReceiptData];
    return [[NSUserDefaults standardUserDefaults] valueForKey:key];
}

// 清除订阅订单本地凭证
- (void)removeSubscribeReceiptData {
    NSString *key = [NSString stringWithFormat:@"%@%@", [RXUserUtility valueForKey:keyUserData_productId], kSaveSubscribeReceiptData];
    [[NSUserDefaults standardUserDefaults] removeObjectForKey:key];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

// 递归解析错误
- (void)fetchError:(NSDictionary *)userInfo
{
    if (userInfo[@"NSUnderlyingError"]) {
        NSError *error = userInfo[@"NSUnderlyingError"];
        if (error.userInfo) {
            [self fetchError:error.userInfo];
        }
    } else {
        NSLog(@"iap error userInfo = %@", userInfo);
        if (userInfo) {
            NSData *data = [NSJSONSerialization dataWithJSONObject:userInfo options:NSJSONWritingPrettyPrinted error:nil];
            self.errorJsonStr = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        }
    }
}

- (void)dealloc
{
    [[RXLogService sharedSDK] addLogSingleWithEvent:rxlog_removeTransactionObserver distinctId:@"" properties:nil];
    [[SKPaymentQueue defaultQueue] removeTransactionObserver:self];
}

@end

