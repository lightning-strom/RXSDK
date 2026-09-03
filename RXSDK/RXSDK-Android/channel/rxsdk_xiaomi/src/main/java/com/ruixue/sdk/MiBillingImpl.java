package com.ruixue.sdk;

import android.app.Activity;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.billing.HQType;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.openapi.MiSdkHelper;
import com.ruixue.utils.JSONUtil;
import com.xiaomi.gamecenter.sdk.MiCommplatform;
import com.xiaomi.gamecenter.sdk.MiErrorCode;
import com.xiaomi.gamecenter.sdk.OnPayProcessListener;

import org.json.JSONObject;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/27
 */
public class MiBillingImpl extends BillingClient {
    public static final String MI = "mi";
    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_HQ_TYPE)) {
            hashMap.put(KEY_HQ_TYPE, MI);
        }
        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        try {
            MiOrderData miOrderData = MiOrderData.fromJson(data);
            if (miOrderData != null) {
                MiCommplatform.getInstance().miUniPay(activity, miOrderData.toMiBuyInfo(), new OnPayProcessListener() {
                    @Override
                    public void finishPayProcess(int code) {
                        if (code == MiErrorCode.MI_XIAOMI_PAYMENT_SUCCESS) {
                            callback.onSuccess(JSONUtil.toJSONObject(0, ""));
                        } else if (code == MiErrorCode.MI_XIAOMI_PAYMENT_ERROR_CANCEL) {
                            String msg = MiSdkHelper.getMiErrorCodeMsg(code);
                            callback.onFailed(RXErrorCode.PAY_CANCEL.toJSONObject(code, msg));
                        } else {
                            String msg = MiSdkHelper.getMiErrorCodeMsg(code);
                            callback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(code, msg));
                        }
                    }
                });
            } else if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR));
            }
        } catch (Exception e) {
            e.printStackTrace();
            callback.onError(new RXException(e));
        }
    }
}
