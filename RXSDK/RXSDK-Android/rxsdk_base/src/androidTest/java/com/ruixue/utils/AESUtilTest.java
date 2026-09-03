package com.ruixue.utils;

import static org.junit.Assert.assertEquals;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/6/13
 */
public class AESUtilTest {

    @Before
    public void setUp() {
        System.out.println("setUp");
    }

    @Test
    public void testAESDefault() {
//        String encTestData = "aa赛风a";
//        String encData = AESUtil.encrypt(encTestData);
//        System.out.println("AESUtilTest : " + encData);
//        String decData = AESUtil.decrypt(encData);
//        assertEquals(encTestData, decData);

    }

    @Test
    public void testAES_ECB() {
        String encTestData = "aa赛风a";
        byte[] encData = AESUtil.encrypt(encTestData, AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.CBC);
        byte[] decData = AESUtil.decrypt(new String(encData), AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.CBC);
        assertEquals(encTestData, new String(decData));

    }

    @Test
    public void testAES_CFB() {
        String encTestData = "aa赛风a";
        byte[] encData = AESUtil.encrypt(encTestData, AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.CFB);
        byte[] decData = AESUtil.decrypt(new String(encData), AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.CFB);
        assertEquals(encTestData, new String(decData));

    }

    @Test
    public void testAES_OFB() {
        String encTestData = "aa赛风a";
        byte[] encData = AESUtil.encrypt(encTestData, AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.OFB);
        byte[] decData = AESUtil.decrypt(new String(encData), AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.OFB);
        assertEquals(encTestData, new String(decData));

    }

    @Test
    public void testAES_CTR() {
        String encTestData = "aa赛风a";
        byte[] encData = AESUtil.encrypt(encTestData, AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.CTR);
        byte[] decData = AESUtil.decrypt(new String(encData), AESUtil.DEFAULT_ASE_KEY, AESUtil.AESType.CTR);
        assertEquals(encTestData, new String(decData));

    }

    @Test
    public void testAES_CTR_PKCS7() {
//        String encTestData = "aa赛风a";
//        byte[] encData = AESUtil.encrypt(encTestData, AESUtil.paddingSecretKey(AESUtil.DEFAULT_ASE_KEY, 32, AESUtil.PADDING), AESUtil.AESType.CBC, AESUtil.PADDING_MODE_PKCS7);
//        byte[] decData = AESUtil.decrypt(new String(encData), AESUtil.paddingSecretKey(AESUtil.DEFAULT_ASE_KEY, 32, AESUtil.PADDING), AESUtil.AESType.CBC, AESUtil.PADDING_MODE_PKCS7);
//        assertEquals(encTestData, new String(decData));
    }
    @Test
    public void testAES_CTR_des() {
//        String encTestData = "aa赛风a";
//        String key = AESUtil.paddingSecretKey("aaaaa",AESUtil.KEY_LENGTH_128);
//        String encData = AESUtil.encrypt3DES(key, encTestData );
//        String decData = AESUtil.decrypt3DES(key, encData) ;
//        assertEquals(encTestData,  (decData));
    }

    @After
    public void tearDown() {
        System.out.println("tearDown");
    }

}