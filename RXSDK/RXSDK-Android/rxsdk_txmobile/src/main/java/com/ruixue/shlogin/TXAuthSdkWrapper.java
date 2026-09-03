package com.ruixue.shlogin;

import android.app.Activity;
import android.content.Context;
import android.util.Log;
import android.util.SparseArray;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.callback.RXUICallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.openapi.LoginUIConfig;
import com.ruixue.openapi.PluginSdk;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.passport.LoginMethod;
import com.shlogin.sdk.OneKeyLoginManager;
import com.shlogin.sdk.listener.InitListener;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/12/7
 */
public class TXAuthSdkWrapper extends PluginSdk {

    static class Single {
        final static TXAuthSdkWrapper INSTANCE = new TXAuthSdkWrapper();
    }

    private TXAuthSdkWrapper() {

    }

    @NonNull
    public static TXAuthSdkWrapper getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public String getName() {
        return LoginMethod.QUICKPHONE;
    }

    AtomicBoolean isInited = new AtomicBoolean(false);

    public static final int SUCCESS = 1022;

    public static final SparseArray<String> msg = new SparseArray<>();

    static {
        msg.put(1000, "获取token成功");
        msg.put(1001, "运营商返回错误");
        msg.put(1002, "运营商信息获取失败，请结合result查看具体失败原因");
        msg.put(1003, "⼀键登录获取token失败，请结合result查看具体失败原因");
        msg.put(1007, "⽹络请求失败，请结合result查看具体失败原因");
        msg.put(1011, "点击返回，⽤户取消免密登录");
        msg.put(1014, "SDK内部异常，请结合result查看具体失败原因");
        msg.put(1016, "APPID为空");
        msg.put(1019, "其他错误，请结合result查看具体失败原因");
        msg.put(1022, "⽹络初始化、预取号成功");
        msg.put(1023, "初始化、预取号失败，请结合result查看具体失败原因");
        msg.put(1031, "请求过于频繁");
        msg.put(1032, "⽤户禁⽤");
        msg.put(2000, "本机号校验获取token成功");
        msg.put(2003, "本机号校验返回失败，请结合result查看具体失败原因");
    }

    @Override
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {
        OneKeyLoginManager.getInstance().setDebug(RXGlobalData.isDebugEnable());
//                OneKeyLoginManager.getInstance().setTimeOutForPreLogin(6);
        //SDK第一步：初始化 {"innerCode":0,"innerDesc":"success","message":"初始化成功"}
        OneKeyLoginManager.getInstance().init(context.getApplicationContext(), (String) paramsMap.get("tx_appid"), new InitListener() {
            @Override
            public void getInitStatus(int code, String result) {
                Log.e("rxsdk", "初始化： code==" + code + "   result==" + result);
                try {
                    JSONObject jsonObject = new JSONObject(result);
                    if (code == SUCCESS) {
                        isInited.set(true);
                        //SDK第二步：预取号（可缩短拉起授权页时间）
                        //.预取号【可选⽅法】获取取号临时凭证；建议在调⽤拉起授权⻚前2~3秒调⽤，可以缩短拉起授权⻚耗时；
                        // 如果启动app就需要展示授权⻚，中间没有2~3秒的间隔，不建议调⽤，起不到缩短时间的效果。
                        //请勿与拉起授权登录⻚同时或之后调⽤。
                        //避免⼤量资源下载时调⽤，例如游戏中加载资源或者更新补丁的时
                        OneKeyLoginManager.getInstance().getPhoneInfo((code1, result1) -> {
                            Log.e("rxsdk", "预取号： code==" + code1 + "   result==" + result1);
                            if (code1 == SUCCESS) {
                                //{"innerCode":0,"innerDesc":"success","message":"预取号成功","number":"181****8380","telecom":"CTCC","protocolName":"天翼账号服务与隐私协议","protocolUrl":"https:\/\/e.189.cn\/sdk\/agreement\/detail.do?hidetop=true"}
                            } else {

                            }
                        });
                        if (callback != null) {
                            callback.onSuccess(null);
                        }
                    } else if (callback != null) {
                        callback.onFailed(RXErrorCode.THIRD_INIT_ERROR.toJSONObject(code, jsonObject.optString("innerDesc", jsonObject.optString("message"))));
                    }
                } catch (Exception e) {
                    if (callback != null) {
                        callback.onError(new RXException(e));
                    }
                }
            }
        });
        return true;
    }

    public void checkEnvAvailable(Activity context, RXJSONCallback callback) {

    }

    public void showLoginUI(Activity activity, LoginUIConfig loginUIConfig, @NonNull RXUICallback callback) {
        if (!isInited.get()) {
            Map<String, Object> map = new HashMap<>();
            map.put("tx_appid", loginUIConfig.getQuickphoneKey());
            init(activity, map, new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    TXAuthUI.create().showLoginUI(activity, loginUIConfig, callback);
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    callback.onFailed(cause);
                }
            });
        } else {
            TXAuthUI.create().showLoginUI(activity, loginUIConfig, callback);
        }
    }


    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {
        if (!isInited.get()) {
            init(activity, paramsMap, null);
        }
        return TXAuthUI.create().showLoginUI(activity, paramsMap, callback);
    }

    @Override
    public boolean onLoginResp(int code) {
        return false;
    }

    @Override
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {
        return false;
    }

    @Override
    public boolean doPay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        return false;
    }
}
