package com.ruixue.demo.utils;

import static android.app.Activity.RESULT_OK;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.content.pm.Signature;
import android.content.res.Resources;
import android.database.Cursor;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkInfo;
import android.net.Uri;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Parcelable;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.util.Log;
import android.widget.Toast;


import androidx.annotation.RequiresApi;

import com.google.gson.Gson;
import com.ruixue.RuiXueSdk;
import com.ruixue.internal.DeviceUtils;
import com.ruixue.logger.RXLogger;
 import com.ruixue.utils.MD5;
import com.ruixue.utils.Md5Util;


import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.Inet4Address;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public class DemoUtils {


    public static void showDialog(Context context, String msg) {
        AlertDialog dialog = new AlertDialog.Builder(context).setTitle("提示").setMessage(msg).setNegativeButton("取消", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
            }
        }).setPositiveButton("确定", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
//                                Toast.makeText(getContext(), "确认", Toast.LENGTH_SHORT).show();
            }
        }).create();
        dialog.show();
     }

    public static void showConfirmDialog(Context context,
                                         String title,
                                         String message,
                                         Runnable onConfirm) {
        new AlertDialog.Builder(context)
                .setTitle(title)
                .setMessage(message)
                .setNegativeButton("取消", null)
                .setPositiveButton("确定", (dialog, which) -> {
                    if (onConfirm != null) {
                        onConfirm.run();
                    }
                })
                .show();
    }

    public static void showToast(Context context, String msg) {
        Toast.makeText(context, msg, Toast.LENGTH_LONG).show();
    }

    private boolean hasInstallShortcut(Context context, String shortcutName) {
        boolean hasInstall = false;
        final String AUTHORITY = "com.android.launcher.settings";
        Uri CONTENT_URI = Uri.parse("content://" + AUTHORITY + "/favorites?notify=true");

        @SuppressLint("Recycle") Cursor cursor = context.getContentResolver().query(CONTENT_URI, new String[]{"title", "iconResource"}, "title=?", new String[]{shortcutName}, null);

        if (cursor != null && cursor.getCount() > 0) {
            hasInstall = true;
        }

        return hasInstall;
    }

    public static void clearCache(Context context) {
//            File file = CacheManager.getCacheFileBaseDir();
//  if(file !=null&&file.exists()&&file.isDirectory())
//
//    {
//        for (File item : file.listFiles()) {
//            item.delete();
//        }
//        file.delete();
//    }
        context.deleteDatabase("webview.db");
        context.deleteDatabase("webviewCache.db");
    }


    public static String getProperty(String propName) {
        String value = null;
        Object roSecureObj;
        try {
            roSecureObj = Class.forName("android.os.SystemProperties").getMethod("get", String.class).invoke(null, propName);
            if (roSecureObj != null) {
                value = (String) roSecureObj;
            }
        } catch (Exception e) {
            value = null;
        } finally {

        }
        return value;
    }


    public static void writeSystemDnsCache(String hostName, String ip) {
        try {
            Class inetAddressClass = InetAddress.class;
            Field field = inetAddressClass.getDeclaredField("addressCache");
            field.setAccessible(true);
            Object object = field.get(inetAddressClass);
            Class cacheClass = object.getClass();
            Method putMethod;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                //put方法在api21及以上为put(String host, int netId, InetAddress[] address)
                putMethod = cacheClass.getDeclaredMethod("put", String.class, int.class, InetAddress[].class);
            } else {
                //put方法在api20及以下为put(String host, InetAddress[] address)
                putMethod = cacheClass.getDeclaredMethod("put", String.class, InetAddress[].class);
            }
            putMethod.setAccessible(true);
            String[] ipStr = ip.split("\\.");
            byte[] ipBuf = new byte[4];
            for (int i = 0; i < 4; i++) {
                ipBuf[i] = (byte) (Integer.parseInt(ipStr[i]) & 0xff);
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                putMethod.invoke(object, hostName, 0, new InetAddress[]{InetAddress.getByAddress(ipBuf)});
            } else {
                putMethod.invoke(object, hostName, new InetAddress[]{InetAddress.getByAddress(ipBuf)});
            }

        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (UnknownHostException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
    }

    /**
     * set dns priority according to sys.network.priority(4 ro 6)
     */
    public static Collection<InetAddress> getDnsByHost(String hostname) {
        Collection<InetAddress> dnsesList = new ArrayList<InetAddress>();
        try {
            InetAddress[] dnses = InetAddress.getAllByName(hostname);
            ArrayList<InetAddress> dnsTempListV6 = new ArrayList<InetAddress>();
            ArrayList<InetAddress> dnsTempListV4 = new ArrayList<InetAddress>();
            for (InetAddress inet : dnses) {
                if (inet instanceof Inet6Address) {
                    dnsTempListV6.add(inet);
                } else if (inet instanceof Inet4Address) {
                    dnsTempListV4.add(inet);
                } else {
//                loge("sortDnsesByPriority failed for InetAddress: " + inet.getHostAddress());
                    dnsesList.add(inet);
                }
            }
            String s = getProperty("sys.dns.priority");
            if (TextUtils.isEmpty(s)) { // dns priority: v6 > v4
                dnsesList.addAll(dnsTempListV6);
                dnsesList.addAll(dnsTempListV4);
            } else { // dns priority: v6 < v4
                dnsesList.addAll(dnsTempListV4);
                dnsesList.addAll(dnsTempListV6);
            }
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
        return dnsesList;
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public static void resolveInfo(Activity activity, Intent intent) {
//                String scheme = "line://msg/text/" + "share 文本";
//        Uri uri = Uri.parse(scheme);
//        activity.startActivityForResult(new Intent(Intent.ACTION_VIEW, uri),1111);

        PackageManager pm = activity.getPackageManager();
//        Intent shareIntent = new Intent();
//        shareIntent.setAction(Intent.ACTION_SEND);
        Intent intent1 = new Intent(Intent.ACTION_SEND);
//        intent1.addCategory(Intent.CATEGORY_LAUNCHER);
//
//        //获取匹配的应用列表信息
        List<ResolveInfo> resolveInfos = activity.getPackageManager().queryIntentActivities(intent1, PackageManager.MATCH_ALL);
//
        try {
            ApplicationInfo applicationInfo = activity.getPackageManager()
                    .getApplicationInfo("jp.naver.line.android", PackageManager.GET_UNINSTALLED_PACKAGES);
            RXLogger.i("activity1: " + new Gson().toJson(applicationInfo));
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        Intent chooser = Intent.createChooser(intent, "Complete action using");
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            ArrayList<ComponentName> targets = new ArrayList<>();
            //Remove bluetooth which has a broken share intent
            for (ResolveInfo candidate : pm.queryIntentActivities(intent, 0)) {
                String packageName = candidate.activityInfo.packageName;
                String AppName = candidate.activityInfo.name;
                RXLogger.i("activity2: AppName " + AppName + "  packageName " + packageName);
                if (packageName.toLowerCase().contains("bluetooth")) {
                    targets.add(new ComponentName(packageName, AppName));
                }
            }
            chooser.putExtra(Intent.EXTRA_EXCLUDE_COMPONENTS, targets.toArray(new ComponentName[0]));
        }


        //设置一个集合存放过滤指定应用后的应用集合
        List<Intent> targetedShareIntents = new ArrayList<Intent>();
        List<Map<String, String>> list = new ArrayList<>();

        //遍历这个集合，过滤掉我们不想要分享的应用
        for (ResolveInfo info : resolveInfos) {
            Intent targeted = new Intent();
            targeted.setType("text/plain");
            //获取应用info
            ActivityInfo activityInfo = info.activityInfo;
            Map<String, String> map = new HashMap<>();
            map.put("name", activityInfo.name);
            map.put("packageName", activityInfo.packageName);
            RXLogger.e(new Gson().toJson(map));

            //过滤掉蓝牙分享
            if (activityInfo.packageName.contains("bluetooth") || activityInfo.name.contains("bluetooth")) {
                continue;
            }
            //将过滤后的应用方法targeted中
            targeted.setPackage(activityInfo.packageName);
            //将targeted放到预先new好的targetedShareIntents集合中
            targetedShareIntents.add(targeted);
        }


        //显示一个供用户选择的应用列表
        Intent chooserIntent = new Intent(Intent.ACTION_CHOOSER);
        //最终展示符合createChooser第一个参数的应用以及由EXTRA_INTENT_INTENTS指定的应用
        chooserIntent.putExtra(Intent.EXTRA_INTENT, targetedShareIntents.remove(0));
        if (chooserIntent != null) {
            chooserIntent.putExtra(Intent.EXTRA_INITIAL_INTENTS, targetedShareIntents.toArray(new Parcelable[]{}));
            activity.startActivity(Intent.createChooser(chooserIntent, "选择分享应用"));
        }

//        String linePackageName = "jp.naver.line.android";
////        String lineClassName = "jp.naver.line.android.activity.selectchat.SelectChatActivityLaunchActivity";
//        String lineClassName = "jp.naver.line.android.activity.SplashActivity";
//        ComponentName componentName = new ComponentName(linePackageName, lineClassName);
//
//        Uri uri = Uri.parse("");
//        shareIntent.putExtra(Intent.EXTRA_STREAM, uri);
//        // shareIntent.setType("image/*"); //图片分享
//        shareIntent.setType("text/plain"); // 纯文本
//        shareIntent.putExtra(Intent.EXTRA_SUBJECT, "标题");//分享的标题
//        shareIntent.putExtra(Intent.EXTRA_TEXT, "content");//分享内容
//        shareIntent.setComponent(componentName);//跳到指定APP的Activity
//        Intent chooserIntent1= Intent.createChooser(shareIntent, "分享");
//        activity.startActivity(chooserIntent1);
    }

    public static void createShortcut2(Activity context, String shortcutName) {
//        if (Intent.ACTION_CREATE_SHORTCUT.equals(action)) {
        Intent shortcut = new Intent(Intent.ACTION_CREATE_SHORTCUT);
        // 不允许重建
        shortcut.putExtra("duplicate", false);
        // 设置名字
        shortcut.putExtra(Intent.EXTRA_SHORTCUT_NAME, shortcutName);
        // 设置图标
        shortcut.putExtra(Intent.EXTRA_SHORTCUT_ICON_RESOURCE, Intent.ShortcutIconResource.fromContext(context, context.getResources().getIdentifier("ic_launcher", "mipmap", context.getPackageName())));
        // 设置意图和快捷方式关联的程序
        shortcut.putExtra(Intent.EXTRA_SHORTCUT_INTENT, new Intent(context, context.getClass()));
        //将结果返回到launcher
        context.setResult(RESULT_OK, shortcut);
//        }
    }

    private void addShortcutToDesktop(Activity context, String shortcutName) {

        Intent shortcut = new Intent("com.android.launcher.action.INSTALL_SHORTCUT");
        // 不允许重建
        shortcut.putExtra("duplicate", false);
        // 设置名字
        shortcut.putExtra(Intent.EXTRA_SHORTCUT_NAME, shortcutName);
        // 设置图标
        shortcut.putExtra(Intent.EXTRA_SHORTCUT_ICON_RESOURCE, Intent.ShortcutIconResource.fromContext(context, context.getResources().getIdentifier("ic_launcher", "mipmap", context.getPackageName())));
        // 设置意图和快捷方式关联程序
        shortcut.putExtra(Intent.EXTRA_SHORTCUT_INTENT, new Intent(context, context.getClass()).setAction(Intent.ACTION_MAIN));
        // 发送广播
        context.sendBroadcast(shortcut);
    }

    public static void createShortcut(Activity context, String shortcutName, int iconResId) {
        SharedPreferences setting = context.getSharedPreferences("silent.preferences", 0);
        // 判断是否第一次启动应用程序（默认为true）
        boolean firstStart = setting.getBoolean("FIRST_START", true);
        // 第一次启动时创建桌面快捷方式
        if (firstStart) {
            Intent shortcut = new Intent("com.android.launcher.action.INSTALL_SHORTCUT");
            // 快捷方式的名称
            shortcut.putExtra(Intent.EXTRA_SHORTCUT_NAME, shortcutName);
            // 不允许重复创建
            shortcut.putExtra("duplicate", false);
            // 指定快捷方式的启动对象
            ComponentName comp = new ComponentName(context.getPackageName(), "." + context.getLocalClassName());
            shortcut.putExtra(Intent.EXTRA_SHORTCUT_INTENT, new Intent(Intent.ACTION_MAIN).setComponent(comp));
            // 快捷方式的图标
            Intent.ShortcutIconResource iconRes = Intent.ShortcutIconResource.fromContext(context, iconResId);
            shortcut.putExtra(Intent.EXTRA_SHORTCUT_ICON_RESOURCE, iconRes);
            // 发出广播
            context.sendBroadcast(shortcut);
            // 将第一次启动的标识设置为false
            SharedPreferences.Editor editor = setting.edit();
            editor.putBoolean("FIRST_START", false);
            // 提交设置
            editor.apply();
        }
    }


    public static String getPackageSHA1(Context context) {
        try {
            @SuppressLint("PackageManagerGetSignatures") PackageInfo info = context.getPackageManager().getPackageInfo(context.getPackageName(), PackageManager.GET_SIGNATURES);
            byte[] cert = info.signatures[0].toByteArray();
            MessageDigest md = MessageDigest.getInstance("SHA1");
            byte[] publicKey = md.digest(cert);
            StringBuffer hexString = new StringBuffer();
            for (int i = 0; i < publicKey.length; i++) {
                String appendString = Integer.toHexString(0xFF & publicKey[i]).toUpperCase(Locale.US);
                if (appendString.length() == 1)
                    hexString.append("0");
                hexString.append(appendString);
                hexString.append(":");
            }
            String result = hexString.toString();
            return result.substring(0, result.length() - 1);
        } catch (PackageManager.NameNotFoundException | NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String bundleToString(Bundle bundle) {
        if (null != bundle) {
            StringBuilder log = new StringBuilder();
            for (String key : bundle.keySet()) {
                log.append("\n").append(key).append(" = ").append(bundle.get(key));
            }
            return log.toString();
        }
        return "";
    }

    /**
     * 获取指定字段信息
     */
    @SuppressLint({"HardwareIds", "LongLogTag"})
    public static String getDeviceInfo() {
        int cpuNumbers = Runtime.getRuntime().availableProcessors();
        String sb = "cpuNumbers: " + cpuNumbers + "\n主板：" + Build.BOARD + "\n系统启动程序版本号：" + Build.BOOTLOADER + "\n系统定制商：" + Build.BRAND + "\nSUPPORTED_ABIS:" + Arrays.toString(Build.SUPPORTED_ABIS) + "\n设置参数：" + Build.DEVICE + "\n显示屏参数：" + Build.DISPLAY + "\n无线电固件版本：" + Build.getRadioVersion() + "\n硬件识别码：" + Build.FINGERPRINT + "\n硬件名称：" + Build.HARDWARE + "\nHOST:" + Build.HOST + "\n修订版本列表：" + Build.ID + "\n硬件制造商：" + Build.MANUFACTURER + "\n版本：" + Build.MODEL + "\n硬件序列号：" + Build.SERIAL + "\n手机制造商：" + Build.PRODUCT + "\n描述Build的标签：" + Build.TAGS + "\nTIME:" + Build.TIME + "\nbuilder类型：" + Build.TYPE + "\nUSER:" + Build.USER;
        DisplayMetrics metric = Resources.getSystem().getDisplayMetrics();
        String device = "width:" + metric.widthPixels / metric.density + "dp, height:" + metric.heightPixels / metric.density + "dp \ndensity:" + metric.density + ", dpi:" + metric.densityDpi;
        sb += "\n" + device;

        Log.i("DeviceInfo:", sb);
        Log.i( "rxsdk","Build.VERSION.SDK_INT:"+ Build.VERSION.SDK_INT);

        try {
            InetAddress address = InetAddress.getByName("");
            Log.i("rxsdk", "本机IP: " + address.getHostAddress());
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }

        Log.i("rxsdk", device);
        Log.i("rxsdk", "本机System UA:" + System.getProperty("http.agent"));
        Log.i("rxsdk", "本机WebView UA:" + RuiXueSdk.getWebViewUA());

        return sb;
    }

    public static String getPackMd5(Activity activity) {
        PackageManager manager = activity.getPackageManager();

        PackageInfo packageInfo = null;
        try {
            packageInfo = manager.getPackageInfo(activity.getPackageName(), PackageManager.GET_SIGNATURES);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }

        Signature[] signatures = packageInfo.signatures;
        String md5 = MD5.hexdigest(signatures[0].toByteArray());
        RXLogger.i(md5);
        return md5;
    }

    public static void obtainDeviceId(Context context) {
        final StringBuilder builder = new StringBuilder();
        int cpuNumbers = Runtime.getRuntime().availableProcessors();
        builder.append("cpuNumbers: ").append(cpuNumbers);
        builder.append("IMEI: ");
        // 获取设备唯一标识，只支持Android 10之前的系统，需要READ_PHONE_STATE权限，可能为空
        String imei = DeviceUtils.getIMEI(context);
        if (TextUtils.isEmpty(imei)) {
            builder.append("DID/IMEI/MEID获取失败");
        } else {
            builder.append(imei);
        }
        builder.append("\n");
        builder.append("AndroidID: ");
        // 获取安卓ID，可能为空
        String androidID = DeviceUtils.getAndroidId(context);
        if (TextUtils.isEmpty(androidID)) {
            builder.append("AndroidID获取失败");
        } else {
            builder.append(androidID);
        }
        builder.append("\n");
        builder.append("WidevineID: ");
        // 获取数字版权管理ID，可能为空
//        String widevineID = DeviceIdentifier.getWidevineID();
//        if (TextUtils.isEmpty(widevineID)) {
//            builder.append("WidevineID获取失败");
//        } else {
//            builder.append(widevineID);
//        }
        builder.append("\n");
        builder.append("PseudoID: ");
        // 获取伪造ID，根据硬件信息生成，不会为空，有大概率会重复
//        builder.append(DeviceIdentifier.getPseudoID());
        builder.append("\n");
        builder.append("GUID: ");
        // 获取GUID，随机生成，不会为空
//        builder.append(DeviceIdentifier.getGUID(context));
        builder.append("\n");
        // 是否支持OAID/AAID
//        builder.append("supported: ").append(DeviceID.supportedOAID(context));
        builder.append("\n");


        builder.append("\n");
//        // 获取OAID/AAID，异步回调
//        DeviceID.getOAID(context, new IGetter() {
//            @Override
//            public void onOAIDGetComplete(String result) {
//                // 不同厂商的OAID/AAID格式是不一样的，可进行MD5、SHA1之类的哈希运算统一
//                builder.append("rxid/AAID: ").append(result);
//                Log.i("rxsdk", "rxid/AAID:" + builder);
//            }
//
//            @Override
//            public void onOAIDGetError(Exception error) {
//                // 获取OAID/AAID失败
//                builder.append("rxid/AAID: ").append(error);
//                Log.i("rxsdk", "onOAIDGetError :" + builder);
//            }
//        });
    }
//    https://vimsky.com/examples/detail/java-attribute-android.os.Build.CPU_ABI.html
//    public static CpuArch getCpuArch() {
//    Log.d("Build.CPU_ABI : " + Build.CPU_ABI);
//
//    switch (Build.CPU_ABI) {
//        case X86_CPU:
//        case X86_64_CPU:
//            return CpuArch.x86;
//        case ARM_64_CPU:
//        case ARM_V7_CPU:
//            return CpuArch.ARMv7;
//        default:
//            return CpuArch.NONE;
//    }

}
