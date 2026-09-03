# rxsdk_vk — VK ID 登录插件

## 功能简介

提供 VK 账号登录，支持两种 OAuth 2.1 接入方式：

| 模式 | ext 开关 | 登录 ext 回传 |
| --- | --- | --- |
| 官方 VK ID SDK（默认） | 不设置或 `vk_auth_mode=sdk` | `access_token` |
| WebView PKCE | `vk_auth_mode=code` | `code`、`code_verifier`、`device_id` |

## SDK 集成

```groovy
implementation 'com.ruixue:rxsdk_vk:${version}'
```

## 参数配置

### 初始化参数

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `vk_client_id` | String | PKCE 模式必填 | VK 应用 Client ID（服务端映射字段 `tp_appid`）；SDK 模式可选（建议仍传） |
| `vk_redirect_uri` | String | 可选 | PKCE 模式回调地址；默认 `https://oauth.vk.com/blank.html` |
| `vk_auth_mode` | String | 可选 | `sdk`（默认）或 `code` |

> `vk_client_id` 在 `vk_auth_mode=code`（PKCE）时缺失会初始化失败（`INIT_PARAMS_ERROR`）；SDK 模式下可不传。

### SDK 模式 Manifest 配置（`vk_auth_mode=sdk`）

宿主 `build.gradle` 配置：

```groovy
android {
    defaultConfig {
        manifestPlaceholders += [
            VKIDClientID: "<your_client_id>",
            VKIDClientSecret: "<your_secure_key>",
            VKIDRedirectHost: "vk.ru",
            VKIDRedirectScheme: "vk<your_client_id>"
        ]
    }
}
```

字段说明：

- `VKIDClientID`：VK 应用 Client ID（与 `vk_client_id` / 服务端 `tp_appid` 对应）。
- `VKIDClientSecret`：VK 应用 Secure Key（由 VK 控制台下发，按 VK SDK 要求用于初始化）。
- `VKIDRedirectHost`：VKID 回调 Host，使用 `vk.ru`。
- `VKIDRedirectScheme`：VKID 回调 Scheme，固定格式 `vk<clientId>`。

## 接口调用

```java
RuiXueSdk.getInstance().login(activity, LoginMethod.VK, null, callback);
```

## 登录回传字段

### 默认 SDK 模式（`vk_auth_mode=sdk`）

| ext 字段 | 说明 |
| --- | --- |
| `access_token` | VK ID SDK 返回的 OAuth 2.1 Access Token |

### PKCE 模式（`vk_auth_mode=code`）

| ext 字段 | 说明 |
| --- | --- |
| `code` | Authorization Code（服务端换 token） |
| `code_verifier` | PKCE verifier |
| `device_id` | VK 返回设备标识（可能为空） |

## 版本与构建要求

| 项 | 说明 |
| --- | --- |
| VK ID SDK | `com.vk.id:vkid:2.7.0` |
| JDK | 本模块 Java/Kotlin 17（编译环境需 JDK 17+） |
| minSdk | 以工程根配置为准 |
