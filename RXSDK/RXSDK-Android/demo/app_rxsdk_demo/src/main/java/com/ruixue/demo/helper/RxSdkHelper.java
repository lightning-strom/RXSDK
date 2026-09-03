package com.ruixue.demo.helper;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.res.Configuration;
import android.graphics.Color;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.webkit.CookieManager;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.LifecycleOwner;

import com.ruixue.RXJSONCallback;
import com.ruixue.RXSdkInitConfig;
import com.ruixue.RuiXueSdk;
import com.ruixue.demo.GlobalConfig;
import com.ruixue.demo.config.InitConfigRegistry;
import com.ruixue.demo.config.InitConfigSelector;
import com.ruixue.legal.AntiAddictDelegate;
import com.ruixue.legal.LegalData;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXSdkUI;
import com.ruixue.openapi.RuiXueSdkCallback;
import com.ruixue.passport.AccessToken;
import com.ruixue.passport.PassportManager;
import com.ruixue.reflect.AdjustManager;
import com.ruixue.reflect.BuglyManager;
import com.ruixue.reflect.OaidManager;
import com.ruixue.utils.AssetsUtil;
import com.ruixue.utils.LoadingDialog;
import com.ruixue.view.RXWebView;

import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * SDK 初始化帮助类
 * <p>
 * 封装 SDK 初始化、配置、回调等功能
 *
 * @since 1.0
 */
public class RxSdkHelper {

    private static final String TAG = "RxSdkHelper";

    private static Application sApplication;

    // ==================== 初始化相关 ====================

    /**
     * 初始化 SDK（无回调）
     */
    public static void onCreate(Activity activity) {
        onCreate(activity, null);
    }

    /**
     * 初始化 SDK
     *
     * @param activity 活动上下文
     * @param callback 初始化回调
     */
    public static void onCreate(Activity activity, @Nullable RXJSONCallback callback) {
        // 1. 复制必要资源
        copyAssets(activity);

        // 2. 设置生命周期跟踪
        setupLifecycleTracking(activity);

        // 2.1 OAID 初始化（须在广告/监测 SDK 之前）
        initOaid(activity);

        // 3. 第三方 SDK 初始化
        initThirdPartySdk(activity);

        // 4. 设置全局回调
        setupGlobalCallbacks(activity);

        // 5. 设置防沉迷代理
        setupAntiAddictDelegate(activity);

        // 6. 设置 Token 变更监听
        setupTokenChangeListener();

        // 7. 执行 SDK 初始化
        doInitialize(activity, callback);
    }

    // ==================== 内部方法 ====================

    /**
     * 复制 Assets 资源
     */
    private static void copyAssets(Activity activity) {
        AssetsUtil.copyFromAssets(activity, ".html");
        AssetsUtil.copyFromAssets(activity, ".json");
    }

    /**
     * 设置生命周期跟踪
     */
    private static void setupLifecycleTracking(Activity activity) {
        if (activity instanceof AppCompatActivity) {
            RuiXueSdk.trackingLifecycle((LifecycleOwner) activity);
        }
    }

    /**
     * 初始化 MSA 信通院 OAID SDK（rxsdk_oaidv2）。
     * <p>
     * 证书按包名从 assets 读取（{@code <packageName>.cert.pem}），无对应证书时 InitCert 会失败并打日志，
     * 但只要 {@code com.bun.miitmdid} 在 classpath，广告/监测 SDK 即可找到 OAID SDK（消除
     * "oaid sdk not find" 告警）。须在任何广告/监测 SDK 初始化之前调用。
     */
    private static void initOaid(Activity activity) {
        try {
            String cert = activity.getPackageName() + ".cert.pem";
            boolean ok = OaidManager.initOaidSdk(activity, cert);
            RXLogger.i(TAG, "OAID init: cert=" + cert + ", success=" + ok);
        } catch (Throwable t) {
            RXLogger.e(TAG, "OAID init error: " + t.getMessage());
        }
    }

    /**
     * 初始化第三方 SDK
     */
    private static void initThirdPartySdk(Activity activity) {
        AdjustManager.init(activity, "a7tay9toq29s", 1, RuiXueSdk.getDistinctId());
        RuiXueSdk.setTrackEnv(true);
        RuiXueSdk.setLogConfig(true, 50);

        Map<String, Object> publicProps = new HashMap<>();
        publicProps.put("a", 1);
        RuiXueSdk.setPublicProperties(publicProps);

        RXSdkApi.getInstance().registerPlugin("com.ruixue.hq.HQSdkWrapper");
        RuiXueSdk.setLogEnable(true);
    }

    /**
     * 设置全局回调
     */
    private static void setupGlobalCallbacks(Activity activity) {
        RuiXueSdk.setRuiXueSdkCallback(new RuiXueSdkCallback() {
            @Override
            public void rxPublicCallback(int type, Map<String, Object> map) {
                handlePublicCallback(activity, type, map);
            }

            @Override
            public boolean onSwitchAccount(int code, String data) {
                RXLogger.i(TAG, "onSwitchAccount: code=" + code + ", data=" + data);
                // 返回 true：渠道侧（如虎牙浮球切号）会继续清理瑞雪本地会话
                String tip = "切号回调 code=" + code
                        + (TextUtils.isEmpty(data) ? "" : (" data=" + data));
                ToastUtils.showToastSafe(activity, tip);
                return true;
            }

            @Override
            public void onLogout(int code, String msg) {
                RXLogger.i(TAG, "onLogout: code=" + code + ", msg=" + msg);
                String tip = "登出回调 code=" + code
                        + (TextUtils.isEmpty(msg) ? "" : (" msg=" + msg));
                ToastUtils.showToastSafe(activity, tip);
            }
        });
    }

    /**
     * 处理公共回调
     */
    private static void handlePublicCallback(Activity activity, int type, Map<String, Object> map) {
        if (type != 1001) return; // 只处理日志上报

        String path = activity.getExternalFilesDir(null).getAbsolutePath() + "/rxconfig.json";
        File file = new File(path);
        if (!file.exists()) return;

        try (FileInputStream fis = new FileInputStream(file)) {
            byte[] byteArr = new byte[(int) file.length()];
            fis.read(byteArr);
            RuiXueSdk.reportFeedbackLog(activity, byteArr, new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    RXLogger.i(TAG, "Feedback log reported successfully");
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    RXLogger.e(TAG, "Feedback log report failed: " + cause);
                }
            });
        } catch (IOException e) {
            RXLogger.e(TAG, "Failed to read config file: " + e.getMessage());
        }
    }

    /**
     * 设置防沉迷代理
     */
    private static void setupAntiAddictDelegate(Activity activity) {
        RXSdkApi.getInstance().setupAddictDelegate(new AntiAddictDelegate() {
            @Override
            public boolean isGaming() {
                return false;
            }

            @Override
            public void didAddictInfoUpdate(String info) {
                RXLogger.i(TAG, "AntiAddict info updated: " + info);
                // 虎牙 QUIT 等会走到这里，补 UI 提示便于联调
                ToastUtils.showToastSafe(activity,
                        "防沉迷/踢出: " + (TextUtils.isEmpty(info) ? "(empty)" : info));
            }

            @Override
            public boolean enableCustomUI() {
                return false;
            }
        });
    }

    /**
     * 设置 Token 变更监听
     */
    private static void setupTokenChangeListener() {
        RuiXueSdk.setAccessTokenChangeCallback((oldToken, newToken) -> {
            RXLogger.i(TAG, "AccessToken changed: " + (newToken != null ? newToken.getAccess() : "null"));
        });
    }

    /**
     * 执行 SDK 初始化
     */
    private static void doInitialize(Activity activity, @Nullable RXJSONCallback callback) {
        LoadingDialog loadingDialog = LoadingDialog.create(activity).closeDelay(10000);
        loadingDialog.show();

        RXJSONCallback initCallback = callback != null ? callback : createDefaultCallback(activity, loadingDialog);

        RXSdkInitConfig config = buildInitConfig(activity, initCallback);
        RuiXueSdk.initialize(config);
    }

    /**
     * 仅重新执行 SDK 初始化（不重跑 assets 拷贝、第三方 SDK 等一次性流程）。
     * 用于切换 init_configs.json 中的 cp 后让新的 cpid/产品/渠道/domain 生效。
     */
    public static void reinitialize(Activity activity, @Nullable RXJSONCallback callback) {
        GlobalConfig.invalidateConfigCache();
        doInitialize(activity, callback);
    }

    /**
     * 创建默认初始化回调
     */
    private static RXJSONCallback createDefaultCallback(Activity activity, LoadingDialog loadingDialog) {
        return new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                RXLogger.i(TAG, "SDK initialized successfully");
                loadingDialog.dismiss();
                ToastUtils.showToast(activity, "初始化成功");
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.e(TAG, "SDK initialization failed: " + cause);
                loadingDialog.dismiss();
                ToastUtils.showToast(activity, "初始化失败: " + cause);
            }
        };
    }

    /**
     * 构建初始化配置。
     * <p>
     * 单源数据：统一从 {@link InitConfigRegistry}（经 {@link GlobalConfig#getConfig()}）取
     * cpid/产品/渠道/domain/ext。不再区分 rxconfig 与 init_configs。
     */
    private static RXSdkInitConfig buildInitConfig(Activity activity, RXJSONCallback callback) {
        GlobalConfig.ConfigBean config = GlobalConfig.getConfig(activity);
        if (config == null) {
            RXLogger.e(TAG, "buildInitConfig: GlobalConfig null, fallback to default cp_114");
            config = new GlobalConfig.ConfigBean();
            config.setCpId("114");
            config.setProductId("1002");
            config.setChannelId("100");
            config.setBaseUrl("https://cn-api-test.ruixueyun.com");
        }
        String effectiveKey = GlobalConfig.getInitConfigKey(activity);
        String pkg = activity != null ? activity.getPackageName() : "";
        String reason = InitConfigSelector.getSelectedConfig(activity) != null
                ? "remembered"
                : (InitConfigRegistry.findKeyByPackageName(activity, pkg) != null
                    ? "packageName-match" : "fallback");
        RXLogger.i(TAG, "InitConfig: source=registry, key=" + effectiveKey
                + ", cp=" + config.getCpid()
                + ", product=" + config.getProductid()
                + ", channel=" + config.getChannelid()
                + ", reason=" + reason);

        RXSdkInitConfig initConfig = new RXSdkInitConfig(
                config.getCpid(),
                config.getProductid(),
                config.getChannelid(),
                config.getBaseUrl(),
                callback
        );

        // 设置可选参数
        initConfig.setUsePrivacy(true);
        initConfig.setAgreementTitle("设置隐私窗口标题");
        initConfig.setAgreementMap(buildAgreementMap());
        initConfig.setLogEnable(true);
        initConfig.setThirdSdkParams(config.getExt());

        return initConfig;
    }

    /**
     * 构建协议 Map
     */
    private static Map<String, String> buildAgreementMap() {
        Map<String, String> map = new LinkedHashMap<>();
        map.put("00001", "《用户协议》");
        map.put("00002", "《隐私政策》");
        return map;
    }

    // ==================== 公共方法 ====================

    /**
     * 初始化第三方 SDK 并自动登录
     */
    public static void doInitThird(Activity activity) {
        Map<String, Object> thirdSdkParams = GlobalConfig.getConfig().getExt();
        RXSdkApi.getInstance().initThirdSdk(activity, thirdSdkParams, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                RXLogger.i(TAG, "Third SDK init success");
                autoLogin(activity);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.e(TAG, "Third SDK init failed: " + cause);
            }
        });
    }

    /**
     * 自动登录
     */
    private static void autoLogin(Activity activity) {
        Bundle bundle = activity.getIntent().getExtras();
        boolean ignoreCheck = bundle != null && bundle.getBoolean("ignore_check_login");

        if (!ignoreCheck && !PassportManager.getInstance().isLoggedIn()) {
            RuiXueSdk.login(activity, new HashMap<>(), new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    RXLogger.i(TAG, "Auto login success");
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    RXLogger.e(TAG, "Auto login failed: " + cause);
                }
            });
        }
    }

    /**
     * 显示法务弹窗
     */
    public static void showLegal(Activity activity, String key, RXJSONCallback callback) {
        RXSdkApi.getInstance().legal(new HashMap<>(), new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (data == null) return;

                LegalData legalData = LegalData.fromJson(data);
                showLegalUI(activity, key, legalData, callback);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.e(TAG, "Legal request failed: " + cause);
            }
        });
    }

    /**
     * 显示法务 UI
     */
    private static void showLegalUI(Activity activity, String key, LegalData legalData, RXJSONCallback callback) {
        switch (key) {
            case "00001":
                if (legalData.getTerm(key) != null && legalData.getTerm(key).getContent() != null) {
                    RXSdkUI.getInstance()
                            .userPrivacyPolicy(activity, "用户协议和隐私政策", legalData.getTerm(key).getContent(), callback)
                            .show();
                } else {
                    ToastUtils.showToast(activity, "未配置相关法务信息");
                }
                break;
            case "permissions":
                RXSdkUI.getInstance().permissionUI(activity, legalData, callback).show();
                break;
            case "real_name":
                if (legalData.getMinor().getRealName() != null) {
                    RXSdkUI.getInstance()
                            .limitUI(activity, legalData.getMinor().getRealName().getTitle(),
                                    legalData.getMinor().getRealName().getContent(), "确认关闭", callback)
                            .show();
                }
                break;
            default:
                RXSdkUI.getInstance().statementUI(activity, legalData, key).show();
                break;
        }
    }

    /**
     * 读取配置并初始化 Bugly
     */
    public static void readConfig(Application context) {
        sApplication = context;
        BuglyManager.initBugly(context, "3152e956b1");
        GlobalConfig.ConfigBean config = GlobalConfig.getConfig(context);
        RXLogger.i(TAG, "Config loaded: " + config.toJson());
    }

    /**
     * 设置 SDK 基础 URL
     */
    public static void initSdkBaseUrl() {
        RuiXueSdk.sdkBaseUrls(GlobalConfig.getConfig().getBaseUrl());
    }

    /**
     * 手动设置初始化参数
     */
    public static void init(@NonNull String cpid, @NonNull String appid, 
                            @NonNull String channelid, String baseUrl) {
        GlobalConfig.ConfigBean config = GlobalConfig.getConfig();
        config.setProductId(appid);
        config.setCpId(cpid);
        config.setChannelId(channelid);
        config.setBaseUrl(baseUrl);
    }

    /**
     * 应用 attachBaseContext 回调
     */
    public static void attachBaseContext(Context base) {
        RuiXueSdk.attachBaseContext(base);
    }

    /**
     * 配置变更回调
     */
    public static void onConfigurationChanged(@NonNull Configuration newConfig) {
        // 预留扩展
    }

    // ==================== 分享相关 ====================

    /**
     * 获取分享参数
     */
    @NonNull
    public static Map<String, Object> getShareParams() {
        Map<String, Object> params = new HashMap<>();
        params.put("auto_share", true);
        params.put("platform", "wechat");
        params.put("material_type", "link");
        params.put("appid", GlobalConfig.getWxAppId());
        params.put("title", "分享标题");
        params.put("content", "分享描述");
        params.put("image", "https://cloudimg2.weile.com/channelshare/20210402/1617334963.png");
        params.put("url", "https://developers.weixin.qq.com/doc/oplatform/Mobile_App/Share_and_Favorites/Android.html");
        return params;
    }

    /**
     * 显示分享 UI
     */
    public static void showShareUI(Activity activity, RXJSONCallback callback) {
        RXSdkUI.getInstance().showShareUI(activity, "lure", getShareParams(), callback);
    }

    // ==================== WebView 相关 ====================

    /**
     * 打开默认 URL（兼容旧接口）
     *
     * @param activity   活动上下文
     * @param useWebView 是否使用内置 WebView
     */
    public static void openUrl(Activity activity, boolean useWebView) {
        openUrl(activity, "file:///android_asset/xieyi.html", useWebView);
    }

    /**
     * 打开 URL
     *
     * @param activity  活动上下文
     * @param url       要打开的 URL
     * @param useWebView 是否使用内置 WebView
     */
    public static void openUrl(Activity activity, String url, boolean useWebView) {
        if (useWebView) {
            RXWebView webView = RXWebView.create(activity, url)
                    .setBackEnable(true)
                    .setTitleBackgroundColor(Color.parseColor("#E0FFFC"));
            webView.show();

            String cookie = CookieManager.getInstance().getCookie(url);
            RXLogger.i(TAG, "Cookie: " + cookie);
        } else {
            RuiXueSdk.openURL(url);
        }
    }

    /**
     * 打开本地协议页面
     */
    public static void openLocalAgreement(Activity activity) {
        openUrl(activity, "file:///android_asset/xieyi.html", true);
    }
}
