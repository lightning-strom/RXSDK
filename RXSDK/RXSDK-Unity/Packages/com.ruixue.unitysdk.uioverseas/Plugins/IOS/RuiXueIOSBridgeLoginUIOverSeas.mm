#import <RXSDK_Pure/RXService.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import <RXUIKit_OS/RXUIKit_OS.h>
#import <RXUIKit_OS/RXOSUIKitService.h>
#import "RuiXueIOSBridgeBase.h"
#import "RuiXueIOSBridgeLoginUIOverSeas.h"
#import "RuiXueIOSBridgeUtils.h"
#import "NSString+JSONCategories.h"

void ios_showLoginUIWithConfig_OS(const char* config,
                            RequestResponseCallBack onSuccess,
                            RequestErrorCallBack onError)
{
    NSDictionary* dicConfig = [RuiXueIOSBridgeUtils toNSDic:config];
    
    RXOSUILoginConfig *loginConfig = [[RXOSUILoginConfig alloc] init];
    
    if(dicConfig)
    {
        NSArray* arrLoginTypes = [dicConfig objectForKey:@"loginTypes"];
        loginConfig.loginTypes = arrLoginTypes;
        
        NSArray* arrPrivacies = [dicConfig objectForKey:@"privacies"];
        loginConfig.privacies = arrPrivacies;
        
        NSArray* arrPrivacieTitles = [dicConfig objectForKey:@"privacieTitles"];
        loginConfig.privacieTitles = arrPrivacieTitles;
        
        loginConfig.loginViewType = [dicConfig[@"loginViewType"] integerValue];
        loginConfig.keyboardType = [dicConfig[@"keyboardType"] integerValue];
        loginConfig.needRealAuth = [dicConfig[@"needRealAuth"] boolValue];
        loginConfig.needSetPassword = [dicConfig[@"needSetPassword"] boolValue];
        loginConfig.isShowClose = [dicConfig[@"isShowClose"] boolValue];
        loginConfig.canCloseRealAuth = [dicConfig[@"canCloseRealAuth"] boolValue];
        loginConfig.isQuickButtonBarVisible = [dicConfig[@"isQuickButtonBarVisible"] boolValue];
        loginConfig.isShowDeregister = [dicConfig[@"isShowDeregister"] boolValue];
        loginConfig.setLoginContinue = [dicConfig[@"isLoginContinue"] boolValue];
        
        NSArray* aLogoImage = [dicConfig objectForKey:@"logoImage"];
        if(aLogoImage != nil)
        {
            UIImage* logoImage = [RuiXueIOSBridgeUtils byteArryToImage:aLogoImage];
            loginConfig.logoImage = logoImage;
        }
    }
    
    [[RXOSUIKitService sharedSDK] setLoginViewWithConfig:loginConfig complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if(!error)
        {
            onSuccess("ios_setLoginViewWithConfig_OS", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            onError("ios_setLoginViewWithConfig_OS",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

void ios_closeLoginView_OS()
{
    [[RXOSUIKitService sharedSDK] closeLoginView];
}


void ios_syncAccounts_OS(const char* json)
{
    NSString* strJson = [NSString stringWithUTF8String:json];
    NSArray<NSDictionary*>* arrAccounts = [NSString jsonToObject:strJson];
    
    [[RXOSUIKitService sharedSDK] syncAccounts:arrAccounts];
}


void ios_getBackPasswordWithComplete_OS(RequestResponseCallBack onSuccess, RequestErrorCallBack onError)
{
    [[RXOSUIKitService sharedSDK] getBackPasswordWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        
        if(!error)
        {
            onSuccess("ios_getBackPasswordWithComplete_OS", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            onError("ios_getBackPasswordWithComplete_OS",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

void ios_destroyAccountStatusViewWithDeregisterType_OS(bool isLoginContinue, RequestResponseCallBack onSuccess, RequestErrorCallBack onError)
{
    NSString* str = isLoginContinue?@"login":@"logout";
    [[RXOSUIKitService sharedSDK] destroyAccountStatusViewWithDeregisterType:str complete:^(DestroyClickType clickType) {
        NSString *btnTitle = @"";
        BOOL loginContinue = isLoginContinue;
        NSInteger btnType = 0;
        
        if (clickType == DestroyClickType_repeal) {
            btnTitle = @"撤销注销";
            btnType = 1;
        } else if (clickType == DestroyClickType_login) {
            btnTitle = @"继续登录";
            loginContinue = YES;
        } else if (clickType == DestroyClickType_logout) {
            btnTitle = @"退出登录";
            loginContinue = NO;
        }
        
        NSDictionary *data = @{@"btn_title" : btnTitle,
                               @"btn_type" : @(btnType),
                               @"login_continue" : @(loginContinue)};
        if (clickType == DestroyClickType_logout) {
            NSDictionary *error = @{@"code" : @(3001),
                                    @"msg" : @"登录取消",
                                    @"btn_title" : btnTitle,
                                    @"btn_type" : @(btnType),
                                    @"login_continue" : @(loginContinue)};
            onError("ios_destroyAccountStatusViewWithDeregisterType_OS", [RuiXueIOSBridgeUtils toJsonOut:error]);
        } else {
            NSDictionary *response = @{@"code" : @(0), @"data" : data};
            onSuccess("ios_destroyAccountStatusViewWithDeregisterType_OS", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }
    }];
}

// 撤销账号注销
void ios_destroyAccountStatusUIWithBtnTitle_OS(const char* title, RequestResponseCallBack onSuccess, RequestErrorCallBack onError)
{
   NSString* strTitle = [NSString stringWithUTF8String:title];

   [[RXOSUIKitService sharedSDK] destroyAccountStatusUIWithBtnTitle:strTitle complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if(!error)
        {
            onSuccess("ios_destroyAccountStatusUIWithBtnTitle_OS", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            onError("ios_destroyAccountStatusUIWithBtnTitle_OS", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

void ios_setProtocolViewWithKey_OS(const char* key, const char* keyList)
{
    [[RXOSUIKitService sharedSDK]setProtocolViewWithKey:[RuiXueIOSBridgeUtils toNSString:key] keyList:[RuiXueIOSBridgeUtils toNSArray:keyList]];
}

void ios_setRealauthViewWithCanClose_OS(bool canClose, RequestResponseCallBack onSuccess,
                                 RequestErrorCallBack onError)
{
    [[RXOSUIKitService sharedSDK] setRealauthViewWithCanClose:canClose complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                
        if(!error)
        {
            onSuccess("ios_setRealauthViewWithCanClose_OS", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            onError("ios_setRealauthViewWithCanClose_OS",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 防沉迷
void ios_setAntiAdditionViewWithTitle_OS(const char* title, const char* des, const char* btnTitle, RequestResponseCallBack onSuccess, RequestErrorCallBack onError)
{
    [[RXOSUIKitService sharedSDK] setAntiAdditionViewWithTitle:[RuiXueIOSBridgeUtils toNSString:title] des:[RuiXueIOSBridgeUtils toNSString:des] btnTitle:[RuiXueIOSBridgeUtils toNSString:btnTitle] complete:^{
        
        onSuccess("ios_setAntiAdditionViewWithTitle_OS", [RuiXueIOSBridgeUtils createJsonOutWithCode:0 Msg:nil]);
    }];
}

void ios_userCenterWithConfig_OS(const char* config,
                                 RequestResponseCallBack onSuccess,
                          RequestErrorCallBack onError)
{
    NSString* strConfig = [NSString stringWithUTF8String:config];
    NSDictionary* dicConfig = [NSString jsonToObject:strConfig];
    
    if(!dicConfig)
        return;
    
    RXOSUserCenterConfig* userCenterConfig = [[RXOSUserCenterConfig alloc] init];
    NSArray* aLogoImage = [dicConfig objectForKey:@"logoImage"];
    if(aLogoImage!=nil)
    {
        UIImage* logoImage = [RuiXueIOSBridgeUtils byteArryToImage:aLogoImage];
        userCenterConfig.logoImage = logoImage;
    }
    userCenterConfig.transmit_args = (NSString *)dicConfig[@"transmit_args"];
    userCenterConfig.game_user_id = (NSString *)dicConfig[@"game_user_id"];
    userCenterConfig.nickname = (NSString *)dicConfig[@"nickname"];
    userCenterConfig.head_img_url = (NSString *)dicConfig[@"head_img_url"];
    userCenterConfig.queue_name = (NSString *)dicConfig[@"queue_name"];
    NSDictionary* configParams = [dicConfig objectForKey:@"setConfigParams"];
    userCenterConfig.setConfigParams = configParams;
    
        [[RXOSUIKitService sharedSDK] userCenterUIWithConfig:userCenterConfig complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            
            if(!error)
            {
                onSuccess("ios_userCenterWithConfig_OS", [RuiXueIOSBridgeUtils toJsonOut:response]);
            }
            else
            {
                onError("ios_userCenterWithConfig_OS",[RuiXueIOSBridgeUtils toErrorOut:error]);
            }
        }];
}


void ios_applyForDeregisterWithConfig_OS(const char* config, RequestResponseCallBack onResponse)
{
    NSDictionary* dicConfig = [RuiXueIOSBridgeUtils toNSDic:config];
    if(!dicConfig)
        return;
    
    RXOSUserCenterConfig* userCenterConfig = [[RXOSUserCenterConfig alloc] init];
    
    NSArray* aLogoImage = [dicConfig objectForKey:@"logoImage"];
    if(aLogoImage!=nil)
    {
        UIImage* logoImage = [RuiXueIOSBridgeUtils byteArryToImage:aLogoImage];
        userCenterConfig.logoImage = logoImage;
    }
    
    userCenterConfig.transmit_args = (NSString *)dicConfig[@"transmit_args"];
    userCenterConfig.game_user_id = (NSString *)dicConfig[@"game_user_id"];
    userCenterConfig.nickname = (NSString *)dicConfig[@"nickname"];
    userCenterConfig.head_img_url = (NSString *)dicConfig[@"head_img_url"];
    userCenterConfig.queue_name = (NSString *)dicConfig[@"queue_name"];
    
    [[RXOSUIKitService sharedSDK] applyForDeregisterWithConfig:userCenterConfig complete:^(NSDictionary * _Nonnull response)
     {
        onResponse("ios_applyForDeregisterWithConfig_OS",[RuiXueIOSBridgeUtils toJsonOut:response]);
    }];
}

// 帮助中心
void ios_serviceCenterWithConfig_OS(const char* config,
                                 RequestResponseCallBack onSuccess,
                                 RequestErrorCallBack onError)
{
    NSDictionary* dicConfig = [RuiXueIOSBridgeUtils toNSDic:config];
    if(!dicConfig)
        return;
    
    RXOSUserCenterConfig* userCenterConfig = [[RXOSUserCenterConfig alloc] init];
    NSArray* aLogoImage = [dicConfig objectForKey:@"logoImage"];
    
    if(aLogoImage != nil)
    {
        UIImage* logoImage = [RuiXueIOSBridgeUtils byteArryToImage:aLogoImage];
        userCenterConfig.logoImage = logoImage;
    }

    userCenterConfig.transmit_args = (NSString *)dicConfig[@"transmit_args"];
    userCenterConfig.game_user_id = (NSString *)dicConfig[@"game_user_id"];
    userCenterConfig.nickname = (NSString *)dicConfig[@"nickname"];
    userCenterConfig.head_img_url = (NSString *)dicConfig[@"head_img_url"];
    userCenterConfig.queue_name = (NSString *)dicConfig[@"queue_name"];
    //userCenterConfig.setLightTheme= [dicConfig[@"setLightTheme"] boolValue];
    
    [[RXOSUIKitService sharedSDK] serviceCenterWithConfig:userCenterConfig complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {

        if(!error)
        {
            onSuccess("ios_serviceCenterWithConfig_OS",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            onError("ios_serviceCenterWithConfig_OS",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 客服
void ios_chatServiceWithConfig_OS(const char* config,
                               RequestResponseCallBack onSuccess,
                               RequestErrorCallBack onError)
{
    NSDictionary* dicConfig = [RuiXueIOSBridgeUtils toNSDic:config];
    if(!dicConfig)
        return;
    
    RXOSUserCenterConfig* userCenterConfig = [[RXOSUserCenterConfig alloc] init];
    NSArray* aLogoImage = [dicConfig objectForKey:@"logoImage"];
    
    if(aLogoImage != nil)
    {
        UIImage* logoImage = [RuiXueIOSBridgeUtils byteArryToImage:aLogoImage];
        userCenterConfig.logoImage = logoImage;
    }

    userCenterConfig.transmit_args = (NSString *)dicConfig[@"transmit_args"];
    userCenterConfig.game_user_id = (NSString *)dicConfig[@"game_user_id"];
    userCenterConfig.nickname = (NSString *)dicConfig[@"nickname"];
    userCenterConfig.head_img_url = (NSString *)dicConfig[@"head_img_url"];
    userCenterConfig.queue_name = (NSString *)dicConfig[@"queue_name"];
    
    [[RXOSUIKitService sharedSDK] chatServiceWithConfig:userCenterConfig complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {

        if(!error)
        {
            onSuccess("ios_chatServiceWithConfig_OS",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            onError("ios_chatServiceWithConfig_OS",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

//展示邮箱
void ios_showEmailViewWithCpUserId_OS(const char* cpUserId){
    NSString *cpUserIDStr = [RuiXueIOSBridgeUtils toNSString:cpUserId];
    [[RXOSUIKitService sharedSDK] showEmailViewWithCpUserId:cpUserIDStr withComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
                    
    }];
}

//展示公告
void ios_showAnnounceViewWithLimit_OS(int limit, LinkCallBack linkCallBackBlock, HasAnnounceCallBack hasAnnounceCallback){
    [[RXOSUIKitService sharedSDK] showAnnounceViewWithLimit:limit linkCallBack:^(NSString * _Nonnull link) {
        linkCallBackBlock([link UTF8String]);
    } isHasCallBack:^(BOOL isHas) {
        hasAnnounceCallback(isHas);
    }];

}

//大厅更新检查 - 展示维护公告（GET版本）
void ios_checkUpdate_AppWithRegion_get_OS(const char* region, const char* client_version, const char* type, const char* json, bool isShow, LinkCallBack linkCallBackBlock, RequestResponseCallBack onSuccess, RequestErrorCallBack onError){
    NSString *regionStr = [RuiXueIOSBridgeUtils toNSString:region];
    NSString *client_versionStr = [RuiXueIOSBridgeUtils toNSString:client_version];
    NSString *typeStr = [RuiXueIOSBridgeUtils toNSString:type];
    NSString *jsonStr = [RuiXueIOSBridgeUtils toNSString:json];
    [[RXUpdateCheckService sharedSDK] checkUpdate_AppWithRegion:regionStr client_version:client_versionStr type:typeStr json:jsonStr isShow:isShow linkCallBack:^(NSString * _Nonnull link) {
        linkCallBackBlock([link UTF8String]);
    } complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if(!error)
        {
            onSuccess("ios_checkUpdate_AppWithRegion_get",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            onError("ios_checkUpdate_AppWithRegion_get",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

//大厅更新检查 - 展示维护公告（POST版本)
void ios_checkUpdate_AppWithRegion_post_OS(const char* region, const char* client_version, const char* games, const char* activities, const char* type, const char* json, bool isShow, LinkCallBack linkCallBackBlock, RequestResponseCallBack onSuccess, RequestErrorCallBack onError){
    NSString *regionStr = [RuiXueIOSBridgeUtils toNSString:region];
    NSString *client_versionStr = [RuiXueIOSBridgeUtils toNSString:client_version];
    NSMutableDictionary *gamesDic = [RuiXueIOSBridgeUtils toNSDic:games];
    NSMutableDictionary *activitiesDic = [RuiXueIOSBridgeUtils toNSDic:activities];
    NSString *typeStr = [RuiXueIOSBridgeUtils toNSString:type];
    NSString *jsonStr = [RuiXueIOSBridgeUtils toNSString:json];
    [[RXUpdateCheckService sharedSDK] checkUpdate_AppWithRegion:regionStr client_version:client_versionStr games:gamesDic activities:activitiesDic type:typeStr json:jsonStr isShow:isShow linkCallBack:^(NSString * _Nonnull link) {
        linkCallBackBlock([link UTF8String]);
    } complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if(!error)
        {
            onSuccess("ios_checkUpdate_AppWithRegion_post",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            onError("ios_checkUpdate_AppWithRegion_post",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

//绑定/换绑手机
void ios_bindPhone_OS(RequestResponseCallBack onSuccess, RequestErrorCallBack onError){
    [[RXOSUIKitService sharedSDK] bindPhoneWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if(!error)
        {
            onSuccess("ios_bindPhone_OS",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            onError("ios_bindPhone_OS",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

//绑定/换绑邮箱
void ios_bindEmail_OS(RequestResponseCallBack onSuccess, RequestErrorCallBack onError){
    [[RXOSUIKitService sharedSDK] bindEmailWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if(!error)
        {
            onSuccess("ios_bindEmail_OS",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            onError("ios_bindEmail_OS",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}