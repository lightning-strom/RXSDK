package com.ruixue.error;

import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.ruixue.openapi.RXGlobalData;
import com.ruixue.utils.ResUtils;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

//增加枚举时请在 string.xml 中添加对应描述
public enum RXErrorCode {

    SUCCESS(0),

    PASSWORD_FORMAT_ERROR(3100), PASSWORD_NULL_ERROR(3101),

    INIT_PARAMS_ERROR(2000), INIT_ERROR(2001), //三方初始化错误
    THIRD_INIT_ERROR(2002),

    //登录错误
    LOGIN_ERROR(3000),
    /**
     * 登录取消
     */
    LOGIN_CANCEL(3001),
    THIRD_LOGIN_ERROR(3002), NOT_LOGIN_ERROR(3003),

    TOKEN_ERROR(3004),
    OTHER_LOGIN(3005),
    UNSUPPORTED_LOGIN(3006), //实名认证错误
    REAL_NAME_ERROR(3301), //三方实名认证错误
    THIRD_REAL_NAME_ERROR(3302),

    SHARE_PARAMS_ERROR(5000),
    SHARE_CANCEL(5001), SHARE_THIRD_ERROR(5002),

    //gps 定位失败
    GPS_DATA_ERROR(6020),

    /**
     * 关闭界面
     */
    UI_CLOSE(6010),
    /**
     * 不同意隐私协议
     */
    DISAGREE_PRIVACY(6000),
    /**
     * 账号注销取消
     */
    DEREGISTER_CANCEL(3201),

    PAY_ERROR(4000),
    /**
     * 支付取消
     */
    PAY_CANCEL(4001), //三方支付返回错误
    THIRD_PAY_ERROR(4002), //订单参数错误，或不支持的支付方式
    HQ_PARAMS_ERROR(4102), //订单返回数据错误，或拉起三方错误
    HQ_DATA_ERROR(4102),

    ORDER_PARAMS_ERROR(4101), //重复下单
    ORDER_REPEAT_ERROR(4100),

    PERMISSION_ERROR(6001),
    /**
     * 权限被拒绝并不再提示
     */
    PERMISSION_DENIED(6002),

    //微信未安装
    NOT_INSTALL_WECHAT(6101),

    // 通用的未安装APP
    NOT_INSTALL(6100),

    // 退出登录
    LOGIN_OUT(7000),

    ACCOUNT_CANCELLATION(7001),

    EXIT_GAME(7002),

    //未知三方错误
    THIRD_UNKNOWN_ERROR(8000), //未知错误
    UNKNOWN_ERROR(9000);

    public static final int OK = 0;
    public static final int UNKNOWN_THIRD_ERROR = 8000;
    public static final int UNKNOWN = 9000;

    //server code
    public static final int ACCESS_TOKEN_EXPIRE = 302001;
    public static final int REFRESH_TOKEN_EXPIRE = 302208;
    public static final int REFRESH_TOKEN_ERROR = 302209;
    public static final int LOGIN_OPENID_ERROR = 302205;
    private final int value;
    private String desc;
    private String lang;
    private Object thirdCode;
    private String thirdMsg;

    RXErrorCode(int value) {
        this.value = value;
        lang = RXGlobalData.getLanguage();
        String resStr = ResUtils.getInstance().getString("error_code_" + value);
        if (TextUtils.isEmpty(resStr)) {
            this.desc = ResUtils.getInstance().getString("error_code_" + UNKNOWN);
//            Log.w(RuiXueSdk.TAG, "请检查资源配置 :error_code_" + value);
        } else {
            this.desc = resStr;
        }
    }

    public int getValue() {
        return value;
    }

    public String getDesc() {
        if (TextUtils.isEmpty(desc) || !Objects.equals(this.lang, RXGlobalData.getLanguage())) {
            this.lang=RXGlobalData.getLanguage();
            this.desc = ResUtils.getInstance().getString("error_code_" + value);
        }
        String cusMsg = RXGlobalData.getCustomErrorMsg(this.value);
        if (!TextUtils.isEmpty(cusMsg)) {
            cusMsg = cusMsg.replace("$code$", "" + value);
            if (desc != null) {
                cusMsg = cusMsg.replace("$msg$", desc);
            } else {
                cusMsg = cusMsg.replace("$msg$", "");
            }
            if (thirdCode != null) {
                cusMsg = cusMsg.replace("$thirdcode$", "" + thirdCode);
            } else {
                cusMsg = cusMsg.replace("$thirdcode$", "");
            }
            if (thirdMsg != null) {
                cusMsg = cusMsg.replace("$thirdmsg$", thirdMsg);
            } else {
                cusMsg = cusMsg.replace("$thirdmsg$", "");
            }
            return cusMsg;
        } else {
            return desc;
        }

    }


    @NonNull
    public JSONObject toJSONObject(Object thirdCode, String thirdMsg) {
        return toJSONObject(thirdCode, thirdMsg, (String) null);
    }

    @NonNull
    public JSONObject toJSONObject(Object thirdCode, String thirdMsg, String traceId) {
        this.thirdCode = thirdCode;
        this.thirdMsg = thirdMsg;
        Map<String, Object> map = toMap();
        map.put("thirdcode", thirdCode);
        map.put("thirdmsg", thirdMsg);
        if (!TextUtils.isEmpty(traceId)) {
            map.put("trace_id", traceId);
        }
        return new JSONObject(map);
    }

    @NonNull
    public JSONObject toJSONObject(Map<String, Object> ext) {
        Map<String, Object> map = new HashMap<>();
        if (null != ext) {
            map.putAll(ext);
        }
        map.putAll(toMap());
        return new JSONObject(map);
    }


    @NonNull
    public JSONObject toJSONObject() {
        return new JSONObject(toMap());
    }

    @NonNull
    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("code", getValue());
        map.put("msg", getDesc());
        return map;
    }

    @NonNull
    @Override
    public String toString() {
        return "[" + this.value + "]" + this.desc;
    }
}
