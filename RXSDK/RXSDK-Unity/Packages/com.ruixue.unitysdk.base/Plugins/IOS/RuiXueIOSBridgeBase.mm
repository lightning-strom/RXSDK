#include "RuiXueIOSBridgeBase.h"
#import <RXSDK_Pure/RXService.h>
#import <RXSDK_Pure/RX_CommonRequestError.h>
#import <RXSDK_Pure/RXApiService.h>
#import <RXSDK_Pure/RXSDK_Pure.h>
#import "NSString+JSONCategories.h"
#include "RuiXueIOSBridgeUtils.h"
            
void ios_base_initWithProductId(const char* cpid,
                       const char* productId,
                       const char* channelId,
                       const char* baseUrlList[],
                       int urlCount,
                       RequestResponseCallBack onSuccess,
                       RequestErrorCallBack onError)
{
    NSString* strProductId = [RuiXueIOSBridgeUtils toNSString:productId];
    NSString* strChannelId = [RuiXueIOSBridgeUtils toNSString:channelId];
    NSString* strCpid = [RuiXueIOSBridgeUtils toNSString:cpid];
    
    NSMutableArray* urls = [NSMutableArray array];
    for (int i = 0; i < urlCount; i++)
    {
        NSString *str = [[NSString alloc] initWithCString:baseUrlList[i] encoding:NSUTF8StringEncoding];
        [urls addObject:str];
    }
    
    [[RXService sharedSDK] initWithProductId:strProductId
                                   channelId:strChannelId
                                        cpid:strCpid
                                 baseUrlList:urls
                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
        if(!error)
        {
            NSLog(@"初始化成功");
            onSuccess("ios_base_initWithProductId", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"初始化失败");
            onError("ios_base_initWithProductId", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

//初始化最新方法
void ios_base_initWithConfig(const char* config,
                       RequestResponseCallBack onSuccess,
                       RequestErrorCallBack onError)
{
    RXSdkInitConfig *initConfig = [[RXSdkInitConfig alloc] init];
    NSMutableDictionary *dic = [RuiXueIOSBridgeUtils fetchDicNotNull:config];
    
    initConfig.cpId = (NSString*)[dic objectForKey:@"cpId"];
    initConfig.productId = (NSString*)[dic objectForKey:@"productId"];
    initConfig.channelId = (NSString*)[dic objectForKey:@"channelId"];
    initConfig.baseUrlList = [dic objectForKey:@"baseUrlList"];
    initConfig.isLogEnable =(NSString*)[dic objectForKey:@"isLogEnable"];
    initConfig.usePrivacy = [[dic objectForKey:@"usePrivacy"] boolValue];
    initConfig.agreementMap = [dic objectForKey:@"agreementMap"];
    initConfig.agreementTitle = (NSString*)[dic objectForKey:@"agreementTitle"];
    initConfig.isUseDNS = [[dic objectForKey:@"isUseDNS"] boolValue];
    
    [[RXService sharedSDK] initWithConfig:initConfig complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if(!error)
        {
            NSLog(@"初始化成功");
            onSuccess("ios_base_initWithConfig",[RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"初始化失败");
            onError("ios_base_initWithConfig",[RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

// 设置当前语言
void ios_base_setLanguage(const char* language)
{
    NSString* strLang = [RuiXueIOSBridgeUtils toNSString:language];
    [[RXService sharedSDK] setLanguage:strLang];
}

// 自定义请求
void ios_base_createRequestWithUrl(const char* url, const char* header, const char* body, int method, bool needLogin, RequestResponseCallBack onSuccess, RequestErrorCallBack onError)
{
    NSString* strUrl = [RuiXueIOSBridgeUtils toNSString:url];
    NSMutableDictionary* dicHeader = [RuiXueIOSBridgeUtils toNSDic:header];
    NSMutableDictionary* dicBody = [RuiXueIOSBridgeUtils toNSDic:body];
    
    [[RXService sharedSDK] createRequestWithUrl:strUrl header:dicHeader body:dicBody method:method needLogin:needLogin complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
               
        if(!error)
        {
            NSLog(@"请求成功");
            onSuccess("ios_base_createRequestWithUrl", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }
        else
        {
            NSLog(@"请求失败");
            onError("ios_base_createRequestWithUrl", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
        
       }];
}

void ios_base_setSubChannelId(const char* channelId)
{
    [[RXService sharedSDK] setSubChannelId:[RuiXueIOSBridgeUtils toNSString:channelId]];
}

void ios_base_setGameInfo(const char* roleId, const char* regionTag)
{
    NSString *roleIdStr = [RuiXueIOSBridgeUtils toNSString:roleId];
    NSString *regionTagStr = [RuiXueIOSBridgeUtils toNSString:regionTag];
    [[RXService sharedSDK] setGameInfoWithRoleId:roleIdStr regionTag:regionTagStr];
}

void ios_base_searchGameAccount(RequestResponseCallBack onSuccess,
                                RequestErrorCallBack onError)
{
    [[RXSDK sharedSDK] searchGameAccountWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"查询游戏角色信息成功");
            onSuccess("ios_base_searchGameAccount", [RuiXueIOSBridgeUtils toJsonOut:response]);
        } else {
            NSLog(@"查询游戏角色信息失败");
            onError("ios_base_searchGameAccount", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

void ios_base_bindAccount(const char* ext,
                          RequestResponseCallBack onSuccess,
                          RequestErrorCallBack onError)
{
    NSDictionary *extDic = [RuiXueIOSBridgeUtils toNSDic:ext];
    [[RXSDK sharedSDK] bindAccountWithExt:extDic complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"绑定账号成功");
            onSuccess("ios_base_bindAccount", [RuiXueIOSBridgeUtils toJsonOut:response]);
        } else {
            NSLog(@"绑定账号失败");
            onError("ios_base_bindAccount", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

void ios_base_getIIFAARedirectURL(const char* appName,
                                  const char* thirdPartSchema,
                                  RequestResponseCallBack onSuccess,
                                  RequestErrorCallBack onError)
{
    NSString *appNameStr = [RuiXueIOSBridgeUtils toNSString:appName];
    NSString *thirdPartSchemaStr = [RuiXueIOSBridgeUtils toNSString:thirdPartSchema];
    [[RXSDK sharedSDK] getIIFAARedirectURLWithAppName:appNameStr
                                      thirdPartSchema:thirdPartSchemaStr
                                             complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"获取 IIFAA 授权地址成功");
            onSuccess("ios_base_getIIFAARedirectURL", [RuiXueIOSBridgeUtils toJsonOut:response]);
        } else {
            NSLog(@"获取 IIFAA 授权地址失败");
            onError("ios_base_getIIFAARedirectURL", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

void ios_base_getIIFAAResultWithRetryCount(int retryCount,
                                           RequestResponseCallBack onSuccess,
                                           RequestErrorCallBack onError)
{
    [[RXSDK sharedSDK] getIIFAAResultWithRetryCount:retryCount
                                           complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"查询 IIFAA 认证结果成功");
            onSuccess("ios_base_getIIFAAResultWithRetryCount", [RuiXueIOSBridgeUtils toJsonOut:response]);
        } else {
            NSLog(@"查询 IIFAA 认证结果失败");
            onError("ios_base_getIIFAAResultWithRetryCount", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

void ios_base_getIIFAAResultWithSource(const char* source,
                                       int retryCount,
                                       RequestResponseCallBack onSuccess,
                                       RequestErrorCallBack onError)
{
    NSString *sourceStr = [RuiXueIOSBridgeUtils toNSString:source];
    [[RXSDK sharedSDK] getIIFAAResultWithSource:sourceStr
                                     retryCount:retryCount
                                       complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            NSLog(@"查询 IIFAA 认证结果成功");
            onSuccess("ios_base_getIIFAAResultWithSource", [RuiXueIOSBridgeUtils toJsonOut:response]);
        } else {
            NSLog(@"查询 IIFAA 认证结果失败");
            onError("ios_base_getIIFAAResultWithSource", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

//获取邮件列表
void ios_base_getEmailListWithCpUserID(const char* cpUserID,
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError){
   NSString *cpUserIDStr = [RuiXueIOSBridgeUtils toNSString:cpUserID];
   [[RXApiService sharedSDK] getEmailListWithCpUserID:cpUserIDStr complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
       if (!error) {
           NSLog(@"请求成功");
           onSuccess("ios_base_getEmailListWithCpUserID", [RuiXueIOSBridgeUtils toJsonOut:response]);
       }else{
           NSLog(@"请求失败");
           onError("ios_base_getEmailListWithCpUserID", [RuiXueIOSBridgeUtils toErrorOut:error]);
       }
   }];
}

//获取邮件详情
void ios_base_getEmailDetailWithCpUserID(const char* cpUserID,
                           int emailID,    
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError){
    NSString *cpUserIDStr = [RuiXueIOSBridgeUtils toNSString:cpUserID];
    [[RXApiService sharedSDK] getEmailDetailWithCpUserID:cpUserIDStr emailID:emailID complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
           NSLog(@"请求成功");
           onSuccess("ios_base_getEmailDetailWithCpUserID", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }else{
           NSLog(@"请求失败");
           onError("ios_base_getEmailDetailWithCpUserID", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];                                 
}

//领取道具
void ios_base_receivePropsWithCpUserID(const char* cpUserID,
                           int type,
                           int emailID,    
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError){
     NSString *cpUserIDStr = [RuiXueIOSBridgeUtils toNSString:cpUserID];
     [[RXApiService sharedSDK] receivePropsWithCpUserID:cpUserIDStr type:type emailID:emailID complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
         if (!error) {
            NSLog(@"请求成功");
            onSuccess("ios_base_receivePropsWithCpUserID", [RuiXueIOSBridgeUtils toJsonOut:response]);
         }else{
            NSLog(@"请求失败");
            onError("ios_base_receivePropsWithCpUserID", [RuiXueIOSBridgeUtils toErrorOut:error]);
         }
     }];                     
}

//删除邮件
void ios_base_deleteEmailWithCpUserID(const char* cpUserID,
                           int type,
                           int emailID,    
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError){
     NSString *cpUserIDStr = [RuiXueIOSBridgeUtils toNSString:cpUserID];
     [[RXApiService sharedSDK] deleteEmailWithCpUserID:cpUserIDStr type:type emailID:emailID complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
         if (!error) {
             NSLog(@"请求成功");
             onSuccess("ios_base_deleteEmailWithCpUserID", [RuiXueIOSBridgeUtils toJsonOut:response]);
          }else{
             NSLog(@"请求失败");
             onError("ios_base_deleteEmailWithCpUserID", [RuiXueIOSBridgeUtils toErrorOut:error]);
          }
     }];                                    
}

//获取公告列表
void ios_base_getAnnouncementWithLimitWithLimit(int limit,
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError){
     [[RXApiService sharedSDK] getAnnouncementWithLimit:limit complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
         if (!error) {
             NSLog(@"请求成功");
             onSuccess("ios_base_getAnnouncementWithLimitWithLimit", [RuiXueIOSBridgeUtils toJsonOut:response]);
         }else{
             NSLog(@"请求失败");
             onError("ios_base_getAnnouncementWithLimitWithLimit", [RuiXueIOSBridgeUtils toErrorOut:error]);
         }
     }];
} 

//获取临时维护公告
void ios_base_getTempNotice(RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError){
     [[RXApiService sharedSDK] getTempNotice:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
         if (!error) {
             NSLog(@"请求成功");
             onSuccess("ios_base_getTempNotice", [RuiXueIOSBridgeUtils toJsonOut:response]);
         }else{
             NSLog(@"请求失败");
             onError("ios_base_getTempNotice", [RuiXueIOSBridgeUtils toErrorOut:error]);
         }
     }];
}
     
//创建反馈
void ios_base_feedbackCreateWithContent(const char* content,
                           const char* attachments,
                           const char* phone,    
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError){
     NSString *contentStr = [RuiXueIOSBridgeUtils toNSString:content];
     NSMutableArray *attachmentsArray = [RuiXueIOSBridgeUtils toNSArray:attachments];
     NSString *phoneStr = [RuiXueIOSBridgeUtils toNSString:phone];
     [[RXApiService sharedSDK] feedbackCreateWithContent:contentStr attachments:attachmentsArray phone:phoneStr tags:@[] complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
         if (!error) {
              NSLog(@"请求成功");
              onSuccess("ios_base_feedbackCreateWithContent", [RuiXueIOSBridgeUtils toJsonOut:response]);
         }else{
              NSLog(@"请求失败");
              onError("ios_base_feedbackCreateWithContent", [RuiXueIOSBridgeUtils toErrorOut:error]);
         }
     }];      
                           
}

//获取反馈列表
void ios_base_getFeedbackListWithPage(int page,
                           int size,
                           int status,    
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError){
     [[RXApiService sharedSDK] getFeedbackListWithPage:page size:size status:status complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
         if (!error) {
               NSLog(@"请求成功");
               onSuccess("ios_base_getFeedbackListWithPage", [RuiXueIOSBridgeUtils toJsonOut:response]);
         }else{
               NSLog(@"请求失败");
               onError("ios_base_getFeedbackListWithPage", [RuiXueIOSBridgeUtils toErrorOut:error]);
         }
     }];                      
}

//获取反馈详情
void ios_base_getFeedbackDetailWithFeedbackID(int feedbackID,
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError){
     [[RXApiService sharedSDK] getFeedbackDetailWithFeedbackID:feedbackID complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
                NSLog(@"请求成功");
                onSuccess("ios_base_getFeedbackDetailWithFeedbackID", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }else{
                NSLog(@"请求失败");
                onError("ios_base_getFeedbackDetailWithFeedbackID", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
     }];                      
}

//领取反馈中的道具
void ios_base_feedbackGetpropWithFeedbackID(int feedbackID,
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError){
    [[RXApiService sharedSDK] feedbackGetpropWithFeedbackID:feedbackID complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
                NSLog(@"请求成功");
                onSuccess("ios_base_feedbackGetpropWithFeedbackID", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }else{
                NSLog(@"请求失败");
                onError("ios_base_feedbackGetpropWithFeedbackID", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];                           
}
    
//请求福利码
void ios_base_getPromoDisplayKeyWithAutoRefresh(bool autoRefresh,
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError){
    [[RXApiService sharedSDK] getPromoDisplayKeyWithAutoRefresh:autoRefresh complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
                NSLog(@"请求成功");
                onSuccess("ios_base_getPromoDisplayKeyWithAutoRefresh", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }else{
                NSLog(@"请求失败");
                onError("ios_base_getPromoDisplayKeyWithAutoRefresh", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}

//获取福利码
void ios_base_exchangePromoCDKEY(const char* cdkey,
                           RequestResponseCallBack onSuccess,
                           RequestErrorCallBack onError){
    NSString *cdkeyStr = [RuiXueIOSBridgeUtils toNSString:cdkey];
    [[RXApiService sharedSDK] exchangePromoCDKEY:cdkeyStr complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
                NSLog(@"请求成功");
                onSuccess("ios_base_exchangePromoCDKEY", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }else{
                NSLog(@"请求失败");
                onError("ios_base_exchangePromoCDKEY", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];
}     
                                                   
//获取设备码
void ios_base_getDeviceCode(RequestResponseCallBack onSuccess){
    NSString *deviceCode = [[RXApiService sharedSDK] getDeviceCode];
    onSuccess("ios_base_getDeviceCode", [RuiXueIOSBridgeUtils toStrOut:deviceCode]);
}                                        

//获取 distinctId
void ios_base_getDistinctId(RequestResponseCallBack onSuccess){
    NSString *distinctId = [[RXSDK sharedSDK] getDistinctId];
    onSuccess("ios_base_getDistinctId", [RuiXueIOSBridgeUtils toStrOut:distinctId]);
}

void ios_base_captchaVerifyUI(const char* appId,
                              RequestResponseCallBack onSuccess,
                              RequestErrorCallBack onError) {
    NSString *appIdStr = [RuiXueIOSBridgeUtils toNSString:appId];
    [[RXApiService sharedSDK] captchaVerifyUIWithAppid:appIdStr complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) { 
        if (!error) {
                NSLog(@"请求成功");
                onSuccess("ios_base_captchaVerifyUI", [RuiXueIOSBridgeUtils toJsonOut:response]);
        }else{
                NSLog(@"请求失败");
                onError("ios_base_captchaVerifyUI", [RuiXueIOSBridgeUtils toErrorOut:error]);
        }
    }];                     
}

// login_openid 是否失效，YES 失效，NO 有效
bool ios_base_loginOpenidExpireInvalid() {
    return [[RXApiService sharedSDK] loginOpenidExpireInvalid];
}

//设置自定义错误消息提示
void ios_base_configErrorMsg(const char* errorMsgDicStr){
    NSMutableDictionary *errorMsgDic = [RuiXueIOSBridgeUtils toNSDic:errorMsgDicStr];
    [[RXService sharedSDK] configErrorMsg:errorMsgDic];
}

//设置密码等级
void ios_base_setPasswordStrength(int type){
    [[RXService sharedSDK] setPasswordStrength:(RXPasswordStrength)type];
}

//设置密码正则
void ios_base_setPwdPattern(const char* pattern){
    NSString *patternStr = [RuiXueIOSBridgeUtils toNSString:pattern];
    [[RXService sharedSDK] setPwdPattern:patternStr];
}

//设置地区
void ios_base_setArea(const char* area){
    NSString *areaStr = [RuiXueIOSBridgeUtils toNSString:area];
    [[RXService sharedSDK] setArea:areaStr];
}