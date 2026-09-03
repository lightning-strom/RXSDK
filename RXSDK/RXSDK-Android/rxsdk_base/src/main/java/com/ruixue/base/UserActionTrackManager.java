package com.ruixue.base;


import android.content.Context;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;

import com.ruixue.RuiXueSdk;
import com.ruixue.error.RXErrorCode;
import com.ruixue.internal.DeviceUtils;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.HttpMethod;
import com.ruixue.net.HttpUtil;
import com.ruixue.net.RXHttpClient;
import com.ruixue.net.URLHelper;
import com.ruixue.openapi.RXApiPath;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.passport.PassportManager;
import com.ruixue.storage.SharedPreferencesLoader;
import com.ruixue.storage.StorageJSONArray;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.DateUtils;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ThreadUtils;
import com.ruixue.utils.VersionLoginConfigUtils;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicBoolean;

// Created by wangliang on 2025/3/6.
public class UserActionTrackManager {

    private static final String TAG = UserActionTrackManager.class.getSimpleName();

    private static final String PREFERENCE_NAME_PREFIX = "com.ruixue.trackdata.useraction";
    private static final String FIRST_SAVE_DATA_TIME_KEY = "first_save_data_time_key";
    private static final String STOP_TRACK_USER_ACTION_KEY = "stop_track_user_action_key";
    private static final String USER_ACTION_TIMEOUT_KEY = "user_action_timeout_key";
    private static final List<String> NEED_TRACK_URL_LIST = List.of(
            "v1/sdkconfig/init",
            "v1/passport/captcha/send",
            "v1/passport/account/login_by_credential",
            "v1/passport/user/realauth"
    );

    // 触发上报执行的最大条数
    private static final int FLUSH_MAX_COUNT = 100;
    // 触发上报执行的最大秒数
    private static final int FLUSH_INTERVAL = 60 * 1000;

    private static class Single {
        static UserActionTrackManager sInstance = new UserActionTrackManager();
    }

    public static UserActionTrackManager getInstance() {
        return UserActionTrackManager.Single.sInstance;
    }

    private final AtomicBoolean init = new AtomicBoolean(false);
    private DataHandler dataHandler;
    private SharedPreferences sp;

    public void initSdkConfigParams(JSONObject ua) {
        RXLogger.i(TAG, "initSdkConfigParams " + ua);
        if (ua != null) {
            boolean enableReport = ua.optBoolean("of", false);
            int maxTimeout = ua.optInt("max", 3600);
            int reportCount = ua.optInt("no", 10);
            if (dataHandler != null) {
                dataHandler.initConfig(enableReport, reportCount, maxTimeout);
            }
        } else {
            if (dataHandler != null) {
                dataHandler.initConfig(false, 0, 0);
            }
        }
    }

    public void init(Context context) {
        if (!init.compareAndSet(false, true)) {
            return;
        }

        ThreadUtils.getInstance().runOnBgThread(() -> {
            dataHandler = new DataHandler(context);
            sp = context.getSharedPreferences(PREFERENCE_NAME_PREFIX, Context.MODE_PRIVATE);
        });
    }

    public void stopTrackUserAction() {
        ThreadUtils.getInstance().runOnBgThread(() -> {
            if (sp != null) {
                sp.edit().putBoolean(STOP_TRACK_USER_ACTION_KEY, true).apply();
            }
            if (dataHandler != null)
                dataHandler.posterToServer();
        });
    }

    public void postToServer(Context context) {
        ThreadUtils.getInstance().runOnBgThread(() -> {
            if (init.get() && null != dataHandler) {
                dataHandler.posterToServer();
            }
        });
    }

    public void trackRequestErrorIfNeed(HttpMethod method, Map<String, String> headers, String body, String url, String result) {
        try {
            if (TextUtils.isEmpty(url) || isIgnoreUrl(url)) {
                return;
            }
            JSONObject responseObj = new JSONObject(result);
            int code = responseObj.optInt("code");
            String msg = responseObj.optString("msg");
            trackRequestErrorIfNeed(method, headers, body, url, code, msg, null, null);
        } catch (Exception e) {
            logDataReportFailed("track request result", e);
        }
    }

    public void trackRequestErrorIfNeed(HttpMethod method, Map<String, String> headers, String body, String url, int code, String msg, Object thirdCode, String thirdMsg) {
        try {
            if (TextUtils.isEmpty(url) || isIgnoreUrl(url)) {
                return;
            }
            Map<String, Object> bodyMap = getBodyMap(method, body);
            Map<String, Object> properties = new HashMap<>();
            if (url.contains("v1/passport/captcha/send")) {
                if (bodyMap == null || !(bodyMap.containsKey("purpose") && Objects.equals(bodyMap.get("purpose"), CaptchaPurpose.LOGIN))) {
                    return;
                }
                properties.put("scene", "login");
                properties.put("method", "captchacode");
                properties.put("action", code == RXErrorCode.OK ? "captchacode_success" : "captchacode_fail");
                if (code != RXErrorCode.OK) {
                    properties.put("request_address", url);
                    properties.put("request_body", bodyMap);
                    if (headers != null) {
                        properties.put("request_header", headers);
                    }
                    properties.put("error_code", code);
                    properties.put("error_message", msg);
                    if (thirdCode != null) {
                        properties.put("error_code_tripartite", thirdCode);
                    }
                    if (thirdMsg != null) {
                        properties.put("error_message_tripartite", thirdMsg);
                    }
                }
            } else if (url.contains("v1/passport/account/login_by_credential")) {
                properties.put("scene", "login");
                if (bodyMap != null && bodyMap.containsKey("method")) {
                    properties.put("method", bodyMap.get("method"));
                }
                properties.put("action", code == RXErrorCode.OK ? "login_success" : "login_fail");
                if (code != RXErrorCode.OK) {
                    properties.put("request_address", url);
                    if (bodyMap != null) {
                        properties.put("request_body", bodyMap);
                    }
                    if (headers != null) {
                        properties.put("request_header", headers);
                    }
                    properties.put("error_code", code);
                    properties.put("error_message", msg);
                    if (thirdCode != null) {
                        properties.put("error_code_tripartite", thirdCode);
                    }
                    if (thirdMsg != null) {
                        properties.put("error_message_tripartite", thirdMsg);
                    }
                }
            } else if (url.contains("v1/sdkconfig/init")) {
                properties.put("scene", "init");
                properties.put("action", code == RXErrorCode.OK ? "success" : "fail");
                if (code != RXErrorCode.OK) {
                    properties.put("request_address", url);
                    if (bodyMap != null) {
                        properties.put("request_body", bodyMap);
                    }
                    if (headers != null) {
                        properties.put("request_header", headers);
                    }
                    properties.put("error_code", code);
                    properties.put("error_message", msg);
                    if (thirdCode != null) {
                        properties.put("error_code_tripartite", thirdCode);
                    }
                    if (thirdMsg != null) {
                        properties.put("error_message_tripartite", thirdMsg);
                    }
                }
            } else if (url.contains("v1/passport/user/realauth")) {
                properties.put("scene", "realauth");
                properties.put("action", code == RXErrorCode.OK ? "success" : "fail");
                if (code != RXErrorCode.OK) {
                    properties.put("request_address", url);
                    properties.put("request_body", bodyMap);
                    if (headers != null) {
                        properties.put("request_header", headers);
                    }
                    properties.put("error_code", code);
                    properties.put("error_message", msg);
                    if (thirdCode != null) {
                        properties.put("error_code_tripartite", thirdCode);
                    }
                    if (thirdMsg != null) {
                        properties.put("error_message_tripartite", thirdMsg);
                    }
                }
            }

            reportUserAction(properties);
        } catch (Exception e) {
            logDataReportFailed("track request", e);
        }
    }

    public static Map<String, Object> generatePropertiesMap(String scene, String method, String action) {
        Map<String, Object> properties = new HashMap<>();
        if (!TextUtils.isEmpty(scene)) {
            properties.put("scene", scene);
        }
        if (!TextUtils.isEmpty(method)) {
            properties.put("method", method);
        }
        if (!TextUtils.isEmpty(action)) {
            properties.put("action", action);
        }
        return properties;
    }

    private static String getThrowableMessage(Throwable e) {
        String message = e == null ? null : e.getMessage();
        return TextUtils.isEmpty(message) && e != null ? e.getClass().getSimpleName() : message;
    }

    private static void logDataReportFailed(String action, Throwable e) {
        try {
            String prefix = TextUtils.isEmpty(action) ? "data report failed " : "data report failed " + action + " ";
            RXLogger.i(prefix + getThrowableMessage(e));
        } catch (Throwable ignore) {
        }
    }

    private boolean isIgnoreUrl(String url) {
        if (TextUtils.isEmpty(url)) {
            return true;
        }
        boolean handle = false;
        for (int i = 0; i < NEED_TRACK_URL_LIST.size(); i++) {
            if (url.contains(NEED_TRACK_URL_LIST.get(i))) {
                handle = true;
                break;
            }
        }
        return !handle;
    }

    private Map<String, Object> getBodyMap(HttpMethod method, String body) {
        if (TextUtils.isEmpty(body)) {
            return null;
        }
        if (method == HttpMethod.GET) {
            return JSONUtil.toMap(URLHelper.queryToJSONObject(body));
        } else {
            return JSONUtil.toMap(JSONUtil.toJSONObject(body));
        }
    }

    public void reportUserAction(Map<String, Object> properties) {
        report(null, properties);
    }

    public void reportUserAction(String distinctId, Map<String, Object> properties) {
        ThreadUtils.getInstance().runOnBgThread(() -> report(distinctId, properties));
    }

    private void report(String distinctId, Map<String, Object> properties) {
        try {
            if (properties == null || properties.isEmpty()) {
                RXLogger.d(TAG, "properties is empty, so not report.");
                return;
            }

            properties.put("sdk_version", BuildConfig.BUILD);
            Map<String, Object> appInfoMap = new HashMap<>();
            appInfoMap.put("version", AppUtils.getVersionName(RXGlobalData.getContext()));
            properties.put("rx_app_info", appInfoMap);

            if (RuiXueSdk.getCpId() == null) {
                RXLogger.d(TAG, "RuiXueSdk.getCpId() == null, so not report.");
                return;
            }

            int cpid = Integer.parseInt(RuiXueSdk.getCpId());
            String productid = RuiXueSdk.getProductId();
            String channelid = RuiXueSdk.getChannelId();

            if (TextUtils.isEmpty(distinctId)) {
                distinctId = DeviceUtils.getDistinctId(RXGlobalData.getContext());
            }
            String finalDistinctId = TextUtils.isEmpty(distinctId) ? RuiXueSdk.getOpenid() : distinctId;
            String devicecode = DeviceUtils.getDeviceId(RXGlobalData.getContext());
            if (cpid == 0 || TextUtils.isEmpty(productid) || TextUtils.isEmpty(channelid)) {
                Log.i(TAG, "data report failed, please check ruixue productid 、cpid 、channelid params not null");
                return;
            } else if (TextUtils.isEmpty(finalDistinctId) && TextUtils.isEmpty(devicecode)) {
                Log.i(TAG, "data report failed,devicecode and distinct_id params is null error");
                return;
            }

            VersionLoginConfigUtils.addLoginConfigs4DataTrack(properties);
            String stOffset = RXGlobalData.getServerTimeOffset();
            if (!TextUtils.isEmpty(stOffset)) {
                properties.put("st_offset", stOffset);
            }

            Map<String, Object> hashMap = new HashMap<>();
            hashMap.put("type", "track");//事件类型（目前默认为 track）
            hashMap.put("time", DateUtils.getMsTime()); //事件发生时间，格式为 yyyy-mm-dd hh:ii:ss.fff
            hashMap.put("distinct_id", finalDistinctId);//用户唯一标识，一般为 OpenID
            hashMap.put("devicecode", devicecode);
            hashMap.put("event", "#rx_user_action");
            hashMap.put("uuid", UUID.randomUUID().toString());
            hashMap.put("cpid", cpid);
            hashMap.put("product_id", productid);
            hashMap.put("platform_id", RuiXueSdk.PLATFORM_ID);
            hashMap.put("channel_id", channelid);

            String sub_channel_id = PassportManager.getInstance().getSubChannelId();
            if (!TextUtils.isEmpty(sub_channel_id)) {
                hashMap.put("sub_channel_id,", sub_channel_id);
            }
            if (init.get()) {
                hashMap.put("properties", properties);
                if (dataHandler != null) {
                    dataHandler.saveData(hashMap);
                }
            } else {
                RXLogger.i("data report failed, User Action Tracker is not init, Please init first.");
            }
        } catch (Throwable e) {
            e.printStackTrace();
            logDataReportFailed("", e);
        }
    }

    private static class DataHandler extends Handler {
        private static final int FLUSH_QUEUE = 1;
        final StorageJSONArray mFlushTrackData;
        final Future<SharedPreferences> storedSharedPrefs;
        static final HandlerThread workerThread = new HandlerThread("sendUserActionTrackMessageWorker", Thread.MIN_PRIORITY);

        private boolean enableReport;
        private int reportCount = 10;
        private int maxReportIntervalSeconds = 3600;
        private boolean initConfigSuccess = false;

        static {
            workerThread.start();
        }

        public DataHandler(Context context) {
            super(workerThread.getLooper());
            storedSharedPrefs = SharedPreferencesLoader.get().loadPreferences(context, PREFERENCE_NAME_PREFIX);
            mFlushTrackData = new StorageJSONArray(storedSharedPrefs, "track_data_array");
        }

        public void initConfig(boolean enableReport, int reportCount, int maxReportIntervalSeconds) {
            this.enableReport = enableReport;
            this.reportCount = reportCount;
            this.maxReportIntervalSeconds = maxReportIntervalSeconds;
            this.initConfigSuccess = true;
            if (!enableReport) {
                clearAllCache();
            } else {
                posterToServer(FLUSH_INTERVAL);
            }
        }

        @Override
        public void handleMessage(@NonNull Message msg) {
            super.handleMessage(msg);
            synchronized (mFlushTrackData) {
                if (msg.what == FLUSH_QUEUE) {
                    JSONArray jsonArray = mFlushTrackData.get();
                    if (jsonArray != null) {
                        synchronized (jsonArray) {
                            sendData(jsonArray);
                        }
                    }
                }
            }
        }

        private void saveData(Map<String, Object> eventDataMap) {
            synchronized (mFlushTrackData) {
                try {
                    if (storedSharedPrefs.get().getBoolean(STOP_TRACK_USER_ACTION_KEY, false)) {
                        RXLogger.i(TAG, "save data stop track user action, so do nothing.");
                        return;
                    }
                    if (isUserActionTimeout()) {
                        RXLogger.i(TAG, "save data timeout, so do nothing.");
                        return;
                    }
                    if (initConfigSuccess && !enableReport) {
                        RXLogger.i(TAG, "save data init success disable report, so do nothing.");
                        return;
                    }
                    long ts = System.currentTimeMillis();
                    // userActionTimeout 判断只上传一次
                    JSONArray jsonArray = mFlushTrackData.get();
                    jsonArray = jsonArray == null ? new JSONArray() : jsonArray;
                    JSONObject item = new JSONObject(eventDataMap);
                    synchronized (jsonArray) {
                        jsonArray.put(item);
                        mFlushTrackData.put(jsonArray);
                    }
                    checkAndSetFirstTimestamp();
                    checkSendStrategy(jsonArray.length());
                    RXLogger.i(TAG, "cached data=" + item + " ,total_length=" + jsonArray.length() + ",consume time=" + (System.currentTimeMillis() - ts));
                } catch (OutOfMemoryError e) {
                    logDataReportFailed("save data", e);
                    posterToServer();
                } catch (Throwable e) {
                    e.printStackTrace();
                    logDataReportFailed("save data", e);
                }
            }
        }

        /**
         * post请求
         */
        private void sendData(JSONArray jsonArray) {
            if (jsonArray == null || jsonArray.length() <= 0) {
                return;
            }

            if (!enableReport) {
//                RXLogger.d(TAG, "sendData disable report");
                return;
            }

            try {
                int length = jsonArray.length();

                // 只上报最后 reportCount 条数据，其余的删除
                JSONArray reportArray = getReportJSONArray(jsonArray);

                boolean isTimeout = isTimeout();

                Map<String, String> headers = HttpUtil.getDefaultHeaders();
                headers.put("Accept-Encoding", "gzip");
                headers.put("content-encoding", "gzip");
                headers.put("content-type", "application/json");
                headers.put("ruixue-datacount", String.valueOf(length));
                try {
                    RXHttpClient.Builder builder = new RXHttpClient.Builder();
                    builder.setCompress(true);
                    builder.setRestfulData(true);
                    JSONObject jsonObject = builder.build().apiRequest(HttpMethod.POST, RXApiPath.Data.TRACK_DATA_API, reportArray.toString(), headers, null);
                    int code = jsonObject.optInt("code", -1);
                    if (code == 0) {
                        handleUploadSuccess(isTimeout, length);
                    } else {
                        posterToServer(FLUSH_INTERVAL);
                    }
                } catch (OutOfMemoryError e) {
                    logDataReportFailed("send data", e);
                    clearAllCache();
                } catch (Throwable e) {
                    e.printStackTrace();
                    logDataReportFailed("send data", e);
                }
            } catch (Exception e) {
                posterToServer(FLUSH_INTERVAL);
                e.printStackTrace();
                logDataReportFailed("send data", e);
            }
        }

        private JSONArray getReportJSONArray(JSONArray allData) {
            JSONArray reportArray = new JSONArray();
            if (allData == null) {
                return reportArray;
            }
            int length = allData.length();
            if (length <= reportCount) {
                return allData;
            } else { // all data 的数量比 report count 大
                for (int i = length - reportCount; i < length; i++) {
                    reportArray.put(allData.optJSONObject(i));
                }
                return reportArray;
            }
        }

        /**
         * @param isTimeout 是否超时
         * @param length    上报时获取到的日志数量（清除的数量，实际上报数量可能比这个少，依赖 reportCount）
         */
        private void handleUploadSuccess(boolean isTimeout, int length) {
            int leftCount = clearCache(length);
            if (isTimeout) {
//                RXLogger.d(TAG, "timeout last report data success.");
                setUserActionTimeout();
            }
            boolean stopUserActionTrack = false;
            try {
                stopUserActionTrack = storedSharedPrefs.get().getBoolean(STOP_TRACK_USER_ACTION_KEY, false);
            } catch (Exception e) {
                logDataReportFailed("read stop flag", e);
            }
            if (stopUserActionTrack) {  // 停止上报
                removeCallbacksAndMessages(null);
            } else {
                if (leftCount > 0) {
                    posterToServer(FLUSH_INTERVAL);
                }
            }
        }

        private int clearCache(int length) {
            synchronized (mFlushTrackData) {
                try {
                    JSONArray array = mFlushTrackData.get();
                    JSONArray newArray = new JSONArray();
                    if (array.length() >= length) {
                        for (int i = length; i < array.length(); i++) {
                            newArray.put(array.optJSONObject(i));
                        }
                    }
                    RXLogger.d(TAG, "clear cache upload " + length + " records, left " + newArray.length() + " records.");
                    mFlushTrackData.put(newArray);
                    return newArray.length();
                } catch (Exception e) {
                    logDataReportFailed("clear cache", e);
                    return -1;
                }
            }
        }

        private void clearAllCache() {
            synchronized (mFlushTrackData) {
                try {
                    mFlushTrackData.put(null);
                } catch (Throwable e) {
                    logDataReportFailed("clear all cache", e);
                }
            }
        }

        private void checkAndSetFirstTimestamp() {
            long timestamp = getFirstInsertTimestamp();
            if (timestamp <= 0L) {
                RXLogger.d(TAG, "first time insert data, so record it.");
                putFirstInsertTimestamp(System.currentTimeMillis());
            }
        }

        private long getFirstInsertTimestamp() {
            try {
                return storedSharedPrefs.get().getLong(FIRST_SAVE_DATA_TIME_KEY, 0L);
            } catch (Exception e) {
                logDataReportFailed("get first insert timestamp", e);
                return 0L;
            }
        }

        private void putFirstInsertTimestamp(long timestamp) {
            try {
                storedSharedPrefs.get().edit().putLong(FIRST_SAVE_DATA_TIME_KEY, timestamp).apply();
            } catch (Exception e) {
                logDataReportFailed("put first insert timestamp", e);
            }
        }

        /**
         * 用户行为是否超时的标识 的内存判断
         *
         * @return 是否超时
         */
        private boolean isTimeout() {
            return System.currentTimeMillis() - getFirstInsertTimestamp() > maxReportIntervalSeconds * 1000L;
        }

        /**
         * 用户行为记录是否超时，记录在本地的标识（只有用户行为超时，并且上传成功才会设置此标识）
         *
         * @return 是否超时
         */
        private boolean isUserActionTimeout() {
            try {
                return storedSharedPrefs.get().getBoolean(USER_ACTION_TIMEOUT_KEY, false);
            } catch (Exception e) {
                logDataReportFailed("get timeout flag", e);
                return false;
            }
        }

        private void setUserActionTimeout() {
            try {
                storedSharedPrefs.get().edit().putBoolean(USER_ACTION_TIMEOUT_KEY, true).apply();
            } catch (Exception e) {
                logDataReportFailed("set timeout flag", e);
            }
        }

        public void checkSendStrategy(int count) {
            if (!enableReport) {
                return;
            }
            if (isTimeout()) {
                posterToServer();
            } else if (count >= FLUSH_MAX_COUNT) {
                posterToServer();
            } else {
                posterToServer(FLUSH_INTERVAL);
            }
        }

        public void posterToServer() {
            posterToServer(0);
        }

        public void posterToServer(final long delay) {
            try {
                if (delay <= 0) { // 立即执行
                    removeMessages(FLUSH_QUEUE);
                    Message msg = Message.obtain();
                    msg.what = FLUSH_QUEUE;
                    sendMessage(msg);
                    return;
                }

                if (!this.hasMessages(FLUSH_QUEUE)) { // 延迟执行
                    Message msg = Message.obtain();
                    msg.what = FLUSH_QUEUE;
                    this.sendMessageDelayed(msg, delay);
                }
            } catch (Throwable e) {
                logDataReportFailed("post to server", e);
            }
        }
    }

}
