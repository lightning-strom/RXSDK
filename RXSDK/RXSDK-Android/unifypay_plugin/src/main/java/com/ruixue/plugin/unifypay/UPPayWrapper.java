package com.ruixue.plugin.unifypay;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;

import com.chinaums.pppay.unify.UnifyPayListener;
import com.chinaums.pppay.unify.UnifyPayPlugin;
import com.chinaums.pppay.unify.UnifyPayRequest;
import com.ruixue.error.RXErrorCode;
import com.ruixue.utils.AppUtils;
import com.ruixue.wechat.WXSdkWrapper;
import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelbiz.WXLaunchMiniProgram;
import com.unionpay.UPPayAssistEx;

import org.json.JSONObject;

import java.util.HashMap;


public class UPPayWrapper {

    public static final String AUMS = "aums";
    public static final String ALIPAY_HOST = "backfromalipay";
    //alipay，wechat，uac，mini_alipay
    public static final String CHANNEL_WEIXIN = "01";
    public static final String CHANNEL_ALIPAY = "02";
    public static final String CHANNEL_UMSPAY = "03";
    public static final String CHANNEL_ALIPAY_MINI_PROGRAM = "04";
    private static final HashMap<String, String> PAY_TYPE_MAP = new HashMap<String, String>() {{
        put("wechat", "01");
        put("alipay", "04");
        put("uac", "03");
        put("alipay_app", "02");
    }};

    private static final String TAG = UPPayWrapper.class.getSimpleName();

    private static String hostPackageName;

    public static void sendPayRequest(Activity activity, String payType, String payParams) {
        String payChannel = PAY_TYPE_MAP.get(payType);
        try {
            if (null == payChannel || "".equals(payChannel)) {
                throw new IllegalArgumentException("错误的支付方式");
            } else if (CHANNEL_ALIPAY_MINI_PROGRAM.equals(payChannel) || CHANNEL_ALIPAY.equals(payChannel)) {
                if (!AppUtils.isAppInstalled(activity, Uri.parse("alipays://platformapi/startApp"))) {
                    throw new IllegalArgumentException("请先安装支付宝");
                }
            } else if (CHANNEL_UMSPAY.equals(payChannel) && !isInstalledPayCloud(activity)) {
                throw new IllegalArgumentException("请先安装云闪付");
            } else if (CHANNEL_WEIXIN.equals(payChannel) && !WXSdkWrapper.isWXAppInstalled(activity)) {
                throw new IllegalArgumentException("请先安装微信");
            }
            JSONObject ext = new JSONObject(payParams);
            if (ext.has("appPayRequest")) {
                if (CHANNEL_UMSPAY.equals(payChannel)) {
                    JSONObject appPayRequest = ext.optJSONObject("appPayRequest");
                    if (appPayRequest != null) {
                        String tn = appPayRequest.optString("tn");
                        payCloudQuickPay(activity, tn);
                    }
                } else {
                    String payData = ext.optString("appPayRequest");
                    payCommon(activity, payChannel, payData);
                }

            } else {
                throw new IllegalArgumentException("参数错误 appPayRequest is null");
            }
        } catch (Exception e) {
            e.printStackTrace();
            invokeCallback(activity, hostPackageName, RXErrorCode.HQ_DATA_ERROR.getValue(), e.getMessage());
        }
    }

//
//    public interface IPayApi {
//        void sendPayRequest(Activity activity, String payChannel, String appPayRequest);
//    }
//
//
//    public class WechatPay implements IPayApi {
//
//        @Override
//        public void sendPayRequest(Activity activity, String payChannel, String appPayRequest) {
//            UnifyPayPlugin unifyPay = UnifyPayPlugin.getInstance(activity);
//            //resultCode  “0000”表示成功 商户订单是否成功支付应该以商户后台收到支付结果为准，此处返回的结果仅作为支付请求的发送结果
//            //resultInfo 接口返回的状态描述 支付结果描述，为JSON字符串 resultMsg extraMsg 支付结果附加的信息 rawMsg原始支付渠道返回的信息
//            // 注：云闪付支付方式回调方法需单独处理
//            unifyPay.setListener((resultCode, resultInfo) -> {
//                if (UnifyPayListener.ERR_OK.equals(resultCode)) {
//                    invokeCallback(activity, hostPackageName, RXErrorCode.SUCCESS.getValue(), UnifyPayPlugin.getUnifyErrMessage(resultCode));
//                    //支付成功
//                } else {
//                    Log.e(TAG, "onResult resultCode=" + resultCode + ", resultInfo=" + resultInfo);
//                    //其他
//                    invokeCallback(activity, hostPackageName, RXErrorCode.PAY_ERROR.getValue(), UnifyPayPlugin.getUnifyErrMessage(resultCode));
//                }
//            });
//            UnifyPayRequest msg = new UnifyPayRequest();
//            msg.payChannel = payChannel;
//            msg.payData = appPayRequest;
//            unifyPay.sendPayRequest(msg);
//        }
//    }

    public static boolean isInstalledPayCloud(Context context) {
        return UPPayAssistEx.checkWalletInstalled(context);
    }

//    private static String buildJsonString(int code, String msg) {
//        return "{\"code\":" + code + ",\"msg\":\"" + msg + "\"}";
//    }

    /**
     *
     */
    public static void payCommon(Activity activity, String payChannel, String appPayRequest) {
        UnifyPayPlugin unifyPay = UnifyPayPlugin.getInstance(activity);

        //resultCode  “0000”表示成功 商户订单是否成功支付应该以商户后台收到支付结果为准，此处返回的结果仅作为支付请求的发送结果
        //resultInfo 接口返回的状态描述 支付结果描述，为JSON字符串 resultMsg extraMsg 支付结果附加的信息 rawMsg原始支付渠道返回的信息
        // 注：云闪付支付方式回调方法需单独处理
        unifyPay.setListener((resultCode, resultInfo) -> {
            if (UnifyPayListener.ERR_OK.equals(resultCode)) {
                invokeCallback(activity, hostPackageName, RXErrorCode.SUCCESS.getValue(), UnifyPayPlugin.getUnifyErrMessage(resultCode));
                //支付成功
            } else {
                Log.e(TAG, "onResult resultCode=" + resultCode + ", resultInfo=" + resultInfo);
                //其他
                invokeCallback(activity, hostPackageName, RXErrorCode.HQ_DATA_ERROR.getValue(), UnifyPayPlugin.getUnifyErrMessage(resultCode));
            }
        });

        UnifyPayRequest msg = new UnifyPayRequest();
        msg.payChannel = payChannel;
        msg.payData = appPayRequest;
        unifyPay.sendPayRequest(msg);
    }

    /**
     * 云闪付
     */
    public static void payCloudQuickPay(Context context, String tn) {
        //   tn字段可通过下单请求响应中appPayRequest信息解析获取 serverMode 为后台环境标识，默认使用“00”生产环境
        UPPayAssistEx.startPay(context, null, null, tn, "00");
        Log.d("rxsdk", "云闪付支付 tn = " + tn);
    }

    private static void invokeCallback(Activity activity, String packageName, int code, String msg) {
        if (!TextUtils.isEmpty(packageName)) {
            Intent intent = new Intent();
            intent.setComponent(new ComponentName(packageName, "com.ruixue.callback.RXEntryActivity"));
            intent.putExtra("type", AUMS);
            intent.putExtra("code", code);
            intent.putExtra("msg", msg);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            activity.startActivity(intent);
        } else {
            Log.e("rxsdk", "package name null error");
        }
        activity.finishAffinity();
    }

    public static String bundleToString(Bundle bundle) {
        if (null != bundle) {
            StringBuilder log = new StringBuilder();
            for (String key : bundle.keySet()) {
                log.append("\n").append(key).append(" = ").append(bundle.get(key));
            }
            return log.toString();
        }
        return "";
    }

    //jixiang433://backfromalipay?errCode=0000&errStr=%E6%94%AF%E4%BB%98%E6%88%90%E5%8A%9F
    public static void handleIntent(Activity activity, Intent intent) {
        if (intent != null) {
            Log.e("rxsdk", "bundle:" + bundleToString(intent.getExtras()));
            try {
                String type = intent.getStringExtra("type");
                if (!TextUtils.isEmpty(type) && AUMS.equals(type)) {
                    String payType = intent.getStringExtra("hq_type");
                    String params = intent.getStringExtra("pay_params");
                    hostPackageName = intent.getStringExtra("package_ame");
                    UPPayWrapper.sendPayRequest(activity, payType, params);
                } else {
                    Uri uri = intent.getData();
                    if (null != uri) {
                        String errCode = uri.getQueryParameter("errCode");
                        String errStr = uri.getQueryParameter("errStr");
                        Log.i(TAG, "backfromalipay errCode:" + errCode + " errStr:" + errStr);
//                    "backfromalipay".equals(uri.getHost())
                        if (UnifyPayListener.ERR_OK.equals(errCode)) {
                            invokeCallback(activity, hostPackageName, RXErrorCode.SUCCESS.getValue(), errStr);
                        } else {
                            invokeCallback(activity, hostPackageName, RXErrorCode.HQ_DATA_ERROR.getValue(), errStr + ":" + errCode);
                        }
                    } else {
                        activity.finish();
                    }
                }
            } catch (Exception e) {
                e.getStackTrace();
                invokeCallback(activity, hostPackageName, RXErrorCode.HQ_DATA_ERROR.getValue(), e.getMessage());
            }
        }
    }

    //requestCode 10
    public static void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (data == null|| data.getExtras() == null) {
            return;
        }
        String msg;
//        Log.e("onActivityResult", bundleToString(data.getExtras()));
        String str = data.getExtras().getString("pay_result");
        if (str.equalsIgnoreCase("success")) {
            msg = "支付成功";
            invokeCallback(activity, hostPackageName, RXErrorCode.SUCCESS.getValue(), msg);
        } else if (str.equalsIgnoreCase("fail")) {
            msg = "支付失败";
            invokeCallback(activity, hostPackageName, RXErrorCode.HQ_DATA_ERROR.getValue(), msg);
        } else if (str.equalsIgnoreCase("cancel")) {
            msg = "用户取消了支付";
            invokeCallback(activity, hostPackageName, RXErrorCode.PAY_CANCEL.getValue(), msg);
        }
    }


    /**
     * 微信 WXEntryActivity onResp 中回调此方法
     *
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
