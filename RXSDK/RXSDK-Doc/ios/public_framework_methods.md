# RXSDK-iOS 框架 Public API 列表

> 统计日期：2026-02-05
> 
> 本文档整理 RXSDK-iOS 项目中各个框架的 Public API 及调用方式

---

## 目录

- [RXSDK_Pure（核心框架）](#rxsdk_pure核心框架)
  - [RXService（核心服务类）](#rxservice核心服务类)
  - [RXApiService（API 服务类）](#rxapiserviceapi-服务类)
  - [RXIAPService（支付服务类）](#rxiapservice支付服务类)
  - [RXShareService（分享服务类）](#rxshareservice分享服务类)
  - [RXLogService（日志埋点服务类）](#rxlogservice日志埋点服务类)
  - [RXContactService（社交联系服务类）](#rxcontactservice社交联系服务类)
  - [RXDestroyAccountService（注销服务类）](#rxdestroyaccountservice注销服务类)
  - [RXFeedbackService（反馈服务类）](#rxfeedbackservice反馈服务类)
  - [RXUpdateCheckService（版本检查服务类）](#rxupdatecheckservice版本检查服务类)
  - [RXGameInfoService（游戏信息服务类）](#rxgameinfoservice游戏信息服务类)
- [RXUIKit（国内版 UI 框架）](#rxuikit国内版-ui-框架)
- [RXOSUIKit（海外版 UI 框架）](#rxosuikit海外版-ui-框架)
- [组件框架](#组件框架)
  - [RXAdjustSDK（Adjust 归因）](#rxadjustsdkadjust-归因)
  - [RXASAKitSDK（Apple Search Ads）](#rxasakitsdkapple-search-ads)
  - [RXBDASignalSDK（巨量引擎归因）](#rxbdasignalsdk巨量引擎归因)
  - [RXGDTSDK（广点通归因）](#rxgdtsdk广点通归因)
  - [RXOpeninstallSDK（Openinstall 归因）](#rxopeninstallsdkopeninstall-归因)
  - [RXWXSDK（微信）](#rxwxsdk微信)
  - [RXContactSDK（社交联系）](#rxcontactsdk社交联系)
  - [RXLineSDK（Line）](#rxlinesdkline)
  - [RXFacebookSDK（Facebook）](#rxfacebooksdkfacebook)
  - [RXGoogleSDK（Google）](#rxgooglesdkgoogle)
  - [RXPushSDK（推送）](#rxpushsdk推送)
  - [RXFirebaseSDK（Firebase）](#rxfirebasesdkfirebase)
  - [RXSnapChatSDK（SnapChat）](#rxsnapchatsdksnapchat)
  - [RXGameCenterSDK（Game Center）](#rxgamecentersdkgame-center)
  - [RXAliCloudDNSSDK（阿里云 DNS）](#rxalicloudsdkaliyun-dns)
  - [RXTecentCloudDNSSDK（腾讯云 DNS）](#rxtecentcloudsdnssdk腾讯云-dns)
  - [RXLanguageKit（国际化语言）](#rxlanguagekit国际化语言)
  - [RXUniPinSDK（UniPin 支付）](#rxunipinsdkunipin-支付)
  - [RXAddressBookSDK（通讯录）](#rxaddressbooksdk通讯录)
  - [RXAppListSDK（App 列表）](#rxapplistsdkapp-列表)
  - [RXGPMSDK（性能监控）](#rxgpmsdk性能监控)
  - [RXFeedbackSDK（反馈 UI）](#rxfeedbacksdk反馈-ui)
  - [RXInstagramSDK（Instagram）](#rxinstagramsdkinstagram)
  - [RXRedditSDK（Reddit）](#rxredditsdkreddit)

---

## RXSDK_Pure（核心框架）

RXSDK_Pure 是 RXSDK 的核心框架，包含所有基础服务类。

### RXService（核心服务类）

初始化、登录、配置等核心功能。

#### 获取实例

```objc
[RXService sharedSDK]
```

#### 初始化

```objc
#pragma mark - 初始化

/// 初始化 SDK（配置对象方式，推荐）
/// @param config 初始化配置
/// @param complete 初始化结果回调
- (void)initWithConfig:(RXSdkInitConfig *)config
              complete:(RequestComplete)complete;

/// 初始化 SDK（参数方式）
/// @param productId 产品 ID
/// @param channelId 渠道 ID
/// @param cpid 瑞雪分配的唯一 ID
/// @param baseUrlList 请求域名队列
/// @param complete 初始化结果回调
- (void)initWithProductId:(NSString *)productId
                channelId:(NSString *)channelId
                     cpid:(NSString *)cpid
              baseUrlList:(NSArray *)baseUrlList
                 complete:(RequestComplete)complete;

/// 初始化 SDK（profile 方式）
/// @param profile 初始化配置表（jsonString 格式）
/// @param complete 初始化结果回调
- (void)initWithProfile:(NSString *)profile
               complete:(RequestComplete)complete;

/// 设置初始化参数（仅保存参数，不激活）
- (void)setInitParamsWithProductId:(NSString *)productId
                         channelId:(NSString *)channelId
                              cpid:(NSString *)cpid
                       baseUrlList:(NSArray *)baseUrlList
                          complete:(RequestComplete)complete;

/// 用户激活
/// @param sourceAd 扩展信息
- (void)requestActivatedWithSourceAd:(NSDictionary * _Nullable)sourceAd
                            complete:(RequestComplete)complete;
```

#### 调用示例

```objc
// 方式1：配置对象初始化（推荐）
RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
config.productId = @"your_product_id";
config.channelId = @"your_channel_id";
config.cpid = @"your_cpid";
config.baseUrlList = @[@"https://api.example.com"];

[[RXService sharedSDK] initWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"初始化失败: %@", error.msg);
    } else {
        NSLog(@"初始化成功: %@", response);
    }
}];

// 方式2：参数初始化
[[RXService sharedSDK] initWithProductId:@"your_product_id"
                               channelId:@"your_channel_id"
                                    cpid:@"your_cpid"
                             baseUrlList:@[@"https://api.example.com"]
                                complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    // 处理结果
}];
```

#### 登录

```objc
#pragma mark - 登录

/// 登录请求（推荐）
/// @param loginType 登录类型
/// @param username 用户名（账号/手机/邮箱）
/// @param password 密码
/// @param captchaCode 验证码
/// @param permissions 登录权限数组（Facebook/Line 时必传）
/// @param loginOpenId 二次登录 openId
/// @param extDic 扩展字段
/// @param signFields 签名字段
/// @param migrateArgs 账号迁移参数
/// @param complete 登录回调
- (void)loginWithLoginType:(LoginType)loginType
                  username:(NSString * _Nullable)username
                  password:(NSString * _Nullable)password
               captchaCode:(NSString * _Nullable)captchaCode
               permissions:(NSArray * _Nullable)permissions
               loginOpenId:(NSString * _Nullable)loginOpenId
                    extDic:(NSMutableDictionary * _Nullable)extDic
                signFields:(NSArray * _Nullable)signFields
               migrateArgs:(id _Nullable)migrateArgs
                  complete:(RequestComplete)complete;

/// 获取法务配置信息
- (void)getLegalInfo:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 自定义请求
/// @param url 接口名
/// @param header 请求头
/// @param body 请求参数
/// @param method 请求类型 1-Post 2-Get
/// @param needLogin 是否需要登录
- (void)createRequestWithUrl:(NSString *)url
                      header:(NSMutableDictionary * _Nullable)header
                        body:(NSMutableDictionary * _Nullable)body
                      method:(NSInteger)method
                   needLogin:(BOOL)needLogin
                    complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;
```

#### 调用示例

```objc
// 游客登录
[[RXService sharedSDK] loginWithLoginType:LoginTypeVisitor
                                 username:nil
                                 password:nil
                              captchaCode:nil
                              permissions:nil
                              loginOpenId:nil
                                   extDic:nil
                               signFields:nil
                              migrateArgs:nil
                                 complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"登录失败: %@", error.msg);
    } else {
        NSLog(@"登录成功: %@", response);
    }
}];

// 账号密码登录
[[RXService sharedSDK] loginWithLoginType:LoginTypeAccount
                                 username:@"user@example.com"
                                 password:@"password123"
                              captchaCode:nil
                              permissions:nil
                              loginOpenId:nil
                                   extDic:nil
                               signFields:nil
                              migrateArgs:nil
                                 complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    // 处理结果
}];

// 验证码登录
[[RXService sharedSDK] loginWithLoginType:LoginTypeCapCode
                                 username:@"13800138000"
                                 password:nil
                              captchaCode:@"123456"
                              permissions:nil
                              loginOpenId:nil
                                   extDic:nil
                               signFields:nil
                              migrateArgs:nil
                                 complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    // 处理结果
}];

// 二次登录
[[RXService sharedSDK] loginWithLoginType:LoginTypeAccount
                                 username:nil
                                 password:nil
                              captchaCode:nil
                              permissions:nil
                              loginOpenId:@"saved_login_openid"
                                   extDic:nil
                               signFields:nil
                              migrateArgs:nil
                                 complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    // 处理结果
}];
```

#### 配置

```objc
#pragma mark - 配置

/// 设置子渠道 ID
- (void)setSubChannelId:(NSString *)subChannelId;

/// 设置当前语言
/// @param language 语言码（如 en、zh-Hans）
- (void)setLanguage:(NSString *)language;

/// 设置密码强度等级
- (void)setPasswordStrength:(RXPasswordStrength)type;

/// 设置密码正则（需先设置密码强度为自定义）
- (void)setPwdPattern:(NSString *)pattern;

/// 设置商品 ID 和超时时间
- (void)setIAPProductId:(NSString *)productId timeout:(NSInteger)timeout;

/// 设置游戏角色信息
- (void)setGameInfoWithRoleId:(NSString *)roleId
                    regionTag:(NSString *)regionTag;

/// 设置自定义错误码信息
- (void)configErrorMsg:(NSDictionary *)msgDic;

/// 设置当前地区
- (void)setArea:(NSString *)area;
```

#### 信息获取

```objc
#pragma mark - 信息获取

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
```

---

### RXApiService（API 服务类）

验证码、账号绑定、用户信息、密码等 API 服务。

#### 获取实例

```objc
[RXApiService sharedSDK]
```

#### 验证码

```objc
#pragma mark - 验证码

/// 发送验证码
/// @param type 验证码类型（CaptchaType_email / CaptchaType_phone）
/// @param target 发送目标
/// @param purpose 用途：register/bindphone/unbindphone/resetpwd/changepwd/bindemail/unbindemail/login
- (void)sendCaptchaWithType:(CaptchaType)type
                     target:(NSString *)target
                    purpose:(NSString *)purpose
                   complete:(RequestComplete)complete;

/// 发送验证码（带图形验证）
- (void)sendCaptchaWithType:(CaptchaType)type
                     target:(NSString *)target
                    purpose:(NSString *)purpose
                     ticket:(NSString *)ticket
                    randstr:(NSString *)randstr
                   complete:(RequestComplete)complete;

/// 校验验证码
- (void)verifyCaptchaWithType:(CaptchaType)type
                       target:(NSString *)target
                      purpose:(NSString *)purpose
                  captchaCode:(NSString *)captchaCode
                     complete:(RequestComplete)complete;

/// 图形验证 UI
- (void)captchaVerifyUIWithAppid:(NSString *)appid
                        complete:(RequestComplete)complete;
```

#### 调用示例

```objc
// 发送手机验证码
[[RXApiService sharedSDK] sendCaptchaWithType:CaptchaType_phone
                                       target:@"13800138000"
                                      purpose:@"login"
                                     complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"发送失败: %@", error.msg);
    } else {
        NSLog(@"验证码已发送");
    }
}];

// 校验验证码
[[RXApiService sharedSDK] verifyCaptchaWithType:CaptchaType_phone
                                         target:@"13800138000"
                                        purpose:@"login"
                                    captchaCode:@"123456"
                                       complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    // 处理结果
}];
```

#### 账号绑定

```objc
#pragma mark - 账号绑定

/// 绑定邮箱
- (void)bindEmailWithEmail:(NSString *)email
                  password:(NSString *)password
               captchaCode:(NSString *)captchaCode
               migrateArgs:(id _Nullable)migrateArgs
                  complete:(RequestComplete)complete;

/// 解绑邮箱
- (void)unBindEmailWithEmail:(NSString *)email    
                 captchaCode:(NSString *)captchaCode
                    complete:(RequestComplete)complete;

/// 绑定手机
- (void)bindPhoneWithCaptchaCode:(NSString *)captchaCode
                        password:(NSString *)password
                           phone:(NSString *)phone
                     migrateArgs:(id _Nullable)migrateArgs
                        complete:(RequestComplete)complete;

/// 解绑手机
- (void)unBindPhoneWithCaptchaCode:(NSString *)captchaCode
                             phone:(NSString *)phone
                          complete:(RequestComplete)complete;

/// 修改手机号
- (void)changePhoneWithOldPhoneCaptcha:(NSString *)oldPhoneCaptcha
                              newphone:(NSString *)newphone
                       newPhoneCaptcha:(NSString *)newphone_captcha
                           migrateArgs:(id _Nullable)migrateArgs
                              complete:(RequestComplete)complete;
```

#### 用户信息

```objc
#pragma mark - 用户信息

/// 获取用户信息
- (void)getUserInfoWithComplete:(RequestComplete)complete;

/// 获取指定用户信息
/// @param params 请求参数 map
- (void)getUserInfoByFieldWithParams:(NSDictionary *)params
                            complete:(RequestComplete)complete;

/// 修改用户信息
/// @param avatarUrl 头像 URL
/// @param nickname 昵称
/// @param sex 性别（1-男 0-女）
/// @param region 地区码
/// @param ext 扩展字段
- (void)updateUserInfo:(NSString *)avatarUrl
              nickname:(NSString *)nickname
                   sex:(NSString *)sex
                region:(NSString *)region
                   ext:(NSDictionary *)ext
              complete:(RequestComplete)complete;
```

#### 密码

```objc
#pragma mark - 密码

/// 修改密码
- (void)changePasswordWithNewPwd:(NSString *)newPwd
                          oldPwd:(NSString *)oldPwd
                        complete:(RequestComplete)complete;

/// 重置密码
- (void)resetPasswordWithUsername:(NSString *)username
                         password:(NSString *)password
                      captchaCode:(NSString *)captchaCode
                      migrateArgs:(id _Nullable)migrateArgs
                         complete:(RequestComplete)complete;
```

#### 注册

```objc
#pragma mark - 注册

/// 注册账号
/// @param username 用户名（账号/手机/邮箱）
/// @param password 密码
/// @param captchaCode 验证码
/// @param ext 扩展字段（nickname/avatarUrl/sex/migrate_args）
- (void)registerWithUsername:(NSString * _Nullable)username
                    password:(NSString * _Nullable)password
                 captchaCode:(NSString * _Nullable)captchaCode
                         ext:(NSDictionary * _Nullable)ext
                    complete:(RequestComplete)complete;
```

#### 实名认证

```objc
#pragma mark - 实名认证

/// 实名认证
- (void)realAuthWithRealName:(NSString *)realName
                      idCard:(NSString *)idCard
                    complete:(RequestComplete)complete;

/// 实名认证（带快速认证选项）
- (void)realAuthWithRealName:(NSString *)realName
                      idCard:(NSString *)idCard
                  isFastAuth:(BOOL)isFastAuth
                    complete:(RequestComplete)complete;
```

#### 设备信息

```objc
#pragma mark - 设备信息

/// 获取设备码
- (NSString *)getDeviceCode;

/// 获取当前时区与 UTC 时差
- (NSString *)getTimeZoneOffset;

/// 获取当前手机语言
- (NSString *)getSystemLanguage;

/// 获取 IDFA
+ (NSString *)getIDFA;
```

#### Token

```objc
#pragma mark - Token

/// 刷新 Token
- (void)refreshTokenWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// login_openid 是否失效
- (BOOL)loginOpenidExpireInvalid;
```

---

### RXIAPService（支付服务类）

内购支付相关功能。

#### 获取实例

```objc
[RXIAPService sharedSDK]
```

#### API 列表

```objc
#pragma mark - 支付

/// 设置重复下单间隔（单位秒，默认 300s）
- (void)setInterval:(NSInteger)interval;

/// 内购支付
/// @param dict 支付参数
/// @note dict 结构：
/// - currency: 币种（默认 CNY）
/// - goods_tag: 商品标签
/// - trade_no: 订单号
/// - env: 是否沙盒环境（0-正式 1-沙盒）
/// - indulge_auth: 是否防沉迷验证（0-不验证 1-验证）
/// - is_debug: 是否测试订单（0-正式 1-测试）
/// - ext: 扩展字段
/// - notify_url: CP 发货地址
/// - transmit_args: 透传参数
- (void)iap:(NSDictionary *)dict complete:(RequestComplete)complete;

/// 查询是否需要补单
- (BOOL)checkHasFailedOrder;

/// 补单
/// @param maxCount 最大重试数（默认 5 次）
- (void)reFailOrderWithMaxCount:(NSInteger)maxCount
                       complete:(RequestComplete)complete;

/// 查询商品信息
- (void)getProductInfoWithProductIdArr:(NSArray *)productIdArr
                              complete:(void(^)(NSArray<SKProduct *> *productInfoList))complete;

/// 获取初始化保存的计费点
- (NSDictionary *)getProductInfo;

/// 获取地区货币符号
- (void)getLocaleIdentifierWithProductId:(NSString *)productId
                                 timeout:(NSInteger)timeout
                                complete:(RequestComplete)complete;

/// StoreKit2 查询未完成交易
- (void)sk2UnfinishUncompletedTransactionsWithOrderInfo:(NSDictionary *)orderInfo
                                         completeHandle:(RequestComplete)handle;
```

#### 调用示例

```objc
// 发起支付
NSDictionary *payParams = @{
    @"currency": @"CNY",
    @"goods_tag": @"diamond_100",
    @"trade_no": @"order_123456",
    @"env": @"0",
    @"indulge_auth": @"0",
    @"is_debug": @"0",
    @"notify_url": @"https://your-server.com/notify"
};

[[RXIAPService sharedSDK] iap:payParams complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"支付失败: %@", error.msg);
    } else {
        NSLog(@"支付成功: %@", response);
    }
}];

// 检查并执行补单
if ([[RXIAPService sharedSDK] checkHasFailedOrder]) {
    [[RXIAPService sharedSDK] reFailOrderWithMaxCount:5 complete:^(NSDictionary *response, RX_CommonRequestError *error) {
        NSLog(@"补单结果: %@", response);
    }];
}

// 查询商品信息
[[RXIAPService sharedSDK] getProductInfoWithProductIdArr:@[@"com.app.product1", @"com.app.product2"]
                                                complete:^(NSArray<SKProduct *> *productInfoList) {
    for (SKProduct *product in productInfoList) {
        NSLog(@"商品: %@ 价格: %@", product.localizedTitle, product.price);
    }
}];
```

---

### RXShareService（分享服务类）

分享相关功能。

#### 获取实例

```objc
[RXShareService sharedSDK]
```

#### API 列表

```objc
#pragma mark - 分享

/// 一键分享
/// @param config 分享配置
- (void)share:(RXShareConfig *)config
     complete:(RequestComplete)complete;

/// 自定义分享
/// @param config 分享配置
- (void)shareCustom:(RXCustomShareConfig *)config
           complete:(RequestComplete)complete;

/// 分享调度初始化
/// @param funcs 埋点数组（传空获取所有）
- (void)shareSchedulingInitWithFuncs:(NSArray *)funcs
                            complete:(RequestComplete)complete;

/// 获取埋点调度
- (void)getShareSchedulingWithFuncs:(NSArray *)funcs
                           complete:(RequestComplete)complete;

/// 获取分享信息
/// @param config 分享配置
- (void)getShareInfoWithConfig:(RXShareConfig *)config
                      complete:(RequestComplete)complete;

/// 系统分享
/// @param shareInfo 分享信息
- (void)SystemShareWithShareInfo:(NSDictionary *)shareInfo
                        complete:(ShareCallBack)complete;

/// 获取通路配置
- (void)getSharePlatformsWithComplete:(RequestComplete)complete;

/// 分享/广告结果上报
/// @param func 埋点标识
/// @param platform 分享平台（wechat/facebook/line/messenger/system）
/// @param region 地区码
/// @param transmits 透传参数
/// @param scheduling_event 上报结果（YES-成功 NO-失败）
/// @param scheduling_type 上报类型（ad-广告 share-分享）
/// @param properties 自定义属性
- (void)shareSchedulingReportWithFunc:(NSString *)func
                             platform:(NSString *)platform
                               region:(NSString *)region
                            transmits:(NSString * _Nullable)transmits
                     scheduling_event:(BOOL)scheduling_event
                      scheduling_type:(NSString *)scheduling_type
                           properties:(NSDictionary * _Nullable)properties
                             complete:(RequestComplete)complete;

/// 获取短链接
- (void)getShortUrl:(NSString *)url
           complete:(RequestComplete)complete;

/// 获取短链接（带 OG 标签）
- (void)getShortUrl:(NSString *)url
              title:(NSString *)title
            content:(NSString *)content
              image:(NSString *)image
                ext:(NSDictionary *)ext
           complete:(RequestComplete)complete;
```

#### 调用示例

```objc
// 一键分享
RXShareConfig *config = [[RXShareConfig alloc] init];
config.func = @"share_game";
config.platform = @"wechat";

[[RXShareService sharedSDK] share:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"分享失败: %@", error.msg);
    } else {
        NSLog(@"分享成功");
    }
}];

// 获取短链接
[[RXShareService sharedSDK] getShortUrl:@"https://your-long-url.com/path?params=value"
                               complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSString *shortUrl = response[@"short_url"];
    NSLog(@"短链接: %@", shortUrl);
}];
```

---

### RXLogService（日志埋点服务类）

数据埋点相关功能。

#### 获取实例

```objc
[RXLogService sharedSDK]
```

#### API 列表

```objc
#pragma mark - 埋点配置

/// 埋点配置
/// @param reportTime 上报间隔（秒，默认 60s）
/// @param maxCount 最大缓存数（默认 100 条）
- (void)trackConfigWithReportTime:(NSInteger)reportTime
                         maxCount:(NSInteger)maxCount;

/// 设置是否为测试数据
- (void)setTrackEnv:(BOOL)env;

#pragma mark - 数据埋点

/// 数据埋点（批量上报）
/// @param event 埋点标识
/// @param distinctId 用户唯一标识（传空默认为 openID）
/// @param properties 自定义属性
- (BOOL)dataTrackWithEvent:(NSString *)event
                distinctId:(NSString * _Nullable)distinctId
                properties:(NSDictionary * _Nullable)properties;

/// 数据埋点（单条上报，带回调）
- (BOOL)addLogSingleWithEvent:(NSString *)event
                   distinctId:(NSString * _Nullable)distinctId
                   properties:(NSDictionary * _Nullable)properties
                     complete:(RequestComplete)complete;

/// 数据埋点（单条上报）
- (BOOL)addLogSingleWithEvent:(NSString *)event
                   distinctId:(NSString * _Nullable)distinctId
                   properties:(NSDictionary * _Nullable)properties;

#pragma mark - 公共属性

/// 设置公共属性
- (void)setPublicProperties:(NSDictionary *)properties;

/// 修改公共属性
- (void)updatePublicProperties:(NSDictionary *)properties;

/// 删除公共属性
- (void)deletePublicProperties:(NSArray *)properties;

#pragma mark - 其他

/// 获取 distinctId
- (NSString *)getDistinctId;

/// 获取 SDK 日志
- (NSString *)getSDKLog;
```

#### 调用示例

```objc
// 配置埋点
[[RXLogService sharedSDK] trackConfigWithReportTime:60 maxCount:100];

// 设置公共属性
[[RXLogService sharedSDK] setPublicProperties:@{
    @"app_version": @"1.0.0",
    @"device_model": @"iPhone 15"
}];

// 数据埋点（批量上报）
[[RXLogService sharedSDK] dataTrackWithEvent:@"button_click"
                                  distinctId:nil
                                  properties:@{
    @"button_name": @"login",
    @"page": @"home"
}];

// 数据埋点（单条上报）
[[RXLogService sharedSDK] addLogSingleWithEvent:@"purchase_success"
                                     distinctId:nil
                                     properties:@{
    @"product_id": @"diamond_100",
    @"price": @"6.00"
}
                                       complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSLog(@"埋点上报结果: %@", response);
}];
```

---

### RXContactService（社交联系服务类）

好友、LBS、排行榜等社交功能。

#### 获取实例

```objc
[RXContactService sharedSDK]
```

#### LBS（位置服务）

```objc
#pragma mark - LBS

/// 上报/更新经纬度坐标
/// @param lon 经度
/// @param lat 纬度
/// @param types 自定义坐标分组类型
- (void)lbsUpdateWithLon:(double)lon
                     lat:(double)lat
                   types:(NSArray * __nonnull)types
                complete:(RequestComplete)complete;

/// 删除经纬度坐标
- (void)deleteLocationWithTypes:(NSArray *)types
                       complete:(RequestComplete)complete;

/// 获取指定半径内的其他用户信息
/// @param lon 经度
/// @param lat 纬度
/// @param radius 半径（米）
/// @param count 查询数量（0 为全部）
/// @param page 页数（从 1 开始）
/// @param page_size 每页数量
/// @param type 查询类型
- (void)getRadiusAccountWithLon:(double)lon
                            lat:(double)lat
                         radius:(NSInteger)radius
                          count:(NSInteger)count
                           page:(NSInteger)page
                      page_size:(NSInteger)page_size
                           type:(NSString *)type
                       complete:(RequestComplete)complete;
```

#### 好友

```objc
#pragma mark - 好友

/// 添加好友
/// @param target 目标 openId
/// @param target_remarks 备注信息（最长 512 字符）
/// @param user_remarks Target 给用户设置的备注
- (void)addFriendWithTarget:(NSString *)target
             target_remarks:(NSString * _Nullable)target_remarks
               user_remarks:(NSString * _Nullable)user_remarks
                   complete:(RequestComplete)complete;

/// 删除好友
- (void)deleteFriendWithTarget:(NSString *)target
                      complete:(RequestComplete)complete;

/// 更新好友备注
- (void)updateFriendRemarkWithTarget:(NSString *)target
                      target_remarks:(NSString *)target_remarks
                            complete:(RequestComplete)complete;

/// 获取好友列表
- (void)getFriendListWithComplete:(RequestComplete)complete;

/// 判断两用户是否为好友
- (void)requestIsFriendWithTarget:(NSString *)target
                         complete:(RequestComplete)complete;
```

#### 自定义关系

```objc
#pragma mark - 自定义关系

/// 添加自定义关系
/// @param target 目标 openId
/// @param types 关系类型列表（value 必须为 BOOL）
/// @param target_remarks 备注信息
/// @param user_remarks Target 给用户设置的备注
- (void)addRelationWithTarget:(NSString *)target
                        types:(NSDictionary *)types
               target_remarks:(NSString * _Nullable)target_remarks
                 user_remarks:(NSString * _Nullable)user_remarks
                     complete:(RequestComplete)complete;

/// 删除自定义关系
- (void)deleteRelationWithTarget:(NSString *)target
                           types:(NSDictionary *)types
                        complete:(RequestComplete)complete;

/// 更新用户自定义关系备注
- (void)updateRemarksWithTarget:(NSString *)target
                 target_remarks:(NSString *)target_remarks
                           type:(NSString *)type
                       complete:(RequestComplete)complete;

/// 获取自定义关系列表
- (void)getRelationListWithType:(NSString *)type
                       complete:(RequestComplete)complete;

/// 判断两用户是否存在某自定关系
- (void)requestHasRelationWithTarget:(NSString *)target
                                type:(NSString *)type
                            complete:(RequestComplete)complete;

/// 设置用户自定义信息
/// @param custom 自定义信息（最大 512 字节）
- (void)setUserCustomWithCustom:(NSString *)custom
                       complete:(RequestComplete)complete;
```

#### 排行榜

```objc
#pragma mark - 排行榜

/// 增加用户分数
/// @param rank_id 榜单 ID（格式：Flag_榜单容量_重置周期_自定义标识）
/// @param source 增加的分数值
- (void)addscoreWithRank_id:(NSString *)rank_id
                      score:(NSInteger)source
                   complete:(RequestComplete)complete;

/// 设置用户分数
- (void)setScoreWithRank_id:(NSString *)rank_id
                      score:(NSInteger)source
                   complete:(RequestComplete)complete;

/// 查询用户分数
/// @param rank_id 榜单 ID
/// @param target 目标 openId
- (void)queryUserRankWithRank_id:(NSString *)rank_id
                          target:(NSString *)target
                        complete:(RequestComplete)complete;

/// 获取排行榜列表
/// @param rank_id 榜单 ID
/// @param start_rank 开始排名
/// @param end_rank 结束排名
- (void)getRankListWithRank_id:(NSString *)rank_id
                    start_rank:(NSInteger)start_rank
                      end_rank:(NSInteger)end_rank
                      complete:(RequestComplete)complete;

/// 获取好友排行榜列表
- (void)getFriendRankListWithRank_id:(NSString *)rank_id
                            complete:(RequestComplete)complete;
```

#### 调用示例

```objc
// 上报位置
[[RXContactService sharedSDK] lbsUpdateWithLon:116.397428
                                           lat:39.90923
                                         types:@[@"game", @"chat"]
                                      complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSLog(@"位置上报结果: %@", response);
}];

// 获取附近用户
[[RXContactService sharedSDK] getRadiusAccountWithLon:116.397428
                                                  lat:39.90923
                                               radius:5000
                                                count:0
                                                 page:1
                                            page_size:20
                                                 type:@"game"
                                             complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSArray *users = response[@"list"];
    NSLog(@"附近用户: %@", users);
}];

// 添加好友
[[RXContactService sharedSDK] addFriendWithTarget:@"target_openid"
                                   target_remarks:@"游戏好友"
                                     user_remarks:nil
                                         complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSLog(@"添加好友结果: %@", response);
}];

// 获取排行榜
[[RXContactService sharedSDK] getRankListWithRank_id:@"0_100_daily_score"
                                          start_rank:1
                                            end_rank:50
                                            complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSArray *rankList = response[@"list"];
    NSLog(@"排行榜: %@", rankList);
}];
```

---

### RXDestroyAccountService（注销服务类）

账号注销相关功能。

#### 获取实例

```objc
[RXDestroyAccountService sharedSDK]
```

#### API 列表

```objc
#pragma mark - 注销

/// 申请注销账号
/// @param config 注销参数配置
- (void)deregisterWithConfig:(RXDeregisterConfig *)config
                    complete:(RequestComplete)complete;

/// 撤销注销申请
- (void)deregisterCancelWithComplete:(RequestComplete)complete;
```

#### 调用示例

```objc
// 申请注销
RXDeregisterConfig *config = [[RXDeregisterConfig alloc] init];
config.IDCard = @"110101199001011234";
config.realname = @"张三";

[[RXDestroyAccountService sharedSDK] deregisterWithConfig:config
                                                 complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"注销申请失败: %@", error.msg);
    } else {
        NSLog(@"注销申请成功");
    }
}];

// 撤销注销
[[RXDestroyAccountService sharedSDK] deregisterCancelWithComplete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSLog(@"撤销注销结果: %@", response);
}];
```

---

### RXFeedbackService（反馈服务类）

用户反馈相关功能。

#### 获取实例

```objc
[RXFeedbackService sharedSDK]
```

#### API 列表

```objc
#pragma mark - 反馈

/// 获取意见反馈类型
- (void)getFeedbackKindListWithComplete:(RequestComplete)complete;

/// 创建意见反馈
/// @param params 反馈参数
/// @note params 结构：
/// - game_id: 游戏 ID
/// - kind_id: 意见反馈 ID
/// - kind_name: 意见反馈类型
/// - priority: 紧急程度（1-紧急 2-不紧急）
/// - content: 反馈内容
/// - picture: 图片 URL
/// - player_gameid: 玩家游戏 ID
/// - send_voided_mails: 作废是否发邮件（1-发 2-不发）
- (void)createFeedbackWithParams:(NSDictionary *)params
                        complete:(RequestComplete)complete;

/// 满意度评价
/// @param params 评价参数
/// @note params 结构：
/// - key_number: 反馈 ID
/// - pleased_status: 满意度（1-满意 2-不满意）
/// - reason: 理由
- (void)satisfactionEvaluationWithParams:(NSDictionary *)params
                                complete:(RequestComplete)complete;

/// 上报反馈日志
/// @param data 文件二进制数据
- (void)reportFeedbackLogWithData:(NSData *)data
                         complete:(RequestComplete)complete;
```

#### 调用示例

```objc
// 获取反馈类型
[[RXFeedbackService sharedSDK] getFeedbackKindListWithComplete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSArray *kindList = response[@"list"];
    NSLog(@"反馈类型: %@", kindList);
}];

// 创建反馈
NSDictionary *feedbackParams = @{
    @"game_id": @(1001),
    @"kind_id": @(1),
    @"kind_name": @"Bug反馈",
    @"priority": @(1),
    @"content": @"游戏闪退问题",
    @"player_gameid": @"player_123"
};

[[RXFeedbackService sharedSDK] createFeedbackWithParams:feedbackParams
                                               complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSLog(@"反馈创建结果: %@", response);
}];
```

---

### RXUpdateCheckService（版本检查服务类）

版本更新检查相关功能。

#### 获取实例

```objc
[RXUpdateCheckService sharedSDK]
```

#### API 列表

```objc
#pragma mark - 版本检查

/// 版本检查
- (void)updateGameVersionWithInfo:(NSDictionary *)info
                         complete:(RequestComplete)complete;

/// 大厅更新检查（GET 版本）
/// @param region 地区码
/// @param client_version 客户端版本
/// @param type 脚本类型（lua/json/u3d）
/// @param json 输出文件后缀
- (void)checkUpdate_AppWithRegion:(NSString * _Nullable)region
                   client_version:(NSString * _Nullable)client_version
                             type:(NSString * _Nullable)type
                             json:(NSString * _Nullable)json
                         complete:(RequestComplete)complete;

/// 大厅更新检查（GET 版本，带维护公告）
- (void)checkUpdate_AppWithRegion:(NSString * _Nullable)region
                   client_version:(NSString * _Nullable)client_version
                             type:(NSString * _Nullable)type
                             json:(NSString * _Nullable)json
                           isShow:(BOOL)isShow
                     linkCallBack:(void(^)(NSString *link))linkCallBack
                         complete:(RequestComplete)complete;

/// 大厅更新检查（POST 版本）
- (void)checkUpdate_AppWithRegion:(NSString * _Nullable)region
                   client_version:(NSString * _Nullable)client_version
                            games:(NSDictionary * _Nullable)games
                       activities:(NSDictionary * _Nullable)activities
                             type:(NSString * _Nullable)type
                             json:(NSString * _Nullable)json
                         complete:(RequestComplete)complete;

/// 活动更新检查
- (void)checkUpdate_ActivityWithGame_version:(NSInteger)game_version
                          game_check_version:(NSString * _Nullable)game_check_version
                                  short_name:(NSString *)short_name
                                        type:(NSString * _Nullable)type
                                        json:(NSString * _Nullable)json
                                    complete:(RequestComplete)complete;

/// 游戏更新检查
- (void)checkUpdate_GameWithGame_id:(NSInteger)game_id
                       game_version:(NSInteger)game_version
                 game_check_version:(NSString * _Nullable)game_check_version
                               type:(NSString * _Nullable)type
                               json:(NSString * _Nullable)json
                           complete:(RequestComplete)complete;
```

#### 调用示例

```objc
// 大厅更新检查
[[RXUpdateCheckService sharedSDK] checkUpdate_AppWithRegion:@"CN"
                                             client_version:@"1.0.0"
                                                       type:@"lua"
                                                       json:nil
                                                   complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (response[@"need_update"]) {
        NSLog(@"需要更新到版本: %@", response[@"new_version"]);
    }
}];

// 游戏更新检查
[[RXUpdateCheckService sharedSDK] checkUpdate_GameWithGame_id:1001
                                                 game_version:100
                                           game_check_version:nil
                                                         type:@"lua"
                                                         json:nil
                                                     complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSLog(@"游戏更新检查结果: %@", response);
}];
```

---

### RXGameInfoService（游戏信息服务类）

游戏区服、角色信息管理。

#### 获取实例

```objc
[RXGameInfoService sharedSDK]
```

#### 区服管理

```objc
#pragma mark - 区服管理

/// 查询游戏区服信息
- (void)searchGameAreaInfoWithAreaId:(NSString *)areaId
                            complete:(RequestComplete)complete;

/// 查询区服列表信息
- (void)searchGameAreaListInfoWithComplete:(RequestComplete)complete;

/// 创建游戏区服
- (void)createGameAreaWithAreaId:(NSString *)areaId
                        areaName:(NSString *)areaName
                      areaStatus:(NSString *)areaStatus
                        areaType:(NSString *)areaType
                       extension:(NSDictionary *)extension
                        complete:(RequestComplete)complete;

/// 修改游戏区服信息
- (void)updateGameAreaInfoWithAreaId:(NSString *)areaId
                            areaName:(NSString *)areaName
                          areaStatus:(NSString *)areaStatus
                            areaType:(NSString *)areaType
                           extension:(NSDictionary *)extension
                            complete:(RequestComplete)complete;

/// 删除游戏区服
- (void)deleteGameAreaWithAreaId:(NSString *)areaId
                        complete:(RequestComplete)complete;
```

#### 角色管理

```objc
#pragma mark - 角色管理

/// 创建游戏角色
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
                             complete:(RequestComplete)complete;

/// 修改游戏角色信息
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
                                 complete:(RequestComplete)complete;

/// 删除游戏角色
- (void)deleteGameCharacterWithAreaId:(NSString *)areaId
                          characterId:(NSString *)characterId
                             cpUserId:(NSString *)cpUserId
                             complete:(RequestComplete)complete;

/// 查询账号下角色信息列表
- (void)searchGameCharacterListInfoWithCpUserId:(NSString *)cpUserId
                                       complete:(RequestComplete)complete;

/// 查询账号下某个区服下的角色信息列表
- (void)searchGameCharacterListInAreaWithAreaId:(NSString *)areaId
                                       cpUserId:(NSString *)cpUserId
                                       complete:(RequestComplete)complete;

/// 查询具体角色信息
- (void)searchGameCharacterInfoWithAreaId:(NSString *)areaId
                                 cpUserId:(NSString *)cpUserId
                              characterId:(NSString *)characterId
                                 complete:(RequestComplete)complete;

/// 查询游戏角色信息
- (void)searchGameAccountWithComplete:(RequestComplete)complete;
```

#### 调用示例

```objc
// 创建区服
[[RXGameInfoService sharedSDK] createGameAreaWithAreaId:@"area_001"
                                               areaName:@"一区"
                                             areaStatus:@"open"
                                               areaType:@"normal"
                                              extension:@{}
                                               complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSLog(@"创建区服结果: %@", response);
}];

// 创建角色
[[RXGameInfoService sharedSDK] createGameCharacterWithAreaId:@"area_001"
                                            characterFaction:@"Alliance"
                                                 characterId:@"char_001"
                                              characterLevel:@"50"
                                               characterName:@"勇者"
                                         characterProfession:@"Warrior"
                                             characterStatus:@"active"
                                               characterType:@"normal"
                                           characterVipLevel:@"5"
                                                    cpUserId:@"user_123"
                                                   extension:@{}
                                                    complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSLog(@"创建角色结果: %@", response);
}];

// 查询角色列表
[[RXGameInfoService sharedSDK] searchGameCharacterListInfoWithCpUserId:@"user_123"
                                                              complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSArray *characters = response[@"list"];
    NSLog(@"角色列表: %@", characters);
}];
```

---

## RXUIKit（国内版 UI 框架）

国内版 UI 组件框架，提供登录、用户中心、实名认证等 UI 界面。

### RXUIKitService

#### 获取实例

```objc
[RXUIKitService sharedSDK]
```

#### 初始化

```objc
/// 初始化
- (void)regist;

/// 配置 Logo
/// @param logo 展示的 Logo
/// @param titleImage 展示的标题图片
- (void)configLogo:(UIImage *)logo titleImage:(UIImage *)titleImage;
```

#### 登录

```objc
#pragma mark - 登录

/// 调用登录弹窗
/// @param config 登录页基础配置
/// @param complete 登录结果
- (void)showLoginUIWithConfig:(RXLoginUIModel *)config
                     complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 调用登录弹窗（带二次登录检查）
- (BOOL)showLoginViewWithConfig:(RXLoginUIModel *)config
                       complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 调用一键登录弹窗
- (void)showAuthLoginViewWithConfig:(RXLoginUIModel *)config
                           complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 调用验证码/账号密码登录弹窗
- (void)showAccountLoginViewWithConfig:(RXLoginUIModel *)config
                              complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 关闭登录弹窗
- (void)closeLoginView;

/// login_openid 是否失效
- (BOOL)loginOpenidExpireInvalidWithConfig:(RXLoginUIModel *)config
                                  complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;
```

#### 用户中心

```objc
#pragma mark - 用户中心

/// 用户中心
/// @param config 基础配置
- (void)userCenterWithConfig:(RXUserCenterConfig *)config
                    complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 关闭用户中心
- (void)closeUserCenter;

/// 帮助中心
- (void)serviceCenterWithConfig:(RXUserCenterConfig *)config
                       complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 客服
- (void)chatServiceWithConfig:(RXUserCenterConfig *)config
                     complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;
```

#### 实名认证

```objc
#pragma mark - 实名认证

/// 实名认证
/// @param canClose 是否展示关闭按钮
- (void)setRealauthViewWithCanClose:(BOOL)canClose
                           complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 实名认证（默认不展示关闭按钮）
- (void)setRealauthViewWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 关闭实名认证弹窗
- (void)closeRealauthView;
```

#### 其他功能

```objc
#pragma mark - 其他功能

/// 协议声明
/// @param key 默认展示的条款 key
/// @param keyList 要展示的协议列表
- (void)setProtocolViewWithKey:(NSString *)key
                       keyList:(NSArray *)keyList;

/// 防沉迷提示
- (void)setAntiAdditionViewWithTitle:(NSString *)title
                                 des:(NSString *)des
                            btnTitle:(NSString *)btnTitle
                            complete:(void(^)(void))complete;

/// 权限说明弹框
/// @param keys 要展示的权限 key（传空展示所有）
/// @param clickBlock 点击事件回调（status: 0-拒绝 1-同意）
- (void)setLimitViewWithKeys:(NSArray * _Nullable)keys
                  clickBlock:(void(^)(NSInteger status))clickBlock;

/// 找回密码
- (void)getBackPasswordWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 设置密码
- (void)setPasswordWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 申请注销
- (void)applyForDeregisterWithConfig:(RXUserCenterConfig *)config
                            complete:(void(^)(NSDictionary *response))complete;

/// 撤销注销
- (void)destroyAccountStatusViewWithDeregisterType:(NSString *)deregisterType
                                          complete:(void(^)(DestroyClickType clickType))complete;

/// 分享弹窗
/// @param shareInfo 分享数据（传 nil 则使用 SDK 埋点数据）
/// @param needReport 分享成功后是否自动上报
- (void)shareWithShareInfo:(NSDictionary *)shareInfo
                needReport:(BOOL)needReport
                  complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 自定义 WebView
- (void)openWebViewWithUrl:(NSString *)url
                     title:(NSString *)title;

/// 同步账号登录记录
/// @param accounts 账号数组 @[@{@"username": @"", @"password": @""}]
- (void)syncAccounts:(NSArray <NSDictionary *> *)accounts;

/// 隐私政策弹框
- (void)userPrivacyPolicyWithComplete:(void(^)(BOOL agree))complete;

/// 展示邮件
- (void)showEmailViewWithCpUserId:(NSString *)cpUserId
                     withComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complet;

/// 绑定手机
- (void)bindPhoneWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 展示公告
- (void)showAnnounceViewWithLimit:(int)limit
                     linkCallBack:(void(^)(NSString *link))linkCallBack
                    isHasCallBack:(void(^)(BOOL isHas))ishasCallBack;

/// 展示维护公告
- (void)showAnnounceViewWithTitle:(NSString *)title
                          content:(NSString *)content
                     linkCallBack:(void(^)(NSString *link))linkCallBack;
```

#### 调用示例

```objc
// 初始化
[[RXUIKitService sharedSDK] regist];
[[RXUIKitService sharedSDK] configLogo:[UIImage imageNamed:@"logo"]
                            titleImage:[UIImage imageNamed:@"title"]];

// 显示登录界面
RXLoginUIModel *config = [[RXLoginUIModel alloc] init];
config.loginTypes = @[@(LoginTypeVisitor), @(LoginTypeAccount), @(LoginTypeApple)];

[[RXUIKitService sharedSDK] showLoginUIWithConfig:config
                                         complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"登录失败: %@", error.msg);
    } else {
        NSLog(@"登录成功: %@", response);
    }
}];

// 显示用户中心
RXUserCenterConfig *centerConfig = [[RXUserCenterConfig alloc] init];
[[RXUIKitService sharedSDK] userCenterWithConfig:centerConfig
                                        complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSLog(@"用户中心操作: %@", response);
}];

// 实名认证
[[RXUIKitService sharedSDK] setRealauthViewWithCanClose:YES
                                               complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSLog(@"实名认证结果: %@", response);
}];
```

---

## RXOSUIKit（海外版 UI 框架）

海外版 UI 组件框架，适配海外市场的登录、用户中心等界面。

### RXOSUIKitService

#### 获取实例

```objc
[RXOSUIKitService sharedSDK]
```

#### 初始化

```objc
/// 初始化
- (void)regist;

/// 配置 Logo
- (void)configLogo:(UIImage *)logo titleImage:(UIImage *)titleImage;
```

#### 登录

```objc
#pragma mark - 登录

/// 调用登录弹窗
/// @param config 登录页基础配置
/// @param complete 登录结果
- (void)setLoginViewWithConfig:(RXOSUILoginConfig *)config
                      complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 调用登录弹窗（带二次登录检查）
- (BOOL)showLoginViewWithConfig:(RXOSUILoginConfig *)config
                       complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 关闭登录弹窗
- (void)closeLoginView;
```

#### 用户中心

```objc
#pragma mark - 用户中心

/// 用户中心
- (void)userCenterWithConfig:(RXOSUserCenterConfig *)config
                    complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 关闭用户中心
- (void)closeUserCenter;

/// 帮助中心
- (void)serviceCenterWithConfig:(RXOSUserCenterConfig *)config
                       complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 客服
- (void)chatServiceWithConfig:(RXOSUserCenterConfig *)config
                     complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;
```

#### 实名认证

```objc
#pragma mark - 实名认证

/// 实名认证
- (void)setRealauthViewWithCanClose:(BOOL)canClose
                           complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 实名认证 H5（不同地区样式不同）
/// @param region 地区
/// @param canClose 是否展示关闭按钮
- (void)setRealauthViewH5WithRegion:(NSString *)region
                           canClose:(BOOL)canClose
                           complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;
```

#### 其他功能

```objc
#pragma mark - 其他功能

/// 协议声明
- (void)setProtocolViewWithKey:(NSString *)key
                       keyList:(NSArray *)keyList;

/// 防沉迷提示
- (void)setAntiAdditionViewWithTitle:(NSString *)title
                                 des:(NSString *)des
                            btnTitle:(NSString *)btnTitle
                            complete:(void(^)(void))complete;

/// 找回密码
- (void)getBackPasswordWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 设置密码
- (void)setPasswordWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 协议
- (void)setPrivacyWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 申请注销
- (void)applyForDeregisterWithConfig:(RXOSUserCenterConfig *)config
                            complete:(void(^)(NSDictionary *response))complete;

/// 撤销注销
- (void)destroyAccountStatusView:(void(^)(DestroyClickType clickType))complete;

/// 分享弹窗
- (void)shareWithShareInfo:(NSDictionary *)shareInfo
                needReport:(BOOL)needReport
                  complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 自定义 WebView
- (void)openWebViewWithUrl:(NSString *)url
                     title:(NSString *)title;

/// 同步账号登录记录
- (void)syncAccounts:(NSArray <NSDictionary *> *)accounts;

/// 展示邮件
- (void)showEmailViewWithCpUserId:(NSString *)cpUserId
                     withComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complet;

/// 绑定手机
- (void)bindPhoneWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 绑定邮箱
- (void)bindEmailWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 展示公告
- (void)showAnnounceViewWithLimit:(int)limit
                     linkCallBack:(void(^)(NSString *link))linkCallBack
                    isHasCallBack:(void(^)(BOOL isHas))ishasCallBack;

/// 展示维护公告
- (void)showAnnounceViewWithTitle:(NSString *)title
                          content:(NSString *)content
                     linkCallBack:(void(^)(NSString *link))linkCallBack;
```

#### 调用示例

```objc
// 初始化
[[RXOSUIKitService sharedSDK] regist];

// 显示登录界面
RXOSUILoginConfig *config = [[RXOSUILoginConfig alloc] init];
[[RXOSUIKitService sharedSDK] setLoginViewWithConfig:config
                                            complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"登录失败: %@", error.msg);
    } else {
        NSLog(@"登录成功: %@", response);
    }
}];

// 海外版实名认证（H5）
[[RXOSUIKitService sharedSDK] setRealauthViewH5WithRegion:@"VN"
                                                canClose:YES
                                                complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSLog(@"实名认证结果: %@", response);
}];

// 绑定邮箱（海外版特有）
[[RXOSUIKitService sharedSDK] bindEmailWithComplete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSLog(@"绑定邮箱结果: %@", response);
}];
```

---

## 组件框架

以下是 RXSDKCode 项目以外的独立组件框架，每个框架独立打包，按需引入。

---

### RXAdjustSDK（Adjust 归因）

Adjust 广告归因分析 SDK 封装。

> 所属项目：`RXAdjustCode`

#### 获取实例

```objc
[RXAdjust sharedSDK]
```

#### Delegate 协议

```objc
@protocol RXAdjustDelegate <NSObject>

/// 归因回传
- (void)adjustAttributionChanged:(nullable RXADJAttribution *)attribution;

/// 成功跟踪事件时调用
- (void)adjustEventTrackingSucceeded:(nullable RXADJEventSuccess *)eventSuccessResponseData;

/// 跟踪事件失败时调用
- (void)adjustEventTrackingFailed:(nullable RXADJEventFailure *)eventFailureResponseData;

/// 成功跟踪会话时调用
- (void)adjustSessionTrackingSucceeded:(nullable RXADJSessionSuccess *)sessionSuccessResponseData;

/// 跟踪会话失败时调用
- (void)adjustSessionTrackingFailed:(nullable RXADJSessionFailure *)sessionFailureResponseData;

/// SKAdNetwork pre 4.0 转换值更新回调
- (void)adjustConversionValueUpdated:(nullable NSNumber *)conversionValue;

/// SKAdNetwork 4.0 转换值更新回调
- (void)adjustConversionValueUpdated:(nullable NSNumber *)fineValue
                         coarseValue:(nullable NSString *)coarseValue
                          lockWindow:(nullable NSNumber *)lockWindow;

@end
```

#### API 列表

```objc
#pragma mark - 初始化

/// 初始化
/// @param adjustConfig 初始化配置
- (void)appDidLaunch:(RXADJConfig *)adjustConfig;

/// 设置日志等级
- (void)setLogLevel:(RXADJLogLevel)logLevel;

#pragma mark - 事件追踪

/// 记录事件
- (void)trackEvent:(RXADJEvent *)event;

/// 添加回传参数
- (void)addEventCallbackWithEventToken:(NSString *)eventToken
                                params:(NSDictionary *)params;

/// 跟踪广告收入
- (void)trackAdRevenue:(nonnull NSString *)source payload:(nonnull NSData *)payload;

/// 跟踪订阅
- (void)trackSubscription:(nonnull RXADJSubscription *)subscription;

#pragma mark - 会话参数

/// 延迟启动（秒）
- (void)setDelayStart:(double)delayStart;

/// 添加会话回传参数
- (void)addSessionCallbackParameter:(nonnull NSString *)key value:(nonnull NSString *)value;

/// 删除会话回传参数
- (void)removeSessionCallbackParameter:(nonnull NSString *)key;

/// 重置所有会话回传参数
- (void)resetSessionCallbackParameters;

/// 添加会话伙伴参数
- (void)addSessionPartnerParameter:(nonnull NSString *)key value:(nonnull NSString *)value;

/// 删除会话伙伴参数
- (void)removeSessionPartnerParameter:(nonnull NSString *)key;

/// 重置所有会话伙伴参数
- (void)resetSessionPartnerParameters;

#pragma mark - 转换值

/// 更新转换值
- (void)updateConversionValue:(NSInteger)conversionValue;

/// 获取用户归因
- (nullable RXADJAttribution *)attribution;

#pragma mark - 配置

/// 离线模式
- (void)setOfflineMode:(BOOL)enabled;

/// 事件缓冲
- (void)setEventBufferingEnabled:(BOOL)enabled;

/// 数据驻留
- (void)setUrlStrategy:(NSString *)urlStrategy;

/// 预装应用默认跟踪链接
- (void)setDefaultTracker:(NSString *)tracker;

/// 推送标签
- (void)setDeviceToken:(NSData *)deviceToken;

/// 开启后台跟踪
- (void)setSendInBackground:(BOOL)enabled;

/// 停用/启用 SDK
- (void)setEnabled:(BOOL)enable;

/// 设置外部设备 ID
- (void)setExternalDeviceId:(NSString *)deviceId;

#pragma mark - 隐私合规

/// GDPR 被遗忘权
- (void)gdprForgetMe;

/// 三方分享处理
- (void)trackThirdPartySharing:(nonnull RXADJThirdPartySharing *)thirdPartySharing;

/// 禁用第三方数据分享
- (void)disableThirdPartySharing;

/// 针对特定用户的许可监测
- (void)trackMeasurementConsent:(BOOL)enabled;

#pragma mark - 标识符

/// 获取 IDFA
- (NSString *)idfa;

/// 获取 ADID
- (NSString *)adid;

/// 获取 ADID（未初始化时）
- (NSString *)getAdidWithAppToken:(NSString *)appToken
                       delayStart:(NSInteger)delayStart;
```

#### 调用示例

```objc
// 初始化
RXADJConfig *config = [[RXADJConfig alloc] initWithAppToken:@"your_app_token" environment:@"production"];
[[RXAdjust sharedSDK] appDidLaunch:config];

// 设置代理
[RXAdjust sharedSDK].delegate = self;

// 记录事件
RXADJEvent *event = [[RXADJEvent alloc] initWithEventToken:@"abc123"];
[event setRevenue:9.99 currency:@"USD"];
[[RXAdjust sharedSDK] trackEvent:event];

// 获取归因信息
RXADJAttribution *attribution = [[RXAdjust sharedSDK] attribution];
NSLog(@"归因网络: %@", attribution.network);

// GDPR 被遗忘权
[[RXAdjust sharedSDK] gdprForgetMe];
```

---

### RXASAKitSDK（Apple Search Ads）

Apple Search Ads 归因数据获取 SDK。

> 所属项目：`RXASAKitCode`

#### 获取实例

```objc
[RXASAService sharedSDK]
```

#### API 列表

```objc
/// 初始化
- (void)regist;

/// 获取 ASA 数据
/// @note 如果使用瑞雪 SDK 上报数据需要在初始化前调用
/// @note 获取成功后 SDK 内部保存数据，客户端不需要处理
- (void)getInfoWithComplete:(void(^)(NSDictionary *response, NSDictionary *error))complete;
```

#### 调用示例

```objc
// 初始化
[[RXASAService sharedSDK] regist];

// 获取 ASA 数据（在瑞雪 SDK 初始化前调用）
[[RXASAService sharedSDK] getInfoWithComplete:^(NSDictionary *response, NSDictionary *error) {
    if (error) {
        NSLog(@"获取 ASA 数据失败: %@", error);
    } else {
        NSLog(@"ASA 数据: %@", response);
    }
    // 继续初始化瑞雪 SDK
    [[RXService sharedSDK] initWithConfig:config complete:...];
}];
```

---

### RXBDASignalSDK（巨量引擎归因）

巨量引擎（字节跳动）广告归因 SDK。

> 所属项目：`RXBDASignalSDKCode`

#### 获取实例

```objc
[RXBDAsignalService sharedSDK]
```

#### 属性

```objc
@property (nonatomic, assign) BOOL isRegist;           // 是否已注册
@property (nonatomic, assign) BOOL isWindowRegist;     // 是否窗口注册
@property (nonatomic, strong) NSDictionary *launchOptions;
@property (nonatomic, strong) UISceneConnectionOptions *connetOptions;
```

#### API 列表

```objc
/// 注册可选参数
- (void)registerWithOptionalData:(NSDictionary *)data;

/// 上报冷启动事件（激活，立即上报）
- (void)didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
                       connectOptions:(UISceneConnectionOptions *)connetOptions;

/// 上报冷启动事件（激活，根据窗口期上报）
- (void)windowDidFinishLaunchingWithOptions:(NSDictionary *)launchOptions
                             connectOptions:(UISceneConnectionOptions *)connetOptions;

/// 开启 IDFA 采集（默认关闭）
- (void)enableIdfa:(BOOL)enable;

/// 获取 clickid（处理 URL Scheme）
- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options;

/// 开启延时上报
- (void)enableDelayUpload;

/// 允许数据上报
- (void)startSendingEvents;

/// 上报关键事件
- (void)trackEssentialEventWithName:(NSString *)key params:(NSDictionary *)params;

/// 获取启动参数
- (UISceneConnectionOptions *)connetOptions;
- (NSDictionary *)launchOptions;
```

#### 调用示例

```objc
// AppDelegate 中初始化
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // 开启 IDFA 采集
    [[RXBDAsignalService sharedSDK] enableIdfa:YES];
    
    // 上报冷启动事件（立即上报）
    [[RXBDAsignalService sharedSDK] didFinishLaunchingWithOptions:launchOptions
                                                   connectOptions:nil];
    
    return YES;
}

// 处理 URL Scheme
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary *)options {
    [[RXBDAsignalService sharedSDK] application:app openURL:url options:options];
    return YES;
}

// 上报关键事件
[[RXBDAsignalService sharedSDK] trackEssentialEventWithName:@"purchase"
                                                     params:@{
    @"product_id": @"diamond_100",
    @"price": @"6.00"
}];

// 延时上报模式（等待用户授权）
[[RXBDAsignalService sharedSDK] enableDelayUpload];
// ... 用户授权后 ...
[[RXBDAsignalService sharedSDK] startSendingEvents];
```

---

### RXGDTSDK（广点通归因）

广点通（腾讯广告）归因 SDK。

> 所属项目：`RXGDTSDKCode`

#### 获取实例

```objc
[RXGDTService sharedSDK]
```

#### API 列表

```objc
/// 初始化
- (void)regist;

/// 处理 openUrl 唤起数据
- (void)handleOpenUrl:(NSURL *)url;

/// 初始化（激活）
- (void)initWithActionSetId:(NSString *)actionSetId secretKey:(NSString *)secretKey;

/// 注册
/// @param method 注册方式（如 phone/WeChat/mail）
/// @param isSuccess 是否注册成功
- (void)reportRegisterActionWithMethod:(NSString *)method isSuccess:(BOOL)isSuccess;

/// 登录
/// @param method 登录方式（如游戏账号、手机号等）
/// @param isSuccess 是否登录成功
- (void)reportLoginActionWithMethod:(NSString *)method isSuccess:(BOOL)isSuccess;

/// 创建角色
/// @param role 游戏角色
- (void)reportCreateRoleActionWithRole:(NSString *)role;

/// 下单
- (void)reportCheckoutActionWithContentType:(NSString *)type
                                contentName:(NSString *)name
                                  contentID:(NSString *)contentID
                              contentNumber:(NSUInteger)number
                          isVirtualCurrency:(BOOL)isVirtualCurrency
                        virtualCurrencyType:(NSString *)virtualCurrencyType
                           realCurrencyType:(NSString *)realCurrencyType
                                  isSuccess:(BOOL)isSuccess;

/// 支付
- (void)reportPurchaseActionWithContentType:(NSString *)type
                                contentName:(NSString *)name
                                  contentID:(NSString *)contentID
                              contentNumber:(NSUInteger)number
                             paymentChannel:(NSString *)channel
                               realCurrency:(NSString *)realCurrency
                             currencyAmount:(unsigned long long)amount
                                  isSuccess:(BOOL)isSuccess;

/// 完成节点（教学/任务/副本）
- (void)reportFinishQuestActionWithQuestID:(NSString *)questID
                                 questType:(NSString *)type
                                 questName:(NSString *)name
                                questNumer:(NSUInteger)number
                               description:(NSString *)desc
                                 isSuccess:(BOOL)isSuccess;

/// 分享
- (void)reportShareActionWithChannel:(NSString *)channel isSuccess:(BOOL)isSuccess;

/// 升级
- (void)reportUpgradeLevelActionWithLevel:(NSUInteger)level;

/// 评分
- (void)reportRateActionWithRate:(CGFloat)rate;

/// 查看内容/商品详情
- (void)reportViewContentActionWithContentType:(NSString *)type
                                   contentName:(NSString *)name
                                     contentID:(NSString *)contentID;

/// 加入购物车
- (void)reportAddingToCartActionWithContentType:(NSString *)type
                                    contentName:(NSString *)name
                                      contentID:(NSString *)contentID
                                  contentNumber:(NSUInteger)number
                                      isSuccess:(BOOL)isSuccess;
```

#### 调用示例

```objc
// 初始化
[[RXGDTService sharedSDK] regist];
[[RXGDTService sharedSDK] initWithActionSetId:@"your_action_set_id"
                                    secretKey:@"your_secret_key"];

// 处理 URL
[[RXGDTService sharedSDK] handleOpenUrl:url];

// 上报注册
[[RXGDTService sharedSDK] reportRegisterActionWithMethod:@"phone" isSuccess:YES];

// 上报登录
[[RXGDTService sharedSDK] reportLoginActionWithMethod:@"account" isSuccess:YES];

// 上报支付
[[RXGDTService sharedSDK] reportPurchaseActionWithContentType:@"diamond"
                                                  contentName:@"钻石100"
                                                    contentID:@"diamond_100"
                                                contentNumber:1
                                               paymentChannel:@"alipay"
                                                 realCurrency:@"CNY"
                                               currencyAmount:600
                                                    isSuccess:YES];
```

---

### RXOpeninstallSDK（Openinstall 归因）

Openinstall 归因安装 SDK。

> 所属项目：`RXOpeninstallSDK` / `RXOpeninstallOSSDKCode`

#### 获取实例

```objc
[RXOpeninstallService sharedSDK]
```

#### 属性

```objc
@property (nonatomic, copy) InstallParamsBlock installParamsBlock;
```

#### API 列表

```objc
/// 初始化
- (void)regist;

/// 处理 openUrl 唤起数据
- (void)handleOpenUrl:(NSURL *)url;

/// 处理通用链接
/// @param userActivity 存储了页面信息，包括 url
/// @return URL 是否被 OpenInstall 识别
- (BOOL)continueUserActivity:(NSUserActivity *_Nullable)userActivity;

/// 获取安装参数
- (void)getInstallParamsWithComplete:(InstallParamsBlock)complete;
```

#### 调用示例

```objc
// 初始化
[[RXOpeninstallService sharedSDK] regist];

// 处理 URL Scheme
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary *)options {
    [[RXOpeninstallService sharedSDK] handleOpenUrl:url];
    return YES;
}

// 处理 Universal Link
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *))restorationHandler {
    return [[RXOpeninstallService sharedSDK] continueUserActivity:userActivity];
}

// 获取安装参数
[[RXOpeninstallService sharedSDK] getInstallParamsWithComplete:^(NSDictionary *params) {
    NSLog(@"安装参数: %@", params);
}];
```

---

### RXWXSDK（微信）

微信登录、分享、小程序跳转等功能。

> 所属项目：`RXWXSDKCode`

#### 获取实例

```objc
[RXWXService sharedSDK]
```

#### API 列表

```objc
#pragma mark - 配置

/// 配置 Universal Link
- (void)configUniversallink:(NSString *)universallink;

/// 检测是否安装微信
- (BOOL)isWXAppInstalled;

/// 处理旧版微信 URL 启动
- (BOOL)handleOpenUrl:(NSURL *)url;

/// 处理微信 Universal Link 启动
- (BOOL)handleOpenUniversalLink:(NSUserActivity *)userActivity;

#pragma mark - 登录

/// 微信登录
/// @param wxAppid 微信登录 appid
/// @param migrate_args 账号迁移参数
/// @param sign_fields 签名字段
- (void)loginReq_wWithWXAppid:(NSString *)wxAppid
                 migrate_args:(id _Nullable)migrate_args
                  sign_fields:(NSArray * _Nullable)sign_fields;

/// 同步信息（授权但不登录）
- (void)syncInfoWithWXAppid:(NSString *)wxAppid
                   complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

#pragma mark - 分享

/// 微信分享（使用分享信息）
- (void)shareToWWithShareInfo:(NSDictionary *)shareInfo
                     complete:(void(^)(BOOL success))complete;

/// 微信分享 New（返回具体错误码）
- (void)newShareToWWithShareInfo:(NSDictionary *)shareInfo
                        complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// 微信分享（直接调用，不需要获取分享信息）New
- (void)newShareToWWithFunc:(NSString *)func
                   platform:(NSString *)platform
                     region:(NSString *)region
                  transmits:(NSString * _Nullable)transmits
                        ext:(NSDictionary * _Nullable)ext
                   complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

#pragma mark - 小程序

/// 跳转到微信并打开小程序
/// @param params 跳转参数
/// - username: 小程序 ID
/// - appid: 微信 appid
/// - path: 小程序页面路径
/// - miniProgramType: 小程序类型（0-正式 1-开发 2-体验）
/// - ext: 扩展信息
/// - extDic: 扩展数据（可存放图片等）
- (void)openMiniProgram:(NSDictionary *)params
               complete:(void(^)(NSString *extMsg))complete;

#pragma mark - Business

/// 打开 Business View
- (void)openBusinessViewWithModel:(RXWXBusinessModel *)model;

/// 打开 Business View（含回调）
- (void)openBusinessViewWithModel:(RXWXBusinessModel *)model
                         complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;
```

#### 调用示例

```objc
// 配置
[[RXWXService sharedSDK] configUniversallink:@"https://your-domain.com/app/"];

// 检测微信
if ([[RXWXService sharedSDK] isWXAppInstalled]) {
    NSLog(@"微信已安装");
}

// 微信登录
[[RXWXService sharedSDK] loginReq_wWithWXAppid:@"wx_app_id"
                                  migrate_args:nil
                                   sign_fields:@[@"nickname", @"avatar"]];

// 微信分享
[[RXWXService sharedSDK] newShareToWWithShareInfo:@{
    @"title": @"分享标题",
    @"url": @"https://example.com",
    @"content": @"分享内容"
}
                                         complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"分享失败: %@", error.msg);
    } else {
        NSLog(@"分享成功");
    }
}];

// 跳转小程序
[[RXWXService sharedSDK] openMiniProgram:@{
    @"username": @"gh_xxxxx",
    @"appid": @"wx_app_id",
    @"path": @"/pages/index/index?id=123",
    @"miniProgramType": @(0)
}
                                complete:^(NSString *extMsg) {
    NSLog(@"小程序返回: %@", extMsg);
}];
```

---

### RXContactSDK（社交联系）

好友、LBS、排行榜等社交功能（独立打包版本）。

> 所属项目：`RXContactSDKCode`

#### 获取实例

```objc
[RXContactService sharedSDK]
```

#### API 列表

参见 [RXContactService（社交联系服务类）](#rxcontactservice社交联系服务类)，功能相同，区别在于独立打包。

---

### RXLineSDK（Line）

Line 登录、分享功能。

> 所属项目：`RXLineSDKCode`

#### 获取实例

```objc
[RXLineService sharedSDK]
```

#### API 列表

```objc
/// 初始化
- (void)regist;

/// Line 登录
/// @param permissions 获取的权限数组
/// @param sign_fields 签名字段
/// @param migrate_args 账号迁移参数
- (void)loginWithPermissions:(nonnull NSArray <NSString *>*)permissions
                 sign_fields:(NSArray * _Nullable)sign_fields
                migrate_args:(id _Nullable)migrate_args;

/// 处理跳转
- (BOOL)handleOpenURL:(NSURL *)url;

/// Line 分享
/// @param content 分享描述
/// @param url 分享链接
- (void)shareWithContent:(NSString *)content
                     url:(NSString *)url
                complete:(RequestComplete)complete;

/// 检测 Line 是否安装
- (BOOL)checkLineIsInstall;

/// 同步信息（授权但不登录）
- (void)syncInfoWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;
```

#### 调用示例

```objc
// 初始化
[[RXLineService sharedSDK] regist];

// 检测 Line
if ([[RXLineService sharedSDK] checkLineIsInstall]) {
    // Line 登录
    [[RXLineService sharedSDK] loginWithPermissions:@[@"profile", @"openid"]
                                        sign_fields:@[@"nickname", @"avatar"]
                                       migrate_args:nil];
}

// Line 分享
[[RXLineService sharedSDK] shareWithContent:@"快来玩游戏"
                                        url:@"https://example.com"
                                   complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSLog(@"分享结果: %@", response);
}];
```

---

### RXFacebookSDK（Facebook）

Facebook 登录、分享功能。

> 所属项目：`RXFacebookSDKCode`

#### 获取实例

```objc
[RXFacebookService sharedSDK]
```

#### API 列表

```objc
#pragma mark - 初始化

/// 注册 Facebook
- (void)FBRegistWithApplication:(UIApplication *)application
                  launchOptions:(NSDictionary *)launchOptions;

/// 处理跳转参数
- (BOOL)FBApplication:(UIApplication *)application
              openURL:(NSURL *)url
              options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options;

#pragma mark - 登录

/// Facebook 登录
/// @param permissions 权限
/// @param extDic 扩展字段（app_associated_bussiness）
/// @param migrate_args 账号迁移参数
/// @param sign_fields 签名字段
- (void)FBLoginWithPermissions:(NSArray *)permissions
                        extDic:(NSMutableDictionary *)extDic
                  migrate_args:(id _Nullable)migrate_args
                   sign_fields:(NSArray * _Nullable)sign_fields;

/// Facebook 退出登录
- (void)FBLogout;

/// 同步信息（授权但不登录）
- (void)syncInfoWithComplete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

#pragma mark - 分享

/// Facebook 分享
/// @param content 分享内容结构体
/// @param mode 分享样式（0-弹框 1-跳转 FB app）
- (void)FBShareWithContent:(id)content
                      mode:(NSInteger)mode
                  complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;

/// Messenger 分享
- (void)messengerShareWithContent:(id)content
                         complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;
```

#### 调用示例

```objc
// AppDelegate 中注册
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    [[RXFacebookService sharedSDK] FBRegistWithApplication:application
                                             launchOptions:launchOptions];
    return YES;
}

// 处理 URL
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary *)options {
    return [[RXFacebookService sharedSDK] FBApplication:app openURL:url options:options];
}

// Facebook 登录
[[RXFacebookService sharedSDK] FBLoginWithPermissions:@[@"public_profile", @"email"]
                                               extDic:nil
                                         migrate_args:nil
                                          sign_fields:@[@"nickname", @"avatar"]];

// Facebook 分享
[[RXFacebookService sharedSDK] FBShareWithContent:shareContent
                                             mode:0
                                         complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSLog(@"分享结果: %@", response);
}];
```

---

### RXGoogleSDK（Google）

Google 登录功能。

> 所属项目：`RXGoogleSDKCode`

#### 获取实例

```objc
[RXGoogleService sharedSDK]
```

#### API 列表

```objc
/// 注册 Google
- (void)GRegistWithClientID:(NSString *)clientID;

/// 处理 openURL
- (BOOL)GOpenURL:(NSURL *)url;

/// Google 登录
/// @param migrate_args 账号迁移参数
/// @param sign_fields 签名字段
- (void)GLoginInWithMigrate_args:(id _Nullable)migrate_args
                     sign_fields:(NSArray * _Nullable)sign_fields;

/// 恢复登录
- (void)GRestorePreviousSignInWithMigrate_args:(id _Nullable)migrate_args
                                   sign_fields:(NSArray * _Nullable)sign_fields;

/// Google 退出登录
- (void)GLogout;
```

#### 调用示例

```objc
// 注册
[[RXGoogleService sharedSDK] GRegistWithClientID:@"your_client_id.apps.googleusercontent.com"];

// 处理 URL
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary *)options {
    return [[RXGoogleService sharedSDK] GOpenURL:url];
}

// Google 登录
[[RXGoogleService sharedSDK] GLoginInWithMigrate_args:nil
                                          sign_fields:@[@"nickname", @"avatar"]];

// 恢复登录（静默登录）
[[RXGoogleService sharedSDK] GRestorePreviousSignInWithMigrate_args:nil
                                                        sign_fields:nil];
```

---

### RXPushSDK（推送）

推送通知服务 SDK。

> 所属项目：`RXPushSDKCode`

#### 获取实例

```objc
[RXPushService sharedSDK]
```

#### Delegate 协议

```objc
@protocol RXPushDelegate <NSObject>

/// 点击通知栏进入 app
- (void)RXUserNotificationCenter:(UNUserNotificationCenter *)center
  didReceiveNotificationResponse:(UNNotificationResponse *)response
           withCompletionHandler:(void(^)(void))completionHandler;

/// app 在前台接到通知
- (void)RXUserNotificationCenter:(UNUserNotificationCenter *)center
         willPresentNotification:(UNNotification *)notification
           withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler;

@end
```

#### API 列表

```objc
/// 初始化 SDK
- (void)initWithProductId:(NSString *)productId
                channelId:(NSString *)channelId
                     cpid:(NSString *)cpid
              baseUrlList:(NSArray *)baseUrlList;

/// 注册通知
- (void)initUserNotificationCenter:(id<RXPushDelegate>)delegate;

/// 上传 deviceToken（登录后调用）
- (void)registerDeviceToken:(NSData *)deviceToken;

/// 上传 deviceToken（带回调）
- (void)registerDeviceToken:(NSData *)deviceToken
                   complete:(void(^)(NSDictionary *response, NSDictionary *error))complete;

/// 绑定别名（登录后调用）
- (void)bindingAlias:(NSString *)alias;

/// 解绑别名
- (void)reliveBinding;

/// 增加用户标签（最多 10 个）
- (void)addTags:(NSArray *)tags;

/// 移除用户标签
- (void)deleteTags:(NSArray *)tags;

/// 解绑用户与渠道 SDK 的关联
- (void)reliveBindingPushDevice;

/// 消息接收统计
- (void)pushReceivedWithUserInfo:(NSDictionary *)userInfo;

/// 设置角标数量（0 为清空）
- (void)setApplicationIconBadgeNumber:(NSInteger)badgeNumber;

/// 获取推送内容
- (NSDictionary *)getClickPushInfo;
```

#### 调用示例

```objc
// 初始化
[[RXPushService sharedSDK] initWithProductId:@"product_id"
                                   channelId:@"channel_id"
                                        cpid:@"cpid"
                                 baseUrlList:@[@"https://api.example.com"]];

// 注册通知
[[RXPushService sharedSDK] initUserNotificationCenter:self];

// 上传 deviceToken
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    [[RXPushService sharedSDK] registerDeviceToken:deviceToken];
}

// 绑定别名
[[RXPushService sharedSDK] bindingAlias:@"user_123"];

// 添加标签
[[RXPushService sharedSDK] addTags:@[@"vip", @"active"]];
```

---

### RXFirebaseSDK（Firebase）

Firebase Analytics 和认证服务。

> 所属项目：`RXFirebaseSDKCode`

#### RXFirebaseService

```objc
[RXFirebaseService sharedSDK]
```

##### API 列表

```objc
/// 初始化配置
- (void)configure;

/// 记录事件
/// @param name 事件名（1-40 个字符，必须以字母开头）
/// @param parameters 事件参数（最多 25 个）
- (void)logEventWithName:(NSString *)name
              parameters:(nullable NSDictionary<NSString *, id> *)parameters;

/// 设置默认事件参数
- (void)setDefaultEventParameters:(nullable NSDictionary<NSString *, id> *)parameters;

/// 设置用户属性
- (void)setUserPropertyString:(nullable NSString *)value forName:(NSString *)name;

/// 设置用户 ID（最长 256 字符）
- (void)setUserID:(NSString *)userID;

/// 启用/禁用数据收集
- (void)setAnalyticsCollectionEnabled:(BOOL)enable;

/// 获取 instanceID
- (NSString *)getInstanceId;
```

##### 调用示例

```objc
// 初始化
[[RXFirebaseService sharedSDK] configure];

// 记录事件
[[RXFirebaseService sharedSDK] logEventWithName:@"purchase"
                                     parameters:@{
    @"item_id": @"diamond_100",
    @"price": @(6.0)
}];

// 设置用户属性
[[RXFirebaseService sharedSDK] setUserPropertyString:@"premium" forName:@"user_type"];

// 设置用户 ID
[[RXFirebaseService sharedSDK] setUserID:@"user_123"];
```

#### RXFIRAuthService

```objc
[RXFIRAuthService sharedSDK]
```

##### API 列表

```objc
/// 授权登录
- (void)signInWithEmail;

/// 监听授权
- (void)addAuthStateDidChangeListener;
```

#### RXFIRAnalyticsService

```objc
[RXFIRAnalyticsService sharedSDK]
```

##### API 列表

```objc
/// 导入邮箱（设备端转化测量）
- (void)initiateOnDeviceConversionMeasurementWithEmailAddress:(NSString *)email;

/// 导入手机号
- (void)initiateOnDeviceConversionMeasurementWithPhoneNumber:(NSString *)phone;
```

---

### RXSnapChatSDK（SnapChat）

SnapChat 登录、分享功能。

> 所属项目：`RXSnapChatSDKCode`

#### 获取实例

```objc
[RXSnapChatService sharedSDK]
```

#### API 列表

```objc
/// 初始化
- (void)regist;

/// 处理 openURL 跳转
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options;

/// 登录
- (void)login;

/// 分享
- (void)shareWithShareInfo:(NSDictionary *)shareInfo
                  complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;
```

#### 调用示例

```objc
// 初始化
[[RXSnapChatService sharedSDK] regist];

// 登录
[[RXSnapChatService sharedSDK] login];

// 分享
[[RXSnapChatService sharedSDK] shareWithShareInfo:@{
    @"title": @"分享标题",
    @"url": @"https://example.com"
}
                                         complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSLog(@"分享结果: %@", response);
}];
```

---

### RXGameCenterSDK（Game Center）

Apple Game Center 服务。

> 所属项目：`RXGameCenterCode`

#### 获取实例

```objc
[RXGameCenterService sharedSDK]
```

#### API 列表

```objc
/// 登录 Game Center
- (void)authenticateWithComplete:(RequestComplete)complete;

/// 展示 Game Center 主界面
- (void)showGameCenterWithComplete:(RequestComplete)complete;

/// 上传排行榜分数
/// @param score 分数
/// @param leaderboardID 排行榜 ID
- (void)submitScoreWithScore:(NSInteger)score
               leaderboardID:(NSString *)leaderboardID
                    complete:(RequestComplete)complete;

/// 展示排行榜
- (void)showLeaderboardWithComplete:(RequestComplete)complete;

/// 解锁成就进度
/// @param achievementID 成就 ID
/// @param percentComplete 进度（0-100）
- (void)unlockGKAchievementWithAchievementID:(NSString *)achievementID
                             percentComplete:(double)percentComplete
                                    complete:(RequestComplete)complete;

/// 展示成就
- (void)showAchievementsWithComplete:(RequestComplete)complete;
```

#### 调用示例

```objc
// 登录 Game Center
[[RXGameCenterService sharedSDK] authenticateWithComplete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"登录失败: %@", error.msg);
    } else {
        NSLog(@"登录成功");
    }
}];

// 上传分数
[[RXGameCenterService sharedSDK] submitScoreWithScore:1000
                                        leaderboardID:@"leaderboard_001"
                                             complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSLog(@"上传分数结果: %@", response);
}];

// 解锁成就
[[RXGameCenterService sharedSDK] unlockGKAchievementWithAchievementID:@"achievement_001"
                                                      percentComplete:100
                                                             complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSLog(@"成就解锁结果: %@", response);
}];

// 展示排行榜
[[RXGameCenterService sharedSDK] showLeaderboardWithComplete:^(NSDictionary *response, RX_CommonRequestError *error) {
    NSLog(@"排行榜操作: %@", response);
}];
```

---

### RXAliCloudDNSSDK（阿里云 DNS）

阿里云 DNS 解析服务。

#### 获取实例

```objc
[RXAliCloudDNSSDKService sharedSDK]
```

#### API 列表

```objc
/// 初始化
/// @param accountID 账号 ID
/// @param secretKey 密钥
/// @param debug 是否开启调试日志
- (void)initWithAccountID:(int)accountID
                secretKey:(NSString *)secretKey
                    debug:(BOOL)debug;

/// 根据请求对象解析 DNS 并发起请求
/// @param originalRequest 原请求对象
/// @param successBlock 成功回调
/// @param errorBlock 失败回调
- (void)httpDNSQueryWithRequest:(NSMutableURLRequest *)originalRequest
                   SuccessBlock:(nullable void (^)(NSURLSessionDataTask * _Nonnull, id _Nullable))successBlock
                     ErrorBlock:(void (^)(NSURLSessionDataTask * _Nullable, NSError * _Nonnull))errorBlock;

/// 根据 URL host 解析对应 IP
/// @param host URL 的 host
/// @return 解析成功返回 IP，失败返回 nil
- (NSString *)resolveAvailableIp:(NSString *)host;

/// 设置 region 节点
- (void)setRegion:(NSString *)region;
```

#### 调用示例

```objc
// 初始化
[[RXAliCloudDNSSDKService sharedSDK] initWithAccountID:123456
                                             secretKey:@"your_secret_key"
                                                 debug:NO];

// 设置 region
[[RXAliCloudDNSSDKService sharedSDK] setRegion:@"cn-hangzhou"];

// 解析 IP
NSString *ip = [[RXAliCloudDNSSDKService sharedSDK] resolveAvailableIp:@"api.example.com"];
NSLog(@"解析的 IP: %@", ip);

// DNS 解析请求
NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"https://api.example.com/data"]];
[[RXAliCloudDNSSDKService sharedSDK] httpDNSQueryWithRequest:request
                                                SuccessBlock:^(NSURLSessionDataTask *task, id response) {
    NSLog(@"请求成功: %@", response);
}
                                                  ErrorBlock:^(NSURLSessionDataTask *task, NSError *error) {
    NSLog(@"请求失败: %@", error);
}];
```

---

### RXBDASignalSDK（巨量引擎归因）

巨量引擎（字节跳动）广告归因 SDK。

#### 获取实例

```objc
[RXBDAsignalService sharedSDK]
```

#### API 列表

```objc
/// 注册可选参数
- (void)registerWithOptionalData:(NSDictionary *)data;

/// 上报冷启动事件（激活，立即上报）
- (void)didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
                       connectOptions:(UISceneConnectionOptions *)connetOptions;

/// 上报冷启动事件（激活，根据窗口期上报）
- (void)windowDidFinishLaunchingWithOptions:(NSDictionary *)launchOptions
                             connectOptions:(UISceneConnectionOptions *)connetOptions;

/// 开启 IDFA 采集（默认关闭）
- (void)enableIdfa:(BOOL)enable;

/// 获取 clickid
- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options;

/// 开启延时上报
- (void)enableDelayUpload;

/// 允许数据上报
- (void)startSendingEvents;

/// 上报关键事件
/// @param key 事件名
/// @param params 事件参数
- (void)trackEssentialEventWithName:(NSString *)key
                             params:(NSDictionary *)params;

/// 获取启动参数
- (UISceneConnectionOptions *)connetOptions;
- (NSDictionary *)launchOptions;
```

#### 调用示例

```objc
// 在 AppDelegate 中初始化
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // 开启 IDFA 采集
    [[RXBDAsignalService sharedSDK] enableIdfa:YES];
    
    // 上报冷启动事件
    [[RXBDAsignalService sharedSDK] didFinishLaunchingWithOptions:launchOptions
                                                   connectOptions:nil];
    
    return YES;
}

// 处理 URL Scheme
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary *)options {
    [[RXBDAsignalService sharedSDK] application:app openURL:url options:options];
    return YES;
}

// 上报关键事件
[[RXBDAsignalService sharedSDK] trackEssentialEventWithName:@"purchase"
                                                     params:@{
    @"product_id": @"diamond_100",
    @"price": @"6.00"
}];

// 延时上报模式
[[RXBDAsignalService sharedSDK] enableDelayUpload];
// ... 等待用户授权后 ...
[[RXBDAsignalService sharedSDK] startSendingEvents];
```

---

### RXTecentCloudDNSSDK（腾讯云 DNS）

腾讯云 DNS 解析服务。

> 所属项目：`RXTecentDNSSDKCode`

#### 获取实例

```objc
[RXTecentCloudDNSSDKService sharedSDK]
```

#### API 列表

```objc
/// 初始化
/// @param appID app 的 Bundle ID
/// @param dnsID appkey
/// @param dnsKey 密钥
/// @param debug 是否开启调试日志
- (void)initWithAppID:(NSString *)appID
                dnsID:(int)dnsID
               dnsKey:(NSString *)dnsKey
                debug:(BOOL)debug;

/// 根据请求对象解析 DNS 并发起请求
- (void)httpDNSQueryWithRequest:(NSMutableURLRequest *)originalRequest
                   SuccessBlock:(nullable void (^)(NSURLSessionDataTask * _Nonnull, id _Nullable))successBlock
                     ErrorBlock:(void (^)(NSURLSessionDataTask * _Nullable, NSError * _Nonnull))errorBlock;

/// 根据 URL host 解析对应 IP
- (NSString *)resolveAvailableIp:(NSString *)host;
```

#### 调用示例

```objc
// 初始化
[[RXTecentCloudDNSSDKService sharedSDK] initWithAppID:@"com.your.app"
                                                dnsID:123456
                                               dnsKey:@"your_dns_key"
                                                debug:NO];

// 解析 IP
NSString *ip = [[RXTecentCloudDNSSDKService sharedSDK] resolveAvailableIp:@"api.example.com"];
NSLog(@"解析的 IP: %@", ip);
```

---

### RXLanguageKit（国际化语言）

多语言国际化支持。

> 所属项目：`RXLanguageKitCode`

#### API 列表

```objc
/// 获取指定语言的文本
/// @param language 语言码
/// @param text 文本 key
+ (NSString *)getTestWithLanguage:(NSString *)language
                             text:(NSString *)text;
```

#### 调用示例

```objc
// 获取多语言文本
NSString *localizedText = [RXLanguageService getTestWithLanguage:@"zh-Hans"
                                                            text:@"login_button"];
```

---

### RXUniPinSDK（UniPin 支付）

UniPin 支付服务（东南亚地区）。

> 所属项目：`RXUnipinSDKCode`

#### 获取实例

```objc
[RXUniPinPayService sharedSDK]
```

#### API 列表

```objc
/// UniPin 支付
/// @param info 支付相关参数
/// @note 支付结果以接入方后台返回为准，SDK 不提供回调
- (void)payWithOrderInfo:(NSDictionary *)info;
```

#### 调用示例

```objc
// 发起支付
[[RXUniPinPayService sharedSDK] payWithOrderInfo:@{
    @"order_id": @"order_123456",
    @"amount": @(100),
    @"currency": @"IDR"
}];
```

---

### RXAddressBookSDK（通讯录）

通讯录信息获取服务。

> 所属项目：`RXAddressBookCode`

#### 获取实例

```objc
[RXAddressBookService sharedSDK]
```

#### 回调类型

```objc
/// @param addressBooks 通讯录详情
/// @param hash 通讯录哈希值，用于判断是否有变化
typedef void(^RXGetAddressBookBlock)(NSMutableArray *addressBooks, NSString *hash);
```

#### API 列表

```objc
/// 初始化
- (void)regist;

/// 获取通讯录信息
- (void)fetchContacts:(RXGetAddressBookBlock)complete;
```

#### 调用示例

```objc
// 初始化
[[RXAddressBookService sharedSDK] regist];

// 获取通讯录
[[RXAddressBookService sharedSDK] fetchContacts:^(NSMutableArray *addressBooks, NSString *hash) {
    NSLog(@"通讯录数量: %lu", (unsigned long)addressBooks.count);
    NSLog(@"通讯录哈希: %@", hash);
}];
```

---

### RXAppListSDK（App 列表）

设备已安装 App 列表获取服务。

> 所属项目：`RXAppListSDKCode`

#### 获取实例

```objc
[RXAppListService sharedSDK]
```

#### API 列表

```objc
/// 初始化
- (void)regist;

/// 获取 App 信息
/// @param config 配置参数
- (void)getAppInfoWithConfig:(NSDictionary *)config
                    complete:(GetAppInfoBlock)complete;
```

#### 调用示例

```objc
// 初始化
[[RXAppListService sharedSDK] regist];

// 获取 App 列表
[[RXAppListService sharedSDK] getAppInfoWithConfig:@{}
                                          complete:^(NSArray *result) {
    NSLog(@"已安装的 App: %@", result);
}];
```

---

### RXGPMSDK（性能监控）

游戏性能监控 SDK（FPS、内存、电量等）。

> 所属项目：`RXGPMSDKCode`

#### 获取实例

```objc
[RXGPMService sharedSDK]
```

#### API 列表

```objc
/// 初始化
- (void)regist;

/// 获取所有性能信息
- (void)getAllInfoWithCompletion:(void(^)(NSDictionary *propertiesDict))completion;

/// 获取当前 FPS 与卡顿
- (void)getCurrentFPSAndJankWithBlock:(void(^)(int FPS, int JANK))complete;

/// 获取当前应用占用内存
- (double)memoryUsage;

/// 获取当前电池剩余电量
- (int)getBatteryLevel;

/// 获取当前电池总容量
- (double)getBatteryCapacity;

/// 获取当前功率
- (double)getCurrentPower;

/// 获取当前设备电流
- (int)getCurrent;

/// 获取电池当前温度
- (double)getBatteryTemperature;

/// 获取 CPU 温度
- (int)getCPUTemperature;

/// 获取 GPU 温度
- (int)getGPUTemperature;

/// 获取 CPU 使用率
- (float)getCpuUsage;

/// 获取设备型号
- (NSString *)rxGetiPhoneDeviceType;

/// 获取系统版本
- (NSString *)getSystemVersion;

/// 获取设备分辨率
- (NSString *)getScreenResolution;

/// 获取图形 API 名称
- (NSString *)getGraphicsAPI;

/// 判断是否为模拟器
- (BOOL)getIsSimulator;

/// 是否越狱
- (BOOL)getIsRoot;

/// 获取 CPU 核心数量
- (NSUInteger)getCPUCoreCount;

/// 获取 GPU 名称
- (NSString *)getGPUModel;

/// 获取 RAM 大小（MB）
- (NSUInteger)getRAMSizeInMB;

/// 获取 ROM 大小（MB）
- (NSUInteger)getROMSizeInMB;
```

#### 调用示例

```objc
// 初始化
[[RXGPMService sharedSDK] regist];

// 获取所有性能数据
[[RXGPMService sharedSDK] getAllInfoWithCompletion:^(NSDictionary *propertiesDict) {
    NSLog(@"性能数据: %@", propertiesDict);
}];

// 获取 FPS 和卡顿
[[RXGPMService sharedSDK] getCurrentFPSAndJankWithBlock:^(int FPS, int JANK) {
    NSLog(@"FPS: %d, JANK: %d", FPS, JANK);
}];

// 获取内存使用
double memory = [[RXGPMService sharedSDK] memoryUsage];
NSLog(@"内存使用: %.2f MB", memory);

// 获取设备信息
NSString *deviceType = [[RXGPMService sharedSDK] rxGetiPhoneDeviceType];
NSLog(@"设备型号: %@", deviceType);
```

---

### RXFeedbackSDK（反馈 UI）

意见反馈 UI 组件。

> 所属项目：`RXFeedbackSDKCode`

#### 获取实例

```objc
[RXPlayerFeedbackService sharedSDK]
```

#### API 列表

```objc
/// 显示我的意见反馈列表
- (void)showFeedbackListView;

/// 显示创建意见反馈页面
- (void)showCreateFeedbackView;
```

#### 调用示例

```objc
// 显示反馈列表
[[RXPlayerFeedbackService sharedSDK] showFeedbackListView];

// 显示创建反馈页面
[[RXPlayerFeedbackService sharedSDK] showCreateFeedbackView];
```

---

### RXInstagramSDK（Instagram）

Instagram 登录功能。

> 所属项目：`RXInsgramSDKCode`

#### 获取实例

```objc
[RXInstagramService sharedSDK]
```

#### API 列表

```objc
/// 初始化
/// @param clientID 应用 ID
/// @param redirectURI 重定向网址
- (void)initWithClientID:(NSString *)clientID redirectURI:(NSString *)redirectURI;

/// 登录
- (void)login;
```

#### 调用示例

```objc
// 初始化
[[RXInstagramService sharedSDK] initWithClientID:@"your_client_id"
                                     redirectURI:@"https://your-redirect-uri.com"];

// 登录
[[RXInstagramService sharedSDK] login];
```

---

### RXRedditSDK（Reddit）

Reddit 登录、分享功能。

> 所属项目：`RXRedditSDKCode`

#### 获取实例

```objc
[RXRedditService sharedSDK]
```

#### 分享类型枚举

```objc
typedef NS_ENUM(NSUInteger, RXRedditShareType) {
    RXRedditShareTypeUrl = 0,   // URL 类型
    RXRedditShareTypeText = 1,  // 文字类型
};
```

#### API 列表

```objc
/// 注册 Reddit
/// @param clientID 应用 ID
/// @param redirectURI 重定向网址
- (void)initWithClientID:(NSString *)clientID redirectURI:(NSString *)redirectURI;

/// 登录
- (void)login;

/// 分享 URL 或文本
/// @param type 分享类型
/// @param title 分享标题
/// @param url URL（URL 类型时传）
/// @param text 文本（文字类型时传）
/// @param srString Subreddit 社区名称
- (void)sendShareTypeWithType:(RXRedditShareType)type
                        title:(NSString *)title
                          url:(NSString *)url
                         text:(NSString *)text
                           sr:(NSString *)srString
                   completion:(void (^)(NSDictionary *response, NSDictionary *error))completion;

/// Reddit 分享
- (void)shareWithShareInfo:(NSDictionary *)shareInfo
                  complete:(RequestComplete)complete;
```

#### 调用示例

```objc
// 注册
[[RXRedditService sharedSDK] initWithClientID:@"your_client_id"
                                  redirectURI:@"https://your-redirect-uri.com"];

// 登录
[[RXRedditService sharedSDK] login];

// 分享 URL
[[RXRedditService sharedSDK] sendShareTypeWithType:RXRedditShareTypeUrl
                                             title:@"分享标题"
                                               url:@"https://example.com"
                                              text:@""
                                                sr:@"gaming"
                                        completion:^(NSDictionary *response, NSDictionary *error) {
    if (error) {
        NSLog(@"分享失败: %@", error);
    } else {
        NSLog(@"分享成功");
    }
}];
```

---

## 附录

### 登录类型枚举（LoginType）

```objc
typedef NS_ENUM(NSInteger, LoginType) {
    LoginTypeVisitor,       // 游客登录
    LoginTypeAccount,       // 账号密码登录
    LoginTypeCapCode,       // 验证码登录
    LoginTypeApple,         // 苹果登录
    LoginTypeFacebook,      // Facebook 登录
    LoginTypeLine,          // Line 登录
    LoginTypeGoogle,        // Google 登录
    LoginTypeWechat,        // 微信登录
    LoginTypeTwitter,       // Twitter 登录
    LoginTypeZalo,          // Zalo 登录
    LoginTypeTikTok,        // TikTok 登录
    // ... 更多登录类型
};
```

### 验证码类型枚举（CaptchaType）

```objc
typedef NS_ENUM(NSUInteger, CaptchaType) {
    CaptchaType_email,  // 邮箱验证码
    CaptchaType_phone,  // 手机验证码
};
```

### 密码强度枚举（RXPasswordStrength）

```objc
typedef NS_ENUM(NSInteger, RXPasswordStrength) {
    RXPasswordStrengthWeak,     // 弱
    RXPasswordStrengthMedium,   // 中
    RXPasswordStrengthStrong,   // 强
    RXPasswordStrengthCustom,   // 自定义（需设置正则）
};
```

### 注销点击类型枚举（DestroyClickType）

```objc
typedef NS_ENUM(NSUInteger, DestroyClickType) {
    DestroyClickType_normal,  // 知道了
    DestroyClickType_repeal,  // 撤销
    DestroyClickType_login,   // 继续登录
    DestroyClickType_logout,  // 退出登录
};
```

---

**最后更新**：2026-02-06  
**版本**：v1.1（新增 RXSDKCode 以外的组件框架）
