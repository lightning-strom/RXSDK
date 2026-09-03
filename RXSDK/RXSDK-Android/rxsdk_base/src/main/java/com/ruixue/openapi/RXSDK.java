package com.ruixue.openapi;

import android.app.Activity;
import android.content.Context;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RXRequestCallback;
import com.ruixue.base.SdkInfo;
import com.ruixue.billing.HQParams;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXException;
import com.ruixue.base.TrackDataMgr;
import com.ruixue.internal.DeviceUtils;
import com.ruixue.legal.AntiAddictDelegate;
import com.ruixue.legal.PrivacyCallback;
import com.ruixue.passport.AccessToken;
import com.ruixue.passport.LoginParams;
import com.ruixue.passport.RegisterParams;
import com.ruixue.passport.UserInfoParams;

import org.json.JSONObject;

import java.util.List;
import java.util.Map;

/**
 * 瑞雪 SDK 新接口入口类
 * 
 * <p>
 * 本类提供优化后的接口实现，使用参数对象和统一的回调机制。
 * </p>
 * <p>
 * 接口函数名保持不变，但优化了参数结构和回调类型。
 * </p>
 * 
 * <p>
 * 设计原则：
 * </p>
 * <ul>
 * <li>方法名保持不变（与旧接口一致）</li>
 * <li>使用参数对象封装多个参数（提高类型安全）</li>
 * <li>使用 RXRequestCallback 统一回调机制</li>
 * <li>内部委托给 RXSdkApi.getInstance() 实现</li>
 * </ul>
 * 
 * @author ROC LEE
 * @date 2026/1/19
 */
public class RXSDK {

    private static volatile RXSDK INSTANCE;

    private final RXSdkApi api;

    private RXSDK() {
        this.api = RXSdkApi.getInstance();

    }

    /**
     * 获取 RXSDK 单例实例
     * 
     * @return RXSDK 实例
     */
    @NonNull
    public static RXSDK getInstance() {
        if (INSTANCE == null) {
            synchronized (RXSDK.class) {
                if (INSTANCE == null) {
                    INSTANCE = new RXSDK();
                }
            }
        }
        return INSTANCE;
    }

    // ==================== 回调转换辅助方法 ====================

    /**
     * 将 RXRequestCallback 转换为 RXJSONCallback
     * 用于内部委托给旧接口实现
     */
    @NonNull
    private RXJSONCallback convertCallback(@Nullable RXRequestCallback callback) {
        if (callback == null) {
            return RXJSONCallback.EMPTY;
        }

        return new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                // RXRequestCallback 的 onSuccess 会自动转换为 onResponse
                // 这里需要手动构造响应
                JSONObject response = new JSONObject();
                try {
                    response.put("code", 0);
                    if (data != null) {
                        response.put("data", data);
                    }
                } catch (Exception e) {
                    // ignore
                }
                callback.onResponse(response);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                callback.onResponse(cause);
            }

            @Override
            public void onError(RXException e) {
                callback.onError(e);
            }
        };
    }

    // ==================== SDK 基础功能 ====================

    /**
     * 获取底层 API 对象
     * 
     * <p>
     * 用于直接访问底层 {@link RXSdkApi} 接口，适合需要访问底层实现的场景。
     * </p>
     * 
     * <p>
     * 调用方式：{@code RXSDK.getApi().接口名()}
     * </p>
     * 
     * @return RXSdkApi 实例
     */
    @NonNull
    public static RXSdkApi getApi() {
        return RXSdkApi.getInstance();
    }

    /**
     * 获取全局 Context
     * 
     * @return 应用 Context
     */
    @NonNull
    public static Context getContext() {
        return com.ruixue.RuiXueSdk.getContext();
    }

    /**
     * 获取当前 Activity
     * 
     * @return 当前前台 Activity，可能为 null
     */
    @Nullable
    public static Activity getCurrentActivity() {
        return com.ruixue.RuiXueSdk.getCurrentActivity();
    }

    /**
     * 获取产品 ID
     * 
     * @return 瑞雪 productId
     */
    @NonNull
    public static String getProductId() {
        return com.ruixue.RuiXueSdk.getProductId();
    }

    /**
     * 获取渠道 ID
     * 
     * @return 瑞雪 channelId
     */
    @NonNull
    public static String getChannelId() {
        return com.ruixue.RuiXueSdk.getChannelId();
    }

    /**
     * 设置渠道 ID
     * 
     * @param channelId 渠道 ID
     */
    public static void setChannelId(@NonNull String channelId) {
        com.ruixue.RuiXueSdk.setChannelId(channelId);
    }

    /**
     * 获取子渠道 ID
     * 
     * @return 子渠道 ID
     */
    @Nullable
    public static String getSubChannelId() {
        return com.ruixue.RuiXueSdk.getSubChannelId();
    }

    /**
     * 获取 CP ID（商户 ID）
     * 
     * @return 瑞雪平台 CPID
     */
    @NonNull
    public static String getCpId() {
        return com.ruixue.RuiXueSdk.getCpId();
    }

    /**
     * 获取 SDK 版本号
     * 
     * @return SDK 版本号字符串
     */
    @NonNull
    public static String getSdkVersion() {
        return com.ruixue.RuiXueSdk.getSdkVersion();
    }

    /**
     * 获取 SDK 版本 Code
     * 
     * @return SDK 版本 Code
     */
    @NonNull
    public static String getSdkVersionCode() {
        return com.ruixue.RuiXueSdk.getSdkVersionCode();
    }

    /**
     * 是否为 OAS 版本
     * 
     * @return true 为 OAS 版本
     */
    public static boolean isOasVersion() {
        return com.ruixue.RuiXueSdk.isOasVersion();
    }

    /**
     * 设置自定义错误码信息
     * 
     * @param customErrorMsg 自定义错误码字典
     */
    public static void setErrorMsg(@NonNull Map<String, Map<String, String>> customErrorMsg) {
        com.ruixue.RuiXueSdk.setErrorMsg(customErrorMsg);
    }

    /**
     * 配置埋点上报参数
     * 
     * @param reportTime 上报时间间隔（秒）
     * @param maxCount   最大缓存条数
     */
    public static void trackConfig(int reportTime, int maxCount) {
        com.ruixue.RuiXueSdk.trackConfig(reportTime, maxCount);
    }

    /**
     * 设置密码强度
     * 
     * @param passwordStrength 密码强度枚举
     */
    public static void setPasswordStrength(@NonNull PasswordStrength passwordStrength) {
        com.ruixue.RuiXueSdk.setPasswordStrength(passwordStrength);
    }

    /**
     * 设置密码强度
     * 
     * @param passwordStrength 密码强度值
     */
    public static void setPasswordStrength(int passwordStrength) {
        com.ruixue.RuiXueSdk.setPasswordStrength(passwordStrength);
    }

    /**
     * 设置密码正则表达式
     * 
     * @param pwdPattern 密码正则表达式
     */
    public static void setPwdPattern(@NonNull String pwdPattern) {
        com.ruixue.RuiXueSdk.setPwdPattern(pwdPattern);
    }

    /**
     * 设置激活信息
     * 
     * @param activatedMap 激活信息 Map
     */
    public static void setActivatedMap(@NonNull Map<String, Object> activatedMap) {
        com.ruixue.RuiXueSdk.setActivatedMap(activatedMap);
    }

    /**
     * 设置公共属性（用于埋点）
     * 
     * @param publicProperties 公共属性 Map
     */
    public static void setPublicProperties(@NonNull Map<String, Object> publicProperties) {
        TrackDataMgr.getInstance().setPropertiesMap(publicProperties);
    }

    /**
     * 更新公共属性
     * 
     * @param key   属性 key
     * @param value 属性值
     */
    public static void updatePublicProperties(@NonNull String key, @Nullable Object value) {
        TrackDataMgr.getInstance().putPropertiesMap(key, value);
    }

    /**
     * 删除公共属性
     * 
     * @param key 属性 key
     */
    public static void deletePublicProperties(@NonNull String key) {
        TrackDataMgr.getInstance().delPropertiesMap(key);
    }

    /**
     * 设置 SDK 基础 URL 列表
     * 
     * @param urls URL 列表
     */
    public static void sdkBaseUrls(@NonNull List<String> urls) {
        com.ruixue.RuiXueSdk.sdkBaseUrls(urls);
    }

    /**
     * 获取基础 URL 列表
     * 
     * @return URL 列表
     */
    @NonNull
    public static List<String> getBaseUrls() {
        return com.ruixue.RuiXueSdk.getBaseUrls();
    }

    /**
     * 设置埋点环境
     * 
     * @param env 埋点环境
     */
    public static void setTrackEnv(boolean env) {
        com.ruixue.RuiXueSdk.setTrackEnv(env);
    }

    /**
     * 设置语言
     * 
     * @param activity Activity
     * @param language 语言码
     */
    public static void setLanguage(@NonNull Activity activity, @NonNull String language) {
        com.ruixue.RuiXueSdk.setLanguage(activity, language);
    }

    /**
     * 设置地区
     * 
     * @param area 地区码
     */
    public static void setArea(@NonNull String area) {
        com.ruixue.RuiXueSdk.setArea(area);
    }

    /**
     * 获取当前语言
     * 
     * @return 语言码
     */
    @NonNull
    public static String getLanguage() {
        return com.ruixue.RuiXueSdk.getLanguage();
    }

    /**
     * 获取 SDK 日志
     * 
     * @return 日志列表
     */
    @NonNull
    public static List<String> getSDKLog() {
        return com.ruixue.RuiXueSdk.getSDKLog();
    }

    /**
     * 设置日志配置
     * 
     * @param enable   是否启用
     * @param maxCount 最大日志条数
     */
    public static void setLogConfig(boolean enable, int maxCount) {
        com.ruixue.RuiXueSdk.setLogConfig(enable, maxCount);
    }

    /**
     * 是否已登录
     * 
     * @return true 已登录
     */
    public static boolean isLoggedIn() {
        return com.ruixue.RuiXueSdk.isLoggedIn();
    }

    /**
     * 获取 WebView UserAgent
     * 
     * @return WebView UA 字符串
     */
    @NonNull
    public static String getWebViewUA() {
        return com.ruixue.RuiXueSdk.getWebViewUA();
    }

    /**
     * 获取设备码
     * 
     * @return 设备码
     */
    @NonNull
    public static String getDeviceCode() {
        return com.ruixue.RuiXueSdk.getDeviceCode();
    }

    /**
     * 设置屏幕截图禁用
     * 
     * @param activity Activity
     * @param disable  是否禁用
     */
    public static void setScreenCaptureDisable(@NonNull Activity activity, boolean disable) {
        com.ruixue.RuiXueSdk.setScreenCaptureDisable(activity, disable);
    }

    /**
     * 设置 OAID
     * 
     * @param oaid OAID 字符串
     */
    public static void setOAID(@NonNull String oaid) {
        com.ruixue.RuiXueSdk.setOAID(oaid);
    }

    /**
     * 获取剪贴板数据
     * 
     * @return 剪贴板内容
     */
    @Nullable
    public static String getClipboardData() {
        return com.ruixue.RuiXueSdk.getClipboardData();
    }

    /**
     * 获取设备 OAID
     * 
     * @return OAID 字符串
     */
    @Nullable
    public static String getDeviceOAID() {
        return com.ruixue.RuiXueSdk.getDeviceOAID();
    }

    /**
     * 禁止读取敏感信息（IMEI、MAC 地址等）
     * 
     * @param disabled 是否禁止
     */
    public static void disableReadSensitiveInfo(boolean disabled) {
        com.ruixue.RuiXueSdk.disableReadSensitiveInfo(disabled);
    }

    /**
     * 禁用 SDK 多语言切换（禁用后 SDK 不会修改应用的 Locale）
     *
     * @param disabled true=禁用多语言，false=启用多语言（默认）
     */
    public static void disableMultiLanguage(boolean disabled) {
        com.ruixue.RuiXueSdk.disableMultiLanguage(disabled);
    }

    /**
     * 获取 Android ID
     * 
     * @return Android ID
     */
    @Nullable
    public static String getAndroidID() {
        return com.ruixue.RuiXueSdk.getAndroidID();
    }

    /**
     * 获取客户端随机生成的 ID
     * 
     * @return Distinct ID
     */
    @NonNull
    public static String getDistinctId() {
        return com.ruixue.RuiXueSdk.getDistinctId();
    }

    /**
     * 获取登录方式
     * 
     * @return 登录方式字符串
     */
    @Nullable
    public static String getLoginMethod() {
        return com.ruixue.RuiXueSdk.getLoginMethod();
    }

    /**
     * 获取加密后的瑞雪 openid（二次登录时使用）
     * 
     * @return 加密后的 login_openid
     */
    @Nullable
    public static String getLoginOpenid() {
        return com.ruixue.RuiXueSdk.getLoginOpenid();
    }

    /**
     * 获取瑞雪 openid
     * 
     * @return openid
     */
    @Nullable
    public static String getOpenid() {
        return com.ruixue.RuiXueSdk.getOpenid();
    }

    /**
     * 打开 URL
     * 
     * @param url URL 地址
     * @return 是否成功
     */
    public static boolean openURL(@NonNull String url) {
        return com.ruixue.RuiXueSdk.openURL(url);
    }

    /**
     * 获取反馈日志对象 Key
     * 
     * @return 反馈日志 Key
     */
    @NonNull
    public static String getFeedbackObjectKey() {
        return com.ruixue.RuiXueSdk.getFeedbackObjectKey();
    }

    /**
     * 上报反馈日志（字节数组）
     * 
     * @param context  Context
     * @param data     日志数据
     * @param callback 回调接口
     */
    public static void reportFeedbackLog(@NonNull Context context, @NonNull byte[] data,
            @Nullable com.ruixue.RXJSONCallback callback) {
        com.ruixue.RuiXueSdk.reportFeedbackLog(context, data, callback);
    }

    /**
     * 上报反馈日志（文件路径）
     * 
     * @param context  Context
     * @param path     日志文件路径
     * @param callback 回调接口
     */
    public static void reportFeedbackLog(@NonNull Context context, @NonNull String path,
            @Nullable com.ruixue.RXJSONCallback callback) {
        com.ruixue.RuiXueSdk.reportFeedbackLog(context, path, callback);
    }

    // ==================== SDK 初始化 ====================

    /**
     * 初始化 SDK（使用 Activity）
     * 
     * <p>
     * 推荐在 Activity 的 onCreate 中调用此方法进行初始化。
     * </p>
     * 
     * @param activity 当前 Activity
     * @param config   初始化配置对象 {@link com.ruixue.RXSdkInitConfig}
     * 
     * @example
     * 
     *          <pre>
     *          {
     *              &#64;code
     *              RXSdkInitConfig config = new RXSdkInitConfig(
     *                      cpid, productId, channelId, baseUrlList,
     *                      new RXRequestCallback() {
     *                          &#64;Override
     *                          public void onResponse(JSONObject jsonObject) {
     *                              int code = jsonObject.optInt("code", -1);
     *                              if (code == 0) {
     *                                  // 初始化成功
     *                              }
     *                          }
     * 
     *                          @Override
     *                          public void onError(RXException e) {
     *                              // 初始化异常
     *                          }
     *                      });
     *              RXSDK.initialize(activity, config);
     *          }
     *          </pre>
     */
    public static void initialize(@NonNull Activity activity, @NonNull com.ruixue.RXSdkInitConfig config) {
        com.ruixue.RuiXueSdk.initialize(activity, config);
    }

    /**
     * 初始化 SDK（使用配置对象）
     * 
     * <p>
     * 适用于已在配置中设置 Activity 的场景。
     * </p>
     * 
     * @param config 初始化配置对象 {@link com.ruixue.RXSdkInitConfig}
     */
    public static void initialize(@NonNull com.ruixue.RXSdkInitConfig config) {
        com.ruixue.RuiXueSdk.initialize(config);
    }

    /**
     * 调用当前 Android 渠道库提供的通用能力。
     *
     * @param activity 当前 Activity
     * @param action   渠道 action，使用 {@link com.ruixue.RuiXueSdk} 中的
     *                 {@code CHANNEL_ACTION_*} 常量
     * @param params   action 参数，可为空
     * @param callback 结果回调，可为空
     */
    public static void invokeChannelAction(@NonNull Activity activity, @NonNull String action,
            @Nullable Map<String, Object> params, @Nullable RXJSONCallback callback) {
        com.ruixue.RuiXueSdk.invokeChannelAction(activity, action, params, callback);
    }

    /**
     * 获取 SDK 信息
     * 
     * @return SDK 信息
     */
    @NonNull
    public SdkInfo getSdkInfo() {
        return api.getSdkInfo();
    }

    /**
     * 获取渠道信息
     * 
     * @return 渠道标识
     */
    @NonNull
    public String getChannel() {
        return api.getChannel();
    }

    /**
     * 设置防沉迷代理
     * 
     * @param antiAddictDelegate 防沉迷代理
     */
    public void setupAddictDelegate(@Nullable AntiAddictDelegate antiAddictDelegate) {
        api.setupAddictDelegate(antiAddictDelegate);
    }

    /**
     * 跳转到应用商店
     * 
     * @param activity Activity
     * @return 是否成功
     */
    public boolean jumpToAppStore(@NonNull Activity activity) {
        return api.jumpToAppStore(activity);
    }

    /**
     * 同意隐私政策
     * 
     * @param context         Context
     * @param privacyCallback 隐私回调
     */
    public void setPrivacyAgree(@NonNull Context context, @Nullable PrivacyCallback privacyCallback) {
        api.setPrivacyAgree(context, privacyCallback);
    }

    /**
     * 同意隐私政策
     * 
     * @param context         Context
     * @param isAgree         是否同意
     * @param privacyCallback 隐私回调
     */
    public void setPrivacyAgree(@NonNull Context context, boolean isAgree, @Nullable PrivacyCallback privacyCallback) {
        api.setPrivacyAgree(context, isAgree, privacyCallback);
    }

    /**
     * 是否已同意隐私政策
     * 
     * @return 是否已同意
     */
    public boolean isAgreedPrivacy() {
        return api.isAgreedPrivacy();
    }

    /**
     * 创建自定义接口请求
     * 
     * @param api     接口路径
     * @param bodyMap 接口参数
     * @return 请求对象
     */
    @NonNull
    public IRXRequest createRequest(@NonNull String api, @NonNull Map<String, Object> bodyMap) {
        return this.api.createRequest(api, bodyMap);
    }

    // ==================== 通行证相关接口 ====================

    /**
     * 用户登录
     * 
     * <p>
     * 方法名保持不变，使用 LoginParams 参数对象优化结构
     * </p>
     * 
     * @param activity Activity（可选，某些登录方式需要）
     * @param params   登录参数
     * @param callback 回调接口，成功时返回登录信息，失败时返回错误码和错误信息
     *                 回调在主线程执行
     */
    public void login(@Nullable Activity activity, @NonNull LoginParams params, @NonNull RXRequestCallback callback) {
        if (activity == null) {
            // 某些登录方式需要 Activity，这里可以根据实际情况处理
            activity = com.ruixue.RuiXueSdk.getCurrentActivity();
        }
        // RXSdkApi 已有 login(Activity, LoginParams, RXJSONCallback) 方法
        ((RXSdkApi) api).login(activity, params, convertCallback(callback));
    }

    /**
     * 用户登录（简化版本，使用默认 Activity）
     *
     * @param params   登录参数
     * @param callback 回调接口
     */
    public void login(@NonNull LoginParams params, @NonNull RXRequestCallback callback) {
        login(null, params, callback);
    }

    /**
     * 用户注册
     * 
     * @param params   注册参数
     * @param callback 回调接口
     */
    public void register(@NonNull RegisterParams params, @NonNull RXRequestCallback callback) {
        // RXSdkApi 已有 register(RegisterParams, RXJSONCallback) 方法
        ((RXSdkApi) api).register(params, convertCallback(callback));
    }

    /**
     * 用户登出
     * 
     * @param callback 登出回调
     */
    public void logout(@Nullable OnLogoutCallback callback) {
        api.logout(callback);
    }

    /**
     * 退出应用
     * 
     * @param activity Activity
     * @param callback 退出回调
     * @return 是否成功
     */
    public boolean exitApp(@NonNull Activity activity, @Nullable OnAppExitCallback callback) {
        return api.exitApp(activity, callback);
    }

    /**
     * 设置瑞雪 SDK 回调
     * 
     * @param callback 回调接口
     */
    public void setRuiXueSdkCallback(@Nullable RuiXueSdkCallback callback) {
        api.setRuiXueSdkCallback(callback);
    }

    /**
     * 设置子渠道 ID
     * 
     * @param subChannelId 子渠道 ID
     */
    public void setSubChannelId(@NonNull String subChannelId) {
        api.setSubChannelId(subChannelId);
    }

    /**
     * 获取用户信息
     * 
     * <p>
     * 方法名保持不变，使用 RXRequestCallback 优化回调
     * </p>
     * 
     * @param callback 回调接口，成功时返回用户信息，失败时返回错误码和错误信息
     *                 回调在主线程执行
     */
    public void getUserInfo(@NonNull RXRequestCallback callback) {
        api.getUserInfo(convertCallback(callback));
    }

    /**
     * 获取指定用户信息
     *
     * @param params   请求参数 map
     * @param callback 回调接口，成功时返回用户信息，失败时返回错误码和错误信息
     */
    public void getUserInfoByField(@NonNull Map<String, Object> params, @NonNull RXRequestCallback callback) {
        api.getUserInfoByField(params, convertCallback(callback));
    }

    /**
     * 更新用户信息
     * 
     * <p>
     * 方法名保持不变，使用 UserInfoParams 参数对象优化结构
     * </p>
     * 
     * @param params   用户信息参数
     * @param callback 回调接口
     */
    public void updateUserInfo(@NonNull UserInfoParams params, @NonNull RXRequestCallback callback) {
        // RXSdkApi 已有 updateUserInfo(UserInfoParams, RXJSONCallback) 方法
        ((RXSdkApi) api).updateUserInfo(params, convertCallback(callback));
    }

    /**
     * 发送验证码
     * 
     * @param type     验证码类型（手机或邮箱）
     * @param target   手机号或邮箱
     * @param purpose  用途
     * @param callback 回调接口
     * @return 是否成功发起请求
     */
    public boolean sendCaptcha(@NonNull CaptchaType type, @NonNull String target, @NonNull String purpose,
            @NonNull RXRequestCallback callback) {
        return api.sendCaptcha(type, target, purpose, convertCallback(callback));
    }

    /**
     * 验证验证码
     * 
     * @param type        验证码类型（手机或邮箱）
     * @param target      手机号或邮箱
     * @param purpose     用途
     * @param captchaCode 验证码
     * @param callback    回调接口
     * @return 是否成功发起请求
     */
    public boolean verifyCaptcha(@NonNull CaptchaType type, @NonNull String target, @NonNull String purpose,
            @NonNull String captchaCode, @NonNull RXRequestCallback callback) {
        return api.verifyCaptcha(type, target, purpose, captchaCode, convertCallback(callback));
    }

    /**
     * 修改密码
     * 
     * @param oldPassword 旧密码
     * @param newPassword 新密码
     * @param callback    回调接口
     */
    public void changePassword(@NonNull String oldPassword, @NonNull String newPassword,
            @NonNull RXRequestCallback callback) {
        api.changePassword(oldPassword, newPassword, convertCallback(callback));
    }

    /**
     * 实名认证
     * 
     * @param realname 姓名
     * @param idcard   身份证号
     * @param callback 回调接口
     */
    public void realAuth(@NonNull String realname, @NonNull String idcard, @NonNull RXRequestCallback callback) {
        api.realAuth(realname, idcard, convertCallback(callback));
    }

    /**
     * 实名认证（快速认证）
     * 
     * @param realname       姓名
     * @param idcard         身份证号
     * @param isFastRealAuth 是否使用快速认证
     * @param callback       回调接口
     */
    public void realAuth(@NonNull String realname, @NonNull String idcard, boolean isFastRealAuth,
            @NonNull RXRequestCallback callback) {
        api.realAuth(realname, idcard, isFastRealAuth, convertCallback(callback));
    }

    /**
     * 查询 IIFAA 认证结果。
     *
     * @param retryCount 310039 错误重试次数，传 0 不重试
     * @param callback   回调接口
     */
    public void getIIFAAResultWithRetryCount(int retryCount, @NonNull RXRequestCallback callback) {
        api.getIIFAAResultWithRetryCount(retryCount, convertCallback(callback));
    }

    /**
     * 查询 IIFAA 认证结果，相比 {@link #getIIFAAResultWithRetryCount(int, RXRequestCallback)} 新增 {@code source} 请求参数。
     *
     * @param source     业务场景，deregister 表示注销场景，传空表示正常认证逻辑
     * @param retryCount 310039 错误重试次数，传 0 不重试
     * @param callback   回调接口
     */
    public void getIIFAAResultWithSource(@Nullable String source, int retryCount, @NonNull RXRequestCallback callback) {
        api.getIIFAAResultWithSource(source, retryCount, convertCallback(callback));
    }

    /**
     * 获取 IIFAA 支付宝授权跳转地址。
     */
    public void getIIFAARedirectURL(@Nullable String appName, @Nullable String thirdPartSchema, @NonNull RXRequestCallback callback) {
        api.getIIFAARedirectURL(appName, thirdPartSchema, convertCallback(callback));
    }

    /**
     * 绑定手机
     * 
     * @param phone       手机号
     * @param password    密码
     * @param captchaCode 验证码
     * @param migrateArgs 迁移参数（可选）
     * @param callback    回调接口
     */
    public void bindPhone(@NonNull String phone, @NonNull String password, @NonNull String captchaCode,
            @Nullable Object migrateArgs, @NonNull RXRequestCallback callback) {
        api.bindPhone(phone, password, captchaCode, migrateArgs, convertCallback(callback));
    }

    /**
     * 修改手机号
     * 
     * @param newPhone        新手机号
     * @param newPhoneCaptcha 新手机号验证码
     * @param oldPhoneCaptcha 旧手机号验证码
     * @param migrateArgs     迁移参数（可选）
     * @param callback        回调接口
     */
    public void changePhone(@NonNull String newPhone, @NonNull String newPhoneCaptcha, @NonNull String oldPhoneCaptcha,
            @Nullable Object migrateArgs, @NonNull RXRequestCallback callback) {
        api.changePhone(newPhone, newPhoneCaptcha, oldPhoneCaptcha, migrateArgs, convertCallback(callback));
    }

    /**
     * 解绑手机
     * 
     * @param phone       手机号
     * @param captchaCode 验证码
     * @param callback    回调接口
     */
    public void unBindPhone(@NonNull String phone, @NonNull String captchaCode, @NonNull RXRequestCallback callback) {
        api.unBindPhone(phone, captchaCode, convertCallback(callback));
    }

    /**
     * 绑定邮箱
     * 
     * @param email       邮箱
     * @param password    密码
     * @param captchaCode 验证码
     * @param migrateArgs 迁移参数（可选）
     * @param callback    回调接口
     */
    public void bindEmail(@NonNull String email, @NonNull String password, @NonNull String captchaCode,
            @Nullable Object migrateArgs, @NonNull RXRequestCallback callback) {
        api.bindEmail(email, password, captchaCode, migrateArgs, convertCallback(callback));
    }

    /**
     * 解绑邮箱
     * 
     * @param email       邮箱
     * @param captchaCode 验证码
     * @param callback    回调接口
     */
    public void unBindEmail(@NonNull String email, @NonNull String captchaCode, @NonNull RXRequestCallback callback) {
        api.unBindEmail(email, captchaCode, convertCallback(callback));
    }

    /**
     * 申请注销账号
     * 
     * @param deregisterConfig 注销配置
     * @param callback         回调接口
     */
    public void deregister(@NonNull RXDeregisterConfig deregisterConfig, @NonNull RXRequestCallback callback) {
        api.deregister(deregisterConfig, convertCallback(callback));
    }

    /**
     * 撤销注销申请
     * 
     * @param callback 回调接口
     */
    public void deregisterCancel(@NonNull RXRequestCallback callback) {
        api.deregisterCancel(convertCallback(callback));
    }

    /**
     * 查询绑定账号列表
     * 
     * @param callback 回调接口
     */
    public void searchBindingAccounts(@NonNull RXRequestCallback callback) {
        api.searchBindingAccounts(convertCallback(callback));
    }

    // ==================== 社交相关接口 ====================

    /**
     * 上报/更新经纬度坐标
     * 
     * @param types     类型数组
     * @param longitude 经度
     * @param latitude  纬度
     * @param callback  回调接口
     */
    public void lbsUpdate(@NonNull String[] types, float longitude, float latitude,
            @NonNull RXRequestCallback callback) {
        api.lbsUpdate(types, longitude, latitude, convertCallback(callback));
    }

    /**
     * 获取指定半径内的其他用户信息
     * 
     * @param types     类型
     * @param longitude 经度
     * @param latitude  纬度
     * @param radius    半径
     * @param count     数量
     * @param page      页码
     * @param pageSize  每页大小
     * @param callback  回调接口
     */
    public void lbsRadius(@NonNull String types, float longitude, float latitude, float radius, int count, int page,
            int pageSize, @NonNull RXRequestCallback callback) {
        api.lbsRadius(types, longitude, latitude, radius, count, page, pageSize, convertCallback(callback));
    }

    /**
     * 删除经纬度坐标
     * 
     * @param types    类型数组
     * @param callback 回调接口
     */
    public void lbsDelete(@NonNull String[] types, @NonNull RXRequestCallback callback) {
        api.lbsDelete(types, convertCallback(callback));
    }

    /**
     * 设置用户自定义信息
     * 
     * @param custom   自定义信息
     * @param callback 回调接口
     */
    public void userSetCustom(@NonNull String custom, @NonNull RXRequestCallback callback) {
        api.userSetCustom(custom, convertCallback(callback));
    }

    /**
     * 添加自定义关系
     * 
     * @param target        对方 OpenID
     * @param types         关系类型 Map
     * @param targetRemarks 用户给 Target 设置的备注信息
     * @param userRemarks   Target 给用户设置的备注信息
     * @param callback      回调接口
     */
    public void relationAdd(@NonNull String target, @NonNull Map<String, Object> types, @Nullable String targetRemarks,
            @Nullable String userRemarks, @NonNull RXRequestCallback callback) {
        api.relationAdd(target, types, targetRemarks, userRemarks, convertCallback(callback));
    }

    /**
     * 删除自定义关系
     * 
     * @param target   对方 OpenID
     * @param types    关系类型 Map
     * @param callback 回调接口
     */
    public void relationDelete(@NonNull String target, @NonNull Map<String, Object> types,
            @NonNull RXRequestCallback callback) {
        api.relationDelete(target, types, convertCallback(callback));
    }

    /**
     * 更新自定义关系备注
     * 
     * @param target        对方 OpenID
     * @param type          关系类型
     * @param targetRemarks 备注信息
     * @param callback      回调接口
     */
    public void updateRemarks(@NonNull String target, @NonNull String type, @Nullable String targetRemarks,
            @NonNull RXRequestCallback callback) {
        api.updateRemarks(target, type, targetRemarks, convertCallback(callback));
    }

    /**
     * 判断两用户是否存在某自定义关系
     * 
     * @param target   对方 OpenID
     * @param type     关系类型
     * @param callback 回调接口
     */
    public void hasRelation(@NonNull String target, @NonNull String type, @NonNull RXRequestCallback callback) {
        api.hasRelation(target, type, convertCallback(callback));
    }

    /**
     * 获取自定义关系列表
     * 
     * @param type     关系类型
     * @param callback 回调接口
     */
    public void relationList(@NonNull String type, @NonNull RXRequestCallback callback) {
        api.relationList(type, convertCallback(callback));
    }

    /**
     * 添加好友
     * 
     * @param target        对方 OpenID
     * @param targetRemarks 用户给 Target 设置的备注信息
     * @param userRemarks   Target 给用户设置的备注信息
     * @param callback      回调接口
     */
    public void addFriends(@NonNull String target, @Nullable String targetRemarks, @Nullable String userRemarks,
            @NonNull RXRequestCallback callback) {
        api.addFriends(target, targetRemarks, userRemarks, convertCallback(callback));
    }

    /**
     * 删除好友
     * 
     * @param target   对方 OpenID
     * @param callback 回调接口
     */
    public void removeFriends(@NonNull String target, @NonNull RXRequestCallback callback) {
        api.removeFriends(target, convertCallback(callback));
    }

    /**
     * 更新好友备注
     * 
     * @param target        对方 OpenID
     * @param targetRemarks 备注信息
     * @param callback      回调接口
     */
    public void updateFriendRemarks(@NonNull String target, @Nullable String targetRemarks,
            @NonNull RXRequestCallback callback) {
        api.updateFriendRemarks(target, targetRemarks, convertCallback(callback));
    }

    /**
     * 判断两用户是否为好友
     * 
     * @param target   对方 OpenID
     * @param callback 回调接口
     */
    public void isFriend(@NonNull String target, @NonNull RXRequestCallback callback) {
        api.isFriend(target, convertCallback(callback));
    }

    /**
     * 获取好友列表
     * 
     * @param callback 回调接口
     */
    public void relationFriends(@NonNull RXRequestCallback callback) {
        api.relationFriends(convertCallback(callback));
    }

    /**
     * 增加用户分数
     * 
     * @param rankId   榜单 ID
     * @param score    增加的分数值
     * @param callback 回调接口
     */
    public void addScore(@NonNull String rankId, int score, @NonNull RXRequestCallback callback) {
        api.addScore(rankId, score, convertCallback(callback));
    }

    /**
     * 设置用户分数
     * 
     * @param rankId   榜单 ID
     * @param score    分数值
     * @param callback 回调接口
     */
    public void setScore(@NonNull String rankId, int score, @NonNull RXRequestCallback callback) {
        api.setScore(rankId, score, convertCallback(callback));
    }

    /**
     * 查询用户排名
     * 
     * @param rankId   榜单 ID
     * @param openId   目标用户 OpenID
     * @param callback 回调接口
     */
    public void queryUserRank(@NonNull String rankId, @NonNull String openId, @NonNull RXRequestCallback callback) {
        api.queryUserRank(rankId, openId, convertCallback(callback));
    }

    /**
     * 获取排行榜列表
     * 
     * @param rankId    榜单 ID
     * @param startRank 开始排名
     * @param endRank   结束排名
     * @param callback  回调接口
     */
    public void getRankList(@NonNull String rankId, int startRank, int endRank, @NonNull RXRequestCallback callback) {
        api.getRankList(rankId, startRank, endRank, convertCallback(callback));
    }

    /**
     * 获取好友排行榜列表
     * 
     * @param rankId   榜单 ID
     * @param callback 回调接口
     */
    public void friendsRank(@NonNull String rankId, @NonNull RXRequestCallback callback) {
        api.friendsRank(rankId, convertCallback(callback));
    }

    // ==================== 游戏区服相关接口 ====================

    /**
     * 查询游戏区服信息
     * 
     * @param areaId   区服 ID
     * @param callback 回调接口
     */
    public void searchGameAreaInfo(@NonNull String areaId, @NonNull RXRequestCallback callback) {
        api.searchGameAreaInfo(areaId, convertCallback(callback));
    }

    /**
     * 查询区服列表信息
     * 
     * @param callback 回调接口
     */
    public void searchGameAreaListInfo(@NonNull RXRequestCallback callback) {
        api.searchGameAreaListInfo(callback);
    }

    /**
     * 修改游戏区服信息
     * 
     * @param areaId     区服 ID
     * @param areaName   区服名称
     * @param areaStatus 区服状态
     * @param areaType   区服类型
     * @param extension  扩展字段
     * @param callback   回调接口
     */
    public void updateGameAreaInfo(@NonNull String areaId, @Nullable String areaName, @Nullable String areaStatus,
            @Nullable String areaType, @Nullable Map<String, Object> extension, @NonNull RXRequestCallback callback) {
        api.updateGameAreaInfo(areaId, areaName, areaStatus, areaType, extension, convertCallback(callback));
    }

    /**
     * 创建游戏区服
     * 
     * @param areaId     区服 ID
     * @param areaName   区服名称
     * @param areaStatus 区服状态
     * @param areaType   区服类型
     * @param extension  扩展字段
     * @param callback   回调接口
     */
    public void createGameArea(@NonNull String areaId, @NonNull String areaName, @NonNull String areaStatus,
            @NonNull String areaType, @Nullable Map<String, Object> extension, @NonNull RXRequestCallback callback) {
        api.createGameArea(areaId, areaName, areaStatus, areaType, extension, convertCallback(callback));
    }

    /**
     * 删除游戏区服
     * 
     * @param areaId   区服 ID
     * @param callback 回调接口
     */
    public void deleteGameArea(@NonNull String areaId, @NonNull RXRequestCallback callback) {
        api.deleteGameArea(areaId, convertCallback(callback));
    }

    /**
     * 创建游戏角色
     * 
     * @param areaId              区服 ID
     * @param characterName       角色名称
     * @param characterLevel      角色等级
     * @param characterFaction    角色阵营
     * @param characterProfession 角色职业
     * @param characterStatus     角色状态
     * @param characterType       角色类型
     * @param characterVipLevel   角色 VIP 等级
     * @param cpUserId            CP 用户 ID
     * @param extension           扩展字段
     * @param callback            回调接口
     */
    public void createGameCharacter(
            @NonNull String areaId,
            @NonNull String characterName,
            @NonNull String characterLevel,
            @Nullable String characterFaction,
            @Nullable String characterProfession,
            @Nullable String characterStatus,
            @Nullable String characterType,
            @Nullable String characterVipLevel,
            @NonNull String cpUserId,
            @Nullable Map<String, Object> extension,
            @NonNull RXRequestCallback callback) {
        api.createGameCharacter(
                areaId, characterName, characterLevel, characterFaction,
                characterProfession, characterStatus, characterType, characterVipLevel,
                cpUserId, extension, convertCallback(callback));
    }

    /**
     * 更新游戏角色信息
     * 
     * @param characterId         角色 ID
     * @param areaId              区服 ID
     * @param characterFaction    角色阵营
     * @param characterLevel      角色等级
     * @param characterName       角色名称
     * @param characterProfession 角色职业
     * @param characterStatus     角色状态
     * @param characterType       角色类型
     * @param characterVipLevel   角色 VIP 等级
     * @param cpUserId            CP 用户 ID
     * @param extension           扩展字段
     * @param callback            回调接口
     */
    public void updateGameCharacterInfo(
            @NonNull String characterId,
            @Nullable String areaId,
            @Nullable String characterFaction,
            @Nullable String characterLevel,
            @Nullable String characterName,
            @Nullable String characterProfession,
            @Nullable String characterStatus,
            @Nullable String characterType,
            @Nullable String characterVipLevel,
            @NonNull String cpUserId,
            @Nullable Map<String, Object> extension,
            @NonNull RXRequestCallback callback) {
        api.updateGameCharacterInfo(
                characterId, areaId, characterFaction, characterLevel, characterName,
                characterProfession, characterStatus, characterType, characterVipLevel,
                cpUserId, extension, convertCallback(callback));
    }

    /**
     * 删除游戏角色
     * 
     * @param areaId      区服 ID
     * @param characterId 角色 ID
     * @param cpUserId    CP 用户 ID
     * @param callback    回调接口
     */
    public void deleteGameCharacter(@NonNull String areaId, @NonNull String characterId, @NonNull String cpUserId,
            @NonNull RXRequestCallback callback) {
        api.deleteGameCharacter(areaId, characterId, cpUserId, convertCallback(callback));
    }

    /**
     * 查询账号下角色信息列表
     * 
     * @param cpUserId CP 用户 ID
     * @param callback 回调接口
     */
    public void searchGameCharacterListInfo(@NonNull String cpUserId, @NonNull RXRequestCallback callback) {
        api.searchGameCharacterListInfo(cpUserId, callback);
    }

    /**
     * 查询账号下某个区服下的角色信息列表
     * 
     * @param cpUserId CP 用户 ID
     * @param areaId   区服 ID
     * @param callback 回调接口
     */
    public void searchGameCharacterListInArea(@NonNull String cpUserId, @NonNull String areaId,
            @NonNull RXRequestCallback callback) {
        api.searchGameCharacterListInArea(cpUserId, areaId, callback);
    }

    /**
     * 查询具体角色信息
     * 
     * @param cpUserId    CP 用户 ID
     * @param areaId      区服 ID
     * @param characterId 角色 ID
     * @param callback    回调接口
     */
    public void searchGameCharacterInfo(@NonNull String cpUserId, @NonNull String areaId, @NonNull String characterId,
            @NonNull RXRequestCallback callback) {
        api.searchGameCharacterInfo(cpUserId, areaId, characterId, convertCallback(callback));
    }

    // ==================== 支付相关接口 ====================

    /**
     * 支付
     * 
     * @param activity  Activity
     * @param payParams 支付参数
     * @param callback  回调接口
     */
    public void pay(@NonNull Activity activity, @NonNull HQParams payParams, @NonNull RXRequestCallback callback) {
        api.pay(activity, payParams, convertCallback(callback));
    }

    // ==================== 分享相关接口 ====================

    /**
     * 分享（自定义配置）
     * 
     * @param activity Activity
     * @param config   分享配置
     * @param callback 回调接口
     */
    public void shareCustom(@NonNull Activity activity, @NonNull RXCustomShareConfig config,
            @NonNull RXRequestCallback callback) {
        api.shareCustom(activity, config, convertCallback(callback));
    }

    /**
     * 获取分享信息
     * 
     * @param shareConfig 分享配置
     * @param callback    回调接口
     */
    public void getShareInfo(@NonNull RXShareConfig shareConfig, @NonNull RXRequestCallback callback) {
        api.getShareInfo(shareConfig, convertCallback(callback));
    }

    /**
     * 分享
     * 
     * @param activity    Activity
     * @param shareConfig 分享配置
     * @param callback    回调接口
     */
    public void share(@NonNull Activity activity, @NonNull RXShareConfig shareConfig,
            @NonNull RXRequestCallback callback) {
        api.share(activity, shareConfig, convertCallback(callback));
    }

    // ==================== 其他接口 ====================

    /**
     * 更新游戏版本
     * 
     * @param body     请求体
     * @param callback 回调接口
     */
    public void updateGameVersion(@NonNull Map<String, Object> body, @NonNull RXRequestCallback callback) {
        api.updateGameVersion(body, callback);
    }

    /**
     * 设置游戏信息
     * 
     * @param roleId    角色 ID
     * @param regionTag 地区标签
     */
    public void setGameInfo(@NonNull String roleId, @NonNull String regionTag) {
        api.setGameInfo(roleId, regionTag);
    }

    /**
     * 设置游戏信息
     * 
     * @param gameInfo 游戏信息
     */
    public void setGameInfo(@NonNull GameInfo gameInfo) {
        api.setGameInfo(gameInfo);
    }

    /**
     * 查询角色信息
     * 
     * @param callback 回调接口
     */
    public void searchGameAccount(@NonNull RXRequestCallback callback) {
        api.searchGameAccount(callback);
    }

    /**
     * 获取客服未读消息数量
     * 
     * @param callback 回调接口
     */
    public void getServiceChatUnreadCount(@NonNull RXRequestCallback callback) {
        api.getServiceChatUnreadCount(callback);
    }

    /**
     * 清空客服未读消息数量
     * 
     * @param callback 回调接口
     */
    public void clearServiceChatUnreadCount(@NonNull RXRequestCallback callback) {
        api.clearServiceChatUnreadCount(callback);
    }

    // ==================== 补充缺失的接口 ====================

    /**
     * 重置密码
     * 
     * @param username    手机号
     * @param password    新密码
     * @param captchaCode 验证码
     * @param migrateArgs 迁移参数（可选）
     * @param callback    回调接口
     */
    public void resetPassword(@NonNull String username, @NonNull String password, @NonNull String captchaCode,
            @Nullable Object migrateArgs, @NonNull RXRequestCallback callback) {
        api.resetPassword(username, password, captchaCode, migrateArgs, convertCallback(callback));
    }

    /**
     * 查询账号
     * 
     * @param method     登录方式
     * @param devicecode 设备码
     * @param states     账号的位标记
     * @param callback   回调接口
     */
    public void searchHasAccounts(@NonNull String method, @NonNull String devicecode, int states,
            @NonNull RXRequestCallback callback) {
        api.searchHasAccounts(method, devicecode, states, convertCallback(callback));
    }

    /**
     * 修改邮箱
     * 
     * @param newEmail        新邮箱
     * @param newEmailCaptcha 新邮箱验证码
     * @param oldEmailCaptcha 旧邮箱验证码
     * @param migrateArgs     迁移参数（可选）
     * @param callback        回调接口
     */
    public void changeEmail(@NonNull String newEmail, @NonNull String newEmailCaptcha, @NonNull String oldEmailCaptcha,
            @Nullable Object migrateArgs, @NonNull RXRequestCallback callback) {
        api.changeEmail(newEmail, newEmailCaptcha, oldEmailCaptcha, migrateArgs, convertCallback(callback));
    }

    /**
     * 初始化第三方 SDK
     * 
     * @param activity Activity
     * @param hashMap  参数
     * @param callback 回调接口
     */
    public void initThirdSdk(@NonNull Activity activity, @Nullable Map<String, Object> hashMap,
            @NonNull RXRequestCallback callback) {
        api.initThirdSdk(activity, hashMap, convertCallback(callback));
    }

    /**
     * 检查快捷应用
     * 
     * @param callback 回调接口
     */
    public void checkQuickAp(@NonNull RXRequestCallback callback) {
        api.checkQuickAp(convertCallback(callback));
    }

    /**
     * 用户登录（Map 参数版本）
     * 
     * @param activity Activity
     * @param map      登录参数 Map
     * @param callback 回调接口
     */
    public void login(@Nullable Activity activity, @NonNull Map<String, Object> map,
            @NonNull RXRequestCallback callback) {
        api.login(activity, map, convertCallback(callback));
    }

    /**
     * 支付（Map 参数版本）
     * 
     * @param activity Activity
     * @param hashMap  支付参数 Map
     * @param callback 回调接口
     */
    public void pay(@NonNull Activity activity, @NonNull Map<String, Object> hashMap,
            @NonNull RXRequestCallback callback) {
        api.pay(activity, hashMap, convertCallback(callback));
    }

    /**
     * 向渠道合规系统上报充值金额（单位：分），建议在服务端到账确认后调用。
     */
    public void submitChannelPayment(int amountFen, @NonNull RXRequestCallback callback) {
        api.submitChannelPayment(amountFen, convertCallback(callback));
    }

    /**
     * 向渠道合规系统上报充值金额；override 可传 trade_no/order_no 匹配下单缓存。
     */
    public void submitChannelPayment(int amountFen, @Nullable Map<String, Object> override,
                                     @NonNull RXRequestCallback callback) {
        api.submitChannelPayment(amountFen, override, convertCallback(callback));
    }

    /**
     * 向渠道检查本次充值是否受限额约束（单位：分），建议在拉起支付前调用。
     */
    public void checkChannelPaymentLimit(@NonNull Activity activity, int amountFen,
                                         @NonNull RXRequestCallback callback) {
        api.checkChannelPaymentLimit(activity, amountFen, convertCallback(callback));
    }

    /**
     * 获取分享埋点数据
     * 
     * @param hashMap  参数 Map
     * @param callback 回调接口
     */
    public void getShareData(@NonNull Map<String, Object> hashMap, @NonNull RXRequestCallback callback) {
        api.getShareData(hashMap, convertCallback(callback));
    }

    /**
     * 获取分享埋点数据（带回调类型）
     * 
     * @param map      参数 Map
     * @param callback 回调接口
     */
    public void getShareData(@NonNull Map<String, Object> map,
            @NonNull com.ruixue.callback.RXCallback<com.ruixue.share.ShareDataResult> callback) {
        api.getShareData(map, callback);
    }

    /**
     * 分享上报
     * 
     * @param distinctId 用户唯一标识
     * @param properties 属性
     */
    public void shareReport(@NonNull String distinctId, @NonNull Map<String, Object> properties) {
        api.shareReport(distinctId, properties);
    }

    /**
     * 分享上报
     * 
     * @param shareDataResult 分享数据结果
     */
    public void shareReport(@NonNull com.ruixue.share.ShareDataResult shareDataResult) {
        api.shareReport(shareDataResult);
    }

    /**
     * 分享调度初始化
     * 
     * @param funcs    功能数组
     * @param callback 回调接口
     */
    public void shareSchedulingInit(@NonNull String[] funcs, @NonNull RXRequestCallback callback) {
        api.shareSchedulingInit(funcs, convertCallback(callback));
    }

    /**
     * 获取分享调度
     * 
     * @param func 功能
     * @return 调度 Map
     */
    @NonNull
    public Map<String, Object> getShareScheduling(@NonNull String... func) {
        return api.getShareScheduling(func);
    }

    /**
     * 分享调度上报
     * 
     * @param func            功能
     * @param platform        平台
     * @param region          地区
     * @param schedulingEvent 调度事件
     * @param schedulingType  调度类型
     * @param transmits       透传参数
     * @param properties      属性
     * @param callback        回调接口
     */
    public void shareSchedulingReport(@NonNull String func, @NonNull String platform, @NonNull String region,
            boolean schedulingEvent, @NonNull String schedulingType, @Nullable String transmits,
            @NonNull Map<String, Object> properties, @NonNull RXRequestCallback callback) {
        api.shareSchedulingReport(func, platform, region, schedulingEvent, schedulingType, transmits, properties,
                convertCallback(callback));
    }

    /**
     * 获取短链接
     * 
     * @param url      原始 URL
     * @param callback 回调接口
     */
    public void getShortUrl(@NonNull String url, @NonNull RXRequestCallback callback) {
        api.getShortUrl(url, convertCallback(callback));
    }

    /**
     * 法务接口
     * 
     * @param hashMap  参数
     * @param callback 回调接口
     */
    public void legal(@NonNull Map<String, Object> hashMap, @NonNull RXRequestCallback callback) {
        api.legal(hashMap, convertCallback(callback));
    }

    /**
     * 法务接口
     * 
     * @param callback 回调接口
     */
    public void legal(@NonNull RXRequestCallback callback) {
        api.legal(convertCallback(callback));
    }

    /**
     * 法务条款接口
     * 
     * @param hashMap  参数
     * @param callback 回调接口
     */
    public void legalTerms(@NonNull Map<String, Object> hashMap, @NonNull RXRequestCallback callback) {
        api.legalTerms(hashMap, convertCallback(callback));
    }

    /**
     * 法务条款接口
     * 
     * @param keys     条款 key
     * @param callback 回调接口
     */
    public void legalTerms(@NonNull String keys, @NonNull RXRequestCallback callback) {
        api.legalTerms(keys, convertCallback(callback));
    }

    /**
     * 更新应用
     * 
     * @param version  客户端版本号
     * @param region   地区码
     * @param queryMap 查询参数
     * @param callback 回调接口
     */
    public void updateApp(@NonNull String version, @NonNull String region, @Nullable Map<String, Object> queryMap,
            @NonNull com.ruixue.callback.RXStringCallback callback) {
        api.updateApp(version, region, queryMap, callback);
    }

    /**
     * 检查应用更新
     * 
     * @param version  客户端版本号
     * @param region   地区码
     * @param type     脚本类型
     * @param queryMap 查询参数
     * @param callback 回调接口
     */
    public void checkUpdateApp(@NonNull String version, @NonNull String region, @NonNull String type,
            @Nullable Map<String, Object> queryMap, @NonNull com.ruixue.callback.RXStringCallback callback) {
        api.checkUpdateApp(version, region, type, queryMap, callback);
    }

    /**
     * 活动版本检查
     * 
     * @param activityShortname    活动别名
     * @param activityVersion      客户端版本号
     * @param activityCheckVersion 优先检查这个版本
     * @param queryMap             查询参数
     * @param callback             回调接口
     */
    public void updateActivity(@NonNull String activityShortname, @NonNull String activityVersion,
            @Nullable String activityCheckVersion, @Nullable Map<String, Object> queryMap,
            @NonNull com.ruixue.callback.RXStringCallback callback) {
        api.updateActivity(activityShortname, activityVersion, activityCheckVersion, queryMap, callback);
    }

    /**
     * 游戏版本检查
     * 
     * @param gameId           游戏 ID
     * @param gameVersion      客户端版本号
     * @param gameCheckVersion 优先检查这个版本
     * @param queryMap         查询参数
     * @param callback         回调接口
     */
    public void updateGame(@NonNull String gameId, @NonNull String gameVersion, @Nullable String gameCheckVersion,
            @Nullable Map<String, Object> queryMap, @NonNull com.ruixue.callback.RXStringCallback callback) {
        api.updateGame(gameId, gameVersion, gameCheckVersion, queryMap, callback);
    }

    /**
     * 获取反馈类型列表
     * 
     * @param callback 回调接口
     */
    public void getFeedbackKindList(@NonNull RXRequestCallback callback) {
        api.getFeedbackKindList(convertCallback(callback));
    }

    /**
     * 创建反馈
     * 
     * @param map      反馈参数
     * @param callback 回调接口
     */
    public void createFeedback(@NonNull Map<String, Object> map, @NonNull RXRequestCallback callback) {
        api.createFeedback(map, convertCallback(callback));
    }

    /**
     * 满意度评价
     * 
     * @param map      评价参数
     * @param callback 回调接口
     */
    public void satisfactionEvaluation(@NonNull Map<String, Object> map, @NonNull RXRequestCallback callback) {
        api.satisfactionEvaluation(map, convertCallback(callback));
    }

    /**
     * 获取达人游戏内显示福利码
     * 
     * @param authRefresh 是否自动刷新
     * @param callback    回调接口
     */
    public void getPromoDisplayKEY(boolean authRefresh, @NonNull RXRequestCallback callback) {
        api.getPromoDisplayKEY(authRefresh, convertCallback(callback));
    }

    /**
     * 兑换达人福利码
     * 
     * @param cdKey    福利码
     * @param callback 回调接口
     */
    public void exchangePromoCDKEY(@NonNull String cdKey, @NonNull RXRequestCallback callback) {
        api.exchangePromoCDKEY(cdKey, callback);
    }

    /**
     * 埋点数据上报
     * 
     * @param eventName  埋点标识事件
     * @param distinctId 用户唯一标识
     * @param properties 自定义属性
     * @return 是否成功
     */
    public boolean dataTrack(@NonNull String eventName, @NonNull String distinctId,
            @Nullable Map<String, Object> properties) {
        return api.dataTrack(eventName, distinctId, properties);
    }

    /**
     * 异步埋点数据上报
     *
     * @param eventName  埋点标识事件
     * @param distinctId 用户唯一标识
     * @param properties 自定义属性
     */
    public void dataTrackAsync(@NonNull String eventName, @NonNull String distinctId,
            @Nullable Map<String, Object> properties) {
        api.trackAsync(eventName, distinctId, properties);
    }

    /**
     * 埋点数据上报（带缓存配置）
     * 
     * @param eventName     埋点标识事件
     * @param distinctId    用户唯一标识
     * @param properties    自定义属性
     * @param flushInterval 上报时间间隔
     * @param maxCacheCount 最大缓存条数
     * @return 是否成功
     * @deprecated 缓存配置已拆分为独立接口，请改用
     * {@link #setDataTrackFlushInterval(int)} / {@link #setDataTrackMaxCacheCount(int)}
     * 配置后再调用 {@link #dataTrack(String, String, Map)}
     */
    @Deprecated
    public boolean dataTrack(@NonNull String eventName, @NonNull String distinctId,
            @Nullable Map<String, Object> properties, int flushInterval, int maxCacheCount) {
        setDataTrackFlushInterval(flushInterval);
        setDataTrackMaxCacheCount(maxCacheCount);
        return dataTrack(eventName, distinctId, properties);
    }

    /**
     * 单独设置埋点上报时间间隔
     *
     * @param flushInterval 上报时间间隔（毫秒），{@code <=0} 时忽略并保持默认 60s
     */
    public void setDataTrackFlushInterval(int flushInterval) {
        api.setDataTrackFlushInterval(flushInterval);
    }

    /**
     * 单独设置埋点最大缓存条数
     *
     * @param maxCacheCount 最大缓存条数，{@code <=0} 时忽略并保持默认 100
     */
    public void setDataTrackMaxCacheCount(int maxCacheCount) {
        api.setDataTrackMaxCacheCount(maxCacheCount);
    }

    /**
     * 停止用户行为上报
     */
    public void stopTrackUserAction() {
        api.stopTrackUserAction();
    }

    /**
     * 上报用户行为
     * 
     * @param distinctId 用户唯一标识
     * @param properties 属性
     */
    public void trackUserAction(@NonNull String distinctId, @Nullable Map<String, Object> properties) {
        api.trackUserAction(distinctId, properties);
    }

    // ==================== 与 iOS 对齐补充的接口 ====================

    // ==================== 公告/邮件 ====================

    /**
     * 获取公告列表
     * 
     * @param limit    获取条数，范围 1-100
     * @param callback 回调接口
     */
    public void getAnnouncement(int limit, @NonNull RXRequestCallback callback) {
        api.getAnnouncement(limit, callback);
    }

    /**
     * 获取临时公告
     * 
     * @param callback 回调接口
     */
    public void getTempNotice(@NonNull RXRequestCallback callback) {
        api.getTempNotice(callback);
    }

    /**
     * 获取邮件列表
     * 
     * @param cpUserId CP 用户 ID
     * @param callback 回调接口
     */
    public void getEmailList(@NonNull String cpUserId, @NonNull RXRequestCallback callback) {
        api.getEmailList(cpUserId, callback);
    }

    /**
     * 获取邮件详情
     * 
     * @param cpUserId CP 用户 ID
     * @param emailId  邮件 ID
     * @param callback 回调接口
     */
    public void getEmailDetail(@NonNull String cpUserId, int emailId, @NonNull RXRequestCallback callback) {
        api.getEmailDetail(cpUserId, emailId, callback);
    }

    /**
     * 领取邮件道具
     * 
     * @param cpUserId CP 用户 ID
     * @param type     1 为领取当前礼物，2 为一键领取所有礼物
     * @param emailId  邮件 ID
     * @param callback 回调接口
     */
    public void getEmailAward(@NonNull String cpUserId, int type, int emailId, @NonNull RXRequestCallback callback) {
        api.getEmailAward(cpUserId, type, emailId, callback);
    }

    /**
     * 删除邮件
     * 
     * @param cpUserId CP 用户 ID
     * @param type     1 为删除当前邮件，2 为一键删除所有邮件
     * @param emailId  邮件 ID
     * @param callback 回调接口
     */
    public void deleteEmail(@NonNull String cpUserId, int type, int emailId, @NonNull RXRequestCallback callback) {
        api.deleteEmail(cpUserId, type, emailId, callback);
    }

    // ==================== 反馈（详细版） ====================

    /**
     * 创建意见反馈（详细版）
     * 
     * @param content     反馈内容
     * @param attachments 附件地址数组
     * @param phone       手机号
     * @param tags        游戏透传标识
     * @param callback    回调接口
     */
    public void feedbackCreate(@NonNull String content, @Nullable String[] attachments, @NonNull String phone,
            @Nullable String[] tags, @NonNull RXRequestCallback callback) {
        api.feedbackCreate(content, attachments, phone, tags, callback);
    }

    /**
     * 获取反馈列表
     * 
     * @param page     页数，从 1 开始
     * @param size     每页大小
     * @param status   状态：1 未处理，2 已处理，0 获取所有状态
     * @param callback 回调接口
     */
    public void getFeedbackList(int page, int size, int status, @NonNull RXRequestCallback callback) {
        api.getFeedbackList(page, size, status, callback);
    }

    /**
     * 获取反馈详情
     * 
     * @param feedbackId 反馈 ID
     * @param callback   回调接口
     */
    public void getFeedbackDetail(int feedbackId, @NonNull RXRequestCallback callback) {
        api.getFeedbackDetail(feedbackId, callback);
    }

    /**
     * 领取反馈回复中的道具
     * 
     * @param feedbackId 反馈 ID
     * @param callback   回调接口
     */
    public void feedbackGetprop(int feedbackId, @NonNull RXRequestCallback callback) {
        api.feedbackGetprop(feedbackId, callback);
    }

    // ==================== 分享（补充） ====================

    /**
     * 获取分享通路配置
     * 
     * @param callback 回调接口
     */
    public void getSharePlatforms(@NonNull RXRequestCallback callback) {
        api.getSharePlatforms(convertCallback(callback));
    }

    /**
     * 获取短链接（带 OG 标签）
     * 
     * @param url      要生成短链接的 url
     * @param title    标题
     * @param content  描述
     * @param image    图片地址
     * @param ext      透传参数
     * @param callback 回调接口
     */
    public void getShortUrl(@NonNull String url, @Nullable String title, @Nullable String content,
            @Nullable String image, @Nullable Map<String, Object> ext, @NonNull RXRequestCallback callback) {
        Map<String, Object> params = new java.util.HashMap<>();
        params.put("url", url);
        if (title != null)
            params.put("title", title);
        if (content != null)
            params.put("content", content);
        if (image != null)
            params.put("image", image);
        if (ext != null)
            params.put("ext", ext);
        api.getShortUrl(params, convertCallback(callback));
    }

    // ==================== 支付（补充） ====================

    /**
     * 查询订单状态
     * 
     * @param orderNo  订单号
     * @param callback 回调接口
     */
    public void tradeQuery(@NonNull String orderNo, @NonNull RXRequestCallback callback) {
        api.tradeQuery(orderNo, callback);
    }

    // ==================== 登录状态 ====================

    /**
     * 判断用户是否已登录
     * 
     * @return true 已登录，false 未登录
     */
    public boolean isLogin() {
        return api.isLogin();
    }

    /**
     * 获取当前登录数据
     * 
     * @return 登录数据
     */
    @Nullable
    public com.ruixue.passport.LoginData getLoginData() {
        return api.getLoginData();
    }

    /**
     * login_openid 是否失效
     * 
     * @return true 失效，false 有效
     */
    public boolean loginOpenidExpireInvalid() {
        return com.ruixue.RuiXueSdk.loginOpenidExpireInvalid();
    }

    // ==================== 配置类 ====================

    /**
     * 设置当前语言
     * 
     * @param language 语言码，如 en、zh-Hans 等
     */
    public void setLanguage(Context context, @NonNull String language) {
        RXGlobalData.setLanguage(context, language, true);
    }

    /**
     * 获取当前 BaseUrl
     * 
     * @return baseUrl
     */
    @NonNull
    public String getFirstBaseUrl() {
        return com.ruixue.RuiXueSdk.getFirstBaseUrl();
    }

    /**
     * 获取 OpenID
     * 
     * @return OpenID
     */
    @Nullable
    public String getOpenId() {
        return com.ruixue.RuiXueSdk.getOpenid();
    }

    /**
     * 获取设备码
     * 
     * @return 设备码
     */
    @NonNull
    public String getDeviceCode(Context context) {
        return DeviceUtils.getDeviceId(context);
    }

    /**
     * 获取当前时区与 UTC 时差
     * 
     * @return 时区偏移
     */
    @NonNull
    public String getTimeZoneOffset() {
        java.util.TimeZone tz = java.util.TimeZone.getDefault();
        int offset = tz.getRawOffset() / 1000 / 60;
        int hours = Math.abs(offset) / 60;
        int minutes = Math.abs(offset) % 60;
        return String.format(java.util.Locale.US, "%s%02d:%02d", offset >= 0 ? "+" : "-", hours, minutes);
    }

    /**
     * 获取当前系统语言
     * 
     * @return 系统语言
     */
    @NonNull
    public String getSystemLanguage() {
        return java.util.Locale.getDefault().getLanguage();
    }

    // ==================== 广告归因信息 ====================

    /**
     * 媒体平台自定义行为上报
     * 
     * @param params   上报数据
     * @param callback 回调接口
     */
    public void addAttribution(@NonNull Map<String, Object> params, @NonNull RXRequestCallback callback) {
        api.ADSchedulingReport(params, convertCallback(callback));
    }

    // ==================== 生命周期接口 ====================

    /**
     * 自动跟踪 Activity 生命周期
     * 
     * <p>
     * 继承自 {@link androidx.lifecycle.LifecycleOwner} 的 Activity（如
     * AppCompatActivity）可使用此方式。
     * 调用后 SDK 会自动监听生命周期事件，无需手动调用其他生命周期方法。
     * </p>
     * 
     * @param lifecycleOwner 生命周期拥有者（通常为 Activity）
     */
    public static void trackingLifecycle(@NonNull androidx.lifecycle.LifecycleOwner lifecycleOwner) {
        com.ruixue.RuiXueSdk.trackingLifecycle(lifecycleOwner);
    }

    /**
     * Application attachBaseContext 回调
     * 
     * <p>
     * 在 Application 的 {@link android.app.Application#attachBaseContext(Context)}
     * 中调用。
     * </p>
     * 
     * @param context Context
     */
    public static void attachBaseContext(@NonNull Context context) {
        com.ruixue.RuiXueSdk.attachBaseContext(context);
    }

    /**
     * Application onCreate 回调
     * 
     * <p>
     * 在 Application 的 {@link android.app.Application#onCreate()} 中调用。
     * </p>
     * 
     * @param application Application 实例
     */
    public static void onApplicationCreate(@NonNull android.app.Application application) {
        com.ruixue.RuiXueSdk.onApplicationCreate(application);
    }

    /**
     * Activity onCreate 回调
     * 
     * <p>
     * 在 Activity 的 {@link Activity#onCreate(android.os.Bundle)} 中调用。
     * 如果已调用
     * {@link #trackingLifecycle(androidx.lifecycle.LifecycleOwner)}，则无需手动调用此方法。
     * </p>
     * 
     * @param activity Activity 实例
     */
    public static void onCreate(@NonNull Activity activity) {
        com.ruixue.RuiXueSdk.onCreate(activity);
    }

    /**
     * Activity onCreate 回调（带 savedInstanceState）
     * 
     * @param activity           Activity 实例
     * @param savedInstanceState 保存的状态
     */
    public static void onCreate(@NonNull Activity activity, @Nullable android.os.Bundle savedInstanceState) {
        com.ruixue.RuiXueSdk.onCreate(activity, savedInstanceState);
    }

    /**
     * Activity onStart 回调
     * 
     * @param activity Activity 实例
     */
    public static void onStart(@NonNull Activity activity) {
        com.ruixue.RuiXueSdk.onStart(activity);
    }

    /**
     * Activity onRestart 回调
     * 
     * @param activity Activity 实例
     */
    public static void onRestart(@NonNull Activity activity) {
        com.ruixue.RuiXueSdk.onRestart(activity);
    }

    /**
     * Activity onResume 回调
     * 
     * @param activity Activity 实例
     */
    public static void onResume(@NonNull Activity activity) {
        com.ruixue.RuiXueSdk.onResume(activity);
    }

    /**
     * Activity onPause 回调
     * 
     * @param activity Activity 实例
     */
    public static void onPause(@NonNull Activity activity) {
        com.ruixue.RuiXueSdk.onPause(activity);
    }

    /**
     * Activity onStop 回调
     * 
     * @param activity Activity 实例
     */
    public static void onStop(@NonNull Activity activity) {
        com.ruixue.RuiXueSdk.onStop(activity);
    }

    /**
     * Activity onDestroy 回调
     * 
     * @param activity Activity 实例
     */
    public static void onDestroy(@NonNull Activity activity) {
        com.ruixue.RuiXueSdk.onDestroy(activity);
    }

    /**
     * Activity onNewIntent 回调
     * 
     * <p>
     * 在 Activity 的 {@link Activity#onNewIntent(android.content.Intent)} 中调用。
     * </p>
     * 
     * @param activity Activity 实例
     * @param intent   新的 Intent
     */
    public static void onNewIntent(@NonNull Activity activity, @NonNull android.content.Intent intent) {
        com.ruixue.RuiXueSdk.onNewIntent(activity, intent);
    }

    /**
     * Activity onActivityResult 回调
     * 
     * <p>
     * 在 Activity 的
     * {@link Activity#onActivityResult(int, int, android.content.Intent)} 中调用。
     * </p>
     * 
     * @param activity    Activity 实例
     * @param requestCode 请求码
     * @param resultCode  结果码
     * @param data        返回的数据
     */
    public static void onActivityResult(@NonNull Activity activity, int requestCode, int resultCode,
            @Nullable android.content.Intent data) {
        com.ruixue.RuiXueSdk.onActivityResult(activity, requestCode, resultCode, data);
    }

    /**
     * Activity onRequestPermissionsResult 回调
     * 
     * <p>
     * 在 Activity 的
     * {@link Activity#onRequestPermissionsResult(int, String[], int[])} 中调用。
     * </p>
     * 
     * @param activity     Activity 实例
     * @param requestCode  请求码
     * @param permissions  权限数组
     * @param grantResults 授权结果数组
     */
    public static void onRequestPermissionsResult(@NonNull Activity activity, int requestCode,
            @NonNull String[] permissions, @NonNull int[] grantResults) {
        com.ruixue.RuiXueSdk.onRequestPermissionsResult(activity, requestCode, permissions, grantResults);
    }

    /**
     * Activity onConfigurationChanged 回调
     * 
     * <p>
     * 在 Activity 的
     * {@link Activity#onConfigurationChanged(android.content.res.Configuration)}
     * 中调用。
     * </p>
     * 
     * @param activity  Activity 实例
     * @param newConfig 新的配置
     */
    public static void onConfigurationChanged(@NonNull Activity activity,
            @NonNull android.content.res.Configuration newConfig) {
        com.ruixue.RuiXueSdk.onConfigurationChanged(activity, newConfig);
    }

    /**
     * Activity onBackPressed 回调
     * 
     * <p>
     * 在 Activity 的返回键按下时调用。
     * </p>
     */
    public static void onBackPressed() {
        com.ruixue.RuiXueSdk.onBackPressed();
    }

    /**
     * Activity onWindowFocusChanged 回调
     * 
     * @param hasFocus 是否获得焦点
     */
    public static void onWindowFocusChanged(boolean hasFocus) {
        com.ruixue.RuiXueSdk.onWindowFocusChanged(hasFocus);
    }
}
