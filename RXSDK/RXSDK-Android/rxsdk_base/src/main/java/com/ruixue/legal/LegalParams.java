package com.ruixue.legal;

import androidx.annotation.Keep;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.utils.EntityUtils;

import org.json.JSONObject;

import java.util.Map;

/**
 * 法务参数对象
 * 
 * <p>用于封装 {@link com.ruixue.openapi.RXSDK#legal} 和 
 * {@link com.ruixue.openapi.RXSDK#legalTerms} 方法的参数</p>
 * 
 * @author ROC LEE
 * @date 2026/1/19
 */
public class LegalParams {

    @Keep
    @Nullable
    private String keys;

    @Keep
    @Nullable
    private Map<String, Object> extension;

    /**
     * 构造函数
     */
    public LegalParams() {
    }

    /**
     * 构造函数（带 keys）
     * 
     * @param keys 条款 key（多个用逗号分隔）
     */
    public LegalParams(@Nullable String keys) {
        this.keys = keys;
    }

    /**
     * 从 Map 创建参数对象
     * 
     * @param map 参数 Map
     * @return LegalParams 对象
     */
    @NonNull
    public static LegalParams fromMap(@NonNull Map<String, Object> map) {
        return EntityUtils.mapToEntity(map, LegalParams.class);
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

    @Nullable
    public String getKeys() {
        return keys;
    }

    /**
     * 设置条款 key（多个用逗号分隔）
     * 
     * @param keys 条款 key
     * @return this
     */
    @NonNull
    public LegalParams setKeys(@Nullable String keys) {
        this.keys = keys;
        return this;
    }

    @Nullable
    public Map<String, Object> getExtension() {
        return extension;
    }

    /**
     * 设置扩展字段
     * 
     * @param extension 扩展字段 Map
     * @return this
     */
    @NonNull
    public LegalParams setExtension(@Nullable Map<String, Object> extension) {
        this.extension = extension;
        return this;
    }
}
