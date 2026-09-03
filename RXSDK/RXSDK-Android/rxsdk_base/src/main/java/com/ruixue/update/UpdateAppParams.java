package com.ruixue.update;

import androidx.annotation.Keep;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.utils.EntityUtils;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * 更新应用参数对象
 * 
 * <p>用于封装 {@link com.ruixue.openapi.RXSDK#updateApp}、{@link com.ruixue.openapi.RXSDK#checkUpdateApp}、
 * {@link com.ruixue.openapi.RXSDK#updateActivity}、{@link com.ruixue.openapi.RXSDK#updateGame} 方法的参数</p>
 * 
 * @author ROC LEE
 * @date 2026/1/19
 */
public class UpdateAppParams {

    @Keep
    @NonNull
    private String version;

    @Keep
    @NonNull
    private String region;

    @Keep
    @Nullable
    private String type;

    @Keep
    @Nullable
    private String format;

    @Keep
    @Nullable
    private Map<String, Object> games;

    @Keep
    @Nullable
    private Map<String, Object> activities;

    @Keep
    @Nullable
    private String activityShortname;

    @Keep
    @Nullable
    private String activityVersion;

    @Keep
    @Nullable
    private String activityCheckVersion;

    @Keep
    @Nullable
    private String gameId;

    @Keep
    @Nullable
    private String gameVersion;

    @Keep
    @Nullable
    private String gameCheckVersion;

    /**
     * 构造函数（用于 updateApp）
     * 
     * @param version 客户端版本号（3段或4段）
     * @param region  地区码
     */
    public UpdateAppParams(@NonNull String version, @NonNull String region) {
        this.version = version;
        this.region = region;
    }

    /**
     * 构造函数（用于 checkUpdateApp）
     * 
     * @param version  客户端版本号（3段或4段）
     * @param region   地区码，默认0
     * @param type     脚本类型，默认js，可选lua、u3d
     */
    public UpdateAppParams(@NonNull String version, @NonNull String region, @Nullable String type) {
        this.version = version;
        this.region = region;
        this.type = type;
    }

    /**
     * 从 Map 创建参数对象
     * 
     * @param map 参数 Map
     * @return UpdateAppParams 对象
     */
    @NonNull
    public static UpdateAppParams fromMap(@NonNull Map<String, Object> map) {
        return EntityUtils.mapToEntity(map, UpdateAppParams.class);
    }

    /**
     * 转换为 Map（用于 updateApp）
     * 
     * @return Map 对象
     */
    @NonNull
    public Map<String, Object> toMap() {
        Map<String, Object> map = EntityUtils.entityToMap(this, true, false);
        
        // 构建 queryMap
        Map<String, Object> queryMap = new HashMap<>();
        if (type != null) {
            queryMap.put("type", type);
        }
        if (format != null) {
            queryMap.put("format", format);
        }
        if (games != null) {
            queryMap.put("games", games);
        }
        if (activities != null) {
            queryMap.put("activities", activities);
        }
        
        // 将 queryMap 合并到主 map
        map.put("queryMap", queryMap);
        
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
    public String getVersion() {
        return version;
    }

    public void setVersion(@NonNull String version) {
        this.version = version;
    }

    @NonNull
    public String getRegion() {
        return region;
    }

    public void setRegion(@NonNull String region) {
        this.region = region;
    }

    @Nullable
    public String getType() {
        return type;
    }

    /**
     * 设置脚本类型（默认json，可选lua、u3d）
     * 
     * @param type 脚本类型
     * @return this
     */
    @NonNull
    public UpdateAppParams setType(@Nullable String type) {
        this.type = type;
        return this;
    }

    @Nullable
    public String getFormat() {
        return format;
    }

    /**
     * 设置输出文件后缀（默认json，可选lua）
     * 
     * @param format 输出文件后缀
     * @return this
     */
    @NonNull
    public UpdateAppParams setFormat(@Nullable String format) {
        this.format = format;
        return this;
    }

    @Nullable
    public Map<String, Object> getGames() {
        return games;
    }

    /**
     * 设置游戏版本信息（用于 checkUpdateApp）
     * <p>格式：{"游戏id": "客户端游戏版本"}</p>
     * 
     * @param games 游戏版本信息 Map
     * @return this
     */
    @NonNull
    public UpdateAppParams setGames(@Nullable Map<String, Object> games) {
        this.games = games;
        return this;
    }

    @Nullable
    public Map<String, Object> getActivities() {
        return activities;
    }

    /**
     * 设置活动版本信息（用于 checkUpdateApp）
     * <p>格式：{"活动别名": "客户端活动版本"}</p>
     * 
     * @param activities 活动版本信息 Map
     * @return this
     */
    @NonNull
    public UpdateAppParams setActivities(@Nullable Map<String, Object> activities) {
        this.activities = activities;
        return this;
    }

    @Nullable
    public String getActivityShortname() {
        return activityShortname;
    }

    /**
     * 设置活动别名（用于 updateActivity）
     * 
     * @param activityShortname 活动别名
     * @return this
     */
    @NonNull
    public UpdateAppParams setActivityShortname(@Nullable String activityShortname) {
        this.activityShortname = activityShortname;
        return this;
    }

    @Nullable
    public String getActivityVersion() {
        return activityVersion;
    }

    /**
     * 设置客户端活动版本号（用于 updateActivity）
     * 
     * @param activityVersion 客户端活动版本号
     * @return this
     */
    @NonNull
    public UpdateAppParams setActivityVersion(@Nullable String activityVersion) {
        this.activityVersion = activityVersion;
        return this;
    }

    @Nullable
    public String getActivityCheckVersion() {
        return activityCheckVersion;
    }

    /**
     * 设置优先检查的活动版本（用于 updateActivity）
     * 
     * @param activityCheckVersion 优先检查的活动版本
     * @return this
     */
    @NonNull
    public UpdateAppParams setActivityCheckVersion(@Nullable String activityCheckVersion) {
        this.activityCheckVersion = activityCheckVersion;
        return this;
    }

    @Nullable
    public String getGameId() {
        return gameId;
    }

    /**
     * 设置游戏 ID（用于 updateGame）
     * 
     * @param gameId 游戏 ID
     * @return this
     */
    @NonNull
    public UpdateAppParams setGameId(@Nullable String gameId) {
        this.gameId = gameId;
        return this;
    }

    @Nullable
    public String getGameVersion() {
        return gameVersion;
    }

    /**
     * 设置客户端游戏版本号（用于 updateGame）
     * 
     * @param gameVersion 客户端游戏版本号
     * @return this
     */
    @NonNull
    public UpdateAppParams setGameVersion(@Nullable String gameVersion) {
        this.gameVersion = gameVersion;
        return this;
    }

    @Nullable
    public String getGameCheckVersion() {
        return gameCheckVersion;
    }

    /**
     * 设置优先检查的游戏版本（用于 updateGame）
     * 
     * @param gameCheckVersion 优先检查的游戏版本
     * @return this
     */
    @NonNull
    public UpdateAppParams setGameCheckVersion(@Nullable String gameCheckVersion) {
        this.gameCheckVersion = gameCheckVersion;
        return this;
    }
}
