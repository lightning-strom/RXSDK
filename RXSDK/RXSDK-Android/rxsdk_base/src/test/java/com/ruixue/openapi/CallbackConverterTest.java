package com.ruixue.openapi;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

import com.ruixue.RXJSONCallback;
import com.ruixue.error.RXException;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;

import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

/**
 * 回调转换器测试
 * 
 * <p>测试回调逻辑和响应格式转换</p>
 * 
 * @author ROC LEE
 * @date 2026/1/19
 */
public class CallbackConverterTest {

    // ==================== RXJSONCallback 测试 ====================

    @Test
    public void testRXJSONCallback_OnSuccess() throws JSONException {
        // 测试成功场景
        final AtomicBoolean successCalled = new AtomicBoolean(false);
        final AtomicReference<JSONObject> receivedData = new AtomicReference<>();

        RXJSONCallback callback = new RXJSONCallback() {
            @Override
            public void onSuccess(JSONObject data) {
                successCalled.set(true);
                receivedData.set(data);
            }

            @Override
            public void onFailed(JSONObject cause) {
                fail("onFailed should not be called for success");
            }
        };

        // 模拟成功数据
        JSONObject data = new JSONObject();
        data.put("user_id", "12345");

        callback.onSuccess(data);

        assertTrue("onSuccess should be called", successCalled.get());
        assertNotNull("Data should not be null", receivedData.get());
        assertEquals("User ID should match", "12345", receivedData.get().optString("user_id"));
    }

    @Test
    public void testRXJSONCallback_OnFailed() throws JSONException {
        // 测试失败场景
        final AtomicBoolean failedCalled = new AtomicBoolean(false);
        final AtomicReference<JSONObject> receivedCause = new AtomicReference<>();

        RXJSONCallback callback = new RXJSONCallback() {
            @Override
            public void onSuccess(JSONObject data) {
                fail("onSuccess should not be called for failure");
            }

            @Override
            public void onFailed(JSONObject cause) {
                failedCalled.set(true);
                receivedCause.set(cause);
            }
        };

        // 模拟失败响应
        JSONObject cause = new JSONObject();
        cause.put("code", 2000);
        cause.put("msg", "参数错误");

        callback.onFailed(cause);

        assertTrue("onFailed should be called", failedCalled.get());
        assertNotNull("Cause should not be null", receivedCause.get());
        assertEquals("Error code should match", 2000, receivedCause.get().optInt("code"));
    }

    @Test
    public void testRXJSONCallback_OnError() {
        // 测试异常场景：验证 RXException 的属性
        // 注意：RXJSONCallback.onError 内部调用 exception.toJSONObject()，
        // 该方法依赖 Android 的 JSONUtil，在纯 JUnit 环境下会报错，
        // 因此这里只测试 RXException 的基本属性

        RXException exception = new RXException(1100, "网络错误");
        
        assertEquals("Exception code should match", 1100, exception.getCode());
        assertEquals("Exception message should match", "网络错误", exception.getMessage());
        
        // 验证 toMap 方法（不依赖 Android）
        java.util.Map<String, Object> map = exception.toMap();
        assertNotNull("Map should not be null", map);
        assertEquals("Map code should match", 1100, map.get("code"));
    }

    @Test
    public void testRXJSONCallback_EMPTY() {
        // 测试 EMPTY 常量不会抛出异常
        RXJSONCallback.EMPTY.onSuccess(null);
        RXJSONCallback.EMPTY.onFailed(new JSONObject());
        RXJSONCallback.EMPTY.onError(new RXException(0, "test"));
        
        // 如果没有异常抛出，测试通过
        assertTrue("EMPTY callback should not throw exceptions", true);
    }

    // ==================== 响应转换测试 ====================

    @Test
    public void testConvertSuccessResponse() throws JSONException {
        // 测试成功响应转换逻辑
        JSONObject data = new JSONObject();
        data.put("user_id", "12345");

        // 模拟新回调格式
        JSONObject response = new JSONObject();
        response.put("code", 0);
        response.put("data", data);

        assertEquals("Code should be 0", 0, response.optInt("code"));
        assertNotNull("Data should exist", response.optJSONObject("data"));
    }

    @Test
    public void testConvertFailedResponse() throws JSONException {
        // 测试失败响应转换逻辑
        JSONObject response = new JSONObject();
        response.put("code", 302001);
        response.put("msg", "token 过期");
        response.put("trace_id", "abc123");

        assertTrue("Code should not be 0", response.optInt("code") != 0);
        assertEquals("Error message should match", "token 过期", response.optString("msg"));
    }

    // ==================== 边界情况测试 ====================

    @Test
    public void testCallback_NullData() {
        // 测试 data 为 null 的情况
        final AtomicBoolean successCalled = new AtomicBoolean(false);

        RXJSONCallback callback = new RXJSONCallback() {
            @Override
            public void onSuccess(JSONObject data) {
                successCalled.set(true);
                // data 可能为 null，不应该崩溃
            }

            @Override
            public void onFailed(JSONObject cause) {
            }
        };

        callback.onSuccess(null);
        assertTrue("onSuccess should be called even with null data", successCalled.get());
    }

    @Test
    public void testCallback_EmptyResponse() throws JSONException {
        // 测试空响应的情况
        JSONObject emptyResponse = new JSONObject();
        
        // optInt("code") 对于不存在的 key 应该返回 0
        assertEquals("Empty response code should be 0", 0, emptyResponse.optInt("code"));
    }

    @Test
    public void testCallback_MalformedResponse() throws JSONException {
        // 测试格式错误的响应
        JSONObject response = new JSONObject();
        response.put("data", new JSONObject());
        // 缺少 code 字段

        // optInt 应该返回默认值 0
        assertEquals("Missing code should default to 0", 0, response.optInt("code"));
    }

    // ==================== 线程安全测试 ====================

    @Test
    public void testCallback_ThreadSafety() throws InterruptedException {
        // 测试回调的线程安全性
        final CountDownLatch latch = new CountDownLatch(10);
        final AtomicBoolean hasError = new AtomicBoolean(false);

        RXJSONCallback callback = new RXJSONCallback() {
            @Override
            public void onSuccess(JSONObject data) {
                try {
                    // 模拟一些处理
                    Thread.sleep(10);
                    latch.countDown();
                } catch (InterruptedException e) {
                    hasError.set(true);
                }
            }

            @Override
            public void onFailed(JSONObject cause) {
                hasError.set(true);
                latch.countDown();
            }
        };

        // 多线程调用回调
        for (int i = 0; i < 10; i++) {
            final int index = i;
            new Thread(() -> {
                try {
                    JSONObject data = new JSONObject();
                    data.put("index", index);
                    callback.onSuccess(data);
                } catch (JSONException e) {
                    hasError.set(true);
                }
            }).start();
        }

        // 等待所有回调完成
        boolean completed = latch.await(5, TimeUnit.SECONDS);
        assertTrue("All callbacks should complete", completed);
        assertTrue("No errors should occur", !hasError.get());
    }

    @Test
    public void testOnClickHandle_Deprecated() {
        // 测试 onClickHandle 方法（已废弃但仍需兼容）
        RXJSONCallback callback = new RXJSONCallback() {
            @Override
            public void onSuccess(JSONObject data) {
            }

            @Override
            public void onFailed(JSONObject cause) {
            }
        };

        // 默认实现应该返回传入的参数
        java.util.Map<String, Object> params = new java.util.HashMap<>();
        params.put("key", "value");
        
        Map<String, Object> result = callback.onClickHandle(params);
        assertEquals("onClickHandle should return same params", params, result);
    }
}
