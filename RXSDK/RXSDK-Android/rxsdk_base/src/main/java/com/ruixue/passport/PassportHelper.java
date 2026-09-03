package com.ruixue.passport;

import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.ruixue.RXJSONCallback;
import com.ruixue.openapi.RXApiHelper;

import java.util.HashMap;
import java.util.Map;

public class PassportHelper {

    private static Map<String, Object> createBodyMap(  String method) {
        Map<String, Object> bodyMap = new HashMap<>();
        bodyMap.put("method", method);
        return bodyMap;
    }

    public static void loginByGuest(RXJSONCallback loginCallback) {
        Map<String, Object> bodyMap = createBodyMap(LoginMethod.GUEST);
        RXApiHelper.Passport.login(bodyMap, loginCallback);
    }

    public static void loginByWechat(@NonNull String appid, RXJSONCallback loginCallback) {
        Map<String, Object> bodyMap = createBodyMap(LoginMethod.WECHAT);
        bodyMap.put("appid", appid);
        // call wechat auth
//        WeChatManager.loginByWechat(activity, hashMap, channelCallback);
        RXApiHelper.Passport.login(bodyMap, loginCallback);
    }

    public static void loginByUserName(@NonNull String userName, @NonNull String password, RXJSONCallback loginCallback) {
        Map<String, Object> bodyMap = createBodyMap(LoginMethod.USERNAME);
        bodyMap.put("username", userName);
        bodyMap.put("password", password);
        RXApiHelper.Passport.login(bodyMap, loginCallback);
    }

    public static void loginByAlimobile(@NonNull String alikey, String privacyOneUrl, String privacyTwoUrl, RXJSONCallback loginCallback) {
        Map<String, Object> bodyMap = createBodyMap(LoginMethod.QUICKPHONE);
        bodyMap.put("alikey", alikey);
        bodyMap.put("privacyOneUrl", privacyOneUrl);
        bodyMap.put("privacyTwoUrl", privacyTwoUrl);
        RXApiHelper.Passport.login(bodyMap, loginCallback);
    }

    public static void loginByVirtual(Map<String, Object> paramsMap, RXJSONCallback loginCallback) {
        Map<String, Object> bodyMap = createBodyMap(LoginMethod.VIRTUAL);
        bodyMap.putAll(paramsMap);
        RXApiHelper.Passport.login(bodyMap, loginCallback);
    }

    public static void registerByAccount(@NonNull String userName, @NonNull String password, RXJSONCallback loginCallback) {
        register(1, userName, password, "", loginCallback);
    }

    public static void registerByMobileNum(@NonNull String userName, @NonNull String password, @NonNull String captchaCode, RXJSONCallback registerCallback) {
        register(2, userName, password, captchaCode, registerCallback);
    }

    public static void registerByEmail(@NonNull String userName, @NonNull String password, @NonNull String captchaCode, RXJSONCallback registerCallback) {
        register(3, userName, password, captchaCode, registerCallback);
    }

    //注册类型（1-普通账号注册，2-手机号注册,3-邮箱注册）
    public static void register(int type, @NonNull String userName, @NonNull String password, @NonNull String captchaCode, RXJSONCallback registerCallback) {
        Map<String, Object> hashMap = new HashMap<>();
//        hashMap.put("type", type);
        hashMap.put("username", userName.trim());
        hashMap.put("password", password.trim());
        hashMap.put("captcha_code", captchaCode);
        RXApiHelper.Passport.register(hashMap, registerCallback);
    }

    public static void deregister(String realName, String idCard, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("realname", realName);
        hashMap.put("idcard", idCard.toUpperCase());
        RXApiHelper.Passport.deregister(hashMap, callback);
    }

    public static void deregisterCancel(RXJSONCallback callback) {
        RXApiHelper.Passport.deregisterCancel(new HashMap<>(), callback);
    }

    public static void certification(String realName, String idCard, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("realname", realName.trim());
        hashMap.put("idcard", idCard.trim().toUpperCase());
        RXApiHelper.Passport.certification(hashMap, callback);
    }

    public static void changePassword(@NonNull String newPassword, @NonNull String oldPassword, RXJSONCallback changePasswordCallback) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("new_password", newPassword.trim());
        hashMap.put("old_password", oldPassword.trim());
        RXApiHelper.Passport.changePwd(hashMap, changePasswordCallback);
    }

    public static void resetPassword(@NonNull String username, @NonNull String password, @NonNull String captchaCode, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("username", username);
        hashMap.put("password", password);
        hashMap.put("captcha_code", captchaCode);
        RXApiHelper.Passport.resetPwd(hashMap, callback);
    }

    public static void bindPhone(@NonNull String phone, @NonNull String password, @NonNull String captchaCode, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("password", password.trim());
        hashMap.put("captcha_code", captchaCode.trim());
        hashMap.put("phone", phone.trim());
        RXApiHelper.Passport.bindPhone(hashMap, callback);
    }

    public static void bindEmail(@NonNull String email, @NonNull String password, @NonNull String captchaCode, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("password", password.trim());
        hashMap.put("captcha_code", captchaCode.trim());
        hashMap.put("email", email.trim());
        RXApiHelper.Passport.bindEmail(hashMap, callback);
    }

    public static void unbindPhone(@NonNull String phone, @NonNull String captchaCode, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("captcha_code", captchaCode.trim());
        hashMap.put("phone", phone.trim());
        RXApiHelper.Passport.unbindPhone(hashMap, callback);
    }

    public static void unbindEmail(@NonNull String email, @NonNull String captchaCode, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("captcha_code", captchaCode.trim());
        hashMap.put("email", email.trim());
        RXApiHelper.Passport.unbindEmail(hashMap, callback);
    }

    public static void getUserInfo( RXJSONCallback callback) {
        RXApiHelper.Passport.getUserInfo( callback);
    }

    public static void getUserInfoByField(Map<String, Object> map, RXJSONCallback callback) {
        RXApiHelper.Passport.getUserInfoByField(map, callback);
    }

    public static void updateUserInfo(String nickname, int sex, String avatarUrl, String wechatAvatarUrl, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        if (sex > 0) {
            hashMap.put("sex", sex);
        }
        if (!TextUtils.isEmpty(nickname)) {
            hashMap.put("nickname", nickname);
        }
        if (!TextUtils.isEmpty(avatarUrl)) {
            hashMap.put("avatarurl", avatarUrl);
        }
        if (!TextUtils.isEmpty(wechatAvatarUrl)) {
            hashMap.put("wechat_avatarurl", wechatAvatarUrl);
        }
        RXApiHelper.Passport.updateUserInfo(hashMap, callback);
    }

}


