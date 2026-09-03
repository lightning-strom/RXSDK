package com.ruixue.base;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.os.Bundle;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.HQType;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.Map;
import java.util.Objects;


public class PluginPayManager {
//    private static final String PLUGIN_NAME = "RX_PLUGIN_PAY_UNIFYPAY";

//    public static void onActivityResult(Context context, int requestCode, int resultCode, Intent data) {
//        final String packageClassName = getMetaDataVal(context, PLUGIN_NAME);
//        Class<?> packageclass = getClass(packageClassName);
//        if (packageclass != null) {
//            try {
//                Method methodFun = packageclass.getMethod("onActivityResult", int.class, int.class, Intent.class);
//                methodFun.invoke(null, requestCode, requestCode, data);
//            } catch (Exception e) {
//                printStackTrack(e);
//            }
//        }
//    }

//    public static void handleIntent(Context context, Intent intent) {
//        final String packageClassName = getMetaDataVal(context, PLUGIN_NAME);
//        Class<?> packageclass = getClass(packageClassName);
//        if (packageclass != null) {
//            try {
//                Method methodFun = packageclass.getMethod("handleIntent", Intent.class);
//                methodFun.invoke(null, intent);
//
//            } catch (Exception e) {
//                printStackTrack(e);
//            }
//        }
//    }


//    public static boolean pay(Activity activity, String payType, String payParams, RXJSONCallback callback) {
//        final String packageClassName = getMetaDataVal(activity, PLUGIN_NAME);
//        Class<?> packageclass = getClass(packageClassName);
//        if (packageclass != null) {
//            try {
//                Method methodFun = packageclass.getMethod("pay", Context.class, String.class, String.class, RXJSONCallback.class);
//                methodFun.invoke(null, activity, payType, payParams, callback);
//                return true;
//            } catch (Exception e) {
//                printStackTrack(e);
//                if (callback != null) {
//                    callback.onError(new RXException((e)));
//                }
//            }
//        }
//        return false;
//    }

    private static RXJSONCallback mCallback;
    public static final String AUMS = "aums";

    public static void handlePluginCallback(Bundle bundle) {
        if (mCallback != null) {
            String type = bundle.getString("type", "");
            if (AUMS.equals(type)) {
                int code = bundle.getInt("code", -1);
                if (code == RXErrorCode.SUCCESS.getValue()) {
                    mCallback.onSuccess(null);
                } else {
                    String msg = bundle.getString("msg", "");
                    mCallback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(code, msg));
                }
                mCallback = null;
            }
        }
    }

    public static void doPay(Activity activity, Map<String, Object> reqMap, JSONObject respData, RXJSONCallback callback) {
        @SuppressWarnings("unchecked") Map<String, Object> reqExtMap = (Map<String, Object>) reqMap.get("ext");
        if (null != reqExtMap && respData.has("ext") && reqMap.containsKey("plugin_name")) {
            PluginPayManager.payByPlugin(activity, (String) reqMap.get("plugin_name"), reqMap.get("plugin_version"), (String) reqExtMap.get("hq_type"), respData, callback);
        } else {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "插件参数错误！"));
            RXLogger.e("插件支付参数错误:" + reqMap.toString());
        }
    }


    public static void payByPlugin(Activity activity, String pluginPkgName, Object pluginVersion, String payType, JSONObject respData, RXJSONCallback callback) {
        long clientPluginVersion = AppUtils.getPackageVersionCode(activity, pluginPkgName);
        int lastPluginVersion = pluginVersion != null ? (int) pluginVersion : 1;
        if (clientPluginVersion >= lastPluginVersion) {
            mCallback = callback;
            Intent intent = new Intent();
            intent.setComponent(new ComponentName(pluginPkgName, "com.ruixue.plugin.unifypay.MainActivity"));
            intent.putExtra("type", AUMS);
            intent.putExtra("pay_params", Objects.requireNonNull(respData.optJSONObject("ext"), "plugin pay pay_params null error!").toString());
            intent.putExtra("hq_type", payType);
            intent.putExtra("package_ame", activity.getPackageName());
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            activity.startActivity(intent);

        } else {
            Downloader downloader = Downloader.getInstance(activity);
            downloader.setAutoInstall(true);
            downloader.setFinishCallback(new Downloader.OnFinishCallback() {
                @Override
                public void onFinish(boolean isSuccess, String uriStr) {
                    if (!isSuccess && callback != null) {
                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "支付插件下载失败！"));
                    }
                    RXLogger.i(isSuccess + uriStr);
                }
            });
            String fileName = pluginPkgName.replace(".", "_") + "_" + lastPluginVersion + ".apk";
            downloader.downloadAPK(respData.optString("plugin_url", "https://oss.ruixueyun.com/apk/") + fileName, fileName, "正在下载...", null);
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "正在下载支付插件..."));
        }
    }

}
