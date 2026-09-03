# 回调接口说明

> **版本**：3.7.x  
> **更新日期**：2026-01-28
>
> Unity SDK 统一使用的回调委托说明文档

## 📋 接口定义

### SdkCallback（统一回调）

```csharp
public delegate void SdkCallback(SdkResult result);
```

SDK 所有异步接口统一使用此委托，成功和失败都通过同一个回调返回，通过 `result.IsSuccess` 判断结果。

**特点**：

- 单一回调方法，成功失败都通过 `SdkResult` 返回
- 回调自动切换至 **Unity 主线程**（WebGL 除外）
- 可直接在回调中操作 UI、GameObject，无需额外 `Dispatcher`

---

## 📝 SdkResult 结构

```csharp
public readonly struct SdkResult
{
    public bool   IsSuccess { get; }  // true = 成功
    public string Data      { get; }  // 成功时的 JSON 字符串，失败时为 null
    public string Error     { get; }  // 失败时的错误描述，成功时为 null
    public int    Code      { get; }  // 失败时的错误码；成功为 0

    // 模式匹配（推荐写法）
    public void Match(Action<string> ok, Action<string> fail = null);

    // 隐式 bool 转换：if (result) { ... }
}
```

### 成功响应

```
result.IsSuccess = true
result.Code      = 0
result.Data      = "{ ...JSON字符串... }"
result.Error     = null
```

### 失败响应

```
result.IsSuccess = false
result.Code      = 错误码（如 3000、-1、-1001）
result.Error     = "错误描述"
result.Data      = null
```

---

## 💡 使用示例

### 方式一：Match 模式匹配（推荐）

```csharp
RXSDK.Login(config, result => result.Match(
    ok: data => {
        Debug.Log("登录成功: " + data);
    },
    fail: error => {
        Debug.LogError($"登录失败 [{result.Code}]: {error}");
    }
));
```

### 方式二：if 分支

```csharp
RXSDK.Login(config, result => {
    if (result.IsSuccess)
    {
        Debug.Log("成功: " + result.Data);
    }
    else
    {
        Debug.LogError($"失败 [{result.Code}]: {result.Error}");
    }
});
```

### 方式三：async / await

```csharp
private async void OnLoginButtonClick()
{
    var config = new LoginConfig { loginType = LoginMethod.Guest };
    var result = await RXSDK.LoginAsync(config);

    if (!result)
    {
        Debug.LogError($"登录失败 [{result.Code}]: {result.Error}");
        return;
    }

    Debug.Log("登录成功: " + result.Data);
}
```

### 方式四：async + 超时

```csharp
var result = await RXSDK.PayAsync(payParams, timeoutMs: 120_000);
if (!result)
{
    if (result.Code == -1) Debug.LogError("超时或网络异常");
    else Debug.LogError($"失败 [{result.Code}]: {result.Error}");
}
```

---

## 🔔 其他回调委托

除 `SdkCallback` 外，以下委托用于特殊场景：

| 委托类型 | 签名 | 使用场景 |
|---------|------|---------|
| `EventCallback` | `void (int type, string json)` | `SetSdkCallback` 全局 SDK 事件 |
| `SwitchAccountCallback` | `bool (int code, string data)` | 切换账号请求（返回值控制是否接受） |
| `PrivacyCallback` | `void (bool agreed)` | 隐私协议弹窗结果 |
| `ExitCallback` | `void (bool confirmed, string data)` | 退出 APP 确认结果 |

### 全局回调设置示例

```csharp
RXSDK.SetSdkCallback(
    onEvent: (type, json) => {
        Debug.Log($"全局事件 type={type}: {json}");
    },
    onLogout: (code, msg) => {
        Debug.LogWarning($"被动登出 [{code}]: {msg}");
        // 跳转登录界面
        SceneManager.LoadScene("LoginScene");
    },
    onSwitchAccount: (code, data) => {
        Debug.Log($"切换账号请求 [{code}]");
        return true; // 返回 true 接受切换
    }
);
```

---

## ⚠️ 注意事项

1. **主线程安全**：所有 `SdkCallback` 回调已在 Unity 主线程执行，可直接操作 UI
2. **WebGL 例外**：WebGL 平台无主线程切换，回调在原始帧触发
3. **空回调**：传 `null` 作为 callback 时 SDK 会安全忽略，不会报错
4. **async 取消**：async 接口不支持 `CancellationToken`，可用 `timeoutMs` 参数控制超时

---

## 🔢 错误码说明

| 范围 | 说明 |
|------|------|
| `0` | 成功 |
| `-1` | 本地通用失败（参数校验/网络异常） |
| `-2` | 用户取消操作（如支付取消） |
| `-1001` | 当前平台不支持此功能（Editor/PC） |
| `1000–1999` | 网络相关错误 |
| `2000–2999` | 初始化相关错误 |
| `3000–3999` | 登录相关错误 |
| `4000–4999` | 支付相关错误 |
| `5000–5999` | 分享相关错误 |
| `6000–6999` | 权限与未安装相关错误 |
| 6 位正整数 | 服务端业务错误码，原样透传 |

---

## 🔗 相关文档

- [接口文档总览](./README.md)
- [错误码规范](../../common/specs/error_codes.md)
