package com.ruixue.utils;


import android.text.TextUtils;

import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXGlobalData;

import java.util.Map;

/**
 * 内部版本检查使用，SDK 外部慎用
 * <p>
 * Created by wangliang on 2025/4/15.
 */
public class VersionLoginConfigUtils {

    public static void addLoginConfigs4DataTrack(Map<String, Object> body) {
        try {
            if (body != null) {
                if (!TextUtils.isEmpty(RXGlobalData.getGameRoleId())) {
                    body.put("#role_id", RXGlobalData.getGameRoleId());
                }
                if (!TextUtils.isEmpty(RXGlobalData.getGameRegionTag())) {
                    body.put("rx_region_tag", RXGlobalData.getGameRegionTag());
                }
            }
        } catch (Exception e) {
            RXLogger.i("VersionLoginConfigUtils addLoginConfigs4DataTrack " + e.getMessage());
        }
    }
}
