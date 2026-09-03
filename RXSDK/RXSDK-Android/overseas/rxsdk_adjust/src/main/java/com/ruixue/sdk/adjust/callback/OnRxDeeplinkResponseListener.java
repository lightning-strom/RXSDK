package com.ruixue.sdk.adjust.callback;

import android.net.Uri;

public interface OnRxDeeplinkResponseListener {
    boolean launchReceivedDeeplink(Uri deeplink);
}
