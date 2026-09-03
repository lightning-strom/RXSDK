package com.ruixue.sdk.reddit;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.text.TextUtils;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class RedditLoginWebviewActivity extends Activity {

    private final static String TAG = "RedditLoginWebview";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_reddit_login_webview);

        if (getIntent() == null) {
            return;
        }

        String url = getIntent().getStringExtra("url");

        if (TextUtils.isEmpty(url)) {
            return;
        }

        WebView mWebView = findViewById(R.id.webview);

        mWebView.getSettings().setJavaScriptEnabled(true);

        mWebView.loadUrl(url);

        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);

            }
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);

                if (url.contains("access_token=")) {
                    String resUrl = url;
                    if (url.contains("#")) {
                        resUrl = url.replace("#", "?");
                    }
                    Uri uri = Uri.parse(resUrl);

                    String access_token = uri.getQueryParameter("access_token");
                    String expires_in = uri.getQueryParameter("expires_in");

                    Intent intent = new Intent();
                    intent.putExtra("access_token", access_token);
                    intent.putExtra("expires_in", expires_in);

                    setResult(5000, intent);
                    finish();
                } else if (url.contains("error=access_denied")) {
                    setResult(6000, null);
                    finish();
                }

            }

        });

    }
}