package com.ruixue.wechat;

import android.util.SparseArray;

import com.tencent.mm.opensdk.modelbase.BaseResp;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/3/31
 */
public abstract class WXErrCode implements BaseResp.ErrCode {
    public static final int ERR_UNKNOWN = -7;
    /**
     * 前后台返回 mock 错误码
     */
    public static final int ERR_RESUME = -8;
    public static final int ERR_UNINIT = -9;


    public static String getMsg(int errCode) {
        return codeMsg.get(errCode, "未知错误 " + errCode);
    }

    protected static SparseArray<String> codeMsg = new SparseArray<>();

    static {
        codeMsg.put(WXErrCode.ERR_OK, "成功");
        codeMsg.put(WXErrCode.ERR_COMM, "一般错误");
        codeMsg.put(WXErrCode.ERR_USER_CANCEL, "取消");
        codeMsg.put(WXErrCode.ERR_SENT_FAILED, "发送失败");
        codeMsg.put(WXErrCode.ERR_AUTH_DENIED, "授权认证被否决");
        codeMsg.put(WXErrCode.ERR_UNSUPPORT, "不支持错误");
        codeMsg.put(WXErrCode.ERR_BAN, "被屏蔽所有操作，可能由于签名不正确或无权限");
    }
}
