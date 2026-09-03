package com.ruixue.sdk.tiktok;

import android.app.Activity;
import android.os.Bundle;

import androidx.annotation.Nullable;

import com.google.gson.Gson;
import com.ruixue.logger.RXLogger;
import com.tiktok.open.sdk.core.constants.Constants;
import com.tiktok.open.sdk.share.ShareApi;
import com.tiktok.open.sdk.share.ShareResponse;

import java.util.HashMap;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/7/29
 */
public class ShareResultActivity extends Activity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ShareApi shareApi = new ShareApi(this);
        ShareResponse shareResponse = shareApi.getShareResponseFromIntent(getIntent());
        RXLogger.e("ShareResultActivity" + new Gson().toJson(shareResponse));
        Map<String, Object> map = new HashMap<>();
        if (shareResponse != null) {
            map.put("code", shareResponse.getErrorCode());
            map.put("msg", shareResponse.getErrorMsg());
            map.put("third_code", shareResponse.getSubErrorCode());
            TiktokSdkWrapper.getInstance().onShareResp(this, shareResponse.getErrorCode() == Constants.BaseError.OK, map);
        } else {
            map.put("code", -3);
            map.put("msg", "Unknown shared result");
            TiktokSdkWrapper.getInstance().onShareResp(this, false, map);
        }
        finish();
    }
}
