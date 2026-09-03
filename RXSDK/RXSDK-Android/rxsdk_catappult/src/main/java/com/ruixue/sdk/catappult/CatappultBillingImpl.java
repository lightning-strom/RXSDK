package com.ruixue.sdk.catappult;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;
import android.util.Base64;
import android.util.SparseArray;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.appcoins.sdk.billing.AppcoinsBillingClient;
import com.appcoins.sdk.billing.BillingFlowParams;
import com.appcoins.sdk.billing.Purchase;
import com.appcoins.sdk.billing.PurchasesResult;
import com.appcoins.sdk.billing.PurchasesUpdatedListener;
import com.appcoins.sdk.billing.ResponseCode;
import com.appcoins.sdk.billing.SkuDetails;
import com.appcoins.sdk.billing.SkuDetailsParams;
import com.appcoins.sdk.billing.helpers.CatapultBillingAppCoinsFactory;
import com.appcoins.sdk.billing.listeners.AppCoinsBillingStateListener;
import com.appcoins.sdk.billing.listeners.SkuDetailsResponseListener;
import com.appcoins.sdk.billing.types.SkuType;
import com.google.gson.Gson;
import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.billing.OrderData;
import com.ruixue.billing.HQType;
import com.ruixue.callback.RXStringCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RXRequest;
import com.ruixue.openapi.RXApiHelper;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ThreadUtils;


import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/8/26
 */
public class CatappultBillingImpl extends BillingClient {
    private AppcoinsBillingClient cab;

    private String mBase64EncodedPublicKey;
    RXJSONCallback mPayCallback;
    Context context;
    private static final SparseArray<String> PurchaseStateMsg = new SparseArray<String>() {
        {
            put(ResponseCode.SERVICE_UNAVAILABLE.getValue(), "The network connection is down");
            put(ResponseCode.BILLING_UNAVAILABLE.getValue(), "This billing API version is not supported for the type requested");
            put(ResponseCode.ITEM_UNAVAILABLE.getValue(), "Requested SKU is not available for purchase");
            put(ResponseCode.DEVELOPER_ERROR.getValue(), "Invalid arguments provided to the API");
            put(ResponseCode.ERROR.getValue(), "Fatal error during the API action");
            put(ResponseCode.ITEM_ALREADY_OWNED.getValue(), "Failure to purchase since item is already owned");
            put(ResponseCode.ITEM_NOT_OWNED.getValue(), "Failure to consume since item is not owned");

        }
    };

    public CatappultBillingImpl() {
    }

    public void init(Context context, String base64EncodedPublicKey) {
        mBase64EncodedPublicKey = base64EncodedPublicKey;
        this.context = context;
        if (!TextUtils.isEmpty(mBase64EncodedPublicKey)) {
            startConnection(appCoinsBillingStateListener);
        }
    }

    AppCoinsBillingStateListener appCoinsBillingStateListener = new AppCoinsBillingStateListener() {
        @Override
        public void onBillingSetupFinished(int responseCode) {
            if (responseCode != ResponseCode.OK.getValue()) {
                RXLogger.e("Problem setting up in-app billing: " + responseCode);
                return;
            }
            RXLogger.i("onBillingSetupFinished responseCode:" + responseCode);
            recoverPayNotify();
        }

        @Override
        public void onBillingServiceDisconnected() {
            RXLogger.i("onBillingServiceDisconnected ");
        }
    };


    PurchasesUpdatedListener purchasesUpdatedListener = new PurchasesUpdatedListener() {
        @Override
        public void onPurchasesUpdated(int responseCode, List<Purchase> purchases) {
            RXLogger.i("onPurchasesUpdated responseCode:" + responseCode + " ,purchases:" + new Gson().toJson(purchases));
            if (responseCode == ResponseCode.OK.getValue()) {
                payNotify(purchases);
            } else if (responseCode == ResponseCode.ITEM_ALREADY_OWNED.getValue()) {
                recoverPayNotify();
            } else if (mPayCallback != null) {
                ThreadUtils.getInstance().runOnUiThread(() -> mPayCallback.onFailed(RXErrorCode.PAY_ERROR.toJSONObject(responseCode, PurchaseStateMsg.get(responseCode, "unknown third error"))));
                mPayCallback = null;
            }
        }
    };

    public void startConnection(AppCoinsBillingStateListener appCoinsBillingStateListener) {
        if (cab != null && cab.isReady()) {
            appCoinsBillingStateListener.onBillingSetupFinished(ResponseCode.OK.getValue());
        } else if (!TextUtils.isEmpty(mBase64EncodedPublicKey)) {
            cab = CatapultBillingAppCoinsFactory.BuildAppcoinsBilling(context, Objects.requireNonNull(mBase64EncodedPublicKey), purchasesUpdatedListener);
            cab.startConnection(appCoinsBillingStateListener);
        } else {
            appCoinsBillingStateListener.onBillingSetupFinished(ResponseCode.SERVICE_UNAVAILABLE.getValue());
        }
    }

    private List<Purchase> getPurchases() {
        if (cab != null && cab.isReady()) {
            try {
                PurchasesResult purchasesResult = cab.queryPurchases(SkuType.inapp.toString());
                List<Purchase> purchases = purchasesResult.getPurchases();
                RXLogger.i("getPurchases purchases size:" + purchases.size());
                RXLogger.i("getPurchases purchases:" + new Gson().toJson(purchases));
                return purchases;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    private void recoverPayNotify() {
        new Thread(() -> {
            List<Purchase> purchases = getPurchases();
            ThreadUtils.getInstance().runOnUiThread(() -> payNotify(purchases));
        }).start();

    }

    public void payNotify(List<Purchase> purchases) {
        if (purchases == null || purchases.size() <= 0) {
            if (mPayCallback != null) {
                mPayCallback.onFailed(RXErrorCode.PAY_ERROR.toJSONObject(9, "purchases null error"));
                mPayCallback = null;
            }
            return;
        }
        for (Purchase purchase : purchases) {
//           token = purchase.token
            // After validating and attributing the product, consumePurchase should be called
            // to allow the user to purchase the item again and change the purchase's state.
            // Also consume subscriptions to make them active, there will be no issue in consuming more than once
//          cab.consumeAsync(token, consumeResponseListener);
            String payload = purchase.getDeveloperPayload();
            CatappultOrderData orderData = CatappultOrderData.fromDeveloperPayload(payload);
            Map<String, Object> hashMap = new HashMap<>();
            hashMap.put("orderId", purchase.getOrderId());
            hashMap.put("packageName", purchase.getPackageName());
            hashMap.put("sku", purchase.getSku());
            hashMap.put("purchaseTime", purchase.getPurchaseTime());
            hashMap.put("purchaseState", purchase.getPurchaseState());
            hashMap.put("developerPayload", purchase.getDeveloperPayload());
            hashMap.put("token", purchase.getToken());
            hashMap.put("originalJson", purchase.getOriginalJson());
            String base64Sign = android.util.Base64.encodeToString(purchase.getSignature(), Base64.DEFAULT);
            hashMap.put("signature", base64Sign);
            if (orderData.getParseState() != -1) {
                sendVerifyPaymentReq(orderData.getNotifyUrl(), hashMap, 0);
            } else {
                RXLogger.e("order data parse error payload:" + payload);
                consumePurchases(purchase.getToken());
                Map<String, Object> objectMap = new HashMap<>(hashMap);
                objectMap.put("state", "falied");
                RXApiHelper.Data.track("#rxsdk_payresult", null, objectMap, -1, -1);
            }
        }
    }


    private void sendVerifyPaymentReq(String url, Map<String, Object> hashMap, int retryCount) {
        if (TextUtils.isEmpty(url)) {
            if (mPayCallback != null) {
                mPayCallback.onFailed(RXErrorCode.HQ_DATA_ERROR.toJSONObject(-1, "notify url is null"));
                mPayCallback = null;
            }
            consumePurchases((String) hashMap.get("token"));
            return;
        }
        long delay = getDelay(retryCount) * 5000L;
        RXLogger.i("notify pay retry count:" + retryCount + ",delay:" + delay);
        RXRequest.create(url).setBody(hashMap).postAsyncDelay(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                consumePurchases((String) hashMap.get("token"));
                Map<String, Object> objectMap = new HashMap<>(hashMap);
                objectMap.put("state", "success");
                objectMap.putAll(JSONUtil.toMapNonNull(data));
                RXApiHelper.Data.track("#rxsdk_payresult", null, objectMap, -1, -1);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                int errorCode = cause.optInt("code");
                if (errorCode == 302408 || errorCode == 302409) {  // 重复使用凭证， 直接消耗商品
                    RXLogger.e("rx consumeOwnedPurchase 强制消费错误数据:" + cause);
                    consumePurchases((String) hashMap.get("token"));
                    if (mPayCallback != null) {
                        mPayCallback.onFailed(cause);
                        mPayCallback = null;
                    }
                    Map<String, Object> objectMap = new HashMap<>(hashMap);
                    objectMap.put("state", "failed");
                    objectMap.put("msg", cause.toString());
                    RXApiHelper.Data.track("#rxsdk_payresult", null, objectMap, -1, -1);
                } else if (errorCode != 302424 && retryCount < 4) {
                    sendVerifyPaymentReq(url, hashMap, retryCount + 1);
                } else {
                    if (mPayCallback != null) {
                        mPayCallback.onFailed(cause);
                        mPayCallback = null;
                    }
                    Map<String, Object> objectMap = new HashMap<>(hashMap);
                    objectMap.put("state", "failed");
                    objectMap.put("msg", cause.toString());
                    RXApiHelper.Data.track("#rxsdk_payresult", null, objectMap, -1, -1);
                }
            }

            @Override
            public void onError(RXException e) {
                if (retryCount < 4) {
                    sendVerifyPaymentReq(url, hashMap, retryCount + 1);
                } else {
                    if (mPayCallback != null) {
                        mPayCallback.onError(e);
                        mPayCallback = null;
                    }
                    Map<String, Object> objectMap = new HashMap<>(hashMap);
                    objectMap.put("state", "error");
                    objectMap.put("msg", e.getMessage());
                    RXApiHelper.Data.track("#rxsdk_payresult", null, objectMap, -1, -1);
                }
            }
        }, delay);
    }

    private long getDelay(int n) {
        if (n < 1)
            return 0;
        if (n == 1 || n == 2)
            return 1;
        return getDelay(n - 2) + getDelay(n - 1);
    }

    private void consumePurchases(String token) {
        RXLogger.i("consumePurchases token:" + token);
        Objects.requireNonNull(cab).consumeAsync(token, (responseCode, purchaseToken) -> {
            RXLogger.i("onConsumeResponse responseCode:" + responseCode + ", purchaseToken:" + purchaseToken);
            if (mPayCallback != null) {
                ThreadUtils.getInstance().runOnUiThread(() -> mPayCallback.onSuccess(RXErrorCode.SUCCESS.toJSONObject()));
                mPayCallback = null;
            }
        });
    }


    public void queryProductDetailsAsync(@NonNull List<String> skusList, @NonNull RXStringCallback callback) {
        SkuDetailsParams skuDetailsParams = new SkuDetailsParams();
        skuDetailsParams.setItemType(SkuType.inapp.toString());
        skuDetailsParams.setMoreItemSkus(skusList);
        cab.querySkuDetailsAsync(skuDetailsParams, new SkuDetailsResponseListener() {
            @Override
            public void onSkuDetailsResponse(int responseCode, List<SkuDetails> skuDetailsList) {
                if (responseCode == ResponseCode.OK.getValue()) {
                    callback.onSuccess(new Gson().toJson(skuDetailsList));
                } else {
                    callback.onFailed(responseCode, PurchaseStateMsg.get(responseCode, "unknown third error"), "");
                }
            }
        });
    }

    public void startPurchase(Activity activity, String sku, String orderId, String developerPayload, String origin, RXJSONCallback callback) {
        RXLogger.d("Launching purchase flow " + sku);
        //Make sure that the billing service is ready
        startConnection(new AppCoinsBillingStateListener() {
            @Override
            public void onBillingSetupFinished(int code) {
                RXLogger.d("onBillingSetupFinished code " + code);
                if (code == ResponseCode.OK.getValue()) {
                    Thread thread = new Thread(() -> {
                        // Your sku type, can also be SkuType.subs.toString()
                        String skuType = SkuType.inapp.toString();

                        BillingFlowParams billingFlowParams = new BillingFlowParams(sku, skuType, orderId, developerPayload, origin);
                        final int responseCode = cab.launchBillingFlow(activity, billingFlowParams);
                        RXLogger.d("launchBillingFlow responseCode " + responseCode);
                        if (callback != null) {
                            activity.runOnUiThread(() -> {
                                if (responseCode == ResponseCode.OK.getValue()) {
//                                    callback.onSuccess(RXErrorCode.SUCCESS.toJSONObject());
                                    mPayCallback = callback;
                                } else if (responseCode == ResponseCode.USER_CANCELED.getValue()) {
                                    callback.onFailed(RXErrorCode.PAY_CANCEL.toJSONObject());
                                } else {
                                    callback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(responseCode, PurchaseStateMsg.get(responseCode, "unknown third error")));
                                }
                            });
                        } else {
                            RXLogger.e("responseCode:" + responseCode + ",msg:" + PurchaseStateMsg.get(responseCode, "unknown third error"));
                        }
                    });
                    thread.start();
                } else {
                    if (callback != null)
                        callback.onFailed(RXErrorCode.PAY_ERROR.toJSONObject(code, "connect error :" + code));
                }
            }

            @Override
            public void onBillingServiceDisconnected() {
                if (callback != null)
                    callback.onFailed(RXErrorCode.PAY_ERROR.toJSONObject(ResponseCode.SERVICE_UNAVAILABLE.getValue(), "error service disconnected"));
            }
        });
    }


    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {

//        @SuppressWarnings("unchecked") Map<String, Object> extMap = (Map<String, Object>) hashMap.get("ext");
//        if (extMap != null && !extMap.containsKey("pay_way")) {
//            extMap.put("pay_way", hashMap.get("SDK_PAY"));
//            hashMap.put("ext", extMap);
//        }
//        if (extMap != null && !hashMap.containsKey("wx_appid") && extMap.containsKey("wx_appid")) {
//            hashMap.put("wx_appid", extMap.get("wx_appid"));
//        }

        super.pay(activity, hashMap, callback);
    }

    public static final String APTOIDE = "aptoide";

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        OrderData orderData = OrderData.fromJson(data);
        if (orderData != null) {
//            PayParams payReq = PayParams.create(hashMap);
            Object payType = hashMap.get(KEY_HQ_TYPE);
            if ((Objects.requireNonNull(payType).equals(APTOIDE))) {
                CatappultOrderData catappultOrderData = CatappultOrderData.fromJson(data);
                if (catappultOrderData != null && catappultOrderData.getExt() != null) {

                    startPurchase(activity, catappultOrderData.getExt().getSku(), catappultOrderData.getOrderNo(), catappultOrderData.toDeveloperPayload(), catappultOrderData.getExt().getOrigin(), callback);

                } else {
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "pay order null error！"));
                }
            } else {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_PARAMS_ERROR.getValue(), "不支持的HQ方式！"));
            }
        } else {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR));
        }
    }

    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (cab != null) {
            cab.onActivityResult(requestCode, resultCode, data);
        }
    }
}
