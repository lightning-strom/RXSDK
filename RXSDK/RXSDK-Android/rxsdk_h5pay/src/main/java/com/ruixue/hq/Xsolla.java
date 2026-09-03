package com.ruixue.hq;

import android.app.Activity;
import android.content.DialogInterface;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.annotation.NonNull;

import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.view.WebViewDialog;

import org.json.JSONObject;

import java.util.concurrent.atomic.AtomicBoolean;


class Xsolla {

    public static void doPay(Activity activity, @NonNull JSONObject jsonObject, RXJSONCallback callback) {
        try {
            JSONObject extObj = jsonObject.getJSONObject("ext");
            String url = extObj.optString("url");
            doPay(activity, url, jsonObject.optBoolean("openBrowser"), callback);
        } catch (Exception e) {
            RXLogger.e("调起HQ失败:" + e.getClass());
            e.printStackTrace();
            callback.onError(new RXException(e));
        }
    }


     static void doPay(Activity activity, String payUrl, boolean openBrowser, RXJSONCallback callback) {
        AtomicBoolean isHandleCallback = new AtomicBoolean(false);
        try {
            if (openBrowser) {
                boolean isSuccess = AppUtils.startApp(activity, payUrl);
                if (!isSuccess) {
                    if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "Please check whether the app is installed."));
                    }
                }
            } else {
                WebViewDialog webViewDialog = new WebViewDialog(activity);
                webViewDialog.setOnCancelListener(new DialogInterface.OnCancelListener() {
                    @Override
                    public void onCancel(DialogInterface dialog) {
                        dialog.dismiss();
                        if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.PAY_CANCEL.getValue(), "pay cancel."));
                        }
                    }
                });
                CookieManager.getInstance().setAcceptThirdPartyCookies(webViewDialog.getWebView(), true);
                WebViewClient wxWebClient = new WebViewClient() {
                    @Override
                    public boolean shouldOverrideUrlLoading(WebView view, String url) {
                        RXLogger.i("shouldOverrideUrlLoading:" + url);
                        if (url.startsWith("https://payfinish") || url.startsWith("ruixue://pay")) {
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
                        RXLogger.e("onReceivedError " + errorCode + " ," + description + " ," + failingUrl);
                        webViewDialog.setWebViewVisibility(View.VISIBLE);
                        webViewDialog.setLoadVisibility(View.GONE);
                        super.onReceivedError(view, errorCode, description, failingUrl);
                        if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                            callback.onFailed(RXErrorCode.PAY_ERROR.toJSONObject(errorCode, description));
                        }
                    }
                };
                webViewDialog.setWebViewVisibility(View.INVISIBLE).setLoadVisibility(View.VISIBLE).setWebViewClient(wxWebClient).loadUrl(payUrl);
            }
        } catch (Exception e) {
            RXLogger.e("调起HQ失败:" + e.getClass());
            e.printStackTrace();
            if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                callback.onError(new RXException(e));
            }
        }
    }
}
