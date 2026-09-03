package com.ruixue.push.honor;


import android.text.TextUtils;

import com.hihonor.push.sdk.HonorMessageService;
import com.hihonor.push.sdk.HonorPushDataMsg;

public class HonorPushReceiver extends HonorMessageService {


    @Override
    public void onNewToken(String s) {
        super.onNewToken(s);
        if (!TextUtils.isEmpty(s)) {
            // This method callback must be completed in 10 seconds. Otherwise, you need to start a new Job for callback processing.
            HonorPushProvider.callUpdateToken(this.getApplicationContext(), s);
        }
    }

    @Override
    public void onMessageReceived(HonorPushDataMsg honorPushDataMsg) {
        super.onMessageReceived(honorPushDataMsg);
    }
}
