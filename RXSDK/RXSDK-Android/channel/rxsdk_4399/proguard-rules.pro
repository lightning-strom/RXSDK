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

-dontwarn android.support.v4.**
-keep class android.support.v4.** { *; }
-keep public class * extends android.support.v4.**

-dontwarn cn.m4399.operate.**
-keep class cn.m4399.operate.** {*;}
-keepclassmembers class cn.m4399.operate.R$* {*;}
-keep class com.m4399.gamecenter.** {*;}

-dontwarn android.net.**
-keep class android.net.SSLCertificateSocketFactory{*;}
-keep class com.ishumei.** { *; }

-keep class cn.com.chinatelecom.account.** {*;}
-dontwarn com.unicom.xiaowo.account.shield.**
-keep class com.unicom.xiaowo.account.shield.**{*;}

-keeppackagenames com.tencent
-keep class com.tencent.** {*;}

-keep class com.alipay.** {*;}
-keep class org.json.alipay.** {*;}

-keepattributes InnerClasses
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions

#不混淆jni调用类
-keepclasseswithmembers class *{
    native <methods>;
}