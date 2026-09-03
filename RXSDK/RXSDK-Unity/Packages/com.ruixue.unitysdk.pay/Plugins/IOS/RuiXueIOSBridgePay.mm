
#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#include "RuiXueIOSBridgeBase.h"
#include "RuiXueIOSBridgePay.h"
#include "RuiXueIOSBridgeUtils.h"

void ios_iap_requestWithDict(const char* dictJson,
                       RequestResponseCallBack onSuccess,
                       RequestErrorCallBack onError)
{
    NSLog(@"===%@",[RuiXueIOSBridgeUtils toNSDic:dictJson]);
    [[RXIAPService sharedSDK] requestWithDict:[RuiXueIOSBridgeUtils toNSDic:dictJson] completeHandle:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if(!error){
            NSLog(@"下单成功");
            onSuccess("ios_pay_requestWithDict", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }else{
            NSLog(@"下单失败");
            onError("ios_pay_requestWithDict", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 获取商品信息
void ios_getProductInfoWithProductIdArr(const char* productIdArrJson, 
                       RequestResponseCallBack onSuccess, 
                       RequestErrorCallBack onError)
{
    NSArray* products = [RuiXueIOSBridgeUtils toNSArray:productIdArrJson];
    
    [[RXIAPService sharedSDK] getProductInfoWithProductIdArr:products complete:^(NSArray<SKProduct *> * _Nonnull productInfoList) {
        
        if(productInfoList == nil || [productInfoList count] == 0)
        {
            const char* rsp = [RuiXueIOSBridgeUtils createJsonOutWithCode:-1 Msg:@"查询返回商品信息为空"];
            
            onError("ios_getProductInfoWithProductIdArr", rsp);
        }
        else
        {
            const char* rsp = [RuiXueIOSBridgeUtils jsonStringFromProductList:productInfoList];
            onSuccess("ios_getProductInfoWithProductIdArr", rsp);
        }
    }];
}
