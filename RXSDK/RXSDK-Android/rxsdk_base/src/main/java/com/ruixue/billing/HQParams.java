package com.ruixue.billing;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.utils.EntityUtils;

import java.util.Map;

/**
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/11
 */
public class HQParams {

    public static final String KEY_EXT_PAY_TYPE = "hq_type";

//    public static final int CALLBACK_FROM_SERVER = 0;
    /**
     * 支付成功后的回调由客户端发起
     */
    public static final int CALLBACK_FROM_CLIENT = 1;

    protected String hq_type;
    protected String goods_tag;
    protected String trade_no;
    protected String currency;
    protected String notify_url;
    protected String transmit_args;
    protected String plugin_name;
    protected int plugin_version;
    protected int indulge_auth = 0;
    protected int age;
    protected int callback_from;
    protected int is_debug;
    protected int env;


    protected boolean use_h5;

    /**
     * tppe =aums 时
     * pay :wechat,alipay,uac,mini_alipay
     * subAppId aums微信支付appid
     */
    protected Map<String, Object> ext;
    protected Map<String, Object> game_info;
    protected int user_real_price = -1;
    protected String user_real_currency;

    public HQParams() {
    }

    public HQParams(Builder builder) {
        this.hq_type = builder.hq_type;
        this.goods_tag = builder.goods_tag;
        this.trade_no = builder.trade_no;
        this.currency = builder.currency;
        this.notify_url = builder.notify_url;
        this.callback_from = builder.callback_from;
        this.transmit_args = builder.transmit_args;
        this.plugin_name = builder.plugin_name;
        this.plugin_version = builder.plugin_version;
        this.indulge_auth = builder.indulge_auth;
        this.age = builder.age;
        this.is_debug = builder.is_debug;
        this.env = builder.env;
        this.ext = builder.ext;
        this.user_real_price = builder.user_real_price;
        this.user_real_currency = builder.user_real_currency;
        this.game_info = builder.game_info;
    }

    public boolean isUseH5() {
        return use_h5;
    }

    public String getPayType() {
        return hq_type;
    }

    public String getSubPayType() {
        if (ext != null && ext.containsKey("tag")) {
            String tag = (String) ext.get("tag");
            if (null != tag) {
                String[] parts = tag.split("@");
                if (parts.length > 1) {
                    return parts[1];
                }
            }
        }
        if (ext != null && ext.containsKey("hq_type")) {
            return (String) ext.get("hq_type");
        } else {
            return hq_type;
        }
    }

    public Map<String, Object> getExt() {
        return ext;
    }

    @Nullable
    public String getExtPayType() {
        if (ext != null) {
            return (String) ext.get(KEY_EXT_PAY_TYPE);
        } else {
            return null;
        }
    }

    public static HQParams create(@NonNull Map<String, Object> map) {
        return EntityUtils.mapToEntity(map, HQParams.class);
    }

    public Map<String, Object> toMap() {
        return EntityUtils.entityToMap(this, true, false);
    }

    public String getPay_type() {
        return hq_type;
    }

    public String getGoods_tag() {
        return goods_tag;
    }

    public String getTrade_no() {
        return trade_no;
    }

    public String getCurrency() {
        return currency;
    }

    public String getNotify_url() {
        return notify_url;
    }

    public int getCallback_from() {
        return callback_from;
    }

    public String getTransmit_args() {
        return transmit_args;
    }

    public static class GameInfo {
        public String cp_game_character_id;
        public String cp_game_area_id;

        public void setCpGameCharacterId(String cp_game_character_id) {
            this.cp_game_character_id = cp_game_character_id;
        }

        public void setCpGameAreaId(String cp_game_area_id) {
            this.cp_game_area_id = cp_game_area_id;
        }

        public Map<String, Object> toMap() {
            return EntityUtils.entityToMap(this, true, true);
        }
    }

    public static class Builder {
        private String hq_type;
        private String goods_tag;
        private String trade_no;
        private String currency = "CNY";
        private String notify_url;
        private String transmit_args;
        private int callback_from;
        private int is_debug = 0;
        private int env = 0;
        private String plugin_name;
        private int plugin_version;
        protected int indulge_auth = 0;

        protected int user_real_price = -1;
        protected String user_real_currency;

        protected int age;

        protected Map<String, Object> game_info;

        public Map<String, Object> getGameInfo() {
            return game_info;
        }

        public Builder setGameInfo(Map<String, Object> game_info) {
            this.game_info = game_info;
            return this;
        }

        public Builder setGameInfo(GameInfo game_info) {
            this.game_info = EntityUtils.entityToMap(game_info, true, true);
            return this;
        }

        public int getUserRealPrice() {
            return user_real_price;
        }

        public Builder setUserRealPrice(int user_real_price) {
            this.user_real_price = user_real_price;
            return this;
        }

        public String getUserRealCurrency() {
            return user_real_currency;
        }

        public Builder setUserRealCurrency(String user_real_currency) {
            this.user_real_currency = user_real_currency;
            return this;
        }


        public Builder setIndulgeAuth(int indulge_auth) {
            this.indulge_auth = indulge_auth;
            return this;

        }

        public Builder setAge(int age) {
            this.age = age;
            return this;
        }

        public Builder setPluginMame(String plugin_name) {
            this.plugin_name = plugin_name;
            return this;
        }

        public Builder setPluginVersion(int plugin_version) {
            this.plugin_version = plugin_version;
            return this;
        }


        private Map<String, Object> ext;

        public Builder setExt(Map<String, Object> ext) {
            this.ext = ext;
            return this;
        }

        public Builder setHQType(String hq_type) {
            this.hq_type = hq_type;
            return this;
        }

        public Builder setGoodsTag(String goods_tag) {
            this.goods_tag = goods_tag;
            return this;
        }

        public Builder setTradeNo(String trade_no) {
            this.trade_no = trade_no;
            return this;
        }

        public Builder setCurrency(String currency) {
            this.currency = currency;
            return this;
        }

        public Builder setNotifyUrl(String notify_url) {
            this.notify_url = notify_url;
            return this;
        }

        public Builder setCallbackFrom(int callback_from) {
            this.callback_from = callback_from;
            return this;
        }

        public Builder setTransmitArgs(String transmit_args) {
            this.transmit_args = transmit_args;
            return this;
        }

        public void setIsDebug(boolean is_debug) {
            this.is_debug = is_debug ? 1 : 0;
        }

        public void setEnv(boolean is_sandbox) {
            this.env = is_sandbox ? 1 : 0;
        }

        public HQParams build() {
            return new HQParams(this);
        }
    }
}
