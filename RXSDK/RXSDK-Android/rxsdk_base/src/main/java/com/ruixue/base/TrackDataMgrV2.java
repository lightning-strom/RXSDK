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
import com.ruixue.storage.StorageString;
import com.ruixue.utils.AnnouncementCacheUtil;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.DateUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ThreadUtils;
import com.ruixue.utils.VersionLoginConfigUtils;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * {@link TrackDataMgr} 的重写实现，API 完全兼容。
 * <p>核心改进：
 * <ul>
 *   <li>ANR：网络 I/O 在锁外执行，缓冲区操作使用单一短锁</li>
 *   <li>线程安全：公共属性用 ConcurrentHashMap，配置字段用 volatile</li>
 *   <li>数据完整性：发送失败正确回填并保持时间顺序</li>
 *   <li>空指针防护：配置解析与事件构建全面 null 检查</li>
 *   <li>原子操作：initConfig 入口用 compareAndSet 消除 TOCTOU 竞态</li>
 * </ul>
 */
class TrackDataMgrV2 extends TrackDataMgr {

    private static final int MSG_FLUSH = 1;
    private static final String SP_TRACK_DATA = "com.ruixue.trackdata";
    private static final String SP_TRACK_KEY = "track_data_array";
    private static final String SP_EVENT_ATTRS = "com.ruixue.event_attrs";

    // ───── 状态 ─────
    private final AtomicBoolean mTracking = new AtomicBoolean(false);
    private final AtomicBoolean mConfigInited = new AtomicBoolean(false);
    private final AtomicBoolean mConfigIniting = new AtomicBoolean(false);

    // ───── 可调配置 ─────
    private volatile int mFlushInterval = 60_000;
    private volatile int mFlushBulkSize = 100;
    private volatile boolean mErrorTrackEnabled = true;

    // ───── 公共属性（线程安全） ─────
    private volatile Map<String, Object> mProperties;
    private volatile Map<String, Object> mPublicAttr;
    private volatile String mPublicAttrVersion;

    // ───── SDK 配置 ─────
    private volatile JSONObject mChannelConfig;
    private volatile JSONObject mWebsocket;
    private final Map<String, Object> mVersionMap = new HashMap<>();

    // ───── 数据缓冲区（单锁保护，临界区极短） ─────
    private final Object mBufferLock = new Object();
    private final ArrayList<JSONObject> mBuffer = new ArrayList<>();

    // ───── 持久化 & 工作线程 ─────
    private volatile SharedPreferences mTrackPrefs;
    private volatile StorageString mEventAttrStorage;
    private volatile FlushHandler mFlushHandler;
    private Runnable mSyncRunnable;

    // ╔═══════════════════════════════════════════╗
    // ║  生命周期                                  ║
    // ╚═══════════════════════════════════════════╝

    @Override
    public TrackDataMgr trackConfig(int reportTime, int maxCount) {
        if (reportTime > 0) mFlushInterval = reportTime;
        if (maxCount > 0) mFlushBulkSize = maxCount;
        return this;
    }

    @Override
    public TrackDataMgr setFlushInterval(int flushInterval) {
        if (flushInterval > 0) mFlushInterval = flushInterval;
        return this;
    }

    @Override
    public TrackDataMgr setMaxCacheCount(int maxCacheCount) {
        if (maxCacheCount > 0) mFlushBulkSize = maxCacheCount;
        return this;
    }

    @Override
    public boolean isTracking() {
        return mTracking.get();
    }

    @Override
    public void startTracking(Context context) {
        if (!mTracking.compareAndSet(false, true)) return;

        HandlerThread thread = new HandlerThread("trackWorkerV2", Thread.MIN_PRIORITY);
        thread.start();
        mFlushHandler = new FlushHandler(thread);

        Future<SharedPreferences> trackPrefsFuture =
                SharedPreferencesLoader.get().loadPreferences(context, SP_TRACK_DATA);
        Future<SharedPreferences> eventAttrFuture =
                SharedPreferencesLoader.get().loadPreferences(context, SP_EVENT_ATTRS);

        mEventAttrStorage = new StorageString(eventAttrFuture, "event_attrs");
        restoreEventAttrs();

        mFlushHandler.post(() -> {
            try {
                mTrackPrefs = trackPrefsFuture.get();
                loadPersistedBuffer();
            } catch (Exception e) {
                RXLogger.e("Failed to load persisted track data");
            }
            scheduleFlush(0);
        });
    }

    @Override
    public void stopTracking() {
        mTracking.set(false);
    }

    @Override
    public void postToServer(Context context) {
        if (isTracking() && mFlushHandler != null) {
            scheduleFlush(0);
        }
    }

    // ╔═══════════════════════════════════════════╗
    // ║  公共属性管理                              ║
    // ╚═══════════════════════════════════════════╝

    @Override
    public Map<String, Object> getPropertiesMap() {
        Map<String, Object> p = mProperties;
        return p == null ? new HashMap<>() : new HashMap<>(p);
    }

    @Override
    public void setPropertiesMap(Map<String, Object> propertiesMap) {
        mProperties = propertiesMap != null ? new ConcurrentHashMap<>(propertiesMap) : null;
    }

    @Override
    public void putPropertiesMap(String key, Object value) {
        if (key == null || value == null) return;
        Map<String, Object> p = mProperties;
        if (p == null) {
            synchronized (this) {
                if (mProperties == null) mProperties = new ConcurrentHashMap<>();
                p = mProperties;
            }
        }
        p.put(key, value);
    }

    @Override
    public void delPropertiesMap(String key) {
        Map<String, Object> p = mProperties;
        if (p != null && key != null) p.remove(key);
    }

    @SuppressWarnings("unchecked")
    @Override
    public Map<String, Object> getPublicProperties(String event) {
        Map<String, Object> result = new HashMap<>();
        Map<String, Object> props = mProperties;
        Map<String, Object> attrs = mPublicAttr;
        if (props == null || attrs == null || !attrs.containsKey(event)) return result;
        Object obj = attrs.get(event);
        if (obj instanceof List) {
            for (String key : (List<String>) obj) {
                Object val = props.get(key);
                if (val != null) result.put(key, val);
            }
        }
        return result;
    }

    // ╔═══════════════════════════════════════════╗
    // ║  数据采集                                  ║
    // ╚═══════════════════════════════════════════╝

    @Override
    public boolean report(String type, String eventName, String distinctId,
                          Map<String, Object> properties, int flushInterval, int maxCacheCount) {
        try {
            if (flushInterval < 0) flushInterval = mFlushInterval;
            if (maxCacheCount < 0) maxCacheCount = mFlushBulkSize;

            Map<String, Object> event = buildEventBase(type, eventName, distinctId);
            if (event == null) return false;

            if (!isTracking()) {
                RXLogger.e("data report failed, Tracker is not started.");
                return false;
            }

            Map<String, Object> allProps = getPublicProperties(eventName);
            VersionLoginConfigUtils.addLoginConfigs4DataTrack(properties);
            allProps.putAll(properties);
            if (RXGlobalData.isTrackEnv()) allProps.put("#env", "1");

            Map<String, Object> gpm = PerformReportManager.getInstance().buildGPMParameter(eventName);
            if (gpm != null && !gpm.isEmpty()) allProps.putAll(gpm);

            allProps.put("sdk_version", BuildConfig.BUILD);
            Map<String, Object> appInfo = new HashMap<>();
            appInfo.put("version", AppUtils.getVersionName(RXGlobalData.getContext()));
            allProps.put("rx_app_info", appInfo);
            event.put("properties", allProps);

            return addToBuffer(event, flushInterval, maxCacheCount);
        } catch (Throwable e) {
            e.printStackTrace();
            RXLogger.e("data report failed");
            return false;
        }
    }

    @Override
    protected void reportAtTime(String type, String eventName, String distinctId,
                                Map<String, Object> properties) {
        try {
            Map<String, Object> event = buildEventBase(type, eventName, distinctId);
            if (event == null) return;
            if (!isTracking()) {
                RXLogger.e("data report failed, Tracker is not started.");
                return;
            }

            Map<String, Object> allProps = getPublicProperties(eventName);
            allProps.putAll(properties);
            if (RXGlobalData.isTrackEnv()) allProps.put("#env", "1");

            Map<String, Object> gpm = PerformReportManager.getInstance().buildGPMParameter(eventName);
            if (gpm != null && !gpm.isEmpty()) allProps.putAll(gpm);
            event.put("properties", allProps);

            JSONArray arr = new JSONArray();
            arr.put(new JSONObject(event));
            sendBatch(arr.toString(), 1);
        } catch (Throwable e) {
            e.printStackTrace();
            RXLogger.e("data report failed");
        }
    }

    @Nullable
    private Map<String, Object> buildEventBase(String type, String eventName, String distinctId) {
        int cpid;
        try {
            cpid = Integer.parseInt(RuiXueSdk.getCpId());
        } catch (NumberFormatException e) {
            cpid = 0;
        }
        String productId = RuiXueSdk.getProductId();
        String channelId = RuiXueSdk.getChannelId();

        if (cpid == 0 || TextUtils.isEmpty(productId) || TextUtils.isEmpty(channelId)) {
            Log.e(RuiXueSdk.TAG, "data report failed, check productid/cpid/channelid");
            return null;
        }
        if (TextUtils.isEmpty(eventName)) {
            Log.e(RuiXueSdk.TAG, "data report failed, event is null");
            return null;
        }

        if (TextUtils.isEmpty(distinctId))
            distinctId = DeviceUtils.getDistinctId(RXGlobalData.getContext());
        if (TextUtils.isEmpty(distinctId))
            distinctId = RuiXueSdk.getOpenid();
        String deviceCode = DeviceUtils.getDeviceId(RXGlobalData.getContext());

        if (TextUtils.isEmpty(distinctId) && TextUtils.isEmpty(deviceCode)) {
            Log.e(RuiXueSdk.TAG, "data report failed, devicecode and distinct_id are null");
            return null;
        }

        Map<String, Object> data = new HashMap<>(16);
        data.put("type", TextUtils.isEmpty(type) ? "track" : type);
        data.put("time", DateUtils.getMsTime());
        data.put("distinct_id", distinctId);
        data.put("devicecode", deviceCode);
        data.put("event", eventName);
        data.put("uuid", UUID.randomUUID().toString());
        data.put("cpid", cpid);
        data.put("product_id", productId);
        data.put("platform_id", RuiXueSdk.PLATFORM_ID);
        data.put("channel_id", channelId);

        String subChannelId = PassportManager.getInstance().getSubChannelId();
        if (!TextUtils.isEmpty(subChannelId))
            data.put("sub_channel_id", subChannelId);

        return data;
    }

    @Override
    public boolean track(String eventName, String distinctId, Map<String, Object> properties,
                         int flushInterval, int maxCacheCount) {
        return report("track", eventName, distinctId, properties, flushInterval, maxCacheCount);
    }

    @Override
    public boolean track(String eventName, Map<String, Object> properties) {
        return report("track", eventName, null, properties, -1, -1);
    }

    @Override
    public void trackAtTimeAsync(String eventName, Map<String, Object> properties) {
        ThreadUtils.getInstance().runOnBgThread(
                () -> reportAtTime("track", eventName, null, properties));
    }

    @Override
    public void trackAsync(String eventName, Map<String, Object> properties) {
        ThreadUtils.getInstance().runOnBgThread(
                () -> report("track", eventName, null, properties, -1, -1));
    }

    @Override
    public void trackAsync(String eventName, String distinctId, Map<String, Object> properties) {
        ThreadUtils.getInstance().runOnBgThread(
                () -> report("track", eventName, distinctId, properties, -1, -1));
    }

    @Override
    public void errorReport(String eventName, Map<String, Object> properties) {
        if (mErrorTrackEnabled) {
            ThreadUtils.getInstance().runOnBgThread(
                    () -> report("track", eventName, null, properties, -1, -1));
        } else {
            Log.w("rxsdk", "SDK error report disabled. Detail: "
                    + (properties != null ? properties.toString() : ""));
        }
    }

    // ╔═══════════════════════════════════════════╗
    // ║  缓冲区 & 发送                             ║
    // ╚═══════════════════════════════════════════╝

    private boolean addToBuffer(Map<String, Object> eventData, int delay, int maxCount) {
        int size;
        synchronized (mBufferLock) {
            try {
                long ts = System.currentTimeMillis();
                JSONObject item = new JSONObject(eventData);
                mBuffer.add(item);
                size = mBuffer.size();
                persistBuffer();
                RXLogger.i("cached data=" + item + " ,total_length=" + size
                        + ",spend=" + (System.currentTimeMillis() - ts));
            } catch (OutOfMemoryError e) {
                scheduleFlush(0);
                return false;
            } catch (Throwable e) {
                e.printStackTrace();
                return false;
            }
        }
        if (size >= maxCount) {
            scheduleFlush(0);
        } else {
            scheduleFlush(delay);
        }
        return true;
    }

    /**
     * 在工作线程执行：快照 → 发送 → 失败回填。
     * 锁只保护内存快照，网络 I/O 在锁外完成。
     */
    private void flush() {
        String jsonStr;
        int count;
        synchronized (mBufferLock) {
            if (mBuffer.isEmpty()) return;
            JSONArray arr = new JSONArray();
            for (JSONObject obj : mBuffer) arr.put(obj);
            jsonStr = arr.toString();
            count = mBuffer.size();
            mBuffer.clear();
            persistBuffer();
        }

        if (!sendBatch(jsonStr, count)) {
            try {
                JSONArray unsent = new JSONArray(jsonStr);
                List<JSONObject> list = new ArrayList<>(unsent.length());
                for (int i = 0; i < unsent.length(); i++) list.add(unsent.getJSONObject(i));
                synchronized (mBufferLock) {
                    list.addAll(mBuffer);
                    mBuffer.clear();
                    mBuffer.addAll(list);
                    persistBuffer();
                }
            } catch (Throwable ignored) {
            }
        }
    }

    private boolean sendBatch(String jsonArray, int count) {
        if (jsonArray == null || count <= 0 || !RuiXueSdk.isFullyInitialized()) return false;

        Map<String, String> headers = HttpUtil.getDefaultHeaders();
        headers.put("Accept-Encoding", "gzip");
        headers.put("content-encoding", "gzip");
        headers.put("content-type", "application/json");
        headers.put("ruixue-datacount", String.valueOf(count));
        try {
            RXHttpClient.Builder builder = new RXHttpClient.Builder();
            builder.setCompress(true);
            builder.setRestfulData(true);
            JSONObject resp = builder.build().apiRequest(
                    HttpMethod.POST, RXApiPath.Data.TRACK_DATA_API, jsonArray, headers, null);
            int code = resp.optInt("code", -1);
            return code == 0 || code == 9040;
        } catch (OutOfMemoryError e) {
            return true;
        } catch (Throwable e) {
            e.printStackTrace();
            return false;
        }
    }

    private void scheduleFlush(long delay) {
        FlushHandler handler = mFlushHandler;
        if (handler == null) return;
        if (delay <= 0 || !handler.hasMessages(MSG_FLUSH)) {
            Message msg = Message.obtain();
            msg.what = MSG_FLUSH;
            handler.sendMessageDelayed(msg, Math.max(delay, 0));
        }
    }

    private void persistBuffer() {
        SharedPreferences prefs = mTrackPrefs;
        if (prefs == null) return;
        if (mBuffer.isEmpty()) {
            prefs.edit().remove(SP_TRACK_KEY).apply();
        } else {
            JSONArray arr = new JSONArray();
            for (JSONObject obj : mBuffer) arr.put(obj);
            prefs.edit().putString(SP_TRACK_KEY, arr.toString()).apply();
        }
    }

    private void loadPersistedBuffer() {
        SharedPreferences prefs = mTrackPrefs;
        if (prefs == null) return;
        String data = prefs.getString(SP_TRACK_KEY, null);
        if (data == null) return;
        try {
            JSONArray arr = new JSONArray(data);
            List<JSONObject> persisted = new ArrayList<>(arr.length());
            for (int i = 0; i < arr.length(); i++) persisted.add(arr.getJSONObject(i));
            synchronized (mBufferLock) {
                persisted.addAll(mBuffer);
                mBuffer.clear();
                mBuffer.addAll(persisted);
            }
        } catch (Throwable ignored) {
        }
    }

    private void restoreEventAttrs() {
        try {
            String jsonStr = mEventAttrStorage.get();
            if (!TextUtils.isEmpty(jsonStr)) {
                JSONObject json = new JSONObject(jsonStr);
                mPublicAttrVersion = json.optString("version");
                JSONObject obj = json.optJSONObject("public_attr");
                if (obj != null) {
                    mPublicAttr = new Gson().fromJson(
                            obj.toString(), new TypeToken<Map<String, Object>>() {}.getType());
                }
                RXLogger.i("public_attr_version:" + mPublicAttrVersion);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // ───── 工作线程 Handler ─────

    private class FlushHandler extends Handler {
        FlushHandler(HandlerThread thread) {
            super(thread.getLooper());
        }

        @Override
        public void handleMessage(@NonNull Message msg) {
            if (msg.what == MSG_FLUSH) flush();
        }
    }

    // ╔═══════════════════════════════════════════╗
    // ║  SDK 配置                                  ║
    // ╚═══════════════════════════════════════════╝

    @Override
    public JSONObject getWebsocket() {
        return mWebsocket;
    }

    @Override
    public JSONObject getChannelConfig() {
        return mChannelConfig;
    }

    @Override
    public void initConfig(Context context, RXJSONCallback callback) {
        if (!isTracking()) startTracking(context);

        Map<String, Object> body = new HashMap<>();
        body.put("version", mVersionMap);
        if (!mConfigIniting.compareAndSet(false, true)) return;

        RXRequest request = RXRequest.create(RXApiPath.SDKCONFIG_INIT)
                .setBody(body).setMethod(HttpMethod.POST);

        RXJSONCallback inner = new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                mConfigIniting.set(false);
                AnnouncementCacheUtil.getAnnouncement();
                try {
                    if (data != null) parseInitData(context, data);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                callback.onSuccess(data);
                if (data != null) {
                    mChannelConfig = data.optJSONObject("advertise_channel");
                    if (mChannelConfig != null)
                        parseAdvertiseChannelCfg(context, mChannelConfig,
                                data.optJSONObject("websocket"));
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                mConfigIniting.set(false);
                callback.onFailed(cause);
            }
        };

        if (RXGlobalData.isOpenRacing()) {
            request.setCallback(inner).executeConcurrentRequest();
        } else {
            request.postAsync(inner);
        }
    }

    private void parseInitData(Context context, @NonNull JSONObject data) {
        handlePublicAttrData(data.optJSONObject("event_public_attr"), null);

        JSONObject feedback = data.optJSONObject("feedback");
        if (feedback != null) RXGlobalData.LOG_LIMIT = feedback.optLong("log_limit", 2048);

        mWebsocket = data.optJSONObject("websocket");

        JSONObject ip = data.optJSONObject("ip");
        if (ip != null && ip.has("api")) RXGlobalData.setIpv4Url(ip.optString("api"));

        JSONObject log = data.optJSONObject("log");
        if (log != null) {
            if (log.has("of"))
                LogHelper.setLogConfig(log.optBoolean("of"), log.optInt("no", 50));
            if (log.has("lp"))
                PresetEventHelper.setEnable(log.optBoolean("lp", false));
            if (log.has("ce"))
                mErrorTrackEnabled = log.optBoolean("ce", true);
            UserActionTrackManager.getInstance()
                    .initSdkConfigParams(log.has("ua") ? log.optJSONObject("ua") : null);
        } else {
            UserActionTrackManager.getInstance().initSdkConfigParams(null);
        }

        JSONObject cp = data.optJSONObject("cp");
        RXGlobalData.setCpOf(cp != null && cp.optBoolean("of", false));

        OpenInstallManager.checkInit(context, data.optJSONObject("oi"));

        JSONObject clientLogin = data.optJSONObject("client_login");
        if (clientLogin != null) {
            RXGlobalData.setLoginConfigs(JSONUtil.toListMap(clientLogin.optJSONArray("list")));
            RXGlobalData.setEmailRegDisable(clientLogin.optBoolean("cer"));
        }

        JSONObject advertiseSwitch = data.optJSONObject("advertise_switch");
        if (advertiseSwitch != null)
            RXGlobalData.setAdvertise_switch(advertiseSwitch.optInt("switch"));

        JSONObject payThirdGoods = data.optJSONObject("pay_third_goods");
        if (payThirdGoods != null) {
            JSONObject tg = payThirdGoods.optJSONObject("third_goods");
            if (tg != null) RXGlobalData.setGoodsTagRelationMap(JSONUtil.toMap(tg));
        }

        JSONObject uab = data.optJSONObject("uab");
        if (uab != null && uab.optBoolean("of")) {
            RXGlobalData.setContactsPath(uab.optString("ph"));
            RXGlobalData.setContactsTs(uab.optInt("ts", 0));
        }

        JSONObject lang = data.optJSONObject("lang");
        if (lang != null) {
            String df = lang.optString("df");
            if (!TextUtils.isEmpty(df)) RXGlobalData.setLanguage(context, df, false);
        }

        Iterator<String> it = data.keys();
        while (it.hasNext()) {
            String key = it.next();
            Object val = data.opt(key);
            if (val instanceof JSONObject)
                mVersionMap.put(key, ((JSONObject) val).optString("version"));
        }

        parseChannelCfg(data);
        handlePay(data);
        RXGlobalData.setAppJsonData(data.optJSONObject("apps"));

        JSONObject device = data.optJSONObject("device");
        if (device != null) {
            JSONObject sd = device.optJSONObject("sd");
            if (sd != null) RXGlobalData.setDeviceSdOf(sd.optBoolean("of"));
            JSONObject net = device.optJSONObject("net");
            if (net != null) RXGlobalData.setNetReport(net.optBoolean("of"));
            JSONObject mod = device.optJSONObject("mod");
            if (mod != null) RXGlobalData.setModReport(mod.optBoolean("of"));
        }

        JSONObject gpm = data.optJSONObject("gpm");
        if (gpm != null) {
            RXGlobalData.setPerformReportType(gpm.optString("type"));
            RXGlobalData.setPerformReportUwaTs(gpm.optInt("uwa_ts"));
            RXGlobalData.setPerformReportSdkTs(gpm.optInt("sdk_ts"));
        }

        RXGlobalData.setSdkInitAllConfigData(data.toString());
        PerformReportManager.getInstance().reportRx();
    }

    private void parseAdvertiseChannelCfg(Context context, JSONObject cfg,
                                          JSONObject websocket) {
        if (cfg.has("adjust")) {
            JSONObject adjust = cfg.optJSONObject("adjust");
            if (adjust != null) {
                String rt = adjust.optString("rt");
                if (!TextUtils.isEmpty(rt)) AdjustManager.setEventName(context, rt);
                if (adjust.has("at"))
                    AdjustManager.setActivateName(context, adjust.optString("at"));
                AdjustManager.setRcTime(context, adjust.optInt("rc"));
            }
        } else if (cfg.has("oceanengine")) {
            RXSdkAnalytics.getInstance().onInit(cfg, websocket);
        }
        if (cfg.has("gdt")) {
            RXSdkGdtAnalytics.getInstance().onInit(cfg);
        }
        if (cfg.has("ks")) {
            RXSdkKwaiAnalytics.getInstance().onInit(cfg);
        }
    }

    private void handlePay(@Nullable JSONObject data) {
        if (data != null && data.has("pay")) {
            try {
                RXGlobalData.setAllowFileAccess(data.getJSONObject("pay").optBoolean("fa"));
            } catch (Exception e) {
                RXLogger.e(e.getMessage());
            }
        }
    }

    // ╔═══════════════════════════════════════════╗
    // ║  事件属性同步                              ║
    // ╚═══════════════════════════════════════════╝

    @Override
    public void syncEventAttr(OnGetPublicProperties callback) {
        if (mConfigInited.get()) {
            if (callback != null) callback.onResult(0, mPublicAttr);
        } else {
            syncEventAttr(0, 0, callback);
        }
    }

    @Override
    public void syncEventAttr(int cursor, long delayMillis, OnGetPublicProperties callback) {
        Map<String, Object> body = new HashMap<>();
        body.put("version", mPublicAttrVersion);

        if (mSyncRunnable != null)
            ThreadUtils.getInstance().removeBgCallbacks(mSyncRunnable);

        mSyncRunnable = RXRequest.create(RXApiPath.EVENT_ATTRS).setBody(body)
                .getAsyncDelay(new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        mSyncRunnable = null;
                        mConfigInited.set(true);
                        handlePublicAttrData(data, callback);
                        if (callback != null) callback.onResult(0, mPublicAttr);
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        mSyncRunnable = null;
                        if (cursor < 1) {
                            syncEventAttr(cursor + 1, 3_000, callback);
                        } else if (cursor < 2) {
                            syncEventAttr(cursor + 1, 600_000, callback);
                        } else if (callback != null) {
                            callback.onResult(cause.optInt("code", -1), mPublicAttr);
                        }
                    }
                }, delayMillis);
    }

    private void handlePublicAttrData(@Nullable JSONObject data, OnGetPublicProperties callback) {
        if (data == null) return;
        JSONObject obj = data.optJSONObject("public_attr");
        if (obj != null) {
            mPublicAttr = JSONUtil.toMap(obj);
            StorageString storage = mEventAttrStorage;
            if (isTracking() && storage != null) storage.put(data.toString());
        }
        mPublicAttrVersion = data.optString("version");
        long refresh = data.optLong("refresh", 0);
        if (refresh > 0) syncEventAttr(0, refresh, callback);
    }
}
