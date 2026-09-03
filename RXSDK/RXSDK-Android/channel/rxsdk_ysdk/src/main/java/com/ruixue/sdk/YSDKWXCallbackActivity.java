package com.ruixue.sdk;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.ruixue.wechat.WXCallbackManager;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.ysdk.module.user.impl.wx.YSDKWXEntryActivity;


public class YSDKWXCallbackActivity extends YSDKWXEntryActivity  {
    public static final String TAG = YSDKWXCallbackActivity.class.getSimpleName();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
    }


    @Override
    public void onReq(BaseReq baseReq) {
        super.onReq(baseReq);
    }

    @Override
    public void onResp(BaseResp baseResp) {
        //微信登录为getType为1，分享为0
        if (baseResp == null) {
            finish();
            return;
        }
        super.onResp(baseResp);
        Log.d("WXEntryActivity ", "onResp baseResp.type = " + baseResp.getType());
        WXCallbackManager.invokeWXCallback(baseResp);
        finish();
    }


    @Override
    protected void onPause() {
        overridePendingTransition(0, 0);
        super.onPause();
    }

}
