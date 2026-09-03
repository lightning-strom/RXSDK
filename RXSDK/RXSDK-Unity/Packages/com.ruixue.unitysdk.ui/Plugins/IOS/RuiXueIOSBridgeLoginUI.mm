#import <RXSDK_Pure/RXService.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import <RXUIKit/RXUIKitService.h>
#import <RXUIKit/RXLoginUIConfig.h>
#import "RuiXueIOSBridgeBase.h"
#import "RuiXueIOSBridgeLoginUI.h"
#import "RuiXueIOSBridgeUtils.h"
#import "NSString+JSONCategories.h"

void ios_showLoginUIWithConfig(const char* config,
                               RequestResponseCallBack onSuccess,
                               RequestErrorCallBack onError)
{
    NSDictionary* dicConfig = [RuiXueIOSBridgeUtils toNSDic:config];
    
    RXLoginUIModel *loginConfig = [[RXLoginUIModel alloc] init];
    
    if(dicConfig)
    {
        NSArray* arrLoginTypes = [dicConfig objectForKey:@"loginTypes"];
        loginConfig.loginMethods = arrLoginTypes;
        
        NSArray* arrPrivacies = [dicConfig objectForKey:@"privacies"];
        loginConfig.privacies = arrPrivacies;
        
        NSArray* arrPrivacieTitles = [dicConfig objectForKey:@"privacieTitles"];
        loginConfig.privacieTitles = arrPrivacieTitles;
        
        loginConfig.loginViewType = [dicConfig[@"loginViewType"] integerValue];
        loginConfig.keyboardType = [dicConfig[@"keyboardType"] integerValue];
        loginConfig.setFirstNeedSetPassword = [dicConfig[@"needSetPassword"] boolValue];
        loginConfig.isShowClose = [dicConfig[@"isShowClose"] boolValue];
        loginConfig.setQuickButtonBarVisible = [dicConfig[@"isQuickButtonBarVisible"] boolValue];
        loginConfig.setDeregisterShow = [dicConfig[@"isShowDeregister"] boolValue];
        loginConfig.setLoginContinue = [dicConfig[@"isLoginContinue"] boolValue];
        
        NSArray* aLogoImage = [dicConfig objectForKey:@"logoImage"];
        if(aLogoImage != nil)
        {
            UIImage* logoImage = [RuiXueIOSBridgeUtils byteArryToImage:aLogoImage];
            loginConfig.logoImage = logoImage;
        }
    }
    
    
    
    [[RXUIKitService sharedSDK] showLoginUIWithConfig:loginConfig complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if(!error)
        {
            onSuccess("ios_showLoginUIWithConfig", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            onError("ios_showLoginUIWithConfig",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

void ios_closeLoginView()
{
    [[RXUIKitService sharedSDK] closeLoginView];
}


void ios_syncAccounts(const char* json)
{
    NSString* strJson = [NSString stringWithUTF8String:json];
    NSArray<NSDictionary*>* arrAccounts = [NSString jsonToObject:strJson];
    
    NSLog(@"ios_syncAccounts %@", arrAccounts);
    [[RXUIKitService sharedSDK] syncAccounts:arrAccounts];
}


void ios_getBackPasswordWithComplete(RequestResponseCallBack onSuccess, RequestErrorCallBack onError)
{
    [[RXUIKitService sharedSDK] getBackPasswordWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        
        if(!error)
        {
            onSuccess("ios_getBackPasswordWithComplete", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            onError("ios_getBackPasswordWithComplete", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

void ios_destroyAccountStatusViewWithDeregisterType(bool isLoginContinue, RequestResponseCallBack onSuccess, RequestErrorCallBack onError)
{
    NSString* str = isLoginContinue?@"login":@"logout";
    [[RXUIKitService sharedSDK] destroyAccountStatusViewWithDeregisterType:str complete:^(DestroyClickType clickType)
     {
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
            onError("ios_destroyAccountStatusViewWithDeregisterType", [RuiXueIOSBridgeUtils toJsonOut:error]);
        } else {
            NSDictionary *response = @{@"code" : @(0), @"data" : data};
            onSuccess("ios_destroyAccountStatusViewWithDeregisterType", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }
    }];
    
}

// 撤销账号注销
void ios_destroyAccountStatusUIWithBtnTitle(const char* title, RequestResponseCallBack onSuccess, RequestErrorCallBack onError)
{
    [[RXUIKitService sharedSDK] destroyAccountStatusUIWithBtnTitle:[RuiXueIOSBridgeUtils toNSString:title] complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if(!error)
        {
            onSuccess("ios_destroyAccountStatusUIWithBtnTitle", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            onError("ios_destroyAccountStatusUIWithBtnTitle", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

void ios_setProtocolViewWithKey(const char* key, const char* keyList)
{
    NSString* strKey = [RuiXueIOSBridgeUtils toNSString:key];
    NSArray* arrKeyList = [RuiXueIOSBridgeUtils toNSArray:keyList];
    
    [[RXUIKitService sharedSDK]setProtocolViewWithKey:strKey keyList:arrKeyList];
}

void ios_setRealauthView(RequestResponseCallBack onSuccess, RequestErrorCallBack onError)
{
    [[RXUIKitService sharedSDK] setRealauthViewWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if(!error)
        {
            onSuccess("ios_setRealauthView", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            onError("ios_setRealauthView",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 防沉迷
void ios_setAntiAdditionViewWithTitle(const char* title, const char* des, const char* btnTitle, RequestResponseCallBack onSuccess, RequestErrorCallBack onError)
{
    [[RXUIKitService sharedSDK] setAntiAdditionViewWithTitle:[RuiXueIOSBridgeUtils toNSString:title] des:[RuiXueIOSBridgeUtils toNSString:des] btnTitle:[RuiXueIOSBridgeUtils toNSString:btnTitle] complete:^{
        
        onSuccess("ios_setAntiAdditionViewWithTitle", [RuiXueIOSBridgeUtils createJsonOutWithCode:0 Msg:nil]);
    }];
}

void ios_userCenterWithConfig(const char* config,
                              RequestResponseCallBack onSuccess,
                              RequestErrorCallBack onError)
{
    NSDictionary* dicConfig = [RuiXueIOSBridgeUtils toNSDic:config];
    if(!dicConfig)
        return;
    
    RXUserCenterConfig* userCenterConfig = [[RXUserCenterConfig alloc] init];
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
    NSDictionary* configParams = [dicConfig objectForKey:@"setConfigParams"];
    userCenterConfig.setConfigParams = configParams;
    
    [[RXUIKitService sharedSDK] userCenterUIWithConfig:userCenterConfig complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        
        if(!error)
        {
            onSuccess("ios_userCenterWithConfig",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            onError("ios_userCenterWithConfig",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}


void ios_applyForDeregisterWithConfig(const char* config, RequestResponseCallBack onResponse)
{
    NSDictionary* dicConfig = [RuiXueIOSBridgeUtils toNSDic:config];
    if(!dicConfig)
        return;
    
    RXUserCenterConfig* userCenterConfig = [[RXUserCenterConfig alloc] init];
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
    
    [[RXUIKitService sharedSDK] applyForDeregisterWithConfig:userCenterConfig complete:^(NSDictionary * _Nonnull response)
     {
        onResponse("ios_applyForDeregisterWithConfig", [RuiXueIOSBridgeUtils toJsonOut:response]);
    }];
}

// 帮助中心
void ios_serviceCenterWithConfig(const char* config,
                                 RequestResponseCallBack onSuccess,
                                 RequestErrorCallBack onError)
{
    NSDictionary* dicConfig = [RuiXueIOSBridgeUtils toNSDic:config];
    if(!dicConfig)
        return;
    
    RXUserCenterConfig* userCenterConfig = [[RXUserCenterConfig alloc] init];
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
    
    [[RXUIKitService sharedSDK] serviceCenterWithConfig:userCenterConfig complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        
        if(!error)
        {
            onSuccess("ios_serviceCenterWithConfig",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            onError("ios_serviceCenterWithConfig",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 客服
void ios_chatServiceWithConfig(const char* config,
                               RequestResponseCallBack onSuccess,
                               RequestErrorCallBack onError)
{
    NSDictionary* dicConfig = [RuiXueIOSBridgeUtils toNSDic:config];
    if(!dicConfig)
        return;
    
    RXUserCenterConfig* userCenterConfig = [[RXUserCenterConfig alloc] init];
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
    
    [[RXUIKitService sharedSDK] chatServiceWithConfig:userCenterConfig complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        
        if(!error)
        {
            onSuccess("ios_chatServiceWithConfig",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            onError("ios_chatServiceWithConfig",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

//展示邮箱
void ios_showEmailViewWithCpUserId(const char* cpUserId){
    NSString *cpUserIDStr = [RuiXueIOSBridgeUtils toNSString:cpUserId];
    [[RXUIKitService sharedSDK] showEmailViewWithCpUserId:cpUserIDStr withComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
         
    }];                           
}

//展示公告
void ios_showAnnounceViewWithLimit(int limit, LinkCallBack linkCallBackBlock, HasAnnounceCallBack hasAnnounceCallback){
    [[RXUIKitService sharedSDK] showAnnounceViewWithLimit:limit linkCallBack:^(NSString * _Nonnull link) {
        linkCallBackBlock([link UTF8String]);
    } isHasCallBack:^(BOOL isHas) {
        hasAnnounceCallback(isHas);
    }];

}

//大厅更新检查 - 展示维护公告（GET版本）
void ios_checkUpdate_AppWithRegion_get(const char* region, const char* client_version, const char* type, const char* json, bool isShow, LinkCallBack linkCallBackBlock, RequestResponseCallBack onSuccess, RequestErrorCallBack onError){
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
void ios_checkUpdate_AppWithRegion_post(const char* region, const char* client_version, const char* games, const char* activities, const char* type, const char* json, bool isShow, LinkCallBack linkCallBackBlock, RequestResponseCallBack onSuccess, RequestErrorCallBack onError){
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
void ios_bindPhone(RequestResponseCallBack onSuccess,
                   RequestErrorCallBack onError){
    [[RXUIKitService sharedSDK] bindPhoneWithComplete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
        if(!error)
        {
            onSuccess("ios_bindPhone",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            onError("ios_bindPhone",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}
