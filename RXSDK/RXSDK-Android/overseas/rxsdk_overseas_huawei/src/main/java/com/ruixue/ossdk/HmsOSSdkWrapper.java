package com.ruixue.ossdk;

import android.app.Activity;
import android.content.Context;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.gson.Gson;
import com.huawei.agconnect.api.AGConnectApi;
import com.huawei.agconnect.auth.AGCAuthException;
import com.huawei.agconnect.auth.AGConnectAuth;
import com.huawei.agconnect.auth.AGConnectAuthCredential;
import com.huawei.agconnect.auth.AGConnectUser;
import com.huawei.agconnect.auth.SignInResult;
import com.huawei.hms.iap.Iap;
import com.huawei.hms.iap.entity.ProductInfo;
import com.huawei.hms.iap.entity.ProductInfoReq;
import com.huawei.hms.iap.entity.ProductInfoResult;
import com.ruixue.RXJSONCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.callback.RXStringCallback;
import com.ruixue.openapi.PluginSdk;

import java.util.List;
import java.util.Map;

import android.app.Application;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.SparseArray;

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
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.legal.AntiAddictDelegate;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/10/23
 */
public class HmsOSSdkWrapper extends PluginSdk {
    static class Single {
        final static HmsOSSdkWrapper INSTANCE = new HmsOSSdkWrapper();
    }

    public static HmsOSSdkWrapper getInstance() {
        return Single.INSTANCE;
    }

    private final HmsBillingImpl billingClient;

    private final Map<String, Integer> methodMap;

    protected HmsOSSdkWrapper() {
        billingClient = new HmsBillingImpl();
        methodMap = new HashMap<>();
        methodMap.put("huawei_fb", AGConnectAuthCredential.Facebook_Provider);
        methodMap.put("huawei_google", AGConnectAuthCredential.Google_Provider);
    }


    @Override
    public String getName() {
        return "hwjos";
    }

    @Override
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {

        Activity activity = (Activity) context;
        ThreadUtils.getInstance().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (RXSdkApi.getInstance().isAgreedPrivacy() && !AccessNetworkManager.getInstance().canAccessNetwork()) {
                    AccessNetworkManager.getInstance().setAccessNetwork(true);
                }
                AccountAuthParams params = AccountAuthParams.DEFAULT_AUTH_REQUEST_PARAM_GAME;
                JosAppsClient appsClient = JosApps.getJosAppsClient((Activity) activity);
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
                        RXLogger.e("rx hms init failed:" + apiException.getMessage());
                        if (callback != null)
                            callback.onError(new RXException(RXErrorCode.THIRD_INIT_ERROR, statusCode, apiException.getMessage()));
                    } else {
                        if (callback != null)
                            callback.onError(new RXException(e));
                    }
                });
            }
        });
        return true;
    }

    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {
        if (!isInited.get()) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_INIT_ERROR));
        } else {
            if (LoginMethod.HWJOS.equals(paramsMap.get("method")) || LoginMethod.HUAWEI.equals(paramsMap.get("method"))) {
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
            } else {
//            int thirdProvider = AGConnectAuthCredential.Facebook_Provider;
                Integer loginProvider = null;
                Object method = paramsMap.get("method");
                if (method != null) {
                    loginProvider = methodMap.get(method);
                }
                if (paramsMap.containsKey("login_provider")) {
                    Object value = paramsMap.get("login_provider");
                    if (value instanceof Integer) {
                        loginProvider = (Integer) value;
                    }
                }
                RXLogger.i("AGConnectUser loginProvider:" + loginProvider);
                if (loginProvider == null) {
                    callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject());
                    RXLogger.e("AGConnectUser loginProvider null error");
                    return false;
                }
                AGConnectAuth.getInstance().signIn(activity, loginProvider).addOnSuccessListener(new OnSuccessListener<SignInResult>() {
                    @Override
                    public void onSuccess(SignInResult signInResult) {
                        // onSuccess
                        AGConnectUser user = signInResult.getUser();
                        Map<String, String> hashMap = new HashMap<>();

                        hashMap.put("access_token", user.getToken(false).getResult().getToken());
                        hashMap.put("playerId", user.getUid());
                        hashMap.put("displayName", user.getDisplayName());

                        callback.onSuccess(new JSONObject(hashMap));
                    }
                }).addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(Exception e) {

                        RXLogger.i("AGConnectUser onFailure:" + e.toString());
                        if (e instanceof AGCAuthException) {
                            AGCAuthException ae = (AGCAuthException) e;
                            if (ae.getCode() == 100 || ae.getCode() == 12501) {
                                callback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject(ae.getCode(), ae.getMessage()));
                            } else {
                                callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(ae.getCode(), ae.getMessage()));
                            }
                        } else if (e instanceof ApiException) {
                            ApiException apiException = (ApiException) e;
                            int statusCode = apiException.getStatusCode();
                            RXLogger.e("rx  failed:" + apiException.getMessage());
                            callback.onError(new RXException(RXErrorCode.THIRD_LOGIN_ERROR, statusCode, apiException.getMessage()));

                        } else {
                            callback.onError(new RXException(RXErrorCode.THIRD_LOGIN_ERROR.getValue(), e));
                        }
                        e.printStackTrace();
                    }
                });
            }

        }
        return true;
    }

    @Override
    public boolean onLoginResp(int code) {
        return false;
    }

    @Override
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {
        AGConnectAuth.getInstance().signOut();

        return true;
    }

    @Override
    public boolean doPay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        billingClient.pay(activity, hashMap, callback);
        return true;
    }


    private static final int REQ_SIGN_IN_INTENT = 3000;
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
        StatusCodesMessage.put(JosStatusCodes.JOS_PRIVACY_PROTOCOL_REJECTED, "Huawei privacy agreement not agreed"); // Error code 7401 indicates user did not agree to Huawei joint operation privacy agreement
        StatusCodesMessage.put(GamesStatusCodes.GAME_STATE_NETWORK_ERROR, "Network exception");
        StatusCodesMessage.put(907135003, "Player canceled HMS Core upgrade or component upgrade");
        StatusCodesMessage.put(7021, "Player canceled real-name authentication");
        StatusCodesMessage.put(2002, "Player not real-name authenticated");
        StatusCodesMessage.put(GamesStatusCodes.GAME_STATE_USER_CANCEL_LOGIN, "User canceled login.");
        StatusCodesMessage.put(GamesStatusCodes.GAME_STATE_USER_CANCEL, "User canceled operation.");
    }

    @Override
    public void onCreate(Activity activity, @Nullable Bundle savedInstanceState) {
        AGConnectApi.getInstance().activityLifecycle().onCreate(activity);
        super.onCreate(activity, savedInstanceState);
    }

    @Override
    public void onApplicationCreate(Application application) {
        super.onApplicationCreate(application);
        HuaweiMobileServicesUtil.setApplication(application);
    }

    @Override
    public void onRestart(Activity activity) {
        AGConnectApi.getInstance().activityLifecycle().onRestart();
        super.onRestart(activity);
    }

    @Override
    public void onStart(Activity activity) {
        AGConnectApi.getInstance().activityLifecycle().onStart();
        super.onStart(activity);
    }

    @Override
    public void onResume(Activity activity) {
        AGConnectApi.getInstance().activityLifecycle().onResume();
        super.onResume(activity);
        RXLogger.i("华为浮窗showFloatWindow");
        if (isInited.get()) {
            // 请务必在init成功后，调用浮标接口
            Games.getBuoyClient(activity).showFloatWindow();
        }
    }

    @Override
    public void onStop(Activity activity) {
        AGConnectApi.getInstance().activityLifecycle().onStop();
        super.onStop(activity);
    }

    @Override
    public void onDestroy(Activity activity) {
        AGConnectApi.getInstance().activityLifecycle().onDestroy();
        super.onDestroy(activity);
    }

    @Override
    public void onPause(Activity activity) {
        AGConnectApi.getInstance().activityLifecycle().onPause();
        super.onPause(activity);
        RXLogger.i("华为浮窗hideFloatWindow");
        if (isInited.get()) {
            // 请务必在init成功后，调用浮标接口
            Games.getBuoyClient(activity).hideFloatWindow();
        }
    }

    /**
     * @param productIds 商品id列表
     * @param callback   商品 json 信息
     */
    public void getProductsInfo(Activity activity, @NonNull List<String> productIds, @NonNull RXStringCallback callback) {
        if (!productIds.isEmpty()) {
            // 查询的商品必须是您在AppGallery Connect网站配置的商品
            ProductInfoReq req = new ProductInfoReq();
            req.setPriceType(0);
            req.setProductIds(productIds);
            // 调用obtainProductInfo接口获取AppGallery Connect网站配置的商品的详情信息
            Task<ProductInfoResult> task = Iap.getIapClient(activity).obtainProductInfo(req);
            task.addOnSuccessListener(result -> {
                // 获取接口请求成功时返回的商品详情信息
                List<ProductInfo> productList = result.getProductInfoList();
                Map<String, Object> hashMap = new HashMap<>();
                hashMap.put("code", 0);
                hashMap.put("data", productList);
                String json = new Gson().toJson(hashMap);
                RXLogger.i("productList:" + json);
                callback.onSuccess(json);
            }).addOnFailureListener(new OnFailureListener() {
                @Override
                public void onFailure(Exception e) {
                    callback.onError(new RXException(e));
                }
            });
        } else {
            callback.onFailed(RXErrorCode.THIRD_PAY_ERROR.getValue(), "product list is null error.", "");
        }

    }

    /**
     * @deprecated Use {@link #getProductsInfo(Activity, List, RXStringCallback)}.
     */
    @Deprecated
    public void getProducts(Activity activity, @NonNull List<String> productIds, @NonNull RXStringCallback callback) {
        getProductsInfo(activity, productIds, callback);
    }

    /**
     * @deprecated Use {@link #getProductsInfo(Activity, List, RXStringCallback)}.
     */
    @Deprecated
    public void queryProductDetailsAsync(Activity activity, @NonNull List<String> productIds, @NonNull RXStringCallback callback) {
        getProductsInfo(activity, productIds, callback);
    }

    public void repayFailOrder(Activity activity, RXJSONCallback callback) {
        billingClient.obtainOwnedPurchases(activity, callback);
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
                    hashMap.put("idToken", currentAuthAccount.getAccessToken());
                }
                if (ObjectUtils.isEmpty(hashMap.get("idToken")) || TextUtils.isEmpty(hashMap.get("idToken"))) {
                    hashMap.put("idToken", player.getAccessToken());
                }

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
                        init(activity, new HashMap<>(), null);
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
        AGConnectApi.getInstance().activityLifecycle().onActivityResult(requestCode, resultCode, data);
        if (REQ_SIGN_IN_INTENT == requestCode && this.loginCallback != null) {
            handleSignInResult(activity, data, this.loginCallback);
        } else if (HmsBillingImpl.REQ_PAYMENT_CODE == requestCode) {
            billingClient.handlePurchaseResult(activity, data);
        } else {
            showLog("unknown requestCode in onActivityResult. requestCode=" + requestCode);
        }
    }

}
