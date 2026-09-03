package com.ruixue.sdk;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;
import android.util.SparseArray;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.huawei.agconnect.common.network.AccessNetworkManager;
import com.huawei.hmf.tasks.OnFailureListener;
import com.huawei.hmf.tasks.OnSuccessListener;
import com.huawei.hmf.tasks.Task;
import com.huawei.hms.api.HuaweiMobileServicesUtil;
import com.huawei.hms.common.ApiException;
import com.huawei.hms.jos.AppParams;
import com.huawei.hms.jos.AppUpdateClient;
import com.huawei.hms.jos.JosApps;
import com.huawei.hms.jos.JosAppsClient;
import com.huawei.hms.jos.JosStatusCodes;
import com.huawei.hms.jos.games.Games;
import com.huawei.hms.jos.games.GamesStatusCodes;
import com.huawei.hms.jos.games.player.Player;
import com.huawei.hms.jos.games.player.PlayersClientImpl;
import com.huawei.hms.support.account.AccountAuthManager;
import com.huawei.hms.support.account.request.AccountAuthParams;
import com.huawei.hms.support.account.request.AccountAuthParamsHelper;
import com.huawei.hms.support.account.result.AccountAuthResult;
import com.huawei.hms.support.account.result.AuthAccount;
import com.huawei.hms.utils.ResourceLoaderUtil;
import com.ruixue.RXJSONCallback;
import com.ruixue.base.SdkInfo;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.legal.AntiAddictDelegate;
import com.ruixue.legal.PrivacyCallback;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RxErrorReportUtil;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

public class HmsSdkApiImpl extends RXSdkApi {
    private static final int REQ_SIGN_IN_INTENT = 3000;
    private final HmsBillingImpl billingClient;
    private final AtomicBoolean isInited = new AtomicBoolean(false);

    private AuthAccount currentAuthAccount;
    private RXJSONCallback loginCallback;


    public void updateAuthAccount(AuthAccount authAccount) {
        currentAuthAccount = authAccount;
    }

    public AuthAccount getAuthAccount() {
        return currentAuthAccount;
    }

    private AntiAddictDelegate antiAddictDelegate;
    private boolean force_update = false;

    private static final SparseArray<String> StatusCodesMessage = new SparseArray<>();

    static {
        StatusCodesMessage.put(JosStatusCodes.JOS_PRIVACY_PROTOCOL_REJECTED, "未同意华为隐私协议"); // 错误码为7401时表示用户未同意华为联运隐私协议
        StatusCodesMessage.put(GamesStatusCodes.GAME_STATE_NETWORK_ERROR, "网络异常");
        StatusCodesMessage.put(907135003, "玩家取消HMS Core升级或组件升级");
        StatusCodesMessage.put(7021, "玩家取消了实名认证");
        StatusCodesMessage.put(2002, "玩家未实名认证");
        StatusCodesMessage.put(GamesStatusCodes.GAME_STATE_USER_CANCEL_LOGIN, "用户取消登录。");
        StatusCodesMessage.put(GamesStatusCodes.GAME_STATE_USER_CANCEL, "用户取消操作。");
    }

    @Override
    public void onApplicationCreate(Application application) {
        super.onApplicationCreate(application);
        HuaweiMobileServicesUtil.setApplication(application);
    }

    static class Single {
        final static HmsSdkApiImpl INSTANCE = new HmsSdkApiImpl();
    }

    protected HmsSdkApiImpl() {
        billingClient = new HmsBillingImpl();
    }

    @NonNull
    public static HmsSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public void onResume(Activity activity) {
        super.onResume(activity);
        RXLogger.i("华为浮窗showFloatWindow");
        if (isInited.get()) {
            // 请务必在init成功后，调用浮标接口
            Games.getBuoyClient(activity).showFloatWindow();
        }
    }

    @Override
    public void onPause(Activity activity) {
        super.onPause(activity);
        RXLogger.i("华为浮窗hideFloatWindow");
        if (isInited.get()) {
            // 请务必在init成功后，调用浮标接口
            Games.getBuoyClient(activity).hideFloatWindow();
        }
    }

    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder().setName("huawei").setVersion("6.14.0.300").build();
    }

    @Override
    public void setupAddictDelegate(AntiAddictDelegate antiAddictDelegate) {
        this.antiAddictDelegate = antiAddictDelegate;
    }

    @Override
    public void initThirdSdk(@NonNull Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        force_update = ObjectUtils.toBoolean(hashMap.get("force_update"));
        activity.runOnUiThread(() -> init(activity, callback));
    }


    //   错误码： https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/agc-sms-errorcode-0000001077121952
    //   https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/game-start-0000001050123475
  /*      调用JosApps.getJosAppsClient方法初始化JosAppsClient对象，
        并调用JosAppsClient.init(AppParams appParams)方法进行HMS Core SDK初始化和游戏公告初始化，
        AppParams中传入游戏应用对应的Scope（AccountAuthParams.DEFAULT_AUTH_REQUEST_PARAM_GAME），
        并设置AntiAddictionCallback防沉迷回调，在onExit方法中实现触发防沉迷后的游戏保存、帐号登出等功能。
        调用init接口进行游戏初始化时，HMS Core SDK会向用户弹出华为联运隐私协议窗口，用户如果拒绝则会返回7401错误码，
        此时应禁止用户进入游戏。*/
    private void init(Activity activity, RXJSONCallback callback) {
        if (isAgreedPrivacy() && !AccessNetworkManager.getInstance().canAccessNetwork()) {
            AccessNetworkManager.getInstance().setAccessNetwork(true);
        }
        AccountAuthParams params = AccountAuthParams.DEFAULT_AUTH_REQUEST_PARAM_GAME;
        JosAppsClient appsClient = JosApps.getJosAppsClient(activity);
        Task<Void> initTask;
        // Set the anti-addiction prompt context, this line must be added
        // 设置防沉迷提示语的Conext，此行必须添加
        ResourceLoaderUtil.setmContext(activity);
        initTask = appsClient.init(new AppParams(params, () -> {
            // System.exit(0);
            // The callback will return in two situations:
            // 1. When a no-adult, real name user logs in to the game during the day, Huawei will pop up a box to remind the player that the game is not allowed. The player clicks "OK" and Huawei will return to the callback
            // 2. The no-adult, real name user logs in the game at the time allowed by the state. At 9 p.m., Huawei will pop up a box to remind the player that it is time. The player clicks "I know" and Huawei will return to the callback
            // You can realize the anti addiction function of the game here, such as saving the game, calling the account to exit the interface or directly the game process
            // 该回调会在如下两种情况下返回:
            // 1.未成年人实名帐号在白天登录游戏，华为会弹框提示玩家不允许游戏，玩家点击“确定”，华为返回回调
            // 2.未成年实名帐号在国家允许的时间登录游戏，到晚上9点，华为会弹框提示玩家已到时间，玩家点击“知道了”，华为返回回调
            // 您可在此处实现游戏防沉迷功能，如保存游戏、调用帐号退出接口或直接游戏进程退出(如System.exit(0))
            if (null != antiAddictDelegate) {
                antiAddictDelegate.didAddictInfoUpdate("");
            }
        }));
        initTask.addOnSuccessListener(aVoid -> {
            isInited.set(true);
            // Games released in the Chinese mainland: The update API provided by Huawei must be called upon game launch.
            // Games released outside the Chinese mainland: It is optional for calling the update API provided by Huawei upon game launch.
            // 检测应用新版本，中国大陆发布的应用：应用启动时必须使用华为升级接口进行应用升级。
            // 中国大陆以外发布的应用：不强制要求。
            checkUpdate(activity, force_update);
            // Make sure that the interface of showFloatWindow() is successfully called once after the game has been initialized successfully
            // 游戏初始化成功后务必成功调用过一次浮标显示接口
            Games.getBuoyClient(activity).showFloatWindow();
            billingClient.isEnvReady(activity);
            if (callback != null)
                callback.onSuccess(null);
        }).addOnFailureListener(e -> {
            e.printStackTrace();
            if (e instanceof ApiException) {
                ApiException apiException = (ApiException) e;
                int statusCode = apiException.getStatusCode();
                if (statusCode == JosStatusCodes.JOS_PRIVACY_PROTOCOL_REJECTED) {
                    // Error code 7401 indicates that the user did not agree to Huawei joint operations privacy agreement
                    // 错误码为7401时表示用户未同意华为联运隐私协议
//                                showLog("has reject the protocol");
                    // You need to prohibit players from entering the game here.
                    // 此处您需禁止玩家进入游戏
                } else if (statusCode == GamesStatusCodes.GAME_STATE_NETWORK_ERROR) {
                    // Error code 7002 indicates network error
                    // 错误码7002表示网络异常
//                                showLog("network error");
                    // 此处您可提示玩家检查网络，请不要重复调用init接口，否则断网情况下可能会造成手机高耗电。
                    // You can ask the player to check the network. Do not invoke the init interface repeatedly. Otherwise, the phone may consume a lot of power if the network is disconnected.
                } else if (statusCode == 907135003) {
                    // 907135003表示玩家取消HMS Core升级或组件升级
                    // 907135003 indicates that user rejected the installation or upgrade of HMS Core.
//                                showLog("init statusCode=" + statusCode);
//                                init(activity);
                } else {
                    // Handle other error codes
                    // 在此处实现其他错误码的处理
                }
                RXLogger.e("rx hms init failed:" + apiException.getMessage());
                if (callback != null) {
                    RXException rxException = new RXException(RXErrorCode.THIRD_INIT_ERROR, statusCode, apiException.getMessage());
                    callback.onError(rxException);
                    RxErrorReportUtil.ThirdInitError.isError = true;
                    RxErrorReportUtil.ThirdInitError.thirdName = "huawei";
                    RxErrorReportUtil.ThirdInitError.cause = rxException.toJSONObject();
                }
            } else {
                if (callback != null) {
                    RXException rxException = new RXException(e);
                    callback.onError(rxException);
                    RxErrorReportUtil.ThirdInitError.isError = true;
                    RxErrorReportUtil.ThirdInitError.thirdName = "huawei";
                    RxErrorReportUtil.ThirdInitError.cause = rxException.toJSONObject();
                }
            }
        });
    }

    @Override
    public void login(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_LOGIN_METHOD)) {
            hashMap.put(KEY_LOGIN_METHOD, LoginMethod.HUAWEI);
        }
        super.login(activity, hashMap, callback);
    }

    @Override
    public boolean thirdLogin(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        signIn(activity, callback);
        return true;
    }


    @Override
    public void setPrivacyAgree(Context context, boolean isAgree, PrivacyCallback privacyCallback) {
        if (isAgree) {
            AccessNetworkManager.getInstance().setAccessNetwork(true);
        }
        super.setPrivacyAgree(context, isAgree, privacyCallback);
    }

    @Override
    public boolean jumpToAppStore(Activity activity) {
        return AppUtils.launchAppDetail(activity, activity.getPackageName(), "com.huawei.appmarket");

    }

    public void repayFailOrder(Activity activity, RXJSONCallback callback) {
        billingClient.obtainOwnedPurchases(activity, callback);
    }

    public void signIn(Activity activity, RXJSONCallback callback) {
        if (!isInited.get()) {
            init(activity, new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    signIn(activity, callback);
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    if (callback != null) {
                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_INIT_ERROR));
                    }
                }
            });
        } else {
//            调用静默登录接口。
            Task<AuthAccount> authAccountTask = AccountAuthManager.getService(activity, getHuaweiIdParams()).silentSignIn();
            authAccountTask.addOnSuccessListener(authAccount -> {
                showLog("signIn success");
                showLog("display:" + authAccount.getDisplayName());
                updateAuthAccount(authAccount);
                getCurrentPlayer(activity, callback);
            }).addOnFailureListener(e -> {
                if (e instanceof ApiException) {
                    ApiException apiException = (ApiException) e;
                    showLog("signIn failed:" + apiException.getStatusCode());
                    showLog("start getSignInIntent");
                    signInNewWay(activity, callback);
                }
            });
        }

    }

    private void showLog(String log) {
        RXLogger.i(log);
    }

    //https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/game-login-0000001050121526
    //https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/authaccount-0000001050315810
    public AccountAuthParams getHuaweiIdParams() {
        return new AccountAuthParamsHelper(AccountAuthParams.DEFAULT_AUTH_REQUEST_PARAM_GAME).setIdToken().setId().setProfile().setAuthorizationCode().createParams();
    }

    public void checkUpdate(Activity activity, boolean force) {
        AppUpdateClient client = JosApps.getAppUpdateClient(activity);
        client.checkAppUpdate(activity, new HmsUpdateCallBack(activity, force));
    }

    /**
     * 获取当前登录的玩家对象，从Player对象中获取玩家信息。
     */
    public void getCurrentPlayer(Activity activity, RXJSONCallback callback) {
        PlayersClientImpl client = (PlayersClientImpl) Games.getPlayersClient(activity);

        Task<Player> task = client.getCurrentPlayer();
        task.addOnSuccessListener(new OnSuccessListener<Player>() {
            @Override
            public void onSuccess(Player player) {
                Map<String, String> hashMap = new HashMap<>();
                if (currentAuthAccount != null) {
                    hashMap.put("photoUriString", currentAuthAccount.getAvatarUriString());
                    hashMap.put("serverAuthCode", currentAuthAccount.getAuthorizationCode());
                    hashMap.put("unionid", currentAuthAccount.getUnionId());
                    hashMap.put("openid", currentAuthAccount.getOpenId());
                    HmsSdkHelper.setOpenId(currentAuthAccount.getOpenId());
                    hashMap.put("idToken", currentAuthAccount.getAccessToken());
                }
                if (ObjectUtils.isEmpty(hashMap.get("idToken")) || TextUtils.isEmpty(hashMap.get("idToken"))) {
                    hashMap.put("idToken", player.getAccessToken());
                }

                HmsSdkHelper.setPlayerId(player.getPlayerId());
                hashMap.put("playerId", player.getPlayerId());
                hashMap.put("displayName", player.getDisplayName());
//                if (ObjectUtils.isEmpty(hashMap.get("openid")) || TextUtils.isEmpty(hashMap.get("openid"))) {
                hashMap.put("ts", player.getSignTs());
                hashMap.put("playerSign", player.getPlayerSign());
                hashMap.put("openIdSign", player.getOpenIdSign());
                hashMap.put("playerLevel", String.valueOf(player.getLevel()));
//                }
//                        hashMap.put("iconImageUri", player.getIconImageUri());
//                        hashMap.put("hiResImageUri", player.getHiResImageUri());

                RXLogger.i("getCurrentPlayer:" + hashMap);
                if (callback != null)
                    callback.onSuccess(new JSONObject(hashMap));
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(Exception e) {
                if (e instanceof ApiException) {
                    ApiException ae = (ApiException) e;
                    if (7400 == ae.getStatusCode() || 7018 == ae.getStatusCode()) {
                        // 7400表示用户未签署联运协议，需要继续调用init接口
                        // 7018表示初始化失败，需要继续调用init接口
                        // error code 7400 indicates that the user has not agreed to the joint operations privacy agreement
                        // error code 7018 indicates that the init API is not called.
                        init(activity, null);
                    }
                    callback.onError(new RXException(RXErrorCode.THIRD_LOGIN_ERROR, ae.getStatusCode(), ae.getMessage()));
                } else {
                    callback.onError(new RXException(RXErrorCode.THIRD_LOGIN_ERROR.getValue(), e));
                }

            }
        });
    }

    /**
     * Login authorization result response processing method.
     * *
     * 登录授权的结果响应处理方法
     * @param data Data
     */
    private void handleSignInResult(Activity activity, Intent data, @NonNull RXJSONCallback callback) {
        if (null == data) {
            showLog("signIn inetnt is null");
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR.getValue(), "signIn inetnt is null"));
            return;
        }
        String jsonSignInResult = data.getStringExtra("HUAWEIID_SIGNIN_RESULT");
        if (TextUtils.isEmpty(jsonSignInResult)) {
            showLog("SignIn result is empty");
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR.getValue(), "SignIn result is empty"));
            return;
        }
        try {

            AccountAuthResult signInResult = new AccountAuthResult().fromJson(jsonSignInResult);
            if (signInResult.isSuccess()) {
                showLog("Sign in success.");
                showLog("Sign in result: " + signInResult.toJson());
                updateAuthAccount(signInResult.getAccount());
                getCurrentPlayer(activity, callback);
            } else {
                showLog("Sign in failed: " + signInResult.getStatus().getStatusCode());
                int statusCode = signInResult.getStatus().getStatusCode();
                String msg = StatusCodesMessage.get(statusCode, "goto huawei for query error: https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/guide-error-0000001050994619");
                if (statusCode == GamesStatusCodes.GAME_STATE_USER_CANCEL_LOGIN || statusCode == GamesStatusCodes.GAME_STATE_USER_CANCEL) {
                    callback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject(signInResult.getStatus().getStatusCode(), msg));
                } else {
                    callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(signInResult.getStatus().getStatusCode(), msg));
                }

            }
        } catch (JSONException var7) {
            showLog("Failed to convert json from signInResult.");
            callback.onError(new RXException(var7));
        }
    }

    /**
     * Obtain the Intent of the Huawei account login authorization page, and open the Huawei account
     * login authorization page by calling startActivityForResult(Intent, int).
     * *
     * 获取到华为帐号登录授权页面的Intent，并通过调用startActivityForResult(Intent, int)打开华为帐号登录授
     * 权页面。
     */
    public void signInNewWay(Activity activity, RXJSONCallback callback) {
        this.loginCallback = callback;
        Intent intent = AccountAuthManager.getService(activity, getHuaweiIdParams()).getSignInIntent();
        activity.startActivityForResult(intent, REQ_SIGN_IN_INTENT);
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        super.onActivityResult(activity, requestCode, resultCode, data);
        if (REQ_SIGN_IN_INTENT == requestCode && this.loginCallback != null) {
            handleSignInResult(activity, data, this.loginCallback);
        } else if (HmsBillingImpl.REQ_PAYMENT_CODE == requestCode) {
            billingClient.handlePurchaseResult(activity, data);
        } else {
            showLog("unknown requestCode in onActivityResult. requestCode=" + requestCode);
        }
    }

    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        billingClient.pay(activity, hashMap, callback);
    }
}
