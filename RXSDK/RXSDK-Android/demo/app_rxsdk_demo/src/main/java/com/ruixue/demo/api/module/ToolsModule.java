package com.ruixue.demo.api.module;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;
import android.widget.EditText;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.os.Build;
import android.provider.Settings;

import com.google.zxing.integration.android.IntentIntegrator;
import com.ruixue.RXRequestCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.Downloader;
import com.ruixue.base.TrackDataMgr;
import com.ruixue.callback.RXUICallback;
import com.ruixue.demo.activity.CustomCaptureActivity;
import com.ruixue.demo.api.ButtonModule;
import com.ruixue.demo.GlobalConfig;
import com.ruixue.demo.callback.DemoCallbacks;
import com.ruixue.demo.config.DemoTestConfig;
import com.ruixue.demo.config.InitConfigSelector;
import com.ruixue.demo.dialog.LanguageSelectDialog;
import com.ruixue.demo.helper.RxSdkHelper;
import com.ruixue.demo.utils.DataCleanManager;
import com.ruixue.demo.utils.DemoUtils;
import com.ruixue.demo.utils.ProxyChecker;
import com.ruixue.demo.v2.DemoManager;
import com.ruixue.demo.widget.ResizableLogPanel;
import com.ruixue.feedbackui.RXFeedbackUI;
import com.ruixue.internal.DeviceUtils;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.HttpClient;
import com.ruixue.net.RXRequest;
import com.ruixue.openapi.PasswordStrength;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXSdkUI;
import com.ruixue.qipai.R;
import com.ruixue.reflect.ReflectManager;
import com.ruixue.reflect.TXOAuthLoginManager;
import com.ruixue.reflect.WebSocketManager;
import com.ruixue.sdk.gdt.GDTSdkWrapper;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.MacUtil;
import com.ruixue.utils.ThreadUtils;
import com.ruixue.view.CaptchaVerifyView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.UUID;

public class ToolsModule implements ButtonModule {

    private final Activity activity;
    private final DemoManager.ResultCallback callback;
    private final RXUICallback jsonCallback;

    public ToolsModule(@NonNull Activity activity,
                       @NonNull DemoManager.ResultCallback callback,
                       @NonNull RXUICallback jsonCallback) {
        this.activity = activity;
        this.callback = callback;
        this.jsonCallback = jsonCallback;
    }

    @Override
    public void registerButtons(Registrar registrar) {
        // 初始化
        registrar.register(R.id.init, () -> RxSdkHelper.onCreate(activity));
        registrar.register(R.id.switch_init_config, this::switchInitConfig);
        registrar.register(R.id.current_init_config, this::showCurrentInitConfig);
        registrar.register(R.id.sdk_version, this::showSdkVersionInfo);
        registrar.register(R.id.init_status, this::showInitStatusInfo);
        registrar.register(R.id.init_params, this::showInitParamsInfo);
        registrar.register(R.id.sdk_json_config, this::showSdkJsonConfig);
        registrar.register(R.id.current_lang, this::showCurrentLanguageInfo);

        // 密码强度
        registrar.register(R.id.pwd_1, () -> RuiXueSdk.setPasswordStrength(PasswordStrength.Default));
        registrar.register(R.id.pwd_2, () -> RuiXueSdk.setPasswordStrength(PasswordStrength.Average));
        registrar.register(R.id.pwd_3, () -> RuiXueSdk.setPasswordStrength(PasswordStrength.Strong));

        // 验证码
        registrar.register(R.id.verify_get_view, () ->
                RXSdkUI.getInstance()
                        .captchaVerifyUI(activity, DemoTestConfig.CAPTCHA_APPID_VERIFY,
                                DemoCallbacks.request(callback, "滑块验证"))
                        .show());
        registrar.register(R.id.test_ui, this::testCaptchaVerify);

        // 敏感信息
        registrar.register(R.id.enable_sensitive, () -> {
            RuiXueSdk.disableReadSensitiveInfo(false);
            callback.onToast("已启用敏感信息读取");
        });

        // 埋点
        registrar.register(R.id.stop_user_action, () -> {
            RuiXueSdk.getApi().stopTrackUserAction();
            callback.onToast("已停止用户行为追踪");
        });

        // 应用商店
        registrar.register(R.id.appstore, () -> RuiXueSdk.getRXSdkApi().jumpToAppStore(activity));

        // 重启/清理
        registrar.register(R.id.restart_app, () -> RuiXueSdk.restartApp(0));
        registrar.register(R.id.cleanup_app, () -> {
            DataCleanManager.cleanApplicationData(activity);
            callback.onToast("已清理应用数据");
        });

        // 设备信息
        registrar.register(R.id.deviceid, this::showDeviceInfo);
        registrar.register(R.id.copy_log, this::copyLog);
        registrar.register(R.id.read_clipboard, () -> callback.onResult(RuiXueSdk.getClipboardData()));
        registrar.register(R.id.system_info, this::showSystemInfo);

        // 语言设置
        registrar.register(R.id.lang_zh, () -> setLanguage("zh"));
        registrar.register(R.id.lang_en, () -> setLanguage("en"));
        registrar.register(R.id.lang_ja, () -> setLanguage("ja"));
        registrar.register(R.id.lang_arab, () -> setLanguage("ar"));
        registrar.register(R.id.lang_traditional_chinese, () -> setLanguage("tc"));
        registrar.register(R.id.lang_philippines, () -> setLanguage("tl"));
        registrar.register(R.id.lang_thai, () -> setLanguage("th"));
        registrar.register(R.id.lang_vietnamese, () -> setLanguage("vi"));
        registrar.register(R.id.lang_indonesian, () -> setLanguage("id"));
        registrar.register(R.id.btn_switch_lang, this::showLanguageDialog);

        // 账号同步
        registrar.register(R.id.sync_accounts, this::syncAccounts);
        registrar.register(R.id.sync_event_attrs, this::syncEventAttrs);

        // APK 下载/安装
        registrar.register(R.id.apk_download, this::downloadApk);
        registrar.register(R.id.apk_install, this::installApk);

        // 网络测试
        registrar.register(R.id.test_ip, this::testIp);
        registrar.register(R.id.scan_qrcode, this::scanQR);

        // 广告归因
        registrar.register(R.id.ad_register, () -> testAdAttribution("register", "method", RuiXueSdk.getLoginMethod()));
        registrar.register(R.id.ad_pay, () -> testAdAttribution("pay", "amount", "100"));

        // WebSocket
        registrar.register(R.id.test_socket, this::testWebSocket);

        // 业务 API
        registrar.register(R.id.buss_api, () -> RuiXueSdk.getApi().getOperationScene(jsonCallback));

        // 小程序
        registrar.register(R.id.open_mini, this::openMini);

        // 通知
        registrar.register(R.id.send_notification, this::sendNotification);

        // 通讯录
        registrar.register(R.id.btn_contacts, this::sendAddressBook);

        // 埋点上报
        registrar.register(R.id.track_report, this::trackReport);

        // 广点通
        registrar.register(R.id.gdt_report, this::gdtReport);

        // 腾讯一键登录
        registrar.register(R.id.quickphone_tx, this::txQuickLogin);

        registrar.register(R.id.proxy_test, this::testProxy);

        // OSS上传
        registrar.register(R.id.ossupload, this::ossUpload);

        // 业务上报
        registrar.register(R.id.buss_report, this::businessReport);

        // 反馈 UI
        registrar.register(R.id.feedback_create_view, () -> RXFeedbackUI.showCreateFeedbackView(activity));
        registrar.register(R.id.feedback_list_view, () -> RXFeedbackUI.showFeedbackListView(activity));
    }

    private void switchInitConfig() {
        InitConfigSelector.showSelector(activity, (configKey, displayName) -> {
            String title = configKey != null ? "初始化配置已切换" : "初始化配置已清除";
            String message = configKey != null
                    ? "配置已切换: " + displayName + "\nkey: " + configKey
                            + "\n\n是否立即重新初始化 SDK 让新参数生效？"
                    : "已清除配置记忆，将回落到默认配置。\n\n是否立即重新初始化 SDK？";
            new android.app.AlertDialog.Builder(activity)
                    .setTitle(title)
                    .setMessage(message)
                    .setPositiveButton("立即重新初始化", (d, w) -> {
                        RxSdkHelper.reinitialize(activity, null);
                        callback.onToast("已触发重新初始化");
                    })
                    .setNegativeButton("稍后手动初始化", (d, w) ->
                            callback.onToast(configKey != null
                                    ? "配置已切换，请稍后手动初始化"
                                    : "已清除配置记忆"))
                    .show();
        });
    }

    private void showCurrentInitConfig() {
        String configName = InitConfigSelector.getSelectedConfigDisplayName(activity);
        String remembered = InitConfigSelector.getSelectedConfig(activity);
        String effectiveKey = remembered != null
                ? remembered
                : GlobalConfig.getInitConfigKey(activity) + " (默认)";
        showInfoDialogAndLog("当前初始化配置",
                "当前初始化配置:\n"
                        + "• 名称: " + configName + "\n"
                        + "• key: " + effectiveKey + "\n"
                        + "• 说明: IDE 调试运行时会自动清除记忆");
    }

    private void showSdkVersionInfo() {
        showInfoDialogAndLog("SDK 版本", "SDK 版本: " + RuiXueSdk.getSdkVersion());
    }

    private void showInitStatusInfo() {
        String cpid = RuiXueSdk.getCpId();
        boolean isInit = cpid != null && !cpid.isEmpty();
        showInfoDialogAndLog("初始化状态", "初始化状态: " + (isInit ? "已初始化 ✅" : "未初始化 ❌"));
    }

    private void showInitParamsInfo() {
        String cpid = RuiXueSdk.getCpId();
        String productId = RuiXueSdk.getProductId();
        String channelId = RuiXueSdk.getChannelId();
        showInfoDialogAndLog("初始化参数",
                "初始化参数:\n"
                        + "• CPID: " + (cpid != null ? cpid : "未设置") + "\n"
                        + "• ProductID: " + (productId != null ? productId : "未设置") + "\n"
                        + "• ChannelID: " + (channelId != null ? channelId : "未设置"));
    }

    private void showSdkJsonConfig() {
        showInfoDialogAndLog("SDK 配置", "SDK配置:\n" + formatJsonText(RuiXueSdk.getJSONConfig()));
    }

    private void showCurrentLanguageInfo() {
        String lang = RuiXueSdk.getLanguage();
        showInfoDialogAndLog("当前语言", "当前语言: " + (TextUtils.isEmpty(lang) ? "未设置" : lang));
    }

    private void showInfoDialogAndLog(@NonNull String title, @NonNull String message) {
        callback.onResult(message);
        DemoUtils.showDialog(activity, title + "\n\n" + message);
    }

    @NonNull
    private String formatJsonText(@Nullable String rawJson) {
        if (TextUtils.isEmpty(rawJson)) {
            return "空";
        }
        String trimmed = rawJson.trim();
        try {
            if (trimmed.startsWith("{")) {
                return new JSONObject(trimmed).toString(2);
            }
            if (trimmed.startsWith("[")) {
                return new JSONArray(trimmed).toString(2);
            }
        } catch (JSONException e) {
            RXLogger.w("ToolsModule", "Format sdk json config failed: " + e.getMessage());
        }
        return rawJson;
    }

    // ==================== 设备/系统 ====================

    private void showDeviceInfo() {
        String info = "MAC: " + MacUtil.getMacAddress(activity)
                + "\r\nIP获取MAC: " + MacUtil.getLocalMacAddressFromIp()
                + "\r\nIMEI: " + DeviceUtils.getIMEI(activity)
                + "\r\nandroidID: " + DeviceUtils.getAndroidId(activity)
                + "\r\nDCCur:" + DeviceUtils.getDeviceId(activity)
                + "\r\nDCNew:" + DeviceUtils.generateDeviceGUID(activity)
                + "\r\nOAID: " + DeviceUtils.getOAID(activity);
        RXLogger.i("DeviceInfo", info);
        DemoUtils.showDialog(activity, info);
    }

    private void copyLog() {
        ResizableLogPanel logPanel = activity.findViewById(R.id.log_panel);
        if (logPanel != null) {
            logPanel.copyLog();
        }
    }

    private void showSystemInfo() {
        StringBuilder info = new StringBuilder();
        info.append("设备信息:\n");
        info.append("Android版本: ").append(Build.VERSION.RELEASE).append("\n");
        info.append("SDK版本: ").append(Build.VERSION.SDK_INT).append("\n");
        info.append("设备型号: ").append(Build.MODEL).append("\n");
        info.append("制造商: ").append(Build.MANUFACTURER).append("\n");

        Set<String> languageCodes = new TreeSet<>();
        Locale[] locales = Locale.getAvailableLocales();
        for (Locale locale : locales) {
            String languageCode = locale.getLanguage();
            if (languageCode != null && !languageCode.isEmpty()) {
                String country = locale.getCountry();
                if (!TextUtils.isEmpty(country)) languageCodes.add(languageCode + "-" + country);
            }
        }
        info.append("支持语言数: ").append(languageCodes.size());
        DemoUtils.showDialog(activity, info.toString());
    }

    private void setLanguage(String code) {
        RuiXueSdk.setLanguage(activity, code);
        callback.onToast("语言已切换为: " + code);
    }

    private void showLanguageDialog() {
        LanguageSelectDialog.show(activity, code -> {
            RuiXueSdk.setLanguage(activity, code);
            callback.onToast("语言已切换为: " + code);
        });
    }

    // ==================== 账号同步 ====================

    private void syncAccounts() {
        List<Map<String, String>> mapList = new ArrayList<>();
        for (int i = 1; i < 5; i++) {
            Map<String, String> acc = new HashMap<>();
            acc.put("username", "lee" + i);
            mapList.add(acc);
        }
        RuiXueSdk.syncAccounts(mapList);
        callback.onToast("已同步账号");
    }

    private void syncEventAttrs() {
        TrackDataMgr.getInstance().syncEventAttr((code, map) -> {
            RXLogger.i("syncEventAttr code " + code);
            callback.onResult("同步事件属性: code=" + code);
        });
    }

    // ==================== 下载/安装 ====================

    private void downloadApk() {
        Downloader downloader = Downloader.getInstance(activity);
        downloader.setAutoInstall(false);
        downloader.setFinishCallback((isSuccess, uriStr) -> RXLogger.i(isSuccess + uriStr));
        downloader.downloadAPK(DemoTestConfig.APK_DOWNLOAD_URL, DemoTestConfig.APK_DOWNLOAD_NAME, "正在下载...", null);
    }

    private void installApk() {
        Downloader.getInstance(activity).installAPK(new File(DemoTestConfig.APK_INSTALL_PATH));
    }

    // ==================== 网络/代理 ====================

    private void testIp() {
        ThreadUtils.getInstance().runOnBgThread(() -> {
            String ip = HttpClient.get("https://ifconfig.me/ip");
            callback.onResult("IP: " + ip);
        });
    }

    private void scanQR() {
        new IntentIntegrator(activity)
                .setDesiredBarcodeFormats(IntentIntegrator.QR_CODE_TYPES)
                .setPrompt("请对准二维码")
                .setCaptureActivity(CustomCaptureActivity.class)
                .setOrientationLocked(false)
                .setCameraId(0)
                .setBeepEnabled(true)
                .setBarcodeImageEnabled(true)
                .initiateScan();
    }

    private void testProxy() {
        boolean b = ProxyChecker.isProxySet();
        boolean c = ProxyChecker.isWifiProxySet(activity);
        callback.onResult("代理状态: 系统代理=" + b + ", WiFi代理=" + c);
    }

    // ==================== 广告/归因 ====================

    private void testAdAttribution(String event, String infoKey, String infoValue) {
        Map<String, Object> map = new HashMap<>();
        map.put("event", event);
        map.put("uuid", UUID.randomUUID().toString());
        Map<String, Object> body = new HashMap<>();
        body.put(infoKey, infoValue);
        body.put("success", true);
        map.put("info", body);
        RXRequest.create("v1/WsWork/attribution/test?open_id=" + RuiXueSdk.getOpenid())
                .setBody(map)
                .postAsync(DemoCallbacks.request(callback, "广告归因"));
        Map<String, Object> msg = new HashMap<>();
        msg.put("msg_type", 1000);
        WebSocketManager.send(new JSONObject(msg).toString());
    }

    private void testWebSocket() {
        try {
            TrackDataMgr.getInstance().getWebsocket().put("method", "sdk");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        WebSocketManager.connect(activity);
    }

    private void openMini() {
        AppUtils.startApp(activity,
                "weixin://dl/business/?path=news/pages/newsDetail/index&query=id%3D43&appid=wxed7760f5c2c12e91");
    }

    // ==================== 通知/通讯录 ====================

    private void sendNotification() {
        NotificationManager notificationManager =
                (NotificationManager) activity.getSystemService(Context.NOTIFICATION_SERVICE);
        if (notificationManager == null) {
            callback.onToast("系统不支持通知服务");
            return;
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (!notificationManager.areNotificationsEnabled()) {
                Intent intent = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
                intent.putExtra(Settings.EXTRA_APP_PACKAGE, activity.getPackageName());
                activity.startActivity(intent);
                return;
            }

            String channelId = "channelId";
            Intent intent = new Intent(activity, activity.getClass());
            intent.putExtra("task_id", "s" + System.currentTimeMillis());
            int flags = PendingIntent.FLAG_UPDATE_CURRENT;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                flags |= PendingIntent.FLAG_IMMUTABLE;
            }
            PendingIntent pendingIntent = PendingIntent.getActivity(activity, 0, intent, flags);

            Notification notification = new Notification.Builder(activity, channelId)
                    .setContentTitle("测试通知")
                    .setContentText("这是一条测试通知")
                    .setWhen(System.currentTimeMillis())
                    .setSmallIcon(R.mipmap.ic_launcher)
                    .setContentIntent(pendingIntent)
                    .setAutoCancel(true)
                    .build();

            NotificationChannel channel = new NotificationChannel(
                    channelId, "渠道名称", NotificationManager.IMPORTANCE_DEFAULT);
            channel.enableLights(true);
            channel.setShowBadge(true);
            notificationManager.createNotificationChannel(channel);
            notificationManager.notify(1123, notification);
            callback.onToast("通知已发送");
        } else {
            callback.onToast("系统版本过低，不支持通知");
        }
    }

    private void sendAddressBook() {
        RXGlobalData.setContactsPath("passport");
        ReflectManager.sendAddressBook(activity);
    }

    // ==================== 埋点/上报 ====================

    private void trackReport() {
        ThreadUtils.getInstance().runOnBgThread(() -> {
            Map<String, Object> hashMap = new HashMap<>();
            hashMap.put("test_event", true);
            hashMap.put("#env", 1);
            hashMap.put("data", UUID.randomUUID().toString());
            hashMap.put("time", System.currentTimeMillis());
            RXSdkApi.getInstance().dataTrack("#test", null, hashMap, 10, 10);
            callback.onResult("埋点上报完成");
        });
    }

    private void gdtReport() {
        String sid = DemoTestConfig.GDT_SID;
        String sk = DemoTestConfig.GDT_SK;
        GDTSdkWrapper.getInstance().init(activity, sid, sk, "tencent", "tencent");
        GDTSdkWrapper.getInstance().reportRegister("guest", true);
        GDTSdkWrapper.getInstance().reportLogin("guest", true);
        callback.onToast("广点通上报完成");
    }

    private void txQuickLogin() {
        Map<String, Object> map = new HashMap<>();
        map.put("tx_appid", DemoTestConfig.TX_QUICK_APPID);
        TXOAuthLoginManager.init(activity, map, jsonCallback);
        TXOAuthLoginManager.doLogin(activity, map, jsonCallback);
    }

    // ==================== 验证码 ====================

    private void testCaptchaVerify() {
        CaptchaVerifyView.create(activity, DemoTestConfig.TEST_PHONE, "login", false, jsonCallback)
                .setUrl(GlobalConfig.getDomain() + "#/captcha")
                .setAppid(DemoTestConfig.CAPTCHA_APPID_TEST)
                .show();
    }

    // ==================== OSS ====================

    private void ossUpload() {
        RXGlobalData.LOG_PATH = "feed_log";
        RXGlobalData.FEEDBACK_ID = 151;
        File externalDir = activity.getExternalFilesDir(null);
        if (externalDir == null) {
            callback.onToast("外部存储不可用");
            return;
        }
        File file = new File(externalDir, "rxconfig.json");
        if (!file.exists() || file.length() <= 0) {
            callback.onToast("待上传文件不存在: " + file.getAbsolutePath());
            return;
        }
        try (FileInputStream fis = new FileInputStream(file)) {
            byte[] byteArr = new byte[(int) file.length()];
            int read = fis.read(byteArr);
            if (read <= 0) {
                callback.onToast("文件为空");
                return;
            }
            RuiXueSdk.reportFeedbackLog(activity, byteArr, jsonCallback);
        } catch (IOException e) {
            callback.onToast("文件读取失败: " + e.getMessage());
        }
    }

    // ==================== 业务上报 ====================

    private void businessReport() {
        Map<String, Object> scene = new HashMap<>();
        scene.put("scene_identifier", "scene_001");
        scene.put("scene_name", "Example Scene");
        scene.put("trigger_button_identifier", "btn_001");
        scene.put("trigger_button_name", "Start Button");
        scene.put("window_identifier", "window_001");
        scene.put("window_name", "Main Window");
        scene.put("window_sequence", "1");

        List<Map<String, Object>> giftPackages = new ArrayList<>();
        Map<String, Object> giftPackage1 = new HashMap<>();
        giftPackage1.put("identifier", "gift_001");
        giftPackage1.put("name", "Starter Pack");
        giftPackage1.put("price", 9.99);
        giftPackages.add(giftPackage1);
        scene.put("gift_package", giftPackages);

        RuiXueSdk.getApi().reportWindowExposure(scene);
        callback.onToast("业务上报完成");
    }
}
