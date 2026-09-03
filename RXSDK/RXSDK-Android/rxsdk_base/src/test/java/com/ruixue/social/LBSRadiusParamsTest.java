package com.ruixue.social;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import java.util.Map;

/**
 * LBSRadiusParams 单元测试
 * 
 * @author ROC LEE
 * @date 2026/1/19
 */
public class LBSRadiusParamsTest {

    @Test
    public void testLBSRadiusParams_Creation() {
        LBSRadiusParams params = new LBSRadiusParams("friend", 116.397128f, 39.916527f, 1000f);
        
        assertEquals("Types should match", "friend", params.getTypes());
        assertEquals("Longitude should match", 116.397128f, params.getLongitude(), 0.0001f);
        assertEquals("Latitude should match", 39.916527f, params.getLatitude(), 0.0001f);
        assertEquals("Radius should match", 1000f, params.getRadius(), 0.0001f);
        assertEquals("Default count should be 10", 10, params.getCount());
        assertEquals("Default page should be 1", 1, params.getPage());
        assertEquals("Default pageSize should be 10", 10, params.getPageSize());
    }

    @Test
    public void testLBSRadiusParams_FullConstructor() {
        LBSRadiusParams params = new LBSRadiusParams(
            "friend", 116.397128f, 39.916527f, 1000f, 20, 2, 20
        );
        
        assertEquals("Count should be 20", 20, params.getCount());
        assertEquals("Page should be 2", 2, params.getPage());
        assertEquals("PageSize should be 20", 20, params.getPageSize());
    }

    @Test
    public void testLBSRadiusParams_Setters() {
        LBSRadiusParams params = new LBSRadiusParams("friend", 116.397128f, 39.916527f, 1000f);
        
        params.setTypes("nearby");
        params.setLongitude(120.0f);
        params.setLatitude(30.0f);
        params.setRadius(2000f);
        params.setCount(50);
        params.setPage(3);
        params.setPageSize(25);
        
        assertEquals("Types should be updated", "nearby", params.getTypes());
        assertEquals("Longitude should be updated", 120.0f, params.getLongitude(), 0.0001f);
        assertEquals("Latitude should be updated", 30.0f, params.getLatitude(), 0.0001f);
        assertEquals("Radius should be updated", 2000f, params.getRadius(), 0.0001f);
        assertEquals("Count should be updated", 50, params.getCount());
        assertEquals("Page should be updated", 3, params.getPage());
        assertEquals("PageSize should be updated", 25, params.getPageSize());
    }

    @Test
    public void testLBSRadiusParams_ToMap() {
        LBSRadiusParams params = new LBSRadiusParams("friend", 116.397128f, 39.916527f, 1000f);
        
        Map<String, Object> map = params.toMap();
        
        assertNotNull("Map should not be null", map);
        assertEquals("Types should match", "friend", map.get("types"));
    }

    @Test
    public void testLBSRadiusParams_ToJSONObject() {
        LBSRadiusParams params = new LBSRadiusParams("friend", 116.397128f, 39.916527f, 1000f);
        
        assertNotNull("JSONObject should not be null", params.toJSONObject());
    }

    @Test
    public void testLBSRadiusParams_ToJSONString() {
        LBSRadiusParams params = new LBSRadiusParams("friend", 116.397128f, 39.916527f, 1000f);
        
        String jsonString = params.toJSONString();
        assertNotNull("JSON string should not be null", jsonString);
        assertTrue("JSON string should contain types", jsonString.contains("types"));
    }
}
