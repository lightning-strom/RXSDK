package com.ruixue.billing;

import android.app.Activity;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.base.TrackDeviceInfoMgr;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.net.RXRequest;
import com.ruixue.net.RxErrorReportUtil;
import com.ruixue.openapi.RXApiHelper;
import com.ruixue.openapi.RXApiPath;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.passport.PassportManager;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

public abstract class BillingClient {

    public static final String KEY_HQ_TYPE = "hq_type";
    public static final String KEY_NOTIFY_URL = "notify_url";

    public static final String KEY_PAY_LIMIT_ENABLE = "indulge_auth";

    /**
     * 支付参数中的商业化窗口大数据透传字段（与 pay 参数一致）
     */
    public static final String KEY_BIGDATA_REPORT = "bigdata_report";

    /**
     * 未成年人支付限制开启
     */
    public static final int PAY_LIMIT_ENABLE = 1;
    /**
     * 未成年人支付限制关闭，三方渠道需关闭，默认不开启
     */
    public static final int PAY_LIMIT_DISABLE = 0;

    /**
     * 是否允许重复订单
     */
    protected boolean allowRepeatOrder = false;
    //是否正在下单请求中
    private final AtomicBoolean isInTheOrder = new AtomicBoolean(false);

    //是否在支付中
    private static final AtomicBoolean isInThePay = new AtomicBoolean(false);

    protected long timestampMark;

    public boolean isAllowRepeatOrder() {
        return allowRepeatOrder;
    }

    /**
     * @param allowRepeatOrder 是否允许重复下单
     */
    public void setAllowRepeatOrder(boolean allowRepeatOrder) {
        this.allowRepeatOrder = allowRepeatOrder;
    }

    /**
     * @return 是否正在下单请求中
     */
    public boolean isInTheOrder() {
        if (System.currentTimeMillis() - timestampMark > 20000) {
            setOrderInProgress(false);
        }
        return isInTheOrder.get();
    }

    public boolean isPaying() {
        if (System.currentTimeMillis() - timestampMark > 20000) {
            setPaying(false);
        }
        return isInThePay.get();
    }

    protected void setOrderInProgress(boolean isOrderRequesting) {
        if (isOrderRequesting) {
            timestampMark = System.currentTimeMillis();
        }
        isInTheOrder.set(isOrderRequesting);
    }

    protected void setPaying(boolean isPaying) {
        if (isPaying) {
            timestampMark = System.currentTimeMillis();
        }
        isInThePay.set(isPaying);
    }

    //    {
//    "mode": 0,
//    "scene_tag": "string",
//    "window_id": 0,
//    "window_version": "string",
//    "cp_gift_tag": "string",
//    "cp_prop_tag": "string",
//    "cp_prop_number": 0,
//    "item_list": [
//        {
//            "number": 0,
//            "tag": "string"
//        }
//    ]
//}

    public JSONObject getOrder(Map<String, Object> hashMap, RXJSONCallback callback) {
        return RXRequest.create(RXApiPath.Pay.ORDER).setBody(hashMap).sign(true).post(callback);
    }

    public void getOrderAsync(Map<String, Object> hashMap, RXJSONCallback callback) {
        ThreadUtils.getInstance().runOnBgThreadUseExecutor(() -> getOrder(hashMap, callback));
    }

    public void pay(String payType, Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        hashMap.put(KEY_HQ_TYPE, payType);
        pay(activity, hashMap, callback);
    }

    public void pay(Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        Map<String, Object> hashMap = map == null ? new HashMap<>() : map;
        if (ObjectUtils.toBoolean(hashMap.get("exchange"))) {
            hashMap.remove("exchange");
            RXApiHelper.exchange(hashMap, callback);
            return;
        }

        if (!hashMap.containsKey(KEY_HQ_TYPE)) {
            if (null != callback)
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.ORDER_PARAMS_ERROR.getValue(), KEY_HQ_TYPE + " is null,please invalid params " + KEY_HQ_TYPE));
            return;
        }
        if (ObjectUtils.toBoolean(hashMap.get("only_pay"))) {
            JSONObject data = (JSONObject) hashMap.get("data");
            if (data != null) {
                ChannelPaymentOrderCache.cacheOrder(hashMap, data);
                onOrderResponse(activity, hashMap, data, handleCallback(data, callback));
            } else if (null != callback) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), hashMap.get(KEY_HQ_TYPE) + " pay order data null error"));
            }
            return;
        }
        if (isInTheOrder() && !isAllowRepeatOrder()) {
            setOrderInProgress(false);
            if (null != callback)
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.ORDER_REPEAT_ERROR.getValue(), "Repeat orders are not allowed."));
            return;
        }
        if (!hashMap.containsKey("openid")) {
            String openid = PassportManager.getInstance().getOpenid();
            if (TextUtils.isEmpty(openid)) {
                setOrderInProgress(false);
                if (null != callback) {
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.NOT_LOGIN_ERROR.getValue(), "Please login first."));
                }
                return;
            }

        }
        addDefaultParams(activity, hashMap);

        setOrderInProgress(true);
        getOrderAsync(hashMap, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                setOrderInProgress(false);
                try {
                    if (callback != null && ObjectUtils.toBoolean(hashMap.get("only_order"))) {
                        ChannelPaymentOrderCache.cacheOrder(hashMap, data);
                        callback.onSuccess(data);
                    } else {
                        ChannelPaymentOrderCache.cacheOrder(hashMap, data);
                        Map<String, Object> pro = new HashMap<>();
                        pro.put("state", "success");
                        pro.putAll(JSONUtil.toMapNonNull(data));
                        RXApiHelper.Data.track("#rxsdk_requestproduct", null, pro, -1, -1);
                        onOrderResponse(activity, hashMap, data, handleCallback(data, callback));
                    }
                } catch (Exception e) {
                    RXException rxException = new RXException(e);
                    Map<String, Object> pro = new HashMap<>();
                    pro.put("state", "failed");
                    pro.putAll(JSONUtil.toMapNonNull(rxException.toJSONObject()));
                    RXApiHelper.Data.track("#rxsdk_requestproduct", null, pro, -1, -1);
                    if (callback != null) {
                        callback.onError(rxException);
                    }
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                int code = cause.optInt("code");
                setOrderInProgress(false);
                Map<String, Object> pro = JSONUtil.toMap(cause);
                String state = "failed";
                if (code == 302425) {
                    if (null != callback)
                        callback.onSuccess(cause);
                    state = "success";
                } else {
                    if (null != callback)
                        callback.onFailed(cause);
                }
                pro.put("state", state);
                RXApiHelper.Data.track("#rxsdk_requestproduct", null, pro, -1, -1);
            }

            @Override
            public void onError(RXException e) {
                setOrderInProgress(false);
                Map<String, Object> pro = JSONUtil.toMap(e.toJSONObject());
                pro.put("state", "failed");
                RXApiHelper.Data.track("#rxsdk_requestproduct", null, pro, -1, -1);
                if (null != callback)
                    callback.onError(e);
            }
        });
    }

    protected void addDefaultParams(Activity activity, Map<String, Object> hashMap) {
        if (!hashMap.containsKey("openid")) {
            String openid = PassportManager.getInstance().getOpenid();
            hashMap.put("openid", openid);
        }
        if (!hashMap.containsKey("source")) {
            String source = PassportManager.getInstance().getSource();
            hashMap.put("source", source);
        }

        if (hashMap.containsKey("plugin_name")) {
            if (!hashMap.containsKey("plugin_version")) {
                hashMap.put("plugin_version", AppUtils.getPackageVersionCode(activity, (String) hashMap.get("plugin_name")));
            }
        }
        if (!hashMap.containsKey("sub_channel_id")) {
            String sub_channel_id = PassportManager.getInstance().getSubChannelId();
            hashMap.put("sub_channel_id", sub_channel_id);
        }
        if (!hashMap.containsKey("age")) {
            hashMap.put("age", PassportManager.getInstance().getUserAge());
        }
        if (!hashMap.containsKey("currency")) {
            hashMap.put("currency", "CNY");
        }

        if (RXGlobalData.isModReport()) {
            String name = TrackDeviceInfoMgr.getDeviceName();
            if (!TextUtils.isEmpty(name)) {
                hashMap.put("device_model", name);
            }
        }

    }

    protected RXJSONCallback handleCallback(JSONObject orderData, RXJSONCallback callback) {
        return new RXJSONCallback() {
            @Override
            public void onError(RXException e) {
                Map<String, Object> pro = JSONUtil.toMap(e.toJSONObject());
                pro.put("state", "failed");
                pro.putAll(JSONUtil.toMapNonNull(orderData));
                RxErrorReportUtil.trackAtTimeAsync("#rxsdk_payresult", pro);
                if (callback != null)
                    callback.onError(e);
            }

            @Override
            public void onSuccess(@Nullable JSONObject data) {
                Map<String, Object> pro = JSONUtil.toMap(data);
                if (pro == null)
                    pro = new HashMap<>();
                pro.put("state", "success");
                pro.putAll(JSONUtil.toMapNonNull(orderData));
                RxErrorReportUtil.trackAtTimeAsync("#rxsdk_payresult", pro);
                if (callback != null)
                    callback.onSuccess(data);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                Map<String, Object> pro = JSONUtil.toMap(cause);
                pro.put("state", "failed");
                pro.putAll(JSONUtil.toMapNonNull(orderData));
                RxErrorReportUtil.trackAtTimeAsync("#rxsdk_payresult", pro);
                if (callback != null)
                    callback.onFailed(cause);
            }
        };
    }

    protected abstract void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback);

    /**
     * 渠道手动上报充值结果时，同步上报瑞雪大数据 {@code #rxsdk_payresult}。
     */
    public static void trackChannelPaymentResult(@NonNull String state, int amountFen,
                                                 @Nullable Map<String, Object> extra,
                                                 @Nullable JSONObject json) {
        Map<String, Object> pro = new HashMap<>();
        pro.put("state", state);
        pro.put("amount", amountFen);
        pro.put("report_source", "channel_manual");
        if (extra != null && !extra.isEmpty()) {
            pro.putAll(extra);
        }
        Map<String, Object> jsonMap = JSONUtil.toMap(json);
        if (jsonMap != null) {
            pro.putAll(jsonMap);
        }
        RxErrorReportUtil.trackAtTimeAsync("#rxsdk_payresult", pro);
    }

}
