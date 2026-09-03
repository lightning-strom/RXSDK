package com.ruixue.hq;

import android.app.Activity;
import android.content.DialogInterface;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.text.TextUtils;
import android.view.View;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.RelativeLayout;

import androidx.annotation.NonNull;

import com.ruixue.RXRequestCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.view.RXWebView;
import com.ruixue.widget.BaseDialog;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/5/16
 */
public class HQView extends RXWebView {

    static Map<String, RXErrorCode> errorCodeMap = new HashMap<>();

    PayClickListener payClickListener;

    public void setPayClickListener(PayClickListener payClickListener) {
        this.payClickListener = payClickListener;
    }

    static {
        errorCodeMap.put("ruixue://pay/success", RXErrorCode.SUCCESS);
        errorCodeMap.put("ruixue://pay/cancel", RXErrorCode.PAY_CANCEL);
        errorCodeMap.put("ruixue://pay/failure", RXErrorCode.PAY_ERROR);
    }

    public void setOrderInfo(Map<String, Object> extParams) {
        Map<String, Object> map = new HashMap<>();
        map.put("order_info", new JSONObject(extParams).toString());
        if (extParams.containsKey("goods_name")) {
            setTitle((String) extParams.get("goods_name"));
        }
        setExtParams(map);
    }

    public interface PayClickListener {
        void onPayClicked(Map<String, Object> payParams);
    }

    //pay 改为 hq
    @Override
    protected void handleJsCallback(String type, JSONObject jsonObject) {
        if ("hq".equals(type)) {
            Map<String, Object> payMap = JSONUtil.toMap(jsonObject);
            if (payClickListener != null && jsonObject.optBoolean("auto_close")) {
                payClickListener.onPayClicked(payMap);
            } else {
                RuiXueSdk.getApi().pay(activity, payMap, new RXRequestCallback() {
                    @Override
                    public void onResponse(JSONObject jsonObject) {
                        invokeJsCallback(jsonObject);
                    }
                });
            }
        } else {
            super.handleJsCallback(type, jsonObject);
        }
}

    public void setAllowFileAccess(boolean allow) {
        if (getSettings() != null) {
            getSettings().setAllowFileAccess(allow);
        }
    }

    @Override
    protected void openNewWebView(String url) {
        RXWebView rxWebView = RXWebView.create(getContext(), url).setBackEnable(goBackEnable).setTitleBackgroundColor(titleBackgroundColor);
        updateWebViewTitle(rxWebView);
        rxWebView.show();
    }

    @Override
    public RXWebView setBackEnable(boolean backEnable) {
        super.setBackEnable(backEnable);
        RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        layoutParams.addRule(RelativeLayout.CENTER_VERTICAL);
        if (back.getVisibility() != View.VISIBLE) {
            int cutout = isLandscape() ? AppUtils.getHorDisplayCutout(getContext()) : 0;
            layoutParams.setMarginStart(cutout + AppUtils.dp2px(getContext(), 20));
        } else {
            layoutParams.addRule(RelativeLayout.END_OF, com.ruixue.ui.R.id.back);
        }
        tvTitle.setLayoutParams(layoutParams);
        return this;
    }

    Activity activity;

    public HQView(Activity context) {
        super(context);
        activity = context;
    }

    //            "type" : "rxpay", // 回调类型 支付混淆改为 rxhq
//    "code" : 0,               // 瑞雪错误码
//    "msg" : "msg",            // 瑞雪错误提示
//    "thirdcode" : 0,          // 三方错误码
//    "thirdmsg" : "thirdmsg",  // 三方错误提示
    private void invokeJsCallback(JSONObject jsonObject) {
        try {
            jsonObject.put("type", "rxhq");
            String json = jsonObject.toString();
            mWebView.post(() -> mWebView.evaluateJavascript("window.callback('" + json.replace("'", "\\'") + "');", null));
//        mWebView.post(() -> mWebView.evaluateJavascript("(function() { return window.callback!=undefined ? jsTitle():document.title; })();", t -> {
//            //value即为js返回值
//            if (TextUtils.isEmpty(getTitle()) && !TextUtils.isEmpty(t) && !"null".equals(t) && t.length() > 2) {
//
//            }
//        }));
        } catch (Exception ignore) {
        }
    }

    public static Map<String, String> parseQueryParams(Uri uri) {
        Map<String, String> queryParams = new HashMap<>();
        String query = uri.getQuery();
        try {
            if (query != null) {
                String[] pairs = query.split("&");
                for (String pair : pairs) {
                    int idx = pair.indexOf("=");
                    if (idx > 0) {
                        String key = pair.substring(0, idx);
                        String value = pair.substring(idx + 1);
                        // 解码参数值（如果需要）
                        value = Uri.decode(value);
                        queryParams.put(key, value);
                    }
                }
            }
        } catch (Exception e) {
            // 理论上，Uri.decode() 不会抛出 UnsupportedEncodingException，因为它是使用 UTF-8 解码的
            e.printStackTrace();
        }
        return queryParams;
    }

    public class HQ5WebViewClient extends RXWebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            RXLogger.i("shouldOverrideUrlLoading::" + request.getUrl());
            String url = String.valueOf(request.getUrl());
            Uri uri = request.getUrl();
            String result = uri.getScheme() + "://" + uri.getAuthority() + (TextUtils.isEmpty(uri.getPath()) ? "" : uri.getPath());
            if (errorCodeMap.containsKey(result)) {
                RXErrorCode rxErrorCode = errorCodeMap.get(result);
                if (rxjsonCallback != null) {
                    try {
                        if (rxErrorCode == RXErrorCode.SUCCESS) {
                            rxjsonCallback.onSuccess(rxErrorCode.toJSONObject());
                        } else if (rxErrorCode == RXErrorCode.PAY_CANCEL) {
                            rxjsonCallback.onFailed(Objects.requireNonNull(rxErrorCode).toJSONObject());
                        } else {
                            rxjsonCallback.onFailed(new JSONObject(parseQueryParams(request.getUrl())));
                        }
                    } catch (Exception e) {
                        rxjsonCallback.onError(new RXException(e));
                    }
                }
                dismiss();
                return true;
            } else if (!isHttp(url) && AppUtils.startApp(getContext(), url)) {
                return true;
            } else if (url.startsWith("intent://")) {
                ToastUtils.showToast(getContext(), com.ruixue.base.R.string.error_code_6100);
                return true;
            } else {
                return super.shouldOverrideUrlLoading(view, request);
            }
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            super.onReceivedError(view, request, error);
            if (header != null && header.getVisibility() != View.VISIBLE) {
                dismiss();
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && null != rxjsonCallback) {
                    rxjsonCallback.onError(new RXException("" + error.getDescription()));
                }
            }
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
        }
    }

    @NonNull
    @Override
    protected WebViewClient getWebViewClient() {
        return new HQ5WebViewClient();
    }

    @Override
    protected void setNavVisible(boolean visible) {
        if (mWebRoot != null) {
            mWebRoot.setBackgroundColor(visible ? Color.WHITE : Color.TRANSPARENT);
        }
        super.setNavVisible(visible);
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        super.onCreateView(dialog, view);
        mWebView.getSettings().setAllowFileAccess(RXGlobalData.isAllowFileAccess());
        setBackEnable(mWebView.canGoBack());
        if (!RuiXueSdk.isOasVersion()) {
            setNavVisible(false);
            mWebView.setBackgroundColor(0);
        }

    }

    @Override
    protected void onCloseClicked(DialogInterface view) {
        super.onCloseClicked(view);
        if (rxjsonCallback != null) {
            rxjsonCallback.onFailed(RXErrorCode.UI_CLOSE.toJSONObject());
        }
    }

}

