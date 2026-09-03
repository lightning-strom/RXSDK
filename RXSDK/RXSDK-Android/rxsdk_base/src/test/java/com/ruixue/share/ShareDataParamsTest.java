package com.ruixue.share;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import java.util.Map;

/**
 * ShareDataParams 单元测试
 * 
 * @author ROC LEE
 * @date 2026/1/19
 */
public class ShareDataParamsTest {

    @Test
    public void testShareDataParams_Creation() {
        ShareDataParams params = new ShareDataParams("share_func", "CN");
        
        assertEquals("Func should match", "share_func", params.getFunc());
        assertEquals("Region should match", "CN", params.getRegion());
    }

    @Test
    public void testShareDataParams_EmptyRegion() {
        ShareDataParams params = new ShareDataParams("share_func", null);
        
        assertEquals("Region should be empty string", "", params.getRegion());
    }

    @Test
    public void testShareDataParams_ChainedSetters() {
        ShareDataParams params = new ShareDataParams("share_func", "CN")
            .setAppType("minigame")
            .setTransmitargs("transmit123")
            .setCustom("custom_data")
            .setMethod("2")
            .setShare_from("openid123")
            .setShare_first("openid456")
            .setReadCache(true);
        
        assertEquals("App type should match", "minigame", params.getAppType());
        assertEquals("Transmitargs should match", "transmit123", params.getTransmitargs());
        assertEquals("Custom should match", "custom_data", params.getCustom());
        assertEquals("Method should match", "2", params.getMethod());
        assertEquals("Share from should match", "openid123", params.getShare_from());
        assertEquals("Share first should match", "openid456", params.getShare_first());
        assertTrue("Read cache should be true", params.getReadCache());
    }

    @Test
    public void testShareDataParams_ToMap() {
        ShareDataParams params = new ShareDataParams("share_func", "CN")
            .setAppType("minigame");
        
        Map<String, Object> map = params.toMap();
        
        assertNotNull("Map should not be null", map);
        assertEquals("Func should match", "share_func", map.get("func"));
        assertEquals("Region should match", "CN", map.get("region"));
    }

    @Test
    public void testShareDataParams_ToMapWithNullRegion() {
        ShareDataParams params = new ShareDataParams("share_func", null);
        
        Map<String, Object> map = params.toMap();
        
        assertNotNull("Map should not be null", map);
        assertEquals("Region should be empty string", "", map.get("region"));
    }

    @Test
    public void testShareDataParams_ToJSONObject() {
        ShareDataParams params = new ShareDataParams("share_func", "CN");
        
        assertNotNull("JSONObject should not be null", params.toJSONObject());
    }

    @Test
    public void testShareDataParams_ToJSONString() {
        ShareDataParams params = new ShareDataParams("share_func", "CN");
        
        String jsonString = params.toJSONString();
        assertNotNull("JSON string should not be null", jsonString);
        assertTrue("JSON string should contain func", jsonString.contains("func"));
    }
}
