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
 * UserDemo V2 自动化测试
 * <p>
 * 测试用户相关 API 的调用
 *
 * @since 2.0
 */
@RunWith(AndroidJUnit4.class)
public class UserDemoTest {

    @Rule
    public ActivityScenarioRule<ApiDemoV2Activity> activityRule =
            new ActivityScenarioRule<>(ApiDemoV2Activity.class);

    private UserDemo userDemo;
    private final AtomicReference<String> lastResult = new AtomicReference<>();
    private final AtomicBoolean resultReceived = new AtomicBoolean(false);

    @Before
    public void setUp() {
        activityRule.getScenario().onActivity(activity -> {
            userDemo = new UserDemo(activity, new DemoManager.ResultCallback() {
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
    public void testGetUserInfo() throws InterruptedException {
        resultReceived.set(false);

        activityRule.getScenario().onActivity(activity -> {
            userDemo.getUserInfo();
        });

        Thread.sleep(500);

        assertTrue("应收到结果回调", resultReceived.get());
        String result = lastResult.get();
        assertNotNull("结果不应为空", result);
        assertTrue("结果应包含用户标识信息", result.contains("用户标识"));
    }

    @Test
    public void testGetDistinctId() throws InterruptedException {
        resultReceived.set(false);

        activityRule.getScenario().onActivity(activity -> {
            userDemo.getDistinctId();
        });

        Thread.sleep(500);

        assertTrue("应收到结果回调", resultReceived.get());
        String result = lastResult.get();
        assertNotNull("结果不应为空", result);
        assertTrue("结果应包含 DistinctId", result.contains("DistinctId"));
    }

    @Test
    public void testGetDeviceCode() throws InterruptedException {
        resultReceived.set(false);

        activityRule.getScenario().onActivity(activity -> {
            userDemo.getDeviceCode();
        });

        Thread.sleep(500);

        assertTrue("应收到结果回调", resultReceived.get());
        String result = lastResult.get();
        assertNotNull("结果不应为空", result);
        assertTrue("结果应包含 DeviceCode", result.contains("DeviceCode"));
    }
}
