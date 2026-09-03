package com.ruixue.track;

import androidx.annotation.Keep;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.utils.EntityUtils;

import org.json.JSONObject;

import java.util.Map;

/**
 * 埋点数据上报参数对象
 * 
 * <p>用于封装 {@link com.ruixue.openapi.RXSDK#dataTrack} 方法的参数</p>
 * 
 * @author ROC LEE
 * @date 2026/1/19
 */
public class DataTrackParams {

    @Keep
    @NonNull
    private String eventName;

    @Keep
    @NonNull
    private String distinctId;

    @Keep
    @Nullable
    private Map<String, Object> properties;

    @Keep
    @Nullable
    private Integer flushInterval;

    @Keep
    @Nullable
    private Integer maxCacheCount;

    /**
     * 构造函数
     * 
     * @param eventName  埋点标识事件
     * @param distinctId 用户唯一标识
     */
    public DataTrackParams(@NonNull String eventName, @NonNull String distinctId) {
        this.eventName = eventName;
        this.distinctId = distinctId;
    }

    /**
     * 构造函数（带属性）
     * 
     * @param eventName  埋点标识事件
     * @param distinctId 用户唯一标识
     * @param properties 自定义属性
     */
    public DataTrackParams(@NonNull String eventName, @NonNull String distinctId,
            @Nullable Map<String, Object> properties) {
        this.eventName = eventName;
        this.distinctId = distinctId;
        this.properties = properties;
    }

    /**
     * 完整构造函数（带缓存配置）
     * 
     * @param eventName     埋点标识事件
     * @param distinctId    用户唯一标识
     * @param properties    自定义属性
     * @param flushInterval 上报时间间隔（秒）
     * @param maxCacheCount 最大缓存条数
     */
    public DataTrackParams(@NonNull String eventName, @NonNull String distinctId,
            @Nullable Map<String, Object> properties, int flushInterval, int maxCacheCount) {
        this.eventName = eventName;
        this.distinctId = distinctId;
        this.properties = properties;
        this.flushInterval = flushInterval;
        this.maxCacheCount = maxCacheCount;
    }

    /**
     * 从 Map 创建参数对象
     * 
     * @param map 参数 Map
     * @return DataTrackParams 对象
     */
    @NonNull
    public static DataTrackParams fromMap(@NonNull Map<String, Object> map) {
        return EntityUtils.mapToEntity(map, DataTrackParams.class);
    }

    /**
     * 转换为 Map
     * 
     * @return Map 对象
     */
    @NonNull
    public Map<String, Object> toMap() {
        return EntityUtils.entityToMap(this, true, false);
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
    public String getEventName() {
        return eventName;
    }

    public void setEventName(@NonNull String eventName) {
        this.eventName = eventName;
    }

    @NonNull
    public String getDistinctId() {
        return distinctId;
    }

    public void setDistinctId(@NonNull String distinctId) {
        this.distinctId = distinctId;
    }

    @Nullable
    public Map<String, Object> getProperties() {
        return properties;
    }

    public void setProperties(@Nullable Map<String, Object> properties) {
        this.properties = properties;
    }

    @Nullable
    public Integer getFlushInterval() {
        return flushInterval;
    }

    public void setFlushInterval(@Nullable Integer flushInterval) {
        this.flushInterval = flushInterval;
    }

    @Nullable
    public Integer getMaxCacheCount() {
        return maxCacheCount;
    }

    public void setMaxCacheCount(@Nullable Integer maxCacheCount) {
        this.maxCacheCount = maxCacheCount;
    }

    /**
     * 判断是否包含缓存配置
     * 
     * @return 是否包含缓存配置
     */
    public boolean hasCacheConfig() {
        return flushInterval != null && maxCacheCount != null;
    }
}
