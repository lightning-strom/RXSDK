package com.ruixue.demo.social;

import android.text.TextUtils;

import androidx.annotation.NonNull;

public class SocialTestFormData {

    public static final String DEFAULT_TARGET_OPEN_ID = "rxuNZP3GnkxYVXMf2xW6UZEKdg0z7wLm";
    public static final String DEFAULT_RELATION_KEY = "test";
    public static final String DEFAULT_RANK_ID = "2023_100_1680_weekly";
    public static final double DEFAULT_LON = 118.19646377354036d;
    public static final double DEFAULT_LAT = 24.483710802285128d;

    public final String targetOpenId;
    public final String queryOpenId;
    public final String friendRemark;
    public final String userRemark;
    public final String relationKey;
    public final String relationRemark;
    public final String rankId;
    public final String score;
    public final String rankStart;
    public final String rankEnd;
    public final String lon;
    public final String lat;
    public final String radius;
    public final String page;
    public final String pageSize;
    public final String lbsType;

    public SocialTestFormData(@NonNull String targetOpenId,
                              @NonNull String queryOpenId,
                              @NonNull String friendRemark,
                              @NonNull String userRemark,
                              @NonNull String relationKey,
                              @NonNull String relationRemark,
                              @NonNull String rankId,
                              @NonNull String score,
                              @NonNull String rankStart,
                              @NonNull String rankEnd,
                              @NonNull String lon,
                              @NonNull String lat,
                              @NonNull String radius,
                              @NonNull String page,
                              @NonNull String pageSize,
                              @NonNull String lbsType) {
        this.targetOpenId = safeTrim(targetOpenId, DEFAULT_TARGET_OPEN_ID);
        this.queryOpenId = safeTrim(queryOpenId, this.targetOpenId);
        this.friendRemark = safeTrim(friendRemark, "demo_friend_remark");
        this.userRemark = safeTrim(userRemark, "demo_user_remark");
        this.relationKey = safeTrim(relationKey, DEFAULT_RELATION_KEY);
        this.relationRemark = safeTrim(relationRemark, "test_relation_remark");
        this.rankId = safeTrim(rankId, DEFAULT_RANK_ID);
        this.score = safeTrim(score, "66");
        this.rankStart = safeTrim(rankStart, "1");
        this.rankEnd = safeTrim(rankEnd, "20");
        this.lon = safeTrim(lon, String.valueOf(DEFAULT_LON));
        this.lat = safeTrim(lat, String.valueOf(DEFAULT_LAT));
        this.radius = safeTrim(radius, "1000");
        this.page = safeTrim(page, "1");
        this.pageSize = safeTrim(pageSize, "10");
        this.lbsType = safeTrim(lbsType, "friend");
    }

    @NonNull
    public String getQueryOpenId() {
        return TextUtils.isEmpty(queryOpenId) ? targetOpenId : queryOpenId;
    }

    public int getScoreValue() {
        return parseInt(score, 66);
    }

    public int getRankStartValue() {
        return parseInt(rankStart, 1);
    }

    public int getRankEndValue() {
        return parseInt(rankEnd, 20);
    }

    public double getLonValue() {
        return parseDouble(lon, DEFAULT_LON);
    }

    public double getLatValue() {
        return parseDouble(lat, DEFAULT_LAT);
    }

    public int getRadiusValue() {
        return parseInt(radius, 1000);
    }

    public int getPageValue() {
        return parseInt(page, 1);
    }

    public int getPageSizeValue() {
        return parseInt(pageSize, 10);
    }

    @NonNull
    public String[] getLocationTypes() {
        String value = safeTrim(lbsType, "friend");
        if (!value.contains(",")) {
            return new String[]{value};
        }
        String[] items = value.split(",");
        for (int i = 0; i < items.length; i++) {
            items[i] = items[i].trim();
        }
        return items;
    }

    @NonNull
    private static String safeTrim(@NonNull String value, @NonNull String fallback) {
        String result = value.trim();
        return TextUtils.isEmpty(result) ? fallback : result;
    }

    private static int parseInt(@NonNull String value, int fallback) {
        try {
            return Integer.parseInt(value.trim());
        } catch (Exception ignore) {
            return fallback;
        }
    }

    private static double parseDouble(@NonNull String value, double fallback) {
        try {
            return Double.parseDouble(value.trim());
        } catch (Exception ignore) {
            return fallback;
        }
    }
}
