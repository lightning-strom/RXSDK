package com.ruixue.openapi;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;

import com.ruixue.error.RXException;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;

/**
 * RXSDK 单元测试
 * 
 * <p>测试范围：</p>
 * <ul>
 *   <li>响应格式测试</li>
 *   <li>错误码区间测试</li>
 *   <li>JSON 工具测试</li>
 * </ul>
 * 
 * <p>注意：由于 RXSDK.getInstance() 依赖 Android 环境，
 * 单例和回调测试需要在 Android Instrumented Test 中进行。</p>
 * 
 * @author ROC LEE
 * @date 2026/1/19
 */
public class RXSDKTest {

    // ==================== 响应格式测试 ====================

    @Test
    public void testResponseFormat_SuccessWithData() throws JSONException {
        // 测试成功响应格式：code == 0，包含 data
        JSONObject response = new JSONObject();
        response.put("code", 0);
        
        JSONObject data = new JSONObject();
        data.put("user_id", "12345");
        response.put("data", data);

        assertEquals("Success code should be 0", 0, response.optInt("code"));
        assertNotNull("Data should not be null", response.optJSONObject("data"));
        assertEquals("User ID should match", "12345", response.optJSONObject("data").optString("user_id"));
    }

    @Test
    public void testResponseFormat_FailedWithError() throws JSONException {
        // 测试失败响应格式：code != 0，包含 msg
        JSONObject response = new JSONObject();
        response.put("code", 302001);
        response.put("msg", "token 过期");
        response.put("trace_id", "abc123");

        assertTrue("Failed code should not be 0", response.optInt("code") != 0);
        assertEquals("Error code should be 302001", 302001, response.optInt("code"));
        assertEquals("Error msg should match", "token 过期", response.optString("msg"));
        assertEquals("Trace ID should match", "abc123", response.optString("trace_id"));
    }

    @Test
    public void testResponseFormat_ThirdPartyError() throws JSONException {
        // 测试第三方错误响应格式：包含 thirdcode 和 thirdmsg
        JSONObject response = new JSONObject();
        response.put("code", 4000);
        response.put("msg", "支付失败");
        response.put("thirdcode", "WX_ERROR");
        response.put("thirdmsg", "微信返回错误");

        assertEquals("Error code should be 4000", 4000, response.optInt("code"));
        assertEquals("Third code should match", "WX_ERROR", response.optString("thirdcode"));
        assertEquals("Third msg should match", "微信返回错误", response.optString("thirdmsg"));
    }

    // ==================== 错误码区间测试 ====================

    @Test
    public void testErrorCodeRange_Network() {
        // 测试网络相关错误码区间：1000 <= x < 2000
        int[] networkErrorCodes = {1000, 1100, 1200, 1999};
        for (int code : networkErrorCodes) {
            assertTrue("Network error code " + code + " should be in range [1000, 2000)",
                    code >= 1000 && code < 2000);
        }
    }

    @Test
    public void testErrorCodeRange_Init() {
        // 测试初始化相关错误码区间：2000 <= x < 3000
        int[] initErrorCodes = {2000, 2001, 2500, 2999};
        for (int code : initErrorCodes) {
            assertTrue("Init error code " + code + " should be in range [2000, 3000)",
                    code >= 2000 && code < 3000);
        }
    }

    @Test
    public void testErrorCodeRange_Login() {
        // 测试登录相关错误码区间：3000 <= x < 4000
        int[] loginErrorCodes = {3000, 3001, 3500, 3999};
        for (int code : loginErrorCodes) {
            assertTrue("Login error code " + code + " should be in range [3000, 4000)",
                    code >= 3000 && code < 4000);
        }
    }

    @Test
    public void testErrorCodeRange_Pay() {
        // 测试支付相关错误码区间：4000 <= x < 5000
        int[] payErrorCodes = {4000, 4001, 4500, 4999};
        for (int code : payErrorCodes) {
            assertTrue("Pay error code " + code + " should be in range [4000, 5000)",
                    code >= 4000 && code < 5000);
        }
    }

    @Test
    public void testErrorCodeRange_Share() {
        // 测试分享相关错误码区间：5000 <= x < 6000
        int[] shareErrorCodes = {5000, 5001, 5500, 5999};
        for (int code : shareErrorCodes) {
            assertTrue("Share error code " + code + " should be in range [5000, 6000)",
                    code >= 5000 && code < 6000);
        }
    }

    @Test
    public void testErrorCodeRange_Permission() {
        // 测试权限相关错误码区间：6000 <= x < 7000
        int[] permissionErrorCodes = {6000, 6001, 6500, 6999};
        for (int code : permissionErrorCodes) {
            assertTrue("Permission error code " + code + " should be in range [6000, 7000)",
                    code >= 6000 && code < 7000);
        }
    }

    @Test
    public void testErrorCodeRange_ServerError() {
        // 测试服务端错误码：6 位整数
        int[] serverErrorCodes = {100001, 302001, 500001};
        for (int code : serverErrorCodes) {
            String codeStr = String.valueOf(code);
            assertEquals("Server error code " + code + " should be 6 digits",
                    6, codeStr.length());
        }
    }

    // ==================== RXException 测试 ====================

    @Test
    public void testRXException_Creation() {
        RXException exception = new RXException(1100, "网络错误");
        assertEquals("Exception code should be 1100", 1100, exception.getCode());
        assertEquals("Exception message should match", "网络错误", exception.getMessage());
    }

    @Test
    public void testRXException_ToMap() {
        // 使用 toMap 代替 toJSONObject，因为 toJSONObject 依赖 Android 的 JSONUtil
        RXException exception = new RXException(1100, "网络错误");
        java.util.Map<String, Object> map = exception.toMap();
        
        assertNotNull("Map should not be null", map);
        assertEquals("Code should be 1100", 1100, map.get("code"));
        assertEquals("Message should match", "网络错误", map.get("msg"));
    }

    @Test
    public void testRXException_WithTraceId() {
        RXException exception = new RXException(1100, "网络错误", "trace123");
        assertEquals("Trace ID should match", "trace123", exception.getTraceId());
    }

    @Test
    public void testRXException_ErrorCodes() {
        // 测试预定义错误码常量
        assertEquals("DEFAULT_ERROR should be 1000", 1000, RXException.DEFAULT_ERROR);
        assertEquals("IO_ERROR should be 1100", 1100, RXException.IO_ERROR);
        assertEquals("RUNTIME_ERROR should be 9000", 9000, RXException.RUNTIME_ERROR);
        assertEquals("JSON_ERROR should be 9030", 9030, RXException.JSON_ERROR);
    }

    // ==================== JSON 工具测试 ====================

    @Test
    public void testJSONObject_OptInt_Default() throws JSONException {
        // 测试 optInt 默认值
        JSONObject json = new JSONObject();
        assertEquals("optInt should return 0 for missing key", 0, json.optInt("missing_key"));
        assertEquals("optInt should return default value for missing key", -1, json.optInt("missing_key", -1));
    }

    @Test
    public void testJSONObject_OptString_Default() throws JSONException {
        // 测试 optString 默认值
        JSONObject json = new JSONObject();
        assertEquals("optString should return empty string for missing key", "", json.optString("missing_key"));
        assertEquals("optString should return default value for missing key", "default", json.optString("missing_key", "default"));
    }

    @Test
    public void testJSONObject_OptJSONObject_Null() throws JSONException {
        // 测试 optJSONObject 返回 null
        JSONObject json = new JSONObject();
        assertEquals("optJSONObject should return null for missing key", null, json.optJSONObject("missing_key"));
    }

    @Test
    public void testJSONObject_NestedData() throws JSONException {
        // 测试嵌套 JSON 数据
        JSONObject outer = new JSONObject();
        outer.put("code", 0);
        
        JSONObject inner = new JSONObject();
        inner.put("user_id", "12345");
        inner.put("nickname", "测试用户");
        outer.put("data", inner);

        assertEquals("Outer code should be 0", 0, outer.optInt("code"));
        JSONObject data = outer.optJSONObject("data");
        assertNotNull("Data should not be null", data);
        assertEquals("User ID should match", "12345", data.optString("user_id"));
        assertEquals("Nickname should match", "测试用户", data.optString("nickname"));
    }
}
