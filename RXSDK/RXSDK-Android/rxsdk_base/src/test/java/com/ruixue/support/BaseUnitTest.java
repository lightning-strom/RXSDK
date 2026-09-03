package com.ruixue.support;

import org.junit.Before;
import org.junit.Rule;
import org.junit.rules.TestName;

/**
 * 单元测试基类，提供通用规则与命名约定。
 * 子类可继承以获得 TestName 等规则，便于日志与报告。
 *
 * <p>约定：测试方法名以 test 开头或使用 @Test 描述清晰行为。</p>
 *
 * @see com.ruixue.openapi.RXSDKTest
 * @see com.ruixue.utils.AESUtilTest
 */
public abstract class BaseUnitTest {

    @Rule
    public final TestName testName = new TestName();

    @Before
    public void baseSetUp() {
        // 子类可 override 做通用初始化；当前仅提供 TestName 规则
    }

    /** 当前测试方法名，便于断言消息或日志 */
    protected String getTestName() {
        return testName != null ? testName.getMethodName() : "unknown";
    }
}
