package com.ruixue.openapi;

import android.app.Activity;

import androidx.annotation.Nullable;

import com.baidu.gamesdk.BDGameSDK;
import com.baidu.gamesdk.IResponse;
import com.baidu.platformsdk.ICallback;
import com.baidu.platformsdk.update.GameUpdateModel;
import com.ruixue.RXJSONCallback;
import com.ruixue.utils.JSONUtil;


/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/29
 */
public class BDSdkHelper {

    public static boolean isLogined() {
        return BDGameSDK.isLogined();
    }

    public static String getLoginUid() {
        return BDGameSDK.getLoginUid();
    }

    public static void showSplash(Activity activity, RXJSONCallback callback) {
        BDGameSDK.showSplash(activity, (i, s, unused) -> {
            if (i == 0) {
                callback.onSuccess(JSONUtil.toJSONObject(i, s));
            } else {
                callback.onFailed(JSONUtil.toJSONObject(i, s));
            }
        });
    }

    public static String getLoginAccessToken() {
        return BDGameSDK.getLoginAccessToken();
    }

    public static void logout() {
        BDGameSDK.logout();
    }

    /**
     * 显示悬浮窗
     */
    public static void showFloatView(Activity activity) {
        BDGameSDK.showFloatView(activity);
    }

    /**
     * 关闭悬浮窗
     */
    public static void closeFloatView(Activity activity) {
        BDGameSDK.closeFloatView(activity);
    }

    /**
     * 游戏用户角色信息上报（网游必接）
     * @param data
     */
    public static void reportUserData(String data) {
        BDGameSDK.reportUserData(data);
    }

    //设置切换账号事件监听（个人中心界面切换账号）
    public static void setSuspendWindowChangeAccountListener(Activity activity, IResponse<Void> responser) {
        BDGameSDK.setSuspendWindowChangeAccountListener(activity, responser);
    }

    public static void setSessionInvalidListener(IResponse<Void> responser) {
        BDGameSDK.setSessionInvalidListener(responser);
    }

    /**
     * 【必接】防沉迷相关设置
     */
    public static void setAntiAddictionListener(Activity activity) {
        // 设置防沉迷系统回调，如果用户在线时长累计超过规定值，会触发该回调
        BDGameSDK.setAntiAddictionListener((resultCode, resultDesc, extraData) -> {
            // 默认直接弹出游玩超时弹窗退出游戏，厂商也可以根据自己需要进行自己的防沉迷设计
            BDGameSDK.forceCloseDialog(activity);

        });
    }

    /**
     * 游戏更新提示
     */
    public static void queryGameUpdateInfo(Activity activity, @Nullable ICallback<GameUpdateModel> callback) {
        if (callback != null) {
            BDGameSDK.queryGameUpdateInfo(activity, callback);
        } else {
            BDGameSDK.queryGameUpdateInfo(activity);
        }
    }

    // 实名认证状态查询
    public static void queryLoginUserAuthenticateState(Activity activity, final IResponse<Integer> queryLoginUserAuthenticateState) {
        BDGameSDK.queryLoginUserAuthenticateState(activity, queryLoginUserAuthenticateState);
    }
}
