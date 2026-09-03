package com.ruixue.demo.share;

import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ruixue.demo.GlobalConfig;
import com.ruixue.demo.config.DemoTestConfig;
import com.ruixue.openapi.RXCustomShareConfig;
import com.ruixue.openapi.RXShareConfig;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;

public class ShareTestFormData {

    private static final String DEFAULT_FUNC = "default";
    private static final String DEFAULT_PLATFORM = "wechat";
    private static final String DEFAULT_REGION = "220101";
    private static final String DEFAULT_SCENE = "0";
    private static final String DEFAULT_MATERIAL_TYPE = "link";
    private static final String DEFAULT_TITLE = "测试分享标题";
    private static final String DEFAULT_CONTENT = "测试分享内容";
    private static final String DEFAULT_TRANSMITS = "a=dffd&b=test";
    private static final String DEFAULT_PROTOCOL_ANDROID = DemoTestConfig.PAYERMAX_FRONT_CALLBACK;
    private static final String DEFAULT_PROTOCOL_IOS = DemoTestConfig.PAYERMAX_FRONT_CALLBACK;
    private static final String DEFAULT_USE_SCHEME = "1";
    private static final String DEFAULT_USE_SHORT_URL = "false";
    private static final String DEFAULT_SHOW_CONTENT_IN_CIRCLE = "false";
    private static final String DEFAULT_PROPERTIES_JSON = "{\"source\":\"demo_share_console\"}";

    public final String func;
    public final String platform;
    public final String region;
    public final String shareScene;
    public final String materialType;
    public final String title;
    public final String content;
    public final String image;
    public final String url;
    public final String transmits;
    public final String protocolAndroid;
    public final String protocolIos;
    public final String useScheme;
    public final String useShortUrl;
    public final String showContentInCircle;
    public final String schedulingStrategyId;
    public final String propertiesJson;

    public ShareTestFormData(@NonNull String func,
                             @NonNull String platform,
                             @NonNull String region,
                             @NonNull String shareScene,
                             @NonNull String materialType,
                             @NonNull String title,
                             @NonNull String content,
                             @NonNull String image,
                             @NonNull String url,
                             @NonNull String transmits,
                             @NonNull String protocolAndroid,
                             @NonNull String protocolIos,
                             @NonNull String useScheme,
                             @NonNull String useShortUrl,
                             @NonNull String showContentInCircle,
                             @NonNull String schedulingStrategyId,
                             @NonNull String propertiesJson) {
        this.func = func;
        this.platform = platform;
        this.region = region;
        this.shareScene = shareScene;
        this.materialType = materialType;
        this.title = title;
        this.content = content;
        this.image = image;
        this.url = url;
        this.transmits = transmits;
        this.protocolAndroid = protocolAndroid;
        this.protocolIos = protocolIos;
        this.useScheme = useScheme;
        this.useShortUrl = useShortUrl;
        this.showContentInCircle = showContentInCircle;
        this.schedulingStrategyId = schedulingStrategyId;
        this.propertiesJson = propertiesJson;
    }

    @NonNull
    public static ShareTestFormData defaultValues() {
        return basePreset(DEFAULT_FUNC, DEFAULT_PLATFORM, DEFAULT_SCENE, DEFAULT_MATERIAL_TYPE,
                DEFAULT_TITLE, DEFAULT_CONTENT);
    }

    @NonNull
    public static ShareTestFormData presetWechatLink() {
        return basePreset("bean_leaderboard_share", "wechat", "0", "link",
                "微信链接分享", "用于快速验证微信链接分享链路");
    }

    @NonNull
    public static ShareTestFormData presetLineText() {
        return basePreset(DEFAULT_FUNC, "line", "0", "text",
                "LINE 文本分享", "这是一条来自分享测试台的 LINE 文本消息");
    }

    @NonNull
    public static ShareTestFormData presetFacebookImage() {
        return basePreset(DEFAULT_FUNC, "facebook", "1", "image",
                "Facebook 图片分享", "用于快速验证 Facebook 图片分享链路");
    }

    @NonNull
    public static ShareTestFormData presetSystemText() {
        return basePreset(DEFAULT_FUNC, "system", "0", "text",
                "系统文本分享", "用于快速拉起系统分享面板");
    }

    @NonNull
    public static ShareTestFormData presetMessengerImage() {
        return basePreset(DEFAULT_FUNC, "messenger", "0", "image",
                "Messenger 图片分享", "用于快速验证 Messenger 图片分享");
    }

    @NonNull
    public static ShareTestFormData presetZaloLink() {
        return basePreset("zalo", "zalo", "0", "link",
                "Zalo 链接分享", "用于快速验证 Zalo 好友/朋友圈分享");
    }

    @NonNull
    public static ShareTestFormData presetSnapchatImage() {
        return basePreset(DEFAULT_FUNC, "snapchat", "0", "image",
                "Snapchat 图片分享", "用于快速验证 Snapchat 图片分享");
    }

    @NonNull
    private static ShareTestFormData basePreset(@NonNull String func,
                                                @NonNull String platform,
                                                @NonNull String shareScene,
                                                @NonNull String materialType,
                                                @NonNull String title,
                                                @NonNull String content) {
        return new ShareTestFormData(
                func,
                platform,
                DEFAULT_REGION,
                shareScene,
                materialType,
                title,
                content,
                DemoTestConfig.SHARE_TEST_IMAGE_URL,
                DemoTestConfig.SHARE_TEST_WEB_URL,
                DEFAULT_TRANSMITS,
                DEFAULT_PROTOCOL_ANDROID,
                DEFAULT_PROTOCOL_IOS,
                DEFAULT_USE_SCHEME,
                DEFAULT_USE_SHORT_URL,
                DEFAULT_SHOW_CONTENT_IN_CIRCLE,
                "",
                DEFAULT_PROPERTIES_JSON
        );
    }

    @NonNull
    public ShareTestFormData withSelection(@NonNull ShareResultFormatter.SelectionData selection) {
        return new ShareTestFormData(
                merge(func, selection.func),
                merge(platform, selection.platform),
                merge(region, selection.region),
                merge(shareScene, selection.shareScene),
                merge(materialType, selection.materialType),
                merge(title, selection.title),
                merge(content, selection.content),
                merge(image, selection.image),
                merge(url, selection.url),
                merge(transmits, selection.transmits),
                protocolAndroid,
                protocolIos,
                useScheme,
                useShortUrl,
                showContentInCircle,
                merge(schedulingStrategyId, selection.schedulingStrategyId),
                merge(propertiesJson, selection.propertiesJson)
        );
    }

    @NonNull
    public Map<String, Object> buildShareUiParams() {
        Map<String, Object> params = new HashMap<>();
        params.put("platform", getPlatformValue());
        params.put("material_type", getMaterialTypeValue());
        params.put("shareScene", getShareSceneValue());
        params.put("title", getTitleValue());
        params.put("content", getContentValue());
        params.put("image", getImageValue());
        params.put("url", getUrlValue());
        params.put("appid", GlobalConfig.getWxAppId());
        if (isShowContentInCircleEnabled()) {
            params.put("show_content_in_circle", true);
        }
        putSchemeParams(params);
        if (isUseShortUrlEnabled()) {
            params.put("useShortUrl", true);
        }
        return params;
    }

    @NonNull
    public Map<String, Object> buildShareDataRequest() {
        Map<String, Object> params = new HashMap<>();
        params.put("func", getFuncValue());
        params.put("platform", getPlatformValue());
        params.put("region", getRegionValue());
        if (!TextUtils.isEmpty(getTransmitsValue())) {
            params.put("transmits", getTransmitsValue());
        }
        putSchemeParams(params);
        if (isUseShortUrlEnabled()) {
            params.put("useShortUrl", true);
        }
        return params;
    }

    @NonNull
    public Map<String, Object> buildScheduleInitRequest() {
        Map<String, Object> params = new HashMap<>();
        params.put("funcs", getFuncArray());
        return params;
    }

    @NonNull
    public Map<String, Object> buildShortUrlRequest() {
        Map<String, Object> params = new HashMap<>();
        params.put("url", getUrlValue());
        params.put("title", getTitleValue());
        params.put("content", getContentValue());
        params.put("image", getImageValue());
        return params;
    }

    @NonNull
    public Map<String, Object> buildScheduleReportRequest() {
        Map<String, Object> params = new HashMap<>();
        params.put("func", getFuncValue());
        params.put("platform", getPlatformValue());
        params.put("region", getRegionValue());
        params.put("scheduling_event", "done");
        params.put("scheduling_type", "share");
        params.put("transmits", getTransmitsValue());
        params.put("properties", getPropertiesMap());
        if (!TextUtils.isEmpty(getSchedulingStrategyIdValue())) {
            params.put("scheduling_strategy_id", getSchedulingStrategyIdValue());
        }
        return params;
    }

    @NonNull
    public RXShareConfig toStandardShareConfig() {
        RXShareConfig config = new RXShareConfig();
        config.setFunc(getFuncValue());
        config.setPlatform(getPlatformValue());
        config.setRegion(getRegionValue());
        config.setTransmits(getTransmitsValue());
        config.setShareScene(getShareSceneValue());
        config.setAutoReport(true);
        config.setProperties(getPropertiesMap());
        config.setAndroidScheme(getProtocolAndroidValue());
        config.setiOSScheme(getProtocolIosValue());
        config.setUseScheme(getUseSchemeValue());
        config.setUseShortUrl(isUseShortUrlEnabled());
        return config;
    }

    @NonNull
    public RXCustomShareConfig toCustomShareConfig() {
        RXCustomShareConfig config = new RXCustomShareConfig();
        config.setPlatform(getPlatformValue());
        config.setType(getMaterialTypeValue());
        config.setShareScene(getShareSceneValue());
        config.setTitle(getTitleValue());
        config.setDescription(getContentValue());
        config.setImage(getImageValue());
        config.setUrl(getUrlValue());
        config.setThirdAppid(GlobalConfig.getWxAppId());
        config.setAndroidProtocol(getProtocolAndroidValue());
        config.setIOSProtocol(getProtocolIosValue());
        config.setUseScheme(getUseSchemeValue());
        config.setShow_content_in_circle(isShowContentInCircleEnabled());
        return config;
    }

    @NonNull
    public Map<String, Object> getPropertiesMap() {
        String raw = propertiesJson == null ? "" : propertiesJson.trim();
        if (TextUtils.isEmpty(raw)) {
            return new HashMap<>();
        }
        Type type = new TypeToken<Map<String, Object>>() {}.getType();
        Map<String, Object> map = new Gson().fromJson(raw, type);
        return map == null ? new HashMap<>() : map;
    }

    @NonNull
    public String[] getFuncArray() {
        String value = getFuncValue();
        if (!value.contains(",")) {
            return new String[]{value};
        }
        String[] rawParts = value.split(",");
        java.util.List<String> funcs = new java.util.ArrayList<>();
        for (String part : rawParts) {
            String trimmed = part == null ? "" : part.trim();
            if (!trimmed.isEmpty()) {
                funcs.add(trimmed);
            }
        }
        if (funcs.isEmpty()) {
            funcs.add(DEFAULT_FUNC);
        }
        return funcs.toArray(new String[0]);
    }

    @NonNull
    public String getFuncValue() {
        return fallback(func, DEFAULT_FUNC);
    }

    @NonNull
    public String getPlatformValue() {
        return fallback(platform, DEFAULT_PLATFORM);
    }

    @NonNull
    public String getRegionValue() {
        return fallback(region, DEFAULT_REGION);
    }

    public int getShareSceneValue() {
        try {
            return Integer.parseInt(fallback(shareScene, DEFAULT_SCENE));
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    @NonNull
    public String getMaterialTypeValue() {
        return fallback(materialType, DEFAULT_MATERIAL_TYPE);
    }

    @NonNull
    public String getTitleValue() {
        return fallback(title, DEFAULT_TITLE);
    }

    @NonNull
    public String getContentValue() {
        return fallback(content, DEFAULT_CONTENT);
    }

    @NonNull
    public String getImageValue() {
        return fallback(image, DemoTestConfig.SHARE_TEST_IMAGE_URL);
    }

    @NonNull
    public String getUrlValue() {
        return fallback(url, DemoTestConfig.SHARE_TEST_WEB_URL);
    }

    @NonNull
    public String getTransmitsValue() {
        return fallback(transmits, DEFAULT_TRANSMITS);
    }

    @NonNull
    public String getProtocolAndroidValue() {
        return fallback(protocolAndroid, DEFAULT_PROTOCOL_ANDROID);
    }

    @NonNull
    public String getProtocolIosValue() {
        return fallback(protocolIos, DEFAULT_PROTOCOL_IOS);
    }

    @NonNull
    public String getUseSchemeValue() {
        return fallback(useScheme, DEFAULT_USE_SCHEME);
    }

    public boolean isUseShortUrlEnabled() {
        return "1".equals(useShortUrl)
                || "true".equalsIgnoreCase(fallback(useShortUrl, DEFAULT_USE_SHORT_URL))
                || "yes".equalsIgnoreCase(useShortUrl);
    }

    @NonNull
    public String getUseShortUrlValue() {
        return fallback(useShortUrl, DEFAULT_USE_SHORT_URL);
    }

    public boolean isShowContentInCircleEnabled() {
        return "1".equals(showContentInCircle)
                || "true".equalsIgnoreCase(fallback(showContentInCircle, DEFAULT_SHOW_CONTENT_IN_CIRCLE))
                || "yes".equalsIgnoreCase(showContentInCircle);
    }

    @NonNull
    public String getShowContentInCircleValue() {
        return fallback(showContentInCircle, DEFAULT_SHOW_CONTENT_IN_CIRCLE);
    }

    @NonNull
    public String getSchedulingStrategyIdValue() {
        return schedulingStrategyId == null ? "" : schedulingStrategyId.trim();
    }

    @NonNull
    public String getPropertiesJsonValue() {
        return fallback(propertiesJson, DEFAULT_PROPERTIES_JSON);
    }

    private void putSchemeParams(@NonNull Map<String, Object> params) {
        params.put("protocol_android", getProtocolAndroidValue());
        params.put("protocol_ios", getProtocolIosValue());
        params.put("use_scheme", getUseSchemeValue());
    }

    @NonNull
    private static String fallback(String value, String fallback) {
        String trimmed = value == null ? "" : value.trim();
        return trimmed.isEmpty() ? fallback : trimmed;
    }

    @NonNull
    private static String merge(String current, String incoming) {
        String trimmed = incoming == null ? "" : incoming.trim();
        return trimmed.isEmpty() ? (current == null ? "" : current) : incoming;
    }
}
