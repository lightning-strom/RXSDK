#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXContactSDK/RXContactSDK.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#include "RuiXueIOSBridgeBase.h"
#include "RuiXueIOSBridgeUtils.h"
#include "RuiXueIOSBridgeSocial.h"

// 获取指定半径内的其他用户信息
void ios_social_getRadiusAccountWithLon(double lon,
                                        double lat,
                                        int radius,
                                        int count,
                                        int page,
                                        int page_size,
                                        const char* type,
                                        RequestResponseCallBack onSuccess,
                                        RequestErrorCallBack onError)
{
    [[RXContactService sharedSDK] getRadiusAccountWithLon:lon lat:lat radius:radius count:count page:page page_size:page_size type:[RuiXueIOSBridgeUtils toNSString:type] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
       
        if(!error)
        {
            NSLog(@"getRadiusAccount 成功");
            onSuccess("ios_social_getRadiusAccountWithLon", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"getRadiusAccount 失败");
            onError("ios_social_getRadiusAccountWithLon",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 设置用户自定义信息
void ios_social_setUserCustomWithCustom(const char* custom,
                                        RequestResponseCallBack onSuccess,
                                        RequestErrorCallBack onError)
{
    [[RXContactService sharedSDK] setUserCustomWithCustom:[RuiXueIOSBridgeUtils toNSString:custom] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"设置用户自定义信息 成功");
            onSuccess("ios_social_setUserCustomWithCustom", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"设置用户自定义信息 失败");
            onError("ios_social_setUserCustomWithCustom", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 上报/更新经纬度坐标
void ios_social_lbsUpdateWithLon(double lon,
                                 double lat,
                                 const char* typesArryJson,
                                 RequestResponseCallBack onSuccess,
                                 RequestErrorCallBack onError)
{
    NSArray* typesArry = [RuiXueIOSBridgeUtils toNSArray:typesArryJson];
    
    [[RXContactService sharedSDK] lbsUpdateWithLon:lon lat:lat types:typesArry complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"更新经纬度坐标 成功");
            onSuccess("ios_social_lbsUpdateWithLon", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"更新经纬度坐标 失败");
            onError("ios_social_lbsUpdateWithLon", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 删除经纬度坐标
void ios_social_deleteLocationWithTypes(const char* typesArryJson,
                                        RequestResponseCallBack onSuccess,
                                        RequestErrorCallBack onError)
{
    NSArray* typesArry = [RuiXueIOSBridgeUtils toNSArray:typesArryJson];
    [[RXContactService sharedSDK] deleteLocationWithTypes:typesArry complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"删除经纬度坐标 成功");
            onSuccess("ios_social_deleteLocationWithTypes",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"删除经纬度坐标 失败");
            onError("ios_social_deleteLocationWithTypes",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}



// 添加自定义关系
void ios_social_addRelationWithTarget(const char* target,
                                      const char* typesDicJson,
                                      const char* target_remarks,
                                      const char* user_remarks,
                                      RequestResponseCallBack onSuccess,
                                      RequestErrorCallBack onError)
{
    NSDictionary* typesDic= [RuiXueIOSBridgeUtils toNSDic:typesDicJson];
    [[RXContactService sharedSDK] addRelationWithTarget:[RuiXueIOSBridgeUtils toNSString:target] types:typesDic target_remarks:[RuiXueIOSBridgeUtils toNSString:target_remarks] user_remarks:[RuiXueIOSBridgeUtils toNSString:user_remarks] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"添加自定义关系 成功");
            onSuccess("ios_social_addRelationWithTarget",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"添加自定义关系 失败");
            onError("ios_social_addRelationWithTarget",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

 // 删除自定义关系
void ios_social_deleteRelationWithTarget(const char* target,
                                         const char* typesDicJson,
                                         RequestResponseCallBack onSuccess,
                                         RequestErrorCallBack onError)
{
    NSDictionary* typesDic= [RuiXueIOSBridgeUtils toNSDic:typesDicJson];
    [[RXContactService sharedSDK] deleteRelationWithTarget:[RuiXueIOSBridgeUtils toNSString:target] types:typesDic complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"删除自定义关系 成功");
            onSuccess("ios_social_deleteRelationWithTarget",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"删除自定义关系 失败");
            onError("ios_social_deleteRelationWithTarget",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}


// 更新用户自定义关系备注
void ios_social_updateRemarksWithTarget(const char* target,
                                        const char* target_reamks,
                                        const char* type,
                                        RequestResponseCallBack onSuccess,
                                        RequestErrorCallBack onError)
{
    [[RXContactService sharedSDK] updateFriendRemarkWithTarget:[RuiXueIOSBridgeUtils toNSString:target] target_remarks:[RuiXueIOSBridgeUtils toNSString:target_reamks] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
       
        if(!error)
        {
            NSLog(@"更新用户自定义关系备注 成功");
            onSuccess("ios_social_updateRemarksWithTarget",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"更新用户自定义关系备注 失败");
            onError("ios_social_updateRemarksWithTarget",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 获取自定义关系列表
void ios_social_getRelationListWithType(const char* type,
                                        RequestResponseCallBack onSuccess,
                                        RequestErrorCallBack onError)
{
    [[RXContactService sharedSDK] getRelationListWithType:[RuiXueIOSBridgeUtils toNSString:type] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"获取自定义关系列表 成功");
            onSuccess("ios_social_getRelationListWithType",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"获取自定义关系列表 失败");
            onError("ios_social_getRelationListWithType",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 判断两用户是否存在某自定关系
void ios_social_requestHasRelationWithTarget(const char* target,
                                             const char* type,
                                             RequestResponseCallBack onSuccess,
                                             RequestErrorCallBack onError)
{
    [[RXContactService sharedSDK] requestHasRelationWithTarget:[RuiXueIOSBridgeUtils toNSString:target] type:[RuiXueIOSBridgeUtils toNSString:type] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
       
        if(!error)
        {
            NSLog(@"判断两用户是否存在某自定关系 成功");
            onSuccess("ios_social_requestHasRelationWithTarget",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"判断两用户是否存在某自定关系 失败");
            onError("ios_social_requestHasRelationWithTarget",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}


// 添加好友
void ios_social_addFriendWithTarget(const char* target,
                                    const char* target_remarks,
                                    const char* user_remarks,
                                    RequestResponseCallBack onSuccess,
                                    RequestErrorCallBack onError)
{
    [[RXContactService sharedSDK] addFriendWithTarget:[RuiXueIOSBridgeUtils toNSString:target] target_remarks:[RuiXueIOSBridgeUtils toNSString:target_remarks] user_remarks:[RuiXueIOSBridgeUtils toNSString:user_remarks] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        
        if(!error)
        {
            NSLog(@"添加好友 成功");
            onSuccess("ios_social_addFriendWithTarget",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"添加好友 失败");
            onError("ios_social_addFriendWithTarget",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 删除好友
void ios_social_deleteFriendWithTarget(const char* target,
                                       RequestResponseCallBack onSuccess,
                                       RequestErrorCallBack onError)
{
    [[RXContactService sharedSDK] deleteFriendWithTarget:[RuiXueIOSBridgeUtils toNSString:target] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
       
        if(!error)
        {
            NSLog(@"删除好友 成功");
            onSuccess("ios_social_deleteFriendWithTarget",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"删除好友 失败");
            onError("ios_social_deleteFriendWithTarget",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 更新好友备注
void ios_social_updateFriendRemarkWithTarget(const char* target,
                                             const char* target_remarks,
                                             RequestResponseCallBack onSuccess,
                                             RequestErrorCallBack onError)
{
    [[RXContactService sharedSDK] updateFriendRemarkWithTarget:[RuiXueIOSBridgeUtils toNSString:target] target_remarks:[RuiXueIOSBridgeUtils toNSString:target_remarks] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
       
        if(!error)
        {
            NSLog(@"更新好友备注 成功");
            onSuccess("ios_social_updateFriendRemarkWithTarget",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"更新好友备注 失败");
            onError("ios_social_updateFriendRemarkWithTarget",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 获取好友列表
void ios_social_getFriendListWithComplete(RequestResponseCallBack onSuccess,
                                          RequestErrorCallBack onError)
{
    [[RXContactService sharedSDK] getFriendListWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"获取好友列表 成功");
            onSuccess("ios_social_getFriendListWithComplete",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"获取好友列表 失败");
            onError("ios_social_getFriendListWithComplete",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 判断两用户是否为好友
void ios_social_requestIsFriendWithTarget(const char* target,
                                          RequestResponseCallBack onSuccess,
                                          RequestErrorCallBack onError)
{
    [[RXContactService sharedSDK] requestIsFriendWithTarget:[RuiXueIOSBridgeUtils toNSString:target] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"判断两用户是否为好友 成功");
            onSuccess("ios_social_requestIsFriendWithTarget",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"判断两用户是否为好友 失败");
            onError("ios_social_requestIsFriendWithTarget",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}
