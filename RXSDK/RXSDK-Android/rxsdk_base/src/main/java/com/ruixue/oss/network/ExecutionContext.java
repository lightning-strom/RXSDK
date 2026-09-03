package com.ruixue.oss.network;

import android.content.Context;

import com.ruixue.oss.callback.OSSCompletedCallback;
import com.ruixue.oss.callback.OSSProgressCallback;
import com.ruixue.oss.callback.OSSRetryCallback;
import com.ruixue.oss.model.OSSRequest;
import com.ruixue.oss.model.OSSResult;

import okhttp3.OkHttpClient;

/**
 * Created by zhouzhuo on 11/22/15.
 */
@SuppressWarnings("unchecked")
public class ExecutionContext<Request extends OSSRequest, Result extends OSSResult> {

    private Request request;
    private OkHttpClient client;
    private CancellationHandler cancellationHandler = new CancellationHandler();
    private Context applicationContext;

    private OSSCompletedCallback completedCallback;
    private OSSProgressCallback progressCallback;
    private OSSRetryCallback retryCallback;


    public ExecutionContext(OkHttpClient client, Request request) {
        this(client, request, null);
    }

    public ExecutionContext(OkHttpClient client, Request request, Context applicationContext) {
        setClient(client);
        setRequest(request);
        this.applicationContext = applicationContext;
    }

    public Context getApplicationContext() {
        return applicationContext;
    }

    public Request getRequest() {
        return request;
    }

    public void setRequest(Request request) {
        this.request = request;
    }

    public OkHttpClient getClient() {
        return client;
    }

    public void setClient(OkHttpClient client) {
        this.client = client;
    }

    public CancellationHandler getCancellationHandler() {
        return cancellationHandler;
    }

        @SuppressWarnings("unchecked")
    public OSSCompletedCallback<Request, Result> getCompletedCallback() {
        return completedCallback;
    }

    public void setCompletedCallback(OSSCompletedCallback<Request, Result> completedCallback) {
        this.completedCallback = completedCallback;
    }

    public OSSProgressCallback getProgressCallback() {
        return progressCallback;
    }

    public void setProgressCallback(OSSProgressCallback progressCallback) {
        this.progressCallback = progressCallback;
    }

    public OSSRetryCallback getRetryCallback() {
        return retryCallback;
    }

    public void setRetryCallback(OSSRetryCallback retryCallback) {
        this.retryCallback = retryCallback;
    }
}
