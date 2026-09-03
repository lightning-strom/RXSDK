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

/**
 * Ogood H5 支付。
 * <p>
 * 服务端下单后返回支付 URL（ext.url），客户端用 WebView 加载；
 * 支付完成后 ogood 跳转 returnUrl（服务端设为 ruixue://pay/success），
 * WebView 拦截该 scheme 回调结果。
 */
class Ogood {

    public static void doPay(Activity activity, @NonNull JSONObject jsonObject, RXJSONCallback callback) {
        try {
            JSONObject extObj = jsonObject.getJSONObject("ext");
            String url = extObj.optString("url");
            doPay(activity, url, jsonObject.optBoolean("openBrowser"), callback);
        } catch (Exception e) {
            RXLogger.e("ogood doPay error:" + e.getClass());
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
                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(),
                                "Failed to open browser for ogood payment."));
                    }
                }
            } else {
                WebViewDialog webViewDialog = new WebViewDialog(activity);
                webViewDialog.setOnCancelListener(dialog -> {
                    dialog.dismiss();
                    if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.PAY_CANCEL.getValue(), "pay cancel."));
                    }
                });
                CookieManager.getInstance().setAcceptThirdPartyCookies(webViewDialog.getWebView(), true);
                WebViewClient webClient = new WebViewClient() {
                    @Override
                    public boolean shouldOverrideUrlLoading(WebView view, String url) {
                        RXLogger.i("ogood shouldOverrideUrlLoading:" + url);
                        if (url.startsWith("ruixue://pay/success")) {
                            webViewDialog.dismiss();
                            if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                                callback.onSuccess(JSONUtil.toJSONObject(RXErrorCode.SUCCESS.getValue(),
                                        "please queries the payment result from server."));
                            }
                            return true;
                        } else if (url.startsWith("ruixue://pay/failure")) {
                            webViewDialog.dismiss();
                            if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                                callback.onFailed(RXErrorCode.PAY_ERROR.toJSONObject());
                            }
                            return true;
                        } else if (url.startsWith("ruixue://pay/cancel")) {
                            webViewDialog.dismiss();
                            if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.PAY_CANCEL.getValue(), "pay cancel."));
                            }
                            return true;
                        } else if (!url.startsWith("http")) {
                            AppUtils.startApp(activity, url);
                            return true;
                        }
                        return super.shouldOverrideUrlLoading(view, url);
                    }

                    @Override
                    public void onPageFinished(WebView view, String url) {
                        RXLogger.i("ogood onPageFinished:" + url);
                        super.onPageFinished(view, url);
                        webViewDialog.setWebViewVisibility(View.VISIBLE);
                        webViewDialog.setLoadVisibility(View.GONE);
                    }

                    @Override
                    public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                        RXLogger.e("ogood onReceivedError " + errorCode + " ," + description);
                        webViewDialog.setWebViewVisibility(View.VISIBLE);
                        webViewDialog.setLoadVisibility(View.GONE);
                        super.onReceivedError(view, errorCode, description, failingUrl);
                        if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                            callback.onFailed(RXErrorCode.PAY_ERROR.toJSONObject(errorCode, description));
                        }
                    }
                };
                webViewDialog.setWebViewVisibility(View.INVISIBLE)
                        .setLoadVisibility(View.VISIBLE)
                        .setWebViewClient(webClient)
                        .loadUrl(payUrl);
            }
        } catch (Exception e) {
            RXLogger.e("ogood doPay error:" + e.getClass());
            e.printStackTrace();
            if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                callback.onError(new RXException(e));
            }
        }
    }
}
