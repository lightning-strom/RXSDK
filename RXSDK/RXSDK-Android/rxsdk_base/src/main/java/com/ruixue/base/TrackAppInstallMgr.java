package com.ruixue.base;

import android.content.Context;
import android.util.Log;

import com.ruixue.utils.ThreadUtils;

import org.json.JSONArray;
import org.json.JSONObject;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

public class TrackAppInstallMgr {

    private static final String TRACK_CLASS = "com.haiqi.rxsdk_install_appinfo.InstalledAppsFinder";

    public static void trackApp(Context context, JSONObject data) {
        ThreadUtils.getInstance().execute(new Runnable() {
            @Override
            public void run() {
                try {
                    int ts = data.optInt("ts");
                    JSONArray info = data.optJSONArray("in");
                    if (info != null) {
                        List<String> infoList = new ArrayList<>();
                        for (int i = 0; i < info.length(); i++) {
                            infoList.add(info.get(i).toString());
                        }
                        Class<?> TrackAppListClass =
                                Class.forName(TRACK_CLASS);

                        Method method = TrackAppListClass.getMethod(
                                "findInstalledApps", Context.class, int.class, List.class
                        );

                        method.invoke(null, context, ts, infoList);

                    }
                } catch (Exception e) {
                    Log.d("ap_info_track", "not api rxsdk_install_appinfo library " + e.getMessage());
                }
            }
        });
    }

}
