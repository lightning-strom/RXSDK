package com.ruixue.demo.v2;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import com.ruixue.demo.config.TestButtonConfig;

import org.junit.Test;

import java.util.List;

/**
 * DemoManager V2 单元测试
 * <p>
 * 测试按钮配置结构（不依赖 Android Context）
 *
 * @since 2.0
 */
public class DemoManagerUnitTest {

    @Test
    public void testButtonGroupStructure() {
        // 测试 ButtonGroup 结构
        TestButtonConfig.ButtonGroup group = new TestButtonConfig.ButtonGroup("测试", "🔧");

        assertEquals("测试", group.name);
        assertEquals("🔧", group.emoji);
        assertNotNull(group.buttons);
        assertTrue(group.buttons.isEmpty());
    }

    @Test
    public void testButtonGroupWithButtons() {
        TestButtonConfig.ButtonGroup group = new TestButtonConfig.ButtonGroup("登录", "🔐");

        // 添加按钮
        TestButtonConfig.ButtonItem btn1 = TestButtonConfig.ButtonItem.create(
                "test1", "测试1", "登录", TestButtonConfig.NORMAL, v -> {});
        TestButtonConfig.ButtonItem btn2 = TestButtonConfig.ButtonItem.create(
                "test2", "测试2", "登录", TestButtonConfig.PRIMARY, v -> {});

        group.addButton(btn1);
        group.addButton(btn2);

        assertEquals(2, group.buttons.size());
        assertEquals("test1", group.buttons.get(0).id);
        assertEquals("test2", group.buttons.get(1).id);
    }

    @Test
    public void testButtonItemCreate() {
        TestButtonConfig.ButtonItem item = TestButtonConfig.ButtonItem.create(
                "btn_login", "登录", "登录分类", TestButtonConfig.PRIMARY, v -> {});

        assertEquals("btn_login", item.id);
        assertEquals("登录", item.text);
        assertEquals("登录分类", item.group);
        assertEquals(TestButtonConfig.ButtonStyle.PRIMARY, item.style);
        assertNotNull(item.clickListener);
    }

    @Test
    public void testButtonStyles() {
        // 验证按钮样式常量
        assertEquals(0, TestButtonConfig.NORMAL);
        assertEquals(1, TestButtonConfig.PRIMARY);
        assertEquals(2, TestButtonConfig.ACCENT);
    }

    @Test
    public void testBuilderPattern() {
        List<TestButtonConfig.ButtonGroup> groups = TestButtonConfig.builder()
                .group("测试组", "⚡")
                .button("btn1", "按钮1", v -> {})
                .button("btn2", "按钮2", TestButtonConfig.PRIMARY, v -> {})
                .button("btn3", "按钮3", TestButtonConfig.ACCENT, v -> {})
                .build();

        assertEquals(1, groups.size());

        TestButtonConfig.ButtonGroup group = groups.get(0);
        assertEquals("测试组", group.name);
        assertEquals("⚡", group.emoji);
        assertEquals(3, group.buttons.size());

        // 验证按钮样式
        assertEquals(TestButtonConfig.ButtonStyle.DEFAULT, group.buttons.get(0).style);
        assertEquals(TestButtonConfig.ButtonStyle.PRIMARY, group.buttons.get(1).style);
        assertEquals(TestButtonConfig.ButtonStyle.ACCENT, group.buttons.get(2).style);
    }

    @Test
    public void testButtonStyleFromInt() {
        assertEquals(TestButtonConfig.ButtonStyle.DEFAULT, TestButtonConfig.ButtonStyle.fromInt(0));
        assertEquals(TestButtonConfig.ButtonStyle.PRIMARY, TestButtonConfig.ButtonStyle.fromInt(1));
        assertEquals(TestButtonConfig.ButtonStyle.ACCENT, TestButtonConfig.ButtonStyle.fromInt(2));
        // 无效值应返回 DEFAULT
        assertEquals(TestButtonConfig.ButtonStyle.DEFAULT, TestButtonConfig.ButtonStyle.fromInt(99));
    }

    @Test
    public void testButtonGroupAddChain() {
        TestButtonConfig.ButtonGroup group = new TestButtonConfig.ButtonGroup("链式测试", "🔗")
                .add("btn1", "按钮1", v -> {})
                .add("btn2", "按钮2", TestButtonConfig.PRIMARY, v -> {})
                .add("btn3", "按钮3", TestButtonConfig.ACCENT, v -> {});

        assertEquals(3, group.buttons.size());
        assertEquals("btn1", group.buttons.get(0).id);
        assertEquals("btn2", group.buttons.get(1).id);
        assertEquals("btn3", group.buttons.get(2).id);
    }
}
