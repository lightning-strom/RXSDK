package com.ruixue.update;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

/**
 * UpdateAppParams 单元测试
 * 
 * @author ROC LEE
 * @date 2026/1/19
 */
public class UpdateAppParamsTest {

    @Test
    public void testUpdateAppParams_BasicConstructor() {
        UpdateAppParams params = new UpdateAppParams("1.0.0", "CN");
        
        assertEquals("Version should match", "1.0.0", params.getVersion());
        assertEquals("Region should match", "CN", params.getRegion());
        assertNull("Type should be null", params.getType());
    }

    @Test
    public void testUpdateAppParams_WithType() {
        UpdateAppParams params = new UpdateAppParams("1.0.0", "CN", "lua");
        
        assertEquals("Version should match", "1.0.0", params.getVersion());
        assertEquals("Region should match", "CN", params.getRegion());
        assertEquals("Type should match", "lua", params.getType());
    }

    @Test
    public void testUpdateAppParams_ChainedSetters() {
        UpdateAppParams params = new UpdateAppParams("1.0.0", "CN")
            .setType("lua")
            .setFormat("lua")
            .setActivityShortname("activity1")
            .setActivityVersion("1.0")
            .setActivityCheckVersion("0.9")
            .setGameId("game123")
            .setGameVersion("2.0")
            .setGameCheckVersion("1.9");
        
        assertEquals("Type should match", "lua", params.getType());
        assertEquals("Format should match", "lua", params.getFormat());
        assertEquals("Activity shortname should match", "activity1", params.getActivityShortname());
        assertEquals("Activity version should match", "1.0", params.getActivityVersion());
        assertEquals("Activity check version should match", "0.9", params.getActivityCheckVersion());
        assertEquals("Game ID should match", "game123", params.getGameId());
        assertEquals("Game version should match", "2.0", params.getGameVersion());
        assertEquals("Game check version should match", "1.9", params.getGameCheckVersion());
    }

    @Test
    public void testUpdateAppParams_GamesAndActivities() {
        Map<String, Object> games = new HashMap<>();
        games.put("game1", "1.0.0");
        games.put("game2", "2.0.0");
        
        Map<String, Object> activities = new HashMap<>();
        activities.put("activity1", "1.0");
        activities.put("activity2", "2.0");
        
        UpdateAppParams params = new UpdateAppParams("1.0.0", "CN")
            .setGames(games)
            .setActivities(activities);
        
        assertNotNull("Games should not be null", params.getGames());
        assertEquals("Game1 version should match", "1.0.0", params.getGames().get("game1"));
        assertNotNull("Activities should not be null", params.getActivities());
        assertEquals("Activity1 version should match", "1.0", params.getActivities().get("activity1"));
    }

    @Test
    public void testUpdateAppParams_ToMap() {
        UpdateAppParams params = new UpdateAppParams("1.0.0", "CN")
            .setType("lua")
            .setFormat("lua");
        
        Map<String, Object> map = params.toMap();
        
        assertNotNull("Map should not be null", map);
        assertEquals("Version should match", "1.0.0", map.get("version"));
        assertEquals("Region should match", "CN", map.get("region"));
        
        @SuppressWarnings("unchecked")
        Map<String, Object> queryMap = (Map<String, Object>) map.get("queryMap");
        assertNotNull("QueryMap should not be null", queryMap);
        assertEquals("Type in queryMap should match", "lua", queryMap.get("type"));
        assertEquals("Format in queryMap should match", "lua", queryMap.get("format"));
    }

    @Test
    public void testUpdateAppParams_ToJSONObject() {
        UpdateAppParams params = new UpdateAppParams("1.0.0", "CN");
        
        assertNotNull("JSONObject should not be null", params.toJSONObject());
    }

    @Test
    public void testUpdateAppParams_ToJSONString() {
        UpdateAppParams params = new UpdateAppParams("1.0.0", "CN");
        
        String jsonString = params.toJSONString();
        assertNotNull("JSON string should not be null", jsonString);
        assertTrue("JSON string should contain version", jsonString.contains("version"));
    }
}
