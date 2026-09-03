package com.ruixue.demo.activity;
import com.ruixue.demo.GlobalConfig;

import android.app.Activity;
import android.os.Bundle;

import com.ruixue.utils.ActivityUtils;

public class WelcomeActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Bundle bundle = getIntent().getExtras();
        ActivityUtils.startActivityByClass(this, GlobalConfig.getMainActivity(), bundle);
        finish();
    }


    @Override
    protected void onResume() {
        super.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
    }
}
