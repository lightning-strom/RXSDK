package com.haiqi.rxsdk_install_appinfo;

import static android.content.Context.MODE_PRIVATE;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.util.Log;

import com.google.gson.Gson;
import com.ruixue.openapi.RXSdkApi;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/3/21
 */
public class InstalledAppsFinder {
    private static final String TAG = "InstalledAppsFinder";


    private static boolean filter(String pakage) {
        List<String> systemAppList = new ArrayList<>();
        systemAppList.add("com.android");

        for (String item: systemAppList) {
            if (pakage.startsWith(item)) {
                return true;
            }
        }
        return false;
    }

    public static void findInstalledApps(Context context, int ts, List<String> info) {

        if (context == null || info == null || info.isEmpty()) {
            return;
        }

        SharedPreferences sharedPreferences =
                context.getSharedPreferences("appinfo_track", MODE_PRIVATE);

        long last_ts = sharedPreferences.getLong("app_track_ts", 0);

        long timestampInSeconds = System.currentTimeMillis()/1000;

        if (timestampInSeconds - last_ts < ts) {
            Log.d(TAG, "距离上次上报时间太短");
            return;
        }

        List<TrackAppInfo> trackAppInfoList = new ArrayList<>();

        PackageManager packageManager = context.getPackageManager();
        List<ApplicationInfo> apps = packageManager.getInstalledApplications(PackageManager.GET_META_DATA);
        List<PackageInfo> packageInfos = packageManager.getInstalledPackages(0);

        for (ApplicationInfo appInfo : apps) {
            String packageName = appInfo.packageName;
            if (packageName != null && !filter(packageName)) {
                String appName = packageManager.getApplicationLabel(appInfo).toString();
                TrackAppInfo trackAppInfo = new TrackAppInfo();
                if (info.contains("rx_app_name")) {
                    trackAppInfo.rx_app_name = appName;
                }
                if (info.contains("rx_package_id")) {
                    trackAppInfo.rx_package_id = packageName;
                }
                if (info.contains("rx_version")) {
                    trackAppInfo.rx_version = getAppVersion(packageName, packageInfos);
                }
                trackAppInfoList.add(trackAppInfo);

//                Log.d(TAG, "过滤出来的包数：" + trackAppInfoList.size());

            }
        }

        String trackJson = new Gson().toJson(trackAppInfoList);

        Map<String, Object> map = new HashMap<>();
        map.put("lists", trackJson);

        RXSdkApi.getInstance().dataTrack("#device_applist", "", map);

        // 将当前时间存放在本地
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putLong("app_track_ts", timestampInSeconds);
        editor.apply();
    }

    private static String getAppVersion(String packageName, List<PackageInfo> packageInfos)
    {
        if (packageInfos != null && !packageInfos.isEmpty() && packageName != null) {
            for (PackageInfo appInfo : packageInfos) {
                if (packageName.equals(appInfo.packageName)) {
                    return appInfo.versionName;
                }
            }
        }
        return "";
    }


    static class TrackAppInfo {
        public String rx_app_name;
        public String rx_package_id;
        public String rx_version;
    }

}
