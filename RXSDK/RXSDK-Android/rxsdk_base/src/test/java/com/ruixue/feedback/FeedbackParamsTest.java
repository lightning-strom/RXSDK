package com.ruixue.feedback;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

/**
 * FeedbackParams 单元测试
 * 
 * @author ROC LEE
 * @date 2026/1/19
 */
public class FeedbackParamsTest {

    @Test
    public void testFeedbackParams_Creation() {
        FeedbackParams params = new FeedbackParams();
        
        assertNull("Default kindId should be null", params.getKindId());
        assertNull("Default content should be null", params.getContent());
        assertNull("Default contact should be null", params.getContact());
    }

    @Test
    public void testFeedbackParams_ChainedSetters() {
        FeedbackParams params = new FeedbackParams()
            .setKindId("bug_report")
            .setContent("发现了一个 bug")
            .setContact("user@example.com")
            .setImages("url1,url2")
            .setSatisfaction("5")
            .setComment("很好用");
        
        assertEquals("Kind ID should match", "bug_report", params.getKindId());
        assertEquals("Content should match", "发现了一个 bug", params.getContent());
        assertEquals("Contact should match", "user@example.com", params.getContact());
        assertEquals("Images should match", "url1,url2", params.getImages());
        assertEquals("Satisfaction should match", "5", params.getSatisfaction());
        assertEquals("Comment should match", "很好用", params.getComment());
    }

    @Test
    public void testFeedbackParams_Extension() {
        Map<String, Object> extension = new HashMap<>();
        extension.put("device", "android");
        extension.put("version", "1.0.0");
        
        FeedbackParams params = new FeedbackParams()
            .setKindId("bug_report")
            .setExtension(extension);
        
        assertNotNull("Extension should not be null", params.getExtension());
        assertEquals("Device should match", "android", params.getExtension().get("device"));
        assertEquals("Version should match", "1.0.0", params.getExtension().get("version"));
    }

    @Test
    public void testFeedbackParams_ToMap() {
        FeedbackParams params = new FeedbackParams()
            .setKindId("bug_report")
            .setContent("发现了一个 bug");
        
        Map<String, Object> map = params.toMap();
        
        assertNotNull("Map should not be null", map);
        assertEquals("Kind ID should match", "bug_report", map.get("kindId"));
        assertEquals("Content should match", "发现了一个 bug", map.get("content"));
    }

    @Test
    public void testFeedbackParams_ToJSONObject() {
        FeedbackParams params = new FeedbackParams()
            .setKindId("bug_report")
            .setContent("发现了一个 bug");
        
        assertNotNull("JSONObject should not be null", params.toJSONObject());
    }

    @Test
    public void testFeedbackParams_ToJSONString() {
        FeedbackParams params = new FeedbackParams()
            .setKindId("bug_report")
            .setContent("发现了一个 bug");
        
        String jsonString = params.toJSONString();
        assertNotNull("JSON string should not be null", jsonString);
        assertTrue("JSON string should contain kindId", jsonString.contains("kindId"));
    }

    @Test
    public void testFeedbackParams_SatisfactionEvaluation() {
        FeedbackParams params = new FeedbackParams()
            .setSatisfaction("5")
            .setComment("非常满意");
        
        assertEquals("Satisfaction should match", "5", params.getSatisfaction());
        assertEquals("Comment should match", "非常满意", params.getComment());
    }
}
