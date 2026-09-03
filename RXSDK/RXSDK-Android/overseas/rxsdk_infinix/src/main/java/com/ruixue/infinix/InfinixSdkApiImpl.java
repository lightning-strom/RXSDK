package com.ruixue.infinix;


import android.app.Activity;
import android.app.Application;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.openapi.IPluginSdk;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;
import com.transsion.gamead.AdHelper;
import com.transsion.gamead.AdInitializer;
import com.transsion.gamead.InitListener;
import com.transsion.gamead.constant.InitState;

import java.lang.reflect.InvocationTargetException;
import java.util.Map;

// Created by wangliang on 2025/6/12.
public class InfinixSdkApiImpl extends RXSdkApi {
    private final String[] PLUGIN_NAME = new String[]
            {
                    "RX_PLUGIN_FACEBOOK",
                    "RX_PLUGIN_GOOGLE",
                    "RX_PLUGIN_FIREBASE",
                    "RX_PLUGIN_LINE",
                    "RX_PLUGIN_ADJUST",
                    "RX_PLUGIN_ZALO",
                    "RX_PLUGIN_TIKTOK",
                    "RX_PLUGIN_SNAPCHAT",
                    "RX_PLUGIN_INSTAGRAM",
                    "RX_PLUGIN_REDDIT",
                    "RX_PLUGIN_TOPON"
            };

    static class Single {
        final static InfinixSdkApiImpl INSTANCE = new InfinixSdkApiImpl();
    }

    protected InfinixSdkApiImpl() {
    }

    @Override
    public boolean jumpToAppStore(Activity activity) {
        return AppUtils.launchAppDetail(activity, activity.getPackageName(), "com.android.vending");
    }

    @NonNull
    public static InfinixSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    @Override
    protected String[] getSupportPluginNames() {
        return PLUGIN_NAME;
    }

    @Override
    public void onCreate(Activity activity, @Nullable Bundle savedInstanceState) {
        super.onCreate(activity,savedInstanceState);
    }

    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder().setName("infinix").setState(1).setVersion(RuiXueSdk.getSdkVersion()).setPlugins(getPlugins().keySet().toString()).build();
    }

    private Application application;
    @Override
    public void onApplicationCreate(Application application) {
        super.onApplicationCreate(application);
        this.application = application;
    }


    @Override
    public void initThirdSdk(@NonNull Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (application == null) {
            if (RuiXueSdk.getCurrentActivity() != null) {
                application = RuiXueSdk.getCurrentActivity().getApplication();
            }
        }
        if (application == null) {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.INIT_ERROR.getValue(), "application is null"));
            }
            return;
        }
        boolean debuggable = false;
        String env = "release";
        if (hashMap != null && hashMap.containsKey("infinix_debuggable")) {
            debuggable = ObjectUtils.toBoolean(hashMap.get("infinix_debuggable"));
        }

        if (hashMap != null && hashMap.containsKey("infinix_env")) {
            env = ObjectUtils.toString(hashMap.get("infinix_env"));
        }

        AdInitializer.init(
                new AdInitializer.Builder(application)
                        /*接入引导：*/
                        //开启debuggable为true，表示打开日志，请务必在上线时置为false。
                        //即使设置为false，你依旧可以使用如下adb命令，在您的调试设备上开启SDK日志方便调试和验证
                        //adb shell setprop log.tag.GameAdLog DEBUG
                        //SDK日志TAG为TAG,具体可以参考接入文档。
                        .setDebuggable(debuggable)
                        /*设置运行的环境，test是测试环境，请务必在线上环境时设置为release*/
                        .setEnv(env)
                //设置test，展示的是admob的测试服务器广告
                //如果你需要调试线上真实广告，你需要把setEnv设为release,并输入你的设备ID，同时调用setTestDeviceIds
                //如何获取设备ID见 第6点广告测试的问题QA。请在正式上线的环境下，删除本行代码
                //.setTestDeviceIds(Collections.singletonList("7FC2C0BE39C47406C984C08C16418C5C"))
        );

        AdInitializer.setInitListener(new InitListener() {
            @Override
            public void onStateChange(int state, String message) {
                if (state == InitState.INIT_STATE_COMPLETE) {
                    if (callback != null) {
                        callback.onSuccess(null);
                    }
                } else if (state == InitState.INIT_STATE_ERROR) {
                    //大多数初始化失败的场景，都是跟配置文件放错位置或环境参数配置错误关系。
                    if (callback != null) {
                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_INIT_ERROR.getValue(), message));
                    }
                }
            }
        });
    }

    @Override
    public boolean thirdLogin(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        String method = (String) hashMap.get("method");
        if (method == null) {
            if (callback != null)
                callback.onError(new RXException("Login method is abnormal."));
        }
        boolean isSupport = false;
        IPluginSdk thirdSdk = getPlugins().get(method);
        if (thirdSdk != null) {
            isSupport = thirdSdk.doLogin(activity, hashMap, callback);
        } else {
            callback.onError(new RXException("Login method is abnormal."));
        }
        return isSupport;
    }

    protected Throwable getTargetException(Exception e) {
        if (e instanceof InvocationTargetException) {
            return ((InvocationTargetException) e).getTargetException();// 获取目标异常
        }
        return e;
    }

    @Override
    public boolean exitApp(Activity activity, OnAppExitCallback callback) {
        InfinixSdkHelper.onDestroy(activity);
        AdHelper.destroyInterstitial();
        AdHelper.destroyReward();
        AdHelper.closeNative();
        AdHelper.destroyAppOpenAd();
        return super.exitApp(activity, callback);
    }

    protected void printStackTrack(Exception e) {
        getTargetException(e).printStackTrace();
    }

}
