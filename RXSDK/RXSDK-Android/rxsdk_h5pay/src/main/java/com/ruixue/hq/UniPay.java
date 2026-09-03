package com.ruixue.hq;

import android.app.Activity;
import android.content.DialogInterface;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.annotation.NonNull;

import com.ruixue.RXJSONCallback;
import com.ruixue.logger.RXLogger;
import com.ruixue.view.WebViewDialog;

import org.json.JSONObject;

import java.util.concurrent.atomic.AtomicBoolean;

  class UniPay {

    public static void doPay(Activity activity, @NonNull JSONObject jsonObject, RXJSONCallback callback) {
        doPay(activity, jsonObject.optString("url"), callback);
    }

    private static void doPay(Activity activity, String payUrl, RXJSONCallback callback) {
        AtomicBoolean isHandleCallback = new AtomicBoolean(false);
        try {
            WebViewDialog webViewDialog = new WebViewDialog(activity);
            webViewDialog.setOnCancelListener(new DialogInterface.OnCancelListener() {
                @Override
                public void onCancel(DialogInterface dialog) {
                    dialog.dismiss();
//                    if (callback != null && isHandleCallback.compareAndSet(false, true)) {
//                        callback.onSuccess(JSONUtil.toJSONObject(RXErrorCode.SUCCESS.getValue(), "pay success."));
//                    }
                }
            });
            CookieManager.getInstance().setAcceptThirdPartyCookies(webViewDialog.getWebView(), true);
            WebViewClient wxWebClient = new WebViewClient() {
                @Override
                public boolean shouldOverrideUrlLoading(WebView view, String url) {
                    return super.shouldOverrideUrlLoading(view, url);
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
//                    if (callback != null && isHandleCallback.compareAndSet(false, true)) {
//                        callback.onFailed(RXErrorCode.PAY_ERROR.toJSONObject(errorCode, description));
//                    }
                }
            };
            webViewDialog.setWebViewVisibility(View.INVISIBLE).setLoadVisibility(View.VISIBLE).setWebViewClient(wxWebClient).loadUrl(payUrl);
        } catch (Exception e) {
            RXLogger.e("调起HQ失败:" + e.getClass());
            e.printStackTrace();
//            if (callback != null && isHandleCallback.compareAndSet(false, true)) {
//                callback.onError(new RXException(e));
//            }
        }
    }
}
