package com.ruixue.demo.utils;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.LinkProperties;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;
import android.net.NetworkRequest;
import android.util.Log;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/2/27
 */
public class NetworkStatusCallback extends ConnectivityManager.NetworkCallback {
    private static final String TAG = "NetworkStatusCallback";

    private Context context;
    private ConnectivityManager manager;

    //      /** 初始化网络监听 */
    public static void registerNetworkCallback(Context context) {
//        ConnectivityManager connMgr = (ConnectivityManager) CommonUtils.getApp().getSystemService(Context.CONNECTIVITY_SERVICE);
//        if (connMgr != null) {
//            //这里只监听了WIFI和蜂窝网络，正常APP够用了，如果有其他要求，可以增加
//            NetworkRequest nr = new NetworkRequest.Builder()
//                    .addTransportType(NetworkCapabilities.TRANSPORT_WIFI)
//                    .addTransportType(NetworkCapabilities.TRANSPORT_CELLULAR)
//                    .build();
//            connMgr.registerNetworkCallback(nr, new NetworkStatusCallback(CommonUtils.getApp()));
//        }

        ConnectivityManager connMgr = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        if (connMgr != null) {
            NetworkRequest.Builder builder = new NetworkRequest.Builder();
            NetworkRequest request = builder.build();
            NetworkStatusCallback networkCallback = new NetworkStatusCallback(context);
            connMgr.registerNetworkCallback(request, networkCallback);
        }
    }

    public NetworkStatusCallback(Context context) {
        this.context = context;
        this.manager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
    }

    @Override
    public void onAvailable(Network network) {
        super.onAvailable(network);
        //调用判断 网络可用
        isNetworkEnable();
    }

    @Override
    public void onLosing(Network network, int maxMsToLive) {
        super.onLosing(network, maxMsToLive);
    }

    @Override
    public void onLost(Network network) {
        super.onLost(network);
        //调用判断 网络掉线
        isNetworkEnable();
    }

    @Override
    public void onUnavailable() {
        super.onUnavailable();
    }

    @Override
    public void onCapabilitiesChanged(Network network, NetworkCapabilities networkCapabilities) {
        super.onCapabilitiesChanged(network, networkCapabilities);
    }

    @Override
    public void onLinkPropertiesChanged(Network network, LinkProperties linkProperties) {
        super.onLinkPropertiesChanged(network, linkProperties);
    }

    /**
     * 为什么每次都要判断，原因是WIFI和蜂窝网络都可用时，如果只是断掉WIFI，也会调用onLoss方法，所以改为只判断当前可用的，无论是哪个
     */
    private void isNetworkEnable() {
        NetworkInfo active = manager.getActiveNetworkInfo();
        boolean result = null != active && active.getState() == NetworkInfo.State.CONNECTED;
        Log.i("调试信息", "网络连接状态: " + result + isConnected());
        //下面根据结果，发送事件或者做业务操作
        if (null != active && active.getState() == NetworkInfo.State.CONNECTED) {
//            ClusomModule.getInstance().login();
        } else {
//            ToastUtils.showShort("当前为离线状态,不可用");
        }
    }

    public boolean isConnected() {
        Network network = null;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            network = manager.getActiveNetwork();
            if (network != null) {
                NetworkCapabilities networkCapabilities = manager.getNetworkCapabilities(network);
                if (networkCapabilities != null && networkCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)) {
                    return true;
                } else if (networkCapabilities != null && networkCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) {
                    return true;
                }
            }
        } else {
            Network[] activeNetworks = manager.getAllNetworks();
            for (Network n : activeNetworks) {

                NetworkInfo nInfo = manager.getNetworkInfo(n);
                if (nInfo.isConnected()) {
                    NetworkCapabilities networkCapabilities = manager.getNetworkCapabilities(n);
                    if (networkCapabilities == null) {
                        Log.i("调试信息", "请打开网络");
                    } else if (networkCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)) {
                        Log.i("调试信息", "当前使用移动网络");
                    } else if (networkCapabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) {
                        Log.i("调试信息", "当前使用WIFI网络");
                    }
                    return true;
                }
            }
        }
        return false;

    }

}
