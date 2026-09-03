package com.ruixue.sdk.adjust.callback;

import com.ruixue.sdk.adjust.data.RxAdjustSessionFailure;

public interface OnRxSessionTrackingFailedListener {
    void onFinishedSessionTrackingFailed(RxAdjustSessionFailure rxAdjustSessionFailure);
}
