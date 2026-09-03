package com.ruixue.reflect;

import android.content.Context;

import androidx.annotation.NonNull;

import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXException;
import com.ruixue.share.ShareObject;

import java.lang.reflect.Method;
import java.util.Map;

@Deprecated
public class WXManager extends BaseReflectClass {
    private static final String PLUGIN_NAME = "RX_PLUGIN_WECHAT";
    private static Class<?> pluginClass = null;

    public static Class<?> getPluginClass(Context context) {
        if (pluginClass == null) {
            final String packageClassName = getMetaDataVal(context, PLUGIN_NAME);
            pluginClass = getClass(packageClassName);
        }
        return pluginClass;
    }

    /**
     * 注册微信app，注册成功后该应用将显示在微信的app列表中
     *
     * @param context 应用上下文
     * @param appId   微信应用的appId
     * @return 成功返回true，会显示在微信第三方列表中，否则不显示
     */
    public static boolean registerApp(Context context, String appId) {
        Class<?> plugin = getPluginClass(context);
        if (plugin != null) {
            try {
                Method method = plugin.getMethod("registerApp", Context.class, String.class);
                return (boolean) method.invoke(null, context, appId);
            } catch (Exception e) {
                printStackTrack(e);
            }
        }
        return false;
    }

    /**
     * 反注册微信app，成功后将不再显示在微信的app列表中
     *
     * @param context 应用上下文
     */
    public static void unregisterApp(Context context) {
        Class<?> plugin = getPluginClass(context);
        if (plugin != null) {
            try {
                Method methodInit = plugin.getMethod("unregisterApp");
                methodInit.invoke(null);
            } catch (Exception e) {
                printStackTrack(e);
            }
        }
    }

    /**
     * 是否安装有微信
     *
     * @return 是否安装
     */
    public static boolean isWXAppInstalled(Context context) {
        Class<?> plugin = getPluginClass(context);
        if (plugin != null) {
            try {
                Method methodInit = plugin.getMethod("isWXAppInstalled", Context.class);
                return (boolean) methodInit.invoke(null, context);
            } catch (Exception e) {
                printStackTrack(e);
            }
        }
        return false;
    }

    /**
     * 打开微信 app
     *
     * @return 是否打开成功
     */
    public static boolean openWXApp(Context context) {
        Class<?> plugin = getPluginClass(context);
        if (plugin != null) {
            try {
                Method methodInit = plugin.getMethod("openWXApp", Context.class);
                return (boolean) methodInit.invoke(null, context);
            } catch (Exception e) {
                printStackTrack(e);
            }
        }
        return false;
    }

    /**
     * @param context      应用上下文
     * @param hashMap      {@link ShareObject}
     *                     username 填小程序原始id
     *                     path  拉起小程序页面的可带参路径
     *                     miniprogramType  可选打开 开发版，体验版和正式版
     * @param openCallback 回调
     *                     code  微信返回的 ErrCode
     *                     msg 对应小程序组件 <button open-type="launchApp"> 中的 app-parameter 属性
     */
    public static void openMiniProgram(Context context, Map<String, Object> hashMap, @NonNull RXJSONCallback openCallback) {
        Class<?> plugin = getPluginClass(context);
        if (plugin != null) {
            try {
                Method methodInit = plugin.getMethod("openMiniProgram", Context.class, Map.class, RXJSONCallback.class);
                methodInit.invoke(null, context, hashMap, openCallback);
            } catch (Exception e) {
                printStackTrack(e);
                openCallback.onError(new RXException(e));
            }
        }
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
    public static void login(Context context, Map<String, Object> hashMap, @NonNull RXJSONCallback authCallback) {
        Class<?> plugin = getPluginClass(context);
        if (plugin != null) {
            try {
                Method methodInit = plugin.getMethod("login", Context.class, Map.class, RXJSONCallback.class);
                methodInit.invoke(null, context, hashMap, authCallback);
            } catch (Exception e) {
                printStackTrack(e);
                authCallback.onError(new RXException(e));
            }
        }
    }

    /**
     * 分享
     *
     * @param context       应用上下文
     * @param map   {@link ShareObject}字段名数据
     * @param shareCallback 分享回调
     */
    public static void share(Context context,Map<String, Object> map, @NonNull RXJSONCallback shareCallback) {
        Class<?> plugin = getPluginClass(context);
        if (plugin != null) {
            try {
                Method methodInit = plugin.getMethod("share", Context.class, Map.class, RXJSONCallback.class);
                methodInit.invoke(null, context, map, shareCallback);
            } catch (Exception e) {
                printStackTrack(e);
                shareCallback.onError(new RXException(e));
            }
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
    public static void subscribeMessage(Context context, Map<String, Object> hashMap, @NonNull RXJSONCallback callback) {
        Class<?> plugin = getPluginClass(context);
        if (plugin != null) {
            try {
                Method methodInit = plugin.getMethod("subscribeMessage", Context.class, Map.class, RXJSONCallback.class);
                methodInit.invoke(null, context, hashMap, callback);
            } catch (Exception e) {
                printStackTrack(e);
            }
        }
    }


    public static void onResume(Context context) {
        Class<?> plugin = getPluginClass(context);
        if (plugin != null) {
            try {
                Method methodInit = plugin.getMethod("onResume", Context.class);
                methodInit.invoke(null, context);
            } catch (Exception e) {
                printStackTrack(e);
            }
        }
    }
}
