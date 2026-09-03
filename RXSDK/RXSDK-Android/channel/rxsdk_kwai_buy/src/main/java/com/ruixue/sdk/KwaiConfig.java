package com.ruixue.sdk;

import android.app.Application;
import android.text.TextUtils;

import androidx.annotation.Keep;
import androidx.annotation.NonNull;

import com.kwai.sdk.KwaiSdkInitConfig;
import com.kwai.sdk.base.bean.KwaiAppInfo;
import com.kwai.sdk.combus.init.KwaiInitListener;
import com.kwai.sdk.combus.view.floatview.FloatViewInitLocation;
import com.ruixue.utils.EntityUtils;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/28
 */
public class KwaiConfig {

    /**
     * AppId 必填  需要设置你们自己的AppId
     */
    @Keep
    protected String appid;


    @Keep
    protected String appName;

    /**
     * 是否允许游客登陆， 默认允许
     */
    @Keep
    protected boolean allowtourist = true;
    /**
     * 是否显示悬浮球，默认打开
     */
    @Keep
    protected boolean floatSwitch = true;
    /**
     * 悬浮球位置，默认左上
     */
    @Keep
    protected int floatViewLocation = FloatViewInitLocation.LEFT_TOP;

    @Keep
    protected String splashActivityName;

    public String getAppid() {
        return appid;
    }

    public String getAppName() {
        return appName;
    }

    public boolean isAllowtourist() {
        return allowtourist;
    }

    public boolean isFloatSwitch() {
        return floatSwitch;
    }

    public int getFloatViewLocation() {
        return floatViewLocation;
    }

    public void setAllowtourist(boolean allowtourist) {
        this.allowtourist = allowtourist;
    }

    public void setFloatSwitch(boolean floatSwitch) {
        this.floatSwitch = floatSwitch;
    }

    public void setFloatViewLocation(int floatViewLocation) {
        this.floatViewLocation = floatViewLocation;
    }

    public String getSplashActivityName() {
        return splashActivityName;
    }

    public void setSplashActivityName(String splashActivityName) {
        this.splashActivityName = splashActivityName;
    }

    public KwaiConfig() {
    }

    public KwaiConfig(@NonNull String appid, @NonNull String appName) {
        this.appid = appid;
        this.appName = appName;
    }

    public static KwaiConfig fromMap(Map<String, Object> map) {
        return EntityUtils.mapToEntity(map, KwaiConfig.class);
    }

    public boolean checkParams() {
        return !TextUtils.isEmpty(appid) && !TextUtils.isEmpty(appName);
    }

    public KwaiSdkInitConfig toKwaiSdkInitConfig(Application application, KwaiInitListener initListener) {
        KwaiSdkInitConfig config = new KwaiSdkInitConfig();
        config.setApplication(application);
        config.setAppInfo(toKwaiAppInfo());
        config.setInitListener(initListener);
        return config;
    }

    public KwaiAppInfo toKwaiAppInfo() {
        KwaiAppInfo info = new KwaiAppInfo();
        // AppId 必填  需要设置你们自己的AppId
        info.setAppId(appid);
        // 应用名称
        info.setAppName(appName);
        //是否允许游客登陆， 默认不允许 , 原来有游客登录的游戏SDK更新必改为（true);
        info.setAllowTourist(allowtourist);
        //  正常情况下必须要调用，如果调用登陆接口没有返回失败，也无法弹出登陆弹窗时，可尝试修改此标志为true;
        info.setUserPopup(false);
//        // 是否显示悬浮球，默认打开
        info.setFloatSwitch(floatSwitch);
//        // 悬浮球位置，默认左上
//        info.setFloatViewLocation(floatViewLocation);
        return info;
    }

}



