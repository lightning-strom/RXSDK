package com.ruixue.passport;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import java.util.Map;

/**
 * UserInfoParams 单元测试
 * 
 * <p>测试用户信息参数对象的各种场景</p>
 * 
 * @author ROC LEE
 * @date 2026/1/19
 */
public class UserInfoParamsTest {

    @Test
    public void testUserInfoParams_Creation() {
        // 测试 UserInfoParams 创建（使用 Builder）
        UserInfoParams params = new UserInfoParams.Builder().build();
        assertNotNull("UserInfoParams should not be null", params);
    }

    @Test
    public void testUserInfoParams_SetNickname() {
        // 测试设置昵称
        UserInfoParams params = new UserInfoParams.Builder()
                .setNickname("TestNickname")
                .build();
        assertEquals("Nickname should match", "TestNickname", params.getNickname());
    }

    @Test
    public void testUserInfoParams_SetAvatarUrl() {
        // 测试设置头像 URL
        UserInfoParams params = new UserInfoParams.Builder()
                .setAvatarUrl("https://example.com/avatar.png")
                .build();
        assertEquals("Avatar URL should match", "https://example.com/avatar.png", params.getAvatarurl());
    }

    @Test
    public void testUserInfoParams_SetRegion() {
        // 测试设置地区
        UserInfoParams params = new UserInfoParams.Builder()
                .setRegion("CN")
                .build();
        assertEquals("Region should match", "CN", params.getRegion());
    }

    @Test
    public void testUserInfoParams_SetSex() {
        // 测试设置性别
        UserInfoParams params = new UserInfoParams.Builder()
                .setSex("1")
                .build();
        assertEquals("Sex should match", "1", params.getSex());
    }

    @Test
    public void testUserInfoParams_SetWechatAvatarUrl() {
        // 测试设置微信头像 URL
        UserInfoParams params = new UserInfoParams.Builder()
                .setWechatAvatarUrl("https://wx.example.com/avatar.png")
                .build();
        assertEquals("Wechat avatar URL should match", "https://wx.example.com/avatar.png", params.getWechat_avatarurl());
    }

    @Test
    public void testUserInfoParams_ToMap() {
        // 测试转换为 Map
        UserInfoParams params = new UserInfoParams.Builder()
                .setNickname("TestNickname")
                .setAvatarUrl("https://example.com/avatar.png")
                .setRegion("CN")
                .setSex("1")
                .build();

        Map<String, Object> map = params.toMap();

        assertNotNull("Map should not be null", map);
        assertEquals("Nickname should match", "TestNickname", map.get("nickname"));
        assertEquals("Avatar URL should match", "https://example.com/avatar.png", map.get("avatarurl"));
    }

    @Test
    public void testUserInfoParams_DefaultValues() {
        // 测试默认值
        UserInfoParams params = new UserInfoParams.Builder().build();

        assertNull("Default nickname should be null", params.getNickname());
        assertNull("Default avatar URL should be null", params.getAvatarurl());
        assertNull("Default region should be null", params.getRegion());
        assertNull("Default sex should be null", params.getSex());
        assertNull("Default wechat avatar URL should be null", params.getWechat_avatarurl());
    }

    @Test
    public void testUserInfoParams_SexValues() {
        // 测试不同的性别值
        UserInfoParams params1 = new UserInfoParams.Builder()
                .setSex("0")
                .build();
        assertEquals("Sex 0 should be unknown", "0", params1.getSex());

        UserInfoParams params2 = new UserInfoParams.Builder()
                .setSex("1")
                .build();
        assertEquals("Sex 1 should be male", "1", params2.getSex());

        UserInfoParams params3 = new UserInfoParams.Builder()
                .setSex("2")
                .build();
        assertEquals("Sex 2 should be female", "2", params3.getSex());
    }

    @Test
    public void testUserInfoParams_ChineseNickname() {
        // 测试中文昵称
        UserInfoParams params = new UserInfoParams.Builder()
                .setNickname("测试用户名")
                .build();
        assertEquals("Chinese nickname should match", "测试用户名", params.getNickname());
    }

    @Test
    public void testUserInfoParams_EmojiNickname() {
        // 测试带表情的昵称
        UserInfoParams params = new UserInfoParams.Builder()
                .setNickname("User😀")
                .build();
        assertEquals("Emoji nickname should match", "User😀", params.getNickname());
    }

    @Test
    public void testUserInfoParams_LongNickname() {
        // 测试长昵称
        StringBuilder longNickname = new StringBuilder();
        for (int i = 0; i < 50; i++) {
            longNickname.append("名");
        }

        UserInfoParams params = new UserInfoParams.Builder()
                .setNickname(longNickname.toString())
                .build();

        assertEquals("Long nickname length", 50, params.getNickname().length());
    }

    @Test
    public void testUserInfoParams_InvalidAvatarUrl() {
        // 测试无效的头像 URL（应该仍然可以设置）
        UserInfoParams params = new UserInfoParams.Builder()
                .setAvatarUrl("not-a-valid-url")
                .build();
        assertEquals("Invalid URL should still be set", "not-a-valid-url", params.getAvatarurl());
    }

    @Test
    public void testUserInfoParams_BuilderChaining() {
        // 测试 Builder 链式调用
        UserInfoParams params = new UserInfoParams.Builder()
                .setNickname("TestUser")
                .setAvatarUrl("https://example.com/avatar.png")
                .setRegion("CN")
                .setSex("1")
                .setWechatAvatarUrl("https://wx.example.com/avatar.png")
                .build();

        assertEquals("Nickname should match", "TestUser", params.getNickname());
        assertEquals("Avatar URL should match", "https://example.com/avatar.png", params.getAvatarurl());
        assertEquals("Region should match", "CN", params.getRegion());
        assertEquals("Sex should match", "1", params.getSex());
        assertEquals("Wechat avatar URL should match", "https://wx.example.com/avatar.png", params.getWechat_avatarurl());
    }

    @Test
    public void testUserInfoParams_PartialUpdate() {
        // 测试部分更新（只设置部分字段）
        UserInfoParams params = new UserInfoParams.Builder()
                .setNickname("NewNickname")
                .build();

        Map<String, Object> map = params.toMap();

        assertNotNull("Map should not be null", map);
        assertEquals("Nickname should match", "NewNickname", map.get("nickname"));
        // 其他字段可能为 null
    }

    @Test
    public void testUserInfoParams_EmptyNickname() {
        // 测试空昵称
        UserInfoParams params = new UserInfoParams.Builder()
                .setNickname("")
                .build();

        assertEquals("Empty nickname should be empty string", "", params.getNickname());
    }

    @Test
    public void testUserInfoParams_SpecialCharactersInNickname() {
        // 测试特殊字符昵称
        UserInfoParams params = new UserInfoParams.Builder()
                .setNickname("User@#$%^&*()")
                .build();

        assertEquals("Special chars nickname should match", "User@#$%^&*()", params.getNickname());
    }
}
