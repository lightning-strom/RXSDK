package com.ruixue.sdk.bugly;

import android.content.Context;
import android.text.TextUtils;

import com.tencent.bugly.crashreport.BuglyLog;
import com.tencent.bugly.crashreport.CrashReport;

import java.lang.ref.WeakReference;


public class BuglyHelper {
    public static final int CRASHTYPE_JAVA_CRASH = 0; // Java crash
    public static final int CRASHTYPE_JAVA_CATCH = 1; // Java caught exception
    public static final int CRASHTYPE_NATIVE = 2; // Native crash
    public static final int CRASHTYPE_U3D = 3; // Unity error
    public static final int CRASHTYPE_ANR = 4; // ANR
    public static final int CRASHTYPE_COCOS2DX_JS = 5; // Cocos JS error
    public static final int CRASHTYPE_COCOS2DX_LUA = 6; // Cocos Lua error
    private static WeakReference<Context> contextWeak=null;

    public static void initBugly(Context context, String appid) {
        initBugly(context, appid, "", "");
    }

    /**
     * @param context
     * @param appid   注册时申请的APPID
     */
    public static void initBugly(Context context, String appid, String appVersion, String appChannel) {
        contextWeak = new WeakReference<>(context);
        // 获取当前包名
        String packageName = context.getPackageName();
        // 获取当前进程名
        String processName = AppUtils.getProcessName(android.os.Process.myPid());
        // 设置是否为上报进程
        CrashReport.UserStrategy strategy = new CrashReport.UserStrategy(context);
        strategy.setUploadProcess(processName == null || processName.equals(packageName));
        if (!TextUtils.isEmpty(appVersion)) {
            strategy.setAppVersion(appVersion);
        } else {
            strategy.setAppVersion(AppUtils.getVersionName(context) + "." + AppUtils.getVersionCode(context));
        }
        if (!TextUtils.isEmpty(appChannel)) {
            strategy.setAppChannel(appChannel);
        }

        strategy.setAppPackageName(packageName);
//
//        设置设备id
//        strategy.setDeviceID("");
//        strategy.setCrashHandleCallback(new CrashReport.CrashHandleCallback() {
//            /**
//             * Crash处理.
//             *
//             * @param crashType 错误类型：CRASHTYPE_JAVA，CRASHTYPE_NATIVE，CRASHTYPE_U3D ,CRASHTYPE_ANR
//             * @param errorType 错误的类型名
//             * @param errorMessage 错误的消息
//             * @param errorStack 错误的堆栈
//             * @return 返回额外的自定义信息上报
//             */
//            public Map<String, String> onCrashHandleStart(int crashType, String errorType, String errorMessage, String errorStack) {
//                LinkedHashMap<String, String> map = new LinkedHashMap<String, String>();
//                map.put("AppName", AppUtils.getAppName(context));
//                return map;
//            }
//
//            /**
//             * Crash处理.
//             *
//             * @param crashType 错误类型：CRASHTYPE_JAVA，CRASHTYPE_NATIVE，CRASHTYPE_U3D ,CRASHTYPE_ANR
//             * @param errorType 错误的类型名
//             * @param errorMessage 错误的消息
//             * @param errorStack 错误的堆栈
//             * @return byte[] 额外的2进制内容进行上报
//             */
//            @Override
//            public byte[] onCrashHandleStart2GetExtraDatas(int crashType, String errorType, String errorMessage, String errorStack) {
//                try {
//                    return "Extra data.".getBytes("UTF-8");
//                } catch (Exception e) {
//                    return null;
//                }
//            }
//
//        });

        CrashReport.initCrashReport(context, appid, BuildConfig.DEBUG, strategy);
    }

    /**
     * @param appVersion 设置app版本
     */
    public static void setAppVersion(String appVersion) {
        if (null!=contextWeak) {
            CrashReport.setAppVersion(contextWeak.get(), appVersion);
        }
    }

    /**
     * @param appChannel 设置渠道
     */
    public static void setAppChannel(String appChannel) {
        if (null!=contextWeak) {
            CrashReport.setAppChannel(contextWeak.get(), appChannel);
        }
    }
    /**
     * @param userId 设置用户id
     */
    public static void setUserId(String userId) {
        CrashReport.setUserId(userId);
    }

    /**
     * 上报后的Crash会显示该标签
     *
     * @param tag 分类标签
     */
    public static void setUserSceneTag(int tag) {
        if (null != contextWeak)
            CrashReport.setUserSceneTag(contextWeak.get(), tag);
    }

    /**
     * 测试异常上报可用性，在bugly 后台错误分享出查看是否有错误消息上报
     * 显示内容为：this is a test exception msg
     */
    public static void test() {
        postCatchedException(new Exception("this is a test exception msg"));
    }

    //使用BuglyLog接口时，为了减少磁盘IO次数，我们会先将日志缓存在内存中。当缓存大于一定阈值（默认10K），会将它持久化至文件。您可以通过setCache(int byteSize)接口设置缓存大小，范围为0-30K。例：BuglyLog.setCache(12 * 1024) //将Cache设置为12K
    //如果您没有使用BuglyLog接口，且初始化Bugly时isDebug参数设置为false，该Log功能将不会有新的资源占用；
    //为了方便开发者调试，当初始化Bugly的isDebug参数为true时，异常日志同时还会记录Bugly本身的日志。请在App发布时将其设置为false；
    //上报Log最大30K。
    public static void log(String tag, String log) {
        BuglyLog.d(tag, log);
    }


    public static void setDeviceId(String deviceId) {
        if (null != contextWeak)
            CrashReport.setDeviceId(contextWeak.get(), deviceId);
    }

    //    public static void postCatchedException(String error) {
//        postCatchedException(new Exception(error));
//    }
    public static void postCatchedException(Throwable thr) {
        CrashReport.postCatchedException(thr);
    }


    //自定义Map参数可以保存发生Crash时的一些自定义的环境信息。在发生Crash时会随着异常信息一起上报并在页面展示。
    public static void putUserData(String key, String value) {
        if (null != contextWeak)
            CrashReport.putUserData(contextWeak.get(), key, value);
    }

    public static void setIsDevelopmentDevice(boolean develop) {
        if (null != contextWeak)
            CrashReport.setIsDevelopmentDevice(contextWeak.get(), develop);
    }


}
