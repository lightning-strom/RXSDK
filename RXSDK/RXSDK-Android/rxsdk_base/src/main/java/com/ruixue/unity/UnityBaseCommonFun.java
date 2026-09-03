package com.ruixue.unity;

import android.app.Activity;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.gson.Gson;
import com.ruixue.RXJSONCallback;
import com.ruixue.RXRequestCallback;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.RXStringCallback;
import com.ruixue.error.RXException;
import com.ruixue.openapi.BusinessDataCallback;
import com.ruixue.openapi.BusinessWindowData;
import com.ruixue.openapi.RuiXueSdkCallback;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.List;
import java.util.Map;

public class UnityBaseCommonFun {

    public static BusinessDataCallback convertBusinessCallback(UnityRXRequestCallback callback)
    {
        return new BusinessDataCallback() {
            @Override
            public void onResponse(@Nullable List<BusinessWindowData> data) {
                if (callback != null) {
                    Gson gson = new Gson();
                    callback.onResponse(gson.toJson(data));
                }
            }

            @Override
            public void onError(RXException e) {
                super.onError(e);
                if (callback != null) {
                    callback.onError(e.getJSONString());
                }
            }
        };
    }

    public static RXRequestCallback convertCallback(UnityRXRequestCallback callback) {
        return new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject jsonObject) {

//                if (jsonObject == null) {
//                    callback.onResponse("");
//                }else {
//                    callback.onResponse(jsonObject.toString());
//                }
                if (callback != null) {
                    if (jsonObject != null) {
                        if (jsonObject.optInt("code") == 0) {
                            callback.onResponse(jsonObject.toString());
                        } else {
                            callback.onError(jsonObject.toString());
                        }
                    } else {
                        callback.onError("");
                    }
                }

            }

            @Override
            public void onError(RXException e) {
                super.onError(e);
                if (callback != null) {
                    callback.onError(e.getJSONString());
                }
            }

            @Override
            public Map<String, Object> onClickHandle(Map<String, Object> params) {
                if (params == null) {
                    return null;
                }else {
                    return params;
                }
            }
        };
    }

    public static RXJSONCallback convertJSONCallback(UnityRXRequestCallback callback) {
        return new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (callback != null) {
                    callback.onResponse(data != null ? data.toString() : "");
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null) {
                    callback.onError(cause.toString());
                }
            }
        };
    }

    public static RuiXueSdkCallback convertCallback(UnityRuiXueSdkCallback callback)
    {
        return new RuiXueSdkCallback() {

            public void rxPublicCallback(int type, Map<String,Object> map) {
                if (callback != null) {
                    callback.rxPublicCallback(type, JSONUtil.toJSONString(map));
                }
            }

            @Override
            public void onLogout(int code, String msg) {
                if (callback != null) {
                    callback.onLogout(code, msg);
                }
            }

            @Override
            public boolean onSwitchAccount(int code, String data) {
                if (callback == null) {
                    return false;
                }
                return callback.onSwitchAccount(code, data);
            }
        };
    }

    public  static OnAppExitCallback convertCallback(UnityOnAppExitCallback callback)
    {
        return new OnAppExitCallback() {
            @Override
            public void onExitConfirm(@Nullable String res) {
                if (callback != null) {
                    callback.onExitConfirm(res);
                }
            }

            @Override
            public void onExitCancel() {
                super.onExitCancel();
                if (callback != null) {
                    callback.onExitCancel();
                }
            }
        };
    }

    public static RXStringCallback convertCallback(UnityRXStringCallback callback)
    {
        return new RXStringCallback() {
            @Override
            public void onSuccess(@Nullable String data) {
                if (callback != null) {
                    callback.onSuccess(data);
                }
            }

            @Override
            public void onFailed(int code, String msg, @Nullable String traceId) {
                if (callback != null) {
                    callback.onFailed(code, msg, traceId);
                }
            }

            @Override
            public void onError(RXException e) {
                super.onError(e);
                if (callback != null) {
                    callback.onError(e.getJSONString());
                }
            }
        };
    }

    public static RXStringCallback convertCallback(UnityConvertRXStringCallback callback)
    {
        return new RXStringCallback() {
            @Override
            public void onSuccess(@Nullable String data) {
                if (callback != null) {
                    callback.onSuccess(data);
                }
            }

            @Override
            public void onFailed(int code, String msg, @Nullable String traceId) {
                if (callback != null) {
                    callback.onFailed(code, msg, traceId);
                }
            }
        };
    }

    public interface FunLambda {
        void invoke();
    }

    public static void runOnUI(Activity activity, FunLambda funLambda) {
        activity.runOnUiThread(funLambda::invoke);
    }

}
