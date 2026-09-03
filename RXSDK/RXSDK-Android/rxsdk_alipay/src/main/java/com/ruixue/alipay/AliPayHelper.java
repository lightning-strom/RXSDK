package com.ruixue.alipay;

import android.app.Activity;
import android.text.TextUtils;

import com.alipay.sdk.app.PayTask;
import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Map;

public class AliPayHelper {

    //
    public static void pay(Activity activity, JSONObject jsonObject, RXJSONCallback callback) throws JSONException {
        if (jsonObject != null) {
            JSONObject orderObj = jsonObject.has("ext") ? jsonObject.getJSONObject("ext") : jsonObject;
            String payUrl = orderObj.optString("pay_url");
            if (TextUtils.isEmpty(payUrl)) {
                if (null != callback) {
                    callback.onFailed(RXErrorCode.HQ_PARAMS_ERROR.toJSONObject(-1, "pay url null"));
                }
                return;
            }
            final Runnable payRunnable = () -> {
                PayTask alipay = new PayTask(activity);
                Map<String, String> result = alipay.payV2(payUrl, true);
                RXLogger.i(result.get("result"));
                if (null != callback) {
                    //9000订单支付成功。
                    //8000正在处理中，支付结果未知（有可能已经支付成功），请查询商家订单列表中订单的支付状态。
                    //4000订单支付失败。
                    //5000重复请求。
                    //6001用户中途取消。
                    //6002网络连接出错。
                    //6004支付结果未知（有可能已经支付成功），请查询商家订单列表中订单的支付状态。其它其它支付错误。
                    ThreadUtils.getInstance().runOnUiThread(() -> {
                        int code = ObjectUtils.toInt(result.get("resultStatus"), -1);

                        if (code == 9000) {
                            callback.onFailed(RXErrorCode.SUCCESS.toJSONObject());
                        } else if (code == 6001) {
                            callback.onFailed(RXErrorCode.PAY_CANCEL.toJSONObject());
                        } else {
                            callback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(code, result.get("memo")));
                        }
                    });
                }
            };
            // 必须异步调用
            new Thread(payRunnable).start();
        } else {
            if (null != callback) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR));
            }
        }
    }


}
