package com.ruixue.utils;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.ActivityManager;
import android.app.AlarmManager;
import android.app.Application;
import android.app.PendingIntent;
import android.app.UiModeManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Insets;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.view.DisplayCutout;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowManager;
import android.view.WindowMetrics;

import androidx.annotation.DimenRes;
import androidx.annotation.RequiresApi;
import androidx.core.view.WindowInsetsCompat;

import com.ruixue.logger.RXLogger;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@SuppressWarnings("deprecation")
public class AppUtils {

    private static final String TAG = AppUtils.class.getSimpleName();

    public static boolean isDarkMode(Context context) {
        UiModeManager uiModeManager = (UiModeManager) context.getSystemService(Context.UI_MODE_SERVICE);
        int mode = uiModeManager.getNightMode();
        return mode == UiModeManager.MODE_NIGHT_YES;
    }

    @RequiresApi(api = Build.VERSION_CODES.R)
    public static int getNavigationBarHeightWithInsets(Activity activity) {
        View decorView = activity.getWindow().getDecorView();
        WindowInsets insets = decorView.getRootWindowInsets();
        if (insets != null) {
            Insets navBarInsets = insets.getInsets(WindowInsets.Type.navigationBars());
            return navBarInsets.bottom; // 返回导航栏底部高度（像素）
        }
        return 0;
    }

    public static int getNavigationBarHeight(Context context) {
        Resources resources = context.getResources();
        @SuppressLint({"DiscouragedApi", "InternalInsetResource"}) int resourceId = resources.getIdentifier("navigation_bar_height", "dimen", "android");
        if (resourceId > 0) {
            return resources.getDimensionPixelSize(resourceId); // 返回导航栏高度（像素）
        }
        return 0;
    }


    public static boolean isUsePortMatch(Context context) {
        Configuration configuration = context.getResources().getConfiguration();
        boolean isPortrait = configuration.orientation == Configuration.ORIENTATION_PORTRAIT;
        int screenSize = configuration.screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK;
        return isPortrait && screenSize < Configuration.SCREENLAYOUT_SIZE_LARGE;
    }

    public static boolean isPortrait(Context context) {
        Configuration configuration = context.getResources().getConfiguration();
        return configuration.orientation == Configuration.ORIENTATION_PORTRAIT;
    }

    public static DisplayCutout getDisplayCutout(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P && context instanceof Activity) {
            final View decorView = ((Activity) context).getWindow().getDecorView();
            WindowInsets insets = decorView.getRootWindowInsets();
            if (insets != null) {
                return decorView.getRootWindowInsets().getDisplayCutout();
            }
        }
        return null;
    }

    public static int getHorDisplayCutout(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P && context instanceof Activity) {
            final View decorView = ((Activity) context).getWindow().getDecorView();
            WindowInsets insets = decorView.getRootWindowInsets();
            if (insets != null && insets.getDisplayCutout() != null) {
                DisplayCutout displayCutout = insets.getDisplayCutout();

                return Math.max(displayCutout.getSafeInsetLeft(), displayCutout.getSafeInsetRight());
            }
        }
        return 0;
    }

    public static int getTopDisplayCutout(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P && context instanceof Activity) {
            final View decorView = ((Activity) context).getWindow().getDecorView();
            WindowInsets insets = decorView.getRootWindowInsets();
            if (insets != null && insets.getDisplayCutout() != null) {
                DisplayCutout displayCutout = insets.getDisplayCutout();
                return displayCutout.getSafeInsetTop();
            }
        }
        return 0;
    }

    public static int dp2px(Context context, float dipValue) {
        try {
            final float scale = context.getResources().getDisplayMetrics().density;
            return (int) (dipValue * scale + 0.5f);
        } catch (Exception e) {
            return (int) dipValue;
        }
    }

    public static int px2dp(Context context, float px) {
        try {
            final float scale = context.getResources().getDisplayMetrics().density;
            return (int) (px / scale + 0.5f);
        } catch (Exception e) {
            return (int) px;
        }
    }

    public static float getDimensionDp(Context context, @DimenRes int id) {
        float tmp = context.getResources().getDimension(id);
        final float density = context.getResources().getDisplayMetrics().density;
        return tmp / density;
    }

    public static int getRealScreenHeight(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            WindowManager windowManager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
            WindowMetrics windowMetrics = windowManager.getCurrentWindowMetrics();
            return windowMetrics.getBounds().height();
        } else {
            DisplayMetrics displayMetrics = new DisplayMetrics();
            WindowManager windowManager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
            windowManager.getDefaultDisplay().getRealMetrics(displayMetrics);
            return displayMetrics.heightPixels;
        }
    }

    //获取状态栏高度 px
    public static int getStatusBarHeight() {
        int result = 0;
        @SuppressLint("InternalInsetResource") int resourceId = Resources.getSystem().getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            result = Resources.getSystem().getDimensionPixelSize(resourceId);
        }
        return result;
    }

    //获取导航栏高度px
    public static int getNavigationBarHeight() {
        int result = 0;
        @SuppressLint("InternalInsetResource") int resourceId = Resources.getSystem().getIdentifier("navigation_bar_height", "dimen", "android");
        if (resourceId > 0) {
            result = Resources.getSystem().getDimensionPixelSize(resourceId);
        }
        return result;
    }

    /**
     * 重启APP
     */
    public static void restartApp(Activity activity) {
        if (activity != null) {
            new Thread() {
                public void run() {
                    Intent launch = activity.getBaseContext().getPackageManager().getLaunchIntentForPackage(activity.getBaseContext().getPackageName());
                    launch.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                    activity.startActivity(launch);
                    android.os.Process.killProcess(android.os.Process.myPid());
                }
            }.start();
            activity.finish();
        }
    }



    /**
     * @param context     context
     * @param delayMillis 延迟启动毫秒数
     */
    public static void restartApp(Context context, long delayMillis) {
        Intent intent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
        @SuppressLint("UnspecifiedImmutableFlag") PendingIntent restartIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_ONE_SHOT);
        AlarmManager mgr = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        mgr.set(AlarmManager.RTC, System.currentTimeMillis() + delayMillis, restartIntent); // x毫秒钟后重启应用
        System.exit(0);
    }

    public static boolean startApp(Context context, String url) {
        if (context != null && !TextUtils.isEmpty(url)) {
            try {
                Intent intent = url.startsWith("intent://") ? Intent.parseUri(url, Intent.URI_INTENT_SCHEME) : new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                if (!(context instanceof Activity)) {
                    intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
                }
                context.startActivity(intent);
                return true;
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
        } else {
            return false;
        }
    }


    /**
     * 启动到应用商店app详情界面
     * @param appPkg    目标App的包名
     * @param marketPkg 应用商店包名 ,如果为""则由系统弹出应用商店列表供用户选择,否则调转到目标市场的应用详情界面，某些应用商店可能会失败
     */
    public static boolean launchAppDetail(Context context, String appPkg, String marketPkg) {
        try {
            if (TextUtils.isEmpty(appPkg))
                return false;
            Uri uri = Uri.parse("market://details?id=" + appPkg);
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            if (!TextUtils.isEmpty(marketPkg)) {
                intent.setPackage(marketPkg);
            }
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public static long getPackageVersionCode(Context context, String packageName) {
        long versionCode = -1;
        try {
            PackageInfo info = context.getPackageManager().getPackageInfo(packageName, PackageManager.GET_META_DATA);
            if (info != null) {
                versionCode = Build.VERSION.SDK_INT >= Build.VERSION_CODES.P ? info.getLongVersionCode() : info.versionCode;
            }
        } catch (PackageManager.NameNotFoundException e) {
        }
        return versionCode;
    }


    public static boolean isAppInstalled(Context context, Uri uri) {
        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        @SuppressLint("QueryPermissionsNeeded") ComponentName componentName = intent.resolveActivity(context.getPackageManager());
        return componentName != null;
    }

    public static boolean isAppInstalled(Context context, String packageName) {
        PackageManager pm = context.getPackageManager();
        boolean installed;
        try {
            pm.getPackageInfo(packageName, PackageManager.GET_ACTIVITIES);
            installed = true;
        } catch (PackageManager.NameNotFoundException e) {
            installed = false;
        }
        return installed;
    }

    /**
     * 获取进程号对应的进程名
     * @param pid 进程号
     * @return 进程名
     */
    public static String getProcessName(int pid) {
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader("/proc/" + pid + "/cmdline"));
            String processName = reader.readLine();
            if (!TextUtils.isEmpty(processName)) {
                processName = processName.trim();
            }
            return processName;
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        } finally {
            try {
                if (reader != null) {
                    reader.close();
                }
            } catch (IOException exception) {
                exception.printStackTrace();
            }
        }
        return null;
    }

    public static String getProcessName(Context context) {
        int pid = android.os.Process.myPid();
        ActivityManager mActivityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningAppProcessInfo appProcess : mActivityManager.getRunningAppProcesses()) {
            if (appProcess.pid == pid) {
                return appProcess.processName;
            }
        }
        return null;
    }

    /**
     * 获取应用显示程序名称
     */
    public static synchronized String getAppName(Context context) {
        try {
            PackageManager packageManager = context.getPackageManager();
            PackageInfo packageInfo = packageManager.getPackageInfo(context.getPackageName(), 0);
            int labelRes = packageInfo.applicationInfo.labelRes;
            return context.getResources().getString(labelRes);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * [获取应用程序版本名称信息]
     * @param context
     * @return 当前应用的版本名称
     */

    public static synchronized String getVersionName(Context context) {
        try {
            PackageManager packageManager = context.getPackageManager();
            PackageInfo packageInfo = packageManager.getPackageInfo(context.getPackageName(), 0);
            return packageInfo.versionName;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


    /**
     * @param context
     * @return 当前应用的版本Code
     */
    public static synchronized int getVersionCode(Context context) {
        try {
            PackageManager packageManager = context.getPackageManager();
            PackageInfo packageInfo = packageManager.getPackageInfo(context.getPackageName(), 0);
            return packageInfo.versionCode;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    /**
     * @param context
     * @return 当前应用的包名称
     */

    public static synchronized String getPackageName(Context context) {
        try {
            PackageManager packageManager = context.getPackageManager();
            PackageInfo packageInfo = packageManager.getPackageInfo(context.getPackageName(), 0);
            return packageInfo.packageName;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


    /**
     * 获取application层级的metadata
     * @param context context
     * @param key     key
     * @return value
     */
    public static String getAppMetaData(Context context, String key) {
        try {
            Object metaObj = context.getPackageManager().getApplicationInfo(context.getPackageName(), PackageManager.GET_META_DATA).metaData.get(key);
            if (metaObj instanceof String) {
                return metaObj.toString();
            } else if (metaObj != null) {
                return String.valueOf(metaObj);
            }
        } catch (PackageManager.NameNotFoundException e) {
            RXLogger.i(e.getMessage());
        }
        return "";
    }

    public static Map<String, Object> getMetaDataByPrefix(Context context, String prefix) {
        Map<String, Object> result = new HashMap<>();
        try {
            ApplicationInfo appInfo = context.getPackageManager().getApplicationInfo(context.getPackageName(), PackageManager.GET_META_DATA);
            if (appInfo.metaData != null) {
                for (String key : appInfo.metaData.keySet()) {
                    if (key != null && key.startsWith(prefix)) {
                        String strippedKey = key.substring(prefix.length());
                        Object value = appInfo.metaData.get(key);
                        result.put(strippedKey, value);
                    }
                }
            }
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return result;
    }

    public static Application getApplicationByReflect() {
        try {
            @SuppressLint("PrivateApi") Class<?> activityThread = Class.forName("android.app.ActivityThread");
            Object thread = activityThread.getMethod("currentActivityThread").invoke(null);
            Object app = activityThread.getMethod("getApplication").invoke(thread);
            if (app == null) {
                throw new NullPointerException("you should init first");
            }
            return (Application) app;
        } catch (Exception e) {
            e.printStackTrace();
        }
        throw new NullPointerException("you should init first");
    }

    /**
     * 判断当前是否有网络连接,但是如果该连接的网络无法上网，也会返回true
     * @param context
     * @return
     */
    public static boolean isNetConnection(Context context) {
        if (context != null) {
            ConnectivityManager connectivityManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
            NetworkInfo networkInfo = connectivityManager.getActiveNetworkInfo();
            boolean connected = networkInfo.isConnected();
            if (networkInfo != null && connected) {
                if (networkInfo.getState() == NetworkInfo.State.CONNECTED) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        return false;
    }

    /**
     * 判断当前网络是否可用(6.0以上版本)
     * 实时
     * @param context
     * @return
     */
    public static boolean isNetSystemUsable(Context context) {
        boolean isNetUsable = false;
        ConnectivityManager manager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            NetworkCapabilities networkCapabilities = manager.getNetworkCapabilities(manager.getActiveNetwork());
            if (networkCapabilities != null) {
                isNetUsable = networkCapabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED);
            }
        } else {
            isNetUsable = isNetConnection(context);
        }
        return isNetUsable;
    }
}
