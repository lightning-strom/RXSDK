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

###############################push sdk 混淆#######################
-keep public class * extends android.app.Service
-keep class com.heytap.msp.** { *;}
###############################云控混淆#######################
#-keep @com.heytap.baselib.database.annotation.DbEntity class * {*;}
#-keepclassmembers class * {
#    @com.oplus.nearx.cloudconfig.anotation.FieldIndex  *;
#}
#-keep @androidx.anntotation.Keep class **
################################httpdns混淆#######################
#-keep,allowobfuscation @interface androidx.annotation.Keep
#-keep @androidx.annotation.Keep class *
#-keepclassmembers class * {
#@androidx.annotation.Keep *;
#}
## JSR 305 annotations are for embedding nullability information.
#-dontwarn javax.annotation.**
## Animal Sniffer compileOnly dependency to ensure APIs are compatible with older versions of Java.
#-dontwarn org.codehaus.mojo.animal_sniffer.*
## database
#-keep @com.heytap.baselib.database.annotation.DbEntity class * {*;}
###############################白盒加密#######################
-keep class com.heytap.omas.** { *;}