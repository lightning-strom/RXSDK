package com.ruixue.openapi;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/6/12
 */
public class RXConfig {

    @SerializedName("init")
    protected InitBean init;
    @SerializedName("passport")
    protected PassportBean passport;
    @SerializedName("user_center")
    protected Map<String, Object> user_center;

    @SerializedName("third_config")
    protected Map<String, Object> third_config;
    @SerializedName("custom_config")
    protected Map<String, Object> custom_config;

    public void setCustomConfig(Map<String, Object> custom_config) {
        this.custom_config = custom_config;
    }

    public Map<String, Object> getThirdConfig() {
        return third_config;
    }

    public Map<String, Object> getCustom_config() {
        return custom_config;
    }

    public void setUserCenter(Map<String, Object> user_center) {
        this.user_center = user_center;
    }

    public Map<String, Object> getUserCenterCfg() {
        return user_center;
    }

    public static RXConfig objectFromData(String str) {
        return new Gson().fromJson(str, RXConfig.class);
    }

    public InitBean getInit() {
        return init;
    }

    public void setInit(InitBean init) {
        this.init = init;
    }

    public PassportBean getPassport() {
        return passport;
    }

    public void setPassport(PassportBean passport) {
        this.passport = passport;
    }

    public static class InitBean {
        @SerializedName("cpid")
        protected String cpid;
        @SerializedName("channel_id")
        protected String channelId;

        public String getIpv4Url() {
            return ipv4_url;
        }

        @SerializedName("ipv4_url")
        protected String ipv4_url;
        @SerializedName("product_id")
        protected String productId;
        @SerializedName("domain")
        protected List<String> domain;

        public static InitBean objectFromData(String str) {
            return new Gson().fromJson(str, InitBean.class);
        }

        public String getCpid() {
            return cpid;
        }

        public void setCpid(String cpid) {
            this.cpid = cpid;
        }

        public String getChannelId() {
            return channelId;
        }

        public void setChannelId(String channelId) {
            this.channelId = channelId;
        }

        public String getProductId() {
            return productId;
        }

        public void setProductId(String productId) {
            this.productId = productId;
        }

        public List<String> getDomain() {
            return domain;
        }

        public void setDomain(List<String> domain) {
            this.domain = domain;
        }
    }

    public static class PassportBean {
        @SerializedName("language")
        protected String language ;
        @SerializedName("logo")
        protected String logo;
        @SerializedName("logintype_default")
        protected String logintypeDefault;
        @SerializedName("set_password")
        protected Boolean setPassword;
        @SerializedName("realauth")
        protected Boolean realauth;
        @SerializedName("privacies")
        protected LinkedHashMap<String, Object> privacies;

        @SerializedName("deregister")
        protected Map<String, Object> deregister;
        @SerializedName("logintypes")
        protected List<String> logintypes;

        @SerializedName("use_url_privacy")
        protected boolean use_url_privacy = true;

        public boolean isQuickbuttonbar_visible() {
            return quickbuttonbar_visible;
        }

        @SerializedName("quickbuttonbar_visible")
        protected boolean quickbuttonbar_visible;

        public @Constants.RegisterType int getKeyboard_type() {
            return keyboard_type;
        }

        @SerializedName("keyboard_type")
        protected int keyboard_type;

        protected boolean history_view_disable;

        public boolean is_history_view_disable() {
            return history_view_disable;
        }

        public Map<String, Object> getCustom_config() {
            return custom_config;
        }

        public Map<String, Object> getLogin_methods() {
            return login_methods;
        }

        @SerializedName("login_methods")
        protected Map<String, Object> login_methods;
        @SerializedName("custom_config")
        protected Map<String, Object> custom_config;

        public static PassportBean objectFromData(String str) {

            return new Gson().fromJson(str, PassportBean.class);
        }

        public boolean getUse_url_privacy() {
            return use_url_privacy;
        }

        public Map<String, Object> getDeregister() {
            return deregister == null ? new HashMap<>() : deregister;
        }

        public String getLanguage() {
            return language;
        }

        public void setLanguage(String language) {
            this.language = language;
        }

        public String getLogo() {
            return logo;
        }

        public void setLogo(String logo) {
            this.logo = logo;
        }

        public String getLogintypeDefault() {
            return logintypeDefault;
        }

        public void setLogintypeDefault(String logintypeDefault) {
            this.logintypeDefault = logintypeDefault;
        }

        public Boolean isSetPassword() {
            return setPassword;
        }

        public void setSetPassword(Boolean setPassword) {
            this.setPassword = setPassword;
        }

        public Boolean isRealauth() {
            return realauth;
        }

        public void setRealauth(Boolean realauth) {
            this.realauth = realauth;
        }

        public LinkedHashMap<String, Object> getPrivacies() {
            return privacies;
        }

        public void setPrivacies(LinkedHashMap<String, Object> privacies) {
            this.privacies = privacies;
        }

        public List<String> getLogintypes() {
            return logintypes;
        }

        public void setLogintypes(List<String> logintypes) {
            this.logintypes = logintypes;
        }


    }
}
