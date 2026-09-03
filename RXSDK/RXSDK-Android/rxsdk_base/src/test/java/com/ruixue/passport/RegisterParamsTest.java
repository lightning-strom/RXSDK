package com.ruixue.passport;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

/**
 * RegisterParams 单元测试
 * 
 * <p>测试注册参数对象的各种场景</p>
 * 
 * @author ROC LEE
 * @date 2026/1/19
 */
public class RegisterParamsTest {

    @Test
    public void testRegisterParams_Creation() {
        // 测试 RegisterParams 创建
        RegisterParams params = new RegisterParams();
        assertNotNull("RegisterParams should not be null", params);
    }

    @Test
    public void testRegisterParams_SetUsername() {
        // 测试设置用户名
        RegisterParams params = new RegisterParams();
        params.setUsername("newuser");
        
        Map<String, Object> map = params.toMap();
        assertEquals("Username should match", "newuser", map.get("username"));
    }

    @Test
    public void testRegisterParams_SetPassword() {
        // 测试设置密码
        RegisterParams params = new RegisterParams();
        params.setPassword("password123");
        
        Map<String, Object> map = params.toMap();
        assertNotNull("Password should exist", map.get("password"));
    }

    @Test
    public void testRegisterParams_SetCaptchaCode() {
        // 测试设置验证码
        RegisterParams params = new RegisterParams();
        params.setCaptcha_code("654321");
        
        Map<String, Object> map = params.toMap();
        assertEquals("Captcha code should match", "654321", map.get("captcha_code"));
    }

    @Test
    public void testRegisterParams_SetNickname() {
        // 测试设置昵称
        RegisterParams params = new RegisterParams();
        params.setNickname("TestNickname");
        
        Map<String, Object> map = params.toMap();
        assertEquals("Nickname should match", "TestNickname", map.get("nickname"));
    }

    @Test
    public void testRegisterParams_SetSex() {
        // 测试设置性别
        RegisterParams params = new RegisterParams();
        params.setSex("1");
        
        Map<String, Object> map = params.toMap();
        assertEquals("Sex should match", "1", map.get("sex"));
    }

    @Test
    public void testRegisterParams_SetAvatarUrl() {
        // 测试设置头像 URL
        RegisterParams params = new RegisterParams();
        params.setAvatarUrl("https://example.com/avatar.png");
        
        Map<String, Object> map = params.toMap();
        assertEquals("Avatar URL should match", "https://example.com/avatar.png", map.get("avatarUrl"));
    }

    @Test
    public void testRegisterParams_SetUserSource() {
        // 测试设置用户来源
        RegisterParams params = new RegisterParams();
        Map<String, Object> userSource = new HashMap<>();
        userSource.put("source", "invite");
        userSource.put("referrer", "user123");
        params.setUser_source(userSource);

        Map<String, Object> map = params.toMap();
        assertNotNull("User source should exist", map.get("user_source"));
    }

    @Test
    public void testRegisterParams_SetDevice() {
        // 测试设置设备信息
        RegisterParams params = new RegisterParams();
        Map<String, Object> device = new HashMap<>();
        device.put("android_id", "android123");
        params.setDevice(device);

        Map<String, Object> map = params.toMap();
        assertNotNull("Device should exist", map.get("device"));
    }

    @Test
    public void testRegisterParams_SetMigrateArgs() {
        // 测试设置迁移参数
        RegisterParams params = new RegisterParams();
        Map<String, Object> migrateArgs = new HashMap<>();
        migrateArgs.put("migrate_key", "migrate_value");
        params.setMigrate_args(migrateArgs);

        Map<String, Object> map = params.toMap();
        assertNotNull("Migrate args should exist", map.get("migrate_args"));
    }

    @Test
    public void testRegisterParams_ToMap() {
        // 测试转换为 Map
        RegisterParams params = new RegisterParams();
        params.setUsername("testuser");
        params.setPassword("password123");
        params.setCaptcha_code("123456");

        Map<String, Object> map = params.toMap();

        assertNotNull("Map should not be null", map);
        assertEquals("Username should match", "testuser", map.get("username"));
    }

    @Test
    public void testRegisterParams_ToJSONObject() {
        // 测试转换为 JSONObject
        RegisterParams params = new RegisterParams();
        params.setUsername("testuser");

        assertNotNull("JSONObject should not be null", params.toJSONObject());
    }

    @Test
    public void testRegisterParams_ToJSONString() {
        // 测试转换为 JSON 字符串
        RegisterParams params = new RegisterParams();
        params.setUsername("testuser");

        String jsonString = params.toJSONString();
        assertNotNull("JSON string should not be null", jsonString);
        assertTrue("JSON string should contain username", jsonString.contains("username"));
    }

    @Test
    public void testRegisterParams_PhoneNumber() {
        // 测试手机号作为用户名
        RegisterParams params = new RegisterParams();
        params.setUsername("13800138000");

        Map<String, Object> map = params.toMap();
        assertEquals("Phone username should match", "13800138000", map.get("username"));
    }

    @Test
    public void testRegisterParams_Email() {
        // 测试邮箱作为用户名
        RegisterParams params = new RegisterParams();
        params.setUsername("test@example.com");

        Map<String, Object> map = params.toMap();
        assertEquals("Email username should match", "test@example.com", map.get("username"));
    }

    @Test
    public void testRegisterParams_PasswordComplexity() {
        // 测试复杂密码
        RegisterParams params = new RegisterParams();
        String complexPassword = "P@ssw0rd!123";
        params.setPassword(complexPassword);

        Map<String, Object> map = params.toMap();
        assertNotNull("Password should exist", map.get("password"));
    }

    @Test
    public void testRegisterParams_FromMap() {
        // 测试从 Map 创建
        Map<String, Object> map = new HashMap<>();
        map.put("username", "testuser");
        map.put("password", "password123");

        RegisterParams params = RegisterParams.fromMap(map);
        assertNotNull("Params should not be null", params);
    }

    @Test
    public void testRegisterParams_ChineseNickname() {
        // 测试中文昵称
        RegisterParams params = new RegisterParams();
        params.setNickname("测试用户");

        Map<String, Object> map = params.toMap();
        assertEquals("Chinese nickname should match", "测试用户", map.get("nickname"));
    }
}
