package com.ruixue.base;

import android.content.SharedPreferences;
import android.text.TextUtils;

import androidx.annotation.Keep;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.HttpMethod;
import com.ruixue.net.RXRequest;
import com.ruixue.openapi.BusinessDataCallback;
import com.ruixue.openapi.BusinessWindowData;
import com.ruixue.storage.SharedPreferencesLoader;
import com.ruixue.storage.StorageString;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/5/27
 */
public class BusinessMgr {
    private static class Single {
        static BusinessMgr sInstance = new BusinessMgr();
    }

    public static BusinessMgr getInstance() {
        return Single.sInstance;
    }

    public BusinessMgr() {

    }

    public static class PopupsCache {
        static Map<String, PopupsCache> popupsCacheMap;
        static StorageString storageJSONObject;

        static {
            Future<SharedPreferences> storedSharedPrefs = SharedPreferencesLoader.get().loadPreferences(RuiXueSdk.getContext(), PREFERENCE_NAME_PREFIX);
            storageJSONObject = new StorageString(storedSharedPrefs, "business");
            String jsonObject = storageJSONObject.get();
            popupsCacheMap = new Gson().fromJson(jsonObject, new TypeToken<Map<String, PopupsCache>>() {
            }.getType());
            if (popupsCacheMap == null) {
                popupsCacheMap = new HashMap<>();
            }
        }

        static PopupsCache getPopupsCache(String key) {
            key = key + RuiXueSdk.getOpenid();
            PopupsCache popupsCache = popupsCacheMap.get(key);
            if (popupsCache == null) {
                popupsCache = new PopupsCache().setKey(key);
                popupsCacheMap.put(key, popupsCache);
            }
            return popupsCache;
        }

        @Keep
        private String key;
        @Keep
        private int days;
        private int day_limit;

        public int getDay_limit() {
            return day_limit;
        }

        @Keep
        private int day_count;

        public int getDayCount() {
            if (days != getToday()) {
                day_count = 0;
            }
            return day_count;
        }

        public PopupsCache setKey(String key) {
            this.key = key;
            return this;
        }

        public PopupsCache update() {
            if (days != getToday()) {
                days = getToday();
                day_count = 1;
            } else {
                day_count += 1;
            }
            RXLogger.i("day_count :" + day_count);
            storageJSONObject.put(new Gson().toJson(popupsCacheMap));
            return this;
        }

        public int getToday() {
            return Calendar.getInstance().get(Calendar.YEAR) * 1000 + Calendar.getInstance().get(Calendar.DAY_OF_YEAR);
        }

        @NonNull
        @Override
        public String toString() {
            return new Gson().toJson(this);
        }
    }

    private BusinessData mBusinessData;

    private boolean automaticLimit = false;
    public static final String BUSINESS_DATA = "v1/business/rule";
    public static final String BUSINESS_ORDER = "v1/business/p";
    private static final String PREFERENCE_NAME_PREFIX = "com.ruixue.business";
    Runnable runnable;
    AtomicBoolean isInRequest = new AtomicBoolean(false);

    public void setAutomaticLimit(boolean automaticLimit) {
        this.automaticLimit = automaticLimit;
    }

    public void getOrder(String trade_no, String sign, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("trade_no", trade_no);
        hashMap.put("sign", sign);
        getOrder(hashMap, callback);
    }

    public void getOrder(Map<String, Object> hashMap, RXJSONCallback callback) {
        RXRequest.create(BUSINESS_ORDER).setMethod(HttpMethod.POST).setBody(hashMap).postAsync(callback);
    }

    public void refreshBusinessData(int cursor, long delayMillis, RXJSONCallback callback) {
        Map<String, Object> hashMap = new HashMap<>();
        if (mBusinessData != null) {
            hashMap.put("version", mBusinessData.getVersion());
        }
        ThreadUtils.getInstance().removeBgCallbacks(runnable);
        isInRequest.set(true);
        runnable = RXRequest.create(BUSINESS_DATA).setBody(hashMap).getAsyncDelay(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (data != null) {
                    long refresh = data.optLong("refresh_time", 0);
                    if (refresh > 0) {
                        refreshBusinessData(0, refresh, callback);
                    }
                }
                if (callback != null) {
                    callback.onSuccess(data);
                }else if (mCallback!=null){
                    mCallback.onSuccess(data);
                    mCallback=null;
                }
                isInRequest.set(false);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                isInRequest.set(false);
                if (cursor < 1) {
                    refreshBusinessData(cursor + 1, 3000, callback);
                } else if (cursor < 2) {
                    RXLogger.i("will refresh business date after " + 600000 / 1000 + " seconds");
                    refreshBusinessData(cursor + 1, 600000, callback);
                }
            }

//            @Override
//            public void onError(RXException e) {
//                if (cursor < 3) {
//                    pullBusinessData(cursor + 1, delayMillis);
//                }
//            }
        }, delayMillis);
    }

    RXJSONCallback mCallback;

    public interface BusinessDataListener {
        void onResponse(BusinessData businessData);
    }

    public void refreshBusinessData(RXJSONCallback callback) {
        if (mBusinessData != null) {
            if (callback != null) {
                callback.onSuccess(mBusinessData.toJSONObject());
            }
        } else {
            mCallback = callback;
            refreshBusinessData(0, 0, null);
        }
    }

    public void refreshBusinessData() {
        getBusinessData(null);
    }

    public void getBusinessData(BusinessDataListener businessDataListener) {
        refreshBusinessData(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (data != null) {
                    BusinessData businessData = BusinessData.fromJson(data);
                    if (!businessData.isHitCache()) {
                        mBusinessData = businessData;
                    }
                    if (businessDataListener != null) {
                        businessDataListener.onResponse(mBusinessData);
                    }
                }
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.i(cause.toString());
            }
        });
    }

    public void getBusinessData(String window_key, String event, String before_event, BusinessDataCallback callback) {
        RXLogger.i("getBusinessData: window_key:" + window_key + ",event:" + event + ",before_event:" + before_event);
        String finalBefore_event = TextUtils.isEmpty(before_event) ? "__DEFAULT__" : before_event;
        BusinessDataListener onGetBusinessListener1 = businessData -> {
            try {
                BusinessData.MainWindowList mainWindow = getMainWindow(window_key);
                if (mainWindow != null) {
                    List<? extends BusinessData.PopupsBean> popupsBeans = getPopupsBeanList(mainWindow, event, finalBefore_event);
                    List<BusinessWindowData> windowDetailsBeanList = getWindowDetailsList(popupsBeans);
                    if (callback != null)
                        callback.onSuccess(windowDetailsBeanList);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        };
        if (mBusinessData != null) {
            onGetBusinessListener1.onResponse(mBusinessData);
        } else {
            getBusinessData(onGetBusinessListener1);
        }
    }

    private List<BusinessWindowData> getWindowDetailsList(List<? extends BusinessData.PopupsBean> popupsBeans) {
        List<BusinessWindowData> windowDetailsBeanList = new ArrayList<>();
        if (popupsBeans != null) {
            for (BusinessData.PopupsBean item : popupsBeans) {
                for (BusinessWindowData windowDetailsBean : mBusinessData.getWindowList()) {
                    if (windowDetailsBean.getWindowKey().equals(item.getWindowKey())) {
                        windowDetailsBeanList.add(windowDetailsBean);
                    }
                }
            }
        }
        return windowDetailsBeanList;
    }


    private List<? extends BusinessData.PopupsBean> getPopupsBeanList(BusinessData.MainWindowList mainWindow, String event, String before_event) {
        Map<String, List<BusinessData.AutoPopups>> popupsBeanMap = mainWindow.getAutoPopups();
        List<BusinessData.AutoPopups> autoPopups = popupsBeanMap.get(event);
        ArrayList<BusinessData.PopupsBean> windowPopups = new ArrayList<>();
        if (autoPopups != null) {
//            Collections.sort(autoPopups);
            for (BusinessData.AutoPopups item : autoPopups) {
                if (item.getDayLimit() > 0) {
                    String key = mainWindow.getWindowKey() + event + item.getWindowKey();
                    PopupsCache popupsCache = PopupsCache.getPopupsCache(key);
                    if (item.getDayLimit() > popupsCache.getDayCount()) {
                        if (automaticLimit) {
                            updateDayLimitCount(key);
                        }
                        windowPopups.add(item);
                    }
                } else {
                    windowPopups.add(item);
                }
            }
        }

        List<BusinessData.PopupsBean> popupsBeans = getPopupsBeanList(mainWindow.getPopups(), event, before_event);
        if (popupsBeans != null) {
//            Collections.sort(popupsBeans);
            windowPopups.addAll(popupsBeans);
        }
        return windowPopups;
    }

    public void updateDayLimitCount(String key) {
        PopupsCache.getPopupsCache(key).update();
    }


    private List<BusinessData.PopupsBean> getPopupsBeanList(Map<String, Map<String, List<BusinessData.PopupsBean>>> map, String event, String before_event) {
        if (map != null && event != null) {
            Map<String, List<BusinessData.PopupsBean>> event_map = map.get(event);
            if (event_map != null) {
                return event_map.get(before_event);
            }
        }
        return null;
    }


    private BusinessData.MainWindowList getMainWindow(String window_key) {
        if (mBusinessData != null) {
            List<BusinessData.MainWindowList> mainWindowList = mBusinessData.getMainWindowList();
            if (mainWindowList != null) {
                for (BusinessData.MainWindowList windowList : mainWindowList) {
                    if (windowList.getWindowKey().equals(window_key)) {
                        return windowList;
                    }
                }
            }
        }
        return null;
    }

}
