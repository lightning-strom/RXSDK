package com.ruixue.snfpay;

import android.app.Activity;
import android.content.Context;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.billing.HQType;
import com.ruixue.billing.OrderData;
import com.ruixue.billing.HQParams;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.JSONUtil;
import com.ruixue.wechat.WXCallback;
import com.ruixue.wechat.WXSdkApiImpl;
import com.suning.aggregate.paysdk.SNFPayConfig;
import com.suning.aggregate.paysdk.SNFPayManager;
import com.suning.aggregate.paysdk.interfaces.FailCallBack;
import com.suning.aggregate.paysdk.interfaces.PayResultListener;
import com.suning.aggregate.paysdk.interfaces.SNFPayInterface;
import com.suning.aggregate.paysdk.interfaces.SuccessCallBack;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import org.json.JSONObject;

import java.util.Map;
import java.util.Objects;

/**
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/8/26
 */
public class SNFBillingImpl extends BillingClient implements SNFPayInterface {

    private IWXAPI mWXAPI;

    public SNFBillingImpl() {
        SNFPayManager.getInstance().init(new SNFPayConfig.Builder().setSnfPayInterface(this).build());
    }

    @Override
    public void callWX(com.tencent.mm.opensdk.modelbiz.WXLaunchMiniProgram.Req req, SuccessCallBack successCallBack, FailCallBack failCallBack) {
        //do your bussiness
        WXSdkApiImpl.getInstance().sendReq(mWXAPI, req, new WXCallback() {
            @Override
            public void onResp(BaseResp baseResp) {
                RXLogger.d("callWX onResp");
                if (baseResp.errCode == BaseResp.ErrCode.ERR_OK) {
                    successCallBack.doSuccess();
                } else {
                    failCallBack.doFail(baseResp.errStr);
                }
            }
        });
    }

    /**
     * 调用微信支付
     *
     * @param appId    填移动应用(App)的 AppId，非小程序的 AppID
     * @param order    待支付的订单号
     * @param callback 支付回调，可空。fail方法必定支付失败，success方法不一定支付成功，请在调用的Activity的onResume方法中查询订单状态
     */
    public void doWXMiniPay(Context context, String appId, String order, RXJSONCallback callback) {

        IWXAPI api = WXAPIFactory.createWXAPI(context, appId);
        boolean success = api.registerApp(appId);
        mWXAPI = api;
        if (!success) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "微信app注册失败"));
            return;
        }
        SNFPayManager.getInstance().doWXMiniPay(order, new PayResultListener() {
            @Override
            public void success() {
                RXLogger.d("doWXMiniPay success");
                callback.onSuccess(null);
                //TODO 仅标识唤起微信成功，不一定支付成功，请调用方自行在调用页Activity的onResume方法中查询订单状态
            }

            @Override
            public void fail(String failReason) {
                RXLogger.d("doWXMiniPay fail" + failReason);

                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), failReason));
                //TODO 唤起微信失败，支付失败
            }
        });
    }

    /**
     * 调用支付宝支付
     *
     * @param context  调用方所在的Activity上下文
     * @param order    待支付的订单号
     * @param callback 支付回调，可空。fail方法必定支付失败，success方法不一定支付成功，请在调用的Activity的onResume方法中查询订单状态
     */
    public void doAliMiniPay(Activity context, String order, RXJSONCallback callback) {
        SNFPayManager.doAliMiniPay(context, order, new PayResultListener() {
            @Override
            public void success() {
                callback.onSuccess(null);
                //TODO 仅标识唤起支付宝成功，不一定支付成功，请调用方自行在调用页Activity的onResume方法中查询订单状态
            }

            @Override
            public void fail(String failReason) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), failReason));
                //TODO 唤起支付宝失败，支付失败
            }
        });
    }

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        OrderData orderData = OrderData.fromJson(data);
        if (orderData != null) {
            HQParams payReq = HQParams.create(hashMap);
            try {
                JSONObject extObject = data.optJSONObject("ext");
                if (payReq.getExt() != null && extObject != null) {
                    String extType = (String) payReq.getExt().get(HQType.KEY);
                    if (Objects.equals(extType, "wechat")) {
                        doWXMiniPay(activity, (String) payReq.getExt().get("appid"), extObject.optString("tradeOrderId"), callback);
                    } else if (Objects.equals(extType, "alipay")) {
                        doAliMiniPay(activity, extObject.optString("tradeOrderId"), callback);
                    } else {
                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "suning not support type:" + extType));
                    }
                } else {
                    RXLogger.e("req params:" + hashMap.toString());
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "参数错误,检查参数配置。"));
                }
            } catch (Exception e) {
                e.printStackTrace();
                callback.onError(new RXException(e));
            }
        } else {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR));
        }
    }
}
