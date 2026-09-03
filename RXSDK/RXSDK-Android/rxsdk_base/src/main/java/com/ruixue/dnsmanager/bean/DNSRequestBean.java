package com.ruixue.dnsmanager.bean;

import android.content.Context;

import java.io.IOException;
import java.net.URL;
import java.util.Map;

public class DNSRequestBean {

    public Context context;
    public URL oldUrl;
    public String method;
    public int connectTimeout;
    public int readTimeout;
    public String strData;
    public Map<String, String> extraHeaders;
    public boolean compress;
    public IOException lastException;

}
