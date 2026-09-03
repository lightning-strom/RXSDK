package com.ruixue.dnsmanager;

import android.util.Log;
import com.ruixue.dnsmanager.bean.DNSRequestBean;
import com.ruixue.dnsmanager.bean.DNSResponseBean;
import java.util.ArrayList;
import java.util.List;

public class DNSIntercepterChain {

    public volatile int index = 0;
    private volatile DNSResponseBean mFinalResponseBean = null;

    private final List<Intercepter> intercepters = new ArrayList<>();

    private DNSIntercepterChain() {

    }

    public void addInterceptor(BaseDNSInterceptorImpl interceptor) {
        intercepters.add(interceptor);
    }

    public void addInterceptor(BaseDNSInterceptorImpl interceptor, int index) {
        intercepters.add(index, interceptor);
    }

    public int getInterceptorSize() {
        return intercepters.size();
    }

    public static DNSIntercepterChain getInstance() {
        return SingletonInternalClassHolder.INSTANCE;
    }

    private static class SingletonInternalClassHolder {
        private static final DNSIntercepterChain INSTANCE = new DNSIntercepterChain();
    }

    public DNSResponseBean startProcess(DNSRequestBean requestBean) {
        clearIndex();
        Log.d("handlednstransform", "DNSIntercepterChain 开始执行");
        process(requestBean);
        return mFinalResponseBean;
    }


    public synchronized void process(DNSRequestBean requestBean) {
        if (intercepters.isEmpty()) {
            return;
        }
        if (index >= intercepters.size()) {
            DNSResponseBean responseBean = new DNSResponseBean();
            responseBean.responseCode = -1;
            responseBean.currentException = requestBean.lastException;
            this.mFinalResponseBean = responseBean;
            return;
        }
        Intercepter interceptor = intercepters.get(index++);
        DNSResponseBean responseBean =  interceptor.intercept(this, requestBean);

        if (responseBean != null) {
            this.mFinalResponseBean = responseBean;
        }

    }

    private void clearIndex() {
        index = 0;
    }



}
