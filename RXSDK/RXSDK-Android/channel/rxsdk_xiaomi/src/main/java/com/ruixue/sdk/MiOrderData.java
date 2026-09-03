package com.ruixue.sdk;

import android.text.TextUtils;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.ruixue.billing.OrderData;
import com.ruixue.logger.RXLogger;
import com.xiaomi.gamecenter.sdk.entry.MiBuyInfo;

import org.json.JSONObject;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/27
 */
public class MiOrderData extends OrderData {

    public ExtBean getExt() {
        return ext;
    }

    @Keep
    private ExtBean ext;

    public static MiOrderData fromJson(String json) {
        return new Gson().fromJson(json, MiOrderData.class);
    }

    public static MiOrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }

    public MiBuyInfo toMiBuyInfo() {
        MiBuyInfo miBuyInfo = new MiBuyInfo();
        if (ext != null) {
            miBuyInfo.setCpOrderId(getOrderNo()); //订单号唯一（不为空）
            if (!TextUtils.isEmpty(ext.getGoodsTag())) { //商品代码，开发者申请获得（不为空）
                miBuyInfo.setProductCode(ext.getGoodsTag());
                miBuyInfo.setCount(ext.getCount()); //购买数量(商品数量最大9999，最小1)（不为空）
            } else {
                // 按金额付费  必须是大于1的整数，10代表10米币，即10元人民币（不为空）
                miBuyInfo.setAmount(getPrice()/100);
            }
            if (!TextUtils.isEmpty(transmit_args)) {
                miBuyInfo.setCpUserInfo(transmit_args);
            }
        }else {
            RXLogger.e("mi toMiBuyInfo ext null error");
        }
        return miBuyInfo;
    }

    public static class ExtBean {
         @Keep
         private String third_tag;

        @Keep
        private final int count = 1;

        //购买数量(商品数量最大9999，最小1)（商品数量，按金额付费请勿设置）
        public int getCount() {
            return count;
        }

        /**
         *
         * @return  计费点，按金额付费请勿设置
         */
        public String getGoodsTag() {
            return third_tag;
        }
    }
}
