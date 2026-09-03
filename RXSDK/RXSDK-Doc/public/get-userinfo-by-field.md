# 获取指定用户信息接入文档

本文档说明如何通过瑞雪 SDK 按字段查询用户信息，适用于 iOS、Android、Unity、JSSDK 和 Cocos2dx 项目。

## 文档信息

| 项目 | 内容 |
| --- | --- |
| 能力 | 获取指定用户信息 |
| API | `/v1/passport/user/info_by_field` |
| 请求类型 | `POST` |
| 请求参数 | `map` / JSON object |
| iOS | `RXSDK_Pure >= 4.0.4` |
| Android | `>= 4.0.9` |
| Unity | `>= 1.6.26` |

## 适用场景

该接口用于按需查询用户相关信息。CP 可以根据业务场景组合字段，避免固定返回完整用户资料。

常见场景：

- 查询用户基础资料：openid、昵称、头像、手机号、邮箱等。
- 查询用户实名信息：真实姓名、身份证号、实名时间、年龄、性别等。
- 查询用户绑定信息或绑定登录方式：手机号、邮箱、第三方等登录凭证方式。
- 查询上次登录信息：登录方式、登录时间、登录设备、登录 IP 等。
- 查询本次请求环境：当前 IP、系统、设备、产品、渠道等。
- 查询防沉迷信息：是否受限、剩余可游戏时长、适用年龄、提示语等。

## 参数分组

请求参数由多个可选分组组成，至少传一个分组。

| 分组 | 类型 | 说明 |
| --- | --- | --- |
| `user` | `string[]` | 用户注册信息字段 |
| `login` | `string[]` | 上次登录信息字段 |
| `current` | `string[]` | 本次请求信息字段 |
| `aas` | `string[]` | 防沉迷信息字段 |
| `current_account` | `string[]` | 当前登录凭证信息字段，仅 AccessToken 调用有效 |
| `account` | `string[]` | 当前应用下全部登录凭证列表字段，仅 AccessToken 调用有效 |
| `openid` | `string` | 瑞雪 openid；服务端签名调用时与 `cp_user_id` 二选一 |
| `cp_user_id` | `string` | 游戏侧用户 ID；服务端签名调用时可代替 `openid` |

> AccessToken 调用时，网关会从 AccessToken 解析用户身份，无需在请求体传 `openid` / `cp_user_id`。

## 关键字段映射

### 用户实名信息

当用户问“获取用户实名信息”“查询是否实名”“获取实名姓名和身份证”等，使用 `user` 分组：

```json
{
  "user": ["real_auth_id", "real_auth_name", "real_auth_id_card", "real_auth_time", "age", "sex"]
}
```

可按需增加：

```json
{
  "user": ["real_auth_ip", "real_auth_device_code", "birthday"]
}
```

### 用户绑定的登录方式信息

当用户问“查询用户绑定信息”“查询用户绑定的登录方式”“接入瑞雪查询用户绑定信息”时，使用 `account` 分组。

如果只需要返回绑定了哪些登录方式，参数必须是：

```json
{
  "account": ["method"]
}
```

`account` 表示当前应用下全部登录凭证列表字段，不要误用 `login.method`。`login.method` 表示上次登录方式，不代表绑定列表。

### 当前登录凭证信息

当只需要当前正在使用的登录凭证时，使用 `current_account`：

```json
{
  "current_account": ["method", "username"]
}
```

### 用户实名信息 + 绑定登录方式

用户可能要求任意组合，例如“获取用户实名信息和用户绑定的登录方式信息”：

```json
{
  "user": ["real_auth_id", "real_auth_name", "real_auth_id_card", "real_auth_time", "age", "sex"],
  "account": ["method"]
}
```

## 支持字段

### user

| 查询字段 | 响应字段 | 说明 |
| --- | --- | --- |
| `openid` | `openid` | 瑞雪 openid |
| `cp_user_id` | `cp_user_id` | 游戏侧用户 ID |
| `product_id` | `product_id` | 注册产品 |
| `channel_id` | `channel_id` | 注册渠道 |
| `nickname` | `nickname` | 昵称 |
| `avatar` | `avatar` | 头像 |
| `phone` | `phone` | 手机号，掩码处理 |
| `email` | `email` | 邮箱，掩码处理 |
| `age` | `age` | 年龄 |
| `sex` | `sex` | 性别 |
| `birthday` | `birthday` | 生日 |
| `flag` | `flag` | 用户标记位 |
| `real_auth_id` | `real_auth_id` | 实名认证 ID |
| `real_auth_name` | `real_auth_name` | 真实姓名 |
| `real_auth_id_card` | `real_auth_id_card` | 身份证号码，掩码处理 |
| `real_auth_time` | `real_auth_time` | 实名认证时间 |
| `real_auth_ip` | `real_auth_ip` | 实名认证 IP |
| `real_auth_device_code` | `real_auth_device_code` | 实名认证设备码 |

更多字段包括：`custom`、`source`、`promoter`、`devicecode`、`subchannelid`、`platformid`、`attr`、`regtime`、`regip`、`user_state`、`topinviter_platformid`、`topinviter_openid`、`topinviter_subchannelid`、`inviter_level`、`inviter_subchannelid`、`inviter_openid`、`inviter_platformid`。

### login

| 查询字段 | 说明 |
| --- | --- |
| `devicecode` | 上次登录的设备 |
| `product_id` | 上次登录的产品 |
| `channel_id` | 上次登录的渠道 |
| `login_ip` | 上次登录 IP |
| `login_time` | 本次登录时间 |
| `last_login_time` | 上次登录时间 |
| `method` | 上次登录方式 |

### current

| 查询字段 | 说明 |
| --- | --- |
| `product_id` | 本次请求的产品 |
| `channel_id` | 本次请求的渠道 |
| `devicecode` | 本次请求的设备 |
| `ip` | 本次请求 IP |
| `os` | 本次请求系统 |
| `os_version` | 本次请求系统版本 |

### aas

| 查询字段 | 说明 |
| --- | --- |
| `flag` | 防沉迷标志位 |
| `limit` | 是否受防沉迷限制 |
| `aas` | 防沉迷控制下剩余可游戏秒数 |
| `suitable_age` | 适用年龄 |
| `trip` | 防沉迷提示语 |

### current_account / account

| 查询字段 | 说明 |
| --- | --- |
| `user_id` | 瑞雪用户 ID |
| `add_time` | 凭证添加时间 |
| `product_id` | 注册产品 ID |
| `channel_id` | 注册渠道 ID |
| `username` | 凭证用户名 |
| `method` | 凭证类型，如 username / phone / email / thirdparty |
| `devicecode` | 注册设备 ID |

## 响应结构

```json
{
  "code": 0,
  "data": {
    "user": {},
    "login": {},
    "current": {},
    "aas": {},
    "current_account": {},
    "account": []
  }
}
```

只会返回请求中指定的分组和字段。

## Android 接入

```java
Map<String, Object> params = new HashMap<>();
params.put("user", Arrays.asList("real_auth_id", "real_auth_name", "real_auth_id_card", "real_auth_time", "age", "sex"));
params.put("account", Arrays.asList("method"));

RXSDK.getInstance().getUserInfoByField(params, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        if (jsonObject.optInt("code", -1) != 0) {
            Log.e("RXSDK", "查询失败: " + jsonObject.optString("msg"));
            return;
        }

        JSONObject data = jsonObject.optJSONObject("data");
        JSONObject user = data == null ? null : data.optJSONObject("user");
        JSONArray account = data == null ? null : data.optJSONArray("account");
        Log.d("RXSDK", "实名信息=" + user + ", 绑定登录方式=" + account);
    }
});
```

## iOS 接入

```objc
NSDictionary *params = @{
    @"user": @[@"real_auth_id", @"real_auth_name", @"real_auth_id_card", @"real_auth_time", @"age", @"sex"],
    @"account": @[@"method"]
};

[[RXSDK sharedSDK] getUserInfoByFieldWithParams:params
                                       complete:^(NSDictionary *response, RX_CommonRequestError *error) {
    if (error) {
        NSLog(@"查询失败: %@", error.responesObject);
        return;
    }

    NSDictionary *data = response[@"data"];
    NSDictionary *user = data[@"user"];
    NSArray *account = data[@"account"];
    NSLog(@"实名信息=%@, 绑定登录方式=%@", user, account);
}];
```

## Unity 接入

```csharp
Dictionary<string, object> param = new()
{
    { "user", new[] { "real_auth_id", "real_auth_name", "real_auth_id_card", "real_auth_time", "age", "sex" } },
    { "account", new[] { "method" } }
};

RXLogin.GetUserInfoByField(
    param,
    data => Debug.Log("查询成功: " + data),
    error => Debug.LogError("查询失败: " + error)
);
```

## JSSDK / 小游戏接入

```javascript
sdk.getUserInfoByField({
  user: ['real_auth_id', 'real_auth_name', 'real_auth_id_card', 'real_auth_time', 'age', 'sex'],
  account: ['method']
}, {
  complete(res) {
    if (res.code !== 0) {
      console.error('查询失败', res)
      return
    }

    console.log('实名信息', res.data.user)
    console.log('绑定登录方式', res.data.account)
  }
})
```

## Cocos2dx 接入

```cpp
auto bridge = ruixue::RuixueBridge::getInstance();
bridge->getUserInfoByField(R"({
  "user": ["real_auth_id", "real_auth_name", "real_auth_id_card", "real_auth_time", "age", "sex"],
  "account": ["method"]
})", [](const std::string& responseJson) {
    CCLOG("指定用户信息: %s", responseJson.c_str());
});
```

## 常见问题

### 查询绑定信息应该用哪个字段？

使用 `account` 分组。只查询绑定的登录方式时：

```json
{
  "account": ["method"]
}
```

### `login.method` 和 `account.method` 有什么区别？

- `login.method`：上次登录方式。
- `account.method`：当前应用下全部绑定登录凭证的方式列表。

如果业务问“用户绑定了哪些登录方式”，应使用 `account.method`。

### 为什么没有返回某个分组？

接口只返回请求中指定的分组。请确认请求参数中是否包含对应分组，并且数组中包含需要的字段。
