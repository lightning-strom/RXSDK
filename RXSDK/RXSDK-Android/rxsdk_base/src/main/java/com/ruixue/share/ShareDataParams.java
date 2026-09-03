package com.ruixue.share;

import androidx.annotation.Keep;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.utils.EntityUtils;

import org.json.JSONObject;

import java.util.Map;

/**
 * 分享数据参数对象
 * 
 * <p>用于封装 {@link com.ruixue.openapi.RXSDK#getShareData} 方法的参数</p>
 * 
 * <p>参数说明：</p>
 * <ul>
 *   <li>func: 必须，埋点标识</li>
 *   <li>region: 必须，地区码，取不到传空字符串</li>
 *   <li>appType: 非必须，小游戏需要传 minigame</li>
 *   <li>transmitargs: 非必须，透传参数，原样返回</li>
 *   <li>custom: 非必须，自定义参数，URLENCODE</li>
 *   <li>method: 非必须，分享方式 1广告，2好友列表 4朋友圈 (2+4正常分享)，8指定分享</li>
 *   <li>share_from: 非必须，分享人瑞雪 openid</li>
 *   <li>share_first: 非必须，首次分享人瑞雪 openid</li>
 * </ul>
 * 
 * @author ROC LEE
 * @date 2026/1/19
 */
public class ShareDataParams {

    @Keep
    @NonNull
    private String func;

    @Keep
    @NonNull
    private String region;

    @Keep
    @Nullable
    private String appType;

    @Keep
    @Nullable
    private String transmitargs;

    @Keep
    @Nullable
    private String custom;

    @Keep
    @Nullable
    private String method;

    @Keep
    @Nullable
    private String share_from;

    @Keep
    @Nullable
    private String share_first;

    @Keep
    @Nullable
    private Boolean readCache;

    /**
     * 构造函数
     * 
     * @param func   埋点标识（必须）
     * @param region 地区码（必须，取不到传空字符串）
     */
    public ShareDataParams(@NonNull String func, @NonNull String region) {
        this.func = func;
        this.region = region != null ? region : "";
    }

    /**
     * 从 Map 创建参数对象
     * 
     * @param map 参数 Map
     * @return ShareDataParams 对象
     */
    @NonNull
    public static ShareDataParams fromMap(@NonNull Map<String, Object> map) {
        return EntityUtils.mapToEntity(map, ShareDataParams.class);
    }

    /**
     * 转换为 Map
     * 
     * @return Map 对象
     */
    @NonNull
    public Map<String, Object> toMap() {
        Map<String, Object> map = EntityUtils.entityToMap(this, true, false);
        // 确保 region 不为 null
        if (map.get("region") == null) {
            map.put("region", "");
        }
        return map;
    }

    /**
     * 转换为 JSONObject
     * 
     * @return JSONObject 对象
     */
    @NonNull
    public JSONObject toJSONObject() {
        return new JSONObject(toMap());
    }

    /**
     * 转换为 JSON 字符串
     * 
     * @return JSON 字符串
     */
    @NonNull
    public String toJSONString() {
        return new JSONObject(toMap()).toString();
    }

    // Getters and Setters

    @NonNull
    public String getFunc() {
        return func;
    }

    /**
     * 设置埋点标识
     * 
     * @param func 埋点标识
     * @return this
     */
    @NonNull
    public ShareDataParams setFunc(@NonNull String func) {
        this.func = func;
        return this;
    }

    @NonNull
    public String getRegion() {
        return region;
    }

    /**
     * 设置地区码
     * 
     * @param region 地区码（取不到传空字符串）
     * @return this
     */
    @NonNull
    public ShareDataParams setRegion(@NonNull String region) {
        this.region = region != null ? region : "";
        return this;
    }

    @Nullable
    public String getAppType() {
        return appType;
    }

    /**
     * 设置应用类型（小游戏需要传 minigame）
     * 
     * @param appType 应用类型
     * @return this
     */
    @NonNull
    public ShareDataParams setAppType(@Nullable String appType) {
        this.appType = appType;
        return this;
    }

    @Nullable
    public String getTransmitargs() {
        return transmitargs;
    }

    /**
     * 设置透传参数（原样返回）
     * 
     * @param transmitargs 透传参数
     * @return this
     */
    @NonNull
    public ShareDataParams setTransmitargs(@Nullable String transmitargs) {
        this.transmitargs = transmitargs;
        return this;
    }

    @Nullable
    public String getCustom() {
        return custom;
    }

    /**
     * 设置自定义参数（URLENCODE）
     * 
     * @param custom 自定义参数
     * @return this
     */
    @NonNull
    public ShareDataParams setCustom(@Nullable String custom) {
        this.custom = custom;
        return this;
    }

    @Nullable
    public String getMethod() {
        return method;
    }

    /**
     * 设置分享方式
     * <p>1: 广告</p>
     * <p>2: 好友列表</p>
     * <p>4: 朋友圈</p>
     * <p>2+4: 正常分享</p>
     * <p>8: 指定分享</p>
     * 
     * @param method 分享方式
     * @return this
     */
    @NonNull
    public ShareDataParams setMethod(@Nullable String method) {
        this.method = method;
        return this;
    }

    @Nullable
    public String getShare_from() {
        return share_from;
    }

    /**
     * 设置分享人瑞雪 openid
     * 
     * @param share_from 分享人瑞雪 openid
     * @return this
     */
    @NonNull
    public ShareDataParams setShare_from(@Nullable String share_from) {
        this.share_from = share_from;
        return this;
    }

    @Nullable
    public String getShare_first() {
        return share_first;
    }

    /**
     * 设置首次分享人瑞雪 openid
     * 
     * @param share_first 首次分享人瑞雪 openid
     * @return this
     */
    @NonNull
    public ShareDataParams setShare_first(@Nullable String share_first) {
        this.share_first = share_first;
        return this;
    }

    @Nullable
    public Boolean getReadCache() {
        return readCache;
    }

    /**
     * 设置是否读取缓存
     * 
     * @param readCache 是否读取缓存
     * @return this
     */
    @NonNull
    public ShareDataParams setReadCache(@Nullable Boolean readCache) {
        this.readCache = readCache;
        return this;
    }
}
