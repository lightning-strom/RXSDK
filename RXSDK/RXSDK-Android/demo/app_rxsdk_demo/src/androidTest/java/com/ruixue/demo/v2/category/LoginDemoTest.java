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

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

/**
 * LoginDemo V2 自动化测试
 * <p>
 * 测试登录相关 API 的调用
 *
 * @since 2.0
 */
@RunWith(AndroidJUnit4.class)
public class LoginDemoTest {

    @Rule
    public ActivityScenarioRule<ApiDemoV2Activity> activityRule =
            new ActivityScenarioRule<>(ApiDemoV2Activity.class);

    private LoginDemo loginDemo;
    private final AtomicReference<String> lastResult = new AtomicReference<>();
    private final AtomicBoolean resultReceived = new AtomicBoolean(false);

    @Before
    public void setUp() {
        activityRule.getScenario().onActivity(activity -> {
            loginDemo = new LoginDemo(activity, new DemoManager.ResultCallback() {
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
    public void testCheckLoginStatus() throws InterruptedException {
        resultReceived.set(false);

        activityRule.getScenario().onActivity(activity -> {
            loginDemo.checkLoginStatus();
        });

        // 等待结果
        Thread.sleep(500);

        assertTrue("应收到结果回调", resultReceived.get());
        String result = lastResult.get();
        assertNotNull("结果不应为空", result);
        assertTrue("结果应包含登录状态", result.contains("登录状态"));
    }

    @Test
    public void testGetOpenId() throws InterruptedException {
        resultReceived.set(false);

        activityRule.getScenario().onActivity(activity -> {
            loginDemo.getOpenId();
        });

        Thread.sleep(500);

        assertTrue("应收到结果回调", resultReceived.get());
        String result = lastResult.get();
        assertNotNull("结果不应为空", result);
        assertTrue("结果应包含 OpenID", result.contains("OpenID"));
    }

    @Test
    public void testGetToken() throws InterruptedException {
        resultReceived.set(false);

        activityRule.getScenario().onActivity(activity -> {
            loginDemo.getToken();
        });

        Thread.sleep(500);

        assertTrue("应收到结果回调", resultReceived.get());
        String result = lastResult.get();
        assertNotNull("结果不应为空", result);
        // Token 可能是 "Token: 未登录" 或 AccessToken 信息
        assertTrue("结果应包含 Token 信息",
                result.contains("Token") || result.contains("AccessToken"));
    }

    @Test
    public void testCheckTokenExpired() throws InterruptedException {
        resultReceived.set(false);

        activityRule.getScenario().onActivity(activity -> {
            loginDemo.checkTokenExpired();
        });

        Thread.sleep(500);

        assertTrue("应收到结果回调", resultReceived.get());
        String result = lastResult.get();
        assertNotNull("结果不应为空", result);
        assertTrue("结果应包含 Token 信息",
                result.contains("Token") || result.contains("过期"));
    }
}
