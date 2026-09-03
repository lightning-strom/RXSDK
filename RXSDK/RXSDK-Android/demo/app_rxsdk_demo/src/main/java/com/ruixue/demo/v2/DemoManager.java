package com.ruixue.demo.v2;

import android.app.Activity;

import androidx.annotation.NonNull;

import com.ruixue.demo.config.TestButtonConfig;
import com.ruixue.demo.v2.category.LoginDemo;
import com.ruixue.demo.v2.category.PayDemo;
import com.ruixue.demo.v2.category.ToolsDemo;
import com.ruixue.demo.v2.category.UserDemo;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Demo V2 管理器
 * <p>
 * 统一管理所有 API 示例分类，方便提取和调用
 *
 * @since 2.0
 */
public class DemoManager {

    private final Activity activity;
    private final ResultCallback callback;
    private final Map<String, DemoCategory> categories = new LinkedHashMap<>();

    public DemoManager(@NonNull Activity activity, @NonNull ResultCallback callback) {
        this.activity = activity;
        this.callback = callback;
        initCategories();
    }

    /**
     * 初始化所有分类
     */
    private void initCategories() {
        // 登录相关
        categories.put("login", new LoginDemo(activity, callback));
        // 用户相关
        categories.put("user", new UserDemo(activity, callback));
        // 支付相关
        categories.put("pay", new PayDemo(activity, callback));
        // 工具相关
        categories.put("tools", new ToolsDemo(activity, callback));
    }

    /**
     * 获取所有分类的按钮配置
     */
    public List<TestButtonConfig.ButtonGroup> getAllButtonGroups() {
        List<TestButtonConfig.ButtonGroup> groups = new ArrayList<>();
        for (DemoCategory category : categories.values()) {
            groups.add(category.getButtonGroup());
        }
        return groups;
    }

    /**
     * 获取指定分类
     */
    public DemoCategory getCategory(String key) {
        return categories.get(key);
    }

    /**
     * 结果回调
     */
    public interface ResultCallback {
        void onResult(String message);
        void onToast(String message);
    }
}
