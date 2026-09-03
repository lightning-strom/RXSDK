# RXSDK-Android Public 类方法列表

> **版本**: 3.7.36  
> **更新日期**: 2026-01-26（已同步最新源码）

---

## RXSDK（统一入口类）

统一 SDK 入口类，封装所有 Public 服务方法，对外暴露的主要接口。

```java
// ==================== 回调类型定义 ====================

public interface RXRequestCallback {
    void onResponse(JSONObject jsonObject);
    void onError(RXException e);
}

// ==================== 单例 ====================

/// 获取 SDK 实例（单例）
+ RXSDK getInstance()

/// 获取底层 API 对象
+ RXSdkApi getApi()

// ==================== SDK 基础功能 ====================

/// 获取 SDK 信息
- SdkInfo getSdkInfo()

/// 获取渠道信息
- String getChannel()

/// 设置防沉迷代理
/// @param antiAddictDelegate 防沉迷代理
- void setupAddictDelegate(AntiAddictDelegate antiAddictDelegate)

/// 跳转到应用商店
/// @param activity Activity
- boolean jumpToAppStore(Activity activity)

/// 同意隐私政策
/// @param context Context
/// @param privacyCallback 隐私回调
- void setPrivacyAgree(Context context, PrivacyCallback privacyCallback)

/// 同意隐私政策
/// @param context Context
/// @param isAgree 是否同意
/// @param privacyCallback 隐私回调
- void setPrivacyAgree(Context context, boolean isAgree, PrivacyCallback privacyCallback)

/// 是否已同意隐私政策
- boolean isAgreedPrivacy()

/// 创建自定义接口请求
/// @param api 接口路径
/// @param bodyMap 接口参数
- IRXRequest createRequest(String api, Map<String, Object> bodyMap)

/// 设置瑞雪 SDK 回调
/// @param callback 回调接口
- void setRuiXueSdkCallback(RuiXueSdkCallback callback)

/// 设置子渠道 ID
/// @param subChannelId 子渠道 ID
- void setSubChannelId(String subChannelId)

/// 退出应用
/// @param activity Activity
/// @param callback 退出回调
- boolean exitApp(Activity activity, OnAppExitCallback callback)

// ==================== 登录 ====================

/// 用户登录
/// @param activity Activity（可选）
/// @param params 登录参数
/// @param callback 回调接口
///
/// @example 游客登录
/// LoginParams params = new LoginParams();
/// params.setMethod("guest");
/// RXSDK.getInstance().login(activity, params, callback);
///
/// @example 账号密码登录
/// LoginParams params = new LoginParams();
/// params.setMethod("account");
/// params.setUsername("user");
/// params.setPassword("password");
/// RXSDK.getInstance().login(activity, params, callback);
///
/// @example 验证码登录
/// LoginParams params = new LoginParams();
/// params.setMethod("captcha");
/// params.setUsername("13800138000");
/// params.setCaptchaCode("123456");
/// RXSDK.getInstance().login(activity, params, callback);
- void login(Activity activity, LoginParams params, RXRequestCallback callback)

/// 用户登录（简化版本）
/// @param params 登录参数
/// @param callback 回调接口
- void login(LoginParams params, RXRequestCallback callback)

/// 用户登录（Map 参数版本）
/// @param activity Activity
/// @param map 登录参数 Map
/// @param callback 回调接口
- void login(Activity activity, Map<String, Object> map, RXRequestCallback callback)

/// 用户注册
/// @param params 注册参数
/// @param callback 回调接口
- void register(RegisterParams params, RXRequestCallback callback)

/// 用户登出
/// @param callback 登出回调
- void logout(OnLogoutCallback callback)

// ==================== 验证码 ====================

/// 发送验证码
/// @param type 验证码类型（手机或邮箱）
/// @param target 手机号或邮箱
/// @param purpose 用途：register/bindphone/unbindphone/resetpwd/changepwd/bindemail/unbindemail/login
/// @param callback 回调接口
- boolean sendCaptcha(CaptchaType type, String target, String purpose, RXRequestCallback callback)

/// 验证验证码
/// @param type 验证码类型（手机或邮箱）
/// @param target 手机号或邮箱
/// @param purpose 用途
/// @param captchaCode 验证码
/// @param callback 回调接口
- boolean verifyCaptcha(CaptchaType type, String target, String purpose, String captchaCode, RXRequestCallback callback)

// ==================== 账号绑定 ====================

/// 绑定邮箱
/// @param email 邮箱
/// @param password 密码
/// @param captchaCode 验证码
/// @param migrateArgs 账号迁移参数（可选）
/// @param callback 回调接口
- void bindEmail(String email, String password, String captchaCode, Object migrateArgs, RXRequestCallback callback)

/// 解绑邮箱
/// @param email 邮箱
/// @param captchaCode 验证码
/// @param callback 回调接口
- void unBindEmail(String email, String captchaCode, RXRequestCallback callback)

/// 修改邮箱
/// @param newEmail 新邮箱
/// @param newEmailCaptcha 新邮箱验证码
/// @param oldEmailCaptcha 旧邮箱验证码
/// @param migrateArgs 账号迁移参数（可选）
/// @param callback 回调接口
- void changeEmail(String newEmail, String newEmailCaptcha, String oldEmailCaptcha, Object migrateArgs, RXRequestCallback callback)

/// 绑定手机
/// @param phone 手机号
/// @param password 密码
/// @param captchaCode 验证码
/// @param migrateArgs 账号迁移参数（可选）
/// @param callback 回调接口
- void bindPhone(String phone, String password, String captchaCode, Object migrateArgs, RXRequestCallback callback)

/// 解绑手机
/// @param phone 手机号
/// @param captchaCode 验证码
/// @param callback 回调接口
- void unBindPhone(String phone, String captchaCode, RXRequestCallback callback)

/// 修改手机号
/// @param newPhone 新手机号
/// @param newPhoneCaptcha 新手机号验证码
/// @param oldPhoneCaptcha 旧手机号验证码
/// @param migrateArgs 账号迁移参数（可选）
/// @param callback 回调接口
- void changePhone(String newPhone, String newPhoneCaptcha, String oldPhoneCaptcha, Object migrateArgs, RXRequestCallback callback)

// ==================== 用户信息 ====================

/// 获取用户信息
/// @param callback 回调接口
- void getUserInfo(RXRequestCallback callback)

/// 获取指定用户信息
/// @param params 请求参数 map
/// @param callback 回调接口
- void getUserInfoByField(Map<String, Object> params, RXRequestCallback callback)

/// 更新用户信息
/// @param params 用户信息参数
/// @param callback 回调接口
- void updateUserInfo(UserInfoParams params, RXRequestCallback callback)

// ==================== 密码 ====================

/// 修改密码
/// @param oldPassword 旧密码
/// @param newPassword 新密码
/// @param callback 回调接口
- void changePassword(String oldPassword, String newPassword, RXRequestCallback callback)

/// 重置密码
/// @param username 手机号
/// @param password 新密码
/// @param captchaCode 验证码
/// @param migrateArgs 账号迁移参数（可选）
/// @param callback 回调接口
- void resetPassword(String username, String password, String captchaCode, Object migrateArgs, RXRequestCallback callback)

// ==================== 实名认证 ====================

/// 实名认证
/// @param realname 姓名
/// @param idcard 身份证号
/// @param callback 回调接口
- void realAuth(String realname, String idcard, RXRequestCallback callback)

/// 实名认证（快速认证）
/// @param realname 姓名
/// @param idcard 身份证号
/// @param isFastRealAuth 是否使用快速认证
/// @param callback 回调接口
- void realAuth(String realname, String idcard, boolean isFastRealAuth, RXRequestCallback callback)

// ==================== 账号管理 ====================

/// 查询账号
/// @param method 登录方式
/// @param devicecode 设备码
/// @param states 账号的位标记
/// @param callback 回调接口
- void searchHasAccounts(String method, String devicecode, int states, RXRequestCallback callback)

/// 查询绑定账号列表
/// @param callback 回调接口
- void searchBindingAccounts(RXRequestCallback callback)

/// 申请注销账号
/// @param deregisterConfig 注销配置
/// @param callback 回调接口
- void deregister(RXDeregisterConfig deregisterConfig, RXRequestCallback callback)

/// 撤销注销申请
/// @param callback 回调接口
- void deregisterCancel(RXRequestCallback callback)

// ==================== 社交（LBS） ====================

/// 上报/更新经纬度坐标
/// @param types 类型数组
/// @param longitude 经度
/// @param latitude 纬度
/// @param callback 回调接口
- void lbsUpdate(String[] types, float longitude, float latitude, RXRequestCallback callback)

/// 获取指定半径内的其他用户信息
/// @param types 类型
/// @param longitude 经度
/// @param latitude 纬度
/// @param radius 半径
/// @param count 数量
/// @param page 页码
/// @param pageSize 每页大小
/// @param callback 回调接口
- void lbsRadius(String types, float longitude, float latitude, float radius, int count, int page, int pageSize, RXRequestCallback callback)

/// 删除经纬度坐标
/// @param types 类型数组
/// @param callback 回调接口
- void lbsDelete(String[] types, RXRequestCallback callback)

// ==================== 社交（自定义关系） ====================

/// 设置用户自定义信息
/// @param custom 自定义信息
/// @param callback 回调接口
- void userSetCustom(String custom, RXRequestCallback callback)

/// 添加自定义关系
/// @param target 对方 OpenID
/// @param types 关系类型 Map
/// @param targetRemarks 用户给 Target 设置的备注信息
/// @param userRemarks Target 给用户设置的备注信息
/// @param callback 回调接口
- void relationAdd(String target, Map<String, Object> types, String targetRemarks, String userRemarks, RXRequestCallback callback)

/// 删除自定义关系
/// @param target 对方 OpenID
/// @param types 关系类型 Map
/// @param callback 回调接口
- void relationDelete(String target, Map<String, Object> types, RXRequestCallback callback)

/// 更新自定义关系备注
/// @param target 对方 OpenID
/// @param type 关系类型
/// @param targetRemarks 备注信息
/// @param callback 回调接口
- void updateRemarks(String target, String type, String targetRemarks, RXRequestCallback callback)

/// 判断两用户是否存在某自定义关系
/// @param target 对方 OpenID
/// @param type 关系类型
/// @param callback 回调接口
- void hasRelation(String target, String type, RXRequestCallback callback)

/// 获取自定义关系列表
/// @param type 关系类型
/// @param callback 回调接口
- void relationList(String type, RXRequestCallback callback)

// ==================== 社交（好友） ====================

/// 添加好友
/// @param target 对方 OpenID
/// @param targetRemarks 用户给 Target 设置的备注信息
/// @param userRemarks Target 给用户设置的备注信息
/// @param callback 回调接口
- void addFriends(String target, String targetRemarks, String userRemarks, RXRequestCallback callback)

/// 删除好友
/// @param target 对方 OpenID
/// @param callback 回调接口
- void removeFriends(String target, RXRequestCallback callback)

/// 更新好友备注
/// @param target 对方 OpenID
/// @param targetRemarks 备注信息
/// @param callback 回调接口
- void updateFriendRemarks(String target, String targetRemarks, RXRequestCallback callback)

/// 判断两用户是否为好友
/// @param target 对方 OpenID
/// @param callback 回调接口
- void isFriend(String target, RXRequestCallback callback)

/// 获取好友列表
/// @param callback 回调接口
- void relationFriends(RXRequestCallback callback)

// ==================== 社交（排行榜） ====================

/// 增加用户分数
/// @param rankId 榜单 ID
/// @param score 增加的分数值
/// @param callback 回调接口
- void addScore(String rankId, int score, RXRequestCallback callback)

/// 设置用户分数
/// @param rankId 榜单 ID
/// @param score 分数值
/// @param callback 回调接口
- void setScore(String rankId, int score, RXRequestCallback callback)

/// 查询用户排名
/// @param rankId 榜单 ID
/// @param openId 目标用户 OpenID
/// @param callback 回调接口
- void queryUserRank(String rankId, String openId, RXRequestCallback callback)

/// 获取排行榜列表
/// @param rankId 榜单 ID
/// @param startRank 开始排名
/// @param endRank 结束排名
/// @param callback 回调接口
- void getRankList(String rankId, int startRank, int endRank, RXRequestCallback callback)

/// 获取好友排行榜列表
/// @param rankId 榜单 ID
/// @param callback 回调接口
- void friendsRank(String rankId, RXRequestCallback callback)

// ==================== 游戏区服 ====================

/// 查询游戏区服信息
/// @param areaId 区服 ID
/// @param callback 回调接口
- void searchGameAreaInfo(String areaId, RXRequestCallback callback)

/// 查询区服列表信息
/// @param callback 回调接口
- void searchGameAreaListInfo(RXRequestCallback callback)

/// 修改游戏区服信息
/// @param areaId 区服 ID
/// @param areaName 区服名称
/// @param areaStatus 区服状态
/// @param areaType 区服类型
/// @param extension 扩展字段
/// @param callback 回调接口
- void updateGameAreaInfo(String areaId, String areaName, String areaStatus, String areaType, Map<String, Object> extension, RXRequestCallback callback)

/// 创建游戏区服
/// @param areaId 区服 ID
/// @param areaName 区服名称
/// @param areaStatus 区服状态
/// @param areaType 区服类型
/// @param extension 扩展字段
/// @param callback 回调接口
- void createGameArea(String areaId, String areaName, String areaStatus, String areaType, Map<String, Object> extension, RXRequestCallback callback)

/// 删除游戏区服
/// @param areaId 区服 ID
/// @param callback 回调接口
- void deleteGameArea(String areaId, RXRequestCallback callback)

// ==================== 游戏角色 ====================

/// 创建游戏角色
/// @param areaId 区服 ID
/// @param characterName 角色名称
/// @param characterLevel 角色等级
/// @param characterFaction 角色阵营
/// @param characterProfession 角色职业
/// @param characterStatus 角色状态
/// @param characterType 角色类型
/// @param characterVipLevel 角色 VIP 等级
/// @param cpUserId CP 用户 ID
/// @param extension 扩展字段
/// @param callback 回调接口
- void createGameCharacter(String areaId, String characterName, String characterLevel, String characterFaction, String characterProfession, String characterStatus, String characterType, String characterVipLevel, String cpUserId, Map<String, Object> extension, RXRequestCallback callback)

/// 更新游戏角色信息
/// @param characterId 角色 ID
/// @param areaId 区服 ID
/// @param characterFaction 角色阵营
/// @param characterLevel 角色等级
/// @param characterName 角色名称
/// @param characterProfession 角色职业
/// @param characterStatus 角色状态
/// @param characterType 角色类型
/// @param characterVipLevel 角色 VIP 等级
/// @param cpUserId CP 用户 ID
/// @param extension 扩展字段
/// @param callback 回调接口
- void updateGameCharacterInfo(String characterId, String areaId, String characterFaction, String characterLevel, String characterName, String characterProfession, String characterStatus, String characterType, String characterVipLevel, String cpUserId, Map<String, Object> extension, RXRequestCallback callback)

/// 删除游戏角色
/// @param areaId 区服 ID
/// @param characterId 角色 ID
/// @param cpUserId CP 用户 ID
/// @param callback 回调接口
- void deleteGameCharacter(String areaId, String characterId, String cpUserId, RXRequestCallback callback)

/// 查询账号下角色信息列表
/// @param cpUserId CP 用户 ID
/// @param callback 回调接口
- void searchGameCharacterListInfo(String cpUserId, RXRequestCallback callback)

/// 查询账号下某个区服下的角色信息列表
/// @param cpUserId CP 用户 ID
/// @param areaId 区服 ID
/// @param callback 回调接口
- void searchGameCharacterListInArea(String cpUserId, String areaId, RXRequestCallback callback)

/// 查询具体角色信息
/// @param cpUserId CP 用户 ID
/// @param areaId 区服 ID
/// @param characterId 角色 ID
/// @param callback 回调接口
- void searchGameCharacterInfo(String cpUserId, String areaId, String characterId, RXRequestCallback callback)

/// 设置游戏信息
/// @param roleId 角色 ID
/// @param regionTag 地区标签
- void setGameInfo(String roleId, String regionTag)

/// 设置游戏信息
/// @param gameInfo 游戏信息
- void setGameInfo(GameInfo gameInfo)

/// 查询角色信息
/// @param callback 回调接口
- void searchGameAccount(RXRequestCallback callback)

/// 更新游戏版本
/// @param body 请求体
/// @param callback 回调接口
- void updateGameVersion(Map<String, Object> body, RXRequestCallback callback)

// ==================== 支付 ====================

/// 支付
/// @param activity Activity
/// @param payParams 支付参数
/// @param callback 回调接口
- void pay(Activity activity, HQParams payParams, RXRequestCallback callback)

/// 支付（Map 参数版本）
/// @param activity Activity
/// @param hashMap 支付参数 Map
/// @param callback 回调接口
- void pay(Activity activity, Map<String, Object> hashMap, RXRequestCallback callback)

// ==================== 分享 ====================

/// 分享
/// @param activity Activity
/// @param shareConfig 分享配置
/// @param callback 回调接口
- void share(Activity activity, RXShareConfig shareConfig, RXRequestCallback callback)

/// 分享（自定义配置）
/// @param activity Activity
/// @param config 分享配置
/// @param callback 回调接口
- void shareCustom(Activity activity, RXCustomShareConfig config, RXRequestCallback callback)

/// 获取分享信息
/// @param shareConfig 分享配置
/// @param callback 回调接口
- void getShareInfo(RXShareConfig shareConfig, RXRequestCallback callback)

/// 获取分享埋点数据
/// @param hashMap 参数 Map
/// @param callback 回调接口
- void getShareData(Map<String, Object> hashMap, RXRequestCallback callback)

/// 获取分享埋点数据（带回调类型）
/// @param map 参数 Map
/// @param callback 回调接口
- void getShareData(Map<String, Object> map, RXCallback<ShareDataResult> callback)

/// 分享上报
/// @param distinctId 用户唯一标识
/// @param properties 属性
- void shareReport(String distinctId, Map<String, Object> properties)

/// 分享上报
/// @param shareDataResult 分享数据结果
- void shareReport(ShareDataResult shareDataResult)

/// 分享调度初始化
/// @param funcs 功能数组
/// @param callback 回调接口
- void shareSchedulingInit(String[] funcs, RXRequestCallback callback)

/// 获取分享调度
/// @param func 功能
- Map<String, Object> getShareScheduling(String... func)

/// 分享调度上报
/// @param func 功能
/// @param platform 平台
/// @param region 地区
/// @param schedulingEvent 调度事件
/// @param schedulingType 调度类型
/// @param transmits 透传参数
/// @param properties 属性
/// @param callback 回调接口
- void shareSchedulingReport(String func, String platform, String region, boolean schedulingEvent, String schedulingType, String transmits, Map<String, Object> properties, RXRequestCallback callback)

/// 获取短链接
/// @param url 原始 URL
/// @param callback 回调接口
- void getShortUrl(String url, RXRequestCallback callback)

// ==================== 版本更新 ====================

/// 更新应用
/// @param version 客户端版本号
/// @param region 地区码
/// @param queryMap 查询参数
/// @param callback 回调接口
- void updateApp(String version, String region, Map<String, Object> queryMap, RXStringCallback callback)

/// 检查应用更新
/// @param version 客户端版本号
/// @param region 地区码
/// @param type 脚本类型
/// @param queryMap 查询参数
/// @param callback 回调接口
- void checkUpdateApp(String version, String region, String type, Map<String, Object> queryMap, RXStringCallback callback)

/// 活动版本检查
/// @param activityShortname 活动别名
/// @param activityVersion 客户端版本号
/// @param activityCheckVersion 优先检查这个版本
/// @param queryMap 查询参数
/// @param callback 回调接口
- void updateActivity(String activityShortname, String activityVersion, String activityCheckVersion, Map<String, Object> queryMap, RXStringCallback callback)

/// 游戏版本检查
/// @param gameId 游戏 ID
/// @param gameVersion 客户端版本号
/// @param gameCheckVersion 优先检查这个版本
/// @param queryMap 查询参数
/// @param callback 回调接口
- void updateGame(String gameId, String gameVersion, String gameCheckVersion, Map<String, Object> queryMap, RXStringCallback callback)

// ==================== 反馈 ====================

/// 获取反馈类型列表
/// @param callback 回调接口
- void getFeedbackKindList(RXRequestCallback callback)

/// 创建反馈
/// @param map 反馈参数
/// @param callback 回调接口
- void createFeedback(Map<String, Object> map, RXRequestCallback callback)

/// 满意度评价
/// @param map 评价参数
/// @param callback 回调接口
- void satisfactionEvaluation(Map<String, Object> map, RXRequestCallback callback)

// ==================== 福利码 ====================

/// 获取达人游戏内显示福利码
/// @param authRefresh 是否自动刷新
/// @param callback 回调接口
- void getPromoDisplayKEY(boolean authRefresh, RXRequestCallback callback)

/// 兑换达人福利码
/// @param cdKey 福利码
/// @param callback 回调接口
- void exchangePromoCDKEY(String cdKey, RXRequestCallback callback)

// ==================== 埋点 ====================

/// 埋点数据上报
/// @param eventName 埋点标识事件
/// @param distinctId 用户唯一标识
/// @param properties 自定义属性
- boolean dataTrack(String eventName, String distinctId, Map<String, Object> properties)

/// 埋点数据上报（带缓存配置）
/// @param eventName 埋点标识事件
/// @param distinctId 用户唯一标识
/// @param properties 自定义属性
/// @param flushInterval 上报时间间隔
/// @param maxCacheCount 最大缓存条数
- boolean dataTrack(String eventName, String distinctId, Map<String, Object> properties, int flushInterval, int maxCacheCount)

/// 上报窗口曝光
/// @param properties 属性
- void reportWindowExposure(Map<String, Object> properties)

/// 上报用户行为
/// @param distinctId 用户唯一标识
/// @param properties 属性
- void trackUserAction(String distinctId, Map<String, Object> properties)

/// 停止用户行为上报
- void stopTrackUserAction()

// ==================== 商业化 ====================

/// 获取运营场景
/// @param callback 回调接口
- void getOperationScene(RXRequestCallback callback)

// ==================== 法务 ====================

/// 法务接口
/// @param hashMap 参数
/// @param callback 回调接口
- void legal(Map<String, Object> hashMap, RXRequestCallback callback)

/// 法务接口
/// @param callback 回调接口
- void legal(RXRequestCallback callback)

/// 法务条款接口
/// @param hashMap 参数
/// @param callback 回调接口
- void legalTerms(Map<String, Object> hashMap, RXRequestCallback callback)

/// 法务条款接口
/// @param keys 条款 key
/// @param callback 回调接口
- void legalTerms(String keys, RXRequestCallback callback)

// ==================== 客服 ====================

/// 获取客服未读消息数量
/// @param callback 回调接口
- void getServiceChatUnreadCount(RXRequestCallback callback)

/// 清空客服未读消息数量
/// @param callback 回调接口
- void clearServiceChatUnreadCount(RXRequestCallback callback)

// ==================== 插件管理 ====================

/// 初始化第三方 SDK
/// @param activity Activity
/// @param hashMap 参数
/// @param callback 回调接口
- void initThirdSdk(Activity activity, Map<String, Object> hashMap, RXRequestCallback callback)

/// 检查快捷应用
/// @param callback 回调接口
- void checkQuickAp(RXRequestCallback callback)

// ==================== 公告/邮件（与 iOS 对齐） ====================

/// 获取公告列表
/// @param limit 获取条数，范围 1-100
/// @param callback 回调接口
- void getAnnouncement(int limit, RXRequestCallback callback)

/// 获取临时公告
/// @param callback 回调接口
- void getTempNotice(RXRequestCallback callback)

/// 获取邮件列表
/// @param cpUserId CP 用户 ID
/// @param callback 回调接口
- void getEmailList(String cpUserId, RXRequestCallback callback)

/// 获取邮件详情
/// @param cpUserId CP 用户 ID
/// @param emailId 邮件 ID
/// @param callback 回调接口
- void getEmailDetail(String cpUserId, int emailId, RXRequestCallback callback)

/// 领取邮件道具
/// @param cpUserId CP 用户 ID
/// @param type 1 为领取当前礼物，2 为一键领取所有礼物
/// @param emailId 邮件 ID
/// @param callback 回调接口
- void getEmailAward(String cpUserId, int type, int emailId, RXRequestCallback callback)

/// 删除邮件
/// @param cpUserId CP 用户 ID
/// @param type 1 为删除当前邮件，2 为一键删除所有邮件
/// @param emailId 邮件 ID
/// @param callback 回调接口
- void deleteEmail(String cpUserId, int type, int emailId, RXRequestCallback callback)

// ==================== 反馈（详细版，与 iOS 对齐） ====================

/// 创建意见反馈（详细版）
/// @param content 反馈内容
/// @param attachments 附件地址数组
/// @param phone 手机号
/// @param tags 游戏透传标识
/// @param callback 回调接口
- void feedbackCreate(String content, String[] attachments, String phone, String[] tags, RXRequestCallback callback)

/// 获取反馈列表
/// @param page 页数，从 1 开始
/// @param size 每页大小
/// @param status 状态：1 未处理，2 已处理，0 获取所有状态
/// @param callback 回调接口
- void getFeedbackList(int page, int size, int status, RXRequestCallback callback)

/// 获取反馈详情
/// @param feedbackId 反馈 ID
/// @param callback 回调接口
- void getFeedbackDetail(int feedbackId, RXRequestCallback callback)

/// 领取反馈回复中的道具
/// @param feedbackId 反馈 ID
/// @param callback 回调接口
- void feedbackGetprop(int feedbackId, RXRequestCallback callback)

// ==================== 分享（补充，与 iOS 对齐） ====================

/// 获取分享通路配置
/// @param callback 回调接口
- void getSharePlatforms(RXRequestCallback callback)

/// 获取短链接（带 OG 标签）
/// @param url 要生成短链接的 url
/// @param title 标题
/// @param content 描述
/// @param image 图片地址
/// @param ext 透传参数
/// @param callback 回调接口
- void getShortUrl(String url, String title, String content, String image, Map<String, Object> ext, RXRequestCallback callback)

// ==================== 支付（补充，与 iOS 对齐） ====================

/// 查询订单状态
/// @param orderNo 订单号
/// @param callback 回调接口
- void tradeQuery(String orderNo, RXRequestCallback callback)

// ==================== 登录状态（与 iOS 对齐） ====================

/// 判断用户是否已登录
/// @return true 已登录，false 未登录
- boolean isLogin()

/// 获取当前登录数据
/// @return 登录数据
- LoginData getLoginData()

/// login_openid 是否失效
/// @return true 失效，false 有效
- boolean loginOpenidExpireInvalid()

// ==================== 配置类（与 iOS 对齐） ====================

/// 设置当前语言
/// @param language 语言码，如 en、zh-Hans 等
- void setLanguage(String language)

/// 获取当前 BaseUrl
/// @return baseUrl
- String getFirstBaseUrl()

/// 获取 OpenID
/// @return OpenID
- String getOpenId()

/// 获取设备码
/// @return 设备码
- String getDeviceCode()

/// 获取当前时区与 UTC 时差
/// @return 时区偏移
- String getTimeZoneOffset()

/// 获取当前系统语言
/// @return 系统语言
- String getSystemLanguage()

// ==================== 广告归因 ====================

/// 媒体平台自定义行为上报
/// @param params 上报数据
/// @param callback 回调接口
- void addAttribution(Map<String, Object> params, RXRequestCallback callback)

// ==================== 生命周期接口 ====================

/// 自动跟踪 Activity 生命周期
/// 继承自 LifecycleOwner 的 Activity（如 AppCompatActivity）可使用此方式
/// @param lifecycleOwner 生命周期拥有者（通常为 Activity）
+ void trackingLifecycle(LifecycleOwner lifecycleOwner)

/// Application attachBaseContext 回调
/// @param context Context
+ void attachBaseContext(Context context)

/// Application onCreate 回调
/// @param application Application 实例
+ void onApplicationCreate(Application application)

/// Activity onCreate 回调
/// @param activity Activity 实例
+ void onCreate(Activity activity)

/// Activity onCreate 回调（带 savedInstanceState）
/// @param activity Activity 实例
/// @param savedInstanceState 保存的状态
+ void onCreate(Activity activity, Bundle savedInstanceState)

/// Activity onStart 回调
/// @param activity Activity 实例
+ void onStart(Activity activity)

/// Activity onRestart 回调
/// @param activity Activity 实例
+ void onRestart(Activity activity)

/// Activity onResume 回调
/// @param activity Activity 实例
+ void onResume(Activity activity)

/// Activity onPause 回调
/// @param activity Activity 实例
+ void onPause(Activity activity)

/// Activity onStop 回调
/// @param activity Activity 实例
+ void onStop(Activity activity)

/// Activity onDestroy 回调
/// @param activity Activity 实例
+ void onDestroy(Activity activity)

/// Activity onNewIntent 回调
/// @param activity Activity 实例
/// @param intent 新的 Intent
+ void onNewIntent(Activity activity, Intent intent)

/// Activity onActivityResult 回调
/// @param activity Activity 实例
/// @param requestCode 请求码
/// @param resultCode 结果码
/// @param data 返回的数据
+ void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data)

/// Activity onRequestPermissionsResult 回调
/// @param activity Activity 实例
/// @param requestCode 请求码
/// @param permissions 权限数组
/// @param grantResults 授权结果数组
+ void onRequestPermissionsResult(Activity activity, int requestCode, String[] permissions, int[] grantResults)

/// Activity onConfigurationChanged 回调
/// @param activity Activity 实例
/// @param newConfig 新的配置
+ void onConfigurationChanged(Activity activity, Configuration newConfig)

/// Activity onBackPressed 回调
+ void onBackPressed()

/// Activity onWindowFocusChanged 回调
/// @param hasFocus 是否获得焦点
+ void onWindowFocusChanged(boolean hasFocus)
```

---

## RXSdkApi（底层 API 服务）

底层 API 服务类，提供核心 API 实现（建议通过 RXSDK 调用）。

```java
/// 获取 SDK 实例（单例）
+ RXSdkApi getInstance()

// MARK: - 初始化

/// 初始化 SDK
/// @param context Context
/// @param config 初始化配置
/// @param callback 回调接口
- void init(Context context, RXSdkInitConfig config, RXJSONCallback callback)

/// 初始化 SDK（profile 版本）
/// @param context Context
/// @param profile 初始化配置 JSON 字符串
/// @param callback 回调接口
- void init(Context context, String profile, RXJSONCallback callback)

/// 用户激活
/// @param sourceAd 扩展信息
/// @param callback 回调接口
- void requestActivated(Map<String, Object> sourceAd, RXJSONCallback callback)

// MARK: - 登录

/// 登录请求
/// @param activity Activity
/// @param loginType 登录类型
/// @param username 用户名
/// @param password 密码
/// @param captchaCode 验证码
/// @param loginOpenId 二次登录 openId
/// @param ext 扩展字段
/// @param signFields 签名字段
/// @param migrateArgs 账号迁移参数
/// @param callback 回调接口
- void login(Activity activity, String loginType, String username, String password, String captchaCode, String loginOpenId, Map<String, Object> ext, String[] signFields, Object migrateArgs, RXJSONCallback callback)

/// 登录请求（LoginParams 版本）
/// @param activity Activity
/// @param params 登录参数
/// @param callback 回调接口
- void login(Activity activity, LoginParams params, RXJSONCallback callback)

// MARK: - 用户信息

/// 获取用户信息
/// @param callback 回调接口
- void getUserInfo(RXJSONCallback callback)

/// 获取指定用户信息
/// @param map 请求参数 map
/// @param callback 回调接口
- void getUserInfoByField(Map<String, Object> map, RXJSONCallback callback)

/// 更新用户信息
/// @param nickname 昵称
/// @param avatarUrl 头像 URL
/// @param region 地区码
/// @param sex 性别
/// @param ext 扩展字段
/// @param callback 回调接口
- void updateUserInfo(String nickname, String avatarUrl, String region, String sex, Map<String, Object> ext, RXJSONCallback callback)

/// 更新用户信息（UserInfoParams 版本）
/// @param params 用户信息参数
/// @param callback 回调接口
- void updateUserInfo(UserInfoParams params, RXJSONCallback callback)

// MARK: - 验证码

/// 发送验证码
/// @param target 目标（手机号或邮箱）
/// @param purpose 用途
/// @param needVoice 是否需要语音
/// @param captchaToken 图形验证码 token
/// @param captchaVerify 图形验证码结果
/// @param callback 回调接口
- void sendCaptcha(String target, String purpose, boolean needVoice, String captchaToken, String captchaVerify, RXJSONCallback callback)

/// 发送验证码（CaptchaType 版本）
/// @param type 验证码类型
/// @param target 目标
/// @param purpose 用途
/// @param callback 回调接口
- boolean sendCaptcha(CaptchaType type, String target, String purpose, RXJSONCallback callback)

/// 验证验证码
/// @param type 验证码类型
/// @param target 目标
/// @param purpose 用途
/// @param captchaCode 验证码
/// @param callback 回调接口
- boolean verifyCaptcha(CaptchaType type, String target, String purpose, String captchaCode, RXJSONCallback callback)

// MARK: - 密码

/// 修改密码
/// @param oldPassword 旧密码
/// @param newPassword 新密码
/// @param callback 回调接口
- void changePassword(String oldPassword, String newPassword, RXJSONCallback callback)

/// 重置密码
/// @param username 用户名
/// @param password 密码
/// @param captchaCode 验证码
/// @param migrateArgs 账号迁移参数
/// @param callback 回调接口
- void resetPassword(String username, String password, String captchaCode, Object migrateArgs, RXJSONCallback callback)

// MARK: - 注册

/// 注册
/// @param params 注册参数
/// @param callback 回调接口
- void register(RegisterParams params, RXJSONCallback callback)

/// 注册
/// @param username 用户名
/// @param password 密码
/// @param captchaCode 验证码
/// @param ext 扩展字段
/// @param callback 回调接口
- void register(String username, String password, String captchaCode, Map<String, Object> ext, RXJSONCallback callback)

// MARK: - 实名认证

/// 实名认证
/// @param realname 姓名
/// @param idcard 身份证号
/// @param callback 回调接口
- void realAuth(String realname, String idcard, RXJSONCallback callback)

/// 实名认证（快速认证）
/// @param realname 姓名
/// @param idcard 身份证号
/// @param isFastRealAuth 是否快速认证
/// @param callback 回调接口
- void realAuth(String realname, String idcard, boolean isFastRealAuth, RXJSONCallback callback)

// MARK: - 账号绑定

/// 绑定手机
- void bindPhone(String phone, String password, String captchaCode, Object migrateArgs, RXJSONCallback callback)

/// 解绑手机
- void unBindPhone(String phone, String captchaCode, RXJSONCallback callback)

/// 修改手机
- void changePhone(String newPhone, String newPhoneCaptcha, String oldPhoneCaptcha, Object migrateArgs, RXJSONCallback callback)

/// 绑定邮箱
- void bindEmail(String email, String password, String captchaCode, Object migrateArgs, RXJSONCallback callback)

/// 解绑邮箱
- void unBindEmail(String email, String captchaCode, RXJSONCallback callback)

/// 修改邮箱
- void changeEmail(String newEmail, String newEmailCaptcha, String oldEmailCaptcha, Object migrateArgs, RXJSONCallback callback)

// MARK: - 账号管理

/// 查询账号
- void searchHasAccounts(String method, String devicecode, int states, RXJSONCallback callback)

/// 查询绑定账号
- void searchBindingAccounts(RXJSONCallback callback)

/// 注销账号
- void deregister(RXDeregisterConfig config, RXJSONCallback callback)

/// 撤销注销
- void deregisterCancel(RXJSONCallback callback)

// MARK: - 支付

/// 支付
- void pay(Activity activity, HQParams payParams, RXJSONCallback callback)

/// 支付（Map 版本）
- void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback)

// MARK: - 分享

/// 分享
- void share(Activity activity, RXShareConfig shareConfig, RXJSONCallback callback)

/// 自定义分享
- void shareCustom(Activity activity, RXCustomShareConfig config, RXJSONCallback callback)

/// 获取分享信息
- void getShareInfo(RXShareConfig shareConfig, RXJSONCallback callback)

/// 分享调度初始化
- void shareSchedulingInit(String[] funcs, RXJSONCallback callback)

/// 获取分享调度
- Map<String, Object> getShareScheduling(String... func)

/// 分享调度上报
- void shareSchedulingReport(String func, String platform, String region, boolean schedulingEvent, String schedulingType, String transmits, Map<String, Object> properties, RXJSONCallback callback)

/// 获取短链接
- void getShortUrl(String url, RXJSONCallback callback)

// MARK: - 游戏区服/角色

/// 查询区服信息
- void searchGameAreaInfo(String areaId, RXJSONCallback callback)

/// 查询区服列表
- void searchGameAreaListInfo(RXRequestCallback callback)

/// 创建区服
- void createGameArea(String areaId, String areaName, String areaStatus, String areaType, Map<String, Object> extension, RXJSONCallback callback)

/// 修改区服
- void updateGameAreaInfo(String areaId, String areaName, String areaStatus, String areaType, Map<String, Object> extension, RXJSONCallback callback)

/// 删除区服
- void deleteGameArea(String areaId, RXJSONCallback callback)

/// 创建角色
- void createGameCharacter(String areaId, String characterName, String characterLevel, String characterFaction, String characterProfession, String characterStatus, String characterType, String characterVipLevel, String cpUserId, Map<String, Object> extension, RXJSONCallback callback)

/// 修改角色
- void updateGameCharacterInfo(String characterId, String areaId, String characterFaction, String characterLevel, String characterName, String characterProfession, String characterStatus, String characterType, String characterVipLevel, String cpUserId, Map<String, Object> extension, RXJSONCallback callback)

/// 删除角色
- void deleteGameCharacter(String areaId, String characterId, String cpUserId, RXJSONCallback callback)

/// 查询角色列表
- void searchGameCharacterListInfo(String cpUserId, RXRequestCallback callback)

/// 查询区服角色列表
- void searchGameCharacterListInArea(String cpUserId, String areaId, RXRequestCallback callback)

/// 查询角色信息
- void searchGameCharacterInfo(String cpUserId, String areaId, String characterId, RXJSONCallback callback)

// MARK: - 社交

/// LBS 更新
- void lbsUpdate(String[] types, float longitude, float latitude, RXJSONCallback callback)

/// LBS 半径查询
- void lbsRadius(String types, float longitude, float latitude, float radius, int count, int page, int pageSize, RXJSONCallback callback)

/// LBS 删除
- void lbsDelete(String[] types, RXJSONCallback callback)

/// 设置用户自定义信息
- void userSetCustom(String custom, RXJSONCallback callback)

/// 添加关系
- void relationAdd(String target, Map<String, Object> types, String targetRemarks, String userRemarks, RXJSONCallback callback)

/// 删除关系
- void relationDelete(String target, Map<String, Object> types, RXJSONCallback callback)

/// 更新备注
- void updateRemarks(String target, String type, String targetRemarks, RXJSONCallback callback)

/// 判断关系
- void hasRelation(String target, String type, RXJSONCallback callback)

/// 关系列表
- void relationList(String type, RXJSONCallback callback)

/// 添加好友
- void addFriends(String target, String targetRemarks, String userRemarks, RXJSONCallback callback)

/// 删除好友
- void removeFriends(String target, RXJSONCallback callback)

/// 更新好友备注
- void updateFriendRemarks(String target, String targetRemarks, RXJSONCallback callback)

/// 判断好友
- void isFriend(String target, RXJSONCallback callback)

/// 好友列表
- void relationFriends(RXJSONCallback callback)

/// 增加分数
- void addScore(String rankId, int score, RXJSONCallback callback)

/// 设置分数
- void setScore(String rankId, int score, RXJSONCallback callback)

/// 查询排名
- void queryUserRank(String rankId, String openId, RXJSONCallback callback)

/// 排行榜列表
- void getRankList(String rankId, int startRank, int endRank, RXJSONCallback callback)

/// 好友排行榜
- void friendsRank(String rankId, RXJSONCallback callback)

// MARK: - 埋点

/// 数据埋点
- boolean dataTrack(String eventName, String distinctId, Map<String, Object> properties)

/// 数据埋点（带缓存配置）
- boolean dataTrack(String eventName, String distinctId, Map<String, Object> properties, int flushInterval, int maxCacheCount)

/// 窗口曝光上报
- void reportWindowExposure(Map<String, Object> properties)

/// 用户行为上报
- void trackUserAction(String distinctId, Map<String, Object> properties)

/// 停止用户行为上报
- void stopTrackUserAction()

// MARK: - 其他

/// 法务接口
- void legal(Map<String, Object> hashMap, RXJSONCallback callback)
- void legal(RXJSONCallback callback)

/// 法务条款
- void legalTerms(Map<String, Object> hashMap, RXJSONCallback callback)
- void legalTerms(String keys, RXJSONCallback callback)

/// 反馈
- void getFeedbackKindList(RXJSONCallback callback)
- void createFeedback(Map<String, Object> map, RXJSONCallback callback)
- void satisfactionEvaluation(Map<String, Object> map, RXJSONCallback callback)

/// 福利码
- void getPromoDisplayKEY(boolean authRefresh, RXJSONCallback callback)
- void exchangePromoCDKEY(String cdKey, RXRequestCallback callback)

/// 运营场景
- void getOperationScene(RXJSONCallback callback)

/// 客服
- void getServiceChatUnreadCount(RXRequestCallback callback)
- void clearServiceChatUnreadCount(RXRequestCallback callback)

/// 版本更新
- void updateApp(String version, String region, Map<String, Object> queryMap, RXStringCallback callback)
- void checkUpdateApp(String version, String region, String type, Map<String, Object> queryMap, RXStringCallback callback)
- void updateActivity(String activityShortname, String activityVersion, String activityCheckVersion, Map<String, Object> queryMap, RXStringCallback callback)
- void updateGame(String gameId, String gameVersion, String gameCheckVersion, Map<String, Object> queryMap, RXStringCallback callback)
```

---

## RXSdkUI（UI 组件库）

UI 组件库，提供登录、用户中心、客服等 UI 组件。

```java
/// 获取 SDK 实例（单例）
+ RXSdkUI getInstance()

// MARK: - 初始化

/// 注册
- void regist()

/// 配置 Logo
/// @param logoResId Logo 资源 ID
/// @param titleResId 标题资源 ID
- void configLogo(int logoResId, int titleResId)

// MARK: - 登录 UI

/// 显示登录 UI
/// @param activity Activity
/// @param config 登录配置
/// @param callback 回调接口
- boolean showLoginUI(Activity activity, RXLoginUIModel config, RXRequestCallback callback)

/// 显示登录 UI
/// @param activity Activity
/// @param config 登录配置
/// @param callback UI 回调接口
- boolean showLoginUI(Activity activity, RXLoginUIModel config, RXUICallback callback)

/// login_openid 是否失效
/// @param activity Activity
/// @param config 登录配置
/// @param callback 回调接口
/// @return YES 失效，NO 有效
- boolean loginOpenidExpireInvalid(Activity activity, RXLoginUIModel config, RXRequestCallback callback)

/// 关闭登录 UI
- void closeLoginView()

// MARK: - 用户中心 UI

/// 用户中心
/// @param activity Activity
/// @param config 配置
/// @param callback 回调接口
- IRXView userCenterUI(Activity activity, RXUserCenterConfig config, RXUICallback callback)

/// 关闭用户中心
- void closeUserCenter()

/// 帮助中心
/// @param activity Activity
/// @param config 配置
/// @param callback 回调接口
- IRXView serviceCenterUI(Activity activity, RXUserCenterConfig config, RXUICallback callback)

/// 客服
/// @param activity Activity
/// @param params 参数
/// @param needLogin 是否需要登录
/// @param callback 回调接口
- IRXView chatServiceUI(Activity activity, Map<String, Object> params, boolean needLogin, RXUICallback callback)

// MARK: - 实名认证 UI

/// 实名认证
/// @param activity Activity
/// @param canClose 是否可关闭
/// @param callback 回调接口
- IRXView realAuthUI(Activity activity, boolean canClose, RXJSONCallback callback)

/// 实名认证
/// @param activity Activity
/// @param canClose 是否可关闭
/// @param callback 回调接口
- IRXView realAuthUI(Activity activity, boolean canClose, RXRequestCallback callback)

/// 防沉迷提示
/// @param title 标题
/// @param message 内容
- void setAntiAdditionView(String title, String message)

// MARK: - 密码 UI

/// 找回密码
/// @param activity Activity
/// @param params 参数
/// @param callback 回调接口
- IRXView findPassWordUI(Activity activity, Map<String, Object> params, RXUICallback callback)

/// 设置密码
/// @param activity Activity
/// @param callback 回调接口
- IRXView setPasswordUI(Activity activity, RXUICallback callback)

// MARK: - 分享 UI

/// 显示分享 UI
/// @param activity Activity
/// @param platform 平台
/// @param params 参数
/// @param callback 回调接口
- void showShareUI(Activity activity, String platform, Map<String, Object> params, RXJSONCallback callback)

/// 分享
/// @param activity Activity
/// @param shareInfo 分享信息
- void shareWithShareInfo(Activity activity, Map<String, Object> shareInfo)

// MARK: - 注销 UI

/// 申请注销
/// @param activity Activity
/// @param config 配置
/// @param callback 回调接口
- IRXView applyForDeregisterUI(Activity activity, RXUserCenterConfig config, RXUICallback callback)

/// 撤销注销状态展示
/// @param activity Activity
/// @param callback 回调接口
- void destroyAccountStatusView(Activity activity, DestroyClickCallback callback)

// MARK: - WebView

/// 打开 WebView
/// @param activity Activity
/// @param url 链接
- void openWebView(Activity activity, String url)

/// 打开 WebView
/// @param activity Activity
/// @param url 链接
/// @param callback 回调接口
- void openWebView(Activity activity, String url, RXWebViewCallback callback)

// MARK: - 其他 UI

/// 同步账号
/// @param accounts 账号列表
- void syncAccounts(List<Map<String, Object>> accounts)

/// 显示邮件
/// @param activity Activity
/// @param cpUserId CP 用户 ID
- void showEmailView(Activity activity, String cpUserId)

/// 绑定手机 UI
/// @param activity Activity
/// @param callback 回调接口
- IRXView bindPhoneUI(Activity activity, RXUICallback callback)

/// 绑定邮箱 UI
/// @param activity Activity
/// @param callback 回调接口
- IRXView bindEmailUI(Activity activity, RXUICallback callback)

/// 显示公告
/// @param activity Activity
/// @param limit 数量限制
/// @param linkCallback 链接回调
/// @param isHasCallback 是否有公告回调
- void showAnnounceView(Activity activity, int limit, LinkCallback linkCallback, IsHasCallback isHasCallback)

/// 显示维护公告
/// @param context Context
/// @param title 维护公告标题
/// @param content 维护公告内容
/// @param linkCallback 链接回调
- void showAnnounceView(Context context, String title, String content, NoticeCallback linkCallback)

/// 设置协议
/// @param key 协议 key
- void setProtocolView(String key)

/// 设置协议（多协议）
/// @param key 默认展示的条款 key
/// @param keyList 要展示的协议列表
- IRXView protocolView(Activity activity, String key, List<String> keyList)

/// 设置隐私协议
/// @param key 隐私 key
- void setPrivacyView(String key)

/// 用户隐私政策弹框
/// @param context Context
/// @param title 标题
/// @param content 内容
/// @param callback 回调接口
- IRXView userPrivacyPolicy(Context context, String title, String content, RXJSONCallback callback)

// MARK: - 滑块验证码 UI（与 iOS 对齐）

/// 滑块验证码 UI
/// @param activity Activity
/// @param appid 图形验证码 appid
/// @param callback 回调接口
- IRXView captchaVerifyUI(Activity activity, int appid, RXUICallback callback)

// MARK: - 实名认证 H5 UI（与 iOS 对齐）

/// 实名认证 H5 界面
/// @param activity Activity
/// @param region 地区
/// @param cancelable 是否可关闭
/// @param callback 回调接口
- IRXView realAuthH5UI(Activity activity, String region, boolean cancelable, RXJSONCallback callback)

// MARK: - 注册 UI（与 iOS 对齐）

/// 注册 UI
/// @param activity Activity
/// @param registerType 注册界面类型
/// @param callback 回调接口
- IRXView registerUI(Activity activity, int registerType, RXUICallback callback)

/// 注册 UI
/// @param activity Activity
/// @param map 自定义参数
/// @param registerType 注册界面类型
/// @param callback 回调接口
- IRXView registerUI(Activity activity, Map<String, Object> map, int registerType, RXUICallback callback)

// MARK: - 修改密码 UI（与 iOS 对齐）

/// 修改密码 UI
/// @param activity Activity
/// @param isPasswordSet 是否已设置密码
/// @param callback 回调接口
- IRXView changePwdUI(Activity activity, boolean isPasswordSet, RXJSONCallback callback)

// MARK: - 防沉迷提示 UI（与 iOS 对齐）

/// 防沉迷提示
/// @param activity Activity
/// @param titleStr 标题
/// @param contextStr 内容
/// @param buttonTxt 按钮文本
/// @param callback 回调接口
- IRXView antiAdditionView(Activity activity, String titleStr, String contextStr, String buttonTxt, RXJSONCallback callback)

// MARK: - 版本更新 UI（与 iOS 对齐）

/// 显示更新应用 UI
/// @param context Context
/// @param version 客户端版本号
/// @param region 地区码
/// @param queryMap 查询参数
/// @param isShowUI 是否显示 UI
/// @param linkCallback 回调接口
- void showUpdateAppView(Context context, String version, String region, Map<String, Object> queryMap, boolean isShowUI, MaintainNoticeCallback linkCallback)

/// 显示检查更新 UI
/// @param context Context
/// @param version 客户端版本号
/// @param region 地区码
/// @param type 脚本类型
/// @param queryMap 查询参数
/// @param isShowUI 是否显示 UI
/// @param linkCallback 回调接口
- void showCheckUpdateAppView(Context context, String version, String region, String type, Map<String, Object> queryMap, boolean isShowUI, MaintainNoticeCallback linkCallback)
```

---

## 第三方 SDK 封装

### RXWechatPlugin（微信）

```java
+ RXWechatPlugin getInstance()
- boolean registerApp(String appId, String universalLink)
- void sendAuthReq(String scope, String state, RXRequestCallback callback)
- void shareText(String text, RXRequestCallback callback)
- void shareImage(byte[] imageData, RXRequestCallback callback)
- void shareWebPage(String webpageUrl, String title, String description, byte[] thumbImage, RXRequestCallback callback)
- void shareMiniProgram(String webpageUrl, String userName, String path, String title, String description, byte[] thumbImage, RXRequestCallback callback)
- void launchMiniProgram(String userName, String path, RXRequestCallback callback)
- boolean handleIntent(Intent intent)
```

### RXQQPlugin（QQ）

```java
+ RXQQPlugin getInstance()
- void login(Activity activity, RXRequestCallback callback)
- void logout()
- void shareText(Activity activity, String text, RXRequestCallback callback)
- void shareImage(Activity activity, String imagePath, RXRequestCallback callback)
```

### RXWeiboPlugin（微博）

```java
+ RXWeiboPlugin getInstance()
- void login(Activity activity, RXRequestCallback callback)
- void logout()
- void shareText(String text, RXRequestCallback callback)
- void shareImage(byte[] imageData, RXRequestCallback callback)
```

### RXFacebookPlugin（Facebook）

```java
+ RXFacebookPlugin getInstance()
- void loginWithPermissions(Activity activity, List<String> permissions, RXRequestCallback callback)
- void logout()
- void share(Activity activity, RXFBShareLinkContent content, RXRequestCallback callback)
- void sharePhoto(Activity activity, RXFBSharePhotoContent content, RXRequestCallback callback)
```

### RXGooglePlugin（Google）

```java
+ RXGooglePlugin getInstance()
- void signIn(Activity activity, RXRequestCallback callback)
- void signOut(RXRequestCallback callback)
```

### RXLinePlugin（Line）

```java
+ RXLinePlugin getInstance()
- void login(Activity activity, RXRequestCallback callback)
- void logout()
```

### RXTikTokPlugin（TikTok）

```java
+ RXTikTokPlugin getInstance()
- void auth(Activity activity, RXRequestCallback callback)
- void share(Activity activity, Map<String, Object> params, RXRequestCallback callback)
```

### RXAdjustPlugin（Adjust 归因）

```java
+ RXAdjustPlugin getInstance()
- void appDidLaunch(RXADJConfig adjustConfig)
- void trackEvent(RXADJEvent event)
- void trackSubsessionStart()
- void trackSubsessionEnd()
- void setEnabled(boolean enabled)
- boolean isEnabled()
- void appWillOpenUrl(Uri url)
- void setDeviceToken(String deviceToken)
- void setPushToken(String pushToken)
- void setOfflineMode(boolean enabled)
- String getAdid()
- RXADJAttribution getAttribution()
- void gdprForgetMe(Context context)
- void trackAdRevenue(RXADJAdRevenue adRevenue)
```

### RXFirebasePlugin（Firebase）

```java
+ RXFirebasePlugin getInstance()
- void configure(Context context)
- void logEvent(String name, Bundle parameters)
- void setUserProperty(String name, String value)
- void setUserId(String userId)
```

### RXFirebasePush（Firebase 推送）

```java
+ RXFirebasePush getInstance()
- void registerForRemoteNotifications()
- String getFCMToken()
```

### RXPushPlugin（推送）

```java
+ RXPushPlugin getInstance()
- void registerForRemoteNotifications(Context context)
- String getDeviceToken()
```

### RXOpeninstallPlugin（Openinstall）

```java
+ RXOpeninstallPlugin getInstance()
- void getInstallParams(RXInstallCallback callback)
```

---

## 统计摘要

| 分类 | 主要方法数 |
|------|-----------|
| 初始化/登录 | 20+ |
| 用户信息/绑定 | 25+ |
| 社交/好友/排行榜 | 25+ |
| 游戏区服/角色 | 15+ |
| 支付 | 8+ |
| 分享 | 20+ |
| 埋点/日志 | 15+ |
| 版本更新 | 5+ |
| 反馈/客服 | 15+ |
| 公告/邮件 | 10+ |
| 法务/合规 | 5+ |
| 配置/信息获取 | 10+ |
| UI 展示 | 40+ |
| 第三方登录/分享 | 40+ |
| **总计** | **250+** |

---

## 与 iOS 端对齐说明

| Android | iOS | 说明 |
|---------|-----|------|
| `RXSDK` | `RXSDK` | 统一入口类 |
| `RXSdkApi` | `RXService` / `RXApiService` | 底层 API 服务 |
| `HQParams` + `pay()` | `RXIAPService` | 支付模块 |
| `RXShareConfig` + `share()` | `RXShareService` | 分享模块 |
| `dataTrack()` | `RXLogService` | 埋点模块 |
| `createFeedback()` / `feedbackCreate()` | `RXFeedbackService` | 反馈模块 |
| `RXSdkUI` | `RXUIKitService` / `RXOSUIKitService` | UI 组件 |
| `RXWechatPlugin` | `RXWXService` | 微信服务 |
| `RXFacebookPlugin` | `RXFacebookService` | Facebook 服务 |
| `RXGooglePlugin` | `RXGoogleService` | Google 服务 |
| `RXAdjustPlugin` | `RXAdjust` | Adjust 归因 |
| `RXFirebasePlugin` | `RXFirebaseService` | Firebase 服务 |
| `getAnnouncement()` | `getAnnouncementWithLimit:complete:` | 公告接口 |
| `getEmailList()` / `getEmailDetail()` | `getEmailListWithCpUserID:complete:` | 邮件接口 |
| `tradeQuery()` | `tradeQueryWithOrderNo:complete:` | 订单查询 |
| `getSharePlatforms()` | `getSharePlatformsWithComplete:` | 分享通路配置 |

---

## 回调类型对照

| Android | iOS | 说明 |
|---------|-----|------|
| `RXRequestCallback` | `RXSDKRequestComplete` | 标准请求回调 |
| `RXJSONCallback` | `RequestComplete` | JSON 回调 |
| `RXStringCallback` | `RXStringCallback` | 字符串回调 |
| `RXUICallback` | `void(^)(...)` | UI 回调 |
| `OnLogoutCallback` | - | 登出回调 |
| `OnAppExitCallback` | - | 退出回调 |
| `PrivacyCallback` | - | 隐私回调 |
| `NoticeCallback` | `linkCallBack` / `isHasCallBack` | 公告回调 |
| `MaintainNoticeCallback` | - | 维护公告回调 |

---

## 本次对齐新增接口汇总

### RXSDK 新增接口（与 iOS 对齐）

| 接口 | 功能 | iOS 对应接口 |
|------|------|-------------|
| `getAnnouncement()` | 获取公告列表 | `getAnnouncementWithLimit:complete:` |
| `getTempNotice()` | 获取临时公告 | `getTempNotice:` |
| `getEmailList()` | 获取邮件列表 | `getEmailListWithCpUserID:complete:` |
| `getEmailDetail()` | 获取邮件详情 | `getEmailDetailWithCpUserID:emailID:complete:` |
| `getEmailAward()` | 领取邮件道具 | `receivePropsWithCpUserID:type:emailID:complete:` |
| `deleteEmail()` | 删除邮件 | `deleteEmailWithCpUserID:type:emailID:complete:` |
| `feedbackCreate()` | 创建意见反馈（详细版） | `feedbackCreateWithContent:attachments:phone:tags:complete:` |
| `getFeedbackList()` | 获取反馈列表 | `getFeedbackListWithPage:size:status:complete:` |
| `getFeedbackDetail()` | 获取反馈详情 | `getFeedbackDetailWithFeedbackID:complete:` |
| `feedbackGetprop()` | 领取反馈道具 | `feedbackGetpropWithFeedbackID:complete:` |
| `getSharePlatforms()` | 获取分享通路配置 | `getSharePlatformsWithComplete:` |
| `getShortUrl()` (带 OG) | 获取短链接（带 OG 标签） | `getShortUrl:title:content:image:ext:complete:` |
| `tradeQuery()` | 查询订单状态 | `tradeQueryWithOrderNo:complete:` |
| `isLogin()` | 判断是否已登录 | - |
| `getLoginData()` | 获取登录数据 | - |
| `loginOpenidExpireInvalid()` | login_openid 是否失效 | `loginOpenidExpireInvalid` |
| `setLanguage()` | 设置当前语言 | `setLanguage:` |
| `getFirstBaseUrl()` | 获取当前 BaseUrl | `getFirstBaseUrl` |
| `getOpenId()` | 获取 OpenID | `getOpenID` |
| `getDeviceCode()` | 获取设备码 | `getDeviceCode` |
| `getTimeZoneOffset()` | 获取时区偏移 | `getTimeZoneOffset` |
| `getSystemLanguage()` | 获取系统语言 | `getSystemLanguage` |
| `addAttribution()` | 媒体平台自定义行为上报 | `addAttributionWithParams:complete:` |

### RXSdkUI 新增接口（与 iOS 对齐）

| 接口 | 功能 | iOS 对应接口 |
|------|------|-------------|
| `captchaVerifyUI()` | 滑块验证码 UI | `captchaVerifyUIWithAppid:complete:` |
| `realAuthH5UI()` | 实名认证 H5 界面 | `setRealauthViewH5WithRegion:canClose:complete:` |
| `registerUI()` | 注册 UI | - |
| `changePwdUI()` | 修改密码 UI | - |
| `antiAdditionView()` | 防沉迷提示 UI | `setAntiAdditionViewWithTitle:des:btnTitle:complete:` |
| `protocolView()` | 协议声明（多协议） | `setProtocolViewWithKey:keyList:` |
| `userPrivacyPolicy()` | 用户隐私政策弹框 | `userPrivacyPolicyWithComplete:` |
| `showUpdateAppView()` | 显示更新应用 UI | - |
| `showCheckUpdateAppView()` | 显示检查更新 UI | - |
