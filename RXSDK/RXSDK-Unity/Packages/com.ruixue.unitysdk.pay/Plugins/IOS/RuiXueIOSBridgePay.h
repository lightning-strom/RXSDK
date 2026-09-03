#ifndef __RuiXue__IOSBridge__Pay__
#define __RuiXue__IOSBridge__Pay__


extern "C"
{

// 下单
void ios_iap_requestWithDict(const char* dictJson,
                       RequestResponseCallBack onSuccess,
                       RequestErrorCallBack onError);

// 获取商品信息
void ios_getProductInfoWithProductIdArr(const char* productIdArrJson, 
                       RequestResponseCallBack onSuccess, 
                       RequestErrorCallBack onError);

}

#endif
