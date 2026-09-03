package com.ruixue.sdk;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;

import com.gsc.base.model.UpDataModel;
import com.gsc.cashier_h5.BaseWXEntryActivity;
import com.ruixue.wechat.WXCallbackManager;
import com.ruixue.wechat.WXEntryExtResp;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/3/1
 */
public class BiliBiliWXEntryActivity extends BaseWXEntryActivity {
    private IWXAPI mWxApi;

    @Override
    public void onCreate(Bundle bundle) {
        Log.d("WXEntryActivity ", "onCreate " + BiliBiliWXEntryActivity.class.getSimpleName());
        super.onCreate(bundle);
        mWxApi = WXAPIFactory.createWXAPI(this, "");
        mWxApi.handleIntent(getIntent(), this);
    }

    @Override
    public void onNewIntent(Intent intent) {
        Log.d("WXEntryActivity ", "onNewIntent");
        super.onNewIntent(intent);
        setIntent(intent);
        if (null != mWxApi) {
            mWxApi.handleIntent(intent, this);
        }
    }
 

    @Override
    public void onResp(BaseResp baseResp) {
        if (baseResp != null) {
            Log.d("WXEntryActivity ", "onResp baseResp.type = " + baseResp.getType() + " errCode:" + baseResp.errCode);
            WXCallbackManager.invokeWXCallback(baseResp);
            WXEntryExtResp.onResp(BiliBiliWXEntryActivity.this, baseResp);
        }
        super.onResp(baseResp);
    }
}
