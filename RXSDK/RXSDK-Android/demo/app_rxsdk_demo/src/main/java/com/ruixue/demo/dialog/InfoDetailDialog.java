package com.ruixue.demo.dialog;

import android.app.AlertDialog;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.os.Build;
import android.text.TextUtils;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.content.pm.PackageInfoCompat;

import com.ruixue.RuiXueSdk;
import com.ruixue.passport.AccessToken;
import com.ruixue.utils.ResUtils;

/**
 * 信息详情弹窗
 * <p>
 * 显示应用、用户、设备详细信息，支持复制
 *
 * @since 2.0
 */
public class InfoDetailDialog {

    /**
     * 显示应用信息详情
     */
    public static void showAppInfo(@NonNull Context context) {
        String appName = ResUtils.getInstance().getString("app_qipai_name");
        String packageName = context.getPackageName();
        String versionName = getVersionName(context);
        long versionCode = getVersionCode(context);
        String sdkVersion = RuiXueSdk.getSdkVersion();
        String jsonConfig = RuiXueSdk.getJSONConfig();
        
        StringBuilder info = new StringBuilder();
        info.append("📦 应用信息\n\n");
        info.append("应用名称: ").append(appName).append("\n\n");
        info.append("包名: ").append(packageName).append("\n\n");
        info.append("版本: ").append(versionName).append(" (").append(versionCode).append(")\n\n");
        info.append("SDK版本: ").append(sdkVersion).append("\n\n");
        info.append("━━━━━━━━━━━━━━━━━━━━\n\n");
        info.append("📋 SDK 配置\n\n");
        info.append(formatJson(jsonConfig));
        
        showDetailDialog(context, "📦 应用信息", info.toString());
    }

    /**
     * 显示用户信息详情
     */
    public static void showUserInfo(@NonNull Context context) {
        String openid = RuiXueSdk.getOpenid();
        AccessToken accessToken = RuiXueSdk.getCurrentAccessToken();
        
        StringBuilder info = new StringBuilder();
        info.append("👤 用户信息\n\n");
        
        if (!TextUtils.isEmpty(openid)) {
            info.append("OpenID:\n").append(openid).append("\n\n");
            
            if (accessToken != null) {
                info.append("Access Token:\n").append(nullSafe(accessToken.getAccess())).append("\n\n");
                info.append("Access 过期时间: ").append(formatTimestamp(accessToken.getAccessExpire())).append("\n\n");
                info.append("Refresh Token:\n").append(nullSafe(accessToken.getRefresh())).append("\n\n");
                info.append("Refresh 过期时间: ").append(formatTimestamp(accessToken.getRefreshExpire())).append("\n\n");
                info.append("Access 是否过期: ").append(accessToken.isExpired() ? "是 ❌" : "否 ✅").append("\n\n");
                info.append("Refresh 是否过期: ").append(accessToken.isRefreshExpired() ? "是 ❌" : "否 ✅");
            } else {
                info.append("Token: 无");
            }
        } else {
            info.append("状态: 未登录\n\n");
            info.append("请先登录后查看用户信息");
        }
        
        showDetailDialog(context, "👤 用户信息", info.toString());
    }

    /**
     * 显示设备信息详情
     */
    public static void showDeviceInfo(@NonNull Context context) {
        String deviceCode = RuiXueSdk.getDeviceCode();
        String webViewUA = RuiXueSdk.getWebViewUA();
        
        StringBuilder info = new StringBuilder();
        info.append("📱 设备信息\n\n");
        info.append("设备ID:\n").append(nullSafe(deviceCode)).append("\n\n");
        info.append("━━━━━━━━━━━━━━━━━━━━\n\n");
        info.append("制造商: ").append(Build.MANUFACTURER).append("\n\n");
        info.append("品牌: ").append(Build.BRAND).append("\n\n");
        info.append("型号: ").append(Build.MODEL).append("\n\n");
        info.append("设备名: ").append(Build.DEVICE).append("\n\n");
        info.append("硬件: ").append(Build.HARDWARE).append("\n\n");
        info.append("━━━━━━━━━━━━━━━━━━━━\n\n");
        info.append("系统版本: Android ").append(Build.VERSION.RELEASE).append("\n\n");
        info.append("API Level: ").append(Build.VERSION.SDK_INT).append("\n\n");
        info.append("Build ID: ").append(Build.ID).append("\n\n");
        info.append("━━━━━━━━━━━━━━━━━━━━\n\n");
        info.append("WebView UA:\n").append(nullSafe(webViewUA));
        
        showDetailDialog(context, "📱 设备信息", info.toString());
    }

    /**
     * 显示详情弹窗
     */
    private static void showDetailDialog(@NonNull Context context, String title, String content) {
        new AlertDialog.Builder(context)
                .setTitle(title)
                .setMessage(content)
                .setPositiveButton("复制", (dialog, which) -> {
                    copyToClipboard(context, content);
                    Toast.makeText(context, "已复制到剪贴板", Toast.LENGTH_SHORT).show();
                })
                .setNegativeButton("关闭", null)
                .show();
    }

    /**
     * 复制到剪贴板
     */
    private static void copyToClipboard(@NonNull Context context, String text) {
        ClipboardManager clipboard = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = ClipData.newPlainText("SDK Info", text);
        if (clipboard != null) {
            clipboard.setPrimaryClip(clip);
        }
    }

    /**
     * 获取版本名
     */
    private static String getVersionName(Context context) {
        try {
            return context.getPackageManager().getPackageInfo(context.getPackageName(), 0).versionName;
        } catch (Exception e) {
            return "unknown";
        }
    }

    /**
     * 获取版本号
     */
    private static long getVersionCode(Context context) {
        try {
            return PackageInfoCompat.getLongVersionCode(
                    context.getPackageManager().getPackageInfo(context.getPackageName(), 0));
        } catch (Exception e) {
            return 0;
        }
    }

    /**
     * 格式化时间戳
     */
    private static String formatTimestamp(int timestamp) {
        if (timestamp <= 0) return "未设置";
        try {
            java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss", java.util.Locale.getDefault());
            return sdf.format(new java.util.Date((long) timestamp * 1000));
        } catch (Exception e) {
            return String.valueOf(timestamp);
        }
    }

    /**
     * 空值安全处理
     */
    private static String nullSafe(String str) {
        return TextUtils.isEmpty(str) ? "N/A" : str;
    }

    /**
     * 格式化 JSON 字符串
     */
    private static String formatJson(String json) {
        if (TextUtils.isEmpty(json)) return "N/A";
        try {
            // 简单格式化：每个逗号后换行
            return json.replace(",", ",\n").replace("{", "{\n").replace("}", "\n}");
        } catch (Exception e) {
            return json;
        }
    }
}
