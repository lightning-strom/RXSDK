package com.ruixue.sdk;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;
import android.util.SparseArray;

import androidx.annotation.NonNull;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;
import com.hihonor.ads.identifier.AdvertisingIdClient;
import com.hihonor.gamecenter.gcjointsdk.APICallback;
import com.hihonor.gamecenter.gcjointsdk.model.UserGameInfoParam;
import com.hihonor.gamecenter.gcjointsdk.sdk.AppParams;
import com.hihonor.gamecenter.gcjointsdk.sdk.GCJointSdk;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.legal.AntiAddictDelegate;
import com.ruixue.legal.PrivacyCallback;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.GameInfo;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginData;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

public class HonorSdkApiImpl extends RXSdkApi {

    private final HonorBillingImpl billingClient;
    private final AtomicBoolean isInited = new AtomicBoolean(false);

    private RXJSONCallback loginCallback;


    private AntiAddictDelegate antiAddictDelegate;
    private boolean force_update = false;
    String honor_appid;
    String honor_cpid;
    String sandbox_token;
    boolean reconfirm_login;

    private static final SparseArray<String> StatusCodesMessage = new SparseArray<>();

    static {
//        StatusCodesMessage.put(JosStatusCodes.JOS_PRIVACY_PROTOCOL_REJECTED, "未同意华为隐私协议"); // 错误码为7401时表示用户未同意华为联运隐私协议
//        StatusCodesMessage.put(GamesStatusCodes.GAME_STATE_NETWORK_ERROR, "网络异常");
//        StatusCodesMessage.put(907135003, "玩家取消HMS Core升级或组件升级");
//        StatusCodesMessage.put(7021, "玩家取消了实名认证");
//        StatusCodesMessage.put(2002, "玩家未实名认证");
//        StatusCodesMessage.put(GamesStatusCodes.GAME_STATE_USER_CANCEL_LOGIN, "用户取消登录。");
//        StatusCodesMessage.put(GamesStatusCodes.GAME_STATE_USER_CANCEL, "用户取消操作。");
    }

    @Override
    public void onApplicationCreate(Application application) {
        super.onApplicationCreate(application);
        GCJointSdk.setApplication(application);
    }

    static class Single {
        final static HonorSdkApiImpl INSTANCE = new HonorSdkApiImpl();
    }

    protected HonorSdkApiImpl() {
        billingClient = new HonorBillingImpl();
    }

    @NonNull
    public static HonorSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public void onLoginResp(int code) {
        super.onLoginResp(code);


    }

    @Override
    public void onResume(Activity activity) {
        super.onResume(activity);

    }

    @Override
    public void onPause(Activity activity) {
        super.onPause(activity);

    }

    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder().setName("honor").setVersion("2.0.13.301").build();
    }

    @Override
    public void setupAddictDelegate(AntiAddictDelegate antiAddictDelegate) {
        this.antiAddictDelegate = antiAddictDelegate;
    }

    @SafeVarargs
    public static Object firstNonNull(Map<String, Object> map, String... keys) {
        for (String key : keys) {
            Object value = map.get(key);
            if (value != null)
                return value;
        }
        return null;
    }

    @Override
    public void initThirdSdk(@NonNull Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        force_update = ObjectUtils.toBoolean(hashMap.get("force_update"));
        honor_appid = hashMap.get("honor_appid") != null
                ? (String) hashMap.get("honor_appid")
                : (String) hashMap.get("appid");

        honor_cpid = hashMap.get("honor_cpid") != null
                ? (String) hashMap.get("honor_cpid")
                : (String) hashMap.get("cpid");
        sandbox_token = (String) hashMap.get("sandbox_token");
        reconfirm_login = ObjectUtils.toBoolean(hashMap.get("reconfirm_login"));
        Thread getIdentifierThread = new Thread() {
            @Override
            public void run() {
                try {
                    AdvertisingIdClient.Info info = AdvertisingIdClient.getAdvertisingIdInfo(activity.getApplicationContext());
                    if (null != info) {
                        if (!TextUtils.isEmpty(info.id))
                            RuiXueSdk.setOAID(info.id);
                        RXLogger.i("getAdvertisingIdInfo id=" + info.id + ", isLimitAdTrackingEnabled=" + info.isLimit);
                    }
                } catch (Exception e) {
//                    e.printStackTrace();
                    RXLogger.e("getAdvertisingIdInfo Exception: " + e);
//                    callback.onError(new RXException(e));
                }
                ThreadUtils.getInstance().runOnUiThread(() -> callback.onSuccess(null));
            }
        };
        getIdentifierThread.start();
    }


    @Override
    public void login(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_LOGIN_METHOD)) {
            hashMap.put(KEY_LOGIN_METHOD, LoginMethod.HONOR);
        }
        super.login(activity, hashMap, callback);
    }


    public static class HonorLoginResult implements Serializable {
        /// /身份验证信息，可用于服务端校验
        @SerializedName("token")
        protected String token;
        /// /荣耀用户标识，同一用户在不同appid下openID不同
        @SerializedName("openid")
        protected String openid;
        @SerializedName(value = "is_adult", alternate = {"isAdult"})
        protected Boolean is_adult;
        @SerializedName(value = "has_real_name", alternate = {"hasRealName"})
        protected Boolean has_real_name;
        /// /荣耀用户标识，同一用户在同一个开发者下unionId相同
        @SerializedName(value = "unionid", alternate = {"unionId"})
        protected String unionid;
        @SerializedName(value = "display_name", alternate = {"displayName"})
        protected String display_name;
        @SerializedName(value = "head_picture_url", alternate = {"headPictureURL"})
        protected String head_picture_url;

        public static HonorLoginResult objectFromData(String str) {
            return new Gson().fromJson(str, HonorLoginResult.class);
        }

        public String toJson() {
            return new Gson().toJson(this);
        }
    }

    @Override
    public boolean thirdLogin(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (hashMap.containsKey("sandbox_token")) {
            sandbox_token = (String) hashMap.get("sandbox_token");
        }
        AppParams appParams = new AppParams.Builder().setAppId(honor_appid)                                                 //从荣耀开发者平台获取的appid
                .setCpId(honor_cpid)                                                //从荣耀开发者平台开发者资料中查看，此处需要支付功能为必填参数
                .setEnableLog(RXGlobalData.isDebugEnable()).setAntiAddictionCallback(() -> {
                    //您可在此处实现游戏防沉迷功能
                    //如保存游戏或直接游戏进程退出(如System.exit(0))
                    if (this.antiAddictDelegate != null) {
                        this.antiAddictDelegate.didAddictInfoUpdate(JSONUtil.toJSONString(0, ""));
                    }
                }).setSanBoxToken(sandbox_token).setCpCloudUrl((String) hashMap.get("cp_cloud_url")).build();

        GCJointSdk.init(appParams, new APICallback() {
            @Override
            public void onSuccess(String result) {


                try {
                    HonorLoginResult loginResult = HonorLoginResult.objectFromData(result);
                    callback.onSuccess(new JSONObject(loginResult.toJson()));
                } catch (JSONException e) {
                    callback.onError(new RXException(e));
                }
            }

            @Override
            public void onFailure(int errorCode, String message) {
                if (callback != null)
                    callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(errorCode, message));
            }
        });
        return true;
    }

    @Override
    public boolean exitApp(Activity activity, OnAppExitCallback callback) {
        GCJointSdk.exit(activity, code -> {
            switch (code) {
                case 0://游戏开发者无需处理
                    if (callback != null) {
                        callback.onExitCancel();
                    }
                case 2://游戏开发者无需处理
                    break;
                case 1://游戏开发者执行用户退出行为
                case 3://游戏开发者执行用户退出行为
                {
                    if (callback != null) {
                        callback.onExitConfirm(JSONUtil.toJSONString(code, ""));
                    }
                }
                break;
                default:
                    break;
            }
        });
        return isInited.get();
    }

    /**
     * 统一角色上报入口 → {@link GCJointSdk#reportUserGameInfoData}。
     * 荣耀侧无创角/升级分事件，任意 {@code type} 均按当前角色快照上报。
     */
    @Override
    public void setGameInfo(GameInfo gameInfo) {
        if (gameInfo == null) {
            RXLogger.e("honor setGameInfo skipped: gameInfo is null");
            return;
        }
        String roleId = defaultIfEmpty(gameInfo.getRoleId(), "0");
        String roleName = defaultIfEmpty(gameInfo.getRoleName(), roleId);
        String realmId = defaultIfEmpty(
                firstAttach(gameInfo.getAttach(), "realm_id", "realmId"),
                defaultIfEmpty(gameInfo.getServerId(), "1"));
        String realmName = defaultIfEmpty(
                firstAttach(gameInfo.getAttach(), "realm_name", "realmName"),
                defaultIfEmpty(gameInfo.getServerName(), realmId));
        String chapter = defaultIfEmpty(firstAttach(gameInfo.getAttach(), "chapter"), "");
        Map<String, String> ext = attachToExtMap(gameInfo.getAttach());
        reportUserData(roleId, roleName, parseLevel(gameInfo.getGameRoleLevel(), 1),
                realmId, realmName, chapter, ext);
        super.setGameInfo(gameInfo);
    }

    public void reportUserData(String roleId, String roleName, int roleLevel, String realmId, String realmName, String chapter, Map<String, String> ext) {
        GCJointSdk.reportUserGameInfoData(new UserGameInfoParam(roleId, roleName, roleLevel, realmId, realmName, chapter, ext), new APICallback() {
            @Override
            public void onSuccess(String resultMessage) {
                RXLogger.i("上报游戏角色数据成功 ,resultMessage:" + resultMessage);
            }

            @Override
            public void onFailure(int resultCode, String resultMessage) {
                RXLogger.i("上报游戏角色数据失败 ,resultCode:" + resultCode + "resultMessage:" + resultMessage);
            }
        });
    }

    private static String defaultIfEmpty(String value, String defaultValue) {
        return TextUtils.isEmpty(value) ? defaultValue : value;
    }

    private static int parseLevel(String levelText, int defaultValue) {
        if (TextUtils.isEmpty(levelText)) {
            return defaultValue;
        }
        try {
            return Integer.parseInt(levelText.trim());
        } catch (NumberFormatException ignore) {
            return defaultValue;
        }
    }

    private static String firstAttach(String attach, String... keys) {
        if (TextUtils.isEmpty(attach) || keys == null) {
            return null;
        }
        try {
            JSONObject json = new JSONObject(attach);
            for (String key : keys) {
                String value = json.optString(key, null);
                if (!TextUtils.isEmpty(value)) {
                    return value;
                }
            }
        } catch (JSONException ignore) {
            // ignore
        }
        return null;
    }

    private static Map<String, String> attachToExtMap(String attach) {
        Map<String, String> ext = new HashMap<>();
        if (TextUtils.isEmpty(attach)) {
            return ext;
        }
        try {
            JSONObject json = new JSONObject(attach);
            Iterator<String> it = json.keys();
            while (it.hasNext()) {
                String key = it.next();
                if ("realm_id".equals(key) || "realmId".equals(key)
                        || "realm_name".equals(key) || "realmName".equals(key)
                        || "chapter".equals(key)) {
                    continue;
                }
                Object value = json.opt(key);
                if (value != null && value != JSONObject.NULL) {
                    ext.put(key, String.valueOf(value));
                }
            }
        } catch (JSONException ignore) {
            // attach 非 JSON 时透传原文
            ext.put("attach", attach);
        }
        return ext;
    }

    @Override
    public void setPrivacyAgree(Context context, boolean isAgree, PrivacyCallback privacyCallback) {
        super.setPrivacyAgree(context, isAgree, privacyCallback);
    }

    @Override
    public boolean jumpToAppStore(Activity activity) {
        return AppUtils.launchAppDetail(activity, activity.getPackageName(), "com.hihonor.appmarket");

    }

    public void repayFailOrder(Activity activity, RXJSONCallback callback) {
        billingClient.obtainOwnedPurchases(activity, callback);
    }


    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        super.onActivityResult(activity, requestCode, resultCode, data);
    }

    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        billingClient.pay(activity, hashMap, callback);
    }
}
