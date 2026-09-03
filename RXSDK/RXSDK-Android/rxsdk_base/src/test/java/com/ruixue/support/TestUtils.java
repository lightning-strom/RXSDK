package com.ruixue.support;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.nio.charset.StandardCharsets;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

/**
 * 单元测试通用工具方法。
 */
public final class TestUtils {

    private static final int DEFAULT_WAIT_SECONDS = 5;

    private TestUtils() {}

    /**
     * 等待 latch 完成，超时则断言失败
     */
    public static void await(CountDownLatch latch) throws InterruptedException {
        assertTrue("Callback did not complete in time",
                latch.await(DEFAULT_WAIT_SECONDS, TimeUnit.SECONDS));
    }

    public static void await(CountDownLatch latch, int seconds) throws InterruptedException {
        assertTrue("Callback did not complete in " + seconds + "s",
                latch.await(seconds, TimeUnit.SECONDS));
    }

    /**
     * 捕获异步结果到 AtomicReference，便于断言
     */
    public static <T> AtomicReference<T> captureRef() {
        return new AtomicReference<>();
    }

    /**
     * 断言字节数组为 UTF-8 解码后与 expected 相等
     */
    public static void assertUtf8Equals(String expected, byte[] actual) {
        assertNotNull(actual);
        assertNotNull(expected);
        org.junit.Assert.assertEquals(expected, new String(actual, StandardCharsets.UTF_8));
    }
}
