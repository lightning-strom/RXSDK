package com.ruixue.sdk;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.base.commonlib.device.DeviceConfig;
import com.bsgamesdk.android.callbacklistener.AccountCallBackListener;
import com.bsgamesdk.android.callbacklistener.BSGameSdkError;
import com.bsgamesdk.android.callbacklistener.CallbackListener;
import com.bsgamesdk.android.callbacklistener.ExitCallbackListener;
import com.bsgamesdk.android.callbacklistener.InitCallbackListener;
import com.gsc.pub.GSCPubCommon;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.billing.BillingClient;
import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RxErrorReportUtil;
import com.ruixue.openapi.BiliBiliSdkHelper;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.LoginMethod;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

public class BiliBiliSdkApiImpl extends RXSdkApi {

    private final BillingClient billingClient;
    // 用于存储用户信息
    private SharedPreferences preferences;
    public static final int LOGIN_CANCEL = 6002;

    @Override
    public void onApplicationCreate(Application application) {
        super.onApplicationCreate(application);
        GSCPubCommon.applicationAttach(application);
        preferences = application.getSharedPreferences("bili_user_info", Context.MODE_PRIVATE);
    }

    @Override
    public void onResume(Activity activity) {
        super.onResume(activity);
        GSCPubCommon.getInstance().appOnline(activity);
    }

    @Override
    public void onStop(Activity activity) {
        super.onStop(activity);
        GSCPubCommon.getInstance().appOffline(activity);
    }

    @Override
    public void onDestroy(Activity activity) {
        super.onDestroy(activity);
        GSCPubCommon.getInstance().appDestroy(activity);
    }

    static class Single {
        final static BiliBiliSdkApiImpl INSTANCE = new BiliBiliSdkApiImpl();
    }

    protected BiliBiliSdkApiImpl() {
        billingClient = new BiliBiliBillingImpl();
    }

    @NonNull
    public static BiliBiliSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    public void accountCallBack() {
        GSCPubCommon.getInstance().setAccountListener(new AccountCallBackListener() {
            @Override
            public void onAccountInvalid() {
                RXLogger.i("bilibili 用户退出");
//                System.exit(0);
            }
        });
    }


    private String bili_server_id;
    private String bili_server_name;
    private String uid;
    private String userName;
    private String nickname;
    private final AtomicBoolean isInited = new AtomicBoolean(false);

    @Override
    public void initThirdSdk(@NonNull Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        //我⽅分配的商户应⽤的区服id，⼀般⽤来区分区服，如果游戏有多个区服，对应⼀个我⽅分配的区服id，并在选择⻆⾊、区服后调⽤notifyZone接⼝传⼊我⽅的区服id
        bili_server_id = (String) hashMap.get("server_id");
        bili_server_name = (String) hashMap.get("server_name");
        String merchant_id = (String) hashMap.get("merchant_id");//cpid商户id,由平台⾃动分配
        String app_id = (String) hashMap.get("appid");//每款应⽤在平台的唯⼀标识，由平台分配
        String app_key = (String) hashMap.get("appkey");

        try {
            if (TextUtils.isEmpty(bili_server_id) && callback != null) {
                throw new IllegalArgumentException("error bili_server_id is null");
            } else if (TextUtils.isEmpty(merchant_id) && callback != null) {
                throw new IllegalArgumentException("error merchant_id is null");
            } else if (TextUtils.isEmpty(app_id) && callback != null) {
                throw new IllegalArgumentException("error app_id is null");
            } else if (TextUtils.isEmpty(app_key) && callback != null) {
                throw new IllegalArgumentException("error app_key is null");
            }
            ThreadUtils.getInstance().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    DeviceConfig deviceConfig = new DeviceConfig.Builder().enableIMEI(true) // 是否开启IMEI 采集，true表示开启
                            .enableMAC(true)// 是否开启MAC 采集，true表示开启
                            .enableSensorInfo(true) // 是否开启传感器信息 采集，true表示开启
                            .enableSN(true) // 是否开启硬件序列号 采集，true表示开启
                            .enableCameraInfo(true) // 是否开启摄像头信息 采集，true表示开启
                            .build();

                    /**
                     * 初始化SDK     *
                     * @param activity 上下文
                     * @param merchantId   merchantId
                     * @param appId  appId
                     * @param serverId serverId
                     * @param appKey appKey
                     * @param initListener 初始化成功回调
                     * @param exitListener 游戏退出回调
                     * @param agreeListener 用户同意协议后回调
                     * @param deviceConfig 设备信息配置选项
                     */
                    GSCPubCommon.getInstance().init(activity, merchant_id, app_id, bili_server_id, app_key, new InitCallbackListener() {
                        @Override
                        public void onSuccess() {
                            accountCallBack();
                            isInited.set(true);
                            if (callback != null)
                                callback.onSuccess(null);
                        }

                        @Override
                        public void onFailed() {
                            isInited.set(false);
                            accountCallBack();
                            if (callback != null) {
                                JSONObject jsonObject = RXErrorCode.THIRD_INIT_ERROR.toJSONObject();
                                callback.onFailed(jsonObject);
                                RxErrorReportUtil.ThirdInitError.isError = true;
                                RxErrorReportUtil.ThirdInitError.thirdName = "BiliBili";
                                RxErrorReportUtil.ThirdInitError.cause = jsonObject;
                            }
                        }
                    }, new ExitCallbackListener() {
                        /**
                         * exitListener为ExitListener 的实例。ExitListener 的回调⽅法只有onExit。需要在onExit中完成退出并关闭游戏的逻辑。需注意任何情况不能传null
                         */
                        @Override
                        public void onExit() {
                            RXLogger.i("bilibili onExit");
                            RXJSONCallback excb = (RXJSONCallback) hashMap.get("exit_callback");
                            if (excb != null) {
                                excb.onSuccess(null);
                            }
                            System.exit(0);
                        }
                    }, () -> {
                        setPrivacyAgree(activity, null);
                        GSCPubCommon.getInstance().activate();
                    }, deviceConfig);
                }
            });
        } catch (Exception e) {
            if (callback != null) {
                RXException rxException = new RXException(RXErrorCode.THIRD_INIT_ERROR.getValue(), e.getMessage(), e.getCause());
                callback.onError(rxException);
                RxErrorReportUtil.ThirdInitError.isError = true;
                RxErrorReportUtil.ThirdInitError.thirdName = "BiliBili";
                RxErrorReportUtil.ThirdInitError.cause = rxException.toJSONObject();
            }
        }
    }

    @Override
    public void login(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey(KEY_LOGIN_METHOD)) {
            hashMap.put(KEY_LOGIN_METHOD, LoginMethod.BILIBILI);
        }
        super.login(activity, hashMap, callback);
    }

    @Override
    public void logout(OnLogoutCallback callback) {
        super.logout(callback);
        GSCPubCommon.getInstance().stopHeart(RuiXueSdk.getCurrentActivity());
        BiliBiliSdkHelper.logout(callback);
    }

    @Override
    public boolean exitApp(Activity activity, OnAppExitCallback callback) {
        GSCPubCommon.getInstance().stopHeart(activity);
        BiliBiliSdkHelper.exit(callback);
        return true;
    }

    /**
     * @param map      map
     *                 示例 游戏⻆⾊信息json格式的字符串
     *                 user_info =  [{
     *                 "role_name": "⻆⾊名1",
     *                 "server_name": "区服1",
     *                 "level": "1",
     *                 "time": "2021.01.01"
     *                 }, {
     *                 "role_name": "⻆⾊名2",
     *                 "server_name": "区服2",
     *                 "level": "2",
     *                 "time": "2021.01.01"
     *                 }]
     * @param callback 回调函数
     */
    @Override
    public void deregister(Map<String, Object> map, RXJSONCallback callback) {
        BiliBiliSdkHelper.closeAccountWithUserInfo((String) map.get("user_info"), new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (data != null && "true".equals(data.optString("enabled", "false"))) {
                    map.put("voucher_no", data.optString("voucher_no", ""));
//                    BiliBiliSdkApiImpl.super.deregister(map, callback);
                    logout(null);
                    if (callback != null) {
                        callback.onSuccess(data);
                    }
                } else if (callback != null) {
                    callback.onFailed(RXErrorCode.DEREGISTER_CANCEL.toJSONObject());
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null) {
                    callback.onFailed(cause);
                }
            }
        });
    }


    @Override
    public boolean thirdLogin(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (hashMap.containsKey("server_id")) {
            bili_server_id = (String) hashMap.get("server_id");
        }
        if (hashMap.containsKey("server_name")) {
            bili_server_name = (String) hashMap.get("server_name");
        }

        if (isInited.get()) {
            GSCPubCommon.getInstance().login(new CallbackListener() {
                @Override
                public void onSuccess(Bundle bundle) {
                    //这个⽅法需要在登录成功后才能调⽤，不要调⽤多次。
                    GSCPubCommon.getInstance().startHeart(activity);
                    uid = bundle.getString("uid");
                    userName = bundle.getString("username");
                    nickname = bundle.getString("nickname");

                    if (!TextUtils.isEmpty(bili_server_name)) {
                        if (preferences != null) {
                            String role_id = preferences.getString("role_id", "");
                            if (TextUtils.isEmpty(role_id) || !role_id.equals(uid)) {
                                GSCPubCommon.getInstance().createRole(nickname, uid);
                                preferences.edit().putString("role_id", uid).apply();
                            }
                        } else {
                            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.INIT_PARAMS_ERROR.getValue(), "error uncalled onApplicationCreate"));
                            return;
                        }
                        boolean notifyZone = true;
                        if (hashMap.containsKey("notify_zone")) {
                            notifyZone = ObjectUtils.toBoolean(hashMap.get("notify_zone"));
                        }
                        if (notifyZone) {
                            //调⽤该⽅法来设置⽤户当前信息，⽤于⽀付校验。 请在⽤户登录并选择⻆⾊以及服务器后调⽤，否则⽆法通过审核,notifyZone⼀次登录只能调⽤⼀次，不能多次调⽤。
                            GSCPubCommon.getInstance().notifyZone(bili_server_id, bili_server_name, uid, nickname);
                        }
                    }

                    // 此处为操作成功时执行，返回值通过Bundle传回
                    Map<String, Object> extMap = new HashMap<>();
                    extMap.put("uid", uid);
                    extMap.put("username", userName);
                    extMap.put("access_token", bundle.getString("access_token"));
                    extMap.put("expire_times", bundle.getString("expire_times"));
                    extMap.put("refresh_token", bundle.getString("refresh_token"));
                    extMap.put("nickname", nickname);//⽤户名昵称
                    callback.onSuccess(new JSONObject(extMap));
                }

                @Override
                public void onFailed(BSGameSdkError bsGameSdkError) {
                    if (bsGameSdkError.getErrorCode() == LOGIN_CANCEL) {
                        callback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage()));
                    } else {
                        callback.onFailed(RXErrorCode.THIRD_LOGIN_ERROR.toJSONObject(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage()));
                    }
                }

                @Override
                public void onError(BSGameSdkError bsGameSdkError) {
                    callback.onError(new RXException(bsGameSdkError.getErrorCode(), bsGameSdkError.getErrorMessage()));
                }
            });
        } else {
            callback.onFailed(RXErrorCode.THIRD_INIT_ERROR.toJSONObject());
        }
        return true;
    }

    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder().setName("bilibili").setVersion(RuiXueSdk.getSdkVersion()).build();
    }

    /**
     * @param activity 应用 activity
     * @param hashMap  map 参数
     *                 transmitArgs string 非必须 客户透传信息
     *                 clientType string 非必须 客户端类型APP/H5
     *                 is_debug number 非必须 是否测试订单
     *                 goodsTag string 非必须 商品标识
     *                 tradeNo string 非必须 商户订单号
     *                 goodsName string 非必须 商品名称
     *                 type string 非必须 支付方式
     *                 ext object 非必须 三方支付额外传递
     *                 game_money
     *                 bili_uid
     *                 bili_username
     *                 bili_role
     *                 bili_server_id
     * @param callback 回调函数
     */
    @Override
    public void pay(Activity activity, @NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        @SuppressWarnings("unchecked") Map<String, Object> extMap = (Map<String, Object>) hashMap.get("ext");
        if (extMap == null) {
            extMap = new HashMap<>();
        }
        if (!extMap.containsKey("game_money") && hashMap.containsKey("game_money")) {
            extMap.put("game_money", hashMap.get("game_money"));
            hashMap.remove("game_money");
        }
        if (!extMap.containsKey("bili_uid"))
            extMap.put("bili_uid", uid);
        if (!extMap.containsKey("bili_role"))
            extMap.put("bili_role", nickname);
        if (!extMap.containsKey("bili_server_id"))
            extMap.put("bili_server_id", bili_server_id);
        if (!extMap.containsKey("bili_username"))
            extMap.put("bili_username", userName);
        hashMap.put("ext", extMap);
        billingClient.pay(activity, hashMap, callback);
    }

    @Override
    public void share(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        super.share(activity, hashMap, callback);
//        if ("bilibili".equals( hashMap.get("platform"))){
//
//        }
////        //图文分享
//        SharePlatform sharePlatform = SharePlatform.WEIXIN;
//        //from：share.game.app.游戏名英文
//        String form = "";
//        //测试分享游戏Id
//        long shareBizId = 0;
//        //测试分享游戏类型Id
//        int shareBizType = 0;
//        ShareParamImage baseShareParam = new ShareParamImage(form, shareBizId, shareBizType);
//        //图片路径
//        String imagePath = "getExternalCacheDir() + patzh";
//        String image= (String) hashMap.get("image");
//        File imageFile = new File(imagePath);
//        baseShareParam.setImage(new ShareImage(imageFile));
//        GSCPubCommon.getInstance().share(activity, sharePlatform, baseShareParam, new ShareLisener() {
//            @Override
//            public void onSuccess(String s, int i) {
//                callback.onSuccess(JSONUtil.toJSONObject(i,s));
////                Toast.makeText(activity, s + " 分享成功" + i, Toast.LENGTH_SHORT).show();
//            }
//
//            @Override
//            public void onFailure(String s, int i, String s1) {
//                callback.onFailed(JSONUtil.toJSONObject(i,s));
////                Toast.makeText(activity, s + "分享失败" + i + " " + s1, Toast.LENGTH_SHORT).show();
//            }
//
//            @Override
//            public void onCancel(String s, int i) {
//                callback.onFailed(JSONUtil.toJSONObject(i,s));
////                Toast.makeText(activity, s + "分享取消" + i, Toast.LENGTH_SHORT).show();
//            }
//        });
    }
}
