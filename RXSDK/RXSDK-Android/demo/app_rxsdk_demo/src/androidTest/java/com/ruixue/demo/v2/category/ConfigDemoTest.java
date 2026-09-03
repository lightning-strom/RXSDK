package com.ruixue.demo.v2.category;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;

import com.ruixue.demo.activity.ApiDemoV2Activity;
import com.ruixue.demo.v2.DemoManager;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

/**
 * ConfigDemo V2 自动化测试
 * <p>
 * 测试配置相关 API 的调用
 *
 * @since 2.0
 */
@RunWith(AndroidJUnit4.class)
public class ConfigDemoTest {

    @Rule
    public ActivityScenarioRule<ApiDemoV2Activity> activityRule =
            new ActivityScenarioRule<>(ApiDemoV2Activity.class);

    private ConfigDemo configDemo;
    private final AtomicReference<String> lastResult = new AtomicReference<>();
    private final AtomicBoolean resultReceived = new AtomicBoolean(false);

    @Before
    public void setUp() {
        activityRule.getScenario().onActivity(activity -> {
            configDemo = new ConfigDemo(activity, new DemoManager.ResultCallback() {
                @Override
                public void onResult(String message) {
                    lastResult.set(message);
                    resultReceived.set(true);
                }

                @Override
                public void onToast(String message) {
                    // 忽略 Toast
                }
            });
        });
    }

    @Test
    public void testGetSdkVersion() throws InterruptedException {
        resultReceived.set(false);

        activityRule.getScenario().onActivity(activity -> {
            configDemo.getSdkVersion();
        });

        Thread.sleep(500);

        assertTrue("应收到结果回调", resultReceived.get());
        String result = lastResult.get();
        assertNotNull("结果不应为空", result);
        assertTrue("结果应包含 SDK 版本", result.contains("SDK 版本"));
    }

    @Test
    public void testGetInitStatus() throws InterruptedException {
        resultReceived.set(false);

        activityRule.getScenario().onActivity(activity -> {
            configDemo.getInitStatus();
        });

        Thread.sleep(500);

        assertTrue("应收到结果回调", resultReceived.get());
        String result = lastResult.get();
        assertNotNull("结果不应为空", result);
        assertTrue("结果应包含初始化状态", result.contains("初始化状态"));
    }

    @Test
    public void testGetInitParams() throws InterruptedException {
        resultReceived.set(false);

        activityRule.getScenario().onActivity(activity -> {
            configDemo.getInitParams();
        });

        Thread.sleep(500);

        assertTrue("应收到结果回调", resultReceived.get());
        String result = lastResult.get();
        assertNotNull("结果不应为空", result);
        assertTrue("结果应包含初始化参数", result.contains("初始化参数"));
    }

    @Test
    public void testGetCurrentLanguage() throws InterruptedException {
        resultReceived.set(false);

        activityRule.getScenario().onActivity(activity -> {
            configDemo.getCurrentLanguage();
        });

        Thread.sleep(500);

        assertTrue("应收到结果回调", resultReceived.get());
        String result = lastResult.get();
        assertNotNull("结果不应为空", result);
        assertTrue("结果应包含当前语言", result.contains("当前语言"));
    }

    @Test
    public void testGetCurrentInitConfig() throws InterruptedException {
        resultReceived.set(false);

        activityRule.getScenario().onActivity(activity -> {
            configDemo.getCurrentInitConfig();
        });

        Thread.sleep(500);

        assertTrue("应收到结果回调", resultReceived.get());
        String result = lastResult.get();
        assertNotNull("结果不应为空", result);
        assertTrue("结果应包含当前配置", result.contains("当前初始化配置"));
    }
}
