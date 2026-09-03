package com.ruixue.wechat;

import android.content.Context;

import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.utils.JSONUtil;
import com.tencent.mm.opensdk.modelpay.PayReq;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import org.json.JSONObject;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class WXPayImpl {

    private static final ExecutorService singleExecutor = Executors.newSingleThreadExecutor();

    static class Single {
        static WXPayImpl INSTANCE = new WXPayImpl();
    }

    public static WXPayImpl getInstance() {
        return Single.INSTANCE;
    }

    WXPayImpl() {
    }

    public void sendPayReq(Context context, JSONObject jsonObject, RXJSONCallback shareCallback) {
        singleExecutor.execute(() -> {
            try {
                JSONObject pay = jsonObject.has("ext") ? jsonObject.getJSONObject("ext") : jsonObject;
                String appid = (String) pay.get("appid");
                IWXAPI api = WXAPIFactory.createWXAPI(context, appid, true);
                boolean isInited = api.registerApp(appid);
                if (isInited) {
                    boolean success = api.sendReq(createPayReq(pay));
                    if (!success) {
                        shareCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.PAY_ERROR));
                    } else {
                        WXCallbackManager.registerWXCallback(WXCallbackManager.CallbackType.PAY_BY_WX, new WXCallback() {
                            @Override
                            public void onPayResp(int errCode) {
                                if (WXErrCode.ERR_OK == errCode) {
                                    shareCallback.onSuccess(null);
                                } else {
                                    shareCallback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(errCode, "支付" + WXErrCode.getMsg(errCode)));
                                }
                            }
                        });
                    }
                } else {
                    shareCallback.onFailed(RXErrorCode.HQ_PARAMS_ERROR.toJSONObject(-1, "wx registerApp error"));
                }

            } catch (Exception e) {
                e.printStackTrace();
                shareCallback.onError(new RXException(e));
            }
        });
    }

    // text 长度需大于 0 且不超过 10KB
    private PayReq createPayReq(JSONObject pay) {
        PayReq request = new PayReq();
        request.appId = pay.optString("appid");
        request.partnerId = pay.optString("partnerid");
        request.prepayId = pay.optString("prepayid");
        request.packageValue = pay.has("package") ? pay.optString("package") : "Sign=WXPay";
        request.nonceStr = pay.optString("noncestr");
        request.timeStamp = pay.optString("timestamp");
        request.sign = pay.optString("sign");
        return request;
    }


}
