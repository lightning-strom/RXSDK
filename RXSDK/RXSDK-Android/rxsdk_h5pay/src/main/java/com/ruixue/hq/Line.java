package com.ruixue.hq;

import android.app.Activity;
import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.text.TextUtils;
import android.view.View;
import android.webkit.JavascriptInterface;
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
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/11
 */
class Line {

    private static final String HQ_SCHEME = "line://pay";

    public static void doPay(Activity activity, @NonNull JSONObject jsonObject, RXJSONCallback callback) {
        doPay(activity, jsonObject.optString("pay_url"), callback);
    }


    private static void doPay(Activity activity, String payUrl, RXJSONCallback callback) {
        AtomicBoolean isHandleCallback = new AtomicBoolean(false);
        try {
            if (TextUtils.isEmpty(payUrl)) {
                throw new Exception("pay params null error");
            }
            if (payUrl.startsWith(HQ_SCHEME)) {
                boolean isSuccess = startApp(activity, payUrl);
                if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                    if (isSuccess) {
                        callback.onSuccess(JSONUtil.toJSONObject(RXErrorCode.SUCCESS.getValue(), "call  success,please queries the payment result from server."));
                    } else {
                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.NOT_INSTALL.getValue(), "Please check line is installed."));
                    }
                }
                return;
            }

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
            WebViewClient wxWebClient = new WebViewClient() {
                @Override
                public boolean shouldOverrideUrlLoading(WebView view, String url) {
                    RXLogger.i("shouldOverrideUrlLoading:" + url);
                    if (url.startsWith(HQ_SCHEME)) {
                        boolean isSuccess = startApp(activity, url);
                        if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                            if (isSuccess) {
                                callback.onSuccess(JSONUtil.toJSONObject(RXErrorCode.SUCCESS.getValue(), "call  success,please queries the payment result from server."));
                            } else {
                                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.NOT_INSTALL_WECHAT.getValue(), "Please check whether  is installed."));
                            }
                        }
                        webViewDialog.dismiss();
                        return true;
                    } else {
                        return super.shouldOverrideUrlLoading(view, url);
                    }
                }

                @Override
                public void onPageFinished(WebView view, String url) {
                    RXLogger.i("onPageFinished:" + url);
//                    view.loadUrl("javascript: JsAccessor.getErrorMsg(document.getElementById(111).innerText)");
                    super.onPageFinished(view, url);
                    webViewDialog.setWebViewVisibility(View.VISIBLE);
                    webViewDialog.setLoadVisibility(View.GONE);
                    if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                        webViewDialog.dismiss();
                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "url verification failed"));
                    }
                }

                @Override
                public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                    RXLogger.e("onReceivedError code: " + errorCode + " ,description: " + description + " ,url:" + failingUrl);
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
                    .setWebViewClient(wxWebClient)
//                    .addJavascriptInterface(new JsAccessor(), JsAccessor.class.getSimpleName())
//                    .addHeader("Referer", referer)
                    .loadUrl(payUrl);


        } catch (Exception e) {
            RXLogger.e("调起HQ失败:" + e.getClass());
            e.printStackTrace();
            if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                callback.onError(new RXException(e));
            }
        }
    }


    private static boolean startApp(Activity activity, String url) {

        return AppUtils.startApp(activity, url);
    }

    private static boolean isInstalled(Activity activity) {
        PackageManager pm = activity.getPackageManager();
        try {
            pm.getPackageInfo("jp.naver.line.android", 0);
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            return false;
        }
    }
}
