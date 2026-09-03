package com.ruixue.rxsdkdemo.overseas;

import com.ruixue.openapi.RXApplication;

/**
 * Demo Application
 * 
 * 继承 RXApplication，SDK 会自动完成 Application 层的初始化工作。
 * 
 * @see <a href="../../../../../../../RXSDK-Doc/android/api/rxsdk_api.md">SDK 文档</a>
 */
public class DemoApplication extends RXApplication {
    
    @Override
    public void onCreate() {
        super.onCreate();
        // 可在此添加其他初始化逻辑
    }
}
