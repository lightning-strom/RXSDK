package com.ruixue.yeepay;

import android.app.Activity;
import android.text.TextUtils;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.billing.OrderData;
import com.ruixue.billing.HQType;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.JSONUtil;
import com.ruixue.wechat.WXSdkApiImpl;

import org.json.JSONObject;

import java.util.Map;
import java.util.Objects;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/8/26
 */
public class YeePayBillingImpl extends BillingClient {
public static final String YEEPAY = "yeepay";
    public YeePayBillingImpl() {
    }

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {

        @SuppressWarnings("unchecked") Map<String, Object> extMap = (Map<String, Object>) hashMap.get("ext");
        if (extMap != null && !extMap.containsKey("pay_way")) {
            extMap.put("pay_way", "SDK_PAY");
            hashMap.put("ext", extMap);
        }
        if (extMap != null && !hashMap.containsKey("wx_appid") && extMap.containsKey("wx_appid")) {
            hashMap.put("wx_appid", extMap.get("wx_appid"));
        }

        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        OrderData orderData = OrderData.fromJson(data);
        if (orderData != null) {

            Object payType = hashMap.get(KEY_HQ_TYPE);
            if ((Objects.requireNonNull(payType).equals(YEEPAY))) {
                JSONObject extObject = data.optJSONObject("ext");
                if (extObject != null) {
                    YeePayParamsExt yeePayParamsExt = YeePayParamsExt.fromJSONObject(extObject);
                    if (hashMap.containsKey("wx_appid")) {
                        yeePayParamsExt.setAppId((String) hashMap.get("wx_appid"));
                    }
                    if (TextUtils.isEmpty(yeePayParamsExt.miniProgramOrgId)) {
                        RXLogger.e("miniProgramOrgId is null error");
                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_PARAMS_ERROR.getValue(), TextUtils.isEmpty(yeePayParamsExt.message) ? "参数错误,检查参数配置。" : yeePayParamsExt.message));
                    } else {
                        WXSdkApiImpl.getInstance().openMiniProgram(activity, yeePayParamsExt.toWxObject(), callback);
                    }
                } else {
                    RXLogger.e("error params:" + data);
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "参数错误,检查参数配置。"));
                }
            } else {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_PARAMS_ERROR.getValue(), "不支持的HQ方式！"));
            }
        } else {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR));
        }
    }
}
