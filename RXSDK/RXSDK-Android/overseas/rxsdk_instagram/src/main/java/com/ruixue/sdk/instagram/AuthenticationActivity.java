package com.ruixue.sdk.instagram;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.fragment.app.FragmentActivity;

import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

// Created by wangliang on 2024/4/8.
public class AuthenticationActivity extends FragmentActivity {
    private static final String TAG = AuthenticationActivity.class.getSimpleName();

    private static final String EXTRA_CLIENT_ID = "AuthenticationActivity.clientId";
    private static final String EXTRA_REDIRECT_URL = "AuthenticationActivity.redirectUrl";
    private static final String BASE_URL = "https://api.instagram.com/";

    private String clientId = null;
    private String requestUrl = null;
    private String redirectUrl = null;

    public static Bundle generateExtra(String clientId, String redirectUrl) {
        Bundle bundle = new Bundle();
        bundle.putString(EXTRA_CLIENT_ID, clientId);
        bundle.putString(EXTRA_REDIRECT_URL, redirectUrl);
        return bundle;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.setContentView(R.layout.activity_ins_authentication);

        if (getIntent() != null && getIntent().getExtras() != null) {
            Bundle bundle = getIntent().getExtras();
            clientId = bundle.getString(EXTRA_CLIENT_ID);
            redirectUrl = bundle.getString(EXTRA_REDIRECT_URL);
        }

        if (clientId == null || redirectUrl == null) {
            RXLogger.e(TAG, "client id is null or redirect url is null.");
            Intent data = new Intent();
            data.putExtra("data", JSONUtil.toJSONObject(RXErrorCode.THIRD_LOGIN_ERROR).toString());
            setResult(RESULT_OK, data);
            finish();
        }

        this.requestUrl = BASE_URL +
                "oauth/authorize/?client_id=" + clientId +
                "&redirect_uri=" + redirectUrl +
                "&response_type=code&display=page&scope=user_profile,user_media";

        initializeWebView();
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void initializeWebView() {
        WebView webView = findViewById(R.id.webView);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.loadUrl(requestUrl);
        webView.setWebViewClient(webViewClient);

        // FIXME: wangliang 这里需要显示的设置下 WebView 高度，否则因为 WebView 无法推断高度，导致显示不出来
        webView.post(() -> {
            DisplayMetrics displayMetrics = new DisplayMetrics();
            WindowManager windowManager = (WindowManager) getSystemService(Context.WINDOW_SERVICE);
            windowManager.getDefaultDisplay().getMetrics(displayMetrics);
            int width = displayMetrics.widthPixels;
            int height = displayMetrics.heightPixels;
            ViewGroup.LayoutParams params = webView.getLayoutParams();
            params.width = width;
            params.height = height;
            webView.setLayoutParams(params);
        });
    }

    WebViewClient webViewClient = new WebViewClient() {

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            RXLogger.d("InstagramSdkWrapper", "shouldOverrideUrlLoading url >" + url);
            if (url.startsWith(redirectUrl)) {
                String code = Uri.parse(url).getQueryParameter("code");
                Intent data = new Intent();
                Map<String, Object> map = new HashMap<>();
                map.put("code", 0);
                map.put("authCode", code);
                data.putExtra("data", JSONUtil.toJSONObject(map).toString());
                setResult(RESULT_OK, data);
                finish();

                return true;
            }
            return false;
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);

            RXLogger.d("InstagramSdkWrapper", "onPageFinished url >" + url);
            if (url.contains("error")) {
                String message = Uri.parse(url).getQueryParameter("message");
                Intent data = new Intent();
                JSONObject json;
                if (message == null) {
                    json = JSONUtil.toJSONObject(RXErrorCode.THIRD_LOGIN_ERROR);
                } else {
                    json = JSONUtil.toJSONObject(RXErrorCode.THIRD_LOGIN_ERROR.getValue(), message);
                }
                data.putExtra("data", json.toString());
                setResult(RESULT_OK, data);
                finish();
            }
        }

    };
}
