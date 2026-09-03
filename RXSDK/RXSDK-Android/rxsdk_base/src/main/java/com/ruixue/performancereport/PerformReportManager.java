package com.ruixue.performancereport;

import android.os.Handler;
import android.os.HandlerThread;
import android.text.TextUtils;
import android.util.Log;

import com.ruixue.base.TrackDataMgr;
import com.ruixue.logger.Logger;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.utils.JSONUtil;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

public class PerformReportManager {

    public static final String TAG = PerformReportManager.class.getName();
    private Class<?> PerformClass = null;
    HandlerThread mRxhandlerThread = new HandlerThread("rxhandler");
    private final Handler mRxhandler;
    HandlerThread mUWAhandlerThread = new HandlerThread("uwahandler");
    private final Handler mUWAhandler;
    private volatile boolean isRxHandling = false;
    private volatile boolean isGPMHandling = false;
    public final HashMap<String, Object> userUWAInfo = new HashMap<>();
    public final HashMap<String, Object> userRXInfo = new HashMap<>();
    private static final HashSet<String> USER_INFO_SET = new HashSet<>();
    private volatile PerformUnityCallBack performUnityCallBack = null;

    private PerformReportManager() {
        mRxhandlerThread.start();
        mRxhandler = new Handler(mRxhandlerThread.getLooper());
        mUWAhandlerThread.start();
        mUWAhandler = new Handler(mUWAhandlerThread.getLooper());
        try {
            PerformClass = Class.forName(SDK_PERFORM_CLASS);
        } catch (Exception e) {
//            e.printStackTrace();
            Logger.w("PerformReportManager:" + e.getMessage());
        }
        USER_INFO_SET.add("DEVICE_MODEL");
        USER_INFO_SET.add("SYSTEM");
        USER_INFO_SET.add("RESOLUTION");
        USER_INFO_SET.add("EMULATOR");
        USER_INFO_SET.add("ROOT");
        USER_INFO_SET.add("CPU_CORE");
        USER_INFO_SET.add("GPU_MODEL");
        USER_INFO_SET.add("RAM_MB");
        USER_INFO_SET.add("ROM_GB");
        USER_INFO_SET.add("DEVICE_ID");
        USER_INFO_SET.add("GRAPHIC_API");
    }

    public static PerformReportManager getInstance() {
        return PerformReportManager.SingletonInternalClassHolder.INSTANCE;
    }

    private static class SingletonInternalClassHolder {
        private static final PerformReportManager INSTANCE = new PerformReportManager();
    }

    private static final String SDK_PERFORM_CLASS = "com.ruixue.rxsdk_performance.BuildPerformanceInfo";

    public void report(PerformUnityCallBack callBack) {

        this.performUnityCallBack = callBack;

        if (isGPMHandling) {
            Log.d(TAG, "性能数据上报已开启, 无需重复调用");
            return;
        }
        int time = RXGlobalData.getPerformReportUwaTs();
        if (time <= 0) {
            Log.d(TAG, "服务端上报开关关闭");
            return;
        }
        String type = RXGlobalData.getPerformReportType();
        if ("uwa".equals(type) || "both".equals(type)) {
            try {
                uwaReport(callBack, time * 1000);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            Log.d(TAG, "当前上报开关开启类型：" + type);
        }
    }

    public void reportRx() {
        if (isRxHandling) {
            Log.d(TAG, "性能数据上报已开启, 无需重复调用");
            return;
        }
        if (PerformClass == null) {
            Log.d(TAG, "没有引入性能上报SDK");
            return;
        }
        int time = RXGlobalData.getPerformReportSdkTs();
        if (time <= 0) {
            Log.d(TAG, "服务端上报开关关闭");
            return;
        }
        String type = RXGlobalData.getPerformReportType();
        if ("sdk".equals(type) || "both".equals(type)) {
            try {
                sdkReport(time * 1000);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            Log.d(TAG, "当前上报开关开启类型：" + type);
        }

    }

    private void sdkReport(int time) {
        if (mRxhandler == null) {
            return;
        }
        isRxHandling = true;
        mRxhandler.post(new Runnable() {
            @Override
            public void run() {
                Log.d(TAG, "mRxhandler 当前线程：" + Thread.currentThread().getName());
                PerformanceCallBack performanceCallBack = new PerformanceCallBack() {
                    @Override
                    public void onPerformanceMap(HashMap<String, Object> map) {
                        if (map != null) {
                            HashMap<String, Object> resMap = splitInfoMap(map, "rx");
                            TrackDataMgr.getInstance().trackAtTimeAsync("#rx_gpm", resMap);
                        }
                    }
                };
                if (PerformClass == null) {
                    return;
                }
                try {
                    Method method = PerformClass.getMethod(
                            "buildInfo", PerformanceCallBack.class
                    );
                    method.invoke(null, performanceCallBack);
                } catch (Exception e) {
                    Log.d(TAG, "没有找到瑞雪性能分析 SDK");
                    e.printStackTrace();
                }
                mRxhandler.postDelayed(this, time);
            }
        });
    }

    private void uwaReport(PerformUnityCallBack callBack, int time) {
        if (mUWAhandler == null) {
            return;
        }
        isGPMHandling = true;
        mUWAhandler.post(new Runnable() {
            @Override
            public void run() {
                Log.d(TAG, "mUWAhandler 当前线程：" + Thread.currentThread().getName());
                String response = callBack.onResponseCallback();
                if (!TextUtils.isEmpty(response)) {
                    Map<String, Object> info = JSONUtil.toMap(response);
                    if (info != null) {
                        HashMap<String, Object> resMap = splitInfoMap(info, "uwa");
                        TrackDataMgr.getInstance().trackAtTimeAsync("#uwa_gpm", resMap);
                    }
                }
                mUWAhandler.postDelayed(this, time);
            }
        });
    }

    private HashMap<String, Object> splitInfoMap(Map<String, Object> info, String type) {
        HashMap<String, Object> performMap = new HashMap<>();
        for (Map.Entry<String, Object> entry : info.entrySet()) {
            System.out.println("Key = " + entry.getKey() + ", Value = " + entry.getValue());
            String key = entry.getKey();
            Object value = entry.getValue();
            if (USER_INFO_SET.contains(key)) {
                if ("rx".equals(type)) {
                    userRXInfo.put(key, value);
                } else {
                    userUWAInfo.put(key, value);
                }
            } else {
                performMap.put(entry.getKey(), entry.getValue());
            }
        }
        return performMap;
    }

    public Map<String, Object> buildGPMParameter(String eventName) {
        if ("#rx_gpm".equals(eventName) || "#uwa_gpm".equals(eventName)) {
            RXLogger.d("gpm report, return null");
            return null;
        }
        if (performUnityCallBack != null) {
            String response = performUnityCallBack.onResponseCallback();
            if (!TextUtils.isEmpty(response)) {
                Map<String, Object> info = JSONUtil.toMap(response);
                Map<String, Object> resMap = new HashMap<>();
                if (info != null) {
                    for (Map.Entry<String, Object> entry : info.entrySet()) {
                        if (!PerformReportManager.USER_INFO_SET.contains(entry.getKey())) {
                            resMap.put(entry.getKey(), entry.getValue());
                        }
                    }
                }
                return resMap;
            }
        }
        RXLogger.d("uwa lib does not exist, return null");
        return null;
    }

}
