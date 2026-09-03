package com.ruixue.base;

import android.text.TextUtils;

import com.ruixue.RuiXueSdk;
import com.ruixue.internal.DeviceUtils;
import com.ruixue.logger.RXLogger;
import com.ruixue.passport.LoginMethod;
import com.ruixue.storage.StorageLoginNum;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/6/14
 */
public class PresetEventHelper {


    public static final String CLICK_EMAIL_REGISTER = "1-2";        //点击邮箱注册
    public static final String OBTAIN_EMAIL_CODE_SUCCESS = "1-3";   //获取邮箱验证码成功
    public static final String OBTAIN_EMAIL_CODE_FAILED = "1-4";    //获取邮箱验证码失败
    public static final String EMAIL_VERIFY_CODE_SUCCESS = "1-5";   //校验验证码成功
    public static final String EMAIL_VERIFY_CODE_FAILED = "1-6";    //校验验证码失败
    public static final String EMAIL_SETPASSWORD_FAILED = "1-7";    //邮箱登录密码设置失败
    public static final String EMAIL_REGISTER_SUCCESS = "1-8";      //邮箱注册成功
    public static final String EMAIL_REGISTER_FAILED = "1-9";       //邮箱注册失败

    public static final String EMAIL_LOGIN_SUCCESS = "1-10";        //邮箱登录成功
    public static final String EMAIL_LOGIN_FAILED = "1-11";         //邮箱登录失败

    public static final String THIRD_LOGIN_OPEN = "2-1";            //三方登录点击打开授权页
    public static final String THIRD_AUTH_SUCCESS = "2-3-1  ";      //三方登录授权成功返回授权码上报通行证
    public static final String THIRD_AUTH_FAILED = "2-3-2  ";       //三方登录授权返回失败未返回授权码
    public static final String THIRD_LOGIN_FAILED = "2-4";          //三方登录失败
    public static final String THIRD_LOGIN_SUCCESS = "2-5";         //三方登录成功
    public static final String CLICK_PHONE_LOGIN = "3-1";   //点击手机号登录
    public static final String OBTAIN_PHONE_CODE_FAILED = "3-2";   //获取手机验证码失败
    public static final String OBTAIN_PHONE_CODE_SUCCESS = "3-3";   //获取手机验证码成功

    //    public static final String CLICK_EMAIL_LOGIN = "1-1";           //"=点击邮箱登录
    public static final String PHONE_LOGIN_SUCCESS = "3-4";   //手机号登录成功
    public static final String PHONE_LOGIN_FAILED = "3-5";   //手机号登录失败
    public static final String CLICK_GUEST_LOGIN = "4-1";   //点击游客登录
    public static final String GUEST_LOGIN_SUCCESS = "4-2";   //游客登录成功
    public static final String GUEST_LOGIN_FAILED = "4-3";  //游客登录失败"

    public static final String VERSIONCHECK_STAGE_START = "1";
    public static final String VERSIONCHECK_STAGE_FAILED = "2-1";//请求结果返回失败
    public static final String VERSIONCHECK_STAGE_SUCCESS = "2-2";// 请求结果返回成功

    public static Map<String, String> methodMap = new HashMap<>();


    public static boolean enable = false;

    public static boolean isEnable() {
        return enable;
    }

    public static void setEnable(boolean enable) {
        PresetEventHelper.enable = enable;
    }

    static {
        methodMap.put(LoginMethod.USERNAME, "1-1");
        methodMap.put(LoginMethod.GOOGLE, "2-1");
        methodMap.put(LoginMethod.FACEBOOK, "2-2");
        methodMap.put(LoginMethod.ZALO, "2-3");
        methodMap.put(LoginMethod.HUAWEI, "2-4");
        methodMap.put(LoginMethod.TAPTAP, "2-5");
        methodMap.put(LoginMethod.LINE, "2-6");
        methodMap.put(LoginMethod.TIKTOK, "2-8");
        methodMap.put(LoginMethod.QOO, "2-9");
        methodMap.put(LoginMethod.INSTAGRAM, "2-10");
        methodMap.put(LoginMethod.REDDIT, "2-11");
        methodMap.put(LoginMethod.CAPTCHACODE, "3-1");
        methodMap.put(LoginMethod.GUEST, "4-1");
    }

    public static void checkVersion(String stage, String code, String msg) {
        if (!isEnable())
            return;
        if (isFirstLogin()) {
            Map<String, Object> map = new HashMap<>();
            map.put("version_check_action", stage);
            String distinctId = RuiXueSdk.getDistinctId();
            map.put("client_distinct_id", distinctId);
            map.put("sdk_version", BuildConfig.BUILD);
            if (!TextUtils.isEmpty(code)) {
                map.put("code", code);
            }
            if (!TextUtils.isEmpty(msg)) {
                map.put("msg", msg);
            }
            TrackDataMgr.getInstance().trackAtTimeAsync("#version_check_process", map);
        }
    }


    //#login_process
    public static String getLoginType(String method) {
        if (LoginMethod.USERNAME.equals(method)) {
            return "1";
        } else if (LoginMethod.CAPTCHACODE.equals(method)) {
            return "3";
        } else if (LoginMethod.GUEST.equals(method)) {
            return "4";
        } else {
            return "2";
        }
    }

    public static String getLoginCategory(String method) {
        return methodMap.containsKey(method) ? methodMap.get(method) : method;
    }

    public static String getDistinctId() {
        return DeviceUtils.getDistinctId(RuiXueSdk.getContext());
    }

    public static boolean isFirstLogin() {
        return StorageLoginNum.getInstance().isFirstLogin();
    }

    //#agreement_process
    public static void privacyClick(boolean isAgree) {
        if (!isEnable())
            return;
        if (isFirstLogin()) {
            Map<String, Object> map = new HashMap<>();
            map.put("agreement_action", isAgree ? "0" : "1");
            String distinctId = RuiXueSdk.getDistinctId();
            map.put("client_distinct_id", distinctId);
            map.put("sdk_version", BuildConfig.BUILD);
            TrackDataMgr.getInstance().trackAtTimeAsync("#agreement_process", map);
        }
    }

    //#login_page_show
    //
    public static void loginShow() {
        if (!isEnable())
            return;
        if (isFirstLogin()) {

            Map<String, Object> map = new HashMap<>();
            String distinctId = RuiXueSdk.getDistinctId();
            map.put("client_distinct_id", distinctId);
            map.put("sdk_version", BuildConfig.BUILD);
            TrackDataMgr.getInstance().trackAtTimeAsync("#login_page_show", map);
        }

    }

    public static void loginHide() {
        if (!isEnable())
            return;
        if (isFirstLogin()) {

            Map<String, Object> map = new HashMap<>();
            String distinctId = RuiXueSdk.getDistinctId();
            map.put("client_distinct_id", distinctId);
            map.put("sdk_version", BuildConfig.BUILD);
            TrackDataMgr.getInstance().trackAtTimeAsync("#login_page_hide", map);

        }
    }

    public static void loginClick(String method) {
        if (!isEnable())
            return;
        Map<String, Object> map = new HashMap<>();
        String type = getLoginType(method);
        map.put("login_type", type);
        map.put("login_category", getLoginCategory(method));
        map.put("login_action", type + "-1");
        track(map);
    }

    public static void loginBefore(Map<String, Object> map) {

    }

    public static void loginAuth(String method, boolean success, JSONObject jsonObject) {
        if (!isEnable())
            return;
        String type = getLoginType(method);
        if (type.equals("2")) {//三方
            Map<String, Object> map = new HashMap<>();
            Map<String, Object> m = JSONUtil.toMap(jsonObject);
            if (m != null) {
                map.putAll(m);
            }
            map.put("login_type", type);
            map.put("login_category", getLoginCategory(method));
            map.put("login_action", type + (success ? "-3-1" : "-3-2"));
            track(map);
        }
    }

    public static void loginResult(String method, boolean success, JSONObject jsonObject) {
        if (!isEnable())
            return;
        Map<String, Object> map = new HashMap<>();
        Map<String, Object> m = JSONUtil.toMap(jsonObject);
        if (m != null) {
            map.putAll(m);
        }
        String type = getLoginType(method);
        map.put("login_type", type);
        map.put("login_category", getLoginCategory(method));

        if (type.equals("1")) {//账号
            map.put("login_action", type + (success ? "-10" : "-11"));
            track(map);
        } else if (type.equals("2")) {//三方
            map.put("login_action", type + (success ? "-4" : "-5"));
            track(map);
        } else if (type.equals("3")) {//手机号
            map.put("login_action", type + (success ? "-4" : "-5"));
            track(map);
        } else if (type.equals("4")) {//游客
            map.put("login_action", type + (success ? "-2" : "-3"));
            track(map);
        }
    }

    public static void verifyCode(boolean success, String purpose, boolean isEmail, JSONObject jsonObject) {
        if (!isEnable())
            return;
        Map<String, Object> map = new HashMap<>();
        Map<String, Object> m = JSONUtil.toMap(jsonObject);
        if (m != null) {
            map.putAll(m);
        }
        String method = isEmail ? LoginMethod.USERNAME : LoginMethod.CAPTCHACODE;
        map.put("login_type", getLoginType(method));
        map.put("login_category", getLoginCategory(method));
        if (isEmail) {
            map.put("login_action", success ? EMAIL_VERIFY_CODE_SUCCESS : EMAIL_VERIFY_CODE_FAILED);
            track(map);
        }
    }

    public static void setPassword(boolean success, JSONObject jsonObject) {
        if (!isEnable())
            return;
        if (!success) {
            Map<String, Object> map = new HashMap<>();
            Map<String, Object> m = JSONUtil.toMap(jsonObject);
            if (m != null) {
                map.putAll(m);
            }
            map.put("login_type", getLoginType(LoginMethod.USERNAME));
            map.put("login_category", getLoginCategory(LoginMethod.USERNAME));
            map.put("login_action", EMAIL_SETPASSWORD_FAILED);
            track(map);
        }
    }


    public static void emailRegisterClick() {
        if (!isEnable())
            return;
        Map<String, Object> map = new HashMap<>();
        map.put("login_type", getLoginType(LoginMethod.USERNAME));
        map.put("login_category", getLoginCategory(LoginMethod.USERNAME));
        map.put("login_action", CLICK_EMAIL_REGISTER);
        track(map);

    }

    public static void emailRegister(boolean success, JSONObject jsonObject) {
        if (!isEnable())
            return;
        Map<String, Object> map = new HashMap<>();
        Map<String, Object> m = JSONUtil.toMap(jsonObject);
        if (m != null) {
            map.putAll(m);
        }
        map.put("login_type", getLoginType(LoginMethod.USERNAME));
        map.put("login_category", getLoginCategory(LoginMethod.USERNAME));
        map.put("login_action", success ? EMAIL_REGISTER_SUCCESS : EMAIL_REGISTER_FAILED);
        track(map);
    }

    public static void getCaptchaCode(boolean success, String purpose, boolean isEmail, JSONObject jsonObject) {
        if (!isEnable())
            return;
        Map<String, Object> map = new HashMap<>();
        Map<String, Object> m = JSONUtil.toMap(jsonObject);
        if (m != null) {
            map.putAll(m);
        }
        String method = isEmail ? LoginMethod.USERNAME : LoginMethod.CAPTCHACODE;
        map.put("login_type", getLoginType(method));
        map.put("login_category", getLoginCategory(method));
        if (purpose != null && purpose.equals(CaptchaPurpose.LOGIN) && !isEmail) {
            map.put("login_action", success ? OBTAIN_PHONE_CODE_SUCCESS : OBTAIN_PHONE_CODE_FAILED);
            track(map);
        } else if (purpose != null && purpose.equals(CaptchaPurpose.REGISTER)) {
            if (isEmail) {
                map.put("login_action", success ? OBTAIN_EMAIL_CODE_SUCCESS : OBTAIN_EMAIL_CODE_FAILED);
            } else {
                map.put("login_action", success ? OBTAIN_PHONE_CODE_SUCCESS : OBTAIN_PHONE_CODE_FAILED);
            }
            track(map);
        }

    }

    private static void track(Map<String, Object> map) {
        if (!isEnable())
            return;
        if (isFirstLogin()) {

            String distinctId = RuiXueSdk.getDistinctId();
            map.put("client_distinct_id", distinctId);
            map.put("sdk_version", BuildConfig.BUILD);
            TrackDataMgr.getInstance().trackAtTimeAsync("#login_process", map);
        }
    }

}
