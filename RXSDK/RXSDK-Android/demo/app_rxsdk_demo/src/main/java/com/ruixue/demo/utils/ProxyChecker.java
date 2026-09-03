package com.ruixue.demo.utils;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.ProxyInfo;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.text.TextUtils;

import com.ruixue.logger.RXLogger;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2024/11/29
 */
public class ProxyChecker {


    public static boolean isProxySet() {
        String proxyHost = System.getProperty("http.proxyHost");
        String proxyPort = System.getProperty("http.proxyPort");
        int proxyPortN = 0;
        if (!TextUtils.isEmpty(proxyPort)) {
            proxyPortN = Integer.parseInt(proxyPort);
        }
        RXLogger.d("ProxyUtil", "地址:" + proxyHost + " 端口：" + proxyPort);
        boolean wifiProxy = !TextUtils.isEmpty(proxyHost) && proxyPortN != 0;

        // 检查是否配置了代理
        return proxyHost != null && !proxyHost.isEmpty() && proxyPort != null;
    }

    public static boolean isWifiProxySet(Context context) {
        ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm != null) {
            ProxyInfo proxyInfo = null;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                proxyInfo = cm.getDefaultProxy();
            }
            if (proxyInfo != null) {
                String host = proxyInfo.getHost();
                int port = proxyInfo.getPort();
                // 检查代理主机和端口是否存在
                RXLogger.d("proxy:" + proxyInfo.toString());

                return host != null && port != 0;
            }
        }
        return false;
    }

//    public static void getProxyDetails(Context context) {
//        WifiManager wifiManager = (WifiManager) context.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
//        if (wifiManager != null) {
//            ProxyInfo proxyInfo = wifiManager.getConnectionInfo().ge;
//            if (proxyInfo != null) {
//                System.out.println("Proxy Host: " + proxyInfo.getHost());
//                System.out.println("Proxy Port: " + proxyInfo.getPort());
//            } else {
//                System.out.println("No Proxy configured for Wi-Fi.");
//            }
//        } else {
//            System.out.println("Wi-Fi Manager is not available.");
//        }
//    }
}
