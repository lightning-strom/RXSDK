> **适用平台：Android**
>
> 百度游戏渠道当前仅提供 Android 原生 SDK，不支持 iOS。Unity、Cocos2dx 接入时仅在 Android 平台启用百度渠道能力。

## 后台接入配置
- [登录配置说明](https://doc.ruixueyun.com/main/#/view?path=878cc0e9-0678-4c8c-8e6f-1333f4d524d6)
- [支付配置说明](https://doc.ruixueyun.com/main/#/view?path=454e2849-c86d-4253-b9af-626742a90b88)

## 瑞雪快速接入（必接）
- [快速接入文档](https://doc.ruixueyun.com/main/#/view?path=a80d466b-39f6-40b1-b3a1-8289ceff1c8c)

## 三方渠道接入说明（必读）
- [三方渠道接入说明](https://doc.ruixueyun.com/main/#/view?viewPath=a1458347-d2f6-4570-8b27-0de8047b138b)

## 百度渠道 SDK 集成

```json
//baidu渠道库
api 'com.ruixue:rxsdk_baidu_wangxun:${version}'
```

## 参数说明

| **参数**  | **类型** | **说明**              |
| --------- | -------- | --------------------- |
| appid | long   | initThirdSdk 接口传入 |
| appkey    | String   | initThirdSdk 接口传入       |

## 配置说明
AndroidManifest.xml 添加如下配置
否则下载安全插件会异常，影响正常的登录⽀付逻辑

```
<!-- v1.9.0.6 新增 -->
<uses-permission android:name="android.permission.CAMERA"/>
<!-- SCHEDULE_EXACT_ALARM 精准闹钟（exact alarm）权限 保活调度倒计时使⽤，
解决Android 12（API 31）及以上由于缺少该权限引起的蒙层不消失问题-->
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM"/>
<!-- 仅针对 API 级别 33 及以上版本 -->
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" android:minSdkVe
rsion="33" />
<uses-permission android:name="android.permission.READ_MEDIA_VIDEO" android:minSdkVer
sion="33" />

<!-- apk安装相关-->
<provider 
android:name="android.support.v4.content.FileProvider" // ⾼版本target使⽤androidx.core.con
tent.FileProvider
android:authorities="{你的包名}.fileprovider" // 将红字部分的包名替换为⾃⼰的应⽤包名。
android:grantUriPermissions="true"
android:exported="false">
<!--元数据-->
<meta-data
android:name="android.support.FILE_PROVIDER_PATHS"
android:resource="@xml/provider_paths" />
</provider>

```

注意：假如游戏⼚商过去已经申请过⾃⼰的android.support.v4.content.FileProvider，继续添加可能会出现
冲突，请在⾃⼰已有的xml/**⽂件⾥添加代码：
```
<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
 // ……cp⾃⼰的路径……
 // 联运sdk需添加以下路径
 <files-path name="files-path" path="com.baidu.plaformsdk/" />
 <cache-path name="cache-path" path="/." />
 <external-path name="external-path" path="/." />
 <external-files-path name="external-files-path" path="com.baidu.plaformsdk/" />
 <external-cache-path name="external-cache-path" path="/." />
</paths>
```

## 混淆配置

在应用级根目录下打开混淆配置文件`proguard-rules.pro`，加入排除SDK的混淆配置

```
-keep class org.json.alipay.** { *; }

-keepclassmembers public class * extends android.app.Activity {
   public *;
}
-keep public class * extends android.support.v4.app.Fragment
-keep public class * extends android.app.Fragment

# 支付第三方SDK

-keep class com.tencent..** {
    *;
}
-keep class com.alipay.** {
    *;
}
-keep class com.baidu.** {
    *;
}
-keep class com.bun.miitmdid.core.** {*;}

-dontnote com.baidu.sapi2.**
-dontwarn com.squareup.picasso.**
-dontwarn android.support.test.**
-dontwarn com.baidu.sapi2.**
-dontwarn com.alipay.**
-dontwarn com.baidu.sofire.**
```

## 三方 SDK 版本信息

瑞雪 3.0.9 以上版本使用百度 sdk 1.9.0.2 版本， 以下版本使用百度 sdk 1.9.0.1 版本


## 闪屏（必接）
```java
RuiXueSdk.invokeChannelAction(
    activity,
    RuiXueSdk.CHANNEL_ACTION_SHOW_SPLASH,
    new HashMap<>(),
    new RXJSONCallback() {
        @Override
        public void onSuccess(@Nullable JSONObject data) {
            // 闪屏展示完成
        }

        @Override
        public void onFailed(@NonNull JSONObject cause) {
            // 处理闪屏失败
        }
    });
```

## 渠道悬浮窗

```java
RuiXueSdk.invokeChannelAction(
    activity,
    RuiXueSdk.CHANNEL_ACTION_SHOW_FLOAT_VIEW,
    new HashMap<>(),
    callback);

RuiXueSdk.invokeChannelAction(
    activity,
    RuiXueSdk.CHANNEL_ACTION_HIDE_FLOAT_VIEW,
    new HashMap<>(),
    callback);
```

## 初始化（必接）
参考代码
```java
Map<String, Object> params = new HashMap<>();

// 这里使用方填写自己的 appid 和 appkey 再测试
params.put("appid", "");
params.put("appkey", "");
RuiXueSdk.getApi().initThirdSdk(this, params, new RXJSONCallback() {
    @Override
    public void onSuccess(@Nullable JSONObject jsonObject) {
        Log.d(TAG, "init third sdk success");
    }

    @Override
    public void onFailed(@NonNull JSONObject jsonObject) {
        Log.d(TAG, "init third sdk failed " + jsonObject);
    }
});
```

## 登录（必接）
请参考登录API [Android 登录 API](https://doc.ruixueyun.com/main/#/view?viewPath=84cd522b-5f74-4223-b6b7-7a8eba7caf30&title=%E7%99%BB%E5%BD%95&tab=&index=1)

## 支付（必接）
请参考支付API [Android 支付 API](https://doc.ruixueyun.com/main/#/view?path=e6700996-7d32-4c8c-a1c2-fbabca8d5327)

## 登出
```java
RuiXueSdk.getApi().logout(new OnLogoutCallback() {
    @Override
    public void onSuccess(@Nullable String data) {
        // 登出成功
    }
});
```

## 退出 (必须接入)

```java
// 在游戏需要退出的地方调用该方法，如游戏主 Activity，中 onBackPressed() 应该需要调用此方法
RuiXueSdk.getApi().exitApp(activity, new new OnAppExitCallback() {
    @Override
    public void onExitConfirm(@Nullable String res) {
        // 退出成功
    }
});
```

## 游戏用户角色信息上报（网游必接）
```java
RXSDK.getInstance().setGameInfo("游戏角色 ID", "区服标识");

// type: 1=角色创建  2=进入游戏  3=角色升级  4=角色退出
GameInfo info = new GameInfo(/* type */ 2, /* roleId */ "1001", /* serverId */ "S001");
info.setRoleName("剑圣");
info.setServerName("华东1区");
info.setGameRoleLevel("36");
info.setVipLevel(5);
info.setGameRolePower(98800);
info.setPartyId("g_8801");
info.setPartyName("无双战盟");
info.setExperience("123456");
info.setBalance("9999");
info.setAttach("自定义透传字段");

RXSDK.getInstance().setGameInfo(info);
```
