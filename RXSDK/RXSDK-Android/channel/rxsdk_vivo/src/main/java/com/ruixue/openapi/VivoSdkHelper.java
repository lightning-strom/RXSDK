package com.ruixue.openapi;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;
import android.util.Log;
import android.util.SparseArray;

import com.ruixue.callback.RealNameCallback;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;
import com.vivo.unionsdk.open.ChannelInfoCallback;
import com.vivo.unionsdk.open.MissOrderEventHandler;
import com.vivo.unionsdk.open.VivoConfigInfo;
import com.vivo.unionsdk.open.VivoPayCallback;
import com.vivo.unionsdk.open.VivoPayInfo;
import com.vivo.unionsdk.open.VivoRealNameInfoCallback;
import com.vivo.unionsdk.open.VivoRoleInfo;
import com.vivo.unionsdk.open.VivoUnionSDK;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class VivoSdkHelper {


    /**
     * 游戏同意隐私协议后，务必调用SDK游戏隐私协议通过接口！
     */
    public static void onPrivacyAgreed(Context context) {
        Log.i("rxsdk", "onPrivacyAgreed");
        VivoUnionSDK.onPrivacyAgreed(context);
    }

    private static final SparseArray<String> RealNameStatusMsg = new SparseArray<>();

    static {
        RealNameStatusMsg.put(0, "用户已实名制");
        RealNameStatusMsg.put(1, "实名制成功");
        RealNameStatusMsg.put(2, "实名制失败");
        RealNameStatusMsg.put(3, "实名状态未知");
        RealNameStatusMsg.put(4, "apk版本不支持，请去应用商店更新vivo服务安全插件");
        RealNameStatusMsg.put(5, "非vivo手机不支持");
    }


    public static void getRealNameInfo(Activity activity, RealNameCallback callback) {
        VivoUnionSDK.getRealNameInfo(activity, new VivoRealNameInfoCallback() {
            @Override
            public void onGetRealNameInfoSucc(boolean isRealName, int age) {
                //isRealName是否已实名制，age为年龄信息，请根据这些信息进行防沉迷操作
                Map<String, Object> hashMap = new HashMap<>();
                hashMap.put("code", isRealName ? 0 : 2);
                hashMap.put("isRealName", isRealName);
                hashMap.put("age", age);
                callback.onResult(new JSONObject(hashMap));
            }

            @Override
            public void onGetRealNameInfoFailed() {
//                获取实名制信息失败，请自行处理是否防沉迷
                callback.onResult(JSONUtil.toJSONObject(-1, "获取实名制信息失败，请自行处理是否防沉迷"));
            }
        });
    }

    /**
     * 获取安装来源信息接口
     */
    public static void getChannelInfo(com.ruixue.callback.ChannelInfoCallback callback) {

        VivoUnionSDK.getChannelInfo(new ChannelInfoCallback() {
            @Override
            public void onReadResult(String s) {
                callback.onResult(s);
            }
        });
    }

    /**
     * 查询订单状态
     * @param openid 帐号唯一标识，登录后获取
     */
    public static void queryMissOrderResult(String openid) {
        VivoUnionSDK.queryMissOrderResult(openid);
    }

    /**
     * 登录成功后上报角色信息
     * @param vivoRoleInfo 角色信息
     */
    public static void reportRoleInfo(VivoRoleInfo vivoRoleInfo) {
        VivoUnionSDK.reportRoleInfo(vivoRoleInfo);
    }

    /**
     * 查询是否有调单
     * @param missOrderEventHandler
     */
    public static void registerMissOrderEventHandler(final Context context, MissOrderEventHandler missOrderEventHandler) {
        VivoUnionSDK.registerMissOrderEventHandler(context, missOrderEventHandler);
    }


    /**
     * 直接吊起微信与支付宝
     * @param activity
     * @param mVivoPayCallback 支付结果回调
     * @param code             1表示微信，2表示支付宝
     */
    public static void payNowV2(Activity activity, VivoPayInfo vivoPayInfo, VivoPayCallback mVivoPayCallback, int code) {
        VivoUnionSDK.payNowV2(activity, vivoPayInfo, mVivoPayCallback, code);
    }

    /**
     * 吊起支付面板
     * @param activity
     * @param mVivoPayCallback 支付结果回调
     */
    public static void payV2(Activity activity, VivoPayInfo vivoPayInfo, VivoPayCallback mVivoPayCallback) {
        VivoUnionSDK.payV2(activity, vivoPayInfo, mVivoPayCallback);
    }


    /**
     * 登录
     * @param activity
     */
    public static void login(Activity activity) {
        VivoUnionSDK.login(activity);
    }


    public static void reportOrderComplete(String transNo) {
        if (TextUtils.isEmpty(transNo)) {
            return;
        }
        List<String> list = new ArrayList<>();
        list.add(transNo);
        reportOrderComplete(list, false);
    }


    /**
     * 游戏方发放商品成功主动通知联运
     * @param list vivo订单号列表
     */
    public static void reportOrderComplete(List<String> list) {
        if (list == null || list.isEmpty()) {
            return;
        }
        reportOrderComplete(list, true);
    }

    /**
     * @param transNo
     * @param isReOrder 是否补单
     */
    public static void reportOrderComplete(String transNo, boolean isReOrder) {
        if (TextUtils.isEmpty(transNo)) {
            return;
        }
        List<String> list = new ArrayList<>();
        list.add(transNo);
        reportOrderComplete(list, isReOrder);
    }

    /**
     * @param list      订单列表
     * @param isReOrder 是否补单。
     *                  正常流程：游戏确认支付成功-->发货--->确认收到道具--->调用reportOrderComplete(list, false)
     *                  异常流程：若以上流程中断（掉单、report请求失败等情况），没有report的订单进入补单回调，进行校验：
     *                  ---已收到道具--->调用reportOrderComplete(list, true)
     *                  ---未收到道具--->补单--->确认收到道具--->调用reportOrderComplete(list, true)
     */
    public static void reportOrderComplete(List<String> list, boolean isReOrder) {
        VivoUnionSDK.reportOrderComplete(list, isReOrder);
    }


}
