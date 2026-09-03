# Android 登录 API 快速接入指南（官方文档）

> **来源**: 瑞雪文档中心  
> **版本**: v3.5  
> **更新时间**: 2026年01月07日

本文档基于瑞雪官方文档中心的 Android 登录 API 快速接入指南整理。

## 📋 目录

- [注册](#注册)
- [登录](#登录)
- [login_openid 有效期](#login_openid-有效期)
- [设置密码等级](#设置密码等级)
- [自定义密码正则](#自定义密码正则)
- [用户中心](#用户中心)
- [合规](#合规)

---

## 重要提示

**"非法注册（限制代码1）"** code: 312232 为注册 IP 限制，默认开启，同一 IP 默认 1 小时注册账号不能超过 2 个，如有需求请联系商务添加 IP 白名单或调整限制条件。

**"非法注册（限制代码2）"** code: 312232 为注册设备限制，默认关闭，同一设备 x 小时注册账号不能超过 x 个，如有需求请联系商务开启。

## 注册

### 接口原型

```java
/**
 * @param username    用户名
 * @param password    password
 * @param captchaCode 验证码
 * @param ext         "nickname" : "昵称",      // string
 *                    "avatarUrl" : "头像地址"  // string
 *                    "sex" : 0     // 0男 1女  number
 */
void register(String username, String password, String captchaCode, Map<String, Object> ext, RXRequestCallback callback);
```

### 参数说明

| 字段 | 类型 | 是否必填 | 备注 |
|------|------|----------|------|
| username | String | 是 | 账号注册为账号，手机注册为手机号，邮箱注册为邮箱 |
| password | String | 是 | 密码 |
| captchaCode | String | 否 | 验证码，手机或邮箱注册为必须，账号注册非必须 |
| ext | Map<String, Object> | 否 | 扩展字段 |

### ext 结构说明

| 字段 | 类型 | 是否必填 | 备注 |
|------|------|----------|------|
| nickname | String | 否 | 昵称 |
| avatarUrl | String | 否 | 头像地址 |
| sex | Number | 否 | 性别，1 男 0 女 |
| migrate_args | Object | 否 | 任意合法的 json 类型，比如 String、Array、Object，账号迁移用的参数，调用 CP account-query 及 account-queryandbind 接口时透传给 CP |
| custom_ext | Map | 否 | 自定义透传参数 |

### custom_ext 结构说明

| 字段 | 类型 | 是否必填 | 备注 |
|------|------|----------|------|
| bigdata_ext | String | 否 | 大数据预置事件透传参数 |

### 调用示例

```java
String username = "username";
String password = "password";
String captchaCode = "captcha_code";

// 构造大数据透传参数（可选）
Map<String, Object> bigdataExt = new HashMap<>();
bigdataExt.put("event_name", "user_login");  // 示例大数据事件
bigdataExt.put("event_value", "success");   // 示例事件值

// 构造自定义透传参数（可选）
Map<String, Object> customExt = new HashMap<>();
customExt.put("bigdata_ext", bigdataExt);  // 将大数据透传参数添加到自定义透传参数中
customExt.put("user_agent", "Android 10"); // 自定义参数（如用户设备信息）
customExt.put("location", "New York");     // 自定义参数（如用户地理位置）

// 构造 ext 参数
Map<String, Object> ext = new HashMap<>();
ext.put("nickname", "昵称");
ext.put("avatarUrl", "头像地址");
ext.put("sex", 0);  // 0 女，1 男
ext.put("custom_ext", customExt);  // 将自定义透传参数添加到 ext 参数中

RuiXueSdk.getApi().register(username, password, captchaCode, ext, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            JSONObject data = jsonObject.optJSONObject("data");
            if (data != null) {
                String openid = data.optString("openid");
                // 处理注册成功逻辑
            }
        } else {
            String msg = jsonObject.optString("msg");
            // 处理注册失败逻辑
        }
    }
});
```

### 响应示例

```json
{
    "code": 0,
    "data": {
        "id": 2031,
        "openid": "rxuIR2c1N1EdU9s/gkE8I8bEQ=="
    }
}
```

## 登录

### 接口原型

```java
/**
 * 登录请求
 * @param activity 应用上下文
 * @param loginType 登录类型 {@link LoginMethod}
 * @param username 用户名，非账号登录传空，账号注册为账号，手机注册为手机号，邮箱注册为邮箱
 * @param password 密码，非账号登录传空
 * @param captchaCode 验证码
 * @param loginOpenId 二次登录使用的 login_openid，null 或空为普通登录
 * @param ext 扩展字段，可传 null
 * @param signFields 指定对登录成功后返回的特定字段，使用 CPKEY 计算签名。CP 服务器可重新计算签名并与登录返回的签名比对，作为对瑞雪登录数据的校验。支持的字段包括: nickname, avatar, openid, region, sex, age，计算签名的逻辑会对指定字段进行排序，此处传参与顺序无关。类型为字符串数组，非必须
 * @param migrateArgs 任意合法的 json 类型，比如 string、number，账号迁移用的参数，调用 CP account-query 及 account-queryandbind 接口时透传给 CP，非必须
 */
void login(Activity activity, @LoginMethod.LoginMethodDef String loginType, String username, String password, String captchaCode, String loginOpenId, Map<String, Object> ext, String[] signFields, Object migrateArgs, RXRequestCallback callback);
```

### 参数说明

| 字段 | 类型 | 是否必填 | 备注 |
|------|------|----------|------|
| activity | Activity | 是 | 应用上下文 |
| loginType | LoginType | 是 | 登录类型 |
| username | String | 否 | 非账号登录传空，账号注册为账号，手机注册为手机号，邮箱注册为邮箱 |
| password | String | 否 | 非账号登录传空 |
| captchaCode | String | 否 | 验证码，登录方式为验证码时必传，其他登录方式可传空 |
| loginOpenId | String | 否 | 登录返回的 login_openid，null 或空为普通登录，传该字段表示使用瑞雪凭证进行快速登录，不会拉起三方授权 |
| ext | Map<String, Object> | 否 | 扩展字段 |
| signFields | String[] | 否 | 指定对登录成功后返回的特定字段，使用 CPKEY 计算签名。支持的字段包括: nickname, avatar, openid, region, sex, age |
| migrateArgs | Object | 否 | 任意合法的 json 类型，比如 String、int、NSArray、Map<String, Object>，账号迁移用的参数 |

### loginType 说明

| 字段 | 备注 |
|------|------|
| guest | 游客登录 |
| username | 账号登录 |
| captchacode | 验证码登录，调用获取验证码接口后，登录接口传入收到的验证码 |
| wechat | 微信登录，需要先接入微信配置，请参考微信接入 |
| ysdk | 应用宝登录，需要先接入应用宝配置，请参考应用宝接入 |
| vivo | Vivo 登录，需要先接入 Vivo 配置，请参考 Vivo 接入 |
| mi | 小米登录，需要先接入小米配置，请参考小米接入 |
| hwjos | 华为登录，需要先接入华为配置，请参考华为接入 |
| hihonor | 荣耀登录，需要先接入荣耀配置，请参考荣耀接入 |
| oppo | Oppo 登录，需要先接入 Oppo 配置，请参考 Oppo 接入 |
| baidunet | 百度登录，需要先接入百度配置，请参考百度接入 |
| kuaishou | 快手登录，需要先接入快手配置，请参考快手接入 |
| douyin | 抖音登录，需要先接入抖音配置，请参考抖音接入 |
| bilibili | BiliBili 登录，需要先接入 BiliBili 配置，请参考 BiliBili 接入 |
| 4399 | 4399 登录，需要先接入 4399 配置，请参考 4399 接入 |
| taptap | TapTap 登录，需要先接入 TapTap 配置，请参考 TapTap 接入 |
| google | Google 登录，需要先接入 Google 配置，请参考 Google 接入 |
| facebook | Facebook 登录，需要先接入 Facebook 配置，请参考 Facebook 接入 |
| line | Line 登录，需要先接入 Line 配置，请参考 Line 接入 |
| zalo | Zalo 登录，需要先接入 Zalo 配置，请参考 Zalo 接入 |
| tiktok | Tiktok 登录，需要先接入 Tiktok 配置，请参考 Tiktok 接入 |
| instagram | Instagram 登录，需要先接入 Instagram 配置，请参考 Instagram 接入 |
| quickphone | 一键登录，需要先接入一键登录配置，请参考一键登录接入 |
| qoo | Qoo 登录，需要先接入 Qoo 配置，请参考 Qoo 接入 |
| reddit | Reddit 登录，需要先接入 Reddit 配置，请参考 Reddit 接入 |
| jiuyou | 九游登录，需要先接入九游配置，请参考九游接入 |
| mumu | mumu 登录，需要先接入 mumu 配置，请参考 mumu 接入 |
| leidian | 雷电登录，需要先接入 leidian 配置，请参考雷电接入 |
| client_007 | 007 登录，需要先接入 007 配置，请参考 007 接入 |
| quick | quick 登录，需要先接入 007 配置，请参考 Quick 接入 |
| huawei_fb | 海外华为 facebook 登录，请参考华为海外接入 |

### loginType 特殊字段说明

#### wechat 额外字段

| ext 字段 | 备注 |
|---------|------|
| appid | 微信 appid，后台未配置需要传，已配置不需要传 |

#### ysdk 额外字段

| ext 字段 | 备注 |
|---------|------|
| platform_type | (1.应用宝 QQ 登录, 2. 应用宝微信登录) |

#### google 额外字段

| ext 字段 | 备注 |
|---------|------|
| clientId | google web client id，后台未配置需要传，已配置不需要传 |

#### facebook 额外字段

| ext 字段 | 备注 |
|---------|------|
| permission | string 数组（字段值权限参考，应用类型可用权限） |
| ext.app_associated_bussiness | facebook 应用是否有关联到 business，如果有，则允许一个 facebook 用户从（该 business 关联的）多个 facebook 应用登录返回的瑞雪账号信息相同。如果 facebook 应用未关联 business，而登录时此字段传 true，则会返回报错。 |

#### line 额外字段

| ext 字段 | 备注 |
|---------|------|
| permission | string 数组（默认["profile"]） |

#### qoo 额外字段

| ext 字段 | 备注 |
|---------|------|
| forbid_visitor | 是否禁止访客登录，不传默认为 false |

### ext 结构说明

| 字段 | 类型 | 是否必填 | 备注 |
|------|------|----------|------|
| custom_ext | Map | 否 | 自定义透传参数 |

### custom_ext 结构说明

| 字段 | 类型 | 是否必填 | 备注 |
|------|------|----------|------|
| bigdata_ext | String | 否 | 大数据预置事件透传参数 |

### 调用示例

#### 账号密码登录

```java
String loginType = LoginMethod.USERNAME;
String username = "username";
String password = "userpassword";
String captchaCode = null;
String loginOpenId = null;
Map<String, Object> ext = null;
String[] signFields = new String[]{"openid"};
Object migrateArgs = null;

RuiXueSdk.getApi().login(activity, loginType, username, password, captchaCode, loginOpenId, ext, signFields, migrateArgs, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            JSONObject data = jsonObject.optJSONObject("data");
            if (data != null) {
                // 处理登录成功逻辑
            }
        } else {
            String msg = jsonObject.optString("msg");
            // 处理登录失败逻辑
        }
    }
});
```

#### 验证码登录

```java
String loginType = LoginMethod.CAPTCHACODE;
String username = "手机号";
String password = null;
String captchaCode = "收到的验证码";
String loginOpenId = null;
Map<String, Object> ext = null;
String[] signFields = new String[]{"openid"};
Object migrateArgs = null;

RuiXueSdk.getApi().login(activity, loginType, username, password, captchaCode, loginOpenId, ext, signFields, migrateArgs, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            // 处理登录成功逻辑
        } else {
            String msg = jsonObject.optString("msg");
            // 处理登录失败逻辑
        }
    }
});
```

#### 游客登录

```java
String loginType = LoginMethod.GUEST;
String username = null;
String password = null;
String captchaCode = null;
String loginOpenId = null;
Map<String, Object> ext = null;
String[] signFields = new String[]{"openid"};
Object migrateArgs = null;

RuiXueSdk.getApi().login(activity, loginType, username, password, captchaCode, loginOpenId, ext, signFields, migrateArgs, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            // 处理登录成功逻辑
        } else {
            String msg = jsonObject.optString("msg");
            // 处理登录失败逻辑
        }
    }
});
```

#### Google 登录

```java
String loginType = LoginMethod.GOOGLE;
String username = null;
String password = null;
String captchaCode = null;
String loginOpenId = null;
Map<String, Object> ext = new HashMap<>();
ext.put("clientId", "298695968265-75qvu9vqdi92etdfi8u1kqs5a6f230hr.apps.googleusercontent.com"); // 填入 google web client id
String[] signFields = new String[]{"openid"};
Object migrateArgs = null;

RuiXueSdk.getApi().login(activity, loginType, username, password, captchaCode, loginOpenId, ext, signFields, migrateArgs, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            JSONObject data = jsonObject.optJSONObject("data");
            if (data != null) {
                // 处理登录成功逻辑
            }
        } else {
            String msg = jsonObject.optString("msg");
            String thirdcode = String.valueOf(jsonObject.opt("thirdcode"));
            String thirdmsg = String.valueOf(jsonObject.opt("thirdmsg"));
            // 根据错误码处理失败逻辑
        }
    }
});
```

### 响应结构

请参考 [服务端登录 API 响应结构](https://doc.ruixueyun.com)

**注意**：二次登录响应结构也是这个结构。

## login_openid 有效期

### 接口原型

```java
/**
 * 判断 login_openid 是否失效
 * @return login_openid true 失效，false 有效
 */
public static boolean loginOpenidExpireInvalid()
```

### 调用示例

```java
boolean isExpired = RuiXueSdk.loginOpenidExpireInvalid();
if (isExpired) {
    // login_openid 已失效，需要重新登录
} else {
    // login_openid 有效，可以使用快速登录
}
```

## 设置密码等级

默认等级为 `strong`。

### 接口原型

```java
/**
 * 设置密码等级
 * @param passwordStrength 密码强度等级枚举
 */
public static void setPasswordStrength(PasswordStrength passwordStrength)
```

### type 说明

| 字段 | 说明 |
|------|------|
| Default | 6-32 位任意字符 |
| Custom | 自定义密码正则 |
| Average | 简易密码，6-32 位任意字符 |
| Strong | 强密码，6-32 位，包含数字+字母+特殊符号 |

### 调用示例

```java
RuiXueSdk.setPasswordStrength(PasswordStrength.Average);
```

## 自定义密码正则

### 接口原型

```java
/**
 * 设置密码正则
 * 需要先将密码强度设置为自定义
 */
public static void setPwdPattern(String pwdPattern)
```

### 调用示例

```java
RuiXueSdk.setPasswordStrength(PasswordStrength.Custom);
RuiXueSdk.setPwdPattern("自定义正则");
```

## 用户中心

### 申请注销账号

#### 接口原型

```java
/**
 * 申请注销账号
 * @param deregisterConfig {@link RXDeregisterConfig} 类
 * @param callback
 */
void deregister(RXDeregisterConfig deregisterConfig, RXRequestCallback callback);
```

#### RXDeregisterConfig 说明

| 字段 | 类型 | 是否必填 | 备注 |
|------|------|----------|------|
| setIdCard | String | 否 | 身份证，已实名用户必传，未实名用户可不传 |
| setRealName | String | 否 | 真实姓名，已实名用户必传，未实名用户可不传 |
| setCpData | String | 否 | CP 自定义数据，建议传 game_user_id=用户的游戏 id，不传在瑞雪后台不会账号注销页面不显示游戏侧的用户id |
| setThirdParams | Map<String, Object> | 否 | 三方渠道透传数据 |

#### 调用示例

```java
RXDeregisterConfig rxDeregisterConfig = new RXDeregisterConfig();
rxDeregisterConfig.setIdCard("your idcard");
rxDeregisterConfig.setRealName("your real name");
rxDeregisterConfig.setCpData("{\"game_user_id\":\"游戏 id\"}");

RuiXueSdk.getApi().deregister(rxDeregisterConfig, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            // 仅代表申请注销请求发送成功，实际注销状态需要后台审核
            JSONObject data = jsonObject.optJSONObject("data");
            if (data != null) {
                // 参照响应示例
            }
        } else {
            String msg = jsonObject.optString("msg");
            String thirdcode = String.valueOf(jsonObject.opt("thirdcode"));
            String thirdmsg = String.valueOf(jsonObject.opt("thirdmsg"));
            // 根据错误码处理失败逻辑
        }
    }
});
```

#### 响应示例

```json
{
    "code": 0
}
```

### 撤销注销申请

#### 接口原型

```java
/**
 * 撤销注销申请
 */
void deregisterCancel(RXRequestCallback callback);
```

#### 调用示例

```java
RuiXueSdk.getApi().deregisterCancel(new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            // 仅代表请求发送成功
        } else {
            String msg = jsonObject.optString("msg");
            // 根据错误码处理失败逻辑
        }
    }
});
```

#### 响应示例

```json
{
    "code": 0
}
```

### 获取验证码（发送验证码）

获取验证码需填写对应意图 `purpose`。`type` 和 `target` 需对应，否则无法接收验证码。

`target` 传空或 null 默认为当前绑定的手机或邮箱。

#### 接口原型

```java
/**
 * 发送验证码
 * @param phoneOrEmail 验证码类型
 * @param purpose 发送的目标（手机或邮箱），传空或 null 默认为当前绑定的手机或邮箱
 *                register           // 注册
 *                bindphone          // 绑定手机
 *                unbindphone        // 解绑手机
 *                resetpwd            // 重置密码
 *                changepwd           // 修改密码
 *                bindemail           // 绑定邮箱
 *                unbindemail         // 解绑邮箱
 *                login               // 登录
 * @param isMail 是否是邮箱
 * @param randstr 图形验证随机串，可传空
 * @param ticket 图形验证凭证，可传空
 */
boolean sendCaptcha(String phoneOrEmail, String purpose, boolean isMail, String randstr, String ticket, RXJSONCallback callback)
```

#### 参数说明

| 字段 | 类型 | 是否必填 | 备注 |
|------|------|----------|------|
| target | String | 否 | 发送的目标（手机或邮箱），传 null 默认为当前绑定的手机或邮箱 |
| purpose | String | 是 | 短信意图 |
| isMail | boolean | 是 | 是否是邮箱 |
| randstr | String | 否 | 图形验证随机串 |
| ticket | String | 否 | 图形验证凭证 |

#### purpose 说明

| 字段 | 备注 |
|------|------|
| register | 注册 |
| bindphone | 绑定手机 |
| unbindphone | 解绑手机 |
| resetpwd | 重置密码 |
| changepwd | 修改密码 |
| bindemail | 绑定邮箱 |
| unbindemail | 解绑邮箱 |
| login | 登录 |
| setpwd | 设置密码 |

#### 调用示例

```java
RuiXueSdk.getApi().sendCaptcha("手机号", "register", false, "", "", new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            JSONObject data = jsonObject.optJSONObject("data");
            if (data != null) {
                int interval = data.optInt("interval");  // 发送间隔
                int surplus = data.optInt("surplus");    // 剩余发送间隔
            }
        } else {
            String msg = jsonObject.optString("msg");
            // 根据错误码处理失败逻辑
        }
    }
});
```

#### 响应结构

| 字段 | 类型 | 备注 |
|------|------|------|
| interval | int | 发送间隔 |
| surplus | int | 剩余发送间隔 |

#### 响应示例

```json
{
    "code": 0,
    "data": {
        "interval": 60,
        "surplus": 60
    }
}
```

### 校验验证码

用途和手机号或邮箱需要和调用发送验证码时一致。

#### 接口原型

```java
/**
 * @param type 枚举 手机或邮箱
 * @param target 手机或邮箱
 * @param purpose 意图
 * @param captcha_code 验证码
 */
boolean verifyCaptcha(CaptchaType type, String target, String purpose, String captcha_code, RXRequestCallback callback);
```

#### 参数说明

| 字段 | 类型 | 是否必填 | 备注 |
|------|------|----------|------|
| type | CaptchaType | 是 | 验证码类型 |
| target | String | 是 | 发送的目标（手机或邮箱），传空或 null 默认为当前绑定的手机或邮箱 |
| purpose | String | 是 | 短信意图 |
| captcha_code | String | 是 | 验证码 |

#### type 说明

| 字段 | 备注 |
|------|------|
| CaptchaType_email | 邮箱 |
| CaptchaType_phone | 手机 |

#### purpose 说明

| 字段 | 备注 |
|------|------|
| register | 注册 |
| bindphone | 绑定手机 |
| unbindphone | 解绑手机 |
| resetpwd | 重置密码 |
| changepwd | 修改密码 |
| bindemail | 绑定邮箱 |
| unbindemail | 解绑邮箱 |
| login | 登录 |
| setpwd | 设置密码 |

#### 调用示例

```java
RuiXueSdk.getApi().verifyCaptcha(CaptchaType.CaptchaType_phone, "手机号", "register", "验证码", new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            // 处理成功逻辑
        } else {
            String msg = jsonObject.optString("msg");
            // 根据错误码处理失败逻辑
        }
    }
});
```

#### 响应示例

```json
{
    "code": 0
}
```

### 绑定邮箱

#### 接口原型

```java
/**
 * 绑定邮箱
 * @param email 邮箱
 * @param password 密码
 * @param captcha_code 验证码
 * @param migrate_args 任意合法的 json 类型，比如 string、number，账号迁移用的参数，调用 CP account-query 及 account-queryandbind 接口时透传给 CP，非必须
 */
void bindEmail(String email, String password, String captcha_code, Object migrate_args, RXRequestCallback callback);
```

#### 参数说明

| 字段 | 类型 | 是否必填 | 备注 |
|------|------|----------|------|
| captcha_code | String | 是 | 验证码 |
| password | String | 是 | 密码 |
| email | String | 是 | 邮箱 |
| migrate_args | Object | 否 | 任意合法的 json 类型，比如 String、int、NSArray、Map<String, Object>，账号迁移用的参数 |

#### 调用示例

```java
RuiXueSdk.getApi().bindEmail("user@test.com", "密码", "captcha code", null, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            // 处理成功逻辑
        } else {
            String msg = jsonObject.optString("msg");
            // 根据错误码处理失败逻辑
        }
    }
});
```

#### 响应示例

```json
{
    "code": 0
}
```

### 绑定手机号

#### 接口原型

```java
/**
 * 绑定手机
 * @param phone 手机号
 * @param password 密码
 * @param captcha_code 验证码
 * @param migrate_args 任意合法的 json 类型，比如 string、number，账号迁移用的参数，调用 CP account-query 及 account-queryandbind 接口时透传给 CP，非必须
 * @param callback callback
 */
void bindPhone(String phone, String password, String captcha_code, Object migrate_args, RXRequestCallback callback);
```

#### 参数说明

| 字段 | 类型 | 是否必填 | 备注 |
|------|------|----------|------|
| captcha_code | String | 是 | 验证码 |
| password | String | 否 | 密码 |
| phone | String | 是 | 手机号 |
| migrate_args | Object | 否 | 任意合法的 json 类型，比如 String、int、NSArray、Map<String, Object>，账号迁移用的参数 |

#### 调用示例

```java
RuiXueSdk.getApi().bindPhone("手机号", "password", "captcha code", null, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            // 处理成功逻辑
        } else {
            String msg = jsonObject.optString("msg");
            // 根据错误码处理失败逻辑
        }
    }
});
```

#### 响应示例

```json
{
    "code": 0
}
```

### 换绑手机号

#### 接口原型

```java
/**
 * 换绑手机号
 * @param newPhone 新手机号
 * @param newPhoneCaptcha 新手机号验证码
 * @param oldPhoneCaptcha 旧手机号验证码
 * @param migrateArgs 任意合法的 json 类型，比如 string、number，账号迁移用的参数，调用 CP account-query 及 account-queryandbind 接口时透传给 CP，非必须
 * @param callback callback
 */
void changePhone(String newPhone, String newPhoneCaptcha, String oldPhoneCaptcha, Object migrateArgs, RXRequestCallback callback);
```

#### 参数说明

| 字段 | 类型 | 是否必填 | 备注 |
|------|------|----------|------|
| oldPhoneCaptcha | String | 是 | 当前登录的手机号的 unbindphone 验证码 |
| newPhone | String | 是 | 新的手机号 |
| newPhoneCaptcha | String | 是 | 新手机号的 bindphone 验证码 |
| migrateArgs | Object | 否 | 任意合法的 json 类型，比如 String、int、NSArray、Map<String, Object>，账号迁移用的参数 |

#### 调用示例

```java
RuiXueSdk.getApi().changePhone("new phone", "new phone captcha code", "old phone captcha code", null, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            // 处理成功逻辑
        } else {
            String msg = jsonObject.optString("msg");
            // 根据错误码处理失败逻辑
        }
    }
});
```

#### 响应示例

```json
{
    "code": 0
}
```

### 获取用户信息

#### 接口原型

```java
/**
 * 获取用户信息
 * @param callback 回调函数
 */
void getUserInfo(RXRequestCallback callback);
```

#### 调用示例

```java
RuiXueSdk.getApi().getUserInfo(new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            JSONObject data = jsonObject.optJSONObject("data");
            if (data != null) {
                String openid = data.optString("openid");
                String nickname = data.optString("nickname");
                String avatarurl = data.optString("avatarurl");
                String mobile_phone = data.optString("mobile_phone");
                int sex = data.optInt("sex");
                int age = data.optInt("age");
                int user_state = data.optInt("user_state");
                int attr = data.optInt("attr");
                // 处理用户信息
            }
        } else {
            String msg = jsonObject.optString("msg");
            // 根据错误码处理失败逻辑
        }
    }
});
```

#### 响应结构（JSON）

| 字段 | 类型 | 说明 |
|------|------|------|
| age | Number | 用户年龄，根据实名信息获取 |
| sex | Number | 性别。0 表示女性，1 表示男性 |
| user_state | Number | 用户状态定义，0 为正常用户。为正数时，使用各位编码用户的不同状态（以下表述中，第 0 位表示最低位）：第 0 位: 为 1 表示玩家已提交注销申请；第 1 位: 为 1 表示已注销；第 2 位: 为 1 表示已封停 |
| attr | Number | 账号状态标记，使用位运算构成。参考下文 attr 标记说明 |
| openid | String | 瑞雪用户 OpenID |
| external_openid | String | 三方 openid |
| external_unionid | String | 三方 unionid |
| wx_unionid | String | [DEPRECATED] 三方 unionid |
| mobile_phone | String | 手机号 |
| nickname | String | 昵称 |
| avatarurl | String | 头像 |
| idCard | String | 身份证号 |
| realName | String | 姓名 |
| theme_skin | int | 客服主题皮肤 0 默认皮肤 1 VIP主题 |

#### attr 标记

`attr` 标记，由以下标记位构成：

| 标识 | 备注 |
|------|------|
| 0 | 是否已通过瑞雪完成实名认证，1 表示已实名 |
| 1 | 用户当前是否有绑定手机号，1 表示有绑定 |
| 2 | 用户当前是否有绑定邮箱，1 表示有绑定 |
| 3 | 用户当前是否有已设置密码的登录凭证，1 表示有 |
| 4 | 用户是否通过瑞雪完成实名认证，1 表示是 |

#### 响应示例

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

由于部分项目的用户信息（头像、昵称、性别）没有直接使用瑞雪通行证数据，而是采用由瑞雪通知游戏服务器同步方式，在网络不好时可能会通知失败，导致游戏服务器存储的用户信息和瑞雪通行证信息不一致的情况。

每次调用修改用户信息时瑞雪会重新通知游戏服务器，为降低通知频率减少服务器压力，每次调用 `updateUserInfo` 时可将旧用户信息传入 `ext` 中，瑞雪对信息进行比对后将未修改的用户信息通知给游戏服务器，已修改的用户信息不会同步。

#### 接口原型

```java
/**
 * 修改用户信息
 * @param nickname 用户昵称，非必传
 * @param avatarUrl 头像 url，非必传
 * @param region 地区码，非必传
 * @param sex 1 男 0 女，无改动传 -1，不传会默认修改为女性
 * @param ext 透传参数，目前仅作为数据校验使用
 * @param callback
 */
void updateUserInfo(String nickname, String avatarUrl, String region, int sex, Map<String, Object> ext, RXRequestCallback callback);
```

#### 参数说明

| 字段 | 类型 | 是否必填 | 备注 |
|------|------|----------|------|
| avatarUrl | String | 否 | 头像 url |
| nickname | String | 否 | 用户昵称 |
| sex | int | 是 | 性别，1 男 0 女，无改动传 -1，不传会默认修改为女性 |
| region | String | 否 | 地区码 |
| ext | Map<String, Object> | 否 | 透出参数，目前仅作为数据校验使用 |

#### ext 说明

| 字段 | 类型 | 是否必填 | 备注 |
|------|------|----------|------|
| old_avatarurl | String | 否 | 旧头像 url |
| old_nickname | String | 否 | 旧用户昵称 |
| old_sex | int | 是 | 旧性别，1 男 0 女，无改动传 -1，不传会默认修改为女性 |

#### 调用示例

```java
String region = "";
int sex = 1;
Map<String, Object> ext = new HashMap<>();
ext.put("old_nickname", "旧昵称");
ext.put("old_avatarurl", "旧头像");
ext.put("old_sex", 0);

RuiXueSdk.getApi().updateUserInfo("昵称", "头像地址", region, sex, ext, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            // 处理成功逻辑
        } else {
            String msg = jsonObject.optString("msg");
            // 根据错误码处理失败逻辑
        }
    }
});
```

#### 响应示例

```json
{
    "code": 0
}
```

### 修改密码

#### 接口原型

```java
/**
 * 修改密码(设置密码)
 * @param old_password 旧密码。如果旧密码传空，则默认为账号设置密码。
 * @param new_password 新密码
 * @param callback callback
 */
void changePassword(String old_password, String new_password, RXRequestCallback callback);
```

#### 参数说明

| 字段 | 类型 | 是否必填 | 备注 |
|------|------|----------|------|
| old_password | String | 是 | 旧密码 |
| new_password | String | 是 | 新密码 |

#### 调用示例

```java
RuiXueSdk.getApi().changePassword("old password", "new password", new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            // 处理成功逻辑
        } else {
            String msg = jsonObject.optString("msg");
            // 根据错误码处理失败逻辑
        }
    }
});
```

#### 响应示例

```json
{
    "code": 0
}
```

### 重置密码

#### 接口原型

```java
/**
 * 重置密码
 * @param username 用户名
 * @param password 密码
 * @param captcha_code 验证码
 * @param migrate_args 任意合法的 json 类型，比如 string、number，账号迁移用的参数，调用 CP account-query 及 account-queryandbind 接口时透传给 CP，非必须
 */
void resetPassword(String username, String password, String captcha_code, Object migrate_args, RXRequestCallback callback);
```

#### 参数说明

| 字段 | 类型 | 是否必填 | 备注 |
|------|------|----------|------|
| username | String | 是 | 用户名 |
| password | String | 是 | 密码 |
| captcha_code | String | 是 | 验证码 |
| migrate_args | Object | 否 | 任意合法的 json 类型，比如 String、int、NSArray、Map<String, Object>，账号迁移用的参数 |

#### 调用示例

```java
RuiXueSdk.getApi().resetPassword("手机号", "password", "captcha code", null, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            // 处理成功逻辑
        } else {
            String msg = jsonObject.optString("msg");
            // 根据错误码处理失败逻辑
        }
    }
});
```

#### 响应示例

```json
{
    "code": 0
}
```

## 合规

### 实名认证

#### 接口原型

```java
/**
 * 实名认证
 * @param realName 姓名
 * @param idCard 身份证
 * @param callback callback
 */
void realAuth(String realName, String idCard, RXRequestCallback callback);

/**
 * 实名认证
 * @param realname 姓名
 * @param idcard 身份证
 * @param isFastRealAuth 是否使用快速认证，默认值为 false
 * @param callback callback
 */
void realAuth(String realname, String idcard, boolean isFastRealAuth, RXJSONCallback callback);
```

#### 参数说明

| 字段 | 类型 | 是否必填 | 备注 |
|------|------|----------|------|
| realName | String | 是 | 真实姓名 |
| idCard | String | 是 | 身份证 |
| isFastRealAuth | boolean | 是 | 是否使用快速认证 |

#### 调用示例

```java
// 普通实名认证
RuiXueSdk.getApi().realAuth("姓名", "身份证", new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            JSONObject data = jsonObject.optJSONObject("data");
            if (data != null) {
                int age = data.optInt("age");
                boolean limit = data.optBoolean("limit");
                int aas = data.optInt("aas");
                // 处理成功逻辑
            }
        } else {
            String msg = jsonObject.optString("msg");
            // 根据错误码处理失败逻辑
        }
    }
});

// 使用快速认证的调用示例
RuiXueSdk.getApi().realAuth("姓名", "身份证", true, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            JSONObject data = jsonObject.optJSONObject("data");
            if (data != null) {
                int age = data.optInt("age");
                boolean limit = data.optBoolean("limit");
                int aas = data.optInt("aas");
                // 处理成功逻辑
            }
        } else {
            String msg = jsonObject.optString("msg");
            // 根据错误码处理失败逻辑
        }
    }
});
```

#### 响应结构（JSON）

| 字段 | 类型 | 说明 |
|------|------|------|
| age | Number | 从实名信息中提取的年龄信息 |
| limit | bool | 防沉迷开关：true 开启，false 未开启 |
| aas | Number | 剩余时间（秒） |

#### 响应示例

```json
{
    "code": 0,
    "data": {
        "age": 18,
        "limit": true,
        "aas": 3600
    }
}
```

## 相关文档

- [瑞雪文档中心](https://doc.ruixueyun.com)
- [Android 快速接入指南](../QUICK_START_OFFICIAL.md)
- [Android API 文档](./README.md)
- [通行证 API 文档](./passport_api.md)
