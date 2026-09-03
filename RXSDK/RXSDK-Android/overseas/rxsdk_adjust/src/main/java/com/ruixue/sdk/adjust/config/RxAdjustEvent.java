package com.ruixue.sdk.adjust.config;


import com.adjust.sdk.AdjustEvent;
import com.adjust.sdk.Util;

import java.util.LinkedHashMap;
import java.util.Map;

public class RxAdjustEvent {
    public String eventToken;
    public Double revenue;
    public String currency;
    public Map<String, String> callbackParameters;
    public Map<String, String> partnerParameters;
    public String orderId;
    public String callbackId;

    /**
     * 实例化事件
     * @param var1 事件码
     */
    public RxAdjustEvent(String var1) {
        this.eventToken = var1;
    }

    /**
     * 设置收入
     * @param var1 收入数值
     * @param var3 收入单位
     */
    public void setRevenue(double var1, String var3) {
        this.revenue = var1;
        this.currency = var3;
    }

    /**
     * 添加回传参数
     * @param key 参数key
     * @param value 参数value
     */
    public void addCallbackParameter(String key, String value) {
        if (!Util.isValidParameter(key, "key", "Callback")) return;
        if (!Util.isValidParameter(value, "value", "Callback")) return;

        if (callbackParameters == null) {
            callbackParameters = new LinkedHashMap<String, String>();
        }

        String previousValue = callbackParameters.put(key, value);

    }

    /**
     * 添加合作伙伴回传参数
     * @param key 参数key
     * @param value 参数value
     */
    public void addPartnerParameter(String key, String value) {
        if (!Util.isValidParameter(key, "key", "Partner")) return;
        if (!Util.isValidParameter(value, "value", "Partner")) return;

        if (partnerParameters == null) {
            partnerParameters = new LinkedHashMap<String, String>();
        }

        String previousValue = partnerParameters.put(key, value);

    }

    /**
     * 设置交易ID
     * @param var1  交易ID
     */
    public void setOrderId(String var1) {
        this.orderId = var1;
    }

    /**
     * 回传标识符
     * @param var1 标识符
     */
    public void setCallbackId(String var1) {
        this.callbackId = var1;
    }

    public static AdjustEvent copy(RxAdjustEvent rxAdjustEvent) {
        AdjustEvent adjustEvent = new AdjustEvent(rxAdjustEvent.eventToken);
        if (rxAdjustEvent.revenue != null) {
            adjustEvent.setRevenue(rxAdjustEvent.revenue, rxAdjustEvent.currency);
        }
        adjustEvent.setOrderId(rxAdjustEvent.orderId);
        if (rxAdjustEvent.callbackParameters != null) {
            for (String key : rxAdjustEvent.callbackParameters.keySet()) {
                adjustEvent.addCallbackParameter(key, rxAdjustEvent.callbackParameters.get(key));
            }
        }
        if (rxAdjustEvent.partnerParameters != null) {
            for (String key : rxAdjustEvent.partnerParameters.keySet()) {
                adjustEvent.addPartnerParameter(key, rxAdjustEvent.partnerParameters.get(key));
            }
        }
        adjustEvent.setCallbackId(rxAdjustEvent.callbackId);
        return adjustEvent;
    }
}
