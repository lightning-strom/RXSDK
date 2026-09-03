package com.ruixue.billing;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * 最近一次下单参数缓存，供渠道手动上报充值时读取订单上下文。
 */
public final class ChannelPaymentOrderCache {

    private static volatile Map<String, Object> lastOrder;

    private ChannelPaymentOrderCache() {
    }

    public static void cacheOrder(@Nullable Map<String, Object> payParams, @Nullable JSONObject orderData) {
        Map<String, Object> snapshot = buildSnapshot(payParams, orderData);
        if (!snapshot.isEmpty()) {
            lastOrder = snapshot;
        }
    }

    @Nullable
    public static Map<String, Object> getLastCachedOrder() {
        return lastOrder == null ? null : new HashMap<>(lastOrder);
    }

    @NonNull
    public static Map<String, Object> resolveForReport(int amountFen, @Nullable Map<String, Object> override) {
        Map<String, Object> report = lastOrder != null ? new HashMap<>(lastOrder) : new HashMap<>();
        if (override != null && !override.isEmpty()) {
            report.putAll(override);
        }
        if (amountFen > 0) {
            report.put("amount", amountFen);
        }
        Object bigdata = report.get(BillingClient.KEY_BIGDATA_REPORT);
        if (bigdata instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> bigdataMap = (Map<String, Object>) bigdata;
            report.putAll(bigdataMap);
            report.remove(BillingClient.KEY_BIGDATA_REPORT);
        }
        return report;
    }

    @NonNull
    private static Map<String, Object> buildSnapshot(@Nullable Map<String, Object> payParams,
                                                   @Nullable JSONObject orderData) {
        Map<String, Object> snapshot = new HashMap<>();
        if (payParams != null) {
            for (Map.Entry<String, Object> entry : payParams.entrySet()) {
                String key = entry.getKey();
                if ("only_order".equals(key) || "only_pay".equals(key) || "data".equals(key)) {
                    continue;
                }
                Object value = entry.getValue();
                if (value != null) {
                    snapshot.put(key, value);
                }
            }
            Object embedded = payParams.get("data");
            if (embedded instanceof JSONObject) {
                mergeJson(snapshot, (JSONObject) embedded);
            } else if (embedded instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> embeddedMap = (Map<String, Object>) embedded;
                snapshot.putAll(embeddedMap);
            }
        }
        mergeJson(snapshot, orderData);
        return snapshot;
    }

    private static void mergeJson(@NonNull Map<String, Object> target, @Nullable JSONObject json) {
        if (json == null) {
            return;
        }
        JSONObject data = json.optJSONObject("data");
        if (data != null) {
            target.putAll(JSONUtil.toMapNonNull(data));
        }
        target.putAll(JSONUtil.toMapNonNull(json));
    }
}
