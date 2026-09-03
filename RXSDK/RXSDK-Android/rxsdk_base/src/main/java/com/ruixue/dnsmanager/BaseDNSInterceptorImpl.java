package com.ruixue.dnsmanager;

import com.ruixue.dnsmanager.bean.DNSRequestBean;
import com.ruixue.dnsmanager.bean.DNSResponseBean;

public abstract class BaseDNSInterceptorImpl implements Intercepter {

    protected DNSIntercepterChain mChain;
    @Override
    public abstract DNSResponseBean intercept(DNSIntercepterChain chain, DNSRequestBean requestBean);
}
