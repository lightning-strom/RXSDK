package com.ruixue.sdk;

import android.app.Activity;
import android.content.Intent;
import android.content.IntentSender;
import android.text.TextUtils;
import android.util.SparseArray;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.huawei.hmf.tasks.OnFailureListener;
import com.huawei.hmf.tasks.OnSuccessListener;
import com.huawei.hmf.tasks.Task;
import com.huawei.hms.iap.Iap;
import com.huawei.hms.iap.IapApiException;
import com.huawei.hms.iap.entity.ConsumeOwnedPurchaseReq;
import com.huawei.hms.iap.entity.ConsumeOwnedPurchaseResult;
import com.huawei.hms.iap.entity.InAppPurchaseData;
import com.huawei.hms.iap.entity.IsEnvReadyResult;
import com.huawei.hms.iap.entity.OrderStatusCode;
import com.huawei.hms.iap.entity.OwnedPurchasesReq;
import com.huawei.hms.iap.entity.OwnedPurchasesResult;
import com.huawei.hms.iap.entity.PurchaseIntentReq;
import com.huawei.hms.iap.entity.PurchaseIntentResult;
import com.huawei.hms.iap.entity.PurchaseResultInfo;
import com.huawei.hms.support.api.client.Status;
import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.billing.HQParams;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RXRequest;
import com.ruixue.openapi.RXApiHelper;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;

public class HmsBillingImpl extends BillingClient {
    //重复消费凭证
    private static final int RX_REPEAT_ERR_CODE = 302408;
    private static final int RX_USED_ERR_CODE = 302424;
    private static final int RX_ERR_CODE = 302409;
    public static final int REQ_PAYMENT_CODE = 6000; //支付
    public static RXJSONCallback mPayCallback;
    //是否在支付中
    public static AtomicBoolean isInThePay = new AtomicBoolean(false);
    public static AtomicBoolean isEnvReady = new AtomicBoolean(false);

    private static String mNotifyUrl;
    /**
     * priceType: 0：消耗型商品; 1：非消耗型商品; 2：订阅型商品
     */
    private int mPriceType = 0;
    private int callFrom = HQParams.CALLBACK_FROM_CLIENT;

    private static final SparseArray<String> OrderStatusCodeMsg = new SparseArray<>();
    public static final String HWJOS = "hwjos";
    /**
     * 订单交易状态。
     */
    private static final SparseArray<String> PurchaseStateMsg = new SparseArray<String>() {
        {
            put(-1, "交易初始化");
            put(0, "交易已购买");
            put(1, "交易已取消");
            put(2, "交易已退款");
            put(3, "交易待处理");
        }
    };

    static {

        OrderStatusCodeMsg.put(OrderStatusCode.ORDER_STATE_FAILED, "通用失败错误码");
        OrderStatusCodeMsg.put(OrderStatusCode.ORDER_STATE_CANCEL, "用户取消支付");
        OrderStatusCodeMsg.put(OrderStatusCode.ORDER_STATE_PARAM_ERROR, "参数错误，包括无参");
        OrderStatusCodeMsg.put(OrderStatusCode.ORDER_STATE_IAP_NOT_ACTIVATED, "应用的支付服务开关未打开");
        OrderStatusCodeMsg.put(OrderStatusCode.ORDER_STATE_PRODUCT_INVALID, "商品信息错误");
        OrderStatusCodeMsg.put(OrderStatusCode.ORDER_STATE_CALLS_FREQUENT, "接口访问过频。");
        OrderStatusCodeMsg.put(OrderStatusCode.ORDER_STATE_NET_ERROR, "网络连接异常。");
        OrderStatusCodeMsg.put(OrderStatusCode.ORDER_STATE_PMS_TYPE_NOT_MATCH, "查询商品类型与PMS定义不符。");
        OrderStatusCodeMsg.put(OrderStatusCode.ORDER_STATE_PRODUCT_COUNTRY_NOT_SUPPORTED, "商品所属的应用未在指定国家上架。");
        OrderStatusCodeMsg.put(OrderStatusCode.ORDER_VR_UNINSTALL_ERROR, "VR APK未安装错误码。");
        OrderStatusCodeMsg.put(OrderStatusCode.ORDER_HWID_NOT_LOGIN, "未登录华为账号。");
        OrderStatusCodeMsg.put(OrderStatusCode.ORDER_PRODUCT_OWNED, "由于已经拥有该商品，购买失败。");
        OrderStatusCodeMsg.put(OrderStatusCode.ORDER_PRODUCT_NOT_OWNED, "由于未拥有该商品，消耗失败。");
        OrderStatusCodeMsg.put(OrderStatusCode.ORDER_PRODUCT_CONSUMED, "商品已经消耗，不能再次消耗。");
        OrderStatusCodeMsg.put(OrderStatusCode.ORDER_ACCOUNT_AREA_NOT_SUPPORTED, "用户账号所在服务地暂不支持IAP。");
        OrderStatusCodeMsg.put(OrderStatusCode.ORDER_NOT_ACCEPT_AGREEMENT, "用户未同意支付协议。");
        OrderStatusCodeMsg.put(OrderStatusCode.ORDER_HIGH_RISK_OPERATIONS, "用户触发风控，交易被拒绝。");
        OrderStatusCodeMsg.put(OrderStatusCode.ORDER_STATE_SUCCESS, "支付成功");
    }

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (hashMap != null) {
            if (!hashMap.containsKey("callback_from")) {
                hashMap.put("callback_from", HQParams.CALLBACK_FROM_CLIENT);
            }
            if (!hashMap.containsKey(KEY_HQ_TYPE)) {
                hashMap.put(KEY_HQ_TYPE, HWJOS);
            }
            callFrom = ObjectUtils.toInt(hashMap.get("callback_from"), callFrom);
        }
        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        HmsOrderData orderData = HmsOrderData.fromJson(data);
        if (orderData != null) {
            mNotifyUrl = orderData.getNotifyUrl();
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
    public boolean isEnvReady(final Activity activity) {
        if (isEnvReady.get()) {
            return isEnvReady.get();
        }
        // 获取调用接口的Activity对象
        Task<IsEnvReadyResult> task = Iap.getIapClient(activity).isEnvReady();
        task.addOnSuccessListener(result -> {
            // 获取接口请求的结果
//            String carrierId = result.getCarrierId();
            RXLogger.i("rx hms pay isEnvReady 支持应用内支付");
            isEnvReady.set(true);
            obtainOwnedPurchases(activity);
        }).addOnFailureListener(e -> {
            isEnvReady.set(false);
            if (e instanceof IapApiException) {
                IapApiException apiException = (IapApiException) e;
                Status status = apiException.getStatus();
                if (status.getStatusCode() == OrderStatusCode.ORDER_HWID_NOT_LOGIN) {
                    // 未登录帐号
                    RXLogger.e("rx hms isEnvReady status:" + status);
                    if (status.hasResolution()) {
                        try {
                            // 启动IAP返回的登录页面
                            RXLogger.e("rx hms  isSupportPay-启动IAP返回的登录页面---");
                            status.startResolutionForResult(activity, REQ_PAYMENT_CODE);
                        } catch (IntentSender.SendIntentException exp) {
                            exp.printStackTrace();
                        }
                    }
                } else if (status.getStatusCode() == OrderStatusCode.ORDER_ACCOUNT_AREA_NOT_SUPPORTED) {
                    // 用户当前登录的华为帐号所在的服务地不在华为IAP支持结算的国家或地区中
                    RXLogger.e("rx hms isEnvReady不在华为IAP支持结算的国家或地区中---statusCode: " + status.getStatusCode());
                }
            }
        });
        return isEnvReady.get();
    }

    /**
     * 发起购买
     */
    public void createPurchaseIntent(Activity activity, HmsOrderData orderData, RXJSONCallback callback) {
        // 通过createPurchaseIntent接口购买的商品必须是您在AppGallery Connect网站配置的商品。
        String hwProductId = orderData.getExt().getHw_tag();
        if (TextUtils.isEmpty(hwProductId)) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "huawei product id is null error."));
            return;
        }
        // 构造一个PurchaseIntentReq对象
        PurchaseIntentReq req = new PurchaseIntentReq();
        req.setProductId(hwProductId);
        mPriceType = orderData.getPriceType();
        req.setPriceType(mPriceType);
        //设置商户侧保留信息
        req.setDeveloperPayload(orderData.toDeveloperPayload());
        // 调用createPurchaseIntent接口创建托管商品订单
        Task<PurchaseIntentResult> task = Iap.getIapClient(activity).createPurchaseIntent(req);
        mPayCallback = callback;
        task.addOnSuccessListener(new OnSuccessListener<PurchaseIntentResult>() {
            @Override
            public void onSuccess(PurchaseIntentResult result) {
                // 获取创建订单的结果
                Status status = result.getStatus();
                if (status.hasResolution()) {
                    try {
                        // 启动IAP返回的收银台页面
                        RXLogger.e("rx hms buyProduct 启动IAP返回的收银台页面 result=" + result.toString());
                        status.startResolutionForResult(activity, REQ_PAYMENT_CODE);
                    } catch (IntentSender.SendIntentException exp) {
                        callback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(status.getStatusCode(), exp.getMessage()));
                    }
                }
            }
        }).addOnFailureListener(onPayFailedCallback);
    }

    /**
     * 处理购买结果
     */
    public void handlePurchaseResult(Activity activity, Intent data) {
        if (data == null) {
            RXLogger.e("rx pay handlePurchaseResult data is null");
            if (mPayCallback != null) {
                mPayCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "未知购买结果，请重试。"));
            }
            return;
        }
        // 调用parsePurchaseResultInfoFromIntent方法解析支付结果数据
        PurchaseResultInfo purchaseResultInfo = Iap.getIapClient(activity).parsePurchaseResultInfoFromIntent(data);
        if (OrderStatusCode.ORDER_STATE_SUCCESS == purchaseResultInfo.getReturnCode()) {
            if (callFrom == HQParams.CALLBACK_FROM_CLIENT) {
                String inAppPurchaseData = purchaseResultInfo.getInAppPurchaseData();
                payNotify(activity, inAppPurchaseData, purchaseResultInfo.getInAppDataSignature());
            } else {
                if (mPayCallback != null) {
                    mPayCallback.onSuccess(null);
                }
            }
        } else if (purchaseResultInfo.getReturnCode() == OrderStatusCode.ORDER_PRODUCT_OWNED || purchaseResultInfo.getReturnCode() == OrderStatusCode.ORDER_STATE_FAILED) {
            obtainOwnedPurchases(activity);
        } else {
            String msg = OrderStatusCodeMsg.get(purchaseResultInfo.getReturnCode(), "未知错误");
            RXLogger.e(msg + " default_code=" + purchaseResultInfo.getReturnCode());
            if (mPayCallback != null) {
                if (purchaseResultInfo.getReturnCode() == OrderStatusCode.ORDER_STATE_CANCEL) {
                    mPayCallback.onFailed(RXErrorCode.PAY_CANCEL.toJSONObject(purchaseResultInfo.getReturnCode(), msg));
                } else {
                    mPayCallback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(purchaseResultInfo.getReturnCode(), msg));
                }
            }
        }
    }

    /**
     * https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides-V5/redelivering-consumables-0000001051356573-V5
     * （必选）消耗型商品的补单流程
     * 在用户完成消耗型商品的支付之后，若出现异常（网络错误、进程被中止等）将导致应用无法知道用户实际是否支付成功，即出现掉单情况。华为应用内支付针对此场景，提供了消耗型商品的补单机制。您的应用可参考以下流程图进行处理：
     * 你需要在以下场景触发补单机制：
     * 应用启动时。
     * 购买请求返回-1（OrderStatusCode. ORDER_STATE_FAILED）时。
     * 购买请求返回60051（OrderStatusCode. ORDER_PRODUCT_OWNED）时。
     * 开发步骤如下：
     * 使用obtainOwnedPurchases获取用户已购未发货的消耗型商品的购买信息。您的应用需要在请求参数OwnedPurchasesReq中指定查询的priceType为0。
     * 当接口请求成功时，IAP将返回一个OwnedPurchasesResult对象，该对象包含用户所有已购但未发货的商品购买信息及其签名数据，您需要使用在华为AppGallery Connect分配的公钥进行签名验证，验证方法请参见对返回结果验签。
     * 每个购买信息均以JSON格式的String形式呈现，包含的参数请参见InAppPurchaseData。您需要从InAppPurchaseData的字符串中解析出purchaseState字段，当purchaseState为0时表示此次交易是成功的，您的应用仅需要对这部分商品进行补发货操作。
     * 说明
     * IAP SDK的InAppPurchaseData类可用于解析InAppPurchaseData字符串，您可使用该类构造一个InAppPurchaseData对象并从InAppPurchaseData对象中获取相关信息。
     * 使用consumeOwnedPurchase接口对已发货商品进行消耗。
     * 您需要对obtainOwnedPurchases返回的每个商品数据进行发货确认，确认已发货后使用consumeOwnedPurchase接口消耗所有已发货商品，以此通知华为应用内支付服务器更新商品的发货状态。对于消耗型商品，应用成功执行消耗之后，华为服务器会将相应商品重新设置为可购买状态，用户即可再次购买该商品。
     */

    public void obtainOwnedPurchases(Activity activity) {
        // 构造一个OwnedPurchasesReq对象
        OwnedPurchasesReq ownedPurchasesReq = new OwnedPurchasesReq();
        ownedPurchasesReq.setPriceType(mPriceType);
        // 调用obtainOwnedPurchases接口
        Task<OwnedPurchasesResult> task = Iap.getIapClient(activity).obtainOwnedPurchases(ownedPurchasesReq);
        task.addOnSuccessListener(new OnSuccessListener<OwnedPurchasesResult>() {
            @Override
            public void onSuccess(OwnedPurchasesResult result) {
                // 获取接口请求结果
                if (result != null && result.getInAppPurchaseDataList() != null) {
                    for (int i = 0; i < result.getInAppPurchaseDataList().size(); i++) {
                        String inAppPurchaseData = result.getInAppPurchaseDataList().get(i);
                        String inAppSignature = result.getInAppSignature().get(i);
                        // 您需要使用其应用的IAP公钥验证inAppPurchaseData的签名
                        // 如果验签成功，请检查支付状态
                        payNotify(activity, inAppPurchaseData, inAppSignature);
                    }
                }
            }
        }).addOnFailureListener(onPayFailedCallback);
    }

    OnFailureListener onPayFailedCallback = new OnFailureListener() {
        @Override
        public void onFailure(Exception e) {
            Map<String, Object> objectMap = new HashMap<>();
            objectMap.put("msg", e.getMessage());
            objectMap.put("state", "failed");
            RXApiHelper.Data.track("#rxsdk_payresult", null, objectMap, -1, -1);
            RXLogger.w("rx hms pay failed " + e.getMessage());
            if (e instanceof IapApiException) {
                IapApiException apiException = (IapApiException) e;
                Status status = apiException.getStatus();
                int returnCode = apiException.getStatusCode();
                if (mPayCallback != null) {
                    mPayCallback.onError(new RXException(RXErrorCode.THIRD_PAY_ERROR, returnCode, status.getErrorString()));
//                    mPayCallback = null;
                }
            } else {
                // 其他外部错误
                if (mPayCallback != null) {
                    mPayCallback.onError(new RXException(e));
//                    mPayCallback = null;
                }
            }
        }
    };

    public void obtainOwnedPurchases(Activity activity, RXJSONCallback callback) {
        mPayCallback = callback;
        obtainOwnedPurchases(activity);
    }

    // 支付成功
    private void payNotify(Activity activity, String inAppPurchaseData, String inAppPurchaseDataSignature) {
        try {
            InAppPurchaseData inAppPurchaseDataBean = new InAppPurchaseData(Objects.requireNonNull(inAppPurchaseData, "Iap inAppPurchaseData null error！"));
            int purchaseState = inAppPurchaseDataBean.getPurchaseState();
            String payload = inAppPurchaseDataBean.getDeveloperPayload();
            HmsOrderData orderData = HmsOrderData.fromDeveloperPayload(payload);
            if (purchaseState == InAppPurchaseData.PurchaseState.PURCHASED) {
                String url = !TextUtils.isEmpty(orderData.getNotifyUrl()) ? orderData.getNotifyUrl() : mNotifyUrl;
                if (TextUtils.isEmpty(url)) {
                    String msg = "支付失败，未知发货地址，请联系客服。" + orderData.getOrderNo();
                    if (mPayCallback != null) {
                        mPayCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), msg));
                    }
                    RXLogger.e("rx payload:" + payload);
                    RXLogger.e("rx consumeOwnedPurchase :" + inAppPurchaseData);
//                    consumeOwnedPurchase(activity, inAppPurchaseData);
                } else {
                    Map<String, Object> hashMap = new HashMap<>();
                    hashMap.put("purchase_data", inAppPurchaseData);
                    hashMap.put("purchase_signature", inAppPurchaseDataSignature);
                    sendVerifyPaymentReq(activity, inAppPurchaseData, url, hashMap, 0);
                }

            } else {
                if (mPayCallback != null) {
                    mPayCallback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(purchaseState, PurchaseStateMsg.get(purchaseState, "未知错误") + " order:" + inAppPurchaseDataBean.getOrderID()));
                }
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
            if (mPayCallback != null) {
                mPayCallback.onError(new RXException(e));
            }
        }
    }

    private void sendVerifyPaymentReq(Activity activity, String inAppPurchaseData, String url, Map<String, Object> hashMap, int retryCount) {
        long delay = getDelay(retryCount) * 5000L;
        RXLogger.i("notify pay retry count:" + retryCount + ",delay:" + delay);
        RXRequest.create(url).setBody(hashMap).postAsyncDelay(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (data != null && data.optBoolean("consumed")) {
                    if (mPayCallback != null) {
                        mPayCallback.onSuccess(data);
                    }
                } else {
                    consumeOwnedPurchase(activity, inAppPurchaseData);
                }
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
                    RXLogger.e("rx consumeOwnedPurchase :" + inAppPurchaseData);
                    consumeOwnedPurchase(activity, inAppPurchaseData);
                    if (mPayCallback != null) {
                        mPayCallback.onFailed(cause);
                        mPayCallback = null;
                    }
                    Map<String, Object> objectMap = new HashMap<>(hashMap);
                    objectMap.put("state", "failed");
                    objectMap.put("msg", cause.toString());
                    RXApiHelper.Data.track("#rxsdk_payresult", null, objectMap, -1, -1);
                } else if (errorCode != RX_USED_ERR_CODE && retryCount < 4) {
                    sendVerifyPaymentReq(activity, inAppPurchaseData, url, hashMap, retryCount + 1);
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
                    sendVerifyPaymentReq(activity, inAppPurchaseData, url, hashMap, retryCount + 1);
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

    /**
     * 交易成功，通知华为消费商品
     * @param inAppPurchaseData 购买凭证信息
     */
    public void consumeOwnedPurchase(Activity activity, String inAppPurchaseData) {
        try {
            // 构造ConsumeOwnedPurchaseReq对象
            ConsumeOwnedPurchaseReq req = new ConsumeOwnedPurchaseReq();
            // purchaseToken需从购买信息InAppPurchaseData中获取
            InAppPurchaseData inAppPurchaseDataBean = new InAppPurchaseData(inAppPurchaseData);
            String purchaseToken = inAppPurchaseDataBean.getPurchaseToken();

            req.setPurchaseToken(purchaseToken);
            // 消耗型商品发货成功后，需调用consumeOwnedPurchase接口进行消耗
            Task<ConsumeOwnedPurchaseResult> task = Iap.getIapClient(activity).consumeOwnedPurchase(req);
            task.addOnSuccessListener(new OnSuccessListener<ConsumeOwnedPurchaseResult>() {
                @Override
                public void onSuccess(ConsumeOwnedPurchaseResult result) {
                    // 获取接口请求结果
                    RXLogger.i("consumeOwnedPurchase resultCode=" + result.getReturnCode());
                    if (mPayCallback != null) {
                        mPayCallback.onSuccess(JSONUtil.toJSONObject(0, ""));
                    }
                    Map<String, Object> objectMap = new HashMap<>();
                    objectMap.put("order", inAppPurchaseData);
                    objectMap.put("state", "success");
                    RXApiHelper.Data.track("#rxsdk_removeTransactionObserver", null, objectMap, -1, -1);
                }
            }).addOnFailureListener(onPayFailedCallback);


        } catch (JSONException e) {
            e.printStackTrace();
            if (mPayCallback != null) {
                mPayCallback.onError(new RXException(e));
            }
            Map<String, Object> objectMap = new HashMap<>();
            objectMap.put("state", "error");
            objectMap.put("msg", e.getMessage());
            RXApiHelper.Data.track("#rxsdk_payresult", null, objectMap, -1, -1);
        }
    }
}
