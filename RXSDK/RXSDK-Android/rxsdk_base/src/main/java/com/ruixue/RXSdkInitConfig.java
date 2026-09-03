package com.ruixue;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.ruixue.base.BuildConfig;
import com.ruixue.unity.UnityBaseCommonFun;
import com.ruixue.unity.UnityRXRequestCallback;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class RXSdkInitConfig {

    private Activity activity;
    /**
     * CP 唯一 ID，从 7 位数 1000000 开始递增
     */
    private final String cpId;
    /**
     * 瑞雪内部的应用 ID，由各 CP 自行在后台创建，字符串类型
     */
    private final String productId;
    /**
     * 瑞雪内部 CP 某应用的渠道 ID，由各 CP 自行在后台创建，字符串类型
     */
    private final String channelId;
    /**
     * 日志开关
     */
    private boolean isLogEnable = BuildConfig.DEBUG;


    private boolean autoInitThird = false;

    /**
     * 瑞雪域名地址 https://domain.com/ 格式
     */
    private List<String> baseUrlList;

    private boolean usePrivacy = true;

    private RXJSONCallback initializeCallback;
    public String agreementTitle = "用户协议和隐私政策";

    private boolean isUseDNS = false;

    //bool 类型 true 开启 false 关闭，默认 false
    private boolean openRacing = false;


    public Map<String, String> agreementMap = new LinkedHashMap<String, String>() {
        {
            put("00001", "《用户协议》");
            put("00002", "《隐私政策》");
        }
    };

    /**
     * 自定义协议键值对
     * @param agreementMap 00001 ,《用户协议》
     */
    public void setAgreementMap(Map<String, String> agreementMap) {
        if (agreementMap != null) {
            this.agreementMap = agreementMap;
        }
    }


    public boolean isOpenRacing() {
        return openRacing;
    }

    public void setOpenRacing(boolean openRacing) {
        this.openRacing = openRacing;
    }

    public static final String SPACE = "&#12288;";

    public boolean isLogEnable() {
        return isLogEnable;
    }

    public String getAgreementTitle() {
        return agreementTitle;
    }

    public void setAgreementTitle(String agreementTitle) {
        this.agreementTitle = agreementTitle;
    }

    public Collection<String> getAgreementKeyArray() {
        return agreementMap.keySet();
    }

    public String getPrivacyString() {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, String> en : agreementMap.entrySet()) {
            if (sb.length() > 0) {
                sb.append("、");
            }
            sb.append(String.format("<a href='%s' >%s</a>", en.getKey().startsWith("http") ? en.getKey() : "ruixue://" + en.getKey(), en.getValue()));
        }
        return sb.toString();
    }

    public String agreementContent;

    private Map<String, Object> extMapObj;

    Map<String, Object> userCenterConfig;


    Map<String, Object> thirdSdkParams;

    public boolean isAutoInitThird() {
        return autoInitThird;
    }

    @Deprecated
    public void setAutoInitThird(boolean autoInitThird) {
        this.autoInitThird = autoInitThird;
    }

    public Map<String, Object> getThirdSdkParams() {
        return thirdSdkParams;
    }

    public void setThirdSdkParams(Map<String, Object> thirdParams) {
        this.thirdSdkParams = thirdParams;
    }

    public Activity getActivity() {
        return activity == null ? RuiXueSdk.getCurrentActivity() : activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public boolean isUsePrivacy() {
        return usePrivacy;
    }

    public void setUsePrivacy(boolean usePrivacy) {
        this.usePrivacy = usePrivacy;
    }

    public RXJSONCallback getInitializeCallback() {
        return initializeCallback;
    }

    public String getAgreementContent() {
        if (TextUtils.isEmpty(agreementContent)) {
            agreementContent = "\n&#12288;&#12288;&#12288;&#12288;在您使用我们服务前，请您务必审慎阅读、充分理解" + getPrivacyString() + "的各条款。同时，您应特别注意前述协议中免除或者限制我们责任的条款、对您权利进行限制的条款、约定争议解决方式和司法管辖的条款。如您已详细阅读并同意" + getPrivacyString() + "请点击“同意”开始使用我们的服务。";
        }
        return agreementContent;
    }

    public void setAgreementContent(String agreementContent) {
        this.agreementContent = agreementContent;
    }

    public void setInitializeCallback(RXJSONCallback initializeCallback) {
        this.initializeCallback = initializeCallback;
    }

    public RXSdkInitConfig setContext(Context context) {
        return this;
    }

    public Map<String, Object> getExtMapObj() {
        return extMapObj;
    }

    public void setExtMapObj(Map<String, Object> extMapObj) {
        this.extMapObj = extMapObj;
    }


    public String getCpId() {
        return cpId;
    }

    public String getProductId() {
        return productId;
    }

    public String getChannelId() {
        return channelId;
    }


    public void setLogEnable(boolean logEnable) {
        this.isLogEnable = logEnable;
    }

    public List<String> getBaseUrl() {
        return this.baseUrlList;
    }

    public boolean isUseDNS() {
        return isUseDNS;
    }

    public void setUseDNS(boolean useDNS) {
        isUseDNS = useDNS;
    }

    public Map<String, Object> getUserCenterConfig() {
        return userCenterConfig;
    }

    public void setUserCenterConfig(Map<String, Object> userCenterConfig) {
        this.userCenterConfig = userCenterConfig;
    }

    /**
     * @param cpId      CP 唯一 ID，从 7 位数 1000000 开始递增
     * @param productId 瑞雪内部的应用 ID，由各 CP 自行在后台创建，字符串类型
     * @param channelId 瑞雪内部 CP 某应用的渠道 ID，由各 CP 自行在后台创建，字符串类型
     */
    public RXSdkInitConfig(String cpId, @NonNull String productId, @NonNull String channelId, @NonNull List<String> baseUrls, RXJSONCallback callback) {
        this.cpId = cpId;
        this.productId = productId;
        this.channelId = channelId;
        this.baseUrlList = baseUrls;
        this.initializeCallback = callback;
    }

    public RXSdkInitConfig(String cpId, @NonNull String productId, @NonNull String channelId, UnityRXRequestCallback callback, @NonNull List<String> baseUrls) {
        this.cpId = cpId;
        this.productId = productId;
        this.channelId = channelId;
        this.baseUrlList = baseUrls;
        this.initializeCallback = UnityBaseCommonFun.convertCallback(callback);
    }

}
