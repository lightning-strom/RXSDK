package com.ruixue.openapi;


import android.app.Activity;

import androidx.annotation.NonNull;

import com.quicksdk.BaseCallBack;
import com.quicksdk.Extend;
import com.quicksdk.FuncType;
import com.quicksdk.User;
import com.quicksdk.entity.GameRoleInfo;
import com.ruixue.RXJSONCallback;
import com.ruixue.sdk.RXGameRoleInfo;
import com.ruixue.unity.UnityBaseCommonFun;
import com.ruixue.unity.UnityRXJSONCallback;
import com.ruixue.unity.UnityRXRequestCallback;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by wangliang on 2024/11/21
 */
public class QuickSdkHelper extends GameRoleInfo {

    static class Single {
        final static QuickSdkHelper INSTANCE = new QuickSdkHelper();
    }

    protected QuickSdkHelper() {
    }

    @NonNull
    public static QuickSdkHelper getInstance() {
        return Single.INSTANCE;
    }

    public void setGameRoleInfo(Activity activity, RXGameRoleInfo rxGameRoleInfo, boolean createRole) {
        User.getInstance().setGameRoleInfo(activity, rxGameRoleInfo, createRole);
    }

    public void verifyRealName(Activity activity, RXJSONCallback callback) {
        ThreadUtils.getInstance().runOnUiThread(() -> {
            if (Extend.getInstance().isFunctionSupported(FuncType.REAL_NAME_REGISTER)) {
                Extend.getInstance().callFunctionWithParamsCallBack(activity, FuncType.REAL_NAME_REGISTER, new BaseCallBack() {
                    @Override
                    public void onSuccess(Object... objects) {
                        if (objects != null && objects.length > 0) {
                            JSONObject jsonObject = (JSONObject) objects[0];
                            try {
                                // 用户id
                                String uid = jsonObject.getString("uid");
                                // 年龄, 如果渠道没返回默认为-1
                                int age = jsonObject.getInt("age");
                                // 是否已实名 true表示已实名
                                // false表示未实名,如果渠道没返回默认为false
                                boolean realName = jsonObject.getBoolean("realName");
                                // oppo实名认证失败之后是否可以继续游戏 true表示可以
                                // false表示不可以,如果渠道没返回默认为true
                                boolean resumeGame = jsonObject.getBoolean("resumeGame");
                                // 预留字段,如果渠道没返回默认为""的字符串
                                String other = jsonObject.getString("other");
                                // 游戏根据返回信息做对应的逻辑处理
                                if (callback != null) {
                                    callback.onSuccess(jsonObject);
                                }
                            } catch (JSONException e) {
                                if (callback != null) {
                                    callback.onFailed(JSONUtil.toJSONObject(-1, "data error"));
                                }
                            }
                        }
                    }

                    @Override
                    public void onFailed(Object... objects) {
                        if (callback != null) {
                            callback.onFailed(JSONUtil.toJSONObject(-1, ""));
                        }
                    }
                });
            } else {
                if (callback != null) {
                    callback.onFailed(JSONUtil.toJSONObject(-1, "unsupported real name"));
                }
            }
        });
    }

    public void UnityVerifyRealName(Activity activity, UnityRXRequestCallback callback) {
        verifyRealName(activity, UnityBaseCommonFun.convertCallback(callback));
    }

}
