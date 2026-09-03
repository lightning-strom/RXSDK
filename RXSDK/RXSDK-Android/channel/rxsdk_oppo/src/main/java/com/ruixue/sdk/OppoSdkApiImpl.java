package com.ruixue.sdk;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;

import androidx.annotation.NonNull;

import com.nearme.game.sdk.GameCenterSDK;
import com.nearme.game.sdk.callback.ApiCallback;
import com.nearme.game.sdk.callback.GameExitCallback;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.billing.BillingClient;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RxErrorReportUtil;
import com.ruixue.openapi.OppoSdkHelper;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

//https://open.oppomobile.com/wiki/doc#id=10470
public class OppoSdkApiImpl extends RXSdkApi {

    private BillingClient billingClient;

    private AtomicBoolean isInited = new AtomicBoolean(false);

    public static class Single {
        final static OppoSdkApiImpl INSTANCE = new OppoSdkApiImpl();
    }

    public OppoSdkApiImpl() {
        billingClient = new OppoBillingImpl();
    }

    public static OppoSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    public boolean IsInited() {
        return isInited.get();
    }

    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder().setName("oppo").setVersion(RuiXueSdk.getSdkVersion()).build();
    }

    private final static String PKG_MK_HEYTAP = "com.heytap.market";//Q之后的软件商店包名
    private final static String PKG_MK_OPPO = "com.oppo.market";//Q之前的软件商店包名
    private final static String COMMENT_DEEPLINK_PREFIX = "oaps://mk/developer/comment?pkg=";
    private final static int SUPPORT_MK_VERSION = 84000; // 支持评论功能的软件商店版本

    @Override
    public boolean jumpToAppStore(Activity activity) {
        String url = COMMENT_DEEPLINK_PREFIX + activity.getPackageName();
        String targetPkgName = "";
        if (AppUtils.getPackageVersionCode(activity, PKG_MK_HEYTAP) >= SUPPORT_MK_VERSION) {
            targetPkgName = PKG_MK_HEYTAP;
        }
        if (AppUtils.getPackageVersionCode(activity, PKG_MK_OPPO) >= SUPPORT_MK_VERSION) {
            targetPkgName = PKG_MK_OPPO;
        }
        Uri uri = Uri.parse(url);
        try {
            Intent intent = new Intent();
            intent.setAction(Intent.ACTION_VIEW);
            intent.addCategory(Intent.CATEGORY_DEFAULT);
            intent.setPackage(targetPkgName);
            intent.setData(uri);
            // 建议采用startActivityForResult 方法启动商店页面，requestCode由调用方自定义且必须大于0，软件商店不关注
            activity.startActivityForResult(intent, 100);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return AppUtils.launchAppDetail(activity, activity.getPackageName(), PKG_MK_OPPO);
        }
    }

    @Override
    public void initThirdSdk(@NonNull Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        OppoConfig oppoConfig = OppoConfig.fromMap(hashMap);
        if (oppoConfig.checkParams()) {
            GameCenterSDK.initialize(activity,oppoConfig.getAppSecret());
            GameCenterSDK.afterPrivacyAgreed(activity);
            isInited.set(true);
            if (callback != null) {
                callback.onSuccess(null);
            }
        } else if (callback != null) {
            JSONObject jsonObject = JSONUtil.toJSONObject(RXErrorCode.INIT_PARAMS_ERROR);
            callback.onFailed(jsonObject);
            RxErrorReportUtil.ThirdInitError.isError = true;
            RxErrorReportUtil.ThirdInitError.thirdName = "oppo";
            RxErrorReportUtil.ThirdInitError.cause = jsonObject;
        }
    }

    @Override
    public void login(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_LOGIN_METHOD)) {
            hashMap.put(KEY_LOGIN_METHOD, LoginMethod.OPPO);
        }
        super.login(activity, hashMap, callback);
    }

    @Override
    public boolean thirdLogin(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (isInited.get()) {
            GameCenterSDK.getInstance().doLogin(activity, new ApiCallback() {

                @Override
                public void onSuccess(String resultMsg) {
                    RXLogger.i("rx oppo onSuccess：" + resultMsg);
                    OppoSdkHelper.doGetTokenAndSsoid(callback);
                }

                @Override
                public void onFailure(String resultMsg, int resultCode) {
                    RXLogger.e("rx oppo onFailure: code:" + resultCode + ",msg:" + resultMsg);
                    if (resultCode == 1004) {
                        callback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject(resultCode, resultMsg));
                    } else {
                        callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(resultCode, resultMsg));
                    }

                }
            });
        } else {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_INIT_ERROR));
        }
        return true;
    }


    @Override
    public boolean exitApp(Activity activity, OnAppExitCallback callback) {
        if (isInited.get()) {
            GameCenterSDK.getInstance().onExit(activity, new GameExitCallback() {
                @Override
                public void exitGame() {
                    if (callback != null) {
                        callback.onExitConfirm("");
                    }
                }
            });
        }
        return isInited.get();
    }


    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        billingClient.pay(activity, hashMap, callback);
    }
}
