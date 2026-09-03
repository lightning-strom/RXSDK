package com.ruixue.sdk.vk;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.TextUtils;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.ruixue.logger.RXLogger;

/**
 * WebView 页面，加载 VK OAuth 授权 URL。
 * 授权成功后 VK 重定向至 redirect_uri 并携带 code / device_id / state，
 * 本 Activity 拦截重定向并将参数通过 Intent 返回给 {@link VkSdkWrapper}。
 */
public class VkAuthActivity extends Activity {

    static final String EXTRA_AUTH_URL = "vk_auth_url";
    static final String EXTRA_REDIRECT_URI = "vk_redirect_uri";
    static final String EXTRA_STATE = "vk_state";

    static final String RESULT_CODE = "vk_code";
    static final String RESULT_DEVICE_ID = "vk_device_id";
    static final String RESULT_ERROR = "vk_error";

    private String redirectUri;
    private String expectedState;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_vk_auth);

        String authUrl = getIntent().getStringExtra(EXTRA_AUTH_URL);
        redirectUri = getIntent().getStringExtra(EXTRA_REDIRECT_URI);
        expectedState = getIntent().getStringExtra(EXTRA_STATE);

        if (TextUtils.isEmpty(authUrl) || TextUtils.isEmpty(redirectUri)) {
            RXLogger.e("auth_url or redirect_uri is empty");
            finishWithError("auth_url or redirect_uri is empty");
            return;
        }

        WebView webView = findViewById(R.id.vk_webview);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                RXLogger.d("loading: " + url);
                if (url.startsWith(redirectUri)) {
                    handleRedirect(url);
                    return true;
                }
                return false;
            }
        });
        webView.loadUrl(authUrl);
    }

    private void handleRedirect(String url) {
        Uri uri = Uri.parse(url);
        String code = uri.getQueryParameter("code");
        String deviceId = uri.getQueryParameter("device_id");
        String state = uri.getQueryParameter("state");

        if (!TextUtils.isEmpty(expectedState) && !expectedState.equals(state)) {
            RXLogger.e("state mismatch, expected=" + expectedState + ", got=" + state);
            finishWithError("state mismatch");
            return;
        }

        if (TextUtils.isEmpty(code)) {
            String error = uri.getQueryParameter("error");
            String desc = uri.getQueryParameter("error_description");
            RXLogger.e("auth error: " + error + " - " + desc);
            finishWithError(TextUtils.isEmpty(desc) ? (TextUtils.isEmpty(error) ? "unknown" : error) : desc);
            return;
        }

        Intent data = new Intent();
        data.putExtra(RESULT_CODE, code);
        data.putExtra(RESULT_DEVICE_ID, deviceId);
        setResult(RESULT_OK, data);
        finish();
    }

    private void finishWithError(String msg) {
        Intent data = new Intent();
        data.putExtra(RESULT_ERROR, msg);
        setResult(RESULT_OK, data);
        finish();
    }

    @Override
    public void onBackPressed() {
        setResult(RESULT_CANCELED);
        super.onBackPressed();
    }
}
