# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in E:\developSoftware\Android\SDK/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Proguard Cocos2d-x for release
-keep public class org.cocos2dx.** { *; }
-dontwarn org.cocos2dx.**
-keep public class com.chukong.** { *; }
-dontwarn com.chukong.**
-keep public class com.huawei.android.** { *; }
-dontwarn com.huawei.android.**

# GDT 转化归因
-keep class com.ruixue.sdk.gdt.GDTSdkWrapper { public *; }
-dontwarn com.qq.gdt.action.**
-keep class com.qq.gdt.action.** { *; }
-keepclassmembers class com.qq.gdt.action.** { *; }
-keep public class com.tencent.turingfd.sdk.**
-keep class com.**.TNative$aa { public *; }
-keep class com.**.TNative$aa$bb { public *; }
-keep class com.**.TNative$bb { *; }
-keep class com.**.TNative$bb$I { *; }
-keepclasseswithmembers class * {
    native <methods>;
}

# Proguard Apache HTTP for release
-keep class org.apache.http.** { *; }
-dontwarn org.apache.http.**

# Proguard Android Webivew for release. uncomment if you are using a webview in cocos2d-x
#-keep public class android.net.http.SslError
#-keep public class android.webkit.WebViewClient

#-dontwarn android.webkit.WebView
#-dontwarn android.net.http.SslError
#-dontwarn android.webkit.WebViewClient

# Baidu channel
-keep class org.json.alipay.** { *; }
-keepclassmembers public class * extends android.app.Activity {
    public *;
}
-keep public class * extends android.support.v4.app.Fragment
-keep public class * extends android.app.Fragment
-keep class com.tencent..** { *; }
-keep class com.alipay.** { *; }
-keep class com.baidu.** { *; }
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
-keep class com.baidu.poly3.** { *; }
-dontnote com.baidu.sapi2.**
-dontwarn com.squareup.picasso.**
-dontwarn android.support.test.**
-dontwarn com.baidu.sapi2.**
-dontwarn com.alipay.**