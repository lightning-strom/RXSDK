package com.ruixue.demo.api.module;

import android.app.Activity;
import android.text.TextUtils;
import android.widget.EditText;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXRequestCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.demo.api.ButtonModule;
import com.ruixue.demo.callback.DemoCallbacks;
import com.ruixue.demo.config.DemoTestConfig;
import com.ruixue.demo.v2.DemoManager;
import com.ruixue.error.RXException;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXSdkUI;
import com.ruixue.qipai.R;
import com.ruixue.view.notice.MaintainNoticeCallback;
import com.ruixue.view.notice.NoticeCallback;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 公告 / 维护公告 / 拉取公告数据 相关测试按钮。
 */
public class AnnounceModule implements ButtonModule {

    private final Activity activity;
    private final DemoManager.ResultCallback callback;

    public AnnounceModule(@NonNull Activity activity, @NonNull DemoManager.ResultCallback callback) {
        this.activity = activity;
        this.callback = callback;
    }

    @Override
    public void registerButtons(Registrar registrar) {
        registrar.register(R.id.show_single_announce, () -> showAnnounce(1));
        registrar.register(R.id.show_multiple_announce, () -> showAnnounce(100));
        registrar.register(R.id.show_common_maintain_announce, this::showCommonMaintainAnnounce);
        registrar.register(R.id.show_custom_maintain_announce, this::showCustomMaintainAnnounce);
        registrar.register(R.id.get_announce, this::getAnnounce);

        registrar.register(R.id.checkversion, this::updateApp);
        registrar.register(R.id.checkgame, this::updateGame);
        registrar.register(R.id.checkactivity, this::updateActivity);
        registrar.register(R.id.check_new_version, this::check_new_version);
    }

    private void showAnnounce(int limit) {
        RXSdkUI.getInstance().showAnnounceView(activity, limit, new NoticeCallback() {
            @Override
            public void onLink(String link) { callback.onToast("公告链接: " + link); }

            @Override
            public void hasAnnounceUI(boolean isHas) { callback.onResult("公告UI显示: " + isHas); }
        });
    }

    private void showCommonMaintainAnnounce() {
        Map<String, Object> queryMap = new HashMap<>();
        queryMap.put("format", "json");
        RXSdkUI.getInstance().showUpdateAppView(activity, "9.0.1", "150000", queryMap, true, createMaintainCallback());
    }

    private void showCustomMaintainAnnounce() {
        RXSdkUI.getInstance().showCheckUpdateAppView(activity, "1.0.1", "150000", "js", null, true, createMaintainCallback());
    }

    private MaintainNoticeCallback createMaintainCallback() {
        return new MaintainNoticeCallback() {
            @Override
            public void onLink(String link) { callback.onToast("维护链接: " + link); }

            @Override
            public void hasAnnounceUI(boolean isHas) { callback.onResult("维护UI显示: " + isHas); }

            @Override
            public void onSuccess(@Nullable String data) { callback.onResult("维护检查成功:\n" + data); }

            @Override
            public void onFailed(int code, String msg, @Nullable String traceId) {
                callback.onResult("维护检查失败: " + code + " - " + msg);
            }
        };
    }

    private void getAnnounce() {
        EditText editText = activity.findViewById(R.id.limit_count);
        String raw = editText != null ? editText.getText().toString().trim() : "";
        int limit;
        try {
            limit = TextUtils.isEmpty(raw) ? 10 : Integer.parseInt(raw);
        } catch (NumberFormatException e) {
            callback.onToast("条数格式不正确，使用默认值 10");
            limit = 10;
        }
        RuiXueSdk.getRXSdkApi().getAnnouncement(limit, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject response) {
                callback.onResult("公告内容:\n" + response);
                TextView announceData = activity.findViewById(R.id.announce_data);
                if (announceData != null) announceData.setText("公告内容: " + response);
            }

            @Override
            public void onError(RXException e) {
                callback.onResult("公告获取失败: " + e.getJSONString());
            }
        });
    }

    // ==================== 版本检查 ====================

    private void updateApp() {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("format", "json");
        RXSdkApi.getInstance().updateApp(DemoTestConfig.CHECK_APP_VERSION, "0", hashMap,
                DemoCallbacks.string(callback, "版本检查"));
    }

    private void updateGame() {
        RXSdkApi.getInstance().updateGame(DemoTestConfig.CHECK_GAME_VERSION, "1", "0", null,
                DemoCallbacks.string(callback, "游戏版本检查"));
    }

    private void updateActivity() {
        RXSdkApi.getInstance().updateActivity(DemoTestConfig.CHECK_ACTIVITY_TAG, "1", "0", null,
                DemoCallbacks.string(callback, "活动版本检查"));
    }

    private void check_new_version() {
        Map<String, Object> body = new HashMap<>();
        List<Map<String, Object>> modules = new ArrayList<>();
        Map<String, Object> module = new HashMap<>();
        module.put("module_id", 2);
        module.put("clientversion", 1);
        module.put("checkversion", 0);
        modules.add(module);
        body.put("type", "js");
        body.put("modules", modules);
        RuiXueSdk.getApi().updateGameVersion(body, DemoCallbacks.request(callback, "新版本检查"));
    }
}
