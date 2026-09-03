package com.ruixue.view;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.content.Context;
import android.content.res.Configuration;
import android.graphics.drawable.ColorDrawable;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.DownloadListener;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;

import androidx.annotation.NonNull;

import com.ruixue.RuiXueSdk;
import com.ruixue.base.Downloader;
import com.ruixue.base.R;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXGlobalData;

import java.util.HashMap;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/11
 */
public class WebViewDialog extends Dialog {

    private WebView webView;
    private ProgressBar progressBar;
    ImageButton closeButton;
    //    ImageButton backButton;
    private final boolean showClose;
    private boolean isDismissed = false;
    private boolean isDownloadInBrowser = true;
    private Map<String, String> headers = new HashMap<>();


    private RelativeLayout createWebViewLayout(Context context) {
        RelativeLayout relativeLayout = new RelativeLayout(context);
        relativeLayout.setLayoutParams(new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT));

        webView = new WebView(context);
        webView.setLayoutParams(new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT));
        relativeLayout.addView(webView);

        progressBar = new ProgressBar(context);
        RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        layoutParams.addRule(RelativeLayout.CENTER_IN_PARENT);
        progressBar.setLayoutParams(layoutParams);
        relativeLayout.addView(progressBar);

        Configuration configuration = getContext().getResources().getConfiguration();
        boolean isLandscape = configuration.orientation == Configuration.ORIENTATION_LANDSCAPE;
        if (isLandscape || showClose) {
            closeButton = new ImageButton(context);
            closeButton.setImageResource(R.drawable.rx_close);
            closeButton.setBackground(null);
            RelativeLayout.LayoutParams imageButtonParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
            closeButton.setOnClickListener(view -> WebViewDialog.this.cancel());
            imageButtonParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
            imageButtonParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
            imageButtonParams.setMargins(0, 20, 20, 0);
            closeButton.setLayoutParams(imageButtonParams);
            relativeLayout.addView(closeButton);
        }


//        backButton = new ImageButton(context);

//        backButton.setImageResource(R.drawable.rx_back);
//        backButton.setBackground(null);
//        RelativeLayout.LayoutParams backButtonParams = new RelativeLayout.LayoutParams(
//                RelativeLayout.LayoutParams.WRAP_CONTENT,
//                RelativeLayout.LayoutParams.WRAP_CONTENT
//        );
//        backButtonParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
//        backButtonParams.addRule(RelativeLayout.ALIGN_PARENT_LEFT);
//        backButtonParams.setMargins(20, 20, 0, 0);
//        backButton.setLayoutParams(backButtonParams);
//        backButton.setOnClickListener(view -> {
//            if (webView != null && webView.canGoBack()) {
//                webView.goBack();
//            } else {
//                cancel();
//            }
//        });
//        relativeLayout.addView(backButton);

        return relativeLayout;
    }

    public WebViewDialog(@NonNull Context context) {
        this(context, true, false);
    }

    public WebViewDialog(@NonNull Context context, boolean transparent, boolean showClose) {
        super(context, R.style.NoBackGroundDialog);
        this.showClose = showClose;
        setContentView(createWebViewLayout(context));
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        if (transparent)
            getWindow().setBackgroundDrawable(new ColorDrawable());
        getWindow().setDimAmount(0.3f);

        WindowManager.LayoutParams lp = getWindow().getAttributes();
        //设置窗口宽度为充满全屏
        lp.width = WindowManager.LayoutParams.MATCH_PARENT;
        lp.height = WindowManager.LayoutParams.MATCH_PARENT;

        //将设置好的属性set回去
        getWindow().setAttributes(lp);
        setCanceledOnTouchOutside(false);
        WebSettings settings = webView.getSettings();

        settings.setDisplayZoomControls(false);
        //允许解析js
        settings.setJavaScriptEnabled(RXGlobalData.isJavaScriptEnabled());
        settings.setAllowFileAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);

//      优先使用缓存
        settings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
//      设置此属性，可任意比例缩放
        settings.setUseWideViewPort(true);
//      适应webview
        settings.setLoadWithOverviewMode(true);
//      设置可以支持缩放
        settings.setSupportZoom(true);
//      设置出现缩放工具
        settings.setBuiltInZoomControls(false);
//      手势焦点
        webView.requestFocusFromTouch();
        settings.setDomStorageEnabled(true);
        //设置缓存
//        settings.setAppCacheEnabled(true);

        settings.setLoadsImagesAutomatically(true);

        webView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
                RXLogger.i("onDownloadStart:" + url + " ," + userAgent + " ," + contentDisposition + " ," + mimetype + " ," + contentLength);
                try {
                    if ("application/vnd.android.package-archive".equals(mimetype)) {
                        if (isDownloadInBrowser) {
                            RuiXueSdk.openURL(url);
                        } else {
                            Downloader.getInstance(context).setAutoInstall(true).downloadAPK(url, url, contentDisposition, mimetype);
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
//        // 启用 WebView 调试模式。
//        // 注意：请勿在实际 App 中打开！
//        WebView.setWebContentsDebuggingEnabled(true);

    }

    public void setDownloadInBrowser(boolean isDownloadInBrowser) {
        this.isDownloadInBrowser = isDownloadInBrowser;
    }

    public boolean isDismissed() {
        return isDismissed;
    }

    public WebViewDialog setCloseVisible(boolean show) {
        if (closeButton != null) {
            closeButton.setVisibility(show ? View.VISIBLE : View.GONE);
        }
        return this;
    }

    public WebViewDialog setBackgroundColor(int color) {
        if (webView != null) {
            webView.setBackgroundColor(color);
        }
        return this;
    }

    public WebView getWebView() {
        return webView;
    }

    public WebSettings getSettings() {
        return webView.getSettings();
    }

    public ProgressBar getProgressBar() {
        return progressBar;
    }

    public WebViewDialog setLoadVisibility(int visibility) {
        if (!isDismissed) {
            progressBar.setVisibility(visibility);
        }
        return this;
    }

    public WebViewDialog setWebViewVisibility(int visibility) {
        if (!isDismissed) {
            webView.setVisibility(visibility);
        }
        return this;
    }

    public WebViewDialog setVisibility(int visibility) {
        if (!isDismissed) {
            setLoadVisibility(visibility);
            setWebViewVisibility(visibility);
        }
        return this;
    }

    public WebViewDialog setWebViewClient(WebViewClient webViewClient) {
        webView.setWebViewClient(webViewClient);
        return this;
    }

    @SuppressLint("JavascriptInterface")
    public WebViewDialog addJavascriptInterface(Object obj, String interfaceName) {
        webView.addJavascriptInterface(obj, interfaceName);
        return this;
    }

    public WebViewDialog setHeader(@NonNull Map<String, String> headers) {
        this.headers = headers;
        return this;
    }

    public WebViewDialog addHeader(@NonNull String key, String value) {
        headers.put(key, value);
        return this;
    }

    public WebViewDialog loadUrl(String url) {
        if (headers != null && !headers.isEmpty()) {
            webView.loadUrl(url, headers);
        } else {
            webView.loadUrl(url);
        }
        show();
        return this;
    }

    public WebViewDialog loadData(String data) {
        webView.loadData(data, "text/html", "UTF-8");
        show();
        return this;
    }

    @Override
    public void dismiss() {
        isDismissed = true;
        if (webView != null) {
            final ViewGroup viewGroup = (ViewGroup) webView.getParent();
            if (viewGroup != null) {
                viewGroup.removeView(webView);
            }
            webView.removeAllViews();
            webView = null;
        }
        super.dismiss();
    }
}
