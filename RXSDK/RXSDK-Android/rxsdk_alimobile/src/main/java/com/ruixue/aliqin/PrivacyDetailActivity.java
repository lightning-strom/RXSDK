package com.ruixue.aliqin;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.os.Build;
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;

import androidx.annotation.Nullable;
import androidx.appcompat.widget.Toolbar;

import com.mobile.auth.gatewayauth.Constant;
import com.ruixue.alimobile.R;
import com.ruixue.openapi.IRXView;
import com.ruixue.utils.ThreadUtils;
import com.ruixue.view.RXWebView;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/10/13
 */
public class PrivacyDetailActivity extends Activity {

    //    private WebView mWebView;
//   private Toolbar mToolbar;
    String mUrl;
    String mName;


    @Override
    protected void onStart() {
        super.onStart();
    }

    @SuppressLint("WrongConstant")
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_custom_web);
//        Window window = getWindow();
//        window.setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
//        WindowManager.LayoutParams lp = window.getAttributes();
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
//            lp.layoutInDisplayCutoutMode = android.view.WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
//        }
        mUrl = getIntent().getStringExtra(Constant.PROTOCOL_WEB_VIEW_URL);
        mName = getIntent().getStringExtra(Constant.PROTOCOL_WEB_VIEW_NAME);
//        setRequestedOrientation(getIntent().getIntExtra(Constant.PROTOCOL_WEB_VIEW_ORIENTATION, ActivityInfo.SCREEN_ORIENTATION_PORTRAIT));
//        mWebView = findViewById(R.id.webView);
////        mToolbar = findViewById(R.id.toolbar);
////        mToolbar.setSubtitle(mName);
//        initWebView();
//        mWebView.loadUrl(mUrl);

        RXWebView.create(PrivacyDetailActivity.this, mUrl).setTitle(mName).setOnCloseListener(v -> finish()).show();
    }

//    private void initWebView() {
//        WebSettings wvSettings = mWebView.getSettings();
//        // 是否阻止网络图像
//        wvSettings.setBlockNetworkImage(false);
//        // 是否阻止网络请求
//        wvSettings.setBlockNetworkLoads(false);
//        // 是否加载JS
//        wvSettings.setJavaScriptEnabled(true);
//        wvSettings.setJavaScriptCanOpenWindowsAutomatically(true);
//        //覆盖方式启动缓存
//        wvSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
//        // 使用广泛视窗
//        wvSettings.setUseWideViewPort(true);
//        wvSettings.setLoadWithOverviewMode(true);
//        wvSettings.setDomStorageEnabled(true);
//        //是否支持缩放
//        wvSettings.setBuiltInZoomControls(false);
//        wvSettings.setSupportZoom(false);
//        //不显示缩放按钮
//        wvSettings.setDisplayZoomControls(false);
//        wvSettings.setAllowFileAccess(true);
//        wvSettings.setDatabaseEnabled(true);
//        mWebView.setVerticalScrollbarOverlay(false); //不出现指定的垂直滚动条有叠加样式
//        wvSettings.setUseWideViewPort(true);//设定支持viewport
//        wvSettings.setBuiltInZoomControls(true);//设置出现缩放工具
//        wvSettings.setDisplayZoomControls(false);//设置缩放工具隐藏
//        wvSettings.setSupportZoom(true);//设定支持缩放
//        mWebView.addJavascriptInterface(new JsBridge(), "JsBridge");
//        //缓存相关
////        wvSettings.setAppCacheEnabled(true);
//        wvSettings.setDomStorageEnabled(true);
//        wvSettings.setDatabaseEnabled(true);
//    }

//    public void setWebTitle(String title) {
//
//    }
//

}
