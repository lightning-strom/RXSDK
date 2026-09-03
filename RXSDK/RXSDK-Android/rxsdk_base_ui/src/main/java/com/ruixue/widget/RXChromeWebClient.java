package com.ruixue.widget;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;

import com.ruixue.RuiXueSdk;
import com.ruixue.internal.ActivityLifecycleTracker;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/7/4
 */
public class RXChromeWebClient extends WebChromeClient {
    public static final int PICK_REQUEST = 1222;
    ValueCallback<Uri[]> mFilePathCallbackArray;

    private void handleCallback(Uri uri) {
        if (mFilePathCallbackArray != null) {
            if (uri != null) {
                mFilePathCallbackArray.onReceiveValue(new Uri[]{uri});
            } else {
                mFilePathCallbackArray.onReceiveValue(null);
            }
            mFilePathCallbackArray = null;
        }
    }

    private void handleup(WebChromeClient.FileChooserParams params) {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        String[] types = params.getAcceptTypes();
        if (types != null && types.length > 0 && !types[0].isEmpty()) {
            intent.setType(types[0]);
            if (types.length > 1) {
                intent.putExtra(Intent.EXTRA_MIME_TYPES, types);
            }
        } else {
            intent.setType("*/*");
        }
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, params.getMode() == WebChromeClient.FileChooserParams.MODE_OPEN_MULTIPLE);
        Activity activity = RuiXueSdk.getCurrentActivity();
        if (activity != null) {
            activity.startActivityForResult(Intent.createChooser(intent, "选择文件"), PICK_REQUEST);
        }
    }

    @Override
    public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
        if (mFilePathCallbackArray != null) {
            mFilePathCallbackArray.onReceiveValue(null);
        }
        mFilePathCallbackArray = filePathCallback;
        ActivityLifecycleTracker.registerActivityResultObserver(this, (activity, requestCode, resultCode, data) -> {
            if (requestCode == PICK_REQUEST) {
                if (null != data) {
                    Uri uri = data.getData();
                    handleCallback(uri);
                } else {
                    // 取消了照片选取的时候调用
                    handleCallback(null);
                }
            } else {
                // 取消了照片选取的时候调用
                handleCallback(null);
            }
        });
        handleup(fileChooserParams);
        return true;
    }

}
