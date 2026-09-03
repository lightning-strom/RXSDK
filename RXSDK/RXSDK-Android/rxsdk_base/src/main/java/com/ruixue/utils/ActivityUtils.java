package com.ruixue.utils;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class ActivityUtils {

    public static boolean startActivityByClass(Context context, String className) {
        return startActivityByClass(context, className, (Bundle) null);
    }

    public static boolean startActivityByClass(Context context, String className, Bundle bundle) {
        try {
            Class<?> clz = Class.forName(className);
            Intent it = new Intent(context, clz);
            if (null != bundle) {
                it.putExtras(bundle);
            }
            context.startActivity(it);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            Log.e("error", e.toString());
            Toast.makeText(context, "打开失败，请查看日志!", Toast.LENGTH_LONG).show();
            return false;
        }
    }

    public static Bundle toBundle(Map<String, Object> extra) {
        if (null == extra) {
            return null;
        }
        Bundle bundle = new Bundle();
        for (Map.Entry<String, Object> entry : extra.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            if (value instanceof Integer) {
                bundle.putInt(String.valueOf(key), (Integer) value);
            } else if (value instanceof Boolean) {
                bundle.putBoolean(String.valueOf(key), (Boolean) value);
            } else {
                bundle.putString(String.valueOf(key), String.valueOf(value));
            }
        }
        return bundle;
    }

    public static boolean startActivityByClass(Context context, String className, Map<String, Object> extra) {
        return startActivityByClass(context, className, toBundle(extra));
    }


    public static boolean startLaunchActivity(Context context, String packageName) {
        PackageManager packageManager = context.getPackageManager();
        Intent it = packageManager.getLaunchIntentForPackage(packageName);
        if (it != null) {
            context.startActivity(it);
            return true;
        } else {
            return false;
        }
    }


    public static void runApp(Context context, String packageName) {
        PackageInfo pi;
        try {
            pi = context.getPackageManager().getPackageInfo(packageName, 0);
            Intent resolveIntent = new Intent(Intent.ACTION_MAIN, null);
            // resolveIntent.addCategory(Intent.CATEGORY_LAUNCHER);
            resolveIntent.setPackage(pi.packageName);
            PackageManager pManager = context.getPackageManager();
            List<ResolveInfo> apps = pManager.queryIntentActivities(
                    resolveIntent, 0);
            ResolveInfo ri = apps.iterator().next();
            if (ri != null) {
                packageName = ri.activityInfo.packageName;
                String className = ri.activityInfo.name;
                Intent intent = new Intent(Intent.ACTION_MAIN);
                // intent.addCategory(Intent.CATEGORY_LAUNCHER);
                ComponentName cn = new ComponentName(packageName, className);
                intent.setComponent(cn);
                context.startActivity(intent);
            }
        } catch (PackageManager.NameNotFoundException e) {
            //   Auto-generated catch block
            e.printStackTrace();
        }
    }


}
