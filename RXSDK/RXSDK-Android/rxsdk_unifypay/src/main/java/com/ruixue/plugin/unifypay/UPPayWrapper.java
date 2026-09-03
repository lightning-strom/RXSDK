package com.ruixue.plugin.unifypay;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.text.TextUtils;
import android.util.Log;

import com.chinaums.pppay.unify.UnifyPayListener;
import com.chinaums.pppay.unify.UnifyPayPlugin;
import com.chinaums.pppay.unify.UnifyPayRequest;
import com.ruixue.RXJSONCallback;
import com.ruixue.billing.HQParams;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;
import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelbiz.WXLaunchMiniProgram;
import com.unionpay.UPPayAssistEx;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;


class UPPayWrapper {

    //alipay，wechat，uac，mini_alipay
    public static final String CHANNEL_WEIXIN = "01";
    public static final String CHANNEL_ALIPAY = "02";
    public static final String CHANNEL_UMSPAY = "03";
    public static final String CHANNEL_ALIPAY_MINI_PROGRAM = "04";

    public static final String MINI_PROGRAM = "minigame";
    private static final HashMap<String, String> PAY_METHOD_MAP = new HashMap<String, String>() {{
        put("wechat", "01");
        put("alipay", "04");
        put("uac", "03");
        put("alipay_app", "02");
        put("aums@wechat", "01");
        put("aums@alipay", "04");
        put("aums@uac", "03");
        put("aums@alipay_app", "02");
    }};

    private static final String TAG = UPPayWrapper.class.getSimpleName();

    private static RXJSONCallback mCallback;

    public static void doPay(Context context, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        try {
            HQParams payParams = HQParams.create(hashMap);
//            @SuppressWarnings("unchecked") Map<String, Object> reqExtMap = (Map<String, Object>) hashMap.get("ext");
            if (payParams != null) {
                String method = payParams.getSubPayType();
                if (MINI_PROGRAM.equals(method)) {
                    callback.onSuccess(data);
                } else {
                    pay(context, method, Objects.requireNonNull(data.optJSONObject("ext"), "order ext null error!"), callback);
                }
            } else if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR));
            }

        } catch (Exception jsonException) {
            jsonException.printStackTrace();
            callback.onError(new RXException(jsonException));
        }
    }

    private static void pay(Context context, String method, JSONObject payparam, RXJSONCallback callback) {
        String payChannel = PAY_METHOD_MAP.get(method);
        if (null == payChannel || "".equals(payChannel)) {
            callback.onFailed(RXErrorCode.HQ_DATA_ERROR.toJSONObject(payparam.opt("errCode"), payparam.optString("errInfo", payparam.optString("errMsg", "未知的子支付方式"))));
            return;
        } else if (CHANNEL_ALIPAY_MINI_PROGRAM.equals(payChannel) || CHANNEL_ALIPAY.equals(payChannel)) {
            if (!AppUtils.isAppInstalled(context, Uri.parse("alipays://platformapi/startApp"))) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "请先安装支付宝!"));
                return;
            }
        } else if (CHANNEL_UMSPAY.equals(payChannel)) {
            if (!UPPayAssistEx.checkWalletInstalled(context)) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "请先安装云闪付!"));
                return;
            }
        }
        //            JSONObject ext = payJsonObj.getJSONObject("data").optJSONObject("ext");
        if (payparam != null && payparam.has("appPayRequest")) {
            String payData = payparam.optString("appPayRequest");
            mCallback = callback;
            if (CHANNEL_UMSPAY.equals(payChannel)) {
                payCloudQuickPay(context, payData);
            } else {
                payCommon(context, payChannel, payData);
            }
        } else {
            String msg = null != payparam ? payparam.optString("errInfo", payparam.optString("errMsg", "未知错误")) : "支付数据错误";
            RXLogger.w("error appPayRequest is null" + msg);
            callback.onFailed(RXErrorCode.HQ_DATA_ERROR.toJSONObject(null != payparam ? payparam.opt("errCode") : "", msg));
        }
    }

    public static boolean isInstalledPayCloud(Context context) {
        return UPPayAssistEx.checkWalletInstalled(context);
    }

    private static String buildJsonString(int code, String msg) {
        return "{\"code\":" + code + ",\"msg\":\"" + msg + "\"}";
    }

    private static void payCommon(Context context, String payChannel, String appPayRequest) {
        UnifyPayPlugin unifyPay = UnifyPayPlugin.getInstance(context);

        //resultCode  “0000”表示成功 商户订单是否成功支付应该以商户后台收到支付结果为准，此处返回的结果仅作为支付请求的发送结果
        //resultInfo 接口返回的状态描述 支付结果描述，为JSON字符串 resultMsg extraMsg 支付结果附加的信息 rawMsg原始支付渠道返回的信息
        // 注：云闪付支付方式回调方法需单独处理
        unifyPay.setListener((resultCode, resultInfo) -> {
            Log.d(TAG, "onResult resultCode=" + resultCode + ", resultInfo=" + resultInfo);
            if (UnifyPayListener.ERR_OK.equals(resultCode)) {
                invokeCallback(true, UnifyPayPlugin.getUnifyErrMessage(resultCode));
                //支付成功
            } else {
                //其他
                invokeCallback(false, UnifyPayPlugin.getUnifyErrMessage(resultCode));
            }
        });

        UnifyPayRequest msg = new UnifyPayRequest();
        msg.payChannel = payChannel;
        msg.payData = appPayRequest;
        unifyPay.sendPayRequest(msg);
    }

    /**
     * 云闪付
     * @param appPayRequest appPayRequest
     */
    private static void payCloudQuickPay(Context context, String appPayRequest) {
        RXLogger.i("payCloudQuick installed:" + isInstalledPayCloud(context));
        String tn = "空";
        try {
            JSONObject e = new JSONObject(appPayRequest);
            tn = e.getString("tn");
        } catch (JSONException e1) {
            e1.printStackTrace();
        }
        //   tn字段可通过下单请求响应中appPayRequest信息解析获取 serverMode 为后台环境标识，默认使用“00”生产环境
        UPPayAssistEx.startPay(context, null, null, tn, "00");

        Log.d("test", "云闪付支付 tn = " + tn);

    }

    private static void invokeCallback(boolean bSuccess, String msg) {
        if (mCallback != null) {
            if (bSuccess) {
                mCallback.onSuccess(JSONUtil.toJSONObject(RXErrorCode.SUCCESS.getValue(), msg));
            } else {
                mCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), msg));
            }
            mCallback = null;
        }
    }

    //jixiang433://backfromalipay?errCode=0000&errStr=%E6%94%AF%E4%BB%98%E6%88%90%E5%8A%9F
    public static void handleIntent(Intent intent) {
        String msg = "unknown pay error";
        if (intent != null) {
            try {
                Uri uri = intent.getData();
                if (null != uri) {
                    String errCode = uri.getQueryParameter("errCode");
                    String errStr = uri.getQueryParameter("errStr");
                    RXLogger.i("code:" + errCode + " msg:" + errStr);
//                    "backfromalipay".equals(uri.getHost())
                    msg = errStr + ":" + errCode;
                    if (UnifyPayListener.ERR_OK.equals(errCode)) {
                        invokeCallback(true, errStr);
                        return;
                    }
                }
            } catch (Exception e) {
                e.getStackTrace();
            }
        }
        invokeCallback(false, msg);
    }


    //requestCode 10
    public static void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (data == null || data.getExtras() == null) {
            return;
        }
        String msg = "";
        String str = data.getExtras().getString("pay_result");
        if (TextUtils.isEmpty(str)) {
            return;
        } else if (str.equalsIgnoreCase("success")) {
            msg = "云闪付支付成功";
            invokeCallback(true, str);
        } else if (str.equalsIgnoreCase("fail")) {
            msg = "云闪付支付失败！";
            invokeCallback(false, str);
        } else if (str.equalsIgnoreCase("cancel")) {
            msg = "用户取消了云闪付支付";
            invokeCallback(false, str);
        }
        RXLogger.i(msg);
    }

    /**
     * 调用支付后可通过此方法获取支付appid
     * @param context context
     * @return 微信支付使用的 appid
     */
    public static String getWxAppId(Context context) {
        return UnifyPayPlugin.getInstance(context).getAppId();
    }

    /**
     * 微信 WXEntryActivity onResp 中回调此方法
     * @param context  context
     * @param baseResp baseResp
     */
    public static void onResp(Context context, BaseResp baseResp) {
        if (baseResp.getType() == ConstantsAPI.COMMAND_LAUNCH_WX_MINIPROGRAM) {
            WXLaunchMiniProgram.Resp launchMiniProResp = (WXLaunchMiniProgram.Resp) baseResp;
            String extraData = launchMiniProResp.extMsg; //对应小程序组件 <button open-type="launchApp"> 中的 app-parameter 属性
            Log.d(TAG, "onResp   ---   " + extraData);
            String msg = "onResp   ---   errStr：" + baseResp.errStr + " --- errCode： " + baseResp.errCode + " --- transaction： " + baseResp.transaction + " --- openId：" + baseResp.openId + " --- extMsg：" + launchMiniProResp.extMsg;
            Log.d(TAG, msg);
            UnifyPayPlugin.getInstance(context).getWXListener().onResponse(context, baseResp);
        }
    }
}
