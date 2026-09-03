package com.ruixue;

import android.app.Activity;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.base.TrackDataMgr;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.internal.DeviceUtils;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RequestManager;
import com.ruixue.net.RxErrorReportUtil;
import com.ruixue.openapi.IRXSdkUI;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.passport.PassportManager;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.FutureTask;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2025/6/17
 */
class RXSdkInitializer {

    static class Single {
        final static RXSdkInitializer INSTANCE = new RXSdkInitializer();
    }

    @NonNull
    public static RXSdkInitializer getInstance() {
        return Single.INSTANCE;
    }

    private RXSdkInitConfig initConfig;

    /**
     * @return sdk 是否初始化完成
     */
    public boolean isFullyInitialized() {
        return RXGlobalData.isFullyInitialized();
    }

    private void checkInitializedFully() {
        if (isFullyInitialized()) {
            if (PassportManager.getInstance().isLoggedIn()) {
                PassportManager.getInstance().fetchCurrentAccessTokenAsync(null);
            }
            RequestManager.getInstance().flushRequestQueue();
        }
    }

    public void initialize(String cpid, String productid, String channelid, List<String> urls,
            @NonNull RXJSONCallback callback) {
        if (TextUtils.isEmpty(productid) || TextUtils.isEmpty(cpid) || TextUtils.isEmpty(channelid)) {
            throw new NullPointerException("please check ruixue productid 、cpid 、channelid params not null");
        }
        RXGlobalData.init(cpid, productid, channelid);
        RXGlobalData.setBaseUrls(urls);
        checkInitializedFully();
        RXLogger.init();
        initialize(RuiXueSdk.getCurrentActivity(), false, callback);
    }

    public void initialize(RXSdkInitConfig config) {
        this.initConfig = config;
        RXGlobalData.init(config);
        if (config.getInitializeCallback() == null) {
            RXLogger.e("RXSdkInitConfig setInitializeCallback mast be non null");
        }
        if (config.isUsePrivacy() && !RuiXueSdk.isAgreedPrivacy()) {
            IRXSdkUI irxSdkUI = RXSdkApi.getInstance().getUI();
            if (irxSdkUI == null) {
                if (config.getInitializeCallback() != null) {
                    RXLogger.e(
                            "Not implementation rxsdk_base_ui library ,please reference doc https://doc.ruixueyun.com/dev_doc/introduction/started/client.html#sdk-%E9%9B%86%E6%88%90");
                    config.getInitializeCallback().onError(new RXException("Not implementation rxsdk_base_ui library"));
                }
            } else {
                ThreadUtils.getInstance()
                        .runOnUiThread(() -> irxSdkUI.userPrivacyPolicy(
                                Objects.requireNonNull(config.getActivity(),
                                        "error RXSdkInitConfig setActivity mast not null"),
                                config.getAgreementTitle(), config.getAgreementContent(), config.getAgreementKeyArray(),
                                new RXJSONCallback() {
                                    @Override
                                    public void onSuccess(@Nullable JSONObject data) {
                                        initialize(config.getActivity(), config.isAutoInitThird(),
                                                config.getInitializeCallback());
                                    }

                                    @Override
                                    public void onFailed(@NonNull JSONObject cause) {
                                        if (config.getInitializeCallback() != null) {
                                            config.getInitializeCallback().onFailed(cause);
                                        }
                                    }
                                }).show());
            }
        } else {
            Activity activity = config.getActivity();
            if (activity != null) {
                RXSdkApi.getInstance().setPrivacyAgree(activity, null);
            }
            initialize(activity, config.isAutoInitThird(), config.getInitializeCallback());
        }
    }

    public void initialize(Activity activity, boolean autoInitThird, RXJSONCallback callback) {
        Log.i("RXSDK", "RXSDK--Version: " + RuiXueSdk.getSdkVersion());
        if (activity == null) {
            RXLogger.e("rxsdk initialize failed: RXSdkInitConfig mast be invoke setActivity params");
            if (callback != null) {
                callback.onError(new RXException(RXErrorCode.INIT_ERROR.getValue(),
                        "RXSdkInitConfig must be called with a non-null Activity"));
            }
            return;
        }

        RXCallbackWrapper safeCallback = new RXCallbackWrapper(callback, autoInitThird ? 2 : 1, 100000);

        if (autoInitThird) {
            Map<String, Object> map = null;
            if (this.initConfig != null) {
                map = this.initConfig.getThirdSdkParams();
            }
            if (map == null || map.isEmpty())
                map = AppUtils.getMetaDataByPrefix(activity, "rx_" + RXSdkApi.getInstance().getChannel() + "_");

            RXSdkApi.getInstance().initThirdSdk(activity, map, new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    RXLogger.i("Third-party SDK init success");
                    safeCallback.invokeSuccess(null);
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    RXLogger.e("Third-party SDK init failed" + cause);
                    safeCallback.onFailed(cause);
                }
            });
        }
        FutureTask<?> future = new FutureTask<>(() -> {
            try {
                RXGlobalData.setSdkInitComplete(true);
                DeviceUtils.init(activity);
                boolean load = PassportManager.getInstance().load();
                RXLogger.i("rxsdk init: " + RuiXueSdk.getJSONConfig());
                if (load) {
                    RXLogger.i("ruixue logindata cache is loaded");
                }
                checkInitializedFully();
                TrackDataMgr.getInstance().initConfig(activity, new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        PassportManager.getInstance().userActivated(RXGlobalData.getActivatedMap(), null);

                        safeCallback.invokeSuccess(data);
                        if (RxErrorReportUtil.ThirdInitError.isError) {
                            RxErrorReportUtil.setBusinessReportError(new HashMap<>(), new HashMap<>(),
                                    RxErrorReportUtil.ThirdInitError.thirdName, "rxlog_error_init",
                                    RxErrorReportUtil.ThirdInitError.cause);
                            RxErrorReportUtil.ThirdInitError.isError = false;
                        }
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        safeCallback.onFailed(cause);
                        RxErrorReportUtil.setBusinessReportError(new HashMap<>(), new HashMap<>(), "",
                                "rxlog_error_init", cause);
                        if (RxErrorReportUtil.ThirdInitError.isError) {
                            RxErrorReportUtil.setBusinessReportError(new HashMap<>(), new HashMap<>(),
                                    RxErrorReportUtil.ThirdInitError.thirdName, "rxlog_error_init",
                                    RxErrorReportUtil.ThirdInitError.cause);
                            RxErrorReportUtil.ThirdInitError.isError = false;
                        }
                    }
                });
            } catch (Exception e) {
                safeCallback.onError(new RXException(RXErrorCode.INIT_ERROR.getValue(), e));
            }
            return true;
        });
        ThreadUtils.getInstance().execute(future);
    }
}
