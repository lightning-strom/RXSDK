package com.ruixue.tencentdns;

import android.content.Context;
import android.util.Log;

import com.ruixue.RuiXueSdk;
import com.ruixue.dnsmanager.DNSIntercepterChain;
import com.ruixue.dnsmanager.DNSRequestUtill;
import com.ruixue.dnsmanager.SniSSLSocketFactory;
import com.ruixue.dnsmanager.bean.DNSRequestBean;
import com.ruixue.dnsmanager.bean.DNSResponseBean;
import com.tencent.msdk.dns.DnsConfig;
import com.tencent.msdk.dns.MSDKDnsResolver;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.UnknownHostException;
import java.util.Map;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLSession;

public class TencentDnsManager {

    public final static String TAG = TencentDnsManager.class.getName();

    private TencentDnsManager() {
        DNSIntercepterChain.getInstance().addInterceptor(new TencentHttpsSinInterceptor());
    }

    public static TencentDnsManager getInstance() {
        return TencentDnsManager.SingletonInternalClassHolder.INSTANCE;
    }

    private static class SingletonInternalClassHolder {
        private static final TencentDnsManager INSTANCE = new TencentDnsManager();
    }

    public void initAppID(Context context, String dnsID, String dnsKey, boolean isDebug) {
        DnsConfig.Builder dnsConfigBuilder = new DnsConfig.Builder()
                .dnsId(dnsID)
                .desHttp()
                .dnsKey(dnsKey);

        if (isDebug) {
            dnsConfigBuilder.logLevel(Log.VERBOSE);
        }

        DnsConfig dnsConfig = dnsConfigBuilder.build();
        MSDKDnsResolver.getInstance().init(context, dnsConfig);
    }

    public DNSResponseBean dnsSniRequest(DNSRequestBean requestBean) throws IOException {
        HttpURLConnection newConnection = null;
        try {
            newConnection = rebuildConnect(requestBean);
            if (newConnection == null) {
                throw new UnknownHostException("Tencent DNS Unable to resolve host " + requestBean.oldUrl + ": No address associated with hostname");
            }
            newConnection.setRequestProperty("Host", requestBean.oldUrl.getHost());
            newConnection.setInstanceFollowRedirects(false);
            if (newConnection instanceof HttpsURLConnection) {
                SniSSLSocketFactory sslSocketFactory = new SniSSLSocketFactory((HttpsURLConnection) newConnection);
                ((HttpsURLConnection) newConnection).setSSLSocketFactory(sslSocketFactory);
                HostnameVerifier hostnameVerifier = new HostnameVerifier() {
                    @Override
                    public boolean verify(String hostname, SSLSession session) {
                        return HttpsURLConnection.getDefaultHostnameVerifier().verify(requestBean.oldUrl.getHost(), session);
                    }
                };
                ((HttpsURLConnection) newConnection).setHostnameVerifier(hostnameVerifier);

            }
            return DNSRequestUtill.callResult(newConnection, requestBean.strData, requestBean.compress);
        } finally {
            if (newConnection != null) {
                newConnection.disconnect();
            }
        }
    }

    public DNSResponseBean dnsNoSniRequest(DNSRequestBean requestBean) throws IOException {
        HttpURLConnection newConnection = null;
        try {
            newConnection = rebuildConnect(requestBean);
            if (newConnection == null) {
                throw new UnknownHostException("");
            }
            newConnection.setRequestProperty("Host", requestBean.oldUrl.getHost());
            if (newConnection instanceof HttpsURLConnection) {
                HostnameVerifier hostnameVerifier = new HostnameVerifier() {
                    @Override
                    public boolean verify(String hostname, SSLSession session) {
                        return HttpsURLConnection.getDefaultHostnameVerifier().verify(requestBean.oldUrl.getHost(), session);
                    }
                };
                ((HttpsURLConnection) newConnection).setHostnameVerifier(hostnameVerifier);
            }
        return DNSRequestUtill.callResult(newConnection, requestBean.strData, requestBean.compress);
        } finally {
            if (newConnection != null) {
                newConnection.disconnect();
            }
        }
    }


    public HttpURLConnection rebuildConnect(DNSRequestBean requestBean) throws IOException {

        HttpURLConnection newConnection = null;

        String ips = MSDKDnsResolver.getInstance().getAddrByName(requestBean.oldUrl.getHost());
        String[] ipArr = ips.split(";");
        if (2 == ipArr.length && !"0".equals(ipArr[0])) { // 通过 HTTPDNS 获取 IP 成功，进行 URL 替换和 HOST 头设置
            String ip = ipArr[0];
            String newUrl = requestBean.oldUrl.toString().replaceFirst(requestBean.oldUrl.getHost(), ip);

            newConnection = DNSRequestUtill.createURLConnection(requestBean.method, newUrl, requestBean.connectTimeout, requestBean.readTimeout);

            if (requestBean.extraHeaders != null) {
                for (Map.Entry<String, String> entry : requestBean.extraHeaders.entrySet()) {
                    newConnection.setRequestProperty(entry.getKey(), entry.getValue());
                }
            }
        }

        return newConnection;

    }


}
