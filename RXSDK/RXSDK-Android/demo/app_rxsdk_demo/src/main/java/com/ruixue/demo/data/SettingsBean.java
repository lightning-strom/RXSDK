package com.ruixue.demo.data;


import static android.content.Context.MODE_PRIVATE;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;

import com.google.gson.Gson;
import com.ruixue.base.CaptchaPurpose;
import com.ruixue.openapi.Constants;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

/**
 * A generic class that holds a result success w/ data or an error exception.
 */
public class SettingsBean {
    static SettingsBean sInstance;

    public static SettingsBean getInstance() {
        if (sInstance == null) {
            sInstance = new SettingsBean();
        }
        return sInstance;
    }

    int orientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE;

    public int getIsCaptcha() {
        return isCaptcha;
    }

    public void setIsCaptcha(int isCaptcha) {
        this.isCaptcha = isCaptcha;
    }

    int loginType = Constants.REGISTER_TYPE_USERNAME;
    int isCaptcha = 0;

    public boolean isFirstQuickLogin() {
        return isFirstQuickLogin;
    }

    public void setFirstQuickLogin(boolean firstQuickLogin) {
        isFirstQuickLogin = firstQuickLogin;
    }

    boolean isFirstQuickLogin = false;
    String bg_hall;
    String bg_login;

    String language;

    public void setLanguage(String language) {
        this.language = language;
    }


    public String getLanguage() {
        return language;
    }

    LinkedHashSet<String> loginMethods = new LinkedHashSet<>();

    public int getOrientation() {
        return orientation;
    }

    public void setOrientation(int orientation) {
        this.orientation = orientation;
    }

    public int getLoginType() {
        return loginType;
    }

    public void setLoginType(int loginType) {
        this.loginType = loginType;
    }

    public String getBg_hall() {
        return bg_hall;
    }

    public void setBg_hall(String bg_hall) {
        this.bg_hall = bg_hall;
    }

    public String getBg_login() {
        return bg_login;
    }

    public void setBg_login(String bg_login) {
        this.bg_login = bg_login;
    }

    public List<String> getLoginMethods() {
        return new ArrayList<>(this.loginMethods);
    }

    public void setLoginMethods(List<String> loginMethods) {
        this.loginMethods = new LinkedHashSet<>(loginMethods);
    }

    public void addLoginMethod(String method) {
        if (this.loginMethods == null) {
            loginMethods = new LinkedHashSet<>();
        }
        this.loginMethods.add(method);
    }

    public void removeLoginMethod(String method) {
        this.loginMethods.remove(method);
    }

    public SettingsBean load(Context context) {
        SharedPreferences preferences = context.getSharedPreferences("demo_settings", MODE_PRIVATE);
        String json = preferences.getString("settings", null);
        return fromJson(json);
    }

    @SuppressLint("CommitPrefEdits")
    public void save(Context context) {
        SharedPreferences preferences = context.getSharedPreferences("demo_settings", MODE_PRIVATE);
        preferences.edit().putString("settings", toJson()).commit();
    }


    public String toJson() {
        return new Gson().toJson(this);
    }

    public SettingsBean fromJson(String json) {
        if (json != null) {
            sInstance = new Gson().fromJson(json, SettingsBean.class);
        }
        return getInstance();
    }
}