package com.ruixue.share;

import androidx.annotation.Keep;

import com.google.gson.Gson;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/6/14
 */
public class ShareConfig {
    @Keep
    protected int lure;
    @Keep
    protected int achievement;
    @Keep
    protected int team;
    @Keep
    protected int friend;

    public int getLure() {
        return lure;
    }

    public int getAchievement() {
        return achievement;
    }

    public int getTeam() {
        return team;
    }

    public int getFriend() {
        return friend;
    }

    public static ShareConfig fromJson(JSONObject json) {
        return json == null ? null : fromJson(json.toString());
    }

    public static ShareConfig fromJson(String json) {
        return new Gson().fromJson(json, ShareConfig.class);
    }

    public JSONObject toJSONObject() {
        try {
            return new JSONObject(new Gson().toJson(this));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
