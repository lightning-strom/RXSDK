package com.ruixue.sdk;

import android.app.Activity;

import com.netease.yofun.external.Api;
import com.netease.yofun.external.data.PayInfo;
import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.billing.HQType;

import org.json.JSONObject;

import java.util.Map;

public class YofunBillingImpl extends BillingClient {
    public static final String MUMU = "mumu";

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_HQ_TYPE)) {
            hashMap.put(KEY_HQ_TYPE, MUMU);
        }
        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap,
                                   JSONObject data, RXJSONCallback callback) {

        YofunData orderData = YofunData.fromJson(data);

        PayInfo info = new PayInfo();

        info.setGameOrderId(orderData.getExt().getGameOrderId()); //游戏订单id
        info.setGoodsId(orderData.getExt().getGoodsId()); //商品-id
        info.setGoodsName(orderData.getExt().getGoodsName());  //商品-名称
        info.setGoodsCount(orderData.getExt().getGoodsCount());         //商品-数量
        info.setGoodsPrice(orderData.getExt().getGoodsPrice());     //商品-价格单价
        info.setOrderPrice(orderData.getExt().getOrderPrice());     //订单-金额-单位分（或其它货币最小单位）
        info.setActualPrice(orderData.getExt().getActualPrice());    //订单-实际支付金额-单位分（或其它货币最小单位）
        info.setCurrency(orderData.getExt().getCurrency());
        // 游戏支付回调接口地址
        info.setNotifyUrl(orderData.getExt().getNotifyUrl());
        try {
            info.setReserved(orderData.getTransmitArgs()); // 回传字段，回调通知时原样回传给游戏
        } catch (Exception e) {/*ignore it*/}
        Api.getInstance().pay(activity, info);
    }
}
