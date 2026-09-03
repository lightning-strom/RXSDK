/**
 * RuixueSDK.java
 * 瑞雪 SDK Android 原生层封装 - 核心模块
 * 
 * 仅包含核心功能：初始化、API 登录、登出、获取用户信息、生命周期
 * 依赖：rxsdk_base
 * 
 * UI 模块见 RuixueSDKUI.java（需引入 rxsdk_base_ui）
 * 支付模块见 RuixueSDKPay.java（需引入支付库）
 * 分享模块见 RuixueSDKShare.java（需引入分享库）
 */

package com.ruixue.sdk;

import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.widget.Toast;

import com.ruixue.RXJSONCallback;
import com.ruixue.RXRequestCallback;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.openapi.RXSDK;
import com.ruixue.openapi.GameInfo;
import com.ruixue.RXSdkInitConfig;
import com.ruixue.passport.LoginMethod;
import com.ruixue.passport.LoginParams;
import com.ruixue.sdk.gdt.GDTSdkWrapper;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Map;
import java.util.List;

public class RuixueSDK {
    
    static final String TAG = "RuixueSDK";
    
    static Context sContext;
    static Activity sActivity;
    static boolean sInitialized = false;
    static Handler sMainHandler = new Handler(Looper.getMainLooper());
    
    // ==================== Native 方法声明 ====================
    
    private static native void nativeOnResult(String action, String responseJson);
    
    /**
     * 供同包其他模块类调用的回调方法
     */
    static void callNativeResult(String action, String responseJson) {
        nativeOnResult(action, responseJson);
    }
    
    // ==================== 工具方法（包内可见） ====================
    
    /**
     * 显示 Toast 提示
     */
    static void showToast(final String message) {
        if (sActivity != null) {
            sMainHandler.post(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(sActivity, message, Toast.LENGTH_SHORT).show();
                }
            });
        }
    }
    
    /**
     * 解析 JSON 字符串为 JSONObject
     */
    static JSONObject parseJson(String jsonString) {
        try {
            if (jsonString != null && !jsonString.isEmpty()) {
                return new JSONObject(jsonString);
            }
        } catch (Exception e) {
            Log.w(TAG, "JSON 解析失败: " + e.getMessage());
        }
        return new JSONObject();
    }
    
    /**
     * 构建响应 JSON
     */
    static String buildResponse(int code, String msg, JSONObject data) {
        try {
            JSONObject response = new JSONObject();
            response.put("code", code);
            response.put("msg", msg);
            response.put("data", data != null ? data : new JSONObject());
            return response.toString();
        } catch (Exception e) {
            return "{\"code\":-1,\"msg\":\"构建响应失败\",\"data\":{}}";
        }
    }
    
    // ==================== 初始化 ====================
    
    /**
     * 设置 Activity（在 Cocos2dxActivity 中调用）
     */
    public static void setActivity(Activity activity) {
        sActivity = activity;
        sContext = activity.getApplicationContext();
    }
    
    /**
     * 获取顶部安全区域高度（点坐标）
     * 用于处理刘海屏/打孔屏
     */
    public static float getTopSafeArea() {
        try {
            Class<?> appActivityClass = Class.forName("org.cocos2dx.cpp.AppActivity");
            java.lang.reflect.Method method = appActivityClass.getMethod("getTopSafeAreaInPoints");
            Object result = method.invoke(null);
            if (result instanceof Float) {
                return (Float) result;
            }
        } catch (Exception e) {
            Log.e(TAG, "获取安全区域失败: " + e.getMessage());
        }
        return 0;
    }
    
    /**
     * 初始化 SDK（由 C++ 层调用）
     * @param paramsJson 初始化参数 JSON 字符串
     */
    public static void init(final String paramsJson) {
        Log.d(TAG, "初始化 SDK: paramsJson=" + paramsJson);
        
        if (sActivity == null) {
            Log.e(TAG, "Activity 未设置");
            nativeOnResult("init", buildResponse(-1, "Activity 未设置", null));
            return;
        }
        
        sMainHandler.post(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject params = parseJson(paramsJson);
                    
                    final String cpid = params.optString("cpid", "");
                    final String productId = params.optString("productId", "");
                    final String channelId = params.optString("channelId", "");
                    
                    List<String> baseUrls = new ArrayList<>();
                    JSONArray baseUrlsArray = params.optJSONArray("baseUrls");
                    if (baseUrlsArray != null) {
                        for (int i = 0; i < baseUrlsArray.length(); i++) {
                            baseUrls.add(baseUrlsArray.getString(i));
                        }
                    }
                    
                RXSdkInitConfig config = new RXSdkInitConfig(
                            cpid, productId, channelId, baseUrls,
                        new RXRequestCallback() {
                            @Override
                            public void onResponse(JSONObject response) {
                                    // 直接返回完整响应
                                int code = response.optInt("code", -1);
                                if (code == 0) {
                                    sInitialized = true;
                                    }
                                    nativeOnResult("init", response.toString());
                                }
                            }
                    );
                    
                    config.setAutoInitThird(true);
                    config.setUsePrivacy(true);
                    config.setLogEnable(true);
                    
                RXSDK.initialize(sActivity, config);
                    
                } catch (Exception e) {
                    Log.e(TAG, "初始化失败: " + e.getMessage());
                    nativeOnResult("init", buildResponse(-1, "初始化失败: " + e.getMessage(), null));
                }
            }
        });
    }

    /**
     * 初始化第三方渠道 SDK（由 C++ 层调用）。
     */
    public static void initThirdSdk(final String paramsJson) {
        if (!sInitialized) {
            nativeOnResult("initThirdSdk", buildResponse(-1, "SDK 未初始化", null));
            return;
        }
        if (sActivity == null) {
            nativeOnResult("initThirdSdk", buildResponse(-1, "Activity 未设置", null));
            return;
        }

        sMainHandler.post(() -> {
            try {
                JSONObject params = parseJson(paramsJson);
                Map<String, Object> map = com.ruixue.utils.JSONUtil.toMapNonNull(params);
                RXSDK.getInstance().initThirdSdk(sActivity, map, new RXRequestCallback() {
                    @Override
                    public void onResponse(JSONObject response) {
                        nativeOnResult("initThirdSdk", response.toString());
                    }
                });
            } catch (Exception e) {
                nativeOnResult("initThirdSdk",
                        buildResponse(-1, "第三方渠道初始化失败: " + e.getMessage(), null));
            }
        });
    }

    /**
     * 调用当前渠道库实现的通用动作（由 C++ 层调用）。
     */
    public static void invokeChannelAction(final String action, final String paramsJson) {
        sMainHandler.post(() -> {
            if (sActivity == null) {
                nativeOnResult(
                        "channelAction",
                        buildResponse(-1, "Activity 未设置", null));
                return;
            }

            try {
                JSONObject params = new JSONObject(
                        paramsJson == null || paramsJson.isEmpty() ? "{}" : paramsJson);
                Map<String, Object> map = com.ruixue.utils.JSONUtil.toMapNonNull(params);
                RXSDK.invokeChannelAction(
                        sActivity, action, map, new RXJSONCallback() {
                            @Override
                            public void onSuccess(JSONObject data) {
                                nativeOnResult(
                                        "channelAction",
                                        data != null
                                                ? data.toString()
                                                : buildResponse(0, "渠道动作执行成功", null));
                            }

                            @Override
                            public void onFailed(JSONObject cause) {
                                nativeOnResult(
                                        "channelAction",
                                        cause != null
                                                ? cause.toString()
                                                : buildResponse(-1, "渠道动作执行失败", null));
                            }
                        });
            } catch (Exception e) {
                Log.e(TAG, "渠道动作调用异常", e);
                nativeOnResult(
                        "channelAction",
                        buildResponse(-1, "渠道动作调用异常: " + e.getMessage(), null));
            }
        });
    }
    
    // ==================== 用户系统（核心） ====================
    
    /**
     * API 登录（由 C++ 层调用）
     * 使用 LoginParams 参数模式
     */
    public static void login(final String paramsJson) {
        Log.d(TAG, "调用 API 登录, paramsJson=" + paramsJson);
        
        if (!sInitialized) {
            nativeOnResult("login", buildResponse(-1, "SDK 未初始化", null));
            return;
        }
        
        if (sActivity == null) {
            nativeOnResult("login", buildResponse(-1, "Activity 未设置", null));
            return;
        }
        
        sMainHandler.post(new Runnable() {
            @Override
            public void run() {
                JSONObject jsonParams = parseJson(paramsJson);
                
                // 构造 LoginParams
                LoginParams params = new LoginParams();
                
                // 设置登录方式
                String loginType = jsonParams.optString("loginType", "guest");
                if ("guest".equalsIgnoreCase(loginType)) {
                    params.setMethod(LoginMethod.GUEST);
                } else if ("username".equalsIgnoreCase(loginType)) {
                    params.setMethod(LoginMethod.USERNAME);
                } else if ("phone".equalsIgnoreCase(loginType) || "captcha".equalsIgnoreCase(loginType)) {
                    params.setMethod(LoginMethod.CAPTCHACODE);
                        } else {
                    params.setMethod(loginType);
                }
                
                // 设置用户名
                if (jsonParams.has("username")) {
                    params.setUsername(jsonParams.optString("username"));
                }
                
                // 设置密码
                if (jsonParams.has("password")) {
                    params.setPassword(jsonParams.optString("password"));
                }
                
                // 设置二次登录凭证
                if (jsonParams.has("loginOpenid")) {
                    params.setLoginOpenid(jsonParams.optString("loginOpenid"));
                }
                
                // 设置签名字段
                params.setSignFields(new String[]{"openid"});
                
                RXSDK.getInstance().login(sActivity, params, new RXRequestCallback() {
                    @Override
                    public void onResponse(JSONObject response) {
                        // 直接返回完整响应
                        nativeOnResult("login", response.toString());
                    }
                });
            }
        });
    }
    
    /**
     * 登出（由 C++ 层调用）
     * 使用 RXSDK.getInstance().logout(OnLogoutCallback)
     */
    public static void logout() {
        Log.d(TAG, "调用登出");
        
        RXSDK.getInstance().logout(new OnLogoutCallback() {
            @Override
            public void onSuccess(@androidx.annotation.Nullable String data) {
                Log.d(TAG, "登出成功: " + data);
                nativeOnResult("logout", buildResponse(0, "登出成功", null));
            }
            
            @Override
            public void onFailed(int code, String msg) {
                Log.e(TAG, "登出失败: code=" + code + ", msg=" + msg);
                nativeOnResult("logout", buildResponse(code, msg, null));
            }
        });
    }

    /**
     * 请求当前渠道退出应用（由 C++ 层调用）。
     */
    public static void exitApp() {
        sMainHandler.post(() -> {
            final Activity activity = sActivity;
            if (activity == null
                    || activity.isFinishing()
                    || (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1
                            && activity.isDestroyed())) {
                nativeOnResult("exitApp",
                        buildResponse(-1, "Activity 不可用", null));
                return;
            }

            try {
                RXSDK.getInstance().exitApp(activity, new OnAppExitCallback() {
                    @Override
                    public void onExitConfirm(@androidx.annotation.Nullable String res) {
                        JSONObject data = new JSONObject();
                        try {
                            data.put("confirmed", true);
                            data.put("result", res != null ? res : JSONObject.NULL);
                            nativeOnResult("exitApp",
                                    buildResponse(0, "已确认退出", data));
                        } catch (Exception e) {
                            nativeOnResult("exitApp",
                                    buildResponse(-1, "退出确认回调异常: " + e.getMessage(), null));
                        }
                    }

                    @Override
                    public void onExitCancel() {
                        JSONObject data = new JSONObject();
                        try {
                            data.put("confirmed", false);
                            nativeOnResult("exitApp",
                                    buildResponse(0, "已取消退出", data));
                        } catch (Exception e) {
                            nativeOnResult("exitApp",
                                    buildResponse(-1, "退出取消回调异常: " + e.getMessage(), null));
                        }
                    }
                });
            } catch (Exception e) {
                Log.e(TAG, "退出应用调用异常", e);
                nativeOnResult("exitApp",
                        buildResponse(-1, "退出应用调用异常: " + e.getMessage(), null));
            }
        });
    }
    
    /**
     * 获取用户信息（由 C++ 层调用）
     * 使用 RXSDK.getInstance().getUserInfo(RXRequestCallback)
     */
    public static void getUserInfo() {
        Log.d(TAG, "获取用户信息");
        
        if (!sInitialized) {
            nativeOnResult("userInfo", buildResponse(-1, "SDK 未初始化", null));
            return;
        }
        
        RXSDK.getInstance().getUserInfo(new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject jsonObject) {
                int code = jsonObject.optInt("code", -1);
                if (code == 0) {
                    JSONObject data = jsonObject.optJSONObject("data");
                    if (data != null) {
                        String openid = data.optString("openid");
                        String nickname = data.optString("nickname");
                        String avatar = data.optString("avatar");
                        String phone = data.optString("phone");
                        String email = data.optString("email");
                        boolean isRealAuth = data.optBoolean("is_real_auth");
                        
                        Log.d(TAG, "用户信息: nickname=" + nickname
                                + ", phone=" + phone
                                + ", isRealAuth=" + isRealAuth);
                    }
                    nativeOnResult("userInfo", jsonObject.toString());
                } else {
                    Log.e(TAG, "获取用户信息失败: " + jsonObject.optString("msg"));
                    nativeOnResult("userInfo", jsonObject.toString());
                }
            }
        });
    }

    /**
     * 获取指定用户信息（由 C++ 层调用）
     * @param paramsJson 请求参数 JSON 字符串
     */
    public static void getUserInfoByField(final String paramsJson) {
        Log.d(TAG, "获取指定用户信息: paramsJson=" + paramsJson);

        if (!sInitialized) {
            nativeOnResult("userInfoByField", buildResponse(-1, "SDK 未初始化", null));
            return;
        }

        sMainHandler.post(new Runnable() {
            @Override
            public void run() {
                JSONObject jsonParams = parseJson(paramsJson);
                java.util.Map<String, Object> params = com.ruixue.utils.JSONUtil.toMapNonNull(jsonParams);
                RXSDK.getInstance().getUserInfoByField(params, new RXRequestCallback() {
                    @Override
                    public void onResponse(JSONObject jsonObject) {
                        nativeOnResult("userInfoByField", jsonObject.toString());
                    }
                });
            }
        });
    }
    
    // ==================== 注册 / 验证码 / 实名 / 绑定查询 ====================
    
    public static void registerAccount(final String paramsJson) {
        Log.d(TAG, "注册: " + paramsJson);
        if (!sInitialized) { nativeOnResult("register", buildResponse(-1, "SDK 未初始化", null)); return; }
        final JSONObject p = parseJson(paramsJson);
        sMainHandler.post(() -> {
            try {
                com.ruixue.passport.RegisterParams params = new com.ruixue.passport.RegisterParams();
                params.setUsername(p.optString("username", ""));
                params.setPassword(p.optString("password", ""));
                params.setCaptcha_code(p.optString("captchaCode", ""));
                if (p.has("nickname")) params.setNickname(p.optString("nickname"));
                RXSDK.getInstance().register(params, new com.ruixue.RXRequestCallback() {
                    @Override public void onResponse(JSONObject jsonObject) { nativeOnResult("register", jsonObject.toString()); }
                });
            } catch (Exception e) { nativeOnResult("register", buildResponse(-1, "注册失败: " + e.getMessage(), null)); }
        });
    }
    
    public static void sendCaptcha(final String paramsJson) {
        Log.d(TAG, "发送验证码: " + paramsJson);
        if (!sInitialized) { nativeOnResult("sendCaptcha", buildResponse(-1, "SDK 未初始化", null)); return; }
        final JSONObject p = parseJson(paramsJson);
        sMainHandler.post(() -> {
            try {
                String typeStr = p.optString("type", "phone");
                com.ruixue.openapi.CaptchaType type = "email".equalsIgnoreCase(typeStr) ? com.ruixue.openapi.CaptchaType.CaptchaType_email : com.ruixue.openapi.CaptchaType.CaptchaType_phone;
                String target = p.optString("target", "");
                String purpose = p.optString("purpose", "login");
                RXSDK.getInstance().sendCaptcha(type, target, purpose, new com.ruixue.RXRequestCallback() {
                    @Override public void onResponse(JSONObject jsonObject) { nativeOnResult("sendCaptcha", jsonObject.toString()); }
                });
            } catch (Exception e) { nativeOnResult("sendCaptcha", buildResponse(-1, "发送验证码失败: " + e.getMessage(), null)); }
        });
    }
    
    public static void realAuth(final String paramsJson) {
        Log.d(TAG, "实名认证API: " + paramsJson);
        if (!sInitialized) { nativeOnResult("realAuth", buildResponse(-1, "SDK 未初始化", null)); return; }
        final JSONObject p = parseJson(paramsJson);
        sMainHandler.post(() -> {
            try {
                RXSDK.getInstance().realAuth(p.optString("realname", ""), p.optString("idcard", ""),
                    new com.ruixue.RXRequestCallback() {
                        @Override public void onResponse(JSONObject jsonObject) { nativeOnResult("realAuth", jsonObject.toString()); }
                    });
            } catch (Exception e) { nativeOnResult("realAuth", buildResponse(-1, "实名认证失败: " + e.getMessage(), null)); }
        });
    }
    
    public static void getIIFAARedirectURL(final String paramsJson) {
        Log.d(TAG, "获取IIFAA跳转地址: " + paramsJson);
        if (!sInitialized) { nativeOnResult("getIIFAARedirectURL", buildResponse(-1, "SDK 未初始化", null)); return; }
        final JSONObject p = parseJson(paramsJson);
        sMainHandler.post(() -> {
            try {
                RXSDK.getInstance().getIIFAARedirectURL(
                    p.optString("app_name", ""),
                    p.optString("third_part_schema", ""),
                    new com.ruixue.RXRequestCallback() {
                        @Override public void onResponse(JSONObject jsonObject) { nativeOnResult("getIIFAARedirectURL", jsonObject.toString()); }
                    });
            } catch (Exception e) { nativeOnResult("getIIFAARedirectURL", buildResponse(-1, "获取IIFAA跳转地址失败: " + e.getMessage(), null)); }
        });
    }
    
    public static void searchBindingAccounts() {
        Log.d(TAG, "查询绑定账号");
        if (!sInitialized) { nativeOnResult("searchBindingAccounts", buildResponse(-1, "SDK 未初始化", null)); return; }
        sMainHandler.post(() -> {
            try {
                RXSDK.getInstance().searchBindingAccounts(new com.ruixue.RXRequestCallback() {
                    @Override public void onResponse(JSONObject jsonObject) { nativeOnResult("searchBindingAccounts", jsonObject.toString()); }
                });
            } catch (Exception e) { nativeOnResult("searchBindingAccounts", buildResponse(-1, "查询失败: " + e.getMessage(), null)); }
        });
    }

    public static void updateGameVersion(final String paramsJson) {
        Log.d(TAG, "游戏版本检查 V2: " + paramsJson);
        if (!sInitialized) { nativeOnResult("updateGameVersion", buildResponse(-1, "SDK 未初始化", null)); return; }
        sMainHandler.post(() -> {
            try {
                JSONObject params = parseJson(paramsJson);
                java.util.Map<String, Object> body = com.ruixue.utils.JSONUtil.toMapNonNull(params);
                RXSDK.getInstance().updateGameVersion(body, new RXRequestCallback() {
                    @Override public void onResponse(JSONObject jsonObject) {
                        nativeOnResult("updateGameVersion", jsonObject.toString());
                    }
                });
            } catch (Exception e) {
                nativeOnResult("updateGameVersion", buildResponse(-1, "版本检查失败: " + e.getMessage(), null));
            }
        });
    }

    /**
     * 上报第三方渠道角色信息（由 C++ 层调用）。
     */
    public static void setGameInfo(final String paramsJson) {
        if (!sInitialized) {
            nativeOnResult("setGameInfo", buildResponse(-1, "SDK 未初始化", null));
            return;
        }

        sMainHandler.post(() -> {
            try {
                JSONObject params = parseJson(paramsJson);
                GameInfo info = new GameInfo(
                        params.optInt("type", 0),
                        params.optString("roleId", ""),
                        params.optString("serverId", "default"));
                info.setRoleName(params.optString("roleName", info.getRoleId()));
                info.setServerName(params.optString("serverName", info.getServerId()));
                info.setGameRoleLevel(params.optString("gameRoleLevel", "1"));
                info.setRoleCreateTime(params.optLong("roleCreateTime", info.getRoleCreateTime()));
                info.setPartyId(params.optString("partyId", ""));
                info.setPartyName(params.optString("partyName", ""));
                info.setVipLevel(params.optInt("vipLevel", 0));
                info.setGameRolePower(params.optInt("gameRolePower", 0));
                info.setExperience(params.optString("experience", ""));
                info.setBalance(params.optString("balance", ""));
                info.setAttach(params.optString("attach", ""));
                RXSDK.getInstance().setGameInfo(info);
                nativeOnResult("setGameInfo",
                        buildResponse(0, "角色信息上报成功", null));
            } catch (Exception e) {
                nativeOnResult("setGameInfo",
                        buildResponse(-1, "角色信息上报失败: " + e.getMessage(), null));
            }
        });
    }

    // ==================== GDT 转化归因 ====================

    public static void gdtRegisterSdk() {
        // Android GDT 模块由依赖自动注册，无需显式处理。
    }

    public static void gdtInitialize(String actionSetId, String secretKey,
                                     String channel, String channelId) {
        if (sActivity == null) {
            Log.e(TAG, "GDT 初始化失败：Activity 未设置");
            return;
        }
        GDTSdkWrapper.getInstance().init(sActivity, actionSetId, secretKey, channel, channelId);
    }

    public static void gdtReportRegister(String method, boolean success) {
        GDTSdkWrapper.getInstance().reportRegister(method, success);
    }

    public static void gdtReportLogin(String method, boolean success) {
        GDTSdkWrapper.getInstance().reportLogin(method, success);
    }

    public static void gdtReportCreateRole(String role) {
        GDTSdkWrapper.getInstance().reportCreateRole(role);
    }

    public static void gdtReportCheckout(String type, String name, String contentId, int number,
                                         boolean isVirtualCurrency, String virtualCurrencyType,
                                         String currency, boolean success) {
        GDTSdkWrapper.getInstance().reportCheckout(type, name, contentId, number,
                isVirtualCurrency, virtualCurrencyType, currency, success);
    }

    /**
     * @param valueInCents 真实货币金额，单位：分
     */
    public static void gdtReportPurchase(String goodsType, String goodsName, String goodsId,
                                         int number, String goodsChannel, String currency,
                                         int valueInCents, boolean success) {
        GDTSdkWrapper.getInstance().reportPurchase(goodsType, goodsName, goodsId, number,
                goodsChannel, currency, valueInCents, success);
    }

    public static void gdtReportQuestFinish(String id, String type, String name, int number,
                                            String description, boolean success) {
        GDTSdkWrapper.getInstance().reportQuestFinish(id, type, name, number,
                description, success);
    }

    public static void gdtReportShare(String channel, boolean success) {
        GDTSdkWrapper.getInstance().reportShare(channel, success);
    }

    public static void gdtReportUpdateLevel(int level) {
        GDTSdkWrapper.getInstance().reportUpdateLevel(level);
    }

    public static void gdtReportRateApp(float value) {
        GDTSdkWrapper.getInstance().reportRateApp(value);
    }

    public static void gdtReportViewContent(String type, String name, String contentId) {
        GDTSdkWrapper.getInstance().reportViewContent(type, name, contentId);
    }

    public static void gdtReportAddToCart(String type, String name, String contentId,
                                          int number, boolean success) {
        GDTSdkWrapper.getInstance().reportAddToCart(type, name, contentId, number, success);
    }
    
    // ==================== 游戏区服 / 角色 ====================
    
    public static void createGameArea(final String paramsJson) {
        Log.d(TAG, "创建区服: " + paramsJson);
        if (!sInitialized) { nativeOnResult("createGameArea", buildResponse(-1, "SDK 未初始化", null)); return; }
        final JSONObject p = parseJson(paramsJson);
        sMainHandler.post(() -> {
            try {
                RXSDK.getInstance().createGameArea(
                    p.optString("areaId"), p.optString("areaName"),
                    p.optString("areaStatus", "new"), p.optString("areaType", "pve"), null,
                    new com.ruixue.RXRequestCallback() {
                        @Override public void onResponse(JSONObject jsonObject) { nativeOnResult("createGameArea", jsonObject.toString()); }
                    });
            } catch (Exception e) { nativeOnResult("createGameArea", buildResponse(-1, "创建区服失败: " + e.getMessage(), null)); }
        });
    }
    
    public static void searchGameAreaList() {
        Log.d(TAG, "查询区服列表");
        if (!sInitialized) { nativeOnResult("searchGameAreaList", buildResponse(-1, "SDK 未初始化", null)); return; }
        sMainHandler.post(() -> {
            try {
                RXSDK.getInstance().searchGameAreaListInfo(new com.ruixue.RXRequestCallback() {
                    @Override public void onResponse(JSONObject jsonObject) { nativeOnResult("searchGameAreaList", jsonObject.toString()); }
                });
            } catch (Exception e) { nativeOnResult("searchGameAreaList", buildResponse(-1, "查询失败: " + e.getMessage(), null)); }
        });
    }
    
    public static void searchGameAreaInfo(final String paramsJson) {
        Log.d(TAG, "查询区服详情: " + paramsJson);
        if (!sInitialized) { nativeOnResult("searchGameAreaInfo", buildResponse(-1, "SDK 未初始化", null)); return; }
        final JSONObject p = parseJson(paramsJson);
        sMainHandler.post(() -> {
            try {
                RXSDK.getInstance().searchGameAreaInfo(p.optString("areaId"),
                    new com.ruixue.RXRequestCallback() {
                        @Override public void onResponse(JSONObject jsonObject) { nativeOnResult("searchGameAreaInfo", jsonObject.toString()); }
                    });
            } catch (Exception e) { nativeOnResult("searchGameAreaInfo", buildResponse(-1, "查询失败: " + e.getMessage(), null)); }
        });
    }
    
    public static void createGameCharacter(final String paramsJson) {
        Log.d(TAG, "创建角色: " + paramsJson);
        if (!sInitialized) { nativeOnResult("createGameCharacter", buildResponse(-1, "SDK 未初始化", null)); return; }
        final JSONObject p = parseJson(paramsJson);
        sMainHandler.post(() -> {
            try {
                RXSDK.getInstance().createGameCharacter(
                    p.optString("areaId"), p.optString("characterName"),
                    p.optString("characterLevel", "1"), null, null, null, null, null,
                    p.optString("cpUserId"), null,
                    new com.ruixue.RXRequestCallback() {
                        @Override public void onResponse(JSONObject jsonObject) { nativeOnResult("createGameCharacter", jsonObject.toString()); }
                    });
            } catch (Exception e) { nativeOnResult("createGameCharacter", buildResponse(-1, "创建角色失败: " + e.getMessage(), null)); }
        });
    }
    
    public static void searchGameCharacterList(final String paramsJson) {
        Log.d(TAG, "查询角色列表: " + paramsJson);
        if (!sInitialized) { nativeOnResult("searchGameCharacterList", buildResponse(-1, "SDK 未初始化", null)); return; }
        final JSONObject p = parseJson(paramsJson);
        sMainHandler.post(() -> {
            try {
                RXSDK.getInstance().searchGameCharacterListInfo(p.optString("cpUserId"),
                    new com.ruixue.RXRequestCallback() {
                        @Override public void onResponse(JSONObject jsonObject) { nativeOnResult("searchGameCharacterList", jsonObject.toString()); }
                    });
            } catch (Exception e) { nativeOnResult("searchGameCharacterList", buildResponse(-1, "查询失败: " + e.getMessage(), null)); }
        });
    }
    
    public static void searchGameCharacterInfo(final String paramsJson) {
        Log.d(TAG, "查询角色详情: " + paramsJson);
        if (!sInitialized) { nativeOnResult("searchGameCharacterInfo", buildResponse(-1, "SDK 未初始化", null)); return; }
        final JSONObject p = parseJson(paramsJson);
        sMainHandler.post(() -> {
            try {
                RXSDK.getInstance().searchGameCharacterInfo(p.optString("cpUserId"), p.optString("areaId"), p.optString("characterId"),
                    new com.ruixue.RXRequestCallback() {
                        @Override public void onResponse(JSONObject jsonObject) { nativeOnResult("searchGameCharacterInfo", jsonObject.toString()); }
                    });
            } catch (Exception e) { nativeOnResult("searchGameCharacterInfo", buildResponse(-1, "查询失败: " + e.getMessage(), null)); }
        });
    }
    
    public static void updateGameCharacter(final String paramsJson) {
        Log.d(TAG, "更新角色: " + paramsJson);
        if (!sInitialized) { nativeOnResult("updateGameCharacter", buildResponse(-1, "SDK 未初始化", null)); return; }
        final JSONObject p = parseJson(paramsJson);
        sMainHandler.post(() -> {
            try {
                RXSDK.getInstance().updateGameCharacterInfo(
                    p.optString("characterId"), p.optString("areaId", null),
                    null, p.optString("characterLevel", null), p.optString("characterName", null),
                    null, null, null, null, p.optString("cpUserId"), null,
                    new com.ruixue.RXRequestCallback() {
                        @Override public void onResponse(JSONObject jsonObject) { nativeOnResult("updateGameCharacter", jsonObject.toString()); }
                    });
            } catch (Exception e) { nativeOnResult("updateGameCharacter", buildResponse(-1, "更新失败: " + e.getMessage(), null)); }
        });
    }
    
    public static void deleteGameCharacter(final String paramsJson) {
        Log.d(TAG, "删除角色: " + paramsJson);
        if (!sInitialized) { nativeOnResult("deleteGameCharacter", buildResponse(-1, "SDK 未初始化", null)); return; }
        final JSONObject p = parseJson(paramsJson);
        sMainHandler.post(() -> {
            try {
                RXSDK.getInstance().deleteGameCharacter(p.optString("areaId"), p.optString("characterId"), p.optString("cpUserId"),
                    new com.ruixue.RXRequestCallback() {
                        @Override public void onResponse(JSONObject jsonObject) { nativeOnResult("deleteGameCharacter", jsonObject.toString()); }
                    });
            } catch (Exception e) { nativeOnResult("deleteGameCharacter", buildResponse(-1, "删除失败: " + e.getMessage(), null)); }
        });
    }
    
    // ==================== 数据埋点 ====================
    
    public static void getDistinctId() {
        Log.d(TAG, "获取 DistinctId");
        sMainHandler.post(() -> {
            try {
                JSONObject data = new JSONObject();
                data.put("distinctId", RXSDK.getDistinctId());
                nativeOnResult("getDistinctId", buildResponse(0, "获取成功", data));
            } catch (Exception e) {
                nativeOnResult("getDistinctId", buildResponse(-1, "获取失败: " + e.getMessage(), null));
            }
        });
    }
    
    public static void dataTrack(final String paramsJson) {
        Log.d(TAG, "数据埋点: " + paramsJson);
        final JSONObject p = parseJson(paramsJson);
        sMainHandler.post(() -> {
            try {
                String eventName = p.optString("eventName", "");
                String distinctId = p.optString("distinctId", "");
                java.util.HashMap<String, Object> properties = new java.util.HashMap<>();
                JSONObject props = p.optJSONObject("properties");
                if (props != null) {
                    java.util.Iterator<String> keys = props.keys();
                    while (keys.hasNext()) { String k = keys.next(); properties.put(k, props.opt(k)); }
                }
                boolean result = RXSDK.getInstance().dataTrack(eventName, distinctId, properties);
                JSONObject data = new JSONObject();
                data.put("result", result);
                nativeOnResult("dataTrack", buildResponse(result ? 0 : -1, result ? "埋点成功" : "埋点失败", data));
            } catch (Exception e) { nativeOnResult("dataTrack", buildResponse(-1, "埋点失败: " + e.getMessage(), null)); }
        });
    }
    
    public static void trackUserAction(final String paramsJson) {
        Log.d(TAG, "行为上报: " + paramsJson);
        final JSONObject p = parseJson(paramsJson);
        sMainHandler.post(() -> {
            try {
                String distinctId = p.optString("distinctId", "");
                java.util.HashMap<String, Object> properties = new java.util.HashMap<>();
                JSONObject props = p.optJSONObject("properties");
                if (props != null) {
                    java.util.Iterator<String> keys = props.keys();
                    while (keys.hasNext()) { String k = keys.next(); properties.put(k, props.opt(k)); }
                }
                RXSDK.getInstance().trackUserAction(distinctId, properties);
                nativeOnResult("trackUserAction", buildResponse(0, "行为上报成功", null));
            } catch (Exception e) { nativeOnResult("trackUserAction", buildResponse(-1, "上报失败: " + e.getMessage(), null)); }
        });
    }
    
    // ==================== 反馈 / 达人福利 ====================
    
    public static void createFeedback(final String paramsJson) {
        Log.d(TAG, "提交反馈: " + paramsJson);
        if (!sInitialized) { nativeOnResult("createFeedback", buildResponse(-1, "SDK 未初始化", null)); return; }
        final JSONObject p = parseJson(paramsJson);
        sMainHandler.post(() -> {
            try {
                java.util.HashMap<String, Object> params = new java.util.HashMap<>();
                params.put("kind_id", p.optString("kindId", "bug_report"));
                params.put("content", p.optString("content", ""));
                if (p.has("contact")) params.put("contact", p.optString("contact"));
                RXSDK.getInstance().createFeedback(params, new com.ruixue.RXRequestCallback() {
                    @Override public void onResponse(JSONObject jsonObject) { nativeOnResult("createFeedback", jsonObject.toString()); }
                });
            } catch (Exception e) { nativeOnResult("createFeedback", buildResponse(-1, "提交失败: " + e.getMessage(), null)); }
        });
    }
    
    public static void getTempNotice() {
        Log.d(TAG, "获取临时维护公告");
        if (!sInitialized) { nativeOnResult("getTempNotice", buildResponse(-1, "SDK 未初始化", null)); return; }
        sMainHandler.post(() -> {
            try {
                RXSDK.getInstance().getTempNotice(new com.ruixue.RXRequestCallback() {
                    @Override public void onResponse(JSONObject jsonObject) { nativeOnResult("getTempNotice", jsonObject.toString()); }
                });
            } catch (Exception e) { nativeOnResult("getTempNotice", buildResponse(-1, "获取失败: " + e.getMessage(), null)); }
        });
    }
    
    public static void getUnreadMessageCount() {
        Log.d(TAG, "获取未读消息数");
        if (!sInitialized) { nativeOnResult("getUnreadMsgCount", buildResponse(-1, "SDK 未初始化", null)); return; }
        sMainHandler.post(() -> {
            try {
                RXSDK.getInstance().getServiceChatUnreadCount(new com.ruixue.RXRequestCallback() {
                    @Override public void onResponse(JSONObject jsonObject) { nativeOnResult("getUnreadMsgCount", jsonObject.toString()); }
                });
            } catch (Exception e) { nativeOnResult("getUnreadMsgCount", buildResponse(-1, "查询失败: " + e.getMessage(), null)); }
        });
    }
    
    public static void getPromoDisplayKey() {
        Log.d(TAG, "获取达人福利码");
        if (!sInitialized) { nativeOnResult("getPromoDisplayKey", buildResponse(-1, "SDK 未初始化", null)); return; }
        sMainHandler.post(() -> {
            try {
                RXSDK.getInstance().getPromoDisplayKEY(true, new com.ruixue.RXRequestCallback() {
                    @Override public void onResponse(JSONObject jsonObject) { nativeOnResult("getPromoDisplayKey", jsonObject.toString()); }
                });
            } catch (Exception e) { nativeOnResult("getPromoDisplayKey", buildResponse(-1, "获取失败: " + e.getMessage(), null)); }
        });
    }
    
    // ==================== 其他功能（核心） ====================
    
    /**
     * 获取设备信息
     */
    public static String getDeviceInfo() {
        try {
            JSONObject info = new JSONObject();
            info.put("platform", "Android");
            info.put("manufacturer", Build.MANUFACTURER);
            info.put("model", Build.MODEL);
            info.put("brand", Build.BRAND);
            info.put("sdkVersion", Build.VERSION.SDK_INT);
            info.put("release", Build.VERSION.RELEASE);
            info.put("device", Build.DEVICE);
            return info.toString();
        } catch (Exception e) {
            Log.e(TAG, "获取设备信息失败", e);
            return "{}";
        }
    }
    
    // ==================== 生命周期回调 ====================
    
    public static void onResume() {
        RXSDK.onResume(sActivity);
    }
    
    public static void onPause() {
        RXSDK.onPause(sActivity);
    }
    
    public static void onDestroy() {
        sActivity = null;
    }
}
