package com.ruixue.openapi;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.Build;
import android.os.LocaleList;
import android.text.TextUtils;
import android.webkit.WebSettings;
import android.webkit.WebView;

import androidx.annotation.Keep;
import androidx.annotation.NonNull;

import com.ruixue.RXSdkInitConfig;
import com.ruixue.RuiXueSdk;
import com.ruixue.RuiXueSdkVersion;
import com.ruixue.base.BuildConfig;
import com.ruixue.internal.ActivityLifecycleTracker;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RXRequest;
import com.ruixue.utils.AnnouncementCacheUtil;
import com.ruixue.utils.AppUtils;

import org.json.JSONObject;

import java.lang.ref.WeakReference;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;

public final class RXGlobalData {

    public static final int MAX_LENGTH_ALLOWED = 64;

    private static String pwdPattern;

    public static int FEEDBACK_ID;

    public static String LOG_PATH = "";

    //    feedback -> log_limit

    public static long LOG_LIMIT = 204800;

    //未实名用户登录成功后是否需要强制实名认证，默认强制 channel -> ra -> of
    private static boolean need_realauth = true;
    //    实名认证是否可关闭 channel -> ra -> cof
    private static boolean realauth_close = false;
    // 是否开启实名认证快速认证， 默认值为 true channel -> ra -> fa
    private static boolean real_auth_fast_auth = true;
    // 实名认证是否使用自定义键盘， 默认值为 true channel -> ra -> ckb
    private static boolean real_auth_use_custom_keyboard = true;
    // 实名认证是否使用支付宝实名，默认值为 true channel -> ra -> iifaa
    private static boolean real_auth_use_iifaa = true;
    // 支付宝 IIFAA 回跳 Scheme，channel -> sh（与 ra/sp/dr 平级，非 channel.ra.sh）
    private static String real_auth_iifaa_scheme = "";
    //验证码登录的新用户是否弹出设置密码，默认不弹出 channel -> sp -> of
    private static boolean need_setpwd = false;
    //处于注销中的用户登录后是否显示注销窗口，默认不显示 channel -> dr -> of
    private static boolean show_deregister = false;

    //注销按钮显示 "继续登录" 或 "退出登录" channel -> dr -> type
//    1继续登录   ，2退出登录
    private static int deregister_type = 1;

    public static boolean isDisableLanguage() {
        return disableLanguage;
    }

    public static void setDisableLanguage(boolean disableLanguage) {
        RXGlobalData.disableLanguage = disableLanguage;
    }

    private static boolean disableLanguage = false;

    private static String guestTitle;

    private static String WX_APPID;

    private static String QUICK_PHONE_KEY;

    private static String GOOGLE_CLIENT_ID;

    public static String getGoogleClientId() {
        return GOOGLE_CLIENT_ID;
    }

    public static void setGoogleClientId(String googleClientId) {
        if (!TextUtils.isEmpty(googleClientId))
            GOOGLE_CLIENT_ID = googleClientId;
    }

    public static String getQuickPhoneKey() {
        return QUICK_PHONE_KEY;
    }

    public static void setQuickPhoneKey(String quickPhoneKey) {
        if (!TextUtils.isEmpty(quickPhoneKey)) {
            QUICK_PHONE_KEY = quickPhoneKey;
            Map<String, Object> config = new HashMap<>();
            config.put("quickphone_key", quickPhoneKey);
            updateLoginConfig("quickphone", config);
        }

    }

    public static String getWxAppid() {
        return WX_APPID;
    }

    public static void setWxAppid(String wxAppid) {
        if (!TextUtils.isEmpty(wxAppid))
            WX_APPID = wxAppid;
    }

    public static void setGuestTitle(String guestTitle) {
        RXGlobalData.guestTitle = guestTitle;
    }

    public static String getGuestTitle() {
        return guestTitle;
    }

    public static boolean isNeedRealauth() {
        return need_realauth;
    }

    public static void setNeedRealauth(boolean need_realauth) {
        RXGlobalData.need_realauth = need_realauth;
    }

    public static boolean isRealauthClose() {
        return realauth_close;
    }

    public static void setRealauthClose(boolean realauth_close) {
        RXGlobalData.realauth_close = realauth_close;
    }

    public static boolean isRealAuthFastAuth() {
        return real_auth_fast_auth;
    }

    public static void setRealAuthFastAuth(boolean fastAuth) {
        RXGlobalData.real_auth_fast_auth = fastAuth;
    }

    public static boolean isRealAuthUseCustomKeyboard() {
        return real_auth_use_custom_keyboard;
    }

    public static void setRealAuthUseCustomKeyboard(boolean useCustomKeyboard) {
        RXGlobalData.real_auth_use_custom_keyboard = useCustomKeyboard;
    }

    public static boolean isRealAuthUseIIFAA() {
        return real_auth_use_iifaa;
    }

    public static void setRealAuthUseIIFAA(boolean useIIFAA) {
        RXGlobalData.real_auth_use_iifaa = useIIFAA;
    }

    /** 初始化下发的 {@code channel.sh}，用于 IIFAA 支付宝回跳与 redirect_url 请求体。 */
    public static String getRealAuthIIFAAScheme() {
        return real_auth_iifaa_scheme;
    }

    public static void setRealAuthIIFAAScheme(String scheme) {
        RXGlobalData.real_auth_iifaa_scheme = scheme;
    }

    public static boolean isNeedSetpwd() {
        return need_setpwd;
    }

    public static void setNeedSetpwd(boolean need_setpwd) {
        RXGlobalData.need_setpwd = need_setpwd;
    }

    public static boolean isShowDeregister() {
        return show_deregister;
    }

    public static void setShowDeregister(boolean show_deregister) {
        RXGlobalData.show_deregister = show_deregister;
    }

    public static int getDeregisterType() {
        return deregister_type;
    }

    public static void setDeregisterType(int deregister_type) {
        RXGlobalData.deregister_type = deregister_type;
    }

    //用户中心入口配置 channel -> uc -> list
    //real_name, privacy_policy, acount_cancel, phone_management, change_pwd;
    public static void setUserCenterBtns(String[] btns) {
        if (btns != null) {
            Map<String, Object> m = new HashMap<>();
            m.put("btns", btns);
            setUserCenterCfg(m);
        }
    }

    private static Map<String, Map<String, String>> customErrorMsg;

    private static Map<String, Object> goodsTagRelationMap;

    private static List<Map<String, Object>> loginConfigs;


    private static boolean emailRegDisable;

    private static JSONObject appJsonData;

    public static Map<String, String> getCustomErrorMsg() {
        return customErrorMsg != null ? customErrorMsg.get(getLanguage()) : null;
    }

    public static String getCustomErrorMsg(int code) {
        Map<String, String> map = getCustomErrorMsg();
        if (null != map) {
            return map.containsKey(String.valueOf(code)) ? map.get(String.valueOf(code)) : map.get("default");
        } else {
            return null;
        }
    }

    public static void setCustomErrorMsg(Map<String, Map<String, String>> customErrorMsg) {
        RXGlobalData.customErrorMsg = customErrorMsg;
    }

    public static String getContactsPath() {
        return contactsPath;
    }

    public static void setContactsPath(String contactsPath) {
        RXGlobalData.contactsPath = contactsPath;
    }

    public static int getContactsTs() {
        return contactsTs;
    }

    public static void setContactsTs(int contactsTs) {
        RXGlobalData.contactsTs = contactsTs;
    }

    private static String contactsPath;

    private static int contactsTs;

    private static boolean deviceSdOf;

    private static String sdkInitAllConfigData;

    private static boolean cpOf;

    public static String gameRoleId;

    public static String gameRegionTag;

    private static String performReportType;

    private static int performReportUwaTs;

    private static int performReportSdkTs;

    private static boolean netReport;

    private static boolean modReport;

    /** 服务器时间与本地设备时间的偏移量（毫秒），string 类型 */
    private static String serverTimeOffset;

    private static String pushTaskId;

    private static boolean isUseDNS = false;

    public static String getPushTaskId() {
        return pushTaskId;
    }

    public static void setPushTaskId(String pushTaskId) {
        RXGlobalData.pushTaskId = pushTaskId;
    }

    public static boolean isEmailRegDisable() {
        return emailRegDisable;
    }

    public static void setEmailRegDisable(boolean emailRegDisable) {
        RXGlobalData.emailRegDisable = emailRegDisable;
    }

    public static String getLogPath() {
        if (TextUtils.isEmpty(LOG_PATH)) {
            return "feedback_log";
        } else {
            return LOG_PATH.replace("/", "");
        }
    }

    private static int advertise_switch;

    private static final HashMap<String, Locale> languagesList = new HashMap<String, Locale>() {
        {
            put(Language.ENGLISH, Locale.ENGLISH);
            put(Language.CHINESE, Locale.CHINESE);
            put(Language.JAPAN, Locale.JAPAN);
            put(Language.TRADITIONAL_CHINESE, Locale.TRADITIONAL_CHINESE);
            put(Language.PHILIPPINES, new Locale("en", "PH"));
            put(Language.THAI, new Locale("th", "TH"));
            put(Language.VIETNAMESE, new Locale("vi", ""));
            put(Language.INDONESIAN, new Locale("in", ""));
            put(Language.Arabia, new Locale("ar", ""));
        }
    };

    private static WeakReference<Context> weakContext;

    private static RXConfig rxConfig;

    private static String sCpId;
    private static String sProductId;
    private static String sChannelId;


    //自定义语言
    private static boolean isCustomLanguage;

    public static String getsSubChannelId() {
        return sSubChannelId;
    }

    public static void setsSubChannelId(String sSubChannelId) {
        RXGlobalData.sSubChannelId = sSubChannelId;
    }

    private static String sSubChannelId;

    public static void setIpv4Url(String ipv4Url) {
        RXGlobalData.sIpv4Url = ipv4Url;
    }

    private static String sIpv4Url;

    private static String sLanguage = Locale.getDefault().getLanguage();

    public static String LANGUAGE = Locale.getDefault().getLanguage();
    @SuppressLint("ConstantLocale")
    public static final String COUNTRY = Locale.getDefault().getCountry();

    public static void setArea(String area) {
        RXGlobalData.AREA = area;
    }

    public static String AREA = Locale.getDefault().getCountry();

    private static List<String> sBaseUrls;
    private static boolean isDebugEnabledField = BuildConfig.DEBUG;

    private static boolean cmdDebug = false;

    private static boolean isTrackEnv = false;

    //bool 类型 true 开启 false 关闭，默认 false
    private static boolean openRacing = false;


    private static boolean allowFileAccess = false;

    private static boolean javaScriptEnabled = true;
    @Keep
    private static boolean isFullyInitialized;
    private static boolean disableReadSensitiveInfo = false;

    private static PasswordStrength passwordStrength = PasswordStrength.Default;

    public static boolean isOpenRacing() {
        return openRacing;
    }

    public static boolean isAllowFileAccess() {
        return allowFileAccess;
    }

    public static void setAllowFileAccess(boolean allowFileAccess) {
        RXGlobalData.allowFileAccess = allowFileAccess;
    }

    public static void setCmdDebug(boolean cmdDebug) {
        RXGlobalData.cmdDebug = cmdDebug;
        try {
            WebView.setWebContentsDebuggingEnabled(cmdDebug);
        } catch (Exception ignore) {
        }
    }

    public static String getIpv4Url() {
        return sIpv4Url;
    }

    public static boolean isJavaScriptEnabled() {
        return javaScriptEnabled;
    }

    public static void setJavaScriptEnabled(boolean javaScriptEnabled) {
        RXGlobalData.javaScriptEnabled = javaScriptEnabled;
    }

    public static List<Map<String, Object>> getLoginConfigs() {
        return loginConfigs;
    }

    public static void setLoginConfigs(List<Map<String, Object>> loginConfigs) {
        RXGlobalData.loginConfigs = loginConfigs;
        if (loginConfigs != null) {
            for (Map<String, Object> map : loginConfigs) {
                String method = (String) map.get("method");
                if ("wechat".equals(method)) {
                    WX_APPID = (String) map.get("wx_appid");
                } else if ("quickphone".equals(method)) {
                    QUICK_PHONE_KEY = (String) map.get("quickphone_key");
                } else if ("google".equals(method)) {
                    GOOGLE_CLIENT_ID = (String) map.get("google_clientid");
                }
            }
        }
    }

    public static void updateLoginConfig(String method, Map<String, Object> config) {
        if (loginConfigs != null) {
            for (Map<String, Object> map : loginConfigs) {
                String m = (String) map.get("method");
                if (m != null && m.equals(method)) {
                    map.putAll(config);
                }
            }
        }
    }

    @SuppressWarnings("unchecked")
    public static Map<String, Object> getGoodsTagRelationMap(String payType) {
        if (goodsTagRelationMap != null) {
            return (Map<String, Object>) goodsTagRelationMap.get(payType);
        }
        return null;
    }

    public static boolean isTrackEnv() {
        return isTrackEnv;
    }

    public static void setTrackEnv(boolean isTrackEnv) {
        RXGlobalData.isTrackEnv = isTrackEnv;
    }

    public static void setGoodsTagRelationMap(Map<String, Object> goodsTagRelationMap) {
        RXGlobalData.goodsTagRelationMap = goodsTagRelationMap;
    }

    public static JSONObject getAppJsonData() {
        return appJsonData;
    }

    public static void setAppJsonData(JSONObject appJsonData) {
        RXGlobalData.appJsonData = appJsonData;
    }

    public static boolean isDeviceSdOf() {
        return deviceSdOf;
    }

    public static void setDeviceSdOf(boolean deviceSdOf) {
        RXGlobalData.deviceSdOf = deviceSdOf;
    }

    /**
     * 请求加密开关
     * @return 是否加密
     */
    public static boolean isCpOf() {
        return cpOf;
    }

    public static void setCpOf(boolean cpOf) {
        RXGlobalData.cpOf = cpOf;
    }

    public static String getGameRoleId() {
        return gameRoleId;
    }

    public static void setGameRoleId(String roleId) {
        RXGlobalData.gameRoleId = roleId;
    }

    public static String getGameRegionTag() {
        return gameRegionTag;
    }

    public static void setGameRegionTag(String gameRegionTag) {
        RXGlobalData.gameRegionTag = gameRegionTag;
    }


    public static String getSdkInitAllConfigData() {
        return sdkInitAllConfigData;
    }

    public static void setSdkInitAllConfigData(String sdkInitAllConfigData) {
        RXGlobalData.sdkInitAllConfigData = sdkInitAllConfigData;
    }

    public static String getPerformReportType() {
        return performReportType;
    }

    public static void setPerformReportType(String performReportType) {
        RXGlobalData.performReportType = performReportType;
    }

    public static int getPerformReportUwaTs() {
        return performReportUwaTs;
    }

    public static void setPerformReportUwaTs(int performReportUwaTs) {
        RXGlobalData.performReportUwaTs = performReportUwaTs;
    }

    public static int getPerformReportSdkTs() {
        return performReportSdkTs;
    }

    public static void setPerformReportSdkTs(int performReportSdkTs) {
        RXGlobalData.performReportSdkTs = performReportSdkTs;
    }

    public static boolean isNetReport() {
        return netReport;
    }

    public static void setNetReport(boolean netReport) {
        RXGlobalData.netReport = netReport;
    }

    public static boolean isModReport() {
        return modReport;
    }

    public static void setModReport(boolean modReport) {
        RXGlobalData.modReport = modReport;
    }

    public static String getServerTimeOffset() {
        return serverTimeOffset;
    }

    public static void setServerTimeOffset(String serverTimeOffset) {
        RXGlobalData.serverTimeOffset = serverTimeOffset;
    }

    public static boolean isIsUseDNS() {
        return isUseDNS;
    }

    public static void setIsUseDNS(boolean isUseDNS) {
        RXGlobalData.isUseDNS = isUseDNS;
    }

    public static Map<String, Object> getCustomCfg() {
        return rxConfig == null ? new HashMap<>() : rxConfig.getCustom_config();
    }

    public static LoginUIConfig getPassportCfg() {
        return rxConfig == null ? LoginUIConfig.getInstance() : LoginUIConfig.getInstance().build(rxConfig.getPassport());
    }

    public static Map<String, Object> getThirdCfg() {
        return rxConfig == null ? null : rxConfig.getThirdConfig();
    }

    public static Map<String, Object> getUserCenterCfg() {
        return rxConfig == null || rxConfig.getUserCenterCfg() == null ? userCenterConfig : rxConfig.getUserCenterCfg();
    }

    static Map<String, Object> userCenterConfig;

    public static String getPwdPattern() {
        if (passwordStrength != PasswordStrength.Default && passwordStrength != PasswordStrength.Custom) {
            return passwordStrength == PasswordStrength.Strong ? "(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,32}" : "^.{6,32}$";
        } else if (TextUtils.isEmpty(pwdPattern)) {
            return RuiXueSdk.isOasVersion() ? "(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,32}" : "^.{6,32}$";
        } else {
            return pwdPattern;
        }
    }

    public static PasswordStrength getPasswordStrength() {
        if (passwordStrength == PasswordStrength.Default) {
            return RuiXueSdk.isOasVersion() ? PasswordStrength.Strong : PasswordStrength.Average;
        } else {
            return TextUtils.isEmpty(pwdPattern) ? passwordStrength : PasswordStrength.Custom;
        }
    }

    public static void setPasswordStrength(PasswordStrength passwordStrength) {
        RXGlobalData.passwordStrength = passwordStrength;
    }

    public static void setPwdPattern(String pattern) {
        pwdPattern = pattern;
    }

    public static void setUserCenterCfg(Map<String, Object> configMap) {
        Map<String, Object> m = getUserCenterCfg();
        if (m != null && configMap != null) {
            m.putAll(configMap);
        } else {
            userCenterConfig = configMap;
        }
    }

    public static void setSdkInitComplete(boolean complete) {
        isFullyInitialized = complete;
        sdkInitComplete.set(complete);
    }

    private static final AtomicBoolean sdkInitComplete = new AtomicBoolean(false);
    private static Map<String, Object> activatedMap;


    public static int getAdvertise_switch() {
        return advertise_switch;
    }

    public static void setAdvertise_switch(int advertise_switch) {
        RXGlobalData.advertise_switch = advertise_switch;
    }

    private static final AtomicBoolean inInited = new AtomicBoolean(false);


    public static String getLanguage() {
        return TextUtils.isEmpty(sLanguage) ? getDefaultLanguage() : sLanguage;
    }

    public static Locale getLocale() {
        Locale locale = (!TextUtils.isEmpty(sLanguage)) && languagesList.get(sLanguage) != null ? languagesList.get(sLanguage) : Locale.getDefault();
        if (locale != null)
            RXLogger.i("language local " + locale.toLanguageTag());
        return locale;
    }

    public static String getDefaultLanguage() {
        String lang = Locale.getDefault().getLanguage();
        return isSupportLanguage(lang) ? lang : "en";
    }

    public static String getLanguageAndCountry() {
        String lang = getLanguage();
        String country = COUNTRY;
        if (lang.contains("-") || TextUtils.isEmpty(country)) {
            return lang;
        } else {
            return lang + "-" + country;
        }
    }

    public static boolean isSupportLanguage(String language) {
        return languagesList.containsKey(language);
    }

    public static boolean isIsCustomLanguage() {
        return isCustomLanguage;
    }

    public static void setLanguage(Context context, String language, boolean custom) {
        if (language != null) {
            if (isSupportLanguage(language) && (!isCustomLanguage || custom)) {
                isCustomLanguage = custom;
                setLanguage(context, language);
                if (isFullyInitialized()) {
                    Map<String, Object> map = new HashMap<>();
                    Map<String, Object> properties = new HashMap<>();
                    properties.put("language", language);
                    map.put("action", "language");
                    map.put("properties", properties);
                    RXRequest.create(RXApiPath.USER_REPORT).setBody(map).postAsync();
                }
            }
        }
    }


    public static void setLanguage(Context context, String language) {
        RXLogger.i("language set " + language, ",isDisableLanguage:" + isDisableLanguage());
        if (language != null) {
            if (!language.equals(sLanguage)) {
                sLanguage = language;
                AnnouncementCacheUtil.getAnnouncement();
            }
            updateLanguage(context);
        }
    }

    public static void updateLanguage(Context context) {
        try {
            if (context != null && !isDisableLanguage() && !TextUtils.isEmpty(sLanguage)) {
                Locale locale = getLocaleByLanguage(TextUtils.isEmpty(sLanguage) ? "zh" : sLanguage);
                Locale.setDefault(locale);
                updateResource(context.getResources());
                updateResource(context.getApplicationContext().getResources());
            }
        } catch (Throwable t) {
            t.printStackTrace();
        }
    }

    private static void updateResource(Resources resources) {
        Configuration configuration = resources.getConfiguration();
        // app locale 默认简体中文
        Locale locale = getLocaleByLanguage(TextUtils.isEmpty(sLanguage) ? "zh" : sLanguage);
        configuration.setLocale(locale);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            configuration.setLocales(new LocaleList(locale));
        }
        resources.updateConfiguration(configuration, resources.getDisplayMetrics());
    }

    private static Locale getLocaleByLanguage(String language) {
        Locale locale = Locale.getDefault();
        if (languagesList.containsKey(language)) {
            Locale custom = languagesList.get(language);
            return custom != null && !TextUtils.equals(locale.toLanguageTag(), custom.toLanguageTag()) ? custom : locale;
        } else {
            for (Map.Entry<String, Locale> entry : languagesList.entrySet()) {
                if (TextUtils.equals(entry.getKey(), locale.getLanguage())) {
                    return locale;
                }
            }
        }
        return Locale.ENGLISH;
    }

    public static String getWebViewUA() {
        try {
            if (null != getContext())
                return WebSettings.getDefaultUserAgent(getContext());
        } catch (Throwable ignore) {
        }
        return "";
    }

    @Keep
    public static Map<String, Object> getActivatedMap() {
        return activatedMap;
    }

    public static void setActivatedMap(Map<String, Object> activatedMap) {
        RXGlobalData.activatedMap = activatedMap;
    }

    public static boolean readSensitiveInfoEnabled() {
        return sdkInitComplete.get() && !disableReadSensitiveInfo;
    }

    public static void setDisableReadSensitiveInfo(boolean disableRead) {
        disableReadSensitiveInfo = disableRead;
    }

    public static boolean isInited() {
        return inInited.get();
    }

    public static String getCpId() {
        return sCpId;
    }

    public static String getProductId() {
        return sProductId;
    }

    public static void setChannelId(String channelId) {
        RXGlobalData.sChannelId = channelId;
    }

    public static String getChannelId() {
        return sChannelId;
    }


    public static String getFirstBaseUrl() {
        if (null != sBaseUrls && !sBaseUrls.isEmpty()) {
            String baseUrl = sBaseUrls.get(0);
            if (!baseUrl.endsWith("/")) {
                baseUrl += "/";
            }
            return baseUrl;
        } else {
            return "";
        }
    }

    public static List<String> getBaseUrls() {
        return sBaseUrls;
    }

    public static void setBaseUrls(List<String> baseUrls) {
        sBaseUrls = baseUrls;
        if (inInited.get() && null != sBaseUrls && !sBaseUrls.isEmpty()) {
            isFullyInitialized = true;
        }
    }

    public static void urlMoveToFirst(int index) {
        if (null != sBaseUrls && index < sBaseUrls.size() && index > 0) {
            Collections.swap(sBaseUrls, index, 0);
        }
    }

    public static boolean isFullyInitialized() {
        return isFullyInitialized && sdkInitComplete.get();
    }

    public static boolean isDebugEnable() {
        return isDebugEnabledField || cmdDebug;
    }

    public static void setDebugEnabled(boolean isDebugEnabled) {
        isDebugEnabledField = isDebugEnabled;
    }

    public static Map<String, Object> getConfig() {
        Map<String, Object> config_map = new HashMap<>();
        config_map.put("cpid", sCpId);
        config_map.put("productid", sProductId);
        config_map.put("channelid", sChannelId);
        config_map.put("rx_version", RuiXueSdkVersion.BUILD);
        config_map.put("ts", RuiXueSdkVersion.BUILD_TIME);
        if (RuiXueSdk.isAgreedPrivacy()) {
            config_map.put("devicecode", RuiXueSdk.getDeviceCode());
        }
        return config_map;
    }

    private RXGlobalData() {
        throw new UnsupportedOperationException("u can't instantiate me...");
    }

    @Deprecated
    public static void init(String json) {
        if (!TextUtils.isEmpty(json)) {
            rxConfig = RXConfig.objectFromData(json);
            RXConfig.InitBean initBean = rxConfig.getInit();
            if (initBean != null) {
                inInited.set(true);
                sCpId = initBean.getCpid();
                sProductId = initBean.getProductId();
                sChannelId = initBean.getChannelId();
                sIpv4Url = initBean.getIpv4Url();
                setLanguage(getContext(), rxConfig.getPassport().getLanguage());
                setBaseUrls(initBean.getDomain());
            }
        }
    }

    /**
     * 初始化工具类
     * @param context 上下文
     */
    public static void init(@NonNull Context context) {
        Context context1 = Objects.requireNonNull(context).getApplicationContext();
        weakContext = new WeakReference<>(context1 == null ? context : context1);

        String cpid = AppUtils.getAppMetaData(context, "rx_cp_id");
        String productid = AppUtils.getAppMetaData(context, "rx_product_id");
        String channelid = AppUtils.getAppMetaData(context, "rx_channel_id");

//        String ipv4Url = AppUtils.getAppMetaData(context, "rx_ipv4_url");
        if (!TextUtils.isEmpty(cpid) && !TextUtils.isEmpty(productid)) {
            init(cpid, productid, channelid);
        } else if (!TextUtils.isEmpty(channelid)) {
            setChannelId(channelid);
        }
    }

    public static void init(String cpid, String productid, String channelid, List<String> baseUrls) {
        sCpId = cpid;
        sProductId = productid;
        sChannelId = channelid;
//        sIpv4Url = ipv4Url;
        sBaseUrls = baseUrls;
        inInited.set(true);
    }

    public static void init(String cpid, String productid, String channelid) {
        sCpId = cpid;
        sProductId = productid;
        sChannelId = channelid;
        if (!TextUtils.isEmpty(sCpId) && !TextUtils.isEmpty(sCpId) && !TextUtils.isEmpty(sCpId) && weakContext != null && weakContext.get() != null) {
            inInited.set(true);
            if (null != sBaseUrls && sBaseUrls.size() > 0) {
                isFullyInitialized = true;
            }
        }
    }

    public static void init(RXSdkInitConfig config) {
        init(config.getCpId(), config.getProductId(), config.getChannelId());
        if (config.getActivity() != null) {
            ActivityLifecycleTracker.setCurrentActivity(config.getActivity());
            init(config.getActivity());
        }
        isDebugEnabledField = config.isLogEnable();
        openRacing = config.isOpenRacing();
        setIsUseDNS(config.isUseDNS());
        setUserCenterCfg(config.getUserCenterConfig());
        List<String> baseUrls = config.getBaseUrl();
        if (baseUrls != null && !baseUrls.isEmpty()) {
            inInited.set(true);
            setBaseUrls(baseUrls);
        }
    }

    /**
     * 获取ApplicationContext
     * @return ApplicationContext
     */
    public static Context getContext() {
        if (null != weakContext && weakContext.get() != null) {
            return weakContext.get();
        }
        return null;
    }

    @NonNull
    public static Context requireContext() {
        Context context = getContext();
        if (context == null) {
            throw new NullPointerException("sdk context is null error");
        }
        return context;
    }


}