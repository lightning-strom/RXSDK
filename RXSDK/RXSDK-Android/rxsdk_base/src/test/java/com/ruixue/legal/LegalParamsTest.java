package com.ruixue.legal;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

/**
 * LegalParams 单元测试
 * 
 * @author ROC LEE
 * @date 2026/1/19
 */
public class LegalParamsTest {

    @Test
    public void testLegalParams_Creation() {
        LegalParams params = new LegalParams();
        
        assertNull("Default keys should be null", params.getKeys());
        assertNull("Default extension should be null", params.getExtension());
    }

    @Test
    public void testLegalParams_WithKeys() {
        LegalParams params = new LegalParams("privacy,terms");
        
        assertEquals("Keys should match", "privacy,terms", params.getKeys());
    }

    @Test
    public void testLegalParams_ChainedSetters() {
        Map<String, Object> extension = new HashMap<>();
        extension.put("version", "1.0");
        
        LegalParams params = new LegalParams()
            .setKeys("privacy,terms")
            .setExtension(extension);
        
        assertEquals("Keys should match", "privacy,terms", params.getKeys());
        assertNotNull("Extension should not be null", params.getExtension());
        assertEquals("Version should match", "1.0", params.getExtension().get("version"));
    }

    @Test
    public void testLegalParams_ToMap() {
        LegalParams params = new LegalParams("privacy,terms");
        
        Map<String, Object> map = params.toMap();
        
        assertNotNull("Map should not be null", map);
        assertEquals("Keys should match", "privacy,terms", map.get("keys"));
    }

    @Test
    public void testLegalParams_ToJSONObject() {
        LegalParams params = new LegalParams("privacy");
        
        assertNotNull("JSONObject should not be null", params.toJSONObject());
    }

    @Test
    public void testLegalParams_ToJSONString() {
        LegalParams params = new LegalParams("privacy");
        
        String jsonString = params.toJSONString();
        assertNotNull("JSON string should not be null", jsonString);
        assertTrue("JSON string should contain keys", jsonString.contains("keys"));
    }
}
