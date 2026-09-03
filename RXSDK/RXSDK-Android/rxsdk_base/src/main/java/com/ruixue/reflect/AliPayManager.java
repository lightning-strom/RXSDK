package com.ruixue.reflect;

import android.app.Activity;

import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXException;

import org.json.JSONObject;

import java.lang.reflect.Method;

public class AliPayManager extends BaseReflectClass {
    public static final String PACKAGECLASS = "com.ruixue.alipay.AliPayHelper";

    /**
     * 支付
     *
     * @param activity
     * @param orderObj 服务端返回加密后测参数
     */
    public static void pay(Activity activity, JSONObject orderObj, RXJSONCallback callback) {
        Class<?> wechathelper = getClass(activity, PACKAGECLASS);
        if (wechathelper != null) {
            try {
                Method methodInit = wechathelper.getMethod("pay", Activity.class, JSONObject.class, RXJSONCallback.class);
                methodInit.invoke(null, activity, orderObj, callback);
            } catch (Exception e) {
                printStackTrack(e);
                if (callback != null) {
                    callback.onError(new RXException(e));
                }
            }
        }
    }


}
