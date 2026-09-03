package com.ruixue.sdk.bytedancelog;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;

import com.bytedance.ads.convert.BDConvert;

import com.bytedance.ads.convert.config.BDConvertConfig;
import com.bytedance.ads.convert.event.ConvertReportHelper;
import com.bytedance.hume.readapk.HumeSDK;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.TrackDataMgr;
import com.ruixue.logger.Logger;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.ISdkEvent;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class BytedanceLogWrapper implements ISdkEvent {

    private volatile boolean isRxTrace = true;


    public String getMethod() {
        JSONObject jsonObject = TrackDataMgr.getInstance().getWebsocket();
        if (jsonObject != null) {
            return jsonObject.optString("method", "");
        }
        return "";
    }

    public boolean isClientReport() {
        return getMethod().equalsIgnoreCase("client");
    }


    static class Single {
        final static BytedanceLogWrapper INSTANCE = new BytedanceLogWrapper();
    }

    public static BytedanceLogWrapper getInstance() {
        return Single.INSTANCE;
    }

    //
//    /**
//     * 加密开关
//     * @param isEncryptAndCompressEnable true开启，false关闭
//     */
//    public void setEncryptAndCompress(boolean isEncryptAndCompressEnable) {
//        AppLog.setEncryptAndCompress(isEncryptAndCompressEnable);
//    }
    String sub_event = "";

    public void setSubEvent(String sub_event) {
        this.sub_event = sub_event;
    }

    public String getChannel(Context context) {
        String channel = HumeSDK.getChannel(context);
        return channel;
//        return "sbchannel";
    }


    @Override
    public String getADChannel() {
        return "oceanengine";
    }

    @Override
    public void onEvent(String eventName, Map<String, Object> params) {
        switch (eventName) {
            case Event.ACTIVATED:
//                RxInitConfig rxInitConfig = new RxInitConfig((String) params.get("appid"), (String) params.get("channel_id"));
//                rxInitConfig.setAutoTrackEnabled(ObjectUtils.toBoolean(params.get("auto_track_enable"), true));
//                rxInitConfig.setEnablePlay(ObjectUtils.toBoolean(params.get("play_session_switch"), true));
                init(RuiXueSdk.getCurrentActivity());
                break;
            case Event.LOGIN:
                if (RuiXueSdk.getLoginData() != null) {
                    String method = (String) params.get("method");

                    if (RuiXueSdk.getLoginData().isNewUser()) {
                        onEventRegister(method, true);
                    } else {
                        onEventLogin(method, true);
                    }
                }
                break;
            case Event.PAY:
                String goods_type = ObjectUtils.toString(params.get("goods_type"));
                String goods_name = ObjectUtils.toString(params.get("goods_name"));
                String goods_id = ObjectUtils.toString(params.get("goods_id"));
                int goods_num = ObjectUtils.toInt(params.get("goods_num"));
                String goods_channel = ObjectUtils.toString(params.get("goods_channel"));
                String currency = ObjectUtils.toString(params.get("currency"));
                boolean success = ObjectUtils.toBoolean(params.get("success"));
                int amount = ObjectUtils.toInt(params.get("amount"));
                onEventPurchase(goods_type, goods_name, goods_id, goods_num, goods_channel, currency, success, amount);
                break;
            default:
                if (!TextUtils.isEmpty(eventName) && params != null) {
                    onEventV3(eventName, new JSONObject(params));
                } else {
                    Logger.d("unknown event " + eventName);
                }
        }
    }


    public void track(Map<String, Object> params) {
        StackTraceElement ste = new Throwable().getStackTrace()[1];
        String function = "" + ste.getMethodName();
        Map<String, Object> ha = new HashMap<>();
        ha.put("function", function);
        if (!TextUtils.isEmpty(sub_event)) {
            ha.put("sub_event", sub_event);
            sub_event = null;
        }
        ha.put("line", ste.getLineNumber());
        ha.put("method", getMethod());
        if (params != null) {
            ha.put("params", params);
        }
        RXLogger.i("rxtt_ws_track result:" + RXSdkApi.getInstance().dataTrack("#rxtt_ws_track", "", ha));
    }

    public void init(Activity activity) {
        BDConvertConfig config = new BDConvertConfig();
        config.setEnableLog(BuildConfig.DEBUG);

        RXLogger.i("BDConvert init PlaySessionEnable:" + config.getPlaySessionEnable());
        BDConvert.INSTANCE.init(activity, config, activity);
    }

//    /**
//     * 初始化
//     * @param context      Context上下文
//     * @param rxInitConfig 配置文件
//     */
//    public void init(Context context, RxInitConfig rxInitConfig) {
//        if (rxInitConfig != null) {
//            RXLogger.i("init bytedance " + rxInitConfig.getAppId());
//            track(EntityUtils.entityToMap(rxInitConfig));
//            AppLog.init(mContext != null ? mContext : context, buildConfig(rxInitConfig));
//        }
//    }

    /**
     * 是否开启瑞雪平台上报
     * @param isEnable true： 开启， false： 关闭
     */
    public void setRXTrack(boolean isEnable) {
        this.isRxTrace = isEnable;
    }

//    /**
//     * 初始化
//     * @param context      Context上下文
//     * @param rxInitConfig 配置文件
//     * @param activity     Activity引用
//     */
//    public void init(Context context, RxInitConfig rxInitConfig, Activity activity) {
//        track(EntityUtils.entityToMap(rxInitConfig));
//
//
//        AppLog.init(mContext != null ? mContext : context, buildConfig(rxInitConfig), mContext != null ? mContext : activity);
//    }

//    private InitConfig buildConfig(RxInitConfig rxInitConfig) {
//        final InitConfig config = new InitConfig(rxInitConfig.getAppId(), rxInitConfig.getChannel());
//        config.setUriConfig(rxInitConfig.getUri());
//        config.setImeiEnable(rxInitConfig.isImeiEnable());
//        config.setAutoTrackEnabled(rxInitConfig.isAutoTrackEnabled());
//        config.setLogEnable(rxInitConfig.isLogEnable());
//        config.setMacEnable(rxInitConfig.isMacEnable());
//        config.setAndroidIdEnabled(rxInitConfig.isAndroidIdEnabled());
//        config.setIccIdEnabled(rxInitConfig.isIccIdEnabled());
//        config.setSerialNumberEnable(rxInitConfig.isSerialNumberEnable());
//        config.setGaidEnabled(rxInitConfig.isGaidEnabled());
//        config.setGaidTimeOutMilliSeconds(rxInitConfig.getGaidTimeOutMilliSeconds());
//        config.setOperatorInfoEnabled(rxInitConfig.isOperatorInfoEnabled());
//        config.setAutoStart(rxInitConfig.isAutoStart());
//
//
//        config.setEnablePlay(rxInitConfig.isEnablePlay());
//
//
//        return config;
//    }

    /**
     * 用户授权后调用如下方法开始数据采集
     */
//    public void start() {
////        AppLog.start();
//
//        track(null);
//    }
    public void onEventLogin(JSONObject value) {
        RXLogger.i("BDConvert login " + value);
        onEventV3("login", value);
    }

    //    /**
//     * 内置事件: “注册”
//     * @param register_type 注册方式
//     * @param is_success    是否成功
//     */
    public void onEventRegister(String register_type, boolean is_success) {
        if (isRxTrace) {
            Map<String, Object> map = new HashMap<>();
            map.put("sub_event", "register");
            map.put("register_type", register_type);
            map.put("is_success", is_success);
            RXSdkApi.getInstance().dataTrack("#rxtt_ad", "", map);
        }
        RXLogger.i("BDConvert register");
        ConvertReportHelper.onEventRegister(register_type, is_success);
        Map<String, Object> map = new HashMap<>();
        map.put("register_type", register_type);
        map.put("is_success", is_success);
        track(map);
    }

    /**
     * 内置事件 “支付”
     * @param goods_type    商品类型
     * @param goods_name    商品名称
     * @param goods_id      商品ID
     * @param goods_num     商品数量
     * @param goods_channel 支付渠道
     * @param currency      币种
     * @param success       是否成功（必传）
     * @param amount        金额
     */
    public void onEventPurchase(String goods_type, String goods_name, String goods_id, int goods_num, String goods_channel, String currency, boolean success, int amount) {
        Map<String, Object> map = new HashMap<>();
        map.put("sub_event", "purchase");
        map.put("goods_type", goods_type);
        map.put("goods_name", goods_name);
        map.put("goods_id", goods_id);
        map.put("goods_num", goods_num);
        map.put("goods_channel", goods_channel);
        map.put("currency", currency);
        map.put("success", success);
        map.put("amount", amount);
        if (isRxTrace) {
            RXSdkApi.getInstance().dataTrack("#rxtt_ad", "", map);
        }
        ConvertReportHelper.onEventPurchase(goods_type, goods_name, goods_id, goods_num, goods_channel, currency, success, amount);
        track(map);
    }


    /**
     * 关键行为上报
     * @param key   key
     * @param value value
     */
    public void onEventV3(String key, JSONObject value) {
        try {
            setSubEvent(key);
            ConvertReportHelper.onEventV3(key, value);
            track(JSONUtil.toMap(value));
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public void onEventV3(String key, Map<String, Object> value) {
        try {
            setSubEvent(key);
            ConvertReportHelper.onEventV3(key, new JSONObject(value));
            track(value);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

//    /**
//     * 广告按钮点击：gt_ad_button_click ad_type  string
//     * @param ad_type          广告类型
//     * @param ad_position_type 广告点位类型
//     * @param ad_position      广告点位
//     * @param otherParams      其他
//     */
//    public void adButtonClick(String ad_type, String ad_position_type, String ad_position, HashMap<String, Object> otherParams) {
//        WhalerGameHelper.adButtonClick(ad_type, ad_position_type, ad_position, otherParams);
//    }
//
//    /**
//     * 广告开始展示
//     * @param ad_type          广告类型
//     * @param ad_position_type 广告点位类型
//     * @param ad_position      广告点位
//     * @param otherParams      其他
//     */
//    public void adShow(String ad_type, String ad_position_type, String ad_position, HashMap<String, Object> otherParams) {
//        WhalerGameHelper.adShow(ad_type, ad_position_type, ad_position, otherParams);
//    }
//
//    /**
//     * 广告结束展示
//     * @param ad_type          广告类型
//     * @param ad_position_type 广告点位类型
//     * @param ad_position      广告点位
//     * @param result           广告观看结果
//     * @param otherParams      其他
//     */
//    public void adShowEnd(String ad_type, String ad_position_type, String ad_position, String result, HashMap<String, Object> otherParams) {
//        WhalerGameHelper.adShowEnd(ad_type, ad_position_type, ad_position, result, otherParams);
//    }
//
//    /**
//     * （总等级）升级和经验
//     * @param lev         当前玩家等级
//     * @param get_exp     获得经验
//     * @param method      获得经验途径
//     * @param aflev       用户获得经验后等级
//     * @param otherParams 其他
//     */
//    public void levelUp(int lev, int get_exp, String method, int aflev, HashMap<String, Object> otherParams) {
//        WhalerGameHelper.levelUp(lev, get_exp, method, aflev, otherParams);
//    }
//
//    /**
//     * 开始玩法
//     * @param ectype_name 针对闯关性质玩法
//     * @param otherParams 其他
//     */
//    public void startPlay(String ectype_name, HashMap<String, Object> otherParams) {
//        WhalerGameHelper.startPlay(ectype_name, otherParams);
//    }
//
//    /**
//     * 结束玩法
//     * @param ectype_name 针对闯关性质玩法
//     * @param result      玩法的结果
//     * @param duration    消耗时间，单位秒
//     * @param otherParams 其他
//     */
//    public void endPlay(String ectype_name, WhalerGameHelper.Result result, int duration, HashMap<String, Object> otherParams) {
//        WhalerGameHelper.endPlay(ectype_name, result, duration, otherParams);
//    }
//
//    /**
//     * 获得游戏币
//     * @param coin_type   货币类型
//     * @param method      获得途径
//     * @param coin_num    获得数量
//     * @param otherParams 其他
//     */
//    public void getCoins(String coin_type, String method, int coin_num, HashMap<String, Object> otherParams) {
//        WhalerGameHelper.getCoins(coin_type, method, coin_num, otherParams);
//    }
//
//    /**
//     * 消耗游戏币
//     * @param coin_type   货币类型
//     * @param method      消耗途径
//     * @param coin_num    消耗数量
//     * @param otherParams 其他
//     */
//    public void costCoins(String coin_type, String method, int coin_num, HashMap<String, Object> otherParams) {
//        WhalerGameHelper.costCoins(coin_type, method, coin_num, otherParams);
//    }
//
//    /**
//     * 初始化信息
//     * @param lev         玩家等级
//     * @param coin_type   获得货币的类型
//     * @param coin_left   用户身上剩余的货币数量
//     * @param otherParams 其他
//     */
//    public void gameInitInfo(int lev, String coin_type, int coin_left, HashMap<String, Object> otherParams) {
//        WhalerGameHelper.gameInitInfo(lev, coin_type, coin_left, otherParams);
//    }
//
//    /**
//     * 绑定社交账号
//     * @param key   社交账号类型
//     * @param value 是否成功
//     */
//    public void onEventAccessAccount(String key, boolean value) {
//        GameReportHelper.onEventAccessAccount(key, value);
//    }
//
//    /**
//     * 添加支付渠道
//     * @param key   支付渠道
//     * @param value 是否成功
//     */
//    public void onEventAccessPaymentChannel(String key, boolean value) {
//        GameReportHelper.onEventAccessPaymentChannel(key, value);
//    }
//
//    /**
//     * 添加到购物车
//     * @param type      商品类型
//     * @param name      商品名称
//     * @param id        商品ID
//     * @param count     商品数量
//     * @param issuccess 是否成功
//     */
//    public void onEventAddCart(String type, String name, String id, int count, boolean issuccess) {
//        GameReportHelper.onEventAddCart(type, name, id, count, issuccess);
//    }
//
//    // todo 存在异议
//
//    /**
//     * // 添加至收藏，属性：商品类型，商品名称，商品ID，商品数量,是否使用虚拟币种，虚拟币币种，真实货币类型，是否成功
//     * @param var0
//     * @param var1
//     * @param var2
//     * @param var3
//     * @param var4
//     */
//    public void onEventAddToFavorite(String var0, String var1, String var2, int var3, boolean var4) {
//        GameReportHelper.onEventAddToFavorite(var0, var1, var2, var3, var4);
//    }

//    /**
//     * 提交购买/下单
//     * @param goods_type       内容类型
//     * @param goods_name       内容名称
//     * @param goods_id         内容id
//     * @param goods_num        商品数量
//     * @param virtual_currency 是否虚拟币种
//     * @param hq_type          支付渠道
//     * @param currency         币种
//     * @param success          是否成功
//     * @param amount           金额
//     *                         }
//     */
//    public void onEventCheckOut(String goods_type, String goods_name, String goods_id, int goods_num, boolean virtual_currency, String hq_type, String currency, boolean success, int amount) {
//        Map<String, Object> map = new HashMap<>();
//        map.put("sub_event", "checkout");
//        map.put("goods_type", goods_type);
//        map.put("goods_name", goods_name);
//        map.put("goods_id", goods_id);
//        map.put("goods_num", goods_num);
//        map.put("virtual_currency", virtual_currency);
//        map.put("hq_type", hq_type);
//        map.put("currency", currency);
//        map.put("success", success);
//        map.put("amount", amount);
//        if (isRxTrace) {
//            RXSdkApi.getInstance().dataTrack("#rxtt_ad", "", map);
//        }
//        GameReportHelper.onEventCheckOut(goods_type, goods_name, goods_id, goods_num, virtual_currency, hq_type, currency, success, amount);
//        track(map);
//    }
//
//    /**
//     * 创建角色
//     * @param id 角色id
//     */
//    public void onEventCreateGameRole(String id) {
//        GameReportHelper.onEventCreateGameRole(id);
//        Map<String, Object> map = new HashMap<>();
//        map.put("id", id);
//        track(map);
//    }


    /**
     * 登录
     * @param login_type 登录方式
     * @param is_success 是否成功
     */
    public void onEventLogin(String login_type, boolean is_success) {
        Map<String, Object> map = new HashMap<>();
        map.put("sub_event", "login");
        map.put("login_type", login_type);
        map.put("is_success", is_success);
        if (isRxTrace) {
            RXSdkApi.getInstance().dataTrack("#rxtt_ad", "", map);
        }
        onEventLogin(new JSONObject(map));
        track(map);
    }
//
//    /**
//     * 升级
//     * @param level 当前等级
//     */
//    public void onEventUpdateLevel(int level) {
//        GameReportHelper.onEventUpdateLevel(level);
//    }
//
//    /**
//     * 完成教学任务/副本
//     * @param id     任务id
//     * @param type   任务类型
//     * @param name   教学/任务/副本名
//     * @param rank   第几个任务
//     * @param status 状态
//     * @param other  其它描述
//     */
//    public void onEventQuest(String id, String type, String name, int rank, boolean status, String other) {
//        GameReportHelper.onEventQuest(id, type, name, rank, status, other);
//    }

//    /**
//     * 设置用户唯一标识
//     * @param uniqueID 标识
//     */
//    public void setUserUniqueID(String uniqueID) {
//        AppLog.setUserUniqueID(uniqueID);
//    }


}
