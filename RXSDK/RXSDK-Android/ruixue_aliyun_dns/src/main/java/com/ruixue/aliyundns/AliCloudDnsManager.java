package com.ruixue.aliyundns;

import android.content.Context;

import com.alibaba.sdk.android.httpdns.HTTPDNSResult;
import com.alibaba.sdk.android.httpdns.HttpDns;
import com.alibaba.sdk.android.httpdns.HttpDnsService;
import com.alibaba.sdk.android.httpdns.InitConfig;
import com.alibaba.sdk.android.httpdns.Region;
import com.alibaba.sdk.android.httpdns.RequestIpType;
import com.alibaba.sdk.android.httpdns.log.HttpDnsLog;
import com.ruixue.RuiXueSdk;
import com.ruixue.dnsmanager.DNSIntercepterChain;
import com.ruixue.dnsmanager.DNSRequestUtill;
import com.ruixue.dnsmanager.SniSSLSocketFactory;
import com.ruixue.dnsmanager.bean.DNSRequestBean;
import com.ruixue.dnsmanager.bean.DNSResponseBean;
import com.ruixue.logger.Logger;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.UnknownHostException;
import java.util.Map;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLSession;

public class AliCloudDnsManager {

    private static HttpDnsService httpdns;
    private Region region = Region.DEFAULT;

    private AliCloudDnsManager() {
        DNSIntercepterChain.getInstance().addInterceptor(new AliCloudHttpsSinInterceptor());

    }

    public static AliCloudDnsManager getInstance() {
        return AliCloudDnsManager.SingletonInternalClassHolder.INSTANCE;
    }

    private static class SingletonInternalClassHolder {
        private static final AliCloudDnsManager INSTANCE = new AliCloudDnsManager();
    }

    public void initAppID(Context context, String accountID, String secretKey, boolean isDebug, Region region) {
        new InitConfig.Builder()
                // 配置是否启用https，默认http
                .setEnableHttps(true).setRegion(region).buildFor(accountID);
        HttpDnsLog.enable(isDebug);
        httpdns = HttpDns.getService(context, accountID, secretKey);
    }

    public void setRegion(String region) {
        try {
            this.region = Region.valueOf(region.toUpperCase());
        } catch (IllegalArgumentException | NullPointerException ignore) {
            Logger.e("setRegion error:" + ignore.getMessage());
        }
    }


    public void initAppID(Context context,String accountID, String secretKey, boolean isDebug) {
        new InitConfig.Builder()
                // 配置是否启用https，默认http
                .setEnableHttps(true).setRegion(this.region).buildFor(accountID);

        HttpDnsLog.enable(isDebug);
        httpdns = HttpDns.getService(context, accountID, secretKey);
    }

    public DNSResponseBean dnsSniRequest(DNSRequestBean requestBean) throws IOException {
        HttpURLConnection newConnection = null;
        try {
            newConnection = rebuildConnect(requestBean);
            if (newConnection == null) {
                throw new UnknownHostException("Ali DNS Unable to resolve host " + requestBean.oldUrl + ": No address associated with hostname");
            }
            newConnection.setInstanceFollowRedirects(false);
            newConnection.setRequestProperty("Host", requestBean.oldUrl.getHost());
            if (newConnection instanceof HttpsURLConnection) {
                final HttpsURLConnection httpsURLConnection = (HttpsURLConnection) newConnection;
                // https场景，证书校验
                httpsURLConnection.setHostnameVerifier(new HostnameVerifier() {
                    @Override
                    public boolean verify(String hostname, SSLSession session) {
                        String host = httpsURLConnection.getRequestProperty("Host");
                        if (null == host) {
                            host = httpsURLConnection.getURL().getHost();
                        }
                        return HttpsURLConnection.getDefaultHostnameVerifier().verify(host, session);
                    }
                });
                // sni场景，创建SSLScocket
                httpsURLConnection.setSSLSocketFactory(new SniSSLSocketFactory(httpsURLConnection));
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
        URL oldUrl = requestBean.oldUrl;
        HTTPDNSResult httpdnsResult = httpdns.getHttpDnsResultForHostSync(oldUrl.getHost(), RequestIpType.both);

        String ip = null;
        if (httpdnsResult.getIps() != null && httpdnsResult.getIps().length > 0) {
            ip = httpdnsResult.getIps()[0];
        } else if (httpdnsResult.getIpv6s() != null && httpdnsResult.getIpv6s().length > 0) {
            ip = httpdnsResult.getIpv6s()[0];
        }

        if (ip != null) {
            String newUrl = oldUrl.toString().replaceFirst(oldUrl.getHost(), ip);
            String oldMethod = requestBean.method;
            newConnection = DNSRequestUtill.createURLConnection(oldMethod, newUrl, requestBean.connectTimeout, requestBean.readTimeout);
            if (requestBean.extraHeaders != null) {
                for (Map.Entry<String, String> entry : requestBean.extraHeaders.entrySet()) {
                    newConnection.setRequestProperty(entry.getKey(), entry.getValue());
                }
            }
        }

        return newConnection;

    }

}
