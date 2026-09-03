package com.ruixue.openapi;

import androidx.annotation.Keep;

import com.ruixue.utils.EntityUtils;

import java.util.HashMap;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/1/25
 */
@Keep
public class RXShareConfig {
    /**
     * sdk 参数
     */
    protected String func;       //"埋点标识"     // string
    protected String platform;       //"分享平台" // string
    protected String region;      //"地区码"     // string
    protected String transmits;      //"透传参数，原样返回"    // string
    protected String protocol_ios;      //"iOS唤醒协议"         // string
    protected String protocol_android;      //"android唤醒协议" // string
    protected String use_scheme;      //"由cp控制是否使用游戏协议，如传0则在落地页上操作不会尝试打开应用，直接跳转到对应商店，如传1则会尝试打开应用" // string
    protected boolean read_cache;      //"是否读取缓存，默认不读取" // bool

    protected boolean auto_report = true; //是否自动上报

    protected int shareScene;

    protected boolean useShortUrl = false;

    protected Map<String, Object> ext;

    protected Map<String, Object> properties;


    protected Map<String, Object> custom_ext;

    public Map<String, Object> getCustomExt() {
        return custom_ext;
    }

    public void setCustomExt(Map<String, Object> custom_ext) {
        this.custom_ext = custom_ext;
    }

    public int getShareScene() {
        return shareScene;
    }

    public void setShareScene(int share_scene) {
        this.shareScene = share_scene;
    }

    protected Map<String, Object> game_info; //是否自动上报

    public Map<String, Object> getGameInfo() {
        return game_info;
    }

    public void setGameInfo(Map<String, Object> game_info) {
        this.game_info = game_info;
    }

    public boolean isAutoReport() {
        return auto_report;
    }

    public void setAutoReport(boolean auto_report) {
        this.auto_report = auto_report;
    }

    public String getFunc() {
        return func;
    }

    public void setFunc(String func) {
        this.func = func;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getTransmits() {
        return transmits;
    }

    public void setTransmits(String transmits) {
        this.transmits = transmits;
    }

    public String getiOSScheme() {
        return protocol_ios;
    }

    public void setiOSScheme(String iOSScheme) {
        this.protocol_ios = iOSScheme;
    }

    public String getAndroidScheme() {
        return protocol_android;
    }

    public void setAndroidScheme(String androidScheme) {
        this.protocol_android = androidScheme;
    }

    public String getUseScheme() {
        return use_scheme;
    }

    public void setUseScheme(String useScheme) {
        this.use_scheme = useScheme;
    }

    public boolean isReadCache() {
        return read_cache;
    }

    public void setReadCache(boolean read_cache) {
        this.read_cache = read_cache;
    }

    public Map<String, Object> toMap() {
        return EntityUtils.entityToMap(this, true, true);
    }

    public boolean isUseShortUrl() {
        return useShortUrl;
    }

    public void setUseShortUrl(boolean useShortUrl) {
        this.useShortUrl = useShortUrl;
    }

    public Map<String, Object> getExt() {
        return ext;
    }

    public void setExt(Map<String, Object> ext) {
        this.ext = ext;
    }

    public Map<String, Object> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, Object> properties) {
        this.properties = properties;
    }
}
