package com.ruixue.sdk.vk;

import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.ruixue.RXJSONCallback;
import com.ruixue.logger.RXLogger;

import org.json.JSONObject;

/**
 * VKID SDK 授权跳板页。
 *
 * <p>当宿主 Activity 未实现 {@link androidx.lifecycle.LifecycleOwner}（如 Unity 的
 * {@code UnityPlayerActivity}）时，{@link VkSdkWrapper#doLogin} 启动本 Activity，
 * 由本页面以 {@code AppCompatActivity}（LifecycleOwner）身份调用
 * {@link VkIdAuthBridge#authorize}，回调结果后自动 finish。
 *
 * <p>本 Activity 使用透明主题，不展示任何自有 UI，VKID SDK 会在其上弹出系统级授权界面。
 */
public class VkSdkAuthActivity extends AppCompatActivity {

    private static final String TAG = "VkSdkAuth";

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        RXJSONCallback cb = VkSdkWrapper.consumePendingSdkCallback();
        if (cb == null) {
            RXLogger.e(TAG, "no pending callback, finish");
            finish();
            return;
        }

        VkIdAuthBridge.authorize(this, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                cb.onSuccess(data);
                finish();
            }

            @Override
            public void onFailed(JSONObject cause) {
                cb.onFailed(cause);
                finish();
            }
        });
    }

    @Override
    public void onBackPressed() {
        // VKID SDK 自行处理取消，直接传播给 super 触发生命周期回调
        super.onBackPressed();
    }
}
