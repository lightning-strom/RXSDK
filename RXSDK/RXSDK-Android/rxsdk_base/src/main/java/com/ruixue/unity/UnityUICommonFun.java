package com.ruixue.unity;

import android.app.Activity;

import com.ruixue.RXRequestCallback;
import com.ruixue.error.RXException;

import org.json.JSONObject;

import java.util.Map;
import java.util.concurrent.FutureTask;

public class UnityUICommonFun {

    public static RXRequestCallback convertRXUICallback(UnityRXRequestCallback loginCallback) {
        return new RXRequestCallback(){

            @Override
            public Map<String, Object> onClickHandle(Map<String, Object> params) {
//                return loginCallback.onClickHandle(params);
                return params;
            }

            @Override
            public void onError(RXException e) {
                super.onError(e);
                if (loginCallback != null) {
                    loginCallback.onError(e.getJSONString());
                }
            }

            @Override
            public void onResponse(JSONObject jsonObject) {
                if (loginCallback != null) {
                    if (jsonObject == null) {
                        loginCallback.onResponse("");
                    } else {
                        loginCallback.onResponse(jsonObject.toString());
                    }
                }
            }
        };
    }

    public interface FunUIHasReturnLambda<T> {
        T invoke();
    }

    public static <T> T runOnUIHasTurn(Activity activity, FunUIHasReturnLambda<T> funUIHasReturnLambda) {
        FutureTask<T> futureResult = new FutureTask<>(funUIHasReturnLambda::invoke);
        activity.runOnUiThread(futureResult);
        try {
            return futureResult.get();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public interface FunUINoReturnLambda {
        void invoke();
    }

    public static void runOnUINoTurn(Activity activity, FunUINoReturnLambda funLamada) {
        activity.runOnUiThread(funLamada::invoke);
    }

}
