package com.ruixue.sdk.gdt;


import android.content.Context;
import android.text.TextUtils;

import com.qq.gdt.action.ActionUtils;
import com.qq.gdt.action.ChannelType;
import com.qq.gdt.action.GDTAction;
import com.ruixue.RuiXueSdk;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.ISdkEvent;
import com.ruixue.utils.ObjectUtils;

import java.util.Map;

// Created by wangliang on 2025/12/1.
public class GDTSdkWrapper implements ISdkEvent {

    static class Single {
        final static GDTSdkWrapper INSTANCE = new GDTSdkWrapper();
    }

    public static GDTSdkWrapper getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public String getADChannel() {
        return "gdt";
    }

    @Override
    public void onEvent(String eventName, Map<String, Object> params) {
        switch (eventName) {
            case Event.ACTIVATED:
                init(RuiXueSdk.getCurrentActivity(), params);
                break;
            case Event.REGISTER:
                if (needAutoReport) {
                    onEventRegister(ObjectUtils.toString(params.get("method")), true);
                } else {
                    RXLogger.d("GDTSdkWrapper register not need auto report");
                }
                break;
            case Event.LOGIN:
                if (needAutoReport) {
                    if (RuiXueSdk.getLoginData() != null) {
                        String method = RuiXueSdk.getLoginData().getMethod();
                        if (RuiXueSdk.getLoginData().isNewUser()) {
                            onEventRegister(method, true);
                        }
                        onEventLogin(method, true);
                    }
                } else {
                    RXLogger.d("GDTSdkWrapper login not need auto report");
                }
                break;
            default:
                break;
        }
    }

    private boolean needAutoReport = false;

    private void init(Context context, Map<String, Object> params) {
        RXLogger.d("GDTSdkWrapper init");
        try {
            if (params == null) {
                needAutoReport = false;
                return;
            }
            int tm = ObjectUtils.toInt(params.get("tm"));
            if (tm != 1) {
                needAutoReport = false;
                return;
            }
            needAutoReport = true;
            String sid = ObjectUtils.toString(params.get("sid"));
            String secretKey = ObjectUtils.toString(params.get("sk"));
            String channel = ObjectUtils.toString(params.get("ch"));
            String channelId = ObjectUtils.toString(params.get("chid"));
            GDTAction.init(context.getApplicationContext(), sid, secretKey, getChannelType(channel), channelId);
            GDTAction.start();
        } catch (Exception e) {
            e.printStackTrace();
            needAutoReport = false;
            RXLogger.d("GDTSdkWrapper init error");
        }
    }

    private ChannelType getChannelType(String channel) {
        if (TextUtils.isEmpty(channel)) {
            return ChannelType.CHANNEL_TENCENT;
        }
        switch (channel) {
            case "natural":
                return ChannelType.CHANNEL_NATURAL;
            case "bytedance":
                return ChannelType.CHANNEL_BYTEDANCE;
            case "kuaishou":
                return ChannelType.CHANNEL_KUAISHOU;
            case "alibaba":
                return ChannelType.CHANNEL_ALIBABA;
            case "baidu":
                return ChannelType.CHANNEL_BAIDU;
            case "others":
                return ChannelType.CHANNEL_OTHERS;
            default:
                return ChannelType.CHANNEL_TENCENT;
        }
    }

    private void onEventRegister(String method, boolean success) {
        RXLogger.d("GDTSdkWrapper onEventRegister method:" + method + " success:" + success);
        ActionUtils.onRegister(method, success);
    }

    private void onEventLogin(String method, boolean success) {
        RXLogger.d("GDTSdkWrapper onEventLogin method:" + method + " success:" + success);
        ActionUtils.onLogin(method, success);
    }

    /**
     * 初始化
     *
     * @param context
     * @param sid
     * @param secretKey
     * @param channel
     * @param channelId
     */
    public void init(Context context, String sid, String secretKey, String channel, String channelId) {
        GDTAction.init(context.getApplicationContext(), sid, secretKey, getChannelType(channel), channelId);
        GDTAction.start();
    }

    /**
     * 用户注册时事件
     *
     * @param method 表示注册方式
     * @param success 是否注册成功
     */
    public void reportRegister(String method, boolean success) {
        onEventRegister(method, success);
    }

    /**
     * 用户登录时事件
     *
     * @param method 表示登录的方式，如游戏账号、手机号等
     * @param success 是否登录成功
     */
    public void reportLogin(String method, boolean success) {
        onEventLogin(method, success);
    }

    /**
     * 用户下单时事件
     *
     * @param type                商品类型
     * @param name                商品名称
     * @param id                  商品 id
     * @param number              商品数量
     * @param isVirtualCurrency   是否使用虚拟货币
     * @param virtualCurrencyType 虚拟货币类型
     * @param currency            真实货币类型
     * @param success             下单是否成功
     */
    public void reportCheckout(String type, String name, String id, int number, boolean isVirtualCurrency, String virtualCurrencyType, String currency, boolean success) {
        RXLogger.d("GDTSdkWrapper reportCheckout type:" + type + " name:" + name + " id:" + id + " number:" + number + " isVirtualCurrency:" + isVirtualCurrency + " virtualCurrencyType:" + virtualCurrencyType + " currency:" + currency + " success:" + success);
        ActionUtils.onCheckout(type, name, id, number, isVirtualCurrency, virtualCurrencyType, currency, success);
    }


    /**
     * 用户支付时事件
     *
     * @param goodsType    商品类型
     * @param goodsName    商品名称
     * @param goodsId      商品 id
     * @param number       商品数量
     * @param goodsChannel 支付渠道名，如支付宝、微信等
     * @param currency     真是货币类型，如 "CNY"
     * @param value        真实货币金额，单位分
     * @param success      支付是否成功
     */
    public void reportPurchase(String goodsType, String goodsName, String goodsId, int number, String goodsChannel, String currency, int value, boolean success) {
        RXLogger.d("GDTSdkWrapper reportPurchase goodsType:" + goodsType + " goodsName:" + goodsName + " goodsId:" + goodsId + " number:" + number + " goodsChannel:" + goodsChannel + " currency:" + currency + " value:" + value + " success:" + success);
        ActionUtils.onPurchase(goodsType, goodsName, goodsId, number, goodsChannel, currency, value, success);
    }

    /**
     * 创建游戏角色
     *
     * @param role 游戏角色名称
     */
    public void reportCreateRole(String role) {
        RXLogger.d("GDTSdkWrapper reportCreateRole role:" + role);
        ActionUtils.onCreateRole(role);
    }

    /**
     * 完成关键事件（如新手教学）时
     *
     * @param id      事件 id
     * @param type    事件类型
     * @param name    事件名称
     * @param number  第几个事件
     * @param desc    事件描述
     * @param success 事件是否完成
     */
    public void reportQuestFinish(String id, String type, String name, int number, String desc, boolean success) {
        RXLogger.d("GDTSdkWrapper reportQuestFinish id:" + id + " type:" + type + " name:" + name + " number:" + number + " desc:" + desc + " success:" + success);
        ActionUtils.onQuestFinish(id, type, name, number, desc, success);
    }

    /**
     * 分享
     *
     * @param channel 分享渠道
     * @param success 是否分享成功
     */
    public void reportShare(String channel, boolean success) {
        RXLogger.d("GDTSdkWrapper reportShare channel:" + channel + " success:" + success);
        ActionUtils.onShare(channel, success);
    }

    /**
     * 游戏升级时
     *
     * @param level 升级后的等级
     */
    public void reportUpdateLevel(int level) {
        RXLogger.d("GDTSdkWrapper reportUpdateLevel level:" + level);
        ActionUtils.onUpdateLevel(level);
    }

    /**
     * 用户对 App 评分时
     *
     * @param value 用户给出的评分值
     */
    public void reportRateApp(float value) {
        RXLogger.d("GDTSdkWrapper reportRateApp value:" + value);
        ActionUtils.onRateApp(value);
    }

    /**
     * 查看内容/商品详情时
     *
     * @param type 内容/商品类型
     * @param name 内容/商品名称
     * @param id   内容/商品的 id
     */
    public void reportViewContent(String type, String name, String id) {
        RXLogger.d("GDTSdkWrapper reportViewContent type:" + type + " name:" + name + " id:" + id);
        ActionUtils.onViewContent(type, name, id);
    }

    /**
     * 加入购物车时
     *
     * @param type    商品类型
     * @param name    商品名称
     * @param id      商品 id
     * @param number  商品数量
     * @param success 加入购物车是否成功
     */
    public void reportAddToCart(String type, String name, String id, int number, boolean success) {
        RXLogger.d("GDTSdkWrapper reportAddToCart type:" + type + " name:" + name + " id:" + id + " number:" + number + " success:" + success);
        ActionUtils.onAddToCart(type, name, id, number, success);
    }
}
