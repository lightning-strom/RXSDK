package com.ruixue.upay;

import android.app.Activity;
import android.content.DialogInterface;
import android.text.TextUtils;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.billing.OrderData;
import com.ruixue.billing.HQParams;
import com.ruixue.billing.HQType;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.view.WebViewDialog;

import org.json.JSONObject;

import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/8/26
 */
public class UPayBillingImpl extends BillingClient {

    //    泰国：thailand
    public static final String COUNTRY_THAILAND = "thailand";

    //越南：vietnam
    public static final String COUNTRY_VIETNAM = "vietnam";

    /**
     * 网银支付
     */
    public static final String PAY_TYPE_NET = "net";
    /**
     * web or wap 充值卡支付
     */
    public static final String PAY_TYPE_WW_CARD = "ww_card";
    /**
     * api充值卡支付
     */
    public static final String PAY_TYPE_API = "api";
    public static final String UPAY = "upay";

    public enum Equipment {
        Unknow(0), Web(1), Wap(2);
        int type;

        Equipment(int t) {
            type = t;
        }
    }


    public UPayBillingImpl() {

    }

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey("currency")) {
            hashMap.put("currency", "VND");
        }
        @SuppressWarnings("unchecked") Map<String, Object> extMap = (Map<String, Object>) hashMap.get("ext");
        if (extMap != null) {
            if (!extMap.containsKey("vendor")) {
                extMap.put("vendor", "");
            }
            if (!extMap.containsKey("cp_inquiry_url")) {
                extMap.put("cp_inquiry_url", ("https://payfinish"));
            }
            hashMap.put("ext", extMap);
        }

        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        OrderData orderData = OrderData.fromJson(data);
        if (orderData != null) {
            HQParams payReq = HQParams.create(hashMap);
            Object payType = hashMap.get(KEY_HQ_TYPE);
            if ((Objects.requireNonNull(payType).equals(UPAY))) {
                JSONObject extObject = data.optJSONObject("ext");
                if (payReq != null && extObject != null) {
                    String url = extObject.optString("url");
                    if (payReq.getExt() != null && PAY_TYPE_WW_CARD.equals(payReq.getExt().get(HQType.KEY))) {
                        url = extObject.optString("order_url");
                    }
                    doPay(activity, url, callback);

                } else {
                    RXLogger.e("req params:" + hashMap.toString());
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "参数错误,检查参数配置。"));
                }
            } else {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_PARAMS_ERROR.getValue(), "不支持的HQ方式！"));
            }
        } else {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR));
        }
    }

    private void doPay(Activity activity, String url, RXJSONCallback callback) {
        AtomicBoolean isHandleCallback = new AtomicBoolean(false);
        try {
            RXLogger.i("doPay:" + url);
            if (TextUtils.isEmpty(url)) {
                if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "url null error."));
                }
                return;
            }
            WebViewDialog webViewDialog = new WebViewDialog(activity);
            webViewDialog.setOnCancelListener(new DialogInterface.OnCancelListener() {
                @Override
                public void onCancel(DialogInterface dialog) {
                    dialog.dismiss();
//                    if (callback != null&& isHandleCallback.compareAndSet(false, true)) {
//                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.CANCEL.getValue(), "pay cancel."));
//                    }
                }
            });
            WebViewClient wxWebClient = new WebViewClient() {
                @Override
                public boolean shouldOverrideUrlLoading(WebView view, String url) {
                    RXLogger.i("shouldOverrideUrlLoading:" + url);
                    if (url.startsWith("https://payfinish")) {
                        webViewDialog.dismiss();
                        if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                            callback.onSuccess(JSONUtil.toJSONObject(RXErrorCode.SUCCESS.getValue(), "please queries the payment result from server."));
                        }
                        return true;
                    } else if (!url.startsWith("http")) {
                        boolean isSuccess = AppUtils.startApp(activity, url);
                        webViewDialog.dismiss();
                        if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                            if (isSuccess) {
                                callback.onSuccess(JSONUtil.toJSONObject(RXErrorCode.SUCCESS.getValue(), "call success,please queries the payment result from server."));
                            } else {
                                callback.onSuccess(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "Please check whether pay app has been installed."));
                            }
                        }
                        return isSuccess;
                    } else {
                        return super.shouldOverrideUrlLoading(view, url);
                    }
                }

                @Override
                public void onPageFinished(WebView view, String url) {
                    RXLogger.i("onPageFinished:" + url);
                    super.onPageFinished(view, url);
                    webViewDialog.setWebViewVisibility(View.VISIBLE);
                    webViewDialog.setLoadVisibility(View.GONE);
                }

                @Override
                public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                    RXLogger.e("onReceivedError code: " + errorCode + " ,description: " + description + " ,url:" + failingUrl);
                    webViewDialog.setWebViewVisibility(View.VISIBLE);
                    webViewDialog.setLoadVisibility(View.GONE);
                    super.onReceivedError(view, errorCode, description, failingUrl);
                }
            };
            webViewDialog.setWebViewVisibility(View.INVISIBLE).setLoadVisibility(View.VISIBLE).setWebViewClient(wxWebClient).loadUrl(url);

        } catch (Exception e) {
            RXLogger.e("调起HQ失败:" + e.getClass());
            e.printStackTrace();
            callback.onError(new RXException(e));
        }
    }
}
