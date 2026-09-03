package com.ruixue.shlogin;

import com.ruixue.openapi.IRXLoginUI;
import com.ruixue.openapi.IRXView;

import android.app.Activity;
import android.content.Context;
import android.util.Log;

import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.LoginUIConfig;
import com.ruixue.openapi.RXGlobalData;
import com.shlogin.sdk.OneKeyLoginManager;
import com.shlogin.sdk.listener.InitListener;
import com.shlogin.sdk.listener.LoginActivityStatusListener;
import com.shlogin.sdk.listener.OneKeyLoginListener;
import com.shlogin.sdk.listener.OpenLoginAuthListener;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/6/21
 */
public class TXAuthUI implements IRXLoginUI {
    RXJSONCallback callback;
    TXAuthUIConfig txAuthUIConfig;
    Context context;
    public static final int SUCCESS = 1022;
    AtomicBoolean isInited = new AtomicBoolean(false);
    AtomicBoolean isShow = new AtomicBoolean(false);

    public TXAuthUI() {
    }

    public TXAuthUI(Context context, Map<String, Object> map) {
        this.context = context;
        txAuthUIConfig = TXAuthUIConfig.create(context, map);
    }

    static TXAuthUI create() {
        return new TXAuthUI();
    }

    static TXAuthUI create(Context context, Map<String, Object> map, RXJSONCallback callback) {
        return new TXAuthUI(context, map).setCallback(callback);
    }

    @Override
    public IRXView setCancelable(boolean flag) {
        return this;
    }

    @Override
    public IRXView setCanceledOnTouchOutside(boolean cancel) {
        return this;
    }

    @Override
    public boolean isCancelable() {
        return true;
    }

    @Override
    public boolean isShowing() {
        return isShow.get();
    }


    public RXJSONCallback getCallback() {
        return callback;
    }

    public TXAuthUI setCallback(RXJSONCallback callback) {
        this.callback = callback;
        return this;
    }


    @Override
    public void show() {

        OneKeyLoginManager.getInstance().setLoginActivityStatusListener(new LoginActivityStatusListener() {
            @Override
            public void onActivityCreated(Activity activity) {
                isShow.set(true);
            }

            @Override
            public void onActivityDestroyed(Activity activity) {
                isShow.set(false);
            }
        });
        //竖屏⻚⾯样式配置对象，开发者在 LoginUIConfig.java类中调⽤对应的⽅法配置授权⻚中对应的元素（该参数不能传null，否则展示默认⻚⾯）
        //横屏⻚⾯样式主题配置对象，开发者在 LoginUIConfig.java类中调⽤对应的⽅法配置授权⻚中对应的元素（针对指定屏幕⽅向的，该参数传null）
        OneKeyLoginManager.getInstance().setAuthThemeConfig(txAuthUIConfig.createAuthUIConfig(), null);
//         OneKeyLoginManager.getInstance().setLoadingVisibility(false);
//        OneKeyLoginManager.getInstance().setCheckBoxValue(false);

        //SDK第三步：拉起授权页
        OneKeyLoginManager.getInstance().openLoginAuth(true, new OpenLoginAuthListener() {
            @Override
            public void getOpenLoginAuthStatus(int code, String result) {
                Log.i("rxsdk", "getOpenLoginAuthStatus： code==" + code + "   result==" + result);
                try {
                    JSONObject jsonObject = new JSONObject(result);
                    if (code != 1000) {
                        //授权页拉起失败，可跳转到短信、账号密码等其他登录方式（示例仅toast提示）
                        AbScreenUtils.showToast(context, jsonObject.optString("innerDesc"));
                        callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(code, jsonObject.optString("innerDesc")));
                    } else {
                        isShow.set(true);
                        //拉起授权页成功
//                        ConfigUtils.setPrivacyLayoutVisible();
//                        CheckBox privacyCheckBox=OneKeyLoginManager.getInstance().getPrivacyCheckBox();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }, new OneKeyLoginListener() {
            @Override
            public void getOneKeyLoginStatus(int code, String result) {
                Log.i("rxsdk", "getOneKeyLoginStatus： code==" + code + "   result==" + result);
                try {
                    JSONObject jsonObject = new JSONObject(result);
                    if (code == 1000) {
                        //获取token成功，客户端集成结束，请将token传至自己的服务端，由服务端完成手机号置换（demo为体验完整流程，将置换手机号放到了客户端）
//                        startResultActivity(code, result);
                        RXLogger.i("code:" + code + ",msg:" + result);
                        //销毁授权页
                        OneKeyLoginManager.getInstance().finishAuthActivity();
                        //清空SDK监听回调，防止内存泄漏
                        OneKeyLoginManager.getInstance().removeAllListener();
                        String token = jsonObject.optString("token");
                        Map<String, Object> extMap = new HashMap<>();
                        extMap.put("token", token);
                        callback.onSuccess(new JSONObject(extMap));
//                        if (context != null) {
//                            context.finish();
//                        }
                    } else if (code == 1011) {
                        //点击返回按钮，包括物理返回
                        AbScreenUtils.showToast(context, jsonObject.optString("innerDesc"));
                        callback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject(code, jsonObject.optString("innerDesc")));
                    } else {
                        //获取token失败，可将loading隐藏，再次点击一键登录重新获取（最多获取4次，4次之后按钮默认会置灰不可点击）
                        OneKeyLoginManager.getInstance().setLoadingVisibility(false);
                        AbScreenUtils.showToast(context, jsonObject.optString("innerDesc"));
                        callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(code, jsonObject.optString("innerDesc")));
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    callback.onError(new RXException(e));
                }
            }
        });
    }

    @Override
    public void cancel() {
        this.dismiss();
    }

    @Override
    public void dismiss() {
        //销毁授权页
        OneKeyLoginManager.getInstance().finishAuthActivity();
        //清空SDK监听回调，防止内存泄漏
        OneKeyLoginManager.getInstance().removeAllListener();
    }

    @Override
    public boolean showLoginUI(Activity activity, LoginUIConfig loginUIConfig, RXJSONCallback callback) {
        this.context = activity;
        this.txAuthUIConfig = TXAuthUIConfig.create(activity, loginUIConfig);
        show();
        return true;
    }

    @Override
    public boolean showLoginUI(Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        this.context = activity;
        this.txAuthUIConfig = TXAuthUIConfig.create(activity, map);
        show();
        return true;
    }
}
