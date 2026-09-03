package com.ruixue.sdk;

import android.text.TextUtils;

import androidx.annotation.Keep;

import com.baidu.gamesdk.BDGameSDKSetting;
import com.google.gson.Gson;
import com.ruixue.utils.EntityUtils;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/29
 */
public class BDConfig {
    @Keep
    private long appid;
    @Keep
    private String appkey;

    @Keep
    private int domainRelease = 1;
    /*
        0 竖屏
        1.横屏
     */
    @Keep
    private int orientation = 1;

    /**
     * 广告开个 0 关闭 1 开启
     */
    @Keep
    private int enableAds = 0;


    public long getAppid() {
        return appid;
    }

    public String getAppkey() {
        return appkey;
    }

    /**
     * @return 广告开关
     */
    public boolean getEnableAds() {
        return enableAds == 1;
    }


    public BDGameSDKSetting.Domain getDomainRelease() {
        return domainRelease == 0 ? BDGameSDKSetting.Domain.DEBUG : BDGameSDKSetting.Domain.RELEASE;
    }

    public BDGameSDKSetting.Orientation getOrientation() {
        return orientation == 0 ? BDGameSDKSetting.Orientation.PORTRAIT : BDGameSDKSetting.Orientation.LANDSCAPE;
    }

    public boolean checkParams() {
        return !TextUtils.isEmpty(appkey) && !TextUtils.isEmpty(appkey);
    }

    public BDGameSDKSetting toBDGameSDKSetting() {
        BDGameSDKSetting bdGameSetting = new BDGameSDKSetting();
        bdGameSetting.setAppID((getAppid())); // APPID设置
        bdGameSetting.setAppKey(getAppkey()); // APPKEY设置
        bdGameSetting.setEnableAds(getEnableAds());             // 广告开关
        bdGameSetting.setDomain(getDomainRelease());      // 设置为正式模式
        bdGameSetting.setOrientation(getOrientation());
        return bdGameSetting;
    }

    public static BDConfig fromMap(Map<String, Object> map) {
        return new Gson().fromJson(new JSONObject(map).toString(),BDConfig.class);
    }
}
