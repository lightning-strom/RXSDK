package com.ruixue.dnsmanager;


import com.ruixue.dnsmanager.bean.DNSRequestBean;
import com.ruixue.dnsmanager.bean.DNSResponseBean;

import java.io.IOException;

public interface Intercepter {
    DNSResponseBean intercept(DNSIntercepterChain chain, DNSRequestBean requestBean);
}
