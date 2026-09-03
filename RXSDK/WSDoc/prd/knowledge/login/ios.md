## SDK 集成

<span style="color:#181818; background-color:#f3e908;">接入请前先做好准备工作。</span>
<span style="color:#181818; background-color:#f3e908;">可通过 pod 方式接入通行证 UIKit 组件，并使用通行证 UIKit 相关功能。</span>
<span style="color:#181818; background-color:#f3e908;">在需要使用功能的类中引用头文件#import <RXSDK_Pure/RXSDK_Pure.h></span>

- 编辑 Podfile 文件，添加如下配置：

```objectivec
pod 'RXSDK_Pure'
```

:::tip
"非法注册（限制代码1）" code : 312232 为 注册ip限制，<span style='color:red'>默认开启</span>，同一ip默认1小时注册账号不能超过2个，如有需求请联系商务添加ip白名单或调整限制条件。
"非法注册（限制代码2）" code : 312232 为 注册设备限制，<span style='color:red'>默认关闭</span>，同一设备x小时注册账号不能超过x个，如有需求请联系商务开启。
:::

### 注册

**接口原型**

```objectivec
/**
 * 注册
 * @param username 账号注册为账号，手机注册为手机号，邮箱注册为邮箱  必须
 * @param password 密码  必须
 * @param captchaCode 验证码  手机或邮箱注册为必须，账号注册非必须
 * @param ext 扩展字段
 * ！ext参数说明：
 * ！nickname 昵称  非必须    #NSString类型
 * ！avatarUrl 头像地址  非必须    #NSString类型
 * ！sex 性别,1:男,0:女  非必须    #NSString类型
 * ！migrate_args 任意合法的 json 类型, 比如 string, number，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 */
- (void)registWithUsername:(NSString *)username
                  password:(NSString *)password
               captchaCode:(NSString * _Nullable)captchaCode
                       ext:(NSDictionary * _Nullable)ext
                  complete:(RequestComplete)complete;
```

#### 参数说明

| **字段**    | **类型**     | **是否必填** | **备注**                                         |
| ----------- | ------------ | ------------ | ------------------------------------------------ |
| username    | NSString     | 是           | 账号注册为账号，手机注册为手机号，邮箱注册为邮箱 |
| password    | NSString     | 是           | 密码                                             |
| captchaCode | NSString      | 否           | 验证码  手机或邮箱注册为必须，账号注册非必须     |
| ext         | NSDictionary | 否           | 扩展字段                                         |

> ext 结构说明

| **字段**     | **类型** | **是否必填** | **备注**                                                                                                                                             |
| ------------ | -------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| nickname     | NSString | 否           | 昵称                                                                                                                                                 |
| avatarUrl    | NSString | 否           | 头像地址                                                                                                                                             |
| sex          | NSArray  | 否           | 性别，1 男 0 女                                                                                                                                      |
| migrate_args | id       | 否           | 任意合法的 json 类型, 比如 NSString, NSNumber, NSArray, NSDictionary 账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP |
| custom_ext        |    NSDictionary   | 否           | 自定义透传参数 |

>> customExt 结构说明

| **字段**                | **类型**  | **是否必填** | **备注** |
| ----------------------- | --------- | ------------ | -------- |
| bigdata_ext        |    NSDictionary   | 否           | 大数据预置事件透传参数 |

**调用示例**

```objectivec
[[RXApiService sharedSDK] registWithUsername:@"username"
                                    password:@"password"
                                 captchaCode:nil
                                         ext:nil
                                    complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
            
}];
```

**响应示例**

```json
{
    "code": 0,
    "data": {
        "id": 2031,
        "openid": "rxuIR2c1N1EdU9s/gkE8I8bEQ==" // 示例，瑞雪 openid
    }
}
```

### 登录

**接口原型**

```objectivec
- (void)loginWithConfig:(RXLoginConfig *)config
               complete:(RXSDKRequestComplete)complete;
```

#### RXLoginConfig 说明

| **字段**     | **类型**            | **是否必填** | **备注**                                                                                                                                                                                                                                                                                    |
| ------------ | ------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| loginType    | LoginType           | 是           | 登录类型                                                                                                                                                                                                                         |
| username     | NSString            | 否           | 非账号登录传空，账号注册为账号，手机注册为手机号，邮箱注册为邮箱                                                                                                                                                                                                                            |
| password     | NSString            | 否           | 非账号登录传空                                                                                                                                                                                                                                                                              |
| captchaCode  | NSString            | 否           | 验证码，登录方式为验证码时必传，其他登录方式可传空空                                                                                                                                                                                                                                                                              |
| loginOpenId  | NSString            | 否           | 登录返回的 login_openid，nil或空为普通登录，传该字段表示使用瑞雪凭证进行快速登录，不会拉起三方授权                                                                                                                                                                                                                                                                              |
| extDic       | NSMutableDictionary | 否           | 扩展字段                                                                                                                                                                                                                                                                                    |
| sign_fields  | NSArray             | 否           | 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"] |
| migrate_args | id                  | 否           | 任意合法的 json 类型, 比如 NSString, NSNumber, NSArray, NSDictionary 账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP                                                                                                                                        |
> extDic 结构说明

| **字段**                | **类型**  | **是否必填** | **备注** |
| ----------------------- | --------- | ------------ | -------- |
| custom_ext        |    NSDictionary   | 否           | 自定义透传参数 |

>> customExt 结构说明

| **字段**                | **类型**  | **是否必填** | **备注** |
| ----------------------- | --------- | ------------ | -------- |
| bigdata_ext        |    NSDictionary   | 否           | 大数据预置事件透传参数 |

> loginType 结构说明

| **字段**          | **备注**      |
| ----------------- | ------------- |
| LoginTypeVisitor  | 游客登录      |
| LoginTypeAccount  | 账号登录      |
| LoginTypeEmail    | 邮箱登录      |
| LoginTypeW        | 微信登录，需要先接入微信配置，请参考 [微信接入](https://doc.ruixueyun.com/main/#/view?viewPath=da9f3909-cf07-4c21-96f8-73784ce73e21)      |
| LoginTypeApple    | 苹果登录，需要先接入苹果配置，请参考 [Apple 接入](https://doc.ruixueyun.com/main/#/view?viewPath=c09d1d77-4603-434a-af58-bba4fdfefd60)      |
| LoginTypeCapCode  | 验证码登录，username 传入手机号，调用 [获取验证码](https://doc.ruixueyun.com/main/#/view?viewPath=1f64c832-e14b-42f9-9d73-6ad5de4bb044&title=%E8%8E%B7%E5%8F%96%E9%AA%8C%E8%AF%81%E7%A0%81%EF%BC%88%E5%8F%91%E9%80%81%E9%AA%8C%E8%AF%81%E7%A0%81%EF%BC%89&tab=&index=1) 后登录接口传入 @"captcha_code" : @"收到的验证码"    |
| LoginTypeGoogle   | Google 登录，需要先接入 Google 配置，请参考 [Google 接入](https://doc.ruixueyun.com/main/#/view?viewPath=9e5f0aab-3fa2-49db-9b62-3bf16bd9e040)   |
| LoginTypeFacebook | Facebook 登录，需要先接入 Facebook 配置，请参考 [Facebook 接入](https://doc.ruixueyun.com/main/#/view?viewPath=0d2e7062-cd19-484f-b2d7-b7ee62190945) |
| LoginTypeLine     | Line 登录，需要先接入 Line 配置，请参考 [Line 接入](https://doc.ruixueyun.com/main/#/view?viewPath=08da2938-b830-443a-a86b-f73fca38a441)      |
| LoginTypeAuth     | 一键登录       |
| LoginTypeZalo     | Zalo登录，需要先接入 Zalo 配置，请参考 [Zalo 接入](https://doc.ruixueyun.com/main/#/view?viewPath=11d57ee7-c8d6-4260-bf1d-7dc0a74e2bcf)       |
| LoginTypeInstagram | Instagram 登录，需要先接入 Instagram 配置，请参考 [Instagram 接入](https://doc.ruixueyun.com/main/#/view?viewPath=c7f5d99c-8cda-4195-bb50-52a08781481e)  |
| LoginTypeTiktok   | Tiktok 登录，需要先接入 Tiktok 配置，请参考 [Tiktok 接入](https://doc.ruixueyun.com/main/#/view?viewPath=f5deb004-7405-44d0-a477-800774c43d82)     |
| LoginTypeReddit   | Reddit 登录，需要先接入 Reddit 配置，请参考 [Reddit 接入](https://doc.ruixueyun.com/main/#/view?viewPath=46842eeb-abdb-4da3-a312-7135871c2e89)     |

**调用示例**

```objectivec
RXLoginConfig *config = [[RXLoginConfig alloc] init];
config.loginType = LoginTypeVisitor;

// 【可选】大数据预置事件透传参数
// NSMutableDictionary *extDic = [NSMutableDictionary dictionary];
// NSMutableDictionary *customExt = [NSMutableDictionary dictionary];
// [customExt setValue:@{@"a" : @"b"} forKey:@"bigdata_ext"];
// [extDic setValue:customExt forKey:@"custom_ext"];

config.extDic = extDic;
    
[[RXSDK sharedSDK] loginWithConfig:config complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"[RXSDK] 游客登录失败: code=%ld, msg=%@", (long)error.code, error.msg);
    } else {
        NSLog(@"[RXSDK] 游客登录成功: %@", response);
    }
}];

```

#### 响应结构

##### 二次登录响应结构也是这个结构

请参考 [服务端登录API](https://doc.ruixueyun.com/main/#/view?viewPath=61222751-24cf-4ff5-a838-109a8e24af9a&title=%E5%93%8D%E5%BA%94%E7%BB%93%E6%9E%84%EF%BC%88JSON%EF%BC%89&tab=&index=2)响应结构

### login_openid 有效期
**接口原型**

```objectivec
/**
 * login_openid 是否失效，YES 失效，NO 有效
 */
- (BOOL)loginOpenidExpireInvalid;
```
**调用示例**

```objectivec
BOOL isInvalid = [[RXSDK sharedSDK] loginOpenidExpireInvalid];
```

### 设置密码等级
::: tip
默认等级为 strong
:::
**接口原型**

```objectivec
/**
 * 设置密码等级
 * @param type 密码强度等级枚举
 */
- (void)setPasswordStrength:(RXPasswordStrength)type;
```

**type 说明**

| **字段**  | **说明**                                                                         |
| ----------------- | --------------------------------- |
| Default      | 6-32 位任意字符   |
| Custom      | 自定义密码正则  |
| Average      | 简易密码， 6-32 位任意字符 |
| Strong      | 强密码，  6-32 位，包含数字+字母+特殊符号  |


**调用示例**

```objectivec
[[RXSDK sharedSDK] setPasswordStrength:Average];
```

### 自定义密码正则
**接口原型**

```objectivec
/**
 * 设置密码正则
 * 需要先将密码强度设置为自定义
 */
- (void)setPwdPattern:(NSString *)pattern;
```

**调用示例**

```objectivec
[[RXSDK sharedSDK] setPwdPattern:自定义正则];
```

## 用户中心

### 申请注销账号

**接口原型**

```objectivec
/**
 * 申请注销账号
 * @param config 注销参数配置
 */
- (void)deregisterWithConfig:(RXDeregisterConfig *)config
                    complete:(RequestComplete)complete;
```

#### RXDeregisterConfig 说明

| **字段** | **类型** | **是否必填** | **备注**      |
| -------- | -------- | ------------ | ------------- |
| IDCard   | NSString | 否           | 身份证，<span style='color:red'>已实名用户必传，未实名用户可不传</span>      |
| realname | NSString | 否           | 真实姓名，<span style='color:red'>已实名用户必传，未实名用户可不传</span>      |
| cpdata   | NSString | 否           | CP 自定义数据，建议传 game_user_id=用户的游戏 id，不传在瑞雪后台不会账号注销页面不显示游戏侧的用户id |
| thirdParams   | NSDictionary | 否           | 三方渠道透传数据 |

**调用示例**

```objectivec
RXDeregisterConfig *config = [[RXDeregisterConfig alloc] init];
config.idCard = @"身份证";
config.realname = @"姓名";
config.cpdata = @"{\"game_user_id\":\"游戏 id\"}";
[[RXSDK sharedSDK] deregisterWithConfig:config complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
    if (!error) {
        NSLog(@"%@",response);
    }else{
        NSLog(@"%@",error.responesObject);
    }
}];
```

**响应示例**

```json
{
    "code": 0
}
```

### 撤销注销申请

**接口原型**

```objectivec
/**
 * 撤销注销申请
 */
- (void)deregisterCancelWithComplete:(RequestComplete)complete
```

**调用示例**

```objectivec
[[RXSDK sharedSDK] deregisterCancelWithComplete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
    NSString *msg;
    if (!error) {
        NSLog(@"%@",response);
    }else{
        NSLog(@"%@",error.responesObject);
    }
}];
```

**响应示例**

```json
{
    "code": 0
}
```

### 获取验证码（发送验证码）

::: tip
获取验证码需填写对应意图 purpose。
type 和 target 需对应，否则无法接收验证码。
target 传空或 nil 默认为当前绑定的手机或邮箱。
:::

**接口原型**

```objectivec
/**
 * 发送验证码
 * @param type 验证码类型
 * @param target 发送的目标（手机或邮箱），传空或nil默认为当前绑定的手机或邮箱
 * @param randstr 图形验证随机串，可传空
 * @param ticket 图形验证凭证，可传空
 * @param purpose 用途
 * ！register           // 注册
 * ！bindphone      // 绑定手机
 * ！unbindphone  // 解绑手机
 * ！resetpwd        // 重置密码
 * ！changepwd    // 修改密码
 * ！bindemail       // 绑定邮箱
 * ！unbindemail   // 解绑邮箱
 * ！login               // 登录
 */
- (void)sendCaptchaWithType:(CaptchaType)type
                     target:(NSString *)target
                    purpose:(NSString *)purpose
                     ticket:(NSString *)ticket
                    randstr:(NSString *)randstr
                   complete:(RequestComplete)complete;
```

#### 参数说明

| **字段** | **类型**    | **是否必填** | **备注**                                                        |
| -------- | ----------- | ------------ | --------------------------------------------------------------- |
| type     | CaptchaType | 是           | 验证码类型                                                      |
| target   | NSString    | 否           | 发送的目标（手机或邮箱），传空或 nil 默认为当前绑定的手机或邮箱 |
| purpose  | NSString    | 是           | 短信意图                                                        |
| ticket  | NSString    | 否           | 图形验证凭证                                                     |
| randstr  | NSString    | 否           | 图形验证随机串                                                  |

> type 说明

| **字段**          | **备注** |
| ----------------- | -------- |
| CaptchaType_email | 邮箱     |
| CaptchaType_phone | 手机     |

> purpose 说明

| **字段**    | **备注** |
| ----------- | -------- |
| register    | 注册     |
| bindphone   | 绑定手机 |
| unbindphone   | 解绑手机 |
| resetpwd    | 重置密码 |
| changepwd   | 修改密码 |
| bindemail   | 绑定邮箱 |
| unbindemail   | 解绑邮箱 |
| login       | 登录     |
| setpwd      | 设置密码 |

**调用示例**

```objectivec
[[RXSDK sharedSDK] sendCaptchaWithType:CaptchaType_phone target:@"手机号" purpose:@"用途" ticket:@"" randstr:@"" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
    if (!error) {
        NSLog(@"%@", response);
    }else{
        NSLog(@"%@", error.responesObject);
    }
}];
```

#### 响应结构
| **字段** | **类型**    | **备注**                                                        |
| -------- | ---------- | --------------------------------------------------------------- |
| interval  | int       | 发送间隔                                                 |
| surplus   | int       | 剩余发送间隔    |

**响应示例**

```json
{
    "code": 0,
    "data": {
        "interval": 60,  // 发送间隔
        "surplus": 60    // 剩余发送间隔
    }
}
```

### 校验验证码

::: tip
用途和手机号或邮箱需要和调用发送验证码时一致。
:::

**接口原型**

```objectivec
/**
 * 校验验证码
 * @param type 验证码类型
 * @param target 发送的目标（手机或邮箱），传空或nil默认为当前绑定的手机或邮箱
 * @param captcha_code 验证码
 * @param purpose 用途
 */
- (void)verifyCaptchaWithType:(CaptchaType)type
                       target:(NSString *)target
                      purpose:(NSString *)purpose
                  captchaCode:(NSString *)captchaCode
                     complete:(RequestComplete)complete;
```

#### 参数说明

| **字段** | **类型**    | **是否必填** | **备注**                                                        |
| -------- | ----------- | ------------ | --------------------------------------------------------------- |
| type     | CaptchaType | 是           | 验证码类型                                                      |
| target   | NSString    | 是           | 发送的目标（手机或邮箱），传空或 nil 默认为当前绑定的手机或邮箱 |
| purpose  | NSString    | 是           | 短信意图                                                        |
| captcha_code  | NSString    | 是           | 验证码                                                       |

> type 说明

| **字段**          | **备注** |
| ----------------- | -------- |
| CaptchaType_email | 邮箱     |
| CaptchaType_phone | 手机     |

> purpose 说明

| **字段**    | **备注** |
| ----------- | -------- |
| register    | 注册     |
| bindphone   | 绑定手机 |
| unbindphone   | 解绑手机 |
| resetpwd    | 重置密码 |
| changepwd   | 修改密码 |
| bindemail   | 绑定邮箱 |
| unbindemail   | 解绑邮箱 |
| login       | 登录     |
| setpwd      | 设置密码 |

**调用示例**

```objectivec
[[RXSDK sharedSDK] verifyCaptchaWithType:CaptchaType_phone target:@"手机号" purpose:@"用途" captchaCode:@"验证码" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
    if (!error) {
        NSLog(@"%@", response);
    }else{
        NSLog(@"%@", error.responesObject);
    }
}];
```

**响应示例**

```json
{
    "code": 0
}
```

### 绑定邮箱

**接口原型**

```objectivec
/**
 * 绑定邮箱
 * @param captchaCode 验证码
 * @param password 密码
 * @param email 邮箱
 * @param migrateArgs 任意合法的 json 类型, 比如 string, nujber，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 */
- (void)bindEmailWithEmail:(NSString *)email
                  password:(NSString *)password
               captchaCode:(NSString *)captchaCode
               migrateArgs:(id _Nullable)migrateArgs
                  complete:(RequestComplete)complete;
```

#### 参数说明

| **字段**     | **类型** | **是否必填** | **备注**                                                                                                                                             |
| ------------ | -------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| captchaCode  | NSString | 是           | 验证码                                                                                                                                               |
| password     | NSString | 是           | 密码                                                                                                                                                 |
| email        | NSString | 是           | 邮箱                                                                                                                                                 |
| migrateArgs | id       | 否           | 任意合法的 json 类型, 比如 NSString, NSNumber, NSArray, NSDictionary 账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP |

**调用示例**

```objectivec
[[RXSDK sharedSDK] bindEmailWithEmail:@"邮箱" password:nil captchaCode:@"验证码" migrateArgs:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
    if (!error) {
        NSLog(@"%@", response);
    }else{
        NSLog(@"%@", error.responesObject);
    }  
}];
```

**响应示例**

```json
{
    "code": 0
}
```


### 绑定手机号

**接口原型**

```objectivec
/**
 * 绑定手机
 * @param captchaCode 验证码
 * @param password 密码
 * @param phone 手机号
 * @param migrateArgs 任意合法的 json 类型, 比如 string, nujber，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 */
- (void)bindPhoneWithCaptchaCode:(NSString *)captchaCode
                        password:(NSString *)password
                           phone:(NSString *)phone
                     migrateArgs:(id _Nullable)migrateArgs
                        complete:(RequestComplete)complete;
```

#### 参数说明

| **字段**     | **类型** | **是否必填** | **备注**                                                                                                                                             |
| ------------ | -------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| captchaCode  | NSString | 是           | 验证码                                                                                                                                               |
| password     | NSString | 否           | 密码                                                                                                                                                 |
| phone        | NSString | 是           | 手机号                                                                                                                                               |
| migrateArgs | id       | 否           | 任意合法的 json 类型, 比如 NSString, NSNumber, NSArray, NSDictionary 账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP |

**调用示例**

```objectivec
[[RXSDK sharedSDK] bindPhoneWithCaptchaCode:@"验证码" password:nil phone:@"手机号" migrateArgs:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
    if (!error) {
        NSLog(@"%@", response);
    }else{
        NSLog(@"%@", error.responesObject);
    }     
}];
```

**响应示例**

```json
{
    "code": 0
}
```


### 换绑手机号

**接口原型**

```objectivec
/**
 * 换绑手机号
 * @param oldphone_captcha 当前登录的手机号的 unbindphone 验证码
 * @param newphone 新的手机号
 * @param newphone_captcha 新手机号的 bindphone 验证码
 * @param migrate_args 任意合法的 json 类型, 比如 string, number，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 */
- (void)changePhoneWithOldphone_captcha:(NSString *)oldphone_captcha
                               newphone:(NSString *)newphone
                       newphone_captcha:(NSString *)newphone_captcha
                           migrate_args:(id _Nullable)migrate_args
                               complete:(RequestComplete)complete;
```

#### 参数说明

| **字段**         | **类型** | **是否必填** | **备注**                                                                                                                                             |
| ---------------- | -------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| oldphone_captcha | NSString | 是           | 当前登录的手机号的 unbindphone 验证码                                                                                                                |
| newphone         | NSString | 是           | 新的手机号                                                                                                                                           |
| newphone_captcha | NSString | 是           | 新手机号的 bindphone 验证码                                                                                                                          |
| migrate_args     | id       | 否           | 任意合法的 json 类型, 比如 NSString, NSNumber, NSArray, NSDictionary 账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP |

**调用示例**

```objectivec
[[RXSDK sharedSDK] changePhoneWithOldphone_captcha:@"oldphone_captcha" newphone:@"newphone" newphone_captcha:@"newphone_captcha" migrate_args:**nil** complete:^(NSDictionary * **_Nullable** response, RX_CommonRequestError * **_Nullable** error) {
    if (!error) {
        NSLog(@"%@", response);
    }else{
        NSLog(@"%@", error.responesObject);
    }
}];
```

**响应示例**

```json
{
    "code": 0
}
```

### 获取用户信息

**接口原型**

```objectivec
/**
 * 获取用户信息
 */
- (void)getUserInfoWithComplete:(RequestComplete)complete;
```

**调用示例**

```objectivec
[[RXSDK sharedSDK] getUserInfoWithComplete complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
    if (!error) {
        NSLog(@"%@", response);
    }else{
        NSLog(@"%@", error.responesObject);
    }
}];
```

#### 响应结构（JSON）

| **字段**         | **类型**          | **说明**                                                                                                                                                                                                                                                       |
| ---------------- |-----------------| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| age              | Number          | 用户年龄，根据实名信息获取。                                                                                                                                                                                                                                   |
| sex              | Number          | 性别。0 表示女性，1 表示男性。                                                                                                                                                                                                                                 |
| user_state       | Number          | 用户状态定义, 0 为正常用户。为正数时，使用各位编码用户的不同状态（以下表述中，第 0 位表示最低位）:第 0 位: 为 1 表示玩家已提交注销申请第 1 位: 为 1 表示已注销。可以是客服同意玩家的注销申请，也可以是客服直接在后台操作将账号注销。第 2 位: 为 1 表示已封停。 |
| attr             | [Number](https://doc.ruixueyun.com/main/#/view?viewPath=1f64c832-e14b-42f9-9d73-6ad5de4bb044&title=attr%E6%A0%87%E8%AE%B0&tab=&index=0) | 账号状态标记，使用位运算构成。参考下文 [attr 标记说明](https://doc.ruixueyun.com/main/#/view?viewPath=1f64c832-e14b-42f9-9d73-6ad5de4bb044&title=attr%E6%A0%87%E8%AE%B0&tab=&index=0)                                                                                                             |
| openid           | String          | 瑞雪用户 OpenID。                                                                                                                                                                                                                                              |
| external_openid  | String          | 三方 openid                                                                                                                                                                                                                                                    |
| external_unionid | String          | 三方 unionid                                                                                                                                                                                                                                                   |
| wx_unionid       | String          | [DEPRECATED] 三方 unionid                                                                                                                                                                                                                                      |
| mobile_phone     | String          | 手机号                                                                                                                                                                                                                                                         |
| nickname         | String          | 昵称                                                                                                                                                                                                                                                           |
| avatarurl        | String          | 头像                                                                                                                                                                                                                                                           |
| idCard           | String          | 身份证号                                                                                                                                                                                                                                                       |
| realName         | String          | 姓名                                                                                                                                                                                                                                                           |
| theme_skin         | int          | 客服主题皮肤 0 默认皮肤 1 VIP主题            |

##### attr标记
attr 标记，由以下标记位构成

| **标识** | **备注**                                       |
| -------- | ---------------------------------------------- |
| 0        | 是否已通过瑞雪完成实名认证，1 表示已实名。     |
| 1        | 用户当前是否有绑定手机号，1 表示有绑定。       |
| 2        | 用户当前是否有绑定邮箱，1 表示有绑定。         |
| 3        | 用户当前是否有已设置密码的登录凭证，1 表示有。 |
| 4        | 用户是否通过瑞雪完成实名认证，1 表示是。       |

**响应示例**

```json
{
    "code": 0,
    "data": {
        "avatarurl": "",
        "mobile_phone": "159****7520",
        "nickname": "rssllyn",
        "openid": "rxuWFnlHRbTZ5ED5TkwAG5XVQ==",
        "sex": 0,
        "user_state": 0,
        "attr": 0
    }
}
```

### 修改用户信息
:::tip
由于部分项目的 **用户信息（头像、昵称、性别）** 没有直接使用**瑞雪通行证数据**，而是采用由**瑞雪通知游戏服务器同步方式**，<span style="color:#ff0000;">在网络不好时可能会通知失败，导致游戏服务器存储的用户信息和瑞雪通行证信息不一致的情况</span>。

每次调用修改用户信息时瑞雪会重新通知游戏服务器，为 **降低通知频率 减少服务器压力** 每次调用 **updateUserInfo** 时可将**旧用户信息传入 ext 中**，<span style="color:#ff0000;">瑞雪对信息进行比对后将未修改的用户信息通知给游戏服务器，已修改的用户信息不会同步</span>。
:::

**接口原型**

```objectivec
/**
 * 修改用户信息
 * @param avatarUrl 头像url 非必传
 * @param nickname 用户昵称 非必传
 * @param sex 性别 1男 0女 非必传
 * @param region 地区码 非必传
 * @param ext 透传参数 非必传
 */
- (void)updateUserInfo:(NSString *)avatarUrl
              nickname:(NSString *)nickname
                   sex:(NSString *)sex
                region:(NSString *)region
                   ext:(NSDictionary *)ext
              complete:(RequestComplete)complete;
```

#### 参数说明

| **字段**  | **类型** | **是否必填** | **备注**        |
| --------- | -------- | ------------ | --------------- |
| avatarUrl | NSString | 否           | 头像 url        |
| nickname  | NSString | 否           | 用户昵称        |
| sex       | NSString | 是           | 性别，1 男 0 女，<span style='color:red'>无改动传-1，不传会默认修改为女性</span> |
| region    | NSString | 否           | 地区码          |
| ext    | NSDictionary | 否           | 透出参数，目前仅作为数据校验使用 |

> **ext 说明**

| **字段**  | **类型** | **是否必填** | **备注**        |
| --------- | -------- | ------------ | --------------- |
| old_avatarurl | NSString | 否           | 旧头像 url        |
| old_nickname  | NSString | 否           | 旧用户昵称        |
| old_sex       | NSString | 是           | 旧性别，1 男 0 女，<span style='color:red'>无改动传-1，不传会默认修改为女性</span> |

**调用示例**

```objectivec
NSDictionary *ext = @{
    @"old_avatarUrl" : @"旧头像",
    @"old_nickname" : @"旧昵称",
    @"old_sex" : @"旧性别"
};

[[RXSDK sharedSDK] updateUserInfoWithAvatarUrl:@"头像" nickname:@"昵称" sex:@"性别" region:@"地区码" ext:ext complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
    if (!error) {
        NSLog(@"%@", response);
    }else{
        NSLog(@"%@", error.responesObject);
    }
}];
```

**响应示例**

```json
{
    "code": 0
}
```

### 同步用户信息
:::tip
由于用户会主动在游戏内修改头像昵称，未避免覆盖用户主动修改的信息，**三方用户信息（头像、昵称）只在注册时作为默认信息使用**，后续登录行为不会再同步三方用户信息，如需要同步可调用同步用户信息接口。

<span style="color:#ff0000; background-color:#f8f8f8;">注意1：同步用户信息需要跳转到三方由用户主动授权，表现上和授权登录一致。</span>

<span style="color:#ff0000; background-color:#f8f8f8;">注意2：同步后需要对信息进行审核，当前接口只代表同步行为成功，不代表同步用户信息成功，用户信息是否同步成功可在登录数据中对比。</span>

:::

**接口原型**

```objectivec
/**
 * 同步信息
 * 调用后会跳转到微信授权登录，但不会走登录回调，同步信息通过此接口回调
 * @param wxAppid 微信登录appid
 */
- (void)syncInfoWithWXAppid:(NSString *)wxAppid
                   complete:(void(^)(NSDictionary *response, RX_CommonRequestError *error))complete;
```

**调用示例**

```objectivec
[[RXSDK sharedSDK] syncInfoWithWXAppid:@"wx1111111" complete:^(NSDictionary * _Nonnull response, RX_CommonRequestError * _Nonnull error) {
    if (!error) {
        NSLog(@"用户信息同步成功");
    } else {
        NSLog(@"用户信息同步失败");
    }
}];
```

**响应示例**

```json
{
    "code": 0
}
```

### 修改密码

**接口原型**

```objectivec
/**
 * 修改密码(设置密码)
 * @param oldPwd 旧密码。如果旧密码传空，则默认为账号设置密码
 * @param newPwd 新密码
 */
- (void)changePasswordWithNewPwd:(NSString *)newPwd
                          oldPwd:(NSString *)oldPwd
                        complete:(RequestComplete)complete;
```

#### 参数说明

| **字段** | **类型** | **是否必填** | **备注** |
| -------- | -------- | ------------ | -------- |
| oldPwd   | NSString | 是           | 旧密码   |
| newPwd   | NSString | 是           | 新密码   |

**调用示例**

```objectivec
[[RXSDK sharedSDK] changePasswordWithNewPwd:@"新密码" oldPwd:@"旧密码" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
    if (!error) {
        NSLog(@"%@", response);
    }else{
        NSLog(@"%@", error.responesObject);
    }
}];
```

:::

**响应示例**

```json
{
    "code": 0
}
```

### 重置密码

**接口原型**

```objectivec
/**
 * 重置密码
 * @param username 用户名
 * @param password 密码
 * @param captchaCode 验证码
 * @param migrate_args 任意合法的 json 类型, 比如 string, number，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 */
- (void)resetPasswordWithUsername:(NSString *)username
                         password:(NSString *)password
                      captchaCode:(NSString *)captchaCode
                     migrate_args:(id _Nullable)migrate_args
                         complete:(RequestComplete)complete;
```

#### 参数说明

| **字段**     | **类型** | **是否必填** | **备注**                                                                                                                                             |
| ------------ | -------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| username     | NSString | 是           | 用户名                                                                                                                                               |
| password     | NSString | 是           | 密码                                                                                                                                                 |
| captchaCode  | NSString | 是           | 验证码                                                                                                                                               |
| migrate_args | id       | 否           | 任意合法的 json 类型, 比如 NSString, NSNumber, NSArray, NSDictionary 账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP |

**调用示例**

```objectivec
[[RXSDK sharedSDK] resetPasswordWithUsername:@"用户名" password:@"密码" captchaCode:@"验证码" migrate_args:nil complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
    if (!error) {
        NSLog(@"%@", response);
    }else{
        NSLog(@"%@", error.responesObject);
    }
}];
```

**响应示例**

```json
{
    "code": 0
}
```

### 绑定三方账号
:::tip
以下两种使用场景的调用不同，具体调用方式参考示例
1. 非微信登录领取红包场景
2. 游客绑定三方账号场景，<span style="color:#ff0000; background-color:#f8f8f8;">RXSDK_Pure 4.0.2 以上支持</span>
:::

**接口原型**

```objectivec
/**
 * 绑定账号
 * @param ext 说明
 * -- "scene" :
 *  --- "bind" 红包绑定微信账号场景
 *  --- "authorization" 绑定三方账号场景，默认
 * -- "method" :
 *  --- "wechat"
 *  --- "facebook"
 *  --- "google"
 *  --- "apple"
 */
- (void)bindAccountWithExt:(NSDictionary *)ext
                  complete:(RequestComplete)complete;
```

#### 参数说明
> ext 说明

| **字段**     | **类型** | **是否必填** | **备注**                                                                                                                                             |
| ------------ | -------- | ------------ | ------------------ |
| method     | NSString | 是           | 登录方式  |
| scene     | NSString | 是           | 场景，`bind` 红包绑定微信账号场景，`authorization` 绑定三方账号场景，默认 authorization |

> method 说明

| **字段**     | **说明** | 
| ------------ | -------- |
| wechat     | 红包场景 | 
| facebook     | 绑定三方账号场景 | 
| google    | 绑定三方账号场景 | 
| apple    | 绑定三方账号场景 | 

**调用示例**

```objectivec
// 红包场景
NSDictionary *ext = @{
    @"method" : @"wechat",
    @"scene" : @"bind"
};
[[RXSDK sharedSDK] bindAccountWithExt:ext complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
    if (!error) {
        NSLog(@"绑定成功");
    } else {
        NSLog(@"绑定失败");
    }
}];

// 绑定三方账号场景
NSDictionary *ext = @{
    @"method" : @"facebook",
    @"scene" : @"authorization"
};
[[RXSDK sharedSDK] bindAccountWithExt:ext complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
    if (!error) {
        NSLog(@"绑定成功");
    } else {
        NSLog(@"绑定失败");
    }
}];
```

**响应示例**

```json
{
    "code": 0
}
```

## 合规

### 实名认证

**接口原型**

```objectivec
/**
 * 实名认证
 * @param realName 真实姓名  必须
 * @param idCard 身份证  必须
 */
- (void)realAuthWithRealName:(NSString *)realName
                      idCard:(NSString *)idCard
                    complete:(RequestComplete)complete;
```

#### 参数说明

| **字段** | **类型** | **是否必填** | **备注** |
| -------- | -------- | ------------ | -------- |
| realName | NSString | 是           | 真实姓名 |
| idCard   | NSString | 是           | 身份证   |

**调用示例**

```objectivec
[[RXSDK sharedSDK] realAuthWithRealName:@"姓名" idCard:@"身份证" complete:^(NSDictionary * _Nullable response, RX_CommonRequestError * _Nullable error) {
     if (!error) {
        NSLog(@"%@", response);
    }else{
        NSLog(@"%@", error.responesObject);
    }    
}];
```

#### 响应结构（JSON）

| **字段** | **类型** | **说明**                   |
| -------- | -------- | -------------------------- |
| age      | Number   | 从实名信息中提取的年龄信息 |
| limit    | bool     | 防沉迷开关 :true 开启 false 未开启|
| aas      | Number   | 剩余时间（秒）|

**响应示例**

```json
{
    "code": 0,
    "data": {
        "age": 18,
        "limit" : true,
        "aas" : 3600
    }
}
```
