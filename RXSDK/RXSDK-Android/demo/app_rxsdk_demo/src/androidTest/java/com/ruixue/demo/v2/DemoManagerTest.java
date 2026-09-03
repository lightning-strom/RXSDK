package com.ruixue.demo.v2;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;

import com.ruixue.demo.activity.ApiDemoV2Activity;
import com.ruixue.demo.config.TestButtonConfig;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

/**
 * DemoManager V2 自动化测试
 * <p>
 * 测试内容：
 * <ul>
 * <li>DemoManager 初始化</li>
 * <li>分类注册完整性</li>
 * <li>按钮配置生成</li>
 * </ul>
 *
 * @since 2.0
 */
@RunWith(AndroidJUnit4.class)
public class DemoManagerTest {

    @Rule
    public ActivityScenarioRule<ApiDemoV2Activity> activityRule = new ActivityScenarioRule<>(ApiDemoV2Activity.class);

    private DemoManager demoManager;
    private final AtomicReference<String> lastResult = new AtomicReference<>();
    private final AtomicReference<String> lastToast = new AtomicReference<>();

    @Before
    public void setUp() {
        activityRule.getScenario().onActivity(activity -> {
            demoManager = new DemoManager(activity, new DemoManager.ResultCallback() {
                @Override
                public void onResult(String message) {
                    lastResult.set(message);
                }

                @Override
                public void onToast(String message) {
                    lastToast.set(message);
                }
            });
        });
    }

    @Test
    public void testDemoManagerNotNull() {
        assertNotNull("DemoManager 不应为空", demoManager);
    }

    @Test
    public void testAllCategoriesRegistered() {
        // 验证所有 7 个分类已注册
        assertNotNull("login 分类应存在", demoManager.getCategory("login"));
        assertNotNull("user 分类应存在", demoManager.getCategory("user"));
        assertNotNull("pay 分类应存在", demoManager.getCategory("pay"));
        assertNotNull("social 分类应存在", demoManager.getCategory("social"));
        assertNotNull("gamearea 分类应存在", demoManager.getCategory("gamearea"));
        assertNotNull("tools 分类应存在", demoManager.getCategory("tools"));
        assertNotNull("config 分类应存在", demoManager.getCategory("config"));
    }

    @Test
    public void testGetAllButtonGroups() {
        List<TestButtonConfig.ButtonGroup> groups = demoManager.getAllButtonGroups();

        assertNotNull("按钮分组列表不应为空", groups);
        assertEquals("应有 7 个分类", 7, groups.size());

        // 验证每个分组都有按钮
        for (TestButtonConfig.ButtonGroup group : groups) {
            assertNotNull("分组名称不应为空", group.name);
            assertNotNull("分组图标不应为空", group.emoji);
            assertTrue("每个分组应至少有 1 个按钮", group.buttons.size() > 0);
        }
    }

    @Test
    public void testLoginCategoryButtons() {
        DemoCategory loginDemo = demoManager.getCategory("login");
        assertNotNull(loginDemo);

        TestButtonConfig.ButtonGroup group = loginDemo.getButtonGroup();
        assertEquals("登录", group.name);
        assertEquals("🔐", group.emoji);
        assertTrue("登录分类应有按钮", group.buttons.size() >= 6);
    }

    @Test
    public void testUserCategoryButtons() {
        DemoCategory userDemo = demoManager.getCategory("user");
        assertNotNull(userDemo);

        TestButtonConfig.ButtonGroup group = userDemo.getButtonGroup();
        assertEquals("用户", group.name);
        assertEquals("👤", group.emoji);
        assertTrue("用户分类应有按钮", group.buttons.size() >= 4);
    }

    @Test
    public void testPayCategoryButtons() {
        DemoCategory payDemo = demoManager.getCategory("pay");
        assertNotNull(payDemo);

        TestButtonConfig.ButtonGroup group = payDemo.getButtonGroup();
        assertEquals("支付", group.name);
        assertEquals("💰", group.emoji);
        assertTrue("支付分类应有按钮", group.buttons.size() >= 3);
    }

    @Test
    public void testSocialCategoryButtons() {
        DemoCategory socialDemo = demoManager.getCategory("social");
        assertNotNull(socialDemo);

        TestButtonConfig.ButtonGroup group = socialDemo.getButtonGroup();
        assertEquals("社交", group.name);
        assertEquals("👥", group.emoji);
        assertTrue("社交分类应有按钮", group.buttons.size() >= 10);
    }

    @Test
    public void testGameAreaCategoryButtons() {
        DemoCategory gameAreaDemo = demoManager.getCategory("gamearea");
        assertNotNull(gameAreaDemo);

        TestButtonConfig.ButtonGroup group = gameAreaDemo.getButtonGroup();
        assertEquals("区服", group.name);
        assertEquals("🎮", group.emoji);
        assertTrue("区服分类应有按钮", group.buttons.size() >= 10);
    }

    @Test
    public void testToolsCategoryButtons() {
        DemoCategory toolsDemo = demoManager.getCategory("tools");
        assertNotNull(toolsDemo);

        TestButtonConfig.ButtonGroup group = toolsDemo.getButtonGroup();
        assertEquals("工具", group.name);
        assertEquals("🔧", group.emoji);
        assertTrue("工具分类应有按钮", group.buttons.size() >= 4);
    }

    @Test
    public void testConfigCategoryButtons() {
        DemoCategory configDemo = demoManager.getCategory("config");
        assertNotNull(configDemo);

        TestButtonConfig.ButtonGroup group = configDemo.getButtonGroup();
        assertEquals("配置", group.name);
        assertEquals("⚙️", group.emoji);
        assertTrue("配置分类应有按钮", group.buttons.size() >= 7);
    }
}
