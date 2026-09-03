package com.ruixue.base;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.internal.DeviceUtils;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.HttpMethod;
import com.ruixue.net.HttpUtil;
import com.ruixue.net.RXHttpClient;
import com.ruixue.net.RXRequest;
import com.ruixue.openapi.RXApiPath;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXSdkAnalytics;
import com.ruixue.openapi.RXSdkGdtAnalytics;
import com.ruixue.openapi.RXSdkKwaiAnalytics;
import com.ruixue.passport.PassportManager;
import com.ruixue.performancereport.PerformReportManager;
import com.ruixue.reflect.AdjustManager;
import com.ruixue.reflect.OpenInstallManager;
import com.ruixue.storage.SharedPreferencesLoader;
import com.ruixue.storage.StorageJSONArray;
import com.ruixue.storage.StorageString;
import com.ruixue.utils.AnnouncementCacheUtil;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.DateUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;
import com.ruixue.utils.ThreadUtils;
import com.ruixue.utils.VersionLoginConfigUtils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicBoolean;

public class TrackDataMgr {

    private static class Single {
        static TrackDataMgr sInstance = new TrackDataMgr();
    }

    public static TrackDataMgr getInstance() {
        return Single.sInstance;
    }

    static int DEFAULT_FLUSH_BULK_SIZE = 100; // 默认触发上报条数
    static int DEFAULT_FLUSH_INTERVAL = 60 * 1000; // 默认间隔
    DataHandle smDataHandle;
    private final AtomicBoolean tracking = new AtomicBoolean(false);

    private Map<String, Object> propertiesMap;

    private boolean sdkErrorTrackEnable = true;

    public TrackDataMgr trackConfig(int reportTime, int maxCount) {
        if (reportTime > 0)
            DEFAULT_FLUSH_INTERVAL = reportTime;
        if (maxCount > 0)
            DEFAULT_FLUSH_BULK_SIZE = maxCount;
        return this;
    }

    /**
     * 单独设置埋点上报时间间隔。
     *
     * @param flushInterval 上报时间间隔（毫秒），{@code <=0} 时忽略
     */
    public TrackDataMgr setFlushInterval(int flushInterval) {
        if (flushInterval > 0)
            DEFAULT_FLUSH_INTERVAL = flushInterval;
        return this;
    }

    /**
     * 单独设置埋点最大缓存条数。
     *
     * @param maxCacheCount 最大缓存条数，{@code <=0} 时忽略
     */
    public TrackDataMgr setMaxCacheCount(int maxCacheCount) {
        if (maxCacheCount > 0)
            DEFAULT_FLUSH_BULK_SIZE = maxCacheCount;
        return this;
    }

    public Map<String, Object> getPropertiesMap() {
        return propertiesMap == null ? new HashMap<>() : propertiesMap;
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getPublicProperties(String event) {
        Map<String, Object> publicPro = new HashMap<>();
        if (propertiesMap != null && public_attr != null && public_attr.containsKey(event)) {
            Object obj = public_attr.get(event);
            if ((obj instanceof List)) {
                List<String> properties = (List<String>) obj;
                for (String e : properties) {
                    publicPro.put(e, propertiesMap.get(e));
                }
            }
        }
        return publicPro;
    }

    public void delPropertiesMap(String key) {
        if (propertiesMap != null && key != null) {
            propertiesMap.remove(key);
        }
    }

    public void setPropertiesMap(Map<String, Object> propertiesMap) {
        this.propertiesMap = propertiesMap;
    }

    public void putPropertiesMap(String key, Object value) {
        if (propertiesMap == null) {
            propertiesMap = new HashMap<>();
        }
        if (key != null && value != null) {
            propertiesMap.put(key, value);
        }
    }

    public boolean isTracking() {
        return tracking.get();
    }

    private static class DataHandle extends Handler {
        private static final int FLUSH_QUEUE = 1;
        private static final int SAVE_DADA = 2;
        // private Handler mWorkHandler;
        final StorageJSONArray mFlushTrackData;
        private static final String PREFERENCE_NAME_PREFIX = "com.ruixue.trackdata";
        static final HandlerThread workerThread = new HandlerThread("sendTrackMessageWorker", Thread.MIN_PRIORITY);

        static {
            workerThread.start();
        }

        public DataHandle(Context context) {
            super(workerThread.getLooper());
            Future<SharedPreferences> storedSharedPrefs = SharedPreferencesLoader.get().loadPreferences(context,
                    PREFERENCE_NAME_PREFIX);
            mFlushTrackData = new StorageJSONArray(storedSharedPrefs, "track_data_array");
            posterToServer();
        }

        @Override
        public void handleMessage(@NonNull Message msg) {
            super.handleMessage(msg);
            if (msg.what == FLUSH_QUEUE) {
                String jsonStr;
                int length;
                // 短暂持锁：快照数据并清空缓冲区，防止阻塞主线程 saveData()
                synchronized (mFlushTrackData) {
                    JSONArray jsonArray = mFlushTrackData.get();
                    if (jsonArray == null)
                        return;
                    synchronized (jsonArray) {
                        length = jsonArray.length();
                        if (length == 0)
                            return;
                        jsonStr = jsonArray.toString();
                    }
                    mFlushTrackData.put(null);
                }
                // 网络 I/O 在锁外执行，不会阻塞其他线程
                if (!sendData(jsonStr, length)) {
                    // 发送失败：将数据回填到缓冲区，等待下次重试
                    try {
                        JSONArray unsent = new JSONArray(jsonStr);
                        synchronized (mFlushTrackData) {
                            JSONArray current = mFlushTrackData.get();
                            if (current != null && current.length() > 0) {
                                // 旧数据在前，新数据追加到末尾，保持时间顺序
                                synchronized (current) {
                                    for (int i = 0; i < current.length(); i++) {
                                        unsent.put(current.opt(i));
                                    }
                                }
                            }
                            mFlushTrackData.put(unsent);
                        }
                    } catch (Throwable ignored) {
                    }
                }
            }
        }

        /**
         * post请求，返回是否发送成功
         */
        private boolean sendData(String jsonArray, int length) {
            if (jsonArray == null || length <= 0 || !RuiXueSdk.isFullyInitialized()) {
                return false;
            }
            Map<String, String> headers = HttpUtil.getDefaultHeaders();
            headers.put("Accept-Encoding", "gzip");
            headers.put("content-encoding", "gzip");
            headers.put("content-type", "application/json");
            headers.put("ruixue-datacount", String.valueOf(length));
            try {
                RXHttpClient.Builder builder = new RXHttpClient.Builder();
                builder.setCompress(true);
                builder.setRestfulData(true);
                JSONObject jsonObject = builder.build().apiRequest(HttpMethod.POST, RXApiPath.Data.TRACK_DATA_API,
                        jsonArray, headers, null);
                int code = jsonObject.optInt("code", -1);
                return (code == 0 || code == 9040);
            } catch (OutOfMemoryError e) {
                return true;
            } catch (Throwable e) {
                e.printStackTrace();
                return false;
            }
        }

        private boolean saveData(Map<String, Object> eventDataMap, int delay, int maxCacheCount) {
            synchronized (mFlushTrackData) {
                try {
                    long ts = System.currentTimeMillis();
                    JSONArray jsonArray = mFlushTrackData.get();
                    jsonArray = jsonArray == null ? new JSONArray() : jsonArray;
                    JSONObject item = new JSONObject(eventDataMap);
                    int length;
                    synchronized (jsonArray) {
                        jsonArray.put(item);
                        length = jsonArray.length();
                    }
                    mFlushTrackData.put(jsonArray);
                    checkSendStrategy(length, delay, maxCacheCount);
                    RXLogger.i("cached data=" + item + " ,total_length=" + length + ",spend="
                            + (System.currentTimeMillis() - ts));
                    return true;
                } catch (OutOfMemoryError e) {
                    posterToServer();
                    return false;
                } catch (Throwable e) {
                    e.printStackTrace();
                    return false;
                }
            }
        }

        public void checkSendStrategy(int count, int delay, int maxCacheCount) {
            if (count >= maxCacheCount) {
                posterToServer();
            } else {
                posterToServer(delay);
            }
        }

        public void posterToServer() {
            posterToServer(0);
        }

        public void posterToServer(final long delay) {
            try {
                if (delay <= 0 || !this.hasMessages(FLUSH_QUEUE)) {
                    Message msg = Message.obtain();
                    msg.what = FLUSH_QUEUE;
                    this.sendMessageDelayed(msg, delay < 0 ? 0 : delay);
                }
            } catch (Throwable e) {
                e.printStackTrace();
            }
        }
    }

    private static final String PREFERENCE_NAME_PREFIX = "com.ruixue.event_attrs";
    StorageString storageJSONObject;
    Runnable runnable;
    Map<String, Object> version_map = new HashMap<>();
    Map<String, Object> public_attr;
    String public_attr_version;
    private final AtomicBoolean isInited = new AtomicBoolean(false);

    /**
     * initConfig 成功标志。用于控制前台切换时是否触发 {@link #detectServerTime()}：
     * 首次冷启动阶段 init 尚未返回，不应重复打探测接口。
     */
    private final AtomicBoolean initConfigSucceeded = new AtomicBoolean(false);

    JSONObject channelConfig;

    JSONObject websocket;

    public JSONObject getWebsocket() {
        return websocket;
    }

    public JSONObject getChannelConfig() {
        return channelConfig;
    }

    public TrackDataMgr() {

    }

    public interface OnGetPublicProperties {
        void onResult(int code, Map<String, Object> map);
    }

    AtomicBoolean isIniting = new AtomicBoolean(false);

    public void initConfig(Context context, RXJSONCallback callback) {
        if (!isTracking()) {
            startTracking(context);
        }
        Map<String, Object> m = new HashMap<>();
        m.put("version", version_map);
        if (!isIniting.get()) {
            isIniting.set(true);
            RXRequest request = RXRequest.create(RXApiPath.SDKCONFIG_INIT).setBody(m).setMethod(HttpMethod.POST);
            RXJSONCallback callback1 = new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    isIniting.set(false);
                    AnnouncementCacheUtil.getAnnouncement();
                    try {
                        if (data != null) {
                            handlePublicAttrData(data.optJSONObject("event_public_attr"), null);
                            JSONObject feedback = data.optJSONObject("feedback");
                            if (feedback != null) {
                                RXGlobalData.LOG_LIMIT = feedback.optLong("log_limit", 2048);
                            }
                            JSONObject advertise_switch = data.optJSONObject("advertise_switch");
                            websocket = data.optJSONObject("websocket");

                            JSONObject ip = data.optJSONObject("ip");
                            if (ip != null && ip.has("api")) {
                                RXGlobalData.setIpv4Url(ip.optString("api"));
                            }
                            JSONObject log = data.optJSONObject("log");
                            if (log != null && log.has("of")) {
                                LogHelper.setLogConfig(log.optBoolean("of"), log.optInt("no", 50));
                            }
                            if (log != null && log.has("lp")) {
                                PresetEventHelper.setEnable(log.optBoolean("lp", false));
                            }
                            if (log != null && log.has("ce")) {
                                sdkErrorTrackEnable = log.optBoolean("ce", true);
                            }
                            if (log != null && log.has("ua")) {
                                JSONObject ua = log.optJSONObject("ua");
                                UserActionTrackManager.getInstance().initSdkConfigParams(ua);
                            } else {
                                UserActionTrackManager.getInstance().initSdkConfigParams(null);
                            }
                            JSONObject cp = data.optJSONObject("cp");
                            if (cp != null) {
                                RXGlobalData.setCpOf(cp.optBoolean("of", false));
                            } else {
                                RXGlobalData.setCpOf(false);
                            }
                            OpenInstallManager.checkInit(context, data.optJSONObject("oi"));
                            JSONObject client_login = data.optJSONObject("client_login");
                            if (client_login != null) {
                                JSONArray loginList = client_login.optJSONArray("list");
                                List<Map<String, Object>> list = JSONUtil.toListMap(loginList);
                                RXGlobalData.setLoginConfigs(list);
                                RXGlobalData.setEmailRegDisable(client_login.optBoolean("cer"));
                            }

                            if (advertise_switch != null) {
                                int switch_int = advertise_switch.optInt("switch");
                                RXGlobalData.setAdvertise_switch(switch_int);
                            }
                            JSONObject pay_third_goods = data.optJSONObject("pay_third_goods");
                            if (pay_third_goods != null) {
                                JSONObject third_goods = pay_third_goods.optJSONObject("third_goods");
                                if (third_goods != null) {
                                    RXGlobalData.setGoodsTagRelationMap(JSONUtil.toMap(third_goods));
                                }
                            }

                            JSONObject uab = data.optJSONObject("uab");
                            if (uab != null) {
                                boolean uabEnable = uab.optBoolean("of");
                                if (uabEnable) {
                                    RXGlobalData.setContactsPath(uab.optString("ph"));
                                    RXGlobalData.setContactsTs(uab.optInt("ts", 0));
                                }
                            }
                            JSONObject lang = data.optJSONObject("lang");
                            if (lang != null) {
                                String dflang = lang.optString("df");
                                if (!TextUtils.isEmpty(dflang)) {
                                    RXGlobalData.setLanguage(context, dflang, false);
                                }
                            }

                            Iterator<String> it = data.keys();
                            while (it.hasNext()) {
                                String key = it.next();
                                Object value = data.opt(key);
                                if (value instanceof JSONObject) {
                                    version_map.put(key, ((JSONObject) value).optString("version"));
                                }
                            }
                            parseChannelCfg(data);
                            handlePay(data);

                            RXGlobalData.setAppJsonData(data.optJSONObject("apps"));

                            JSONObject device = data.optJSONObject("device");
                            if (device != null) {
                                JSONObject sd = device.optJSONObject("sd");
                                if (sd != null)
                                    RXGlobalData.setDeviceSdOf(sd.optBoolean("of"));
                                JSONObject net = device.optJSONObject("net");
                                if (net != null)
                                    RXGlobalData.setNetReport(net.optBoolean("of"));
                                JSONObject mod = device.optJSONObject("mod");
                                if (mod != null)
                                    RXGlobalData.setModReport(mod.optBoolean("of"));
                            }

                            JSONObject server = data.optJSONObject("server");
                            if (server != null) {
                                updateServerTimeOffset(server.optString("time", null));
                            }

                            JSONObject gpm = data.optJSONObject("gpm");
                            if (gpm != null) {
                                RXGlobalData.setPerformReportType(gpm.optString("type"));
                                RXGlobalData.setPerformReportUwaTs(gpm.optInt("uwa_ts"));
                                RXGlobalData.setPerformReportSdkTs(gpm.optInt("sdk_ts"));
                            }
                            RXGlobalData.setSdkInitAllConfigData(data.toString());
                            // 上报瑞雪性能数据
                            PerformReportManager.getInstance().reportRx();

                            initConfigSucceeded.set(true);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    callback.onSuccess(data);
                    if (data != null) {
                        channelConfig = data.optJSONObject("advertise_channel");
                        if (channelConfig != null) {
                            parseAdvertiseChannelCfg(context, channelConfig, data.optJSONObject("websocket"));
                        }
                    }
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    isIniting.set(false);
                    callback.onFailed(cause);
                }
            };
            if (RXGlobalData.isOpenRacing()) {
                request.setCallback(callback1).executeConcurrentRequest();
            } else {
                request.postAsync(callback1);
            }
        }
    }

    /**
     * initConfig 是否已成功返回一次。
     */
    public boolean isInitConfigSucceeded() {
        return initConfigSucceeded.get();
    }

    /**
     * 请求 {@link RXApiPath#SDKCONFIG_DETECTION} 刷新服务端时间偏移量。
     * <p>
     * 仅在 initConfig 已成功后才会真正发起请求；重复调用会并发，但解析结果是幂等写入
     * {@code RXGlobalData.serverTimeOffset}，无需额外加锁。
     */
    public void detectServerTime() {
        if (!initConfigSucceeded.get()) {
            return;
        }
        RXJSONCallback cb = new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (data != null) {
                    updateServerTimeOffset(data.optString("time", null));
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.w("detectServerTime failed: " + cause);
            }
        };
        RXRequest.create(RXApiPath.SDKCONFIG_DETECTION)
                .setBody(new HashMap<String, Object>())
                .setMethod(HttpMethod.POST)
                .postAsync(cb);
    }

    /**
     * 用服务端毫秒时间戳字符串刷新本地 {@code st_offset}，非法值直接忽略。
     */
    private void updateServerTimeOffset(@Nullable String serverTimeStr) {
        if (TextUtils.isEmpty(serverTimeStr)) {
            return;
        }
        try {
            long serverTime = Long.parseLong(serverTimeStr);
            if (serverTime > 0) {
                long offset = serverTime - System.currentTimeMillis();
                RXGlobalData.setServerTimeOffset(String.valueOf(offset));
            }
        } catch (NumberFormatException ignored) {
        }
    }

    public void parseChannelCfg(JSONObject jsonObject) {
        JSONObject channel = jsonObject.optJSONObject("channel");
        if (null == channel) {
            return;
        }
        // channel.sh：App 回调 Scheme，用于 IIFAA 支付宝回跳识别与 redirect_url 请求体
        String iifaaScheme = channel.optString("sh", "");
        RXGlobalData.setRealAuthIIFAAScheme(iifaaScheme);

        JSONObject real = channel.optJSONObject("ra");
        if (real != null) {
            // 实名认证
            boolean need_realauth = real.optBoolean("of", RXGlobalData.isNeedRealauth());
            // 实名认证关闭按钮
            boolean realauth_close = real.optBoolean("cof", RXGlobalData.isRealauthClose());
            RXGlobalData.setNeedRealauth(need_realauth);
            RXGlobalData.setRealauthClose(realauth_close);

            boolean real_auth_fast_auth = real.optBoolean("fa", RXGlobalData.isRealAuthFastAuth());
            RXGlobalData.setRealAuthFastAuth(real_auth_fast_auth);
            boolean real_auth_use_custom_keyboard = real.optBoolean("ckb", RXGlobalData.isRealAuthUseCustomKeyboard());
            RXGlobalData.setRealAuthUseCustomKeyboard(real_auth_use_custom_keyboard);
            boolean real_auth_use_iifaa = real.optBoolean("iifaa", true);
            RXGlobalData.setRealAuthUseIIFAA(real_auth_use_iifaa);
            if (real_auth_use_iifaa && TextUtils.isEmpty(iifaaScheme)) {
                RXLogger.e("IIFAA third_part_schema is empty, check init config channel.sh");
            }
        }

        JSONObject sp = channel.optJSONObject("sp");
        if (sp != null) {
            boolean need_setpwd = sp.optBoolean("of", RXGlobalData.isNeedSetpwd());
            RXGlobalData.setNeedSetpwd(need_setpwd);
        }

        JSONObject dr = channel.optJSONObject("dr");
        if (dr != null) {
            boolean show_deregister = dr.optBoolean("of", RXGlobalData.isShowDeregister());
            int deregister_type = dr.optInt("type", RXGlobalData.getDeregisterType());
            RXGlobalData.setShowDeregister(show_deregister);
            RXGlobalData.setDeregisterType(deregister_type);
        }

        JSONObject uc = channel.optJSONObject("uc");
        if (uc != null) {
            JSONArray l = uc.optJSONArray("list");
            if (l != null) {
                RXGlobalData.setUserCenterBtns(JSONUtil.toStringList(l).toArray(new String[0]));
            }
        }

    }

    private void parseAdvertiseChannelCfg(Context context, JSONObject channelConfig, JSONObject websocket) {
        if (channelConfig.has("adjust")) {
            JSONObject adjust = channelConfig.optJSONObject("adjust");
            if (adjust != null) {
                String app_token = adjust.optString("tk");
                // AdjustManager.init(context, app_token, adjust.optInt("of", 1),
                // DeviceUtils.getDistinctId(context));
                String rt = adjust.optString("rt");
                int rc = adjust.optInt("rc");
                if (!TextUtils.isEmpty(rt)) {
                    AdjustManager.setEventName(context, rt);
                }
                if (adjust.has("at")) {
                    AdjustManager.setActivateName(context, adjust.optString("at"));
                }
                AdjustManager.setRcTime(context, rc);
            }
        } else if (channelConfig.has("oceanengine")) {
            RXSdkAnalytics.getInstance().onInit(channelConfig, websocket);
        }
        if (channelConfig.has("gdt")) {
            RXSdkGdtAnalytics.getInstance().onInit(channelConfig);
        }
        if (channelConfig.has("ks")) {
            RXSdkKwaiAnalytics.getInstance().onInit(channelConfig);
        }
    }

    public void syncEventAttr(OnGetPublicProperties onGetPublicProperties) {
        if (isInited.get()) {
            if (onGetPublicProperties != null)
                onGetPublicProperties.onResult(0, public_attr);
        } else {
            syncEventAttr(0, 0, onGetPublicProperties);
        }
    }

    public void syncEventAttr(int cursor, long delayMillis, OnGetPublicProperties callback) {
        Map<String, Object> m = new HashMap<>();
        m.put("version", public_attr_version);

        if (runnable != null) {
            ThreadUtils.getInstance().removeBgCallbacks(runnable);
        }
        runnable = RXRequest.create(RXApiPath.EVENT_ATTRS).setBody(m).getAsyncDelay(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                runnable = null;
                isInited.set(true);
                handlePublicAttrData(data, callback);
                if (callback != null)
                    callback.onResult(0, public_attr);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                runnable = null;
                if (cursor < 1) {
                    syncEventAttr(cursor + 1, 3000, callback);
                } else if (cursor < 2) {
                    RXLogger.i("will refresh business date after " + 600000 / 1000 + " seconds");
                    syncEventAttr(cursor + 1, 600000, callback);
                } else {
                    if (callback != null)
                        callback.onResult(cause.optInt("code", -1), public_attr);
                }
            }
        }, delayMillis);
    }

    private void handlePay(@Nullable JSONObject data) {
        if (data != null && data.has("pay")) {
            try {
                boolean fa = data.getJSONObject("pay").optBoolean("fa");
                RXGlobalData.setAllowFileAccess(fa);
            } catch (JSONException e) {
                RXLogger.e(e.getMessage());
            }
        }
    }

    private void handlePublicAttrData(@Nullable JSONObject data, OnGetPublicProperties callback) {
        if (data != null) {
            JSONObject public_obj = data.optJSONObject("public_attr");
            if (public_obj != null) {
                public_attr = JSONUtil.toMap(public_obj);
                if (isTracking()) {
                    storageJSONObject.put(data.toString());
                }
            }
            public_attr_version = data.optString("version");
            long refresh = data.optLong("refresh", 0);
            if (refresh > 0) {
                syncEventAttr(0, refresh, callback);
            }
        }
    }

    public void stopTracking() {
        tracking.set(false);
        // es.execute(mRunnable);
        // scheduledThreadPool.scheduleAtFixedRate(mRunnable, 0, period,
        // TimeUnit.SECONDS);
    }

    /**
     * 开启大数据上报监听
     */
    public void startTracking(Context context) {
        if (!tracking.compareAndSet(false, true)) {
            return;
        }
        smDataHandle = new DataHandle(context);
        Future<SharedPreferences> storedSharedPrefs = SharedPreferencesLoader.get().loadPreferences(context,
                PREFERENCE_NAME_PREFIX);
        storageJSONObject = new StorageString(storedSharedPrefs, "event_attrs");
        String jsonStr = storageJSONObject.get();
        try {
            if (!TextUtils.isEmpty(jsonStr)) {
                JSONObject jsonObject = new JSONObject(jsonStr);
                public_attr_version = jsonObject.optString("version");
                JSONObject publicAttrObj = jsonObject.optJSONObject("public_attr");
                if (publicAttrObj != null) {
                    public_attr = new Gson().fromJson(
                            publicAttrObj.toString(),
                            new TypeToken<Map<String, Object>>() {
                            }.getType());
                }
                RXLogger.i("public_attr_version:" + public_attr_version);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        // es.execute(mRunnable);
        // scheduledThreadPool.scheduleAtFixedRate(mRunnable, 0, period,
        // TimeUnit.SECONDS);
    }

    // onStop report
    public void postToServer(Context context) {
        if (isTracking() && null != smDataHandle) {
            smDataHandle.posterToServer();
        }
    }

    public boolean report(String type, String eventName, String distinctId, Map<String, Object> properties,
                          int flushInterval, int maxCacheCount) {
        try {
            if (flushInterval < 0) {
                flushInterval = DEFAULT_FLUSH_INTERVAL;
            }
            if (maxCacheCount < 0) {
                maxCacheCount = DEFAULT_FLUSH_BULK_SIZE;
            }
            int cpid = Integer.parseInt(RuiXueSdk.getCpId());
            String productid = RuiXueSdk.getProductId();
            String channelid = RuiXueSdk.getChannelId();

            distinctId = TextUtils.isEmpty(distinctId) ? DeviceUtils.getDistinctId(RXGlobalData.getContext())
                    : distinctId;
            String finalDistinctId = TextUtils.isEmpty(distinctId) ? RuiXueSdk.getOpenid() : distinctId;
            String devicecode = DeviceUtils.getDeviceId(RXGlobalData.getContext());
            if (cpid == 0 || TextUtils.isEmpty(productid) || TextUtils.isEmpty(channelid)) {
                Log.e(RuiXueSdk.TAG,
                        "data report failed, please check ruixue productid 、cpid 、channelid params not null");
                return false;
            } else if (TextUtils.isEmpty(eventName)) {
                Log.e(RuiXueSdk.TAG, "data report failed,event params not null");
                return false;
            } else if (TextUtils.isEmpty(finalDistinctId) && TextUtils.isEmpty(devicecode)) {
                Log.e(RuiXueSdk.TAG, "data report failed,devicecode and distinct_id params is null error");
                return false;
            }

            Map<String, Object> hashMap = new HashMap<>();
            hashMap.put("type", TextUtils.isEmpty(type) ? "track" : type);// 事件类型（目前默认为 track）
            hashMap.put("time", DateUtils.getMsTime()); // 事件发生时间，格式为 yyyy-mm-dd hh:ii:ss.fff
            hashMap.put("distinct_id", finalDistinctId);// 用户唯一标识，一般为 OpenID
            hashMap.put("devicecode", devicecode);
            hashMap.put("event", eventName);
            hashMap.put("uuid", UUID.randomUUID().toString());
            hashMap.put("cpid", cpid);
            hashMap.put("product_id", productid);
            hashMap.put("platform_id", RuiXueSdk.PLATFORM_ID);
            hashMap.put("channel_id", channelid);

            String sub_channel_id = PassportManager.getInstance().getSubChannelId();
            if (!TextUtils.isEmpty(sub_channel_id)) {
                hashMap.put("sub_channel_id", sub_channel_id);
            }
            if (isTracking()) {

                Map<String, Object> allProperties = getPublicProperties(eventName);
                VersionLoginConfigUtils.addLoginConfigs4DataTrack(properties);
                allProperties.putAll(properties);
                if (RXGlobalData.isTrackEnv()) {
                    allProperties.put("#env", "1");
                }
                Map<String, Object> resMap = PerformReportManager.getInstance().buildGPMParameter(eventName);
                if (resMap != null && !resMap.isEmpty()) {
                    RXLogger.e("UWA lib exist, build performance data");
                    allProperties.putAll(resMap);
                }
                allProperties.put("sdk_version", BuildConfig.BUILD);
                Map<String, Object> appInfoMap = new HashMap<>();
                appInfoMap.put("version", AppUtils.getVersionName(RXGlobalData.getContext()));
                allProperties.put("rx_app_info", appInfoMap);
                String stOffset = RXGlobalData.getServerTimeOffset();
                if (!TextUtils.isEmpty(stOffset)) {
                    allProperties.put("st_offset", stOffset);
                }
                hashMap.put("properties", allProperties);

                return ObjectUtils.requireNonNull(smDataHandle).saveData(hashMap, flushInterval, maxCacheCount);
            } else {
                RXLogger.e("data report failed,Data Tracker is not Tracking,Please startTracking first.");
                return false;
            }
        } catch (Throwable e) {
            e.printStackTrace();
            RXLogger.e("data report failed");
            return false;
        }
    }

    protected void reportAtTime(String type, String eventName, String distinctId, Map<String, Object> properties) {
        try {
            distinctId = TextUtils.isEmpty(distinctId) ? DeviceUtils.getDistinctId(RXGlobalData.getContext())
                    : distinctId;
            Map<String, Object> hashMap = new HashMap<>();
            hashMap.put("type", TextUtils.isEmpty(type) ? "track" : type);// 事件类型（目前默认为 track）
            hashMap.put("time", DateUtils.getMsTime()); // 事件发生时间，格式为 yyyy-mm-dd hh:ii:ss.fff
            hashMap.put("distinct_id", TextUtils.isEmpty(distinctId) ? RuiXueSdk.getOpenid() : distinctId);// 用户唯一标识，一般为
            // OpenID
            hashMap.put("devicecode", DeviceUtils.getDeviceId(RXGlobalData.getContext()));
            hashMap.put("event", eventName);
            hashMap.put("uuid", UUID.randomUUID().toString());
            int cpid = Integer.parseInt(RuiXueSdk.getCpId());
            String productid = RuiXueSdk.getProductId();
            String channelid = RuiXueSdk.getChannelId();
            hashMap.put("cpid", cpid);
            hashMap.put("product_id", productid);
            hashMap.put("platform_id", RuiXueSdk.PLATFORM_ID);
            hashMap.put("channel_id", channelid);
            if (cpid == 0 || TextUtils.isEmpty(productid) || TextUtils.isEmpty(channelid)) {
                Log.e(RuiXueSdk.TAG,
                        "data report failed, please check ruixue productid 、cpid 、channelid params not null");
                return;
            } else if (TextUtils.isEmpty(eventName)) {
                Log.e(RuiXueSdk.TAG, "data report failed,event params not null");
                return;
            } else if (TextUtils.isEmpty((String) hashMap.get("distinct_id"))
                    && TextUtils.isEmpty((String) hashMap.get("devicecode"))) {
                Log.e(RuiXueSdk.TAG, "data report failed,devicecode and distinct_id params is null error");
                return;
            }

            String sub_channel_id = PassportManager.getInstance().getSubChannelId();
            if (!TextUtils.isEmpty(sub_channel_id)) {
                hashMap.put("sub_channel_id", sub_channel_id);
            }
            if (isTracking()) {
                Map<String, Object> allProperties = getPublicProperties(eventName);
                allProperties.putAll(properties);
                if (RXGlobalData.isTrackEnv()) {
                    allProperties.put("#env", "1");
                }
                Map<String, Object> resMap = PerformReportManager.getInstance().buildGPMParameter(eventName);
                if (resMap != null && !resMap.isEmpty()) {
                    RXLogger.e("UWA lib exist, build performance data");
                    allProperties.putAll(resMap);
                }
                String stOffset = RXGlobalData.getServerTimeOffset();
                if (!TextUtils.isEmpty(stOffset)) {
                    allProperties.put("st_offset", stOffset);
                }
                hashMap.put("properties", allProperties);

                JSONArray jsonArray = new JSONArray();
                JSONObject item = new JSONObject(hashMap);
                jsonArray.put(item);
                if (smDataHandle != null) {
                    smDataHandle.sendData(jsonArray.toString(), jsonArray.length());
                } else {
                    RXLogger.e("data report failed, data handle is null.");
                }
            } else {
                RXLogger.e("data report failed,Data Tracker is not Tracking,Please startTracking first.");
            }
        } catch (Throwable e) {
            e.printStackTrace();
            RXLogger.e("data report failed");
        }
    }

    /**
     * @param eventName     埋点标识
     * @param properties    CP 自定义属性
     * @param flushInterval 上报时间间隔 （毫秒）默认 60s
     * @param maxCacheCount 最大缓存条数 默认 100
     */
    public boolean track(String eventName, String distinctId, Map<String, Object> properties, int flushInterval,
                         int maxCacheCount) {
        return report("track", eventName, distinctId, properties, flushInterval, maxCacheCount);
    }

    public boolean track(String eventName, Map<String, Object> properties) {
        return report("track", eventName, null, properties, -1, -1);
    }

    // 立即上报
    public void trackAtTimeAsync(String eventName, Map<String, Object> properties) {
        ThreadUtils.getInstance().runOnBgThread(() -> reportAtTime("track", eventName, null, properties));
    }

    public void trackAsync(String eventName, Map<String, Object> properties) {
        ThreadUtils.getInstance().runOnBgThread(() -> report("track", eventName, null, properties, -1, -1));
    }

    public void trackAsync(String eventName, String distinctId, Map<String, Object> properties) {
        ThreadUtils.getInstance().runOnBgThread(() -> report("track", eventName, distinctId, properties, -1, -1));
    }

    public void errorReport(String eventName, Map<String, Object> properties) {
        if (sdkErrorTrackEnable) {
            ThreadUtils.getInstance().runOnBgThread(() -> report("track", eventName, null, properties, -1, -1));
        } else {
            Log.w("rxsdk", "SDK error report is disabled by init api. Error detail:"
                    + (properties != null ? properties.toString() : ""));
        }
    }

}