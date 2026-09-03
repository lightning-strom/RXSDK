package com.ruixue.openapi;

import com.ruixue.RXJSONCallback;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/10/25
 */
public interface ISocialApi {
    /**
     * 上报/更新经纬度坐标
     *
     * @param hashMap  map 参数
     * @param callback 回调函数
     */
    void lbsUpdate(Map<String, Object> hashMap, RXJSONCallback callback);

    void lbsUpdate(String[] types, float lon, float lat, RXJSONCallback callback);

    /**
     * 获取指定半径内的其他用户信息
     *
     * @param hashMap  map 参数
     * @param callback 回调函数
     */
    void lbsRadius(Map<String, Object> hashMap, RXJSONCallback callback);

    void lbsRadius(String types, float lon, float lat, float radius, int count, int page, int page_size, RXJSONCallback callback);

    /**
     * 删除经纬度坐标
     *
     * @param hashMap  map 参数
     * @param callback 回调函数
     */
    void lbsDelete(Map<String, Object> hashMap, RXJSONCallback callback);

    void lbsDelete(String[] types, RXJSONCallback callback);

    /**
     * 给用户设置CP的自定义信息
     *
     * @param hashMap  map 参数
     * @param callback 回调函数
     */
    void userSetCustom(Map<String, Object> hashMap, RXJSONCallback callback);

    void userSetCustom(String custom, RXJSONCallback callback);

    /**
     * 添加自定关系
     *
     * @param hashMap  target	string	是	对方 OpenID
     *                 types	object	是	"CP 自定义关系类型列表，其值是一个 map 简直对列表，格式为：{类型标识符(string):是否为双向关系}"
     *                 target_remarks	string	否	用户给Target设置的备注信息（最长512字符）
     *                 user_remarks	string	否	Target给用户设置的备注信息（最长512字符）
     * @param callback 回调函数
     */
    void relationAdd(Map<String, Object> hashMap, RXJSONCallback callback);

    void relationAdd(String target, Map<String, Object> types, String target_remarks, String user_remarks, RXJSONCallback callback);


    /**
     * 删除自定关系
     *
     * @param hashMap  target	string	是	对方 OpenID
     *                 types	object	是	"CP 自定义关系类型列表，其值是一个 map 简直对列表，格式为：{类型标识符(string):是否为双向关系}"
     * @param callback 回调函数
     */
    void relationDelete(Map<String, Object> hashMap, RXJSONCallback callback);

    void relationDelete(String target, Map<String, Object> types, RXJSONCallback callback);

    /**
     * 更新自定关系备注
     *
     * @param hashMap target	string	是	对方 OpenID
     *                type	string	是	CP 自定义关系类型
     *                target_remarks	string	否	用户给Target设置的备注信息（最长512字符）
     */
    void updateRemarks(Map<String, Object> hashMap, RXJSONCallback callback);

    void updateRemarks(String target, String type, String target_remarks, RXJSONCallback callback);

    /**
     * 判断两用户是否存在某自定关系
     *
     * @param hashMap  target	string	是	对方 OpenID
     *                 type	string	是	CP 自定义关系类型
     * @param callback callback
     */
    void hasRelation(Map<String, Object> hashMap, RXJSONCallback callback);

    void hasRelation(String target, String type, RXJSONCallback callback);

    /**
     * 获取自定关系列表
     *
     * @param hashMap  map 参数
     * @param callback 回调函数
     */
    void relationList(Map<String, Object> hashMap, RXJSONCallback callback);

    void relationList(String type, RXJSONCallback callback);

    /**
     * 添加好友列表
     *
     * @param hashMap  map 参数
     * @param callback 回调函数
     */
    void addFriends(Map<String, Object> hashMap, RXJSONCallback callback);

    void addFriends(String target, String target_remarks, String user_remarks, RXJSONCallback callback);

    /**
     * 删除好友列表
     *
     * @param hashMap  map 参数
     * @param callback 回调函数
     */
    void removeFriends(Map<String, Object> hashMap, RXJSONCallback callback);

    void removeFriends(String target, RXJSONCallback callback);

    /**
     * 更新好友关系备注
     */
    void updateFriendRemarks(Map<String, Object> hashMap, RXJSONCallback callback);

    void updateFriendRemarks(String target, String target_remarks, RXJSONCallback callback);

    /**
     * 判断两用户是否为好友
     */
    void isFriend(Map<String, Object> hashMap, RXJSONCallback callback);

    void isFriend(String target, RXJSONCallback callback);

    /**
     * 获取好友列表
     *
     * @param hashMap  map 参数
     * @param callback 回调函数
     */
    void relationFriends(Map<String, Object> hashMap, RXJSONCallback callback);

    void relationFriends(RXJSONCallback callback);

    /** 增加用户分数
     * @param hashMap  rank_id	string	是	字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）	0_100_168_weekly
     *                 score	int	是	增加的分数值	100
     * @param callback callback
     */
    void addScore(Map<String, Object> hashMap, RXJSONCallback callback);

    /** 增加用户分数
     * @param rank_id  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）
     * @param score    增加的分数值
     * @param callback callback
     */
    void addScore(String rank_id, int score, RXJSONCallback callback);

    /** 设置用户分数
     * @param hashMap  rank_id	string	是	字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）	0_100_168_weekly
     *                 score	int	是	增加的分数值	100
     * @param callback callback
     */
    void setScore(Map<String, Object> hashMap, RXJSONCallback callback);

    /** 设置用户分数
     * @param rank_id  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）
     * @param score    增加的分数值
     * @param callback callback
     */
    void setScore(String rank_id, int score, RXJSONCallback callback);

    /** 查询用户分数
     * @param hashMap  rank_id	string	是	字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）	0_100_168_weekly
     *                 open_id	string	是	目标用户 OpenID	rxuSl4QZoNk0G1HY2-Za6GlO7wO-p_ej
     * @param callback callback
     */
    void queryUserRank(Map<String, Object> hashMap, RXJSONCallback callback);

    /** 查询用户分数
     * @param open_id  目标用户 OpenID
     * @param callback callback
     */
    void queryUserRank(String rank_id, String open_id, RXJSONCallback callback);

    /** 获取排行榜列表
     * @param hashMap  rank_id	string	是	字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）	0_100_168_weekly
     *                 start_rank	int	是	获取排行榜开始排名。取值[1,榜单容量)。可以用于分页加载	1
     *                 end_rank	int	是	获取排行榜结束排名。取值[1,榜单容量]。可以用于分页加载	2
     * @param callback callback
     */
    void getRankList(Map<String, Object> hashMap, RXJSONCallback callback);

    /** 获取排行榜列表
     * @param rank_id    字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）
     * @param start_rank 获取排行榜开始排名。取值[1,榜单容量)。可以用于分页加载	1
     * @param end_rank   获取排行榜结束排名。取值[1,榜单容量]。可以用于分页加载	2
     * @param callback   callback
     */
    void getRankList(String rank_id, int start_rank, int end_rank, RXJSONCallback callback);

    /** 获取好友排行榜列表
     * @param hashMap  rank_id	string	是	字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）	0_100_168_weekly
     * @param callback callback
     */
    void friendsRank(Map<String, Object> hashMap, RXJSONCallback callback);

    /** 获取好友排行榜列表
     * @param rank_id  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）
     * @param callback callback
     */
    void friendsRank(String rank_id, RXJSONCallback callback);
}
