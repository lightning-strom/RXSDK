package com.ruixue.demo.activity;

import android.content.Intent;
import android.content.res.Configuration;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.ruixue.RuiXueSdk;

/**
 * 统一托管 SDK 生命周期样板转发的基类。
 *
 * <p>基类覆盖以下方法并兜底调用对应的 {@code RuiXueSdk.onXxx(...)}：
 * {@link #onStart()} / {@link #onRestart()} / {@link #onResume()} / {@link #onPause()}
 * / {@link #onStop()} / {@link #onActivityResult} / {@link #onConfigurationChanged}
 * / {@link #onRequestPermissionsResult}。
 *
 * <p>子类若需插入业务逻辑：
 * <ul>
 *   <li>业务无关的方法（start/pause/...）无需覆盖。</li>
 *   <li>{@code onActivityResult} 按需覆盖后在末尾 {@code super.onActivityResult(...)}，
 *       由基类统一转发；如需跳过 SDK 转发（例如自处理某个 requestCode），子类直接
 *       {@code return} 即可。</li>
 *   <li>{@code onConfigurationChanged} 同理。</li>
 * </ul>
 *
 * <p>以下方法因子类常含强顺序依赖（deeplink 处理、按自定义顺序释放资源等），
 * 不在基类统一托管：
 * {@code onCreate} / {@code onNewIntent} / {@code onDestroy} / {@code onBackPressed}。
 */
public abstract class BaseSdkLifecycleActivity extends AppCompatActivity {

    @Override
    protected void onStart() {
        super.onStart();
        RuiXueSdk.onStart(this);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        RuiXueSdk.onRestart(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        RuiXueSdk.onResume(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        RuiXueSdk.onPause(this);
    }

    @Override
    protected void onStop() {
        super.onStop();
        RuiXueSdk.onStop(this);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        RuiXueSdk.onActivityResult(this, requestCode, resultCode, data);
    }

    @Override
    public void onConfigurationChanged(@NonNull Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        RuiXueSdk.onConfigurationChanged(this, newConfig);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode,
            @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        RuiXueSdk.onRequestPermissionsResult(this, requestCode, permissions, grantResults);
    }
}
