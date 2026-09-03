package com.ruixue.sdk;

import android.app.Activity;
import com.qooapp.opensdk.QooAppOpenSDK;
import com.qooapp.opensdk.common.QooAppCallback;
import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.unity.UnityBaseCommonFun;
import com.ruixue.unity.UnityRXJSONCallback;
import com.ruixue.unity.UnityRXRequestCallback;
import com.ruixue.utils.JSONUtil;

public class QooSdkHelper {

    public static void checkLicense(RXJSONCallback callback) {
        QooAppOpenSDK.getInstance().checkLicense(new QooAppCallback() {

            @Override
            public void onSuccess(String info) {
                if (callback != null) {
                    callback.onSuccess(
                            JSONUtil.toJSONObject(RXErrorCode.SUCCESS.getValue(),
                                    info)
                    );
                }
            }

            @Override
            public void onError(String error) {
                if (callback != null) {
                    callback.onFailed(
                            JSONUtil.toJSONObject(RXErrorCode.THIRD_LOGIN_ERROR.getValue(),
                                    error)
                    );
                }
            }

        });
    }

    public static void UnityCheckLicense(UnityRXRequestCallback callback) {
        checkLicense(UnityBaseCommonFun.convertCallback(callback));
    }

    public static void restorePurchases(RXJSONCallback callback) {
        QooAppOpenSDK.getInstance().restorePurchases(new QooAppCallback() {
            @Override
            public void onSuccess(String response) {
                if (callback != null) {
                    callback.onSuccess(
                            JSONUtil.toJSONObject(RXErrorCode.SUCCESS.getValue(),
                                    response)
                    );
                }
            }


            @Override
            public void onError(String error) {
                if (callback != null) {
                    callback.onFailed(
                            JSONUtil.toJSONObject(RXErrorCode.THIRD_LOGIN_ERROR.getValue(),
                                    error)
                    );
                }
            }
        });
    }

    public static void unityRestorePurchases(UnityRXRequestCallback callback) {
        restorePurchases(UnityBaseCommonFun.convertCallback(callback));
    }

    public static void consume(String purchase_id, String token, RXJSONCallback callback) {
        QooAppOpenSDK.getInstance().consume(new QooAppCallback() {

            @Override
            public void onSuccess(String response) {
                if (callback != null) {
                    callback.onSuccess(
                            JSONUtil.toJSONObject(RXErrorCode.SUCCESS.getValue(),
                                    response)
                    );
                }
            }

            @Override
            public void onError(String error) {
                if (callback != null) {
                    callback.onFailed(
                            JSONUtil.toJSONObject(RXErrorCode.THIRD_LOGIN_ERROR.getValue(),
                                    error)
                    );
                }
            }

        }, purchase_id, token);
    }

    public static void unityConsume(String purchase_id, String token, UnityRXRequestCallback callback) {
        consume(purchase_id, token, UnityBaseCommonFun.convertCallback(callback));
    }

    public static void queryProducts(RXJSONCallback callback) {

        QooAppOpenSDK.getInstance().queryProducts(new QooAppCallback() {

            @Override
            public void onSuccess(String result) {
                if (callback != null) {
                    callback.onSuccess(
                            JSONUtil.toJSONObject(RXErrorCode.SUCCESS.getValue(),
                                    result)
                    );
                }
            }

            @Override
            public void onError(String error) {
                if (callback != null) {
                    callback.onFailed(
                            JSONUtil.toJSONObject(RXErrorCode.THIRD_LOGIN_ERROR.getValue(),
                                    error)
                    );
                }
            }
        });
    }

    public static void unityQueryProducts(UnityRXRequestCallback callback) {
        queryProducts(UnityBaseCommonFun.convertCallback(callback));
    }

    public static void queryProductInfo(String productIds, RXJSONCallback callback) {
        QooAppOpenSDK.getInstance().queryProductsInfo(new QooAppCallback() {

            @Override
            public void onSuccess(String result) {
                if (callback != null) {
                    callback.onSuccess(
                            JSONUtil.toJSONObject(RXErrorCode.SUCCESS.getValue(),
                                    result)
                    );
                }
            }

            @Override
            public void onError(String error) {
                if (callback != null) {
                    callback.onFailed(
                            JSONUtil.toJSONObject(RXErrorCode.THIRD_LOGIN_ERROR.getValue(),
                                    error)
                    );
                }
            }

        }, productIds);
    }

    public static void unityQueryProductInfo(String productIds, UnityRXRequestCallback callback) {
        queryProductInfo(productIds, UnityBaseCommonFun.convertCallback(callback));
    }

    public static void queryProducts(int page, int size, RXJSONCallback callback) {
        QooAppOpenSDK.getInstance().queryProducts(new QooAppCallback() {

            @Override
            public void onSuccess(String result) {
                if (callback != null) {
                    callback.onSuccess(
                            JSONUtil.toJSONObject(RXErrorCode.SUCCESS.getValue(),
                                    result)
                    );
                }
            }


            @Override
            public void onError(String error) {
                if (callback != null) {
                    callback.onFailed(
                            JSONUtil.toJSONObject(RXErrorCode.THIRD_LOGIN_ERROR.getValue(),
                                    error)
                    );
                }
            }

        }, page, size);
    }

    public static void unityQueryProducts(int page, int size, UnityRXRequestCallback callback) {
        queryProducts(page, size, UnityBaseCommonFun.convertCallback(callback));
    }

    public static void openGameDetail(Activity activity) {
        QooAppOpenSDK.getInstance().openGameDetail(activity);
    }

    public static void latestVersionCode(RXJSONCallback callback) {
        QooAppOpenSDK.getInstance().latestVersionCode(new QooAppCallback() {
            @Override
            public void onSuccess(String response) {
                if (callback != null) {
                    callback.onSuccess(
                            JSONUtil.toJSONObject(RXErrorCode.SUCCESS.getValue(),
                                    response)
                    );
                }
            }

            @Override
            public void onError(String error) {
                if (callback != null) {
                    callback.onFailed(
                            JSONUtil.toJSONObject(RXErrorCode.THIRD_LOGIN_ERROR.getValue(),
                                    error)
                    );
                }
            }
        });
    }

    public static void unityLatestVersionCode(UnityRXRequestCallback callback) {
        latestVersionCode(UnityBaseCommonFun.convertCallback(callback));
    }

    public static boolean setLocale(String eng) {
        return QooAppOpenSDK.setLocale(eng);
    }

    public static String getDataFromResponse(String response) {
        return QooAppOpenSDK.getDataFromResponse(response);
    }

}
