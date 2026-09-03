package com.ruixue.hq;

import android.app.Activity;
import android.os.Looper;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.PluginPayManager;
import com.ruixue.billing.BillingClient;
import com.ruixue.billing.OrderData;

import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.passport.LoginData;
import com.ruixue.reflect.AliPayManager;
import com.ruixue.utils.JSONUtil;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

class HQBillingImpl extends BillingClient {
    interface PayHandler {
        void doPay(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) throws JSONException;
    }

    private static final Map<Object, PayHandler> PAY_HANDLERS = new HashMap<>();

    static {
        PAY_HANDLERS.put(HQT5.WECHATH5, (a, h, d, c) -> WechatH5.doPay(a, d.getJSONObject("ext"), c));
        PAY_HANDLERS.put(HQT5.OVERSEAS_WECHATH5, (a, h, d, c) -> WechatH5.doPay(a, d.getJSONObject("ext"), c));
        PAY_HANDLERS.put(HQT5.ALIPAYH5, (a, h, d, c) -> AlipayH5.doPay(a, d.getJSONObject("ext"), c));
        PAY_HANDLERS.put(HQT5.REALIPAY, (a, h, d, c) -> AliPayManager.pay(a, d, c));
        PAY_HANDLERS.put(HQT5.JDJH, (a, h, d, c) -> JDJH.doPay(a, d, c));
        PAY_HANDLERS.put(HQT5.PAYERMAX, (a, h, d, c) -> PayerMax.doPay(a, d, c));
        PAY_HANDLERS.put(HQT5.XSOLLA_INAPP, (a, h, d, c) -> Xsolla.doPay(a, d, c));
        PAY_HANDLERS.put(HQT5.CHECKOUT, (a, h, d, c) -> Checkout.doPay(a, d, c));
        PAY_HANDLERS.put(HQT5.AUMS, (a, h, d, c) -> PluginPayManager.doPay(a, h, d, c));
        PAY_HANDLERS.put(HQT5.UNIPIN, (a, h, d, c) -> UniPay.doPay(a, d.getJSONObject("ext"), c));
        PAY_HANDLERS.put(HQT5.My_CARD, (a, h, d, c) -> MyCard.doPay(a, d, c));
        PAY_HANDLERS.put(HQT5.UTG, (a, h, d, c) -> UTG.doPay(a, d, c));
        PAY_HANDLERS.put(HQT5.WAFFO, (a, h, d, c) -> Waffo.doPay(a, d, c));
        PAY_HANDLERS.put(HQT5.OGOOD, (a, h, d, c) -> Ogood.doPay(a, d, c));
        PAY_HANDLERS.put(HQT5.XINGYI, (a, h, d, c) -> XingYiH5.doPay(a, d, c));
    }

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (HQT5.RUIXUE_H5_TRADE.equals(hashMap.get(KEY_HQ_TYPE))) {
            invokeH5Pay(activity, hashMap, callback);
            return;
        } else if (HQT5.JDJH.equals(hashMap.get(KEY_HQ_TYPE))) {
            @SuppressWarnings("unchecked") Map<String, Object> extMap = (Map<String, Object>) hashMap.get("ext");
            if (extMap == null) {
                extMap = new HashMap<>();
            }
            if (!extMap.containsKey("trade_type")) {
                extMap.put("trade_type", "AGGRE_JD");
            }
            if (hashMap.containsKey("callback_url")) {
                extMap.put("callback_url", hashMap.get("callback_url"));
            }
            hashMap.put("ext", extMap);
        } else if (HQT5.PAYERMAX.equals(hashMap.get(KEY_HQ_TYPE))) {
            @SuppressWarnings("unchecked") Map<String, Object> extMap = (Map<String, Object>) hashMap.get("ext");
            if (extMap == null) {
                extMap = new HashMap<>();
            }
            if (!extMap.containsKey("frontCallbackUrl")) {
                extMap.put("frontCallbackUrl", "ruixue://pay");
            }
            hashMap.put("ext", extMap);
        } else if (HQT5.XSOLLA_INAPP.equals(hashMap.get(KEY_HQ_TYPE))) {
            if (!hashMap.containsKey("currency")) {
                hashMap.put("currency", "USD");
            }
            @SuppressWarnings("unchecked") Map<String, Object> extMap = (Map<String, Object>) hashMap.get("ext");
            if (extMap == null) {
                extMap = new HashMap<>();
            }
            if (!extMap.containsKey("user_name")) {
                LoginData loginData1 = RuiXueSdk.getLoginData();
                extMap.put("user_name", loginData1 != null ? loginData1.getNickname() : "");
            }
            if (!extMap.containsKey("return_url")) {
                extMap.put("return_url", "ruixue://pay");
            }
            hashMap.put("ext", extMap);
        }
        super.pay(activity, hashMap, callback);
    }

    private void invokeH5Pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        activity.runOnUiThread(() -> {
            addDefaultParams(activity, hashMap);
            HQView h5PayView = new HQView(activity);
            h5PayView.setNotchScreen(true);
            h5PayView.setOrderInfo(hashMap);
            h5PayView.setPayClickListener(payParams -> {
                RuiXueSdk.getApi().pay(activity, payParams, callback);
            });
            h5PayView.setCallback(callback);
            h5PayView.loadUrl(hashMap.containsKey("url") ? (String) hashMap.get("url") : RuiXueSdk.getFirstBaseUrl() + (RuiXueSdk.isOasVersion() ? "static/pay" : "static/gn-pay"));
            h5PayView.show();
        });
    }


    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        if (Looper.myLooper() == Looper.getMainLooper()) {
            callHQByOrder(activity, hashMap, data, callback);
        } else {
            activity.runOnUiThread(() -> {
                callHQByOrder(activity, hashMap, data, callback);
            });
        }
    }

    private void callHQByOrder(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        try {
            OrderData hqData = OrderData.fromJson(data);
            if (hqData != null) {
                Object hqType = hashMap.get(KEY_HQ_TYPE);
                if (hashMap.containsKey("openBrowser")) {
                    //support 京东 PayerMax
                    data.putOpt("openBrowser", hashMap.get("openBrowser"));
                }
                if (HQT5.XINGYI.equals(hqType) && !XingYiH5Helper.isH5Pay(hashMap, data)) {
                    if (callback != null) {
                        callback.onFailed(JSONUtil.toJSONObject(
                                RXErrorCode.HQ_PARAMS_ERROR.getValue(),
                                "xingyi app pay is handled by rxsdk_xingyi plugin"));
                    }
                    return;
                }
                PayHandler handler = PAY_HANDLERS.get(hqType);
                if (handler != null) {
                    handler.doPay(activity, hashMap, data, callback);
                } else {
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_PARAMS_ERROR.getValue(), "不支持的方式！" + hqData.getHQType()));
                }
            } else {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR));
            }
        } catch (Exception e) {
            e.printStackTrace();
            callback.onError(new RXException(e));
        }
    }
}
