## 项目根目录增加 maven 库依赖
在项目根目录的 build.gradle 中对应位置添加如下配置
```groovy
allprojects {
    repositories {
        // 新增如下一行
        maven { url "https://maven-release.webapp.163.com/repository/maven-releases/" }
    }
}
```

## SDK集成

```groovy
  implementation 'com.ruixue:rxsdk_yofun:${version}'
```

## 包名要求
:::warning
瑞雪 3.7.4 更新 mumu 2.0.0 包名信息从 .yofun 修改成 .yofun.mumu
:::

- Yofun要求包名以 .yofun.mumu 结尾，如 com.xxx.xxx.yofun.mumu

## 处理用于角标
[角标资源链接地址](https://oss.ruixueyun.com/upload/20250428/ic_launcher_cover.zip)


## 初始化配置

- 在 app/build.gradle 中填入网易Yofun提供的游戏参数。

```xml
manifestPlaceholders = [
    "app_id": "${这里替换为从网易Yofun获取的APP_ID}"
]
```

- 在 app/AndroidManifest.xml 中 application节点 内配置一个占位节点。

```xml
<meta-data
    android:name="YOFUN_APP_ID"
    android:value="${app_id}" />
```
## 初始化

- 在 applicaiton 中新增

```java
    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        RuiXueSdk.attachBaseContext(this);
    }
    
    @Override
    public void onCreate() {
        super.onCreate();
        RuiXueSdk.onApplicationCreate(this);
    }
```

## 闪屏
- 闪屏接入方式，在游戏主界面(一般为MainActivity，每个游戏可能不一样）onCreate 增加如下方法
```java
   @Override
   protected void onCreate(Bundle savedInstanceState) {
       super.onCreate(savedInstanceState);
       
       ... 初始化瑞雪 sdk 代码
       
        // MUMU SDK 内置 0、1、2 三种闪屏类型。
        Map<String, Object> splashParams = new HashMap<>();
        splashParams.put(RuiXueSdk.CHANNEL_ACTION_PARAM_SPLASH_TYPE, 0);
        RuiXueSdk.invokeChannelAction(
            this,
            RuiXueSdk.CHANNEL_ACTION_SHOW_SPLASH,
            splashParams,
            new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                RXLogger.d("闪屏已显示");
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.e("闪屏展示失败：" + cause);
            }
        });
   }
```

## 监听渠道UI是否展示（保活功能）

```java
         RuiXueSdk.setRuiXueSdkCallback(new RuiXueSdkCallback() {
            @Override
            public void onLogout(int code, String msg) {
                Log.d("mumu", "退出登录");
            }

            @Override
            public void rxPublicCallback(int type, Map<String, Object> map) {
                super.rxPublicCallback(type, map);
                // 游戏需要做的就是当收到生命周期UI隐藏的时候（测试MuMu的弹框正在显示），游戏的界面是正常运行的即可（游戏不能暂停，NPC或者角色是可以移动的）
                if (type == 1) {
                    Log.d("mumu", "UI 展示");
                    // 如果游戏暂停了的话，在这里恢复, Unity 调用示例
                    // 调用 UnityPlayer.resume();
                }else {
                    Log.d("mumu", "UI 隐藏");
                }
            }
        });
```

## 登录 (必须接入)
请参考 [Android端登录API](https://doc.ruixueyun.com/main/#/view?path=84cd522b-5f74-4223-b6b7-7a8eba7caf30)
```java
String username = null;
String loginType = LoginMethod.MUMU;
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

## 支付 (开计费必须接入)
请参考 [Android端支付API](https://doc.ruixueyun.com/main/#/view?path=d6607326-ee75-4f45-a2c3-790bb8fab795)

## 测试模式

- 网易Yofun 允许在测试中查看日志信息，在正式发版时，请勿打开测试模式！

**调用示例**

```java
    Map<String, Object> params = new HashMap<>();
    params.put(RuiXueSdk.CHANNEL_INIT_PARAM_DEBUG_MODE, true);
    RuiXueSdk.getApi().initThirdSdk(activity, params, callback);
```

## 上传游戏事件（必接）
```java
GameInfo info = new GameInfo(2, "1001", "S001");
info.setRoleName("剑圣");
info.setServerName("华东1区");
info.setGameRoleLevel("36");
info.setVipLevel(5);
info.setGameRolePower(98800);
info.setBalance("9999");
info.setAttach("{\"roleType\":\"战士\"}");
RuiXueSdk.getApi().setGameInfo(info);
```

## 混淆配置

```java
# yofun
-keep class com.netease.yofun.external.**{*;}
-keep class com.netease.yofun.network.ServerUrl {*;}
-keep class com.netease.yofun.network.request.** {*;}
-keep class com.netease.yofun.network.annotation.** {*;}
-keep class com.netease.yofun.network.data.**{ *; }
-keep class com.netease.yofun.wrapper.**{ *; }
-keep class android.support.**{ *; }

# mumusdk
-keep class com.mumu.services.** {*;}
-dontwarn com.mumu.services.external.**
-keep class android.support.** {*;}

# wechatpay
-keep class com.tencent.a.** { *; }
-keep class com.tencent.mm.** { *; }
-keep class com.tencent.wxop.** { *; }
-keep class com.tencent.mobileqq.openpay.** { *; }

# alipay
-dontwarn com.alipay.**
-keep class com.alipay.android.app.IAlixPay{*;}
-keep class com.alipay.android.app.IAlixPay$Stub{*;}
-keep class com.alipay.android.app.IRemoteServiceCallback{*;}
-keep class com.alipay.android.app.IRemoteServiceCallback$Stub{*;}
-keep class com.alipay.sdk.app.PayTask{ public *;}
-keep class com.alipay.sdk.app.AuthTask{ public *;}
-keep class com.ta.**
-keep class com.ut.**
-keep class org.json.alipay.**

# sensorsdata
-dontwarn com.universal.sensorsdata.analytics.android.**
-keep class com.universal.sensorsdata.analytics.android.** {
*;
}
```

## Unity 接入

### 安装公共包

Unity 只需导入 RuiXue.Base、RuiXue.Login、RuiXue.Pay 公共包，不需要
MuMu 专属 UPM。Android 导出工程选择 `rxsdk_yofun` 渠道库。

### Android 构建配置

1. 将 Unity Android 包名设置为以 `.yofun.mumu` 结尾。
2. 添加网易 Yofun Maven 仓库。
3. 填写网易 Yofun `APP_ID`。
4. 填写固定的 `com.ruixue:rxsdk_yofun` 版本，禁止使用 `+` 等动态版本。
5. 配置 MultiDex、`YOFUN_APP_ID`、Application 生命周期和混淆规则。

### 初始化与闪屏

闪屏必须在瑞雪 SDK 和第三方 SDK 初始化成功后展示，不要在 Activity
`onCreate` 中提前调用：

```csharp
RuiXueSdk.Initialize(cpId, productId, channelId, urls, response =>
{
    RuiXueSdk.SetPrivacyAgree(_ =>
    {
        RuiXueSdk.InitThirdSdk(new Dictionary<string, object>
        {
            ["debugMode"] = Debug.isDebugBuild
        }, _ => RuiXueSdk.InvokeChannelAction(
            RuiXueSdk.ChannelActionShowSplash,
            new Dictionary<string, object>
            {
                ["splashType"] = 0
            },
            OnSuccess,
            Debug.LogError), Debug.LogError);
    });
}, Debug.LogError);
```

正式发版时必须关闭调试模式。

### 登录与渠道 UI 回调

```csharp
LoginConfig config = new LoginConfig
{
    loginType = LoginMethod.MuMu
};
RXLogin.Login(config, OnLoginSuccess, OnLoginError);

RuiXueSdk.SetSdkCallback((type, data) =>
{
    if (type == 1)
    {
        Time.timeScale = 1f;
        AudioListener.pause = false;
    }
}, OnLogout, OnSwitchAccount);
```

### 上传游戏事件

Unity 统一使用 `RuiXueSdk.SetThirdGameInfo(GameInfo)`：

| type | MuMu 事件 |
| --- | --- |
| `1` | 创角成功 |
| `2` | 登录成功 |
| `3` | 角色升级 |

职业可通过 `attach` 的 `roleType` 或 `profession` 字段传递：

```csharp
GameInfo info = new GameInfo(2, "1001", "S001")
{
    roleName = "剑圣",
    serverName = "华东1区",
    gameRoleLevel = "36",
    vipLevel = 5,
    gameRolePower = 98800,
    balance = "9999",
    attach = "{\"roleType\":\"战士\"}"
};
RuiXueSdk.SetThirdGameInfo(info);
```

## 瑞雪 3.7.4 以下版本更新后修改（新接入无需关注这里）
:::warning
- 项目根目录增加 maven 库依赖，看上面文档
- 包名要求，看上面文档
- 角标处理，看上面文档
- 闪屏处理，在游戏主界面按照上面文档增加代码即可，原接入的代码删除掉，否则编译报错
- 上报游戏事件，字段有必填和选填之分，以前都是必填，注意一下
- 混淆配置修改，看上面文档
:::


