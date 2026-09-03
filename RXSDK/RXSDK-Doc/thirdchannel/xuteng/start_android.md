
## 瑞雪快速接入（必接）
- [快速接入文档](https://doc.ruixueyun.com/main/#/view?path=a80d466b-39f6-40b1-b3a1-8289ceff1c8c)

## 三方渠道接入说明（必读）
- [三方渠道接入说明](https://doc.ruixueyun.com/main/#/view?viewPath=a1458347-d2f6-4570-8b27-0de8047b138b)


## SDK集成

```json
implementation 'com.ruixue:rxsdk_xuteng:4.0.19'
```

> `rxsdk_xuteng` 最低版本为 `4.0.19`，与其他渠道库互斥；宿主
> `minSdkVersion` 不低于 23。

## 参数说明

| 参数                    | 类型 | 说明           |
| ----------------------- | ---- | -------------- |
| CHANNELSDK_ID |  String     |  manifestPlaceholders |
| CHANNELSDK_GAME_VERSION |  String     |  manifestPlaceholders |

## 配置说明

- 在 build.gradle 文件的 android defaultConfig 块中引用中需要添加配置

```groovy
        minSdkVersion 23
        manifestPlaceholders.put("CHANNELSDK_ID", "栩腾提供的参数")
        manifestPlaceholders.put("CHANNELSDK_GAME_VERSION", "栩腾提供的参数")
```

最终应用的 `AndroidManifest.xml` 必须配置：

```xml
<application
    android:name="com.ruixue.sdk.XTApplication"
    ... />
```

宿主已有自定义 `Application` 时，需要让其继承 `XTApplication`，不能同时声明
两个 `Application`。

将栩腾母包工具生成的 `brsdk.cfg` 放到应用的 `src/main/assets/brsdk.cfg`。
请使用渠道交付的真实配置，不要生成或提交假配置。

栩腾渠道所需混淆规则已通过 AAR 的 `consumer-rules.pro` 自动透传，宿主无需重复复制。

## 登录 (必须接入) 请一定确保要初始化成功再调用登录
参考代码
```java
String username = null;
String loginType = "xuteng";
String captchaCode = null;
String loginOpenId = null;
Map<String, Object> ext = null;
String[] signFields = null;
Object migrateArgs = null;
RuiXueSdk.getApi().login(DemoActivity.this, loginType, username, password, captchaCode, loginOpenId, ext, signFields, migrateArgs, new RXJSONCallback() {
    @Override
    public void onSuccess(@Nullable JSONObject data) {
        Toast.makeText(DemoActivity.this, "登录成功", Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onFailed(@NonNull JSONObject cause) {
        Toast.makeText(DemoActivity.this, "登录失败", Toast.LENGTH_SHORT).show();
    }
});
```

## 支付 (必须接入)
 hq_type=xuteng

## 退出
参考代码
```java
 RuiXueSdk.exitApp(this, new OnAppExitCallback() {
    @Override
    public void onExitConfirm(@Nullable String res) {
        Toast.makeText(QuickDemoActivity.this, "退出游戏成功", Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onExitCancel() {
        Toast.makeText(QuickDemoActivity.this, "退出游戏取消", Toast.LENGTH_SHORT).show();
    }
});
```


## 登出
- 在游戏需要登出的地方调用如下代码
```java
 RuiXueSdk.getApi().logout(new OnLogoutCallback() {
    @Override
    public void onSuccess(@Nullable String data) {
        Toast.makeText(DemoActivity.this, "登出成功", Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onFailed(int code, String msg) {
        RXLogger.d("logout failed code = " + code + " msg = " + msg);
        Toast.makeText(DemoActivity.this, "登出失败", Toast.LENGTH_SHORT).show();
    }
});
```

 
##  logout 全局监听
参考代码 
```java 
RuiXueSdk.setRuiXueSdkCallback(new RuiXueSdkCallback() {
    
    // ... 省略了一些无关代码
    
    @Override
    public void onLogout(int code, String msg) {
        // code 0: 登出成功 
        // code -1: 登录出失败
        RXLogger.d(TAG, "onLogout code = " + code + " msg = " + msg);
    }
});
```

