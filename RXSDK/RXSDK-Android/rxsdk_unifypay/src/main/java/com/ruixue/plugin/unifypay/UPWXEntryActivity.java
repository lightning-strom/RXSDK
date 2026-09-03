package com.ruixue.plugin.unifypay;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.chinaums.pppay.unify.UnifyPayPlugin;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

public class UPWXEntryActivity extends Activity implements IWXAPIEventHandler {
    private static final String TAG = "WXEntryActivity";
    private IWXAPI api;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.d(TAG, "WXEntryActivity --- onCreate");
        api = WXAPIFactory.createWXAPI(this, UnifyPayPlugin.getInstance(this).getAppId());
        api.handleIntent(getIntent(), this);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        Log.d(TAG, "WXEntryActivity --- onNewIntent");
        setIntent(intent);
        api.handleIntent(getIntent(), this);
    }

    @Override
    public void onReq(BaseReq baseReq) {
        Log.d(TAG, "WXEntryActivity --- onReq");
    }

    @Override
    public void onResp(BaseResp baseResp) {
        Log.d(TAG, "WXEntryActivity --- onResp");
        UPPaySdkWrapper.onWXResp(this, baseResp);
        UPWXEntryActivity.this.finish();
    }
}
