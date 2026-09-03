package com.ruixue.sdk;

import android.app.Activity;
import android.text.TextUtils;
import android.util.SparseArray;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;


import com.google.gson.Gson;
import com.hihonor.gamecenter.gcjointsdk.sdk.GCJointSdk;
import com.hihonor.iap.framework.data.ApiException;
import com.hihonor.iap.sdk.IapClient;
import com.hihonor.iap.sdk.bean.ConsumeReq;
import com.hihonor.iap.sdk.bean.ConsumeResult;
import com.hihonor.iap.sdk.bean.OwnedPurchasesReq;
import com.hihonor.iap.sdk.bean.ProductInfoReq;
import com.hihonor.iap.sdk.bean.ProductInfoResult;
import com.hihonor.iap.sdk.bean.ProductOrderIntentReq;
import com.hihonor.iap.sdk.bean.ProductOrderIntentWithPriceReq;
import com.hihonor.iap.sdk.bean.ProductType;
import com.hihonor.iap.sdk.bean.PurchaseProductInfo;
import com.hihonor.iap.sdk.bean.PurchaseResultInfo;
import com.hihonor.iap.sdk.tasks.Task;
import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.billing.HQType;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RXRequest;
import com.ruixue.openapi.RXApiHelper;
import com.ruixue.utils.EntityUtils;
import com.ruixue.utils.JSONUtil;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

public class HonorBillingImpl extends BillingClient {

    //是否在支付中
    public static AtomicBoolean isInThePay = new AtomicBoolean(false);
//    public static AtomicBoolean isEnvReady = new AtomicBoolean(false);

    private static String mNotifyUrl;

    private static final SparseArray<String> OrderStatusCodeMsg = new SparseArray<>();


    static {
        OrderStatusCodeMsg.put(10406, "有未消耗的产品!");
    }

    //    public void init(Activity activity) {
//        IapClient iapClient = Iap.getIapClient(activity);
    // 检查当前环境是否可用
//        iapClient.checkEnvReady().addOnSuccessListener(envReadyResult -> {
//            isEnvReady.set(true);
//        }).addOnFailureListener(new OnFailureListener() {
//            @SuppressLint("DefaultLocale")
//            @Override
//            public void onFailure(ApiException e) {
//                isEnvReady.set(false);
//            }
//        });
//    }
    public static final String HONOR = "honor";

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (hashMap != null && !hashMap.containsKey(KEY_HQ_TYPE)) {
            hashMap.put(KEY_HQ_TYPE, HONOR);
        }
        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        HonorOrderData orderData = HonorOrderData.fromJson(data);
        if (orderData != null) {
            mNotifyUrl = orderData.getNotifyUrl();
            if (TextUtils.isEmpty(orderData.getCurrency())) {
                orderData.setCurrency((String) hashMap.get("currency"));
            }
            isInThePay.set(true);
            createPurchaseIntent(activity, orderData, new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    isInThePay.set(false);
                    if (callback != null)
                        callback.onSuccess(data);
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    isInThePay.set(false);
                    if (callback != null)
                        callback.onFailed(cause);
                }

                @Override
                public void onError(RXException e) {
                    isInThePay.set(false);
                    if (callback != null)
                        callback.onError(e);
                }
            });
        } else if (callback != null) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR));
        }
    }

    /**
     * 判断是否支持应用内支付
     */
//    public boolean isEnvReady(final Activity activity) {
//        if (isEnvReady.get()) {
//            return isEnvReady.get();
//        }
//        return isEnvReady.get();
//    }
    public void queryProductInfo(List<String> productIdList, RXJSONCallback callback) {
        ProductInfoReq productInfoReq = new ProductInfoReq();
        productInfoReq.setProductType(ProductType.CONSUME);
        productInfoReq.setProductIds(productIdList);
        Task<ProductInfoResult> productInfo = GCJointSdk.getProductInfo(productInfoReq);
        productInfo.addOnSuccessListener(productInfoResult -> {
            RXLogger.e("product data is：" + productInfoResult.getProductInfos().toString());
            String s = new Gson().toJson(productInfoResult.getProductInfos());
            try {
                callback.onSuccess(new JSONObject(s));
            } catch (JSONException e) {
                callback.onError(new RXException(e));
            }
        }).addOnFailureListener(e -> {
            RXLogger.e(String.format(Locale.getDefault(), "getProductInfo %d %s", e.errorCode, e.message));
            callback.onFailed(JSONUtil.toJSONObject(e.errorCode, e.message));
        });
    }

    /**
     * 发起购买
     */
    public void createPurchaseIntent(Activity activity, HonorOrderData orderData, RXJSONCallback callback) {
        // 通过createPurchaseIntent接口购买的商品必须是您在AppGallery Connect网站配置的商品。
        String productId = orderData.getExt().getTag();
        if (TextUtils.isEmpty(productId)) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "honor product id is null error."));
            return;
        }
        IapClient.QuickPayCallback payCallback = new IapClient.QuickPayCallback() {
            @Override
            public void onSuccess(PurchaseResultInfo purchaseResultInfo, PurchaseProductInfo purchaseProductInfo) {
                RXLogger.i("launchPayFlow pms success:purchaseResultInfo = " + purchaseResultInfo.toString() + ";productInfo=" + purchaseProductInfo.toString());
                payNotify(EntityUtils.entityToMap(purchaseResultInfo), purchaseProductInfo, callback);
            }

            @Override
            public void onFail(ApiException apiException) {
                RXLogger.e("launchPayFlow pms fail:" + apiException);
                if (apiException.errorCode == 10406) {
                    obtainOwnedPurchases(activity, new RXJSONCallback() {
                        @Override
                        public void onSuccess(@Nullable JSONObject data) {
                            createPurchaseIntent(activity, orderData, callback);
                        }

                        @Override
                        public void onFailed(@NonNull JSONObject cause) {
                            callback.onFailed(RXErrorCode.PAY_ERROR.toJSONObject(apiException.errorCode, apiException.message));
                        }
                    });
                } else if (apiException.errorCode == 800010 || apiException.errorCode == 80001) {
                    callback.onFailed(RXErrorCode.PAY_CANCEL.toJSONObject(apiException.errorCode, apiException.message));
                } else {
                    callback.onFailed(RXErrorCode.PAY_ERROR.toJSONObject(apiException.errorCode, apiException.message));
                }
            }
        };

        if (orderData.getExt().isPrice()) {
            ProductOrderIntentWithPriceReq productOrderIntentWithPriceReq = new ProductOrderIntentWithPriceReq();
            productOrderIntentWithPriceReq.setProductType(orderData.getPriceType());
            productOrderIntentWithPriceReq.setProductId(productId);
            productOrderIntentWithPriceReq.setProductName(orderData.getGoodsName());
            productOrderIntentWithPriceReq.setCurrency(orderData.getCurrency());
            productOrderIntentWithPriceReq.setPrice(orderData.getExt().getPrice());
            productOrderIntentWithPriceReq.setNeedSandboxTest(orderData.getEnv());//传1为沙盒测试
            productOrderIntentWithPriceReq.setDeveloperPayload(orderData.toDeveloperPayload());
            productOrderIntentWithPriceReq.setBizOrderNo(orderData.getOrderNo());
            GCJointSdk.launchPayFlow(activity, productOrderIntentWithPriceReq, payCallback);
        } else {
            ProductOrderIntentReq productOrderIntentReq = new ProductOrderIntentReq();
            productOrderIntentReq.setProductType(orderData.getPriceType());
            productOrderIntentReq.setProductId(productId);
            productOrderIntentReq.setBizOrderNo(orderData.getOrderNo());
            productOrderIntentReq.setNeedSandboxTest(orderData.getEnv());//传1为沙盒测试
            productOrderIntentReq.setDeveloperPayload(orderData.toDeveloperPayload());
            GCJointSdk.launchPayFlow(activity, productOrderIntentReq, payCallback);
        }
    }

//    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
//        if (requestCode == REQUEST_CODE_PAY) {
//            // 客户端并不能100%确保支付结果回调
//            // 支付结果通知回调
//            // getOwnedPurchased、getOwnedPurchaseRecord
//            if (resultCode == Activity.RESULT_OK) {
//                PurchaseResultInfo purchaseResultInfo = IapUtil.parsePurchaseResultInfoFromIntent(data);
//                if (purchaseResultInfo == null) {
//                    // 取消支付
//                } else {
//                    String purchaseProductInfoStr = purchaseResultInfo.getPurchaseProductInfo();
//                    try {
//                        PurchaseProductInfo purchaseProductInfo = new Gson().fromJson(purchaseProductInfoStr, PurchaseProductInfo.class);
//                        switch (purchaseProductInfo.getPurchaseState()) {
//                            case PurchaseProductInfo.PurchaseState.PAID:
//                                // 支付成功
//                                // 支付成功后默认消耗，用户也可以根据实际情况消耗
//                                // 这里由于网络原因可能调用失败，可以添加重试机制，调用 iapClient.obtainOwnedPurchases ，查询已付款未消耗的商品进行消耗
//                                ConsumeReq comsumeReq = new ConsumeReq();
//                                //根据PurchaseToken 进行消耗
//                                comsumeReq.setPurchaseToken(purchaseProductInfo.getPurchaseToken());
//                                Task<ConsumeResult> comsumeRespTask = iapClient.consumeProduct(comsumeReq);
//                                comsumeRespTask.addOnSuccessListener(comsumeResp -> {
//                                    // 海外接入Toast需删除，或者配置本地化语言
//                                    // 消耗成功
////                                        Toast.makeText(MainActivity.this, "  " + comsumeResp.getConsumeData(), Toast.LENGTH_SHORT).show()).addOnFailureListener(e ->
////                                        // 消耗失败
////                                        Toast.makeText(MainActivity.this, "  " + e.getErrorCode() + ": " + e.getMessage(), Toast.LENGTH_SHORT).show()
//                                });
//                                break;
//                            case PurchaseProductInfo.PurchaseState.UNPAID:
//                            case PurchaseProductInfo.PurchaseState.PAID_FAILED:
//                            default:
//                                // 支付失败
//                        }
//                    } catch (Throwable t) {
//                        // 支付失败
//                    }
//                }
//            } else {
//                // 取消支付
//            }
//        }
//    }


    String mContinueToken;

    public void obtainOwnedPurchases(Activity activity, RXJSONCallback callback) {
        OwnedPurchasesReq ownedPurchasesReq = new OwnedPurchasesReq();
        // 传入上一次查询得到的continueToken，获取新的数据，第一次传空
        ownedPurchasesReq.setContinuationToken(mContinueToken);
        GCJointSdk.obtainOwnedPurchases(ownedPurchasesReq).addOnSuccessListener(ownedPurchasesResult -> {
            //ContinueToken用于获取下一个列表的数据，第一次为空，如果有更多数据ContinueToken有值，为空则没有更多数据
            mContinueToken = ownedPurchasesResult.getContinueToken();
            List<String> sigList = ownedPurchasesResult.getSigList();
            List<String> purchaseList = ownedPurchasesResult.getPurchaseList();
            for (int i = 0; i < purchaseList.size(); i++) {
                String purchaseProductInfoStr = purchaseList.get(i);
                String purchaseProductInfoSig = sigList.get(i);
                Map<String, Object> h = new HashMap<>();
                h.put("purchaseProductInfo", purchaseProductInfoStr);
                h.put("purchaseProductInfoSig", purchaseProductInfoSig);
                PurchaseProductInfo purchaseProductInfo = new Gson().fromJson(purchaseProductInfoStr, PurchaseProductInfo.class);

//                boolean verify = RSAUtil.verify(PurchaseProductInfoStr, publicKey, sigList.get(i));
//                Log.d(TAG, " PurchaseProductInfoStr verify " + verify + "  , " + PurchaseProductInfoStr);
//                consumeOwnedPurchase(purchaseProductInfo.getPurchaseToken(), null);
                payNotify(h, purchaseProductInfo, callback);
            }
        }).addOnFailureListener(e -> {
            //   e.errorCode 对应 OrderStatusCode的值
            RXLogger.e(String.format(Locale.getDefault(), "obtainOwnedPurchases %d %s", e.errorCode, e.message));
            if (e.errorCode == 800010 || e.errorCode == 80001) {
                callback.onFailed(RXErrorCode.PAY_CANCEL.toJSONObject(e.errorCode, e.message));
            } else
                callback.onFailed(RXErrorCode.PAY_ERROR.toJSONObject(e.getErrorCode(), e.getMessage()));
        });
    }

//    private String mContinueTokenRecord;
//
//    /**
//     * 查看用户历史购买记录
//     */
//    private void obtainOwnedPurchaseRecord() {
//        // 查看用户历史购买记录
//        OwnedPurchasesReq ownedPurchasesReq = new OwnedPurchasesReq();
//        //传入上一次查询得到的continueToken，获取新的数据，第一次传空
//        ownedPurchasesReq.setContinuationToken(mContinueTokenRecord);
//        GCJointSdk.obtainOwnedPurchaseRecord(ownedPurchasesReq).addOnSuccessListener(ownedPurchasesResult -> {
//            //获取到结果后需要进行签名校验
//            //ContinueToken用于获取下一个列表的数据，第一次为空，如果有更多数据ContinueToken有值，为空则没有更多数据
//            mContinueTokenRecord = ownedPurchasesResult.getContinueToken();
//
//            List<String> sigList = ownedPurchasesResult.getSigList();
//            List<String> purchaseList = ownedPurchasesResult.getPurchaseList();
//            for (int i = 0; i < purchaseList.size(); i++) {
//                String PurchaseProductInfoStr = purchaseList.get(i);
////                boolean verify = RSAUtil.verify(PurchaseProductInfoStr, publicKey, sigList.get(i));
////                Log.d(TAG, " PurchaseProductInfoStr verify " + verify + "  , " + PurchaseProductInfoStr);
//
////                payNotify();
//            }
//
////            dealPurchasesResult(ownedPurchasesResult);
////            mResultView.setText(ownedPurchasesResult.toString());
//        }).addOnFailureListener(e -> {
//            // e.errorCode 对应 OrderStatusCode的值
////            mResultView.setText(String.format("obtainOwnedPurchaseRecord %d %s", e.errorCode, e.message));
//        });
//    }


    // 支付成功
    private void payNotify(Map<String, Object> hashMap, PurchaseProductInfo purchaseProductInfo, RXJSONCallback callback) {
        try {
            String payload = purchaseProductInfo.getDeveloperPayload();
            HonorOrderData orderData = HonorOrderData.fromDeveloperPayload(payload);
            String url = !TextUtils.isEmpty(orderData.getNotifyUrl()) ? orderData.getNotifyUrl() : mNotifyUrl;
            if (TextUtils.isEmpty(url)) {
                String msg = "支付失败，未知发货地址，请联系客服。" + orderData.getOrderNo();
                if (callback != null) {
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), msg));
                }
                RXLogger.e("rx payload:" + payload);
            } else {
                sendVerifyPaymentReq(purchaseProductInfo, url, hashMap, 0, callback);
            }
            Map<String, Object> objectMap = new HashMap<>();
            objectMap.put("order", orderData.toJson());
            RXApiHelper.Data.track("#rxsdk_notify", null, objectMap, -1, -1);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> objectMap = new HashMap<>();
            objectMap.put("state", "error");
            objectMap.put("msg", e.getMessage());
            RXApiHelper.Data.track("#rxsdk_notify", null, objectMap, -1, -1);
            if (callback != null) {
                callback.onError(new RXException(e));
            }
        }
    }


    private void sendVerifyPaymentReq(PurchaseProductInfo inAppPurchaseData, String url, Map<String, Object> hashMap, int retryCount, RXJSONCallback callback) {
        long delay = getDelay(retryCount) * 5000L;
        RXLogger.i("notify pay retry count:" + retryCount + ",delay:" + delay);
        hashMap.put("eventType", "client.callback");
        RXRequest.create(url).setBody(hashMap).postAsyncDelay(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                RXLogger.e("honor rx pay success");
                callback.onSuccess(data);
//                consumeOwnedPurchase(inAppPurchaseData.getPurchaseToken(), callback);
//                Map<String, Object> objectMap = new HashMap<>(hashMap);
//                objectMap.put("state", "success");
//                objectMap.put("order", data);
//                RXApiHelper.Data.track("#rxsdk_payresult", null, objectMap, -1, -1);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                int errorCode = cause.optInt("code");
                if (errorCode == 302408 || errorCode == 302409 || errorCode == 302414) {  // 重复使用凭证， 直接消耗商品
                    RXLogger.e("rx consumeOwnedPurchase 强制消费错误数据:" + cause);
                    RXLogger.e("rx consumeOwnedPurchase :" + inAppPurchaseData);
                    consumeOwnedPurchase(inAppPurchaseData.getPurchaseToken(), callback);
                    if (callback != null) {
                        callback.onFailed(cause);
//                        callback = null;
                    }
                    Map<String, Object> objectMap = new HashMap<>(hashMap);
                    objectMap.put("state", "failed");
                    objectMap.put("msg", cause.toString());
                    RXApiHelper.Data.track("#rxsdk_payresult", null, objectMap, -1, -1);
                } else if (errorCode != 302424 && retryCount < 4) {
                    sendVerifyPaymentReq(inAppPurchaseData, url, hashMap, retryCount + 1, callback);
                } else {
                    if (callback != null) {
                        callback.onFailed(cause);
//                        callback = null;
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
                    sendVerifyPaymentReq(inAppPurchaseData, url, hashMap, retryCount + 1, callback);
                } else {
                    if (callback != null) {
                        callback.onError(e);
//                        callback = null;
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

    /**
     * 交易成功，通知华为消费商品
     * @param purchaseToken 购买凭证信息
     */
    public void consumeOwnedPurchase(String purchaseToken, RXJSONCallback callback) {
        //支付成功后默认消耗，用户也可以根据实际情况消耗
        ConsumeReq comsumeReq = new ConsumeReq();
        //根据PurchaseToken 进行消耗
        comsumeReq.setPurchaseToken(purchaseToken);

        Task<ConsumeResult> consumeRespTask = GCJointSdk.consumeProduct(comsumeReq);
        consumeRespTask.addOnSuccessListener(consumeResult -> {
            PurchaseProductInfo purchase = new Gson().fromJson(consumeResult.getConsumeData(), PurchaseProductInfo.class);
//            Log.i(TAG, "consumeProduct addOnSuccessListener:purchase is empty:" + (purchase == null));
            if (purchase == null) {
                //消耗失败
                RXLogger.e("consumeProduct:  failed  purchase is null");
                if (callback != null)
                    callback.onFailed(RXErrorCode.HQ_DATA_ERROR.toJSONObject());
            } else {
                //消耗成功
                RXLogger.e("consumeProduct: success" + consumeResult.getConsumeData());
                if (callback != null)
                    callback.onSuccess(null);
            }

        }).addOnFailureListener(e -> {
            //消耗失败
//            Log.e(TAG, "consumeProduct addOnFailureListener:ErrorCode:" + e.getErrorCode() + " message:" + e.getMessage());
            RXLogger.e("consumeProduct failed: " + e.getErrorCode() + ": " + e.getMessage());
        });

//        try {
//            // 构造ConsumeOwnedPurchaseReq对象
//            ConsumeOwnedPurchaseReq req = new ConsumeOwnedPurchaseReq();
//            // purchaseToken需从购买信息InAppPurchaseData中获取
//            InAppPurchaseData inAppPurchaseDataBean = new InAppPurchaseData(inAppPurchaseData);
//            String purchaseToken = inAppPurchaseDataBean.getPurchaseToken();
//
//            req.setPurchaseToken(purchaseToken);
//            // 消耗型商品发货成功后，需调用consumeOwnedPurchase接口进行消耗
//            Task<ConsumeOwnedPurchaseResult> task = Iap.getIapClient(activity).consumeOwnedPurchase(req);
//            task.addOnSuccessListener(new OnSuccessListener<ConsumeOwnedPurchaseResult>() {
//                @Override
//                public void onSuccess(ConsumeOwnedPurchaseResult result) {
//                    // 获取接口请求结果
//                    RXLogger.i("consumeOwnedPurchase resultCode=" + result.getReturnCode());
//                    if (mPayCallback != null) {
//                        mPayCallback.onSuccess(JSONUtil.toJSONObject(0, ""));
//                    }
//                    Map<String, Object> objectMap = new HashMap<>();
//                    objectMap.put("order", inAppPurchaseData);
//                    objectMap.put("state", "success");
//                    RXApiHelper.Data.track("#rxsdk_removeTransactionObserver", null, objectMap, -1, -1);
//                }
//            }).addOnFailureListener(onPayFailedCallback);


//        } catch (JSONException e) {
//            e.printStackTrace();
//            if (mPayCallback != null) {
//                mPayCallback.onError(new RXException(e));
//            }
//            Map<String, Object> objectMap = new HashMap<>();
//            objectMap.put("state", "error");
//            objectMap.put("msg", e.getMessage());
//            RXApiHelper.Data.track("#rxsdk_payresult", null, objectMap, -1, -1);
//        }
    }
}
