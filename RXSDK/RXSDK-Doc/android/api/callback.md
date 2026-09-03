# 回调接口说明

> **版本**: 3.7.36  
> **更新日期**: 2026-01-26
>
> SDK 统一使用的回调接口 `RXRequestCallback` 说明文档

## 📋 接口定义

### RXRequestCallback（统一回调接口）

```java
public abstract class RXRequestCallback extends RXUICallback {
    // 统一回调方法，成功和失败都通过此方法返回
    public abstract void onResponse(JSONObject jsonObject);
    
    // 异常回调（网络错误、解析错误等）
    void onError(RXException e);
}
```

**特点**：

- 单一回调方法：`onResponse`
- 成功和失败都通过 `onResponse` 返回，通过 JSONObject 中的 `code` 字段判断
- 内部实现会将 `onSuccess`/`onFailed` 统一转换为 `onResponse` 调用

---

## 📝 响应格式

### 成功响应

```json
{
  "code": 0,
  "data": {
    // 实际数据
  }
}
```

### 失败响应

```json
{
  "code": 错误码,
  "msg": "错误信息",
  "trace_id": "追踪ID（可选）",
  "thirdcode": "三方错误码（可选）",
  "thirdmsg": "三方错误信息（可选）"
}
```

---

## 💡 使用示例

### 示例 1：用户登录

```java
api.login(activity, loginType, username, password, null, null, null, null, null, 
    new RXRequestCallback() {
        @Override
        public void onResponse(JSONObject jsonObject) {
            int code = jsonObject.optInt("code");
            if (code == 0) {
                // 处理登录成功
                JSONObject data = jsonObject.optJSONObject("data");
                String openId = data.optString("openid");
                // ...
            } else {
                // 处理登录失败
                String msg = jsonObject.optString("msg");
                Log.e("Login", "登录失败: " + code + ", " + msg);
            }
        }
        
        @Override
        public void onError(RXException e) {
            // 处理异常（网络错误、解析错误等）
            Log.e("Login", "登录异常: " + e.getMessage());
        }
    }
);
```

### 示例 2：获取用户信息

```java
api.getUserInfo(new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject jsonObject) {
        int code = jsonObject.optInt("code");
        if (code == 0) {
            JSONObject data = jsonObject.optJSONObject("data");
            String nickname = data.optString("nickname");
            String avatar = data.optString("avatar");
            // ...
        } else {
            String msg = jsonObject.optString("msg");
            // 处理错误
        }
    }
    
    @Override
    public void onError(RXException e) {
        // 处理异常
    }
});
```

---

## ⚠️ 注意事项

### 1. 错误码判断

- `code == 0`：请求成功
- `code != 0`：业务失败（需要检查 `msg` 字段）
- `onError` 被调用：网络错误、解析错误等异常情况

### 2. 线程约定

- `onResponse` 回调在**主线程（UI 线程）**执行
- `onError` 回调也在主线程执行

### 3. 空回调处理

```java
// 使用空回调
api.getUserInfo(RXRequestCallback.EMPTY);
```

### 4. 数据获取

成功时，数据在 `data` 字段中：

```java
if (code == 0) {
    JSONObject data = jsonObject.optJSONObject("data");
    // 处理 data
}
```

---

## 🔗 相关文档

- [错误码规范](../../common/specs/error_codes.md)
- [错误格式说明](../../common/api/01_error_format.md)
- [RXSdkApi 接口文档](./rxsdk_api.md)
- [PassportApi 接口文档](./passport_api.md)
- [SocialApi 接口文档](./social_api.md)
- [GameAreaApi 接口文档](./gamearea_api.md)
