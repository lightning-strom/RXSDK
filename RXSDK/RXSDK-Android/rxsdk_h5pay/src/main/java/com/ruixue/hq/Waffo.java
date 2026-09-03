package com.ruixue.hq;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;

import org.json.JSONObject;

public class Waffo {

    public static void doPay(Activity activity, @NonNull JSONObject jsonObject, RXJSONCallback callback) {
        try {
            JSONObject extObj = jsonObject.getJSONObject("ext");
            String url = extObj.optString("url");
            doPay(activity, url, callback);
        } catch (Exception e) {
            RXLogger.e("调起HQ失败:" + e.getClass());
            e.printStackTrace();
            callback.onError(new RXException(e));
        }
    }

    private static void doPay(Activity activity, String payUrl, RXJSONCallback callback) {
        HQCommon.doPay(activity, payUrl, callback);
    }
}
