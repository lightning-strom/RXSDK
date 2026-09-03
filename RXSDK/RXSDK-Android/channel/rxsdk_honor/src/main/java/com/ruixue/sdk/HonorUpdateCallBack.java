package com.ruixue.sdk;

import android.app.Activity;
import android.content.Intent;

 import com.ruixue.RuiXueSdk;

public class HonorUpdateCallBack  {
    private static final String TAG = RuiXueSdk.TAG;
    private Activity activity;
    private boolean force;

    public HonorUpdateCallBack(Activity activity, boolean force) {
        this.activity = activity;
        this.force = force;
    }



    public void onUpdateInfo(Intent intent) {
        if (intent != null) {

        }
    }


}
