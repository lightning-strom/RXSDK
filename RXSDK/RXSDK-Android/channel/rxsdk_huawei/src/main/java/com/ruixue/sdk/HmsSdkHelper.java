package com.ruixue.sdk;

import android.app.Activity;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.huawei.hmf.tasks.OnFailureListener;
import com.huawei.hmf.tasks.OnSuccessListener;
import com.huawei.hmf.tasks.Task;
import com.huawei.hms.iap.Iap;
import com.huawei.hms.iap.entity.ProductInfo;
import com.huawei.hms.iap.entity.ProductInfoReq;
import com.huawei.hms.iap.entity.ProductInfoResult;
import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.HttpMethod;
import com.ruixue.net.RXRequest;
import com.ruixue.utils.JSONUtil;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/27
 */
public class HmsSdkHelper {

    /**
     * @param activity   activity
     * @param priceType  0：消耗型商品; 1：非消耗型商品; 2：订阅型商品
     * @param productIds 查询的商品必须是您在AppGallery Connect网站配置的商品
     * @param callback   data 字段
     */
    public static void obtainProductInfo(Activity activity, int priceType, @NonNull List<String> productIds, @NonNull RXJSONCallback callback) {
        if (productIds.size() > 0) {
            // 查询的商品必须是您在AppGallery Connect网站配置的商品
            ProductInfoReq req = new ProductInfoReq();
            req.setPriceType(priceType);
            req.setProductIds(productIds);
            // 调用obtainProductInfo接口获取AppGallery Connect网站配置的商品的详情信息
            Task<ProductInfoResult> task = Iap.getIapClient(activity).obtainProductInfo(req);
            task.addOnSuccessListener(new OnSuccessListener<ProductInfoResult>() {
                @Override
                public void onSuccess(ProductInfoResult result) {
                    // 获取接口请求成功时返回的商品详情信息
                    List<ProductInfo> productList = result.getProductInfoList();
                    //设置适配器
                    RXLogger.e("obtainProductInfo 商品详情信息:" + productList.toString());
//                    JSONArray jsonArray= new JSONArray(productList);
                    Map<String, Object> hashMap = new HashMap<>();
                    hashMap.put("code", 0);
                    hashMap.put("data", productList);
                    callback.onSuccess(new JSONObject(hashMap));
                }
            }).addOnFailureListener(new OnFailureListener() {
                @Override
                public void onFailure(Exception e) {
                    callback.onError(new RXException(e));
                }
            });
        } else {
            callback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(-1, "商品 id 列表为空。"));
        }
    }

    public static void bindDeviceForXiaoYi(@NonNull RXJSONCallback callback) {
        String playerId = globalPlayerId;
        String openid = globalOpenId;

        if (TextUtils.isEmpty(playerId) && TextUtils.isEmpty(openid)) {
            callback.onFailed(JSONUtil.toJSONObject(-1, "playerId and openid is null"));
            return;
        }

        JSONObject json = new JSONObject();
        try {
            json.put("o", openid == null ? "" : openid);
            json.put("p", playerId == null ? "" : playerId);
        } catch (JSONException e) {
            RXLogger.e("bindDeviceForXiaoYi error:" + e.getMessage());
        }

        Map<String, Object> arg = new HashMap<>();
        arg.put("device_code", json.toString());
        arg.put("type", "xiaoyipush");
        RXRequest.create("v1/pusher/device/bind_device").setMethod(HttpMethod.POST).setBody(arg).setCallback(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                callback.onSuccess(json);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                callback.onFailed(cause);
            }
        }).execRequestAsync();
    }

    private static String globalPlayerId;
    private static String globalOpenId;
    public static void setPlayerId(String playerId) {
        globalPlayerId = playerId;
    }
    public static void setOpenId(String openId) {
        globalOpenId = openId;
    }

}
