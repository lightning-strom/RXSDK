package com.ruixue.wechat;

import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.HQType;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.openapi.PluginSdk;
import com.ruixue.passport.LoginMethod;
import com.ruixue.share.ShareObject;
import com.ruixue.unity.UnityBaseCommonFun;
import com.ruixue.unity.UnityRXRequestCallback;
import com.ruixue.utils.AppUtils;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@SuppressWarnings("unused")
public class WXSdkWrapper extends PluginSdk {
    static class Single {
        final static WXSdkWrapper INSTANCE = new WXSdkWrapper();
    }

    protected WXSdkWrapper() {
    }

    @NonNull
    public static WXSdkWrapper getInstance() {
        return Single.INSTANCE;
    }

    /**
     * 是否安装有微信
     */
    public static boolean isWXAppInstalled(Context context) {
        return WXSdkApiImpl.getInstance().isWXAppInstalled(context);
    }

    /**
     * 打开微信
     */
    public static boolean openWXApp(Context context) {
        return WXSdkApiImpl.getInstance().openWXApp(context);
    }

    /**
     * 初始化
     * appid 微信 appid
     */
    public static boolean init(Context context, String appId) {
        return WXSdkApiImpl.getInstance().init(context, appId);
    }

    /**
     * @param context      应用上下文
     * @param hashMap      {@link ShareObject}
     *                     username 填小程序原始id
     *                     path  拉起小程序页面的可带参路径
     *                     miniprogramType  可选打开 开发版，体验版和正式版
     * @param openCallback 回调
     *                     code  {@link  WXErrCode}
     *                     msg 对应小程序组件 <button open-type="launchApp"> 中的 app-parameter 属性
     * @return 请求是发送否成功
     */
    public static boolean openMiniProgram(Context context, Map<String, Object> hashMap, @NonNull RXJSONCallback openCallback) {
        return WXSdkApiImpl.getInstance().openMiniProgram(context, WXShareObject.fromMap(hashMap), openCallback);
    }

    public static boolean openMiniProgram(Context context, Map<String, Object> hashMap,
                                          @NonNull UnityRXRequestCallback openCallback) {
        return openMiniProgram(context, hashMap, UnityBaseCommonFun.convertCallback(openCallback));
    }

    /**
     * @param context      应用上下文
     * @param hashMap      appid	必须	应用唯一标识，在微信开放平台提交应用审核通过后获得
     *                     scope	非必须	应用授权作用域，默认取用户个人信息 snsapi_userinfo
     *                     state	非必须	用于保持请求和回调的状态，授权请求后原样带回给第三方。该参数可用于防止 csrf 攻击（跨站请求伪造攻击），建议第三方带上该参数，可设置为简单的随机数加 session 进行校验。在state传递的过程中会将该参数作为url的一部分进行处理，因此建议对该参数进行url encode操作，防止其中含有影响url解析的特殊字符（如'#'、'&'等）导致该参数无法正确回传。
     * @param authCallback 授权回调
     *                     下面参数仅在成功时候时有效
     *                     auth_code    用户换取 access_token 的 code，
     *                     ang     微信客户端当前语言
     *                     county  微信用户当前国家信息
     *                     state   第三方程
     */
    @SuppressWarnings("unchecked")
    public static void login(Context context, Map<String, Object> hashMap, @NonNull RXJSONCallback authCallback) {
        Map<String, Object> map = new HashMap<>(hashMap);
        if (hashMap.containsKey("ext")) {
            map.putAll((Map<? extends String, ?>) Objects.requireNonNull(hashMap.get("ext")));
            map.remove("ext");
        }
        WXSdkApiImpl.getInstance().sendAuthReq(context, map, authCallback);
    }

    /**
     * 分享
     * @param context       应用上下文
     * @param shareMap      {@link ShareObject}字段名数据
     * @param shareCallback 分享回调
     */
    public static void share(Context context, Map<String, Object> shareMap, @NonNull RXJSONCallback shareCallback) {
        share(context, WXShareObject.fromMap(shareMap), shareCallback);
    }

    public static void share(Context context, WXShareObject shareObject, @NonNull RXJSONCallback shareCallback) {
        WXSdkApiImpl.getInstance().sendShareReq(context, shareObject, shareCallback);
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
    public static void subscribeMessage(Context context, Map<String, Object> hashMap, @NonNull RXJSONCallback callback) {
        WXSdkApiImpl.getInstance().subscribeMessage(context, hashMap, callback);
    }

    /**
     * opensdk版本：大于等于6.7.9
     * @param context
     * @param hashMap appid 微信 appid
     *                corpId 企业ID
     *                url  客服URL
     */
    public static boolean openCustomerServiceChat(Context context, Map<String, Object> hashMap, @NonNull RXJSONCallback callback) {
        return WXSdkApiImpl.getInstance().openCustomerServiceChat(context, hashMap, callback);
    }

    public void openBusinessView(Context context, String appId, String businessType, String query, RXJSONCallback callback) {
        WXSdkApiImpl.getInstance().sendWXOpenBusinessViewReq(context, appId, businessType, query, callback);
    }


    /**
     * appid 微信 appid
     */
    public static boolean registerApp(Context context, String appId) {
        return init(context, appId);
    }

    /**
     *
     */
    public static void unregisterApp() {
        WXSdkApiImpl.getInstance().unregisterWxApp();
    }

    /**
     * get api level from installed wechat app
     * @param context context
     * @return api level
     */
    public static int getWXAppSupportAPI(Context context) {
        return WXSdkApiImpl.getInstance().getWXAppSupportAPI(context);
    }

    public static void onResume(Context context) {
        WXSdkApiImpl.getInstance().onResume(context);
    }

    @Override
    public String getName() {
        return LoginMethod.WECHAT;
    }

    @Override
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {
        String appid = paramsMap == null ? null : (String) paramsMap.get("appid");
        if (!TextUtils.isEmpty(appid)) {
            init(context, appid);
        }
        return true;
    }

    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {
        login(activity, paramsMap, callback);
        return true;
    }

    @Override
    public boolean onLoginResp(int code) {
        return false;
    }

    @Override
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {
        return false;
    }

    @Override
    public boolean doPay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (getName().equals(hashMap.get(HQType.KEY)) || "wechat".equals(hashMap.get(HQType.KEY))) {
            String className = AppUtils.getAppMetaData(activity, "RX_WECHAT_PAY");
            if (!TextUtils.isEmpty(className)) {
                try {
                    Class<?> currentClass = Class.forName(className);
                    Method msd = currentClass.getMethod("getInstance");
                    Object clsObj = msd.invoke(null);
                    Method methodShowUI = currentClass.getMethod("pay", Activity.class, Map.class, RXJSONCallback.class);
                    methodShowUI.invoke(clsObj, activity, hashMap, callback);
                    return true;
                } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException | ClassNotFoundException ignored) {
                }
            }
            return false;
        } else {
            return false;
        }
    }


}
