# 栩腾渠道（Android）

栩腾仅支持 Android。宿主最低 `minSdkVersion 23`，使用固定依赖：

```groovy
implementation 'com.ruixue:rxsdk_xuteng:4.0.19'
```

渠道 AAR 已通过 consumer rules 透传混淆配置，宿主不要重复复制。渠道库与其他瑞雪渠道库互斥。

## 工程配置

```groovy
android {
    defaultConfig {
        minSdkVersion 23
        manifestPlaceholders += [
            CHANNELSDK_ID: "YOUR_XUTENG_CHANNELSDK_ID",
            CHANNELSDK_GAME_VERSION: "YOUR_XUTENG_GAME_VERSION"
        ]
    }
}
```

最终应用 Manifest 必须使用：

```xml
<application android:name="com.ruixue.sdk.XTApplication" />
```

宿主已有自定义 Application 时，应继承 `XTApplication`，不能同时声明两个 Application。将栩腾母包工具生成的 `brsdk.cfg` 放到应用 `src/main/assets/brsdk.cfg`；不要生成或提交假配置。

## 初始化

先完成瑞雪基础初始化，再调用：

```java
RuiXueSdk.getApi().initThirdSdk(activity, new HashMap<>(), jsonCallback);
```

渠道参数由 Manifest placeholder 和 `brsdk.cfg` 读取，不写入初始化 Map。

## 登录

```java
Map<String, Object> login = new HashMap<>();
login.put("method", "xuteng");
RuiXueSdk.getApi().login(activity, login, jsonCallback);
```

## 支付

```java
Map<String, Object> pay = new HashMap<>();
pay.put("hq_type", "xuteng");
pay.put("goods_tag", "YOUR_GOODS_TAG");
pay.put("trade_no", "YOUR_SERVER_ORDER");
RuiXueSdk.getApi().pay(activity, pay, jsonCallback);
```

客户端结果不作为发货依据，必须以后端支付通知验签、验单结果为准。

## 角色上报

```java
GameInfo gameInfo = new GameInfo(2, "YOUR_ROLE_ID", "YOUR_SERVER_ID");
gameInfo.setRoleName("YOUR_ROLE_NAME");
gameInfo.setServerName("YOUR_SERVER_NAME");
gameInfo.setGameRoleLevel("YOUR_ROLE_LEVEL");
RuiXueSdk.getApi().setGameInfo(gameInfo);
```

## 登出与退出

```java
RuiXueSdk.getApi().logout(logoutCallback);
RuiXueSdk.exitApp(activity, exitCallback);
```
