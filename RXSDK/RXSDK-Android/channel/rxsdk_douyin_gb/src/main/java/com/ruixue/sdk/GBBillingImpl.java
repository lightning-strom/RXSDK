package com.ruixue.sdk;

import android.app.Activity;
import android.text.TextUtils;

import androidx.annotation.Nullable;

import com.bytedance.ttgame.tob.optional.union.api.pay.IPayCallback;
import com.bytedance.ttgame.tob.optional.union.api.pay.PayInfo;
import com.bytedance.ttgame.tob.optional.union.api.pay.PayResult;
import com.bytedance.ttgame.tob.optional.union.api.pay.PaySuccessListener;
import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.billing.HQType;
import com.ruixue.error.RXErrorCode;
import com.ruixue.openapi.GBSdkHelper;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/27
 */
public class GBBillingImpl extends BillingClient implements PaySuccessListener {

    public static final String DOUYIN = "douyin";
    private String openId;

    public void setOpenId(String openId) {
        this.openId = openId;
    }

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_HQ_TYPE)) {
            hashMap.put(KEY_HQ_TYPE, DOUYIN);
        }
        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        GBOrderData orderData = GBOrderData.fromJson(data);
        if (orderData != null) {
            if (TextUtils.isEmpty(orderData.getGoodsTag()) && hashMap.containsKey("goodsTag")) {
                orderData.setGoodsTag((String) hashMap.get("goodsTag"));
            }
            if (TextUtils.isEmpty(orderData.getProductName()) && hashMap.containsKey("goodsName")) {
                orderData.setProductName((String) hashMap.get("goodsName"));
            }
            if (TextUtils.isEmpty(orderData.getProductDesc()) && hashMap.containsKey("goodsName")) {
                orderData.setProductDesc((String) hashMap.get("goodsName"));
            }

            PayInfo payInfo = orderData.toPayInfo(openId);
            /*
             * 未实名	  -  	不可支付
             未成年  	X < 8	  不可支付
             未成年	  8 ≤ X < 16 	  单次上限50元每月累计上限200元
             未成年	  16 ≤ X < 18	   单次上限100元每月累计上限400元
             成年	  X ≥ 18 	  无限制
             */
            GBSdkHelper.pay(activity, payInfo, new IPayCallback<PayResult>() {
                @Override
                public void onSuccess(@Nullable PayResult payResult) {
                    if (payResult != null) {
                        callback.onSuccess(RXErrorCode.SUCCESS.toJSONObject(payResult.getSdkCode(), payResult.getSdkMessage()));
                    } else {
                        callback.onSuccess(JSONUtil.toJSONObject(RXErrorCode.SUCCESS));
                    }
                }

                /**
                 *
                 * @param payResult
                 * 支付错误码
                0  	成功
                -101 	  没有登录   	推荐游戏方吊起登录
                -4001	   命中风控策略
                -40001  	命中风控策略
                -2019	  当前用户为游客  	联运sdk会自动弹出升级正式账号弹窗，无需游戏方处理，用户升级后需要再次购买
                -2022	  用户需要进行实名认证	  联运sdk会自动弹出实名认证弹窗，无需游戏方处理，用户实名认证后会自动继续购买
                -2023 	  未成年充值限额 	  联运sdk自动会弹出toast提示
                -2025  	单笔限额	  联运sdk自动会弹出toast提示
                -2026	  国内未成年人月充值限制	  联运sdk自动会弹出弹窗提示
                -2027 	  国内未成年月充值已达上限  	联运sdk自动会弹出toast提示
                 */
                @Override
                public void onFailed(@Nullable PayResult payResult) {
                    if (payResult != null) {
                        if (payResult.getSdkCode() == -104) {
                            callback.onFailed(RXErrorCode.PAY_CANCEL.toJSONObject());
                        } else {
                            callback.onFailed(RXErrorCode.THIRD_PAY_ERROR.toJSONObject(payResult.getSdkCode(), payResult.getSdkMessage()));
                        }
                    } else {
                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.THIRD_PAY_ERROR));
                    }
                }
            });

        } else if (callback != null) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR));
        }
    }

    /**
     * SDK悬浮球内支持对部分历史订单进行支付，对这部分订单可以设置全局的监听，收到监听结果后及时给用户发货，更新游戏界面，优化用户体验。
     * @param type 1 直接支付的订单 ,2历史订单  {@link PaySuccessListener#TYPE_DIRECT_PAY} {@link PaySuccessListener#TYPE_HISTORY}
     */
    @Override
    public void onPaySuccess(int type, String cpOrderId, String productId) {

    }
}
