package com.ruixue.demo;

import android.content.Context;
import android.text.TextUtils;

import androidx.annotation.Keep;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.gson.Gson;
import com.ruixue.RXSdkInitConfig;
import com.ruixue.RuiXueSdk;
import com.ruixue.demo.config.InitConfigRegistry;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.JSONUtil;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class GlobalConfig {
    private static final String MAIN_ACTIVITY = "com.ruixue.demo.activity.MainActivity";
//    private static final String MAIN_ACTIVITY = "com.ruixue.demo.activity.HWOSActivity";
//    public static final String MAIN_ACTIVITY = "com.ruixue.demo.activity.NavActivity";

    /** 当前选中的初始化配置 key（对应 {@code init_configs.json} 里 configs 下的某个条目）。 */
    private static String initConfigKey;

    public static String getDomain() {
        return RuiXueSdk.getFirstBaseUrl();
    }

    public static String getMainActivity() {
        return MAIN_ACTIVITY;
    }

    /** 由 InitConfigSelector 记忆回填或手动切换调用。传 null 表示清除记忆，回落到默认 key。 */
    public static void setInitConfigKey(String key) {
        GlobalConfig.initConfigKey = key;
    }

    /**
     * 获取当前生效的初始化配置 key。
     * 优先级：NavActivity 固定 → 手动设置 → 当前包名匹配 → {@link InitConfigRegistry#getDefaultKey(Context)}。
     */
    public static String getInitConfigKey(Context context) {
        if (getMainActivity().equals("com.ruixue.demo.activity.NavActivity")) {
            return "cp_119";
        }
        if (!TextUtils.isEmpty(initConfigKey)) {
            return initConfigKey;
        }
        String matchedKey = InitConfigRegistry.findKeyByPackageName(context, context.getPackageName());
        if (!TextUtils.isEmpty(matchedKey)) {
            return matchedKey;
        }
        return InitConfigRegistry.getFallbackKey(context);
    }

    public static boolean readTest() {
        ConfigBean config = getConfig();
        return config != null && config.isTest();
    }


    @Keep
    protected static Map<String, Object> CONFIGS;
    static List<ConfigBean> configBeanList = new ArrayList<>();
    @Keep
    protected static ConfigBean CONFIG;

    /** 当前 CONFIG 对应的 registry key，用于缓存失效判断。 */
    private static String configCacheKey;

    public static Map<String, Object> getConfigs() {
        return CONFIGS;
    }


    public List<ConfigBean> getConfigBeanList() {
        return configBeanList;
    }

    public static Map<String, Object> getExt() {
        ConfigBean config = getConfig();
        return config != null ? config.getExt() : null;
    }

    public static String getWxAppId() {
        ConfigBean config = getConfig();
        return config != null ? config.getWxAppId() : "";
    }

    public static RXSdkInitConfig getSdkInitConfig() {
        ConfigBean config = getConfig();
        if (config == null) {
            return null;
        }
        return new RXSdkInitConfig(config.getCpid(), config.getProductid(), config.getChannelid(), config.getBaseUrl(), null);
    }


    public static ConfigBean getConfig() {
        return getConfig(RuiXueSdk.getContext());
    }

    public static ConfigBean getConfig(Context context) {
        if (context == null) {
            return CONFIG;
        }
        String key = getInitConfigKey(context);
        if (CONFIG != null && TextUtils.equals(key, configCacheKey)) {
            return CONFIG;
        }
        CONFIG = buildConfigFromRegistry(context, key);
        if (CONFIG == null) {
            // registry 加载失败或缺 key 时兜底，保持原 rxconfig else 分支行为（cp_114/国内测试）
            CONFIG = buildDefaultFallbackConfig();
        }
        configCacheKey = key;
        return CONFIG;
    }

    @NonNull
    private static ConfigBean buildDefaultFallbackConfig() {
        ConfigBean bean = new ConfigBean();
        bean.setCpId("114");
        bean.setProductId("1002");
        bean.setChannelId("100");
        bean.setBaseUrl("https://cn-api-test.ruixueyun.com");
        return bean;
    }

    /** 清除缓存的 ConfigBean，下次 getConfig 重新从 registry 构建。切 key 后调用。 */
    public static void invalidateConfigCache() {
        CONFIG = null;
        configCacheKey = null;
    }

    @Nullable
    private static ConfigBean buildConfigFromRegistry(@NonNull Context context, @Nullable String key) {
        String initJson = InitConfigRegistry.getInitJson(context, key);
        if (initJson == null) {
            RXLogger.e("ERROR init config not found for key: " + key);
            return null;
        }
        try {
            JSONObject init = new JSONObject(initJson);
            ConfigBean bean = new ConfigBean();
            bean.setCpId(init.optString("cpid"));
            bean.setProductId(init.optString("product_id"));
            bean.setChannelId(init.optString("channel_id"));
            List<String> domains = new ArrayList<>();
            JSONArray domainArr = init.optJSONArray("domain");
            if (domainArr != null) {
                for (int i = 0; i < domainArr.length(); i++) {
                    String d = domainArr.optString(i);
                    if (!TextUtils.isEmpty(d)) domains.add(d);
                }
            }
            bean.setBaseUrl(domains);
            bean.setPackageName(context.getPackageName());
            String env = InitConfigRegistry.getEnv(context, key);
            if (!TextUtils.isEmpty(env)) {
                bean.setEnv(env);
            }
            JSONObject extObj = InitConfigRegistry.getExt(context, key);
            if (extObj != null) {
                bean.setExt(JSONUtil.toMap(extObj));
            }
            JSONObject extTestObj = InitConfigRegistry.getExtTest(context, key);
            if (extTestObj != null) {
                bean.setExtTest(JSONUtil.toMap(extTestObj));
            }
            bean.build(init);
            return bean;
        } catch (JSONException e) {
            RXLogger.e("buildConfigFromRegistry error: " + e.getMessage());
            return null;
        }
    }

    public static class ConfigBean {

        private JSONObject origin;
        @Keep
        protected String productid;
        @Keep
        protected String cpid;
        @Keep
        protected String channelid;

        public String getIpv4Url() {
            return ipv4Url;
        }

        protected String ipv4Url;
        @Keep
        protected List<String> baseUrl;

        @Keep
        protected String packageName;

        // test prod uat
        @Keep
        protected String env;
        @Keep
        protected Map<String, Object> ext;
        @Keep
        protected Map<String, Object> ext_test;

        public ConfigBean() {
        }

        public static ConfigBean fromJSONObject(JSONObject configObj) {
            ConfigBean configBean = new Gson().fromJson(configObj.toString(), ConfigBean.class);
            return configBean.build(configObj);
        }

        public void setPackageName(String packageName) {
            this.packageName = packageName;
        }

        public String getWxAppId() {
            return getExt() != null ? (String) getExt().get("wx_appid") : "";
        }

        public boolean isTest() {
            return !TextUtils.isEmpty(env) && env.equals("test");
        }

        public ConfigBean build(JSONObject jsonObject) {
            origin = jsonObject;
            if (isTest() && ext != null && ext_test != null) {
                ext.putAll(ext_test);
            }
            return this;
        }


        public void setProductId(String productid) {
            this.productid = productid;
        }

        public void setCpId(String cpid) {
            this.cpid = cpid;
        }

        public void setChannelId(String channelid) {
            this.channelid = channelid;
        }

        public void setBaseUrl(List<String> baseUrl) {
            if (baseUrl != null) {
                for (int i = 0; i < baseUrl.size(); ++i) {
                    String url = baseUrl.get(i);
                    if (!url.startsWith("http")) {
                        baseUrl.set(i, "https://rxapi." + url);
                    }
                }
            }
            this.baseUrl = baseUrl;
        }

        public void setBaseUrl(String... baseUrls) {
            setBaseUrl(Arrays.asList(baseUrls));
        }

        public Map<String, Object> getExt() {
            return ext;
        }

        public void setExt(Map<String, Object> ext) {
            this.ext = ext;
        }

        public void setEnv(String env) {
            this.env = env;
        }

    public void setExtTest(Map<String, Object> extTest) {
        this.ext_test = extTest;
    }

    public Map<String, Object> getExtTest() {
        return ext_test;
    }

        public String getProductid() {
            return productid;
        }

        public String getCpid() {
            return cpid;
        }

        public String getChannelid() {
            return channelid;
        }

        public List<String> getBaseUrl() {
            return baseUrl;
        }

        public String toJson() {
            return new Gson().toJson(this);
        }

    }
}