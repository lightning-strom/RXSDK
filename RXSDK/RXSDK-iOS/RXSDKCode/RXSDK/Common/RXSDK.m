//
//  RXSDK.m
//  RXSDK
//
//  Created by Auto Generated on 2026/1/20.
//
//  统一 SDK 入口类，封装所有 Public 服务方法

#import "RXSDK.h"
#import "RXService.h"
#import "RXIAPService.h"
#import "RXShareService.h"
#import "RXLogService.h"
#import "RXDestroyAccountService.h"
#import "RXFeedbackService.h"
#import "RXStoreKitService.h"
#import "RXLoginConfig.h"
#import "RXPrivateService.h"
#import "RXContactService.h"

@implementation RXSDK

#pragma mark - 单例

+ (instancetype)sharedSDK {
    static RXSDK *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[RXSDK alloc] init];
    });
    return instance;
}

#pragma mark - ==================== 初始化 ====================

- (void)initWithConfig:(RXSdkInitConfig *)config
              complete:(RXSDKRequestComplete)complete {
    [[RXService sharedSDK] initWithConfig:config complete:complete];
}

- (void)requestActivatedWithSourceAd:(NSDictionary * _Nullable)sourceAd
                            complete:(RXSDKRequestComplete)complete {
    [[RXService sharedSDK] requestActivatedWithSourceAd:sourceAd complete:complete];
}

#pragma mark - ==================== 应用生命周期 ====================

/**
 * 处理 URL Scheme 回调
 * @param app 应用实例
 * @param url 回调 URL
 * @param options 附加参数
 * @return 是否成功处理
 * @note 需在 AppDelegate 的 application:openURL:options: 方法中调用
 */
- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<NSString *, id> *)options
{
    [[RXPrivateService sharedSDK] application:app openURL:url options:options];
    
    return YES;
}

/**
 * 处理 Universal Link 回调
 * @param application 应用实例
 * @param userActivity 用户活动对象
 * @param restorationHandler 恢复处理回调
 * @return 是否成功处理
 * @note 需在 AppDelegate 的 application:continueUserActivity:restorationHandler: 方法中调用
 */
- (BOOL)application:(UIApplication *)application
continueUserActivity:(NSUserActivity *)userActivity
  restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
    [[RXPrivateService sharedSDK] application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
    
    return YES;
}

#pragma mark - ==================== 登录 ====================

- (void)loginWithConfig:(RXLoginConfig *)config
               complete:(RXSDKRequestComplete)complete {
    [[RXService sharedSDK] loginWithLoginType:config.loginType
                                     username:config.username
                                     password:config.password
                                  captchaCode:config.captchaCode
                                  permissions:config.permissions
                                  loginOpenId:config.loginOpenId
                                       extDic:config.extDic
                                   signFields:config.signFields
                                  migrateArgs:config.migrateArgs
                                     complete:complete];
}

- (void)getLegalInfo:(RXSDKRequestComplete)complete {
    [[RXService sharedSDK] getLegalInfo:complete];
}

- (void)createRequestWithUrl:(NSString *)url
                      header:(NSMutableDictionary * _Nullable)header
                        body:(NSMutableDictionary * _Nullable)body
                      method:(NSInteger)method
                   needLogin:(BOOL)needLogin
                    complete:(RXSDKRequestComplete)complete {
    [[RXService sharedSDK] createRequestWithUrl:url
                                         header:header
                                           body:body
                                         method:method
                                      needLogin:needLogin
                                       complete:complete];
}

#pragma mark - ==================== 配置 ====================

- (void)setSubChannelId:(NSString *)subChannelId {
    [[RXService sharedSDK] setSubChannelId:subChannelId];
}

- (void)setLanguage:(NSString *)language {
    [[RXService sharedSDK] setLanguage:language];
}

- (void)setPasswordStrength:(RXPasswordStrength)type {
    [[RXService sharedSDK] setPasswordStrength:type];
}

- (void)setPwdPattern:(NSString *)pattern {
    [[RXService sharedSDK] setPwdPattern:pattern];
}

- (void)setIAPProductId:(NSString *)productId timeout:(NSInteger)timeout {
    [[RXService sharedSDK] setIAPProductId:productId timeout:timeout];
}

- (void)setGameInfoWithRoleId:(NSString *)roleId
                    regionTag:(NSString *)regionTag {
    [[RXService sharedSDK] setGameInfoWithRoleId:roleId regionTag:regionTag];
}

- (void)configErrorMsg:(NSDictionary *)msgDic {
    [[RXService sharedSDK] configErrorMsg:msgDic];
}

- (void)setArea:(NSString *)area {
    [[RXService sharedSDK] setArea:area];
}

#pragma mark - ==================== 信息获取 ====================

- (NSString *)getApiDomain {
    return [[RXService sharedSDK] getApiDomain];
}

- (NSDictionary *)getAdInfo {
    return [[RXService sharedSDK] getAdInfo];
}

- (void)deleteAdInfo {
    [[RXService sharedSDK] deleteAdInfo];
}

- (NSString *)getOpenID {
    return [[RXService sharedSDK] getOpenID];
}

- (NSString *)getFirstBaseUrl {
    return [[RXService sharedSDK] getFirstBaseUrl];
}

- (NSDictionary *)getConfigData {
    return [[RXService sharedSDK] getConfigData];
}

- (NSDictionary *)getLaunchOptions {
    return [[RXService sharedSDK] getLaunchOptions];
}

- (UISceneConnectionOptions *)getConnectOptions {
    return [[RXService sharedSDK] getConnectOptions];
}

#pragma mark - ==================== 验证码 ====================

- (void)sendCaptchaWithType:(CaptchaType)type
                     target:(NSString *)target
                    purpose:(NSString *)purpose
                   complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] sendCaptchaWithType:type
                                           target:target
                                          purpose:purpose
                                         complete:complete];
}

- (void)sendCaptchaWithType:(CaptchaType)type
                     target:(NSString *)target
                    purpose:(NSString *)purpose
                     ticket:(NSString *)ticket
                    randstr:(NSString *)randstr
                   complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] sendCaptchaWithType:type
                                           target:target
                                          purpose:purpose
                                           ticket:ticket
                                          randstr:randstr
                                         complete:complete];
}

- (void)verifyCaptchaWithType:(CaptchaType)type
                       target:(NSString *)target
                      purpose:(NSString *)purpose
                  captchaCode:(NSString *)captchaCode
                     complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] verifyCaptchaWithType:type
                                             target:target
                                            purpose:purpose
                                        captchaCode:captchaCode
                                           complete:complete];
}

- (void)captchaVerifyUIWithAppid:(NSString *)appid
                        complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] captchaVerifyUIWithAppid:appid complete:complete];
}

#pragma mark - ==================== 账号绑定 ====================

- (void)bindEmailWithEmail:(NSString *)email
                  password:(NSString *)password
               captchaCode:(NSString *)captchaCode
               migrateArgs:(id _Nullable)migrateArgs
                  complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] bindEmailWithEmail:email
                                        password:password
                                     captchaCode:captchaCode
                                     migrateArgs:migrateArgs
                                        complete:complete];
}

- (void)unBindEmailWithEmail:(NSString *)email
                 captchaCode:(NSString *)captchaCode
                    complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] unBindEmailWithEmail:email
                                       captchaCode:captchaCode
                                          complete:complete];
}

- (void)bindPhoneWithCaptchaCode:(NSString *)captchaCode
                        password:(NSString *)password
                           phone:(NSString *)phone
                     migrateArgs:(id _Nullable)migrateArgs
                        complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] bindPhoneWithCaptchaCode:captchaCode
                                              password:password
                                                 phone:phone
                                           migrateArgs:migrateArgs
                                              complete:complete];
}

- (void)unBindPhoneWithCaptchaCode:(NSString *)captchaCode
                             phone:(NSString *)phone
                          complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] unBindPhoneWithCaptchaCode:captchaCode
                                                   phone:phone
                                                complete:complete];
}

- (void)changePhoneWithOldPhoneCaptcha:(NSString *)oldPhoneCaptcha
                              newphone:(NSString *)newphone
                       newPhoneCaptcha:(NSString *)newPhoneCaptcha
                           migrateArgs:(id _Nullable)migrateArgs
                              complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] changePhoneWithOldPhoneCaptcha:oldPhoneCaptcha
                                                   newphone:newphone
                                            newPhoneCaptcha:newPhoneCaptcha
                                                migrateArgs:migrateArgs
                                                   complete:complete];
}

#pragma mark - ==================== 用户信息 ====================

- (void)getUserInfoWithComplete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] getUserInfoWithComplete:complete];
}

- (void)getUserInfoByFieldWithParams:(NSDictionary *)params
                            complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] getUserInfoByFieldWithParams:params
                                                   complete:complete];
}

- (void)updateUserInfo:(NSString *)avatarUrl
              nickname:(NSString *)nickname
                   sex:(NSString *)sex
                region:(NSString *)region
                   ext:(NSDictionary *)ext
              complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] updateUserInfo:avatarUrl
                                    nickname:nickname
                                         sex:sex
                                      region:region
                                         ext:ext
                                    complete:complete];
}

- (void)bindAccountWithExt:(NSDictionary *)ext
                  complete:(RequestComplete)complete
{
    [[RXService sharedSDK] bindAccountWithExt:ext complete:complete];
}

#pragma mark - ==================== 密码 ====================

- (void)changePasswordWithNewPwd:(NSString *)newPwd
                          oldPwd:(NSString *)oldPwd
                        complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] changePasswordWithNewPwd:newPwd
                                                oldPwd:oldPwd
                                              complete:complete];
}

- (void)resetPasswordWithUsername:(NSString *)username
                         password:(NSString *)password
                      captchaCode:(NSString *)captchaCode
                      migrateArgs:(id _Nullable)migrateArgs
                         complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] resetPasswordWithUsername:username
                                               password:password
                                            captchaCode:captchaCode
                                            migrateArgs:migrateArgs
                                               complete:complete];
}

#pragma mark - ==================== 注册 ====================

- (void)registerWithUsername:(NSString * _Nullable)username
                    password:(NSString * _Nullable)password
                 captchaCode:(NSString * _Nullable)captchaCode
                         ext:(NSDictionary * _Nullable)ext
                    complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] registerWithUsername:username
                                          password:password
                                       captchaCode:captchaCode
                                               ext:ext
                                          complete:complete];
}

#pragma mark - ==================== 实名认证 ====================

- (void)realAuthWithRealName:(NSString *)realName
                      idCard:(NSString *)idCard
                    complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] realAuthWithRealName:realName
                                            idCard:idCard
                                          complete:complete];
}

- (void)getIIFAARedirectURLWithAppName:(NSString *)appName
                       thirdPartSchema:(NSString *)thirdPartSchema
                              complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] getIIFAARedirectURLWithAppName:appName
                                             thirdPartSchema:thirdPartSchema
                                                    complete:complete];
}

- (void)getIIFAAResult:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] getIIFAAResult:complete];
}

- (void)getIIFAAResultWithRetryCount:(NSInteger)retryCount
                            complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] getIIFAAResultWithRetryCount:retryCount
                                                  complete:complete];
}

- (void)getIIFAAResultWithSource:(NSString *)source
                      retryCount:(NSInteger)retryCount
                        complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] getIIFAAResultWithSource:source
                                            retryCount:retryCount
                                              complete:complete];
}

#pragma mark - ==================== 设备信息 ====================

- (NSString *)getDeviceCode {
    return [[RXApiService sharedSDK] getDeviceCode];
}

- (NSString *)getTimeZoneOffset {
    return [[RXApiService sharedSDK] getTimeZoneOffset];
}

- (NSString *)getSystemLanguage {
    return [[RXApiService sharedSDK] getSystemLanguage];
}

+ (NSString *)getIDFA {
    return [RXApiService getIDFA];
}

#pragma mark - ==================== Token ====================

- (void)refreshTokenWithComplete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] refreshTokenWithComplete:complete];
}

- (BOOL)loginOpenidExpireInvalid {
    return [[RXApiService sharedSDK] loginOpenidExpireInvalid];
}

#pragma mark - ==================== 游戏区服/角色 ====================

- (void)searchGameAreaInfoWithAreaId:(NSString *)areaId
                            complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] searchGameAreaInfoWithAreaId:areaId complete:complete];
}

- (void)searchGameAreaListInfoWithComplete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] searchGameAreaListInfoWithComplete:complete];
}

- (void)updateGameAreaInfoWithAreaId:(NSString *)areaId
                            areaName:(NSString *)areaName
                          areaStatus:(NSString *)areaStatus
                            areaType:(NSString *)areaType
                           extension:(NSDictionary *)extension
                            complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] updateGameAreaInfoWithAreaId:areaId
                                                  areaName:areaName
                                                areaStatus:areaStatus
                                                  areaType:areaType
                                                 extension:extension
                                                  complete:complete];
}

- (void)createGameAreaWithAreaId:(NSString *)areaId
                        areaName:(NSString *)areaName
                      areaStatus:(NSString *)areaStatus
                        areaType:(NSString *)areaType
                       extension:(NSDictionary *)extension
                        complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] createGameAreaWithAreaId:areaId
                                              areaName:areaName
                                            areaStatus:areaStatus
                                              areaType:areaType
                                             extension:extension
                                              complete:complete];
}

- (void)deleteGameAreaWithAreaId:(NSString *)areaId
                        complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] deleteGameAreaWithAreaId:areaId complete:complete];
}

- (void)createGameCharacterWithAreaId:(NSString *)areaId
                     characterFaction:(NSString *)characterFaction
                          characterId:(NSString *)characterId
                       characterLevel:(NSString *)characterLevel
                        characterName:(NSString *)characterName
                  characterProfession:(NSString *)characterProfession
                      characterStatus:(NSString *)characterStatus
                        characterType:(NSString *)characterType
                    characterVipLevel:(NSString *)characterVipLevel
                             cpUserId:(NSString *)cpUserId
                            extension:(NSDictionary *)extension
                             complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] createGameCharacterWithAreaId:areaId
                                           characterFaction:characterFaction
                                                characterId:characterId
                                             characterLevel:characterLevel
                                              characterName:characterName
                                        characterProfession:characterProfession
                                            characterStatus:characterStatus
                                              characterType:characterType
                                          characterVipLevel:characterVipLevel
                                                   cpUserId:cpUserId
                                                  extension:extension
                                                   complete:complete];
}

- (void)updateGameCharacterInfoWithAreaId:(NSString *)areaId
                         characterFaction:(NSString *)characterFaction
                              characterId:(NSString *)characterId
                           characterLevel:(NSString *)characterLevel
                            characterName:(NSString *)characterName
                      characterProfession:(NSString *)characterProfession
                          characterStatus:(NSString *)characterStatus
                            characterType:(NSString *)characterType
                        characterVipLevel:(NSString *)characterVipLevel
                                 cpUserId:(NSString *)cpUserId
                                extension:(NSDictionary *)extension
                                 complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] updateGameCharacterInfoWithAreaId:areaId
                                               characterFaction:characterFaction
                                                    characterId:characterId
                                                 characterLevel:characterLevel
                                                  characterName:characterName
                                            characterProfession:characterProfession
                                                characterStatus:characterStatus
                                                  characterType:characterType
                                              characterVipLevel:characterVipLevel
                                                       cpUserId:cpUserId
                                                      extension:extension
                                                       complete:complete];
}

- (void)deleteGameCharacterWithAreaId:(NSString *)areaId
                          characterId:(NSString *)characterId
                             cpUserId:(NSString *)cpUserId
                             complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] deleteGameCharacterWithAreaId:areaId
                                                characterId:characterId
                                                   cpUserId:cpUserId
                                                   complete:complete];
}

- (void)searchGameCharacterListInfoWithCpUserId:(NSString *)cpUserId
                                       complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] searchGameCharacterListInfoWithCpUserId:cpUserId
                                                             complete:complete];
}

- (void)searchGameCharacterListInAreaWithAreaId:(NSString *)areaId
                                       cpUserId:(NSString *)cpUserId
                                       complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] searchGameCharacterListInAreaWithAreaId:areaId
                                                             cpUserId:cpUserId
                                                             complete:complete];
}

- (void)searchGameCharacterInfoWithAreaId:(NSString *)areaId
                                 cpUserId:(NSString *)cpUserId
                              characterId:(NSString *)characterId
                                 complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] searchGameCharacterInfoWithAreaId:areaId
                                                       cpUserId:cpUserId
                                                    characterId:characterId
                                                       complete:complete];
}

- (void)searchGameAccountWithComplete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] searchGameAccountWithComplete:complete];
}

#pragma mark - ==================== 公告/邮件 ====================

- (void)getAnnouncementWithLimit:(int)limit
                        complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] getAnnouncementWithLimit:limit complete:complete];
}

- (void)getTempNotice:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] getTempNotice:complete];
}

- (void)getEmailListWithCpUserID:(NSString *)cpUserID
                        complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] getEmailListWithCpUserID:cpUserID complete:complete];
}

- (void)getEmailDetailWithCpUserID:(NSString *)cpUserID
                           emailID:(NSInteger)emailID
                          complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] getEmailDetailWithCpUserID:cpUserID
                                                 emailID:emailID
                                                complete:complete];
}

- (void)receivePropsWithCpUserID:(NSString *)cpUserID
                            type:(NSInteger)type
                         emailID:(NSInteger)emailID
                        complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] receivePropsWithCpUserID:cpUserID
                                                  type:type
                                               emailID:emailID
                                              complete:complete];
}

- (void)deleteEmailWithCpUserID:(NSString *)cpUserID
                           type:(NSInteger)type
                        emailID:(NSInteger)emailID
                       complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] deleteEmailWithCpUserID:cpUserID
                                                 type:type
                                              emailID:emailID
                                             complete:complete];
}

#pragma mark - ==================== 反馈 ====================

- (void)feedbackCreateWithContent:(NSString *)content
                      attachments:(NSArray *)attachmentsArray
                            phone:(NSString *)phone
                             tags:(NSArray *)tagArray
                         complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] feedbackCreateWithContent:content
                                            attachments:attachmentsArray
                                                  phone:phone
                                                   tags:tagArray
                                               complete:complete];
}

- (void)getFeedbackListWithPage:(int)page
                           size:(int)size
                         status:(int)status
                       complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] getFeedbackListWithPage:page
                                                 size:size
                                               status:status
                                             complete:complete];
}

- (void)getFeedbackDetailWithFeedbackID:(int)feedbackID
                               complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] getFeedbackDetailWithFeedbackID:feedbackID complete:complete];
}

- (void)feedbackGetpropWithFeedbackID:(int)feedbackID
                             complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] feedbackGetpropWithFeedbackID:feedbackID complete:complete];
}

- (void)getFeedbackKindListWithComplete:(RXSDKRequestComplete)complete {
    [[RXFeedbackService sharedSDK] getFeedbackKindListWithComplete:complete];
}

- (void)createFeedbackWithParams:(NSDictionary *)params
                        complete:(RXSDKRequestComplete)complete {
    [[RXFeedbackService sharedSDK] createFeedbackWithParams:params complete:complete];
}

- (void)satisfactionEvaluationWithParams:(NSDictionary *)params
                                complete:(RXSDKRequestComplete)complete {
    [[RXFeedbackService sharedSDK] satisfactionEvaluationWithParams:params complete:complete];
}

- (void)reportFeedbackLogWithData:(NSData *)data
                         complete:(RXSDKRequestComplete)complete {
    [[RXFeedbackService sharedSDK] reportFeedbackLogWithData:data complete:complete];
}

#pragma mark - ==================== 福利码 ====================

- (void)getPromoDisplayKeyWithAutoRefresh:(BOOL)autoRefresh
                                 complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] getPromoDisplayKeyWithAutoRefresh:autoRefresh complete:complete];
}

- (void)exchangePromoCDKEY:(NSString *)cdkey
                  complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] exchangePromoCDKEY:cdkey complete:complete];
}

#pragma mark - ==================== 商业化 ====================

- (void)getOperationSceneWithComplete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] getOperationSceneWithComplete:complete];
}

- (void)reportWindowExposureWithWindowData:(NSDictionary *)windowData
                                  complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] reportWindowExposureWithWindowData:windowData complete:complete];
}

#pragma mark - ==================== 客服 ====================

- (void)getServiceChatUnreadCount:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] getServiceChatUnreadCount:complete];
}

- (void)clearServiceChatUnreadCount:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] clearServiceChatUnreadCount:complete];
}

#pragma mark - ==================== 埋点 ====================

- (void)trackUserActionWithDistinctId:(NSString * _Nullable)distinctId
                           properties:(NSDictionary * _Nullable)properties {
    [[RXApiService sharedSDK] trackUserActionWithDistinctId:distinctId properties:properties];
}

- (void)stopTrackUserAction {
    [[RXApiService sharedSDK] stopTrackUserAction];
}

#pragma mark - ==================== 支付（IAP）====================

- (void)setIAPInterval:(NSInteger)interval {
    [[RXIAPService sharedSDK] setInterval:interval];
}

- (void)iap:(NSDictionary *)dict complete:(RXSDKRequestComplete)complete {
    [[RXIAPService sharedSDK] iap:dict complete:complete];
}

- (BOOL)checkHasFailedOrder {
    return [[RXIAPService sharedSDK] checkHasFailedOrder];
}

- (void)reFailOrderWithMaxCount:(NSInteger)maxCount
                       complete:(RXSDKRequestComplete)complete {
    [[RXIAPService sharedSDK] reFailOrderWithMaxCount:maxCount complete:complete];
}

- (void)getProductInfoWithProductIdArr:(NSArray *)productIdArr
                              complete:(void(^)(NSArray<SKProduct *> *productInfoList))complete {
    [[RXIAPService sharedSDK] getProductInfoWithProductIdArr:productIdArr complete:complete];
}

- (NSDictionary *)getProductInfo {
    return [[RXIAPService sharedSDK] getProductInfo];
}

- (void)getLocaleIdentifierWithProductId:(NSString *)productId
                                 timeout:(NSInteger)timeout
                                complete:(RXSDKRequestComplete)complete {
    [[RXIAPService sharedSDK] getLocaleIdentifierWithProductId:productId
                                                       timeout:timeout
                                                      complete:complete];
}

- (void)sk2UnfinishUncompletedTransactionsWithOrderInfo:(NSDictionary *)orderInfo
                                         completeHandle:(RXSDKRequestComplete)handle {
    [[RXIAPService sharedSDK] sk2UnfinishUncompletedTransactionsWithOrderInfo:orderInfo
                                                               completeHandle:handle];
}

- (void)tradeQueryWithOrderNo:(NSString *)orderNo
                     complete:(RXSDKRequestComplete)complete {
    [[RXApiService sharedSDK] tradeQueryWithOrderNo:orderNo complete:complete];
}

#pragma mark - ==================== 分享 ====================

- (void)share:(RXShareConfig *)config
     complete:(RXSDKRequestComplete)complete {
    [[RXShareService sharedSDK] share:config complete:complete];
}

- (void)shareCustom:(RXCustomShareConfig *)config
           complete:(RXSDKRequestComplete)complete {
    [[RXShareService sharedSDK] shareCustom:config complete:complete];
}

- (void)shareSchedulingInitWithFuncs:(NSArray *)funcs
                            complete:(RXSDKRequestComplete)complete {
    [[RXShareService sharedSDK] shareSchedulingInitWithFuncs:funcs complete:complete];
}

- (void)getShareSchedulingWithFuncs:(NSArray *)funcs
                           complete:(RXSDKRequestComplete)complete {
    [[RXShareService sharedSDK] getShareSchedulingWithFuncs:funcs complete:complete];
}

- (void)getShareInfoWithConfig:(RXShareConfig *)config
                      complete:(RXSDKRequestComplete)complete {
    [[RXShareService sharedSDK] getShareInfoWithConfig:config complete:complete];
}

- (void)SystemShareWithShareInfo:(NSDictionary *)shareInfo
                        complete:(RXSDKShareCallBack)complete {
    [[RXShareService sharedSDK] SystemShareWithShareInfo:shareInfo complete:complete];
}

- (void)getSharePlatformsWithComplete:(RXSDKRequestComplete)complete {
    [[RXShareService sharedSDK] getSharePlatformsWithComplete:complete];
}

- (void)shareSchedulingReportWithFunc:(NSString *)func
                             platform:(NSString *)platform
                               region:(NSString *)region
                            transmits:(NSString * _Nullable)transmits
                     scheduling_event:(BOOL)scheduling_event
                      scheduling_type:(NSString *)scheduling_type
                           properties:(NSDictionary * _Nullable)properties
                             complete:(RXSDKRequestComplete)complete {
    [[RXShareService sharedSDK] shareSchedulingReportWithFunc:func
                                                     platform:platform
                                                       region:region
                                                    transmits:transmits
                                             scheduling_event:scheduling_event
                                              scheduling_type:scheduling_type
                                                   properties:properties
                                                     complete:complete];
}

- (void)getShortUrl:(NSString *)url
           complete:(RXSDKRequestComplete)complete {
    [[RXShareService sharedSDK] getShortUrl:url complete:complete];
}

- (void)getShortUrl:(NSString *)url
              title:(NSString *)title
            content:(NSString *)content
              image:(NSString *)image
                ext:(NSDictionary *)ext
           complete:(RXSDKRequestComplete)complete {
    [[RXShareService sharedSDK] getShortUrl:url
                                      title:title
                                    content:content
                                      image:image
                                        ext:ext
                                   complete:complete];
}

#pragma mark - ==================== 日志埋点 ====================

- (void)trackConfigWithReportTime:(NSInteger)reportTime
                         maxCount:(NSInteger)maxCount {
    [[RXLogService sharedSDK] trackConfigWithReportTime:reportTime maxCount:maxCount];
}

- (void)setTrackEnv:(BOOL)env {
    [[RXLogService sharedSDK] setTrackEnv:env];
}

- (BOOL)dataTrackWithEvent:(NSString *)event
                distinctId:(NSString * _Nullable)distinctId
                properties:(NSDictionary * _Nullable)properties {
    return [[RXLogService sharedSDK] dataTrackWithEvent:event
                                             distinctId:distinctId
                                             properties:properties];
}

- (BOOL)addLogSingleWithEvent:(NSString *)event
                   distinctId:(NSString * _Nullable)distinctId
                   properties:(NSDictionary * _Nullable)properties
                     complete:(RXSDKRequestComplete)complete {
    return [[RXLogService sharedSDK] addLogSingleWithEvent:event
                                                distinctId:distinctId
                                                properties:properties
                                                  complete:complete];
}

- (void)setPublicProperties:(NSDictionary *)properties {
    [[RXLogService sharedSDK] setPublicProperties:properties];
}

- (void)updatePublicProperties:(NSDictionary *)properties {
    [[RXLogService sharedSDK] updatePublicProperties:properties];
}

- (void)deletePublicProperties:(NSArray *)properties {
    [[RXLogService sharedSDK] deletePublicProperties:properties];
}

- (NSString *)getDistinctId {
    return [[RXLogService sharedSDK] getDistinctId];
}

- (NSString *)getSDKLog {
    return [[RXLogService sharedSDK] getSDKLog];
}

#pragma mark - ==================== 注销账号 ====================

- (void)deregisterWithConfig:(RXDeregisterConfig *)config
                    complete:(RXSDKRequestComplete)complete {
    [[RXDestroyAccountService sharedSDK] deregisterWithConfig:config complete:complete];
}

- (void)deregisterCancelWithComplete:(RXSDKRequestComplete)complete {
    [[RXDestroyAccountService sharedSDK] deregisterCancelWithComplete:complete];
}

#pragma mark - ==================== 评分 ====================

- (void)inAppStoreReview:(NSString *)appid
                complete:(void(^)(void))complete {
    [[RXStoreKitService sharedSDK] inAppStoreReview:appid complete:complete];
}

- (void)toAppStoreReview:(NSString *)appid
             writeReview:(BOOL)writeReview {
    [[RXStoreKitService sharedSDK] toAppStoreReview:appid writeReview:writeReview];
}

- (void)alertAppReview {
    [[RXStoreKitService sharedSDK] alertAppReview];
}

#pragma mark - ==================== 社交联系服务（RXContactService）====================

- (void)lbsUpdateWithLon:(double)lon
                     lat:(double)lat
                   types:(NSArray * __nonnull)types
                complete:(RXSDKRequestComplete)complete {
    [[RXContactService sharedSDK] lbsUpdateWithLon:lon lat:lat types:types complete:complete];
}

- (void)deleteLocationWithTypes:(NSArray *)types
                       complete:(RXSDKRequestComplete)complete {
    [[RXContactService sharedSDK] deleteLocationWithTypes:types complete:complete];
}

- (void)getRadiusAccountWithLon:(double)lon
                            lat:(double)lat
                         radius:(NSInteger)radius
                          count:(NSInteger)count
                           page:(NSInteger)page
                      page_size:(NSInteger)page_size
                           type:(NSString *)type
                       complete:(RXSDKRequestComplete)complete {
    [[RXContactService sharedSDK] getRadiusAccountWithLon:lon
                                                      lat:lat
                                                   radius:radius
                                                    count:count
                                                     page:page
                                                page_size:page_size
                                                     type:type
                                                 complete:complete];
}

- (void)setUserCustomWithCustom:(NSString *)custom
                       complete:(RXSDKRequestComplete)complete {
    [[RXContactService sharedSDK] setUserCustomWithCustom:custom complete:complete];
}

- (void)addRelationWithTarget:(NSString *)target
                        types:(NSDictionary *)types
               target_remarks:(NSString * _Nullable)target_remarks
                 user_remarks:(NSString * _Nullable)user_remarks
                     complete:(RXSDKRequestComplete)complete {
    [[RXContactService sharedSDK] addRelationWithTarget:target
                                                  types:types
                                         target_remarks:target_remarks
                                           user_remarks:user_remarks
                                               complete:complete];
}

- (void)deleteRelationWithTarget:(NSString *)target
                           types:(NSDictionary *)types
                        complete:(RXSDKRequestComplete)complete {
    [[RXContactService sharedSDK] deleteRelationWithTarget:target types:types complete:complete];
}

- (void)updateRemarksWithTarget:(NSString *)target
                 target_remarks:(NSString *)target_remarks
                           type:(NSString *)type
                       complete:(RXSDKRequestComplete)complete {
    [[RXContactService sharedSDK] updateRemarksWithTarget:target
                                           target_remarks:target_remarks
                                                     type:type
                                                 complete:complete];
}

- (void)getRelationListWithType:(NSString *)type
                       complete:(RXSDKRequestComplete)complete {
    [[RXContactService sharedSDK] getRelationListWithType:type complete:complete];
}

- (void)addFriendWithTarget:(NSString *)target
             target_remarks:(NSString * _Nullable)target_remarks
               user_remarks:(NSString * _Nullable)user_remarks
                   complete:(RXSDKRequestComplete)complete {
    [[RXContactService sharedSDK] addFriendWithTarget:target
                                       target_remarks:target_remarks
                                         user_remarks:user_remarks
                                             complete:complete];
}

- (void)deleteFriendWithTarget:(NSString *)target
                      complete:(RXSDKRequestComplete)complete {
    [[RXContactService sharedSDK] deleteFriendWithTarget:target complete:complete];
}

- (void)updateFriendRemarkWithTarget:(NSString *)target
                      target_remarks:(NSString *)target_remarks
                            complete:(RXSDKRequestComplete)complete {
    [[RXContactService sharedSDK] updateFriendRemarkWithTarget:target
                                                target_remarks:target_remarks
                                                      complete:complete];
}

- (void)getFriendListWithComplete:(RXSDKRequestComplete)complete {
    [[RXContactService sharedSDK] getFriendListWithComplete:complete];
}

- (void)requestIsFriendWithTarget:(NSString *)target
                         complete:(RXSDKRequestComplete)complete {
    [[RXContactService sharedSDK] requestIsFriendWithTarget:target complete:complete];
}

- (void)requestHasRelationWithTarget:(NSString *)target
                                type:(NSString *)type
                            complete:(RXSDKRequestComplete)complete {
    [[RXContactService sharedSDK] requestHasRelationWithTarget:target type:type complete:complete];
}

- (void)addscoreWithRank_id:(NSString *)rank_id
                      score:(NSInteger)source
                   complete:(RXSDKRequestComplete)complete {
    [[RXContactService sharedSDK] addscoreWithRank_id:rank_id score:source complete:complete];
}

- (void)setScoreWithRank_id:(NSString *)rank_id
                      score:(NSInteger)source
                   complete:(RXSDKRequestComplete)complete {
    [[RXContactService sharedSDK] setScoreWithRank_id:rank_id score:source complete:complete];
}

- (void)queryUserRankWithRank_id:(NSString *)rank_id
                          target:(NSString *)target
                        complete:(RXSDKRequestComplete)complete {
    [[RXContactService sharedSDK] queryUserRankWithRank_id:rank_id target:target complete:complete];
}

- (void)getRankListWithRank_id:(NSString *)rank_id
                    start_rank:(NSInteger)start_rank
                      end_rank:(NSInteger)end_rank
                      complete:(RXSDKRequestComplete)complete {
    [[RXContactService sharedSDK] getRankListWithRank_id:rank_id
                                              start_rank:start_rank
                                                end_rank:end_rank
                                                complete:complete];
}

- (void)getFriendRankListWithRank_id:(NSString *)rank_id
                            complete:(RXSDKRequestComplete)complete {
    [[RXContactService sharedSDK] getFriendRankListWithRank_id:rank_id complete:complete];
}

@end
