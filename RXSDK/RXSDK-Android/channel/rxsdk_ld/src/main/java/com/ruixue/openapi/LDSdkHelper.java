package com.ruixue.openapi;

import android.app.Activity;
import com.ld.sdk.LdGameInfo;
import com.ld.sdk.LdSdkManger;
import com.ld.sdk.LdUserInfo;
import com.ld.sdk.account.api.EntryCallback;
import com.ld.sdk.account.api.UserEmpowerCallback;
import com.ld.sdk.account.api.VerifyIdCardListener;
import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.utils.JSONUtil;

import java.util.HashMap;
import java.util.Map;

public class LDSdkHelper {

    public static void checkUserEmpower(Activity activity, String url, RXJSONCallback callback) {
        LdSdkManger.getInstance().checkUserEmpower(activity, url, new UserEmpowerCallback() {
            @Override
            public void callback(boolean isEmpower) {
                if (isEmpower) {
                    callback.onSuccess(null);
                } else {
                    callback.onFailed(
                            JSONUtil.toJSONObject(RXErrorCode.DISAGREE_PRIVACY.getValue(),
                                    "用户没有授权协议")
                    );

                }
            }
        });
    }

    public static void enterGame(Activity activity, LdGameInfo ldGameInfo, RXJSONCallback callback) {
        LdSdkManger.getInstance().enterGame(activity, ldGameInfo, new EntryCallback() {
            @Override
            public void callback(int code, String desc) {
                if (code == 0) {
                    if (callback != null) {
                        callback.onSuccess(JSONUtil.toJSONObject(code,
                                desc)
                        );
                    }
                } else {
                    if (callback != null) {
                        callback.onFailed(JSONUtil.toJSONObject(code,
                                desc)
                        );
                    }
                }
            }
        });

    }

    public static LdUserInfo getUserInfo() {
        return LdSdkManger.getInstance().getUserInfo();
    }

    public static void verifyIdCard(boolean isForce, RXJSONCallback callback) {
        LdSdkManger.getInstance().verifyIdCard(isForce, new VerifyIdCardListener() {
            @Override
            public void callback(int code, String birthday, boolean isAdult) {
                HashMap<String, Object> map = new HashMap<>();
                map.put("code", code);
                map.put("birthday", birthday);
                map.put("isAdult", isAdult);
                if (callback != null) {
                    callback.onSuccess(JSONUtil.toJSONObject(map));
                }
            }
        });
    }

}
