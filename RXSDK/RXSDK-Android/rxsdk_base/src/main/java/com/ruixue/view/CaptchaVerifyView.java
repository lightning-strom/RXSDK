package com.ruixue.view;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.R;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.HttpUtil;
import com.ruixue.openapi.RXApiHelper;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXView;

import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.LoadingDialog;
import com.ruixue.utils.ThreadUtils;
import com.ruixue.widget.BaseDialog;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

public class CaptchaVerifyView extends RXView {

    WebView mWebView;
    //    String account, purpose;
//    boolean isEmail;
    Map<String, Object> bodyMap;
    boolean jsDisable = false;
    int appid;
    RXJSONCallback callback;
    private final int TIMEOUT_ERROR = 2;

    public boolean isJsDisable() {
        return jsDisable;
    }

    public void setJsDisable(boolean jsDisable) {
        this.jsDisable = jsDisable;
    }

    @SuppressLint("HandlerLeak")
    private final Handler mHandler = new Handler(Looper.getMainLooper()) {
        public void handleMessage(Message msg) {
            if (msg.what == TIMEOUT_ERROR) {
                System.out.println("webView超时");
                dismiss();
            }
        }
    };

    public CaptchaVerifyView setUrl(String url) {
        this.url = url;
        return this;
    }

    String url;

    public CaptchaVerifyView(Context context, Map<String, Object> bodyMap) {
        super(context);
        this.bodyMap = bodyMap;
        setCanceledOnTouchOutside(true);
        url = RuiXueSdk.getFirstBaseUrl() + "static/passport/#/captcha";
    }

    public CaptchaVerifyView(Context context, String account, String purpose, boolean isEmail) {
        super(context);
        bodyMap = new HashMap<>();
        if (isEmail) {
            bodyMap.put("email", account);
        } else {
            bodyMap.put("phone", account);
        }
        bodyMap.put("purpose", purpose);
        setCanceledOnTouchOutside(true);
        url = RuiXueSdk.getFirstBaseUrl() + "static/passport/#/captcha";
    }

    public static CaptchaVerifyView create(Context activity, Map<String, Object> bodyMap, RXJSONCallback callback) {
        return new CaptchaVerifyView(activity, bodyMap).setCallback(callback);
    }

    public static CaptchaVerifyView create(Context activity, String phone, String purpose, boolean isMail, RXJSONCallback callback) {
        return new CaptchaVerifyView(activity, phone, purpose, isMail).setCallback(callback);
    }

    public CaptchaVerifyView setCallback(RXJSONCallback callback) {
        this.callback = callback;
        return this;
    }

    public CaptchaVerifyView setAppid(int appid) {
        this.appid = appid;
        return this;
    }

    @Override
    public int getResId() {
        return R.layout.rx_captcha_verify;
    }

    Timer timer;

    //计时器   计时 加载每个资源 的时间  （超时操作）
    private void startTimer() {
        TimerTask timerTask = new TimerTask() {
            @Override
            public void run() {
                stopTimer();
                if (mWebView != null && mWebView.getProgress() < 100) {
                    Message msg = new Message();
                    msg.what = TIMEOUT_ERROR;
                    mHandler.sendMessage(msg);
                }
            }
        };
        if (timer != null) {
            timer.cancel();
        }
        timer = new Timer();
        timer.schedule(timerTask, 10000);
    }

    private void stopTimer() {
        if (timer != null) {
            timer.cancel();
            timer.purge();
            timer = null;
        }
    }


    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        WebView webView = view.findViewById(R.id.wv_webview);
        ProgressBar pb_loading = view.findViewById(R.id.pb_loading);
        pb_loading.setVisibility(View.GONE);
        //允许解析js
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(RXGlobalData.isJavaScriptEnabled());
        settings.setAllowFileAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadsImagesAutomatically(true);
        JsBridge jsBridge = new JsBridge();
        if (!jsDisable) {
            webView.addJavascriptInterface(jsBridge, "JsBridge");
        }
        webView.setBackgroundColor(0);
        webView.setWebViewClient(new WebViewClient() {
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                //  重写此方法表明点击网页里面的链接还是在当前的webview里跳转，不跳到浏览器那边
                if (HttpUtil.parseUrlScheme(view, JsBridge.class, jsBridge, request.getUrl())) {
                    return true;
                } else {
                    return super.shouldOverrideUrlLoading(view, request);
                }
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                RXLogger.i("onPageFinished " + url);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                ThreadUtils.getInstance().runOnUiThread(() -> dismiss());
            }
        });
        webView.loadUrl(url + "?captcha_app_id=" + appid);
    }

    public final class JsBridge {
        @JavascriptInterface
        public void onPageStarted(String res) {
            startTimer();
        }

        @JavascriptInterface
        public void onPageFinished(String res) {
            stopTimer();
        }

        @JavascriptInterface
        public void sliderCaptcha(String res) {
            try {
                JSONObject jsonObject = new JSONObject(res);
                int code = jsonObject.optInt("code", jsonObject.optInt("ret", -1));
                if (code != -1) {
                    if (code != 0) {
                        if (callback != null) {
                            callback.onFailed(jsonObject);
                        }
                    } else {
                        ThreadUtils.getInstance().runOnUiThread(() -> {
                            if (bodyMap == null || bodyMap.isEmpty()) {
                                if (callback != null) {
                                    callback.onSuccess(jsonObject);
                                }
                            } else {
                                LoadingDialog loadingDialog = LoadingDialog.create(RuiXueSdk.getCurrentActivity());
                                loadingDialog.showDelay(300).closeDelay(7000);
//                            account, purpose, isEmail, jsonObject.optString("randstr"), jsonObject.optString("ticket")

                                bodyMap.put("tencent_captcha", JSONUtil.toMap(jsonObject));
                                RXApiHelper.Passport.sendCaptcha(bodyMap, new RXJSONCallback() {
                                    @Override
                                    public void onSuccess(@Nullable JSONObject data) {
                                        loadingDialog.close();
                                        callback.onSuccess(data);
                                    }

                                    @Override
                                    public void onFailed(@NonNull JSONObject cause) {
                                        loadingDialog.close();
                                        callback.onFailed(cause);
                                    }
                                });
                            }
                        });
                    }
                } else {
                    if (callback != null) {
                        callback.onFailed(jsonObject);
                    }
                }
            } catch (JSONException e) {
                if (callback != null) {
                    callback.onError(new RXException(e));
                }
            }
            dismiss();
        }

        @JavascriptInterface
        public void openWebView(String url) {
        }

        @JavascriptInterface
        public void doClose() {
            ThreadUtils.getInstance().runOnUiThread(CaptchaVerifyView.this::close);
        }

        @JavascriptInterface
        public void doClose(String params) {
            doClose();
        }

        @JavascriptInterface
        public String getInitParams() {
            return "{}";
        }

        @JavascriptInterface
        public String getInitParams(String res) {
            return "{}";
        }


        @JavascriptInterface
        public void invokeNativeCallback(String json) {
            ThreadUtils.getInstance().runOnUiThread(CaptchaVerifyView.this::dismiss);
        }
    }
}
