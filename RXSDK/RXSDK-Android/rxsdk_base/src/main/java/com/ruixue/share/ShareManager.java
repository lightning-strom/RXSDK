package com.ruixue.share;

import android.app.Activity;
import android.content.Intent;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.TrackDataMgr;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.RXRequest;
import com.ruixue.net.URLHelper;
import com.ruixue.openapi.RXApiPath;
import com.ruixue.passport.PassportManager;
import com.ruixue.performancereport.PerformReportManager;
import com.ruixue.permission.RXPermissions;
import com.ruixue.reflect.BaseReflectClass;
import com.ruixue.share.system.SystemShareImpl;
import com.ruixue.utils.JSONUtil;

import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;

public class ShareManager extends BaseReflectClass {

    private static ShareManager instanceField;

    public static ShareManager getInstance() {
        if (instanceField == null) {
            synchronized (ShareManager.class) {
                if (instanceField == null) {
                    instanceField = new ShareManager();
                }
                return instanceField;
            }
        } else {
            return instanceField;
        }
    }

    private final AtomicBoolean isInited = new AtomicBoolean(false);
    private ShareApi mShareApi;
    private static final Map<String, String> mShareApiMap = new HashMap<>();


    static {
        mShareApiMap.put("system", "com.ruixue.share.system.SystemShareImpl");
        mShareApiMap.put(PlatformType.WECHAT.getKeyword(), "com.ruixue.wechat.WXSdkApiImpl");
        mShareApiMap.put(PlatformType.FACEBOOK.getKeyword(), "com.ruixue.sdk.facebook.FacebookSdkWrapper");
        mShareApiMap.put(PlatformType.MESSENGER.getKeyword(), "com.ruixue.sdk.facebook.FacebookSdkWrapper");
        mShareApiMap.put(PlatformType.INSTAGRAM.getKeyword(), "com.ruixue.sdk.instagram.InstagramSdkWrapper");
        mShareApiMap.put(PlatformType.LINE.getKeyword(), "com.ruixue.sdk.line.LineSdkWrapper");
        mShareApiMap.put(PlatformType.TIKTOK.getKeyword(), "com.ruixue.sdk.tiktok.TiktokSdkWrapper");
        mShareApiMap.put(PlatformType.ZALO.getKeyword(), "com.ruixue.sdk.zalo.ZaloSdkWrapper");
        mShareApiMap.put(PlatformType.SNAPCHAT.getKeyword(), "com.ruixue.sdk.snapchat.SnapchatSdkWrapper");
    }

    private volatile boolean isCacheEnable = true;
    private final Map<Integer, ShareData> mShareDataCache = new HashMap<>();
    private static final Map<String, Object> mFunctionMap = new HashMap<>();
    private volatile ShareData mShareData;
    volatile Object game_info;
    private volatile JSONObject shareConfig = null;

    public boolean isCacheEnable() {
        return isCacheEnable;
    }

    public ShareManager setCacheEnable(boolean cacheEnable) {
        isCacheEnable = cacheEnable;
        return this;
    }

    public void clearCache() {
        this.mShareDataCache.clear();
        mFunctionMap.clear();
    }

    public void delShareDataCache(@NonNull Map<String, Object> hashMap) {
        String hashStr = (String) hashMap.get("func") + hashMap.get("platform") + hashMap.get("region") + hashMap.get("open_id");
        int hashCode = hashStr.hashCode();
        this.mShareDataCache.remove(hashCode);
    }

    public ShareData getShareDataCache(@NonNull Map<String, Object> hashMap) {
        String hashStr = (String) hashMap.get("func") + hashMap.get("platform") + hashMap.get("region") + hashMap.get("open_id");
        int hashCode = hashStr.hashCode();
        if (isCacheEnable && this.mShareDataCache.containsKey(hashCode)) {
            ShareData shareData = this.mShareDataCache.get(hashCode);
            if (shareData != null && hashMap.containsKey("transmits")) {
                shareData.setTransmits((String) hashMap.get("transmits"));
            }
            return shareData;
        } else {
            return null;
        }
    }

    private ShareManager setShareDataCache(Map<String, Object> hashMap, ShareData shareData) {
        if (this.mShareDataCache.size() > 50) {
            this.clearCache();
        }
        if (isCacheEnable && shareData != null) {
            String hashStr = (String) hashMap.get("func") + hashMap.get("platform") + hashMap.get("region") + hashMap.get("open_id");
            this.mShareDataCache.put(hashStr.hashCode(), shareData);
        }
        return this;
    }

    public boolean isInited() {
        return isInited.get();
    }

    public void getPlatforms(RXJSONCallback callback) {
        if (isInited.get() && shareConfig != null) {
            if (callback != null)
                callback.onSuccess(shareConfig);
        } else {
            RXRequest.create(RXApiPath.Share.PLATFORMS).getAsync(new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    isInited.set(data != null);
                    shareConfig = data;
                    if (callback != null)
                        callback.onSuccess(data);
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    isInited.set(false);
                    if (callback != null)
                        callback.onFailed(cause);
                }
            });
        }
    }

    public ShareManager init() {
//        getPlatforms(null);
        return this;
    }

    public void shareSchedulingInit(@NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        hashMap.put("type", "app");
        if (!hashMap.containsKey("open_id"))
            hashMap.put("open_id", RuiXueSdk.getOpenid());
        RXRequest.create(RXApiPath.Share.SCHEDULING_INIT).setBody(hashMap).postAsync(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (data != null) {
                    clearCache();
                    mFunctionMap.putAll(JSONUtil.toMap(data));
                }
                if (callback != null)
                    callback.onSuccess(data);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null)
                    callback.onFailed(cause);
            }
        });
    }

    public Map<String, Object> getShareScheduling(String... funcList) {
        return getShareScheduling(Arrays.asList(funcList));
    }

    public Map<String, Object> getShareScheduling(List<String> funcList) {
        if (funcList != null && funcList.size() > 0) {
            Map<String, Object> t = new HashMap<>();
            for (String func : funcList) {
                if (mFunctionMap.containsKey(func))
                    t.put(func, mFunctionMap.get(func));
            }
            return t;
        } else {
            return mFunctionMap;
        }
    }

    @SuppressWarnings("unchecked")
    public void shareSchedulingReport(@NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        handleParams(hashMap);
        if (mShareData != null) {
            if (hashMap.containsKey("properties")) {
                Map<String, Object> properties = (Map<String, Object>) hashMap.get("properties");
                if (properties != null) {
                    properties.putAll(mShareData.getShareReportData());
                    hashMap.put("properties", properties);
                } else {
                    hashMap.put("properties", mShareData.getShareReportData());
                }
            } else {
                hashMap.put("properties", mShareData.getShareReportData());
            }
        }

        try {
            Map<String, Object> resMap = PerformReportManager.getInstance().buildGPMParameter("");
            if (resMap != null && !resMap.isEmpty()) {
                if (hashMap.get("properties") != null) {
                    Map<String, Object> resProperties = (Map<String, Object>) hashMap.get("properties");
                    if (resProperties != null) {
                        resProperties.putAll(resMap);
                    }
                } else {
                    hashMap.put("properties", resMap);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        RXRequest.create(RXApiPath.Share.SCHEDULING_REPORT).setBody(hashMap).postAsync(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (data != null) {
//                    mShareData = handleShareData(data, hashMap);
                    mShareData = ShareData.fromJson(data);
                    if (null != mShareData) {
                        if (hashMap.containsKey("func") && mShareData.getScheduling() != null) {
                            mFunctionMap.put((String) hashMap.get("func"), mShareData.getScheduling());
                        }
                        setShareDataCache(hashMap, mShareData);
                    } else {
                        delShareDataCache(hashMap);
                    }
                } else {
                    delShareDataCache(hashMap);
                }
                if (callback != null)
                    callback.onSuccess(data);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (callback != null)
                    callback.onFailed(cause);
            }
        });
    }


    /**
     * 获取分享埋点数据
     * @param hashMap  map 参数
     *                 region	 string	 地区码
     *                 func	     string	 埋点标识
     *                 transmits string	 透传参数，原样返回， 请使用key=value形式，并使用urlencode
     * @param callback 回调函数
     */
    public void getShareDataAsync(@NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        Objects.requireNonNull(hashMap);
        if (!hashMap.containsKey("platform")) {
            hashMap.put("platform", "wechat");
        }
        handleParams(hashMap);
        ShareData shareDataCache = getShareDataCache(hashMap);
        if (null != shareDataCache && null != callback) {
            mShareData = shareDataCache;
            callback.onSuccess(shareDataCache.toJSONObject());
            return;
        }
        game_info = hashMap.get("game_info");
        RXRequest.create(RXApiPath.Share.GET_DATA).setBody(hashMap).sign(true).postAsync(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (data != null) {
//                    mShareData = handleShareData(data, hashMap);
                    mShareData = ShareData.fromJson(data);
                }
                if (null != callback)
                    callback.onSuccess(mShareData != null ? mShareData.toJSONObject() : data);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                if (null != callback)
                    callback.onFailed(cause);
            }

            @Override
            public void onError(RXException e) {
                if (null != callback)
                    callback.onError(e);
            }
        });
    }

    private Map<String, Object> handleParams(Map<String, Object> hashMap) {
        if (hashMap != null) {
            hashMap.put("type", "app");
            hashMap.put("product_id", RuiXueSdk.getProductId());
            hashMap.put("channel_id", RuiXueSdk.getChannelId());
            if (!hashMap.containsKey("open_id")) {
                hashMap.put("open_id", PassportManager.getInstance().getOpenid());
            }
            if (game_info != null && !hashMap.containsKey("game_info")) {
                hashMap.put("game_info", game_info);
            }
            if (!hashMap.containsKey("sub_channel_id")) {
                hashMap.put("sub_channel_id", PassportManager.getInstance().getSubChannelId());
            }
            return handleTransmits(hashMap);
        }
        return hashMap;

    }

//    @SuppressWarnings("unchecked")
//    @Nullable
//    private ShareData handleShareData(@Nullable JSONObject data, @NonNull Map<String, Object> hashMap) {
//        ShareData shareData = ShareData.fromJson(data);
//        if (null != shareData && null != shareData.getContent() && !TextUtils.isEmpty(shareData.getContent().getUrl())) {
//            String url = shareData.getContent().getUrl();
//            try {
//                if (hashMap.containsKey("protocol_android")) {
//                    url += "&protocol_android=" + URLEncoder.encode(String.valueOf(hashMap.get("protocol_android")), "UTF-8");
//                }
//                if (hashMap.containsKey("protocol_ios")) {
//                    url += "&protocol_ios=" + URLEncoder.encode(String.valueOf(hashMap.get("protocol_ios")), "UTF-8");
//                }
//                if (hashMap.containsKey("use_scheme")) {
//                    url += "&use_scheme=" + hashMap.get("use_scheme");
//                }
//                url += "&api=" + URLEncoder.encode(RuiXueSdk.getFirstBaseUrl(), "UTF-8");
//
//                if (hashMap.containsKey("ext")) {
//                    url += "&" + URLHelper.buildQuery((Map<String, Object>) hashMap.get("ext"));
//                }
//
//            } catch (UnsupportedEncodingException e) {
//                e.printStackTrace();
//            }
//            shareData.getContent().setUrl(url);
//        }
//        return shareData;
//    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> handleTransmits(@NonNull Map<String, Object> hashMap) {
        try {
            String transmits = URLHelper.urlDecode((String) hashMap.get("transmits"));
            if (hashMap.containsKey("protocol_android")) {
                transmits += "&protocol_android=" + (hashMap.get("protocol_android"));
                hashMap.remove("protocol_android");
            }
            if (hashMap.containsKey("protocol_ios")) {
                transmits += "&protocol_ios=" + (hashMap.get("protocol_ios"));
                hashMap.remove("protocol_ios");
            }
            if (hashMap.containsKey("use_scheme")) {
                transmits += "&use_scheme=" + hashMap.get("use_scheme");
                hashMap.remove("use_scheme");
            }
            if (hashMap.containsKey("ext")) {
                transmits += "&" + URLHelper.buildQuery((Map<String, Object>) hashMap.get("ext"));
            }
            if (!TextUtils.isEmpty(transmits)) {
                hashMap.put("transmits", URLHelper.urlEncode(transmits));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return hashMap;
    }

    public void shareReport(Map<String, Object> properties) {
        ShareDataResult shareDataResult = new ShareDataResult();
        shareDataResult.setData(mShareData);
        shareReport(shareDataResult, properties);
        mShareData = null;


    }

    public void shareReport(ShareDataResult shareDataResult, Map<String, Object> extProperties) {
        ShareData shareData = shareDataResult.getData();
        if (shareData == null) {
            RXLogger.e("share data null error ");
            return;
        }
        Map<String, Object> properties = shareData.getShareReportData();
        if (shareDataResult.getExt() != null) {
            properties.putAll(shareDataResult.getExt());
        }
        if (extProperties != null) {
            properties.putAll(extProperties);
        }
        properties.put("result", shareDataResult.getMsg());
        properties.put("result_code", (shareDataResult.getCode()));
        properties.put("result_msg", shareDataResult.getMsg());
        TrackDataMgr.getInstance().trackAsync("#share", properties);
    }

    public void shareReport(ShareDataResult shareDataResult) {
        shareReport(shareDataResult, null);
    }

    public void shareReportSchedule(Map<String, Object> hashMap, ShareDataResult shareResult) {
        try {
            Map<String, Object> m = new HashMap<>();
            m.put("func", hashMap.get("func"));
            m.put("platform", hashMap.get("platform"));
            m.put("region", shareResult.getData().getStrategy().getRegion());
            if (hashMap.get("transmits") != null)
                m.put("transmits", hashMap.get("transmits"));
            if (shareResult.getData().getScheduling() != null) {
                m.putAll(shareResult.getData().getScheduling());
            }
            if (hashMap.get("properties") != null)
                m.put("properties", hashMap.get("properties"));
            shareSchedulingReport(m, new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    Log.d("shareReportSchedule", "上报成功");
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    Log.d("shareReportSchedule", "上报失败");
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void shareGetData(boolean readCache, Map<String, Object> hashMap, RXJSONCallback callback) {
        setCacheEnable(readCache);
        getShareDataAsync(hashMap, callback);
    }

    public void getShortUrl(@NonNull Map<String, Object> hashMap, RXJSONCallback callback) {
        RXRequest.create("v1/url/short").setBody(hashMap).postAsync(callback);
    }

    public ShareApi getShareApiInstance(String keyword) {
        String className = mShareApiMap.get(keyword);
        Class<?> ShareApiClass = getClass(className);
        if (ShareApiClass != null) {
            try {
                Method methodInit = ShareApiClass.getMethod("getInstance");
                return (ShareApi) Objects.requireNonNull(methodInit.invoke(null));
            } catch (InvocationTargetException e) {
                Throwable t = e.getCause();
                if (t != null)
                    t.printStackTrace();
            } catch (Exception e) {
                e.printStackTrace();
            }
            return null;
        } else {
            return SystemShareImpl.getInstance();
        }
    }

    public void doShareByPlatform(Activity activity, String platform, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (!hashMap.containsKey("platform")) {
            hashMap.put("platform", platform);
        }
        platform = (String) hashMap.get("platform");
        try {
            mShareApi = getShareApiInstance(platform);
            if (mShareApi != null) {
                boolean ok = mShareApi.doShare(activity, hashMap, callback);
                if (!ok) {
                    callback.onFailed(RXErrorCode.SHARE_PARAMS_ERROR.toJSONObject());
                }
            } else if (null != callback) {
                callback.onError(new RXException(5100, "未接入 rxsdk_" + platform + " 组件，请前往 https://doc.ruixueyun.com/dev_doc/introduction/updatelog/android.html 查看接入手册 "));
            }
        } catch (Exception e) {
            e.printStackTrace();
            if (null != callback) {
                callback.onError(new RXException(e));
            }
        }

    }

    public void doShareByPlatform(Activity activity, PlatformType platformType, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (platformType == PlatformType.NONE) {
            platformType = PlatformType.WECHAT;
        }
        if (platformType.getShareScene() != ShareScene.SELECT) {
            hashMap.put("shareScene", platformType.getShareScene());
        }
        doShareByPlatform(activity, platformType.getKeyword(), hashMap, callback);
    }

    interface TransComplete {
        void onComplete();
    }

    public void doShareTransShort(Map<String, Object> hashMap, TransComplete complete) {
        Object useShortUrl = hashMap.get("useShortUrl");
        if (useShortUrl instanceof Boolean) {
            boolean isShortUrl = (boolean) useShortUrl;
            Object url = hashMap.get("url");
            if (isShortUrl && url instanceof String && !((String) url).isEmpty()) {
                HashMap<String, Object> shortUrlMap = new HashMap<>();
                shortUrlMap.put("title", hashMap.get("title"));
                shortUrlMap.put("content", hashMap.get("content"));
                shortUrlMap.put("image", hashMap.get("image"));
                shortUrlMap.put("ext", hashMap.get("ext"));
                getShortUrl(shortUrlMap, new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        try {
                            if (data != null) {
                                String shortUrl = data.optString("short_url");
                                hashMap.put("url", shortUrl);
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                        complete.onComplete();
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        complete.onComplete();
                    }
                });
            } else {
                complete.onComplete();
            }
        } else {
            complete.onComplete();
        }
    }


    @SuppressWarnings("unchecked")
    public void doShare(Activity activity, boolean autoShare, boolean autoReport, Map<String, Object> hashMap, RXJSONCallback callback) {
        try {
            if (!hashMap.containsKey("platform")) {
                hashMap.put("platform", PlatformType.WECHAT.getKeyword());
            }
            PlatformType platformType = PlatformType.toEnum((String) hashMap.get("platform"));
            if (hashMap.containsKey("func")) {
                getShareDataAsync(hashMap, new RXJSONCallback() {
                    @Override
                    public void onSuccess(@Nullable JSONObject data) {
                        if (data != null) {
                            try {
                                hashMap.putAll(JSONUtil.toMap(data.getJSONObject("content")));
                                doShareTransShort(hashMap, new TransComplete() {
                                    @Override
                                    public void onComplete() {

                                        if (platformType.equals(PlatformType.WECHAT)) {
                                            if (!hashMap.containsKey("appid")) {
                                                hashMap.put("appid", data.optString("identity"));
                                            }
                                            if (!hashMap.containsKey("shareScene")) {
                                                //转换分享场景值
                                                try {
                                                    hashMap.put("shareScene", data.getJSONObject("platforms").optInt((String) hashMap.get("platform"), 1) - 1);
                                                } catch (JSONException e) {
                                                    e.printStackTrace();
                                                    if (callback != null) {
                                                        callback.onError(new RXException(e));
                                                    }
                                                }
                                            }
                                        }

                                        ShareDataResult shareResult = new ShareDataResult();
                                        if (autoReport && hashMap.containsKey("ext")) {
                                            shareResult.setExt((Map<String, Object>) hashMap.get("ext"));
                                        }
                                        shareResult.setData(ShareData.fromJson(data.toString()));
                                        Object url = hashMap.get("url");
                                        if (url instanceof String) {
                                            shareResult.data.content.setUrl(hashMap.get("url").toString());
                                        }
                                        if (!autoShare) {
                                            if (callback != null) {
                                                callback.onSuccess(shareResult.toJSONObject());
                                            }
                                        } else {
                                            doShareByPlatform(activity, platformType, hashMap, new RXJSONCallback() {
                                                @Override
                                                public void onSuccess(@Nullable JSONObject data) {
                                                    shareResult.setCode(RXErrorCode.SUCCESS.getValue());
                                                    shareResult.setMsg("ok");
                                                    if (callback != null) {
                                                        callback.onSuccess(shareResult.toJSONObject());
                                                    }
                                                    if (autoReport) {
                                                        if (shareResult.data != null && shareResult.data.getScheduling() == null) {
                                                            Map<String, Object> schedulingMap = new HashMap<>();
                                                            schedulingMap.put("scheduling_event", "done");
                                                            shareResult.data.setScheduling(schedulingMap);
                                                        }
                                                        shareReportSchedule(hashMap, shareResult);
                                                    }
                                                }

                                                @Override
                                                public void onFailed(@NonNull JSONObject cause) {
                                                    shareResult.setCode(cause.optInt("code", RXErrorCode.SHARE_PARAMS_ERROR.getValue()));
                                                    String errorMsg = "failed";
                                                    try {
                                                        if (shareResult.data.getScheduling() != null) {
                                                            Object errorObj = shareResult.data.getScheduling().get("scheduling_failed_msg");
                                                            errorMsg = (String) errorObj;
                                                        }
                                                    } catch (Exception e) {
                                                        e.printStackTrace();
                                                    }
                                                    shareResult.setMsg(errorMsg);
                                                    if (callback != null) {
                                                        callback.onFailed(shareResult.toJSONObject());
                                                    }
                                                    if (autoReport) {
                                                        if (shareResult.data != null && shareResult.data.getScheduling() == null) {
                                                            Map<String, Object> schedulingMap = new HashMap<>();
                                                            schedulingMap.put("scheduling_event", "fail");
                                                            schedulingMap.put("scheduling_failed_msg", errorMsg);
                                                            shareResult.data.setScheduling(schedulingMap);
                                                        }
                                                        shareReportSchedule(hashMap, shareResult);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            } catch (JSONException e) {
                                e.printStackTrace();
                                if (callback != null) {
                                    callback.onError(new RXException(e));
                                }
                            }
                        } else {
                            if (callback != null) {
                                callback.onFailed(RXErrorCode.SHARE_PARAMS_ERROR.toJSONObject());
                            }
                        }
                    }

                    @Override
                    public void onFailed(@NonNull JSONObject cause) {
                        if (callback != null) {
                            callback.onFailed(cause);
                        }
                    }
                });
            } else {
                doShareByPlatform(activity, platformType, hashMap, callback);
            }
        } catch (Exception e) {
            e.printStackTrace();
            if (callback != null) {
                callback.onError(new RXException(e));
            }
        }
    }


    public void onResume(Activity activity) {
        if (mShareApi != null) {
            mShareApi.onResume(activity);
        }
    }

    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        RXLogger.i("requestCode=" + requestCode + ", resultCode=" + resultCode + " data=" + data);
        if (mShareApi != null) {
            mShareApi.onShareActivityResult(activity, requestCode, resultCode, data);
        }
    }

    public void onRequestPermissionsResult(Activity activity, int requestCode, String[] permissions, int[] grantResults) {
        if (requestCode == RXPermissions.REQUEST_CODE) {

        }
    }
}
