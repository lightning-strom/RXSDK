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

#该代码混淆文件为YSDK对外提供个游戏开发者集成YSDK时使用
-optimizationpasses 5                   # 指定代码的压缩级别
-dontusemixedcaseclassnames             # 指定代码的压缩级别
-dontskipnonpubliclibraryclasses        # 是否混淆第三方jar
-dontpreverify                          # 混淆时是否做预校验
-dontoptimize
-ignorewarnings                          # 忽略警告，避免打包时某些警告出现
-verbose                                # 混淆时是否记录日志
-optimizations !code/simplification/arithmetic,!field/*,!class/merging/*    # 混淆时所采用的算法

-dontwarn com.tencent.**
-keep class android.support.** {*;}
-keep class com.tencent.** {*;}
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider
-keep public class * extends android.app.backup.BackupAgentHelper
-keep public class * extends android.preference.Preference
-keep public class com.android.vending.licensing.ILicensingService
-keep class * extends android.app.Dialog {*;}
-keepclasseswithmembernames class * {
    native <methods>;
}

-keepclasseswithmembernames class * {
    public <init>(android.content.Context, android.util.AttributeSet);
}

-keepclasseswithmembernames class * {
    public <init>(android.content.Context, android.util.AttributeSet, int);
}


-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

-keep class * implements android.os.Parcelable {
  public static final android.os.Parcelable$Creator *;
}

-keepattributes InnerClasses
-keep class android.os.**{*;}
-keep class org.apache.http.** { * ;}
-keep class com.qq.jce.**{*;}
-keep class com.qq.taf.**{*;}
-keep class common.**{*;}
-keep class exceptionupload.**{*;}
-keep class mqq.**{*;}
-keep class qimei.**{*;}
-keep class strategy.**{*;}
-keep class userinfo.**{*;}
-keep class com.pay.**{*;}
-keep class com.demon.plugin.**{*;}
-keep class oicq.wlogin_sdk.**{*;}
-keep class com.alipay.sdk.**{*;}
-keep class com.migu.sdk.**{*;}
-keep class com.alipay.sdk.*
-keep class com.migu.sdk.*
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep class com.qq.taf.jce.**{*;}


-keepclasseswithmembernames class * {
    native <methods>;
}

-dontwarn java.nio.file.Files
-dontwarn java.nio.file.Path
-dontwarn java.nio.file.OpenOption
-dontwarn org.codehaus.mojo.animal_sniffer.IgnoreJRERequirement

-keep class com.alipay.sdk.app.AuthTask {*;}
-keep class com.alipay.sdk.app.PayTask {*;}

-dontwarn com.tencent.**
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep class com.qq.** {*;}

# 设备指纹SDK
-keep public class qfc.**{*;}
-keep class com.bun.miitmdid.** {*;}
# oaid
-keep class com.tencent.qmsp.oaid2.** { *; }


#微信混淆规则
-keep class com.tencent.mm.opensdk.** {
    *;
}

-keep class com.tencent.wxop.** {
    *;
}

-keep class com.tencent.mm.sdk.** {
    *;
}

#okhttp混淆规则
-keepattributes Signature
-keepattributes *Annotation*
-keep class okhttp3.midas.** { *; }
-keep interface okhttp3.midas.** { *; }
-dontwarn okhttp3.midas.**