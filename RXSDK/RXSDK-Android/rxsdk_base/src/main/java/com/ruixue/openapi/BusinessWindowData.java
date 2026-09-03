package com.ruixue.openapi;

import androidx.annotation.Keep;

import com.google.gson.Gson;
import com.google.gson.annotations.SerializedName;

import java.util.List;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/5/31
 */

// BusinessWindowData.java
public class BusinessWindowData {
    /**
     * 按钮列表
     */
    @Keep
    private String[] buttons;
    /**
     * 支付配置
     */
    @Keep
    private Map<String, Object> payment;
    /**
     * 奖励配置
     */
    @Keep
    private List<Object> rewards;
    /**
     * 窗口标识
     */
    @Keep
    @SerializedName(value = "window_key", alternate = {"windowKey"})
    private String windowKey;

    @Keep
    private String sign;

    public String getSign() {
        return sign;
    }

    public String[] getButtons() {
        return buttons;
    }

    public void setButtons(String[] value) {
        this.buttons = value;
    }

    public Map<String, Object> getPayment() {
        return payment;
    }


    public List<Object> getRewards() {
        return rewards;
    }


    public String getWindowKey() {
        return windowKey;
    }

    public String toJson() {
        return new Gson().toJson(this);
    }

// BillingPoint.java


    /**
     * 计费点配置
     */
    public static class BillingPoint {
        /**
         * 计费点标识
         */
        @Keep
        @SerializedName(value = "billing_point_key", alternate = {"billingPointKey"})
        private String billingPointKey;

        public String getBillingPointKey() {
            return billingPointKey;
        }


    }

// Payment.java


    /**
     * 支付配置
     */
    public class Payment {
        /**
         * 计费点配置
         */
        @Keep
        @SerializedName(value = "billing_point", alternate = {"billingPoint"})
        private BillingPoint billingPoint;
        /**
         * 道具配置
         */
        @Keep
        private Props props;
        /**
         * 支付方式，1 无消耗 2 道具 3 计费点
         */
        @Keep
        private long type;

        public BillingPoint getBillingPoint() {
            return billingPoint;
        }


        public Props getProps() {
            return props;
        }


        public long getType() {
            return type;
        }

    }

    /**
     * 道具配置
     */
    public static class Props {
        /**
         * 道具数量
         */
        @Keep
        private long num;
        /**
         * 道具标识
         */
        @Keep
        @SerializedName(value = "props_key", alternate = {"propsKey"})
        private String propsKey;

        public long getNum() {
            return num;
        }


        public String getPropsKey() {
            return propsKey;
        }

    }

// Reward.java


    public static class Reward {
        /**
         * 奖励的道具数量
         */
        @Keep
        private Long num;
        /**
         * 奖励的道具标识
         */
        @Keep
        @SerializedName(value = "props_key", alternate = {"propsKey"})
        private String propsKey;

        public Long getNum() {
            return num;
        }

        public void setNum(Long value) {
            this.num = value;
        }

        public String getPropsKey() {
            return propsKey;
        }

        public void setPropsKey(String value) {
            this.propsKey = value;
        }
    }

}