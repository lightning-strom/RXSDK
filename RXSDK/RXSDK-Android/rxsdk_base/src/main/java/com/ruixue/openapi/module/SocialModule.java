package com.ruixue.openapi.module;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXRequestCallback;

import java.util.Map;

/**
 * 社交功能模块
 *
 * <p>
 * 提供 LBS、关系、好友、排行榜等社交相关功能。
 * </p>
 *
 * <p>
 * 调用方式：{@code RXSDK.getInstance().social.接口名()}
 * </p>
 *
 * @author ROC LEE
 * @date 2026/1/19
 */
public class SocialModule {

    private final com.ruixue.openapi.RXSDK sdk;

    public SocialModule(com.ruixue.openapi.RXSDK sdk) {
        this.sdk = sdk;
    }

    /**
     * 上报/更新经纬度坐标
     *
     * @param types     类型数组
     * @param longitude 经度
     * @param latitude  纬度
     * @param callback  回调接口
     */
    public void lbsUpdate(@NonNull String[] types, float longitude, float latitude,
            @NonNull RXRequestCallback callback) {
        sdk.lbsUpdate(types, longitude, latitude, callback);
    }

    /**
     * 获取指定半径内的其他用户信息
     *
     * @param types     类型
     * @param longitude 经度
     * @param latitude  纬度
     * @param radius    半径
     * @param count     数量
     * @param page      页码
     * @param pageSize  每页大小
     * @param callback  回调接口
     */
    public void lbsRadius(@NonNull String types, float longitude, float latitude, float radius, int count, int page,
            int pageSize, @NonNull RXRequestCallback callback) {
        sdk.lbsRadius(types, longitude, latitude, radius, count, page, pageSize, callback);
    }

    /**
     * 删除经纬度坐标
     *
     * @param types    类型数组
     * @param callback 回调接口
     */
    public void lbsDelete(@NonNull String[] types, @NonNull RXRequestCallback callback) {
        sdk.lbsDelete(types, callback);
    }

    /**
     * 设置用户自定义信息
     *
     * @param custom   自定义信息
     * @param callback 回调接口
     */
    public void userSetCustom(@NonNull String custom, @NonNull RXRequestCallback callback) {
        sdk.userSetCustom(custom, callback);
    }

    /**
     * 添加自定义关系
     *
     * @param target        对方 OpenID
     * @param types         关系类型 Map
     * @param targetRemarks 用户给 Target 设置的备注信息
     * @param userRemarks   Target 给用户设置的备注信息
     * @param callback      回调接口
     */
    public void relationAdd(@NonNull String target, @NonNull Map<String, Object> types, @Nullable String targetRemarks,
            @Nullable String userRemarks, @NonNull RXRequestCallback callback) {
        sdk.relationAdd(target, types, targetRemarks, userRemarks, callback);
    }

    /**
     * 删除自定义关系
     *
     * @param target   对方 OpenID
     * @param types    关系类型 Map
     * @param callback 回调接口
     */
    public void relationDelete(@NonNull String target, @NonNull Map<String, Object> types,
            @NonNull RXRequestCallback callback) {
        sdk.relationDelete(target, types, callback);
    }

    /**
     * 更新自定义关系备注
     *
     * @param target        对方 OpenID
     * @param type          关系类型
     * @param targetRemarks 备注信息
     * @param callback      回调接口
     */
    public void updateRemarks(@NonNull String target, @NonNull String type, @Nullable String targetRemarks,
            @NonNull RXRequestCallback callback) {
        sdk.updateRemarks(target, type, targetRemarks, callback);
    }

    /**
     * 判断两用户是否存在某自定义关系
     *
     * @param target   对方 OpenID
     * @param type     关系类型
     * @param callback 回调接口
     */
    public void hasRelation(@NonNull String target, @NonNull String type, @NonNull RXRequestCallback callback) {
        sdk.hasRelation(target, type, callback);
    }

    /**
     * 获取自定义关系列表
     *
     * @param type     关系类型
     * @param callback 回调接口
     */
    public void relationList(@NonNull String type, @NonNull RXRequestCallback callback) {
        sdk.relationList(type, callback);
    }

    /**
     * 添加好友
     *
     * @param target        对方 OpenID
     * @param targetRemarks 用户给 Target 设置的备注信息
     * @param userRemarks   Target 给用户设置的备注信息
     * @param callback      回调接口
     */
    public void addFriends(@NonNull String target, @Nullable String targetRemarks, @Nullable String userRemarks,
            @NonNull RXRequestCallback callback) {
        sdk.addFriends(target, targetRemarks, userRemarks, callback);
    }

    /**
     * 删除好友
     *
     * @param target   对方 OpenID
     * @param callback 回调接口
     */
    public void removeFriends(@NonNull String target, @NonNull RXRequestCallback callback) {
        sdk.removeFriends(target, callback);
    }

    /**
     * 更新好友备注
     *
     * @param target        对方 OpenID
     * @param targetRemarks 备注信息
     * @param callback      回调接口
     */
    public void updateFriendRemarks(@NonNull String target, @Nullable String targetRemarks,
            @NonNull RXRequestCallback callback) {
        sdk.updateFriendRemarks(target, targetRemarks, callback);
    }

    /**
     * 判断两用户是否为好友
     *
     * @param target   对方 OpenID
     * @param callback 回调接口
     */
    public void isFriend(@NonNull String target, @NonNull RXRequestCallback callback) {
        sdk.isFriend(target, callback);
    }

    /**
     * 获取好友列表
     *
     * @param callback 回调接口
     */
    public void relationFriends(@NonNull RXRequestCallback callback) {
        sdk.relationFriends(callback);
    }

    /**
     * 增加用户分数
     *
     * @param rankId   榜单 ID
     * @param score    增加的分数值
     * @param callback 回调接口
     */
    public void addScore(@NonNull String rankId, int score, @NonNull RXRequestCallback callback) {
        sdk.addScore(rankId, score, callback);
    }

    /**
     * 设置用户分数
     *
     * @param rankId   榜单 ID
     * @param score    分数值
     * @param callback 回调接口
     */
    public void setScore(@NonNull String rankId, int score, @NonNull RXRequestCallback callback) {
        sdk.setScore(rankId, score, callback);
    }

    /**
     * 查询用户排名
     *
     * @param rankId   榜单 ID
     * @param openId   目标用户 OpenID
     * @param callback 回调接口
     */
    public void queryUserRank(@NonNull String rankId, @NonNull String openId, @NonNull RXRequestCallback callback) {
        sdk.queryUserRank(rankId, openId, callback);
    }

    /**
     * 获取排行榜列表
     *
     * @param rankId    榜单 ID
     * @param startRank 开始排名
     * @param endRank   结束排名
     * @param callback  回调接口
     */
    public void getRankList(@NonNull String rankId, int startRank, int endRank, @NonNull RXRequestCallback callback) {
        sdk.getRankList(rankId, startRank, endRank, callback);
    }

    /**
     * 获取好友排行榜列表
     *
     * @param rankId   榜单 ID
     * @param callback 回调接口
     */
    public void friendsRank(@NonNull String rankId, @NonNull RXRequestCallback callback) {
        sdk.friendsRank(rankId, callback);
    }
}
