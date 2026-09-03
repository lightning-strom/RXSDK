package com.ruixue.utils;

import com.ruixue.support.BaseUnitTest;
import com.ruixue.support.TestConstants;

import org.junit.Test;

import java.nio.charset.StandardCharsets;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

/**
 * GZIPUtils 单元测试：compress/uncompress 往返、uncompressToString、空与 null、编码。
 */
public class GZIPUtilsTest extends BaseUnitTest {

    @Test
    public void testCompressUncompress_roundTrip() {
        String plain = TestConstants.PLAINTEXT_LONG;
        byte[] compressed = GZIPUtils.compress(plain);
        assertNotNull(compressed);
        byte[] uncompressed = GZIPUtils.uncompress(compressed);
        assertNotNull(uncompressed);
        assertEquals(plain, new String(uncompressed, StandardCharsets.UTF_8));
    }

    @Test
    public void testUncompressToString_utf8() {
        String plain = "hello 世界";
        byte[] compressed = GZIPUtils.compress(plain, GZIPUtils.GZIP_ENCODE_UTF_8);
        assertNotNull(compressed);
        String back = GZIPUtils.uncompressToString(compressed, GZIPUtils.GZIP_ENCODE_UTF_8);
        assertNotNull(back);
        assertEquals(plain, back);
    }

    @Test
    public void testCompress_nullOrEmpty() {
        assertNull(GZIPUtils.compress(null));
        assertNull(GZIPUtils.compress(""));
    }

    @Test
    public void testUncompress_nullOrEmpty() {
        assertNull(GZIPUtils.uncompress(null));
        assertNull(GZIPUtils.uncompress(new byte[0]));
    }

    @Test
    public void testUncompressToString_nullOrEmpty() {
        assertNull(GZIPUtils.uncompressToString(null));
        assertNull(GZIPUtils.uncompressToString(new byte[0]));
    }

    @Test
    public void testCompress_withEncoding() {
        String plain = TestConstants.PLAINTEXT_ZH;
        byte[] compressed = GZIPUtils.compress(plain, GZIPUtils.GZIP_ENCODE_UTF_8);
        assertNotNull(compressed);
        String back = GZIPUtils.uncompressToString(compressed, GZIPUtils.GZIP_ENCODE_UTF_8);
        assertEquals(plain, back);
    }
}
