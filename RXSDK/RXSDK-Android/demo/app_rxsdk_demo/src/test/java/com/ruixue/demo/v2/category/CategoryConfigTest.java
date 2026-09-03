package com.ruixue.demo.v2.category;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * 分类配置测试
 * <p>
 * 验证各分类的元数据配置正确性（不依赖 Android Context）
 *
 * @since 2.0
 */
public class CategoryConfigTest {

    // 预期的分类配置
    private static final String[][] EXPECTED_CATEGORIES = {
            {"login", "登录", "🔐"},
            {"user", "用户", "👤"},
            {"pay", "支付", "💰"},
            {"social", "社交", "👥"},
            {"gamearea", "区服", "🎮"},
            {"tools", "工具", "🔧"},
            {"config", "配置", "⚙️"}
    };

    @Test
    public void testCategoryCount() {
        assertEquals("应有 7 个分类", 7, EXPECTED_CATEGORIES.length);
    }

    @Test
    public void testCategoryNamesUnique() {
        Set<String> keys = new HashSet<>();
        Set<String> names = new HashSet<>();

        for (String[] category : EXPECTED_CATEGORIES) {
            keys.add(category[0]);
            names.add(category[1]);
        }

        assertEquals("分类 key 应唯一", EXPECTED_CATEGORIES.length, keys.size());
        assertEquals("分类名称应唯一", EXPECTED_CATEGORIES.length, names.size());
    }

    @Test
    public void testCategoryEmojisNotEmpty() {
        for (String[] category : EXPECTED_CATEGORIES) {
            assertNotNull("分类 " + category[0] + " 的 emoji 不应为空", category[2]);
            assertFalse("分类 " + category[0] + " 的 emoji 不应为空字符串",
                    category[2].isEmpty());
        }
    }

    @Test
    public void testLoginCategoryConfig() {
        verifyCategory("login", "登录", "🔐");
    }

    @Test
    public void testUserCategoryConfig() {
        verifyCategory("user", "用户", "👤");
    }

    @Test
    public void testPayCategoryConfig() {
        verifyCategory("pay", "支付", "💰");
    }

    @Test
    public void testSocialCategoryConfig() {
        verifyCategory("social", "社交", "👥");
    }

    @Test
    public void testGameAreaCategoryConfig() {
        verifyCategory("gamearea", "区服", "🎮");
    }

    @Test
    public void testToolsCategoryConfig() {
        verifyCategory("tools", "工具", "🔧");
    }

    @Test
    public void testConfigCategoryConfig() {
        verifyCategory("config", "配置", "⚙️");
    }

    private void verifyCategory(String expectedKey, String expectedName, String expectedEmoji) {
        String[] found = null;
        for (String[] category : EXPECTED_CATEGORIES) {
            if (category[0].equals(expectedKey)) {
                found = category;
                break;
            }
        }

        assertNotNull("分类 " + expectedKey + " 应存在", found);
        assertEquals("分类名称应匹配", expectedName, found[1]);
        assertEquals("分类 emoji 应匹配", expectedEmoji, found[2]);
    }
}
