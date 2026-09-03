package com.ruixue.wechat;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.ruixue.logger.Logger;
import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler {

    private IWXAPI mWxApi;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Logger.i("WXEntryActivity onCreate");
        if (getIntent().getIntExtra("_wxapi_command_type", 0) == ConstantsAPI.COMMAND_PAY_BY_WX) {
            //  pay logic
        }
        mWxApi = WXAPIFactory.createWXAPI(this, "");
        mWxApi.handleIntent(getIntent(), this);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        Logger.i("WXEntryActivity onNewIntent");
        if (null != mWxApi) {
            mWxApi.handleIntent(intent, this);
        }
    }

    @Override
    public void onReq(BaseReq baseReq) {
        //请求
        Logger.i("WXEntryActivity onReq");
    }

    @Override
    public void onResp(BaseResp baseResp) {
        try {
            if (baseResp != null) {
                Log.d("WXEntryActivity ", "onResp baseResp.type = " + baseResp.getType() + " errCode:" + baseResp.errCode);
                WXCallbackManager.invokeWXCallback(baseResp);
                WXEntryExtResp.onResp(WXEntryActivity.this, baseResp);
            }
        } finally {
            finish();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }
}