package com.ruixue.sdk;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.ruixue.billing.OrderData;

import org.json.JSONObject;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/7/9
 */
public class BiliBiliOrderData extends OrderData {
    public ExtBean getExt() {
        return ext;
    }

    @Keep
    private ExtBean ext;

    //https://open.biligame.com/wiki/index.html
//uid	bilibili平台用户的唯一标识
//username	bilibili平台用户昵称
//role	用户游戏内角色名，长度不超过64
//serverId	bilibili分配的区服id
//total_fee	本次交易金额，单位：分（注意，total_fee的值必须为整数，并且在1~100000之间)
//game_money	游戏内货币，即本次交易购买的游戏内货币
//out_trade_no	商户订单号，8-32位字符，用于对账用
//subject	商品名称，如：金币。（由于支付宝不支持特殊字符 % &，所以参数中不能包含 % &）
//body	商品简单描述。（参数中不能包含 % &）
//extension_info	支付接口的额外参数（请不要传入emoji等特殊字符），会在服务器异步回调中原样传回，长度不超过255
//notify_url	异步通知地址，为空时，使用正式支付回调地址进行支付回调，否则使用该地址进行支付回调，本字段用于游戏线下测试时支付异步通知地址，游戏包上线前请将此字段设置为空（""）
//order_sign	订单参数签名，请在服务端完成订单参数签名
//listener	OrderCallbackListener：监听器类
    public static class ExtBean {
        @Keep
        int game_money;
        @Keep
        String bili_uid;
        @Keep
        String bili_username;
        @Keep
        String bili_role;
        @Keep
        String bili_server_id;
        @Keep
        int total_fee;
        String notify_url;
        @Keep
        String out_trade_no;
        @Keep
        String order_sign;
        @Keep
        String body;
        @Keep
        String subject;

        public int getGame_money() {
            return game_money;
        }

        public String getBili_uid() {
            return bili_uid;
        }

        public String getBili_username() {
            return bili_username;
        }

        public String getBili_role() {
            return bili_role;
        }

        public String getBili_server_id() {
            return bili_server_id;
        }

        public int getTotal_fee() {
            return total_fee;
        }

        public String getNotify_url() {
            return notify_url;
        }

        public String getOut_trade_no() {
            return out_trade_no;
        }

        public String getOrder_sign() {
            return order_sign;
        }

        public String getBody() {
            return body;
        }

        public String getSubject() {
            return subject;
        }
//        String userName;
//        String uid;
//        String nickname;
//        //        String notify_url; //不为空的话支付后异步通知到此地址，否则异步通知到正式地址，此字段可用于沙盒支付，正式上线前请置空
//        String out_trade_number = String.valueOf(System.currentTimeMillis());
//        int gameMoney;
//        int money;
//        String secret_key;
//        String server_id;
//        String sin_data;
//        //秘钥为服务端secretKey
//        String order_sign;
    }

    public static BiliBiliOrderData fromJson(String json) {
        return new Gson().fromJson(json, BiliBiliOrderData.class);
    }

    public static BiliBiliOrderData fromJson(JSONObject jsonObj) {
        if (null != jsonObj) {
            return fromJson(jsonObj.toString());
        } else {
            return null;
        }
    }

}
