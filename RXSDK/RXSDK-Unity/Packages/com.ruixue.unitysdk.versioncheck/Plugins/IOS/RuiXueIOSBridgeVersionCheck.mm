#import <RXSDK_Pure/RXSDK_Pure.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import "NSString+JSONCategories.h"
#include "RuiXueIOSBridgeBase.h"
#include "RuiXueIOSBridgeUtils.h"
#include "RuiXueIOSBridgeVersionCheck.h"

// 大厅更新检查（GET版本，不返回下载地址）
void ios_checkUpdate_App(const char* region,
                         const char* client_version,
                         const char* type,
                         RequestResponseCallBack onSuccess,
                         RequestErrorCallBack onError)
{
    [[RXUpdateCheckService sharedSDK] checkUpdate_AppWithRegion:[RuiXueIOSBridgeUtils toNSString:region]
                                                 client_version:[RuiXueIOSBridgeUtils toNSString:client_version]
                                                           type:[RuiXueIOSBridgeUtils toNSString:type] json:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if(!error)
        {
            NSLog(@"大厅更新检查 成功");
            onSuccess("ios_checkUpdate_App",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"大厅更新检查 失败");
            onError("ios_checkUpdate_App",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
                
    }];
}

// 大厅更新检查（POST版本，返回下载地址）
void ios_checkUpdate_AppCustom(const char* region,
                               const char* client_version,
                               const char* games,
                               const char* activities,
                               const char* type,
                               RequestResponseCallBack onSuccess,
                               RequestErrorCallBack onError)
{
    [[RXUpdateCheckService sharedSDK] checkUpdate_AppWithRegion:[RuiXueIOSBridgeUtils toNSString:region]
                                                 client_version:[RuiXueIOSBridgeUtils toNSString:client_version] games:[RuiXueIOSBridgeUtils toNSDic:games]
                                                     activities:[RuiXueIOSBridgeUtils toNSDic:activities]
                                                           type:[RuiXueIOSBridgeUtils toNSString:type]
                                                           json:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if(!error)
        {
            NSLog(@"大厅更新检查 成功");
            onSuccess("ios_checkUpdate_AppCustom",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"大厅更新检查 失败");
            onError("ios_checkUpdate_AppCustom",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 活动更新检查
void ios_checkUpdate_Activity(const char* game_version,
                              const char* game_check_version,
                              const char* short_name,
                              const char* type,
                              RequestResponseCallBack onSuccess,
                              RequestErrorCallBack onError)
{
    [[RXUpdateCheckService sharedSDK] checkUpdate_ActivityWithGame_version:[RuiXueIOSBridgeUtils toInt:game_version]
                                                        game_check_version:[RuiXueIOSBridgeUtils toNSString:game_check_version]
                                                                short_name:[RuiXueIOSBridgeUtils toNSString:short_name]
                                                                      type:[RuiXueIOSBridgeUtils toNSString:type]
                                                                      json:nil
                                                                  complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if(!error)
        {
            NSLog(@"活动更新检查 成功");
            onSuccess("ios_checkUpdate_Activity",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"活动更新检查 失败");
            onError("ios_checkUpdate_Activity",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 游戏更新检查
void ios_checkUpdate_Game(const char* game_id,
                          const char* game_version,
                          const char* game_check_version,
                          const char* type,
                          RequestResponseCallBack onSuccess,
                          RequestErrorCallBack onError)
{
    [[RXUpdateCheckService sharedSDK] checkUpdate_GameWithGame_id:[RuiXueIOSBridgeUtils toInt:game_id] game_version:[RuiXueIOSBridgeUtils toInt:game_version] game_check_version:[RuiXueIOSBridgeUtils toNSString:game_check_version] type:[RuiXueIOSBridgeUtils toNSString:type] json:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"游戏更新检查 成功");
            onSuccess("ios_checkUpdate_Game",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"游戏更新检查 失败");
            onError("ios_checkUpdate_Game",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 游戏版本检查 v2
void ios_updateGameVersion(const char* body,
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError)
{
    [[RXUpdateCheckService sharedSDK] updateGameVersionWithInfo:[RuiXueIOSBridgeUtils toNSDic:body] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if(!error)
        {
            NSLog(@"游戏版本检查 v2 成功");
            onSuccess("ios_updateGameVersion",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"游戏版本检查 v2 失败");
            onError("ios_updateGameVersion",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}
