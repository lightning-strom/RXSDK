package com.ruixue.rxsdkdemo;

import android.app.Activity;
import android.util.Log;

import com.ruixue.RXRequestCallback;
import com.ruixue.RXRequestCallback;
import com.ruixue.RXSdkInitConfig;
import com.ruixue.openapi.RXSDK;

import org.json.JSONObject;

import java.util.Collections;

/**
 * RXSDK 管理类
 * 
 * 负责管理 SDK 的初始化、登录、支付等接口调用
 * 与 UI 代码分离，便于维护和测试
 * 
 * API 文档关联：
 * - 初始化: RXSDK-Doc/android/api/rxsdk_api.md
 * - 登录:   RXSDK-Doc/android/api/passport_api.md
 * - 支付:   RXSDK-Doc/android/api/rxsdk_api.md#支付功能
 * - 分享:   RXSDK-Doc/android/api/rxsdk_api.md#分享功能
 */
public class RXSDKManager {

    private static volatile RXSDKManager sInstance;
    
    // 环境类型
    public static final int ENV_DOMESTIC = 0;   // 国内环境
    public static final int ENV_OVERSEAS = 1;   // 海外环境
    public static final int DEFAULT_ENV = ENV_DOMESTIC;
    
    public static final String[][] SUPPORTED_ENVS = {
        {"domestic", "国内"},
        {"overseas", "海外"}
    };
    
    // 国内环境默认参数
    public static final String DOMESTIC_CPID = "114";
    public static final String DOMESTIC_PRODUCT_ID = "1002";
    public static final String DOMESTIC_CHANNEL_ID = "100";
    public static final String DOMESTIC_BASE_URL = "https://cn-api-test.ruixueyun.com/";
    
    // 海外环境默认参数
    public static final String OVERSEAS_CPID = "119";
    public static final String OVERSEAS_PRODUCT_ID = "SDKOS";
    public static final String OVERSEAS_CHANNEL_ID = "AndroidOS";
    public static final String OVERSEAS_BASE_URL = "https://os-api-test.ruixueyun.com/";
    
    // 默认初始化参数（根据当前环境动态获取）
    public static final String DEFAULT_CPID = DOMESTIC_CPID;
    public static final String DEFAULT_PRODUCT_ID = DOMESTIC_PRODUCT_ID;
    public static final String DEFAULT_CHANNEL_ID = DOMESTIC_CHANNEL_ID;
    public static final String DEFAULT_BASE_URL = DOMESTIC_BASE_URL;
    
    // 支持的语言列表
    public static final String[][] SUPPORTED_LANGUAGES = {
        {"zh-Hans", "简体中文"},
        {"zh-Hant", "繁体中文"},
        {"en", "英语"},
        {"ja", "日语"},
        {"th", "泰语"},
        {"vi", "越南语"},
        {"fil", "菲律宾语"},
        {"ar", "阿拉伯语"}
    };
    
    // 默认语言
    public static final String DEFAULT_LANGUAGE = "zh-Hans";
    
    // 屏幕方向
    public static final int ORIENTATION_PORTRAIT = 0;   // 竖屏
    public static final int ORIENTATION_LANDSCAPE = 1;  // 横屏
    public static final int DEFAULT_ORIENTATION = ORIENTATION_PORTRAIT;
    
    public static final String[][] SUPPORTED_ORIENTATIONS = {
        {"portrait", "竖屏"},
        {"landscape", "横屏"}
    };
    
    // SDK 状态
    private boolean isInitialized = false;
    
    // 当前初始化参数
    private String currentCpid;
    private String currentProductId;
    private String currentChannelId;
    private String currentBaseUrl;
    
    // 当前语言配置
    private String currentLanguage = DEFAULT_LANGUAGE;
    
    // 当前屏幕方向
    private int currentOrientation = DEFAULT_ORIENTATION;
    
    // 当前环境
    private int currentEnv = DEFAULT_ENV;
    
    private RXSDKManager() {}
    
    /**
     * 获取单例实例
     */
    public static RXSDKManager getInstance() {
        if (sInstance == null) {
            synchronized (RXSDKManager.class) {
                if (sInstance == null) {
                    sInstance = new RXSDKManager();
                }
            }
        }
        return sInstance;
    }
    
    // ==================== 初始化相关 ====================
    
    /**
     * 使用默认参数初始化 SDK（根据当前环境）
     * 
     * @param activity 当前 Activity
     * @param callback 初始化回调
     */
    public void initWithDefaultParams(Activity activity, InitCallback callback) {
        initSDK(activity, getEnvDefaultCpid(), getEnvDefaultProductId(), 
                getEnvDefaultChannelId(), getEnvDefaultBaseUrl(), callback);
    }
    
    /**
     * 使用自定义参数初始化 SDK
     * 
     * @param activity   当前 Activity
     * @param cpid       瑞雪分配的唯一 ID
     * @param productId  产品 ID
     * @param channelId  渠道 ID
     * @param baseUrl    API 域名
     * @param callback   初始化回调
     */
    public void initSDK(Activity activity, String cpid, String productId, 
                        String channelId, String baseUrl, InitCallback callback) {
        
        // 保存当前参数
        this.currentCpid = cpid;
        this.currentProductId = productId;
        this.currentChannelId = channelId;
        this.currentBaseUrl = baseUrl;
        
        // 创建初始化配置
        RXSdkInitConfig config = new RXSdkInitConfig(
                cpid,
                productId,
                channelId,
                Collections.singletonList(baseUrl),
                
                new RXRequestCallback() {
                    @Override
                    public void onResponse(JSONObject response) {
                        int code = response.optInt("code", -1);
                        if (code == 0) {
                            // 初始化成功
                            Log.d("RXSDK", "初始化成功: " + response);
                            isInitialized = true;
                        } else {
                            // 初始化失败
                            String msg = response.optString("msg", "未知错误");
                            Log.e("RXSDK", "初始化失败: " + msg);
                            isInitialized = false;
                        }
                        if (callback != null) {
                            callback.onSuccess(response);
                        }
                    }
                }
        );

        // 可选配置
        config.setAutoInitThird(true);   // 自动初始化第三方 SDK
        config.setUsePrivacy(true);      // 展示隐私协议弹窗
        config.setLogEnable(true);       // 开启日志（调试阶段）

        // 初始化 SDK
        RXSDK.initialize(activity, config);
    }
    
    /**
     * 重置 SDK 状态
     */
    public void reset() {
        isInitialized = false;
        currentCpid = null;
        currentProductId = null;
        currentChannelId = null;
        currentBaseUrl = null;
    }
    
    /**
     * 获取 SDK 是否已初始化
     */
    public boolean isInitialized() {
        return isInitialized;
    }
    
    // ==================== 登录相关 ====================
    
    /**
     * 游客登录
     * 
     * @param callback 登录回调
     */
    public void loginAsGuest(RXRequestCallback callback) {
        if (!checkInitialized()) return;
        // TODO: 调用 RuiXueSdk.login() 游客登录
    }
    
    /**
     * 账号密码登录
     * 
     * @param username 用户名
     * @param password 密码
     * @param callback 登录回调
     */
    public void loginWithAccount(String username, String password, RXRequestCallback callback) {
        if (!checkInitialized()) return;
        // TODO: 调用 RuiXueSdk.login() 账号密码登录
    }
    
    /**
     * 验证码登录
     * 
     * @param phone      手机号
     * @param captcha    验证码
     * @param callback   登录回调
     */
    public void loginWithCaptcha(String phone, String captcha, RXRequestCallback callback) {
        if (!checkInitialized()) return;
        // TODO: 调用 RuiXueSdk.login() 验证码登录
    }
    
    // ==================== 用户信息相关 ====================
    
    /**
     * 获取用户信息
     * 
     * @param callback 回调
     */
    public void getUserInfo(RXRequestCallback callback) {
        if (!checkInitialized()) return;
        // TODO: 调用 RuiXueSdk.getUserInfo()
    }
    
    // ==================== 支付相关 ====================
    
    /**
     * 发起支付
     * 
     * @param productId  商品 ID
     * @param orderId    订单号
     * @param callback   支付回调
     */
    public void pay(String productId, String orderId, RXRequestCallback callback) {
        if (!checkInitialized()) return;
        // TODO: 调用 RuiXueSdk.pay()
    }
    
    // ==================== 分享相关 ====================
    
    /**
     * 分享
     * 
     * @param platform 分享平台
     * @param callback 分享回调
     */
    public void share(String platform, RXRequestCallback callback) {
        if (!checkInitialized()) return;
        // TODO: 调用 RuiXueSdk.share()
    }
    
    // ==================== 埋点相关 ====================
    
    /**
     * 数据埋点
     * 
     * @param event      事件名
     * @param properties 属性
     */
    public void track(String event, JSONObject properties) {
        if (!checkInitialized()) return;
        // TODO: 调用 RuiXueSdk.track()
    }
    
    // ==================== 其他功能 ====================
    
    /**
     * 打开反馈页面
     */
    public void openFeedback() {
        if (!checkInitialized()) return;
        // TODO: 调用 RuiXueSdk.openFeedback()
    }
    
    /**
     * 申请注销账号
     * 
     * @param callback 回调
     */
    public void deregister(RXRequestCallback callback) {
        if (!checkInitialized()) return;
        // TODO: 调用 RuiXueSdk.deregister()
    }
    
    // ==================== 辅助方法 ====================
    
    private boolean checkInitialized() {
        if (!isInitialized) {
            throw new IllegalStateException("SDK 未初始化，请先调用 initSDK()");
        }
        return true;
    }
    
    // ==================== 语言设置 ====================
    
    /**
     * 设置 SDK 语言
     * 
     * @param languageCode 语言代码（如 zh-Hans, en, ja 等）
     */
    public void setLanguage(String languageCode) {
        this.currentLanguage = languageCode;
        // TODO: 调用 RuiXueSdk.setLanguage(languageCode);
    }
    
    /**
     * 获取当前语言
     */
    public String getCurrentLanguage() {
        return currentLanguage;
    }
    
    /**
     * 获取当前语言显示名称
     */
    public String getCurrentLanguageDisplayName() {
        for (String[] lang : SUPPORTED_LANGUAGES) {
            if (lang[0].equals(currentLanguage)) {
                return lang[1];
            }
        }
        return SUPPORTED_LANGUAGES[0][1]; // 默认简体中文
    }
    
    /**
     * 获取语言索引
     */
    public int getLanguageIndex() {
        for (int i = 0; i < SUPPORTED_LANGUAGES.length; i++) {
            if (SUPPORTED_LANGUAGES[i][0].equals(currentLanguage)) {
                return i;
            }
        }
        return 0;
    }
    
    // ==================== 屏幕方向设置 ====================
    
    /**
     * 设置屏幕方向
     * 
     * @param orientation 屏幕方向（ORIENTATION_PORTRAIT 或 ORIENTATION_LANDSCAPE）
     */
    public void setOrientation(int orientation) {
        this.currentOrientation = orientation;
    }
    
    /**
     * 获取当前屏幕方向
     */
    public int getCurrentOrientation() {
        return currentOrientation;
    }
    
    /**
     * 获取当前屏幕方向显示名称
     */
    public String getCurrentOrientationDisplayName() {
        if (currentOrientation < SUPPORTED_ORIENTATIONS.length) {
            return SUPPORTED_ORIENTATIONS[currentOrientation][1];
        }
        return SUPPORTED_ORIENTATIONS[0][1];
    }
    
    /**
     * 是否为竖屏
     */
    public boolean isPortrait() {
        return currentOrientation == ORIENTATION_PORTRAIT;
    }
    
    // ==================== 环境设置 ====================
    
    /**
     * 设置环境
     * 
     * @param env 环境类型（ENV_DOMESTIC 或 ENV_OVERSEAS）
     */
    public void setEnv(int env) {
        this.currentEnv = env;
    }
    
    /**
     * 获取当前环境
     */
    public int getCurrentEnv() {
        return currentEnv;
    }
    
    /**
     * 获取当前环境显示名称
     */
    public String getCurrentEnvDisplayName() {
        if (currentEnv < SUPPORTED_ENVS.length) {
            return SUPPORTED_ENVS[currentEnv][1];
        }
        return SUPPORTED_ENVS[0][1];
    }
    
    /**
     * 是否为国内环境
     */
    public boolean isDomestic() {
        return currentEnv == ENV_DOMESTIC;
    }
    
    /**
     * 获取当前环境的默认 CPID
     */
    public String getEnvDefaultCpid() {
        return isDomestic() ? DOMESTIC_CPID : OVERSEAS_CPID;
    }
    
    /**
     * 获取当前环境的默认 Product ID
     */
    public String getEnvDefaultProductId() {
        return isDomestic() ? DOMESTIC_PRODUCT_ID : OVERSEAS_PRODUCT_ID;
    }
    
    /**
     * 获取当前环境的默认 Channel ID
     */
    public String getEnvDefaultChannelId() {
        return isDomestic() ? DOMESTIC_CHANNEL_ID : OVERSEAS_CHANNEL_ID;
    }
    
    /**
     * 获取当前环境的默认 Base URL
     */
    public String getEnvDefaultBaseUrl() {
        return isDomestic() ? DOMESTIC_BASE_URL : OVERSEAS_BASE_URL;
    }
    
    // ==================== Getter ====================
    
    public String getCurrentCpid() {
        return currentCpid;
    }
    
    public String getCurrentProductId() {
        return currentProductId;
    }
    
    public String getCurrentChannelId() {
        return currentChannelId;
    }
    
    public String getCurrentBaseUrl() {
        return currentBaseUrl;
    }
    
    // ==================== 回调接口 ====================
    
    /**
     * 初始化回调
     */
    public interface InitCallback {
        void onSuccess(JSONObject response);
    }
}
