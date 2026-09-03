# RXSDK UI API 文档

> **版本**: 3.7.36  
> **更新日期**: 2026-01-26

## 概述

`rxsdk_base_ui` 库提供了瑞雪 SDK 的 UI 组件接口，用于快速集成登录、用户中心、客服、实名认证等功能界面。

## 核心接口

### RXSdkUI（推荐使用）

**优化后的 UI API 入口类**，建议统一使用 `RXRequestCallback` 回调机制。

**注意：** 由于项目仓库大小写不敏感，类名使用 `RXSdkUI`（混合大小写），与现有代码保持一致。

**特点：**

- ✅ 接口函数名保持不变（与旧接口一致）
- ✅ 建议统一使用 `RXRequestCallback` 替代 `RXUICallback` 和 `RXJSONCallback`
- ✅ 提供完整的 Javadoc 文档

**获取实例：**

```java
RXSdkUI ui = RXSdkUI.getInstance();
```

**示例：**

```java
RXSdkUI ui = RXSdkUI.getInstance();

// 显示登录界面
RXLoginUIModel config = new RXLoginUIModel();
config.setLogoResId(R.drawable.logo);

ui.showLoginUI(activity, config, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject response) {
        // 统一使用 onResponse 处理成功和失败
        int code = response.optInt("code");
        if (code == 0) {
            // 登录成功
            JSONObject data = response.optJSONObject("data");
        } else {
            // 登录失败
            String msg = response.optString("msg");
        }
    }

    @Override
    public void onError(RXException e) {
        // 错误处理
    }
});
```

### IRXSdkUI

UI 接口定义，定义了所有 UI 相关的方法。

### IRXView

视图接口，继承自 `DialogInterface`，用于控制 UI 视图的显示和关闭。

**主要方法：**

```java
// 设置是否可取消
IRXView setCancelable(boolean flag);

// 设置点击空白处是否关闭
IRXView setCanceledOnTouchOutside(boolean cancel);

// 判断是否可取消
boolean isCancelable();

// 判断是否已显示
boolean isShowing();

// 显示窗口
void show();
```

### RXSdkUI

UI 接口实现类，单例模式。**建议统一使用 `RXRequestCallback` 回调机制**。

**获取实例：**

```java
RXSdkUI ui = RXSdkUI.getInstance();
```

## 登录相关接口

### 1. 显示登录界面

#### showLoginUI

显示登录界面，支持自定义配置。

```java
void showLoginUI(Activity activity, RXLoginUIModel config, RXUICallback loginCallback)
```

**参数说明：**

- `activity`: Activity 上下文
- `config`: 登录 UI 配置（`RXLoginUIModel`），可为 null，默认读取后台配置
- `loginCallback`: 登录回调（`RXUICallback`）

**示例：**

```java
RXLoginUIModel config = new RXLoginUIModel();
config.setLogoResId(R.drawable.logo);
config.setPrivacyOne("用户协议", "https://example.com/agreement");
config.setPrivacyTwo("隐私政策", "https://example.com/privacy");

RXSdkUI.getInstance().showLoginUI(activity, config, new RXUICallback() {
    @Override
    public void onSuccess(JSONObject data) {
        // 登录成功
    }

    @Override
    public void onFailed(int code, String msg) {
        // 登录失败
    }
});
```

#### loginOpenidExpireInvalid

检查登录 openid 是否失效，如果失效则自动拉起登录 UI。

```java
boolean loginOpenidExpireInvalid(Activity activity, RXLoginUIModel config, RXRequestCallback loginCallback)
```

**返回值：**

- `true`: openid 已失效，已拉起登录 UI
- `false`: openid 有效，未拉起登录 UI

**示例：**

```java
RXLoginUIModel config = new RXLoginUIModel();
boolean isExpired = RXSdkUI.getInstance().loginOpenidExpireInvalid(activity, config, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject response) {
        // 登录结果
    }

    @Override
    public void onError(RXException e) {
        // 登录错误
    }
});
```

#### loginUI（已废弃）

**注意：** 此方法已废弃，请使用 `showLoginUI` 替代。

```java
@Deprecated
IRXView loginUI(Activity activity, RXUICallback loginCallback)

@Deprecated
IRXView loginUI(Activity activity, Map<String, Object> map, RXUICallback loginCallback)

@Deprecated
IRXView loginUI(Activity activity, LoginUIConfig config, RXUICallback loginCallback)

@Deprecated
IRXView loginUI(Activity activity, LoginUIConfig config, Map<String, Object> map, RXUICallback loginCallback)
```

### 2. 注册界面

```java
IRXView registerUI(Activity activity, int registerType, RXUICallback callback)

IRXView registerUI(Activity activity, Map<String, Object> map, int registerType, RXUICallback callback)
```

**参数说明：**

- `registerType`: 注册界面类型（`Constants.RegisterType`）
- `map`: 自定义参数（可选）

## 用户中心相关接口

### 1. 用户中心

#### userCenterUI

显示用户中心界面。

```java
IRXView userCenterUI(Activity activity, Map<String, Object> map, RXUICallback callback)

IRXView userCenterUI(Activity activity, RXUserCenterConfig rxUserCenterConfig, RXUICallback callback)
```

**参数说明：**

- `map`: 自定义参数（可选）
- `rxUserCenterConfig`: 用户中心配置（`RXUserCenterConfig`）

**RXUserCenterConfig 配置项：**

```java
RXUserCenterConfig config = new RXUserCenterConfig();
config.setTransmit_args("透传数据");
config.setGame_user_id("游戏用户ID");
config.setNickname("用户昵称");
config.setHead_img_url("头像URL");
config.setQueue_name("客服接入点名称");
config.setLogoImage(drawable);
config.setLightTheme(true); // 浅色主题
config.setSyncInfoEnable(true); // 显示同步信息按钮
```

**示例：**

```java
RXUserCenterConfig config = new RXUserCenterConfig();
config.setNickname("张三");
config.setHead_img_url("https://example.com/avatar.jpg");

IRXView view = RXSdkUI.getInstance().userCenterUI(activity, config, new RXUICallback() {
    @Override
    public void onSuccess(JSONObject data) {
        // 操作成功
    }

    @Override
    public void onFailed(int code, String msg) {
        // 操作失败
    }
});
view.show();
```

### 2. 帮助中心

```java
IRXView helperCenterUI(Activity activity, Map<String, Object> map, RXUICallback callback)

IRXView helperCenterUI(Activity activity, RXUserCenterConfig rxUserCenterConfig, RXUICallback callback)
```

## 客服相关接口

### chatServiceUI

显示客服界面。

```java
IRXView chatServiceUI(Activity activity, Map<String, Object> map, boolean isLightTheme, RXUICallback callback)
```

**参数说明：**

- `map`: 自定义参数（可选）
- `isLightTheme`: 是否使用浅色主题
- `callback`: 回调接口

**示例：**

```java
Map<String, Object> params = new HashMap<>();
params.put("queue_name", "default");

IRXView view = RXSdkUI.getInstance().chatServiceUI(activity, params, true, new RXUICallback() {
    @Override
    public void onSuccess(JSONObject data) {
        // 操作成功
    }

    @Override
    public void onFailed(int code, String msg) {
        // 操作失败
    }
});
view.show();
```

## 实名认证相关接口

### 1. 实名认证

#### realAuthUI

显示实名认证界面。

```java
IRXView realAuthUI(Activity activity, boolean cancelable, RXJSONCallback callback)
```

**参数说明：**

- `cancelable`: 是否可取消关闭
- `callback`: 回调接口（`RXJSONCallback`）

**示例：**

```java
IRXView view = RXSdkUI.getInstance().realAuthUI(activity, true, new RXJSONCallback() {
    @Override
    public void onSuccess(JSONObject data) {
        // 实名认证成功
    }

    @Override
    public void onFailed(JSONObject cause) {
        // 实名认证失败
    }

    @Override
    public void onError(RXException e) {
        // 错误处理
    }
});
view.show();
```

#### realAuthH5UI

显示实名认证 H5 界面（适用于海外地区）。

```java
IRXView realAuthH5UI(Activity activity, String region, boolean cancelable, RXJSONCallback callback)
```

**参数说明：**

- `region`: 地区码（如 "VN" 表示越南）
- `cancelable`: 是否可取消关闭

### 2. 限制提示界面

```java
IRXView limitUI(Activity activity, String titleStr, String contextStr, String buttonTxt, RXJSONCallback callback)
```

**参数说明：**

- `titleStr`: 标题
- `contextStr`: 内容
- `buttonTxt`: 按钮文本

## 账号管理相关接口

### 1. 找回密码

#### findPassWordUI

显示找回密码界面。

```java
@Deprecated
IRXView findPassWordUI(Activity activity, RXUICallback callback)

IRXView findPassWordUI(Activity activity, Map<String, Object> map, RXUICallback callback)
```

**参数说明（map）：**

- `username`: 默认填充的账号（可选）
- `account_type`: 账号类型，1-普通账号，2-手机号，3-邮箱（可选，默认 2）
- `password_hint`: 输入密码提示文本（可选）

**示例：**

```java
Map<String, Object> params = new HashMap<>();
params.put("username", "13800138000");
params.put("account_type", 2);

IRXView view = RXSdkUI.getInstance().findPassWordUI(activity, params, new RXUICallback() {
    @Override
    public void onSuccess(JSONObject data) {
        // 操作成功
    }

    @Override
    public void onFailed(int code, String msg) {
        // 操作失败
    }
});
view.show();
```

### 2. 修改密码

```java
IRXView changePwdUI(Activity activity, boolean isPasswordSet, RXJSONCallback callback)
```

**参数说明：**

- `isPasswordSet`: 是否已设置密码

### 3. 绑定手机号

```java
IRXView bindPhoneUI(Activity activity, RXUICallback callback)
```

### 4. 绑定邮箱

```java
IRXView bindEmailUI(Activity activity, RXUICallback callback)
```

### 5. 解绑手机号（已废弃）

```java
@Deprecated
IRXView unBindPhoneUI(Activity activity, RXUICallback callback)
```

### 6. 解绑邮箱（已废弃）

```java
@Deprecated
IRXView unBindEmailUI(Activity activity, RXUICallback callback)
```

## 账号注销相关接口

### 1. 申请注销

#### applyForDeregisterUI

显示申请注销界面。

```java
IRXView applyForDeregisterUI(Activity activity, Map<String, Object> map, RXUICallback callback)

IRXView applyForDeregisterUI(Activity activity, RXUserCenterConfig rxUserCenterConfig, RXUICallback callback)
```

### 2. 撤销注销申请

#### destroyAccountStatusView

显示撤销注销申请界面。

```java
IRXView destroyAccountStatusView(Activity activity, boolean isLoginContinue, RXJSONCallback callback)

IRXView destroyAccountStatusView(Activity activity, String okButtonText, RXJSONCallback callback)
```

**参数说明：**

- `isLoginContinue`: true 继续登录，false 退出登录
- `okButtonText`: 右侧按钮文本，默认"继续登录"

## 隐私协议相关接口

### 1. 用户协议和隐私政策

#### userPrivacyPolicy

显示用户协议和隐私政策界面。

```java
IRXView userPrivacyPolicy(Context activity, LegalData legalData, String key, RXJSONCallback callback)

IRXView userPrivacyPolicy(Context activity, String title, String content, RXJSONCallback callback)

IRXView userPrivacyPolicy(Context activity, String title, String content, Collection<String> keyList, RXJSONCallback callback)
```

**参数说明：**

- `legalData`: 法务数据（可选）
- `key`: 协议条款 key
- `title`: 标题
- `content`: 协议内容
- `keyList`: 协议条款 key 列表

### 2. 协议视图

```java
IRXView protocolView(Activity activity, String key, List<String> keyList)
```

**参数说明：**

- `key`: 默认需要展示的协议条款 key
- `keyList`: 需要展示的协议条款 key 列表

### 3. 声明界面

```java
IRXView statementUI(Activity activity, LegalData legalData, String key)
```

## 分享相关接口

### showShareUI

显示分享界面。

```java
void showShareUI(Activity activity, String shareType, Map<String, Object> map, RXJSONCallback callback)
```

**参数说明：**

- `shareType`: 分享类型
- `map`: 分享参数

**示例：**

```java
Map<String, Object> params = new HashMap<>();
params.put("title", "分享标题");
params.put("content", "分享内容");
params.put("url", "https://example.com");

RXSdkUI.getInstance().showShareUI(activity, "wechat", params, new RXJSONCallback() {
    @Override
    public void onSuccess(JSONObject data) {
        // 分享成功
    }

    @Override
    public void onFailed(JSONObject cause) {
        // 分享失败
    }

    @Override
    public void onError(RXException e) {
        // 错误处理
    }
});
```

## 其他功能接口

### 1. 验证码验证

```java
IRXView captchaVerifyUI(Activity activity, int appid, RXUICallback callback)
```

**参数说明：**

- `appid`: 验证码应用 ID

### 2. WebView

```java
IRXView openWebView(Activity activity, String url, String title)
```

**参数说明：**

- `url`: 链接地址
- `title`: 标题

**示例：**

```java
IRXView view = RXSdkUI.getInstance().openWebView(activity, "https://example.com", "网页标题");
view.show();
```

### 3. 邮件中心

```java
IRXView showMailCenter(Activity activity, String userId)
```

**参数说明：**

- `userId`: 用户 ID

### 4. 公告界面

```java
void showAnnounceView(Context context, int limit, NoticeCallback linkCallback)
```

**参数说明：**

- `limit`: 读取条数（limit > 0）
- `linkCallback`: 回调接口（`NoticeCallback`）

### 5. 更新应用界面

#### showUpdateAppView

显示应用更新界面。

```java
void showUpdateAppView(Context context, String version, String region, Map<String, Object> queryMap, boolean isShowUI, MaintainNoticeCallback linkCallback)
```

**参数说明：**

- `version`: 客户端版本号（3 段或 4 段）
- `region`: 地区码
- `queryMap`: 查询参数
  - `type`: 脚本类型，默认 json，可选 lua、u3d
  - `format`: 输出文件后缀，默认 json，可选 lua
- `isShowUI`: 是否显示 UI
- `linkCallback`: 回调接口（`MaintainNoticeCallback`）

#### showCheckUpdateAppView

显示检查更新界面。

```java
void showCheckUpdateAppView(Context context, String version, String region, String type, Map<String, Object> queryMap, boolean isShowUI, MaintainNoticeCallback linkCallback)
```

**参数说明：**

- `version`: 客户端版本号（3 段或 4 段）
- `region`: 地区码，默认 0
- `type`: 脚本类型，默认 js，可选 lua、u3d
- `queryMap`: 查询参数
  - `games`: `{"游戏id": 客户端游戏版本}`
  - `activities`: `{"活动别名": 客户端活动版本}`
- `isShowUI`: 是否显示 UI

## 配置类说明

### LoginUIConfig

登录 UI 配置类，用于配置登录界面的各种参数。

**主要配置项：**

```java
LoginUIConfig config = new LoginUIConfig();

// Logo 设置
config.setLogoResId(R.drawable.logo);
config.setLogoDrawable(drawable);
config.setLogoByteArr(byteArray);

// 隐私协议设置
config.setPrivacyOne("用户协议", "https://example.com/agreement");
config.setPrivacyTwo("隐私政策", "https://example.com/privacy");
config.setPrivacyThree("第三方协议", "https://example.com/third");

// 登录方式设置
List<String> methods = Arrays.asList("captcha", "username", "guest", "wechat");
config.setLoginMethods(methods);

// 其他设置
config.setShowPrivacy(true); // 显示隐私协议
config.setCancelable(true); // 可取消
config.setShowBackBtn(false); // 显示返回按钮
config.setCaptchaLogin(true); // 默认验证码登录
config.setUsernameHintText("请输入手机号"); // 用户名提示
config.setUsernameText("13800138000"); // 预填充用户名
config.setRealAuthRegion("VN"); // 实名认证地区
config.setForgotUrl("https://example.com/forgot"); // 忘记密码链接
```

### RXLoginUIModel

登录 UI 模型类，继承自 `LoginUIConfig`，提供更简洁的配置方式。

**主要方法：**

```java
RXLoginUIModel model = new RXLoginUIModel();

// 实名认证设置
model.needRealAuth(true); // 需要实名认证
model.canCloseRealAuth(false); // 不可关闭实名认证

// 隐私协议设置
LinkedHashMap<String, Object> privacyMap = new LinkedHashMap<>();
privacyMap.put("https://example.com/agreement", "用户协议");
privacyMap.put("https://example.com/privacy", "隐私政策");
model.setPrivacies(privacyMap);

// 显示设置
model.isShowClose(true); // 显示关闭按钮
```

### RXUserCenterConfig

用户中心配置类。

**主要配置项：**

```java
RXUserCenterConfig config = new RXUserCenterConfig();

// 用户信息
config.setTransmit_args("透传数据");
config.setGame_user_id("游戏用户ID");
config.setNickname("用户昵称");
config.setHead_img_url("头像URL");

// 客服设置
config.setQueue_name("客服接入点名称");

// 界面设置
config.setLogoImage(drawable);
config.setLightTheme(true); // 浅色主题
config.setSyncInfoEnable(true); // 显示同步信息按钮

// 关闭监听
config.setOnViewCloseListener(new OnViewCloseListener() {
    @Override
    public void onClose() {
        // 用户中心关闭回调
    }
});
```

## Unity 支持

所有 UI 接口都提供了 Unity 版本，方法名以 `unity` 开头，使用 `UnityRXRequestCallback` 作为回调。

**示例：**

```java
RXSdkUI.getInstance().unityShowLoginUI(activity, config, new UnityRXRequestCallback() {
    @Override
    public void onResponse(String response) {
        // Unity 回调
    }

    @Override
    public void onError(String error) {
        // Unity 错误回调
    }
});
```

## 迁移到统一回调机制

### 为什么统一使用 RXRequestCallback？

1. **统一的回调机制**：所有接口统一使用 `RXRequestCallback`，简化回调处理
2. **更好的类型安全**：统一的回调接口，减少类型转换错误
3. **向后兼容**：接口函数名保持不变，迁移成本低
4. **完整的文档**：提供完整的 Javadoc 文档

### 迁移步骤

#### 1. 保持使用 RXSdkUI

**注意：** 类名使用 `RXSdkUI`（混合大小写），与现有代码保持一致。

```java
RXSdkUI ui = RXSdkUI.getInstance();
```

#### 2. 替换回调类型

**旧代码（使用 RXUICallback）：**

```java
ui.showLoginUI(activity, config, new RXUICallback() {
    @Override
    public void onSuccess(JSONObject data) {
        // 成功处理
    }

    @Override
    public void onFailed(JSONObject cause) {
        // 失败处理
    }

    @Override
    public void onError(RXException e) {
        // 错误处理
    }
});
```

**新代码（使用 RXRequestCallback）：**

```java
ui.showLoginUI(activity, config, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject response) {
        // 统一处理成功和失败
        int code = response.optInt("code");
        if (code == 0) {
            // 成功
            JSONObject data = response.optJSONObject("data");
        } else {
            // 失败
            String msg = response.optString("msg");
        }
    }

    @Override
    public void onError(RXException e) {
        // 错误处理
    }
});
```

#### 3. 替换 RXJSONCallback

**旧代码（使用 RXJSONCallback）：**

```java
ui.realAuthUI(activity, true, new RXJSONCallback() {
    @Override
    public void onSuccess(JSONObject data) {
        // 成功处理
    }

    @Override
    public void onFailed(JSONObject cause) {
        // 失败处理
    }
});
```

**新代码（使用 RXRequestCallback）：**

```java
ui.realAuthUI(activity, true, new RXRequestCallback() {
    @Override
    public void onResponse(JSONObject response) {
        // 统一处理
    }

    @Override
    public void onError(RXException e) {
        // 错误处理
    }
});
```

### 迁移检查清单

- [ ] 将所有 `RXUICallback` 替换为 `RXRequestCallback`
- [ ] 将所有 `RXJSONCallback` 替换为 `RXRequestCallback`
- [ ] 将 `onSuccess` 和 `onFailed` 合并为 `onResponse`
- [ ] 测试所有 UI 功能是否正常工作

## 注意事项

1. **回调线程**：所有回调都在主线程（UI 线程）执行
2. **视图显示**：返回的 `IRXView` 对象需要调用 `show()` 方法才能显示
3. **视图控制**：可以通过 `IRXView` 接口控制视图的显示、关闭、是否可取消等
4. **配置优先级**：代码配置优先于后台配置
5. **废弃方法**：标记为 `@Deprecated` 的方法建议使用新方法替代
6. **大小写注意**：项目仓库大小写不敏感，类名使用 `RXSdkUI`（混合大小写），与现有代码保持一致

## 相关文档

- [RXSDK API 文档](./rxsdk_api.md)
- [回调接口说明](./callback.md)
- [快速开始指南](./QUICK_START.md)
- [API 迁移指南](./migration_guide.md)
