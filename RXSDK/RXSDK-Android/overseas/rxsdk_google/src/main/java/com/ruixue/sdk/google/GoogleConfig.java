package com.ruixue.sdk.google;

import android.content.Context;
import android.text.TextUtils;

import com.ruixue.RuiXueSdk;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXGlobalData;

import java.util.Map;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/7
 */
public class GoogleConfig {
    private String google_clientid;

    public static GoogleConfig fromMap(Map<String, Object> map) {
        return new GoogleConfig(map);
    }

    public GoogleConfig(Map<String, Object> map) {
        // 其次：init 参数中的 clientId（rxconfig.json ext.clientId）
        if (map != null) {
            this.google_clientid = (String) map.get("clientId");
            if (TextUtils.isEmpty(this.google_clientid)) {
                this.google_clientid = (String) map.get("google_clientid");
            }
        }
        // 最后：RXGlobalData 全局值（服务端下发或手动设置）
        if (TextUtils.isEmpty(this.google_clientid)) {
            this.google_clientid = RXGlobalData.getGoogleClientId();
        }

        if (TextUtils.isEmpty(this.google_clientid)) {
            // 本地 R.string.google_client_id（build.gradle resValue 配置）
            String localResClientId = getLocalResClientId();
            if (!TextUtils.isEmpty(localResClientId)) {
                this.google_clientid = localResClientId;
            }
        }
    }

    private static String getLocalResClientId() {
        try {
            Context ctx = RuiXueSdk.getContext();
            if (ctx != null) {
                int resId = ctx.getResources().getIdentifier(
                        "google_client_id", "string", ctx.getPackageName());
                if (resId != 0) {
                    return ctx.getString(resId);
                }
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    public String getServerClientId() {
        return google_clientid;
    }

    /**
     * Validates that there is a reasonable server client ID i
     * to make sure users of this sample follow the README.
     */
    public boolean checkParams() {
        String suffix = ".apps.googleusercontent.com";
        if (TextUtils.isEmpty(getServerClientId()) || !getServerClientId().trim().endsWith(suffix)) {
            String message = "Invalid server client ID , must not null and end with " + suffix;
            RXLogger.e(message);
            return false;
        } else
            return true;
    }
}
