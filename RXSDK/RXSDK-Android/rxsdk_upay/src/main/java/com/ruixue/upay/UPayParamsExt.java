package com.ruixue.upay;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/9/6
 */
public class UPayParamsExt {


    //网银支付
    public static class NetPay {
        /**
         * 商户订单类型：数字
         * 11、momo  20000vnd或以上的订单才可以用支付
         * 12、银行转账 要300000vnd以上的订单才能下单。小于这个金额，下单会失败。这种类似于银行转账，一般不考虑接入
         * 13、网上银行 50000vnd或以上的订单才可以用支付
         * 10，zalo
         */
        public String type_id;
    }

//    web or wap 充值卡支付
    public static class WWWCardNetPay {
        public String equipment_type;
        public String country_name;
        public String cpInquiry_url;
    }

    // api充值卡支付
    public static class ApiPay {
        public String equipment_type;
        public String vendor;
        public String card_id;
        public String card_num;
    }

}
