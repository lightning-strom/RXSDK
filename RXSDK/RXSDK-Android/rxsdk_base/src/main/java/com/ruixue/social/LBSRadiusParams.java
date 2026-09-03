package com.ruixue.social;

import androidx.annotation.Keep;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.utils.EntityUtils;

import org.json.JSONObject;

import java.util.Map;

/**
 * LBS 半径查询参数对象
 * 
 * <p>用于封装 {@link com.ruixue.openapi.RXSDK#lbsRadius} 方法的参数</p>
 * 
 * @author ROC LEE
 * @date 2026/1/19
 */
public class LBSRadiusParams {

    @Keep
    @NonNull
    private String types;

    @Keep
    private float longitude;

    @Keep
    private float latitude;

    @Keep
    private float radius;

    @Keep
    private int count;

    @Keep
    private int page;

    @Keep
    private int pageSize;

    /**
     * 构造函数
     * 
     * @param types     类型
     * @param longitude 经度
     * @param latitude  纬度
     * @param radius    半径（米）
     */
    public LBSRadiusParams(@NonNull String types, float longitude, float latitude, float radius) {
        this.types = types;
        this.longitude = longitude;
        this.latitude = latitude;
        this.radius = radius;
        this.count = 10; // 默认值
        this.page = 1; // 默认值
        this.pageSize = 10; // 默认值
    }

    /**
     * 完整构造函数
     * 
     * @param types     类型
     * @param longitude 经度
     * @param latitude  纬度
     * @param radius    半径（米）
     * @param count     数量
     * @param page      页码
     * @param pageSize  每页大小
     */
    public LBSRadiusParams(@NonNull String types, float longitude, float latitude, float radius,
            int count, int page, int pageSize) {
        this.types = types;
        this.longitude = longitude;
        this.latitude = latitude;
        this.radius = radius;
        this.count = count;
        this.page = page;
        this.pageSize = pageSize;
    }

    /**
     * 从 Map 创建参数对象
     * 
     * @param map 参数 Map
     * @return LBSRadiusParams 对象
     */
    @NonNull
    public static LBSRadiusParams fromMap(@NonNull Map<String, Object> map) {
        return EntityUtils.mapToEntity(map, LBSRadiusParams.class);
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
    public String getTypes() {
        return types;
    }

    public void setTypes(@NonNull String types) {
        this.types = types;
    }

    public float getLongitude() {
        return longitude;
    }

    public void setLongitude(float longitude) {
        this.longitude = longitude;
    }

    public float getLatitude() {
        return latitude;
    }

    public void setLatitude(float latitude) {
        this.latitude = latitude;
    }

    public float getRadius() {
        return radius;
    }

    public void setRadius(float radius) {
        this.radius = radius;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }
}
