package com.ruixue.hq;

import android.app.Activity;
import android.text.TextUtils;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.view.WebViewDialog;

import org.json.JSONObject;

import java.util.concurrent.atomic.AtomicBoolean;

class XingYiH5 {
    private static final String TAG = "XingYiH5";

    static void doPay(Activity activity, @Nullable JSONObject jsonObject, RXJSONCallback callback) {
        if (jsonObject == null) {
            RXLogger.e(TAG + " doPay error: order data is null");
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(
                        RXErrorCode.HQ_DATA_ERROR.getValue(),
                        "xingyi h5 pay order data is null"));
            }
            return;
        }
        try {
            String payUrl = resolvePayUrl(jsonObject);
            if (TextUtils.isEmpty(payUrl)) {
                if (callback != null) {
                    callback.onFailed(JSONUtil.toJSONObject(
                            RXErrorCode.HQ_DATA_ERROR.getValue(),
                            "xingyi h5 pay url is empty, check order plug_url / ext.h5PayData.payUrl / ext.url / url / ext.h5 / h5"));
                }
                return;
            }
            openPayUrl(activity, payUrl, jsonObject.optBoolean("openBrowser"), callback);
        } catch (Exception e) {
            RXLogger.e(TAG + " doPay error:" + e.getClass() + ", msg=" + e.getMessage());
            if (callback != null) {
                callback.onError(new RXException(e));
            }
        }
    }

    @Nullable
    private static String resolvePayUrl(@NonNull JSONObject data) {
        String plugUrl = data.optString("plug_url");
        if (!TextUtils.isEmpty(plugUrl)) {
            return plugUrl;
        }
        JSONObject ext = resolveExt(data);
        if (ext != null) {
            String url = ext.optString("url");
            if (!TextUtils.isEmpty(url)) {
                return url;
            }
            String h5 = ext.optString("h5");
            if (!TextUtils.isEmpty(h5)) {
                return h5;
            }
            String payUrl = ext.optString("pay_url");
            if (!TextUtils.isEmpty(payUrl)) {
                return payUrl;
            }
            JSONObject h5PayData = ext.optJSONObject("h5PayData");
            if (h5PayData != null) {
                String nestedPayUrl = h5PayData.optString("payUrl");
                if (!TextUtils.isEmpty(nestedPayUrl)) {
                    return nestedPayUrl;
                }
            }
        }
        String url = data.optString("url");
        if (!TextUtils.isEmpty(url)) {
            return url;
        }
        return data.optString("h5");
    }

    @Nullable
    private static JSONObject resolveExt(@NonNull JSONObject data) {
        JSONObject ext = data.optJSONObject("ext");
        if (ext != null) {
            return ext;
        }
        String extString = data.optString("ext");
        if (TextUtils.isEmpty(extString)) {
            return null;
        }
        try {
            return new JSONObject(extString);
        } catch (Exception e) {
            RXLogger.e(TAG + " parse ext error:" + e.getClass());
            return null;
        }
    }

    private static void openPayUrl(Activity activity, String payUrl, boolean openBrowser,
                                   RXJSONCallback callback) {
        AtomicBoolean callbackHandled = new AtomicBoolean(false);
        try {
            if (openBrowser) {
                boolean opened = AppUtils.startApp(activity, payUrl);
                if (!opened && callback != null && callbackHandled.compareAndSet(false, true)) {
                    callback.onFailed(JSONUtil.toJSONObject(
                            RXErrorCode.HQ_DATA_ERROR.getValue(),
                            "Failed to open browser for xingyi h5 payment."));
                }
                return;
            }

            WebViewDialog webViewDialog = new WebViewDialog(activity);
            webViewDialog.setOnCancelListener(dialog -> {
                dialog.dismiss();
                if (callback != null && callbackHandled.compareAndSet(false, true)) {
                    callback.onFailed(JSONUtil.toJSONObject(
                            RXErrorCode.PAY_CANCEL.getValue(), "pay cancel."));
                }
            });
            webViewDialog.setOnKeyListener((dialog, keyCode, event) -> {
                if (keyCode == KeyEvent.KEYCODE_BACK && event.getAction() == KeyEvent.ACTION_UP) {
                    RXLogger.i(TAG + " back pressed, cancel h5 payment");
                    dialog.cancel();
                    return true;
                }
                return false;
            });
            CookieManager.getInstance().setAcceptThirdPartyCookies(webViewDialog.getWebView(), true);
            WebView webView = webViewDialog.getWebView();
            if (webView == null) {
                if (callback != null && callbackHandled.compareAndSet(false, true)) {
                    callback.onFailed(JSONUtil.toJSONObject(
                            RXErrorCode.HQ_DATA_ERROR.getValue(),
                            "xingyi h5 webview init failed"));
                }
                return;
            }
            webView.addJavascriptInterface(new XingYiH5Bridge(activity, webViewDialog), "XingYiH5Bridge");
            WebViewClient webClient = new WebViewClient() {
                @Override
                public boolean shouldOverrideUrlLoading(WebView view, String url) {
                    RXLogger.i(TAG + " shouldOverrideUrlLoading:" + url);
                    return handlePayRedirect(activity, webViewDialog, url, callbackHandled, callback)
                            || super.shouldOverrideUrlLoading(view, url);
                }

                @Override
                public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                    String url = request == null || request.getUrl() == null ? "" : request.getUrl().toString();
                    RXLogger.i(TAG + " shouldOverrideUrlLoading request:" + url);
                    return handlePayRedirect(activity, webViewDialog, url, callbackHandled, callback)
                            || super.shouldOverrideUrlLoading(view, request);
                }

                @Override
                public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
                    RXLogger.i(TAG + " onPageStarted:" + url);
                    super.onPageStarted(view, url, favicon);
                }

                @Override
                public void onPageFinished(WebView view, String url) {
                    RXLogger.i(TAG + " onPageFinished:" + url);
                    super.onPageFinished(view, url);
                    webViewDialog.setWebViewVisibility(View.VISIBLE);
                    webViewDialog.setLoadVisibility(View.GONE);
                    injectBackButtonHook(view, url);
                }

                @Override
                public void onReceivedError(WebView view, int errorCode, String description,
                                            String failingUrl) {
                    RXLogger.e(TAG + " onReceivedError " + errorCode + " ," + description);
                    webViewDialog.setWebViewVisibility(View.VISIBLE);
                    webViewDialog.setLoadVisibility(View.GONE);
                    super.onReceivedError(view, errorCode, description, failingUrl);
                    if (callback != null && callbackHandled.compareAndSet(false, true)) {
                        callback.onFailed(RXErrorCode.PAY_ERROR.toJSONObject(errorCode, description));
                    }
                }
            };
            webViewDialog.setWebViewVisibility(View.INVISIBLE)
                    .setLoadVisibility(View.VISIBLE)
                    .setWebViewClient(webClient)
                    .loadUrl(payUrl);
        } catch (Exception e) {
            RXLogger.e(TAG + " openPayUrl error:" + e.getClass());
            if (callback != null && callbackHandled.compareAndSet(false, true)) {
                callback.onError(new RXException(e));
            }
        }
    }

    private static void injectBackButtonHook(WebView view, String url) {
        if (view == null || TextUtils.isEmpty(url) || !url.contains("cashier.ulpay.com/bytepay-cashdesk")) {
            return;
        }
        String js = "(function(){"
                + "if(window.__rxsdkXingYiBackHook){return;}"
                + "window.__rxsdkXingYiBackHook=true;"
                + "function bind(){"
                + "var nodes=document.querySelectorAll('.box');"
                + "for(var i=0;i<nodes.length;i++){"
                + "var node=nodes[i];"
                + "if(node.__rxsdkBackHook){continue;}"
                + "var path=node.querySelector('svg path');"
                + "var d=path&&path.getAttribute('d')||'';"
                + "if(d.indexOf('M63.3626 11.6371')===0||node.querySelector('svg.svg-size24')){"
                + "node.__rxsdkBackHook=true;"
                + "node.addEventListener('click',function(e){"
                + "try{e.preventDefault();e.stopPropagation();window.XingYiH5Bridge.cancel();}catch(err){}"
                + "},true);"
                + "return true;"
                + "}"
                + "}"
                + "return false;"
                + "}"
                + "if(bind()){return;}"
                + "var count=0;"
                + "var timer=setInterval(function(){if(bind()||++count>20){clearInterval(timer);}},300);"
                + "})();";
        view.post(() -> view.evaluateJavascript(js, value -> RXLogger.i(TAG + " inject back hook result:" + value)));
    }

    private static class XingYiH5Bridge {
        private final Activity activity;
        private final WebViewDialog webViewDialog;

        XingYiH5Bridge(Activity activity, WebViewDialog webViewDialog) {
            this.activity = activity;
            this.webViewDialog = webViewDialog;
        }

        @JavascriptInterface
        public void cancel() {
            activity.runOnUiThread(() -> {
                RXLogger.i(TAG + " h5 back clicked, cancel h5 payment");
                webViewDialog.cancel();
            });
        }
    }

    private static boolean handlePayRedirect(Activity activity, WebViewDialog webViewDialog, String url,
                                             AtomicBoolean callbackHandled, RXJSONCallback callback) {
        if (TextUtils.isEmpty(url)) {
            return false;
        }
        if (url.startsWith("ruixue://pay/success")) {
            webViewDialog.dismiss();
            if (callback != null && callbackHandled.compareAndSet(false, true)) {
                callback.onSuccess(JSONUtil.toJSONObject(
                        RXErrorCode.SUCCESS.getValue(),
                        "please query the payment result from server."));
            }
            return true;
        } else if (url.startsWith("ruixue://pay/failure")) {
            webViewDialog.dismiss();
            if (callback != null && callbackHandled.compareAndSet(false, true)) {
                callback.onFailed(RXErrorCode.PAY_ERROR.toJSONObject());
            }
            return true;
        } else if (url.startsWith("ruixue://pay/cancel")) {
            webViewDialog.dismiss();
            if (callback != null && callbackHandled.compareAndSet(false, true)) {
                callback.onFailed(JSONUtil.toJSONObject(
                        RXErrorCode.PAY_CANCEL.getValue(), "pay cancel."));
            }
            return true;
        } else if (!url.startsWith("http")) {
            boolean opened = AppUtils.startApp(activity, url);
            if (!opened && callback != null && callbackHandled.compareAndSet(false, true)) {
                callback.onFailed(JSONUtil.toJSONObject(
                        RXErrorCode.HQ_DATA_ERROR.getValue(),
                        "Failed to open xingyi h5 payment scheme: " + url));
            }
            return true;
        }
        return false;
    }
}
