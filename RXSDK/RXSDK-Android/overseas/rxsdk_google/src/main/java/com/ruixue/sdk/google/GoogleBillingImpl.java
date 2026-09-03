package com.ruixue.sdk.google;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.AcknowledgePurchaseResponseListener;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ConsumeParams;
import com.android.billingclient.api.ConsumeResponseListener;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.ProductDetailsResponseListener;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesResponseListener;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryProductDetailsResult;
import com.android.billingclient.api.QueryPurchasesParams;
import com.google.gson.Gson;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.billing.HQParams;
import com.ruixue.callback.RXStringCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RXRequest;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Google Play 内购实现（Billing Library 5+ / 当前工程 {@code billing:8.0.0}，
 * {@link ProductDetails} + {@link QueryProductDetailsParams}）。
 * <p>
 * {@link GoogleSdkWrapper} 默认使用本类。订阅需带 {@code offerToken}；价位来自
 * {@link ProductDetails.SubscriptionOfferDetails} 或
 * {@link ProductDetails.OneTimePurchaseOfferDetails}。
 * <p>
 * 一次性商品验证成功后 consume；订阅验证成功后 acknowledge。非订阅若响应 {@code consumed:true} 则不再本地
 * consume。
 */
public class GoogleBillingImpl extends com.ruixue.billing.BillingClient implements PurchasesUpdatedListener {

    private BillingClient mBillingClient;
    private GoogleOrderData mOrder;
    private RXJSONCallback mCallback;

    /** 当前会话是否为订阅订单，来自 {@link GoogleOrderData#isSubscribe()} */
    private boolean mSessionIsSubscribe;
    /** 拉起支付前查询到的 Play 侧商品详情，用于校验请求 price/currency */
    @Nullable
    private ProductDetails mPendingProductDetails;
    /** 订阅使用的 offerToken，与校验时选价一致 */
    @Nullable
    private String mPendingOfferToken;

    private final AtomicBoolean mIsServiceConnected = new AtomicBoolean(false);
    private int callFrom = HQParams.CALLBACK_FROM_CLIENT;

    static final String GOOGLE = GoogleBillingHelper.HQ_TYPE_GOOGLE;

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!isPaying()) {
            if (hashMap != null) {
                if (!hashMap.containsKey(KEY_HQ_TYPE)) {
                    hashMap.put(KEY_HQ_TYPE, GOOGLE);
                }
                if (!hashMap.containsKey("callback_from")) {
                    hashMap.put("callback_from", HQParams.CALLBACK_FROM_CLIENT);
                }
                callFrom = ObjectUtils.toInt(hashMap.get("callback_from"), callFrom);
            }
            init(activity, new GoogleBillingHelper.OnBillingConnectionCallback() {
                @Override
                public void onSuccess() {
                    GoogleBillingImpl.super.pay(activity, hashMap, callback);
                }

                @Override
                public void onFailed(int code, String msg) {
                    ThreadUtils.getInstance().runOnUiThread(() -> callback.onFailed(RXErrorCode.THIRD_INIT_ERROR.toJSONObject(code, msg)));
                }
            });
        } else if (callback != null) {
            setPaying(false);
            callback.onFailed(
                    JSONUtil.toJSONObject(RXErrorCode.ORDER_REPEAT_ERROR.getValue(), "Google iap is in the pay"));
        }
    }

    /**
     * 下单成功：按 {@link GoogleOrderData#isSubscribe()} 查
     * {@link BillingClient.ProductType#SUBS} 或
     * {@link BillingClient.ProductType#INAPP}；
     * 订阅使用首个 {@link ProductDetails.SubscriptionOfferDetails} 的 {@code offerToken}
     * 发起支付。
     */
    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data,
            RXJSONCallback callback) {
        mOrder = GoogleOrderData.fromJson(data);
        mPendingProductDetails = null;
        mPendingOfferToken = null;
        if (mOrder != null && mOrder.getExt() != null) {
            boolean hasOrderTypeHint = mOrder.hasServerOrderType();
            if (!hasOrderTypeHint && hashMap != null) {
                Object reqOrderType = hashMap.get("order_type");
                if (reqOrderType instanceof String) {
                    String reqOrderTypeValue = ((String) reqOrderType).trim();
                    if (!TextUtils.isEmpty(reqOrderTypeValue)) {
                        mOrder.setOrderType(reqOrderTypeValue);
                        hasOrderTypeHint = true;
                    }
                }
            }
            String productId = mOrder.getExt().getThird_tag();
            if (TextUtils.isEmpty(productId)) {
                callback.onFailed(
                        JSONUtil.toJSONObject(RXErrorCode.ORDER_PARAMS_ERROR.getValue(), "Error third_tag is null."));
                return;
            }
            mSessionIsSubscribe = mOrder.isSubscribe();
            final String productType = mSessionIsSubscribe ? BillingClient.ProductType.SUBS
                    : BillingClient.ProductType.INAPP;
            queryProductDetailsAndLaunchBillingFlow(
                    activity,
                    hashMap,
                    productId,
                    productType,
                    !hasOrderTypeHint,
                    callback);
        } else {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR));
        }
    }

    private void queryProductDetailsAndLaunchBillingFlow(Activity activity, Map<String, Object> hashMap,
            String productId, String productType, boolean allowTypeFallback, RXJSONCallback callback) {
        queryProductDetailsAsync(productId, productType, new OnQueryProductDetailsCallback<ProductDetails>() {
            @Override
            public void onSuccess(ProductDetails details) {
                mPendingProductDetails = details;
                BillingFlowParams.Builder flowBuilder = BillingFlowParams.newBuilder();
                if (!TextUtils.isEmpty(mOrder.getOrderNo())) {
                    flowBuilder.setObfuscatedAccountId(mOrder.getOrderNo());
                }
                if (hashMap != null && hashMap.get("openid") != null) {
                    flowBuilder.setObfuscatedProfileId(String.valueOf(hashMap.get("openid")));
                }
                List<BillingFlowParams.ProductDetailsParams> productDetailsParamsList;
                if (BillingClient.ProductType.SUBS.equals(productType)) {
                    List<ProductDetails.SubscriptionOfferDetails> offers = details.getSubscriptionOfferDetails();
                    if (offers == null || offers.isEmpty()) {
                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.ORDER_PARAMS_ERROR.getValue(),
                                "No subscription offer for product."));
                        return;
                    }
                    ProductDetails.SubscriptionOfferDetails offer = offers.get(0);
                    mPendingOfferToken = offer.getOfferToken();
                    productDetailsParamsList = Collections.singletonList(
                            BillingFlowParams.ProductDetailsParams.newBuilder()
                                    .setProductDetails(details)
                                    .setOfferToken(offer.getOfferToken())
                                    .build());
                } else {
                    mPendingOfferToken = null;
                    productDetailsParamsList = Collections.singletonList(
                            BillingFlowParams.ProductDetailsParams.newBuilder()
                                    .setProductDetails(details)
                                    .build());
                }
                flowBuilder.setProductDetailsParamsList(productDetailsParamsList);
                BillingFlowParams purchaseParams = flowBuilder.build();
                BillingResult billingResult = mBillingClient.launchBillingFlow(activity, purchaseParams);
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    setPaying(true);
                    mCallback = GoogleBillingHelper.wrapPayCallback(
                            () -> setPaying(false), callback);
                } else {
                    RXLogger.e("launchBillingFlow failed code: " + billingResult.getResponseCode() + " ,msg:"
                            + billingResult.getDebugMessage());
                    callback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(
                            billingResult.getResponseCode(),
                            GoogleBillingHelper.resolveMsg(billingResult.getResponseCode(), billingResult.getDebugMessage())));
                }
            }

            @Override
            public void onFailed(int respCode, String errMsg) {
                if (allowTypeFallback
                        && BillingClient.ProductType.INAPP.equals(productType)
                        && respCode == GoogleBillingHelper.SKU_NOT_FOUND_CODE) {
                    RXLogger.i("order_type missing, retry Google product query as SUBS, productId=" + productId);
                    mSessionIsSubscribe = true;
                    if (mOrder != null) {
                        mOrder.setOrderType("subscribe");
                    }
                    queryProductDetailsAndLaunchBillingFlow(
                            activity,
                            hashMap,
                            productId,
                            BillingClient.ProductType.SUBS,
                            false,
                            callback);
                    return;
                }
                callback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(respCode, errMsg));
            }
        });
    }

    @Override
    public void onPurchasesUpdated(@NonNull BillingResult billingResult, @Nullable List<Purchase> purchases) {
        int code = billingResult.getResponseCode();
        RXLogger.i("onPurchasesUpdated.getResponseCode:" + code);

        if (code == BillingClient.BillingResponseCode.OK && purchases != null) {
            if (callFrom == HQParams.CALLBACK_FROM_CLIENT) {
                for (Purchase purchase : purchases) {
                    verifyPayment(purchase, mCallback, false);
                }
            } else if (mCallback != null) {
                mCallback.onSuccess(null);
            }
        } else if (code == BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED) {
            queryPurchasesAsync(mCallback);
        } else if (mCallback != null) {
            if (GoogleBillingHelper.isUserCanceled(code)) {
                mCallback.onFailed(RXErrorCode.PAY_CANCEL.toJSONObject(code,
                        GoogleBillingHelper.resolveMsg(code, billingResult.getDebugMessage())));
            } else {
                mCallback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(code,
                        GoogleBillingHelper.resolveMsg(code, billingResult.getDebugMessage())));
            }
        }
    }

    /**
     * 与Google Play建立连接
     */
    public void init(Context context, @Nullable GoogleBillingHelper.OnBillingConnectionCallback callback) {
        if (mBillingClient == null) {
            PendingPurchasesParams pendingPurchasesParams = PendingPurchasesParams.newBuilder()
                    .enableOneTimeProducts()
                    .build();
            mBillingClient = BillingClient.newBuilder(context)
                    .enablePendingPurchases(pendingPurchasesParams)
                    .setListener(this)
                    .build();
        }
        if (!mIsServiceConnected.get()) {
            mBillingClient.startConnection(new BillingClientStateListener() {
                @Override
                public void onBillingServiceDisconnected() {
                    mIsServiceConnected.set(false);
                    if (callback != null) {
                        callback.onFailed(-1, "Billing service disconnected");
                    }
                    // Try to restart the connection on the next request to
                    // Google Play by calling the startConnection() method.
                    // 建议断开时重连或在使用时判断连接状态，没有连接就手动再调一次 startConnection，确保在执行任何方法时都与 BillingClient
                    // 保持连接。
                    RXLogger.i("Billing service disconnected");
                }

                @Override
                public void onBillingSetupFinished(@NonNull BillingResult billingResult) {
                    // 成功最好去查询订单，做掉单处理
                    if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                        mIsServiceConnected.set(true);
                        try {
                            queryPurchasesAsync(mCallback);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                        if (callback != null) {
                            callback.onSuccess();
                        }
                        RXLogger.i("Google Play In-app Billing client successfully set up.");
                    } else {
                        mIsServiceConnected.set(false);
                        if (billingResult.getResponseCode() < 0) {
                            mBillingClient = null;
                        }
                        if (callback != null) {
                            callback.onFailed(billingResult.getResponseCode(), billingResult.getDebugMessage());
                        }
                        RXLogger.e("Billing client connect failed errCode=" + billingResult.getResponseCode()
                                + ",errMsg=" + billingResult.getDebugMessage());
                    }
                }
            });
        } else if (callback != null) {
            callback.onSuccess();
        }
    }

    private boolean checkReady() {
        return checkReady(null);
    }

    private boolean checkReady(@Nullable GoogleBillingHelper.OnBillingConnectionCallback callback) {
        if (mBillingClient != null && mBillingClient.isReady() && mIsServiceConnected.get()) {
            return true;
        } else {
            init(RuiXueSdk.getContext(), callback);
            return false;
        }
    }

    @Deprecated
    public void querySkuDetailsAsync(@NonNull List<String> skusList, @NonNull RXStringCallback callback) {
        queryProductDetailsAsync(skusList, callback);
    }

    public void queryProductDetailsAsync(@NonNull List<String> skusList, @NonNull RXStringCallback callback) {
        try {
            if (checkReady(new GoogleBillingHelper.OnBillingConnectionCallback() {
                @Override
                public void onSuccess() {
                    queryProductDetailsAsync(skusList, callback);
                }

                @Override
                public void onFailed(int code, String msg) {
                    callback.onFailed(code, msg, "");
                }
            })) {
                queryProductDetailsAsync(skusList, BillingClient.ProductType.INAPP, (billingResult, result) -> {
                    List<ProductDetails> productDetailsList = unwrapProductDetails(result);
                    if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK
                            && productDetailsList != null) {
                        JSONArray jsonArray = new JSONArray();
                        try {
                            for (ProductDetails productDetails : productDetailsList) {
                                jsonArray.put(toProductInfoJson(productDetails));
                            }
                        } catch (JSONException e) {
                            RXLogger.e("Google product details conversion failed: " + e.getMessage());
                            callback.onFailed(-5, e.getMessage(), "");
                            return;
                        }
                        callback.onSuccess(jsonArray.toString());
                    } else {
                        callback.onFailed(billingResult.getResponseCode(), billingResult.getDebugMessage(), "");
                    }
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
            callback.onFailed(-5, e.getMessage(), "");
        }
    }

    public void queryProductDetailsAsync(@NonNull String productId,
            @NonNull OnQueryProductDetailsCallback<ProductDetails> callback) {
        queryProductDetailsAsync(productId, BillingClient.ProductType.INAPP, callback);
    }

    public void queryProductDetailsAsync(@NonNull String productId, @NonNull String productType,
            @NonNull OnQueryProductDetailsCallback<ProductDetails> callback) {
        try {
            queryProductDetailsAsync(Collections.singletonList(productId), productType,
                    (billingResult, result) -> {
                        List<ProductDetails> productDetailsList = unwrapProductDetails(result);
                        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK
                                && productDetailsList != null) {
                            RXLogger.i("queryProductDetailsAsync:" + productDetailsList);
                            for (ProductDetails skuDetails : productDetailsList) {
                                if (productId.equals(skuDetails.getProductId())) {
                                    callback.onSuccess(skuDetails);
                                    return;
                                }
                            }
                            callback.onFailed(-4, "No sku details is found。");
                        } else {
                            callback.onFailed(billingResult.getResponseCode(), billingResult.getDebugMessage());
                        }
                    });
        } catch (Exception e) {
            e.printStackTrace();
            callback.onFailed(-5, e.getMessage());
        }
    }

    /** 展示可供购买的商品（默认一次性商品） */
    public void queryProductDetailsAsync(List<String> skusList, @NonNull ProductDetailsResponseListener callback)
            throws Exception {
        queryProductDetailsAsync(skusList, BillingClient.ProductType.INAPP, callback);
    }

    /**
     * @param productType {@link BillingClient.ProductType#INAPP} 或
     *                    {@link BillingClient.ProductType#SUBS}
     */
    public void queryProductDetailsAsync(List<String> skusList, @NonNull String productType,
            @NonNull ProductDetailsResponseListener callback) throws Exception {
        if (!checkReady()) {
            throw new Exception("Google Play In-app billing client service isn't ready.");
        }
        List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
        for (String productId : skusList) {
            productList.add(QueryProductDetailsParams.Product.newBuilder()
                    .setProductId(productId)
                    .setProductType(productType)
                    .build());
        }
        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                .setProductList(productList)
                .build();
        mBillingClient.queryProductDetailsAsync(params, callback);
    }

    @Nullable
    private static List<ProductDetails> unwrapProductDetails(@Nullable QueryProductDetailsResult result) {
        return result == null ? null : result.getProductDetailsList();
    }

    /**
     * 将 Billing 8 的公开商品模型转换为旧 {@code SkuDetails#getOriginalJson()} 常用字段，
     * 避免依赖 ProductDetails 的私有混淆字段。
     */
    @NonNull
    private static JSONObject toProductInfoJson(@NonNull ProductDetails details) throws JSONException {
        JSONObject json = new JSONObject();
        json.put("productId", details.getProductId());
        json.put("type", details.getProductType());
        json.put("title", details.getTitle());
        json.put("name", details.getName());
        json.put("description", details.getDescription());

        ProductDetails.OneTimePurchaseOfferDetails offer = null;
        List<ProductDetails.OneTimePurchaseOfferDetails> offers =
                details.getOneTimePurchaseOfferDetailsList();
        if (offers != null && !offers.isEmpty()) {
            offer = offers.get(0);
        }
        if (offer == null) {
            // 无多购买选项时，保留旧 API 的向后兼容报价读取方式。
            offer = details.getOneTimePurchaseOfferDetails();
        }
        if (offer != null) {
            json.put("price", offer.getFormattedPrice());
            json.put("price_amount_micros", offer.getPriceAmountMicros());
            json.put("price_currency_code", offer.getPriceCurrencyCode());
        }
        return json;
    }

    public boolean isFeatureSupported() {
        BillingResult billingResult = mBillingClient.isFeatureSupported(BillingClient.FeatureType.PRODUCT_DETAILS);
        return billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK;
    }

    /**
     * 消耗商品
     */
    private void consumeAsync(@NonNull Purchase purchase, @Nullable RXJSONCallback callback) {
        if (checkReady()) {

            // if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
            // if (!purchase.isAcknowledged()) { //检查该购买交易是否已经过确认
            // //确认非消耗型商品
            // AcknowledgePurchaseParams acknowledgePurchaseParams =
            // AcknowledgePurchaseParams.newBuilder()
            // .setPurchaseToken(purchase.getPurchaseToken())
            // .build();
            // mBillingClient.acknowledgePurchase(acknowledgePurchaseParams, new
            // AcknowledgePurchaseResponseListener() {
            // @Override
            // public void onAcknowledgePurchaseResponse(@NonNull BillingResult
            // billingResult) {
            //
            // }
            // });
            // }
            // }

            ConsumeParams consumeParams = ConsumeParams.newBuilder().setPurchaseToken(purchase.getPurchaseToken())
                    .build();
            mBillingClient.consumeAsync(consumeParams, new ConsumeResponseListener() {
                @Override
                public void onConsumeResponse(@NonNull BillingResult billingResult, @NonNull String purchaseToken) {
                    if (callback != null) {
                        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                            // Handle the success of the consume operation.
                            callback.onSuccess(null);
                            mIapRxOrderMapCache.remove(purchase.getOrderId());
                        } else {
                            callback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(
                                    billingResult.getResponseCode(), GoogleBillingHelper.resolveMsg(billingResult.getResponseCode(),
                                            billingResult.getDebugMessage())));
                        }
                    }
                }
            });
        } else if (callback != null) {
            callback.onFailed(
                    JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "rx google iap is not ready"));
        }
    }

    private String mNotifyUrl;
    private final Map<String, String> mIapRxOrderMapCache = new HashMap<>();

    /**
     * 提交服务端校验。订阅带 {@code original=1} 及价位；成功后订阅 acknowledge、一次性 consume（或响应已
     * consumed 则跳过 consume）。
     *
     * @param fromSubscriptionInventory SUBS 库存补单时为 true
     */
    private void verifyPayment(@NonNull Purchase purchase, @Nullable RXJSONCallback callback,
            boolean fromSubscriptionInventory) {
        boolean isSubscribe = fromSubscriptionInventory || mSessionIsSubscribe
                || (mOrder != null && mOrder.isSubscribe());
        RXLogger.i("verifyPayment Google purchase, subscribe=" + isSubscribe + " : " + purchase);

        String rxOrderNo = mIapRxOrderMapCache.get(purchase.getOrderId());
        if (purchase.getAccountIdentifiers() != null
                && !TextUtils.isEmpty(purchase.getAccountIdentifiers().getObfuscatedAccountId())) {
            rxOrderNo = purchase.getAccountIdentifiers().getObfuscatedAccountId();
        }
        if (TextUtils.isEmpty(rxOrderNo) && mOrder != null) {
            rxOrderNo = mOrder.getOrderNo();
        }
        if (!TextUtils.isEmpty(rxOrderNo)) {
            Map<String, Object> hashMap = new HashMap<>();
            hashMap.put("purchasetoken", purchase.getPurchaseToken());
            hashMap.put("developerpayload", purchase.getDeveloperPayload());
            hashMap.put("originaljson", purchase.getOriginalJson());
            hashMap.put("signature", purchase.getSignature());
            hashMap.put("order_no", rxOrderNo);
            appendVerifyPricingParams(hashMap, isSubscribe, mPendingProductDetails, mPendingOfferToken);

            String url = (mOrder == null || TextUtils.isEmpty(mOrder.getNotifyUrl())) ? mNotifyUrl
                    : mOrder.getNotifyUrl();
            mNotifyUrl = url;

            int purchaseState = purchase.getPurchaseState();
            if (!TextUtils.isEmpty(url) && purchaseState == Purchase.PurchaseState.PURCHASED) {
                sendVerifyPaymentReq(purchase, callback, hashMap, url, 1, isSubscribe);
            } else {
                Map<String, Object> retMap = new HashMap<>();
                retMap.put("purchaseState", purchaseState);
                retMap.put("data", hashMap);
                if (mOrder != null) {
                    mIapRxOrderMapCache.put(purchase.getOrderId(), mOrder.getOrderNo());
                }
                String msg = TextUtils.isEmpty(url) ? "notify url is null error."
                        : "Purchase state not purchased,please wait. state:" + purchaseState;
                if (callback != null) {
                    callback.onFailed(JSONUtil.toJSONObject(retMap, RXErrorCode.HQ_DATA_ERROR.getValue(), msg,
                            purchase.getOrderId()));
                }
            }
        } else if (callback != null) {
            callback.onError(new RXException(RXErrorCode.HQ_DATA_ERROR.getValue(),
                    new Exception("No rx Order found，Please try again")));
        }
    }

    /**
     * 订阅：{@code original=1}；价位取所选 offer 的计费阶段（优先低于常规价的付费阶段作介绍价）。非订阅：一次性报价
     * {@code getOneTimePurchaseOfferDetails()}。
     */
    private static void appendVerifyPricingParams(@NonNull Map<String, Object> hashMap, boolean isSubscribe,
            @Nullable ProductDetails details, @Nullable String offerToken) {
        if (isSubscribe) {
            hashMap.put("original", "1");
        }
        if (details == null) {
            return;
        }
        if (isSubscribe) {
            ProductDetails.SubscriptionOfferDetails offer = findSubscriptionOffer(details, offerToken);
            if (offer == null) {
                return;
            }
            List<ProductDetails.PricingPhase> phases = offer.getPricingPhases() != null
                    ? offer.getPricingPhases().getPricingPhaseList()
                    : Collections.emptyList();
            if (phases.isEmpty()) {
                return;
            }
            ProductDetails.PricingPhase recurring = phases.get(phases.size() - 1);
            ProductDetails.PricingPhase chargePhase = recurring;
            if (phases.size() > 1) {
                for (ProductDetails.PricingPhase p : phases) {
                    if (p.getPriceAmountMicros() > 0 && p.getPriceAmountMicros() < recurring.getPriceAmountMicros()) {
                        chargePhase = p;
                        break;
                    }
                }
            }
            hashMap.put("price", chargePhase.getFormattedPrice());
            hashMap.put("currency", chargePhase.getPriceCurrencyCode());
        } else {
            ProductDetails.OneTimePurchaseOfferDetails ot = details.getOneTimePurchaseOfferDetails();
            if (ot != null) {
                hashMap.put("price", ot.getFormattedPrice());
                hashMap.put("currency", ot.getPriceCurrencyCode());
            }
        }
    }

    /** 按 token 匹配订阅方案；未匹配则取列表首项。 */
    @Nullable
    private static ProductDetails.SubscriptionOfferDetails findSubscriptionOffer(@NonNull ProductDetails details,
            @Nullable String offerToken) {
        List<ProductDetails.SubscriptionOfferDetails> offers = details.getSubscriptionOfferDetails();
        if (offers == null || offers.isEmpty()) {
            return null;
        }
        if (!TextUtils.isEmpty(offerToken)) {
            for (ProductDetails.SubscriptionOfferDetails o : offers) {
                if (offerToken.equals(o.getOfferToken())) {
                    return o;
                }
            }
        }
        return offers.get(0);
    }

    /** 带斐波那契间隔重试；特定错误码下强制 consume/acknowledge 以免卡单。 */
    private void sendVerifyPaymentReq(@NonNull Purchase purchase, @Nullable RXJSONCallback callback,
            Map<String, Object> hashMap, String url, int retryCount, boolean isSubscribe) {

        RXRequest.create(url).setBody(hashMap).postAsyncDelay(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (isSubscribe) {
                    acknowledgePurchase(purchase, callback);
                } else if (data != null && data.optBoolean("consumed")) {
                    if (callback != null) {
                        callback.onSuccess(data);
                    }
                } else {
                    consumeAsync(purchase, callback);
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                int code = cause.optInt("code");
                if (code == GoogleBillingHelper.RX_ERR_CODE || code == GoogleBillingHelper.RX_REPEAT_ERR_CODE) {
                    RXLogger.e("iap force finish after verify error :" + new Gson().toJson(purchase));
                    if (isSubscribe) {
                        acknowledgePurchase(purchase, callback);
                    } else {
                        consumeAsync(purchase, callback);
                    }
                    if (callback != null)
                        callback.onFailed(cause);
                } else if (code != GoogleBillingHelper.RX_USED_ERR_CODE && retryCount < 4) {
                    sendVerifyPaymentReq(purchase, callback, hashMap, url, retryCount + 1, isSubscribe);
                } else {
                    if (callback != null) {
                        callback.onFailed(cause);
                    }
                }
            }

            @Override
            public void onError(RXException e) {
                if (retryCount < 4) {
                    sendVerifyPaymentReq(purchase, callback, hashMap, url, retryCount + 1, isSubscribe);
                } else {
                    if (callback != null) {
                        callback.onError(e);
                    }
                }
            }
        }, getDelay(retryCount) * 5000L);
    }

    private long getDelay(int n) {
        if (n < 1)
            return 0;
        if (n == 1 || n == 2)
            return 1;
        return getDelay(n - 2) + getDelay(n - 1);
    }

    /** 订阅交易 acknowledge；已确认则直接成功回调。 */
    private void acknowledgePurchase(@NonNull Purchase purchase, @Nullable RXJSONCallback callback) {
        if (!checkReady()) {
            if (callback != null) {
                callback.onFailed(
                        JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "rx google iap is not ready"));
            }
            return;
        }
        if (purchase.isAcknowledged()) {
            if (callback != null) {
                callback.onSuccess(null);
            }
            mIapRxOrderMapCache.remove(purchase.getOrderId());
            return;
        }
        AcknowledgePurchaseParams params = AcknowledgePurchaseParams.newBuilder()
                .setPurchaseToken(purchase.getPurchaseToken())
                .build();
        mBillingClient.acknowledgePurchase(params, new AcknowledgePurchaseResponseListener() {
            @Override
            public void onAcknowledgePurchaseResponse(@NonNull BillingResult billingResult) {
                if (callback != null) {
                    if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                        callback.onSuccess(null);
                        mIapRxOrderMapCache.remove(purchase.getOrderId());
                    } else {
                        callback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(
                                billingResult.getResponseCode(),
                                GoogleBillingHelper.resolveMsg(billingResult.getResponseCode(), billingResult.getDebugMessage())));
                    }
                }
            }
        });
    }

    /**
     * 补单：先 INAPP 再 SUBS；订阅仅处理 PURCHASED 且未 acknowledge。
     */
    public void queryPurchasesAsync(@Nullable RXJSONCallback callback) {
        if (!checkReady()) {
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.PAY_ERROR.getValue(),
                        "rx google billing client is not ready"));
            }
            return;
        }
        QueryPurchasesParams inappParams = QueryPurchasesParams.newBuilder()
                .setProductType(BillingClient.ProductType.INAPP)
                .build();
        mBillingClient.queryPurchasesAsync(inappParams, new PurchasesResponseListener() {
            @Override
            public void onQueryPurchasesResponse(@NonNull BillingResult billingResult,
                    @NonNull List<Purchase> purchasesList) {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && purchasesList != null) {
                    for (Purchase purchase : purchasesList) {
                        if (purchase.isAcknowledged()) {
                            consumeAsync(purchase, callback);
                        } else {
                            verifyPayment(purchase, callback, false);
                        }
                    }
                }
                querySubscriptionPurchasesForRestore(callback);
            }
        });
    }

    /** 订阅补单；冷启动无 {@link #mPendingProductDetails} 时校验体可能缺 price/currency。 */
    private void querySubscriptionPurchasesForRestore(@Nullable RXJSONCallback callback) {
        if (!checkReady()) {
            return;
        }
        QueryPurchasesParams subsParams = QueryPurchasesParams.newBuilder()
                .setProductType(BillingClient.ProductType.SUBS)
                .build();
        mBillingClient.queryPurchasesAsync(subsParams, new PurchasesResponseListener() {
            @Override
            public void onQueryPurchasesResponse(@NonNull BillingResult billingResult,
                    @NonNull List<Purchase> purchasesList) {
                if (billingResult.getResponseCode() != BillingClient.BillingResponseCode.OK || purchasesList == null) {
                    return;
                }
                for (Purchase purchase : purchasesList) {
                    if (purchase.getPurchaseState() != Purchase.PurchaseState.PURCHASED) {
                        continue;
                    }
                    if (purchase.isAcknowledged()) {
                        continue;
                    }
                    verifyPayment(purchase, callback, true);
                }
            }
        });
    }

    public void onDestroy() {
        mIsServiceConnected.set(false);
        BillingClient billingClient = mBillingClient;
        mBillingClient = null;
        if (billingClient != null) {
            billingClient.endConnection();
        }
    }

}
