# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

-keep class org.json.alipay.** { *; }
-keepclassmembers public class * extends android.app.Activity {
 public *;
}
-keep public class * extends android.support.v4.app.Fragment
-keep public class * extends android.app.Fragment
# ⽀付第三⽅SDK
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
-keep class com.sdk.base.api.* {*;}
-keep class com.sdk.mobile.manager.** {*;}
-keep class com.sdk.base.framework.bean.* {*;}
-keep class com.sdk.base.module.config.* {*;}
-keep class com.sdk.base.module.manager.* {*;}
-keep class com.sdk.mobile.config.* {*;}
# 移动
-dontwarn com.cmic.sso.sdk.**
-keep class com.cmic.sso.sdk.**{*;}
# 电信#
-keep class cn.com.chinatelecom.gateway.**{*;}
# 收银台
-keep class com.baidu.poly3.**{*;}
-dontnote com.baidu.sapi2.**
-dontwarn com.squareup.picasso.**
-dontwarn android.support.test.**
-dontwarn com.baidu.sapi2.**
-dontwarn com.alipay.**