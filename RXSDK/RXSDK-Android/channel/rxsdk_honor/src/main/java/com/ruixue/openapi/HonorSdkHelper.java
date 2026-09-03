package com.ruixue.openapi;

import android.content.Context;
import android.text.TextUtils;
import android.util.Log;

import com.hihonor.ads.identifier.AdvertisingIdClient;
import com.ruixue.RuiXueSdk;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/8/2
 */
public class HonorSdkHelper {

    public static void getOaid(Context context) {
        /**
         * 特别注意：必须在子线程中获取OAID信息
         */
        Thread getIdentifierThread = new Thread() {
            @Override
            public void run() {
                try {
                    AdvertisingIdClient.Info info = AdvertisingIdClient.getAdvertisingIdInfo(context.getApplicationContext());
                    if (null != info) {
                        if (!TextUtils.isEmpty(info.id))
                            RuiXueSdk.setOAID(info.id);
                        Log.i("rxsdk", "getAdvertisingIdInfo id=" + info.id + ", isLimitAdTrackingEnabled=" + info.isLimit);
                    }
                } catch (Exception e) {
                    Log.i("rxsdk", "getAdvertisingIdInfo Exception: " + e.toString());
                }
            }
        };
        getIdentifierThread.start();
    }
}
