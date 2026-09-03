//
//  RXShareService.m
//  RXSDK
//
//  Created by 陈汉 on 2021/12/6.
//

#import "RXShareService.h"
#import "RXCommonHeader.h"
#import "CHDownImage.h"
#import "RXShareModel.h"
#import "RXConfig.h"
#import "DeviceKey.h"
#import "RXShareFetchModel.h"
#import "NSObject+RXAddition.h"
#import <objc/message.h>
#import "RXLogManager.h"

typedef void(^CommonShareBlock)(NSDictionary *response);

@interface RXShareService ()

@property (nonatomic, strong) NSString *material;
@property (nonatomic, assign) NSInteger materialid;
@property (nonatomic, strong) NSString *custom;
@property (nonatomic, strong) NSString *type;
@property (nonatomic, strong) NSString *adPlatform;
@property (nonatomic, strong) NSString *region;
@property (nonatomic, strong) NSString *platform;
@property (nonatomic, strong) NSMutableDictionary *shareInfo;
@property (nonatomic, copy) ShareCallBack shareCallBack;
@property (nonatomic, copy) NewShareCallBack newShareCallBack;
@property (nonatomic, copy) NewShareCallBack localShareCallBack;
@property (nonatomic, copy) CommonShareBlock commonShareBlock;
@property (nonatomic, assign) BOOL autoReport;
@property (nonatomic, strong) NSDictionary *gameInfo;

//上报标识，接入UWA时使用，-1为重置，不上报；1 shareReportWithDistinctId: 2shareSchedulingReportWithFunc:
@property (nonatomic, assign) NSInteger reportFunctionFlag;
//上报数据，接入UWA时使用
@property (nonatomic, strong) NSMutableDictionary *reportFunctionDic;
//上报数据，接入UWA时使用的block
@property (nonatomic, copy) RequestComplete reportComplete;
@property (nonatomic, copy) NSString *reportFunc;//上报数据，接入UWA时使用
@property (nonatomic, copy) NSString *reportPlatform;//上报数据，接入UWA时使用
@property (nonatomic, copy) NSString *reportRegion;//上报数据，接入UWA时使用

@end

@implementation RXShareService

static RXShareService *sharedSDK = nil;
static dispatch_once_t onceToken;

+ (instancetype)sharedSDK
{
    dispatch_once(&onceToken, ^{
        sharedSDK = [[RXShareService alloc] init];
    });
    return sharedSDK;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(reportWithUwaInfo:) name:@"reportWithUwaInfo" object:nil];
        self.shareInfo = [NSMutableDictionary dictionary];
    }
    return self;
}

/**
 * 拼接 transmits
 */
- (NSString *)fetchTransmits:(NSString *)transmits
                         ext:(NSDictionary *)ext
{
    NSString *trans = transmits;
    if ([NSString rx_isNullToString:trans].length > 0) {
        NSString *transDecode = [RXCommonTool urlDecodeString:trans];
        if (ext && ext.allKeys.count > 0) {
            for (int i = 0; i < ext.allKeys.count; i++) {
                transDecode = [NSString stringWithFormat:@"%@&%@=%@", transDecode, ext.allKeys[i], ext.allValues[i]];
            }
        }
        trans = [RXCommonTool urlEncodeString:transDecode];
    } else {
        if (ext && ext.allKeys.count > 0) {
            for (int i = 0; i < ext.allKeys.count; i++) {
                if (i == 0) {
                    trans = [NSString stringWithFormat:@"%@=%@", ext.allKeys[i], ext.allValues[i]];
                } else {
                    trans = [NSString stringWithFormat:@"%@&%@=%@", trans, ext.allKeys[i], ext.allValues[i]];
                }
            }
            trans = [RXCommonTool urlEncodeString:trans];
        }
    }
    
    return trans;
}

/**
 * 分享调度初始化
 * @note 调用一次即可
 * @param funcs 埋点数组，传空获取所有埋点调度
 */
- (void)shareSchedulingInitWithFuncs:(NSArray *)funcs
                            complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_productId] forKey:@"product_id"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_channelId] forKey:@"channel_id"];
    [dic setValue:funcs forKey:@"func"];
    [dic setValue:@"app" forKey:@"type"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_openId] forKey:@"open_id"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/operationapi/scheduling/init" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"分享调度初始化成功:\n %@", responseObject);
        
        NSMutableDictionary *resDic = [NSMutableDictionary dictionaryWithDictionary:(NSMutableDictionary *)responseObject];
        
        [RXUserUtility sharedManager].shareSchedulList = [NSMutableDictionary dictionaryWithDictionary:resDic[@"data"]];
        
        // 清空缓存的分享数据
        [RXUserUtility setValue:[NSMutableDictionary dictionary] ForKey:keyUserData_shareData];
        
        if (complete) {
            complete(resDic, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"分享调度初始化失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 获取埋点调度
 * @param funcs 埋点数组，传空获取所有埋点调度
 */
- (void)getShareSchedulingWithFuncs:(NSArray *)funcs
                           complete:(RequestComplete)complete
{
    NSMutableDictionary *shareSchedulList = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility sharedManager].shareSchedulList];
    NSMutableDictionary *searchArr = [NSMutableDictionary dictionary];
    
    if (funcs && funcs.count > 0) {
        for (int i = 0; i < shareSchedulList.allKeys.count; i++) {
            NSString *func = shareSchedulList.allKeys[i];
            
            for (int j = 0; j < funcs.count; j++) {
                if ([func isEqualToString:funcs[i]]) {
                    [searchArr setValue:shareSchedulList.allValues[i] forKey:shareSchedulList.allKeys[i]];
                }
            }
        }
    } else {
        searchArr = shareSchedulList;
    }

    
    if (complete) {
        NSDictionary *response = @{@"code" : @(0),
                                   @"data" : searchArr
        };
        complete(response, nil);
    }
}

/**
 * 获取分享信息
 * @param func 埋点标识  必须
 * @param platform 分享平台 wechat
 * @param region 地区码 非必须
 * @param transmits 透传参数，原样返回， 请使用key=value形式，并对值使用urlencode，返回时会原样返回  非必须
 * @param ext 扩展字段，拼接url用  非必须
 */
- (void)getShareInfoWithFunc:(NSString *)func
                    platform:(NSString *)platform
                      region:(NSString *)region
                   transmits:(NSString * _Nullable)transmits
                         ext:(NSDictionary * _Nullable)ext
                    complete:(RequestComplete)complete
{
    self.region = region;
    self.platform = platform;
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_productId] forKey:@"product_id"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_channelId] forKey:@"channel_id"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_subchannelid] forKey:@"sub_channel_id"];
    [dic setValue:func forKey:@"func"];
    [dic setValue:region forKey:@"region"];
    [dic setValue:@"app" forKey:@"type"];
    [dic setValue:platform forKey:@"platform"];
    
    NSString *trans = [self fetchTransmits:transmits ext:ext];
    
    [dic setValue:trans forKey:@"transmits"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_openId] forKey:@"open_id"];
    if ([NSString rx_isNullToString:ext[@"openid"]].length > 0) {
        [dic setValue:ext[@"openid"] forKey:@"open_id"];
    }
    
    if (ext[@"game_info"] && [ext[@"game_info"] isKindOfClass:[NSDictionary class]]) {
        [dic setValue:ext[@"game_info"] forKey:@"game_info"];
        self.gameInfo = ext[@"game_info"];
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/operationapi/share/data" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"获取分享信息成功:\n %@", responseObject);
        
        NSMutableDictionary *resDic = [NSMutableDictionary dictionaryWithDictionary:(NSMutableDictionary *)responseObject];
        
        self.shareInfo = resDic;
        
        if (complete) {
            complete(resDic, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"获取分享信息失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 获取分享信息 New
 * @param func 埋点标识  必须
 * @param platform 分享平台 wechat
 * @param region 地区码 非必须
 * @param transmits 透传参数，原样返回， 请使用key=value形式，并对值使用urlencode，返回时会原样返回  非必须
 * @param ext 扩展字段，拼接url用  非必须
 */
- (void)getShareInfoWithFunc:(NSString *)func
                    platform:(NSString *)platform
                      region:(NSString *)region
                   transmits:(NSString * _Nullable)transmits
                         ext:(NSDictionary * _Nullable)ext
                   readCache:(BOOL)readCache
                    complete:(RequestComplete)complete
{
//    NSString *cacheKey = [NSString stringWithFormat:@"%@_%@_%@_%@", func, platform, region, [RXUserUtility valueForKey:keyUserData_openId]];
 
//    if (readCache) {
//        NSMutableDictionary *allCacheDic = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_shareData]];
//        NSMutableDictionary *cacheShareData = [NSMutableDictionary dictionaryWithDictionary:allCacheDic[cacheKey]];
        
//        if (cacheShareData && cacheShareData.allKeys.count > 0) {
            
//            NSString *urlStr = cacheShareData[@"data"][@"content"][@"url"];
//            if (ext && ext.allKeys.count > 0) {
//                for (int i = 0; i < ext.allKeys.count; i++) {
//                    urlStr = [NSString stringWithFormat:@"%@&%@=%@", urlStr, ext.allKeys[i], ext.allValues[i]];
//                }
//            }
//            
//            NSString *apiStr = @"";
//            NSArray *apiComponents = [[RXConfig sharedManager].apiDomain componentsSeparatedByString:@"//"];
//            if (apiComponents.count > 0) {
//                apiStr = apiComponents[1];
//                NSString *lastApiStr = [apiStr substringFromIndex:apiStr.length - 1];
//                if ([lastApiStr isEqualToString:@"/"]) {
//                    apiStr = [apiStr substringToIndex:apiStr.length - 1];
//                }
//            }
//            urlStr = [NSString stringWithFormat:@"%@&api=%@", urlStr, apiStr];
//            
//            NSMutableDictionary *dataDic = [NSMutableDictionary dictionaryWithDictionary:cacheShareData[@"data"]];
//            NSMutableDictionary *contentDic = [NSMutableDictionary dictionaryWithDictionary:dataDic[@"content"]];
//            
//            [contentDic setValue:urlStr forKey:@"url"];
//            [dataDic setValue:contentDic forKey:@"content"];
//            [cacheShareData setValue:dataDic forKey:@"data"];
                                                                                                                
//            [allCacheDic setValue:cacheShareData forKey:cacheKey];
//            [RXUserUtility setValue:allCacheDic ForKey:keyUserData_shareData];
            
//            if (complete) {
//                complete(cacheShareData, nil);
//            }
//            return;
//        }
//    }
    
    self.region = region;
    self.platform = platform;
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_productId] forKey:@"product_id"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_channelId] forKey:@"channel_id"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_subchannelid] forKey:@"sub_channel_id"];
    [dic setValue:func forKey:@"func"];
    [dic setValue:region forKey:@"region"];
    [dic setValue:@"app" forKey:@"type"];
    [dic setValue:platform forKey:@"platform"];
        
    NSString *trans = [self fetchTransmits:transmits ext:ext];
    [dic setValue:trans forKey:@"transmits"];
    
    [dic setValue:[RXUserUtility valueForKey:keyUserData_openId] forKey:@"open_id"];
    if ([NSString rx_isNullToString:ext[@"openid"]].length > 0) {
        [dic setValue:ext[@"openid"] forKey:@"open_id"];
    }
    
    if (ext[@"game_info"] && [ext[@"game_info"] isKindOfClass:[NSDictionary class]]) {
        [dic setValue:ext[@"game_info"] forKey:@"game_info"];
        self.gameInfo = ext[@"game_info"];
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/operationapi/share/data" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"获取分享信息成功:\n %@", responseObject);
        
        NSMutableDictionary *resDic = [NSMutableDictionary dictionaryWithDictionary:(NSMutableDictionary *)responseObject];
        
        self.shareInfo = resDic;
        
//        NSMutableDictionary *cacheDic = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_shareData]];
//        [cacheDic setValue:resDic forKey:cacheKey];
//        [RXUserUtility setValue:cacheDic ForKey:keyUserData_shareData];
        
        if (complete) {
            complete(resDic, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"获取分享信息失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 获取分享信息
 * @param config 分享配置
 */
- (void)getShareInfoWithConfig:(RXShareConfig *)config
                      complete:(RequestComplete)complete
{
    NSString *func = config.func;
    NSString *platform = config.platform;
    NSString *region = config.region;
    NSString *transmits = config.transmits;
    BOOL readCache = config.readCache;
    BOOL useShortUrl = config.useShortUrl;
    
    NSMutableDictionary *ext = [NSMutableDictionary dictionaryWithDictionary:config.ext];
    if ([NSString rx_isNullToString:config.iOSScheme].length > 0) {
        [ext setValue:config.iOSScheme forKey:@"protocol_ios"];
    }
    if ([NSString rx_isNullToString:config.androidScheme].length > 0) {
        [ext setValue:config.androidScheme forKey:@"protocol_android"];
    }
    if ([NSString rx_isNullToString:config.useScheme].length > 0) {
        [ext setValue:config.useScheme forKey:@"use_scheme"];
    }
    
//    NSString *cacheKey = [NSString stringWithFormat:@"%@_%@_%@_%@", func, platform, region, [RXUserUtility valueForKey:keyUserData_openId]];
 
//    if (readCache) {
//        NSMutableDictionary *allCacheDic = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_shareData]];
//        NSMutableDictionary *cacheShareData = [NSMutableDictionary dictionaryWithDictionary:allCacheDic[cacheKey]];
//        
//        if (cacheShareData && cacheShareData.allKeys.count > 0) {
//            
//            __block NSString *urlStr = cacheShareData[@"data"][@"content"][@"url"];
//            if (ext && ext.allKeys.count > 0) {
//                for (int i = 0; i < ext.allKeys.count; i++) {
//                    urlStr = [NSString stringWithFormat:@"%@&%@=%@", urlStr, ext.allKeys[i], ext.allValues[i]];
//                }
//            }
//            
//            NSString *apiStr = [RXConfig sharedManager].apiDomain;
//            apiStr = [apiStr stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]];
//            urlStr = [NSString stringWithFormat:@"%@&api=%@", urlStr, apiStr];
//            
//            NSMutableDictionary *dataDic = [NSMutableDictionary dictionaryWithDictionary:cacheShareData[@"data"]];
//            NSMutableDictionary *contentDic = [NSMutableDictionary dictionaryWithDictionary:dataDic[@"content"]];
//            
//            if ([[urlStr substringToIndex:4] containsString:@"http"] && useShortUrl) {
//                // 先获取短链接
//                [self getShortUrl:urlStr title:contentDic[@"title"] content:contentDic[@"content"] image:contentDic[@"image"] ext:config.ext complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
//                    
//                    if (!error) {
//                        NSString *shortStr = response[@"data"][@"short_url"];
//                        if ([NSString rx_isNullToString:shortStr].length > 0) {
//                            urlStr = shortStr;
//                        }
//                    }
//                    
//                    [contentDic setValue:urlStr forKey:@"url"];
//                    [dataDic setValue:contentDic forKey:@"content"];
//                    [cacheShareData setValue:dataDic forKey:@"data"];
//                    
//                    [allCacheDic setValue:cacheShareData forKey:cacheKey];
//                    [RXUserUtility setValue:allCacheDic ForKey:keyUserData_shareData];
//                    
//                    if (complete) {
//                        complete(cacheShareData, nil);
//                    }
//                }];
//            } else {
//                [contentDic setValue:urlStr forKey:@"url"];
//                [dataDic setValue:contentDic forKey:@"content"];
//                [cacheShareData setValue:dataDic forKey:@"data"];
//                
//                [allCacheDic setValue:cacheShareData forKey:cacheKey];
//                [RXUserUtility setValue:allCacheDic ForKey:keyUserData_shareData];
//                
//                if (complete) {
//                    complete(cacheShareData, nil);
//                }
//            }
//            
//            
//            return;
//        }
//    }
    
    
    self.region = region;
    self.platform = platform;
    
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_productId] forKey:@"product_id"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_channelId] forKey:@"channel_id"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_subchannelid] forKey:@"sub_channel_id"];
    [dic setValue:func forKey:@"func"];
    [dic setValue:region forKey:@"region"];
    [dic setValue:@"app" forKey:@"type"];
    [dic setValue:platform forKey:@"platform"];
    
    NSString *trans = [self fetchTransmits:transmits ext:ext];
    [dic setValue:trans forKey:@"transmits"];
    
    [dic setValue:[RXUserUtility valueForKey:keyUserData_openId] forKey:@"open_id"];
    
    if ([NSString rx_isNullToString:ext[@"openid"]].length > 0) {
        [dic setValue:ext[@"openid"] forKey:@"open_id"];
    }
    if (config.game_info) {
        [dic setValue:config.game_info forKey:@"game_info"];
    }
    [dic setValue:@(config.show_content_in_circle) forKey:@"show_content_in_circle"];
    
    if ([config.setCustomExt isKindOfClass:[NSDictionary class]] && config.setCustomExt.allKeys.count > 0) {
        [dic setValue:config.setCustomExt forKey:@"custom_ext"];
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/operationapi/share/data" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"获取分享信息成功:\n %@", responseObject);
        
        NSMutableDictionary *resDic = [NSMutableDictionary dictionaryWithDictionary:(NSMutableDictionary *)responseObject];
        
        __block NSString *urlStr = resDic[@"data"][@"content"][@"url"];
        
        NSMutableDictionary *dataDic = [NSMutableDictionary dictionaryWithDictionary:resDic[@"data"]];
        NSMutableDictionary *contentDic = [NSMutableDictionary dictionaryWithDictionary:dataDic[@"content"]];
        
        if ([[urlStr substringToIndex:4] containsString:@"http"] && useShortUrl) {
            // 先获取短链接
            [self getShortUrl:urlStr title:contentDic[@"title"] content:contentDic[@"content"] image:contentDic[@"image"] ext:config.ext complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                
                if (!error) {
                    NSString *shortStr = response[@"data"][@"short_url"];
                    if ([NSString rx_isNullToString:shortStr].length > 0) {
                        urlStr = shortStr;
                    }
                }
                
                [contentDic setValue:urlStr forKey:@"url"];
                [dataDic setValue:contentDic forKey:@"content"];
                [resDic setValue:dataDic forKey:@"data"];
                
                self.shareInfo = resDic;
                
                if (complete) {
                    complete(resDic, nil);
                }
            }];
        } else {
            [contentDic setValue:urlStr forKey:@"url"];
            [dataDic setValue:contentDic forKey:@"content"];
            [resDic setValue:dataDic forKey:@"data"];
            
            self.shareInfo = resDic;
            
            if (complete) {
                complete(resDic, nil);
            }
        }
        
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"获取分享信息失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 系统分享（直接调用，不需要获取分享信息）
 * @param func 埋点标识  必须
 * @param platform 分享平台 wechat
 * @param region 地区码  非必须
 * @param transmits 透传参数，原样返回， 请使用key=value形式，并对值使用urlencode，返回时会原样返回  非必须
 * @param ext 扩展字段，拼接url用  非必须
 */
- (void)SystemShareWithFunc:(NSString *)func
                   platform:(NSString *)platform
                     region:(NSString *)region
                  transmits:(NSString * _Nullable)transmits
                        ext:(NSDictionary * _Nullable)ext
                   complete:(ShareCallBack)complete
{
    if (ext[@"autoReport"]) {
        self.autoReport = [ext[@"autoReport"] boolValue];
    }
    
    [[RXShareService sharedSDK] getShareInfoWithFunc:func platform:platform region:region transmits:transmits ext:ext complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        if (!error) {
            RXShareModel *shareModel = [RXShareModel rx_modelWithDictionary:response[@"data"]];
            RXShareContent *shareContent = shareModel.content;
            
            __block NSArray *activityItems = [NSArray array];
            if ([shareContent.material_type isEqualToString:@"text"]) { // 文本
                NSString *textToShare = shareContent.title;
                if (!textToShare) {
                    textToShare = @"";
                }
                activityItems = @[textToShare];
                [self systemShareActionWithItems:activityItems complete:^(BOOL success) {
                    if (self.autoReport) {
                        [self shareReportWithDistinctId:@"" properties:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                            NSLog(@"分享上报成功");
                        }];
                    }
                    if (complete) {
                        complete(success);
                    }
                }];
            } else if ([shareContent.material_type isEqualToString:@"image"] || [shareContent.material_type isEqualToString:@"langing"] || [shareContent.material_type isEqualToString:@"landing"]) { // 单图
                if ([shareContent.image containsString:@"http"]) {
                    
                    [self downImage:shareContent.image complete:^(NSData *imgData) {
                        // 不能大于25m，防止误差压缩到23m
                        NSData *imageData = [CHDownImage dataScaleToBytes:23 * 1024 * 1024 withImageData:imgData];
                        if (shareContent.url && shareContent.url.length > 0) {
                            NSString *shareUrl = shareContent.url;
                            UIImage *qrCodeImg = [UIImage rxQRCodeForString:shareUrl size:CGSizeMake(shareContent.width, shareContent.height) fillColor:[UIColor blackColor] iconImage:nil borderSize:[ext[@"borderSize"] floatValue]];
                            UIImage *bgView = [UIImage imageWithData:imageData];
                            CGFloat fixelW = CGImageGetWidth(bgView.CGImage);
                            CGFloat fixelH = CGImageGetHeight(bgView.CGImage);
                            UIImageView *shareImgView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, fixelW, fixelH)];
                            shareImgView.image = bgView;
                            UIImageView *qrCodeImgView = [[UIImageView alloc] initWithFrame:CGRectMake(shareContent.x, shareContent.y, shareContent.width, shareContent.height)];
                            qrCodeImgView.image = qrCodeImg;
                            [shareImgView addSubview:qrCodeImgView];
                            
                            UIImage *shareImg = [UIImage makeImageWithView:shareImgView withSize:shareImgView.frame.size];
                            NSData *shareImgData = UIImagePNGRepresentation(shareImg);
                            imageData = [CHDownImage dataScaleToBytes:3 * 1024 * 1024 withImageData:shareImgData];
                        }
                        UIImage *fetchImage = [UIImage imageWithData:imageData];
                        if (fetchImage) {
                            activityItems = @[fetchImage];
                        }
                        [self systemShareActionWithItems:activityItems complete:^(BOOL success) {
                            if (self.autoReport) {
                                [self shareReportWithDistinctId:@"" properties:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                                    NSLog(@"分享上报成功");
                                }];
                            }
                            if (complete) {
                                complete(success);
                            }
                        }];
                    }];
                }
            } else if ([shareContent.material_type isEqualToString:@"link"]) { // 链接
                if (shareContent.image) {
                    [self downImage:shareContent.image complete:^(NSData *imgData) {
                        // 缩略图不能大于32k，防止误差压缩到30k
                        NSData *imageData = [CHDownImage dataScaleToBytes:30 * 1024 withImageData:imgData];

                        NSString *shareUrl = shareContent.url;
                        NSURL *urlToShare = [NSURL URLWithString:shareUrl];
                        
                        activityItems = @[[UIImage imageWithData:imageData], urlToShare];
                        [self systemShareActionWithItems:activityItems complete:complete];
                    }];
                } else {
                    NSString *shareUrl = shareContent.url;

                    NSURL *urlToShare = [NSURL URLWithString:shareUrl];
                    
                    activityItems = @[urlToShare];
                    [self systemShareActionWithItems:activityItems complete:^(BOOL success) {
                        if (self.autoReport) {
                            [self shareReportWithDistinctId:@"" properties:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
                                NSLog(@"分享上报成功");
                            }];
                        }
                        if (complete) {
                            complete(success);
                        }
                    }];
                }
            }
        } else {
            if (complete) {
                complete(NO);
            }
        }
    }];
}

/**
 * 系统分享
 * @param shareInfo 获取分享信息返回的内容  必须
 */
- (void)SystemShareWithShareInfo:(NSDictionary *)shareInfo
                        complete:(ShareCallBack)complete
{
    RXShareFetchModel *shareContent = [RXShareFetchModel rx_modelWithDictionary:shareInfo];
    
    __block NSArray *activityItems = [NSArray array];
    if ([shareContent.material_type isEqualToString:@"text"]) { // 文本
        NSString *textToShare = shareContent.title;
        if (!textToShare) {
            textToShare = @"";
        }
        activityItems = @[textToShare];
        [self systemShareActionWithItems:activityItems complete:complete];
    } else if ([shareContent.material_type isEqualToString:@"image"] || [shareContent.material_type isEqualToString:@"langing"] || [shareContent.material_type isEqualToString:@"landing"]) { // 单图
        if ([shareContent.image isKindOfClass:[NSString class]] && [[shareContent.image substringToIndex:4] containsString:@"http"]) {
            [self downImage:shareContent.image complete:^(NSData *imgData) {
                // 不能大于25m，防止误差压缩到23m
                NSData *imageData = [CHDownImage dataScaleToBytes:23 * 1024 * 1024 withImageData:imgData];
                if (shareContent.url && shareContent.url.length > 0) {
                    NSString *shareUrl = shareContent.url;
                    UIImage *qrCodeImg = [UIImage rxQRCodeForString:shareUrl size:CGSizeMake(shareContent.width, shareContent.height) fillColor:[UIColor blackColor] iconImage:nil borderSize:[shareInfo[@"borderSize"] floatValue]];
                    UIImage *bgView = [UIImage imageWithData:imageData];
                    CGFloat fixelW = CGImageGetWidth(bgView.CGImage);
                    CGFloat fixelH = CGImageGetHeight(bgView.CGImage);
                    UIImageView *shareImgView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, fixelW, fixelH)];
                    shareImgView.image = bgView;
                    UIImageView *qrCodeImgView = [[UIImageView alloc] initWithFrame:CGRectMake(shareContent.x, shareContent.y, shareContent.width, shareContent.height)];
                    qrCodeImgView.image = qrCodeImg;
                    [shareImgView addSubview:qrCodeImgView];
                    
                    UIImage *shareImg = [UIImage makeImageWithView:shareImgView withSize:shareImgView.frame.size];
                    NSData *shareImgData = UIImagePNGRepresentation(shareImg);
                    imageData = [CHDownImage dataScaleToBytes:23 * 1024 * 1024 withImageData:shareImgData];
                }
                UIImage *fetchImage = [UIImage imageWithData:imageData];
                if (fetchImage) {
                    activityItems = @[fetchImage];
                }
                [self systemShareActionWithItems:activityItems complete:complete];
            }];
        } else {
            UIImage *shareImage;
            if ([shareContent.image isKindOfClass:[UIImage class]]) {
                shareImage = shareContent.image;
            } else if ([shareContent.image isKindOfClass:[NSData class]]) {
                shareImage = [UIImage imageWithData:shareContent.image];
            } else if ([shareContent.image isKindOfClass:[NSString class]]) {
                NSData *imageData = [NSData dataWithContentsOfFile:shareContent.image];
                shareImage = [UIImage imageWithData:imageData];
            }
            
            // 不能大于25m，防止误差压缩到23m
            NSData *imageData = [CHDownImage dataScaleToBytes:23 * 1024 * 1024 withImageData:UIImageJPEGRepresentation(shareImage, 1.0)];
            if (shareContent.url && shareContent.url.length > 0) {
                NSString *shareUrl = shareContent.url;
                UIImage *qrCodeImg = [UIImage rxQRCodeForString:shareUrl size:CGSizeMake(shareContent.width, shareContent.height) fillColor:[UIColor blackColor] iconImage:nil borderSize:[shareInfo[@"borderSize"] floatValue]];
                UIImage *bgView = [UIImage imageWithData:imageData];
                CGFloat fixelW = CGImageGetWidth(bgView.CGImage);
                CGFloat fixelH = CGImageGetHeight(bgView.CGImage);
                UIImageView *shareImgView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, fixelW, fixelH)];
                shareImgView.image = bgView;
                UIImageView *qrCodeImgView = [[UIImageView alloc] initWithFrame:CGRectMake(shareContent.x, shareContent.y, shareContent.width, shareContent.height)];
                qrCodeImgView.image = qrCodeImg;
                [shareImgView addSubview:qrCodeImgView];
                
                UIImage *shareImg = [UIImage makeImageWithView:shareImgView withSize:shareImgView.frame.size];
                NSData *shareImgData = UIImagePNGRepresentation(shareImg);
                imageData = [CHDownImage dataScaleToBytes:23 * 1024 * 1024 withImageData:shareImgData];
            }
            UIImage *fetchImage = [UIImage imageWithData:imageData];
            if (fetchImage) {
                activityItems = @[fetchImage];
            }
            [self systemShareActionWithItems:activityItems complete:complete];
        }
    } else if ([shareContent.material_type isEqualToString:@"link"]) { // 链接
        if (shareContent.image && [NSString rx_isNullToString:shareContent.image].length > 0) {
            [self downImage:shareContent.image complete:^(NSData *imgData) {
                // 缩略图不能大于32k，防止误差压缩到30k
                NSData *imageData = [CHDownImage dataScaleToBytes:30 * 1024 withImageData:imgData];

                NSString *shareUrl = shareContent.url;
                NSURL *urlToShare = [NSURL URLWithString:shareUrl];
                
                activityItems = @[shareContent.title, [UIImage imageWithData:imageData], urlToShare];
                [self systemShareActionWithItems:activityItems complete:complete];
            }];
        } else {
            NSString *shareUrl = shareContent.url;

            NSURL *urlToShare = [NSURL URLWithString:shareUrl];
            
            activityItems = @[shareContent.title, urlToShare];
            [self systemShareActionWithItems:activityItems complete:complete];
        }
    } else {
        if (complete) {
            complete(NO);
        }
    }
}

- (void)systemShareActionWithItems:(NSArray *)items
                          complete:(ShareCallBack)complete
{
    UIActivityViewController *activityVC = [[UIActivityViewController alloc]initWithActivityItems:items
                                                                            applicationActivities:nil];

    activityVC.excludedActivityTypes=@[UIActivityTypePrint,UIActivityTypeCopyToPasteboard,UIActivityTypeAssignToContact,UIActivityTypeSaveToCameraRoll];
    [[UIViewController currentViewController] presentViewController:activityVC animated:YES completion:nil];
    activityVC.completionWithItemsHandler = ^(UIActivityType _Nullable activityType, BOOL completed, NSArray * _Nullable returnedItems, NSError * _Nullable activityError) {
        if (complete) {
            complete(completed);
        }
    };
}

#pragma mark -- <fetch>
- (void)downImage:(NSString *)imageUrl
         complete:(void(^)(NSData *imgData))complete
{
    if (imageUrl&&imageUrl.length>0) {
        [CHDownImage asyurlToData:imageUrl withHandler:^(NSURLResponse *response, NSData *data, NSError *connectionError) {
            if (complete) {
                dispatch_async(dispatch_get_main_queue(), ^{
                    complete(data);
                });
            }
        }];
    }else{
        if (complete) {
            complete(nil);
        }
    }
}

/**
 * 分享上报
 * @param distinctId 用户唯一标识，一般为 openid（由CP调用时传入），nil默认为openid
 * @param properties 自定义属性
 */
- (void)shareReportWithDistinctId:(NSString *)distinctId
                       properties:(NSDictionary * _Nullable)properties
                         complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:@"track" forKey:@"type"];
    [dic setValue:[RXCommonTool getTimeForStr] forKey:@"time"];
    
    if (distinctId && distinctId.length > 0) {
        [dic setValue:distinctId forKey:@"distinct_id"];
    } else {
        [dic setValue:[RXUserUtility valueForKey:keyUserData_openId] forKey:@"distinct_id"];
    }
    	
    [dic setValue:@"#share" forKey:@"event"];
    [dic setValue:[RXCommonTool uuid] forKey:@"uuid"];
    [dic setValue:@([[RXUserUtility sharedManager].cpid integerValue]) forKey:@"cpid"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_productId] forKey:@"product_id"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_channelId] forKey:@"channel_id"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_subchannelid] forKey:@"sub_channel_id"];
    [dic setValue:@(2) forKey:@"platform_id"];
    [dic setValue:[DeviceKey getDeviceIDInKeychain] forKey:@"devicecode"];
    
    if (self.gameInfo && self.gameInfo.allKeys.count > 0) {
        [dic setValue:self.gameInfo forKey:@"game_info"];
    }
    
    RXShareModel *shareModel = [RXShareModel rx_modelWithDictionary:self.shareInfo[@"data"]];
    RXShareTrigger *trigger = shareModel.trigger;
    RXShareContent *content = shareModel.content;
    RXShareStrategy *strategy = shareModel.strategy;
    
    NSMutableDictionary *proDic = [NSMutableDictionary dictionaryWithDictionary:properties];
    [proDic setValue:[NSString rx_isNullToString:[NSString stringWithFormat:@"%@", properties[@"trigger_tag"]]].length > 0 ? [NSString stringWithFormat:@"%@", properties[@"trigger_tag"]] : trigger.tag forKey:@"trigger_tag"];
    [proDic setValue:[NSString rx_isNullToString:[NSString stringWithFormat:@"%@", properties[@"trigger_id"]]].length > 0 ? [NSString stringWithFormat:@"%@", properties[@"trigger_id"]] : [NSString stringWithFormat:@"%ld", (long)trigger.id] forKey:@"trigger_id"];
    [proDic setValue:[NSString rx_isNullToString:[NSString stringWithFormat:@"%@", properties[@"trigger_type"]]].length > 0 ? [NSString stringWithFormat:@"%@", properties[@"trigger_type"]] : [NSString stringWithFormat:@"%ld", (long)trigger.type] forKey:@"trigger_type"];
    [proDic setValue:[NSString rx_isNullToString:[NSString stringWithFormat:@"%@", properties[@"material_type"]]].length > 0 ? [NSString stringWithFormat:@"%@", properties[@"material_type"]] : content.material_type forKey:@"material_type"];
    [proDic setValue:[NSString rx_isNullToString:[NSString stringWithFormat:@"%@", properties[@"material_id"]]].length > 0 ? [NSString stringWithFormat:@"%@", properties[@"material_id"]] : [NSString stringWithFormat:@"%ld", (long)content.material_id] forKey:@"material_id"];
    [proDic setValue:[NSString rx_isNullToString:[NSString stringWithFormat:@"%@", properties[@"landing_id"]]].length > 0 ? [NSString stringWithFormat:@"%@", properties[@"landing_id"]] : [NSString stringWithFormat:@"%ld", (long)content.landing_id] forKey:@"landing_id"];
    [proDic setValue:[NSString rx_isNullToString:[NSString stringWithFormat:@"%@", properties[@"strategy_id"]]].length > 0 ? [NSString stringWithFormat:@"%@", properties[@"strategy_id"]] : [NSString stringWithFormat:@"%ld", (long)strategy.id] forKey:@"strategy_id"];
    [proDic setValue:[NSString rx_isNullToString:[NSString stringWithFormat:@"%@", properties[@"strategy_type"]]].length > 0 ? [NSString stringWithFormat:@"%@", properties[@"strategy_type"]] : [NSString stringWithFormat:@"%ld", (long)strategy.type] forKey:@"strategy_type"];
    [proDic setValue:[NSString rx_isNullToString:[NSString stringWithFormat:@"%@", properties[@"region"]]].length > 0 ? [NSString stringWithFormat:@"%@", properties[@"region"]] : self.region forKey:@"region"];
    [proDic setValue:[NSString rx_isNullToString:[NSString stringWithFormat:@"%@", properties[@"platform"]]].length > 0 ? [NSString stringWithFormat:@"%@", properties[@"platform"]] : self.platform forKey:@"platform"];
    [dic setValue:proDic forKey:@"properties"];
    
    NSError *parseError = nil;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:@[dic] options:NSJSONWritingPrettyPrinted  error:&parseError];
    NSString *jsonstr =[[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    NSData *objectData = [jsonstr dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *jsonDic = [NSJSONSerialization JSONObjectWithData:objectData
                                                            options:NSJSONReadingMutableContainers
                                                              error:&parseError];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/data/api/track" andParams:jsonDic requsetMethod:RequestMethod_Post];
//    request.isGzip = YES;
//    request.gzipParam = param;
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    
    NSMutableDictionary *header = [RX_CommonNetworkExcuteManager headParams];
    [header setValue:@"1" forKey:@"ruixue-datacount"];
    request.headParams = header;
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"分享上报成功:\n %@", responseObject);
        
        if (self.gameInfo && self.gameInfo.allKeys.count > 0) {
            self.gameInfo = nil;
        }
        
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"分享上报失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 获取通路配置
 */
- (void)getSharePlatformsWithComplete:(RequestComplete)complete
{
    NSMutableDictionary *sharePlatforms = [RXUserUtility sharedManager].sharePlatformsDic;
    if (sharePlatforms && sharePlatforms[@"code"] == 0) {
        if (complete) {
            if ([RXUserUtility sharedManager].isGetSharePlatformSuccess) {
                complete(sharePlatforms, nil);
            } else {
                RX_CommonRequestError *rxError = [[RX_CommonRequestError alloc] init];
                rxError.responesObject = sharePlatforms;
                complete(nil, rxError);
            }
        }
    } else {
        RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/operationapi/share/platforms" andParams:nil requsetMethod:RequestMethod_Get];
        request.baseUrl = [RXConfig sharedManager].apiDomain;
        request.headParams = [RX_CommonNetworkExcuteManager headParams];
        
        [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
            if (responseObject && [responseObject isKindOfClass:[NSDictionary class]]) {
                [RXUserUtility sharedManager].isGetSharePlatformSuccess = YES;
                [RXUserUtility sharedManager].sharePlatformsDic = responseObject;
                if (complete) {
                    complete(responseObject, nil);
                }
            }
            NSLog(@"获取通路配置成功:\n %@", responseObject);
        } failure:^(RX_CommonRequestError * _Nullable error) {
            if (error.responesObject && [error.responesObject isKindOfClass:[NSDictionary class]]) {
                [RXUserUtility sharedManager].isGetSharePlatformSuccess = NO;
//                [RXUserUtility sharedManager].sharePlatformsDic = error.responesObject;
                if (complete) {
                    complete(nil, error);
                }
            }
            NSLog(@"获取通路配置失败:\n %@", error.error);
        }];
    }
}

/**
 * 分享/广告结果上报
 * @param func 埋点标识  必须
 * @param platform 分享平台 wechat
 * @param region 地区码 非必须
 * @param transmits 透传参数，原样返回， 请使用key=value形式，并对值使用urlencode，返回时会原样返回  非必须
 * @param scheduling_event 上报结果  YES 成功   NO 失败
 * @param scheduling_type 上报类型  ad 广告   share 分享
 * @param properties 自定义属性
 */
- (void)shareSchedulingReportWithFunc:(NSString *)func
                             platform:(NSString *)platform
                               region:(NSString *)region
                            transmits:(NSString * _Nullable)transmits
                     scheduling_event:(BOOL)scheduling_event
                      scheduling_type:(NSString *)scheduling_type
                           properties:(NSDictionary * _Nullable)properties
                             complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:func forKey:@"func"];
    [dic setValue:platform forKey:@"platform"];
    [dic setValue:region forKey:@"region"];
    [dic setValue:transmits forKey:@"transmits"];
    [dic setValue:scheduling_event ? @"done" : @"fail" forKey:@"scheduling_event"];
    [dic setValue:scheduling_type forKey:@"scheduling_type"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_openId] forKey:@"open_id"];
    [dic setValue:@"app" forKey:@"type"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_productId] forKey:@"product_id"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_channelId] forKey:@"channel_id"];
    [dic setValue:[RXUserUtility valueForKey:keyUserData_subchannelid] forKey:@"sub_channel_id"];
    
    if (self.gameInfo && self.gameInfo.allKeys.count > 0) {
        [dic setValue:self.gameInfo forKey:@"game_info"];
    }
    
    RXShareModel *shareModel = [RXShareModel rx_modelWithDictionary:self.shareInfo[@"data"]];
    RXShareTrigger *trigger = shareModel.trigger;
    RXShareContent *content = shareModel.content;
    RXShareStrategy *strategy = shareModel.strategy;
    
    NSMutableDictionary *proDic = [NSMutableDictionary dictionaryWithDictionary:properties];
    [proDic setValue:[NSString rx_isNullToString:[NSString stringWithFormat:@"%@", properties[@"trigger_tag"]]].length > 0 ? [NSString stringWithFormat:@"%@", properties[@"trigger_tag"]] : trigger.tag forKey:@"trigger_tag"];
    [proDic setValue:[NSString rx_isNullToString:[NSString stringWithFormat:@"%@", properties[@"trigger_id"]]].length > 0 ? @([properties[@"trigger_id"] integerValue]) : @(trigger.id) forKey:@"trigger_id"];
    [proDic setValue:[NSString rx_isNullToString:[NSString stringWithFormat:@"%@", properties[@"trigger_type"]]].length > 0 ? @([properties[@"trigger_type"] integerValue]) : @(trigger.type) forKey:@"trigger_type"];
    [proDic setValue:[NSString rx_isNullToString:[NSString stringWithFormat:@"%@", properties[@"material_type"]]].length > 0 ? [NSString stringWithFormat:@"%@", properties[@"material_type"]] : content.material_type forKey:@"material_type"];
    [proDic setValue:[NSString rx_isNullToString:[NSString stringWithFormat:@"%@", properties[@"material_id"]]].length > 0 ? @([properties[@"material_id"] integerValue]) : @(content.material_id) forKey:@"material_id"];
    [proDic setValue:[NSString rx_isNullToString:[NSString stringWithFormat:@"%@", properties[@"landing_id"]]].length > 0 ? @([properties[@"landing_id"] integerValue]) : @(content.landing_id) forKey:@"landing_id"];
    [proDic setValue:[NSString rx_isNullToString:[NSString stringWithFormat:@"%@", properties[@"strategy_id"]]].length > 0 ? @([properties[@"strategy_id"] integerValue]) : @(strategy.id) forKey:@"strategy_id"];
    [proDic setValue:[NSString rx_isNullToString:[NSString stringWithFormat:@"%@", properties[@"strategy_type"]]].length > 0 ? @([properties[@"strategy_type"] integerValue]) : @(strategy.type) forKey:@"strategy_type"];
    [proDic setValue:[NSString rx_isNullToString:[NSString stringWithFormat:@"%@", properties[@"region"]]].length > 0 ? [NSString stringWithFormat:@"%@", properties[@"region"]] : region forKey:@"region"];
    [proDic setValue:[NSString rx_isNullToString:[NSString stringWithFormat:@"%@", properties[@"platform"]]].length > 0 ? [NSString stringWithFormat:@"%@", properties[@"platform"]] : platform forKey:@"platform"];
    [dic setValue:proDic forKey:@"properties"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/operationapi/scheduling_report" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"分享上报成功:\n %@", responseObject);
        
        if (self.gameInfo && self.gameInfo.allKeys.count > 0) {
            self.gameInfo = nil;
        }
        
        NSDictionary *shareData = responseObject[@"data"];
        
        NSString *cacheKey = [NSString stringWithFormat:@"%@_%@_%@_%@", func, platform, region, [RXUserUtility valueForKey:keyUserData_openId]];
        
        // 有数据更新缓存，没有数据清除该埋点缓存
        if (shareData && [shareData isKindOfClass:[NSDictionary class]] && shareData.allKeys.count > 0) {
            // 更新本地缓存
            // 更新分享数据缓存

            NSMutableDictionary *allCacheDic = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_shareData]];
    //        NSMutableDictionary *cacheShareData = [NSMutableDictionary dictionaryWithDictionary:allCacheDic[cacheKey]];
            
    //        if (cacheShareData && cacheShareData.allKeys.count > 0) {
            NSMutableDictionary *mutShareData = [NSMutableDictionary dictionaryWithDictionary:shareData];
            for (int i = 0; i < shareData.allKeys.count; i++) {
                NSDictionary *v = shareData.allValues[i];
                if (!v || [v isKindOfClass:[NSNull class]] || [v isEqual:[NSNull null]]) {
                    [mutShareData removeObjectForKey:shareData.allKeys[i]];
                }
            }
            NSMutableDictionary *mutRes = [NSMutableDictionary dictionaryWithDictionary:responseObject];
            if (mutShareData && mutShareData.allKeys.count > 0) {
                [mutRes setValue:mutShareData forKey:@"data"];
            }
            [allCacheDic setValue:mutRes forKey:cacheKey];
            [RXUserUtility setValue:allCacheDic ForKey:keyUserData_shareData];
    //        }
            
            // 更新分享调度缓存
            NSMutableDictionary *shareSchedulList = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility sharedManager].shareSchedulList];
            
            for (int i = 0; i < shareSchedulList.allKeys.count; i++) {
                NSString *shareSchedulFunc = shareSchedulList.allKeys[i];
                
                if ([shareSchedulFunc isEqualToString:func]) {
                    [shareSchedulList setValue:responseObject[@"data"][@"scheduling"] forKey:shareSchedulFunc];
                    [RXUserUtility sharedManager].shareSchedulList = shareSchedulList;
    //                [searchArr addObject:shareDic];
                    break;
                }
            }
        } else {
            // 清空该埋点缓存
            NSMutableDictionary *shareSchedulList = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility sharedManager].shareSchedulList];
            
            for (int i = 0; i < shareSchedulList.allKeys.count; i++) {
                NSString *shareSchedulFunc = shareSchedulList.allKeys[i];
                
                if ([shareSchedulFunc isEqualToString:func]) {
                    [shareSchedulList removeObjectForKey:shareSchedulFunc];
                    [RXUserUtility sharedManager].shareSchedulList = shareSchedulList;
    //                [searchArr addObject:shareDic];
                    break;
                }
            }
            
            NSMutableDictionary *allCacheDic = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_shareData]];
            [allCacheDic removeObjectForKey:cacheKey];
            [RXUserUtility setValue:allCacheDic ForKey:keyUserData_shareData];
        }
        
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"分享上报失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 获取自动重定向短链接
 * @param url 要生成短链接的url
 */
- (void)getShortUrl:(NSString *)url
           complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:url forKey:@"jump_url"];
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/url/short" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"生成短链成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"生成短链失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 获取自动重定向短链接
 * @note 支持生成可以解析 og 标签（图片、标题、描述）的短链接
 * @param url 要生成短链接的url
 * @param title 标题
 * @param content 描述
 * @param image 图片地址
 * @param ext 透传参数
 */
- (void)getShortUrl:(NSString *)url
              title:(NSString *)title
            content:(NSString *)content
              image:(NSString *)image
                ext:(NSDictionary *)ext
           complete:(RequestComplete)complete
{
    NSMutableDictionary *dic = [NSMutableDictionary dictionary];
    [dic setValue:url forKey:@"url"];
    if ([NSString rx_isNullToString:title].length > 0) {
        [dic setValue:title forKey:@"title"];
    }
    if ([NSString rx_isNullToString:content].length > 0) {
        [dic setValue:content forKey:@"content"];
    }
    if ([NSString rx_isNullToString:image].length > 0) {
        [dic setValue:image forKey:@"image"];
    }
    if (ext && ext.allKeys.count > 0) {
        [dic setValue:ext forKey:@"ext"];
    }
    
    RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/url/short" andParams:dic requsetMethod:RequestMethod_Post];
    request.baseUrl = [RXConfig sharedManager].apiDomain;
    request.headParams = [RX_CommonNetworkExcuteManager headParams];
    
    [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
        NSLog(@"生成短链成功:\n %@", responseObject);
        if (complete) {
            complete(responseObject, nil);
        }
    } failure:^(RX_CommonRequestError * _Nullable error) {
        NSLog(@"生成短链失败:\n %@", error.error);
        if (complete) {
            complete(nil, error);
        }
    }];
}

/**
 * 一键分享
 * @param config 分享配置
 */
- (void)share:(RXShareConfig *)config
     complete:(RequestComplete)complete
{
    NSString *func = config.func;
    NSString *platform = config.platform;
    NSString *region = config.region;
    NSString *transmits = config.transmits;
    if (config.game_info) {
        self.gameInfo = config.game_info;
    }
    self.newShareCallBack = complete;
    BOOL readCache = config.readCache;
    /*
    NSMutableDictionary *ext = [NSMutableDictionary dictionary];
    if ([NSString rx_isNullToString:config.iOSScheme].length > 0) {
        [ext setValue:config.iOSScheme forKey:@"protocol_ios"];
    }
    if ([NSString rx_isNullToString:config.androidScheme].length > 0) {
        [ext setValue:config.androidScheme forKey:@"protocol_android"];
    }
    if ([NSString rx_isNullToString:config.useScheme].length > 0) {
        [ext setValue:config.useScheme forKey:@"use_scheme"];
    }
    */
    NSString *cacheKey = [NSString stringWithFormat:@"%@_%@_%@_%@", func, platform, region, [RXUserUtility valueForKey:keyUserData_openId]];
    
    [self getShareInfoWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        [self fetchSharePlatform:platform response:response error:error isCustom:NO shareConfig:config];
    }];
}

/**
 * 自定义分享
 * @param config 分享配置
 */
- (void)shareCustom:(RXCustomShareConfig *)config
           complete:(RequestComplete)complete
{
    if (config.game_info) {
        self.gameInfo = config.game_info;
    }
    
    NSString *platform = config.platform;
    self.newShareCallBack = complete;
    
    // model to dic
    NSMutableDictionary *response = [NSMutableDictionary dictionaryWithDictionary:[RXCommonTool dicFromObject:config]];
    response = [self changeKey:response];
    NSMutableDictionary *contentDic = [NSMutableDictionary dictionary];
    [contentDic setValue:response forKey:@"content"];
    NSMutableDictionary *dataDic = [NSMutableDictionary dictionary];
    [dataDic setValue:contentDic forKey:@"data"];
    
    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
    
    NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
    [errorRes setValue:[RXErrorTool getRXErrorMsg:RXShareError_cancel] forKey:@"msg"];
    [errorRes setValue:@(RXShareError_cancel) forKey:@"code"];
    err.responesObject = errorRes;
    
    [self fetchSharePlatform:platform response:dataDic error:err isCustom:YES shareConfig:config];
}

- (void)fetchSharePlatform:(NSString *)platform response:(NSDictionary *)response error:(RX_CommonRequestError *)error isCustom:(BOOL)isCustom shareConfig:(id)shareConfig
{
    // 错误提示
    NSString *tipStr = @"未接入瑞雪组件，请前往查看接入手册";
    
    // 微信分享
    if ([platform isEqualToString:@"wechat"]) {
        tipStr = @"未接入瑞雪 RXWXSDK 组件，请前往 https://doc.ruixuecloud.com/dev_doc/tripartite/weChat/ios.html 查看接入手册";
        if (![RXSubPackage sharedSDK].aW) {
            NSLog(@"%@", tipStr);
            return;
        }
        
        NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:response[@"data"][@"content"]];
        [dic setValue:response[@"data"][@"identity"] forKey:@"appid"];
        if (!isCustom) {
            RXShareConfig *config = (RXShareConfig *)shareConfig;
            [dic setValue:@(config.shareScene) forKey:@"shareScene"];
            [dic setValue:@(config.show_content_in_circle) forKey:@"show_content_in_circle"];
        }
        
        if (error && !isCustom) {
            self.newShareCallBack(response, error);
            
            if ([NSString stringWithFormat:@"%ld", [error.responesObject[@"code"] integerValue]].length < 6 && [error.responesObject[@"code"] integerValue] > 2000) {
                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                               bodyDic:@{}
                                                                action:rxlog_error_share
                                                                   url:@""
                                                                  code:error.responesObject[@"code"] == nil ? -123 : [error.responesObject[@"code"] integerValue]
                                                                   msg:error.responesObject[@"msg"]
                                                             thirdType:@"wechat"
                                                             thirdcode:-123
                                                              thirdmsg:@""
                                                               traceid:@""];
            }
            
            return;
        }
        //主库对微信分享增加一个来自于主库的标识，在微信SDK中判断如果分享来自于主库，则微信SDK中不自动上报
        [dic setValue:@"YES" forKey:@"isFromRXPure"];
        
        __typeof (self) __weak weakSelf = self;
        self.localShareCallBack = ^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            NSInteger code = [response[@"code"] integerValue];
            
            if (!isCustom) {
                BOOL result = YES;
                RXShareConfig *config = (RXShareConfig *)shareConfig;
                if (code == 0) {
                    result = YES;
                } else {
                    result = NO;
                }
                [weakSelf autoReport:config result:result];
            }
            
            if (error != nil) {
                error.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:error.responesObject];
            }
            
            if (weakSelf.newShareCallBack) {
                weakSelf.newShareCallBack(response, error);
            }
            
            if (error != nil) {
                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                               bodyDic:@{}
                                                                action:rxlog_error_share
                                                                   url:@""
                                                                  code:error.responesObject[@"code"] == nil ? -123 : [error.responesObject[@"code"] integerValue]
                                                                   msg:error.responesObject[@"msg"]
                                                             thirdType:@"wechat"
                                                             thirdcode:error.responesObject[@"thirdcode"] == nil ? -123 : [error.responesObject[@"thirdcode"] integerValue]
                                                              thirdmsg:error.responesObject[@"thirdmsg"]
                                                               traceid:@""];
            }
        };
        
        NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
        [notiDic setValue:dic forKey:@"shareInfo"];
        [notiDic setValue:self.localShareCallBack forKey:@"callback"];
        [RXNotificationCenter postNoti:rxUserDefault_share_w object:nil userInfo:notiDic];
    }
    // facebook 分享
    else if ([platform isEqualToString:@"facebook"]) {
        tipStr = @"未接入瑞雪 RXFacebookSDK 组件，请前往 https://doc.ruixuecloud.com/dev_doc/tripartite/facebook/ios.html 查看接入手册";
        // 不存在给出提示
        if (![RXSubPackage sharedSDK].aFacebook) {
            NSLog(@"%@", tipStr);
            return;
        }
        
        __weak __typeof__(self) weakSelf = self;
        self.shareCallBack = ^(BOOL success) {
            BOOL result = YES;
            
            if (success) {
                result = YES;
                
                weakSelf.newShareCallBack(@{@"code" : @(0)}, nil);
            } else {
                result = NO;
                
                RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                
                NSString *errorMsg = [RXErrorTool getRXErrorMsg:RXShareError_cancel];
                if (!isCustom) {
                    NSDictionary *scheduling = response[@"data"][@"scheduling"];
                    if (scheduling && [scheduling isKindOfClass:[NSDictionary class]] && [NSString rx_isNullToString:[NSString stringWithFormat:@"%@", scheduling[@"scheduling_failed_msg"]]].length > 0) {
                        errorMsg = scheduling[@"scheduling_failed_msg"];
                    }
                }
                
                NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
                [errorRes setValue:errorMsg forKey:@"msg"];
                [errorRes setValue:@(RXShareError_cancel) forKey:@"code"];
                err.responesObject = errorRes;
                
                if (err != nil) {
                    err.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:err.responesObject];
                }
                
                weakSelf.newShareCallBack(nil, err);
                
                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                               bodyDic:@{}
                                                                action:rxlog_error_share
                                                                   url:@""
                                                                  code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                                   msg:err.responesObject[@"msg"]
                                                             thirdType:@"facebook"
                                                             thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                              thirdmsg:err.responesObject[@"thirdmsg"]
                                                               traceid:@""];
            }
            
            if (!isCustom) {
                RXShareConfig *config = (RXShareConfig *)shareConfig;
                
                [weakSelf autoReport:config result:result];
            }
        };
        
        NSMutableDictionary *dic = [NSMutableDictionary dictionaryWithDictionary:response[@"data"][@"content"]];
        
        NSInteger shareScene = 0;
        if (isCustom) {
            RXCustomShareConfig *config = (RXCustomShareConfig *)shareConfig;
            shareScene = config.shareScene;
        } else {
            RXShareConfig *config = (RXShareConfig *)shareConfig;
            shareScene = config.shareScene;
        }
        [dic setValue:@(shareScene) forKey:@"shareMode"];
        
        if (error && !isCustom) {
            self.newShareCallBack(response, error);
            
            if ([NSString stringWithFormat:@"%ld", [error.responesObject[@"code"] integerValue]].length < 6 && [error.responesObject[@"code"] integerValue] > 2000) {
                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                               bodyDic:@{}
                                                                action:rxlog_error_share
                                                                   url:@""
                                                                  code:error.responesObject[@"code"] == nil ? -123 : [error.responesObject[@"code"] integerValue]
                                                                   msg:error.responesObject[@"msg"]
                                                             thirdType:@"facebook"
                                                             thirdcode:-123
                                                              thirdmsg:@""
                                                               traceid:@""];
            }
            
            return;
        }
        
        NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
        [notiDic setValue:dic forKey:@"shareInfo"];
        [notiDic setValue:self.shareCallBack forKey:@"callback"];
        [RXNotificationCenter postNoti:rxUserDefault_share_fb object:nil userInfo:notiDic];
    }
    // messenger 分享
    else if ([platform isEqualToString:@"messenger"]) {
        tipStr = @"未接入瑞雪 RXFacebookSDK 组件，请前往 https://doc.ruixuecloud.com/dev_doc/tripartite/facebook/ios.html 查看接入手册";
        // 不存在给出提示
        if (![RXSubPackage sharedSDK].aFacebook) {
            NSLog(@"%@", tipStr);
            return;
        }
        
        __weak __typeof__(self) weakSelf = self;
        self.shareCallBack = ^(BOOL success) {
            BOOL result = YES;
            
            if (success) {
                result = YES;
                
                self.newShareCallBack(@{@"code" : @(0)}, nil);
            } else {
                result = NO;
                
                RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                
                NSString *errorMsg = [RXErrorTool getRXErrorMsg:RXShareError_cancel];
                if (!isCustom) {
                    NSDictionary *scheduling = response[@"data"][@"scheduling"];
                    if (scheduling && [scheduling isKindOfClass:[NSDictionary class]] && [NSString rx_isNullToString:[NSString stringWithFormat:@"%@", scheduling[@"scheduling_failed_msg"]]].length > 0) {
                        errorMsg = scheduling[@"scheduling_failed_msg"];
                    }
                }
                
                NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
                [errorRes setValue:errorMsg forKey:@"msg"];
                [errorRes setValue:@(RXShareError_cancel) forKey:@"code"];
                err.responesObject = errorRes;
                
                if (err != nil) {
                    err.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:err.responesObject];
                }
                
                self.newShareCallBack(nil, err);
                
                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                               bodyDic:@{}
                                                                action:rxlog_error_share
                                                                   url:@""
                                                                  code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                                   msg:err.responesObject[@"msg"]
                                                             thirdType:@"messenger"
                                                             thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                              thirdmsg:err.responesObject[@"thirdmsg"]
                                                               traceid:@""];
            }
            
            if (!isCustom) {
                RXShareConfig *config = (RXShareConfig *)shareConfig;
                
                [weakSelf autoReport:config result:result];
            }
        };
        
        NSDictionary *dic = response[@"data"][@"content"];
        if (error && !isCustom) {
            self.newShareCallBack(response, error);
            
            if ([NSString stringWithFormat:@"%ld", [error.responesObject[@"code"] integerValue]].length < 6 && [error.responesObject[@"code"] integerValue] > 2000) {
                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                               bodyDic:@{}
                                                                action:rxlog_error_share
                                                                   url:@""
                                                                  code:error.responesObject[@"code"] == nil ? -123 : [error.responesObject[@"code"] integerValue]
                                                                   msg:error.responesObject[@"msg"]
                                                             thirdType:@"messenger"
                                                             thirdcode:-123
                                                              thirdmsg:@""
                                                               traceid:@""];
            }
            return;
        }
        
        NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
        [notiDic setValue:dic forKey:@"shareInfo"];
        [notiDic setValue:self.shareCallBack forKey:@"callback"];
        [RXNotificationCenter postNoti:rxUserDefault_share_messenger object:nil userInfo:notiDic];
    }
    // line 分享
    else if ([platform isEqualToString:@"line"]) {
        tipStr = @"未接入瑞雪 RXLineService 组件，请前往 https://doc.ruixuecloud.com/dev_doc/tripartite/line/ios.html 查看接入手册";
        // 不存在给出提示
        if (![RXSubPackage sharedSDK].aLine) {
            NSLog(@"%@", tipStr);
            return;
        }
        
        NSDictionary *dic = response[@"data"][@"content"];
        
        if (error && !isCustom) {
            self.newShareCallBack(response, error);
            if ([NSString stringWithFormat:@"%ld", [error.responesObject[@"code"] integerValue]].length < 6 && [error.responesObject[@"code"] integerValue] > 2000) {
                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                               bodyDic:@{}
                                                                action:rxlog_error_share
                                                                   url:@""
                                                                  code:error.responesObject[@"code"] == nil ? -123 : [error.responesObject[@"code"] integerValue]
                                                                   msg:error.responesObject[@"msg"]
                                                             thirdType:@"line"
                                                             thirdcode:-123
                                                              thirdmsg:@""
                                                               traceid:@""];
            }
            return;
        }
        
        __typeof (self) __weak weakSelf = self;
        self.localShareCallBack = ^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            NSInteger code = [response[@"code"] integerValue];
            
            NSString *errorMsg = [RXErrorTool getRXErrorMsg:RXShareError_cancel];
            if (!isCustom) {
                BOOL result = YES;
                RXShareConfig *config = (RXShareConfig *)shareConfig;
                if (code == 0) {
                    result = YES;
                } else {
                    result = NO;
                    // 替换错误提示
                    NSDictionary *scheduling = response[@"data"][@"scheduling"];
                    if (scheduling && [scheduling isKindOfClass:[NSDictionary class]] && [NSString rx_isNullToString:[NSString stringWithFormat:@"%@", scheduling[@"scheduling_failed_msg"]]].length > 0) {
                        errorMsg = scheduling[@"scheduling_failed_msg"];
                    }
                    
                    NSMutableDictionary *errorRes = [NSMutableDictionary dictionaryWithDictionary:error.responesObject];
                    if (errorRes && [errorRes isKindOfClass:[NSDictionary class]]) {
                        [errorRes setValue:errorMsg forKey:@"msg"];
                    }
                    error.responesObject = errorRes;
                }
                [weakSelf autoReport:config result:result];
            }
            
            if (error != nil) {
                error.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:error.responesObject];
            }
            
            if (weakSelf.newShareCallBack) {
                weakSelf.newShareCallBack(response, error);
            }
            
            if (error != nil) {
                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                               bodyDic:@{}
                                                                action:rxlog_error_share
                                                                   url:@""
                                                                  code:error.responesObject[@"code"] == nil ? -123 : [error.responesObject[@"code"] integerValue]
                                                                   msg:error.responesObject[@"msg"]
                                                             thirdType:@"line"
                                                             thirdcode:error.responesObject[@"thirdcode"] == nil ? -123 : [error.responesObject[@"thirdcode"] integerValue]
                                                              thirdmsg:error.responesObject[@"thirdmsg"]
                                                               traceid:@""];
            }
        };
        
        if (!isCustom) {
            RXShareConfig *config = (RXShareConfig *)shareConfig;
            
            [self autoReport:config result:YES];
        }
        
        NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
        [notiDic setValue:dic forKey:@"shareInfo"];
        [notiDic setValue:self.localShareCallBack forKey:@"callback"];
        [RXNotificationCenter postNoti:rxUserDefault_share_line object:nil userInfo:notiDic];
    }
    // tiktok 分享
    else if ([platform isEqualToString:@"tiktok"]) {
        tipStr = @"未接入瑞雪 RXTikTokSDK 组件，请前往 %@ 查看接入手册";
        // 不存在给出提示
        if (![RXSubPackage sharedSDK].aTikTok) {
            NSLog(@"%@", tipStr);
            return;
        }
        
        NSDictionary *shareInfo = response[@"data"][@"content"];
        if (error && !isCustom) {
            self.newShareCallBack(response, error);
            if ([NSString stringWithFormat:@"%ld", [error.responesObject[@"code"] integerValue]].length < 6 && [error.responesObject[@"code"] integerValue] > 2000) {
                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                               bodyDic:@{}
                                                                action:rxlog_error_share
                                                                   url:@""
                                                                  code:error.responesObject[@"code"] == nil ? -123 : [error.responesObject[@"code"] integerValue]
                                                                   msg:error.responesObject[@"msg"]
                                                             thirdType:@"tiktok"
                                                             thirdcode:-123
                                                              thirdmsg:@""
                                                               traceid:@""];
            }
            return;
        }
        
        __typeof (self) __weak weakSelf = self;
        self.localShareCallBack = ^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            NSInteger code = [response[@"code"] integerValue];
            
            NSString *errorMsg = [RXErrorTool getRXErrorMsg:RXShareError_cancel];
            if (!isCustom) {
                BOOL result = YES;
                RXShareConfig *config = (RXShareConfig *)shareConfig;
                if (code == 0) {
                    result = YES;
                } else {
                    result = NO;
                    // 替换错误提示
                    NSDictionary *scheduling = response[@"data"][@"scheduling"];
                    if (scheduling && [scheduling isKindOfClass:[NSDictionary class]] && [NSString rx_isNullToString:[NSString stringWithFormat:@"%@", scheduling[@"scheduling_failed_msg"]]].length > 0) {
                        errorMsg = scheduling[@"scheduling_failed_msg"];
                    }
                    
                    NSMutableDictionary *errorRes = [NSMutableDictionary dictionaryWithDictionary:error.responesObject];
                    if (errorRes && [errorRes isKindOfClass:[NSDictionary class]]) {
                        [errorRes setValue:errorMsg forKey:@"msg"];
                    }
                    error.responesObject = errorRes;
                }
                [weakSelf autoReport:config result:result];
            }
            
            if (error != nil) {
                error.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:error.responesObject];
            }
            
            if (weakSelf.newShareCallBack) {
                weakSelf.newShareCallBack(response, error);
            }
            
            if (error != nil) {
                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                               bodyDic:@{}
                                                                action:rxlog_error_share
                                                                   url:@""
                                                                  code:error.responesObject[@"code"] == nil ? -123 : [error.responesObject[@"code"] integerValue]
                                                                   msg:error.responesObject[@"msg"]
                                                             thirdType:@"tiktok"
                                                             thirdcode:error.responesObject[@"thirdcode"] == nil ? -123 : [error.responesObject[@"thirdcode"] integerValue]
                                                              thirdmsg:error.responesObject[@"thirdmsg"]
                                                               traceid:@""];
            }
        };
        
        NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
        [notiDic setValue:shareInfo forKey:@"shareInfo"];
        [notiDic setValue:self.localShareCallBack forKey:@"callback"];
        [RXNotificationCenter postNoti:rxUserDefault_share_tiktok object:nil userInfo:notiDic];
    }
    // zalo 分享
    else if ([platform isEqualToString:@"zalo"]) {
        tipStr = @"未接入瑞雪 RXZaloSDK 组件，请前往 %@ 查看接入手册";
        // 不存在给出提示
        if (![RXSubPackage sharedSDK].aZalo) {
            NSLog(@"%@", tipStr);
            return;
        }
        
        if (error && !isCustom) {
            self.newShareCallBack(response, error);
            if ([NSString stringWithFormat:@"%ld", [error.responesObject[@"code"] integerValue]].length < 6 && [error.responesObject[@"code"] integerValue] > 2000) {
                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                               bodyDic:@{}
                                                                action:rxlog_error_share
                                                                   url:@""
                                                                  code:error.responesObject[@"code"] == nil ? -123 : [error.responesObject[@"code"] integerValue]
                                                                   msg:error.responesObject[@"msg"]
                                                             thirdType:@"zalo"
                                                             thirdcode:-123
                                                              thirdmsg:@""
                                                               traceid:@""];
            }
            return;
        }
        
        NSDictionary *dic = response[@"data"][@"content"];
        NSMutableDictionary *mutDic = [NSMutableDictionary dictionaryWithDictionary:dic];
        
        NSInteger shareScene = 0;
        if (isCustom) {
            RXCustomShareConfig *config = (RXCustomShareConfig *)shareConfig;
            shareScene = config.shareScene;
        } else {
            RXShareConfig *config = (RXShareConfig *)shareConfig;
            shareScene = config.shareScene;
        }
        [mutDic setValue:@(shareScene) forKey:@"shareScene"];
        
        __typeof (self) __weak weakSelf = self;
        self.commonShareBlock = ^(NSDictionary *response) {
            NSInteger code = [response[@"code"] integerValue];
            BOOL result = YES;
            
            if (weakSelf.newShareCallBack) {
                if (code == 0) {
                    result = YES;
                    
                    weakSelf.newShareCallBack(response, nil);
                } else {
                    result = NO;
                    
                    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                    
                    NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
                    
                    NSString *rxErrorMsg = [RXErrorTool getRXErrorMsg:RXShareError_third];
                    NSInteger rxErrorCode = RXShareError_third;
                    
                    
                    if (code == -1) {
                        rxErrorMsg = [RXErrorTool getRXErrorMsg:RXShareError_cancel];
                        rxErrorCode = RXShareError_cancel;
                        NSLog(@"errorCode %d\n rxErrorMsg  %@ \n rxErrorCode %d", code, rxErrorMsg, rxErrorCode);
                    }
                    
                    if (!isCustom) {
                        NSDictionary *scheduling = response[@"data"][@"scheduling"];
                        if (scheduling && [scheduling isKindOfClass:[NSDictionary class]] && [NSString rx_isNullToString:[NSString stringWithFormat:@"%@", scheduling[@"scheduling_failed_msg"]]].length > 0) {
                            rxErrorMsg = scheduling[@"scheduling_failed_msg"];
                        }
                    }
                    
                    [errorRes setValue:rxErrorMsg forKey:@"msg"];
                    [errorRes setValue:@(rxErrorCode) forKey:@"code"];
                    NSString *errorMsg = response[@"msg"];
                    if ([NSString rx_isNullToString:errorMsg].length > 0) {
                        [errorRes setValue:errorMsg forKey:@"thirdmsg"];
                    }
                    [errorRes setValue:@(code) forKey:@"thirdcode"];
                    
                    err.responesObject = errorRes;
                    
                    if (err != nil) {
                        err.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:err.responesObject];
                    }
                    
                    weakSelf.newShareCallBack(nil, err);
                    
                    [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                                   bodyDic:@{}
                                                                    action:rxlog_error_share
                                                                       url:@""
                                                                      code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                                       msg:err.responesObject[@"msg"]
                                                                 thirdType:@"zalo"
                                                                 thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                                  thirdmsg:error.responesObject[@"thirdmsg"]
                                                                   traceid:@""];
                }
                
                if (!isCustom) {
                    RXShareConfig *config = (RXShareConfig *)shareConfig;
                    
                    [weakSelf autoReport:config result:result];
                }
            }
        };
        
        NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
        [notiDic setValue:mutDic forKey:@"shareInfo"];
        [notiDic setValue:self.commonShareBlock forKey:@"callback"];
        [RXNotificationCenter postNoti:rxUserDefault_share_zalo object:nil userInfo:notiDic];
    }
    // snapchat 分享
    else if ([platform isEqualToString:@"snapchat"]) {
        tipStr = @"未接入瑞雪 RXSnapChatSDK 组件，请前往 %@ 查看接入手册";
        // 不存在给出提示
        if (![RXSubPackage sharedSDK].aSnapchat) {
            NSLog(@"%@", tipStr);
            return;
        }
        
        NSDictionary *shareInfo = response[@"data"][@"content"];
        if (error && !isCustom) {
            self.newShareCallBack(response, error);
            if ([NSString stringWithFormat:@"%ld", [error.responesObject[@"code"] integerValue]].length < 6 && [error.responesObject[@"code"] integerValue] > 2000) {
                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                               bodyDic:@{}
                                                                action:rxlog_error_share
                                                                   url:@""
                                                                  code:error.responesObject[@"code"] == nil ? -123 : [error.responesObject[@"code"] integerValue]
                                                                   msg:error.responesObject[@"msg"]
                                                             thirdType:@"snapchat"
                                                             thirdcode:-123
                                                              thirdmsg:@""
                                                               traceid:@""];
            }
            return;
        }
        
        __typeof (self) __weak weakSelf = self;
        self.localShareCallBack = ^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            NSInteger code = [response[@"code"] integerValue];
            
            NSString *errorMsg = [RXErrorTool getRXErrorMsg:RXShareError_cancel];
            if (!isCustom) {
                BOOL result = YES;
                RXShareConfig *config = (RXShareConfig *)shareConfig;
                if (code == 0) {
                    result = YES;
                } else {
                    result = NO;
                    // 替换错误提示
                    NSDictionary *scheduling = response[@"data"][@"scheduling"];
                    if (scheduling && [scheduling isKindOfClass:[NSDictionary class]] && [NSString rx_isNullToString:[NSString stringWithFormat:@"%@", scheduling[@"scheduling_failed_msg"]]].length > 0) {
                        errorMsg = scheduling[@"scheduling_failed_msg"];
                    }
                    
                    NSMutableDictionary *errorRes = [NSMutableDictionary dictionaryWithDictionary:error.responesObject];
                    if (errorRes && [errorRes isKindOfClass:[NSDictionary class]]) {
                        [errorRes setValue:errorMsg forKey:@"msg"];
                    }
                    error.responesObject = errorRes;
                }
                [weakSelf autoReport:config result:result];
            }
            
            if (error != nil) {
                error.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:error.responesObject];
            }
            
            if (weakSelf.newShareCallBack) {
                weakSelf.newShareCallBack(response, error);
            }
            
            if (error != nil) {
                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                               bodyDic:@{}
                                                                action:rxlog_error_share
                                                                   url:@""
                                                                  code:error.responesObject[@"code"] == nil ? -123 : [error.responesObject[@"code"] integerValue]
                                                                   msg:error.responesObject[@"msg"]
                                                             thirdType:@"snapchat"
                                                             thirdcode:error.responesObject[@"thirdcode"] == nil ? -123 : [error.responesObject[@"thirdcode"] integerValue]
                                                              thirdmsg:error.responesObject[@"thirdmsg"]
                                                               traceid:@""];
            }
        };
        
        NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
        [notiDic setValue:shareInfo forKey:@"shareInfo"];
        [notiDic setValue:self.localShareCallBack forKey:@"callback"];
        [RXNotificationCenter postNoti:rxUserDefault_share_snapchat object:nil userInfo:notiDic];
    }
    // reddit 分享
    else if ([platform isEqualToString:@"reddit"]) {
        tipStr = @"未接入瑞雪 RxRedditSDK 组件，请前往 %@ 查看接入手册";
        // 不存在给出提示
        if (![RXSubPackage sharedSDK].aReddit) {
            NSLog(@"%@", tipStr);
            return;
        }
        
        NSDictionary *shareInfo = response[@"data"][@"content"];
        if (error && !isCustom) {
            self.newShareCallBack(response, error);
            if ([NSString stringWithFormat:@"%ld", [error.responesObject[@"code"] integerValue]].length < 6 && [error.responesObject[@"code"] integerValue] > 2000) {
                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                               bodyDic:@{}
                                                                action:rxlog_error_share
                                                                   url:@""
                                                                  code:error.responesObject[@"code"] == nil ? -123 : [error.responesObject[@"code"] integerValue]
                                                                   msg:error.responesObject[@"msg"]
                                                             thirdType:@"reddit"
                                                             thirdcode:-123
                                                              thirdmsg:@""
                                                               traceid:@""];
            }
            return;
        }
        
        __typeof (self) __weak weakSelf = self;
        self.localShareCallBack = ^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
            NSInteger code = [response[@"code"] integerValue];
            
            NSString *errorMsg = [RXErrorTool getRXErrorMsg:RXShareError_cancel];
            if (!isCustom) {
                BOOL result = YES;
                RXShareConfig *config = (RXShareConfig *)shareConfig;
                if (code == 0) {
                    result = YES;
                } else {
                    result = NO;
                    // 替换错误提示
                    NSDictionary *scheduling = response[@"data"][@"scheduling"];
                    if (scheduling && [scheduling isKindOfClass:[NSDictionary class]] && [NSString rx_isNullToString:[NSString stringWithFormat:@"%@", scheduling[@"scheduling_failed_msg"]]].length > 0) {
                        errorMsg = scheduling[@"scheduling_failed_msg"];
                    }
                    
                    NSMutableDictionary *errorRes = [NSMutableDictionary dictionaryWithDictionary:error.responesObject];
                    if (errorRes && [errorRes isKindOfClass:[NSDictionary class]]) {
                        [errorRes setValue:errorMsg forKey:@"msg"];
                    }
                    error.responesObject = errorRes;
                }
                [weakSelf autoReport:config result:result];
            }
            
            if (error != nil) {
                error.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:error.responesObject];
            }
            
            if (weakSelf.newShareCallBack) {
                weakSelf.newShareCallBack(response, error);
            }
            
            if (error != nil) {
                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                               bodyDic:@{}
                                                                action:rxlog_error_share
                                                                   url:@""
                                                                  code:error.responesObject[@"code"] == nil ? -123 : [error.responesObject[@"code"] integerValue]
                                                                   msg:error.responesObject[@"msg"]
                                                             thirdType:@"reddit"
                                                             thirdcode:error.responesObject[@"thirdcode"] == nil ? -123 : [error.responesObject[@"thirdcode"] integerValue]
                                                              thirdmsg:error.responesObject[@"thirdmsg"]
                                                               traceid:@""];
            }
        };
        
        NSMutableDictionary *notiDic = [NSMutableDictionary dictionary];
        [notiDic setValue:shareInfo forKey:@"shareInfo"];
        [notiDic setValue:self.localShareCallBack forKey:@"callback"];
        [RXNotificationCenter postNoti:rxUserDefault_share_reddit object:nil userInfo:notiDic];
        
    } else if ([platform isEqualToString:@"system"]) {//system分享
        
        if (error && !isCustom) {
            self.newShareCallBack(response, error);
            if ([NSString stringWithFormat:@"%ld", [error.responesObject[@"code"] integerValue]].length < 6 && [error.responesObject[@"code"] integerValue] > 2000) {
                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                               bodyDic:@{}
                                                                action:rxlog_error_share
                                                                   url:@""
                                                                  code:error.responesObject[@"code"] == nil ? -123 : [error.responesObject[@"code"] integerValue]
                                                                   msg:error.responesObject[@"msg"]
                                                             thirdType:@"system"
                                                             thirdcode:-123
                                                              thirdmsg:@""
                                                               traceid:@""];
            }
            return;
        }
        
        NSDictionary *ext = [NSDictionary dictionary];
        if (isCustom) {
            RXCustomShareConfig *config = (RXCustomShareConfig *)shareConfig;
            ext = [NSDictionary dictionaryWithDictionary:config.ext];
        } else {
            RXShareConfig *config = (RXShareConfig *)shareConfig;
            ext = [NSDictionary dictionaryWithDictionary:config.ext];
        }
        RXShareModel *shareModel = [RXShareModel rx_modelWithDictionary:response[@"data"]];
        RXShareContent *shareContent = shareModel.content;
        
        __block NSArray *activityItems = [NSArray array];
        if ([shareContent.material_type isEqualToString:@"text"]) { // 文本
            NSString *textToShare = shareContent.title;
            if (!textToShare) {
                textToShare = @"";
            }
            activityItems = @[textToShare];
            [self systemShareActionWithItems:activityItems complete:^(BOOL success) {
                BOOL result = YES;
                if (success) {
                    result = YES;
                    
                    NSMutableDictionary *successDic = [NSMutableDictionary dictionary];
                    [successDic setValue:@(0) forKey:@"code"];
                    [successDic setValue:@"分享成功" forKey:@"msg"];
                    if (self.newShareCallBack) {
                        self.newShareCallBack(response, nil);
                    }
                } else {
                    result = YES;
                    
                    RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                    NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
                    NSString *rxErrorMsg = [RXErrorTool getRXErrorMsg:RXShareError_third];
                    NSInteger rxErrorCode = RXShareError_third;
                    
                    // 替换错误提示
                    NSDictionary *scheduling = response[@"data"][@"scheduling"];
                    if (scheduling && [scheduling isKindOfClass:[NSDictionary class]] && [NSString rx_isNullToString:[NSString stringWithFormat:@"%@", scheduling[@"scheduling_failed_msg"]]].length > 0) {
                        rxErrorMsg = scheduling[@"scheduling_failed_msg"];
                    }
                    
                    [errorRes setValue:rxErrorMsg forKey:@"msg"];
                    [errorRes setValue:@(rxErrorCode) forKey:@"code"];
                    err.responesObject = errorRes;
                    
                    if (err != nil) {
                        err.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:err.responesObject];
                    }
                    
                    if (self.newShareCallBack) {
                        self.newShareCallBack(nil, err);
                    }
                    
                    if (err != nil) {
                        [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                                       bodyDic:@{}
                                                                        action:rxlog_error_share
                                                                           url:@""
                                                                          code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                                           msg:err.responesObject[@"msg"]
                                                                     thirdType:@"system"
                                                                     thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                                      thirdmsg:err.responesObject[@"thirdmsg"]
                                                                       traceid:@""];
                    }
                }
                
                if (!isCustom) {
                    RXShareConfig *config = (RXShareConfig *)shareConfig;
                    
                    [self autoReport:config result:result];
                }
            }];
        } else if ([shareContent.material_type isEqualToString:@"image"] || [shareContent.material_type isEqualToString:@"langing"] || [shareContent.material_type isEqualToString:@"landing"]) { // 单图
            
            if ([shareContent.image isKindOfClass:[NSString class]] && [[shareContent.image substringToIndex:4] containsString:@"http"]) {
                [self downImage:shareContent.image complete:^(NSData *imgData) {
                    // 不能大于25m，防止误差压缩到23m
                    NSData *imageData = [CHDownImage dataScaleToBytes:23 * 1024 * 1024 withImageData:imgData];
                    if (shareContent.url && shareContent.url.length > 0) {
                        NSString *shareUrl = shareContent.url;
                        UIImage *qrCodeImg = [UIImage rxQRCodeForString:shareUrl size:CGSizeMake(shareContent.width, shareContent.height) fillColor:[UIColor blackColor] iconImage:nil borderSize:shareContent.borderSize];
                        UIImage *bgView = [UIImage imageWithData:imageData];
                        CGFloat fixelW = CGImageGetWidth(bgView.CGImage);
                        CGFloat fixelH = CGImageGetHeight(bgView.CGImage);
                        UIImageView *shareImgView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, fixelW, fixelH)];
                        shareImgView.image = bgView;
                        UIImageView *qrCodeImgView = [[UIImageView alloc] initWithFrame:CGRectMake(shareContent.x, shareContent.y, shareContent.width, shareContent.height)];
                        qrCodeImgView.image = qrCodeImg;
                        [shareImgView addSubview:qrCodeImgView];
                        
                        UIImage *shareImg = [UIImage makeImageWithView:shareImgView withSize:shareImgView.frame.size];
                        NSData *shareImgData = UIImagePNGRepresentation(shareImg);
                        imageData = [CHDownImage dataScaleToBytes:23 * 1024 * 1024 withImageData:shareImgData];
                    }
                    UIImage *fetchImage = [UIImage imageWithData:imageData];
                    if (fetchImage) {
                        activityItems = @[fetchImage];
                    }
                    
                    [self systemShareActionWithItems:activityItems complete:^(BOOL success) {
                        BOOL result = YES;
                        
                        if (success) {
                            result = YES;
                            
                            NSMutableDictionary *successDic = [NSMutableDictionary dictionary];
                            [successDic setValue:@(0) forKey:@"code"];
                            [successDic setValue:@"分享成功" forKey:@"msg"];
                            if (self.newShareCallBack) {
                                self.newShareCallBack(response, nil);
                            }
                        } else {
                            result = NO;
                            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                            NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
                            NSString *rxErrorMsg = [RXErrorTool getRXErrorMsg:RXShareError_cancel];
                            NSInteger rxErrorCode = RXShareError_cancel;
                            
                            // 替换错误提示
                            NSDictionary *scheduling = response[@"data"][@"scheduling"];
                            if (scheduling && [scheduling isKindOfClass:[NSDictionary class]] && [NSString rx_isNullToString:[NSString stringWithFormat:@"%@", scheduling[@"scheduling_failed_msg"]]].length > 0) {
                                rxErrorMsg = scheduling[@"scheduling_failed_msg"];
                            }
                            
                            [errorRes setValue:rxErrorMsg forKey:@"msg"];
                            [errorRes setValue:@(rxErrorCode) forKey:@"code"];
                            err.responesObject = errorRes;
                            
                            if (err != nil) {
                                err.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:err.responesObject];
                            }
                            
                            if (self.newShareCallBack) {
                                self.newShareCallBack(nil, err);
                            }
                            
                            if (err != nil) {
                                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                                               bodyDic:@{}
                                                                                action:rxlog_error_share
                                                                                   url:@""
                                                                                  code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                                                   msg:err.responesObject[@"msg"]
                                                                             thirdType:@"system"
                                                                             thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                                              thirdmsg:err.responesObject[@"thirdmsg"]
                                                                               traceid:@""];
                            }
                        }
                        
                        if (!isCustom) {
                            RXShareConfig *config = (RXShareConfig *)shareConfig;
                            
                            [self autoReport:config result:result];
                        }
                    }];
                }];
            } else {
                // 不能大于25m，防止误差压缩到23m
                NSData *imageData = [CHDownImage dataScaleToBytes:23 * 1024 * 1024 withImageData:UIImageJPEGRepresentation([UIImage imageWithData:[NSData dataWithContentsOfFile:shareContent.image]], 1.0)];
                if (shareContent.url && shareContent.url.length > 0) {
                    NSString *shareUrl = shareContent.url;
                    UIImage *qrCodeImg = [UIImage rxQRCodeForString:shareUrl size:CGSizeMake(shareContent.width, shareContent.height) fillColor:[UIColor blackColor] iconImage:nil borderSize:shareContent.borderSize];
                    UIImage *bgView = [UIImage imageWithData:imageData];
                    CGFloat fixelW = CGImageGetWidth(bgView.CGImage);
                    CGFloat fixelH = CGImageGetHeight(bgView.CGImage);
                    UIImageView *shareImgView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, fixelW, fixelH)];
                    shareImgView.image = bgView;
                    UIImageView *qrCodeImgView = [[UIImageView alloc] initWithFrame:CGRectMake(shareContent.x, shareContent.y, shareContent.width, shareContent.height)];
                    qrCodeImgView.image = qrCodeImg;
                    [shareImgView addSubview:qrCodeImgView];
                    
                    UIImage *shareImg = [UIImage makeImageWithView:shareImgView withSize:shareImgView.frame.size];
                    NSData *shareImgData = UIImagePNGRepresentation(shareImg);
                    imageData = [CHDownImage dataScaleToBytes:23 * 1024 * 1024 withImageData:shareImgData];
                }
                UIImage *fetchImage = [UIImage imageWithData:imageData];
                if (fetchImage) {
                    activityItems = @[fetchImage];
                }
                [self systemShareActionWithItems:activityItems complete:^(BOOL success) {
                    BOOL result = YES;
                    
                    if (success) {
                        result = YES;
                        
                        NSMutableDictionary *successDic = [NSMutableDictionary dictionary];
                        [successDic setValue:@(0) forKey:@"code"];
                        [successDic setValue:@"分享成功" forKey:@"msg"];
                        if (self.newShareCallBack) {
                            self.newShareCallBack(response, nil);
                        }
                    } else {
                        result = NO;
                        RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                        NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
                        NSString *rxErrorMsg = [RXErrorTool getRXErrorMsg:RXShareError_cancel];
                        NSInteger rxErrorCode = RXShareError_cancel;
                        
                        // 替换错误提示
                        NSDictionary *scheduling = response[@"data"][@"scheduling"];
                        if (scheduling && [scheduling isKindOfClass:[NSDictionary class]] && [NSString rx_isNullToString:[NSString stringWithFormat:@"%@", scheduling[@"scheduling_failed_msg"]]].length > 0) {
                            rxErrorMsg = scheduling[@"scheduling_failed_msg"];
                        }
                        
                        [errorRes setValue:rxErrorMsg forKey:@"msg"];
                        [errorRes setValue:@(rxErrorCode) forKey:@"code"];
                        err.responesObject = errorRes;
                        
                        if (err != nil) {
                            err.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:err.responesObject];
                        }
                        
                        if (self.newShareCallBack) {
                            self.newShareCallBack(nil, err);
                        }
                        
                        if (err != nil) {
                            [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                                           bodyDic:@{}
                                                                            action:rxlog_error_share
                                                                               url:@""
                                                                              code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                                               msg:err.responesObject[@"msg"]
                                                                         thirdType:@"system"
                                                                         thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                                          thirdmsg:err.responesObject[@"thirdmsg"]
                                                                           traceid:@""];
                        }
                    }
                    
                    if (!isCustom) {
                        RXShareConfig *config = (RXShareConfig *)shareConfig;
                        
                        [self autoReport:config result:result];
                    }
                }];
            }
        } else if ([shareContent.material_type isEqualToString:@"link"]) { // 链接
            if (shareContent.image) {
                [self downImage:shareContent.image complete:^(NSData *imgData) {
                    // 缩略图不能大于32k，防止误差压缩到30k
                    NSData *imageData = [CHDownImage dataScaleToBytes:30 * 1024 withImageData:imgData];
                    
                    NSString *shareUrl = shareContent.url;
                    NSURL *urlToShare = [NSURL URLWithString:shareUrl];
                    
                    if (imageData) {
                        activityItems = @[[UIImage imageWithData:imageData], urlToShare];
                    } else {
                        activityItems = @[urlToShare];
                    }
                    
                    [self systemShareActionWithItems:activityItems complete:^(BOOL success) {
                        BOOL result = YES;
                        
                        if (success) {
                            result = YES;
                            
                            NSMutableDictionary *successDic = [NSMutableDictionary dictionary];
                            [successDic setValue:@(0) forKey:@"code"];
                            [successDic setValue:@"分享成功" forKey:@"msg"];
                            if (self.newShareCallBack) {
                                self.newShareCallBack(response, nil);
                            }
                        } else {
                            result = NO;
                            
                            RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                            NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
                            NSString *rxErrorMsg = [RXErrorTool getRXErrorMsg:RXShareError_third];
                            NSInteger rxErrorCode = RXShareError_third;
                            
                            // 替换错误提示
                            NSDictionary *scheduling = response[@"data"][@"scheduling"];
                            if (scheduling && [scheduling isKindOfClass:[NSDictionary class]] && [NSString rx_isNullToString:[NSString stringWithFormat:@"%@", scheduling[@"scheduling_failed_msg"]]].length > 0) {
                                rxErrorMsg = scheduling[@"scheduling_failed_msg"];
                            }
                            
                            [errorRes setValue:rxErrorMsg forKey:@"msg"];
                            [errorRes setValue:@(rxErrorCode) forKey:@"code"];
                            err.responesObject = errorRes;
                            
                            if (err != nil) {
                                err.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:err.responesObject];
                            }
                            
                            if (self.newShareCallBack) {
                                self.newShareCallBack(nil, err);
                            }
                            
                            if (err != nil) {
                                [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                                               bodyDic:@{}
                                                                                action:rxlog_error_share
                                                                                   url:@""
                                                                                  code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                                                   msg:err.responesObject[@"msg"]
                                                                             thirdType:@"system"
                                                                             thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                                              thirdmsg:err.responesObject[@"thirdmsg"]
                                                                               traceid:@""];
                            }
                        }
                        
                        if (!isCustom) {
                            RXShareConfig *config = (RXShareConfig *)shareConfig;
                            
                            [self autoReport:config result:result];
                        }
                    }];
                }];
            } else {
                NSString *shareUrl = shareContent.url;
                
                NSURL *urlToShare = [NSURL URLWithString:shareUrl];
                
                activityItems = @[urlToShare];
                [self systemShareActionWithItems:activityItems complete:^(BOOL success) {
                    BOOL result = YES;
                    
                    if (success) {
                        result = YES;
                        
                        NSMutableDictionary *successDic = [NSMutableDictionary dictionary];
                        [successDic setValue:@(0) forKey:@"code"];
                        [successDic setValue:@"分享成功" forKey:@"msg"];
                        if (self.newShareCallBack) {
                            self.newShareCallBack(response, nil);
                        }
                    } else {
                        result = NO;
                        
                        RX_CommonRequestError *err = [[RX_CommonRequestError alloc] init];
                        NSMutableDictionary *errorRes = [NSMutableDictionary dictionary];
                        NSString *rxErrorMsg = [RXErrorTool getRXErrorMsg:RXShareError_third];
                        NSInteger rxErrorCode = RXShareError_third;
                        
                        // 替换错误提示
                        NSDictionary *scheduling = response[@"data"][@"scheduling"];
                        if (scheduling && [scheduling isKindOfClass:[NSDictionary class]] && [NSString rx_isNullToString:[NSString stringWithFormat:@"%@", scheduling[@"scheduling_failed_msg"]]].length > 0) {
                            rxErrorMsg = scheduling[@"scheduling_failed_msg"];
                        }
                        
                        [errorRes setValue:rxErrorMsg forKey:@"msg"];
                        [errorRes setValue:@(rxErrorCode) forKey:@"code"];
                        err.responesObject = errorRes;
                        
                        if (err != nil) {
                            err.responesObject = [RXCommonTool customErrorMsgReplaceThirdCodeOrMsgWithDic:err.responesObject];
                        }
                        
                        if (self.newShareCallBack) {
                            self.newShareCallBack(nil, err);
                        }
                        
                        if (err != nil) {
                            [[RXLogManager sharedSDK] addErrorMsgWithRequestHeader:@{}
                                                                           bodyDic:@{}
                                                                            action:rxlog_error_share
                                                                               url:@""
                                                                              code:err.responesObject[@"code"] == nil ? -123 : [err.responesObject[@"code"] integerValue]
                                                                               msg:err.responesObject[@"msg"]
                                                                         thirdType:@"system"
                                                                         thirdcode:err.responesObject[@"thirdcode"] == nil ? -123 : [err.responesObject[@"thirdcode"] integerValue]
                                                                          thirdmsg:err.responesObject[@"thirdmsg"]
                                                                           traceid:@""];
                        }
                    }
                    
                    if (!isCustom) {
                        RXShareConfig *config = (RXShareConfig *)shareConfig;
                        
                        [self autoReport:config result:result];
                    }
                }];
            }
        }
    }else{
        NSLog(@"未支持的平台");
    }
}

- (void)autoReport:(RXShareConfig *)config
            result:(BOOL)result
{
    [self shareSchedulingReportWithFunc:config.func platform:config.platform region:config.region transmits:config.transmits scheduling_event:result scheduling_type:@"share" properties:config.properties complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
        
    }];
}

- (NSMutableDictionary *)changeKey:(NSMutableDictionary *)dic
{
    if ([dic valueForKey:@"iOSScheme"]) {
        [dic setValue:[dic valueForKey:@"iOSScheme"] forKey:@"protocol_ios"];
    }
    if ([dic valueForKey:@"androidScheme"]) {
        [dic setValue:[dic valueForKey:@"androidScheme"] forKey:@"protocol_android"];
    }
    if ([dic valueForKey:@"materialType"]) {
        [dic setValue:[dic valueForKey:@"materialType"] forKey:@"material_type"];
    }
    
    return dic;
}

#pragma mark - unity uwa通知返回来的性能数据，用于与事件上报一并上传
- (void)reportWithUwaInfo:(NSNotification *)noti {
    if (self.reportFunctionFlag != -1) {//增加此判断是为避免通知全局调用reportWithUwaInfo:时，非分享类的上报导致此处分享上报被调用
        NSData *data = [noti.object dataUsingEncoding:NSUTF8StringEncoding];
        NSDictionary *infoDict = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
        if (infoDict != nil && infoDict.count > 0) {
            NSMutableDictionary *dict = [NSMutableDictionary dictionary];
            [dict setValue:infoDict[@"gpm_fps"] forKey:@"gpm_fps"];
            [dict setValue:infoDict[@"gpm_jank"] forKey:@"gpm_jank"];
            [dict setValue:infoDict[@"gpm_process_memory_mb"] forKey:@"gpm_process_memory_mb"];
            [dict setValue:infoDict[@"gpm_battery_level"] forKey:@"gpm_battery_level"];
            [dict setValue:infoDict[@"gpm_battery_capacity"] forKey:@"gpm_battery_capacity"];
            [dict setValue:infoDict[@"gpm_power"] forKey:@"gpm_power"];
            [dict setValue:infoDict[@"gpm_current"] forKey:@"gpm_current"];
            [dict setValue:infoDict[@"gpm_battery_temp"] forKey:@"gpm_battery_temp"];
            [dict setValue:infoDict[@"gpm_cpu_temp"] forKey:@"gpm_cpu_temp"];
            [dict setValue:infoDict[@"gpm_gpu_temp"] forKey:@"gpm_gpu_temp"];
            NSMutableDictionary *propertiesDict = [NSMutableDictionary dictionaryWithDictionary:[self.reportFunctionDic objectForKey:@"properties"]];
            [propertiesDict addEntriesFromDictionary:dict];
            self.reportFunctionDic[@"properties"] = propertiesDict;
        }
        
        if (self.reportFunctionFlag == 1) {
            NSError *parseError = nil;
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:@[self.reportFunctionDic] options:NSJSONWritingPrettyPrinted  error:&parseError];
            NSString *jsonstr =[[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            NSData *objectData = [jsonstr dataUsingEncoding:NSUTF8StringEncoding];
            NSDictionary *jsonDic = [NSJSONSerialization JSONObjectWithData:objectData
                                                                    options:NSJSONReadingMutableContainers
                                                                      error:&parseError];
            
            RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/data/api/track" andParams:jsonDic requsetMethod:RequestMethod_Post];
        //    request.isGzip = YES;
        //    request.gzipParam = param;
            request.baseUrl = [RXConfig sharedManager].apiDomain;
            
            NSMutableDictionary *header = [RX_CommonNetworkExcuteManager headParams];
            [header setValue:@"1" forKey:@"ruixue-datacount"];
            request.headParams = header;
            
            [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
                NSLog(@"分享上报成功:\n %@", responseObject);
                
                if (self.gameInfo && self.gameInfo.allKeys.count > 0) {
                    self.gameInfo = nil;
                }
                
                if (self.reportComplete) {
                    self.reportComplete(responseObject, nil);
                }
            } failure:^(RX_CommonRequestError * _Nullable error) {
                NSLog(@"分享上报失败:\n %@", error.error);
                if (self.reportComplete) {
                    self.reportComplete(nil, error);
                }
            }];
            
        }else if (self.reportFunctionFlag == 2){
            RX_CommonRequest *request = [[RX_CommonRequest alloc] initWithApiName:@"v1/operationapi/scheduling_report" andParams:self.reportFunctionDic requsetMethod:RequestMethod_Post];
            request.baseUrl = [RXConfig sharedManager].apiDomain;
            request.headParams = [RX_CommonNetworkExcuteManager headParams];
            
            [[RX_CommonNetworkExcuteManager commonRequestClient] beginRequest:request success:^(id  _Nullable responseObject) {
                NSLog(@"分享上报成功:\n %@", responseObject);
                
                if (self.gameInfo && self.gameInfo.allKeys.count > 0) {
                    self.gameInfo = nil;
                }
                
                NSDictionary *shareData = responseObject[@"data"];
                
                NSString *cacheKey = [NSString stringWithFormat:@"%@_%@_%@_%@", self.reportFunc, self.reportPlatform, self.reportRegion, [RXUserUtility valueForKey:keyUserData_openId]];
                
                // 有数据更新缓存，没有数据清除该埋点缓存
                if (shareData && [shareData isKindOfClass:[NSDictionary class]] && shareData.allKeys.count > 0) {
                    // 更新本地缓存
                    // 更新分享数据缓存

                    NSMutableDictionary *allCacheDic = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_shareData]];
            //        NSMutableDictionary *cacheShareData = [NSMutableDictionary dictionaryWithDictionary:allCacheDic[cacheKey]];
                    
            //        if (cacheShareData && cacheShareData.allKeys.count > 0) {
                    NSMutableDictionary *mutShareData = [NSMutableDictionary dictionaryWithDictionary:shareData];
                    for (int i = 0; i < shareData.allKeys.count; i++) {
                        NSDictionary *v = shareData.allValues[i];
                        if (!v || [v isKindOfClass:[NSNull class]] || [v isEqual:[NSNull null]]) {
                            [mutShareData removeObjectForKey:shareData.allKeys[i]];
                        }
                    }
                    NSMutableDictionary *mutRes = [NSMutableDictionary dictionaryWithDictionary:responseObject];
                    if (mutShareData && mutShareData.allKeys.count > 0) {
                        [mutRes setValue:mutShareData forKey:@"data"];
                    }
                    [allCacheDic setValue:mutRes forKey:cacheKey];
                    [RXUserUtility setValue:allCacheDic ForKey:keyUserData_shareData];
            //        }
                    
                    // 更新分享调度缓存
                    NSMutableDictionary *shareSchedulList = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility sharedManager].shareSchedulList];
                    
                    for (int i = 0; i < shareSchedulList.allKeys.count; i++) {
                        NSString *shareSchedulFunc = shareSchedulList.allKeys[i];
                        
                        if ([shareSchedulFunc isEqualToString:self.reportFunc]) {
                            [shareSchedulList setValue:responseObject[@"data"][@"scheduling"] forKey:shareSchedulFunc];
                            [RXUserUtility sharedManager].shareSchedulList = shareSchedulList;
            //                [searchArr addObject:shareDic];
                            break;
                        }
                    }
                } else {
                    // 清空该埋点缓存
                    NSMutableDictionary *shareSchedulList = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility sharedManager].shareSchedulList];
                    
                    for (int i = 0; i < shareSchedulList.allKeys.count; i++) {
                        NSString *shareSchedulFunc = shareSchedulList.allKeys[i];
                        
                        if ([shareSchedulFunc isEqualToString:self.reportFunc]) {
                            [shareSchedulList removeObjectForKey:shareSchedulFunc];
                            [RXUserUtility sharedManager].shareSchedulList = shareSchedulList;
            //                [searchArr addObject:shareDic];
                            break;
                        }
                    }
                    
                    NSMutableDictionary *allCacheDic = [NSMutableDictionary dictionaryWithDictionary:[RXUserUtility valueForKey:keyUserData_shareData]];
                    [allCacheDic removeObjectForKey:cacheKey];
                    [RXUserUtility setValue:allCacheDic ForKey:keyUserData_shareData];
                }
                
                if (self.reportComplete) {
                    self.reportComplete(responseObject, nil);
                }
            } failure:^(RX_CommonRequestError * _Nullable error) {
                NSLog(@"分享上报失败:\n %@", error.error);
                if (self.reportComplete) {
                    self.reportComplete(nil, error);
                }
            }];
        }
        self.reportFunctionFlag = -1;
    }
        
        
}

@end
