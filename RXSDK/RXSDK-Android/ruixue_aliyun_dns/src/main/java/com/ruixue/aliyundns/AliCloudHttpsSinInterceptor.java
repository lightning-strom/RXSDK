package com.ruixue.aliyundns;

import android.util.Log;

import com.ruixue.dnsmanager.BaseDNSInterceptorImpl;
import com.ruixue.dnsmanager.DNSIntercepterChain;
import com.ruixue.dnsmanager.bean.DNSRequestBean;
import com.ruixue.dnsmanager.bean.DNSResponseBean;

import java.io.IOException;
import java.net.URL;

public class AliCloudHttpsSinInterceptor extends BaseDNSInterceptorImpl {

    @Override
    public DNSResponseBean intercept(DNSIntercepterChain chain, DNSRequestBean requestBean) {
        Log.d("handlednstransform",
                "AliCloudHttpsSinIntercepter 拦截器, currentThread: " + Thread.currentThread().getName());

        URL mOldUrl = requestBean.oldUrl;
        try {
            DNSResponseBean result = AliCloudDnsManager.getInstance()
                    .dnsSniRequest(requestBean);

            if (result.responseCode >= 300 && result.responseCode < 400) {
                String location = result.location;
                if (location != null) {
                    if (!(location.startsWith("http://") || location
                            .startsWith("https://"))) {
                        //某些时候会省略host，只返回后面的path，所以需要补全url
                        URL originalUrl = new URL(requestBean.oldUrl.toString());
                        location = originalUrl.getProtocol() + "://"
                                + originalUrl.getHost() + location;
                        requestBean.oldUrl = new URL(location);
                    }

                    result = AliCloudDnsManager.getInstance()
                            .dnsSniRequest(requestBean);
                    return result;
                }
            }else {
                return result;
            }

        } catch (IOException e) {
            requestBean.oldUrl = mOldUrl;
            requestBean.lastException = e;
            chain.process(requestBean);
        }
        return null;
    }

}
