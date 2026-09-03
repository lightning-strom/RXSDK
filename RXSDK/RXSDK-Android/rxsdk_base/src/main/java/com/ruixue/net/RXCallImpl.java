package com.ruixue.net;

import com.ruixue.callback.RXCallback;

import java.io.IOException;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/11/17
 */
public class RXCallImpl implements RXCall {
    final RXHttpClient client;
    final RXRequest originalRequest;

    private RXCallImpl(RXHttpClient client, RXRequest originalRequest ) {
        this.client = client;
        this.originalRequest = originalRequest;
//        this.forWebSocket = forWebSocket;
//        this.retryAndFollowUpInterceptor = new RetryAndFollowUpInterceptor(client, forWebSocket);

    }

    static RXCallImpl newRXCall(RXHttpClient client, RXRequest originalRequest ) {
        // Safely publish the Call instance to the EventListener.
        RXCallImpl call = new RXCallImpl(client, originalRequest );
//    call.eventListener = client.eventListenerFactory().create(call);
        return call;
    }


    @Override
    public RXRequest request() {
        return originalRequest;
    }

    @Override
    public RXResponse execute() throws IOException {


        return null;
    }

    @Override
    public void enqueue(RXCallback responseCallback) {

    }
}
