package com.ruixue.sdk;

import android.app.Activity;
import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.BillingClient;
import com.ruixue.billing.HQType;
import com.ruixue.error.RXErrorCode;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.VivoSdkHelper;
import com.ruixue.utils.JSONUtil;
import com.vivo.unionsdk.open.MissOrderEventHandler;
import com.vivo.unionsdk.open.OrderResultInfo;
import com.vivo.unionsdk.open.VivoConstants;
import com.vivo.unionsdk.open.VivoPayCallback;
import com.vivo.unionsdk.open.VivoPayInfo;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class VivoBillingImpl extends BillingClient {
    public static final String VIVO = "vivo";
    private String uid;

    /**
     * @param uid 用户id
     */
    public void setUid(@NonNull String uid) {
        if (!TextUtils.isEmpty(uid)) {
            VivoSdkHelper.queryMissOrderResult(uid);
        }
        this.uid = uid;
    }

    public void init(Activity activity) {
        registerMissOrderEventHandler(activity);
    }

    @Override
    public void pay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_HQ_TYPE)) {
            hashMap.put(KEY_HQ_TYPE, VIVO);
        }
        super.pay(activity, hashMap, callback);
    }

    @Override
    protected void onOrderResponse(Activity activity, Map<String, Object> hashMap, JSONObject data, RXJSONCallback callback) {
        VivoOrderData orderData = VivoOrderData.fromJson(data);
        if (orderData != null) {
            Object payObj = hashMap.get("pay_code");
            int pay_code = payObj == null ? 0 : (int) payObj;
            VivoPayInfo vivoPayInfo = createPayInfo(orderData.getExt());
            if (pay_code > 0) {
                // code             1表示微信，2表示支付宝
                VivoSdkHelper.payNowV2(activity, vivoPayInfo, getVivoPayCallback(callback), pay_code);
            } else {
                VivoSdkHelper.payV2(activity, vivoPayInfo, getVivoPayCallback(callback));
            }
        } else {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR));
        }
    }

    @NonNull
    private VivoPayCallback getVivoPayCallback(RXJSONCallback callback) {
        return (i, orderResultInfo) -> {
            if (i == VivoConstants.PAYMENT_RESULT_CODE_SUCCESS) {
                /**
                 * 后续流程：游戏确认支付成功--->发货--->确认收到道具--->调用reportOrderComplete(transNo, false)
                 */
                if (null != callback) {
                    callback.onSuccess(new JSONObject(orderResultInfo.toMapParams()));
                }
                /**
                 * !!!! 一定要加，否则无法通过上架审核 !!!
                 * !!! 商品发放成功以后，通知vivo侧 !!!!
                 * 这里取transNo不要取错了 注意!!!
                 */
                VivoSdkHelper.reportOrderComplete(orderResultInfo.getTransNo(), false);
            } else if (i == VivoConstants.PAYMENT_RESULT_CODE_CANCEL) {
                if (null != callback) {
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.PAY_CANCEL.getValue(), "取消支付"));
                }
            } else if (i == VivoConstants.PAYMENT_RESULT_CODE_UNKNOWN) {
                if (null != callback) {
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "未知状态，请查询订单"));
                }

            } else {
                if (null != callback) {
                    callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.HQ_DATA_ERROR.getValue(), "支付失败"));
                }
            }

            RXLogger.i("onVivoPayResult:" + i);
        };
    }


    /**
     * 登录vivo帐号后，创建VivoPayInfo
     * @param orderBean 订单信息
     * @return
     */
    public VivoPayInfo createPayInfo(VivoOrderData.ExtBean orderBean) {
        VivoPayInfo vivoPayInfo = new VivoPayInfo.Builder()
                //基本支付信息
                .setAppId(orderBean.getAppId())
                .setCpOrderNo(orderBean.getCpOrderNumber())
                .setExtInfo(orderBean.getExtInfo())
                .setNotifyUrl(orderBean.getNotifyUrl())
                .setOrderAmount(orderBean.getOrderAmount())
                .setProductDesc(orderBean.getProductDesc())
                .setProductName(orderBean.getProductName())
                //角色信息
//                .setBalance(orderBean.getRoleInfoBean().getBalance())
//                .setVipLevel(orderBean.getRoleInfoBean().getVip())
//                .setRoleLevel(orderBean.getRoleInfoBean().getLevel())
//                .setParty(orderBean.getRoleInfoBean().getParty())
//                .setRoleId(orderBean.getRoleInfoBean().getRoleId())
//                .setRoleName(orderBean.getRoleInfoBean().getRoleName())
//                .setServerName(orderBean.getRoleInfoBean().getServerName())
                //计算出来的参数验签
                .setVivoSignature(orderBean.getSign())
                //接入vivo帐号传uid，未接入传""
                .setExtUid(this.uid)
                .build();

        return vivoPayInfo;
    }

    /**
     * 掉单注册接口  需要接入掉单补单处理的一定要加
     * !!!! 一定要加，否则无法通过上架审核 !!!
     * 作用：商品补发回调
     * 场景：支付完成后，游戏未正常发放商品，或发放后未成功通知到vivo侧，在异常订单查询后自动触发
     */
    public void registerMissOrderEventHandler(Activity activity) {
        //查询是否有调单
        VivoSdkHelper.registerMissOrderEventHandler(activity, mMissOrderEventHandler);
    }

    /**
     * 注意这里是查到未核销的订单
     * 需要调用自己的逻辑完成道具核销后再调用我们的订单完成接口
     * 切记！！！一定要走自己逻辑发送完道具后再调用完成接口！！！切记！切记！
     * ！！！游戏根据订单号检查、补发商品！！！
     * 自行完成补发逻辑  一定要完成道具补发后才能调用完成接口 此处一定要注意！！！
     * 如果不处理直接调用完成则掉单无法解决
     * 注意！！！注意！！！
     * 游戏侧用你们自己的订单号cpOrderNumber来校验是否完成发货  发货完成上报我们的订单号transNo
     * 用户主动触发或调用queryMissOrderResult查询回调会在此做处理
     */
    @SuppressWarnings("unchecked")
    private final MissOrderEventHandler mMissOrderEventHandler = this::checkOrder;

    /**
     * 校验订单是否已经完成发货（游戏自己逻辑）
     * 未完成的执行发货操作
     */
    public void checkOrder(final List<OrderResultInfo> list) {
        if (list == null || list.isEmpty()) {
            return;
        }
        List<String> orderList = new ArrayList<>();
        for (int i = 0; i < list.size(); i++) {
            /*
             * 校验是否已经完成发货 如果已经完成发货则加入完成列表
             * 未完成则调用发货流程
             * 这里修改成自己的校验流程 调用游戏自己的服务器 注意！！！注意！！！
             * 校验已发货成功的 加入已完成列表 这里传的是transNo
             */
            orderList.add(list.get(i).getTransNo());
        }
        if (!orderList.isEmpty()) {
            VivoSdkHelper.reportOrderComplete(orderList, true);
        }
    }

}
