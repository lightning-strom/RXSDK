package com.ruixue.support;

/**
 * 单元测试用常量，避免魔法字符串与重复字面量。
 */
public final class TestConstants {

    private TestConstants() {}

    /** 默认 AES 测试密钥，与 AESUtil.DEFAULT_ASE_KEY 一致 */
    public static final String AES_DEFAULT_KEY = "cch@1234sis9876~";

    /** 常用 UTF-8 测试原文（含中文） */
    public static final String PLAINTEXT_ZH = "aa赛风a";

    /** 纯英文短串 */
    public static final String PLAINTEXT_EN = "hello";

    /** 空串 */
    public static final String EMPTY = "";

    /** 较长原文，用于边界与编码 */
    public static final String PLAINTEXT_LONG =
            "Ruixue SDK unit test plaintext with 中文 and symbols !@#";
}
