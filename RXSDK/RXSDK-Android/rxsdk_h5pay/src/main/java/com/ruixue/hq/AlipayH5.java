package com.ruixue.hq;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.net.Uri;
import android.text.TextUtils;
import android.view.View;
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
class AlipayH5 {

    public static void doPay(Activity activity, @NonNull JSONObject jsonObject, RXJSONCallback callback) {
        doPay(activity, jsonObject.optString("pay_url"), callback);
    }

    private static void doPay(Activity activity, String payUrl, RXJSONCallback callback) {
        AtomicBoolean isHandleCallback = new AtomicBoolean(false);
        try {
            if (TextUtils.isEmpty(payUrl)) {
                throw new Exception("alipay url params null error");
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
            WebViewClient aliWebClient = new WebViewClient() {
                @Override
                public boolean shouldOverrideUrlLoading(WebView view, String url) {
                    RXLogger.i("shouldOverrideUrlLoading " + url);
                    if (isAlipayInstalled(activity)) {
                        if (url.startsWith("alipays://platform") || url.startsWith("https://mclient.alipay.com/h5Continue.htm?")) {
                            boolean isSuccess = AppUtils.startApp(activity, url);
                            webViewDialog.dismiss();
                            if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                                if (isSuccess) {
                                    callback.onSuccess(JSONUtil.toJSONObject(RXErrorCode.SUCCESS.getValue(), "call alipay success,please queries the payment result from server."));
                                } else {
                                    callback.onSuccess(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "Please check whether Alipay has been installed."));
                                }
                            }
                            return true;
                        }
                    } else {
                        if (!url.startsWith("http")) {
                            AlertDialog.Builder builder = new AlertDialog.Builder(activity);
                            builder.setTitle("请先安装支付宝客户端");
                            builder.setPositiveButton("确定", (dialog, which) -> {
                                webViewDialog.dismiss();
                                if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "please install the alipay client first."));
                                }
                            });

                            builder.setNegativeButton("取消", (dialog, which) -> {

                            });
                            builder.show();
                        } else {
                            view.loadUrl(url);
                        }
                        return true;
                    }
                    return super.shouldOverrideUrlLoading(view, url);
                }

                @Override
                public void onPageFinished(WebView view, String url) {
                    RXLogger.i("onPageFinished " + url);
                    webViewDialog.setWebViewVisibility(View.VISIBLE);
                    webViewDialog.setLoadVisibility(View.GONE);
                    super.onPageFinished(view, url);
//                    if (callback != null && isHandleCallback.compareAndSet(false, true)) {
//                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.PAY_ERROR.getValue(), "please queries the payment result from server"));
//                    }
                }
            };
            webViewDialog.setWebViewVisibility(View.INVISIBLE).setLoadVisibility(View.VISIBLE).setWebViewClient(aliWebClient).loadUrl(payUrl);

        } catch (Exception e) {
            RXLogger.e("调起HQ失败:" + e.getClass());
            e.printStackTrace();
            if (callback != null && isHandleCallback.compareAndSet(false, true)) {
                callback.onError(new RXException(e));
            }
        }
    }


    //判断是否安装支付宝app
    public static boolean isAlipayInstalled(Context context) {
        return AppUtils.isAppInstalled(context, Uri.parse("alipays://platformapi/startApp"));
    }


}
