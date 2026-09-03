# RXApiService 接口文档

> 用户、验证码、区服角色等 API 接口定义  
> 用于重构参考：接口签名、参数说明、回调约定

## 📋 接口概览

**接口类**：`RXApiService`

**获取实例**：`[RXApiService sharedSDK]`

**回调约定**：所有接口统一使用 `RequestComplete`，详见[回调接口说明](./callback.md)

**主要功能**：
- 验证码：发送/校验验证码
- 账号绑定：邮箱/手机绑定、解绑、修改
- 用户信息：获取/修改用户信息、修改/重置密码
- 注册/实名认证
- 游戏区服/角色管理
- 公告/邮件/反馈

---

## 📱 验证码

### `sendCaptchaWithType:target:purpose:complete:`

发送验证码。

**方法签名**：

```objc
- (void)sendCaptchaWithType:(CaptchaType)type
                     target:(NSString *)target
                    purpose:(NSString *)purpose
                   complete:(RequestComplete)complete;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | `CaptchaType` | 是 | 验证码类型：`CaptchaType_email` 或 `CaptchaType_phone` |
| `target` | `NSString *` | 否 | 发送目标（手机或邮箱），传空默认为当前绑定的 |
| `purpose` | `NSString *` | 是 | 用途 |
| `complete` | `RequestComplete` | 是 | 回调接口 |

**purpose 可选值**：

| 值 | 说明 |
|------|------|
| `register` | 注册 |
| `bindphone` | 绑定手机 |
| `unbindphone` | 解绑手机 |
| `resetpwd` | 重置密码 |
| `changepwd` | 修改密码 |
| `bindemail` | 绑定邮箱 |
| `unbindemail` | 解绑邮箱 |
| `login` | 登录 |

**示例用法**：

```objc
[[RXApiService sharedSDK] sendCaptchaWithType:CaptchaType_email
                                       target:@"user@example.com"
                                      purpose:@"register"
                                     complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"发送失败: %@", error.msg);
        return;
    }
    NSLog(@"验证码已发送");
}];
```

---

### `verifyCaptchaWithType:target:purpose:captchaCode:complete:`

校验验证码。

**方法签名**：

```objc
- (void)verifyCaptchaWithType:(CaptchaType)type
                       target:(NSString *)target
                      purpose:(NSString *)purpose
                  captchaCode:(NSString *)captchaCode
                     complete:(RequestComplete)complete;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | `CaptchaType` | 是 | 验证码类型 |
| `target` | `NSString *` | 否 | 发送目标 |
| `purpose` | `NSString *` | 是 | 用途 |
| `captchaCode` | `NSString *` | 是 | 验证码 |
| `complete` | `RequestComplete` | 是 | 回调接口 |

---

## 📧 邮箱绑定

### `bindEmailWithEmail:password:captchaCode:migrateArgs:complete:`

绑定邮箱。

**方法签名**：

```objc
- (void)bindEmailWithEmail:(NSString *)email
                  password:(NSString *)password
               captchaCode:(NSString *)captchaCode
               migrateArgs:(id _Nullable)migrateArgs
                  complete:(RequestComplete)complete;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `email` | `NSString *` | 是 | 邮箱地址 |
| `password` | `NSString *` | 是 | 密码 |
| `captchaCode` | `NSString *` | 是 | 验证码 |
| `migrateArgs` | `id` | 否 | 账号迁移参数，透传给 CP |
| `complete` | `RequestComplete` | 是 | 回调接口 |

---

### `unBindEmailWithEmail:captchaCode:complete:`

解绑邮箱。

**方法签名**：

```objc
- (void)unBindEmailWithEmail:(NSString *)email    
                 captchaCode:(NSString *)captchaCode
                    complete:(RequestComplete)complete;
```

---

## 📞 手机绑定

### `bindPhoneWithCaptchaCode:password:phone:migrateArgs:complete:`

绑定手机。

**方法签名**：

```objc
- (void)bindPhoneWithCaptchaCode:(NSString *)captchaCode
                        password:(NSString *)password
                           phone:(NSString *)phone
                     migrateArgs:(id _Nullable)migrateArgs
                        complete:(RequestComplete)complete;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `captchaCode` | `NSString *` | 是 | 验证码 |
| `password` | `NSString *` | 是 | 密码 |
| `phone` | `NSString *` | 是 | 手机号 |
| `migrateArgs` | `id` | 否 | 账号迁移参数 |
| `complete` | `RequestComplete` | 是 | 回调接口 |

---

### `unBindPhoneWithCaptchaCode:phone:complete:`

解绑手机。

**方法签名**：

```objc
- (void)unBindPhoneWithCaptchaCode:(NSString *)captchaCode
                             phone:(NSString *)phone
                          complete:(RequestComplete)complete;
```

---

### `changePhoneWithOldPhoneCaptcha:newphone:newPhoneCaptcha:migrateArgs:complete:`

修改手机号。

**方法签名**：

```objc
- (void)changePhoneWithOldPhoneCaptcha:(NSString *)oldPhoneCaptcha
                              newphone:(NSString *)newphone
                       newPhoneCaptcha:(NSString *)newPhoneCaptcha
                           migrateArgs:(id _Nullable)migrateArgs
                              complete:(RequestComplete)complete;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `oldPhoneCaptcha` | `NSString *` | 是 | 当前手机号的 unbindphone 验证码 |
| `newphone` | `NSString *` | 是 | 新手机号 |
| `newPhoneCaptcha` | `NSString *` | 是 | 新手机号的 bindphone 验证码 |
| `migrateArgs` | `id` | 否 | 账号迁移参数 |
| `complete` | `RequestComplete` | 是 | 回调接口 |

---

## 👤 用户信息

### `getUserInfoWithComplete:`

获取用户信息。

**方法签名**：

```objc
- (void)getUserInfoWithComplete:(RequestComplete)complete;
```

---

### `updateUserInfo:nickname:sex:region:complete:`

修改用户信息。

**方法签名**：

```objc
- (void)updateUserInfo:(NSString *)avatarUrl
              nickname:(NSString *)nickname
                   sex:(NSString *)sex
                region:(NSString *)region
              complete:(RequestComplete)complete;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `avatarUrl` | `NSString *` | 否 | 头像 URL |
| `nickname` | `NSString *` | 否 | 用户昵称 |
| `sex` | `NSString *` | 否 | 性别：`1` 男，`0` 女 |
| `region` | `NSString *` | 否 | 地区码 |
| `complete` | `RequestComplete` | 是 | 回调接口 |

---

## 🔑 密码管理

### `changePasswordWithNewPwd:oldPwd:complete:`

修改密码。

**方法签名**：

```objc
- (void)changePasswordWithNewPwd:(NSString *)newPwd
                          oldPwd:(NSString *)oldPwd
                        complete:(RequestComplete)complete;
```

---

### `resetPasswordWithUsername:password:captchaCode:migrateArgs:complete:`

重置密码。

**方法签名**：

```objc
- (void)resetPasswordWithUsername:(NSString *)username
                         password:(NSString *)password
                      captchaCode:(NSString *)captchaCode
                      migrateArgs:(id _Nullable)migrateArgs
                         complete:(RequestComplete)complete;
```

---

## 📝 注册

### `registerWithUsername:password:captchaCode:ext:complete:`

注册账号。

**方法签名**：

```objc
- (void)registerWithUsername:(NSString * _Nullable)username
                    password:(NSString * _Nullable)password
                 captchaCode:(NSString * _Nullable)captchaCode
                         ext:(NSDictionary * _Nullable)ext
                    complete:(RequestComplete)complete;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `username` | `NSString *` | 是 | 账号/手机号/邮箱 |
| `password` | `NSString *` | 是 | 密码 |
| `captchaCode` | `NSString *` | 否 | 验证码，手机/邮箱注册必填 |
| `ext` | `NSDictionary *` | 否 | 扩展字段 |
| `complete` | `RequestComplete` | 是 | 回调接口 |

**ext 参数说明**：

| 键 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `nickname` | `NSString` | 否 | 昵称 |
| `avatarUrl` | `NSString` | 否 | 头像地址 |
| `sex` | `NSString` | 否 | 性别：`1` 男，`0` 女 |
| `migrate_args` | `id` | 否 | 账号迁移参数 |

---

## 🪪 实名认证

### `realAuthWithRealName:idCard:complete:`

实名认证。

**方法签名**：

```objc
- (void)realAuthWithRealName:(NSString *)realName
                      idCard:(NSString *)idCard
                    complete:(RequestComplete)complete;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `realName` | `NSString *` | 是 | 真实姓名 |
| `idCard` | `NSString *` | 是 | 身份证号 |
| `complete` | `RequestComplete` | 是 | 回调接口 |

---

## 🎮 游戏区服管理

### `searchGameAreaInfo:complete:`

查询游戏区服信息。

**方法签名**：

```objc
- (void)searchGameAreaInfoWithAreaId:(NSString *)areaId
                            complete:(RequestComplete)complete;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `areaId` | `NSString *` | 是 | 区服 ID |
| `complete` | `RequestComplete` | 是 | 回调接口 |

---

### `searchGameAreaListInfoWithComplete:`

查询区服列表信息。

**方法签名**：

```objc
- (void)searchGameAreaListInfoWithComplete:(RequestComplete)complete;
```

---

### `updateGameAreaInfoWithAreaId:areaName:areaStatus:areaType:extension:complete:`

修改游戏区服信息。

**方法签名**：

```objc
- (void)updateGameAreaInfoWithAreaId:(NSString *)areaId
                            areaName:(NSString *)areaName
                          areaStatus:(NSString *)areaStatus
                            areaType:(NSString *)areaType
                           extension:(NSDictionary *)extension
                            complete:(RequestComplete)complete;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `areaId` | `NSString *` | 否 | 区服 ID |
| `areaName` | `NSString *` | 否 | 区服名称 |
| `areaStatus` | `NSString *` | 否 | 区服状态，如 `active`、`inactive` |
| `areaType` | `NSString *` | 否 | 区服类型，如 `PVP`、`PVE` |
| `extension` | `NSDictionary *` | 否 | 扩展字段 |
| `complete` | `RequestComplete` | 是 | 回调接口 |

---

### `createGameAreaWithAreaId:areaName:areaStatus:areaType:extension:complete:`

创建游戏区服。

**方法签名**：

```objc
- (void)createGameAreaWithAreaId:(NSString *)areaId
                        areaName:(NSString *)areaName
                      areaStatus:(NSString *)areaStatus
                        areaType:(NSString *)areaType
                       extension:(NSDictionary *)extension
                        complete:(RequestComplete)complete;
```

---

### `deleteGameAreaWithAreaId:complete:`

删除游戏区服。

**方法签名**：

```objc
- (void)deleteGameAreaWithAreaId:(NSString *)areaId
                        complete:(RequestComplete)complete;
```

---

## 👤 游戏角色管理

### `createGameCharacterWithAreaId:...`

创建游戏角色。

**方法签名**：

```objc
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
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `areaId` | `NSString *` | 是 | 区服 ID |
| `characterFaction` | `NSString *` | 是 | 角色阵营 |
| `characterId` | `NSString *` | 是 | 角色 ID |
| `characterLevel` | `NSString *` | 是 | 角色等级 |
| `characterName` | `NSString *` | 是 | 角色名称 |
| `characterProfession` | `NSString *` | 是 | 角色职业 |
| `characterStatus` | `NSString *` | 是 | 角色状态 |
| `characterType` | `NSString *` | 是 | 角色类型 |
| `characterVipLevel` | `NSString *` | 是 | 角色 VIP 等级 |
| `cpUserId` | `NSString *` | 是 | CP 用户 ID |
| `extension` | `NSDictionary *` | 否 | 扩展字段 |
| `complete` | `RequestComplete` | 是 | 回调接口 |

---

### `searchGameCharacterListInfoWithCpUserId:complete:`

查询账号下角色信息列表。

**方法签名**：

```objc
- (void)searchGameCharacterListInfoWithCpUserId:(NSString *)cpUserId
                                       complete:(RequestComplete)complete;
```

---

### `searchGameCharacterListInAreaWithAreaId:cpUserId:complete:`

查询账号下某个区服下的角色信息列表。

**方法签名**：

```objc
- (void)searchGameCharacterListInAreaWithAreaId:(NSString *)areaId
                                       cpUserId:(NSString *)cpUserId
                                       complete:(RequestComplete)complete;
```

---

### `deleteGameCharacterWithAreaId:characterId:cpUserId:complete:`

删除游戏角色。

**方法签名**：

```objc
- (void)deleteGameCharacterWithAreaId:(NSString *)areaId
                          characterId:(NSString *)characterId
                             cpUserId:(NSString *)cpUserId
                             complete:(RequestComplete)complete;
```

---

## 📢 公告/邮件

### `getAnnouncementWithLimit:complete:`

获取公告列表。

**方法签名**：

```objc
- (void)getAnnouncementWithLimit:(int)limit 
                        complete:(void(^)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error))complete;
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `limit` | `int` | 是 | 返回公告条数，范围 1-100 |
| `complete` | `Block` | 是 | 回调接口 |

---

### `getEmailListWithCpUserID:complete:`

获取邮箱列表。

**方法签名**：

```objc
- (void)getEmailListWithCpUserID:(NSString *)cpUserID 
                        complete:(void(^)(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error))complete;
```

---

## 📤 设备/系统信息

### `getDeviceCode`

获取设备码。

**方法签名**：

```objc
- (NSString *)getDeviceCode;
```

---

### `getTimeZoneOffset`

获取当前时区与 UTC 时差。

**方法签名**：

```objc
- (NSString *)getTimeZoneOffset;
```

---

### `getSystemLanguage`

获取当前手机语言。

**方法签名**：

```objc
- (NSString *)getSystemLanguage;
```

---

### `getIDFA`

获取 IDFA。

**方法签名**：

```objc
+ (NSString *)getIDFA;
```

---

## 🔗 相关文档

- [回调接口说明](./callback.md)
- [RXService 接口文档](./rxservice_api.md)
- [支付接口文档](./iap_api.md)
