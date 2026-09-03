package com.ruixue.sdk;

import android.app.Activity;
import android.content.Context;

import androidx.annotation.NonNull;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.billing.BillingClient;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.legal.PrivacyCallback;
import com.ruixue.openapi.MiSdkHelper;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.AppUtils;
import com.xiaomi.gamecenter.sdk.MiCommplatform;
import com.xiaomi.gamecenter.sdk.MiErrorCode;
import com.xiaomi.gamecenter.sdk.OnExitListner;
import com.xiaomi.gamecenter.sdk.OnLoginProcessListener;
import com.xiaomi.gamecenter.sdk.entry.MiAccountInfo;
import com.xiaomi.gamecenter.sdk.entry.MiAppInfo;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

//doc https://dev.mi.com/distribute/doc/details?pId=1377
public class MiSdkApiImpl extends RXSdkApi {

    private final BillingClient billingClient;


    @Override
    public boolean jumpToAppStore(Activity activity) {
        //com.xiaomi.market
        return AppUtils.launchAppDetail(activity,activity.getPackageName(),"com.xiaomi.market");
    }

    @Override
    public boolean thirdLogin(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        MiCommplatform.getInstance().miLogin(activity, new OnLoginProcessListener() {
            @Override
            public void finishLoginProcess(int code, MiAccountInfo miAccountInfo) {
                if (code == MiErrorCode.MI_XIAOMI_PAYMENT_SUCCESS) {
                    // 登陆成功
                    // 获取⽤⼾的登陆后的UID（即⽤⼾唯⼀标识）
                    String uid = miAccountInfo.getUid();
                    //以下为获取session并校验流程，如果是⽹络游戏必须校验，如果是单机游戏或应⽤可选//
                    // 获取⽤⼾的登陆的Session（请参考5.3.3流程校验Session有效性）
                    String session = miAccountInfo.getSessionId();
                    //请开发者完成将uid和session提交给开发者⾃⼰服务器进⾏session验证
                    HashMap<String, String> extMap = new HashMap<>();
                    extMap.put("uid", uid);
                    extMap.put("session", session);
                    extMap.put("nickname", miAccountInfo.getNikename());
                    callback.onSuccess(new JSONObject(extMap));
                } else if (code == MiErrorCode.MI_XIAOMI_PAYMENT_ERROR_CANCEL) {
                    String msg = MiSdkHelper.getMiErrorCodeMsg(code);
                    callback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject(code, msg));
                } else {
                    String msg = MiSdkHelper.getMiErrorCodeMsg(code);
                    callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(code, msg));
                }
            }
        });
        return true;
    }

    static class Single {
        final static MiSdkApiImpl INSTANCE = new MiSdkApiImpl();
    }

    protected MiSdkApiImpl() {
        billingClient = new MiBillingImpl();
    }

    public static MiSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder().setName("mi").setVersion(RuiXueSdk.getSdkVersion()).build();
    }

    @Override
    public void initThirdSdk(@NonNull Activity context, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (callback != null) {
            callback.onSuccess(null);
        }
//        appInfo = new MiAppInfo();
//        appInfo.setAppId((String) hashMap.get("appid"));
//        appInfo.setAppKey((String) hashMap.get("appkey"));


//        MiCommplatform.Init(context, appInfo, new OnInitProcessListener() {
//            @Override
//            public void finishInitProcess(List<String> loginMethod, int gameConfig) {
//                RXLogger.i("rx mi Init success");
//            }
//
//            @Override
//            public void onMiSplashEnd() {//小米闪屏页结束回调，小米闪屏可配，无闪屏也会返回此回调，游戏的闪屏应当在收到此回调之后开始。
////                miSplashEnd = true;//游戏自己的闪屏处理，可参考SplashActivity的实现
//                RXLogger.i("rx mi  Init fail");
//            }
//        });
    }

    @Override
    public void login(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_LOGIN_METHOD)) {
            hashMap.put(KEY_LOGIN_METHOD, LoginMethod.MI);
        }
        super.login(activity, hashMap, callback);
    }


    @Override
    public boolean exitApp(Activity activity, OnAppExitCallback callback) {
        MiCommplatform.getInstance().miAppExit(activity, new OnExitListner() {
            @Override
            public void onExit(int code) {
                if (code == MiErrorCode.MI_XIAOMI_EXIT) {
                    callback.onExitConfirm(String.valueOf(code));
                } else {
                    callback.onExitCancel();
                }
            }
        });
        return true;
    }

    @Override
    public void setPrivacyAgree(Context context, PrivacyCallback privacyCallBack) {
        MiCommplatform.getInstance().onUserAgreed(context);
        super.setPrivacyAgree(context, privacyCallBack);
    }

    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        billingClient.pay(activity, hashMap, callback);
    }
}
