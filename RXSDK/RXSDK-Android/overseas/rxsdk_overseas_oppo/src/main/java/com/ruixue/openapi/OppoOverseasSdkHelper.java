package com.ruixue.openapi;

import android.content.Context;

import com.google.gson.JsonSyntaxException;
import com.nearme.game.sdk.GameCenterSDK;
import com.nearme.game.sdk.callback.ApiCallback;
import com.nearme.game.sdk.common.model.biz.WithdrawalInfo;
import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.utils.JSONUtil;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/28
 */
public class OppoOverseasSdkHelper {

    public static void doGetTokenAndSsoid(RXJSONCallback callback) {
        GameCenterSDK.getInstance().doGetTokenAndSsoid(new ApiCallback() {
            @Override
            public void onSuccess(String resultMsg) {
                try {
                    JSONObject jsonObject = OppoBean.fromJson(resultMsg).toJSONObject();
                    callback.onSuccess(jsonObject);
                } catch (NullPointerException | JsonSyntaxException | ClassCastException e) {
                    callback.onError(new RXException(e));
                }
            }

            @Override
            public void onFailure(String content, int resultCode) {
                RXLogger.i("ssoid onFailure", content);
                callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(resultCode, content));
            }
        });
    }

    /**
     * 获取国家地区
     * 接口返回值为json，例如{"region":"IN"}代表印度，{"region":"ID"}代表印度尼西亚，{"region":"TW"}代表台湾， {"region":"VN"}代表越南， {"region":"TH"}代表泰国， {"region":"PH"}代表菲律宾，  {"region":"MY"}代表马来西亚。目前支持以上七个地区。其他地区暂不支持。
     *
     * @param callback
     */
    public static void doGetRegion(RXJSONCallback callback) {
        GameCenterSDK.getInstance().doGetRegion(new ApiCallback() {

            @Override
            public void onSuccess(String s) {
                try {
                    JSONObject data = new JSONObject(s);
                    if (callback != null) {
                        callback.onSuccess(data);
                    }
                } catch (JSONException e) {
                    if (callback != null)
                        callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.UNKNOWN_THIRD_ERROR, "region result is empty"));
                }
            }

            @Override
            public void onFailure(String s, int i) {
                if (callback != null) {
                    callback.onFailed(JSONUtil.toJSONObject(i, s));
                }
            }
        });
    }

    /**
     * 游戏提现接口
     */
    public static void doWithdrawal(Context context, WithdrawalInfo withdrawalInfo, ApiCallback callback) {
        GameCenterSDK.getInstance().doWithdrawal(context, withdrawalInfo, callback);
    }

    /**
     * 创建角色统计埋点
     *
     * @param uin      游戏运营方绑定的唯一账号id
     * @param sid      服务id
     * @param roleName 游戏角色名
     * @param roleId   游戏角色id
     * @param result   创建角色成功1，失败0
     */
    public static void onCreateRoleStat(String uin, String sid, String roleName, String roleId, String result) {
        GameCenterSDK.getInstance().onCreateRoleStat(uin, sid, roleName, roleId, result);
    }

    /**
     * 登录游戏账号统计埋点
     *
     * @param uin      游戏运营方绑定的唯一账号id
     * @param sid      服务id
     * @param roleName 游戏角色名
     * @param roleId   游戏角色id
     * @param result   创建角色成功1，失败0
     */
    public static void onLoginGamesStat(String uin, String sid, String roleName, String roleId, String result) {
        GameCenterSDK.getInstance().onLoginGamesStat(uin, sid, roleName, roleId, result);
    }

    /**
     * 商品点击统计埋点
     *
     * @param goodsId 商品 id
     * @param sid     服务 id
     */
    public static void onCommodityClickStat(String goodsId, String sid) {
        GameCenterSDK.getInstance().onCommodityClickStat(goodsId, sid);
    }

    /**
     * 退出游戏统计埋点
     *
     * @param uin      游戏运营方绑定的唯一账号id
     * @param sid      服务id
     * @param roleName 游戏角色名
     * @param roleId   游戏角色id
     */
    public static void onExitStat(String uin, String sid, String roleName, String roleId) {
        GameCenterSDK.getInstance().onExitStat(uin, sid, roleName, roleId);
    }

    /**
     * 点击支付统计埋点
     *
     * @param uin      游戏运营方绑定的唯一账号id
     * @param sid      服务id
     * @param roleName 游戏角色名
     * @param roleId   游戏角色id
     * @param goodsId  商品 id
     */
    public static void onClickToPayStat(String uin, String sid, String roleName, String roleId, String goodsId) {
        GameCenterSDK.getInstance().onClickToPayStat(uin, sid, roleName, roleId, goodsId);
    }

    /**
     * 调起支付统计埋点（非 OPPO 支付才需要）
     *
     * @param uin      游戏运营方绑定的唯一账号id
     * @param sid      服务id
     * @param roleName 游戏角色名
     * @param roleId   游戏角色id
     * @param goodsId  商品 id
     * @param channel  支付渠道
     * @param result   调起支付成功1，失败0
     */
    public static void onCallUpPaymentStat(String uin, String sid, String roleName, String roleId, String goodsId, String channel, String result) {
        GameCenterSDK.getInstance().onCallUpPaymentStat(uin, sid, roleName, roleId, goodsId, channel, result);
    }

    /**
     * 客户端内支付统计埋点（非OPPO支付才需要)
     *
     * @param uin           游戏运营方绑定的唯一账号id
     * @param sid           服务id
     * @param roleName      游戏角色名
     * @param roleId        游戏角色id
     * @param goodsId       商品 id
     * @param money         支付金额
     * @param payUnit       支付货币单位
     * @param channel       支付渠道
     * @param orderId       订单 id
     * @param result        支付成功1，支付失败0，2取消支付
     * @param payResultCode 支付sdk返回的支付结果代码，就onFailure回调resultMsg参数 成功直接传1001
     */
    public static void onIntraClientPaymentStat(String uin, String sid, String roleName, String roleId, String goodsId, String money, String payUnit, String channel, String orderId, String result, String payResultCode) {
        GameCenterSDK.getInstance().onIntraClientPaymentStat(uin, sid, roleName, roleId, goodsId, money, payUnit, channel, orderId, result, payResultCode);
    }
}
