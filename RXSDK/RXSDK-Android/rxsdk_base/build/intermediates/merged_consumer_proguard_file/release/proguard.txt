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


#-keep class com.ruixue.openapi.** { *; }
-keep class com.ruixue.entity.** { *; }
-keep public class com.ruixue.** {
    public protected *;
}

-keep class * implements android.os.Parcelable {*;}
-keepnames class * implements java.io.Serializable
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider
-keep public class * extends android.preference.Preference
-keepclasseswithmembernames class * {
# 保持native方法不被混淆
 native <methods>;
}
# 保留枚举类不被混淆
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}
# 抛出异常时保留代码行号
-keepattributes SourceFile,LineNumberTable

-keep class com.ruixue.oaid.aidl.com.uodis.opendevice.aidl.** { *; }
-keep interface com.ruixue.oaid.aidl.com.uodis.opendevice.aidl.** { *; }
-keep class com.ruixue.oaid.aidl.com.asus.msa.SupplementaryDID.** { *; }
-keep interface com.ruixue.oaid.aidl.com.asus.msa.SupplementaryDID.** { *; }
-keep class com.ruixue.oaid.aidl.com.bun.lib.** { *; }
-keep interface com.ruixue.oaid.aidl.com.bun.lib.** { *; }
-keep class com.ruixue.oaid.aidl.com.heytap.openid.** { *; }
-keep interface com.ruixue.oaid.aidl.com.heytap.openid.** { *; }
-keep class com.ruixue.oaid.aidl.com.samsung.android.deviceidservice.** { *; }
-keep interface com.ruixue.oaid.aidl.com.samsung.android.deviceidservice.** { *; }
-keep class com.ruixue.oaid.aidl.com.zui.deviceidservice.** { *; }
-keep interface com.ruixue.oaid.aidl.com.zui.deviceidservice.** { *; }
-keep class com.ruixue.oaid.aidl.com.coolpad.deviceidsupport.** { *; }
-keep interface com.ruixue.oaid.aidl.com.coolpad.deviceidsupport.** { *; }
-keep class com.ruixue.oaid.aidl.com.android.creator.** { *; }
-keep interface com.ruixue.oaid.aidl.com.android.creator.** { *; }
-keep class com.ruixue.oaid.aidl.com.google.android.gms.ads.identifier.internal.** { *; }
-keep interface com.ruixue.oaid.aidl.com.google.android.gms.ads.identifier.internal.* { *; }