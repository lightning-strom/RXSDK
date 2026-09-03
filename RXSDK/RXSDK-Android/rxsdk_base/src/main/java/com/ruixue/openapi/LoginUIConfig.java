package com.ruixue.openapi;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.text.TextUtils;

import androidx.annotation.Keep;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.target.CustomTarget;
import com.bumptech.glide.request.transition.Transition;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.RXDataCache;
import com.ruixue.legal.LegalData;
import com.ruixue.logger.RXLogger;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.ObjectUtils;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/1/12
 */
public class LoginUIConfig implements Cloneable, RXLoginUIConfig {

    protected static final List<String> SUPPORT_LIST = Arrays.asList(LoginMethod.CAPTCHACODE, LoginMethod.USERNAME, LoginMethod.GUEST, LoginMethod.WECHAT, LoginMethod.QUICKPHONE, LoginMethod.GOOGLE, LoginMethod.FACEBOOK, LoginMethod.LINE);


    private String loginOpenid;
    private String method;

    protected String privacyOneStr = "";

    protected String privacyOneUrl = "ruixue://" + LegalData.KEY_SERVICE_AGREEMENT;

    protected String privacyTwoStr = "";

    protected String privacyTwoUrl = "ruixue://" + LegalData.KEY_PRIVACY_POLICY;

    protected String privacyThreeStr = "";

    protected String privacyThreeUrl = "";

    protected LinkedHashMap<String, Object> privacyMap;

    private boolean useUrlPrivacy = true;

    private boolean showPrivacy = true;

    private boolean isAgreedPrivacy = false;

    protected int indulge_auth;


    // 实名认证地区，海外根据不同地区展示不同样式的实名认证 UI，默认 姓名+身份证样式，目前支持 VN（越南地区样式）
    @Keep
    private String realAuthRegion;

    private List<String> loginMethodList;


    private Map<String, Object> loginMethodMap;


    private Map<String, Object> customParams;


    private Map<String, Object> custom_ext;

    /**
     * 默认显示验证码方式
     */
    protected boolean isCaptchaLogin;

    protected boolean isCancelable = true;

    private boolean showBackBtn = false;

    @Keep
    protected boolean isHistoryViewEnable = false;

    @Keep
    private boolean isQuickButtonBarVisible = true;

    @Keep
    private boolean isFirstNeedSetPassword;
    @Keep
    private boolean isDeregisterShow;

    private boolean isLoginContinue;

    @Keep
    private int loginMode = 0;

    /**
     * 用户名输入提示
     */
    @Keep
    protected String usernameHintText;

    /**
     * 用户名
     */
    @Keep
    protected String usernameText;

    /**
     * 根据登录类型填充预置提示文本
     */
    @Keep
    protected @Constants.RegisterType int loginType;

    @Keep
    protected int titleResId = 0;

    private byte[] titleResByteArr;
    @Keep
    protected Drawable logoDrawable = null;

    protected String forgotUrl;
    protected boolean canCloseRealAuth;


    public void setGuestTitle(String guestTitle) {
        RXGlobalData.setGuestTitle(guestTitle);
    }

    public Map<String, Object> getCustomExt() {
        return custom_ext;
    }

    public void setCustomExt(Map<String, Object> custom_ext) {
        this.custom_ext = custom_ext;
    }

    public String getLoginOpenid() {
        return loginOpenid;
    }

    public void setLoginOpenid(String loginOpenid) {
        this.loginOpenid = loginOpenid;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getWxAppid() {
        return RXGlobalData.getWxAppid();
    }

    public void setWxAppid(String wxAppid) {

        RXGlobalData.setWxAppid(wxAppid);

    }

    public String getQuickphoneKey() {
        return RXGlobalData.getQuickPhoneKey();
    }

    public void setQuickphoneKey(String quickphoneKey) {

        RXGlobalData.setQuickPhoneKey(quickphoneKey);

    }

    public String getGoogleClientid() {
        return RXGlobalData.getGoogleClientId();
    }

    public void setGoogleClientid(String googleClientid) {

        RXGlobalData.setGoogleClientId(googleClientid);

    }

    public boolean isDeregisterShow() {
        return isDeregisterShow;
    }

    public boolean isLoginContinue() {
        return isLoginContinue;
    }

    public int getLoginMode() {
        return loginMode;
    }

    public boolean isShowBackBtn() {
        return showBackBtn;
    }

    public void setShowBackBtn(boolean showBackBtn) {
        this.showBackBtn = showBackBtn;
    }

    public boolean isShowPrivacy() {
        return showPrivacy;
    }

    @Override
    public void setDeregisterShow(boolean deregisterShow) {
        isDeregisterShow = deregisterShow;
    }

    @Override
    public void setLoginContinue(boolean loginContinue) {
        isLoginContinue = loginContinue;
    }


    @Deprecated
    public void setLoginMode(int loginMode) {
        //需求要求去掉 2024年11月02日18:19:32 周六
//        this.loginMode = loginMode;
    }

    public void setShowPrivacy(boolean showPrivacy) {
        this.showPrivacy = showPrivacy;
    }

    public boolean isAgreedPrivacy() {
        return isAgreedPrivacy;
    }

    public void setAgreedPrivacy(boolean isAgreedPrivacy) {
        this.isAgreedPrivacy = isAgreedPrivacy;
    }

    public String getForgotUrl() {
        if (TextUtils.isEmpty(forgotUrl)) {
            return RXSdkApi.getInstance().getSdkInfo().getState() == 1 ? "static/passport/#/oversea/forgetpassword" : "static/passport/#/user/forgetpassword";
        } else {
            return forgotUrl;
        }
    }

    public int isIndulgeAuth() {
        return indulge_auth;
    }

    public Drawable getLogoDrawable() {
        if (titleResId != 0) {
            logoDrawable = ContextCompat.getDrawable(RuiXueSdk.getContext(), titleResId);
        } else if (titleResByteArr != null && titleResByteArr.length > 0) {
            Bitmap bitmap = BitmapFactory.decodeByteArray(titleResByteArr, 0, titleResByteArr.length);
            logoDrawable = new BitmapDrawable(RuiXueSdk.getContext().getResources(), bitmap);
        }
        return logoDrawable;
    }

    public String getPrivacyOneStr() {
        return privacyOneStr;
    }

    public void initPrivacyTitle() {
        if ((this.privacyMap == null || this.privacyMap.isEmpty()) && TextUtils.isEmpty(privacyOneStr)) {
            RXDataCache.getDefaultTerms(new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    try {
                        if (data != null) {
                            if (data.has(LegalData.KEY_SERVICE_AGREEMENT))
                                privacyOneStr = Objects.requireNonNull(data.optJSONObject(LegalData.KEY_SERVICE_AGREEMENT)).optString("title");
                            if (data.has(LegalData.KEY_PRIVACY_POLICY))
                                privacyTwoStr = Objects.requireNonNull(data.optJSONObject(LegalData.KEY_PRIVACY_POLICY)).optString("title");
                        }
                    } catch (Exception e) {
                        RXLogger.e(e.getMessage());
                    }
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                }
            });
        }
    }

    public LinkedHashMap<String, String> getPrivacyMap() {
        LinkedHashMap<String, String> str = new LinkedHashMap<>();
        if (privacyMap == null) {
            privacyMap = new LinkedHashMap<>();
            if (!TextUtils.isEmpty(privacyOneUrl)) {
                privacyMap.put(privacyOneUrl, privacyOneStr);
            }
            if (!TextUtils.isEmpty(privacyTwoUrl)) {
                privacyMap.put(privacyTwoUrl, privacyTwoStr);
            }
            if (!TextUtils.isEmpty(privacyThreeUrl)) {
                privacyMap.put(privacyThreeUrl, privacyThreeStr);
            }
        }
        for (Map.Entry<String, Object> entry : privacyMap.entrySet()) {
            str.put(entry.getKey(), getPrivacyStr(entry));
        }

        return str;
    }

    public List<String> getPrivacyList() {
        List<String> privacyList = new ArrayList<>();
        String path = getLegalUrl();
        if (null != privacyMap && !privacyMap.isEmpty()) {
            for (Map.Entry<String, Object> entry : privacyMap.entrySet()) {
                String privacy = " <a href='" + getPrivacyUrl(path, entry) + "'>" + getPrivacyStr(entry) + "</a>";
                privacyList.add(privacy);
            }
        } else {
            if (!TextUtils.isEmpty(getPrivacyOneStr())) {
                String privacy = " <a href='" + getPrivacyOneUrl() + "'>" + getPrivacyOneStr() + "</a>";
                privacyList.add(privacy);
            }
            if (!TextUtils.isEmpty(getPrivacyTwoStr())) {
                String two = " <a href='" + getPrivacyTwoUrl() + "'>" + getPrivacyTwoStr() + "</a>";
                privacyList.add(two);
            }
            if (!TextUtils.isEmpty(getPrivacyThreeStr())) {
                String three = " <a href='" + getPrivacyThreeUrl() + "'>" + getPrivacyThreeStr() + "</a>";
                privacyList.add(three);
            }
        }
        return privacyList;
    }


    public List<String> getLoginMethodList() {
        if (loginMethodList != null) {
            return loginMethodList;
        } else if (this.loginMethodMap != null) {
            return new ArrayList<>(this.loginMethodMap.keySet());
        } else {
            return new ArrayList<>();
        }
    }

    @SuppressWarnings("unchecked")
    @Nullable
    public Map<String, Object> getLoginMethodConfig(String method) {
        if (method == null) {
            return null;
        }
        Map<String, Object> methodConfig = (loginMethodMap == null) ? null : (Map<String, Object>) loginMethodMap.get(method);
        if (method.equals(LoginMethod.QUICKPHONE)) {
            methodConfig = methodConfig == null ? new HashMap<>() : methodConfig;
            String oneUrl = getPrivacyOneUrl();
            if (oneUrl != null && oneUrl.startsWith("http")) {
                methodConfig.put("privacyOneStr", getPrivacyOneStr());
                methodConfig.put("privacyOneUrl", getPrivacyOneUrl());
            }
            String twoUrl = getPrivacyTwoUrl();
            if (twoUrl != null && twoUrl.startsWith("http")) {
                methodConfig.put("privacyTwoStr", getPrivacyTwoStr());
                methodConfig.put("privacyTwoUrl", getPrivacyTwoUrl());
            }
            String threeUrl = getPrivacyThreeUrl();
            if (threeUrl != null && threeUrl.startsWith("http")) {
                methodConfig.put("privacyThreeStr", getPrivacyThreeStr());
                methodConfig.put("privacyThreeUrl", getPrivacyThreeUrl());
            }
            if (!methodConfig.containsKey("logoDrawable")) {
                methodConfig.put("logoDrawable", getLogoDrawable());
            }
        }
        return null == methodConfig ? null : new HashMap<>(methodConfig);
    }

    public Map<String, Object> getCustomParams() {
        if (customParams == null) {
            customParams = new HashMap<>();
        }
        if (!TextUtils.isEmpty(RXGlobalData.getWxAppid())) {
            customParams.put("wx_appid", RXGlobalData.getWxAppid());
        }
        if (!TextUtils.isEmpty(RXGlobalData.getQuickPhoneKey())) {
            customParams.put("quickphone_key", RXGlobalData.getQuickPhoneKey());
        }
        if (!TextUtils.isEmpty(RXGlobalData.getGoogleClientId())) {
            customParams.put("google_clientid", RXGlobalData.getGoogleClientId());
        }
        return customParams;
    }

    public int getLoginType() {
        return loginType;
    }

    public boolean isHistoryViewEnable() {
        return isHistoryViewEnable;
    }

    public void setForgotUrl(String forgotUrl) {
        this.forgotUrl = forgotUrl;
    }

    public boolean isFirstNeedSetPassword() {
        return isFirstNeedSetPassword;
    }

    @Override
    public void setFirstNeedSetPassword(boolean firstNeedSetPassword) {
        isFirstNeedSetPassword = firstNeedSetPassword;
    }

    @Override
    public void setLogoResId(int titleResId) {
        this.titleResId = titleResId;
    }

    public void setLogoByteArr(byte[] byteArr) {
        this.titleResByteArr = byteArr;
    }


    public void setTitleResId(int titleResId) {
        this.titleResId = titleResId;
    }

    public void setTitleByteArr(byte[] byteArr) {
        this.titleResByteArr = byteArr;
    }


    @Override
    public void setRealAuthRegion(String realAuthRegion) {
        this.realAuthRegion = realAuthRegion;
    }

    public String getRealAuthRegion() {
        return realAuthRegion;
    }

    public boolean isCanCloseRealAuth() {
        return canCloseRealAuth;
    }

    public void setLogoDrawable(Drawable logoDrawable) {
        this.logoDrawable = logoDrawable;
    }


    public void setUseUrlPrivacy(boolean useUrlPrivacy) {
        this.useUrlPrivacy = useUrlPrivacy;
    }


    @Override
    public void setLoginMethods(List<String> loginMethodList) {
        this.loginMethodList = loginMethodList;
    }

    public void setLoginMethods(Map<String, Object> loginMethodMap) {
        this.loginMethodMap = loginMethodMap;
    }


    @Override
    public void setCustomParams(Map<String, Object> customParams) {
        if (this.customParams != null) {
            this.customParams.putAll(customParams);
        } else {
            this.customParams = customParams;
        }
    }

    public boolean isQuickButtonBarVisible() {
        return isQuickButtonBarVisible;
    }

    @Override
    public void setQuickButtonBarVisible(boolean visible) {
        isQuickButtonBarVisible = visible;
    }

    @Deprecated
    public void setLoginType(int loginType) {
        this.loginType = loginType;
    }


    @Override
    public void setPrivacyOne(String privacyOneStr, String privacyOneUrl) {
        setPrivacyOneUrl(privacyOneUrl);
        setPrivacyOneStr(privacyOneStr);
    }

    @Override
    public void setPrivacyTwo(String privacyTwoStr, String privacyTwoUrl) {
        setPrivacyTwoUrl(privacyTwoUrl);
        setPrivacyTwoStr(privacyTwoStr);
    }

    @Override
    public void setPrivacyThree(String privacyThreeStr, String privacyThreeUrl) {
        setPrivacyThreeStr(privacyThreeStr);
        setPrivacyThreeUrl(privacyThreeUrl);
    }

    public boolean isCancelable() {
        return isCancelable;
    }

    public void setCancelable(boolean cancelable) {
        isCancelable = cancelable;
    }


    public boolean isCaptchaLogin() {
        return isCaptchaLogin;
    }


    public void setCaptchaLogin(boolean captchaLogin) {
        this.isCaptchaLogin = captchaLogin;
    }

    public String getUsernameHintText() {
        return usernameHintText;
    }


    public void setUsernameHintText(String usernameHintText) {
        this.usernameHintText = usernameHintText;
    }

    public String getUsernameText() {
        return usernameText;
    }


    public void setUsernameText(String usernameText) {
        this.usernameText = usernameText;
    }

    public void setPrivacyOneStr(String privacyOneStr) {
        if (privacyOneStr != null) {
            this.privacyOneStr = privacyOneStr;
        }
    }

    public String getPrivacyOneUrl() {
        return privacyOneUrl;
    }

    public void setPrivacyOneUrl(String privacyOneUrl) {
        if (privacyOneUrl != null) {
            this.privacyOneUrl = privacyOneUrl;
        }
    }

    public String getPrivacyTwoStr() {
        return privacyTwoStr;
    }

    public void setPrivacyTwoStr(String privacyTwoStr) {
        if (privacyTwoStr != null)
            this.privacyTwoStr = privacyTwoStr;
    }

    public String getPrivacyTwoUrl() {
        return privacyTwoUrl;
    }

    public void setPrivacyTwoUrl(String privacyTwoUrl) {
        if (privacyTwoUrl != null)
            this.privacyTwoUrl = privacyTwoUrl;
    }

    public String getPrivacyThreeStr() {
        return privacyThreeStr;
    }

    public void setPrivacyThreeStr(String privacyThreeStr) {
        this.privacyThreeStr = privacyThreeStr;
    }

    public String getPrivacyThreeUrl() {
        return privacyThreeUrl;
    }

    public void setPrivacyThreeUrl(String privacyThreeUrl) {
        this.privacyThreeUrl = privacyThreeUrl;
    }

    static LoginUIConfig instance;
    private String language = RXGlobalData.getLanguage();

    public LoginUIConfig() {
        instance = this;
        if (!RuiXueSdk.isFullyInitialized()) {
            RXLogger.e("The rxsdk was not initialized");
        }

        List<Map<String, Object>> cfg = RXGlobalData.getLoginConfigs();
        if (cfg != null) {
            loginMethodList = new ArrayList<>();
            loginMethodMap = new HashMap<>();
            for (Map<String, Object> m : cfg) {
                String method = (String) m.get("method");
//                if (m.containsKey("wx_appid")) {
//                    wxAppid = (String) m.get("wx_appid");
//                }
                if (!TextUtils.isEmpty(method) && SUPPORT_LIST.contains(method)) {
                    loginMethodList.add(method);
                    loginMethodMap.put(method, (m));
                }
            }
        }

        //read from init api channel
        indulge_auth = RXGlobalData.isNeedRealauth() ? 1 : 0;
        canCloseRealAuth = RXGlobalData.isRealauthClose();
        isFirstNeedSetPassword = RXGlobalData.isNeedSetpwd();
        isDeregisterShow = RXGlobalData.isShowDeregister();
        isLoginContinue = RXGlobalData.getDeregisterType() == 1;
    }


    public LoginUIConfig build(RXConfig.PassportBean passportBean) {
        if (passportBean == null)
            return this;
        try {
            language = passportBean.getLanguage();
            loginMethodList = passportBean.getLogintypes();
            isCaptchaLogin = LoginMethod.CAPTCHACODE.equals(passportBean.getLogintypeDefault());
            isFirstNeedSetPassword = passportBean.isSetPassword();

            if (!TextUtils.isEmpty(passportBean.getLogo())) {
                if (passportBean.getLogo().startsWith("http")) {
                    Glide.with(RuiXueSdk.getContext()).load(passportBean.getLogo()).into(new CustomTarget<Drawable>() {
                        @Override
                        public void onResourceReady(@NonNull Drawable resource, @Nullable Transition<? super Drawable> transition) {
                            logoDrawable = resource;
                        }

                        @Override
                        public void onLoadCleared(@Nullable Drawable placeholder) {
                        }
                    });
                } else {
                    titleResId = RuiXueSdk.getContext().getResources().getIdentifier(passportBean.getLogo(), "drawable", RuiXueSdk.getContext().getPackageName());
                }
            }
            loginType = passportBean.getKeyboard_type();
            isHistoryViewEnable = !passportBean.is_history_view_disable();
            isQuickButtonBarVisible = ObjectUtils.toBoolean(passportBean.isQuickbuttonbar_visible());
            useUrlPrivacy = ObjectUtils.toBoolean(passportBean.getUse_url_privacy());
            isDeregisterShow = ObjectUtils.toBoolean(passportBean.getDeregister().get("show"));
            isLoginContinue = null != passportBean.getDeregister().get("btn_type") && "login".equals(passportBean.getDeregister().get("btn_type"));
            privacyMap = passportBean.getPrivacies();
            setCustomParams(passportBean.getCustom_config());
            setLoginMethods(passportBean.getLogin_methods());
            if (null != privacyMap && !privacyMap.isEmpty()) {
                String path = getLegalUrl();
                int i = 0;
                for (Map.Entry<String, Object> entry : privacyMap.entrySet()) {
                    if (i == 0) {
                        setPrivacyOne(getPrivacyStr(entry), getPrivacyUrl(path, entry));
                    } else if (i == 1) {
                        setPrivacyTwo(getPrivacyStr(entry), getPrivacyUrl(path, entry));
                    } else if (i == 2) {
                        setPrivacyThree(getPrivacyStr(entry), getPrivacyUrl(path, entry));
                    }
                    i++;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return this;
    }

    @NonNull
    private String getLegalUrl() {
        return RuiXueSdk.getFirstBaseUrl() + "static/landing/#/v1/legal/terms/" + RuiXueSdk.getProductId() + "/" + RuiXueSdk.getChannelId() + "/";
    }

    private String getPrivacyUrl(String path, Map.Entry<String, Object> entry) {
        if (entry.getKey().startsWith("http")) {
            return entry.getKey();
        } else {
            return useUrlPrivacy ? path + entry.getKey() : "ruixue://" + entry.getKey();
        }
    }

    /**
     * @param userCenterConfig "btns": [
     *                         "change_pwd",
     *                         "acount_cancel",
     *                         "privacy_policy",
     *                         "phone_management"
     *                         ]
     */
    public void setUserCenterConfig(Map<String, Object> userCenterConfig) {
        RXGlobalData.setUserCenterCfg(userCenterConfig);
    }

    private String getPrivacyUrl(String path, String key) {
        if (key.startsWith("http")) {
            return key;
        } else {
            return useUrlPrivacy ? path + key : "ruixue://" + key;
        }
    }

    private String getPrivacyStr(Map.Entry<String, Object> entry) {
        Object v = entry.getValue();
        if (v instanceof String) {
            return (String) v;
        }
        @SuppressWarnings("unchecked") Map<String, Object> va = (Map<String, Object>) v;
        if (va != null && va.containsKey(RuiXueSdk.getLanguage())) {
            return (String) va.get(RuiXueSdk.getLanguage());
        } else if (va != null && !TextUtils.isEmpty(language)) {
            return (String) va.get(language);
        } else {
            return "";
        }
    }


    public static LoginUIConfig getInstance() {
        if (instance == null) {
            instance = new LoginUIConfig();
        }
        return instance;
    }

    @NonNull
    @Override
    public LoginUIConfig clone() {
        try {
            return (LoginUIConfig) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }

    @NonNull
    @Override
    public String toString() {
        return "cfg {" + "privacyOneStr='" + privacyOneStr + '\'' + ", privacyOneUrl='" + privacyOneUrl + '\'' + ", privacyTwoStr='" + privacyTwoStr + '\'' + ", privacyTwoUrl='" + privacyTwoUrl + '\'' + ", privacyThreeStr='" + privacyThreeStr + '\'' + ", privacyThreeUrl='" + privacyThreeUrl + '\'' + ", privacyMap=" + privacyMap + ", useUrlPrivacy=" + useUrlPrivacy + ", showPrivacy=" + showPrivacy + ", indulge_auth=" + indulge_auth + ", loginMethodList=" + loginMethodList + ", loginMethodMap=" + loginMethodMap + ", customParams=" + customParams + ", isCaptchaLogin=" + isCaptchaLogin + ", isCancelable=" + isCancelable + ", showBackBtn=" + showBackBtn + ", isHistoryViewEnable=" + isHistoryViewEnable + ", isQuickButtonBarVisible=" + isQuickButtonBarVisible + ", isFirstNeedSetPassword=" + isFirstNeedSetPassword + ", isDeregisterShow=" + isDeregisterShow + ", isLoginContinue=" + isLoginContinue + ", usernameHintText='" + usernameHintText + '\'' + ", usernameText='" + usernameText + '\'' + ", loginType=" + loginType + ", loginMode=" + loginMode + ", titleResId=" + titleResId + ", logoDrawable=" + logoDrawable + ", forgotUrl='" + forgotUrl + '\'' + ", language='" + language + '\'' + '}';
    }
}
