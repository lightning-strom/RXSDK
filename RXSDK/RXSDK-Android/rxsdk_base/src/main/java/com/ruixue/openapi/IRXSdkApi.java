package com.ruixue.openapi;

import android.app.Activity;
import android.content.Context;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RXRequestCallback;
import com.ruixue.base.SdkInfo;
import com.ruixue.billing.HQParams;
import com.ruixue.callback.RXCallback;
import com.ruixue.callback.RXStringCallback;
import com.ruixue.legal.AntiAddictDelegate;
import com.ruixue.legal.PrivacyCallback;
import com.ruixue.share.ShareDataResult;

import java.util.Map;

public interface IRXSdkApi extends IPassportApi, ISocialApi, IGameAreaApi {

    String KEY_LOGIN_METHOD = "method";
    String KEY_LOGIN_OPENID = "login_openid";

    SdkInfo getSdkInfo();

    String getChannel();

    void registerPlugin(IPluginSdk thirdSdk);

    void unregisterPlugin(IPluginSdk thirdSdk);

    Map<String, IPluginSdk> getPlugins();

    /**
     * 初始化前调用 防沉迷 业务处理 快手，华为
     * @param antiAddictDelegate 回调
     */
    void setupAddictDelegate(AntiAddictDelegate antiAddictDelegate);

    boolean jumpToAppStore(Activity activity);

    /**
     * 登录状态监听 快手
     *
     * @param loginStatusChangeListener 0:未登陆、1：登陆中、2：已登陆 4：登出中;
     */
    // void addLoginStatusListener(ILoginStatusChangeListener
    // loginStatusChangeListener);

    /**
     * 同意隐私政策
     */
    void setPrivacyAgree(Context context, PrivacyCallback privacyCallBack);

    void setPrivacyAgree(Context context, boolean isAgree, PrivacyCallback privacyCallback);

    boolean isAgreedPrivacy();

    /**
     * 自定义接口请求
     * @param api     接口路径
     * @param bodyMap 接口参数
     * @return RXRequest请求对象
     */
    IRXRequest createRequest(String api, Map<String, Object> bodyMap);

    /**
     * sdk登出 百度网讯 抖音 快手 ysdk
     * login 登录
     * logoff logout 登出 快手 抖音 百度
     * exitApp 退出 快手
     */
    void initThirdSdk(@NonNull Activity activity, @Nullable Map<String, Object> hashMap,
            RXJSONCallback callback);

    /**
     * 调用当前 Android 渠道库提供的通用能力。
     *
     * @param activity 当前 Activity
     * @param action   渠道无关的 action，使用 {@link com.ruixue.RuiXueSdk} 中的
     *                 {@code CHANNEL_ACTION_*} 常量
     * @param params   action 参数，可为空
     * @param callback 结果回调，可为空；回调线程语义与当前渠道 SDK 保持一致
     */
    void invokeChannelAction(@NonNull Activity activity, @NonNull String action,
            @Nullable Map<String, Object> params, @Nullable RXJSONCallback callback);

    void checkQuickAp(RXJSONCallback callback);

    void login(Activity activity, Map<String, Object> map, RXJSONCallback callback);

    /**
     * 支付
     * @param activity 应用 activity
     * @param hashMap  map 参数 参照参数表
     * @param callback 回调函数
     */
    void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback);

    void pay(Activity activity, HQParams payParams, RXJSONCallback callback);

    /**
     * 向渠道合规系统上报充值金额（单位：分）。
     * 建议在服务端支付到账确认后由 CP 主动调用；成功/失败会读取下单缓存并同步上报瑞雪大数据 {@code #rxsdk_payresult}。
     *
     * @param amountFen 充值金额，单位分
     * @param callback  回调
     */
    void submitChannelPayment(int amountFen, RXJSONCallback callback);

    /**
     * 向渠道合规系统上报充值金额（单位：分）。
     * {@code override} 可传 {@code trade_no}/{@code order_no} 用于匹配下单缓存；未命中时使用最近一次下单缓存。
     */
    void submitChannelPayment(int amountFen, @Nullable Map<String, Object> override, RXJSONCallback callback);

    /**
     * 向渠道检查本次充值是否受限额约束（单位：分）。
     * 建议在拉起支付前调用；当前仅 TapTap 渠道实现。
     *
     * @param activity  当前 Activity
     * @param amountFen 充值金额，单位分
     * @param callback  成功时返回 {@code {"allowed":true/false,"amount":分}}
     */
    void checkChannelPaymentLimit(Activity activity, int amountFen, RXJSONCallback callback);

    void shareCustom(Activity activity, RXCustomShareConfig config, RXJSONCallback callback);

    void getShareInfo(RXShareConfig shareConfig, RXJSONCallback callback);

    void share(Activity activity, RXShareConfig shareConfig, RXJSONCallback callback);


    /**
     * 获取分享埋点数据
     * @param hashMap  map 参数
     *                 appType string 非必须 小游戏需要传minigame\n
     *                 func string 必须 埋点标识
     *                 transmitargs string 非必须 透传参数，原样返回
     *                 custom string 非必须 自定义参数，URLENCODE
     *                 method string 非必须 分享方式1广告，2好友列表 4朋友圈 (2+4正常分享)，8指定分享
     *                 share_from string 非必须 分享人瑞雪openid
     *                 share_first string 非必须 首次分享人瑞雪openid
     *                 region string 必须 地区码 取不到传空字符串
     * @param callback 回调函数
     */
    void getShareData(Map<String, Object> hashMap, RXJSONCallback callback);

    void getShareData(Map<String, Object> map, RXCallback<ShareDataResult> callback);

    void shareReport(String distinctId, Map<String, Object> properties);

    void shareReport(ShareDataResult shareDataResult);

    void shareSchedulingInit(String[] funcs, RXJSONCallback callback);

    Map<String, Object> getShareScheduling(String... func);


    void shareSchedulingReport(String func, String platform, String region, boolean scheduling_event, String scheduling_type, String transmits, @NonNull Map<String, Object> properties, RXJSONCallback callback);


    void getShortUrl(@NonNull String url, RXJSONCallback callback);

    /**
     * 法务接口
     * @param hashMap  map 参数
     * @param callback 回调函数
     */
    void legal(Map<String, Object> hashMap, RXJSONCallback callback);

    void legal(RXJSONCallback callback);

    void legalTerms(Map<String, Object> hashMap, RXJSONCallback callback);

    void legalTerms(String keys, RXJSONCallback callback);

    /**
     * @param version  客户端版本号，3段或4段
     * @param region   地区码
     * @param queryMap type 脚本类型 默认json， 可选 lua， u3d
     *                 format 输出文件后缀，默认json，可选lua
     * @param callback callback
     */
    void updateApp(String version, String region, Map<String, Object> queryMap, RXStringCallback callback);

    /**
     * @param version  客户端版本号， 3段或4段
     * @param region   地区码， 默认0
     * @param type     脚本类型 默认js， 可选lua， u3d
     * @param queryMap games {"games:{"游戏id": 客户端游戏版本}"}
     *                 activities {"activities":{"活动别名": 客户端活动版本}}
     * @param callback 回调函数
     */
    void checkUpdateApp(String version, String region, String type, Map<String, Object> queryMap, RXStringCallback callback);

    /**
     * 活动版本检查
     * @param activityShortname    活动别名
     * @param activityVersion      客户端版本号
     * @param activityCheckVersion 优先检查这个版本，没用再返回最新版本
     * @param queryMap             type 脚本类型 默认json， 可选 lua， u3d
     *                             format 输出文件后缀，默认json，可选lua
     * @param callback             callback
     */
    void updateActivity(String activityShortname, String activityVersion, String activityCheckVersion, Map<String, Object> queryMap, RXStringCallback callback);

    /**
     * 游戏版本检查
     * @param gameId           游戏id
     * @param gameVersion      客户端版本号
     * @param gameCheckVersion 优先检查这个版本，没用再返回最新版本
     * @param queryMap         type 脚本类型 默认json， 可选 lua， u3d
     *                         format 输出文件后缀，默认json，可选lua
     * @param callback         callback
     */
    void updateGame(String gameId, String gameVersion, String gameCheckVersion, Map<String, Object> queryMap, RXStringCallback callback);

    void getFeedbackKindList(RXJSONCallback callback);

    void createFeedback(Map<String, Object> map, RXJSONCallback callback);

    void satisfactionEvaluation(Map<String, Object> map, RXJSONCallback callback);

    /**
     * 获取达人游戏内显示福利码
     * @param authRefresh 是否自动刷新
     * @param callback    callback
     */
    void getPromoDisplayKEY(boolean authRefresh, RXJSONCallback callback);

    /**
     * 兑换达人福利码
     * @param cdKey dataKey
     */
    void exchangePromoCDKEY(String cdKey, RXRequestCallback callback);

    /**
     * 埋点数据上报
     * @param eventName  埋点标识事件
     * @param distinctId 用户唯一标识，一般为 OpenID
     * @param properties CP 自定义属性（由CP调用时传入）
     */
    boolean dataTrack(String eventName, String distinctId, Map<String, Object> properties);

    /**
     * 埋点数据上报（带缓存配置）
     * @param eventName     埋点标识事件
     * @param distinctId    用户唯一标识，一般为 OpenID
     * @param properties    CP 自定义属性（由CP调用时传入）
     * @param flushInterval 上报时间间隔
     * @param maxCacheCount 最大缓存条数
     * @deprecated 缓存配置已拆分为独立接口，请改用
     * {@link #setDataTrackFlushInterval(int)} / {@link #setDataTrackMaxCacheCount(int)}
     * 配置后再调用 {@link #dataTrack(String, String, Map)}
     */
    @Deprecated
    boolean dataTrack(String eventName, String distinctId, Map<String, Object> properties, int flushInterval, int maxCacheCount);

    /**
     * 单独设置埋点上报时间间隔
     * @param flushInterval 上报时间间隔（毫秒），{@code <=0} 时忽略并保持默认 60s
     */
    void setDataTrackFlushInterval(int flushInterval);

    /**
     * 单独设置埋点最大缓存条数
     * @param maxCacheCount 最大缓存条数，{@code <=0} 时忽略并保持默认 100
     */
    void setDataTrackMaxCacheCount(int maxCacheCount);

    void reportWindowExposure(Map<String, Object> properties);

    void getOperationScene(RXJSONCallback callback);

    /**
     * 停止用户行为上报
     */
    void stopTrackUserAction();

    /**
     * 上报用户行为
     * @param distinctId
     * @param properties
     */
    void trackUserAction(String distinctId, Map<String, Object> properties);


    void updateGameVersion(Map<String, Object> body, RXRequestCallback callback);

    void setGameInfo(String roleId, String regionTag);

    void setGameInfo(GameInfo gameInfo);

    /**
     * 查询角色信息
     */
    void searchGameAccount(RXRequestCallback callback);

    /**
     * 获取客服未读消息
     * @param callback callback
     */
    void getServiceChatUnreadCount(RXRequestCallback callback);

    /**
     * 清空客服未读消息数量
     * @param callback callback
     */
    void clearServiceChatUnreadCount(RXRequestCallback callback);

}
