package com.ruixue.demo.api;

/**
 * 按钮注册模块接口
 * <p>
 * 每个功能域实现此接口，通过 registrar 注册按钮 ID 和处理逻辑。
 * DemoClickHandler 聚合调用所有模块完成统一注册。
 */
public interface ButtonModule {

    @FunctionalInterface
    interface Registrar {
        void register(int resId, Runnable action);
    }

    void registerButtons(Registrar registrar);
}
