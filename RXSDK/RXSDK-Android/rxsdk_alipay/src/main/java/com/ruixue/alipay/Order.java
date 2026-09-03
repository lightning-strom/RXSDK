package com.ruixue.alipay;

public class Order {

    private int code;
    private String msg;
    private DataBean data;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public DataBean getData() {
        return data;
    }

    public void setData(DataBean data) {
        this.data = data;
    }

    public static class DataBean {
        private int amount;
        private String orderNo;
        private String payUrl;
        private String hq_type;
        private String referer;
        private String tradeNo;

        public int getAmount() {
            return amount;
        }

        public void setAmount(int amount) {
            this.amount = amount;
        }

        public String getOrderNo() {
            return orderNo;
        }

        public void setOrderNo(String orderNo) {
            this.orderNo = orderNo;
        }

        public String getPayUrl() {
            return payUrl;
        }

        public void setPayUrl(String payUrl) {
            this.payUrl = payUrl;
        }

        public String getPay_type() {
            return hq_type;
        }

        public void setPay_type(String hq_type) {
            this.hq_type = hq_type;
        }

        public String getReferer() {
            return referer;
        }

        public void setReferer(String referer) {
            this.referer = referer;
        }

        public String getTradeNo() {
            return tradeNo;
        }

        public void setTradeNo(String tradeNo) {
            this.tradeNo = tradeNo;
        }
    }
}
