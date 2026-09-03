package com.ruixue.base;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;
import com.ruixue.openapi.BusinessWindowData;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/5/26
 */
public class BusinessData {

    /**
     * 主窗口配置信息
     */
    @Keep
    @SerializedName(value = "main_window_list", alternate = {"mainWindowList"})
    private List<MainWindowList> mainWindowList;
    /**
     * 刷新间隔，单位毫秒
     */
    @Keep
    @SerializedName(value = "refresh_time", alternate = {"refreshTime"})
    private long refreshTime;

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    @Keep
    private String version;

    public boolean isHitCache() {
        return hit_cache;
    }

    @Keep
    @SerializedName(value = "hit_cache", alternate = {"hitCache"})
    private boolean hit_cache;

    /**
     * 窗口配置信息
     */
    @Keep
    private List<BusinessWindowData> window_list;

    public List<MainWindowList> getMainWindowList() {
        return mainWindowList;
    }

    public void setMainWindowList(List<MainWindowList> value) {
        this.mainWindowList = value;
    }

    public long getRefreshTime() {
        return refreshTime;
    }

    public void setRefreshTime(long value) {
        this.refreshTime = value;
    }

    public List<BusinessWindowData> getWindowList() {
        return window_list;
    }

    public void setWindowList(List<BusinessWindowData> value) {
        this.window_list = value;
    }


// MainWindowList.java


    public static class MainWindowList {
        /**
         * 自动弹出配置
         */
        @Keep
        @SerializedName(value = "auto_popups", alternate = {"autoPopups"})
        private Map<String, List<AutoPopups>> autoPopups;
        /**
         * 手动弹出配置
         */
        @Keep
        @SerializedName(value = "manual_popups", alternate = {"popups"})
        private Map<String, Map<String, List<PopupsBean>>> popups;

        /**
         * 主窗口标识
         */
        @Keep
        @SerializedName(value = "window_key", alternate = {"windowKey"})
        private String windowKey;

        public String getWindowKey() {
            return windowKey;
        }

        public void setWindowKey(String value) {
            this.windowKey = value;
        }

        public Map<String, List<AutoPopups>> getAutoPopups() {
            return autoPopups;
        }

        public Map<String, Map<String, List<PopupsBean>>> getPopups() {
            return popups;
        }
    }

// AutoPopups.java

    /**
     * 自动弹出配置
     */
    public static class AutoPopups extends PopupsBean {
        public int getDayLimit() {
            return day_limit;
        }

        @Keep
        private int day_limit;
    }

    /**
     * 弹出配置
     */
    public static class PopupsBean implements Comparable<PopupsBean> {
        /**
         * 弹出顺序
         */
        @Keep
        private Long index;
        /**
         * 窗口标识
         */
        @Keep
        @SerializedName(value = "window_key", alternate = {"windowKey"})
        private String windowKey;

        public Long getIndex() {
            return index;
        }

        public void setIndex(Long value) {
            this.index = value;
        }

        public String getWindowKey() {
            return windowKey;
        }

        public void setWindowKey(String value) {
            this.windowKey = value;
        }

        @Override
        public int compareTo(PopupsBean o) {
            return (int) (index - o.getIndex());
        }
    }

    private JSONObject originData;

    public JSONObject getOriginData() {
        return originData;
    }

    public void setOriginData(JSONObject originData) {
        this.originData = originData;
    }


    public static BusinessData fromJson(JSONObject data) {
        BusinessData businessData = new Gson().fromJson(data.toString(), BusinessData.class);
        businessData.originData = data;
        return businessData;
    }

    public JSONObject toJSONObject() {
        return originData;
    }

}
