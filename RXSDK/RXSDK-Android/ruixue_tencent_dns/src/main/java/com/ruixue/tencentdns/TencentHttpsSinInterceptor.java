package com.ruixue.tencentdns;

import android.util.Log;

import com.ruixue.dnsmanager.BaseDNSInterceptorImpl;
import com.ruixue.dnsmanager.DNSIntercepterChain;
import com.ruixue.dnsmanager.bean.DNSRequestBean;
import com.ruixue.dnsmanager.bean.DNSResponseBean;
import java.io.IOException;

public class TencentHttpsSinInterceptor extends BaseDNSInterceptorImpl {
    @Override
    public DNSResponseBean intercept(DNSIntercepterChain chain, DNSRequestBean requestBean) {

        Log.d("handlednstransform",
                "TencentHttpsSinInterceptor 拦截器, currentThread: " + Thread.currentThread().getName());

        try {
            return TencentDnsManager.getInstance()
                    .dnsSniRequest(requestBean);
        } catch (IOException e) {
            requestBean.lastException = e;
            chain.process(requestBean);
        }

        return null;

    }
}
