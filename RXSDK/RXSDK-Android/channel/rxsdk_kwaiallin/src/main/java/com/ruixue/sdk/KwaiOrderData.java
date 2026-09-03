package com.ruixue.sdk;

import android.text.TextUtils;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;
import com.kwai.sdk.subbus.pay.model.KwaiPayInfo;
import com.ruixue.billing.OrderData;

import org.json.JSONObject;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/28
 */
public class KwaiOrderData extends OrderData {

    @Keep
    protected ExtBean ext;

    public static class ExtBean {
        @Keep
        protected String app_id;
        @Keep
        protected String channel_id;
        @Keep
        protected String currency_type;
        @Keep
        protected String extension;
        @Keep
        protected String game_id;
        @Keep
        protected String money;
        @Keep
        protected String product_desc;
        @Keep
        protected String product_id;
        @Keep
        protected String product_name;
        @Keep
        protected String product_num;
        @Keep
        protected String role_id;
        @Keep
        protected String role_level;
        @Keep
        protected String role_name;
        @Keep
        protected String server_id;
        @Keep
        protected String server_name;
        @Keep
        protected String user_ip;
        @Keep
        protected String notify_url;
        @Keep
        protected String sign;

        public String getApp_id() {
            return app_id;
        }

        public String getChannel_id() {
            return channel_id;
        }

        public String getCurrency_type() {
            return currency_type;
        }

        public String getExtension() {
            return extension;
        }

        public String getGame_id() {
            return game_id;
        }

        public String getMoney() {
            return money;
        }

        public String getProduct_desc() {
            return product_desc;
        }

        public String getProduct_id() {
            return product_id;
        }

        public String getProduct_name() {
            return product_name;
        }

        public String getProduct_num() {
            return product_num;
        }

        public String getRole_id() {
            return role_id;
        }

        public String getRole_level() {
            return role_level;
        }

        public String getRole_name() {
            return role_name;
        }

        public String getServer_id() {
            return server_id;
        }

        public String getServer_name() {
            return server_name;
        }

        public String getSign() {
            return sign;
        }

        public String getUser_ip() {
            return user_ip;
        }

        public boolean checkParams() {
            return !TextUtils.isEmpty(role_id) && !TextUtils.isEmpty(role_name) && !TextUtils.isEmpty(role_level) && !TextUtils.isEmpty(server_id) && !TextUtils.isEmpty(server_name);
        }

        public KwaiPayInfo toKwaiPayInfo() {
            KwaiPayInfo info = new KwaiPayInfo();
            info.roleId = this.getRole_id();
            info.roleName = this.getRole_name();
            info.roleLevel = this.getRole_level();
            info.serverId = this.getServer_id();
            info.serverName = this.getServer_name();
            info.productId = this.getProduct_id();
            info.productName = this.getProduct_name();
            info.productNum = Integer.parseInt(this.getProduct_num());
            info.productDesc = this.getProduct_desc();
            info.price = Integer.parseInt(this.getMoney());
            info.currencyType = this.getCurrency_type();
            info.notifyUrl = this.notify_url;
            info.userIp = this.getUser_ip();
            info.extension = this.getExtension();
//        info.orderId = this.getOrderNo();

            info.sign = this.getSign();
//        Logger.t("kuaishou").json(new Gson().toJson(info));
 /*        // src为参与签名的字段拼凑出来的字符串，游戏server可以按此进行签名
        String src = Util.getSignSrc(appId, "ks", gameUserId, info);
        //  NativeHandler.getDemoPri() 为游戏cp的私钥，
        // 调试时可以在demo上替换成游戏自己的进行测试， 正式包中，请从服务端下发。
        info.sign = Util.sign(src, NativeHandler.getDemoPri() );
        //  warn 所有签名都必须在 server进行
        Log.d("KwaiPay", "info.sign:" + info.sign);*/
            return info;
        }
    }


    public KwaiPayInfo toKwaiPayInfo() {
        return ext.toKwaiPayInfo();
    }

    public static KwaiOrderData fromJson(String json) {
        return new Gson().fromJson(json, KwaiOrderData.class);
    }

    public static KwaiOrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }

}
