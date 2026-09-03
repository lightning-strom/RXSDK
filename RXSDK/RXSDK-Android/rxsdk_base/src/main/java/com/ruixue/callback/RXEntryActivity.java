package com.ruixue.callback;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;

import com.ruixue.base.PluginPayManager;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/9/9
 */
public class RXEntryActivity extends Activity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.e("RXEntryActivity", bundleToString(getIntent().getExtras()));
        PluginPayManager.handlePluginCallback(getIntent().getExtras());
        finish();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        Log.e("RXEntryActivity", bundleToString(getIntent().getExtras()));
        PluginPayManager.handlePluginCallback(getIntent().getExtras());
        finish();
    }


    public static String bundleToString(Bundle bundle) {
        if (null != bundle) {
            StringBuilder log = new StringBuilder();
            for (String key : bundle.keySet()) {
                log.append("\n").append(key).append(" = ").append(bundle.get(key));
            }
            return log.toString();
        }
        return "";
    }
}
