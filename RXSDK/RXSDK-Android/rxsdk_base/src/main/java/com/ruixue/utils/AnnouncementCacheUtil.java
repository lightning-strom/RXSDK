package com.ruixue.utils;

import static android.content.Context.MODE_PRIVATE;

import android.content.SharedPreferences;
import android.text.TextUtils;
import android.util.Log;

import com.ruixue.RXRequestCallback;
import com.ruixue.RuiXueSdk;

import org.json.JSONObject;

public class AnnouncementCacheUtil {

    public static void getAnnouncement() {
        RuiXueSdk.getRXSdkApi().getAnnouncement(100, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject jsonObject) {
                ThreadUtils.getInstance().runOnBgThread(new Runnable() {
                    @Override
                    public void run() {
                        if (jsonObject.optInt("code") == 0) {
                            Log.d("TrackDataMgr", "公告列表: " + jsonObject.toString());

                            SharedPreferences sharedPreferences = RuiXueSdk.getContext()
                                    .getSharedPreferences("rx_announcement_list", MODE_PRIVATE);
                            String announcementList = sharedPreferences.getString("announcement_list", "");
                            if (!TextUtils.isEmpty(announcementList)) {
                                sharedPreferences.edit().clear().commit();
                            }
                            sharedPreferences.edit().putString("announcement_list", jsonObject.toString()).apply();
                        }
                    }
                });
            }
        });
    }

}
