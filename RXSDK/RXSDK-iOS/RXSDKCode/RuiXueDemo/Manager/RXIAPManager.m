//
//  RXIAPManager.m
//  RXSDK
//
//  Created by 陈汉 on 2024/5/7.
//

#import "RXIAPManager.h"
#import <objc/message.h>
#import "NSString+RXAddition.h"
#import <RXPublicToolKit/RXPublicWebView.h>
#import <RXPublicToolKit/RXPublicToolKit.h>
#import "RXCommonHeader.h"
#import "RXApiService.h"
#import "RXExtension.h"
#import "RXIAPService.h"
#import "CHCid.h"
#import "RXLogManager.h"

typedef void(^HqBlock)(NSString *result);

@interface RXIAPManager ()

@property (nonatomic, copy) HqBlock hqBlock;

@end

@implementation RXIAPManager

static RXIAPManager *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXIAPManager alloc] init];
    });
    return sharedSDK;
}

+ (NSString *)fetchType:(NSString *)type
{
    NSString *pType = @"iap";
    
    return pType;
}

/**
 * 保存商品信息
 */
- (void)saveProductInfo
{
    NSMutableArray *products = [NSMutableArray array];
    NSMutableDictionary *allProductInfo = [RXUserUtility sharedManager].allProductInfo;
    for (int i = 0; i < allProductInfo.count; i++) {
        if (i == 10) {
            break;
        }
        NSString *value = allProductInfo.allValues[i];
        if ([NSString rx_isNullToString:value].length > 0) {
            [products addObject:value];
        }
    }
    
    [[RXIAPService sharedSDK] getProductInfoWithProductIdArr:products complete:^(NSArray<SKProduct *> *productInfoList) {
        if (productInfoList.count > 0) {
            SKProduct *skP = productInfoList[0];
            
            // 获取商品币种
            NSLocale *locale = skP.priceLocale;
            NSString *currency = locale.localeIdentifier;
            NSArray *currencyArr = [currency componentsSeparatedByString:@"="];
            if (currencyArr.count > 1) {
                currency = currencyArr[1];
            }

            [RXUserUtility sharedManager].currencySymbol = [locale displayNameForKey:NSLocaleCurrencySymbol value:currency];
        }
    }];
}

/**
 * 获取初始化保存的计费点
 */
- (NSDictionary *)getProductInfo{
    
    return [RXUserUtility sharedManager].allProductInfo;
}

/**
 * 兑换
 */
- (void)exchangeWithDic:(NSDictionary *)dic
               complete:(RequestComplete)complete
{
    @try {
        NSMutableDictionary *dic1 = [NSMutableDictionary dictionary];
        if ([dic isKindOfClass:[NSDictionary class]] && dic.allKeys.count > 0) {
            dic1 = [NSMutableDictionary dictionaryWithDictionary:dic];
        }
        [dic1 setValue:[RXUserUtility valueForKey:keyUserData_openId] forKey:@"openid"];
        
        RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"/v1/operationtoolsapi/user_data_operation_platform/item_redemption" andParams:dic1 requsetMethod:RequestMethod_Post];
        request.baseUrl = [[RXService sharedSDK] getFirstBaseUrl];
        request.headParams = [RX_CommonNetworkExcuteManager headParams];
        
        [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
            NSLog(@"兑换成功:\n %@", responseObject);
            if (complete) {
                complete(responseObject, nil);
            }
        } failure:^(RX_CommonRequestError * _Nullable error) {
            NSLog(@"兑换失败:\n %@", error.error);
            if (complete) {
                complete(nil, error);
            }
        }];
    } @catch (NSException *exception) {
        NSLog(@"兑换失败:\n %@", exception);
        NSDictionary *errorInfo = @{@"code" : @(RXIAPError_default),
                                   @"msg" : [RXErrorTool getRXErrorMsg:RXIAPError_default],
        };
        RX_CommonRequestError *error = [[RX_CommonRequestError alloc] init];
        error.responesObject = errorInfo;
        if (complete) {
            complete(nil, error);
        }
    } @finally {
        
    }
    
}

@end
