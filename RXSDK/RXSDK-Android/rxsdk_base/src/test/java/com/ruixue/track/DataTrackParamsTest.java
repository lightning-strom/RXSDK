package com.ruixue.track;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

/**
 * DataTrackParams 单元测试
 * 
 * @author ROC LEE
 * @date 2026/1/19
 */
public class DataTrackParamsTest {

    @Test
    public void testDataTrackParams_BasicConstructor() {
        DataTrackParams params = new DataTrackParams("user_login", "openid123");
        
        assertEquals("Event name should match", "user_login", params.getEventName());
        assertEquals("Distinct ID should match", "openid123", params.getDistinctId());
        assertNull("Properties should be null", params.getProperties());
        assertFalse("Should not have cache config", params.hasCacheConfig());
    }

    @Test
    public void testDataTrackParams_WithProperties() {
        Map<String, Object> properties = new HashMap<>();
        properties.put("platform", "android");
        properties.put("version", "1.0.0");
        
        DataTrackParams params = new DataTrackParams("user_login", "openid123", properties);
        
        assertEquals("Event name should match", "user_login", params.getEventName());
        assertEquals("Distinct ID should match", "openid123", params.getDistinctId());
        assertNotNull("Properties should not be null", params.getProperties());
        assertEquals("Platform should match", "android", params.getProperties().get("platform"));
        assertFalse("Should not have cache config", params.hasCacheConfig());
    }

    @Test
    public void testDataTrackParams_WithCacheConfig() {
        Map<String, Object> properties = new HashMap<>();
        properties.put("platform", "android");
        
        DataTrackParams params = new DataTrackParams("user_login", "openid123", properties, 60, 100);
        
        assertEquals("Event name should match", "user_login", params.getEventName());
        assertEquals("Distinct ID should match", "openid123", params.getDistinctId());
        assertNotNull("Properties should not be null", params.getProperties());
        assertEquals("Flush interval should be 60", Integer.valueOf(60), params.getFlushInterval());
        assertEquals("Max cache count should be 100", Integer.valueOf(100), params.getMaxCacheCount());
        assertTrue("Should have cache config", params.hasCacheConfig());
    }

    @Test
    public void testDataTrackParams_Setters() {
        DataTrackParams params = new DataTrackParams("user_login", "openid123");
        
        params.setEventName("user_logout");
        params.setDistinctId("openid456");
        
        Map<String, Object> properties = new HashMap<>();
        properties.put("action", "logout");
        params.setProperties(properties);
        
        params.setFlushInterval(120);
        params.setMaxCacheCount(200);
        
        assertEquals("Event name should be updated", "user_logout", params.getEventName());
        assertEquals("Distinct ID should be updated", "openid456", params.getDistinctId());
        assertNotNull("Properties should not be null", params.getProperties());
        assertEquals("Action should match", "logout", params.getProperties().get("action"));
        assertEquals("Flush interval should be 120", Integer.valueOf(120), params.getFlushInterval());
        assertEquals("Max cache count should be 200", Integer.valueOf(200), params.getMaxCacheCount());
        assertTrue("Should have cache config", params.hasCacheConfig());
    }

    @Test
    public void testDataTrackParams_ToMap() {
        Map<String, Object> properties = new HashMap<>();
        properties.put("platform", "android");
        
        DataTrackParams params = new DataTrackParams("user_login", "openid123", properties);
        
        Map<String, Object> map = params.toMap();
        
        assertNotNull("Map should not be null", map);
        assertEquals("Event name should match", "user_login", map.get("eventName"));
        assertEquals("Distinct ID should match", "openid123", map.get("distinctId"));
    }

    @Test
    public void testDataTrackParams_HasCacheConfig() {
        DataTrackParams params1 = new DataTrackParams("event1", "id1");
        assertFalse("Should not have cache config", params1.hasCacheConfig());
        
        DataTrackParams params2 = new DataTrackParams("event2", "id2", null, 60, 100);
        assertTrue("Should have cache config", params2.hasCacheConfig());
        
        DataTrackParams params3 = new DataTrackParams("event3", "id3");
        params3.setFlushInterval(60);
        assertFalse("Should not have cache config (missing maxCacheCount)", params3.hasCacheConfig());
        
        params3.setMaxCacheCount(100);
        assertTrue("Should have cache config", params3.hasCacheConfig());
    }
}
