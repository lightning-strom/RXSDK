package com.ruixue.view;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.res.ColorStateList;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.http.SslError;
import android.os.Build;
import android.os.LocaleList;
import android.text.TextUtils;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.SslErrorHandler;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.ColorInt;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.AndroidBugFix;
import com.ruixue.error.RXException;
import com.ruixue.internal.ActivityLifecycleTracker;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.HttpUtil;
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
import com.ruixue.utils.ThreadUtils;
import com.ruixue.view.easyfloat.EasyFloat;
import com.ruixue.view.easyfloat.enums.ShowPattern;
import com.ruixue.view.easyfloat.enums.SidePattern;
import com.ruixue.view.easyfloat.interfaces.OnFloatCallbacks;
import com.ruixue.view.easyfloat.interfaces.OnInvokeView;
import com.ruixue.widget.BaseDialog;
import com.ruixue.widget.RXChromeWebClient;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class RXServiceWeb extends RXView {

    WebView mWebView;
    String url;
    View ivClose;
    ImageView back;
    ProgressBar progressBar;
    OnViewCloseListener onCloseListener;
    RXJSONCallback rxjsonCallback;
    @ColorInt
    protected int titleBackgroundColor = Integer.MIN_VALUE;

    private Map<String, Object> customParams = new HashMap<>();

    protected boolean goBackEnable = false;
    View msgImg;
    protected boolean isLightTheme = true;

    protected boolean showHeader = false;
    private boolean userRefreshEnable = false;

    protected String title;
    public static final String JS_BRIDGE_NAME = JsBridge.class.getSimpleName();

    OnGetParamsListener onGetParamsListener;

    public RXServiceWeb setTitle(String title) {
        this.title = title;
        return this;
    }

    public boolean isJsDisable() {
        return jsDisable;
    }

    public RXServiceWeb setJsDisable(boolean jsDisable) {
        this.jsDisable = jsDisable;
        return this;
    }

    private boolean jsDisable = false;

    public RXServiceWeb setCallback(RXJSONCallback rxjsonCallback) {
        this.rxjsonCallback = rxjsonCallback;
        return this;
    }

    public RXServiceWeb setLightTheme(boolean lightTheme) {
        isLightTheme = lightTheme;
        return this;
    }

    public void setShowHeader(boolean showHeader) {
        this.showHeader = showHeader;
    }

    public void setOnGetParamsListener(OnGetParamsListener onGetParamsListener) {
        this.onGetParamsListener = onGetParamsListener;
    }

    public RXServiceWeb setOnCloseListener(OnViewCloseListener onCloseListener) {
        this.onCloseListener = onCloseListener;
        return this;
    }

    public RXServiceWeb setBackEnable(boolean backEnable) {
        this.goBackEnable = backEnable;
        if (back != null) {
            back.setVisibility(backEnable ? View.VISIBLE : View.GONE);
        }
        return this;
    }

    public RXServiceWeb setSyncInfoEnable(boolean enable) {
        this.userRefreshEnable = enable;
        return this;
    }


    public interface OnGetParamsListener {
        String getParams();
    }


    public void onClose() {
        if (mWebView != null) {
            mWebView.clearCache(false);
            mWebView.destroy();
            mWebView = null;
        }
        msgImg = null;
        EasyFloat.dismiss();
        if (onCloseListener != null) {
            onCloseListener.onClosed(this);
            onCloseListener = null;
        }
    }

    public RXServiceWeb(Context context) {
        super(context);
        mWebView = createWebView();
        progressBar = new ProgressBar(context);
        progressBar.setIndeterminateTintList(ColorStateList.valueOf(Color.parseColor("#20c0b3")));
        RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        layoutParams.addRule(RelativeLayout.CENTER_IN_PARENT);
        progressBar.setLayoutParams(layoutParams);
        getDialog().setOnDismissListener(dialog -> {
            onClose();
        });
    }

    public static RXServiceWeb create(Context activity, String url) {
        return new RXServiceWeb(activity).loadUrl(url);
    }

    public static RXServiceWeb create(Context activity, String url, boolean jsDisable) {
        return new RXServiceWeb(activity).setJsDisable(jsDisable).loadUrl(url);
    }

    public RXServiceWeb loadData(String data, String mimeType, String encoding) {
        if (mWebView != null) {
            mWebView.loadData(data, mimeType, encoding);
        }
        return this;
    }

    public RXServiceWeb setCustomParams(Map<String, Object> customParams) {
        this.customParams = customParams;
        return this;
    }

    public Map<String, Object> getCustomParams() {
        return customParams;
    }

    public Map<String, Object> getConfigParams() {

        Map<String, Object> config = RXGlobalData.getUserCenterCfg();
        if (config == null) {
            config = new HashMap<>();
        }
        if (!config.containsKey("theme")) {
            config.put("theme", isLightTheme ? "light" : "dark");
        }
        return config;
    }

    public String getUrl() {
        return url;
    }

    public RXServiceWeb loadUrl(String url) {
        if (isLightTheme) {
            url += url.contains("?") ? "&theme=light" : "?theme=light";
        }

        this.url = url;
        if (mWebView != null) {
            RXLogger.i(url);
            if (jsDisable) {
                url += (url.contains("?") ? "&" : "?") + "jsdisable=1";
            }
            mWebView.loadUrl(url);
        }
        return this;
    }

    public WebView getWebView() {
        return this.mWebView;
    }

    public void setCloseEnable(boolean visible) {
        if (ivClose != null) {
            ivClose.setVisibility(visible ? View.VISIBLE : View.GONE);
            setCancelable(visible);
        }
    }

    @Override
    public int getResId() {
        return R.layout.rx_services_layout;
    }

    private void showTips(boolean visible) {
        if (msgImg != null) {
            msgImg.setVisibility(visible ? View.VISIBLE : View.GONE);
        }
    }

    @Override
    public void hide() {
        super.hide();

        DisplayMetrics dm = getContext().getResources().getDisplayMetrics();
        int widthPixels = dm.widthPixels;
        int heightPixels = dm.heightPixels;
        EasyFloat.with(getContext()).setLayout(R.layout.rx_services_float_btn, new OnInvokeView() {
            @Override
            public void invoke(View view) {
                msgImg = view.findViewById(R.id.iv_msg_flag);
                msgImg.setVisibility(View.GONE);
                view.setOnClickListener(v -> show());
            }
        }).setGravity(Gravity.RIGHT | Gravity.BOTTOM, -60, -100).setShowPattern(ShowPattern.CURRENT_ACTIVITY).setDragEnable(true).setBorder(10, 10, widthPixels - 10, heightPixels - 10).registerCallbacks(new OnFloatCallbacks() {
            @Override
            public void createdResult(boolean isCreated, @Nullable String msg, @Nullable View view) {
            }

            @Override
            public void show(@NonNull View view) {
            }

            @Override
            public void hide(@NonNull View view) {
            }

            @Override
            public void dismiss() {
                msgImg = null;
            }

            @Override
            public void touchEvent(@NonNull View view, @NonNull MotionEvent event) {
            }

            @Override
            public void drag(@NonNull View view, @NonNull MotionEvent event) {
            }

            @Override
            public void dragEnd(@NonNull View view) {
            }
        }).setSidePattern(SidePattern.RESULT_SIDE).show();
    }

    @Override
    public void show() {
        super.show();
        EasyFloat.dismiss();
        msgImg = null;
    }

    @Override
    public void close() {
        super.close();
        onClose();
    }

    public void setNotchScreen(boolean notch) {
        isNotch = notch;
    }

    private boolean isNotch = true;

    View header;

    @Override
    public void onCreateView(BaseDialog dialog, View view) {

        dialog.setOnCancelListener(dialog1 -> {
            if (onCloseListener != null) {
                onCloseListener.onClosed(this);
            }
        });
        back = view.findViewById(R.id.back);
        back.setOnClickListener(v -> {
            if (mWebView != null && mWebView.canGoBack()) {
                mWebView.goBack();
            } else {
                dialog.cancel();
            }
        });
        TextView tvTitle = view.findViewById(R.id.tv_title);
        tvTitle.setText(R.string.rx_txt_services);
//        Resources res = getContext().getResources();
//        Configuration config = res.getConfiguration();
//
//        RXLogger.i("language Locale.getDefault(): " + Locale.getDefault());
//
//        RXLogger.i("language config.locale: " + config.locale);
//
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
//            LocaleList localeList = config.getLocales();
//            for (int i = 0; i < localeList.size(); i++) {
//                RXLogger.i("language Locale[" + i + "]: " + localeList.get(i));
//            }
//        }
//
//        RXLogger.i("language string (rx_txt_services): " + getContext().getString(R.string.rx_txt_services));

        dialog.setOnDismissListener(dialogInterface -> {
            ActivityLifecycleTracker.removeActivityResultObserver(rxChromeWebClient);
            onClose();
        });
        RelativeLayout webViewLayout = view.findViewById(R.id.rl_webview);
        ivClose = view.findViewById(R.id.btn_rx_services);
        TextView tv = view.findViewById(R.id.tv_name);
        tv.setText(R.string.rx_txt_return_game);

        ivClose.setOnClickListener(v -> close());
        header = view.findViewById(R.id.rel_header);

        Configuration configuration = getContext().getResources().getConfiguration();
        boolean isLandscape = configuration.orientation == Configuration.ORIENTATION_LANDSCAPE;
        if (!isLandscape) {
            if (isNotch) {
                RelativeLayout.LayoutParams layoutParams = (RelativeLayout.LayoutParams) header.getLayoutParams();
                layoutParams.topMargin = (AppUtils.getTopDisplayCutout(getContext()));
            } else {
                RelativeLayout.LayoutParams layoutParams = (RelativeLayout.LayoutParams) back.getLayoutParams();
                layoutParams.setMarginStart(AppUtils.getTopDisplayCutout(getContext()) + 10);
            }
        }

        if (isLightTheme) {
            header.setBackgroundResource(R.color.white);
            back.setImageTintList(null);
            tvTitle.setTextColor(Color.BLACK);
        }

        if (mWebView != null) {
//浅色待加载背景 #DEF9FD
//深色待加载背景 #183C41
            if (!isLightTheme) {
                int clo = Color.parseColor("#183C41");
                view.setBackgroundColor(clo);
                mWebView.setBackgroundColor(clo);
                header.setBackgroundColor(clo);
//                view.setBackgroundResource(R.drawable.helper_center_bg);
//                mWebView.setBackgroundResource(R.drawable.helper_center_bg);
            } else {
                int clo = Color.parseColor("#DEF9FD");
                header.setBackgroundColor(clo);
//                view.setBackgroundColor(Color.WHITE);
                view.setBackgroundColor(Color.parseColor("#DEF9FD"));
                mWebView.setBackgroundColor(Color.parseColor("#DEF9FD"));
            }
            if (showHeader) {
                header.setVisibility(View.VISIBLE);
                ivClose.setVisibility(View.GONE);
                if (!TextUtils.isEmpty(title)) {
                    tvTitle.setText(title);
                }
            } else {
                header.setVisibility(View.INVISIBLE);
            }


            webViewLayout.addView(mWebView);
            webViewLayout.addView(progressBar);
            progressBar.setVisibility(View.VISIBLE);
        }
        AndroidBugFix.rocFix(view);
    }

    RXChromeWebClient rxChromeWebClient;

    public void doCallback(String json) {
        try {
            RXLogger.i("web:" + json);
            JSONObject jsonObject = new JSONObject(json);
            LoginData loginData = RuiXueSdk.getLoginData();

            boolean update_data = jsonObject.optBoolean("update_data");
            if (loginData != null) {
                String type = jsonObject.optString("type", "");
                JSONObject data = jsonObject.optJSONObject("data");
                JSONObject ext = jsonObject.optJSONObject("ext");
                if (type.equals("real_auth") && null != data) {
                    int age = data.optInt("age", 0);
                    if (age > 0) {
                        loginData.setAge(age);
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
                    if (LoginMethod.QUICKPHONE.equals(loginData.getLoginMethod()) || loginData.getLoginMethod().equals(LoginMethod.USERNAME) || loginData.getLoginMethod().equals(LoginMethod.CAPTCHACODE)) {
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
                    if (loginData.getLoginMethod().equals(LoginMethod.USERNAME) || loginData.getLoginMethod().equals(LoginMethod.CAPTCHACODE)) {
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
                } else if (type.equals("sync_info")) {
                    ThreadUtils.getInstance().runOnUiThread(this::syncInfo);
                    return;
                }
            }
            if (!update_data) {
                ThreadUtils.getInstance().runOnUiThread(this::dismiss);
                if (rxjsonCallback != null) {
                    rxjsonCallback.onSuccess(jsonObject);
                }
            }
        } catch (JSONException e) {
            if (rxjsonCallback != null) {
                rxjsonCallback.onError(new RXException(e));
            }
        }
    }

    private Map<String, Object> syncParams = new HashMap<>();
    private RXJSONCallback syncCallback;

    public RXServiceWeb setSyncParams(Map<String, Object> syncParams) {
        this.syncParams = syncParams;
        return this;
    }

    public void setSyncCallback(RXJSONCallback syncCallback) {
        this.syncCallback = syncCallback;
    }

    private void onSyncInfoNotify(String str) {
        if (mWebView != null)
            mWebView.post(() -> mWebView.evaluateJavascript("(function() { return window.syncInfo!=undefined ? syncInfo('" + str + "'):undefined; })();", t -> {
                RXLogger.i("onSyncInfoNotify result:" + t);
            }));
    }

    private void refreshAccessToken(String str) {
        if (mWebView != null)
            mWebView.post(() -> mWebView.evaluateJavascript("(function() { return window.refreshAccessToken!=undefined ? refreshAccessToken('" + str + "'):undefined; })();", t -> {
                RXLogger.i("refreshAccessToken result:" + t);
            }));
    }

    public void syncInfo() {
        Map<String, Object> map = syncParams == null ? new HashMap<>() : syncParams;
        map.put("method", RuiXueSdk.getLoginMethod());
        RXSdkApi.getInstance().syncInfo(RuiXueSdk.getCurrentActivity(), map, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (data != null) {
                    LoginData loginData = RuiXueSdk.getLoginData();
                    String avatar = data.optString("avatar");
                    if (!TextUtils.isEmpty(avatar)) {
                        if (loginData != null) {
                            loginData.setAvatar(avatar);
                        }
                    }
                    String nickName = data.optString("nickname");
                    if (!TextUtils.isEmpty(nickName)) {
                        if (loginData != null) {
                            loginData.setNickname(nickName);
                        }
                    }
                }
                Map<String, Object> m = new HashMap<>();
                m.put("code", 0);
                if (data != null) {
                    m.put("data", data);
                }
                onSyncInfoNotify(new JSONObject(m).toString());
                if (syncCallback != null) {
                    syncCallback.onSuccess(data);
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.i("sync failed" + cause.toString());
                if (syncCallback != null) {
                    syncCallback.onFailed(cause);
                }
                onSyncInfoNotify(cause.toString());
            }
        });
    }


    private WebView createWebView() {
        WebView webView = new WebView(getContext());

        webView.setLayoutParams(new FrameLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT));
//      允许解析js
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(RXGlobalData.isJavaScriptEnabled());
        settings.setAllowFileAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
//      设置此属性，可任意比例缩放
        settings.setUseWideViewPort(true);
//      适应webview
        settings.setLoadWithOverviewMode(true);
//      设置可以支持缩放
//        settings.setSupportZoom(true);
//      设置出现缩放工具
//        settings.setBuiltInZoomControls(false);
//      手势焦点
        webView.requestFocusFromTouch();
        settings.setDomStorageEnabled(true);
        settings.setBlockNetworkImage(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setDatabaseEnabled(true);
        settings.setLoadsImagesAutomatically(true);
        JsBridge jsBridge = new JsBridge();
        if (!jsDisable) {
            webView.addJavascriptInterface(jsBridge, JS_BRIDGE_NAME);
        }
        rxChromeWebClient = new RXChromeWebClient();
        webView.setWebChromeClient(rxChromeWebClient);
        // 如果页面中链接，如果希望点击链接继续在当前browser中响应，
        // 而不是新开Android的系统browser中响应该链接，必须覆盖webview的WebViewClient对象
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                progressBar.setVisibility(View.VISIBLE);
            }

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
                progressBar.setVisibility(View.GONE);
//                if (header != null) {
//                    header.setVisibility(View.GONE);
//                }
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
        });
        return webView;
    }

    public RXServiceWeb clearCache(Context context) {
        if (mWebView != null)
            mWebView.clearCache(true);
        context.deleteDatabase("webview.db");
        context.deleteDatabase("webviewCache.db");
        return this;
    }


    protected void openNewWebView(String url) {
        RXServiceWeb rxWebView = RXServiceWeb.create(getContext(), url);
        rxWebView.show();
    }

    public final class JsBridge {
        @JavascriptInterface
        public void minimized(String json) {
            ThreadUtils.getInstance().runOnUiThread(RXServiceWeb.this::hide);
        }

        @JavascriptInterface
        public void closeWebView(String json) {
            ThreadUtils.getInstance().runOnUiThread(RXServiceWeb.this::close);
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
        public void openSystemWebView(String url) {
            AppUtils.startApp(getContext(), url);
        }

        @JavascriptInterface
        public void setTitle(String title) {
            ThreadUtils.getInstance().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    RXServiceWeb.this.setTitle(title);
                }
            });
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
        public void invokeNativeCallback(String json) {
            ThreadUtils.getInstance().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    doCallback(json);
                }
            });
        }

        @JavascriptInterface
        public void setNaviBarVisible(boolean visible) {
            ThreadUtils.getInstance().runOnUiThread(() -> {
                if (header != null)
                    header.setVisibility(visible ? View.VISIBLE : View.GONE);
            });
        }

        @JavascriptInterface
        public void setNaviBarVisible(String params) {
            setNaviBarVisible(Boolean.parseBoolean(params));
        }

        @JavascriptInterface
        public void showTip(String json) {
            ThreadUtils.getInstance().runOnUiThread(() -> {
                showTips(true);
            });
        }

        @JavascriptInterface
        public void syncInfo(String json) {
            ThreadUtils.getInstance().runOnUiThread(RXServiceWeb.this::syncInfo);
        }

        @JavascriptInterface
        public void refreshAccessToken(boolean visible) {
            ThreadUtils.getInstance().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    PassportManager.getInstance().refreshCurrentAccessTokenAsync(new AccessToken.AccessTokenRefreshCallback() {
                        @Override
                        public void onTokenRefreshed(AccessToken accessToken) {
                            Map<String, Object> m = new HashMap<>();
                            m.put("code", 0);
                            m.put("data", accessToken.toJson());
                            RXServiceWeb.this.refreshAccessToken(new JSONObject(m).toString());
                        }

                        @Override
                        public void onTokenRefreshFailed(JSONObject errorMessage) {
                            RXServiceWeb.this.refreshAccessToken(errorMessage.toString());
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
        public String getInitParams() {
            return HttpUtil.getWebViewJson(getContext(), getCustomParams(), getConfigParams(), userRefreshEnable);
        }

        @JavascriptInterface
        public String getInitParams(String params) {
            return getInitParams();
        }
    }
}
