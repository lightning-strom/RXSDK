package com.ruixue.demo.callback;

import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXRequestCallback;
import com.ruixue.callback.RXStringCallback;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.Map;

/**
 * Demo 回调工具类
 * <p>
 * 提供统一的回调处理，减少重复代码
 *
 * @since 2.0
 */
public class DemoCallback {

    private static final String TAG = "rxsdk";

    /**
     * 结果显示接口
     */
    public interface ResultDisplay {
        void showLog(String message);
        void showToast(String message);
    }

    /**
     * 创建通用的 RXRequestCallback
     *
     * @param display 结果显示接口
     * @return RXRequestCallback 实例
     */
    public static RXRequestCallback createRequestCallback(@NonNull ResultDisplay display) {
        return new RXRequestCallback() {
            @Override
            public Map<String, Object> onClickHandle(Map<String, Object> params) {
                return params;
            }

            @Override
            public void onResponse(JSONObject jsonObject) {
                RXLogger.i(TAG, "onResponse: " + jsonObject);
                display.showLog(jsonObject.toString());
            }

            @Override
            public void onError(RXException e) {
                RXLogger.e(TAG, "onError: " + e.getMessage());
                display.showLog(e.getJSONString());
            }
        };
    }

    /**
     * 创建通用的 RXStringCallback
     *
     * @param display 结果显示接口
     * @return RXStringCallback 实例
     */
    public static RXStringCallback createStringCallback(@NonNull ResultDisplay display) {
        return new RXStringCallback() {
            @Override
            public void onError(RXException e) {
                RXLogger.e(TAG, "onError: " + e.getMessage());
                display.showLog(e.getJSONString());
            }

            @Override
            public void onSuccess(@Nullable String data) {
                RXLogger.i(TAG, "onSuccess: " + data);
                if (data != null) {
                    display.showLog(data);
                    display.showToast("请求成功");
                }
            }

            @Override
            public void onFailed(int code, String msg, String traceId) {
                String result = JSONUtil.toJSONObject(code, msg, traceId).toString();
                RXLogger.e(TAG, "onFailed: " + result);
                display.showLog(result);
            }
        };
    }

    /**
     * 创建通用的 RXJSONCallback
     *
     * @param display 结果显示接口
     * @return RXJSONCallback 实例
     */
    public static com.ruixue.RXJSONCallback createJsonCallback(@NonNull ResultDisplay display) {
        return new com.ruixue.RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                RXLogger.i(TAG, "onSuccess: " + data);
                if (data != null) {
                    display.showLog(data.toString());
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.e(TAG, "onFailed: " + cause);
                display.showLog(cause.toString());
            }
        };
    }

    /**
     * 创建带密码校验的 RXRequestCallback
     *
     * @param display 结果显示接口
     * @param minPasswordLength 最小密码长度
     * @return RXRequestCallback 实例
     */
    public static RXRequestCallback createPasswordValidatingCallback(
            @NonNull ResultDisplay display,
            int minPasswordLength) {
        return new RXRequestCallback() {
            @Override
            public Map<String, Object> onClickHandle(Map<String, Object> loginParams) {
                String password = (String) loginParams.get("password");
                if (password != null && password.length() < minPasswordLength) {
                    loginParams.put("break", true);
                    display.showToast("密码长度不能小于 " + minPasswordLength + " 位");
                }
                return loginParams;
            }

            @Override
            public void onResponse(JSONObject jsonObject) {
                RXLogger.i(TAG, "onResponse: " + jsonObject);
                display.showLog(jsonObject.toString());
                // 支付/登录等统一走此处；成功时 data 可能为 null（如虎牙仅表示拉起支付页）
                if (jsonObject == null) {
                    display.showToast("回调为空");
                    return;
                }
                int code = jsonObject.optInt("code", -1);
                if (code == 0) {
                    // 虎牙等渠道：支付 onSuccess 且无 data 仅表示拉起支付页，发货以后端为准
                    if (jsonObject.isNull("data") || !jsonObject.has("data")) {
                        display.showToast("支付/操作成功（无 data，发货以服务端回调为准）");
                    } else {
                        display.showToast("登录/操作成功");
                    }
                } else {
                    String msg = jsonObject.optString("msg", "");
                    display.showToast(TextUtils.isEmpty(msg)
                            ? ("登录/支付失败 code=" + code)
                            : ("登录/支付失败: " + msg));
                }
            }

            @Override
            public void onError(RXException e) {
                RXLogger.e(TAG, "onError: " + e.getMessage());
                display.showLog(e.getJSONString());
                display.showToast("错误: " + e.getMessage());
            }
        };
    }

    /**
     * 创建简单的 RXRequestCallback（仅打印日志）
     *
     * @return RXRequestCallback 实例
     */
    public static RXRequestCallback createSimpleCallback() {
        return new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject jsonObject) {
                RXLogger.i(TAG, "onResponse: " + jsonObject);
            }

            @Override
            public void onError(RXException e) {
                RXLogger.e(TAG, "onError: " + e.getMessage());
            }
        };
    }

    /**
     * 创建带成功回调的 RXRequestCallback
     *
     * @param onSuccess 成功时的回调
     * @return RXRequestCallback 实例
     */
    public static RXRequestCallback createSuccessCallback(@NonNull OnSuccessListener onSuccess) {
        return new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject jsonObject) {
                RXLogger.i(TAG, "onResponse: " + jsonObject);
                onSuccess.onSuccess(jsonObject);
            }

            @Override
            public void onError(RXException e) {
                RXLogger.e(TAG, "onError: " + e.getMessage());
            }
        };
    }

    /**
     * 成功回调接口
     */
    public interface OnSuccessListener {
        void onSuccess(JSONObject data);
    }
}
