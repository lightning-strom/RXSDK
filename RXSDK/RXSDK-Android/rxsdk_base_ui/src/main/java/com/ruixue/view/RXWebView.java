package com.ruixue.view;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.DialogInterface;
import android.content.res.ColorStateList;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.net.http.SslError;
import android.text.TextUtils;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.SslErrorHandler;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.ColorInt;
import androidx.annotation.DrawableRes;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RXRequestCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.AndroidBugFix;
import com.ruixue.base.UserActionTrackManager;
import com.ruixue.error.RXException;
import com.ruixue.internal.ActivityLifecycleTracker;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.HttpUtil;
import com.ruixue.net.URLHelper;
import com.ruixue.openapi.OnViewCloseListener;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXView;
import com.ruixue.passport.AccessToken;
import com.ruixue.passport.AccountHelper;
import com.ruixue.passport.LoginData;
import com.ruixue.passport.LoginMethod;
import com.ruixue.passport.PassportManager;
import com.ruixue.ui.BuildConfig;
import com.ruixue.ui.R;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ThreadUtils;
import com.ruixue.utils.UIToast;
import com.ruixue.widget.BaseDialog;
import com.ruixue.widget.RXChromeWebClient;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class RXWebView extends RXView {

    protected WebView mWebView;
    String url;
    @DrawableRes
    int titleBgResId;
    @ColorInt
    protected int titleBackgroundColor = Integer.MIN_VALUE;
    @DrawableRes
    int titleResId;
    protected String title;
    protected TextView tvTitle;
    ImageView ivTitle;
    ImageView ivClose;
    protected ImageView back;
    protected ProgressBar progressBar;
    private boolean closeEnable = true;
    protected OnViewCloseListener onCloseListener;
    protected RXJSONCallback rxjsonCallback;
    protected LinearLayout mWebRoot;

    protected boolean goBackEnable = false;
    public static final String JS_BRIDGE_NAME = JsBridge.class.getSimpleName();
    OnOpenChatServiceListener onOpenChatServiceListener;

    OnGetParamsListener onGetParamsListener;

    protected Map<String, Object> extParams;
    protected Map<String, Object> realAuthParams;
    protected JsBridge mJsBridge = new JsBridge();

    protected void setExtParams(Map<String, Object> extParams) {
        this.extParams = extParams;
    }

    protected void setRealAuthParams(Map<String, Object> realAuthParams) {
        this.realAuthParams = realAuthParams;
    }

    private boolean jsDisable = false;

    public boolean isJsDisable() {
        return jsDisable;
    }

    public RXWebView setJsDisable(boolean jsDisable) {
        this.jsDisable = jsDisable;
        return this;
    }

    public RXWebView setCallback(RXJSONCallback rxjsonCallback) {
        this.rxjsonCallback = rxjsonCallback;
        return this;
    }

    public void setOpenChatServiceCallback(OnOpenChatServiceListener openChatServiceCallback) {
        this.onOpenChatServiceListener = openChatServiceCallback;
    }

    public void setCookie(String url, Map<String, String> cookies) {
        setWebViewCookie(mWebView, url, cookies);
    }

    public static void setWebViewCookie(WebView webView, String url, Map<String, String> cookies) {
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webView, true);
        CookieManager.setAcceptFileSchemeCookies(true);
        // 清除webview里的所有cookie
        // cookieManager.removeSessionCookies(null);
        for (Map.Entry<String, String> entry : cookies.entrySet()) {
            cookieManager.setCookie(url, entry.getKey() + "=" + URLHelper.urlEncode(entry.getValue()));
        }

        cookieManager.flush();
        // cookieManager.setCookie(url, StringCookie, new ValueCallback<Boolean>() {
        // @Override
        // public void onReceiveValue(Boolean aBoolean) {
        //// Log.d(TAG,"setCookie() aBoolean:"+aBoolean);
        // }
        // });

    }

    public void setOnGetParamsListener(OnGetParamsListener onGetParamsListener) {
        this.onGetParamsListener = onGetParamsListener;
    }

    public RXWebView setOnCloseListener(OnViewCloseListener onCloseListener) {
        this.onCloseListener = onCloseListener;
        return this;

    }

    public RXWebView setBackEnable(boolean backEnable) {
        this.goBackEnable = backEnable;
        if (back != null) {
            back.setVisibility(backEnable ? View.VISIBLE : View.GONE);
        }
        return this;
    }

    public void setCloseEnable(boolean visible) {
        this.closeEnable = visible;
        if (ivClose != null) {
            ivClose.setVisibility(visible ? View.VISIBLE : View.GONE);
            setCancelable(visible);
        }
    }

    public boolean isHttp(String url) {
        return !TextUtils.isEmpty(url) && url.startsWith("http");
    }

    public void doCallback(String json) {
        RXLogger.i("web:" + json);
        try {

            JSONObject jsonObject = new JSONObject(json);
            String type = jsonObject.optString("type", "");
            handleJsCallback(type, jsonObject);
        } catch (JSONException e) {
            if (rxjsonCallback != null) {
                rxjsonCallback.onError(new RXException(e));
            }
        }
    }

    protected void handleJsCallback(String type, JSONObject jsonObject) {
        LoginData loginData = RuiXueSdk.getLoginData();
        boolean update_data = jsonObject.optBoolean("update_data");
        if (loginData != null) {
            JSONObject data = jsonObject.optJSONObject("data");
            JSONObject ext = jsonObject.optJSONObject("ext");
            if (type.equals("real_auth")) {
                if (data != null) {
                    int age = data.optInt("age", 0);
                    if (age > 0) {
                        loginData.setAge(age);
                    }
                }
                if (jsonObject.optInt("code", -1) == 0) {
                    loginData.setAttr(LoginData.LoginAttrMask.REAL_NAME);
                }
            } else if (type.equals("deregister")) {
                loginData.setDeregister(true);
            } else if (type.equals("underegister")) {
                loginData.setDeregister(false);
            } else if (type.equals("binding_phone") && null != ext) {
                loginData.setExtPhone(ext.optString("phone"));
                loginData.setAttr(LoginData.LoginAttrMask.BIND_PHONE);
            } else if (type.equals("change_phone") && null != ext) {
                loginData.setExtPhone(ext.optString("phone"));
                loginData.setAttr(LoginData.LoginAttrMask.BIND_PHONE);
                if (LoginMethod.QUICKPHONE.equals(loginData.getLoginMethod())
                        || loginData.getLoginMethod().equals(LoginMethod.USERNAME)
                        || loginData.getLoginMethod().equals(LoginMethod.CAPTCHACODE)) {
                    loginData.setUsername(ext.optString("phone"));
                    loginData.setLoginUsername(ext.optString("phone"));
                    AccountHelper.updateAccountCache(loginData);
                }
            } else if (type.equals("binding_email") && null != ext) {
                loginData.setExtEmail(ext.optString("email"));
                loginData.setAttr(LoginData.LoginAttrMask.BIND_EMAIL);
            } else if (type.equals("change_email") && null != ext) {
                loginData.setExtEmail(ext.optString("email"));
                loginData.setAttr(LoginData.LoginAttrMask.BIND_EMAIL);
                if (loginData.getLoginMethod().equals(LoginMethod.USERNAME)
                        || loginData.getLoginMethod().equals(LoginMethod.CAPTCHACODE)) {
                    loginData.setUsername(ext.optString("email"));
                    loginData.setLoginUsername(ext.optString("email"));
                    AccountHelper.updateAccountCache(loginData);
                }
            } else if (type.equals("reset_password")) {
                if (rxjsonCallback != null) {
                    rxjsonCallback.onSuccess(jsonObject);
                }
                return;
            } else if (type.equals("close_webview")) {
                ThreadUtils.getInstance().runOnUiThread(this::close);
                return;
            } else if ("callback".equals(type)) {
                if (jsonObject.optInt("code", -1) == 0) {
                    rxjsonCallback.onSuccess(jsonObject.optJSONObject("data"));
                } else {
                    rxjsonCallback.onFailed(jsonObject);
                }
                return;
            }
        }
        if (!update_data) {
            ThreadUtils.getInstance().runOnUiThread(this::dismiss);
            if (rxjsonCallback != null) {
                rxjsonCallback.onSuccess(jsonObject);
            }
        }
    }

    protected void openNewWebView(String url) {
        close();
        RXWebView rxWebView = RXWebView.create(getContext(), url).setBackEnable(goBackEnable)
                .setTitleBackgroundColor(titleBackgroundColor);
        updateWebViewTitle(rxWebView);
        rxWebView.show();
    }

    public interface OnOpenChatServiceListener {
        void onClickChatService(String params);
    }

    public interface OnGetParamsListener {
        String getParams();
    }

    public RXWebView(Context context) {
        super(context);
        mWebView = createWebView();
        progressBar = new ProgressBar(context);
        progressBar.setIndeterminateTintList(ColorStateList.valueOf(Color.parseColor("#20c0b3")));
        RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        layoutParams.addRule(RelativeLayout.CENTER_IN_PARENT);
        progressBar.setLayoutParams(layoutParams);

        getDialog().setOnDismissListener(new OnDismissListener() {
            @Override
            public void onDismiss(DialogInterface dialog) {
                mWebView.clearCache(false);
                mWebView.destroy();
            }
        });
    }

    public static RXWebView create(Context activity, String url, boolean jsDisable) {
        return new RXWebView(activity).setJsDisable(jsDisable).loadUrl(url);
    }

    public static RXWebView create(Context activity, String url) {
        return new RXWebView(activity).loadUrl(url);
    }

    public static RXWebView create(Context activity, String title, String url) {
        return new RXWebView(activity).setTitle(title).loadUrl(url);
    }

    public RXWebView loadData(String data, String mimeType, String encoding) {
        if (mWebView != null) {
            mWebView.loadData(data, mimeType, encoding);
        }
        return this;
    }

    public RXWebView setTitleBgResId(@DrawableRes int titleBgResId) {
        this.titleBgResId = titleBgResId;
        return this;
    }

    public RXWebView setTitleBackgroundColor(@ColorInt int color) {
        this.titleBackgroundColor = color;
        return this;
    }

    public RXWebView setTitle(String title) {
        this.title = title;
        if (this.tvTitle != null && this.title != null && !this.title.equals("")) {
            this.tvTitle.setText(title);
            tvTitle.setVisibility(View.VISIBLE);
            if (ivTitle != null && ivTitle.getVisibility() == View.VISIBLE) {
                ivTitle.setVisibility(View.GONE);
            }
        }
        return this;
    }

    public RXWebView setTitle(int resId) {
        titleResId = resId;
        return this;
    }

    protected Drawable mLogoDrawable = null;
    protected RelativeLayout header;

    public RXWebView setTitle(Drawable drawable) {
        mLogoDrawable = drawable;
        return this;
    }

    public String getTitle() {
        return title;
    }

    public String getUrl() {
        return url;
    }

    public RXWebView loadUrl(String url) {
        this.url = url;
        if (mWebView != null) {
            if (jsDisable) {
                url += (url.contains("?") ? "&" : "?") + "jsdisable=1";
            }
            RXLogger.i("" + url);
            mWebView.loadUrl(url);
        }
        return this;
    }

    public WebView getWebView() {
        return this.mWebView;
    }

    @Override
    public int getResId() {
        return R.layout.rx_webview;
    }

    @Override
    public void close() {
        super.close();
        if (onCloseListener != null) {
            onCloseListener.onClosed(this);
        }
    }

    public void setNotchScreen(boolean notch) {
        isNotch = notch;
    }

    private boolean isNotch = true;

    public boolean isSoftInputResize() {
        return isSoftInputResize;
    }

    public RXWebView setSoftInputResize(boolean softInputResize) {
        isSoftInputResize = softInputResize;
        return this;
    }

    protected void setNavVisible(boolean visible) {
        if (header != null)
            header.setVisibility(visible ? View.VISIBLE : View.GONE);
        if (v_line != null)
            v_line.setVisibility(visible ? View.VISIBLE : View.GONE);
    }

    private boolean isSoftInputResize = true;
    View v_line;
    View view;

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        this.view = view;
        dialog.setOnDismissListener(
                dialog12 -> ActivityLifecycleTracker.removeActivityResultObserver(rxChromeWebClient));
        RelativeLayout rel_root = view.findViewById(R.id.rel_root);
        mWebRoot = view.findViewById(R.id.web_root);
        v_line = view.findViewById(R.id.v_line);
        header = rel_root;
        RelativeLayout webViewLayout = view.findViewById(R.id.rl_webview);
        back = view.findViewById(R.id.back);
        back.setVisibility(goBackEnable ? View.VISIBLE : View.GONE);
        ivClose = view.findViewById(R.id.close);

        setCancelable(closeEnable);
        ivClose.setVisibility(!isCancelable() ? View.GONE : View.VISIBLE);
        ivClose.setVisibility(isCancelable() ? View.VISIBLE : View.GONE);
        ivClose.setEnabled(isCancelable());
        boolean isLandscape = isLandscape();
        if (isLandscape) {
            RelativeLayout.LayoutParams closeLayoutParams = (RelativeLayout.LayoutParams) ivClose.getLayoutParams();
            closeLayoutParams.setMarginEnd(AppUtils.getHorDisplayCutout(getContext()));

            LinearLayout.LayoutParams layoutParams = (LinearLayout.LayoutParams) webViewLayout.getLayoutParams();
            layoutParams.setMarginStart(AppUtils.getHorDisplayCutout(getContext()));
            layoutParams.setMarginEnd(AppUtils.getHorDisplayCutout(getContext()));

            RelativeLayout.LayoutParams backLayoutParams = (RelativeLayout.LayoutParams) back.getLayoutParams();
            backLayoutParams.setMarginStart(AppUtils.getHorDisplayCutout(getContext()));
            back.setLayoutParams(backLayoutParams);
        } else {

            if (isNotch) {
                RelativeLayout.LayoutParams layoutParams = (RelativeLayout.LayoutParams) view
                        .findViewById(R.id.rel_header).getLayoutParams();
                layoutParams.topMargin = (AppUtils.getTopDisplayCutout(getContext()));
            } else {
                RelativeLayout.LayoutParams layoutParams = (RelativeLayout.LayoutParams) back.getLayoutParams();
                layoutParams.setMarginStart(AppUtils.getTopDisplayCutout(getContext()));
            }
        }
        ivClose.setOnClickListener(v -> {
            onCloseClicked(dialog);
        });
        back.setOnClickListener(v -> {
            if (mWebView != null && mWebView.canGoBack()) {
                mWebView.goBack();
            } else {
                onCloseClicked(dialog);
            }
        });
        dialog.setOnCancelListener(dialog1 -> {
            if (onCloseListener != null) {
                onCloseListener.onClosed(this);
            }
        });

        if (0 != titleBgResId) {
            rel_root.setBackgroundResource(titleBgResId);
        } else if (titleBackgroundColor != Integer.MIN_VALUE) {
            rel_root.setBackgroundColor(titleBackgroundColor);
        }
        ivTitle = view.findViewById(R.id.iv_title);
        tvTitle = view.findViewById(R.id.tv_title);
        updateWebViewTitle(this);

        if (mWebView != null) {
            webViewLayout.addView(mWebView);
            webViewLayout.addView(progressBar);
            progressBar.setVisibility(View.VISIBLE);
        }
        if (isSoftInputResize) {
            AndroidBugFix.rocFix(view);
        }
    }

    protected void onCloseClicked(DialogInterface dialog) {
        dialog.cancel();
    }

    protected static void updateWebViewTitle(RXWebView rxWebView) {
        if (rxWebView.titleResId != 0 || rxWebView.mLogoDrawable != null) {
            rxWebView.ivTitle.setVisibility(View.VISIBLE);
            if (rxWebView.mLogoDrawable != null) {
                rxWebView.ivTitle.setBackground(rxWebView.mLogoDrawable);
            } else {
                rxWebView.ivTitle.setBackgroundResource(rxWebView.titleResId);
            }
            rxWebView.tvTitle.setVisibility(View.GONE);
        } else if (!TextUtils.isEmpty(rxWebView.title)) {
            rxWebView.tvTitle.setVisibility(View.VISIBLE);
            rxWebView.setTitle(rxWebView.title);
        }
    }

    RXChromeWebClient rxChromeWebClient;

    public WebSettings getSettings() {
        return mWebView != null ? mWebView.getSettings() : null;
    }

    private WebView createWebView() {
        WebView webView = new WebView(getContext());

        webView.setLayoutParams(new FrameLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT,
                RelativeLayout.LayoutParams.MATCH_PARENT));
        // 允许解析js
        WebSettings settings = webView.getSettings();
        // 设置此属性，可任意比例缩放
        settings.setUseWideViewPort(true);
        // 适应webview
        settings.setLoadWithOverviewMode(true);
        // 设置可以支持缩放
        // settings.setSupportZoom(true);
        // 设置出现缩放工具
        // settings.setBuiltInZoomControls(false);
        // 手势焦点
        webView.requestFocusFromTouch();
        settings.setDomStorageEnabled(true);
        settings.setBlockNetworkImage(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setDatabaseEnabled(true);
        settings.setLoadsImagesAutomatically(true);

        settings.setJavaScriptEnabled(RXGlobalData.isJavaScriptEnabled());

        settings.setAllowFileAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);

        if (!jsDisable) {
            webView.addJavascriptInterface(mJsBridge, JS_BRIDGE_NAME);
        }
        rxChromeWebClient = new RXChromeWebClient();
        webView.setWebChromeClient(rxChromeWebClient);
        // 如果页面中链接，如果希望点击链接继续在当前browser中响应，
        // 而不是新开Android的系统browser中响应该链接，必须覆盖webview的WebViewClient对象
        webView.setWebViewClient(getWebViewClient());
        return webView;
    }

    public class RXWebViewClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            // 重写此方法表明点击网页里面的链接还是在当前的webview里跳转，不跳到浏览器那边
            if (HttpUtil.parseUrlScheme(view, JsBridge.class, mJsBridge, request.getUrl())) {
                return true;
            } else if (!request.getUrl().toString().startsWith("http")) {
                return AppUtils.startApp(getContext(), request.getUrl().toString());
            } else {
                return super.shouldOverrideUrlLoading(view, request);
            }
        }

        @Override
        public void onPageStarted(WebView view, String url, Bitmap favicon) {
            super.onPageStarted(view, url, favicon);
            progressBar.setVisibility(View.VISIBLE);
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            progressBar.setVisibility(View.GONE);
            if (ivTitle != null && ivTitle.getVisibility() != View.VISIBLE) {
                setTitleFromWebView(view);
            }
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            super.onReceivedError(view, request, error);
            progressBar.setVisibility(View.GONE);
        }

        @SuppressLint("WebViewClientOnReceivedSslError")
        @Override
        public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
            if (BuildConfig.DEBUG)
                handler.proceed();
            else
                super.onReceivedSslError(view, handler, error);
        }
    }

    @NonNull
    protected WebViewClient getWebViewClient() {
        return new RXWebViewClient();
    }

    private void setTitleFromWebView(WebView webView) {
        webView.post(() -> webView.evaluateJavascript(
                "(function() { return window.jsTitle!=undefined ? jsTitle():document.title; })();", t -> {
                    // value即为js返回值
                    if (TextUtils.isEmpty(getTitle()) && !TextUtils.isEmpty(t) && !"null".equals(t) && t.length() > 2) {
                        String unescaped = t.substring(1, t.length() - 1) // remove wrapping quotes
                                .replace("\\\\", "\\") // unescape \\ -> \
                                .replace("\\\"", "\""); // unescape \" -> "
                        setTitle(unescaped);
                    }
                }));
    }

    public RXWebView clearCache(Context context) {
        if (mWebView != null)
            mWebView.clearCache(true);
        context.deleteDatabase("webview.db");
        context.deleteDatabase("webviewCache.db");
        return this;
    }

    private void refreshAccessToken(String str) {
        if (mWebView != null)
            mWebView.post(() -> mWebView.evaluateJavascript(
                    "(function() { return window.refreshAccessToken!=undefined ? refreshAccessToken('" + str
                            + "'):undefined; })();",
                    t -> {
                        RXLogger.i("refreshAccessToken result:" + t);
                    }));
    }

    // 支付宝 IIFAA 实名：跳转支付宝，返回前台后查询认证结果
    // （注销场景 source 传 deregister）并回传 JS
    private void startIIFAAAuth(String json) {
        String appName = null;
        String scheme = null;
        JSONObject params = JSONUtil.toJSONObject(json);
        if (params != null) {
            appName = params.optString("app_name", null);
            scheme = params.optString("scheme", null);
        }
        if (TextUtils.isEmpty(appName)) {
            appName = AppUtils.getAppName(getContext());
            if (TextUtils.isEmpty(appName)) {
                appName = getContext().getPackageName();
            }
        }
        RXLogger.i("IIFAA WebView openIIFAAAuth appName=" + appName + ", scheme=" + scheme + ", json=" + json);
        RXSdkApi.getInstance().getIIFAARedirectURL(appName, scheme, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                int code = response == null ? -1 : response.optInt("code");
                if (code != 0) {
                    RXLogger.e("IIFAA WebView redirect_url failed: " + response);
                    RXSdkApi.getInstance().clearIifaaAutoValidateCallback();
                    sendIIFAAResultToJs(response);
                    return;
                }
                JSONObject data = response == null ? null : response.optJSONObject("data");
                String redirectUrl = data == null ? "" : data.optString("url");
                RXLogger.i("IIFAA WebView redirect_url success, url=" + redirectUrl);
                if (TextUtils.isEmpty(redirectUrl)) {
                    RXSdkApi.getInstance().clearIifaaAutoValidateCallback();
                    RXLogger.e("IIFAA WebView redirect_url empty, callback iifaaResult");
                    sendIifaaLocalFailureToJs(getContext().getString(R.string.rx_txt_realname_failed));
                    return;
                }
                if (!AppUtils.startApp(getContext(), redirectUrl)) {
                    RXSdkApi.getInstance().clearIifaaAutoValidateCallback();
                    RXLogger.e("IIFAA WebView startApp failed, url=" + redirectUrl);
                    sendIifaaLocalFailureToJs(getContext().getString(R.string.rx_txt_realname_failed));
                    return;
                }
                RXLogger.i("IIFAA WebView startApp ok, register auto validate listener");
                registerIIFAAAutoValidate();
            }
        });
    }

    // 监听前后台切换查询 IIFAA 认证结果，逻辑与实名认证一致，source 传 deregister
    private void registerIIFAAAutoValidate() {
        RXLogger.i("IIFAA WebView register auto validate callback, source=deregister");
        RXSdkApi.getInstance().setIifaaAutoValidateCallback("deregister", createIifaaAutoValidateCallback());
    }

    private RXRequestCallback createIifaaAutoValidateCallback() {
        return new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                int code = response == null ? -1 : response.optInt("code");
                if (code == 0) {
                    RXLogger.i("IIFAA WebView auto validate success, notify JS");
                } else {
                    RXLogger.e("IIFAA WebView auto validate failed: " + response);
                }
                RXSdkApi.getInstance().clearIifaaAutoValidateCallback();
                sendIIFAAResultToJs(response);
            }
        };
    }

    private void sendIifaaLocalFailureToJs(@NonNull String message) {
        sendIIFAAResultToJs(buildLocalIIFAAFailure(message));
    }

    private String getIIFAAErrorMessage(@NonNull JSONObject cause) {
        String message = cause.optString("msg");
        return TextUtils.isEmpty(message) ? getContext().getString(R.string.rx_txt_realname_failed) : message;
    }

    @NonNull
    private JSONObject buildLocalIIFAAFailure(@NonNull String message) {
        try {
            JSONObject obj = new JSONObject();
            obj.put("code", -1);
            obj.put("msg", message);
            return obj;
        } catch (JSONException e) {
            return new JSONObject();
        }
    }

    // 原生调用 JS 方法 iifaaResult，将实名认证结果传给 JS
    // （RXRequestCallback 统一结构：code/data 或 code/msg）
    private void sendIIFAAResultToJs(@Nullable JSONObject response) {
        String str = response == null ? "" : response.toString();
        if (mWebView == null) {
            RXLogger.e("IIFAA WebView iifaaResult skipped, webView is null, payload=" + str);
            return;
        }
        RXLogger.i("IIFAA WebView invoke iifaaResult, payload=" + str);
        mWebView.post(() -> mWebView.evaluateJavascript(
                "(function() { return window.iifaaResult!=undefined ? iifaaResult('" + str + "'):undefined; })();",
                t -> {
                    RXLogger.i("IIFAA WebView iifaaResult js ret=" + t);
                }));
    }

    public interface JsBridgeListener {
        void openWebView(String url);

        String getInitParams(String params);
    }

    public class JsBridge {
        public JsBridge() {
        }

        @JavascriptInterface
        public void openWebView(String url) {
            ThreadUtils.getInstance().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    openNewWebView(url);
                }
            });
        }

        @JavascriptInterface
        public void minimized(String json) {
            ThreadUtils.getInstance().runOnUiThread(RXWebView.this::hide);
        }

        @JavascriptInterface
        public boolean isAppInstalled(String uri) {
            return AppUtils.isAppInstalled(getContext(), Uri.parse(uri));
        }

        @JavascriptInterface
        public void openSystemWebView(String url) {
            AppUtils.startApp(getContext(), url);
        }

        @JavascriptInterface
        public void openIIFAAAuth(String json) {
            RXLogger.i("IIFAA WebView JsBridge.openIIFAAAuth");
            ThreadUtils.getInstance().runOnUiThread(() -> startIIFAAAuth(json));
        }

        @JavascriptInterface
        public void closeWebView(String json) {
            ThreadUtils.getInstance().runOnUiThread(RXWebView.this::close);
        }

        @JavascriptInterface
        public void reportUserLog(String report) {
            ThreadUtils.getInstance().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    RXSdkApi.getInstance().onReportUserLog(report);
                }
            });
        }

        @JavascriptInterface
        public void showToast(String json) {
            ThreadUtils.getInstance().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    UIToast.showToast(getContext(), json);
                }
            });
        }

        @JavascriptInterface
        public void setTitle(String title) {
            ThreadUtils.getInstance().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    RXWebView.this.setTitle(title);
                }
            });
        }

        @JavascriptInterface
        public void invokeNativeCallback(String json) {
            ThreadUtils.getInstance().runOnUiThread(() -> doCallback(json));
        }

        @JavascriptInterface
        public void setNaviBarVisible(boolean visible) {
            ThreadUtils.getInstance().runOnUiThread(() -> {
                setNavVisible(visible);
            });
        }

        @JavascriptInterface
        public void setNaviBarVisible(String visible) {
            setNaviBarVisible(Boolean.parseBoolean(visible));
        }

        @JavascriptInterface
        public void doClose() {
            close();
        }

        @JavascriptInterface
        public void doClose(String params) {
            close();
        }

        @JavascriptInterface
        public String getInitParams() {
            if (onGetParamsListener != null) {
                return onGetParamsListener.getParams();
            } else {
                return HttpUtil.getWebViewJson(getContext(), extParams, null, null, realAuthParams, false);
            }
        }

        @JavascriptInterface
        public String getInitParams(String params) {
            return getInitParams();
        }

        @JavascriptInterface
        public void openChatService(String params) {
            ThreadUtils.getInstance().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (onOpenChatServiceListener != null) {
                        onOpenChatServiceListener.onClickChatService(params);
                    }
                }
            });
        }

        @JavascriptInterface
        public void resetpwdSuccess(String username) {
            ThreadUtils.getInstance().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (rxjsonCallback != null) {
                        try {
                            JSONObject jsonObject = new JSONObject(username);
                            rxjsonCallback.onSuccess(jsonObject);
                        } catch (Exception ignore) {
                        }
                    }
                }
            });
        }

        @JavascriptInterface
        public void trackUserAction(String properties) {
            UserActionTrackManager.getInstance().reportUserAction(JSONUtil.toMap(properties));
        }

        @JavascriptInterface
        public void clearCache() {
            RXWebView.this.clearCache(RXWebView.this.getContext());
        }

        @JavascriptInterface
        public void clearCache(String params) {
            clearCache();
        }

        @JavascriptInterface
        public void refreshAccessToken(boolean visible) {
            ThreadUtils.getInstance().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    PassportManager.getInstance()
                            .refreshCurrentAccessTokenAsync(new AccessToken.AccessTokenRefreshCallback() {
                                @Override
                                public void onTokenRefreshed(AccessToken accessToken) {
                                    Map<String, Object> m = new HashMap<>();
                                    m.put("code", 0);
                                    m.put("data", accessToken.toJson());
                                    RXWebView.this.refreshAccessToken(new JSONObject(m).toString());
                                }

                                @Override
                                public void onTokenRefreshFailed(JSONObject errorMessage) {
                                    RXWebView.this.refreshAccessToken(errorMessage.toString());
                                }
                            });
                }
            });
        }

        @JavascriptInterface
        public void refreshAccessToken(String visible) {
            refreshAccessToken(Boolean.parseBoolean(visible));
        }

        @JavascriptInterface
        public void setCloseVisible(boolean visible) {
            ThreadUtils.getInstance().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    setCloseEnable(visible);
                }
            });
        }

        @JavascriptInterface
        public void setCloseVisible(String visible) {
            setCloseVisible(Boolean.parseBoolean(visible));
        }

        @JavascriptInterface
        public void setBackVisible(boolean visible) {
            ThreadUtils.getInstance().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    setBackEnable(visible);
                }
            });
        }

        // pay 改为 hq
        @JavascriptInterface
        public void hq(String json) {
            ThreadUtils.getInstance().runOnUiThread(() -> handleJsCallback("hq", JSONUtil.toJSONObject(json)));
        }

        @JavascriptInterface
        public void setBackVisible(String visible) {
            setBackVisible(Boolean.parseBoolean(visible));
        }
    }

}
