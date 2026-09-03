package com.ruixue.demo.api;

import android.app.Activity;
import android.view.View;

import androidx.annotation.NonNull;

import com.ruixue.callback.RXUICallback;
import com.ruixue.demo.api.module.AnnounceModule;
import com.ruixue.demo.api.module.LegalModule;
import com.ruixue.demo.api.module.LoginModule;
import com.ruixue.demo.api.module.PayModule;
import com.ruixue.demo.api.module.RouteModule;
import com.ruixue.demo.api.module.ToolsModule;
import com.ruixue.demo.api.module.UserModule;
import com.ruixue.demo.v2.DemoManager;

import java.util.HashMap;
import java.util.Map;

/**
 * Demo 点击处理器
 * <p>
 * 聚合各功能域 Module，统一管理按钮 ID → 处理逻辑的映射。
 * 各模块独立负责注册自身按钮，DemoClickHandler 只负责聚合与分发。
 *
 * @since 2.0
 */
public class DemoClickHandler {

    private final Map<Integer, Runnable> buttonActions = new HashMap<>();

    public DemoClickHandler(@NonNull Activity activity,
                            @NonNull DemoManager.ResultCallback callback,
                            @NonNull RXUICallback jsonCallback) {
        ButtonModule.Registrar registrar = buttonActions::put;

        new PayModule(activity, callback, jsonCallback).registerButtons(registrar);
        new LoginModule(activity, callback, jsonCallback).registerButtons(registrar);
        new UserModule(activity, callback, jsonCallback).registerButtons(registrar);
        new AnnounceModule(activity, callback).registerButtons(registrar);
        new LegalModule(activity, callback, jsonCallback).registerButtons(registrar);
        new RouteModule(activity).registerButtons(registrar);
        new ToolsModule(activity, callback, jsonCallback).registerButtons(registrar);
    }

    /**
     * 处理按钮点击事件
     *
     * @param v 被点击的 View
     * @return true=已处理, false=未处理
     */
    public boolean handleClick(View v) {
        Runnable action = buttonActions.get(v.getId());
        if (action != null) {
            action.run();
            return true;
        }
        return false;
    }
}
