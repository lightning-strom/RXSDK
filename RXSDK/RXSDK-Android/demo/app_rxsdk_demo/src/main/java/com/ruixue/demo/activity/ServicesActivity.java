package com.ruixue.demo.activity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.ruixue.net.HttpUtil;
import com.ruixue.qipai.R;
import com.ruixue.utils.ThreadUtils;
import com.ruixue.widget.RXChromeWebClient;

public class ServicesActivity extends AppCompatActivity implements View.OnClickListener {


    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_webview);

        WebView webView = findViewById(R.id.webview);

//      允许解析js
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
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

//        settings.setAppCacheEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setDatabaseEnabled(true);
        settings.setLoadsImagesAutomatically(true);
        webView.addJavascriptInterface(new JsBridge(), "JsBridge");

        webView.setWebChromeClient(new RXChromeWebClient());
        // 如果页面中链接，如果希望点击链接继续在当前browser中响应，
        // 而不是新开Android的系统browser中响应该链接，必须覆盖webview的WebViewClient对象
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);

            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);

            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);

            }
        });
//        webView.setBackgroundColor(Color.parseColor("#293046"));
        webView.loadUrl("http://10.10.2.80:4043/static/service/#/welcome");
//        webView.loadUrl("http://10.10.2.80:7888/%E5%AE%A2%E6%9C%8D%E6%B5%8B%E8%AF%95%E7%94%A8%E6%88%B7%E7%AB%AF%E7%99%BB%E9%99%86(3)%E7%9A%84%E5%89%AF%E6%9C%AC.html");
    }

    public final class JsBridge {
        @JavascriptInterface
        public void minimized(String json) {

        }

        @JavascriptInterface
        public void closeWebView(String json) {

        }

        @JavascriptInterface
        public void showTip(String json) {
            ThreadUtils.getInstance().runOnUiThread(() -> {

            });
        }

        @JavascriptInterface
        public void setCloseVisible(boolean visible) {
            ThreadUtils.getInstance().runOnUiThread(new Runnable() {
                @Override
                public void run() {

                }
            });
        }

        public void setCloseVisible(String visible) {
            setCloseVisible(Boolean.parseBoolean(visible));
        }

        @JavascriptInterface
        public String getInitParams() {
            return HttpUtil.getWebViewJson(ServicesActivity.this, null, false);
        }

        @JavascriptInterface
        public String getInitParams(String params) {
            return getInitParams();
        }
    }


    @Override
    public void onClick(View v) {
        int id = v.getId();


    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

    }
}