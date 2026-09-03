package com.ruixue.demo.v2;

import com.ruixue.demo.v2.category.ConfigDemoTest;
import com.ruixue.demo.v2.category.LoginDemoTest;
import com.ruixue.demo.v2.category.UserDemoTest;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;

/**
 * V2 API 测试套件
 * <p>
 * 一次性运行所有 V2 API 测试
 * <p>
 * 运行命令:
 * <pre>
 * ./gradlew :demo:app_rxsdk_demo:connectedAndroidTest
 * </pre>
 * 或指定测试类:
 * <pre>
 * ./gradlew :demo:app_rxsdk_demo:connectedAndroidTest -Pandroid.testInstrumentationRunnerArguments.class=com.ruixue.demo.v2.V2ApiTestSuite
 * </pre>
 *
 * @since 2.0
 */
@RunWith(Suite.class)
@Suite.SuiteClasses({
        DemoManagerTest.class,
        LoginDemoTest.class,
        UserDemoTest.class,
        ConfigDemoTest.class
})
public class V2ApiTestSuite {
    // 测试套件，不需要实现
}
