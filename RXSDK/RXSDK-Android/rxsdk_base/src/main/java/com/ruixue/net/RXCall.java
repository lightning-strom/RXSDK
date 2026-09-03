package com.ruixue.net;

import com.ruixue.callback.RXCallback;

import java.io.IOException;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/11/17
 */
public interface RXCall extends Cloneable {

    RXRequest request();

    RXResponse execute() throws IOException;

    void enqueue(RXCallback responseCallback);

    interface Factory {
        RXCall newCall(RXRequest request);
    }
}
