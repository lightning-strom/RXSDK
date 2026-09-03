package com.ruixue.hq;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;

import org.json.JSONObject;

import android.content.DialogInterface;
import android.util.Base64;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.ruixue.error.RXErrorCode;
import com.ruixue.utils.JSONUtil;
import com.ruixue.view.WebViewDialog;


import java.util.concurrent.atomic.AtomicBoolean;

public class UTG {

    public static void doPay(Activity activity, @NonNull JSONObject jsonObject, RXJSONCallback callback) {
        try {
            JSONObject extObj = jsonObject.getJSONObject("ext");
            String baseData = extObj.optString("url");
            String url = new String(Base64.decode(baseData, Base64.DEFAULT));
            doPay(activity, url, callback);
        } catch (Exception e) {
            RXLogger.e("调起HQ失败:" + e.getClass());
            e.printStackTrace();
            callback.onError(new RXException(e));
        }
    }

    static void doPay(Activity activity, String payUrl, RXJSONCallback callback) {
        AtomicBoolean isHandleCallback = new AtomicBoolean(false);
        try {
            WebViewDialog webViewDialog = new WebViewDialog(activity,false,true);
            webViewDialog.setOnCancelListener(new DialogInterface.OnCancelListener() {
                @Override
                public void onCancel(DialogInterface dialog) {
                    dialog.dismiss();
                    if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.PAY_CANCEL.getValue(), "pay canceled."));
                    }
                }
            });
            CookieManager.getInstance().setAcceptThirdPartyCookies(webViewDialog.getWebView(), true);
            WebViewClient wxWebClient = new WebViewClient() {
                @Override
                public boolean shouldOverrideUrlLoading(WebView view, String url) {
                    if (url.startsWith("ruixue://pay/success")) {
                        webViewDialog.dismiss();
                        if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                            callback.onSuccess(JSONUtil.toJSONObject(RXErrorCode.SUCCESS.getValue(), "please queries the payment result from server."));
                        }
                        return true;
                    } else if (url.startsWith("ruixue://pay/failure")) {
                        webViewDialog.dismiss();
                        if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                            callback.onFailed(RXErrorCode.PAY_ERROR.toJSONObject());
                        }
                        return false;
                    } else if (url.startsWith("ruixue://pay/cancel")) {
                        webViewDialog.dismiss();
                        if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.PAY_CANCEL.getValue(), "pay cancel."));
                        }
                        return true;
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
                    RXLogger.e("onReceivedError " + errorCode + " ," + description + " ," + failingUrl);
                    webViewDialog.setWebViewVisibility(View.VISIBLE);
                    webViewDialog.setLoadVisibility(View.GONE);
                    super.onReceivedError(view, errorCode, description, failingUrl);
                    if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                        callback.onFailed(RXErrorCode.PAY_ERROR.toJSONObject(errorCode, description));
                    }
                }
            };
            webViewDialog.setWebViewVisibility(View.INVISIBLE).setLoadVisibility(View.VISIBLE).setWebViewClient(wxWebClient).loadData(payUrl);
        } catch (Exception e) {
            RXLogger.e("调起HQ失败:" + e.getClass());
            e.printStackTrace();
            if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                callback.onError(new RXException(e));
            }
        }
    }
}
