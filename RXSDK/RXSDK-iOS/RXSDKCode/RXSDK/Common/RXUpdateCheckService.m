//
//  RXUpdateCheckService.m
//  RXSDK
//
//  Created by 陈汉 on 2021/12/16.
//

#import "RXUpdateCheckService.h"
#import "RXCommonHeader.h"
#import "DeviceKey.h"
#import "RXLogService.h"
#import <objc/message.h>
#import "RXIAPService.h"

typedef void(^linkBlock)(NSString * _Nullable link);
typedef void(^GetProductInfoBlock)(NSString * _Nullable productInfo);

@interface RXUpdateCheckService ()

@property (nonatomic, copy) linkBlock linkBlock;
@property (nonatomic, copy) GetProductInfoBlock productInfoBlock;

@end

@implementation RXUpdateCheckService

static RXUpdateCheckService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXUpdateCheckService alloc] init];
    });
    return sharedSDK;
}

- (void)setRegionTag:(NSDictionary *)response
{
    @try {
        NSString *dataStr = response[@"data"];
        NSDictionary *dataDic = [RXCommonTool stringToDictionary:dataStr];
        NSArray *loginConfigArr = dataDic[@"login_config"];
        if (loginConfigArr.count == 1) {
            NSDictionary *loginConfig = loginConfigArr[0];
            NSString *regionTag = loginConfig[@"region_tag"];
            
            if ([NSString rx_isNullToString:regionTag].length > 0) {
                [RXUserUtility sharedManager].cpRegionTag = regionTag;
            }
        }
    } @catch (NSException *exception) {
        NSLog(@"%@", exception);
    } @finally {
        
    }
}

/**
 * 大厅更新检查（GET版本，不返回下载地址）
 * @param region 地区码  非必须
 * @param client_version 客户端大厅当前版本  非必须
 * @param type 脚本类型，默认lua，可选json，u3d等  非必须
 * @param json 输出文件后缀，默认lua，可选json  非必须
 */
- (void)checkUpdate_AppWithRegion:(NSString * _Nullable)region
                   client_version:(NSString * _Nullable)client_version
                             type:(NSString * _Nullable)type
                             json:(NSString * _Nullable)json
                         complete:(RequestComplete)complete

{
    __block NSString *urlStr = [NSString stringWithFormat:@"v1/vcapi/update/%@/%@/%@/%@", [RXUserUtility valueForKey:keyUserData_productId], [RXUserUtility valueForKey:keyUserData_channelId], client_version, [DeviceKey getDeviceIDInKeychain]];
    if (region && region.length > 0) {
        urlStr = [NSString stringWithFormat:@"%@/%ld", urlStr, [region integerValue]];
    }
    if (type && type.length > 0) {
        urlStr = [NSString stringWithFormat:@"%@?type=%@", urlStr, type];
        if (json && json.length > 0) {
            urlStr = [NSString stringWithFormat:@"%@&format=%@", urlStr, json];
        } else {
            urlStr = [NSString stringWithFormat:@"%@&format=json", urlStr];
        }
    } else {
        if (json && json.length > 0) {
            urlStr = [NSString stringWithFormat:@"%@?format=%@", urlStr, json];
        } else {
            urlStr = [NSString stringWithFormat:@"%@?format=json", urlStr];
        }
    }
    
    if ([NSString rx_isNullToString:[RXUserUtility sharedManager].iapProductId].length > 0) {
        [self getProductInfo];
        
        __block BOOL isBlock = NO;
        
        self.productInfoBlock = ^(NSString * _Nullable productInfo) {
            
            // 防止特殊情况同时回调多次
            if (isBlock) {
                return;
            }
            isBlock = YES;
            
            if ([NSString rx_isNullToString:productInfo].length > 0) {
                urlStr = [NSString stringWithFormat:@"%@&product_info=%@", urlStr, productInfo];
            }
            
            NSString *localCountry = [RXCommonTool getLocalArea];
            if ([NSString rx_isNullToString:localCountry].length > 0) {
                urlStr = [NSString stringWithFormat:@"%@&local_country=%@", urlStr, localCountry];
            }
            
            RequestMethod method = RequestMethod_Get;

            RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:urlStr andParams:nil requsetMethod:method];
            request.baseUrl = [RXConfig sharedManager].apiDomain;
            request.headParams = [RX_CommonNetworkExcuteManager headParams];
            
            // 事件上报
            NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
            [trackDic setValue:@"1" forKey:@"version_check_action"];
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_version_check_process distinctId:@"" properties:trackDic];
            
            [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
                NSLog(@"大厅更新检查成功:\n %@", responseObject);
                
                [trackDic setValue:@"2-2" forKey:@"version_check_action"];
                [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_version_check_process distinctId:@"" properties:trackDic];
                
                [[RXUpdateCheckService sharedSDK] saveLoginConfigWithResponseObject:responseObject];
                
                [[RXUpdateCheckService sharedSDK] setRegionTag:responseObject];
                
                if (complete) {
                    complete(responseObject, nil);
                }
            } failure:^(RX_CommonRequestError * _Nullable error) {
                NSLog(@"大厅更新检查失败:\n %@", error.error);
                
                [trackDic setValue:@"2-1" forKey:@"version_check_action"];
                NSDictionary *errRes = error.responesObject;
                [trackDic setValue:@([errRes[@"code"] integerValue]) forKey:@"err_code"];
                [trackDic setValue:[NSString stringWithFormat:@"%@", errRes[@"msg"]] forKey:@"err_msg"];
                [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_version_check_process distinctId:@"" properties:trackDic];
                
                if (complete) {
                    complete(nil, error);
                }
            }];
        };
    } else {
        RequestMethod method = RequestMethod_Get;

        RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:urlStr andParams:nil requsetMethod:method];
        request.baseUrl = [RXConfig sharedManager].apiDomain;
        request.headParams = [RX_CommonNetworkExcuteManager headParams];
        
        // 事件上报
        NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
        [trackDic setValue:@"1" forKey:@"version_check_action"];
        [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_version_check_process distinctId:@"" properties:trackDic];
        
        [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
            NSLog(@"大厅更新检查成功:\n %@", responseObject);
            
            [trackDic setValue:@"2-2" forKey:@"version_check_action"];
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_version_check_process distinctId:@"" properties:trackDic];
            
            [[RXUpdateCheckService sharedSDK] saveLoginConfigWithResponseObject:responseObject];
            
            [[RXUpdateCheckService sharedSDK] setRegionTag:responseObject];
            
            if (complete) {
                complete(responseObject, nil);
            }
        } failure:^(RX_CommonRequestError * _Nullable error) {
            NSLog(@"大厅更新检查失败:\n %@", error.error);
            
            [trackDic setValue:@"2-1" forKey:@"version_check_action"];
            NSDictionary *errRes = error.responesObject;
            [trackDic setValue:@([errRes[@"code"] integerValue]) forKey:@"err_code"];
            [trackDic setValue:[NSString stringWithFormat:@"%@", errRes[@"msg"]] forKey:@"err_msg"];
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_version_check_process distinctId:@"" properties:trackDic];
            
            if (complete) {
                complete(nil, error);
            }
        }];
    }
    
}

/**
 * 大厅更新检查 - 展示维护公告（GET版本，不返回下载地址）
 * @param region 地区码  非必须
 * @param client_version 客户端大厅当前版本  非必须
 * @param type 脚本类型，默认lua，可选json，u3d等  非必须
 * @param isShow 是否展示，默认不展示
 * @param json 输出文件后缀，默认lua，可选json  非必须
 * @param linkCallBack 点击链接时，由此返回对应链接
 */
- (void)checkUpdate_AppWithRegion:(NSString * _Nullable)region
                   client_version:(NSString * _Nullable)client_version
                             type:(NSString * _Nullable)type
                             json:(NSString * _Nullable)json
                           isShow:(BOOL)isShow
                     linkCallBack:(void(^)(NSString *link))linkCallBack
                         complete:(RequestComplete)complete{
    [self checkUpdate_AppWithRegion:region client_version:client_version type:type json:json complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (error == nil) {
            complete(response, nil);
        }else{
            complete(nil, error);
        }
        
        if ([type isEqualToString:@"lua"]){
            return;
        }
        
        if (!isShow) {
            return;
        }
        
        if (error != nil) {
            return;
        }
        
        if ([response[@"code"] integerValue] != 0) {
            return;
        }
        
        NSDictionary *tempDic = [NSDictionary dictionaryWithDictionary:response];
        NSString *jsonStr = tempDic[@"data"];
        NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:[jsonStr dataUsingEncoding:NSUTF8StringEncoding] options:0 error:nil];
        if ([dict[@"upgrade"] integerValue] != 2) {
            return;
        }
        
        // 公告 UI
        NSString *title = @"";
        if ([NSString rx_isNullToString:dict[@"maintain_title"]].length > 0){
            title = dict[@"maintain_title"];
        }
        NSString *content = dict[@"maintain"];
        
        self.linkBlock = ^(NSString * _Nullable link) {
            if (linkCallBack) {
                linkCallBack(link);
            }
        };
        
        if ([RXSubPackage sharedSDK].aRXUI) {
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:title forKey:@"title"];
            [notiDic setValue:content forKey:@"content"];
            [notiDic setValue:self.linkBlock forKey:@"callback"];
            [RXNotificationCenter postNoti:rxUserDefault_ui_gonggao object:nil userInfo:notiDic];
        } else if ([RXSubPackage sharedSDK].aRXOSUI) {
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:title forKey:@"title"];
            [notiDic setValue:content forKey:@"content"];
            [notiDic setValue:self.linkBlock forKey:@"callback"];
            [RXNotificationCenter postNoti:rxUserDefault_osui_gonggao object:nil userInfo:notiDic];
        }
    }];
    
}

/**
 * 大厅更新检查（POST版本，返回下载地址）
 * @param region 地区码  非必须
 * @param client_version 客户端大厅当前版本  非必须
 * @param games key客户端游戏id value版本  非必须
 * @param activities key客户端活动别名 value版本  非必须
 * @param type 脚本类型，默认lua，可选json，u3d等  非必须
 * @param json 输出文件后缀，默认lua，可选json  非必须
 */
- (void)checkUpdate_AppWithRegion:(NSString * _Nullable)region
                   client_version:(NSString * _Nullable)client_version
                            games:(NSDictionary * _Nullable)games
                       activities:(NSDictionary * _Nullable)activities
                             type:(NSString * _Nullable)type
                             json:(NSString * _Nullable)json
                         complete:(RequestComplete)complete
{
    __block NSString *urlStr = [NSString stringWithFormat:@"v1/vcapi/update/%@/%@/%@/%@", [RXUserUtility valueForKey:keyUserData_productId], [RXUserUtility valueForKey:keyUserData_channelId], client_version, [DeviceKey getDeviceIDInKeychain]];
    if (region && region.length > 0) {
        urlStr = [NSString stringWithFormat:@"%@/%ld", urlStr, [region integerValue]];
    }
    if (type && type.length > 0) {
        urlStr = [NSString stringWithFormat:@"%@?type=%@", urlStr, type];
        if (json && json.length > 0) {
            urlStr = [NSString stringWithFormat:@"%@&format=%@", urlStr, json];
        } else {
            urlStr = [NSString stringWithFormat:@"%@&format=json", urlStr];
        }
    } else {
        if (json && json.length > 0) {
            urlStr = [NSString stringWithFormat:@"%@?format=%@", urlStr, json];
        } else {
            urlStr = [NSString stringWithFormat:@"%@?format=json", urlStr];
        }
    }
    
    if ([NSString rx_isNullToString:[RXUserUtility sharedManager].iapProductId].length > 0) {
        [self getProductInfo];
        
        __block BOOL isBlock = NO;
        
        self.productInfoBlock = ^(NSString * _Nullable productInfo) {
            
            // 防止特殊情况同时回调多次
            if (isBlock) {
                return;
            }
            isBlock = YES;
            
            if ([NSString rx_isNullToString:productInfo].length > 0) {
                urlStr = [NSString stringWithFormat:@"%@&product_info=%@", urlStr, productInfo];
            }
            
            NSString *localCountry = [RXCommonTool getLocalArea];
            if ([NSString rx_isNullToString:localCountry].length > 0) {
                urlStr = [NSString stringWithFormat:@"%@&local_country=%@", urlStr, localCountry];
            }
            
            RequestMethod method = RequestMethod_Post;

            RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:urlStr andParams:nil requsetMethod:method];
            request.baseUrl = [RXConfig sharedManager].apiDomain;
            request.headParams = [RX_CommonNetworkExcuteManager headParams];
            
            // 事件上报
            NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
            [trackDic setValue:@"1" forKey:@"version_check_action"];
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_version_check_process distinctId:@"" properties:trackDic];
            
            [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
                NSLog(@"大厅更新检查成功:\n %@", responseObject);
                
                [trackDic setValue:@"2-2" forKey:@"version_check_action"];
                [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_version_check_process distinctId:@"" properties:trackDic];
                
                [[RXUpdateCheckService sharedSDK] saveLoginConfigWithResponseObject:responseObject];
                
                [[RXUpdateCheckService sharedSDK] setRegionTag:responseObject];
                
                if (complete) {
                    complete(responseObject, nil);
                }
            } failure:^(RX_CommonRequestError * _Nullable error) {
                NSLog(@"大厅更新检查失败:\n %@", error.error);
                
                [trackDic setValue:@"2-1" forKey:@"version_check_action"];
                NSDictionary *errRes = error.responesObject;
                [trackDic setValue:@([errRes[@"code"] integerValue]) forKey:@"err_code"];
                [trackDic setValue:[NSString stringWithFormat:@"%@", errRes[@"msg"]] forKey:@"err_msg"];
                [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_version_check_process distinctId:@"" properties:trackDic];
                
                if (complete) {
                    complete(nil, error);
                }
            }];
        };
    } else {
        RequestMethod method = RequestMethod_Post;

        RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:urlStr andParams:nil requsetMethod:method];
        request.baseUrl = [RXConfig sharedManager].apiDomain;
        request.headParams = [RX_CommonNetworkExcuteManager headParams];
        
        // 事件上报
        NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
        [trackDic setValue:@"1" forKey:@"version_check_action"];
        [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_version_check_process distinctId:@"" properties:trackDic];
        
        [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
            NSLog(@"大厅更新检查成功:\n %@", responseObject);
            
            [trackDic setValue:@"2-2" forKey:@"version_check_action"];
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_version_check_process distinctId:@"" properties:trackDic];
            
            [[RXUpdateCheckService sharedSDK] saveLoginConfigWithResponseObject:responseObject];
            
            [[RXUpdateCheckService sharedSDK] setRegionTag:responseObject];
            
            if (complete) {
                complete(responseObject, nil);
            }
        } failure:^(RX_CommonRequestError * _Nullable error) {
            NSLog(@"大厅更新检查失败:\n %@", error.error);
            
            [trackDic setValue:@"2-1" forKey:@"version_check_action"];
            NSDictionary *errRes = error.responesObject;
            [trackDic setValue:@([errRes[@"code"] integerValue]) forKey:@"err_code"];
            [trackDic setValue:[NSString stringWithFormat:@"%@", errRes[@"msg"]] forKey:@"err_msg"];
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_version_check_process distinctId:@"" properties:trackDic];
            
            if (complete) {
                complete(nil, error);
            }
        }];
    }

}

/**
* 大厅更新检查 - 展示维护公告（POST版本，返回下载地址）
* @param region 地区码  非必须
* @param client_version 客户端大厅当前版本  非必须
* @param games key客户端游戏id value版本  非必须
* @param activities key客户端活动别名 value版本  非必须
* @param type 脚本类型，默认lua，可选json，u3d等  非必须
* @param json 输出文件后缀，默认lua，可选json  非必须
* @param isShow 是否展示，默认不展示
* @param linkCallBack 点击链接时，由此返回对应链接
*/
 - (void)checkUpdate_AppWithRegion:(NSString * _Nullable)region
                    client_version:(NSString * _Nullable)client_version
                             games:(NSDictionary * _Nullable)games
                        activities:(NSDictionary * _Nullable)activities
                              type:(NSString * _Nullable)type
                              json:(NSString * _Nullable)json
                            isShow:(BOOL)isShow
                      linkCallBack:(void(^)(NSString *link))linkCallBack
                          complete:(RequestComplete)complete{
    [self checkUpdate_AppWithRegion:region client_version:client_version games:games activities:activities type:type json:json complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (error == nil) {
            complete(response, nil);
        }else{
            complete(nil, error);
        }
        
        if ([type isEqualToString:@"lua"]){
            return;
        }
        
        if (!isShow) {
            return;
        }
        
        if (error != nil) {
            return;
        }
        
        if ([response[@"code"] integerValue] != 0) {
            return;
        }
        
        NSDictionary *tempDic = [NSDictionary dictionaryWithDictionary:response];
        NSString *jsonStr = tempDic[@"data"];
        NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:[jsonStr dataUsingEncoding:NSUTF8StringEncoding] options:0 error:nil];
        if ([dict[@"upgrade"] integerValue] != 2) {
            return;
        }
        
        NSString *title = @"";
        if ([NSString rx_isNullToString:dict[@"maintain_title"]].length > 0){
            title = dict[@"maintain_title"];
        }
        NSString *content = dict[@"maintain"];
        
        self.linkBlock = ^(NSString * _Nullable link) {
            if (linkCallBack) {
                linkCallBack(link);
            }
        };
        
        if ([RXSubPackage sharedSDK].aRXUI) {
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:title forKey:@"title"];
            [notiDic setValue:content forKey:@"content"];
            [notiDic setValue:self.linkBlock forKey:@"callback"];
            [RXNotificationCenter postNoti:rxUserDefault_ui_gonggao object:nil userInfo:notiDic];
        } else if ([RXSubPackage sharedSDK].aRXOSUI) {
            NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
            [notiDic setValue:title forKey:@"title"];
            [notiDic setValue:content forKey:@"content"];
            [notiDic setValue:self.linkBlock forKey:@"callback"];
            [RXNotificationCenter postNoti:rxUserDefault_osui_gonggao object:nil userInfo:notiDic];
        }
    }];
        
}
     
/**
 * 活动更新检查
 * @param game_version 当前游戏版本  必须
 * @param game_check_version 指定游戏版本  非必须
 * @param short_name 活动短名  必须
 * @param type 脚本类型，默认lua，可选json，u3d等  非必须
 * @param json 输出文件后缀，默认lua，可选json  非必须
 */
- (void)checkUpdate_ActivityWithGame_version:(NSInteger)game_version
                          game_check_version:(NSString * _Nullable)game_check_version
                                  short_name:(NSString *)short_name
                                        type:(NSString * _Nullable)type
                                        json:(NSString * _Nullable)json
                                    complete:(RequestComplete)complete
{
    __block NSString *urlStr = [NSString stringWithFormat:@"v1/vcapi/update_activity/%@/%ld", short_name, game_version];
    if (game_check_version && game_check_version.length > 0) {
        urlStr = [NSString stringWithFormat:@"%@/%ld", urlStr, [game_check_version integerValue]];
    }
    if (type && type.length > 0) {
        urlStr = [NSString stringWithFormat:@"%@?type=%@", urlStr, type];
        if (json && json.length > 0) {
            urlStr = [NSString stringWithFormat:@"%@&format=%@", urlStr, json];
        } else {
            urlStr = [NSString stringWithFormat:@"%@&format=json", urlStr];
        }
    } else {
        if (json && json.length > 0) {
            urlStr = [NSString stringWithFormat:@"%@?format=%@", urlStr, json];
        } else {
            urlStr = [NSString stringWithFormat:@"%@?format=json", urlStr];
        }
    }
    
    if ([NSString rx_isNullToString:[RXUserUtility sharedManager].iapProductId].length > 0) {
        [self getProductInfo];
        
        __block BOOL isBlock = NO;
        
        self.productInfoBlock = ^(NSString * _Nullable productInfo) {
            
            // 防止特殊情况同时回调多次
            if (isBlock) {
                return;
            }
            isBlock = YES;
            
            if ([NSString rx_isNullToString:productInfo].length > 0) {
                urlStr = [NSString stringWithFormat:@"%@&product_info=%@", urlStr, productInfo];
            }
            
            NSString *localCountry = [RXCommonTool getLocalArea];
            if ([NSString rx_isNullToString:localCountry].length > 0) {
                urlStr = [NSString stringWithFormat:@"%@&local_country=%@", urlStr, localCountry];
            }
            
            RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:urlStr andParams:nil requsetMethod:RequestMethod_Get];
            request.baseUrl = [RXConfig sharedManager].apiDomain;
            request.headParams = [RX_CommonNetworkExcuteManager headParams];
            
            [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
                NSLog(@"活动更新检查成功:\n %@", responseObject);
                
                [[RXUpdateCheckService sharedSDK] saveLoginConfigWithResponseObject:responseObject];
                
                if (complete) {
                    complete(responseObject, nil);
                }
            } failure:^(RX_CommonRequestError * _Nullable error) {
                NSLog(@"活动更新检查失败:\n %@", error.error);
                if (complete) {
                    complete(nil, error);
                }
            }];
        };
    } else {
        RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:urlStr andParams:nil requsetMethod:RequestMethod_Get];
        request.baseUrl = [RXConfig sharedManager].apiDomain;
        request.headParams = [RX_CommonNetworkExcuteManager headParams];
        
        [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
            NSLog(@"活动更新检查成功:\n %@", responseObject);
            
            [[RXUpdateCheckService sharedSDK] saveLoginConfigWithResponseObject:responseObject];
            
            if (complete) {
                complete(responseObject, nil);
            }
        } failure:^(RX_CommonRequestError * _Nullable error) {
            NSLog(@"活动更新检查失败:\n %@", error.error);
            if (complete) {
                complete(nil, error);
            }
        }];
    }
    
}

/**
 * 游戏更新检查
 * @param game_id 游戏ID  必须
 * @param game_version 当前游戏版本  必须
 * @param game_check_version 指定游戏版本  非必须
 * @param type 脚本类型，默认lua，可选json，u3d等  非必须
 * @param json 输出文件后缀，默认lua，可选json  非必须
 */
- (void)checkUpdate_GameWithGame_id:(NSInteger)game_id
                       game_version:(NSInteger)game_version
                 game_check_version:(NSString * _Nullable)game_check_version
                               type:(NSString * _Nullable)type
                               json:(NSString * _Nullable)json
                           complete:(RequestComplete)complete
{
    __block NSString *urlStr = [NSString stringWithFormat:@"v1/vcapi/update_game/%ld/%ld", game_id, game_version];
    if (game_check_version && game_check_version.length > 0) {
        urlStr = [NSString stringWithFormat:@"%@/%ld", urlStr, [game_check_version integerValue]];
    }
    if (type && type.length > 0) {
        urlStr = [NSString stringWithFormat:@"%@?type=%@", urlStr, type];
        if (json && json.length > 0) {
            urlStr = [NSString stringWithFormat:@"%@&format=%@", urlStr, json];
        } else {
            urlStr = [NSString stringWithFormat:@"%@&format=json", urlStr];
        }
    } else {
        if (json && json.length > 0) {
            urlStr = [NSString stringWithFormat:@"%@?format=%@", urlStr, json];
        } else {
            urlStr = [NSString stringWithFormat:@"%@?format=json", urlStr];
        }
    }
    
    if ([NSString rx_isNullToString:[RXUserUtility sharedManager].iapProductId].length > 0) {
        [self getProductInfo];
        
        __block BOOL isBlock = NO;
        
        self.productInfoBlock = ^(NSString * _Nullable productInfo) {
            
            // 防止特殊情况同时回调多次
            if (isBlock) {
                return;
            }
            isBlock = YES;
            
            if ([NSString rx_isNullToString:productInfo].length > 0) {
                urlStr = [NSString stringWithFormat:@"%@&product_info=%@", urlStr, productInfo];
            }
            
            NSString *localCountry = [RXCommonTool getLocalArea];
            if ([NSString rx_isNullToString:localCountry].length > 0) {
                urlStr = [NSString stringWithFormat:@"%@&local_country=%@", urlStr, localCountry];
            }
            
            RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:urlStr andParams:nil requsetMethod:RequestMethod_Get];
            request.baseUrl = [RXConfig sharedManager].apiDomain;
            request.headParams = [RX_CommonNetworkExcuteManager headParams];
            
            [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
                NSLog(@"游戏更新检查成功:\n %@", responseObject);
                
                [[RXUpdateCheckService sharedSDK] saveLoginConfigWithResponseObject:responseObject];
                
                if (complete) {
                    complete(responseObject, nil);
                }
            } failure:^(RX_CommonRequestError * _Nullable error) {
                NSLog(@"游戏更新检查失败:\n %@", error.error);
                if (complete) {
                    complete(nil, error);
                }
            }];
        };
    } else {
        RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:urlStr andParams:nil requsetMethod:RequestMethod_Get];
        request.baseUrl = [RXConfig sharedManager].apiDomain;
        request.headParams = [RX_CommonNetworkExcuteManager headParams];
        
        [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
            NSLog(@"游戏更新检查成功:\n %@", responseObject);
            
            [[RXUpdateCheckService sharedSDK] saveLoginConfigWithResponseObject:responseObject];
            
            if (complete) {
                complete(responseObject, nil);
            }
        } failure:^(RX_CommonRequestError * _Nullable error) {
            NSLog(@"游戏更新检查失败:\n %@", error.error);
            if (complete) {
                complete(nil, error);
            }
        }];
    }
}

/**
 * 版本检查
 */
- (void)updateGameVersionWithInfo:(NSDictionary *)info
                         complete:(RequestComplete)complete
{
    __block NSString *urlStr = @"/v1/vcapi/update_module_version";
    
    if ([NSString rx_isNullToString:[RXUserUtility sharedManager].iapProductId].length > 0) {
        [self getProductInfo];
        
        __block BOOL isBlock = NO;
        
        self.productInfoBlock = ^(NSString * _Nullable productInfo) {
            
            // 防止特殊情况同时回调多次
            if (isBlock) {
                return;
            }
            isBlock = YES;
            
            if ([NSString rx_isNullToString:productInfo].length > 0) {
                urlStr = [NSString stringWithFormat:@"%@&product_info=%@", urlStr, productInfo];
            }
            
            NSString *localCountry = [RXCommonTool getLocalArea];
            if ([NSString rx_isNullToString:localCountry].length > 0) {
                urlStr = [NSString stringWithFormat:@"%@&local_country=%@", urlStr, localCountry];
            }
            
            RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:urlStr andParams:info requsetMethod:RequestMethod_Post];
            request.baseUrl = [RXConfig sharedManager].apiDomain;
            request.headParams = [RX_CommonNetworkExcuteManager headParams];
            
            // 事件上报
            NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
            [trackDic setValue:@"1" forKey:@"version_check_action"];
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_version_check_process distinctId:@"" properties:trackDic];
            
            [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
                NSLog(@"版本检查成功:\n %@", responseObject);
                
                [trackDic setValue:@"2-2" forKey:@"version_check_action"];
                [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_version_check_process distinctId:@"" properties:trackDic];
                
                [[RXUpdateCheckService sharedSDK] saveLoginConfigWithResponseObject:responseObject];
                
                if (complete) {
                    complete(responseObject, nil);
                }
            } failure:^(RX_CommonRequestError * _Nullable error) {
                NSLog(@"版本检查检查失败:\n %@", error.error);
                
                [trackDic setValue:@"2-1" forKey:@"version_check_action"];
                NSDictionary *errRes = error.responesObject;
                [trackDic setValue:@([errRes[@"code"] integerValue]) forKey:@"err_code"];
                [trackDic setValue:[NSString stringWithFormat:@"%@", errRes[@"msg"]] forKey:@"err_msg"];
                [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_version_check_process distinctId:@"" properties:trackDic];
                
                if (complete) {
                    complete(nil, error);
                }
            }];
        };
    } else {
        RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:urlStr andParams:info requsetMethod:RequestMethod_Post];
        request.baseUrl = [RXConfig sharedManager].apiDomain;
        request.headParams = [RX_CommonNetworkExcuteManager headParams];
        
        // 事件上报
        NSMutableDictionary *trackDic = [NSMutableDictionary dictionary];
        [trackDic setValue:@"1" forKey:@"version_check_action"];
        [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_version_check_process distinctId:@"" properties:trackDic];
        
        [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
            NSLog(@"版本检查成功:\n %@", responseObject);
            
            [trackDic setValue:@"2-2" forKey:@"version_check_action"];
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_version_check_process distinctId:@"" properties:trackDic];
            
            [[RXUpdateCheckService sharedSDK] saveLoginConfigWithResponseObject:responseObject];
            
            if (complete) {
                complete(responseObject, nil);
            }
        } failure:^(RX_CommonRequestError * _Nullable error) {
            NSLog(@"版本检查检查失败:\n %@", error.error);
            
            [trackDic setValue:@"2-1" forKey:@"version_check_action"];
            NSDictionary *errRes = error.responesObject;
            [trackDic setValue:@([errRes[@"code"] integerValue]) forKey:@"err_code"];
            [trackDic setValue:[NSString stringWithFormat:@"%@", errRes[@"msg"]] forKey:@"err_msg"];
            [[RXLogService sharedSDK] addLogSingleFirstLoginWithEvent:rxlog_version_check_process distinctId:@"" properties:trackDic];
            
            if (complete) {
                complete(nil, error);
            }
        }];
    }
}

// 保存登录配置信息
- (void)saveLoginConfigWithResponseObject:(NSDictionary *)responseObject
{
//    if ([responseObject isKindOfClass:[NSDictionary class]]) {
//        if ([responseObject[@"data"] isKindOfClass:[NSString class]]) {
//            NSDictionary *dataDic = [RXCommonTool stringToDictionary:responseObject[@"data"]];
//            if ([dataDic isKindOfClass:[NSDictionary class]] && dataDic.allKeys.count > 0) {
//                [RXUserUtility sharedManager].cpLoginConfig = dataDic[@"login_config"];
//            }
//        } else if ([responseObject[@"data"] isKindOfClass:[NSDictionary class]]) {
//            NSDictionary *dataDic = responseObject[@"data"];
//            if ([dataDic isKindOfClass:[NSDictionary class]] && dataDic.allKeys.count > 0) {
//                [RXUserUtility sharedManager].cpLoginConfig = dataDic[@"login_config"];
//            }
//        }
//    }
}

// 获取商品信息
- (NSString *)getProductInfo
{
    __block NSString *productInfo = @"";
    if ([NSString rx_isNullToString:[RXUserUtility sharedManager].iapProductId].length > 0) {
        [[RXIAPService sharedSDK] getLocaleIdentifierWithProductId:[RXUserUtility sharedManager].iapProductId timeout:[RXUserUtility sharedManager].iapTimeout complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            if (!error) {
                productInfo = response[@"data"][@"product_info"];
                if (self.productInfoBlock) {
                    self.productInfoBlock(productInfo);
                }
            } else {
                if (self.productInfoBlock) {
                    self.productInfoBlock(@"");
                }
            }
        }];
    } else {
        if (self.productInfoBlock) {
            self.productInfoBlock(@"");
        }
    }
    
    return productInfo;
}

@end
