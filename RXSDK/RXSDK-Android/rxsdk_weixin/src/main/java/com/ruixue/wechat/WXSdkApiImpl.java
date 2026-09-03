package com.ruixue.wechat;

import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.StringDef;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.Logger;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.share.PlatformType;
import com.ruixue.share.ShareApi;
import com.ruixue.utils.JSONUtil;
import com.tencent.mm.opensdk.constants.Build;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelbiz.SubscribeMessage;
import com.tencent.mm.opensdk.modelbiz.WXLaunchMiniProgram;
import com.tencent.mm.opensdk.modelbiz.WXOpenBusinessView;
import com.tencent.mm.opensdk.modelbiz.WXOpenCustomerServiceChat;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.tencent.mm.opensdk.utils.ILog;

import org.json.JSONObject;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.ref.WeakReference;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class WXSdkApiImpl extends ShareApi {
    /**
     * 应用授权作用域，如获取用户个人信息则填写 snsapi_userinfo
     */
    @StringDef({SNSAPI_BASE, SNSAPI_USERINFO})
    @Retention(RetentionPolicy.SOURCE)
    public @interface WXScope {
    }

    public static final String SNSAPI_BASE = "snsapi_base";
    public static final String SNSAPI_USERINFO = "snsapi_userinfo";

    private IWXAPI sWxApi = null;
    private String mAppid = "";

    private WeakReference<Context> contextWeak = null;

    private WXShareImpl wxShareApi = null;


    static class Single {
        static WXSdkApiImpl INSTANCE = new WXSdkApiImpl();
    }

    private WXSdkApiImpl() {
    }

    public static WXSdkApiImpl getInstance() {
        return Single.INSTANCE;
    }

    @Override
    public boolean doShare(Activity activity, Map<String, Object> shareMap, RXJSONCallback callback) {
        sendShareReq(activity, WXShareObject.fromMap(shareMap), callback);
        return true;
    }

    @Override
    public PlatformType getPlatformType() {
        return PlatformType.WECHAT;
    }

    @Override
    public void onResume(Context context) {
//        WXCallbackManager.onResume(context);
    }

    public Context getContext() {
        if (null == contextWeak || contextWeak.get() == null) {
            return RuiXueSdk.getContext();
        } else {
            return contextWeak.get();
        }
    }

    @Override
    public String getSdkVersion() {
        return Build.SDK_VERSION_NAME;
    }

    @Override
    public boolean isSupport() {
        return getWXAppSupportAPI(getContext()) >= Build.TIMELINE_SUPPORTED_SDK_INT;
    }

    @Override
    public boolean isInstalled() {
        return isWXAppInstalled(getContext());
    }

    public boolean checkAndroidNotBelowN() {
        return (android.os.Build.VERSION.SDK_INT >= 24);
    }


    /**
     * 初始化sdk
     */
    public boolean init(Context context, String appId) {
        contextWeak = new WeakReference<>(context);
        if (null == appId)
            return false;
        if (isInited && null != sWxApi && appId.equals(mAppid)) {
            return true;
        }
        mAppid = appId;
        return registerWxApp(context, mAppid);
    }

    public boolean registerWxApp(Context context, String appid) {
        if (null != context) {
            try {
                sWxApi = WXAPIFactory.createWXAPI(context, appid, true);
                if (!TextUtils.isEmpty(appid)) {
                    isInited = sWxApi.registerApp(appid);
                }
            } catch (Throwable e) {
                Logger.e("WXAPIFactory", "registerWxApp failed: " + e.getMessage());
                sWxApi = null;
                isInited = false;
            }
        }
        return isInited;
    }

    /**
     * 反注册微信app，成功后将不再显示在微信的app列表中
     */
    public void unregisterWxApp() {
        if (null != sWxApi) {
            sWxApi.unregisterApp();
            sWxApi = null;
            isInited = false;
        }
    }

    /**
     * get api level from installed wechat app
     * @return api level
     */
    public int getWXAppSupportAPI(Context context) {
        return getWxApi(context).getWXAppSupportAPI();
    }

    public IWXAPI getWxApi() {
        return getWxApi(getContext());
    }

    public IWXAPI getWxApi(Context context) {
        if (sWxApi == null && null == context) {
            Log.e("WXSdkApiImpl", "wechat sdk not init appid:" + sWxApi);
            throw new NullPointerException("微信sdk初始化参数异常");
//            return null;
        } else if (null == sWxApi) {
            registerWxApp(context, mAppid);
        }
        return sWxApi;
    }

    public boolean openWXApp(Context context) {
        return (getWxApi(context)).openWXApp();
    }

    public void setLogImpl(ILog log) {
        (getWxApi()).setLogImpl(log);
    }

    public void sendReq(IWXAPI api, BaseReq req, WXCallback callback) {
        if (api != null) {
            boolean success = api.sendReq(req);
            if (success) {
                WXCallbackManager.registerWXCallback(callback);
            } else if (callback != null) {
                callback.onResp(new WXCallbackManager.MockResp(WXErrCode.ERR_UNINIT, "wx sendReq failed， see logcat for detail"));
            }
        } else if (callback != null) {
            callback.onResp(new WXCallbackManager.MockResp(WXErrCode.ERR_UNINIT, "wx api not init"));
        }
    }

    private boolean checkParams(Context context, String appid, RXJSONCallback callback) {
        if (TextUtils.isEmpty(appid)) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.INIT_PARAMS_ERROR.getValue(), "wx appid null error."));
            return false;
        } else if (!isWXAppInstalled(context)) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.NOT_INSTALL_WECHAT.getValue(), "微信未安装，请先安装微信！"));
            return false;
        } else if (!init(context, appid)) {
            callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.INIT_PARAMS_ERROR.getValue(), "微信初始化失败，请检查参数！"));
            return false;
        } else {
            return true;
        }
    }


    public void sendAuthReq(Context context, Map<String, Object> hashMap, @NonNull RXJSONCallback authCallback) {
        String appid = (String) hashMap.get("appid");
        if (TextUtils.isEmpty(appid)) {
            appid = (String) hashMap.get("wx_appid");
        }
        if (TextUtils.isEmpty(appid)) {
            appid = RXGlobalData.getWxAppid();
        }
        if (checkParams(context, appid, authCallback)) {
            SendAuth.Req req = new SendAuth.Req();
            //应用授权作用域，如获取用户个人信息则填写 snsapi_userinfo
            req.scope = hashMap.containsKey("scope") ? (String) hashMap.get("scope") : SNSAPI_USERINFO;
            req.state = hashMap.containsKey("state") ? (String) hashMap.get("state") : "wx_login";  //非必须
            boolean success = (getWxApi(context)).sendReq(req);
            if (success) {
                WXCallbackManager.registerWXCallback(WXCallbackManager.CallbackType.SENDAUTH, new WXAuthResp() {
                    @Override
                    public void onAuthResp(int errCode, String code, String lang, String county, String state) {
                        if (WXErrCode.ERR_OK == errCode) {
                            Map<String, String> authMap = new HashMap<>();
                            authMap.put("err_code", String.valueOf(errCode));
                            authMap.put("code", code);
                            authMap.put("lang", lang);
                            authMap.put("county", county);
                            authMap.put("state", state);
                            authMap.put("wechatid", mAppid);
                            authCallback.onSuccess(new JSONObject(authMap));
                        } else if (WXErrCode.ERR_USER_CANCEL == errCode) {
                            authCallback.onFailed(RXErrorCode.LOGIN_CANCEL.toJSONObject(errCode, "登录" + WXErrCode.getMsg(errCode)));
                        } else {
                            authCallback.onFailed(RXErrorCode.LOGIN_ERROR.toJSONObject(errCode, "登录" + WXErrCode.getMsg(errCode)));
                        }
                    }
                });
            } else {
                authCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.LOGIN_ERROR.getValue(), "微信授权请求失败"));
            }
        }
    }

    abstract static class WXOpenBusinessViewResp extends WXCallback {
        public abstract void onOpenBusinessViewResp(int errCode, String extMsg, String businessType);
    }

    public void sendWXOpenBusinessViewReq(Context context, String appId, String businessType, String query, RXJSONCallback callback) {
        try {
            if (!checkParams(context, appId, callback)) {
                return;
            }
            IWXAPI api = (getWxApi(context));
            int wxSdkVersion = api.getWXAppSupportAPI();
            if (wxSdkVersion <= Build.OPEN_BUSINESS_VIEW_SDK_INT) {
                Logger.e("wx sdk version not support");
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR));
                return;
            }
            WXOpenBusinessView.Req req = new WXOpenBusinessView.Req();
            req.businessType = TextUtils.isEmpty(businessType) ? "requestMerchantTransfer" : businessType;
            req.query = query;//"mchId=1230000000&appId=wx8888888888888888&package=affffddafdfafddffda%3D%3D";
            boolean success = api.sendReq(req);
            if (!success) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR));
            } else {
                WXCallbackManager.registerWXCallback(WXCallbackManager.CallbackType.COMMAND_OPEN_BUSINESS_VIEW, new WXOpenBusinessViewResp() {
                    @Override
                    public void onOpenBusinessViewResp(int errCode, String extMsg, String businessType) {
                        if (WXErrCode.ERR_OK == errCode) {
                            Map<String, String> m = new HashMap<>();
                            m.put("extMsg", extMsg);
                            m.put("businessType", businessType);
                            callback.onSuccess(new JSONObject(m));

                        } else if (WXErrCode.ERR_USER_CANCEL == errCode) {
                            callback.onFailed(RXErrorCode.SHARE_CANCEL.toJSONObject(errCode, "取消"));
                        } else {
                            callback.onFailed(RXErrorCode.SHARE_THIRD_ERROR.toJSONObject(errCode, "失败"));
                        }
                    }
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
            callback.onError(new RXException(e));
        }
    }

    /**
     * @param context  应用上下文
     * @param hashMap  appid	是	应用唯一标识，在微信开放平台提交应用审核通过后获得
     *                 scene	是	重定向后会带上 scene 参数，开发者可以填 0-10000 的整型值，用来标识订阅场值
     *                 template_id	是	订阅消息模板 ID，在微信开放平台提交应用审核通过后获得
     *                 reserved	否	用于保持请求和回调的状态，授权请后原样带回给第三方。该参数可用于防止 csrf 攻击（跨站请求伪造攻击），建议第三方带上该参数，可设置为简单的随机数加 session 进行校验，开发者可以填写 a-zA-Z0-9 的参数值，最多 128 字节，要求做 urlencode
     * @param callback 回调返回字段示例：
     *                 openid:oyAaTjt-xXvP87pubE4eUOF-ttD4 用户唯一标识，仅在用户确认授权时才有
     *                 template_id:7YuTL__ilzyZB9DXcDt2mHx-CAS_E7KtsQkhIGVhhRM 订阅消息模板 ID
     *                 action:confirm 用户点击动作，"confirm"代表用户确认授权，"cancel"代表用户取消授权
     *                 reserved:hello 订阅场景值
     *                 scene:1000 请求带入原样返回
     */
    public void subscribeMessage(Context context, Map<String, Object> hashMap, @NonNull RXJSONCallback callback) {
        if (checkParams(context, (String) hashMap.get("appid"), callback)) {
            SubscribeMessage.Req req = new SubscribeMessage.Req();
            req.scene = ((int) Objects.requireNonNull(hashMap.get("scene")));
            req.templateID = (String) hashMap.get("template_id");
            req.reserved = (String) hashMap.get("reserved");
            if (hashMap.containsKey("openId")) {
                req.openId = (String) hashMap.get("openId");
            }
            boolean success = (getWxApi(context)).sendReq(req);
            if (success) {
                WXCallbackManager.registerWXCallback(WXCallbackManager.WXConstantsAPI.COMMAND_SUBSCRIBE_MESSAGE, new WXCallback() {
                    @Override
                    public void onSubscribeResp(int errCode, int scene, String openid, String template_id, String action, String reserved) {
                        if (errCode == WXErrCode.ERR_OK) {
                            Map<String, Object> authMap = new HashMap<>();
                            authMap.put("err_code", errCode);
                            authMap.put("openid", openid);
                            authMap.put("template_id", template_id);
                            authMap.put("action", action);
                            authMap.put("reserved", reserved);
                            authMap.put("wechatid", mAppid);
                            callback.onSuccess(new JSONObject(authMap));
                        } else {
                            callback.onFailed(RXErrorCode.SHARE_PARAMS_ERROR.toJSONObject(errCode, "订阅" + WXErrCode.getMsg(errCode)));
                        }
                    }
                });
            } else {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR.getValue(), "微信订阅请求失败。"));
            }
        }
    }

    public void sendShareReq(Context context, WXShareObject shareObject, @NonNull RXJSONCallback shareCallback) {
        if (null != shareObject) {
            if (checkParams(context, shareObject.getAppid(), shareCallback)) {
                if (wxShareApi == null) {
                    wxShareApi = new WXShareImpl(context);
                }
                wxShareApi.sendShareReq(getWxApi(context), shareObject, shareCallback);
            }
        } else {
            shareCallback.onFailed(JSONUtil.toJSONObject(RXErrorCode.SHARE_PARAMS_ERROR.getValue(), "wx share params is null error"));
        }
    }

    /**
     * opensdk版本：大于等于6.7.9
     * @param hashMap appid 微信 appid
     *                corpId 企业ID
     *                url  客服URL
     */
    public boolean openCustomerServiceChat(Context context, Map<String, Object> hashMap, @NonNull RXJSONCallback callback) {
        // 判断当前版本是否支持拉起客服会话
        if (init(context, (String) hashMap.get("appid")) && getWxApi(context).getWXAppSupportAPI() >= Build.SUPPORT_OPEN_CUSTOMER_SERVICE_CHAT) {
            WXOpenCustomerServiceChat.Req req = new WXOpenCustomerServiceChat.Req();
            req.corpId = (String) hashMap.get("corpId");                                  // 企业ID
            req.url = (String) hashMap.get("url"); //"https://work.weixin.qq.com/kfid/kfcxxxxx";    // 客服URL
            if (hashMap.containsKey("openId")) {
                req.openId = (String) hashMap.get("openId");
            }
            boolean success = getWxApi(context).sendReq(req);
            if (success) {
                WXCallbackManager.registerWXCallback(WXCallbackManager.CallbackType.OPEN_CUSTOMER_SERVICE_CHAT, new WXCallback() {
                    @Override
                    public void onResp(BaseResp baseResp) {
                        super.onResp(baseResp);
                        if (baseResp.getType() == WXCallbackManager.WXConstantsAPI.COMMAND_OPEN_CUSTOMER_SERVICE_CHAT) {
                            if (baseResp.errCode == WXErrCode.ERR_OK) {
                                callback.onSuccess(RXErrorCode.SHARE_PARAMS_ERROR.toJSONObject(baseResp.errCode, baseResp.errStr));
                            } else {
                                callback.onFailed(RXErrorCode.SHARE_PARAMS_ERROR.toJSONObject(baseResp.errCode, baseResp.errStr));
                            }
                        }
                    }
                });
            } else {
                callback.onFailed(RXErrorCode.SHARE_PARAMS_ERROR.toJSONObject(WXErrCode.ERR_UNKNOWN, "wx open customer service chat fail"));
            }
            return success;
        } else {
            callback.onFailed(RXErrorCode.SHARE_PARAMS_ERROR.toJSONObject(WXErrCode.ERR_UNKNOWN, "wx init wx sdk fail"));
            return false;
        }
    }


    public boolean openMiniProgram(Context context, WXShareObject miniObject, @NonNull RXJSONCallback callback) {
        if (checkParams(context, miniObject.getAppid(), callback)) {
            String userName = miniObject.getUsername();
            if (!TextUtils.isEmpty(userName)) {
                WXLaunchMiniProgram.Req req = new WXLaunchMiniProgram.Req();
                req.userName = userName;                    //"gh_d43f693ca31f"; // 填小程序原始id
                req.path = miniObject.getPath();           ////拉起小程序页面的可带参路径，不填默认拉起小程序首页，对于小游戏，可以只传入 query 部分，来实现传参效果，如：传入 "?foo=bar"。
                req.miniprogramType = miniObject.getMiniprogramType(); //       WXLaunchMiniProgram.Req.MINIPTOGRAM_TYPE_RELEASE;//可选打开 开发版，体验版和正式版
                req.extData = miniObject.getExtData();      //
                if ((getWxApi(context)).sendReq(req)) {
                    WXCallbackManager.registerWXCallback(WXCallbackManager.CallbackType.LAUNCH_WX_MINIPROGRAM, new WXCallback() {
                        @Override
                        public void onLaunchMiniResp(int errCode, String extMsg) {
                            if (errCode == WXErrCode.ERR_OK) {
                                callback.onSuccess(RXErrorCode.SUCCESS.toJSONObject(errCode, extMsg));
                            } else {
                                callback.onFailed(RXErrorCode.SHARE_PARAMS_ERROR.toJSONObject(errCode, WXErrCode.getMsg(errCode) + extMsg));
                            }
                        }
                    });
                    return true;
                }
            }
            callback.onFailed(RXErrorCode.SHARE_PARAMS_ERROR.toJSONObject(WXErrCode.ERR_UNKNOWN, "wx open miniprogram failed"));
        }
        return false;
    }

    public boolean isWXAppInstalled(Context context) {
        IWXAPI wxapi = (getWxApi(context));
        if (null == wxapi) {
            wxapi = WXAPIFactory.createWXAPI(context, "");
        }
        boolean bIsWXAppInstalled = wxapi.isWXAppInstalled();
        if (!bIsWXAppInstalled) {
            try {
                final PackageManager packageManager = context.getPackageManager();// 获取packagemanager
                packageManager.getPackageInfo("com.tencent.mm", 0);// 获取所有已安装程序的包信息
                return true;
            } catch (Exception ignored) {
            }
        }
        return bIsWXAppInstalled;
    }

}
