package com.ruixue.openapi;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.LifecycleOwner;

public interface ILifecycle {

    void attachBaseContext(Context context);

    void onApplicationCreate(Application application);

    void trackingLifecycle(@NonNull LifecycleOwner lifecycleOwner);

    void onCreate(Activity activity, @Nullable Bundle savedInstanceState);

    void onStart(Activity activity);

    void onRestart(Activity activity);

    void onResume(Activity activity);

    void onPause(Activity activity);

    void onStop(Activity activity);

    void onDestroy(Activity activity);

    void onBackPressed();

    void onNewIntent(Activity activity, Intent intent);

    void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data);

    void onRequestPermissionsResult(Activity activity, int requestCode, String[] permissions, int[] grantResults);

    void onConfigurationChanged(Activity activity, Configuration newConfig);

    void onActivitySaveInstanceState(Activity activity, Bundle outState);

    void onWindowFocusChanged(boolean hasFocus);
}
