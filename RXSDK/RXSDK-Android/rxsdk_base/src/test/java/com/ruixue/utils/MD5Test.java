package com.ruixue.utils;

import com.ruixue.support.BaseUnitTest;
import com.ruixue.support.TestConstants;

import org.junit.Test;

import java.nio.charset.StandardCharsets;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

/**
 * MD5 单元测试：hexdigest 字符串/字节、空串、UTF-8 中文、一致性。
 */
public class MD5Test extends BaseUnitTest {

    @Test
    public void testHexdigest_string_plain() {
        String out = MD5.hexdigest("hello");
        assertNotNull(out);
        assertEquals(32, out.length());
        assertTrue(out.matches("[0-9a-f]{32}"));
    }

    @Test
    public void testHexdigest_string_utf8Chinese() {
        String out = MD5.hexdigest(TestConstants.PLAINTEXT_ZH);
        assertNotNull(out);
        assertEquals(32, out.length());
    }

    @Test
    public void testHexdigest_consistency() {
        String input = "same input";
        assertEquals(MD5.hexdigest(input), MD5.hexdigest(input));
    }

    @Test
    public void testHexdigest_bytes() {
        byte[] bytes = TestConstants.PLAINTEXT_EN.getBytes(StandardCharsets.UTF_8);
        String out = MD5.hexdigest(bytes);
        assertNotNull(out);
        assertEquals(32, out.length());
        assertEquals(MD5.hexdigest(TestConstants.PLAINTEXT_EN), out);
    }

    @Test
    public void testHexdigest_emptyString() {
        // 空串：hexdigest("") 可能返回 32 位 MD5 of empty
        String out = MD5.hexdigest("");
        assertNotNull(out);
        assertEquals(32, out.length());
    }

    @Test
    public void testHexdigest_emptyBytes() {
        String out = MD5.hexdigest(new byte[0]);
        assertNotNull(out);
        assertEquals(32, out.length());
    }
}
