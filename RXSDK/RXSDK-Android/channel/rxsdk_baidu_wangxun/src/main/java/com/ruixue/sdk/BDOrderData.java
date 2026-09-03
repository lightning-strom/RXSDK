package com.ruixue.sdk;

import android.text.TextUtils;

import com.baidu.gamesdk.BDGameSDK;
import com.baidu.platformsdk.PayOrderInfo;
import com.google.gson.Gson;
import com.ruixue.billing.OrderData;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.openapi.BDSdkHelper;

import org.json.JSONObject;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/29
 */
public class BDOrderData extends OrderData {

    public PayOrderInfo toPayOrderInfo() throws RXException {
        PayOrderInfo payOrderInfo = new PayOrderInfo();
        payOrderInfo.setTotalPriceCent(getPrice()); // 以分为单位
        payOrderInfo.setRatio(1); // 该参数为非定额支付时生效 (支付金额为0时为非定额支付,具体参见使用手册)
        payOrderInfo.setCooperatorOrderSerial(getOrderNo()); // CP订单号
        payOrderInfo.setProductName(getGoodsName());
        payOrderInfo.setExtInfo(getTransmitArgs() + "test"); // 该字段将会在支付成功后原样返回给CP(不超过500个字符)
        if (TextUtils.isEmpty(BDSdkHelper.getLoginUid())) {
            throw new NullPointerException("baidu LoginUid is null error,please login first");
        }
        payOrderInfo.setCpUid(BDSdkHelper.getLoginUid()); // 必传字段，需要验证uid是否合法,此字段必须是登陆后或者切换账号后保存的uid
        return payOrderInfo;
    }

    public static BDOrderData fromJson(String json) {
        return new Gson().fromJson(json, BDOrderData.class);
    }

    public static BDOrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }
}
