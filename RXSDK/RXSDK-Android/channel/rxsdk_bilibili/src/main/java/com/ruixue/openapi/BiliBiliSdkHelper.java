package com.ruixue.openapi;

import android.app.Activity;
import android.os.Bundle;
import android.text.TextUtils;

import com.bsgamesdk.android.callbacklistener.BSGameSdkError;
import com.bsgamesdk.android.callbacklistener.CallbackListener;
import com.bsgamesdk.android.callbacklistener.ExitCallbackListener;
import com.gsc.pub.GSCPubCommon;
import com.ruixue.RXJSONCallback;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.utils.BundleUtils;
import com.ruixue.utils.JSONUtil;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/7/9
 */
public class BiliBiliSdkHelper {

    /**
     * 通知区服
     *
     * @param serverId   平台分配的serverId
     * @param serverName 平台分配的serverName
     * @param roleId     角色id
     * @param roleName   角色名
     */
    public static void notifyZone(String serverId, String serverName, String roleId, String roleName) {
        GSCPubCommon.getInstance().notifyZone(serverId, serverName, roleId, roleName);
    }

    /**
     * 账号注销
     *
     * @param gameRoleJSONString 当前游戏下此⽤户Android和iOS的游戏⻆⾊信息json格式的字符串
     *                           role_name:⻆⾊名
     *                           server_name:区服名
     *                           level:等级
     *                           time:⻆⾊创建时间,请按格式传递，如：2021.12.24
     *                           请传⼊平台账号下所有⻆⾊信息，包含哔哩哔哩iOS、哔哩哔哩 Android平台，如果传⼊空数据或空数组，则SDK会展示默认的提示⽂案
     *                           请保证每个⻆⾊信息字段保持⼀致，⽇期请按规定格式传递
     *                           数据样例:
     *                           [{
     *                           "role_name": "⻆⾊名1",
     *                           "server_name": "区服1",
     *                           "level": "1",
     *                           "time": "2021.01.01"
     *                           }, {
     *                           "role_name": "⻆⾊名2",
     *                           "server_name": "区服2",
     *                           "level": "2",
     *                           "time": "2021.01.01"
     *                           }]
     * @param callback           callback
     */
    public static void closeAccountWithUserInfo(String gameRoleJSONString, RXJSONCallback callback) {
        GSCPubCommon.getInstance().closeAccountWithUserInfo(gameRoleJSONString, new CallbackListener() {
            @Override
            public void onSuccess(Bundle bundle) {
                String tips = bundle.getString("tips");
                String data = bundle.getString("data");
                try {
                    JSONObject jsonObject = new JSONObject(data);
                    //enabled 账号注销功能是否开启：true：注销账号成功，当账号注销成功后，需要游戏退出当前账号，且调⽤SDK logout接⼝，并回到游戏登录界⾯
                    String enabled = jsonObject.getString("enabled");
                    //voucher_no账号注销成功凭证
//                    String voucherNo = jsonObject.getString("voucher_no");
                    if (null != callback) {
                        if ("true".equals(enabled)) {
                            jsonObject.put("code", RXErrorCode.SUCCESS.getValue());
                            callback.onSuccess(jsonObject);
                        } else {
                            jsonObject.put("code", RXErrorCode.DEREGISTER_CANCEL.getValue());
                            callback.onFailed(jsonObject);
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                    if (null != callback) {
                        callback.onError(new RXException(e));
                    }
                }
            }

            @Override
            public void onFailed(BSGameSdkError bsGameSdkError) {
                if (null != callback) {
                    callback.onFailed(RXErrorCode.THIRD_UNKNOWN_ERROR.toJSONObject(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage()));
                }
            }

            @Override
            public void onError(BSGameSdkError bsGameSdkError) {
                if (null != callback) {
                    callback.onFailed(RXErrorCode.THIRD_UNKNOWN_ERROR.toJSONObject(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage()));
                }
            }
        });
    }

    /**
     * 创角
     *
     * @param roleName 角色名
     * @param roleId   角色id
     */
    public static void createRole(String roleName, String roleId) {
        GSCPubCommon.getInstance().createRole(roleName, roleId);

    }

    /**
     * 停止心跳
     */
    public static void stopHeart(Activity activity) {
        GSCPubCommon.getInstance().stopHeart(activity);

    }

    /**
     * 开启心跳
     */
    public static void startHeart(Activity activity) {
        GSCPubCommon.getInstance().startHeart(activity);

    }

    /**
     * 获取sdk_type
     */
    public static String getSdkType() {
        String sdkType = GSCPubCommon.getInstance().getSdkType();
        return sdkType;

    }

    /**
     * 获取渠道id
     */
    public static String getChannelId(Activity activity) {

        String channelId = GSCPubCommon.getInstance().getChannelId(activity);
        return channelId;

    }

    /**
     * 获取设备指纹
     */
    public static String getFingerprint() {

        String fingerPrint = GSCPubCommon.getInstance().getFingerprint();
        return fingerPrint;


    }

    /**
     * 平台的退出接口
     */
    public static void exit(OnAppExitCallback callback) {
        GSCPubCommon.getInstance().exit(new ExitCallbackListener() {
            @Override
            public void onExit() {
                if (null != callback)
                    callback.onExitConfirm("");
            }
        });
    }

    /**
     * 判断SDK是否处于登录状态
     */
    public static void checkLogin(RXJSONCallback callback) {

        GSCPubCommon.getInstance().isLogin(new CallbackListener() {
            @Override
            public void onSuccess(Bundle bundle) {
                boolean isLogin = bundle.getBoolean("logined", false);
                Map<String, Object> map = new HashMap<>();
                map.put("logined", isLogin);
                callback.onSuccess(new JSONObject(map));
            }

            @Override
            public void onFailed(BSGameSdkError bsGameSdkError) {
                callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage()));
            }

            @Override
            public void onError(BSGameSdkError bsGameSdkError) {
                callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage()));
            }
        });

    }

    /**
     * 判断是否实名
     */
    public static void isRealNameAuth(RXJSONCallback callback) {

        GSCPubCommon.getInstance().isRealNameAuth(new CallbackListener() {
            public void onSuccess(Bundle bundle) {
                boolean isRealNameAuth = bundle.getBoolean("isRealNameAuth", false);
                Map<String, Object> map = new HashMap<>();
                map.put("isRealNameAuth", isRealNameAuth);
                callback.onSuccess(new JSONObject(map));
            }

            @Override
            public void onFailed(BSGameSdkError bsGameSdkError) {
                callback.onFailed(RXErrorCode.THIRD_REAL_NAME_ERROR.toJSONObject(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage()));
            }

            @Override
            public void onError(BSGameSdkError bsGameSdkError) {

                callback.onFailed(RXErrorCode.THIRD_REAL_NAME_ERROR.toJSONObject(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage()));
            }
        });

    }

    /**
     * 清除SDK登录态
     */
    public static void logout(OnLogoutCallback callback) {
        GSCPubCommon.getInstance().logout(new CallbackListener() {
            @Override
            public void onSuccess(Bundle bundle) {
                String tips = bundle.getString("tips");
                if (null != callback)
                    callback.onSuccess(tips);
            }

            @Override
            public void onFailed(BSGameSdkError bsGameSdkError) {
                if (null != callback) callback.onFailed(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage());
            }

            @Override
            public void onError(BSGameSdkError bsGameSdkError) {
                 if (null != callback) callback.onFailed(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage());
            }
        });

    }

    /**
     * 获取用户信息
     */
    public static void getUserInfo(RXJSONCallback callback) {
        GSCPubCommon.getInstance().getUserInfo(new CallbackListener() {
            @Override
            public void onSuccess(Bundle bundle) {
                // 此处为操作成功时执行，返回值通过Bundle传回
                Map<String, Object> map = new HashMap<>();
                map.put("uid", bundle.getString("uid"));
                map.put("username", bundle.getString("username"));
                map.put("access_token", bundle.getString("access_token"));
                map.put("expire_times", bundle.getString("expire_times"));
                map.put("refresh_token", bundle.getString("refresh_token"));
                map.put("lastLoginTime", bundle.getString("last_login_time"));
                map.put("avatar", bundle.getString("avatar"));
                map.put("s_avatar", bundle.getString("s_avatar"));
                callback.onSuccess(new JSONObject(map));
            }

            @Override
            public void onFailed(BSGameSdkError bsGameSdkError) {
                callback.onFailed(RXErrorCode.THIRD_UNKNOWN_ERROR.toJSONObject(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage()));
            }

            @Override
            public void onError(BSGameSdkError bsGameSdkError) {
                callback.onFailed(RXErrorCode.THIRD_UNKNOWN_ERROR.toJSONObject(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage()));
            }
        });

    }

    /**
     * 账号保护
     */
    public static void accountProtect(RXJSONCallback callback) {
        GSCPubCommon.getInstance().accountProtect(new CallbackListener() {
            @Override
            public void onSuccess(Bundle bundle) {
                final String result = bundle.getString("result");
                callback.onSuccess(JSONUtil.toJSONObject(RXErrorCode.SUCCESS.getValue(), bundle.getString("result")));
            }

            @Override
            public void onFailed(BSGameSdkError bsGameSdkError) {
                callback.onFailed(RXErrorCode.THIRD_UNKNOWN_ERROR.toJSONObject(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage()));
            }

            @Override
            public void onError(BSGameSdkError bsGameSdkError) {
                callback.onFailed(RXErrorCode.THIRD_UNKNOWN_ERROR.toJSONObject(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage()));
            }
        });

    }

    /**
     * 显示游戏用户协议
     */
    public static void showAgreementWithLicence(RXJSONCallback callback) {

        GSCPubCommon.getInstance().showAgreementWithLicence(new CallbackListener() {
            @Override
            public void onSuccess(Bundle bundle) {
                callback.onSuccess(BundleUtils.toJSONObject(bundle));
            }

            @Override
            public void onFailed(BSGameSdkError bsGameSdkError) {
                callback.onFailed(RXErrorCode.THIRD_UNKNOWN_ERROR.toJSONObject(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage()));
            }

            @Override
            public void onError(BSGameSdkError bsGameSdkError) {
                callback.onFailed(RXErrorCode.THIRD_UNKNOWN_ERROR.toJSONObject(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage()));
            }
        });

    }

    /**
     * 显示游戏隐私政策
     */
    public static void showAgreementWithPrivacy(RXJSONCallback callback) {

        GSCPubCommon.getInstance().showAgreementWithPrivacy(new CallbackListener() {
            @Override
            public void onSuccess(Bundle bundle) {
                callback.onSuccess(BundleUtils.toJSONObject(bundle));
            }

            @Override
            public void onFailed(BSGameSdkError bsGameSdkError) {
                callback.onFailed(RXErrorCode.THIRD_UNKNOWN_ERROR.toJSONObject(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage()));
            }

            @Override
            public void onError(BSGameSdkError bsGameSdkError) {
                callback.onFailed(RXErrorCode.THIRD_UNKNOWN_ERROR.toJSONObject(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage()));
            }
        });

    }

    /**
     * 显示人机验证
     */
    public static void showGeetestView(RXJSONCallback callback) {

        GSCPubCommon.getInstance().showGeetestView(new CallbackListener() {
            @Override
            public void onSuccess(Bundle bundle) {
                String captcha_type = bundle.getString("captcha_type");
                String image_token = bundle.getString("image_token");
                String captcha_code = bundle.getString("captcha_code");
                String challenge = bundle.getString("challenge");
                String validate = bundle.getString("validate");
                String seccode = bundle.getString("seccode");
                String gt_user_id = bundle.getString("gt_user_id");
                String captcha_json = bundle.getString("captcha_json");
                Map<String, Object> map = new HashMap<>();

                map.put("gt_user_id", !TextUtils.isEmpty(gt_user_id) ? gt_user_id : "");
                map.put("captcha_type", !TextUtils.isEmpty(captcha_type) ? captcha_type : "");
                map.put("image_token", !TextUtils.isEmpty(image_token) ? image_token : "");
                map.put("captcha_code", !TextUtils.isEmpty(captcha_code) ? captcha_code : "");
                map.put("challenge", !TextUtils.isEmpty(challenge) ? challenge : "");
                map.put("validate", !TextUtils.isEmpty(validate) ? validate : "");
                map.put("seccode", !TextUtils.isEmpty(seccode) ? seccode : "");
                map.put("captcha_json", !TextUtils.isEmpty(captcha_json) ? captcha_json : "");
                callback.onSuccess(new JSONObject(map));
            }

            @Override
            public void onFailed(BSGameSdkError bsGameSdkError) {
                callback.onFailed(RXErrorCode.THIRD_UNKNOWN_ERROR.toJSONObject(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage()));
            }

            @Override
            public void onError(BSGameSdkError bsGameSdkError) {
                callback.onFailed(RXErrorCode.THIRD_UNKNOWN_ERROR.toJSONObject(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage()));
            }
        });

    }
}
