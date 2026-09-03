package com.ruixue.demo.helper;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RXRequestCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.RXUICallback;
import com.ruixue.demo.GlobalConfig;
import com.ruixue.demo.utils.Logger;
import com.ruixue.error.RXException;
import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXLoginUIModel;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXSdkApiFactory;
import com.ruixue.openapi.RXSdkUI;
import com.ruixue.passport.LoginMethod;
import com.ruixue.qipai.R;
import com.ruixue.utils.ActivityUtils;
import com.ruixue.utils.JSONUtil;

import org.json.JSONObject;

import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

public class LoginV2DemoHelper {

    private static final RXSdkUI UI_API = RXSdkApiFactory.getRxUiAPI();
    private static final RXSdkApi RX_API = RXSdkApi.getInstance();

    private static Handler sHandler;
    @SuppressLint("StaticFieldLeak")
    private static Context sContext;

    public static void setContext(Context context) {
        sContext = context;
    }

    public static void setHandler(Handler handler) {
        sHandler = handler;
    }

    public static void showLog(String json) {
        Logger.i("showLog:" + json);
        if (sHandler != null) {
            Message msg = new Message();
            msg.what = 0;
            msg.obj = json;
            sHandler.sendMessage(msg);
        } else if (sContext != null) {
            Toast.makeText(sContext, json, Toast.LENGTH_SHORT).show();
        }
    }

    private static final RXJSONCallback callback = new RXRequestCallback() {
        @Override
        public Map<String, Object> onClickHandle(Map<String, Object> params) {
            return null;
        }

//        @Override
//        public void onSuccess(@Nullable JSONObject data) {
//            if (null != data)
//                showLog(data.toString());
//
//        }
//
//        @Override
//        public void onFailed(@NonNull JSONObject cause) {
//            showLog(cause.toString());
//        }

        @Override
        public void onResponse(JSONObject jsonObject) {
            showLog(jsonObject.toString());
        }

        @Override
        public void onError(RXException e) {
            e.printStackTrace();
            showLog(e.getMessage());
        }
    };

    private static final String TAG = LoginV2DemoHelper.class.getSimpleName();

    public static void loginByGuest(Activity activity, boolean openMainActivity) {
        login(activity, "guest", null, openMainActivity);
    }

    /**
     * 微信登录
     */
    public static void loginWechat(Activity activity, RXJSONCallback channelCallback) {
        Log.e(TAG, "cmmmand+p goto: " + ((new Throwable().getStackTrace()[0])).getFileName() + " " + ((new Throwable().getStackTrace()[0])).getLineNumber());
        Map<String, Object> wxhashmap = new HashMap<>();
//        wxhashmap.put("appid", GlobalConfig.getWxAppId());

        wxhashmap.put("method", "wechat");
        RXSdkApi.getInstance().login(activity, wxhashmap, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (null != data) {
                    showLog(data.toString());
                }
                ToastUtils.showToastSafe(activity, "微信登录成功");
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                showLog(cause.toString());
                ToastUtils.showToastSafe(activity, "微信登录失败: " + cause.optString("msg", cause.toString()));
            }

            @Override
            public void onError(RXException e) {
                e.printStackTrace();
                showLog(e.getMessage());
                ToastUtils.showToastSafe(activity, "微信登录错误: " + e.getMessage());
            }
        });
    }

    public static void loginByOpenid(Activity activity, boolean openMainActivity) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("method", RuiXueSdk.getLoginMethod());
        hashMap.put("login_openid", RuiXueSdk.getLoginOpenid());
        login(activity, RuiXueSdk.getLoginMethod(), hashMap, openMainActivity);
    }


    public static void loginByAccount(Activity activity, String userName, String password, boolean openMainActivity) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("username", userName);
        hashMap.put("password", password);
        //        hashMap.put("method", "username");
        login(activity, "username", hashMap, openMainActivity);
    }

    //注册类型（1-普通账号注册，2-手机号注册,3-邮箱注册）：手机号注册必须填写验证码，邮箱注册必填验证码
    public static void registerAccount(Activity activity, String userName, String password) {
        Map<String, Object> hashMap = new HashMap<>();

        hashMap.put("type", 1);
        hashMap.put("username", userName.trim());
        hashMap.put("password", password.trim());
        hashMap.put("captcha_code", "");
        hashMap.put("ignore_check_password", "1");

        RX_API.register(hashMap, callback);


    }


    public static void loginQuickMode(Activity activity) {
        Log.e(TAG, "cmmmand+p goto: " + ((new Throwable().getStackTrace()[0])).getFileName() + " " + ((new Throwable().getStackTrace()[0])).getLineNumber());
        RXLoginUIModel loginUIConfig = new RXLoginUIModel();
        loginUIConfig.setLoginMode(1);
        RXSdkUI.getInstance().showLoginUI(activity, loginUIConfig, getLoginCallback(activity));
    }


    @SuppressLint("UseCompatLoadingForDrawables")
    @NonNull
    private static Map<String, Object> getAliMap(Activity activity) {
        Map<String, Object> ext = GlobalConfig.getExt();
        String alikey = ext != null ? (String) ext.get("alikey") : null;
        String privacyOneUrl = "https://u.weile.com/deal/privacy?appid=1002&channelid=205";
        String privacyTwoUrl = "https://u.weile.com/deal/1002/205/1.1.1/000000/1";
        Map<String, Object> aliConfig = new HashMap<>();
        aliConfig.put("alikey", alikey);
//        aliConfig.put("switchAccHide", true);
        aliConfig.put("privacyOneStr", "《用户协议》");
        aliConfig.put("privacyOneUrl", privacyOneUrl);
        aliConfig.put("privacyTwoStr", "《隐私政策》");
        aliConfig.put("privacyTwoUrl", privacyTwoUrl);
//        aliConfig.put("logoDrawable", activity.getDrawable(R.drawable.logo));
//        aliConfig.put("logoResId", R.drawable.logo);
//        List<String> loginMethod = Arrays.asList(LoginMethod.GUEST,LoginMethod.GUEST,LoginMethod.GUEST, LoginMethod.WECHAT , LoginMethod.CAPTCHACODE, LoginMethod.USERNAME);
//        aliConfig.put("loginMethods", loginMethod);

        return aliConfig;
    }

    public static void loginGuest(Activity activity) {
        Map<String, Object> map = new HashMap<>();
        map.put("ruixue-devicecode", UUID.randomUUID().toString());

        Map<String, Object> share = new HashMap<>();
        share.put("inviter_openid", RuiXueSdk.getOpenid());
        Map<String, Object> user_source = new HashMap<>();
//        user_source.put("share", share);
//        map.put("user_source", user_source);
        login(activity, "guest", map, false);
    }

    public static void login(Activity activity, String method) {
        login(activity, method, null, false);
    }

    public static void login(Activity activity, String method, Map<String, Object> hashMap, boolean openMainActivity) {
        Log.e(TAG, "cmmmand+p goto: " + ((new Throwable().getStackTrace()[0])).getFileName() + " " + ((new Throwable().getStackTrace()[0])).getLineNumber());
        Map<String, Object> map = new HashMap<>();
        if (hashMap != null) {
            map.putAll(hashMap);
        }
        if (!TextUtils.isEmpty(method)) {
            map.put("method", method);
        }

        if ("google".equals(map.get("method")) && !map.containsKey("clientId")) {
            String fallbackId = RXGlobalData.getGoogleClientId();
            if (!TextUtils.isEmpty(fallbackId)) {
                map.put("clientId", fallbackId);
            }
        }

        if (map.get("method") == "virtual") {
            genVirtualMap(map);
        }

        if (map.get("method") == "wechat" && !map.containsKey("appid")) {
            map.put("appid", GlobalConfig.getWxAppId());
        }
        //        map.put("sign_fields", new String[]{"region" ,"openid","login_openid"});


        RX_API.login(activity, (map), new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject jsonObject) {
                if (jsonObject == null) {
                    ToastUtils.showToastSafe(activity, "登录回调为空");
                    return;
                }
                int code = jsonObject.optInt("code", -1);
                if (code == 0) {
                    ToastUtils.showToastSafe(activity, "登录成功");
                } else {
                    ToastUtils.showToastSafe(activity,
                            "登录失败: " + jsonObject.optString("msg", jsonObject.toString()));
                }
                if (openMainActivity) {
                    ActivityUtils.startActivityByClass(LoginV2DemoHelper.sContext, GlobalConfig.getMainActivity(), JSONUtil.toMap(jsonObject));
                } else {
                    showLog(jsonObject.toString());
                }
            }

            @Override
            public Map<String, Object> onClickHandle(Map<String, Object> params) {
                return null;
            }
        });

    }

    private static void genVirtualMap(Map<String, Object> map) {
        HashMap<String, String> extObj = new HashMap<>();
        extObj.put("logindata", "vmV8YV1bqArlZM9vLFaBETedBzXY/3b3ZES8PSJqQSHmEZ76hM22doPMPnUKlYVV1xMFYIggjSA247cFEMWPAGKmM/6lALUWgZwfYnvkxE4l68kAnAB8SAUzayqyE7R+JCpShfm635QPJQlaw61gqLKx/7EQbV9AbmZf6UFFvd0=");
        extObj.put("nickname", "aaaaaa");
        extObj.put("avatar", "ffffff");
        extObj.put("sex", "1");
        extObj.put("regtime", "2022-02-11 18:04:11");
        map.put("ext", extObj);
    }

    public static void loginWithOpenidUI(Activity activity) {
        Log.e(TAG, "cmmmand+p goto: " + ((new Throwable().getStackTrace()[0])).getFileName() + " " + ((new Throwable().getStackTrace()[0])).getLineNumber());
        RXGlobalData.setRealauthClose(true);//仅测试使用

        RXLoginUIModel loginUIConfig = getLoginUIConfig();
        loginUIConfig.setMethod(RuiXueSdk.getLoginMethod());
        loginUIConfig.setLoginOpenid(RuiXueSdk.getLoginOpenid());
        UI_API.showLoginUI(activity, loginUIConfig, getLoginCallback(activity));

//        loginview.show();//显示

    }

    public static Map<String, Object> getLoginMap() {

        Map<String, Object> loginMethod = new HashMap<>();
        Map<String, Object> wechatMap = new HashMap<>();
        //微信登录使用的微信appid
        wechatMap.put("appid", GlobalConfig.getWxAppId());
        loginMethod.put(LoginMethod.WECHAT, wechatMap);

        Map<String, Object> aliMobileMap = new HashMap<>();
        //阿里一键登录使用的appkey
        Map<String, Object> ext = GlobalConfig.getConfig() != null ? GlobalConfig.getConfig().getExt() : null;
        aliMobileMap.put("alikey", ext != null ? ext.get("alikey") : null);
        loginMethod.put(LoginMethod.QUICKPHONE, aliMobileMap);

        return loginMethod;
    }

    @NonNull
    private static RXUICallback getLoginCallback(Activity activity) {
        return new RXUICallback() {
            /**
             *点击登录按钮时回调，用于在发送登录请求时候可以添加cp自定义参数传给服务器。
             * @param params 登录请求参数
             */
            @Override
            public Map<String, Object> onClickHandle(Map<String, Object> params) {
                String method = (String) params.get("method");
                Map<String, Object> map = getLoginMap();
                if (map.containsKey(method)) {
                    try {
                        if (params.containsKey("ext")) {
                            HashMap<String, Object> pa = (HashMap<String, Object>) params.get("ext");
                            pa.putAll((Map<? extends String, ?>) map.get(method));
                        } else {
                            params.put("ext", Objects.requireNonNull(map.get(method)));
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                return params;
            }

            @Override
            public void onSuccess(@Nullable JSONObject data) {
                Logger.e(TAG, "oncallback: " + data);
                ToastUtils.showToastSafe(activity, "登录成功");
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                Logger.e(TAG, "oncallback: " + cause);
                ToastUtils.showToastSafe(activity,
                        "登录失败: " + cause.optString("msg", cause.toString()));
            }
        };
    }

    @NonNull
    private static RXLoginUIModel getLoginUIConfig() {
        RXGlobalData.setRealauthClose(true);//仅测试使用

        RXLoginUIModel loginUIConfig = new RXLoginUIModel();


//        if (withOther) {
//        List<String> loginMethod = Arrays.asList(LoginMethod.GUEST,LoginMethod.USERNAME, LoginMethod.CAPTCHACODE, LoginMethod.WECHAT, "quickphone");

        List<String> loginMethod = Arrays.asList(   LoginMethod.WECHAT, LoginMethod.CAPTCHACODE, LoginMethod.USERNAME, LoginMethod.GUEST );
        loginUIConfig.setLoginMethods(loginMethod);

//        }
//        loginUIConfig.setIndulgeAuth(0);

//        loginUIConfig.setWxAppid(GlobalConfig.getWxAppId());
//        loginUIConfig.setForgotUrl(GlobalConfig.getDomain() + "static/passport/#/user/forgetpassword");

//        loginUIConfig.setCaptchaLogin(isCaptcha); //传false 显示账号登录
//        loginUIConfig.setFirstNeedSetPassword(true);
//        loginUIConfig.setIndulgeAuth(0);

        loginUIConfig.setTitleResId(R.drawable.logo_2);
//        loginUIConfig.setLogoDrawable(R.drawable.logo_2);
//        loginUIConfig.setGuestTitle("快速登录");
//        loginUIConfig.setLoginType(isPhone ? Constants.REGISTER_TYPE_PHONE : Constants.REGISTER_TYPE_USERNAME);

        //使用时吗，请更换 cp 方自己协议域名
        loginUIConfig.setPrivacyOne("用户协议", "https://anhvcpo.weilekuiming.com/static/landing/#/v1/legal/terms/100/00001");
        loginUIConfig.setPrivacyTwo("隐私政策", "https://anhvcpo.weilekuiming.com/static/landing/#/v1/legal/terms/100/00002?lang=zh");
        loginUIConfig.setPrivacyThree("适龄提醒", "https://anhvcpo.weilekuiming.com/static/landing/#/v1/legal/terms/100/00003");


        //        loginUIConfig.setPrivacyTwo("隐私协议", "file://android_asset/xieyi.html");
//     // 构造大数据透传参数
//    Map<String, Object> bigdataExt = new HashMap<>();
//    bigdataExt.put("event_name", "user_login");  // 示例大数据事件
//    bigdataExt.put("event_value", "success");   // 示例事件值
//
//    // 构造自定义透传参数
//    Map<String, Object> customExt = new HashMap<>();
//    customExt.put("bigdata_ext", bigdataExt);  // 将大数据透传参数添加到自定义透传参数中
//    customExt.put("user_agent", "Android 10"); // 自定义参数（如用户设备信息）
//    customExt.put("location", "New York");     // 自定义参数（如用户地理位置）
//
//        loginUIConfig.setCustomExt(customExt);
        LinkedHashMap<String, Object> d = new LinkedHashMap<>();
//        https://anhvcpo.weilekuiming.com/static/passport/#/helpcenter/questioncatalogue
//        Map<String,String> dz=new HashMap<>();
//        dz.put("zh","用户协议");
//        d.put("https://anhvcpo.weilekuiming.com/static/landing/#/v1/legal/terms/100/00001", dz);
//        d.put("https://anhvcpo.weilekuiming.com/static/landing/#/v1/legal/terms/100/00002?lang=zh", "隐私协议");
//        d.put("https://anhvcpo.weilekuiming.com/static/landing/#/v1/legal/terms/100/00003", "儿童隐私");
//        loginUIConfig.setPrivacies(d);


        return loginUIConfig;
    }

    static RXRequestCallback rxRequestCallback = new RXRequestCallback() {
        @Override
        public void onResponse(JSONObject jsonObject) {
            int code = jsonObject.optInt("code", -1);
            if (code == 0) {
                //todo 处理成功逻辑
                JSONObject data = jsonObject.optJSONObject("data");
                if (data != null) {
                    String type = data.optString("type");
                    //todo
                }
                ToastUtils.showToast(sContext, "测试提示，登录成功");
            } else {
                String msg = jsonObject.optString("msg");
                //todo 根据错误码处理失败逻辑
                ToastUtils.showToast(sContext, "测试提示，登录失败：" + jsonObject);
            }
        }
    };

    public static boolean loginOpenidExpireInvalid(Activity activity) {
        RXLoginUIModel loginConfig = getLoginUIConfig();
        boolean isInvalid = UI_API.loginOpenidExpireInvalid(activity, loginConfig, rxRequestCallback);
        if (!isInvalid) {
            ToastUtils.showToast(sContext, "login_openid 登录有效，可使用login_openid登录:" + RuiXueSdk.getLoginMethod());
        }
        return isInvalid;
    }

    public static void showLoginUI(Activity activity) {
        if (RuiXueSdk.isOasVersion()) {
            RXLoginUIModel loginConfig = new RXLoginUIModel();

            UI_API.loginUIOS(activity, loginConfig, null, rxRequestCallback).show();
        } else {
//                    RXGlobalData.setQuickPhoneKey("1");
            RXLoginUIModel loginConfig = new RXLoginUIModel();
//            loginConfig.needRealAuth(true);
//            loginConfig.canCloseRealAuth(true);
            List<String> loginMethod = Arrays.asList(  LoginMethod.USERNAME,LoginMethod.CAPTCHACODE );
            loginConfig.setLoginMethods(loginMethod);
//            loginConfig.setCaptchaLogin(true);
//            loginConfig.setQuickButtonBarVisible(false);
//            loginConfig.setWxAppid(GlobalConfig.getWxAppId());
            loginConfig.setTitleResId(R.drawable.logo_2);
//        loginUIConfig.setLogoDrawable(R.drawable.logo_2);
//        loginUIConfig.setGuestTitle("快速登录");
//        loginUIConfig.setLoginType(isPhone ? Constants.REGISTER_TYPE_PHONE : Constants.REGISTER_TYPE_USERNAME);

            loginConfig.setPrivacyOne("用户协议", "https://anhvcpo.weilekuiming.com/static/landing/#/v1/legal/terms/100/00001");
            loginConfig.setPrivacyTwo("隐私政策", "https://anhvcpo.weilekuiming.com/static/landing/#/v1/legal/terms/100/00002?lang=zh");
//        loginUIConfig.setPrivacyTwo("隐私协议", "file://android_asset/xieyi.html");
            loginConfig.setPrivacyThree("适龄提醒", "https://anhvcpo.weilekuiming.com/static/landing/#/v1/legal/terms/100/00003");

//            loginConfig.needRealAuth(true);
//            loginConfig.canCloseRealAuth(false);

//            Log.e("login", new Gson().toJson(loginConfig));

            UI_API.showLoginUI(activity, loginConfig, rxRequestCallback);
        }
    }

}