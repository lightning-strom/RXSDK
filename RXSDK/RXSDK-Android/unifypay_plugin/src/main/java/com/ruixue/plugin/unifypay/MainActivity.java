package com.ruixue.plugin.unifypay;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;

public class MainActivity extends Activity {

    private boolean isPauseResume = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.e("rxsdk", "plugin onCreate");
//        setContentView(R.layout.activity_main);
//        Button btn = findViewById(R.id.button2);
//        btn.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                UPPayWrapper.payCloudQuickPay(MainActivity.this, "495926590630198037354");
//            }
//        });
        UPPayWrapper.handleIntent(this, getIntent());
        isPauseResume = false;
    }

    @Override
    protected void onPause() {
        super.onPause();
        isPauseResume = true;
        Log.e("rxsdk", "plugin onPause");
    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.e("rxsdk", "plugin onResume isPauseResume：" + isPauseResume);
        if (isPauseResume) {
            finish();
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        Log.e("rxsdk", "plugin onNewIntent");
        UPPayWrapper.handleIntent(this, getIntent());
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        Log.e("rxsdk", "plugin onActivityResult");
        UPPayWrapper.onActivityResult(this, requestCode, resultCode, data);
    }

    @Override
    public void finish() {
        super.finish();
        this.overridePendingTransition(0, 0);
    }
}