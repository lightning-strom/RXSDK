-keep class com.vgamepop.** { *; }

# Gson 反序列化 ApkpureOrderData：避免 R8 抹去 ExtBean 字段名导致 ext 反序列化失败
-keepattributes Signature
-keepattributes *Annotation*
-keep class com.ruixue.sdk.apkpure.ApkpureOrderData { *; }
-keep class com.ruixue.sdk.apkpure.ApkpureOrderData$ExtBean { *; }
