:::tip
"非法注册（限制代码1）" code : 312232 为 注册ip限制，<span style='color:red'>默认开启</span>，同一ip默认1小时注册账号不能超过2个，如有需求请联系商务添加ip白名单或调整限制条件。
"非法注册（限制代码2）" code : 312232 为 注册设备限制，<span style='color:red'>默认关闭</span>，同一设备x小时注册账号不能超过x个，如有需求请联系商务开启。
:::

### 注册

**接口原型**

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

#### 参数说明

| **字段**    | **类型**     | **是否必填** | **备注**                                         |
| ----------- | ------------ | ------------ | ------------------------------------------------ |
| username    | String     | 是           | 账号注册为账号，手机注册为手机号，邮箱注册为邮箱 |
| password    | String     | 是           | 密码                                             |
| captchaCode | String      | 否           | 验证码  手机或邮箱注册为必须，账号注册非必须     |
| ext         | Map<String, Object> | 否           | 扩展字段                                         |
| custom_ext          | Map  | 否           | 自定义透传参数

> ext 结构说明

| **字段**     | **类型** | **是否必填** | **备注**                                                                                                                                             |
| ------------ | -------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| nickname     | String | 否           | 昵称                                                                                                                                                 |
| avatarUrl    | String | 否           | 头像地址                                                                                                                                             |
| sex          | NSArray  | 否           | 性别，1 男 0 女                                                                                                                                      |
| migrate_args | id       | 否           | 任意合法的 json 类型, 比如 String,Array, Object 账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP |

      
> custom_ext 结构说明

| **字段**     | **类型** | **是否必填** | **备注**                                                                                                                                             |
| ------------ | -------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| bigdata_ext     | String | 否           | 大数据预置事件透传参数                                                                       |
 
**调用示例**

```java
String username;
String password;
String captchaCode;

 // 构造大数据透传参数 可选
Map<String, Object> bigdataExt = new HashMap<>();
bigdataExt.put("event_name", "user_login");  // 示例大数据事件
bigdataExt.put("event_value", "success");   // 示例事件值

// 构造自定义透传参数 可选
Map<String, Object> customExt = new HashMap<>();
customExt.put("bigdata_ext", bigdataExt);  // 将大数据透传参数添加到自定义透传参数中
customExt.put("user_agent", "Android 10"); // 自定义参数（如用户设备信息）
customExt.put("location", "New York");     // 自定义参数（如用户地理位置）

// 构造 ext 参数
Map<String, Object> ext = new HashMap<>();
ext.put("custom_ext", customExt);  // 将自定义透传参数添加到 ext 参数中

RXSDK.register(username, password, captchaCode, ext, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {

    }
});
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

```java
/**
 *登录请求
    * @param activity 应用上下文
    * @param loginType 登录类型 {@link LoginMethod}
    * @param username  用户名 非账号登录传空，账号注册为账号，手机注册为手机号，邮箱注册为邮箱
    * @param password 密码 非账号登录传空
    * @param captchaCode 验证码
    * @param loginOpenId 二次登录使用的login_openid ，null或空为普通登录
    * @param ext  扩展字段，可传null
    * @param signFields  指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"]  非必须
    * @param migrateArgs 任意合法的 json 类型, 比如 string, number，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
    */
void login(@Nullable Activity activity, @NonNull LoginParams params, @NonNull RXRequestCallback callback);

/**
 *  RXSDK.loginOpenidExpireInvalid()  判断 login_openid 是否失效
 * @return login_openid true  失效  、false 有效
public static boolean loginOpenidExpireInvalid()

```

#### LoginParams 说明

| **字段**     | **类型**            | **是否必填** | **备注**                                                                                                                                                                                                                                                                                    |
| ------------ | ------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| loginType    | LoginType           | 是           | 登录类型                                                                                                                                                                                                                         |
| username     | String            | 否           | 非账号登录传空，账号注册为账号，手机注册为手机号，邮箱注册为邮箱                                                                                                                                                                                                                            |
| password     | String            | 否           | 非账号登录传空                                                                                                                                                                                                                                                                              |
| captchaCode  | String            | 否           | 验证码，登录方式为验证码时必传，其他登录方式可传空空                                                                                                                                                                                                                                                                              |
| loginOpenId  | String            | 否           | 登录返回的 login_openid，nil或空为普通登录，传该字段表示使用瑞雪凭证进行快速登录，不会拉起三方授权                                                                                                                                                                                                                                                                              |
| eMap       | Map<String, Object> | 否           | 扩展字段                                                                                                                                                                                                                                                                                    |
| sign_fields  | NSArray             | 否           | 指定对登录成功后返回的特定字段, 使用 CPKEY 计算签名. CP 服务器可重新计算签名并与登录返回的签名比对, 作为对瑞雪登录数据的校验. 支持的字段包括: nickname, avatar, openid, region, sex, age, 计算签名的逻辑会对指定字段进行排序, 此处传参与顺序无关。类型为字符串数组 @[@"nickname",@"avatar"] |
| migrate_args | id                  | 否           | 任意合法的 json 类型, 比如 String, int, NSArray, Map<String, Object> 账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP                                                                                                                                        |

> loginType 结构说明

| **字段**    | **备注**      |
| ----------- | ------------- |
| guest       | 游客登录      |
| username    | 账号登录      |
| captchacode | 验证码登录，调用 [获取验证码](https://doc.ruixueyun.com/main/#/view?viewPath=84cd522b-5f74-4223-b6b7-7a8eba7caf30&title=%E8%8E%B7%E5%8F%96%E9%AA%8C%E8%AF%81%E7%A0%81%EF%BC%88%E5%8F%91%E9%80%81%E9%AA%8C%E8%AF%81%E7%A0%81%EF%BC%89&tab=&index=1) 接口后，登录接口传入收到的验证码  |
| wechat      | 微信登录，需要先接入微信配置，请参考 [微信接入](https://doc.ruixueyun.com/main/#/view?viewPath=4e775692-4231-44fb-9cf7-88ba4423f8d8)      |
| ysdk        | 应用宝登录，需要先接入 应用宝 配置，请参考 [应用宝 接入](https://doc.ruixueyun.com/main/#/view?viewPath=66d1a1c0-4af9-4bba-9744-9e8a473bd5b3)     |
| vivo        | Vivo 登录，需要先接入 Vivo 配置，请参考 [Vivo 接入](https://doc.ruixueyun.com/main/#/view?viewPath=705b5cbe-077e-4a1b-9395-eb8d7ad64613)      |
| mi          | 小米登录，需要先接入 小米 配置，请参考 [小米 接入](https://doc.ruixueyun.com/main/#/view?viewPath=72113395-3c6d-4f65-849a-4d2f4aa969ce)       |
| hwjos       | 华为登录，需要先接入 华为 配置，请参考 [华为 接入](https://doc.ruixueyun.com/main/#/view?viewPath=29cda2f6-1ea0-4e83-997d-635bfc69269e)       |
| hihonor       | 荣耀登录，需要先接入 荣耀 配置，请参考 [荣耀 接入](https://doc.ruixueyun.com/main/#/view?viewPath=76607c02-961b-46db-89f3-5496e24feade)       |
| oppo        | Oppo 登录，需要先接入 Oppo 配置，请参考 [Oppo 接入](https://doc.ruixueyun.com/main/#/view?viewPath=07cc7632-d413-4457-b821-fe98a032bdd9)      |
| baidunet    | 百度登录，需要先接入 百度 配置，请参考 [百度 接入](https://doc.ruixueyun.com/main/#/view?viewPath=505ce8dd-3f31-40b8-9dd2-20256b1713e0)       |
| kuaishou    | 快手登录，需要先接入 快手 配置，请参考 [快手 接入](https://doc.ruixueyun.com/main/#/view?viewPath=505ce8dd-3f31-40b8-9dd2-20256b1713e0)      |
| douyin      | 抖音登录，需要先接入 抖音 配置，请参考 [抖音 接入](https://doc.ruixueyun.com/main/#/view?viewPath=cab6f7b0-b25c-4291-88a2-46491c571be2)      |
| bilibili    | BiliBili 登录，需要先接入 BiliBili 配置，请参考 [BiliBili 接入](https://doc.ruixueyun.com/main/#/view?viewPath=e462382c-efbc-4183-bd9a-930fdba97ffc) |
| 4399        | 4399 登录，需要先接入 4399 配置，请参考 [4399 接入](https://doc.ruixueyun.com/main/#/view?viewPath=d2ba9519-f064-4ee1-8a20-3faade09ca5d)     |
| taptap      | TapTap 登录，需要先接入 TapTap 配置，请参考 [TapTap 接入](https://doc.ruixueyun.com/main/#/view?viewPath=41dd1857-4621-4baf-89e3-4b4d259861c3)  |
| google      | Google 登录，需要先接入 Google 配置，请参考 [Google 接入](https://doc.ruixueyun.com/main/#/view?viewPath=a1c57bef-37b9-471d-9f88-359b492d20e0)   |
| facebook    | Facebook 登录，需要先接入 Facebook 配置，请参考 [Facebook 接入](https://doc.ruixueyun.com/main/#/view?viewPath=1c6c7be6-909b-494f-a283-1901deb0e450) |
| line        | Line 登录，需要先接入 Line 配置，请参考 [Line 接入](https://doc.ruixueyun.com/main/#/view?viewPath=cc897594-33d5-4bdd-a83e-906ac048a904)     |
| zalo        | Zalo登录，需要先接入 Zalo 配置，请参考 [Zalo 接入](https://doc.ruixueyun.com/main/#/view?viewPath=36767378-2a08-40eb-9005-113211423966)     |
| tiktok      | Tiktok 登录，需要先接入 Tiktok 配置，请参考 [Tiktok 接入](https://doc.ruixueyun.com/main/#/view?viewPath=7fa7a6de-9e80-4597-91e0-6778a836422c)   |
| instagram   | Instagram 登录，需要先接入 Instagram 配置，请参考 [Instagram 接入](https://doc.ruixueyun.com/main/#/view?viewPath=28ae2cc1-a514-4209-a5b7-aa3a4ec8b313) |
| quickphone  | 一键登录，需要先接入 一键登录 配置，请参考 [一键登录 接入](https://doc.ruixueyun.com/main/#/view?viewPath=55de1a86-88bd-46f5-b618-549ffc470df5)     |
| qoo         | Qoo登录，需要先接入 Qoo 配置，请参考 [Qoo 接入](https://doc.ruixueyun.com/main/#/view?viewPath=9837865f-a677-48d2-bf99-4c24376028f4)       |
| reddit      | Reddit 登录，需要先接入 Reddit 配置，请参考 [Reddit 接入](https://doc.ruixueyun.com/main/#/view?viewPath=28c88e8f-5c8f-4a65-bda6-298f3f32bc2a)       |
| jiuyou      | 九游登录，需要先接入 九游 配置，请参考 [九游 接入](https://doc.ruixueyun.com/main/#/view?viewPath=674201b3-b427-401b-b72d-5bc623b19ef4)
| mumu        | mumu登录，需要先接入 mumu 配置，请参考 [mumu 接入](https://doc.ruixueyun.com/main/#/view?viewPath=df45a143-6ebf-4737-bd66-5379202a9e05)
| leidian     | 雷电登录，需要先接入 leidian 配置，请参考 [雷电 接入](https://doc.ruixueyun.com/main/#/view?viewPath=ef317d71-a984-414b-87ec-b1631ecd089e)
| client_007 | 007 登录，需要先接入 007 配置 ，请参考 [007 接入](https://doc.ruixueyun.com/main/#/view?path=5430bf4e-36c1-456b-80a9-c887c266c3f0)
| quick | quick 登录，需要先接入 007 配置 ，请参考 [Quick 接入](https://doc.ruixueyun.com/main/#/view?path=0cf47adb-2a92-406c-a15b-21103e1b563f)
| huawei_fb | 海外华为facebook 登录 ，请参考 [华为海外 接入](https://doc.ruixueyun.com/admin/#/edit?path=3abc1c4c-255d-4603-b2b3-0a8917455799,aef09ab2-0582-4262-84f6-fadb2b59cb85,1820088f-19e0-4c1b-9c0f-6e2389ebd92a)

> loginType  值为 wechat 额外字段说明

| **ext字段** | **备注**   |
| -------- | ---------- |
| appid    | 微信 appid，后台未配置需要传，已配置不需要传 |

> loginType  值为 ysdk 额外字段说明

| **ext字段**      | **备注**                             |
| ------------- | ------------------------------------ |
| platform_type | (1.应用宝 QQ 登录,2. 应用宝微信登录) |

> loginType  值为 google 额外字段说明

| **ext字段** | **备注**             |
| -------- | -------------------- |
| clientId | google web client id，后台未配置需要传，已配置不需要传 |

> loginType  值为 facebook 额外字段说明

| **ext字段**                     | **备注**                                                                                                                                                                                                             |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| permission                   | string 数组 （字段值[权限参考](https://developers.facebook.com/docs/permissions/reference#reference) ，应用类型[可用权限](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/app-types)） |
| ext                          | 扩展字段对象                                                                                                                                                                                                         |
| ext.app_associated_bussiness | facebook 应用是否有关联到 business，如果有，则允许一个 facebook 用户从（该 business 关联的）多个 facebook 应用登录返回的瑞雪账号信息相同。如果 facebook 应用未关联 business，而登录时此字段传 true，则会返回报错。   |

> method  值为 line 额外字段说明

| **ext字段**   | **备注**                          |
| ---------- | --------------------------------- |
| permission | string 数组   （默认["profile"]） |

> method  值为 qoo 额外字段说明

| **ext字段**   | **备注**                          |
| ---------- | --------------------------------- |
| forbid_visitor | 是否禁止访客登录，不传默认为 false |


> eMap  可扩展结构说明

| **字段**     | **类型** | **是否必填** | **备注**                                                                                                                                             |
| ------------ | -------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| custom_ext          | Map  | 否           | 自定义透传参数
      
> custom_ext 结构说明

| **字段**     | **类型** | **是否必填** | **备注**                                                                                                                                             |
| ------------ | -------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| bigdata_ext     | String | 否           | 大数据预置事件透传参数                                                                       |

**调用示例**

```java
// 构造大数据透传参数
Map<String, Object> bigdataExt = new HashMap<>();
bigdataExt.put("event_name", "user_login");  // 示例大数据事件
bigdataExt.put("event_value", "success");   // 示例事件值

// 构造自定义透传参数
Map<String, Object> customExt = new HashMap<>();
customExt.put("bigdata_ext", bigdataExt);  // 将大数据透传参数添加到自定义透传参数中
customExt.put("user_agent", "Android 10"); // 自定义参数（如用户设备信息）
customExt.put("location", "New York");     // 自定义参数（如用户地理位置）

// 构造 ext 参数
Map<String, Object> eMap = new HashMap<>();
eMap.put("custom_ext", customExt);  // 将自定义透传参数添加到 ext 参数中

LoginParams params = new LoginParams(LoginMethod.USERNAME);
params.setExt(eMap);
params.setUsername("账号");
params.setPassword("密码");
// 二次登录
params.setLoginOpenid("登录返回的 login_openid");

RXSDK.getInstance().login(this, params, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {

    }
});

// 验证码登录
LoginParams params = new LoginParams(LoginType.CAPTCHACODE);
params.setUsername("手机号");
Map<String, Object> ext = new HashMap<>();
ext.put("captcha_code", captcha);
params.setExt(ext);

RXSDK.getInstance().login(this, params, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {

    }
});

// 游客登录
LoginParams params = new LoginParams(LoginType.GUEST);

RXSDK.getInstance().login(this, params, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {

    }
});

//google 登录
LoginParams params = new LoginParams(LoginType.GOOGLE);

RXSDK.getInstance().login(this, params, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            JSONObject data = jsonObject.optJSONObject("data"); // data 可能为空
            if(data!=null){
                //todo 处理成功逻辑，data数据参照响应结构说明
            }
          
        } else {
            String msg = jsonObject.optString("msg");
            String thirdcode = String.valueOf(jsonObject.opt("thirdcode"));
            String thirdmsg = String.valueOf(jsonObject.opt("thirdmsg"));
            //todo 根据错误码处理失败逻辑
        }
    }
});
```

#### 响应结构

##### 二次登录响应结构也是这个结构
请参考 [服务端登录API](https://doc.ruixueyun.com/main/#/view?viewPath=61222751-24cf-4ff5-a838-109a8e24af9a&title=%E5%93%8D%E5%BA%94%E7%BB%93%E6%9E%84%EF%BC%88JSON%EF%BC%89&tab=&index=2)响应结构

### login_openid 有效期

**接口原型**

```java
/**
 *  RuiXueSdk.loginOpenidExpireInvalid()  判断 login_openid 是否失效
 * @return login_openid true 失效， false 有效
 */
public static boolean loginOpenidExpireInvalid() 
```
 
**调用示例**

```java
RXSDK.loginOpenidExpireInvalid()
```

### 设置密码等级
::: tip
默认等级为 strong
:::
**接口原型**

```java
/**
 * 设置密码等级
 * @param type 密码强度等级枚举
 */
public static void setPasswordStrength(PasswordStrength passwordStrength)
```

**type 说明**

| **字段**  | **说明**                                                                         |
| ----------------- | --------------------------------- |
| Default      | 6-32 位任意字符   |
| Custom      | 自定义密码正则  |
| Average      | 简易密码， 6-32 位任意字符 |
| Strong      | 强密码，  6-32 位，包含数字+字母+特殊符号  |


**调用示例**

```java
RXSDK.setPasswordStrength(Average)
```

### 自定义密码正则
**接口原型**

```java
/**
 * 设置密码正则
 * 需要先将密码强度设置为自定义
 */
public static void setPwdPattern(String pwdPattern)
```

**调用示例**

```java
RXSDK.setPwdPattern(自定义正则)
```

## 用户中心

### 申请注销账号

**接口原型**

```java
/**
 *申请注销账号
* @param deregisterConfig {@link  RXDeregisterConfig}类
* @param callback
*/
void deregister(RXDeregisterConfig deregisterConfig, RXRequestCallback callback);
```

#### RXDeregisterConfig 说明

| **字段** | **类型** | **是否必填** | **备注**      |
| -------- | -------- | ------------ | ------------- |
| setIdCard   | String | 否           | 身份证，<span style='color:red'>已实名用户必传，未实名用户可不传</span>      |
| setRealName | String | 否           | 真实姓名，<span style='color:red'>已实名用户必传，未实名用户可不传</span>      |
| setCpData   | String | 否           | CP 自定义数据，建议传 game_user_id=用户的游戏 id，不传在瑞雪后台不会账号注销页面不显示游戏侧的用户id |
| setThirdParams   | Map<String, Object> | 否           | 三方渠道透传数据 |

**调用示例**

```java
RXDeregisterConfig rxDeregisterConfig=new RXDeregisterConfig();
rxDeregisterConfig.setIdCard("you idcard");
rxDeregisterConfig.setRealName("you real name");
rxDeregisterConfig.setCpData("{\"game_user_id\":\"游戏 id\"}");

RXSDK.getInstance().deregister(rxDeregisterConfig, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
            int code = jsonObject.optInt("code", -1);
            if (code == 0) {    //仅代表申请注销请求发送成功，实际注销状态需要后台审核
                //todo 处理成功逻辑
                JSONObject data = jsonObject.optJSONObject("data"); // data 可能为空
                if (data != null) {
                    //todo 参照响应示例
                }

            } else {
                String msg = jsonObject.optString("msg");
                String thirdcode = String.valueOf(jsonObject.opt("thirdcode"));
                String thirdmsg = String.valueOf(jsonObject.opt("thirdmsg"));
                //todo 根据错误码处理失败逻辑
            }
    }
});
```

**响应示例**

```json
{
    "code": 0
}
```

### 撤销注销申请

**接口原型**

```java
/**
 * 撤销注销申请
 */
void deregisterCancel(RXRequestCallback callback);
```

**调用示例**

```java
RXSDK.getInstance().deregisterCancel(new RXRequestCallback() {
        @Override
        public void onResponse(JSONObject jsonObject) {
            int code = jsonObject.optInt("code", -1);
            if (code == 0) {    //仅代表请求发送成功
                //todo 处理成功逻辑
            } else {
                String msg = jsonObject.optString("msg");
                //todo 根据错误码处理失败逻辑
            }
        }
    });
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

```java
    /**
     * 发送验证码
     * @param phoneOrEmail 验证码类型
     * @param purpose      发送的目标（手机或邮箱），传空或nil默认为当前绑定的手机或邮箱
     * ！register           // 注册
     * ！bindphone      // 绑定手机
     * ！unbindphone  // 解绑手机
     * ！resetpwd        // 重置密码
     * ！changepwd    // 修改密码
     * ！bindemail       // 绑定邮箱
     * ！unbindemail   // 解绑邮箱
     * ！login               // 登录
     *                     
     * @param isMail       是否是邮箱
     * @param randstr      图形验证随机串，可传空
     * @param ticket       图形验证凭证，可传空
     */
boolean sendCaptcha(String phoneOrEmail, String purpose, boolean isMail, String randstr, String ticket, RXJSONCallback callback)
```

#### 参数说明

| **字段** | **类型**    | **是否必填** | **备注**                                                        |
| -------- | ----------- | ------------ | --------------------------------------------------------------- |
| target   | String    | 否           | 发送的目标（手机或邮箱），传null 默认为当前绑定的手机或邮箱 |
| purpose  | String    | 是           | 短信意图                                                        |
| isMail  | bool    | 是           | 是否是邮箱                                                        |
| randstr  | String    | 否           | 图形验证随机串                                                        |
| ticket  | String    | 否           |  图形验证凭证                                                        |

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

```java
RXSDK.getInstance().sendCaptcha( "手机号", "用途", true,"","",new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {    //仅代表请求发送成功
            //todo 处理成功逻辑
        } else {
            String msg = jsonObject.optString("msg");
            //todo 根据错误码处理失败逻辑
        }
    }
});
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

```java
/**
 * @param type         枚举 手机或邮箱
 * @param target       手机或邮箱
 * @param purpose      意图
 * @param captcha_code 验证码
 */
boolean verifyCaptcha(CaptchaType type, String target, String purpose, String captcha_code, RXRequestCallback callback);
```

#### 参数说明

| **字段** | **类型**    | **是否必填** | **备注**                                                        |
| -------- | ----------- | ------------ | --------------------------------------------------------------- |
| type     | CaptchaType | 是           | 验证码类型                                                      |
| target   | String    | 是           | 发送的目标（手机或邮箱），传空或 nil 默认为当前绑定的手机或邮箱 |
| purpose  | String    | 是           | 短信意图                                                        |
| captcha_code  | String    | 是           | 验证码                                                       |

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

```java
RXSDK.getInstance().verifyCaptcha(CaptchaType.CaptchaType_phone, "手机号", "用途", "验证码", new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            //todo 处理成功逻辑
        } else {
            String msg = jsonObject.optString("msg");
            //todo 根据错误码处理失败逻辑
        }
    }
});
```

**响应示例**

```json
{
    "code": 0
}
```

### 绑定邮箱

**接口原型**

```java
/**
 * 绑定邮箱
 * @param email 邮箱
 * @param password 密码
 * @param captcha_code 验证码
 * @param migrate_args  任意合法的 json 类型, 比如 string, nujber，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 */
void bindEmail(String email, String password, String captcha_code, Object migrate_args, RXRequestCallback callback);
```

#### 参数说明

| **字段**     | **类型** | **是否必填** | **备注**                                                                                                                                             |
| ------------ | -------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| captcha_code  | String | 是           | 验证码                                                                                                                                               |
| password     | String | 是           | 密码                                                                                                                                                 |
| email        | String | 是           | 邮箱                                                                                                                                                 |
| migrate_args | id       | 否           | 任意合法的 json 类型, 比如 String, int, NSArray, Map<String, Object> 账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP |

**调用示例**

```java
RXSDK.getInstance().bindEmail("suer@test.com", "密码", "captcha code", null, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            //todo 处理成功逻辑
        } else {
            String msg = jsonObject.optString("msg");
            //todo 根据错误码处理失败逻辑
        }
    }
});
```

**响应示例**

```json
{
    "code": 0
}
```

### 绑定手机号

**接口原型**

```java
/**
 * 绑定手机
 * @param phone 手机号
 * @param password 密码
 * @param captcha_code 验证码
 * @param migrate_args 任意合法的 json 类型, 比如 string, number，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 * @param callback callback
 */
void bindPhone(String phone, String password, String captcha_code, Object migrate_args, RXRequestCallback callback);
```

#### 参数说明

| **字段**     | **类型** | **是否必填** | **备注**                                                                                                                                             |
| ------------ | -------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| captcha_code  | String | 是           | 验证码                                                                                                                                               |
| password     | String | 否           | 密码                                                                                                                                                 |
| phone        | String | 是           | 手机号                                                                                                                                               |
| migrate_args | id       | 否           | 任意合法的 json 类型, 比如 String, int, NSArray, Map<String, Object> 账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP |

**调用示例**

```java
RXSDK.getInstance().bindPhone("手机号", "password", "captcha code ", null, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            //todo 处理成功逻辑
        } else {
            String msg = jsonObject.optString("msg");
            //todo 根据错误码处理失败逻辑
        }
    }
});
```

**响应示例**

```json
{
    "code": 0
}
```

### 换绑手机号

**接口原型**

```java
/**
 *换绑手机号
    * @param newPhone 新手机号
    * @param newPhoneCaptcha 新手机号验证码
    * @param oldPhoneCaptcha 旧手机号验证码
    * @param migrateArgs 任意合法的 json 类型, 比如 string, number，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
    * @param callback callback
    */
void changePhone(String newPhone, String newPhoneCaptcha, String oldPhoneCaptcha, Object migrateArgs, RXRequestCallback callback);
```

#### 参数说明

| **字段**         | **类型** | **是否必填** | **备注**                                                                                                                                             |
| ---------------- | -------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| oldPhoneCaptcha | String | 是           | 当前登录的手机号的 unbindphone 验证码                                                                                                                |
| newPhone         | String | 是           | 新的手机号                                                                                                                                           |
| newPhoneCaptcha | String | 是           | 新手机号的 bindphone 验证码                                                                                                                          |
| migrateArgs     | id       | 否           | 任意合法的 json 类型, 比如 String, int, NSArray, Map<String, Object> 账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP |

**调用示例**

```java
RXSDK.getInstance().changePhone("new phone", "new phone captcha code", "old phone captcha code", null, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            //todo 处理成功逻辑
        } else {
            String msg = jsonObject.optString("msg");
            //todo 根据错误码处理失败逻辑
        }
    }
});
```

**响应示例**

```json
{
    "code": 0
}
```

### 获取用户信息

**接口原型**

```java
/**
 * 获取用户信息
 * @param callback 回调函数
 */
void getUserInfo(RXRequestCallback callback);
```

**调用示例**

```java
RXSDK.getInstance().getUserInfo(new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            //todo 处理成功逻辑
        } else {
            String msg = jsonObject.optString("msg");
            //todo 根据错误码处理失败逻辑
        }
    }
});
```

#### 响应结构（JSON）

| **字段**         | **类型**          | **说明**                                                                                                                                                                                                                                                       |
| ---------------- |-----------------| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| age              | Number          | 用户年龄，根据实名信息获取。                                                                                                                                                                                                                                   |
| sex              | Number          | 性别。0 表示女性，1 表示男性。                                                                                                                                                                                                                                 |
| user_state       | Number          | 用户状态定义, 0 为正常用户。为正数时，使用各位编码用户的不同状态（以下表述中，第 0 位表示最低位）:第 0 位: 为 1 表示玩家已提交注销申请第 1 位: 为 1 表示已注销。可以是客服同意玩家的注销申请，也可以是客服直接在后台操作将账号注销。第 2 位: 为 1 表示已封停。 |
| attr             | [Number](https://doc.ruixueyun.com/main/#/view?viewPath=84cd522b-5f74-4223-b6b7-7a8eba7caf30&title=attr%E6%A0%87%E8%AE%B0&tab=&index=0) | 账号状态标记，使用位运算构成。参考下文 [attr 标记说明](https://doc.ruixueyun.com/main/#/view?viewPath=84cd522b-5f74-4223-b6b7-7a8eba7caf30&title=attr%E6%A0%87%E8%AE%B0&tab=&index=0)                                                                                                             |
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

```java
/**
 * 修改用户信息
 * @param nickname  用户昵称 非必传
 * @param avatarUrl 头像url 非必传
 * @param region    地区码 非必传
 * @param sex       1男 0女 非必传
 * @param ext       透传参数
 * @param callback
 */
void updateUserInfo(String nickname, String avatarUrl, String region, int sex,Map<String,Object> ext RXRequestCallback callback);
```

#### 参数说明

| **字段**  | **类型** | **是否必填** | **备注**        |
| --------- | -------- | ------------ | --------------- |
| avatarUrl | String | 否           | 头像 url        |
| nickname  | String | 否           | 用户昵称        |
| sex       | String | 是           | 性别，1 男 0 女，<span style='color:red'>无改动传-1，不传会默认修改为女性</span> |
| region    | String | 否           | 地区码          |
| ext    | Map<String,Object> | 否           | 透出参数，目前仅作为数据校验使用 |

> **ext 说明**

| **字段**  | **类型** | **是否必填** | **备注**        |
| --------- | -------- | ------------ | --------------- |
| old_avatarurl | NSString | 否           | 旧头像 url        |
| old_nickname  | NSString | 否           | 旧用户昵称        |
| old_sex       | NSString | 是           | 旧性别，1 男 0 女，<span style='color:red'>无改动传-1，不传会默认修改为女性</span> |

**调用示例**

```java
String region="";
int sex=1;
RXSDK.getInstance().updateUserInfo("昵称", "头像地址", region, sex, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            //todo 处理成功逻辑
        } else {
            String msg = jsonObject.optString("msg");
            //todo 根据错误码处理失败逻辑
        }
    }
});
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

```java
/**
 * 同步信息
 * 调用后会跳转到微信授权登录，但不会走登录回调，同步信息通过此接口回调
 * @param wx_appid 微信登录appid
 */
 void syncInfo(Activity activity, Map<String, Object> map, RXJSONCallback callback);
```

**调用示例**

```java
 Map<String, Object> map = syncParams == null ? new HashMap<>() : syncParams;
map.put("method", RuiXueSdk.getLoginMethod());
map.put("wx_appid", "微信 appid");
RXSdkApi.getInstance().syncInfo(RuiXueSdk.getCurrentActivity(), map, callback); 
```

**响应示例**

```json
{
    "code": 0
}
```

### 修改密码

**接口原型**

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

| **字段** | **类型** | **是否必填** | **备注** |
| -------- | -------- | ------------ | -------- |
| old_password   | String | 是           | 旧密码   |
| new_password   | String | 是           | 新密码   |

**调用示例**

```java
RXSDK.getInstance().changePassword("old password", "new password", new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            //todo 处理成功逻辑
        } else {
            String msg = jsonObject.optString("msg");
            //todo 根据错误码处理失败逻辑
        }
    }
});
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

```java
/**
 * 重置密码
 * @param password     密码
 * @param captcha_code 验证码
 * @param migrate_args 任意合法的 json 类型, 比如 string, number，账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP  非必须
 */
void resetPassword(String username, String password, String captcha_code, Object migrate_args, RXRequestCallback callback);
```

#### 参数说明

| **字段**     | **类型** | **是否必填** | **备注**                                                                                                                                             |
| ------------ | -------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| username     | String | 是           | 用户名                                                                                                                                               |
| password     | String | 是           | 密码                                                                                                                                                 |
| captcha_code  | String | 是           | 验证码                                                                                                                                               |
| migrate_args | id       | 否           | 任意合法的 json 类型, 比如 String, int, NSArray, Map<String, Object> 账号迁移用的参数, 调用 CP account-query 及 account-queryandbind 接口时透传给 CP |

**调用示例**

```java
RXSDK.getInstance().resetPassword("手机号","password", "captcha code", null, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            //todo 处理成功逻辑
        } else {
            String msg = jsonObject.optString("msg");
            //todo 根据错误码处理失败逻辑
        }
    }
});

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
2. 游客绑定三方账号场景，<span style="color:#ff0000; background-color:#f8f8f8;">SDK 4.0.6 以上支持</span>
:::

**接口原型**

```java
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
void bindAccount(Activity activity, Map<String, Object> map, RXJSONCallback callback);
```

#### 参数说明
> ext 说明

| **字段**     | **类型** | **是否必填** | **备注**                                                                                                                                             |
| ------------ | -------- | ------------ | ------------------ |
| method     | String | 是           | 登录方式  |
| scene     | String | 是           | 场景，`bind` 红包绑定微信账号场景，`authorization` 绑定三方账号场景，默认 authorization |

> method 说明

| **字段**     | **说明** | 
| ------------ | -------- |
| wechat     | 红包场景 | 
| facebook     | 绑定三方账号场景 | 
| google    | 绑定三方账号场景 | 
| apple    | 绑定三方账号场景 | 

**调用示例**

```java
// 红包场景
Map<String, Object> map = new HashMap<>();
map.put("method", "wechat");
map.put("scene", "bind");
RuiXueSdk.getRXSdkApi().bindAccount(this, map, jsonCallback);

// 绑定三方账号场景
Map<String, Object> map = new HashMap<>();
map.put("method", "facebook");
map.put("scene", "authorization");
RuiXueSdk.getRXSdkApi().bindAccount(this, map, jsonCallback);
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

```java
/**
 * 实名认证
 * @param realName 姓名
 * @param idCard 身份证
 * @param callback callback
 */
void realAuth(String realName, String idCard, RXRequestCallback callback);
```

#### 参数说明

| **字段** | **类型** | **是否必填** | **备注** |
| -------- | -------- | ------------ | -------- |
| realName | String | 是           | 真实姓名 |
| idCard   | String | 是           | 身份证   |
| isFastRealAuth | boolean | 是 | 是否使用快速认证 |

**调用示例**

```java
RXSDK.getInstance().realAuth("姓名", "身份证", new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code", -1);
        if (code == 0) {
            //todo 处理成功逻辑
        } else {
            String msg = jsonObject.optString("msg");
            //todo 根据错误码处理失败逻辑
        }
    }
});
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
