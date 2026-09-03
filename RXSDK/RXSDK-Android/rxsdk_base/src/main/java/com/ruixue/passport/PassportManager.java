package com.ruixue.passport;

import static android.content.Context.MODE_PRIVATE;

import android.content.SharedPreferences;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.LogHelper;
import com.ruixue.base.PresetEventHelper;
import com.ruixue.base.R;
import com.ruixue.base.TrackAppInstallMgr;
import com.ruixue.emulatordetect.SimulatorDetectTool;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.internal.ActivityLifecycleTracker;
import com.ruixue.internal.DeviceUtils;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.HttpUtil;
import com.ruixue.net.RXRequest;
import com.ruixue.openapi.ISdkEvent;
import com.ruixue.openapi.RXApiPath;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXSdkAnalytics;
import com.ruixue.openapi.RXSdkGdtAnalytics;
import com.ruixue.openapi.RXSdkKwaiAnalytics;
import com.ruixue.performancereport.PerformReportManager;
import com.ruixue.promo.PromoCodeManager;
import com.ruixue.reflect.AdjustManager;
import com.ruixue.reflect.ReflectManager;
import com.ruixue.reflect.WebSocketManager;
import com.ruixue.share.ShareManager;
import com.ruixue.storage.StorageLoginNum;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.Md5Util;
import com.ruixue.utils.MobileUtils;
import com.ruixue.utils.ObjectUtils;
import com.ruixue.utils.ResUtils;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;


public class PassportManager {
    private LoginData mLoginData;
    private final Handler mainHandler;
    private final LoginDataCache loginDataCache;
    public static final String SHARED_PREFERENCES_NAME = "com.ruixue.passport.SharedPreferences";

    public static final int IIFAA_RESULT_DEFAULT_RETRY_COUNT = 3;
    public static final int IIFAA_RESULT_RETRY_ERROR_CODE = 310039;

    public static final int PLATFORM_ID_QQ = 1; //ysdk QQ
    public static final int PLATFORM_ID_WX = 2; //ysdk 微信

    public PassportManager() {
        mainHandler = new Handler(Looper.getMainLooper());
        loginDataCache = new LoginDataCache(SHARED_PREFERENCES_NAME);
    }

    private static PassportManager instanceField;

    public static PassportManager getInstance() {
        PassportManager instance = instanceField;
        if (instance == null) {
            synchronized (PassportManager.class) {
                if (instanceField == null) {
                    instanceField = new PassportManager();
                }
                return instanceField;
            }
        } else {
            return instance;
        }
    }

    public boolean load() {
        AccountManager.getInstance().load();
        LoginData loginData = loginDataCache.load();
        if (loginData != null) {
            setLoginData(loginData, false);
            return true;
        }
        return false;
    }


    public boolean isPassword(String password) {
        String patternStr = RXGlobalData.getPwdPattern();
        if (!TextUtils.isEmpty(patternStr)) {
            Pattern z1_ = Pattern.compile(patternStr);
            //判断是否都成立，都包含返回true
            return z1_.matcher(password).matches();
        } else {
            return true;
        }
    }

    public String handlePassword(String password) {
        if (!TextUtils.isEmpty(password)) {
            return Md5Util.StringInMd5(password).toUpperCase();
        } else {
            return password;
        }
    }

    public Map<String, Object> handlePassword(Map<String, Object> hashMap) {
        Map<String, Object> tMap = new HashMap<>(hashMap);
        if (tMap.containsKey("password")) {
            tMap.put("password", handlePassword((String) hashMap.get("password")));
        }
        return tMap;
    }

    public void logout() {
        setLoginData(null, true);
    }

    public void loginByOpenidAsync(RXJSONCallback callback) {
        ThreadUtils.getInstance().runOnBgThreadUseExecutor(() -> loginByOpenid(callback));
    }

    public JSONObject loginByOpenid(RXJSONCallback callback) {
        Map<String, Object> bodyMap = new HashMap<>();
        LoginData loginData = this.mLoginData;
        if (null != loginData) {
            bodyMap.put("method", loginData.getLoginMethod());
            bodyMap.put("username", loginData.getUsername());
            bodyMap.put("login_openid", loginData.getLoginOpenid());
            return startLogin(bodyMap, callback);
        } else {
            RXLogger.i("loginWithOpenid failed, loginData is null.");
            JSONObject jsonObject = JSONUtil.toJSONObject(RXErrorCode.TOKEN_ERROR.getValue(), "access_token invalid!");
            if (callback != null) {
                mainHandler.post(() -> callback.onFailed(jsonObject));
            }
            return jsonObject;
        }
    }

    public void startLoginAsync(Map<String, Object> bodyMap, RXJSONCallback callback) {
        ThreadUtils.getInstance().runOnBgThreadUseExecutor(() -> startLogin(bodyMap, callback));
    }

    public JSONObject startLogin(Map<String, Object> bodyMap, RXJSONCallback callback) {
        bodyMap = bodyMap == null ? new HashMap<>() : bodyMap;
        if (ObjectUtils.toBoolean(bodyMap.get("ruixue_login"))) {
            return loginByOpenid(callback);
        } else if (!bodyMap.containsKey("method")) {
            RXLogger.e("please check login request method,method is empty.");
            JSONObject jsonObject = JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR.getValue(), "login error,please check login request method.");
            if (null != callback) {
                mainHandler.post(() -> callback.onFailed(jsonObject));
            }
            return jsonObject;
        }
        if (!bodyMap.containsKey("ts")) {
            bodyMap.put("ts", System.currentTimeMillis());
        }
        if (!bodyMap.containsKey("country")) {
            bodyMap.put("country", RXGlobalData.COUNTRY);
        }

        boolean isLoginByToken = bodyMap.containsKey("login_openid");
        String method = (String) bodyMap.get("method");
        String password = (String) bodyMap.get("password");

        if (LoginMethod.USERNAME.equals(bodyMap.get("method"))) {
            if (!isLoginByToken) {
                JSONObject checkResult = this.checkPassword(false, password, callback);
                if (checkResult != null)
                    return checkResult;
            }
            bodyMap = handlePassword(bodyMap);
        }
        bodyMap = UserActivateManager.getInstance().addAttributionParams(bodyMap);
        RXRequest request = RXRequest.create(isLoginByToken ? RXApiPath.Passport.LOGIN_TOKEN : RXApiPath.Passport.LOGIN);
        if (bodyMap.containsKey("trace_id")) {
            request.setUUID((String) bodyMap.get("trace_id"));
            bodyMap.remove("trace_id");
        }
        if (bodyMap.containsKey("ruixue-devicecode")) {
            request.addHeaders("ruixue-devicecode", (String) bodyMap.get("ruixue-devicecode"));
            bodyMap.remove("ruixue-devicecode");
        } else if (LoginMethod.GUEST.equals(method) && !RXGlobalData.readSensitiveInfoEnabled() && TextUtils.isEmpty(RuiXueSdk.getDeviceCode())) {
            RXLogger.e("read sensitive info is disabled,unavailable use guest method login");
            JSONObject jsonObject = JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR.getValue(), ResUtils.getInstance().getString(R.string.rx_txt_guest_not_available));
            if (null != callback) {
                mainHandler.post(() -> callback.onFailed(jsonObject));
            }
            return jsonObject;
        }
        if (RXGlobalData.isDeviceSdOf()) {
            try {
                if (bodyMap.containsKey("device")) {
                    @SuppressWarnings("unchecked") HashMap<String, Object> deviceMap = (HashMap<String, Object>) bodyMap.get("device");
                    Objects.requireNonNull(deviceMap).putAll(buildSimulatorParam());
                } else {
                    bodyMap.put("device", buildSimulatorParam());
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        request.setBody(bodyMap);
        LogHelper.writeLogLoginRequest(bodyMap, request.getHeaders());
        Map<String, Object> finalBodyMap = bodyMap;
        return request.post(new RXJSONCallback() {
            @Override
            public void onSuccess(JSONObject data) {
                try {
                    LogHelper.writeLogLoginResult(finalBodyMap, request.getHeaders(), data);
                    PresetEventHelper.loginResult(method, true, null);
                    if (null != data) {
                        LoginData loginData = LoginData.fromJson(data).calcTokenExpireTime();
                        loginData.setLoginMethod(method);
                        loginData.setLoginUsername((String) finalBodyMap.get("username"));
                        try {
                            data.putOpt("method", method);
                            Map<String, Object> account = new HashMap<>();
                            if (!TextUtils.isEmpty(password)) {
                                account.put("password", password);
                            }
                            if (finalBodyMap.containsKey("username")) {
                                account.put("username", finalBodyMap.get("username"));
                            }
                            if (!account.isEmpty()) {
                                data.putOpt("account", new JSONObject(account));
                            }
                        } catch (JSONException ignore) {
                        }
                        if (isLoginByToken && mLoginData != null && loginData.getOpenid().equals(mLoginData.getOpenid())) {
                            loginData.setUsername(mLoginData.getUsername());
                        } else if (finalBodyMap.containsKey("username") && (LoginMethod.QUICKPHONE.equals(loginData.getLoginMethod()) || LoginMethod.USERNAME.equals(loginData.getLoginMethod()) || LoginMethod.CAPTCHACODE.equals(loginData.getLoginMethod()))) {
                            loginData.setUsername((String) finalBodyMap.get("username"));
                        }
                        StorageLoginNum.getInstance().addSelf();
                        DeviceUtils.removeDistinctId(RuiXueSdk.getContext());
                        RXGlobalData.setPushTaskId(null);
                        AccessToken oldAccessToken = getCurrentAccessToken();
                        AccessTokenManager.getInstance().currentAccessTokenChanged(oldAccessToken, loginData.getAccessToken());
                        setLoginData(loginData);
                        AccountHelper.updateAccountCache(loginData, password, false);
                        if (!ObjectUtils.toBoolean(finalBodyMap.get("reconnect_login"))) {
                            //分享数据初始化
                            ShareManager.getInstance().init();
//                            BusinessMgr.getInstance().refreshBusinessData();
                        }
                        WebSocketManager.connect(ActivityLifecycleTracker.getCurrentActivity());

                        ReflectManager.sendAddressBook(RuiXueSdk.getCurrentActivity());
                        handlePromo(loginData);
                    }
                    if (null != callback) {
                        TrackAppInstallMgr.trackApp(RXGlobalData.getContext(), RXGlobalData.getAppJsonData());
                        mainHandler.post(() -> callback.onSuccess(data));
                    }
                    LogHelper.writeLogLoginCallback(finalBodyMap, request.getHeaders(), data);
                    RXSdkAnalytics.getInstance().trackEvent(ISdkEvent.Event.LOGIN, data);
                    RXSdkGdtAnalytics.getInstance().trackEvent(ISdkEvent.Event.LOGIN, data);
                    RXSdkKwaiAnalytics.getInstance().trackEvent(ISdkEvent.Event.LOGIN, data);
                    GPMReport();
                } catch (Throwable e) {
                    e.printStackTrace();
                    if (callback != null) {
                        mainHandler.post(() -> callback.onError(new RXException(e)));
                    }
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (null != callback) {
                    mainHandler.post(() -> callback.onFailed(cause));
                }
                PresetEventHelper.loginResult(method, false, cause);
            }

            @Override
            public void onError(RXException exception) {
                if (null != callback) {
                    mainHandler.post(() -> callback.onError(exception));
                }
                PresetEventHelper.loginResult(method, false, exception.toJSONObject());
            }
        });
    }

    private void handlePromo(LoginData loginData) {
        if (loginData.isAnchor()) {
            RXLogger.d("PassportManager handlePromo is anchor, init promo manager.");
            PromoCodeManager.getInstance().init(loginData.getCp_user_id());
        } else {
            RXLogger.d("PassportManager handlePromo is not anchor, so reset promo manager.");
            PromoCodeManager.getInstance().reset();
        }
    }

    private void GPMReport() {
        String uwaType = RXGlobalData.getPerformReportType();
        if (RXGlobalData.getPerformReportSdkTs() > 0 && ("sdk".equals(uwaType) || "both".equals(uwaType))) {
            Map<String, Object> properties = new HashMap<>();
            SharedPreferences sharedPreferences = RuiXueSdk.getContext().getSharedPreferences("rx_gpm_" + getOpenid(), MODE_PRIVATE);

            Map<String, Object> userRXInfo = PerformReportManager.getInstance().userRXInfo;

            if (!userRXInfo.isEmpty()) {
                for (Map.Entry<String, Object> entry : userRXInfo.entrySet()) {
                    String spVal = sharedPreferences.getString(entry.getKey(), "");
                    if (TextUtils.isEmpty(spVal) || !spVal.equals(entry.getValue() + "")) {
                        properties.put(entry.getKey(), entry.getValue());
                        sharedPreferences.edit().putString(entry.getKey(), entry.getValue() + "").apply();
                    }
                }
                if (!properties.isEmpty()) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("action", "rx_gpm");
                    map.put("properties", properties);
                    RXRequest.create(RXApiPath.USER_REPORT).setBody(map).postAsync();
                } else {
                    Log.d("PassportManager", "rx_gpm 参数相同，无需再次上报");
                }
            } else {
                Log.d("PassportManager", "rx_gpm 获取性能指标列表为空");
            }
        }

        if (RXGlobalData.getPerformReportSdkTs() > 0 && ("uwa".equals(uwaType) || "both".equals(uwaType))) {
            Map<String, Object> properties = new HashMap<>();
            SharedPreferences sharedPreferences = RuiXueSdk.getContext().getSharedPreferences("uwa_gpm_" + getOpenid(), MODE_PRIVATE);
            Map<String, Object> userUWAInfo = PerformReportManager.getInstance().userUWAInfo;
            if (!userUWAInfo.isEmpty()) {
                for (Map.Entry<String, Object> entry : userUWAInfo.entrySet()) {
                    String spVal = sharedPreferences.getString(entry.getKey(), "");
                    if (TextUtils.isEmpty(spVal) || !spVal.equals(entry.getValue() + "")) {
                        properties.put(entry.getKey(), entry.getValue());
                        sharedPreferences.edit().putString(entry.getKey(), entry.getValue() + "").apply();
                    }
                }
                if (!properties.isEmpty()) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("action", "uwa_gpm");
                    map.put("properties", properties);
                    RXRequest.create(RXApiPath.USER_REPORT).setBody(map).postAsync();
                } else {
                    Log.d("PassportManager", "uwa_gpm 参数相同，无需再次上报");
                }
            } else {
                Log.d("PassportManager", "uwa_gpm 获取性能指标列表为空");
            }
        }
    }


    private Map<String, Object> buildSimulatorParam() {
        JSONObject cp_rules = SimulatorDetectTool.getSingleInstance().customSimulatorDetectionParams;
        JSONObject rx_rules = SimulatorDetectTool.getSingleInstance().getDeviceInfo(RuiXueSdk.getContext());
        HashMap<String, Object> cpRulesmMap = new HashMap<>();
        if (cp_rules != null) {
            cpRulesmMap.put("cp_rules", cp_rules);
        }
        if (rx_rules != null) {
            cpRulesmMap.put("rx_rules", rx_rules);
        }

        HashMap<String, Object> simulatorDetectionMap = new HashMap<>();

        simulatorDetectionMap.put("simulator_detection", cpRulesmMap);
        return simulatorDetectionMap;
    }

    @NonNull
    private RXJSONCallback getPwdChangedCallback(String newPassword, RXJSONCallback callback) {
        return new RXJSONCallback() {
            @Override
            public void onSuccess(JSONObject data) {
                try {
                    if (null == data) {
                        data = new JSONObject();
                    }
                    data.put("password", newPassword);
                    AccountHelper.updatePassword(getOpenid(), newPassword);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                if (null != callback) {
                    JSONObject finalData = data;
                    mainHandler.post(() -> callback.onSuccess(finalData));
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (null != callback) {
                    mainHandler.post(() -> callback.onFailed(cause));
                }
            }

            @Override
            public void onError(RXException exception) {
                if (null != callback) {
                    mainHandler.post(() -> callback.onError(exception));
                }
            }
        };
    }

    public JSONObject checkPassword(boolean isRegexVerify, String password, RXJSONCallback callback) {
        if (TextUtils.isEmpty(password) || password.equals("null")) {
            if (null != callback)
                mainHandler.post(() -> callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.PASSWORD_NULL_ERROR)));
            return JSONUtil.toJSONObject(RXErrorCode.PASSWORD_NULL_ERROR.getValue(), RXErrorCode.PASSWORD_NULL_ERROR.getDesc());
        }
        if (isRegexVerify && !isPassword(password)) {
            if (null != callback)
                mainHandler.post(() -> callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.PASSWORD_FORMAT_ERROR)));
            return JSONUtil.toJSONObject(RXErrorCode.PASSWORD_FORMAT_ERROR.getValue(), RXErrorCode.PASSWORD_FORMAT_ERROR.getDesc());
        }
        return null;
    }

    @Nullable
    private JSONObject checkPassword(boolean isSet, Map<String, Object> bodyMap, RXJSONCallback callback) {
        if (bodyMap.containsKey("password") && !ObjectUtils.toBoolean(bodyMap.get("ignore_check_password"))) {
            String password = String.valueOf(bodyMap.get("password"));
            return checkPassword(isSet, password, callback);
        }
        return null;
    }

    /**
     * 首次启动用户激活
     */
    public void userActivated(Map<String, Object> bodyMap, RXJSONCallback callback) {
        ThreadUtils.getInstance().runOnUiThreadDelay(new Runnable() {
            @Override
            public void run() {
                UserActivateManager.getInstance().userActivated(bodyMap, callback);
            }
        }, 7000L);
    }

    public void register(Map<String, Object> bodyMap, RXJSONCallback callback) {
        if (bodyMap.containsKey("avatar_url") && !bodyMap.containsKey("avatarUrl")) {
            bodyMap.put("avatarUrl", bodyMap.get("avatar_url"));
        }
        if (!bodyMap.containsKey("country")) {
            bodyMap.put("country", RXGlobalData.COUNTRY);
        }
        JSONObject checkResult = checkPassword(true, bodyMap, callback);
        if (checkResult != null)
            return;

        Map<String, Object> reqMap = handlePassword(bodyMap);
        reqMap = UserActivateManager.getInstance().addAttributionParams(reqMap);
        RXRequest.create(RXApiPath.Passport.REGISTER).setBody(reqMap).postAsync(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                DeviceUtils.removeDistinctId(RuiXueSdk.getContext());
                if (data != null) {
                    String openid = data.optString("openid");
                    AdjustManager.trackNewUser(RuiXueSdk.getContext(), openid);
                    String method = data.optString("method");
                    Map<String, Object> params = new HashMap<>();
                    params.put("method", method);
                    RXSdkGdtAnalytics.getInstance().trackEvent(ISdkEvent.Event.REGISTER, params);
                    RXSdkKwaiAnalytics.getInstance().trackEvent(ISdkEvent.Event.REGISTER, params);
                }
                if (callback != null)
                    callback.onSuccess(JSONUtil.putMap(data, bodyMap));
                GPMReport();
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null) {
                    callback.onFailed(cause);
                }
            }

            @Override
            public void onError(RXException e) {
                if (callback != null) {
                    callback.onError(e);
                }
            }
        });
    }

    /**
     * 注销账号
     * shj-=\     *
     * @param bodyMap idcard, 卡号
     *                realname, 姓名
     *                cpdata cp方数据
     */
    public void deregister(Map<String, Object> bodyMap, RXJSONCallback callback) {
        RXRequest.create(RXApiPath.Passport.USER_DEREGISTER).setBody(bodyMap).postAsync(handelDeregisterCallback(true, callback));
    }

    public RXJSONCallback handelDeregisterCallback(boolean isDeregister, RXJSONCallback callback) {
        return new RXJSONCallback() {

            @Override
            public void onSuccess(@Nullable JSONObject data) {
                try {
                    if (mLoginData != null) {
                        getLoginData().setDeregister(isDeregister);
                    }
                    if (data != null) {
                        data.put("flag", getLoginData().getFlag());
                    }
                } catch (JSONException ignored) {
                }
                if (callback != null) {
                    callback.onSuccess(data);
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null) {
                    callback.onFailed(cause);
                }
            }

            @Override
            public void onError(RXException e) {
                if (callback != null) {
                    callback.onError(e);
                }
            }
        };
    }

    /**
     * 撤销账号注销申请
     * @param bodyMap 无
     */
    public void deregisterCancel(Map<String, Object> bodyMap, RXJSONCallback callback) {
        RXRequest.create(RXApiPath.Passport.USER_DEREGISTER_CANCEL).setBody(bodyMap).postAsync(handelDeregisterCallback(false, callback));
    }

    /**
     * 与实名认证 {@link #certification(Map, RXJSONCallback)} 成功分支一致：根据 data 更新当前登录用户的 age / aas / limit / flag，
     * 并在 {@code requestExtras} 非空时把其中的 idcard、realname 写回 data。
     */
    public void applyRealAuthApiSuccessToLoginData(@Nullable JSONObject data, @Nullable Map<String, Object> requestExtras) {
        if (null != mLoginData) {
            if (data != null && data.has("age")) {
                mLoginData.setAge(data.optInt("age"));
            }
            if (data != null && data.has("aas")) {
                mLoginData.setAas(data.optInt("aas"));
            }
            if (data != null && data.has("limit")) {
                mLoginData.setLimit(data.optBoolean("limit"));
            } else {
                if (data != null && data.has("flag")) {
                    mLoginData.setFlag(data.optInt("flag"), false);
                }
            }
        }
        if (data != null && requestExtras != null) {
            try {
                data.putOpt("idcard", requestExtras.get("idcard"));
                data.putOpt("realname", requestExtras.get("realname"));
            } catch (JSONException ignore) {
            }
        }
    }

    public void certification(Map<String, Object> map, RXJSONCallback callback) {
        RXRequest.create(RXApiPath.Passport.CERTIFICATION).setBody(map).postAsync(new RXJSONCallback() {
            @Override
            public void onError(RXException e) {
                if (callback != null) {
                    callback.onError(e);
                }
            }

            @Override
            public void onSuccess(@Nullable JSONObject data) {
                applyRealAuthApiSuccessToLoginData(data, map);
                if (callback != null) {
                    callback.onSuccess(data);
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                int errCode = cause.optInt("code");
                if (errCode != 312224) {
                    try {
                        cause.putOpt("idcard", map.get("idcard"));
                        cause.putOpt("realname", map.get("realname"));
                    } catch (JSONException ignore) {
                    }
                }
                if (callback != null) {
                    callback.onFailed(cause);
                }
            }
        });
    }

    /**
     * 获取 IIFAA 支付宝授权跳转地址。
     */
    public void getIIFAARedirectURL(@Nullable String appName, @Nullable String thirdPartSchema, @Nullable RXJSONCallback callback) {
        if (callback == null) {
            return;
        }
        String resolvedThirdPartSchema = thirdPartSchema;
        if (TextUtils.isEmpty(resolvedThirdPartSchema)) {
            resolvedThirdPartSchema = RXGlobalData.getRealAuthIIFAAScheme();
        }
        if (!TextUtils.isEmpty(resolvedThirdPartSchema)) {
            resolvedThirdPartSchema = resolvedThirdPartSchema.trim();
            if (!resolvedThirdPartSchema.contains("://")) {
                resolvedThirdPartSchema = resolvedThirdPartSchema + "://";
            }
        }
        if (TextUtils.isEmpty(resolvedThirdPartSchema)) {
            RXLogger.e("IIFAA third_part_schema is empty, check init config channel.sh");
        }
        Map<String, Object> body = new HashMap<>();
        body.put("app_name", appName == null ? "" : appName);
        body.put("scene_code", "IIFAA_CREDENTIALS_WEILEGAME_ALIPAYUSER");
        body.put("third_part_schema", resolvedThirdPartSchema == null ? "" : resolvedThirdPartSchema);
        RXLogger.i("IIFAA request redirect_url, app_name=" + appName + ", third_part_schema=" + resolvedThirdPartSchema);
        RXRequest.create(RXApiPath.Risk.IIFAA_REDIRECT_URL).setBody(body).postAsync(callback);
    }

    /**
     * 查询 IIFAA 认证结果，默认 310039 错误重试 3 次。
     */
    public void getIIFAAResult(@Nullable RXJSONCallback callback) {
        getIIFAAResultWithRetryCount(IIFAA_RESULT_DEFAULT_RETRY_COUNT, callback);
    }

    /**
     * 查询 IIFAA 认证结果。
     *
     * @param retryCount 310039 错误重试次数，传 0 不重试
     * @param callback   回调；为 null 时不发起请求
     */
    public void getIIFAAResultWithRetryCount(int retryCount, @Nullable RXJSONCallback callback) {
        getIIFAAResultWithSource(null, retryCount, callback);
    }

    /**
     * 查询 IIFAA 认证结果。
     *
     * @param source     业务场景，deregister 表示注销场景，传空表示正常认证逻辑
     * @param retryCount 310039 错误重试次数，传 0 不重试
     * @param callback   回调；为 null 时不发起请求
     */
    public void getIIFAAResultWithSource(@Nullable String source, int retryCount, @Nullable RXJSONCallback callback) {
        if (callback == null) {
            return;
        }
        dispatchIIFAAResult(source, Math.max(0, retryCount), 0, callback);
    }

    private void dispatchIIFAAResult(String source, int retryCount, int retriedCount, RXJSONCallback callback) {
        RXLogger.i("IIFAA request validate_by_bizid, source=" + source
                + ", retryCount=" + retryCount + ", retried=" + retriedCount);
        RXRequest request = RXRequest.create(RXApiPath.Risk.IIFAA_VALIDATE_BY_BIZID);
        // source 为空时走正常认证逻辑，deregister 表示注销场景
        if (!TextUtils.isEmpty(source)) {
            Map<String, Object> body = new HashMap<>();
            body.put("source", source);
            request.setBody(body);
        }
        request.postAsync(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                RXLogger.i("IIFAA validate_by_bizid success, source=" + source + ", retried=" + retriedCount);
                applyRealAuthApiSuccessToLoginData(data, null);
                callback.onSuccess(data);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (shouldRetryIIFAAResult(cause, retryCount, retriedCount)) {
                    RXLogger.i("IIFAA validate_by_bizid retry on code="
                            + cause.optInt("code") + ", next=" + (retriedCount + 1));
                    dispatchIIFAAResult(source, retryCount, retriedCount + 1, callback);
                } else {
                    RXLogger.e("IIFAA validate_by_bizid failed, source=" + source + ", cause=" + cause);
                    callback.onFailed(cause);
                }
            }

            @Override
            public void onError(RXException e) {
                JSONObject cause = e.toJSONObject();
                if (shouldRetryIIFAAResult(cause, retryCount, retriedCount)) {
                    RXLogger.i("IIFAA validate_by_bizid retry on error code="
                            + cause.optInt("code") + ", next=" + (retriedCount + 1));
                    dispatchIIFAAResult(source, retryCount, retriedCount + 1, callback);
                } else {
                    RXLogger.e("IIFAA validate_by_bizid error, source=" + source
                            + ", msg=" + (e == null ? "" : e.getMessage()));
                    callback.onError(e);
                }
            }
        });
    }

    private static boolean shouldRetryIIFAAResult(@NonNull JSONObject cause, int retryCount, int retriedCount) {
        return cause.optInt("code") == IIFAA_RESULT_RETRY_ERROR_CODE && retriedCount < retryCount;
    }

    public void getUserInfo(RXJSONCallback callback) {
        if (isLoggedIn()) {
            Map<String, Object> map = new HashMap<>();
            map.put("method", getLoginMethod());
            map.put("openid", getOpenid());

            RXRequest.create(RXApiPath.Passport.USER_INFO).setBody(map).postAsync(callback);
        } else {
            if (callback != null) {
                callback.onFailed(RXErrorCode.NOT_LOGIN_ERROR.toJSONObject());
            }
        }
    }

    public void getUserInfoByField(Map<String, Object> map, RXJSONCallback callback) {
        if (isLoggedIn()) {
            Map<String, Object> bodyMap = map == null ? new HashMap<>() : map;
            RXRequest.create(RXApiPath.Passport.USER_INFO_BY_FIELD).setBody(bodyMap).postAsync(callback);
        } else {
            if (callback != null) {
                callback.onFailed(RXErrorCode.NOT_LOGIN_ERROR.toJSONObject());
            }
        }
    }

    public void bindAccount(Map<String, Object>  map, RXJSONCallback callback) {
        if (isLoggedIn()) {
            RXRequest.create(RXApiPath.Passport.BIND_ACCOUNT).setBody(map).postAsync(callback);
        } else {
            if (callback != null) {
                callback.onFailed(RXErrorCode.NOT_LOGIN_ERROR.toJSONObject());
            }
        }
    }

    public void syncInfo(JSONObject map, RXJSONCallback callback) {
        if (isLoggedIn()) {
            RXRequest.create(RXApiPath.Passport.SYNC_APP_INFO).setBody(map).postAsync(callback);
        } else {
            if (callback != null) {
                callback.onFailed(RXErrorCode.NOT_LOGIN_ERROR.toJSONObject());
            }
        }
    }

    public void updateUserInfo(Map<String, Object> bodyMap, RXJSONCallback callback) {
        RXRequest.create(RXApiPath.Passport.UPDATE_USER).setBody(bodyMap).postAsync(new RXJSONCallback() {
            @Override
            public void onSuccess(JSONObject data) {
                try {
                    if (null != bodyMap && bodyMap.containsKey("avatarurl")) {
                        if (null == data) {
                            data = new JSONObject();
                        }
                        String avatar = (String) bodyMap.get("avatarurl");
                        data.put("avatarurl", avatar);
                        LoginData loginData = getLoginData();
                        if (loginData != null && avatar != null) {
                            loginData.setAvatar(avatar);
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                if (null != callback) {
                    JSONObject finalData = data;
                    mainHandler.post(() -> callback.onSuccess(finalData));
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (null != callback) {
                    mainHandler.post(() -> callback.onFailed(cause));
                }
            }

            @Override
            public void onError(RXException exception) {
                if (null != callback) {
                    mainHandler.post(() -> callback.onError(exception));
                }
            }
        });
    }


    public void changePhone(Map<String, Object> bodyMap, RXJSONCallback callback) {
        JSONObject checkResult = checkPassword(false, bodyMap, callback);
        if (checkResult != null)
            return;
        bodyMap = handlePassword(bodyMap);
        RXRequest.create(RXApiPath.Passport.CHANGE_PHONE).setBody(bodyMap).postAsync(handleBindChangeCallback(true, (String) bodyMap.get("newphone"), callback));
    }

    //     "old_email_captcha":"3455",
    //    "new_email":"liming@jixiang.cn",
    //    "new_email_captcha":"3456",
    public void changeEmail(Map<String, Object> bodyMap, RXJSONCallback callback) {
        JSONObject checkResult = checkPassword(false, bodyMap, callback);
        if (checkResult != null)
            return;
        bodyMap = handlePassword(bodyMap);
        RXRequest.create(RXApiPath.Passport.CHANGE_EMAIL).setBody(bodyMap).postAsync(handleBindChangeCallback(false, (String) bodyMap.get("new_email"), callback));
    }


    @NonNull
    private RXJSONCallback handleBindChangeCallback(boolean isPhone, String target, RXJSONCallback callback) {
        return new RXJSONCallback() {
            @Override
            public void onError(RXException e) {
                if (null != callback) {
                    callback.onError(e);
                }
            }

            @Override
            public void onSuccess(@Nullable JSONObject data) {
                LoginData loginData = mLoginData;
                if (loginData != null) {
                    if (LoginMethod.QUICKPHONE.equals(loginData.getLoginMethod()) || loginData.getLoginMethod().equals(LoginMethod.USERNAME) || loginData.getLoginMethod().equals(LoginMethod.CAPTCHACODE)) {
                        loginData.setUsername(target);
                        loginData.setLoginUsername(target);
                        AccountHelper.updateAccountCache(loginData);
                    }
                    mLoginData.setAttr(isPhone ? LoginData.LoginAttrMask.BIND_PHONE : LoginData.LoginAttrMask.BIND_EMAIL);
                    Map<String, Object> ext = new HashMap<>();
                    ext.put(isPhone ? "phone" : "email", isPhone ? MobileUtils.getPhone(target) : target);
                    mLoginData.updateExt(ext);
                }
                if (data == null) {
                    data = new JSONObject();
                }
                try {
                    data.put(isPhone ? "phone" : "email", target);
                } catch (JSONException ignore) {
                }
                if (null != callback) {
                    callback.onSuccess(data);
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (null != callback) {
                    callback.onFailed(cause);
                }
            }
        };
    }

    private RXJSONCallback handleUnBindCallback(boolean isPhone, RXJSONCallback callback) {
        return new RXJSONCallback() {
            @Override
            public void onError(RXException e) {
                if (null != callback) {
                    callback.onError(e);
                }
            }

            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (mLoginData != null) {
                    mLoginData.unsetAttr(isPhone ? LoginData.LoginAttrMask.BIND_PHONE : LoginData.LoginAttrMask.BIND_EMAIL);
                    mLoginData.removeExtKey(isPhone ? "phone" : "email");
                }
                if (null != callback) {
                    callback.onSuccess(data);
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (null != callback) {
                    callback.onFailed(cause);
                }
            }
        };
    }

    public void bindPhone(Map<String, Object> bodyMap, RXJSONCallback callback) {
        JSONObject checkResult = checkPassword(false, bodyMap, callback);
        if (checkResult != null)
            return;
        bodyMap = handlePassword(bodyMap);
        RXRequest.create(RXApiPath.Passport.BIND_PHONE).setBody(bodyMap).postAsync(handleBindChangeCallback(true, (String) bodyMap.get("phone"), callback));
    }

    public void bindEmail(Map<String, Object> bodyMap, RXJSONCallback callback) {
        JSONObject checkResult = checkPassword(false, bodyMap, callback);
        if (checkResult != null)
            return;
        bodyMap = handlePassword(bodyMap);
        RXRequest.create(RXApiPath.Passport.BIND_EMAIL).setBody(bodyMap).postAsync(handleBindChangeCallback(false, (String) bodyMap.get("email"), callback));
    }

    public void unbindPhone(Map<String, Object> bodyMap, RXJSONCallback callback) {
        RXRequest.create(RXApiPath.Passport.UNBIND_PHONE).setBody(bodyMap).postAsync(handleUnBindCallback(true, callback));
    }

    public void unbindEmail(Map<String, Object> bodyMap, RXJSONCallback callback) {
        RXRequest.create(RXApiPath.Passport.UNBIND_EMAIL).setBody(bodyMap).postAsync(handleUnBindCallback(false, callback));
    }

    public void changePwd(Map<String, Object> bodyMap, RXJSONCallback callback) {
        if (null != checkPassword(!ObjectUtils.toBoolean(bodyMap.get("ignore_check_password")), String.valueOf(bodyMap.get("new_password")), callback))
            return;
        String newPassword = (String) bodyMap.get("new_password");
        bodyMap.put("old_password", handlePassword((String) bodyMap.get("old_password")));
        bodyMap.put("new_password", handlePassword(newPassword));
        if (!bodyMap.containsKey("by_oldpassword")) {
            Map<String, Object> by_oldpassword = new HashMap<>();
            by_oldpassword.put("old_password", bodyMap.get("old_password"));
            bodyMap.put("by_oldpassword", by_oldpassword);
        }
        RXRequest.create(RXApiPath.Passport.CHANGE_PWD).setBody(bodyMap).postAsync(getPwdChangedCallback(newPassword, callback));
    }

    public void resetPwd(Map<String, Object> bodyMap, RXJSONCallback callback) {
        JSONObject checkResult = checkPassword(true, bodyMap, callback);
        if (checkResult != null)
            return;
        String newPassword = (String) bodyMap.get("password");
        bodyMap = handlePassword(bodyMap);
        RXRequest.create(RXApiPath.Passport.RESET_PWD).setBody(bodyMap).postAsync(getPwdChangedCallback(newPassword, callback));
    }


    public String getLoginOpenid() {
        LoginData ld = getLoginData();
        if (null != ld) {
            return ld.getLoginOpenid();
        }
        return "";
    }

    public boolean loginOpenidExpireInvalid() {
        LoginData ld = getLoginData();
        if (null != ld) {
            return ld.loginOpenidExpireInvalid();
        }
        return true;
    }

    public String getOpenid() {
        LoginData ld = getLoginData();
        if (null != ld) {
            return ld.getOpenid();
        }
        return "";
    }

    public String getSource() {
        LoginData ld = getLoginData();
        if (null != ld) {
            return ld.getSource();
        }
        return "";
    }

    public String getSourceChannel() {
        LoginData ld = getLoginData();
        if (null != ld) {
            return ld.getSourceChannel();
        }
        return "";
    }

    public String getSubChannelId() {
        LoginData ld = getLoginData();
        if (null != ld) {
            return ld.getSubchannelid();
        }
        return "";
    }

    public LoginData getLoginData() {
        return mLoginData;
    }

    public String getLoginMethod() {
        if (mLoginData != null) {
            return mLoginData.getLoginMethod();
        } else {
            return "";
        }
    }

    public String getRegion() {
        if (mLoginData != null) {
            return mLoginData.getRegion();
        } else {
            return "";
        }
    }

    public int getUserAge() {
        if (mLoginData != null) {
            return mLoginData.getAge();
        } else {
            return 0;
        }
    }

    public void updateLoginData(LoginData loginData) {
        this.mLoginData.updateLoginData(loginData);
        setLoginData(this.mLoginData, true);
    }

    public void setLoginData(LoginData loginData) {
        setLoginData(loginData, true);
    }

    public void setLoginData(LoginData loginData, boolean saveToCache) {
        this.mLoginData = loginData;
        if (saveToCache) {
            this.loginDataCache.save(loginData);
        }
    }

    public Map<String, String> getDefaultHeaders() {
        Map<String, String> headers = HttpUtil.getDefaultHeaders();
        AccessToken accessToken = getCurrentAccessToken();
        if (null != accessToken) {
            headers.put("ruixue-accesstoken", accessToken.getAccess());
        }
        return headers;
    }


    protected JSONObject refreshCurrentAccessToken(AccessToken.AccessTokenRefreshCallback callback) {
        if (isRefreshTokenValid()) {
            return AccessTokenManager.getInstance().refreshCurrentAccessToken(getCurrentAccessToken().getRefresh(), new RXJSONCallback() {
                @Override
                public void onSuccess(JSONObject data) {
                    AccessToken newAccessToken = AccessToken.fromJson(data).calcTokenExpireTime();
                    AccessToken oldAccessToken = getCurrentAccessToken();
                    setCurrentAccessToken(newAccessToken);
//                    // 通知 access token 变更
                    if (oldAccessToken != null && !Objects.equals(oldAccessToken, newAccessToken)) {
                        AccessTokenManager.getInstance().currentAccessTokenChanged(oldAccessToken, newAccessToken);
                    }
                    if (callback != null) {
                        mainHandler.post(() -> callback.onTokenRefreshed(newAccessToken));
                    }
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    AccessToken accessToken = getCurrentAccessToken();
                    if (accessToken != null) {
                        accessToken.setRefreshExpire(0);
                    }
                    println(cause.toString());
                    if (callback != null) {
                        mainHandler.post(() -> callback.onTokenRefreshFailed(cause));
                    }
                }

                @Override
                public void onError(RXException exception) {
                    exception.printStackTrace();
                    RXLogger.e(exception.getMessage());
                    if (callback != null) {
                        mainHandler.post(() -> callback.onTokenRefreshFailed(exception.toJSONObject()));
                    }
                }
            });
        } else {
            return loginByOpenid(new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    if (callback != null) {
                        mainHandler.post(() -> callback.onTokenRefreshed(getCurrentAccessToken()));
                    }
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    if (callback != null) {
                        mainHandler.post(() -> callback.onTokenRefreshFailed(cause));
                    }
                }
            });
        }
    }

    public JSONObject fetchCurrentAccessToken() {
        if (isCurrentAccessTokenExpired()) {
            return refreshCurrentAccessToken(null);
        }
        return JSONUtil.toJSONObject(0, "");
    }

    public boolean fetchCurrentAccessTokenAsync(AccessToken.AccessTokenRefreshCallback callback) {
        return fetchCurrentAccessTokenAsync(60, callback);
    }

    public boolean fetchCurrentAccessTokenAsync(int nearlySecond, AccessToken.AccessTokenRefreshCallback callback) {
        if (isCurrentAccessTokenExpired(nearlySecond)) {
            refreshCurrentAccessTokenAsync(callback);
            return true;
        } else if (callback != null) {
            AccessToken accessToken = getCurrentAccessToken();
            callback.onTokenRefreshed(accessToken);
        }
        return false;
    }

    public void refreshCurrentAccessTokenAsync(AccessToken.AccessTokenRefreshCallback callback) {
        ThreadUtils.getInstance().runOnBgThreadUseExecutor(() -> refreshCurrentAccessToken(callback));
    }

    public boolean isLoggedIn() {
        return !TextUtils.isEmpty(getLoginOpenid());
    }

    public boolean isCurrentAccessTokenExpired() {
        return isCurrentAccessTokenExpired(60);
    }

    //当前访问令牌是否失效
    public boolean isCurrentAccessTokenExpired(int nearly) {
        AccessToken accessToken = getCurrentAccessToken();
        return accessToken == null || accessToken.isExpired(nearly);
    }

    public void setCurrentAccessTokenExpired() {
        AccessToken accessToken = getCurrentAccessToken();
        if (accessToken != null) {
            accessToken.setAccessExpire(0);
        }
    }

    public boolean isRefreshTokenValid() {
        AccessToken accessToken = getCurrentAccessToken();
        return accessToken != null && !accessToken.isRefreshExpired();
    }

    public void setCurrentAccessToken(AccessToken accessToken) {
        if (null != this.mLoginData) {
            AccessToken oldAccessToken = mLoginData.getAccessToken();
            this.mLoginData.setAccessToken(accessToken);
            if (oldAccessToken != null && !Objects.equals(oldAccessToken, accessToken)) {
                AccessTokenManager.getInstance().currentAccessTokenChanged(oldAccessToken, accessToken);
            }
            setLoginData(this.mLoginData, true);
        } else {
            RXLogger.e("ruixue current loginData is null error,please relogin");
        }
    }

    public AccessToken getCurrentAccessToken() {
        if (null != this.mLoginData) {
            return this.mLoginData.getAccessToken();
        }
        return null;
    }
}
