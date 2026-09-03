
package com.ruixue.sdk.bytedancelog;

import androidx.annotation.Keep;


public class RxInitConfig {

    @Keep
    private String appId;
    @Keep
    private String channel;
    private int uri;
    private boolean imeiEnable = false;
    private boolean autoTrackEnabled = true;
    private boolean logEnable = false;
    private boolean macEnable = true;
    private boolean androidIdEnabled = true;
    private boolean iccIdEnabled = true;
    private boolean serialNumberEnable = true;
    private boolean gaidEnabled = false;
    private int gaidTimeOutMilliSeconds = 2000;
    private boolean operatorInfoEnabled = true;
    private boolean autoStart = true;
    private boolean enablePlay = false;


    /**
     * 初始化SDK开始
     * @param appId   APPID
     * @param channel 填写渠道信息，请注意不能为空
     */
    public RxInitConfig(String appId, String channel) {
        this.appId = appId;
        this.channel = channel;
    }

    /**
     * 设置数据上送地址
     * @param uri 地址
     */
    public void setUriConfig(int uri) {
        this.uri = uri;
    }

    /**
     * 是否关停获取IMEI
     * @param imeiEnable 是否关停
     */
    public void setImeiEnable(boolean imeiEnable) {
        this.imeiEnable = imeiEnable;
    }

    /**
     * 全埋点开关
     * @param autoTrackEnabled true开启，false关闭
     */
    public void setAutoTrackEnabled(boolean autoTrackEnabled) {
        this.autoTrackEnabled = autoTrackEnabled;
    }

    /**
     * 是否开启日志
     * @param logEnable true:开启日志，false:关闭日志
     */
    public void setLogEnable(boolean logEnable) {
        this.logEnable = logEnable;
    }

    /**
     * MAC地址采集
     * @param macEnable true: 开， false: 关
     */
    public void setMacEnable(boolean macEnable) {
        this.macEnable = macEnable;
    }

    /**
     * 是否开启Android ID采集
     * @param androidIdEnabled true: 开， false: 关
     */
    public void setAndroidIdEnabled(boolean androidIdEnabled) {
        this.androidIdEnabled = androidIdEnabled;
    }

    /**
     * 是否开启ICCID 采集
     * @param iccIdEnabled true: 开， false: 关
     */
    public void setIccIdEnabled(boolean iccIdEnabled) {
        this.iccIdEnabled = iccIdEnabled;
    }

    /**
     * 是否开启SN（硬件序列号） 采集
     * @param serialNumberEnable true: 开， false: 关
     */
    public void setSerialNumberEnable(boolean serialNumberEnable) {
        this.serialNumberEnable = serialNumberEnable;
    }

    /**
     * 是否开启GAID 采集
     * @param gaidEnabled true: 开， false: 关
     */
    public void setGaidEnabled(boolean gaidEnabled) {
        this.gaidEnabled = gaidEnabled;
    }

    /**
     * 针对Gaid 获取耗时 SDK 提供了采集超时时间控制
     * @param gaidTimeOutMilliSeconds 秒
     */
    public void setGaidTimeOutMilliSeconds(int gaidTimeOutMilliSeconds) {
        this.gaidTimeOutMilliSeconds = gaidTimeOutMilliSeconds;
    }

    /**
     * 是否开启运营商信息采集
     * @param operatorInfoEnabled true: 开， false: 关
     */
    public void setOperatorInfoEnabled(boolean operatorInfoEnabled) {
        this.operatorInfoEnabled = operatorInfoEnabled;
    }

    /**
     * 是否开启自动开始采集
     * @param autoStart true: 开， false: 关
     */
    public void setAutoStart(boolean autoStart) {
        this.autoStart = autoStart;
    }

    /**
     * .配置心跳事件
     * @param enablePlay true: 开， false: 关
     */
    public void setEnablePlay(boolean enablePlay) {
        this.enablePlay = enablePlay;
    }

    public String getAppId() {
        return appId;
    }

    public String getChannel() {
        return channel;
    }

    public int getUri() {
        return uri;
    }

    public boolean isImeiEnable() {
        return imeiEnable;
    }

    public boolean isAutoTrackEnabled() {
        return autoTrackEnabled;
    }

    public boolean isLogEnable() {
        return logEnable;
    }

    public boolean isMacEnable() {
        return macEnable;
    }

    public boolean isAndroidIdEnabled() {
        return androidIdEnabled;
    }

    public boolean isIccIdEnabled() {
        return iccIdEnabled;
    }

    public boolean isSerialNumberEnable() {
        return serialNumberEnable;
    }

    public boolean isGaidEnabled() {
        return gaidEnabled;
    }

    public int getGaidTimeOutMilliSeconds() {
        return gaidTimeOutMilliSeconds;
    }

    public boolean isOperatorInfoEnabled() {
        return operatorInfoEnabled;
    }

    public boolean isAutoStart() {
        return autoStart;
    }

    public boolean isEnablePlay() {
        return enablePlay;
    }
}
