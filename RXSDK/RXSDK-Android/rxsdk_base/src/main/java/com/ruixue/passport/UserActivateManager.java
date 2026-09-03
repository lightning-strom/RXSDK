package com.ruixue.passport;

import android.content.Context;
import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.ClipboardData;
import com.ruixue.base.TrackDeviceInfoMgr;
import com.ruixue.error.RXErrorCode;
import com.ruixue.internal.DeviceUtils;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.HttpMethod;
import com.ruixue.net.HttpUtil;
import com.ruixue.net.RXHttpClient;
import com.ruixue.net.RXRequest;
import com.ruixue.openapi.RXApiPath;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.reflect.AdjustManager;
import com.ruixue.reflect.ChannelManager;
import com.ruixue.reflect.OpenInstallManager;
import com.ruixue.storage.StorageLoginNum;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/12/19
 */
public class UserActivateManager {

    private static UserActivateManager instanceField;

    public static UserActivateManager getInstance() {
        UserActivateManager instance = instanceField;
        if (instance == null) {
            synchronized (UserActivateManager.class) {
                if (instanceField == null) {
                    instanceField = new UserActivateManager();
                }
                return instanceField;
            }
        } else {
            return instance;
        }
    }

    /**
     * 添加启动归因参数
     *
     * @param bodyMap 登录或注册 参数
     */
    public Map<String, Object> addAttributionParams(Map<String, Object> bodyMap) {
        if (bodyMap == null)
            return null;
        //读取剪贴板并清空
        Map<String, Object> clipMap = ClipboardData.getMap(RuiXueSdk.getContext(), true);

        String channelCode = OpenInstallManager.getChannelCode();
        Map<String, Object> appData = OpenInstallManager.getAppData();
        RXLogger.d("OpenInstall channelCode:" + channelCode + ", appData:" + appData);

        if (appData != null) {
            RXLogger.d("OpenInstall clear app data");
            OpenInstallManager.clearAppData();
        }

        if (StorageLoginNum.getInstance().isFirstLogin() || RXGlobalData.getAdvertise_switch() == 1) {
            HashMap<String, String> devices = getDeviceMap(mClientIpv4);
            bodyMap.put("device", devices);
        }

        if (RXGlobalData.isModReport()) {
            try {
                String name = TrackDeviceInfoMgr.getDeviceName();
                if (bodyMap.containsKey("device")) {
                    @SuppressWarnings("unchecked") HashMap<String, Object> deviceMap = (HashMap<String, Object>) bodyMap.get("device");
                    if (name != null) {
                        Objects.requireNonNull(deviceMap).put("model", name);
                    }
                } else {
                    HashMap<String, String> netMap = new HashMap<>();
                    netMap.put("model", name);
                    bodyMap.put("device", netMap);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

        }

        if (RXGlobalData.isNetReport()) {
            try {
                String netType = TrackDeviceInfoMgr.getNetWorkType(RuiXueSdk.getContext());
                if (bodyMap.containsKey("device")) {
                    @SuppressWarnings("unchecked") HashMap<String, Object> deviceMap = (HashMap<String, Object>) bodyMap.get("device");
                    if (netType != null) {
                        Objects.requireNonNull(deviceMap).put("network_standard", netType);
                    }
                } else {
                    HashMap<String, String> netMap = new HashMap<>();
                    netMap.put("network_standard", netType);
                    bodyMap.put("device", netMap);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        if (StorageLoginNum.getInstance().isFirstLogin()) {
            String distinctId = DeviceUtils.getDistinctId(RuiXueSdk.getContext());
            if (!TextUtils.isEmpty(distinctId)) {
                bodyMap.put("distinct_id", distinctId);
            }
            Map<String, Object> activate = new HashMap<>();
            if (mActivatedResult != null) {
                activate.put("result", mActivatedResult);
            } else {
                //激活失败或未知结果时兜底激活
                Map<String, Object> argsMap = new HashMap<>();
                addSourceAdParams(argsMap, clipMap);
                addSourceAdParams(channelCode, appData, argsMap);
                addChannel(argsMap);
                // 陈汉和欧阳确认过，user_source copy source_ad 这里不处理，只在激活里处理
                if (!argsMap.isEmpty()) {
                    activate.put("args", argsMap);
                }
            }

            bodyMap.put("activate", activate);
        }

        if (!clipMap.isEmpty()) {
            String user_source = (String) clipMap.get("user_source");
            if (!TextUtils.isEmpty(user_source)) {
                clipMap.remove("user_source");
                if (!clipMap.isEmpty()) {
                    if (("attr".equals(user_source) || "attrs".equals(user_source)) && !bodyMap.containsKey("user_attrs")) {
                        //设置大数据用户属性，仅对本次登录新注册的用户有效
                        bodyMap.put("user_attrs", clipMap);
                    } else if (!bodyMap.containsKey("user_source") && !"ad".equals(user_source)) {
                        Map<String, Object> user_source_map = new HashMap<>();
                        user_source_map.put(user_source, clipMap);
                        bodyMap.put("user_source", user_source_map);
                    }
                }
            } else { // 没有 user_source 把 clipMap kv 展开放到 user_source 中
                @SuppressWarnings("unchecked") Map<String, Object> userSource = bodyMap.containsKey("user_source") ? (Map<String, Object>) bodyMap.get("user_source") : new HashMap<>();
                if (userSource != null) {
                    userSource.putAll(clipMap);
                    bodyMap.put("user_source", userSource);
                }
            }
        }

        String subChannelId = getSubChannel();
        if (!TextUtils.isEmpty(subChannelId)) {
            @SuppressWarnings("unchecked") Map<String, Object> user_source = bodyMap.containsKey("user_source") ? (Map<String, Object>) bodyMap.get("user_source") : new HashMap<>();
            if (user_source != null) {
                Map<String, Object> s = new HashMap<>();
                s.put("sub_channel_id", subChannelId);
                s.put("package_type", "promoter");
                user_source.put("sub_package", s);
                bodyMap.put("user_source", user_source);
            }
        }
        String pushTaskId = RXGlobalData.getPushTaskId();
        if (!TextUtils.isEmpty(pushTaskId)) {
            @SuppressWarnings("unchecked") Map<String, Object> user_source = bodyMap.containsKey("user_source") ? (Map<String, Object>) bodyMap.get("user_source") : new HashMap<>();
            if (user_source != null) {
                Map<String, Object> s = new HashMap<>();
                s.put("taskid", pushTaskId);
                user_source.put("push", s);
                bodyMap.put("user_source", user_source);
            }
        }

        addOpenInstallParams(channelCode, appData, bodyMap);

        return bodyMap;
    }

    private void addOpenInstallParams(String channelCode, Map<String, Object> appData, Map<String, Object> map) {
        try {
            @SuppressWarnings("unchecked") Map<String, Object> user_source = (Map<String, Object>) map.get("user_source");
            if (user_source == null) {
                user_source = new HashMap<>();
            }

            if (appData != null) {
                Map<String, Object> openInstall = new HashMap<>();
                openInstall.put("channel_code", channelCode);
                openInstall.put("data", appData);
                user_source.put("openinstall", openInstall);
                map.put("user_source", user_source);
            }
        } catch (Exception e) {
            RXLogger.d("OpenInstall add open install params error, " + e.getMessage());
        }
    }


    public String getSubChannel() {
        String subChannelId = RXGlobalData.getsSubChannelId();
        if (TextUtils.isEmpty(subChannelId)) {
            subChannelId = ChannelManager.getChannel(RuiXueSdk.getContext());
        }
        return subChannelId;
    }

    @SuppressWarnings("unchecked")
    public void addChannel(Map<String, Object> map) {
        Context context = RXGlobalData.getContext();
        if (context != null) {
//            String channel = WebSocketManager.getChannel(context);
            String channel = ChannelManager.getChannel(context);
            if (!TextUtils.isEmpty(channel)) {
                Map<String, Object> source_ad = map.containsKey("source_ad") ? (Map<String, Object>) map.get("source_ad") : new HashMap<>();
                if (source_ad == null) {
                    source_ad = new HashMap<>();
                }
                Map<String, Object> ad_rawargs = new HashMap<>();
                ad_rawargs.put("game_aweme_id", channel);//modify common id from xt_game_aweme_id
                source_ad.put("ad_rawargs", ad_rawargs);
                source_ad.put("ad_platform", ChannelManager.getType(context));
                map.put("source_ad", source_ad);
            }
        } else {
            RXLogger.e("context null error");
        }
    }

    private void addSourceAdParams(Map<String, Object> activatedMap, Map<String, Object> clipMap) {
        if (!activatedMap.containsKey("source_ad")) {
//            Map<String, Object> clipMap = ClipboardData.getMap(RuiXueSdk.getContext(), false);
            if (clipMap.containsKey("source_ad") || (clipMap.containsKey("user_source") && "ad".equals(clipMap.get("user_source")))) {
                clipMap.remove("user_source");
                if (!clipMap.isEmpty()) {
                    activatedMap.put("source_ad", clipMap);
                }
                String ad_platform = (String) activatedMap.get("ad_platform");
                if (!TextUtils.isEmpty(ad_platform)) {
                    if (AD_PLATFORM.TENCENT.equals(ad_platform)) {
                        if (activatedMap.containsKey("gdt_vid")) {
                            activatedMap.put("click_id", activatedMap.get("gdt_vid"));
                            activatedMap.remove("gdt_vid");
                        }
                    } else if (AD_PLATFORM.OCEANENGINE.equals(ad_platform)) {
                        if (activatedMap.containsKey("req_id")) {
                            activatedMap.put("click_id", activatedMap.get("req_id"));
                            activatedMap.remove("req_id");
                        }
                    } else if (AD_PLATFORM.BAIDU.equals(ad_platform)) {
                        if (activatedMap.containsKey("bd_vid")) {
                            activatedMap.put("click_id", activatedMap.get("bd_vid"));
                            activatedMap.remove("bd_vid");
                        }
                    }
                }
            }
        }
    }


    @NonNull
    public HashMap<String, String> getDeviceMap(String ipv4) {
        HashMap<String, String> devices = new HashMap<>();
        devices.put("user_agent", System.getProperty("http.agent"));
        devices.put("user_agent1", RuiXueSdk.getWebViewUA());
        Context context = RXGlobalData.getContext();
        if (null == context) {
            return devices;
        }
        String androidId = DeviceUtils.getAndroidId(context);
        String oaid = DeviceUtils.getOAID(context);
        String gaid = DeviceUtils.getGAID(context);
        String mac = DeviceUtils.getMacAddress(context);
        String imei = DeviceUtils.getIMEI(context);
        String packageName = context.getPackageName();
        devices.put("package_name", packageName);
        if (!TextUtils.isEmpty(ipv4)) {
            devices.put("ipv4", ipv4);
        }
        if (!TextUtils.isEmpty(androidId)) {
            devices.put("android_id", androidId);
        }
        if (!TextUtils.isEmpty(oaid)) {
            devices.put("oaid", oaid);
        }
        if (!TextUtils.isEmpty(gaid)) {
            devices.put("gaid", gaid);
        }
        if (!TextUtils.isEmpty(mac)) {
            devices.put("mac", mac);
        }
        if (!TextUtils.isEmpty(imei)) {
            devices.put("imei", imei);
        }
        return devices;
    }

    JSONObject mActivatedResult;
    String mClientIpv4;
    Map<String, Object> mActivatedMap;
    //是否激活中或激活成功
    AtomicBoolean isUserActivated = new AtomicBoolean(false);
    //激活失败重试次数
    static final int userActivatedReTryCount = 2;


    public static class AD_PLATFORM {
        /**
         * 腾讯 gdt_vid作为clickid传给后端。其他字段则透传
         */
        public static final String TENCENT = "tencent";
        /**
         * req_id作为clickid传给后端。
         */
        public static final String OCEANENGINE = "oceanengine";
        /**
         * 其他字段透传。
         */
        public static final String KUAISHOU = "kuaishou";

        public static final String BAIDU = "baidu";
    }

    /**
     * 首次启动用户激活
     */
    public void userActivated(Map<String, Object> bodyMap, RXJSONCallback callback) {
        if (!RuiXueSdk.isFullyInitialized() || !RuiXueSdk.isAgreedPrivacy()) {
            RXLogger.e("未初始化或未同意用户隐私协议，无法激活设备");
            if (callback != null) {
                callback.onFailed(RXErrorCode.THIRD_INIT_ERROR.toJSONObject());
            }
        } else if (isUserActivated.compareAndSet(false, true) && StorageLoginNum.getInstance().isFirstStart()) {
            Map<String, Object> activatedBodyMap = bodyMap == null ? new HashMap<>() : bodyMap;
            activatedBodyMap.put("distinct_id", DeviceUtils.getDistinctId(RXGlobalData.getContext()));
            StorageLoginNum.getInstance().addSelf();
            if (!activatedBodyMap.containsKey("source_ad")) {
                Map<String, Object> clipMap = ClipboardData.getMap(RuiXueSdk.getContext(), false);
                addSourceAdParams(activatedBodyMap, clipMap);
            }
            RXLogger.d("OpenInstall add open install params for user active " + OpenInstallManager.getAppData());
            addSourceAdParams(OpenInstallManager.getChannelCode(), OpenInstallManager.getAppData(), activatedBodyMap);
            addChannel(activatedBodyMap);
            addUserSourceForActivated(activatedBodyMap);
            sendActivatedReq(activatedBodyMap, callback);
        }
    }

    private void addUserSourceForActivated(Map<String, Object> activatedBodyMap) {
        try {
            if (activatedBodyMap == null) {
                return;
            }
            @SuppressWarnings("unchecked") Map<String, Object> sourceAd = (Map<String, Object>) activatedBodyMap.get("source_ad");
            if (sourceAd == null) {
                return;
            }

            // 复制一份新的 Map（内容一致，但不是同一个引用）
            Map<String, Object> userSource = new HashMap<>(sourceAd);
            activatedBodyMap.put("user_source", userSource);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void addSourceAdParams(String channelCode, Map<String, Object> appData, Map<String, Object> activatedBodyMap) {
        try {
            @SuppressWarnings("unchecked") Map<String, Object> source_ad = (Map<String, Object>) activatedBodyMap.get("source_ad");

            if (source_ad == null) {
                source_ad = new HashMap<>();
            }

            if (appData != null) {
                Map<String, Object> openInstall = new HashMap<>();
                openInstall.put("channel_code", channelCode);
                openInstall.put("data", appData);

                source_ad.put("openinstall", openInstall);
                activatedBodyMap.put("source_ad", source_ad);
            }
        } catch (Exception e) {
            e.printStackTrace();
            RXLogger.d("OpenInstall add open install params error, " + e.getMessage());
        }
    }

    private void sendActivatedReq(Map<String, Object> activatedBodyMap, RXJSONCallback callback) {
        ThreadUtils.getInstance().runOnBgThreadDelay(new Runnable() {
            @Override
            public void run() {
                String ipv4 = getIpv4Sync();
                Context context = RuiXueSdk.getContext();

                HashMap<String, String> devices = getDeviceMap(ipv4);

                activatedBodyMap.put("device", devices);
                HashMap<String, Object> initActivatedMap = new HashMap<>(activatedBodyMap);
                initActivatedMap.put("stage", "init");
                sendUserActivatedReq(0, initActivatedMap, callback);
                if (!devices.containsKey("oaid")) {
                    DeviceUtils.getOAIDAsync(context, (isSupport, oaid) -> {
                        if (isSupport && !TextUtils.isEmpty(oaid)) {
                            RXLogger.i("rxsdk", "oaid getOAIDAsync== :" + isSupport + " :" + oaid);
                            HashMap<String, Object> oaidReadyMap = new HashMap<>(activatedBodyMap);
                            oaidReadyMap.put("stage", "oaid_ready");
                            oaidReadyMap.put("device", getDeviceMap(ipv4));
                            sendUserActivatedReq(0, oaidReadyMap, callback);
                        }
                    });
                }
            }
        }, 0);
    }

    public String getIpv4Sync() {
        String url = RXGlobalData.getIpv4Url();
        if (TextUtils.isEmpty(url)) {
//            RXLogger.e("rx ipv4url is null error，Check the initialization parameters");
            return "";
        }
        url += url.endsWith("/") ? "" : "/";
        url = url + RXApiPath.GET_IP;

        RXHttpClient.Builder builder = new RXHttpClient.Builder();
        builder.connectTimeout(3000, TimeUnit.MILLISECONDS);
        builder.readTimeout(3000, TimeUnit.MILLISECONDS);
        JSONObject reqObj = builder.build().apiRequest(HttpMethod.GET, url, "", HttpUtil.getDefaultHeaders(), null);

//                JSONObject reqObj = HttpClient.get(url, "", HttpUtil.getDefaultHeaders(), false, 3000, 3000, null);
        String ipv4 = reqObj.has("ip") ? reqObj.optString("ip") : reqObj.optString("client_ip");
        mClientIpv4 = ipv4;
        return ipv4;
    }


    private void sendUserActivatedReq(int reCount, Map<String, Object> activatedBodyMap, RXJSONCallback callback) {
        activatedBodyMap.put("activate_time", System.currentTimeMillis() - RuiXueSdk.START_TIME);
        mActivatedMap = activatedBodyMap;
        RXRequest.create(RXApiPath.Passport.FIRST_ACTIVATED).setNeedLoggedIn(false).setBody(activatedBodyMap).postAsync(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                mActivatedResult = data;
                AdjustManager.activate((String) activatedBodyMap.get("distinct_id"));//修改为激活成功调用2024年04月01日11:11:29
                if (callback != null)
                    callback.onSuccess(data);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (reCount < userActivatedReTryCount) {
                    RXLogger.i("sendUserActivatedReq:" + cause.toString() + ",reCount :" + reCount);
                    ThreadUtils.getInstance().runOnBgThreadDelay(new Runnable() {
                        @Override
                        public void run() {
                            sendUserActivatedReq(reCount + 1, activatedBodyMap, callback);
                        }
                    }, 100);
                } else {
                    isUserActivated.set(false);
                    if (callback != null)
                        callback.onFailed(cause);
                }
            }
        });
    }
}
