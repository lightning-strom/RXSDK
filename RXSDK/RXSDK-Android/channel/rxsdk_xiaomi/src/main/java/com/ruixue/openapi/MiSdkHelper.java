package com.ruixue.openapi;

import android.util.SparseArray;

import com.xiaomi.gamecenter.sdk.MiErrorCode;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/27
 */
public class MiSdkHelper {
    private static SparseArray<String> MiErrorCodeMsg = new SparseArray<>();

    static {
        MiErrorCodeMsg.put(MiErrorCode.MI_XIAOMI_PAYMENT_SUCCESS, "");
        MiErrorCodeMsg.put(MiErrorCode.MI_XIAOMI_PAYMENT_ERROR_LOGIN_FAIL, "登录失败");
        MiErrorCodeMsg.put(MiErrorCode.MI_XIAOMI_PAYMENT_ERROR_CANCEL, "取消登录"); //-18004	登录取消
        MiErrorCodeMsg.put(MiErrorCode.MI_XIAOMI_PAYMENT_ERROR_ACTION_EXECUTED, "登录操作正在进⾏中");
        MiErrorCodeMsg.put(MiErrorCode.MI_XIAOMI_PAYMENT_SUCCESS, "购买成功"); //购买成功
        MiErrorCodeMsg.put(MiErrorCode.MI_XIAOMI_PAYMENT_ERROR_PAY_CANCEL, "取消购买"); //取消购买
        MiErrorCodeMsg.put(MiErrorCode.MI_XIAOMI_PAYMENT_ERROR_PAY_FAILURE, "购买失败"); //-18003 登录失败
        MiErrorCodeMsg.put(MiErrorCode.MI_XIAOMI_PAYMENT_ERROR_ACTION_EXECUTED, "登录操作正在进⾏中"); //-18006 操作正在进⾏中
    }

    public static String getMiErrorCodeMsg(int code) {
        return MiErrorCodeMsg.get(code, "未知错误 code:" + code);
    }

}
