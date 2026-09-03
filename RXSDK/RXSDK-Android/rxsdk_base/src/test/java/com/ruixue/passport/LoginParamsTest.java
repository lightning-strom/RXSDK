package com.ruixue.passport;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

/**
 * LoginParams 单元测试
 * 
 * <p>测试登录参数对象的各种场景</p>
 * 
 * @author ROC LEE
 * @date 2026/1/19
 */
public class LoginParamsTest {

    @Test
    public void testLoginParams_Creation() {
        // 测试 LoginParams 创建
        LoginParams params = new LoginParams();
        assertNotNull("LoginParams should not be null", params);
    }

    @Test
    public void testLoginParams_CreationWithMethod() {
        // 测试带 method 的 LoginParams 创建
        LoginParams params = new LoginParams("wechat");
        assertEquals("Method should be wechat", "wechat", params.getMethod());
    }

    @Test
    public void testLoginParams_SetMethod() {
        // 测试设置登录方法
        LoginParams params = new LoginParams();
        params.setMethod("wechat");
        assertEquals("Method should be wechat", "wechat", params.getMethod());
    }

    @Test
    public void testLoginParams_SetUsername() {
        // 测试设置用户名
        LoginParams params = new LoginParams();
        params.setUsername("testuser");
        assertEquals("Username should match", "testuser", params.getUsername());
    }

    @Test
    public void testLoginParams_SetPassword() {
        // 测试设置密码
        LoginParams params = new LoginParams();
        params.setPassword("password123");
        assertEquals("Password should match", "password123", params.getPassword());
    }

    @Test
    public void testLoginParams_SetLoginOpenid() {
        // 测试设置登录 OpenID
        LoginParams params = new LoginParams();
        params.setLoginOpenid("open_id_12345");
        assertEquals("Login OpenID should match", "open_id_12345", params.getLoginOpenid());
    }

    @Test
    public void testLoginParams_SetExt() {
        // 测试设置扩展参数
        LoginParams params = new LoginParams();
        Map<String, Object> ext = new HashMap<>();
        ext.put("custom_field", "custom_value");
        params.setExt(ext);

        assertNotNull("Ext should not be null", params.getExt());
        assertEquals("Custom field should match", "custom_value", params.getExt().get("custom_field"));
    }

    @Test
    public void testLoginParams_SetSignFields() {
        // 测试设置签名字段
        LoginParams params = new LoginParams();
        String[] signFields = {"field1", "field2"};
        params.setSignFields(signFields);

        // 通过 toMap 验证
        Map<String, Object> map = params.toMap();
        assertNotNull("Map should not be null", map);
    }

    @Test
    public void testLoginParams_SetMigrateArgs() {
        // 测试设置迁移参数
        LoginParams params = new LoginParams();
        Map<String, Object> migrateArgs = new HashMap<>();
        migrateArgs.put("migrate_key", "migrate_value");
        params.setMigrateArgs(migrateArgs);

        // 通过 toMap 验证
        Map<String, Object> map = params.toMap();
        assertNotNull("Map should not be null", map);
    }

    @Test
    public void testLoginParams_SetDevice() {
        // 测试设置设备信息
        LoginParams params = new LoginParams();
        Map<String, Object> device = new HashMap<>();
        device.put("android_id", "android123");
        device.put("oaid", "oaid456");
        params.setDevice(device);

        assertNotNull("Device should not be null", params.getDevice());
        assertEquals("Android ID should match", "android123", params.getDevice().get("android_id"));
    }

    @Test
    public void testLoginParams_SetUserSource() {
        // 测试设置用户来源
        LoginParams params = new LoginParams();
        Map<String, Object> userSource = new HashMap<>();
        userSource.put("source", "invite");
        userSource.put("referrer", "user123");
        params.setUserSource(userSource);

        // 通过 toMap 验证
        Map<String, Object> map = params.toMap();
        assertNotNull("Map should not be null", map);
    }

    @Test
    public void testLoginParams_SetBindThirdParty() {
        // 测试设置绑定第三方
        LoginParams params = new LoginParams();
        params.setBindThirdParty(1);
        assertEquals("Bind third party should be 1", 1, params.getBindThirdParty());
    }

    @Test
    public void testLoginParams_SetWxAppId() {
        // 测试设置微信 AppId
        LoginParams params = new LoginParams();
        params.setWxAppId("wx123456");
        // 通过 toMap 验证
        Map<String, Object> map = params.toMap();
        assertNotNull("Map should not be null", map);
    }

    @Test
    public void testLoginParams_ToMap() {
        // 测试转换为 Map
        LoginParams params = new LoginParams();
        params.setMethod("username");
        params.setUsername("testuser");
        params.setPassword("password123");

        Map<String, Object> map = params.toMap();

        assertNotNull("Map should not be null", map);
        assertEquals("Method should match", "username", map.get("method"));
        assertEquals("Username should match", "testuser", map.get("username"));
    }

    @Test
    public void testLoginParams_ToJSONObject() {
        // 测试转换为 JSONObject
        LoginParams params = new LoginParams();
        params.setMethod("wechat");
        params.setUsername("user");

        assertNotNull("JSONObject should not be null", params.toJSONObject());
    }

    @Test
    public void testLoginParams_ToJSONString() {
        // 测试转换为 JSON 字符串
        LoginParams params = new LoginParams();
        params.setMethod("wechat");

        String jsonString = params.toJSONString();
        assertNotNull("JSON string should not be null", jsonString);
        assertTrue("JSON string should contain method", jsonString.contains("method"));
    }

    @Test
    public void testLoginParams_DefaultValues() {
        // 测试默认值
        LoginParams params = new LoginParams();

        assertNull("Default method should be null", params.getMethod());
        assertNull("Default username should be null", params.getUsername());
        assertNull("Default password should be null", params.getPassword());
        assertNull("Default login openid should be null", params.getLoginOpenid());
        assertNull("Default ext should be null", params.getExt());
        assertNull("Default device should be null", params.getDevice());
        assertEquals("Default bind third party should be 0", 0, params.getBindThirdParty());
    }

    @Test
    public void testLoginParams_EmptyValues() {
        // 测试空值
        LoginParams params = new LoginParams();
        params.setMethod("");
        params.setUsername("");
        params.setPassword("");

        assertEquals("Empty method should be empty string", "", params.getMethod());
        assertEquals("Empty username should be empty string", "", params.getUsername());
        assertEquals("Empty password should be empty string", "", params.getPassword());
    }

    @Test
    public void testLoginParams_SpecialCharacters() {
        // 测试特殊字符
        LoginParams params = new LoginParams();
        params.setUsername("user@example.com");
        params.setPassword("p@ss$word!123");

        assertEquals("Username with special chars", "user@example.com", params.getUsername());
        assertEquals("Password with special chars", "p@ss$word!123", params.getPassword());
    }

    @Test
    public void testLoginParams_ChineseCharacters() {
        // 测试中文字符
        LoginParams params = new LoginParams();
        params.setUsername("用户名");
        params.setPassword("密码123");

        assertEquals("Username with Chinese chars", "用户名", params.getUsername());
        assertEquals("Password with Chinese chars", "密码123", params.getPassword());
    }

    @Test
    public void testLoginParams_LongValues() {
        // 测试长字符串值
        StringBuilder longUsername = new StringBuilder();
        for (int i = 0; i < 100; i++) {
            longUsername.append("a");
        }

        LoginParams params = new LoginParams();
        params.setUsername(longUsername.toString());

        assertEquals("Long username length", 100, params.getUsername().length());
    }

    @Test
    public void testLoginParams_FromMap() {
        // 测试从 Map 创建
        Map<String, Object> map = new HashMap<>();
        map.put("method", "wechat");
        map.put("username", "testuser");

        LoginParams params = LoginParams.fromMap(map);
        assertNotNull("Params should not be null", params);
        assertEquals("Method should match", "wechat", params.getMethod());
    }
}
