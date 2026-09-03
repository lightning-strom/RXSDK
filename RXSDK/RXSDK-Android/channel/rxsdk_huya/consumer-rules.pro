# 虎牙联运（rxsdk_huya）consumer ProGuard / R8 规则
# 通过 build.gradle 的 consumerProguardFiles 透传给宿主；Berry AAR 内置 proguard.txt 也会一并合并。

# ---------- 瑞雪渠道入口（反射 Class.forName 加载） ----------
-keep class com.ruixue.openapi.RXSdkApiImpl { *; }
-keep class com.ruixue.sdk.HuyaSdkApiImpl { *; }
-keep class com.ruixue.sdk.HuyaSdkApiImpl$* { *; }
-keep class com.ruixue.sdk.HuyaSdkHelper { *; }
-keep class com.ruixue.sdk.HuyaSdkHelper$* { *; }
-keep class com.ruixue.sdk.HuyaBillingImpl { *; }
-keep class com.ruixue.sdk.HuyaOrderData { *; }
-keep class com.ruixue.sdk.HuyaOrderData$* { *; }

# ---------- Berry / 虎牙 SDK ----------
-keep class com.huya.** { *; }
-keep interface com.huya.** { *; }
-keep class com.huyaudb.** { *; }
-keep class com.huyaudbunify.** { *; }
-keep class com.duowan.** { *; }
-keep interface com.duowan.** { *; }
-dontwarn com.huya.**
-dontwarn com.huyaudb.**
-dontwarn com.huyaudbunify.**
-dontwarn com.duowan.**

# ---------- 联运文档透传依赖（登录/图片/网络） ----------
-keep class com.nostra13.universalimageloader.** { *; }
-dontwarn com.nostra13.universalimageloader.**

-keep public class * implements com.bumptech.glide.module.GlideModule
-keep class com.bumptech.glide.** { *; }
-dontwarn com.bumptech.glide.**

-keep class com.alibaba.fastjson.** { *; }
-dontwarn com.alibaba.fastjson.**

-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-keep class okio.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**

-keep class com.google.gson.** { *; }
-dontwarn com.google.gson.**

# 字节跳动监测（RangersAppLog / AppConvert）
-keep class com.bytedance.** { *; }
-dontwarn com.bytedance.**

# WebView JS Bridge / 注解
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
