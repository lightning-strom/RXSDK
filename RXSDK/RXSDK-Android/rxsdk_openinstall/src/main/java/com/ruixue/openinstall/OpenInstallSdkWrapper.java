package com.ruixue.openinstall;


import android.content.ClipData;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.text.TextUtils;

import androidx.annotation.NonNull;

import com.ruixue.logger.RXLogger;
import com.ruixue.oi.api.Ruixue;
import com.ruixue.oi.api.listener.AppInstallAdapter;
import com.ruixue.oi.api.listener.AppWakeUpAdapter;
import com.ruixue.oi.api.model.AppData;
import com.ruixue.reflect.OpenInstallManager;
import com.ruixue.utils.ClipboardUtils;

import org.json.JSONObject;

import java.util.Map;

// Created by wangliang on 2025/11/17.
public class OpenInstallSdkWrapper {
    static class Single {
        final static OpenInstallSdkWrapper INSTANCE = new OpenInstallSdkWrapper();
    }

    private OpenInstallSdkWrapper() {

    }

    @NonNull
    public static OpenInstallSdkWrapper getInstance() {
        return Single.INSTANCE;
    }


    private SharedPreferences sp;
    private static final String OPEN_INSTALL_SP_NAME = "openinstall";
    private static final String KEY_APP_DATA = "app_data";

    public void initClipData(Context context) {
        String clipStr = ClipboardUtils.getString(context);
        if (clipStr.isEmpty()) {
            return;
        }
        RXLogger.d("initClipData >> " + clipStr);
        String oi = getOi(clipStr);
        if (TextUtils.isEmpty(oi)) {
            return;
        }

        RXLogger.d("initClipData oi >> " + oi);
        ClipData clipData = ClipData.newPlainText("track_data", oi);
        Ruixue.setTrackData(clipData);
    }

    private static String getOi(String query) {
        if (query == null || query.isEmpty()) return null;
        try {
            String[] pairs = query.split("&");
            for (String pair : pairs) {
                int idx = pair.indexOf('=');
                if (idx > 0 && idx < pair.length() - 1) {
                    String key = pair.substring(0, idx);
                    if ("oi".equals(key)) {
                        return pair.substring(idx + 1);
                    }
                }
            }
        } catch (Exception ignore) {
        }
        return null;
    }

    public void setServerDomain(String domain) {
        Ruixue.setServerDomain(domain);
    }

    public void preInit(Context context) {
        sp = context.getApplicationContext().getSharedPreferences(OPEN_INSTALL_SP_NAME, Context.MODE_PRIVATE);
        Ruixue.preInit(context);
    }

    private void setAppDataUsed(Map<String, Object> data) {
        try {
            if (data != null && data.containsKey("click_time")) {
                Object clickTimeObj = data.get("click_time");

                long clickTime = 0L;
                if (clickTimeObj instanceof Long) {
                    clickTime = (Long) clickTimeObj;
                } else if (clickTimeObj instanceof Integer) {
                    clickTime = (Integer) clickTimeObj;
                }
                RXLogger.d("OpenInstall setAppDataUsed : " + clickTime);
                sp.edit().putLong(KEY_APP_DATA, clickTime).apply();
            }
        } catch (Exception e) {
            RXLogger.d("OpenInstall setAppDataUsed error");
            e.printStackTrace();
        }
    }

    private boolean isAppDataUsed(AppData appData) {
        try {
            if (appData == null || appData.getData().isEmpty()) {
                return false;
            }
            if (sp == null) {
                return false;
            }
            JSONObject json = new JSONObject(appData.getData());
            long clickTime = json.optLong("click_time");
            if (clickTime != 0) {
                long spClickTime = sp.getLong(KEY_APP_DATA, 0L);
                RXLogger.d("OpenInstall current clickTime : " + clickTime + ", spClickTime:" + spClickTime);
                return clickTime <= spClickTime;
            }
        } catch (Exception e) {
            RXLogger.d("OpenInstall getAppData error");
            e.printStackTrace();
        }
        return false;
    }

    private boolean inited = false;

    /**
     * 调用初始化时请注意：
     * 1、首次启动，确保用户同意《隐私政策》之后，再初始化openinstall SDK；
     * 2、仅在主进程的UI线程中调用初始化接口，多进程调用将会导致获取参数失败，统计数据异常；
     * 3、初始化调用时，尽量保证应用处于前台可触控状态下，对提升参数还原精度有很大的帮助。
     */
    public void init(Context context) {
        Ruixue.init(context);
        inited = true;
    }

    private AppWakeUpAdapter wakeUpAdapter;

    public void getWakeUp(Intent intent) {
        RXLogger.d("OpenInstall getWakeUp");
        if (!inited) {
            RXLogger.d("OpenInstall not inited, so do nothing");
            return;
        }
        if (wakeUpAdapter == null) {
            wakeUpAdapter = new AppWakeUpAdapter() {
                @Override
                public void onWakeUp(@NonNull AppData appData) {
                    if (isAppDataUsed(appData)) {
                        RXLogger.d("OpenInstall onWakeUp : appData has used, appData channel:" + appData.getChannel() + ", appdata:" + appData.getData());
                        return;
                    }

                    //获取渠道数据
                    String channelCode = appData.getChannel();
                    //获取绑定数据
                    String bindData = appData.getData();
                    RXLogger.d("OpenInstall onWakeUp : wakeupData = " + channelCode + ", data:" + bindData);
                    OpenInstallManager.setAppData(channelCode, bindData);
                    setAppDataUsed(OpenInstallManager.getAppData());
                }
            };
        }
        Ruixue.getWakeUp(intent, wakeUpAdapter);
    }

    /*
      获取安装参数时请注意
      1. 不要在初始化之后，紧接着调用，容易导致获取数据失败；
      2. 在业务需要时再获取数据，保证SDK有充足的时间进行数据还原；
      3. 不要在返回AppData为空时，尝试使用此api进行重试获取数据。
     */
    public void getInstall() {
        RXLogger.d("OpenInstall getInstall");
        if (!inited) {
            RXLogger.d("OpenInstall not inited, so do nothing");
            return;
        }
        Ruixue.getInstall(new AppInstallAdapter() {
            @Override
            public void onInstall(@NonNull AppData appData) {
                if (isAppDataUsed(appData)) {
                    RXLogger.d("OpenInstall onInstall : appData has used, appData channel:" + appData.getChannel() + ", appdata:" + appData);
                    return;
                }
                //获取渠道数据
                String channelCode = appData.getChannel();
                //获取自定义数据
                String bindData = appData.getData();
                OpenInstallManager.setAppData(channelCode, bindData);
                RXLogger.d("OpenInstall onInstall : installData = " + appData.toString());
                setAppDataUsed(OpenInstallManager.getAppData());
            }
        });
    }

    public void onActivityDestroy() {
        wakeUpAdapter = null;
    }
}
