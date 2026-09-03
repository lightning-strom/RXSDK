package com.ruixue.view;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.net.http.SslError;
import android.text.TextUtils;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.SslErrorHandler;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.DrawableRes;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.cardview.widget.CardView;

import com.bumptech.glide.Glide;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.listener.OnMultiClickListener;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.HttpUtil;
import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.LoginUIConfig;
import com.ruixue.openapi.OnViewCloseListener;
import com.ruixue.openapi.RXApiPath;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXUserCenterConfig;
import com.ruixue.openapi.RXView;
import com.ruixue.passport.AccessToken;
import com.ruixue.passport.LoginData;
import com.ruixue.passport.PassportManager;
import com.ruixue.ui.BuildConfig;
import com.ruixue.ui.R;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.LoadingDialog;
import com.ruixue.utils.ThreadUtils;
import com.ruixue.utils.UIToast;
import com.ruixue.widget.BaseDialog;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public final class UserCenterView extends RXView implements RXWebView.OnOpenChatServiceListener {

    private RXJSONCallback callback;
    private RXJSONCallback syncCallback;
    private boolean goBackEnable = false;

    private boolean userRefreshEnable = false;

    private OnViewCloseListener onWebViewCloseListener;

    private OnViewCloseListener onCloseListener;

    private @DrawableRes int titleResId;

    public Drawable getLogoDrawable() {
        if (logoDrawable == null && LoginUIConfig.getInstance() != null) {
            logoDrawable = LoginUIConfig.getInstance().getLogoDrawable();
        }
        return logoDrawable;
    }

    private Drawable logoDrawable = null;

    private String displayUserName;

    private String avatarUrl;
    private String user_center_url;
    private int height = 0;
    private int width = 0;
    TextView tv_username;
    ImageView iv_user_head;
    private Map<String, Object> customParams = new HashMap<>();
    private Map<String, Object> syncParams = new HashMap<>();
    private boolean debugEnable = false;

    private boolean mJsDisable = false;
    WebView ucWebview;

    public boolean isJsDisable() {
        return mJsDisable;
    }

    public void setJsDisable(boolean mJsDisable) {
        this.mJsDisable = mJsDisable;
    }

    public UserCenterView setDebugEnable(boolean enable) {
        debugEnable = enable;
        return this;
    }

    public UserCenterView setSyncParams(Map<String, Object> syncParams) {
        this.syncParams = syncParams;
        return this;
    }

    public UserCenterView setSyncInfoEnable(boolean enable) {
        this.userRefreshEnable = enable;
        return this;
    }

    public void onSyncInfoCallback(RXJSONCallback syncCallback) {
        this.syncCallback = syncCallback;
    }

    /**
     * 用户中心
     * @param context activity
     */
    public static UserCenterView create(Context context) {
        return new UserCenterView(context);
    }

    public void setLogoDrawable(Drawable logoDrawable) {
        this.logoDrawable = logoDrawable;
    }

    public UserCenterView setCustomParams(Map<String, Object> customParams) {
        this.customParams = customParams;
        return this;
    }

    public UserCenterView setUserCenterConfig(RXUserCenterConfig rxUserCenterConfig) {
        if (rxUserCenterConfig != null) {
            this.setConfigParams(rxUserCenterConfig.getConfigParams());
            setSyncInfoEnable(rxUserCenterConfig.isSyncInfoEnable());
            setLogoDrawable(rxUserCenterConfig.getLogoImage());
            setCustomParams(rxUserCenterConfig.getCustomParams());
            if (rxUserCenterConfig.getOnViewCloseListener() != null)
                setOnCloseListener(rxUserCenterConfig.getOnViewCloseListener());
        }
        return this;
    }

    public UserCenterView setWebViewCloseListener(OnViewCloseListener onCloseListener) {
        this.onWebViewCloseListener = onCloseListener;
        return this;
    }

    public void setOnCloseListener(OnViewCloseListener onCloseListener) {
        this.onCloseListener = onCloseListener;
    }

    public UserCenterView setGoBackEnable(boolean goBackEnable) {
        this.goBackEnable = goBackEnable;
        return this;
    }

    public UserCenterView setTitleResId(int titleResId) {
        this.titleResId = titleResId;
        return this;
    }

    public UserCenterView setUserName(String userName) {
        this.displayUserName = userName;
        return this;
    }

    public UserCenterView setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
        return this;
    }


    public UserCenterView setCustomUrl(String user_center_url) {
        this.user_center_url = user_center_url;
        return this;
    }

    public Map<String, Object> getConfigParams() {
        return RXGlobalData.getUserCenterCfg();
    }

    public void setConfigParams(Map<String, Object> configParams) {
        RXGlobalData.setUserCenterCfg(configParams);
    }

    UserCenterView(Context context) {
        super(context);
        String baseUrl = RuiXueSdk.getFirstBaseUrl();
        if (!TextUtils.isEmpty(baseUrl) && !baseUrl.endsWith("/")) {
            baseUrl += "/";
        }
        String path = RXSdkApi.getInstance().getSdkInfo().getState() == 1 ? "static/passport/#/overseausercenter " : "static/passport/#/userCenter";
        user_center_url = baseUrl + path;
    }

    @Override
    public int getResId() {
        return R.layout.rx_user_center;
    }

    public UserCenterView setFullScreen() {
        setWidth(ViewGroup.LayoutParams.MATCH_PARENT);
        setHeight(ViewGroup.LayoutParams.MATCH_PARENT);
        return this;
    }

    /**
     * @param height 高度单位 dp
     */
    public UserCenterView setHeight(int height) {
        this.height = height;
        return this;
    }

    /**
     * @param width 宽度单位 dp
     */
    public UserCenterView setWidth(int width) {
        this.width = width;
        return this;
    }


    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        ImageView close = view.findViewById(R.id.close);
        close.setVisibility((goBackEnable || !isCancelable()) ? View.GONE : View.VISIBLE);
        close.setOnClickListener(v -> {
            dialog.cancel();
        });
        ImageView btn_back = view.findViewById(R.id.btn_back);
        btn_back.setVisibility(goBackEnable ? View.VISIBLE : View.GONE);
        btn_back.setOnClickListener(v -> {
            dialog.cancel();
        });
        CardView cardView = view.findViewById(R.id.layout);
        RelativeLayout.LayoutParams layoutParams = (RelativeLayout.LayoutParams) cardView.getLayoutParams();
        if (height != 0) {
            layoutParams.height = height;
            if (height == ViewGroup.LayoutParams.MATCH_PARENT) {
                layoutParams.topMargin = 0;
                layoutParams.bottomMargin = 0;
            }
        }
        if (width != 0) {
            layoutParams.width = width;
            if (width == ViewGroup.LayoutParams.MATCH_PARENT) {
                layoutParams.setMarginStart(0);
                layoutParams.setMarginEnd(0);
            }
        }

        dialog.setOnCancelListener(dialog1 -> {
            if (onCloseListener != null) {
                onCloseListener.onClosed(UserCenterView.this);
            }
        });

        if (RXGlobalData.getPassportCfg().getLogoDrawable() != null) {
            Drawable drawable = LoginUIConfig.getInstance().getLogoDrawable();
            view.findViewById(R.id.tv_title).setVisibility(View.GONE);
            ImageView iv_title = view.findViewById(R.id.iv_title);
            iv_title.setVisibility(View.VISIBLE);
            iv_title.setBackground(drawable);
        }

        if (titleResId != 0) {
            view.findViewById(R.id.tv_title).setVisibility(View.GONE);
            ImageView iv_title = view.findViewById(R.id.iv_title);
            iv_title.setVisibility(View.VISIBLE);
            iv_title.setBackgroundResource(titleResId);
        } else if (getLogoDrawable() != null) {
            view.findViewById(R.id.tv_title).setVisibility(View.GONE);
            ImageView iv_title = view.findViewById(R.id.iv_title);
            iv_title.setVisibility(View.VISIBLE);
            iv_title.setBackground(getLogoDrawable());
        }

        iv_user_head = view.findViewById(R.id.iv_user_head);
        ImageView iv_user_refresh = view.findViewById(R.id.iv_user_refresh);
        iv_user_refresh.setVisibility(userRefreshEnable ? View.VISIBLE : View.GONE);
        iv_user_refresh.setOnClickListener(new OnMultiClickListener() {
            @Override
            public void onMultiClick(View v) {
                syncInfo();
            }
        });
        Button btn_switch_user = view.findViewById(R.id.btn_switch_user);
        btn_switch_user.setText(R.string.rx_txt_switch_account);
        tv_username = view.findViewById(R.id.tv_username);
        if (AppUtils.isUsePortMatch(getContext())) {
            tv_username.getLayoutParams().width = getContext().getResources().getDimensionPixelSize(com.ruixue.base.R.dimen.dp_110);
            btn_switch_user.setMaxWidth(getContext().getResources().getDimensionPixelSize(com.ruixue.base.R.dimen.dp_100));
        }
        LoginData loginData = RuiXueSdk.getLoginData();
        if (loginData != null) {
            String header = loginData.getAvatar();
            if (TextUtils.isEmpty(avatarUrl) && !TextUtils.isEmpty(header)) {
                avatarUrl = header;
            }
        }

        if (!TextUtils.isEmpty(avatarUrl)) {
            Glide.with(getContext()).load(avatarUrl).apply(com.bumptech.glide.request.RequestOptions.circleCropTransform()).into(iv_user_head);
        }
        if (loginData != null && TextUtils.isEmpty(displayUserName)) {
            displayUserName = loginData.getDisplayUsername();
        }

        updateUserName(displayUserName);

        ucWebview = view.findViewById(R.id.wv_user_center);
        ProgressBar pb_loading = view.findViewById(R.id.pb_loading);
        pb_loading.setVisibility(View.GONE);
        //      允许解析js
        WebSettings settings = ucWebview.getSettings();
        settings.setJavaScriptEnabled(RXGlobalData.isJavaScriptEnabled());
        settings.setAllowFileAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setBuiltInZoomControls(false);
        settings.setDomStorageEnabled(true);
        RXWebView.JsBridgeListener listener = new RXWebView.JsBridgeListener() {
            @JavascriptInterface
            @Override
            public void openWebView(String url) {
                ThreadUtils.getInstance().runOnUiThread(() -> showWebView(url));
            }

            @JavascriptInterface
            public String getInitParams() {
                return HttpUtil.getWebViewJson(getContext(), customParams, getConfigParams(), userRefreshEnable);
            }

            @JavascriptInterface
            public String getInitParams(String params) {
                return getInitParams();
            }
        };
        ucWebview.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                RXLogger.i("shouldOverrideUrlLoading:" + request.getUrl());
                if (HttpUtil.parseUrlScheme(view, RXWebView.JsBridgeListener.class, listener, request.getUrl())) {
                    return true;
                } else if (url.startsWith("ruixue://")) {
                    ThreadUtils.getInstance().runOnUiThread(() -> showWebView(url.replace("ruixue://", "https://")));
                    return true;
                } else {
                    return super.shouldOverrideUrlLoading(view, request);
                }
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                RXLogger.i("onPageStarted: " + url);
                pb_loading.setVisibility(View.VISIBLE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                RXLogger.i("onPageFinished:" + url);
                pb_loading.setVisibility(View.GONE);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                pb_loading.setVisibility(View.GONE);
                RXLogger.i("onReceivedError：" + error.toString());
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
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.removeSessionCookies(null);
        //        RXWebView.setWebViewCookie(wv_user_center, user_center_url, getCookieMap());
        if (!mJsDisable)
            ucWebview.addJavascriptInterface(listener, RXWebView.JS_BRIDGE_NAME);

        if (debugEnable) {
            user_center_url += (user_center_url.contains("?") ? "&" : "?") + "debugMode=true";
        }
        if (mJsDisable) {
            user_center_url += (user_center_url.contains("?") ? "&" : "?") + "jsdisable=1";
        }
        ucWebview.loadUrl(user_center_url);

        btn_switch_user.setOnClickListener(new OnMultiClickListener() {
            @Override
            public void onMultiClick(View v) {
                if (callback != null) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("type", "switch_user");
                    callback.onSuccess(new JSONObject(map));
                }
                dialog.dismiss();
            }
        });
    }

    private void syncInfo() {
        Map<String, Object> map = syncParams == null ? new HashMap<>() : syncParams;
        map.put("method", RuiXueSdk.getLoginMethod());
        RXSdkApi.getInstance().syncInfo(RuiXueSdk.getCurrentActivity(), map, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (data != null) {
                    ToastUtils.showToast(getContext(), data.optString("msg", getContext().getString(R.string.rx_txt_userinfo_update)));
                    LoginData loginData = RuiXueSdk.getLoginData();
                    String avatar = data.optString("avatar");
                    if (!TextUtils.isEmpty(avatar)) {
                        if (loginData != null) {
                            loginData.setAvatar(avatar);
                        }
                        if (iv_user_head != null) {
                            Glide.with(getContext()).load(avatar).apply(com.bumptech.glide.request.RequestOptions.circleCropTransform()).into(iv_user_head);
                        }
                    }
                    String nickName = data.optString("nickname");
                    if (!TextUtils.isEmpty(nickName)) {
                        if (loginData != null) {
                            loginData.setNickname(nickName);
                        }
                        updateUserName(nickName);
                    }
                }
                if (syncCallback != null) {
                    syncCallback.onSuccess(data);
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.i("sync failed" + cause.toString());
                ToastUtils.showToast(getContext(), cause);
                if (syncCallback != null) {
                    syncCallback.onFailed(cause);
                }
            }
        });
    }

    private void updateUserName(String username) {
        if (null != tv_username && !TextUtils.isEmpty(username)) {
            tv_username.setText(username);
        }
    }


    private void showWebView(String url) {
        try {
            if (debugEnable) {
                url += (url.contains("?") ? "&" : "?") + "debugMode=true";
            }
            String finalUrl = url;
            LoadingDialog loadingDialog = LoadingDialog.create(RuiXueSdk.getContext());
            loadingDialog.closeDelay(10000).showDelay(200);
            PassportManager.getInstance().fetchCurrentAccessTokenAsync(600, new AccessToken.AccessTokenRefreshCallback() {
                @Override
                public void onTokenRefreshed(AccessToken accessToken) {
                    loadingDialog.close();
                    RXWebView rxWebView = RXWebView.create(getContext(), finalUrl, mJsDisable);
                    rxWebView.setOnGetParamsListener(() -> HttpUtil.getWebViewJson(getContext(), customParams, userRefreshEnable));
                    //        Map<String, String> cookieMap = getCookieMap();
                    //        rxWebView.setCookie(url, cookieMap);
                    //        rxWebView.setTitleBackgroundColor(Color.parseColor("#E0FFFC"));
                    //        rxWebView.setTitle(titleResId);
                    rxWebView.setCallback(new RXJSONCallback() {
                        @Override
                        public void onSuccess(@Nullable JSONObject data) {
                            if (data != null) {
                                String type = data.optString("type");
                                if (type.equals("logBackIn")) {
                                    close();
                                } else if (type.equals("change_phone") || type.equals("change_email")) {
                                    LoginData loginData = RuiXueSdk.getLoginData();
                                    if (loginData != null) {
                                        updateUserName(loginData.getDisplayUsername());
                                    }
                                } else if (type.equals("sync_info")) {
                                    syncInfo();
                                    return;
                                }
                            }
                            if (callback != null)
                                callback.onSuccess(data);
                        }

                        @Override
                        public void onFailed(@NonNull JSONObject cause) {
                            if (callback != null)
                                callback.onFailed(cause);
                        }
                    });
                    rxWebView.setBackEnable(true);
                    rxWebView.setOnCloseListener(v -> {
                        if (null != ucWebview) {
                            ucWebview.reload();
                        }
                        if (null != onWebViewCloseListener)
                            onWebViewCloseListener.onClosed(v);
                    });
                    rxWebView.setOpenChatServiceCallback(UserCenterView.this);
                    rxWebView.show();
                }

                @Override
                public void onTokenRefreshFailed(JSONObject errorMessage) {
                    UIToast.showToast(getContext(), errorMessage);
                }
            });

        } catch (Exception exception) {
            exception.printStackTrace();
        }
    }

    public UserCenterView setCallback(RXJSONCallback callback) {
        this.callback = callback;
        return this;
    }

    @Override
    public void onClickChatService(String params) {
        LoadingDialog loadingDialog = LoadingDialog.create(RuiXueSdk.getContext());
        loadingDialog.closeDelay(10000).showDelay(200);
        PassportManager.getInstance().fetchCurrentAccessTokenAsync(600, new AccessToken.AccessTokenRefreshCallback() {
            @Override
            public void onTokenRefreshed(AccessToken accessToken) {
                loadingDialog.close();
                String domain = RuiXueSdk.getFirstBaseUrl();
                String url = domain + RXApiPath.CHAT_SERVICE + "?minimized=0";
                Map<String, Object> paramsMap = new HashMap<>();
                JSONObject jsonObject = TextUtils.isEmpty(params) ? null : JSONUtil.toJSONObject(params);
                Map<String, Object> extMap = JSONUtil.toMap(jsonObject);
                if (extMap != null) {
                    paramsMap.putAll(extMap);
                }
                if (customParams != null) {
                    paramsMap.putAll(customParams);
                }
                RXServiceView.create(getContext(), url, paramsMap, true).show();
            }

            @Override
            public void onTokenRefreshFailed(JSONObject errorMessage) {
                UIToast.showToast(getContext(), errorMessage);
            }
        });

    }
}
