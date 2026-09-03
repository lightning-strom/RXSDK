package com.ruixue.openapi;

import android.app.Activity;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.callback.RXStringCallback;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RxErrorReportUtil;
import com.ruixue.passport.LoginParams;
import com.ruixue.utils.AppUtils;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 海外渠道公共基类。
 * <p>
 * 提供插件式三方登录/登出分发、Google Play 跳转、反射式商品查询等海外渠道通用逻辑。
 * 各海外渠道（Google、Apkpure、OPPO 海外等）可继承本类，只需覆写 {@link #getSdkInfo()}
 * 和 {@link #getSupportPluginNames()} 即可。
 * <p>
 * <b>约定：</b>海外宿主 {@link SdkInfo} 必须 {@code state == 1}，否则 {@link RuiXueSdk#isOasVersion()}
 * 为 false，会走错国内 H5 / 支付路由等。新增宿主请在 {@link #getSdkInfo()} 中调用
 * {@link #buildOverseasSdkInfo(String)} 或 {@link #buildOverseasSdkInfo(String, String)}，
 * 勿手写 {@link SdkInfo.Builder} 漏掉 {@link SdkInfo.Builder#setState(int)}。
 */
public class RXSdkApiPlugin extends RXSdkApi {

    private String mLastLoginMethod;

    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder()
                .setName("ruixue")
                .setExt("RXSdkApiDefault")
                .setState(1)
                .setVersion(RuiXueSdk.getSdkVersion())
                .build();
    }

    /**
     * 构建海外宿主 SdkInfo（固定 {@code state == 1}，供 {@link RuiXueSdk#isOasVersion()} 判断）。
     *
     * @param channelName 渠道名，对应 {@link SdkInfo#getName()}
     */
    @NonNull
    protected SdkInfo buildOverseasSdkInfo(@NonNull String channelName) {
        return buildOverseasSdkInfo(channelName, null);
    }

    /**
     * 构建海外宿主 SdkInfo；{@code plugins != null} 时写入 {@link SdkInfo.Builder#setPlugins(String)}。
     *
     * @param channelName 渠道名
     * @param plugins     可选，一般为 {@code getPlugins().keySet().toString()}
     */
    @NonNull
    protected SdkInfo buildOverseasSdkInfo(@NonNull String channelName, @Nullable String plugins) {
        SdkInfo.Builder b = new SdkInfo.Builder()
                .setName(channelName)
                .setState(1)
                .setVersion(RuiXueSdk.getSdkVersion());
        if (plugins != null) {
            b.setPlugins(plugins);
        }
        return b.build();
    }

    // ==================== 应用商店 ====================

    @Override
    public boolean jumpToAppStore(Activity activity) {
        return AppUtils.launchAppDetail(activity, activity.getPackageName(), "com.android.vending");
    }

    // ==================== 三方登录 ====================

    @Override
    protected boolean thirdLogin(Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        LoginParams loginParams = LoginParams.fromMap(map);
        if (loginParams == null || TextUtils.isEmpty(loginParams.getMethod())) {
            if (callback != null) {
                callback.onError(new RXException("Login method is abnormal."));
            }
            return true;
        }

        if (!TextUtils.isEmpty(loginParams.getLoginOpenid())) {
            return false;
        }

        RXJSONCallback proxyCallback = new RXJSONCallback() {
            @Override
            public void onSuccess(@androidx.annotation.Nullable org.json.JSONObject data) {
                if (callback != null) callback.onSuccess(data);
            }

            @Override
            public void onFailed(@NonNull org.json.JSONObject cause) {
                RxErrorReportUtil.setBusinessReportError(new HashMap<>(), new HashMap<>(),
                        loginParams.getMethod(), "rxlog_error_login", cause);
                if (callback != null) callback.onFailed(cause);
            }
        };

        IPluginSdk thirdSdk = getPlugins().get(loginParams.getMethod());
        if (thirdSdk != null) {
            mLastLoginMethod = loginParams.getMethod();
            return thirdSdk.doLogin(activity, map, proxyCallback);
        } else {
            if (callback != null) {
                callback.onError(new RXException("Login method [" + loginParams.getMethod() + "] is not supported."));
            }
            return false;
        }
    }

    // ==================== 三方登出 ====================

    @Override
    protected boolean thirdLogout(@NonNull OnLogoutCallback callback) {
        if (!TextUtils.isEmpty(mLastLoginMethod)) {
            IPluginSdk thirdSdk = getPlugins().get(mLastLoginMethod);
            if (thirdSdk != null) {
                return thirdSdk.doLogout(RuiXueSdk.getCurrentActivity(), callback);
            }
        }
        return false;
    }

    // ==================== 反射式商品查询 ====================

    public boolean getProductInfo(Activity activity, List<String> skusList, RXStringCallback callback) {
        Class<?> pluginClass = loadClass(AppUtils.getAppMetaData(activity, "RX_PLUGIN_GOOGLE"));
        if (pluginClass != null) {
            try {
                Method getInstance = pluginClass.getMethod("getInstance");
                Object instance = getInstance.invoke(null);
                Method queryMethod;
                try {
                    queryMethod = pluginClass.getMethod("getProductsInfo", List.class, RXStringCallback.class);
                } catch (NoSuchMethodException ignored) {
                    try {
                        queryMethod = pluginClass.getMethod("getProducts", List.class, RXStringCallback.class);
                    } catch (NoSuchMethodException ignored2) {
                        // 兼容 4.0.11 之前的 GoogleSdkWrapper 接口名
                        queryMethod = pluginClass.getMethod("queryProductDetailsAsync", List.class, RXStringCallback.class);
                    }
                }
                queryMethod.invoke(instance, skusList, callback);
                return true;
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
                if (callback != null) callback.onError(new RXException(e));
            }
        } else {
            if (callback != null) callback.onError(new RXException("nonsupport getProductInfo func"));
        }
        return false;
    }

    // ==================== 工具方法 ====================

    protected Class<?> loadClass(String className) {
        if (!TextUtils.isEmpty(className)) {
            try {
                return Class.forName(className);
            } catch (Exception e) {
                RXLogger.e("loadClass failed: " + className, e.getMessage());
            }
        }
        return null;
    }
}
