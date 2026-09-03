package com.ruixue.demo.api.module;

import android.app.Activity;

import androidx.annotation.NonNull;

import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;

import com.ruixue.RuiXueSdk;
import com.ruixue.callback.RXUICallback;
import com.ruixue.demo.GlobalConfig;
import com.ruixue.demo.api.ButtonModule;
import com.ruixue.demo.config.DemoTestConfig;
import com.ruixue.demo.helper.BillingHelper;
import com.ruixue.demo.helper.PayTestHelper;
import com.ruixue.demo.v2.DemoManager;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginData;
import com.ruixue.qipai.R;

import java.util.HashMap;
import java.util.Map;

public class PayModule implements ButtonModule {

    private final Activity activity;
    private final DemoManager.ResultCallback callback;
    private final RXUICallback jsonCallback;
    private final BillingHelper billingHelper;

    public PayModule(@NonNull Activity activity,
                     @NonNull DemoManager.ResultCallback callback,
                     @NonNull RXUICallback jsonCallback) {
        this.activity = activity;
        this.callback = callback;
        this.jsonCallback = jsonCallback;
        this.billingHelper = new BillingHelper();
        initBillingSpinner();
    }

    private void initBillingSpinner() {
        billingHelper.setOnGoodsTagChangedListener(tag -> PayTestHelper.selectedGoodsTag = tag);
        Spinner spinner = activity.findViewById(R.id.billing_spinner);
        EditText customInput = activity.findViewById(R.id.billing_custom_input);
        TextView tagPreview = activity.findViewById(R.id.billing_tag_preview);
        if (spinner != null) {
            billingHelper.bind(activity, spinner, customInput, tagPreview);
        }
        PayTestHelper.selectedGoodsTag = billingHelper.getSelectedGoodsTag();
    }

    @Override
    public void registerButtons(Registrar registrar) {
        // 常用
        registrar.register(R.id.pay_wechat, () -> PayTestHelper.pay(activity, "wechat", jsonCallback));
        registrar.register(R.id.pay_alipay, () -> PayTestHelper.pay(activity, "alipay", jsonCallback));
        registrar.register(R.id.pay_yeepay, () -> PayTestHelper.pay(activity, "yeepay", jsonCallback));
        registrar.register(R.id.pay_xingyi, () -> PayTestHelper.pay(activity, "xy", jsonCallback));
        registrar.register(R.id.payChannel, () -> PayTestHelper.pay(activity, (String) null, jsonCallback));
        registrar.register(R.id.payExchange, () -> PayTestHelper.exchange(activity, jsonCallback));

        // H5/Web
        registrar.register(R.id.pay_wechath5, () -> PayTestHelper.pay(activity, "wch", jsonCallback));
        registrar.register(R.id.pay_alipayh5, () -> PayTestHelper.pay(activity, "aph", jsonCallback));
        registrar.register(R.id.pay_xingyi_h5, this::payXingYiH5);
        registrar.register(R.id.web_pay, this::payWebView);
        registrar.register(R.id.jdpay, this::payJd);
        registrar.register(R.id.suning_wechat, () -> paySuning("wechat"));
        registrar.register(R.id.suning_alipay, () -> paySuning("alipay"));

        // 海外
        registrar.register(R.id.google, () -> PayTestHelper.pay(activity, "google", jsonCallback));
        registrar.register(R.id.payermax_api, this::payPayerMax);
        registrar.register(R.id.xsolla, this::payXsolla);
        registrar.register(R.id.pay_aptoide, () -> paySimple("aptoide"));
        registrar.register(R.id.checkout, this::payCheckout);
        registrar.register(R.id.unipin, this::payUniPin);
        registrar.register(R.id.utg, this::payUtg);
        registrar.register(R.id.waffo, () -> {
            Map<String, Object> p = new HashMap<>();
            p.put("hq_type", "waffo");
            p.put("goods_tag", DemoTestConfig.GOODS_TAG_WAFFO);
            PayTestHelper.pay(activity, p, jsonCallback);
        });

        // 银联
        registrar.register(R.id.aums_wechat, () -> payAums("wechat"));
        registrar.register(R.id.aums_minigame, this::payAumsMiniGame);
        registrar.register(R.id.aums_alipay, () -> payAums("alipay"));
        registrar.register(R.id.aums_uac, this::payAumsUac);

        // UPay
        registrar.register(R.id.upay_net, this::payUpayNet);
        registrar.register(R.id.upay_www, this::payUpayWww);
        registrar.register(R.id.upay_api, this::payUpayApi);

        // 瑞雪H5
        registrar.register(R.id.pay_ruixueh5, this::payRuixueH5);
    }

    // ==================== 支付方法实现 ====================

    private void payWebView() {
        com.ruixue.view.RXWebView rxWebView = new com.ruixue.view.RXWebView(activity);
        rxWebView.loadUrl(DemoTestConfig.WEB_PAY_URL);
        rxWebView.show();
    }

    private void payJd() {
        Map<String, Object> pay = new HashMap<>();
        Map<String, Object> ext = new HashMap<>();
        ext.put("callback_url", DemoTestConfig.JD_CALLBACK_URL);
        pay.put("hq_type", "jdjh");
        pay.put("ext", ext);
        PayTestHelper.pay(activity, pay, jsonCallback);
    }

    private void paySuning(String subType) {
        Map<String, Object> pay = new HashMap<>();
        Map<String, Object> ext = new HashMap<>();
        ext.put("hq_type", subType);
        if ("wechat".equals(subType)) {
            ext.put("appid", GlobalConfig.getWxAppId());
        }
        pay.put("hq_type", "suning");
        pay.put("ext", ext);
        PayTestHelper.pay(activity, pay, jsonCallback);
    }

    private void paySimple(String hqType) {
        Map<String, Object> pay = new HashMap<>();
        pay.put("hq_type", hqType);
        pay.put("ext", new HashMap<>());
        PayTestHelper.pay(activity, pay, jsonCallback);
    }

    private void payPayerMax() {
        Map<String, Object> pay = new HashMap<>();
        Map<String, Object> ext = new HashMap<>();
        ext.put("language", "zh");
        ext.put("frontCallbackUrl", DemoTestConfig.PAYERMAX_FRONT_CALLBACK);
        pay.put("hq_type", "payermax");
        pay.put("currency", DemoTestConfig.CURRENCY_MYR);
        pay.put("env", DemoTestConfig.ENV_TEST);
        pay.put("ext", ext);
        PayTestHelper.pay(activity, pay, jsonCallback);
    }

    private void payXsolla() {
        Map<String, Object> pay = new HashMap<>();
        Map<String, Object> ext = new HashMap<>();
        LoginData ld = RuiXueSdk.getLoginData();
        ext.put("user_name", ld != null ? ld.getNickname() : "test");
        pay.put("hq_type", "xsolla_inapp");
        pay.put("env", DemoTestConfig.ENV_TEST);
        pay.put("ext", ext);
        PayTestHelper.pay(activity, pay, jsonCallback);
    }

    private void payCheckout() {
        Map<String, Object> pay = new HashMap<>();
        Map<String, Object> ext = new HashMap<>();
        LoginData ld = RuiXueSdk.getLoginData();
        ext.put("user_name", ld != null ? ld.getNickname() : "test");
        ext.put("country_code", DemoTestConfig.CHECKOUT_COUNTRY);
        ext.put("return_url", DemoTestConfig.CHECKOUT_RETURN_URL);
        pay.put("hq_type", "co");
        pay.put("env", DemoTestConfig.ENV_TEST);
        pay.put("is_debug", 1);
        pay.put("goods_tag", DemoTestConfig.GOODS_TAG_CHECKOUT);
        pay.put("currency", DemoTestConfig.CURRENCY_HKD);
        pay.put("ext", ext);
        pay.put("age", 18);
        pay.put("openid", DemoTestConfig.CHECKOUT_OPENID);
        pay.put("h5_setting_id", DemoTestConfig.CHECKOUT_H5_SETTING_ID);
        pay.put("h5_platform_id", DemoTestConfig.CHECKOUT_H5_PLATFORM_ID);
        pay.put("trade_no", String.valueOf(System.currentTimeMillis()));
        pay.put("notify_url", DemoTestConfig.NOTIFY_URL);
        PayTestHelper.pay(activity, pay, jsonCallback);
    }

    private void payUniPin() {
        Map<String, Object> pay = new HashMap<>();
        pay.put("hq_type", "unipin");
        pay.put("env", DemoTestConfig.ENV_TEST);
        pay.put("currency", DemoTestConfig.CURRENCY_IDR);
        pay.put("ext", new HashMap<>());
        PayTestHelper.pay(activity, pay, jsonCallback);
    }

    private void payUtg() {
        Map<String, Object> pay = new HashMap<>();
        Map<String, Object> ext = new HashMap<>();
        ext.put("channel_id", DemoTestConfig.UTG_CHANNEL_ID);
        pay.put("hq_type", "utg");
        pay.put("ext", ext);
        PayTestHelper.pay(activity, pay, jsonCallback);
    }

    private void payAums(String subType) {
        Map<String, Object> pay = new HashMap<>();
        Map<String, Object> ext = new HashMap<>();
        ext.put("hq_type", subType);
        pay.put("hq_type", "aums");
        if ("wechat".equals(subType)) {
            ext.put("subAppId", GlobalConfig.getWxAppId());
        }
        pay.put("ext", ext);
        PayTestHelper.pay(activity, pay, jsonCallback);
    }

    private void payAumsMiniGame() {
        Map<String, Object> pay = new HashMap<>();
        Map<String, Object> ext = new HashMap<>();
        ext.put("hq_type", "minigame");
        ext.put("pre_mini", "Y");
        ext.put("subAppId", GlobalConfig.getWxAppId());
        pay.put("hq_type", "aums");
        pay.put("ext", ext);
        PayTestHelper.pay(activity, pay, jsonCallback);
    }

    private void payAumsUac() {
        Map<String, Object> pay = new HashMap<>();
        Map<String, Object> ext = new HashMap<>();
        ext.put("hq_type", "uac");
        ext.put("supportBank", "CCB");
        ext.put("invokeType", "APP");
        pay.put("hq_type", "aums");
        pay.put("goods_tag", DemoTestConfig.GOODS_TAG_AUMS_UAC);
        pay.put("ext", ext);
        PayTestHelper.pay(activity, pay, jsonCallback);
    }

    private void payXingYiH5() {
        Map<String, Object> ext = new HashMap<>();
        ext.put("is_h5", 1);
        Map<String, Object> pay = new HashMap<>();
        pay.put("hq_type", "xy");
        pay.put("ext", ext);
        PayTestHelper.pay(activity, pay, jsonCallback);
    }

    private void payUpayNet() {
        Map<String, Object> pay = new HashMap<>();
        Map<String, Object> ext = new HashMap<>();
        ext.put("hq_type", "net");
        ext.put("type_id", "13");
        ext.put("vendor", "");
        pay.put("hq_type", "upay");
        pay.put("ext", ext);
        pay.put("trade_no", String.valueOf(System.currentTimeMillis()));
        pay.put("notify_url", DemoTestConfig.NOTIFY_URL);
        PayTestHelper.pay(activity, pay, jsonCallback);
    }

    private void payUpayWww() {
        Map<String, Object> pay = new HashMap<>();
        Map<String, Object> ext = new HashMap<>();
        ext.put("hq_type", "ww_card");
        ext.put("equipment_type", "2");
        ext.put("country_name", "vietnam");
        ext.put("vendor", "");
        pay.put("hq_type", "upay");
        pay.put("goods_tag", DemoTestConfig.GOODS_TAG_UPAY_WWCARD);
        pay.put("ext", ext);
        pay.put("trade_no", String.valueOf(System.currentTimeMillis()));
        pay.put("notify_url", DemoTestConfig.NOTIFY_URL);
        PayTestHelper.pay(activity, pay, jsonCallback);
    }

    private void payUpayApi() {
        Map<String, Object> pay = new HashMap<>();
        Map<String, Object> ext = new HashMap<>();
        ext.put("hq_type", "api");
        ext.put("equipment_type", "2");
        ext.put("vendor", "2");
        ext.put("card_id", "2");
        ext.put("card_num", "2");
        pay.put("hq_type", "upay");
        pay.put("ext", ext);
        pay.put("trade_no", String.valueOf(System.currentTimeMillis()));
        pay.put("notify_url", DemoTestConfig.NOTIFY_URL);
        PayTestHelper.pay(activity, pay, jsonCallback);
    }

    private void payRuixueH5() {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("hq_type", "ht");
        hashMap.put("goods_tag", DemoTestConfig.GOODS_TAG_RUIXUE_H5);
        hashMap.put("country_code", "CN");
        hashMap.put("auto_close", true);
        hashMap.put("indulge_auth", 0);
        hashMap.put("currency_symbol", "￥");
        hashMap.put("return_url", "https://www.baidu.com");
        RuiXueSdk.getApi().pay(activity, hashMap, jsonCallback);
    }
}
