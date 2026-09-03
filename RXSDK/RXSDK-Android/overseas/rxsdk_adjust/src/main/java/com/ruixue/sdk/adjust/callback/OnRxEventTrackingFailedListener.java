package com.ruixue.sdk.adjust.callback;

import com.ruixue.sdk.adjust.data.RxAdjustEventFailure;

public interface OnRxEventTrackingFailedListener {
    void onFinishedEventTrackingFailed(RxAdjustEventFailure rxAdjustEventFailure);
}
