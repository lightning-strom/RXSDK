package com.ruixue.sdk;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ruixue.logger.RXLogger;

import java.lang.reflect.Type;
import java.util.Map;

/**
 * Created by wangliang on 2024/8/28
 */
public class RXYsdkLoginConfig {

    // 是否展示手机号码登录UI，默认false
    @Keep
    private boolean showPhoneLoginPlatform;
    @Keep
    private Boolean skipYsdkAntiAddiction;
    @Keep
    private boolean useYsdkAntiAddictionDialog;
    @Keep
    private boolean autoLogin;

    // 配置宝券、悬浮球等弹窗展示的activity
    @Keep
    private String couponViewShownInActivityClassName;
    @Keep
    private boolean showCloseButton;
    @Keep
    private boolean showLoginFailToast;
    @Keep
    private Map<String, String> privacyInfo;
    @Keep
    private RXYsdkLoginUiOrientation orientation;

    private RXYsdkLoginConfig() {
        this.showCloseButton = true;
        this.showLoginFailToast = true;
        this.autoLogin = true;
        this.useYsdkAntiAddictionDialog = true;
        this.orientation = RXYsdkLoginUiOrientation.DEFAULT;
    }

    public boolean isShowPhoneLoginPlatform() {
        return showPhoneLoginPlatform;
    }

    public Boolean isSkipYsdkAntiAddiction() {
        return skipYsdkAntiAddiction;
    }

    public boolean isUseYsdkAntiAddictionDialog() {
        return useYsdkAntiAddictionDialog;
    }

    public boolean isAutoLogin() {
        return autoLogin;
    }

    public String getCouponViewShownInActivityClassName() {
        return couponViewShownInActivityClassName;
    }

    public boolean isShowCloseButton() {
        return showCloseButton;
    }

    public boolean isShowLoginFailToast() {
        return showLoginFailToast;
    }

    public Map<String, String> getPrivacyInfo() {
        return privacyInfo;
    }

    public RXYsdkLoginUiOrientation getOrientation() {
        return orientation;
    }

    public Map<String, Object> toMap() {
        Gson gson = new Gson();
        String json = gson.toJson(this);
        Type type = new TypeToken<Map<String, Object>>() {
        }.getType();
        return gson.fromJson(json, type);
    }

    public static RXYsdkLoginConfig fromMap(Map<String, Object> map) {
        try {
            @SuppressWarnings("unchecked") Map<String, Object> configs = (Map<String, Object>) map.get("ysdk_login_ui_config");
            Gson gson = new Gson();
            return gson.fromJson(gson.toJson(configs), RXYsdkLoginConfig.class);
        } catch (Exception e) {
            RXLogger.d(e.getMessage());
            return null;
        }
    }

    public static class Builder {
        private RXYsdkLoginConfig config;

        public Builder() {
            config = new RXYsdkLoginConfig();
        }

        /**
         * 是否展示手机号码登录UI，默认false
         *
         * @param show
         * @return
         */
        public RXYsdkLoginConfig.Builder configPhoneLoginPlatform(boolean show) {
            this.config.showPhoneLoginPlatform = show;
            return this;
        }

        /**
         * 配置是否跳过防沉迷，默认false
         * <p>
         * 需要注意的是，是否使用YSDK的防沉迷系统还受到YSDK后台配置的控制。 根据国家防沉迷的相关规定，游戏必须要接入防沉迷系统。如果开发者想用自己的防沉迷系统，需要发邮件向 YSDK申请并进行报备
         */
        public RXYsdkLoginConfig.Builder configSkipYsdkAntiAddiction(boolean skip) {
            this.config.skipYsdkAntiAddiction = skip;
            return this;
        }

        /**
         * 是否使用YSDK的防沉迷托管系统。
         * <p>
         * 该托管系统会接管防沉迷相关的指令，实现实名认证页面、禁玩等弹窗实现。 建议开发者使用YSDK的防沉迷托管能力，否则需要逐一实现未成年非游戏时间禁玩等功能。
         */
        public RXYsdkLoginConfig.Builder configYsdkAntiAddictionDialog(boolean use) {
            this.config.useYsdkAntiAddictionDialog = use;
            return this;
        }

        /**
         * 是否使用YSDK的自动登录能力。YSDK自动登录能力会在游戏启动的时候读取缓存，然后向后台发起登录
         *
         * @param auto 默认值为 true
         */
        public RXYsdkLoginConfig.Builder configYsdkAutoLogin(boolean auto) {
            this.config.autoLogin = auto;
            return this;
        }

        /**
         * 配置宝券、悬浮球等运营能力展示的activity
         *
         * @param className 如果不配置，默认是在获取宝券接口返回时当前游戏的activity上进行展示
         */
        public RXYsdkLoginConfig.Builder configCouponViewShownInActivityClassName(String className) {
            this.config.couponViewShownInActivityClassName = className;
            return this;
        }

        /**
         * 配置是否展示登录页面右上角的关闭按钮
         *
         * @param show 默认值为 true
         * @return
         */
        public RXYsdkLoginConfig.Builder configShowCloseButton(boolean show) {
            this.config.showCloseButton = show;
            return this;
        }

        /**
         * 隐私协议
         *
         * @param privacyInfo key 为显示的文字，value 为点击后的链接地址
         * @return
         */
        public RXYsdkLoginConfig.Builder configPrivacyInfo(Map<String, String> privacyInfo) {
            this.config.privacyInfo = privacyInfo;
            return this;
        }

        /**
         * 配置是否弹出YSDK登录失败的toast提示
         *
         * @param show 默认值为 true
         * @return
         */
        public RXYsdkLoginConfig.Builder configShowLoginFailToast(boolean show) {
            this.config.showLoginFailToast = show;
            return this;
        }

        /**
         * 配置YSDK登录页面activity展示的方向
         *
         * @param orientation 支持配置的方向的枚举值。默认使用manifest上的配置，即不配置方向。 这里建议开发者根据自身游戏的横竖屏情况进行配置，避免从手Q或者微信授权页回来后，YSDK登录页面跳动的问题。
         * @return
         */
        public RXYsdkLoginConfig.Builder configLoginUiOrientation(RXYsdkLoginUiOrientation orientation) {
            this.config.orientation = orientation;
            return this;
        }

        public RXYsdkLoginConfig create() {
            return this.config;
        }
    }

    public enum RXYsdkLoginUiOrientation {
        DEFAULT,
        LANDSCAPE,
        PORTRAIT,
        SENSOR_LANDSCAPE,
        SENSOR_PORTRAIT;
    }
}
