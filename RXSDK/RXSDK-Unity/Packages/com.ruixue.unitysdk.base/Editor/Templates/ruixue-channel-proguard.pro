# Baidu
-keep class org.json.alipay.** { *; }
-keepclassmembers public class * extends android.app.Activity {
    public *;
}
-keep public class * extends android.support.v4.app.Fragment
-keep public class * extends android.app.Fragment
-keep class com.tencent..** { *; }
-keep class com.alipay.** { *; }
-keep class com.baidu.** { *; }
-keep class com.baidu.poly3.** { *; }
-keep class com.bun.miitmdid.core.** { *; }
-keep class com.sdk.base.api.* { *; }
-keep class com.sdk.mobile.manager.** { *; }
-keep class com.sdk.base.framework.bean.* { *; }
-keep class com.sdk.base.module.config.* { *; }
-keep class com.sdk.base.module.manager.* { *; }
-keep class com.sdk.mobile.config.* { *; }
-dontwarn com.cmic.sso.sdk.**
-keep class com.cmic.sso.sdk.** { *; }
-keep class cn.com.chinatelecom.gateway.** { *; }
-dontnote com.baidu.sapi2.**
-dontwarn com.squareup.picasso.**
-dontwarn android.support.test.**
-dontwarn com.baidu.sapi2.**
-dontwarn com.alipay.**
-dontwarn com.baidu.sofire.**

# Yofun / MuMu
-keep class com.netease.yofun.external.** { *; }
-keep class com.netease.yofun.network.ServerUrl { *; }
-keep class com.netease.yofun.network.request.** { *; }
-keep class com.netease.yofun.network.annotation.** { *; }
-keep class com.netease.yofun.network.data.** { *; }
-keep class com.netease.yofun.wrapper.** { *; }
-keep class com.mumu.services.** { *; }
-dontwarn com.mumu.services.external.**

# MuMu payment dependencies
-keep class com.tencent.a.** { *; }
-keep class com.tencent.mm.** { *; }
-keep class com.tencent.wxop.** { *; }
-keep class com.tencent.mobileqq.openpay.** { *; }
-keep class com.alipay.android.app.IAlixPay { *; }
-keep class com.alipay.android.app.IAlixPay$Stub { *; }
-keep class com.alipay.android.app.IRemoteServiceCallback { *; }
-keep class com.alipay.android.app.IRemoteServiceCallback$Stub { *; }
-keep class com.alipay.sdk.app.PayTask { public *; }
-keep class com.alipay.sdk.app.AuthTask { public *; }
-keep class com.ta.** { *; }
-keep class com.ut.** { *; }
-dontwarn com.universal.sensorsdata.analytics.android.**
-keep class com.universal.sensorsdata.analytics.android.** { *; }
