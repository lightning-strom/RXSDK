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

-keep class XI.**{*;}
-keep class com.bun.** {*;}
-keep class com.asus.** {*;}
-keep class com.heytap.** {*;}
-keep class com.huawei.** {*;}
-keep class com.meizu.** {*;}
-keep class com.samsung.** {*;}
-keep class com.zui.** {*;}
-keep class com.netease.** {*;}
-keep interface com.huawei.** {*;}
-keepattributes *Annotation*
-keep @android.support.annotation.Keep class **{
@android.support.annotation.Keep <fields>;
@android.support.annotation.Keep <methods>;
}
-keep class org.json.**{*;}
#微信混淆文件
-keep class com.tencent.mm.opensdk.** {*;}
-keep class com.tencent.wxop.** {*;}
-keep class com.tencent.mm.sdk.** {*;}