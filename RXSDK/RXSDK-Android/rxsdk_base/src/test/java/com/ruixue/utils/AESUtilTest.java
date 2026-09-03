package com.ruixue.utils;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import com.ruixue.support.BaseUnitTest;
import com.ruixue.support.TestConstants;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.nio.charset.StandardCharsets;

/**
 * AESUtil 单元测试：CBC/CFB/OFB/CTR 加解密、空串、错误密钥、Base64 兼容性。
 *
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/6/13
 */
public class AESUtilTest extends BaseUnitTest {

    @Before
    public void setUp() {
        System.out.println("setUp");
    }

    @Test
    public void testAES_ECB() {
        String encTestData = TestConstants.PLAINTEXT_ZH;
        byte[] encData = AESUtil.encrypt(encTestData, AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.CBC);
        String encBase64 = new String(encData, StandardCharsets.US_ASCII);
        byte[] decData = AESUtil.decrypt(encBase64, AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.CBC);
        assertEquals(encTestData, new String(decData, StandardCharsets.UTF_8));
    }

    @Test
    public void testAES_CFB() {
        String encTestData = TestConstants.PLAINTEXT_ZH;
        byte[] encData = AESUtil.encrypt(encTestData, AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.CFB);
        String encBase64 = new String(encData, StandardCharsets.US_ASCII);
        byte[] decData = AESUtil.decrypt(encBase64, AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.CFB);
        assertEquals(encTestData, new String(decData, StandardCharsets.UTF_8));
    }

    @Test
    public void testAES_OFB() {
        String encTestData = TestConstants.PLAINTEXT_ZH;
        byte[] encData = AESUtil.encrypt(encTestData, AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.OFB);
        String encBase64 = new String(encData, StandardCharsets.US_ASCII);
        byte[] decData = AESUtil.decrypt(encBase64, AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.OFB);
        assertEquals(encTestData, new String(decData, StandardCharsets.UTF_8));
    }

    @Test
    public void testAES_CTR() {
        String encTestData = TestConstants.PLAINTEXT_ZH;
        byte[] encData = AESUtil.encrypt(encTestData, AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.CTR);
        String encBase64 = new String(encData, StandardCharsets.US_ASCII);
        byte[] decData = AESUtil.decrypt(encBase64, AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.CTR);
        assertEquals(encTestData, new String(decData, StandardCharsets.UTF_8));
    }

    @Test
    public void testAES_emptyString_roundTrip() {
        byte[] enc = AESUtil.encrypt(TestConstants.EMPTY, AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.CBC);
        assertNotNull(enc);
        assertTrue(enc.length > 0);
        byte[] dec = AESUtil.decrypt(new String(enc, StandardCharsets.US_ASCII), AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.CBC);
        assertArrayEquals(TestConstants.EMPTY.getBytes(StandardCharsets.UTF_8), dec);
    }

    @Test
    public void testAES_plaintextEn_roundTrip() {
        String plain = TestConstants.PLAINTEXT_EN;
        byte[] enc = AESUtil.encrypt(plain, AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.CBC);
        byte[] dec = AESUtil.decrypt(new String(enc, StandardCharsets.US_ASCII), AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.CBC);
        assertEquals(plain, new String(dec, StandardCharsets.UTF_8));
    }

    @Test
    public void testAES_wrongKey_decryptReturnsEmptyOrGarbage() {
        String plain = TestConstants.PLAINTEXT_ZH;
        byte[] enc = AESUtil.encrypt(plain, AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.CBC);
        String encBase64 = new String(enc, StandardCharsets.US_ASCII);
        byte[] decWrong = AESUtil.decrypt(encBase64, "wrong_key_16bytes!!", AESUtil.AESType.CBC);
        // 错误密钥时实现返回 new byte[0] 或解密异常后空数组
        assertNotNull(decWrong);
        // 不应等于原文（要么长度为 0，要么内容不同）
        String decStr = new String(decWrong, StandardCharsets.UTF_8);
        assertTrue(decWrong.length == 0 || !plain.equals(decStr));
    }

    @Test
    public void testAES_base64RoundTrip_longPlaintext() {
        String plain = TestConstants.PLAINTEXT_LONG;
        byte[] enc = AESUtil.encrypt(plain, AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.CBC);
        assertNotNull(enc);
        byte[] dec = AESUtil.decrypt(new String(enc, StandardCharsets.US_ASCII), AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.CBC);
        assertEquals(plain, new String(dec, StandardCharsets.UTF_8));
    }

    @After
    public void tearDown() {
        System.out.println("tearDown");
    }
}