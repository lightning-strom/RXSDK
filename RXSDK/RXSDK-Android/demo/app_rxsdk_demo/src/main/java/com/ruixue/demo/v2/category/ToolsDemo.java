package com.ruixue.demo.v2.category;

import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;

import androidx.annotation.NonNull;

import com.ruixue.RuiXueSdk;
import com.ruixue.demo.helper.RxSdkHelper;
import com.ruixue.demo.config.TestButtonConfig.ButtonGroup;
import com.ruixue.demo.v2.DemoCategory;
import com.ruixue.demo.v2.DemoManager;

/**
 * 工具相关 API 示例
 * <p>
 * <b>包含功能：</b>
 * <ul>
 *   <li>{@link #doShare()} - 执行分享</li>
 *   <li>{@link #openWebView()} - 打开 WebView</li>
 *   <li>{@link #copyDeviceId()} - 复制设备ID到剪贴板</li>
 *   <li>{@link #copyOpenId()} - 复制 OpenID 到剪贴板</li>
 * </ul>
 *
 * @since 2.0
 * @see com.ruixue.demo.helper.RxSdkHelper 辅助工具类
 */
public class ToolsDemo extends DemoCategory {

    public ToolsDemo(@NonNull Activity activity, @NonNull DemoManager.ResultCallback callback) {
        super(activity, callback);
    }

    @Override
    public String getName() {
        return "工具";
    }

    @Override
    public String getEmoji() {
        return "🔧";
    }

    @Override
    protected void registerButtons(ButtonGroup group) {
        group.addButton(button("share", "分享", this::doShare));
        group.addButton(button("open_webview", "WebView", this::openWebView));
        group.addButton(button("copy_device", "复制设备ID", this::copyDeviceId));
        group.addButton(button("copy_openid", "复制OpenID", this::copyOpenId));
    }

    // ==================== API 示例方法 ====================

    /** 执行分享 */
    public void doShare() {
        RxSdkHelper.showShareUI(activity, new com.ruixue.RXJSONCallback() {
            @Override
            public void onSuccess(@androidx.annotation.Nullable org.json.JSONObject data) {
                showResult("分享成功");
                showToast("分享成功");
            }

            @Override
            public void onFailed(@NonNull org.json.JSONObject cause) {
                showResult("分享失败:\n" + cause.toString());
            }
        });
    }

    /** 打开 WebView */
    public void openWebView() {
        RxSdkHelper.openUrl(activity, true);
        showResult("已打开 WebView");
    }

    /** 复制设备ID到剪贴板，并打印 android_id、oaid 等信息 */
    public void copyDeviceId() {
        String deviceCode = RuiXueSdk.getDeviceCode();
        String androidId = RuiXueSdk.getAndroidID();
        String oaid = RuiXueSdk.getDeviceOAID();
        String distinctId = RuiXueSdk.getDistinctId();

        StringBuilder sb = new StringBuilder();
        sb.append("deviceCode: ").append(deviceCode).append("\n");
        sb.append("android_id: ").append(androidId).append("\n");
        sb.append("oaid: ").append(oaid).append("\n");
        sb.append("distinct_id: ").append(distinctId);

        String info = sb.toString();
        copyToClipboard("DeviceCode", deviceCode);
        showResult(info);
        showToast("已复制到剪贴板");
    }

    /** 复制 OpenID 到剪贴板 */
    public void copyOpenId() {
        String openid = RuiXueSdk.getOpenid();
        if (openid != null && !openid.isEmpty()) {
            copyToClipboard("OpenID", openid);
            showResult("OpenID已复制:\n" + openid);
            showToast("已复制到剪贴板");
        } else {
            showResult("未登录，无法获取 OpenID");
            showToast("请先登录");
        }
    }

    // ==================== 辅助方法 ====================

    private void copyToClipboard(String label, String text) {
        ClipboardManager clipboard = (ClipboardManager) activity.getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = ClipData.newPlainText(label, text);
        clipboard.setPrimaryClip(clip);
    }
}
