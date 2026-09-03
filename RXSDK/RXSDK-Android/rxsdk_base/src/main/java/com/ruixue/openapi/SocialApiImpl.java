package com.ruixue.openapi;

import android.util.Pair;

import com.ruixue.RXJSONCallback;

import java.security.KeyPair;
import java.util.HashMap;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/10/25
 */
public class SocialApiImpl implements ISocialApi {

    private static class Single {
        static SocialApiImpl sInstance = new SocialApiImpl();
    }

    public static SocialApiImpl getInstance() {
        return Single.sInstance;
    }


    /**
     * 上报/更新经纬度坐标
     *
     * @param map      map 参数
     * @param callback 回调函数
     */
    @Override
    public void lbsUpdate(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.Social.lbsUpdate(map, callback);
    }

    @Override
    public void lbsUpdate(String[] types, float lon, float lat, RXJSONCallback callback) {
        Map<String, Object> map = new HashMap<>();
        map.put("types", types);
        map.put("lon", lon);
        map.put("lat", lat);
        lbsUpdate(map, callback);
    }

    /**
     * 获取指定半径内的其他用户信息
     *
     * @param map      map 参数
     * @param callback 回调函数
     */
    @Override
    public void lbsRadius(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.Social.lbsRadius(map, callback);
    }

    @Override
    public void lbsRadius(String types, float lon, float lat, float radius, int count, int page, int page_size, RXJSONCallback callback) {
        page = Math.max(page, 1);
        Map<String, Object> map = new HashMap<>();
        map.put("type", types);
        map.put("lon", lon);
        map.put("lat", lat);
        map.put("radius", radius);
        map.put("count", count);
        map.put("page", page);
        map.put("page_size", page_size);
        lbsRadius(map, callback);
    }

    /**
     * 给用户设置CP的自定义信息
     *
     * @param map      map 参数
     * @param callback 回调函数
     */
    @Override
    public void userSetCustom(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.Social.userSetCustom(map, callback);
    }

    @Override
    public void userSetCustom(String custom, RXJSONCallback callback) {
        Map<String, Object> map = new HashMap<>();
        map.put("custom", custom);
        userSetCustom(map, callback);
    }

    /**
     * 删除经纬度坐标
     *
     * @param map      map 参数
     * @param callback 回调函数
     */
    @Override
    public void lbsDelete(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.Social.lbsDelete(map, callback);
    }

    @Override
    public void lbsDelete(String[] types, RXJSONCallback callback) {
        Map<String, Object> map = new HashMap<>();
        map.put("types", types);
        lbsDelete(map, callback);
    }

    /**
     * 添加自定关系
     *
     * @param map      map 参数
     * @param callback 回调函数
     */
    @Override
    public void relationAdd(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.Social.relationAdd(map, callback);
    }

    @Override
    public void relationAdd(String target, Map<String, Object> types, String target_remarks, String user_remarks, RXJSONCallback callback) {
        Map<String, Object> map = new HashMap<>();
        map.put("target", target);
        map.put("types", types);
        map.put("target_remarks", target_remarks);
        map.put("user_remarks", user_remarks);
        relationAdd(map, callback);
    }

    /**
     * 删除自定关系
     *
     * @param map      map 参数
     * @param callback 回调函数
     */
    @Override
    public void relationDelete(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.Social.relationDelete(map, callback);
    }

    @Override
    public void relationDelete(String target, Map<String, Object> types, RXJSONCallback callback) {
        Map<String, Object> map = new HashMap<>();
        map.put("target", target);
        map.put("types", types);
        relationDelete(map, callback);
    }

    @Override
    public void updateRemarks(Map<String, Object> hashMap, RXJSONCallback callback) {
        RXApiHelper.Social.updateRemarks(hashMap, callback);
    }

    @Override
    public void updateRemarks(String target, String type, String target_remarks, RXJSONCallback callback) {
        Map<String, Object> map = new HashMap<>();
        map.put("target", target);
        map.put("type", type);
        map.put("target_remarks", target_remarks);
        updateRemarks(map, callback);
    }

    @Override
    public void hasRelation(Map<String, Object> hashMap, RXJSONCallback callback) {
        RXApiHelper.Social.hasRelation(hashMap, callback);
    }

    @Override
    public void hasRelation(String target, String type, RXJSONCallback callback) {
        Map<String, Object> map = new HashMap<>();
        map.put("target", target);
        map.put("type", type);
        hasRelation(map, callback);
    }

    /**
     * 获取自定关系列表
     *
     * @param map      map 参数
     * @param callback 回调函数
     */
    @Override
    public void relationList(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.Social.relationList(map, callback);
    }

    @Override
    public void relationList(String type, RXJSONCallback callback) {
        Map<String, Object> map = new HashMap<>();
        map.put("type", type);
        relationList(map, callback);
    }

    /**
     * 添加好友列表
     *
     * @param map      map 参数
     * @param callback 回调函数
     */
    @Override
    public void addFriends(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.Social.addFriends(map, callback);
    }

    @Override
    public void addFriends(String target, String target_remarks, String user_remarks, RXJSONCallback callback) {
        Map<String, Object> map = new HashMap<>();
        map.put("target", target);
        map.put("target_remarks", target_remarks);
        map.put("user_remarks", user_remarks);
        addFriends(map, callback);
    }

    /**
     * 删除好友列表
     *
     * @param map      map 参数
     * @param callback 回调函数
     */
    @Override
    public void removeFriends(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.Social.removeFriends(map, callback);
    }

    @Override
    public void removeFriends(String target, RXJSONCallback callback) {
        Map<String, Object> map = new HashMap<>();
        map.put("target", target);
        removeFriends(map, callback);
    }

    @Override
    public void updateFriendRemarks(Map<String, Object> hashMap, RXJSONCallback callback) {
        RXApiHelper.Social.updateFriendRemarks(hashMap, callback);
    }

    @Override
    public void updateFriendRemarks(String target, String target_remarks, RXJSONCallback callback) {
        Map<String, Object> map = new HashMap<>();
        map.put("target", target);
        map.put("target_remarks", target_remarks);
        updateFriendRemarks(map, callback);
    }

    @Override
    public void isFriend(Map<String, Object> hashMap, RXJSONCallback callback) {
        RXApiHelper.Social.isFriend(hashMap, callback);
    }

    @Override
    public void isFriend(String target, RXJSONCallback callback) {
        Map<String, Object> map = new HashMap<>();
        map.put("target", target);
        isFriend(map, callback);
    }

    /**
     * 获取好友列表
     *
     * @param map      map 参数
     * @param callback 回调函数
     */
    @Override
    public void relationFriends(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.Social.relationFriends(map, callback);
    }

    @Override
    public void relationFriends(RXJSONCallback callback) {
        Map<String, Object> map = new HashMap<>();
        relationFriends(map, callback);
    }

    @Override
    public void addScore(Map<String, Object> hashMap, RXJSONCallback callback) {
        RXApiHelper.Social.addScore(hashMap, callback);
    }

    @Override
    public void addScore(String rank_id, int score, RXJSONCallback callback) {
        Map<String, Object> map = new HashMap<>();
        map.put("rank_id", rank_id);
        map.put("score", score);
        addScore(map, callback);
    }

    @Override
    public void setScore(Map<String, Object> hashMap, RXJSONCallback callback) {
        RXApiHelper.Social.setScore(hashMap, callback);
    }

    @Override
    public void setScore(String rank_id, int score, RXJSONCallback callback) {
        Map<String, Object> map = new HashMap<>();
        map.put("rank_id", rank_id);
        map.put("score", score);
        setScore(map, callback);
    }

    @Override
    public void queryUserRank(Map<String, Object> hashMap, RXJSONCallback callback) {
        RXApiHelper.Social.queryUserRank(hashMap, callback);
    }

    @Override
    public void queryUserRank(String rank_id, String open_id, RXJSONCallback callback) {
        Map<String, Object> map = new HashMap<>();
        map.put("rank_id", rank_id);
        map.put("open_id", open_id);
        queryUserRank(map, callback);
    }

    @Override
    public void getRankList(Map<String, Object> hashMap, RXJSONCallback callback) {
        RXApiHelper.Social.getRankList(hashMap, callback);
    }

    @Override
    public void getRankList(String rank_id, int start_rank, int end_rank, RXJSONCallback callback) {
        Map<String, Object> map = new HashMap<>();
        map.put("rank_id", rank_id);
        map.put("start_rank", start_rank);
        map.put("end_rank", end_rank);
        getRankList(map, callback);
    }

    @Override
    public void friendsRank(Map<String, Object> hashMap, RXJSONCallback callback) {
        RXApiHelper.Social.friendsRank(hashMap, callback);
    }

    @Override
    public void friendsRank(String rank_id, RXJSONCallback callback) {
        Map<String, Object> map = new HashMap<>();
        map.put("rank_id", rank_id);
        friendsRank(map, callback);
    }
}
