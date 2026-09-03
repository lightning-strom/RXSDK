#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import <RXLBSKit/RXLBSKit.h>
#import "NSString+JSONCategories.h"
#include "RuiXueIOSBridgeBase.h"
#include "RuiXueIOSBridgeUtils.h"
#include "RuiXueIOSBridgeLBS.h"

// 注册高德key
void ios_lbs_registeAMWithAppkey(const char* appkey)
{
    [[RXLBSKitService sharedSDK] registeAMWithAppkey:[RuiXueIOSBridgeUtils toNSString:appkey]];
}

// 判断定位权限
bool ios_lbs_enableLocationAuthorizationStatus()
{
    return [[RXLBSKitService sharedSDK] enableLocationAuthorizationStatus];
}

// 请求定位权限
void ios_lbs_requestLocationAuthorization(RequestLocationAuthoriaztionCallBack requestCallBack)
{
    [[RXLBSKitService sharedSDK] requestLocationAuthorization:^(BOOL authorization) {
        requestCallBack(authorization);
    }];
}

// 获取位置信息
void ios_lbs_getLocationInfo(RequestResponseCallBack onSuccess, RequestErrorCallBack onError)
{
    [[RXLBSKitService sharedSDK] getLocationInfo:^(RXLBSModel * _Nonnull location, NSError * _Nonnull error) {
            if (error) {
                NSLog(@"location error = %@", error);
                onError("ios_lbs_getLocationInfo", [RuiXueIOSBridgeUtils toErrorOut_NSError:error]);
            } else {
                NSLog(@"location success = %@", location);
                NSDictionary *dictionary = [RuiXueIOSBridgeUtils dictionaryWithPropertiesOfObject:location];
                onSuccess("ios_lbs_getLocationInfo", [RuiXueIOSBridgeUtils toJsonOut:dictionary]);
            }
    }];
}

// 是否允许后台定位  默认为NO不开启后台定位
void ios_lbs_setAllowsBackgroundLocationUpdates(bool allow)
{
    [[RXLBSKitService sharedSDK] setAllowsBackgroundLocationUpdates:allow];
}

// 设置定位超时时间  默认为2秒
void ios_lbs_setLocationTimeout(int timeout)
{
    [[RXLBSKitService sharedSDK] setLocationTimeout:timeout];
}
