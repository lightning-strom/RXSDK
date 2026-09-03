# RXService 接口文档

> SDK 核心服务接口定义  
> 用于 SDK 初始化、登录、配置等核心功能

## 📋 接口概览

**接口类**：`RXService`

**获取实例**：`[RXService sharedSDK]`

**回调约定**：所有接口统一使用 `RequestComplete`，详见[回调接口说明](./callback.md)

**主要功能**：
- SDK 初始化与激活
- 登录（账号、第三方、Apple 等）
- 配置管理（语言、密码、区域等）
- 信息获取（域名、广告、OpenID 等）

---

## 🚀 初始化

### `sharedSDK`

获取 SDK 单例实例。

**方法签名**：

```objc
+ (instancetype)sharedSDK;
```

**示例用法**：

```objc
RXService *sdk = [RXService sharedSDK];
```

---

### `initWithConfig:complete:`

使用配置对象初始化 SDK。

**方法签名**：

```objc
- (void)initWithConfig:(RXSdkInitConfig *)config
              complete:(RequestComplete)complete;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `config` | `RXSdkInitConfig *` | 是 | 初始化配置对象 |
| `complete` | `RequestComplete` | 是 | 回调接口，详见[回调接口说明](./callback.md) |

**示例用法**：

```objc
RXSdkInitConfig *config = [[RXSdkInitConfig alloc] init];
config.productId = @"your_product_id";
config.channelId = @"your_channel_id";
config.cpid = @"your_cpid";
config.baseUrlList = @[@"https://api.example.com"];

[[RXService sharedSDK] initWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"初始化失败: %@", error.msg);
        return;
    }
    NSLog(@"初始化成功");
}];
```

---

### `initWithProductId:channelId:cpid:baseUrlList:complete:`

使用参数初始化 SDK。

**方法签名**：

```objc
- (void)initWithProductId:(NSString *)productId
                channelId:(NSString *)channelId
                     cpid:(NSString *)cpid
              baseUrlList:(NSArray *)baseUrlList
                 complete:(RequestComplete)complete;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `productId` | `NSString *` | 是 | 产品 ID |
| `channelId` | `NSString *` | 是 | 渠道 ID |
| `cpid` | `NSString *` | 是 | 瑞雪为每个项目分配的唯一 ID |
| `baseUrlList` | `NSArray *` | 是 | 请求域名队列 |
| `complete` | `RequestComplete` | 是 | 回调接口 |

---

### `initWithProfile:complete:`

使用 JSON 配置字符串初始化 SDK。

**方法签名**：

```objc
- (void)initWithProfile:(NSString *)profile
               complete:(RequestComplete)complete;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `profile` | `NSString *` | 是 | 初始化配置表，需符合 JSON 格式 |
| `complete` | `RequestComplete` | 是 | 回调接口 |

> ⚠️ 注意：此方法和 `initWithProductId` 只会生效一种，后调用的会覆盖前一份数据

---

### `requestActivatedWithSourceAd:complete:`

用户激活。

**方法签名**：

```objc
- (void)requestActivatedWithSourceAd:(NSDictionary * _Nullable)sourceAd
                            complete:(RequestComplete)complete;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `sourceAd` | `NSDictionary *` | 否 | 扩展信息 |
| `complete` | `RequestComplete` | 是 | 回调接口 |

**sourceAd 参数说明**：

| 键 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `source_ad` | `NSDictionary` | 否 | 客户端采集到的广告相关信息 |
| `user_agent` | `NSString` | 否 | user_agent，若为空取 header 的值 |
| `user_agent1` | `NSString` | 否 | 其他方式获取的 user_agent |
| `user_agent2` | `NSString` | 否 | 其他方式获取的 user_agent |

---

## 🔐 登录

### `loginWithLoginType:username:password:captchaCode:permissions:loginOpenId:extDic:signFields:migrateArgs:complete:`

统一登录接口（推荐）。

**方法签名**：

```objc
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
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `loginType` | `LoginType` | 是 | 登录类型枚举 |
| `username` | `NSString *` | 否 | 账号/手机号/邮箱，非账号登录传空 |
| `password` | `NSString *` | 否 | 密码，非账号登录传空 |
| `captchaCode` | `NSString *` | 否 | 验证码，验证码登录时必传 |
| `permissions` | `NSArray *` | 否 | 权限数组，Facebook/Line 登录时必传 |
| `loginOpenId` | `NSString *` | 否 | 二次登录 openId，nil 为普通登录 |
| `extDic` | `NSMutableDictionary *` | 否 | 扩展字段，断线重连可传 `reconnect_login = YES` |
| `signFields` | `NSArray *` | 否 | 签名字段，如 `@[@"nickname", @"avatar"]` |
| `migrateArgs` | `id` | 否 | 账号迁移参数，透传给 CP |
| `complete` | `RequestComplete` | 是 | 回调接口 |

**LoginType 枚举值**：

| 值 | 说明 |
|------|------|
| `LoginType_account` | 账号登录 |
| `LoginType_phone` | 手机登录 |
| `LoginType_email` | 邮箱登录 |
| `LoginType_captcha` | 验证码登录 |
| `LoginType_guest` | 游客登录 |
| `LoginType_apple` | Apple 登录 |
| `LoginType_facebook` | Facebook 登录 |
| `LoginType_google` | Google 登录 |
| `LoginType_line` | Line 登录 |
| `LoginType_wechat` | 微信登录 |
| ... | ... |

**示例用法**：

```objc
// 账号密码登录
[[RXService sharedSDK] loginWithLoginType:LoginType_account
                                 username:@"user@example.com"
                                 password:@"password123"
                              captchaCode:nil
                              permissions:nil
                              loginOpenId:nil
                                   extDic:nil
                               signFields:nil
                              migrateArgs:nil
                                 complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"登录失败: %@", error.msg);
        return;
    }
    NSLog(@"登录成功: %@", response);
}];
```

---

## ⚙️ 配置

### `setLanguage:`

设置当前语言。

**方法签名**：

```objc
- (void)setLanguage:(NSString *)language;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `language` | `NSString *` | 是 | 语言码，如 `en`、`zh-Hans` 等 |

---

### `setPasswordStrength:`

设置密码强度等级。

**方法签名**：

```objc
- (void)setPasswordStrength:(RXPasswordStrength)type;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | `RXPasswordStrength` | 是 | 密码强度等级枚举 |

---

### `setPwdPattern:`

设置自定义密码正则表达式。

**方法签名**：

```objc
- (void)setPwdPattern:(NSString *)pattern;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `pattern` | `NSString *` | 是 | 正则表达式 |

> ⚠️ 需要先将密码强度设置为自定义

---

### `setSubChannelId:`

设置子渠道 ID。

**方法签名**：

```objc
- (void)setSubChannelId:(NSString *)subChannelId;
```

---

### `setArea:`

设置当前地区。

**方法签名**：

```objc
- (void)setArea:(NSString *)area;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `area` | `NSString *` | 是 | 地区码 |

---

### `setGameInfoWithRoleId:regionTag:`

设置游戏角色信息。

**方法签名**：

```objc
- (void)setGameInfoWithRoleId:(NSString *)roleId
                    regionTag:(NSString *)regionTag;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `roleId` | `NSString *` | 是 | 游戏角色 ID |
| `regionTag` | `NSString *` | 是 | 区服信息 |

---

### `configErrorMsg:`

设置自定义错误码信息。

**方法签名**：

```objc
- (void)configErrorMsg:(NSDictionary *)msgDic;
```

---

## 📤 信息获取

### `getOpenID`

获取当前登录用户的 OpenID。

**方法签名**：

```objc
- (NSString *)getOpenID;
```

---

### `getApiDomain`

获取当前请求域名。

**方法签名**：

```objc
- (NSString *)getApiDomain;
```

---

### `getFirstBaseUrl`

获取当前 baseUrl。

**方法签名**：

```objc
- (NSString *)getFirstBaseUrl;
```

---

### `getAdInfo`

获取广告信息。

**方法签名**：

```objc
- (NSDictionary *)getAdInfo;
```

---

### `deleteAdInfo`

清空广告信息。

**方法签名**：

```objc
- (void)deleteAdInfo;
```

---

### `getConfigData`

获取配置数据。

**方法签名**：

```objc
- (NSDictionary *)getConfigData;
```

---

### `getLaunchOptions`

获取启动参数（AppDelegate）。

**方法签名**：

```objc
- (NSDictionary *)getLaunchOptions;
```

---

### `getConnectOptions`

获取启动参数（SceneDelegate）。

**方法签名**：

```objc
- (UISceneConnectionOptions *)getConnectOptions;
```

---

## 📝 其他

### `getLegalInfo:`

获取法务配置信息。

**方法签名**：

```objc
- (void)getLegalInfo:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;
```

---

### `createRequestWithUrl:header:body:method:needLogin:complete:`

自定义请求。

**方法签名**：

```objc
- (void)createRequestWithUrl:(NSString *)url
                      header:(NSMutableDictionary * _Nullable)header
                        body:(NSMutableDictionary * _Nullable)body
                      method:(NSInteger)method
                   needLogin:(BOOL)needLogin
                    complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `url` | `NSString *` | 是 | 接口名，可传路径或完整 URL |
| `header` | `NSMutableDictionary *` | 否 | 请求头 |
| `body` | `NSMutableDictionary *` | 否 | 请求参数 |
| `method` | `NSInteger` | 是 | 请求类型：1 POST，2 GET |
| `needLogin` | `BOOL` | 是 | 是否需要登录 |
| `complete` | `Block` | 是 | 回调 |

---

## 🔗 相关文档

- [回调接口说明](./callback.md)
- [RXApiService 接口文档](./rxapi_service.md)
