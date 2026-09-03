package com.ruixue.demo.config;

import android.app.Activity;
import android.widget.Toast;

import com.ruixue.RuiXueSdk;
import com.ruixue.demo.v2.DemoManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Demo 测试按钮配置
 * <p>
 * 在这里配置需要动态添加的测试按钮
 * @since 2.0
 */
public class DemoTestButtons {

    /**
     * 快捷测试按钮组（配置表驱动）
     * 新增按钮时仅需在 quickButtons 列表中追加一行
     */
    private static TestButtonConfig.ButtonGroup getQuickTestButtons(Activity activity, ResultCallback callback) {
        List<QuickButtonItem> quickButtons = Arrays.asList(
                new QuickButtonItem("test_toast", "Toast测试",
                        (act, cb) -> Toast.makeText(act, "Toast 测试成功!", Toast.LENGTH_SHORT).show()),
                new QuickButtonItem("test_log", "日志测试",
                        (act, cb) -> cb.onResult("测试日志输出: " + System.currentTimeMillis())),
                new QuickButtonItem("test_openid", "获取OpenID", (act, cb) -> {
                    String openid = RuiXueSdk.getOpenid();
                    cb.onResult("OpenID: " + (openid != null ? openid : "未登录"));
                }),
                new QuickButtonItem("test_device", "获取设备码",
                        (act, cb) -> cb.onResult("设备码: " + RuiXueSdk.getDeviceCode()))
        );

        TestButtonConfig.Builder builder = TestButtonConfig.builder().group("快捷测试", "⚡");
        for (QuickButtonItem item : quickButtons) {
            builder.button(item.id, item.text, v -> item.action.run(activity, callback));
        }
        return builder.build().get(0);
    }

    /**
     * 快捷按钮动作接口（兼容 Java 8 lambda）
     */
    private interface QuickAction {
        void run(Activity activity, ResultCallback callback);
    }

    /**
     * 快捷按钮配置项
     */
    private static class QuickButtonItem {
        final String id;
        final String text;
        final QuickAction action;

        QuickButtonItem(String id, String text, QuickAction action) {
            this.id = id;
            this.text = text;
            this.action = action;
        }
    }

    /**
     * 获取所有测试按钮配置
     * @param activity 活动上下文
     * @param callback 结果回调
     */
    public static List<TestButtonConfig.ButtonGroup> getTestButtons(Activity activity, ResultCallback callback) {
        List<TestButtonConfig.ButtonGroup> groups = new ArrayList<>();

        // ========== 快捷测试 ==========
        groups.add(getQuickTestButtons(activity, callback));

        // ========== API Demo 模块 ==========
        DemoManager demoManager = new DemoManager(activity, new DemoManager.ResultCallback() {
            @Override
            public void onResult(String message) {
                callback.onResult(message);
            }

            @Override
            public void onToast(String message) {
                Toast.makeText(activity, message, Toast.LENGTH_SHORT).show();
            }
        });
        groups.addAll(demoManager.getAllButtonGroups());

        return groups;
    }


    /**
     * 结果回调接口
     */
    public interface ResultCallback {
        void onResult(String message);
    }
}
