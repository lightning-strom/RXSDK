package com.ruixue.sdk;


import android.app.Activity;
import android.util.SparseArray;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.HQParams;
import com.ruixue.billing.BillingClient;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RXRequest;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;
import com.ruixue.ysdk.R;
import com.tencent.ysdk.api.YSDKApi;
import com.tencent.ysdk.framework.common.eFlag;
import com.tencent.ysdk.framework.common.ePlatform;
import com.tencent.ysdk.module.pay.PayListener;
import com.tencent.ysdk.module.pay.PayRet;
import com.tencent.ysdk.module.user.UserLoginRet;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class YSDKBillingImpl extends BillingClient {

    public void setUserLoginRet(UserLoginRet userLoginRet) {
        this.userLoginRet = userLoginRet;
    }

    private UserLoginRet userLoginRet;
    private static final SparseArray<String> payStateTips = new SparseArray<String>() {
        {
            put(PayRet.PAYSTATE_PAYSUCC, "用户取消支付");
            put(PayRet.PAYSTATE_PAYCANCEL, "用户取消支付");
            put(PayRet.PAYSTATE_PAYUNKOWN, "用户支付结果未知，建议查询余额");
            put(PayRet.PAYSTATE_PAYUNKOWN, "支付异常,未知错误");
            put(eFlag.Login_TokenInvalid, "登陆态过期，请重新登陆");
            put(eFlag.Pay_User_Cancle, "用户取消支付");
            put(eFlag.Pay_Param_Error, "支付失败，参数错误");
            put(eFlag.Error, "支付异常");
        }
    };

    /**
     * @param hashMap  应用宝下单ext
     *                 ext.openid string 登录时获得的openid
     *                 xt.openkey string 登录时获得的openkey
     *                 ac string 登录账号类型：值必须是：kp或者wc （微信）
     *                 ext.pf string 登录时获取
     *                 ext.pfkey  string 登录时获取
     * @param callback
     * @return
     */
    @Override
    public JSONObject getOrder(Map<String, Object> hashMap, RXJSONCallback callback) {
        UserLoginRet userLoginRet = YSDKApiHelper.getLoginRecord();
        if (null != hashMap && userLoginRet.ret == eFlag.Succ) {
            Map<String, Object> extMap = new HashMap<>();
            int platform = userLoginRet.platform;// YSDKApi.getLoginRecord(userLoginRet);
            extMap.put("openid", userLoginRet.open_id);
            extMap.put("pf", userLoginRet.pf);
            extMap.put("pf_key", userLoginRet.pf_key);
            if (platform == ePlatform.PLATFORM_ID_QQ) {
                extMap.put("open_key", userLoginRet.getPayToken());
                extMap.put("ac", "kp");
            } else if (platform == ePlatform.PLATFORM_ID_WX) {
                extMap.put("open_key", userLoginRet.getAccessToken());
                extMap.put("ac", "wc");
            }
            hashMap.put("ext", extMap);
        }
        return super.getOrder(hashMap, callback);
    }

    public static final String MIDAS = "midas";

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (hashMap != null) {
            if (!hashMap.containsKey(KEY_HQ_TYPE)) {
                hashMap.put(KEY_HQ_TYPE, MIDAS);
            }
            if (MIDAS.equals(hashMap.get(KEY_HQ_TYPE))) {
                hashMap.put("callback_from", HQParams.CALLBACK_FROM_CLIENT);
            }
        }
        super.pay(activity, hashMap, callback);
    }

    public static final String YSDK = "ysdk";

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        YSDKOrderData orderData = YSDKOrderData.fromJson(data);
        if (orderData != null) {
            byte[] appResData = YSDKApiHelper.getBytes(activity, ObjectUtils.toInt(hashMap.get("ico_res_id"), R.drawable.sample_yuanbao));
            if (YSDK.equals(hashMap.get(KEY_HQ_TYPE))) {
                buyGoods(appResData, orderData, callback);
            } else {
                if (orderData.getExt().getBalance() > 0 && orderData.getExt().getBalance() >= orderData.getExt().getAmount()) {
                    payNotify(orderData, callback);
                } else {
                    recharge(appResData, orderData, callback);
                }
            }

        } else {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR));
        }
    }

    public void payNotify(YSDKOrderData orderExt, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("order_no", orderExt.getExt().getOrderId());
        hashMap.put("amount", orderExt.getPrice());
        hashMap.put("pay_openid", userLoginRet.open_id);
        int platform = YSDKApi.getLoginRecord(userLoginRet);
        if (platform == 1) {
            hashMap.put("open_key", userLoginRet.getPayToken());
            hashMap.put("ac", "kp");
        } else if (platform == 2) {
            hashMap.put("open_key", userLoginRet.getAccessToken());
            hashMap.put("ac", "wc");
        }

        hashMap.put("pf", userLoginRet.pf);
        hashMap.put("pf_key", userLoginRet.pf_key);
        RXRequest.create(orderExt.getNotifyUrl()).sign(true).setBody(hashMap).postAsync(callback);
    }

    private void invokeFailed(RXJSONCallback callback, JSONObject obj) {
        if (callback != null) {
            callback.onFailed(obj);
        }
    }

    private void buyGoods(byte[] appResData, YSDKOrderData orderExt, RXJSONCallback callback) {
        String zoneId = String.valueOf(orderExt.getExt().getZoneId());
        YSDKApi.buyGoods(zoneId, orderExt.getExt().getGoodsTokenUrl(), appResData, orderExt.getTransmitArgs(), new PayListener() {
            @Override
            public void OnPayNotify(PayRet ret) {
                RXLogger.i("OnPayNotify:" + ret.toString());
                if (callback == null)
                    return;
                if (PayRet.RET_SUCC == ret.ret) {
                    //支付流程成功
                    switch (ret.payState) {
                        //支付成功
                        case PayRet.PAYSTATE_PAYSUCC:
                            callback.onSuccess(RXErrorCode.SUCCESS.toJSONObject());
                            break;
                        case PayRet.PAYSTATE_PAYCANCEL:
                            callback.onFailed(RXErrorCode.PAY_CANCEL.toJSONObject());
                            break;
                        default:
                            callback.onFailed(RXErrorCode.PAY_ERROR.toJSONObject(ret.payState, ret.msg));
                    }
                } else {
                    if (ret.flag == eFlag.Pay_User_Cancle) {
                        callback.onFailed(RXErrorCode.PAY_CANCEL.toJSONObject());
                    } else {
                        callback.onFailed(RXErrorCode.PAY_ERROR.toJSONObject(ret.flag, ret.msg));
                    }
                }
            }
        });
    }

    //游戏币充值
    private void recharge(byte[] appResData, YSDKOrderData orderExt, RXJSONCallback callback) {
        String zoneId = String.valueOf(orderExt.getExt().getZoneId());
        String saveValue = String.valueOf(orderExt.getExt().getAmount());
        boolean isCanChange = false; //设置的充值数额是否可改
        YSDKApi.recharge(zoneId, saveValue, isCanChange, appResData, orderExt.getTransmitArgs(), ret -> {
            RXLogger.i("recharge ret:" + ret.toString());
            if (PayRet.RET_SUCC == ret.ret) {
                if (ret.payState == PayRet.PAYSTATE_PAYSUCC) {
                    payNotify(orderExt, callback);
                } else {
                    invokeFailed(callback, RXErrorCode.THIRD_PAY_ERROR.toJSONObject(ret.payState, payStateTips.get(ret.payState, ret.msg)));
                }
            } else {
                invokeFailed(callback, RXErrorCode.THIRD_PAY_ERROR.toJSONObject(ret.flag, payStateTips.get(ret.flag, ret.msg)));
            }
        });
    }
}
