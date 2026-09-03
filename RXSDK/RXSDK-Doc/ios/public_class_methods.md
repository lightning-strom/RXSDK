# RXSDK-iOS Public 类方法列表

> 统计日期：2026-05-29
> 
> 同步源文件：RXSDK.h、RXUIKitService.h、RXOSUIKitService.h

---

## RXSDK（统一入口类）

统一 SDK 入口类，封装所有 Public 服务方法，对外暴露的主要接口。

```objc
#pragma mark - 回调类型定义

typedef void(^RXSDKRequestComplete)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error);
typedef void(^RXSDKShareCallBack)(BOOL success);

#pragma mark - 单例

/// 获取 SDK 实例（单例）
+ (instancetype)sharedSDK;

#pragma mark - ==================== 初始化 ====================

/// 初始化 SDK（配置对象）
/// 初始化后会 SDK 会自动激活
/// @param config 初始化配置
/// @param complete 初始化结果回调
- (void)initWithConfig:(RXSdkInitConfig *)config
              complete:(RXSDKRequestComplete)complete;

#pragma mark - ==================== 应用生命周期 ====================

/// 处理 URL Scheme 回调
/// @param app 应用实例
/// @param url 回调 URL
/// @param options 附加参数
/// @return 是否成功处理
/// @note 需在 AppDelegate 的 application:openURL:options: 方法中调用
- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<NSString *, id> *)options;

/// 处理 Universal Link 回调
/// @param application 应用实例
/// @param userActivity 用户活动对象
/// @param restorationHandler 恢复处理回调
/// @return 是否成功处理
/// @note 需在 AppDelegate 的 application:continueUserActivity:restorationHandler: 方法中调用
- (BOOL)application:(UIApplication *)application
continueUserActivity:(NSUserActivity *)userActivity
  restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler;

#pragma mark - ==================== 登录 ====================

/// 登录请求（配置对象方式，推荐）
/// @param config 登录配置
/// @param complete 登录结果回调
///
/// @example 游客登录
/// RXLoginConfig *config = [[RXLoginConfig alloc] init];
/// config.loginType = LoginTypeVisitor;
/// [[RXSDK sharedSDK] loginWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) { }];
///
/// @example 账号密码登录
/// RXLoginConfig *config = [[RXLoginConfig alloc] init];
/// config.loginType = LoginTypeAccount;
/// config.username = @"user";
/// config.password = @"password";
/// [[RXSDK sharedSDK] loginWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) { }];
///
/// @example 验证码登录
/// RXLoginConfig *config = [[RXLoginConfig alloc] init];
/// config.loginType = LoginTypeCapCode;
/// config.username = @"13800138000";
/// config.captchaCode = @"123456";
/// [[RXSDK sharedSDK] loginWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) { }];
///
/// @example 苹果登录
/// RXLoginConfig *config = [[RXLoginConfig alloc] init];
/// config.loginType = LoginTypeApple;
/// [[RXSDK sharedSDK] loginWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) { }];
///
/// @example 二次登录
/// RXLoginConfig *config = [[RXLoginConfig alloc] init];
/// config.loginType = LoginTypeApple;
/// config.loginOpenId = @"xxx";
/// [[RXSDK sharedSDK] loginWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) { }];
- (void)loginWithConfig:(RXLoginConfig *)config
               complete:(RXSDKRequestComplete)complete;

/// 获取法务配置信息
/// @param complete 结果回调
- (void)getLegalInfo:(RXSDKRequestComplete)complete;

/// 自定义请求
/// @param url 接口名
/// @param header 请求头
/// @param body 请求参数
/// @param method 请求类型 1 Post 2 Get
/// @param needLogin 是否需要登录
/// @param complete 结果回调
- (void)createRequestWithUrl:(NSString *)url
                      header:(NSMutableDictionary * _Nullable)header
                        body:(NSMutableDictionary * _Nullable)body
                      method:(NSInteger)method
                   needLogin:(BOOL)needLogin
                    complete:(RXSDKRequestComplete)complete;

#pragma mark - ==================== 配置 ====================

/// 设置子渠道 id
/// @param subChannelId 子渠道 ID
- (void)setSubChannelId:(NSString *)subChannelId;

/// 设置当前语言
/// @param language 语言码，如 en、zh-Hans 等
- (void)setLanguage:(NSString *)language;

/// 设置密码强度等级
/// @param type 密码强度等级枚举
- (void)setPasswordStrength:(RXPasswordStrength)type;

/// 设置密码正则（需先设置密码强度为自定义）
/// @param pattern 密码正则表达式
- (void)setPwdPattern:(NSString *)pattern;

/// 设置商品 id 和超时时间
/// @param productId 商品 ID
/// @param timeout 超时时间
- (void)setIAPProductId:(NSString *)productId timeout:(NSInteger)timeout;

/// 设置游戏角色信息
/// @param roleId 游戏角色 id
/// @param regionTag 区服信息
- (void)setGameInfoWithRoleId:(NSString *)roleId
                    regionTag:(NSString *)regionTag;

/// 设置自定义错误码信息
/// @param msgDic 错误码字典
- (void)configErrorMsg:(NSDictionary *)msgDic;

/// 设置当前地区
/// @param area 地区码
- (void)setArea:(NSString *)area;

#pragma mark - ==================== 信息获取 ====================

/// 获取当前请求域名
- (NSString *)getApiDomain;

/// 获取广告信息
- (NSDictionary *)getAdInfo;

/// 清空广告信息
- (void)deleteAdInfo;

/// 获取 OpenID
- (NSString *)getOpenID;

/// 获取当前 baseUrl
- (NSString *)getFirstBaseUrl;

/// 获取配置数据
- (NSDictionary *)getConfigData;

/// 获取启动参数
- (NSDictionary *)getLaunchOptions;

/// 获取启动参数（SceneDelegate）
- (UISceneConnectionOptions *)getConnectOptions;

#pragma mark - ==================== 验证码 ====================

/// 发送验证码
/// @param type 验证码类型
/// @param target 发送目标（手机或邮箱）
/// @param purpose 用途：register/bindphone/unbindphone/resetpwd/changepwd/bindemail/unbindemail/login
/// @param complete 结果回调
- (void)sendCaptchaWithType:(CaptchaType)type
                     target:(NSString *)target
                    purpose:(NSString *)purpose
                   complete:(RXSDKRequestComplete)complete;

/// 发送验证码（带图形验证）
/// @param type 验证码类型
/// @param target 发送目标
/// @param purpose 用途
/// @param ticket 图形验证凭证
/// @param randstr 图形验证随机串
/// @param complete 结果回调
- (void)sendCaptchaWithType:(CaptchaType)type
                     target:(NSString *)target
                    purpose:(NSString *)purpose
                     ticket:(NSString *)ticket
                    randstr:(NSString *)randstr
                   complete:(RXSDKRequestComplete)complete;

/// 校验验证码
/// @param type 验证码类型
/// @param target 发送目标
/// @param purpose 用途
/// @param captchaCode 验证码
/// @param complete 结果回调
- (void)verifyCaptchaWithType:(CaptchaType)type
                       target:(NSString *)target
                      purpose:(NSString *)purpose
                  captchaCode:(NSString *)captchaCode
                     complete:(RXSDKRequestComplete)complete;

/// 图形验证 UI
/// @param appid 图形验证码 appid
/// @param complete 结果回调
- (void)captchaVerifyUIWithAppid:(NSString *)appid
                        complete:(RXSDKRequestComplete)complete;

#pragma mark - ==================== 账号绑定 ====================

/// 绑定邮箱
/// @param email 邮箱
/// @param password 密码
/// @param captchaCode 验证码
/// @param migrateArgs 账号迁移参数（非必须）
/// @param complete 结果回调
- (void)bindEmailWithEmail:(NSString *)email
                  password:(NSString *)password
               captchaCode:(NSString *)captchaCode
               migrateArgs:(id _Nullable)migrateArgs
                  complete:(RXSDKRequestComplete)complete;

/// 解绑邮箱
/// @param email 邮箱
/// @param captchaCode 验证码
/// @param complete 结果回调
- (void)unBindEmailWithEmail:(NSString *)email
                 captchaCode:(NSString *)captchaCode
                    complete:(RXSDKRequestComplete)complete;

/// 绑定手机
/// @param captchaCode 验证码
/// @param password 密码
/// @param phone 手机号
/// @param migrateArgs 账号迁移参数（非必须）
/// @param complete 结果回调
- (void)bindPhoneWithCaptchaCode:(NSString *)captchaCode
                        password:(NSString *)password
                           phone:(NSString *)phone
                     migrateArgs:(id _Nullable)migrateArgs
                        complete:(RXSDKRequestComplete)complete;

/// 解绑手机
/// @param captchaCode 验证码
/// @param phone 手机号
/// @param complete 结果回调
- (void)unBindPhoneWithCaptchaCode:(NSString *)captchaCode
                             phone:(NSString *)phone
                          complete:(RXSDKRequestComplete)complete;

/// 修改手机号
/// @param oldPhoneCaptcha 当前手机号的 unbindphone 验证码
/// @param newphone 新手机号
/// @param newPhoneCaptcha 新手机号的 bindphone 验证码
/// @param migrateArgs 账号迁移参数（非必须）
/// @param complete 结果回调
- (void)changePhoneWithOldPhoneCaptcha:(NSString *)oldPhoneCaptcha
                              newphone:(NSString *)newphone
                       newPhoneCaptcha:(NSString *)newPhoneCaptcha
                           migrateArgs:(id _Nullable)migrateArgs
                              complete:(RXSDKRequestComplete)complete;

#pragma mark - ==================== 用户信息 ====================

/// 获取用户信息
/// @param complete 结果回调
- (void)getUserInfoWithComplete:(RXSDKRequestComplete)complete;

/// 获取指定用户信息
/// @param params 请求参数 map
/// @param complete 结果回调
- (void)getUserInfoByFieldWithParams:(NSDictionary *)params
                            complete:(RXSDKRequestComplete)complete;

/// 修改用户信息
/// @param avatarUrl 头像 url（非必传）
/// @param nickname 用户昵称（非必传）
/// @param sex 性别 1 男 0 女（非必传）
/// @param region 地区码（非必传）
/// @param ext 扩展参数（非必传）
/// @param complete 结果回调
- (void)updateUserInfo:(NSString *)avatarUrl
              nickname:(NSString *)nickname
                   sex:(NSString *)sex
                region:(NSString *)region
                   ext:(NSDictionary *)ext
              complete:(RXSDKRequestComplete)complete;

#pragma mark - ==================== 密码 ====================

/// 修改密码
/// @param newPwd 新密码
/// @param oldPwd 旧密码
/// @param complete 结果回调
- (void)changePasswordWithNewPwd:(NSString *)newPwd
                          oldPwd:(NSString *)oldPwd
                        complete:(RXSDKRequestComplete)complete;

/// 重置密码
/// @param username 用户名
/// @param password 密码
/// @param captchaCode 验证码
/// @param migrateArgs 账号迁移参数（非必须）
/// @param complete 结果回调
- (void)resetPasswordWithUsername:(NSString *)username
                         password:(NSString *)password
                      captchaCode:(NSString *)captchaCode
                      migrateArgs:(id _Nullable)migrateArgs
                         complete:(RXSDKRequestComplete)complete;

#pragma mark - ==================== 注册 ====================

/// 注册账号
/// @param username 用户名/手机号/邮箱（必须）
/// @param password 密码（必须）
/// @param captchaCode 验证码（手机或邮箱注册必须）
/// @param ext 扩展字段
/// @param complete 结果回调
- (void)registerWithUsername:(NSString * _Nullable)username
                    password:(NSString * _Nullable)password
                 captchaCode:(NSString * _Nullable)captchaCode
                         ext:(NSDictionary * _Nullable)ext
                    complete:(RXSDKRequestComplete)complete;

#pragma mark - ==================== 实名认证 ====================

/// 实名认证
/// @param realName 真实姓名（必须）
/// @param idCard 身份证（必须）
/// @param complete 结果回调
- (void)realAuthWithRealName:(NSString *)realName
                      idCard:(NSString *)idCard
                    complete:(RXSDKRequestComplete)complete;

/// 获取 IIFAA 支付宝授权跳转地址（快速实名）
/// @param appName 应用名称
/// @param thirdPartSchema 第三方回调 schema
/// @param complete 结果回调
- (void)getIIFAARedirectURLWithAppName:(NSString *)appName
                       thirdPartSchema:(NSString *)thirdPartSchema
                              complete:(RXSDKRequestComplete)complete;

/// 查询 IIFAA 认证结果（快速实名）
/// @param retryCount 310039 错误重试次数，传 0 不重试
/// @param complete 结果回调
- (void)getIIFAAResultWithRetryCount:(NSInteger)retryCount
                            complete:(RXSDKRequestComplete)complete;

/// 查询 IIFAA 认证结果（快速实名）
/// @param source 业务场景，deregister 表示注销场景，传空表示正常认证逻辑
/// @param retryCount 310039 错误重试次数，传 0 不重试
/// @param complete 结果回调
- (void)getIIFAAResultWithSource:(NSString *)source
                      retryCount:(NSInteger)retryCount
                        complete:(RXSDKRequestComplete)complete;

#pragma mark - ==================== 设备信息 ====================

/// 获取设备码
- (NSString *)getDeviceCode;

/// 获取当前时区与 UTC 时差
- (NSString *)getTimeZoneOffset;

/// 获取当前手机语言
- (NSString *)getSystemLanguage;

/// 获取 IDFA
+ (NSString *)getIDFA;

#pragma mark - ==================== Token ====================

/// 刷新 Token
/// @param complete 结果回调
- (void)refreshTokenWithComplete:(RXSDKRequestComplete)complete;

/// login_openid 是否失效
/// @return YES 失效，NO 有效
- (BOOL)loginOpenidExpireInvalid;

#pragma mark - ==================== 游戏区服/角色 ====================

/// 查询游戏区服信息
/// @param areaId 区服 ID
/// @param complete 结果回调
- (void)searchGameAreaInfoWithAreaId:(NSString *)areaId
                            complete:(RXSDKRequestComplete)complete;

/// 查询区服列表信息
/// @param complete 结果回调
- (void)searchGameAreaListInfoWithComplete:(RXSDKRequestComplete)complete;

/// 修改游戏区服信息
/// @param areaId 区服 ID
/// @param areaName 区服名
/// @param areaStatus 区服状态
/// @param areaType 区服类型
/// @param extension 扩展字段
/// @param complete 结果回调
- (void)updateGameAreaInfoWithAreaId:(NSString *)areaId
                            areaName:(NSString *)areaName
                          areaStatus:(NSString *)areaStatus
                            areaType:(NSString *)areaType
                           extension:(NSDictionary *)extension
                            complete:(RXSDKRequestComplete)complete;

/// 创建游戏区服
/// @param areaId 区服 ID
/// @param areaName 区服名
/// @param areaStatus 区服状态
/// @param areaType 区服类型
/// @param extension 扩展字段
/// @param complete 结果回调
- (void)createGameAreaWithAreaId:(NSString *)areaId
                        areaName:(NSString *)areaName
                      areaStatus:(NSString *)areaStatus
                        areaType:(NSString *)areaType
                       extension:(NSDictionary *)extension
                        complete:(RXSDKRequestComplete)complete;

/// 删除游戏区服
/// @param areaId 区服 ID
/// @param complete 结果回调
- (void)deleteGameAreaWithAreaId:(NSString *)areaId
                        complete:(RXSDKRequestComplete)complete;

/// 创建游戏角色
/// @param areaId 区服 ID
/// @param characterFaction 角色阵营
/// @param characterId 角色 ID
/// @param characterLevel 角色等级
/// @param characterName 角色名
/// @param characterProfession 角色职业
/// @param characterStatus 角色状态
/// @param characterType 角色类型
/// @param characterVipLevel 角色 VIP 等级
/// @param cpUserId 游戏用户 ID
/// @param extension 扩展字段
/// @param complete 结果回调
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
                             complete:(RXSDKRequestComplete)complete;

/// 修改游戏角色信息
/// @param areaId 区服 ID
/// @param characterFaction 角色阵营
/// @param characterId 角色 ID
/// @param characterLevel 角色等级
/// @param characterName 角色名
/// @param characterProfession 角色职业
/// @param characterStatus 角色状态
/// @param characterType 角色类型
/// @param characterVipLevel 角色 VIP 等级
/// @param cpUserId 游戏用户 ID
/// @param extension 扩展字段
/// @param complete 结果回调
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
                                 complete:(RXSDKRequestComplete)complete;

/// 删除游戏角色
/// @param areaId 区服 ID
/// @param characterId 角色 ID
/// @param cpUserId 游戏用户 ID
/// @param complete 结果回调
- (void)deleteGameCharacterWithAreaId:(NSString *)areaId
                          characterId:(NSString *)characterId
                             cpUserId:(NSString *)cpUserId
                             complete:(RXSDKRequestComplete)complete;

/// 查询账号下角色信息列表
/// @param cpUserId 游戏用户 ID
/// @param complete 结果回调
- (void)searchGameCharacterListInfoWithCpUserId:(NSString *)cpUserId
                                       complete:(RXSDKRequestComplete)complete;

/// 查询账号下某个区服下的角色信息列表
/// @param areaId 区服 ID
/// @param cpUserId 游戏用户 ID
/// @param complete 结果回调
- (void)searchGameCharacterListInAreaWithAreaId:(NSString *)areaId
                                       cpUserId:(NSString *)cpUserId
                                       complete:(RXSDKRequestComplete)complete;

/// 查询具体角色信息
/// @param areaId 区服 ID
/// @param cpUserId 游戏用户 ID
/// @param characterId 角色 ID
/// @param complete 结果回调
- (void)searchGameCharacterInfoWithAreaId:(NSString *)areaId
                                 cpUserId:(NSString *)cpUserId
                              characterId:(NSString *)characterId
                                 complete:(RXSDKRequestComplete)complete;

/// 查询游戏角色信息
/// @param complete 结果回调
- (void)searchGameAccountWithComplete:(RXSDKRequestComplete)complete;

#pragma mark - ==================== 公告/邮件 ====================

/// 获取公告列表
/// @param limit 返回公告条数，范围 1-100
/// @param complete 结果回调
- (void)getAnnouncementWithLimit:(int)limit
                        complete:(RXSDKRequestComplete)complete;

/// 获取临时公告
/// @param complete 结果回调
- (void)getTempNotice:(RXSDKRequestComplete)complete;

/// 获取邮箱列表
/// @param cpUserID 游戏用户 ID
/// @param complete 结果回调
- (void)getEmailListWithCpUserID:(NSString *)cpUserID
                        complete:(RXSDKRequestComplete)complete;

/// 获取邮箱详情
/// @param cpUserID 游戏用户 ID
/// @param emailID 邮件 ID
/// @param complete 结果回调
- (void)getEmailDetailWithCpUserID:(NSString *)cpUserID
                           emailID:(NSInteger)emailID
                          complete:(RXSDKRequestComplete)complete;

/// 领取道具
/// @param cpUserID 游戏用户 ID
/// @param type 1 为领取当前礼物，2 为一键领取所有礼物
/// @param emailID 邮箱 ID
/// @param complete 结果回调
- (void)receivePropsWithCpUserID:(NSString *)cpUserID
                            type:(NSInteger)type
                         emailID:(NSInteger)emailID
                        complete:(RXSDKRequestComplete)complete;

/// 删除邮件
/// @param cpUserID 游戏用户 ID
/// @param type 1 为删除当前邮件，2 为一键删除所有邮件
/// @param emailID 邮箱 ID
/// @param complete 结果回调
- (void)deleteEmailWithCpUserID:(NSString *)cpUserID
                           type:(NSInteger)type
                        emailID:(NSInteger)emailID
                       complete:(RXSDKRequestComplete)complete;

#pragma mark - ==================== 反馈 ====================

/// 创建反馈
/// @param content 反馈内容（必填）
/// @param attachmentsArray 附件地址数组（非必填）
/// @param phone 手机号（必填）
/// @param tagArray 游戏透传标识
/// @param complete 结果回调
- (void)feedbackCreateWithContent:(NSString *)content
                      attachments:(NSArray *)attachmentsArray
                            phone:(NSString *)phone
                             tags:(NSArray *)tagArray
                         complete:(RXSDKRequestComplete)complete;

/// 获取反馈列表
/// @param page 页数（必填）
/// @param size 每页个数（必填）
/// @param status 状态：1 未处理，2 已处理，0 获取所有状态
/// @param complete 结果回调
- (void)getFeedbackListWithPage:(int)page
                           size:(int)size
                         status:(int)status
                       complete:(RXSDKRequestComplete)complete;

/// 获取反馈详情
/// @param feedbackID 反馈 ID
/// @param complete 结果回调
- (void)getFeedbackDetailWithFeedbackID:(int)feedbackID
                               complete:(RXSDKRequestComplete)complete;

/// 领取反馈回复中的道具
/// @param feedbackID 反馈 ID
/// @param complete 结果回调
- (void)feedbackGetpropWithFeedbackID:(int)feedbackID
                             complete:(RXSDKRequestComplete)complete;

/// 获取意见反馈类型
/// @param complete 结果回调
- (void)getFeedbackKindListWithComplete:(RXSDKRequestComplete)complete;

/// 创建意见反馈
/// @param params 参数字典
/// @param complete 结果回调
- (void)createFeedbackWithParams:(NSDictionary *)params
                        complete:(RXSDKRequestComplete)complete;

/// 满意度评价
/// @param params 参数字典
/// @param complete 结果回调
- (void)satisfactionEvaluationWithParams:(NSDictionary *)params
                                complete:(RXSDKRequestComplete)complete;

/// 上报反馈日志
/// @param data 文件二进制
/// @param complete 结果回调
- (void)reportFeedbackLogWithData:(NSData *)data
                         complete:(RXSDKRequestComplete)complete;

#pragma mark - ==================== 福利码 ====================

/// 请求福利码
/// @param autoRefresh 是否自动刷新
/// @param complete 结果回调
- (void)getPromoDisplayKeyWithAutoRefresh:(BOOL)autoRefresh
                                 complete:(RXSDKRequestComplete)complete;

/// 获取福利码
/// @param cdkey 福利码
/// @param complete 结果回调
- (void)exchangePromoCDKEY:(NSString *)cdkey
                  complete:(RXSDKRequestComplete)complete;

#pragma mark - ==================== 商业化 ====================

/// 获取商业化窗口信息
/// @param complete 结果回调
- (void)getOperationSceneWithComplete:(RXSDKRequestComplete)complete;

/// 商业化信息上报
/// @param windowData 窗口数据
/// @param complete 结果回调
- (void)reportWindowExposureWithWindowData:(NSDictionary *)windowData
                                  complete:(RXSDKRequestComplete)complete;

#pragma mark - ==================== 客服 ====================

/// 获取客服消息未读数
/// @param complete 结果回调
- (void)getServiceChatUnreadCount:(RXSDKRequestComplete)complete;

/// 清空客服消息未读数
/// @param complete 结果回调
- (void)clearServiceChatUnreadCount:(RXSDKRequestComplete)complete;

#pragma mark - ==================== 埋点 ====================

/// 用户行为统计
/// @param distinctId 用户唯一标识
/// @param properties 自定义属性
- (void)trackUserActionWithDistinctId:(NSString * _Nullable)distinctId
                           properties:(NSDictionary * _Nullable)properties;

/// 终止用户行为统计
- (void)stopTrackUserAction;

#pragma mark - ==================== 支付（IAP）====================

/// 设置重复下单间隔
/// @param interval 间隔时间（秒）
- (void)setIAPInterval:(NSInteger)interval;

/// 内购支付
/// @param dict 订单参数字典
/// @param complete 结果回调
- (void)iap:(NSDictionary *)dict complete:(RXSDKRequestComplete)complete;

/// 查询是否需要补单
/// @return YES 需要补单，NO 不需要
- (BOOL)checkHasFailedOrder;

/// 补单
/// @param maxCount 最大重试数
/// @param complete 结果回调
- (void)reFailOrderWithMaxCount:(NSInteger)maxCount
                       complete:(RXSDKRequestComplete)complete;

/// 查询商品信息
/// @param productIdArr 商品 ID 数组
/// @param complete 结果回调
- (void)getProductInfoWithProductIdArr:(NSArray *)productIdArr
                              complete:(void(^)(NSArray<SKProduct *> *productInfoList))complete;

/// 获取初始化保存的计费点
- (NSDictionary *)getProductInfo;

/// 获取地区货币符号
/// @param productId 商品 ID
/// @param timeout 超时时间
/// @param complete 结果回调
- (void)getLocaleIdentifierWithProductId:(NSString *)productId
                                 timeout:(NSInteger)timeout
                                complete:(RXSDKRequestComplete)complete;

/// StoreKit2 查询未完成交易
/// @param orderInfo 订单信息
/// @param handle 结果回调
- (void)sk2UnfinishUncompletedTransactionsWithOrderInfo:(NSDictionary *)orderInfo
                                         completeHandle:(RXSDKRequestComplete)handle;

/// 查询订单状态
/// @param orderNo 订单号
/// @param complete 结果回调
- (void)tradeQueryWithOrderNo:(NSString *)orderNo
                     complete:(RXSDKRequestComplete)complete;

#pragma mark - ==================== 分享 ====================

/// 一键分享
/// @param config 分享配置
/// @param complete 结果回调
- (void)share:(RXShareConfig *)config
     complete:(RXSDKRequestComplete)complete;

/// 自定义分享
/// @param config 分享配置
/// @param complete 结果回调
- (void)shareCustom:(RXCustomShareConfig *)config
           complete:(RXSDKRequestComplete)complete;

/// 分享调度初始化
/// @param funcs 埋点数组，传空获取所有
/// @param complete 结果回调
- (void)shareSchedulingInitWithFuncs:(NSArray *)funcs
                            complete:(RXSDKRequestComplete)complete;

/// 获取埋点调度
/// @param funcs 埋点数组，传空获取所有
/// @param complete 结果回调
- (void)getShareSchedulingWithFuncs:(NSArray *)funcs
                           complete:(RXSDKRequestComplete)complete;

/// 获取分享信息
/// @param config 分享配置
/// @param complete 结果回调
- (void)getShareInfoWithConfig:(RXShareConfig *)config
                      complete:(RXSDKRequestComplete)complete;

/// 系统分享
/// @param shareInfo 分享信息（必须）
/// @param complete 结果回调
- (void)SystemShareWithShareInfo:(NSDictionary *)shareInfo
                        complete:(RXSDKShareCallBack)complete;

/// 获取通路配置
/// @param complete 结果回调
- (void)getSharePlatformsWithComplete:(RXSDKRequestComplete)complete;

/// 分享/广告结果上报
/// @param func 埋点标识（必须）
/// @param platform 分享平台
/// @param region 地区码（非必须）
/// @param transmits 透传参数（非必须）
/// @param scheduling_event 上报结果（YES 成功，NO 失败）
/// @param scheduling_type 上报类型（ad/share）
/// @param properties 自定义属性
/// @param complete 结果回调
- (void)shareSchedulingReportWithFunc:(NSString *)func
                             platform:(NSString *)platform
                               region:(NSString *)region
                            transmits:(NSString * _Nullable)transmits
                     scheduling_event:(BOOL)scheduling_event
                      scheduling_type:(NSString *)scheduling_type
                           properties:(NSDictionary * _Nullable)properties
                             complete:(RXSDKRequestComplete)complete;

/// 获取短链接
/// @param url 要生成短链接的 url
/// @param complete 结果回调
- (void)getShortUrl:(NSString *)url
           complete:(RXSDKRequestComplete)complete;

/// 获取短链接（带 og 标签）
/// @param url 要生成短链接的 url
/// @param title 标题
/// @param content 描述
/// @param image 图片地址
/// @param ext 透传参数
/// @param complete 结果回调
- (void)getShortUrl:(NSString *)url
              title:(NSString *)title
            content:(NSString *)content
              image:(NSString *)image
                ext:(NSDictionary *)ext
           complete:(RXSDKRequestComplete)complete;

#pragma mark - ==================== 日志埋点 ====================

/// 埋点配置
/// @param reportTime 上报间隔（秒）
/// @param maxCount 最大缓存数
- (void)trackConfigWithReportTime:(NSInteger)reportTime
                         maxCount:(NSInteger)maxCount;

/// 设置是否为测试数据
/// @param env YES 测试数据，NO 正式数据
- (void)setTrackEnv:(BOOL)env;

/// 数据埋点（批量上报）
/// @param event 埋点标识
/// @param distinctId 用户唯一标识
/// @param properties 自定义属性
- (BOOL)dataTrackWithEvent:(NSString *)event
                distinctId:(NSString * _Nullable)distinctId
                properties:(NSDictionary * _Nullable)properties;

/// 数据埋点（单条上报）
/// @param event 埋点标识
/// @param distinctId 用户唯一标识
/// @param properties 自定义属性
/// @param complete 结果回调
- (BOOL)addLogSingleWithEvent:(NSString *)event
                   distinctId:(NSString * _Nullable)distinctId
                   properties:(NSDictionary * _Nullable)properties
                     complete:(RXSDKRequestComplete)complete;

/// 设置公共属性
/// @param properties 公共属性
- (void)setPublicProperties:(NSDictionary *)properties;

/// 修改公共属性
/// @param properties 公共属性
- (void)updatePublicProperties:(NSDictionary *)properties;

/// 删除公共属性
/// @param properties 公共属性 key 数组
- (void)deletePublicProperties:(NSArray *)properties;

/// 获取 distinctId
- (NSString *)getDistinctId;

/// 获取 SDK 日志
- (NSString *)getSDKLog;

#pragma mark - ==================== 注销账号 ====================

/// 申请注销账号
/// @param config 注销参数配置
/// @param complete 结果回调
- (void)deregisterWithConfig:(RXDeregisterConfig *)config
                    complete:(RXSDKRequestComplete)complete;

/// 撤销注销申请
/// @param complete 结果回调
- (void)deregisterCancelWithComplete:(RXSDKRequestComplete)complete;

#pragma mark - ==================== 评分 ====================

/// 应用内拉起 App Store 评分页面
/// @param appid App ID
/// @param complete 点击完成或取消回调
- (void)inAppStoreReview:(NSString *)appid
                complete:(void(^)(void))complete;

/// 跳转到 App Store 评分
/// @param appid App ID
/// @param writeReview 是否直接拉起评论页
- (void)toAppStoreReview:(NSString *)appid
             writeReview:(BOOL)writeReview;

/// 应用内评分弹框
- (void)alertAppReview;

#pragma mark - ==================== 社交联系服务（RXContactService）====================

/// 上报/更新经纬度坐标
/// @param lon 经度
/// @param lat 纬度
/// @param types 自定义坐标分组类型，字符串数组[@"type1", @"type2"]  必传
/// @param complete 回调
- (void)lbsUpdateWithLon:(double)lon
                     lat:(double)lat
                   types:(NSArray * __nonnull)types
                complete:(RXSDKRequestComplete)complete;

/// 删除经纬度坐标
/// @param types 自定义坐标分组类型，字符串数组[@"type1", @"type2"]
/// @param complete 结果回调
- (void)deleteLocationWithTypes:(NSArray *)types
                       complete:(RXSDKRequestComplete)complete;

/// 获取指定半径内的其他用户信息
/// @param lon 经度
/// @param lat 纬度
/// @param radius 半径（米）
/// @param count 查询数量，（默认0，0为全部）非必传
/// @param page 页数，从1开始
/// @param page_size 每页数量
/// @param type 查询类型
/// @param complete 结果回调
- (void)getRadiusAccountWithLon:(double)lon
                            lat:(double)lat
                         radius:(NSInteger)radius
                          count:(NSInteger)count
                           page:(NSInteger)page
                      page_size:(NSInteger)page_size
                           type:(NSString *)type
                       complete:(RXSDKRequestComplete)complete;

/// 设置用户自定义信息
/// @param custom 自定义信息，最大长度为 512 字节
/// @param complete 结果回调
- (void)setUserCustomWithCustom:(NSString *)custom
                       complete:(RXSDKRequestComplete)complete;

/// 添加自定义关系
/// @param target 目标openId  必须
/// @param types 自定义关系类型列表，value必须为BOOL  必须
/// @param target_remarks 用户给Target设置的备注信息（最长512字符） 非必须
/// @param user_remarks Target给用户设置的备注信息（最长512字符） 非必须
/// @param complete 结果回调
- (void)addRelationWithTarget:(NSString *)target
                        types:(NSDictionary *)types
               target_remarks:(NSString * _Nullable)target_remarks
                 user_remarks:(NSString * _Nullable)user_remarks
                     complete:(RXSDKRequestComplete)complete;

/// 删除自定义关系
/// @param target 目标openId  必须
/// @param types 自定义关系类型列表，value必须为BOOL  必须
/// @param complete 结果回调
- (void)deleteRelationWithTarget:(NSString *)target
                           types:(NSDictionary *)types
                        complete:(RXSDKRequestComplete)complete;

/// 更新用户自定义关系备注
/// @param target 目标openId  必须
/// @param target_remarks 用户给Target设置的备注信息（最长512字符） 必须
/// @param type 自定义关系类型  必须
/// @param complete 结果回调
- (void)updateRemarksWithTarget:(NSString *)target
                 target_remarks:(NSString *)target_remarks
                           type:(NSString *)type
                       complete:(RXSDKRequestComplete)complete;

/// 获取自定义关系列表
/// @param type 自定义关系类型  必须
/// @param complete 结果回调
- (void)getRelationListWithType:(NSString *)type
                       complete:(RXSDKRequestComplete)complete;

/// 添加好友
/// @param target 目标openId  必须
/// @param target_remarks 用户给Target设置的备注信息（最长512字符） 非必须
/// @param user_remarks Target给用户设置的备注信息（最长512字符） 非必须
/// @param complete 结果回调
- (void)addFriendWithTarget:(NSString *)target
             target_remarks:(NSString * _Nullable)target_remarks
               user_remarks:(NSString * _Nullable)user_remarks
                   complete:(RXSDKRequestComplete)complete;

/// 删除好友
/// @param target 目标openId  必须
/// @param complete 结果回调
- (void)deleteFriendWithTarget:(NSString *)target
                      complete:(RXSDKRequestComplete)complete;

/// 更新好友备注
/// @param target 目标openId  必须
/// @param target_remarks 用户给Target设置的备注信息（最长512字符） 必须
/// @param complete 结果回调
- (void)updateFriendRemarkWithTarget:(NSString *)target
                      target_remarks:(NSString *)target_remarks
                            complete:(RXSDKRequestComplete)complete;

/// 获取好友列表
/// @param complete 结果回调
- (void)getFriendListWithComplete:(RXSDKRequestComplete)complete;

/// 判断两用户是否为好友
/// @param target 目标openId  必须
/// @param complete 结果回调
- (void)requestIsFriendWithTarget:(NSString *)target
                         complete:(RXSDKRequestComplete)complete;

/// 判断两用户是否存在某自定关系
/// @param target 目标openId  必须
/// @param type CP自定义关系类型  必须
/// @param complete 结果回调
- (void)requestHasRelationWithTarget:(NSString *)target
                                type:(NSString *)type
                            complete:(RXSDKRequestComplete)complete;

/// 增加用户分数
/// @param rank_id 字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识  必须
/// @param source 增加的分数值  必须
/// @param complete 结果回调
- (void)addscoreWithRank_id:(NSString *)rank_id
                      score:(NSInteger)source
                   complete:(RXSDKRequestComplete)complete;

/// 设置用户分数
/// @param rank_id 字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识  必须
/// @param source 增加的分数值  必须
/// @param complete 结果回调
- (void)setScoreWithRank_id:(NSString *)rank_id
                      score:(NSInteger)source
                   complete:(RXSDKRequestComplete)complete;

/// 查询用户分数
/// @param rank_id 字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识  必须
/// @param target 目标openId  必须
/// @param complete 结果回调
- (void)queryUserRankWithRank_id:(NSString *)rank_id
                          target:(NSString *)target
                        complete:(RXSDKRequestComplete)complete;

/// 获取排行榜列表
/// @param rank_id 字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识  必须
/// @param start_rank 获取排行榜开始排名。取值[1,榜单容量)。可以用于分页加载  必须
/// @param end_rank 获取排行榜结束排名。取值[1,榜单容量]。可以用于分页加载  必须
/// @param complete 结果回调
- (void)getRankListWithRank_id:(NSString *)rank_id
                    start_rank:(NSInteger)start_rank
                      end_rank:(NSInteger)end_rank
                      complete:(RXSDKRequestComplete)complete;

/// 获取好友排行榜列表
/// @param rank_id 字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识  必须
/// @param complete 结果回调
- (void)getFriendRankListWithRank_id:(NSString *)rank_id
                            complete:(RXSDKRequestComplete)complete;
```

---

## RXUIKitService（国内版 UI）

国内版 UI 服务类，提供登录、用户中心、客服等 UI 组件。

```objc
#pragma mark - 单例

/// 获取 SDK 实例（单例）
+ (instancetype)sharedSDK;

#pragma mark - 初始化/配置

/// 初始化
- (void)regist;

/// 配置 logo
/// @param logo 展示的 logo
/// @param titleImage 展示的标题图片
- (void)configLogo:(UIImage *)logo titleImage:(UIImage *)titleImage;

#pragma mark - 登录

/// 调用登录弹窗
/// @param config 登录页基础配置，默认读取后台配置，优先读取代码配置
/// @param complete 登录结果
- (void)showLoginUIWithConfig:(RXLoginUIModel *)config
                     complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 调用登录弹窗
/// @note login_openid 是否失效，YES 失效，NO 有效，config 需要和 showLoginUI 配置相同
/// @param config 登录页基础配置
/// @param complete 登录结果
/// @return YES 失效，NO 有效
- (BOOL)loginOpenidExpireInvalidWithConfig:(RXLoginUIModel *)config
                                  complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 调用登录弹窗
/// @param config 登录页基础配置，默认读取后台配置，优先读取代码配置
/// @param complete 登录结果
/// @return 是否成功展示
- (BOOL)showLoginViewWithConfig:(RXLoginUIModel *)config
                       complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 调用一键登录登录弹窗
/// @note 仅弹出一键登录，不支持配置多登录方式
/// @param config 登录页基础配置，默认读取后台配置，优先读取代码配置
/// @param complete 登录结果
- (void)showAuthLoginViewWithConfig:(RXLoginUIModel *)config
                           complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 调用验证码/账号密码登录弹窗
/// @note 仅弹出验证码/账号密码登录，不支持配置多登录方式
/// @param config 登录页基础配置，默认读取后台配置，优先读取代码配置
/// @param complete 登录结果
- (void)showAccountLoginViewWithConfig:(RXLoginUIModel *)config
                              complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 关闭登录弹窗
- (void)closeLoginView;

#pragma mark - 协议/法务

/// 协议声明
/// @note 全屏 H5 样式
/// @param key 默认展示的条款 key
/// @param keyList 要展示的协议列表
- (void)setProtocolViewWithKey:(NSString *)key
                       keyList:(NSArray *)keyList;

/// 隐私政策弹框
/// @param complete 点击回调（agree: 是否同意）
- (void)userPrivacyPolicyWithComplete:(void(^)(BOOL agree))complete;

#pragma mark - 实名认证

/// 实名认证
/// @param canClose 是否展示关闭按钮，默认不展示
/// @param complete 结果回调
- (void)setRealauthViewWithCanClose:(BOOL)canClose
                           complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 实名认证
/// @param complete 结果回调
- (void)setRealauthViewWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 关闭实名认证弹窗
- (void)closeRealauthView;

#pragma mark - 防沉迷

/// 防沉迷
/// @param title 标题
/// @param des 内容
/// @param btnTitle 按钮标题，点击后 block 回调
/// @param complete 点击回调
- (void)setAntiAdditionViewWithTitle:(NSString *)title
                                 des:(NSString *)des
                            btnTitle:(NSString *)btnTitle
                            complete:(void(^)(void))complete;

#pragma mark - 权限说明

/// 权限说明弹框
/// @param keys 要展示的权限 key，传空展示所有权限
/// @param clickBlock 点击事件回调（status 0 拒绝，1 同意）
- (void)setLimitViewWithKeys:(NSArray * _Nullable)keys
                  clickBlock:(void(^)(NSInteger status))clickBlock;

/// 权限说明弹框
/// @param legalData 法务信息 API 返回的数据
/// @param clickBlock 点击事件回调（status 0 拒绝，1 同意）
- (void)setPermissionViewWithLegalData:(NSDictionary *)legalData
                            clickBlock:(void(^)(NSInteger status))clickBlock;

#pragma mark - 密码

/// 找回密码
/// @param complete 结果回调
- (void)getBackPasswordWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 设置密码
/// @param complete 结果回调
- (void)setPasswordWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 找回密码（扩展方式）
/// @param params 页面配置信息
///   - username: 默认填充的账号（NSString 类型）
///   - account_type: 账号类型提示（1 通用提示，2 手机号提示，3 邮箱提示，可选，默认 2）
///   - password_hint: 输入密码提示文本（可选）
/// @param requestParams 回调函数，params 会将手机号或邮箱、密码等参数返回，由客户端处理业务逻辑，SDK 会根据 return 的 needBreak 参数决定是否继续执行
/// @param complete 结果回调
- (void)getBackPasswordWithParams:(NSDictionary *)params
                    requestParams:(NSMutableDictionary *(^)(NSMutableDictionary *params))requestParams
                         complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

#pragma mark - 用户中心/客服

/// 用户中心
/// @param config 基础配置
/// @param complete 结果回调
- (void)userCenterWithConfig:(RXUserCenterConfig *)config
                    complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 关闭用户中心
- (void)closeUserCenter;

/// 帮助中心
/// @param config 基础配置
/// @param complete 结果回调
- (void)serviceCenterWithConfig:(RXUserCenterConfig *)config
                       complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 客服
/// @param config 基础配置
/// @param complete 结果回调
- (void)chatServiceWithConfig:(RXUserCenterConfig *)config
                     complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

#pragma mark - 账号注销

/// 申请注销
/// @param config 基础配置
/// @param complete 结果回调
- (void)applyForDeregisterWithConfig:(RXUserCenterConfig *)config
                            complete:(void(^)(NSDictionary *response))complete;

/// 撤销注销
/// @param deregisterType login 继续登录，logout 退出登录
/// @param complete 点击回调（DestroyClickType_login: 继续登录，DestroyClickType_logout: 退出登录）
- (void)destroyAccountStatusViewWithDeregisterType:(NSString *)deregisterType
                                          complete:(void(^)(DestroyClickType clickType))complete;

/// 撤销注销（自定义非撤销注销按钮文案）
/// @param btnTitle 按钮标题
/// @param complete 点击回调（撤销注销成功返回 "撤销注销"，否则返回传入的按钮标题）
- (void)destroyAccountStatusViewWithBtnTitle:(NSString *)btnTitle
                                    complete:(void(^)(NSString *btnTitle))complete;

#pragma mark - 分享

/// 分享弹窗
/// @param shareInfo 分享数据，传 nil 则由 SDK 调用埋点数据
/// @param needReport 分享成功后是否需要自动上报
/// @param complete 结果回调
- (void)shareWithShareInfo:(NSDictionary *)shareInfo
                needReport:(BOOL)needReport
                  complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

#pragma mark - WebView

/// 自定义 webView
/// @param url 链接
/// @param title 标题
- (void)openWebViewWithUrl:(NSString *)url
                     title:(NSString *)title;

/// 设置 webView
/// @param webView WKWebView 实例
- (void)setWebView:(WKWebView *)webView;

#pragma mark - 账号同步

/// 同步账号登录记录
/// @param accounts 账号数组（@[@{@"username": @"", @"password": @""}]）
- (void)syncAccounts:(NSArray <NSDictionary *> *)accounts;

#pragma mark - 邮件

/// 展示邮件
/// @param cpUserId CP 方 userID
/// @param complet 结果回调
- (void)showEmailViewWithCpUserId:(NSString *)cpUserId
                     withComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complet;

#pragma mark - 绑定

/// 绑定手机
/// @note 如果已绑定手机会跳转到换绑页面
/// @param complete 绑定或换绑手机操作完成后，无论成功或失败，均执行此 block
- (void)bindPhoneWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

#pragma mark - 公告

/// 展示公告
/// @param limit 展示公告条数
/// @param linkCallBack 如果用户点击了链接，则链接由此返回，后续可使用此链接做业务处理
/// @param ishasCallBack 是否有公告（YES 有，NO 没有）
- (void)showAnnounceViewWithLimit:(int)limit linkCallBack:(void(^)(NSString *link))linkCallBack isHasCallBack:(void(^)(BOOL isHas))ishasCallBack;

/// 展示维护公告
/// @param title 维护公告标题
/// @param content 维护公告内容
/// @param linkCallBack 如果用户点击了链接，则链接由此返回，后续可使用此链接做业务处理
- (void)showAnnounceViewWithTitle:(NSString *)title content:(NSString *)content linkCallBack:(void(^)(NSString *link))linkCallBack;

#pragma mark - 其他

/// 是否允许使用三方键盘
/// @return YES 允许，NO 不允许
- (BOOL)allowExtensionPointIdentifier;
```

---

## RXOSUIKitService（海外版 UI）

海外版 UI 服务类，提供海外版登录、用户中心、客服等 UI 组件。

```objc
#pragma mark - 单例

/// 获取 SDK 实例（单例）
+ (instancetype)sharedSDK;

#pragma mark - 初始化/配置

/// 初始化
- (void)regist;

/// 配置 logo
/// @param logo 展示的 logo
/// @param titleImage 展示的标题图片
- (void)configLogo:(UIImage *)logo titleImage:(UIImage *)titleImage;

#pragma mark - 登录

/// 调用登录弹窗
/// @param config 登录页基础配置，默认读取后台配置，优先读取代码配置
/// @param complete 登录结果
- (void)setLoginViewWithConfig:(RXOSUILoginConfig *)config
                      complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 调用登录弹窗
/// @param config 登录页基础配置，默认读取后台配置，优先读取代码配置
/// @param complete 登录结果
/// @return 是否成功展示
- (BOOL)showLoginViewWithConfig:(RXOSUILoginConfig *)config
                       complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 关闭登录弹窗
- (void)closeLoginView;

#pragma mark - 协议/法务

/// 协议声明
/// @note 全屏 H5 样式
/// @param key 默认展示的条款 key
/// @param keyList 要展示的协议列表
- (void)setProtocolViewWithKey:(NSString *)key
                       keyList:(NSArray *)keyList;

/// 协议
/// @param complete 结果回调
- (void)setPrivacyWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

#pragma mark - 实名认证

/// 实名认证
/// @param canClose 是否展示关闭按钮，默认不展示
/// @param complete 结果回调
- (void)setRealauthViewWithCanClose:(BOOL)canClose
                           complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 实名认证 H5
/// @note 不同地区的实名认证样式不同
/// @param region 地区
/// @param canClose 是否展示关闭按钮，默认不展示
/// @param complete 结果回调
- (void)setRealauthViewH5WithRegion:(NSString *)region
                           canClose:(BOOL)canClose
                           complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

#pragma mark - 防沉迷

/// 防沉迷
/// @param title 标题
/// @param des 内容
/// @param btnTitle 按钮标题，点击后 block 回调
/// @param complete 点击回调
- (void)setAntiAdditionViewWithTitle:(NSString *)title
                                 des:(NSString *)des
                            btnTitle:(NSString *)btnTitle
                            complete:(void(^)(void))complete;

#pragma mark - 密码

/// 找回密码
/// @param complete 结果回调
- (void)getBackPasswordWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 设置密码
/// @param complete 结果回调
- (void)setPasswordWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 找回密码（扩展方式）
/// @param params 页面配置信息
///   - username: 默认填充的账号（NSString 类型）
///   - account_type: 账号类型提示（1 通用提示，2 手机号提示，3 邮箱提示，可选，默认 2）
///   - password_hint: 输入密码提示文本（可选）
/// @param requestParams 回调函数，params 会将手机号或邮箱、密码等参数返回，由客户端处理业务逻辑，SDK 会根据 return 的 needBreak 参数决定是否继续执行
/// @param complete 结果回调
- (void)getBackPasswordWithParams:(NSDictionary *)params
                    requestParams:(NSMutableDictionary *(^)(NSMutableDictionary *params))requestParams
                         complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

#pragma mark - 用户中心/客服

/// 用户中心
/// @param config 基础配置
/// @param complete 结果回调
- (void)userCenterWithConfig:(RXOSUserCenterConfig *)config
                    complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 关闭用户中心
- (void)closeUserCenter;

/// 帮助中心
/// @param config 基础配置
/// @param complete 结果回调
- (void)serviceCenterWithConfig:(RXOSUserCenterConfig *)config
                       complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 客服
/// @param config 基础配置
/// @param complete 结果回调
- (void)chatServiceWithConfig:(RXOSUserCenterConfig *)config
                     complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

#pragma mark - 账号注销

/// 申请注销
/// @param config 基础配置
/// @param complete 结果回调
- (void)applyForDeregisterWithConfig:(RXOSUserCenterConfig *)config
                            complete:(void(^)(NSDictionary *response))complete;

/// 撤销注销
/// @param complete 点击回调（DestroyClickType_login: 继续登录，DestroyClickType_logout: 退出登录）
- (void)destroyAccountStatusView:(void(^)(DestroyClickType clickType))complete;

/// 撤销注销
/// @param deregisterType login 继续登录，logout 退出登录
/// @param complete 点击回调（DestroyClickType_login: 继续登录，DestroyClickType_logout: 退出登录）
- (void)destroyAccountStatusViewWithDeregisterType:(NSString *)deregisterType
                                          complete:(void(^)(DestroyClickType clickType))complete;

/// 撤销注销（自定义非撤销注销按钮文案）
/// @param btnTitle 按钮标题
/// @param complete 点击回调（撤销注销成功返回 "撤销注销"，否则返回传入的按钮标题）
- (void)destroyAccountStatusViewWithBtnTitle:(NSString *)btnTitle
                                    complete:(void(^)(NSString *btnTitle))complete;

#pragma mark - 分享

/// 分享弹窗
/// @param shareInfo 分享数据，传 nil 则由 SDK 调用埋点数据
/// @param needReport 分享成功后是否需要自动上报
/// @param complete 结果回调
- (void)shareWithShareInfo:(NSDictionary *)shareInfo
                needReport:(BOOL)needReport
                  complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

#pragma mark - WebView

/// 自定义 webView
/// @param url 链接
/// @param title 标题
- (void)openWebViewWithUrl:(NSString *)url
                     title:(NSString *)title;

#pragma mark - 账号同步

/// 同步账号登录记录
/// @param accounts 账号数组（@[@{@"username": @"", @"password": @""}]）
- (void)syncAccounts:(NSArray <NSDictionary *> *)accounts;

#pragma mark - 邮件

/// 展示邮件
/// @param cpUserId CP 方 userID
/// @param complet 结果回调
- (void)showEmailViewWithCpUserId:(NSString *)cpUserId
                     withComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complet;

#pragma mark - 绑定

/// 绑定手机
/// @note 如果已绑定手机会跳转到换绑页面
/// @param complete 绑定或换绑手机操作完成后，无论成功或失败，均执行此 block
- (void)bindPhoneWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 绑定邮箱
/// @note 如果已绑定邮箱会跳转到换绑页面
/// @param complete 绑定或换绑邮箱操作完成后，无论成功或失败，均执行此 block
- (void)bindEmailWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

#pragma mark - 公告

/// 展示公告
/// @param limit 展示公告条数
/// @param linkCallBack 如果用户点击了链接，则链接由此返回，后续可使用此链接做业务处理
/// @param ishasCallBack 是否有公告（YES 有，NO 没有）
- (void)showAnnounceViewWithLimit:(int)limit linkCallBack:(void(^)(NSString *link))linkCallBack isHasCallBack:(void(^)(BOOL isHas))ishasCallBack;

/// 展示维护公告
/// @param title 维护公告标题
/// @param content 维护公告内容
/// @param linkCallBack 如果用户点击了链接，则链接由此返回，后续可使用此链接做业务处理
- (void)showAnnounceViewWithTitle:(NSString *)title content:(NSString *)content linkCallBack:(void(^)(NSString *link))linkCallBack;
```

---

## 配置类参数说明

### RXSdkInitConfig（SDK 初始化配置）

| 属性 | 类型 | 必须 | 说明 |
|------|------|------|------|
| cpId | NSString | 是 | CP 唯一 ID，从 7 位数 1000000 开始递增 |
| productId | NSString | 是 | 瑞雪内部的应用 ID，由各 CP 自行在后台创建 |
| channelId | NSString | 是 | 瑞雪内部 CP 某应用的渠道 ID |
| baseUrlList | NSArray | 是 | 瑞雪域名地址数组，格式 https://domain.com/ |
| isLogEnable | BOOL | 否 | 日志开关，true debug 模式，false release 模式，默认 debug |
| usePrivacy | BOOL | 否 | 首次启动是否展示用户隐私授权页面，默认 NO |
| agreementMap | NSMutableDictionary | 否 | 自定义协议键值对，key: 协议 key 或链接，value: 协议名称 |
| agreementTitle | NSString | 否 | 协议标题，默认 "用户协议和隐私政策" |
| isUseDNS | BOOL | 否 | 是否打开 DNS，默认 NO |
| openRacing | BOOL | 否 | 是否开启竞速，默认 NO |
| launchOptions | NSDictionary | 否 | 启动参数 |
| connectionOptions | UISceneConnectionOptions | 否 | SceneDelegate 启动参数 |

---

### RXLoginConfig（API 登录配置）

| 属性 | 类型 | 必须 | 说明 |
|------|------|------|------|
| loginType | LoginType | 是 | 登录类型枚举 |
| username | NSString | 条件 | 账号密码/验证码登录时必传 |
| password | NSString | 条件 | 账号密码登录时必传 |
| captchaCode | NSString | 条件 | 验证码登录时必传 |
| permissions | NSArray | 条件 | Facebook、Line 登录时必传 |
| loginOpenId | NSString | 否 | 二次登录 openId |
| extDic | NSMutableDictionary | 否 | 扩展字段，断线重连时传 reconnect_login: YES |
| signFields | NSArray | 否 | 签名字段数组，如 @[@"nickname", @"avatar"] |
| migrateArgs | id | 否 | 账号迁移参数 |

**LoginType 枚举值：**
- `LoginTypeVisitor` - 游客登录
- `LoginTypeAccount` - 账号密码登录
- `LoginTypeCapCode` - 验证码登录
- `LoginTypeApple` - 苹果登录
- `LoginTypeW` - 微信登录
- `LoginTypeGoogle` - Google 登录
- `LoginTypeFacebook` - Facebook 登录
- `LoginTypeLine` - Line 登录
- `LoginTypeAuth` - 一键登录
- `LoginTypeZalo` - Zalo 登录
- `LoginTypeTikTok` - TikTok 登录
- `LoginTypeSnapChat` - SnapChat 登录

---

### RXLoginUIModel（国内登录 UI 配置）

| 属性 | 类型 | 必须 | 说明 |
|------|------|------|------|
| loginMethods | NSArray | 否 | 登录方式数组：wechat/visitor/apple/account/captchacode/quickphone |
| privacies | NSArray | 否 | 协议地址，0 位用户协议，1 位隐私协议 |
| privacieTitles | NSArray | 否 | 协议显示名称 |
| logoImage | UIImage | 否 | 登录显示的 logo |
| isShowClose | BOOL | 否 | 是否显示关闭按钮，默认 YES |
| loginViewType | NSInteger | 否 | 0 账号密码登录，1 验证码登录，默认 1 |
| keyboardType | NSInteger | 否 | 1 全键盘，2 数字键盘，3 邮箱键盘，默认 1 |
| realAuthRegion | NSString | 否 | 实名认证地区，如 VN（越南） |
| setFirstNeedSetPassword | BOOL | 否 | 验证码登录新用户是否弹出设置密码 |
| setQuickButtonBarVisible | BOOL | 否 | 是否显示底部快速登录按钮，默认 YES |
| setDeregisterShow | BOOL | 否 | 注销中用户登录后是否显示注销窗口 |
| setLoginContinue | BOOL | 否 | 注销中账号是继续登录还是退出 |
| needRealAuth | BOOL | 否 | 未实名用户是否强制实名，默认 YES |
| canCloseRealAuth | BOOL | 否 | 实名认证是否可关闭，默认 YES |
| setCustomParams | NSDictionary | 否 | 自定义参数 |
| setCustomExt | NSDictionary | 否 | 自定义透传参数 |
| wxAppid | NSString | 条件 | 微信登录必传 |
| quickphoneKey | NSString | 条件 | 一键登录必传 |
| guestTitle | NSString | 否 | 快速开始显示名称，默认 "快速开始" |
| googleClientid | NSString | 条件 | Google 登录必传 |
| permissionsArray | NSArray | 条件 | Facebook、Line 登录必传 |
| closeEmailRegister | BOOL | 否 | 是否隐藏邮箱注册按钮 |
| isAudit | BOOL | 否 | 是否为审核模式 |
| signFields | NSArray | 否 | 签名字段数组 |
| migrateArgs | id | 否 | 账号迁移参数 |
| loginOpenid | NSString | 否 | 二次登录 openId |
| method | NSString | 否 | 二次登录方式 |

---

### RXOSUILoginConfig（海外登录 UI 配置）

| 属性 | 类型 | 必须 | 说明 |
|------|------|------|------|
| loginTypes | NSArray | 否 | 登录方式数组：wechat/visitor/apple/account/history |
| privacies | NSArray | 否 | 协议地址 |
| privacieTitles | NSArray | 否 | 协议显示名称 |
| logoImage | UIImage | 否 | 登录显示的 logo |
| setCustomParams | NSDictionary | 否 | 自定义参数 |
| permissionsArray | NSArray | 条件 | Facebook、Line 登录必传 |
| isShowClose | BOOL | 否 | 是否显示关闭按钮，默认 YES |
| loginViewType | NSInteger | 否 | 0 账号密码，1 验证码，默认 1 |
| keyboardType | NSInteger | 否 | 1 全键盘，2 数字，3 邮箱，默认 1 |
| needRealAuth | BOOL | 否 | 是否强制实名，默认 YES |
| canCloseRealAuth | BOOL | 否 | 实名是否可关闭，默认 YES |
| realAuthRegion | NSString | 否 | 实名认证地区 |
| needSetPassword | BOOL | 否 | 新用户是否弹出设置密码 |
| isQuickButtonBarVisible | BOOL | 否 | 是否显示快速登录按钮，默认 YES |
| isShowDeregister | BOOL | 否 | 注销中用户是否显示注销窗口 |
| deregisterType | NSString | 否 | login 继续登录，logout 退出 |
| setLoginContinue | BOOL | 否 | 注销中账号是继续还是退出 |
| language_default | NSString | 否 | 默认语言，默认中文 |
| language_able | NSArray | 否 | 支持的语言数组 |
| isAudit | BOOL | 否 | 是否为审核模式 |
| isHistoryViewEnable | BOOL | 否 | 是否展示登录历史弹窗，默认 YES |
| closeEmailRegister | BOOL | 否 | 是否隐藏邮箱注册 |
| setShowPrivacy | BOOL | 否 | 隐私协议是否显示开关，默认 YES |
| setCustomExt | NSDictionary | 否 | 自定义透传参数 |
| signFields | NSArray | 否 | 签名字段数组 |
| migrateArgs | id | 否 | 账号迁移参数 |
| loginOpenid | NSString | 否 | 二次登录 openId |
| method | NSString | 否 | 二次登录方式 |

---

### RXUserCenterConfig（国内用户中心配置）

| 属性 | 类型 | 必须 | 说明 |
|------|------|------|------|
| logoImage | UIImage | 否 | 显示的 logo |
| transmit_args | NSString | 否 | 透传数据（jsonString 形式） |
| game_user_id | NSString | 否 | 用户的游戏 ID |
| nickname | NSString | 否 | 用户昵称 |
| head_img_url | NSString | 否 | 用户头像 |
| queue_name | NSString | 否 | 客服接入点名称，默认 default |
| setLightTheme | BOOL | 否 | 主题模式，YES 浅色，NO 深色，默认浅色 |
| setSyncInfoEnable | BOOL | 否 | 是否展示同步信息按钮 |
| setConfigParams | NSDictionary | 否 | 用户中心入口配置 |
| orientationVisible | BOOL | 否 | 是否允许横竖屏旋转，默认 NO |

**setConfigParams 结构：**
```objc
@{@"btns": @[@"real_name",        // 实名认证
             @"privacy_policy",   // 隐私政策
             @"acount_cancel",    // 账号注销
             @"phone_management", // 账号管理
             @"change_pwd"]}      // 修改密码
```

---

### RXOSUserCenterConfig（海外用户中心配置）

| 属性 | 类型 | 必须 | 说明 |
|------|------|------|------|
| logoImage | UIImage | 否 | 显示的 logo |
| transmit_args | NSString | 否 | 透传数据（jsonString 形式） |
| game_user_id | NSString | 否 | 用户的游戏 ID |
| nickname | NSString | 否 | 用户昵称 |
| head_img_url | NSString | 否 | 用户头像 |
| queue_name | NSString | 否 | 客服接入点名称，默认 default |
| setLightTheme | BOOL | 否 | 主题模式，默认浅色 |
| setSyncInfoEnable | BOOL | 否 | 是否展示同步信息按钮（不可用） |
| setConfigParams | NSDictionary | 否 | 用户中心入口配置 |
| orientationVisible | BOOL | 否 | 是否允许横竖屏旋转，默认 NO |
| openWebViewLog | BOOL | 否 | 是否开启 webview 数据上报 |

---

### RXDeregisterConfig（账号注销配置）

| 属性 | 类型 | 必须 | 说明 |
|------|------|------|------|
| idCard | NSString | 是 | 身份证号码 |
| realname | NSString | 是 | 真实姓名 |
| cpdata | NSString | 否 | CP 自定义数据 |
| thirdParams | NSDictionary | 否 | 三方渠道透传数据 |

---

### RXShareConfig（一键分享配置）

| 属性 | 类型 | 必须 | 说明 |
|------|------|------|------|
| func | NSString | 是 | 埋点标识 |
| platform | NSString | 是 | 分享平台：wechat/system/facebook/messenger/line/tiktok/zalo |
| region | NSString | 否 | 地区码 |
| transmits | NSString | 否 | 透传参数，原样返回 |
| iOSScheme | NSString | 否 | iOS 唤醒协议 |
| androidScheme | NSString | 否 | Android 唤醒协议 |
| useScheme | NSString | 否 | 是否使用游戏协议，0 不使用，1 使用 |
| readCache | BOOL | 否 | 是否读取缓存，默认 NO |
| shareScene | NSInteger | 否 | 0 好友，1 朋友圈 |
| game_info | NSDictionary | 否 | 客户端透传数据 |
| ext | NSDictionary | 否 | 扩展字段，拼接 url 用 |
| setCustomExt | NSDictionary | 否 | 自定义透传参数 |
| useShortUrl | BOOL | 否 | 是否使用短链接，默认 NO |
| autoReport | BOOL | 否 | 是否自动上报分享结果，默认 YES |
| properties | NSDictionary | 否 | 自动上报时的自定义数据 |

---

### RXCustomShareConfig（自定义分享配置）

| 属性 | 类型 | 必须 | 说明 |
|------|------|------|------|
| platform | NSString | 是 | 分享平台：wechat/system/facebook/messenger/line/tiktok |
| thirdAppid | NSString | 否 | 三方 appid |
| iOSScheme | NSString | 否 | iOS 唤醒协议 |
| androidScheme | NSString | 否 | Android 唤醒协议 |
| useScheme | NSString | 否 | 是否使用游戏协议 |
| materialType | NSString | 是 | 分享类型：text/image/landing/link/video |
| image | NSString | 否 | 图片 url 或本地路径 |
| atlas | NSArray | 否 | 多图数组 |
| video | NSString | 否 | 视频 url 或本地路径 |
| videos | NSArray | 否 | 多视频数组 |
| url | NSString | 否 | 分享链接 |
| title | NSString | 否 | 分享标题 |
| content | NSString | 否 | 分享描述 |
| shareScene | NSInteger | 否 | 0 好友，1 朋友圈 |
| x | NSInteger | 否 | 二维码坐标 x |
| y | NSInteger | 否 | 二维码坐标 y |
| width | NSInteger | 否 | 二维码宽度 |
| height | NSInteger | 否 | 二维码高度 |
| borderSize | NSInteger | 否 | 二维码白边，默认 0 |
| game_info | NSDictionary | 否 | 客户端透传数据 |
| ext | NSDictionary | 否 | 扩展字段 |
| setCustomExt | NSDictionary | 否 | 自定义透传参数 |
