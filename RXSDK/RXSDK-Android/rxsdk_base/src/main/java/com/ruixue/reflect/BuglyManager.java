package com.ruixue.reflect;

import android.content.Context;

import java.lang.reflect.Method;

public class BuglyManager extends BaseReflectClass {
    private static final String PLUGIN_NAME = "RX_PLUGIN_BUGLY";
    private static Class<?>pluginClass = null;
    /**
     * 初始化bugly插件
     * @param context 应用上下文
     * @param appid bugly申请的appid
     * @param appVersion app版本
     * @param appChannel app渠道
     * @return 是否初始化成功
     */
    public static boolean initBugly(Context context, String appid,String appVersion,String appChannel) {
        final String packageClassName = getMetaDataVal(context, PLUGIN_NAME);
        pluginClass = getClass(packageClassName);
        if (pluginClass != null) {
            try {
                Method method = pluginClass.getMethod("initBugly", Context.class, String.class, String.class, String.class);
                method.invoke(null, context, appid,appVersion,appChannel);
                return true;
            } catch (Exception e) {
               printStackTrack(e);
            }
        }
        return false;
    }

    /**
     * 初始化bugly插件
     * @param context 应用上下文
     * @param appid bugly申请的appid
     * @return 是否初始化成功
     */
    public static boolean initBugly(Context context, String appid) {
        return  initBugly(context,appid,"","");
    }

    /**
     * @param userId 设置用户id
     */
    public static void setUserId(String userId) {
        if (pluginClass != null) {
            try {
                Method method = pluginClass.getMethod("setUserId", String.class);
                method.invoke(null, userId);
            } catch (Exception e) {
               printStackTrack(e);
            }
        }
    }

    /**
     * 上报后的Crash会显示该标签
     *
     * @param tag 分类标签
     */
    public static void setUserSceneTag(int tag) {
        if (pluginClass != null) {
            try {
                Method method = pluginClass.getMethod("setUserSceneTag", int.class);
                method.invoke(null, tag);
            } catch (Exception e) {
               printStackTrack(e);
            }
        }
    }

    /**
     * 测试异常上报可用性，在bugly 后台错误分享出查看是否有错误消息上报
     * 显示内容为：this is a test exception msg
     */
    public static void test() {
        if (pluginClass != null) {
            try {
                Method method = pluginClass.getMethod("test");
                method.invoke(null);
            } catch (Exception e) {
               printStackTrack(e);
            }
        }
    }

    //使用BuglyLog接口时，为了减少磁盘IO次数，我们会先将日志缓存在内存中。当缓存大于一定阈值（默认10K），会将它持久化至文件。您可以通过setCache(int byteSize)接口设置缓存大小，范围为0-30K。例：BuglyLog.setCache(12 * 1024) //将Cache设置为12K
    //如果您没有使用BuglyLog接口，且初始化Bugly时isDebug参数设置为false，该Log功能将不会有新的资源占用；
    //为了方便开发者调试，当初始化Bugly的isDebug参数为true时，异常日志同时还会记录Bugly本身的日志。请在App发布时将其设置为false；
    //上报Log最大30K。
    public static void log(String tag, String log) {
        if (pluginClass != null) {
            try {
                Method method = pluginClass.getMethod("log", String.class, String.class);
                method.invoke(null, tag, log);
            } catch (Exception e) {
               printStackTrack(e);
            }
        }
    }

    public static void setDeviceId(String deviceId) {
        if (pluginClass != null) {
            try {
                Method method = pluginClass.getMethod("setDeviceId", String.class);
                method.invoke(null, deviceId);
            } catch (Exception e) {
               printStackTrack(e);
            }
        }
    }

    public static void postCatchedException(Throwable thr) {
        if (pluginClass != null) {
            try {
                Method method = pluginClass.getMethod("postCatchedException", Throwable.class);
                method.invoke(null, thr);
            } catch (Exception e) {
               printStackTrack(e);
            }
        }
    }


}
