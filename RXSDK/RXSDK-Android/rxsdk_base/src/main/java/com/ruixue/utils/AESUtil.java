package com.ruixue.utils;

import android.annotation.SuppressLint;
import android.util.Base64;

import androidx.annotation.NonNull;
import androidx.annotation.StringDef;

import com.ruixue.logger.RXLogger;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public final class AESUtil {

    //密钥
    static final String DEFAULT_ASE_KEY = "cch@1234sis9876~";
    //偏移量
    static final String DEFAULT_IV_PARAMETER = "1234567890123456";
    //加密类型
    static final String KEY_ALGORITHM = "AES";
    //AES支持三种长度的密钥：128位，192位，256位
    static final int KEY_LENGTH_128 = 128 / 8;
    static final int KEY_LENGTH_192 = 192 / 8;
    static final int KEY_LENGTH_256 = 256 / 8;
    //填充字符
    static final String PADDING = "0";

    /** JVM 与 Android 均支持，AES 块大小下与 PKCS7 等价 */
    static final String PADDING_MODE_PKCS5 = "PKCS5Padding";
    static final String PADDING_MODE_PKCS7 = "PKCS7Padding";
    /** 块模式用 PKCS5，流模式(CFB/OFB/CTR)在 JVM 上需 NoPadding */
    private static final String PADDING_FOR_CIPHER = "PKCS5Padding";
    private static final String PADDING_NONE = "NoPadding";
    static final String PADDING_MODE_ZERO = "ZeroPadding";


    @StringDef({PADDING_MODE_PKCS5, PADDING_MODE_PKCS7, PADDING_MODE_ZERO})
    @Retention(RetentionPolicy.SOURCE)
    @interface PaddingMode {

    }

//    public static String encrypt(String data) {
//        if (data == null) {
//            return null;
//        } else {
//            return new String(encrypt(data, DEFAULT_ASE_KEY, AESType.ECB), StandardCharsets.UTF_8);
//        }
//    }
//
//    public static String decrypt(String data) {
//        if (data == null) {
//            return null;
//        } else {
//            return new String(decrypt(data, DEFAULT_ASE_KEY, AESType.ECB), StandardCharsets.UTF_8);
//        }
//    }


    /** 使用 java.util.Base64，保证单元测试在 JVM 上可跑。编码不插换行，与旧版 Android Base64.DEFAULT 略有差异但解码端通常兼容。 */
    private static byte[] base64Encode(byte[] encData) {
        return java.util.Base64.getEncoder().encode(encData);
    }

    /** 使用 MimeDecoder 以便兼容旧版用 Android Base64.DEFAULT 编码的密文（含换行）。 */
    private static byte[] base64Decode(byte[] decData) {
        return java.util.Base64.getMimeDecoder().decode(decData);
    }

    private static String paddingForCipher(AESType type) {
        return (type == AESType.ECB || type == AESType.CBC) ? PADDING_FOR_CIPHER : PADDING_NONE;
    }

    private static byte[] encrypt(String encrData, String secretKey, AESType type, String paddingMode) {
        try {
            secretKey = paddingSecretKey(secretKey);
            Cipher cipher;
            cipher = Cipher.getInstance(type.transformation(paddingForCipher(type)));

            byte[] aesKeyBytes = secretKey.getBytes();
            SecretKeySpec keySpec = new SecretKeySpec(aesKeyBytes, KEY_ALGORITHM);
            if (type.notNeedIv()) {
                cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            } else {
                cipher.init(Cipher.ENCRYPT_MODE, keySpec, new IvParameterSpec(DEFAULT_IV_PARAMETER.getBytes()));
            }
            byte[] encrypted = cipher.doFinal(encrData.getBytes(StandardCharsets.UTF_8));
            return base64Encode(encrypted);

        } catch (NoSuchAlgorithmException | InvalidAlgorithmParameterException |
                 IllegalBlockSizeException | BadPaddingException | NoSuchPaddingException e) {
            e.printStackTrace();
            return new byte[0];
        } catch (InvalidKeyException e) {
            e.printStackTrace();
            System.out.println("AES key only support bytes length [16,24,32] , " + e.getMessage());
            return new byte[0];
        }
    }

    public static String encrypt(String encrData, String secretKey) {
        return _encrypt(encrData, secretKey);
    }

    private static String _encrypt(String encrData, String secretKey) {
        try {
            AESType type = AESType.ECB;
            String paddingMode = PADDING_MODE_PKCS7;
            secretKey = paddingSecretKey(secretKey);
            Cipher cipher;
            cipher = Cipher.getInstance(type.transformation(paddingForCipher(type)));

            byte[] aesKeyBytes = secretKey.getBytes();
            SecretKeySpec keySpec = new SecretKeySpec(aesKeyBytes, KEY_ALGORITHM);
            if (type.notNeedIv()) {
                cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            } else {
                cipher.init(Cipher.ENCRYPT_MODE, keySpec, new IvParameterSpec(DEFAULT_IV_PARAMETER.getBytes()));
            }
            byte[] encrypted = cipher.doFinal(encrData.getBytes(StandardCharsets.UTF_8));
            return Base64.encodeToString(encrypted, Base64.DEFAULT);


        } catch (NoSuchAlgorithmException | InvalidAlgorithmParameterException | IllegalBlockSizeException | BadPaddingException | NoSuchPaddingException e) {
            e.printStackTrace();
            return "";
        } catch (InvalidKeyException e) {
            e.printStackTrace();
            System.out.println("AES key only support bytes length [16,24,32] , " + e.getMessage());
            return "";
        }
    }

    @NonNull
    public static byte[] encrypt(String encrData, String secretKey, AESType type) {
        return encrypt(encrData, secretKey, type, PADDING_MODE_PKCS7);
    }


    @NonNull
    public static byte[] decrypt(String decrData, String secretKey, AESType type) {
        return decrypt(decrData, secretKey, type, PADDING_MODE_PKCS7);
    }

    @NonNull
    private static byte[] decrypt(String decrData, String secretKey, AESType type, String paddingMode) {
        try {
            secretKey = paddingSecretKey(secretKey);
            byte[] aesKeyBytes = secretKey.getBytes(StandardCharsets.US_ASCII);
            SecretKeySpec keySpec = new SecretKeySpec(aesKeyBytes, KEY_ALGORITHM);
            Cipher cipher = Cipher.getInstance(type.transformation(paddingForCipher(type)));
            if (type.notNeedIv()) {
                cipher.init(Cipher.DECRYPT_MODE, keySpec);
            } else {
                cipher.init(Cipher.DECRYPT_MODE, keySpec, new IvParameterSpec(DEFAULT_IV_PARAMETER.getBytes()));
            }
            byte[] encrypted = base64Decode(decrData.getBytes(StandardCharsets.US_ASCII));
            return cipher.doFinal(encrypted);
        } catch (NoSuchAlgorithmException | NoSuchPaddingException | InvalidAlgorithmParameterException | IllegalBlockSizeException | BadPaddingException e) {
            e.printStackTrace();
            return new byte[0];
        } catch (InvalidKeyException e) {
            e.printStackTrace();
            System.out.println("AES key only support bytes length [16,24,32] , " + e.getMessage());
            return new byte[0];
        }
    }

    //补全 16 字节 密钥
    private static String paddingSecretKey(String key) {
        return paddingSecretKey(key, KEY_LENGTH_128, PADDING);
    }

    private static String paddingSecretKey(String key, int keyLength) {
        return paddingSecretKey(key, keyLength, PADDING);
    }

    private static String paddingSecretKey(String key, int keyLength, CharSequence paddingChar) {
        int strLen = key.length();
        if (strLen < keyLength) {
            StringBuilder strBuilder = new StringBuilder(key);
            while (strLen < keyLength) {
                strBuilder.append(paddingChar);
                strLen = strBuilder.length();
            }
            key = strBuilder.toString();
        }
        return key;
    }

    public enum AESType {
        ECB("ECB", 0),
        CBC("CBC", 1),
        CFB("CFB", 2),
        OFB("OFB", 3),
        CTR("CTR", 4);

        private final String k;
        private final int v;

        AESType(String k, int v) {
            this.k = k;
            this.v = v;
        }

        //是否需要初始向量 ，非ECB 需要初始向量
        public boolean notNeedIv() {
            return v == ECB.value();
        }

        public String transformation(String paddingMode) {
            if (paddingMode == null || paddingMode.length() == 0) {
                paddingMode = PADDING_MODE_PKCS5;
            }
            //算法
            String transformation = "";
            switch (v) {
                case 0:
                    transformation = KEY_ALGORITHM + "/" + AESType.ECB.key() + "/" + paddingMode;
                    break;
                case 1:
                    transformation = KEY_ALGORITHM + "/" + AESType.CBC.key() + "/" + paddingMode;
                    break;
                case 2:
                    transformation = KEY_ALGORITHM + "/" + AESType.CFB.key() + "/" + paddingMode;
                    break;
                case 3:
                    transformation = KEY_ALGORITHM + "/" + AESType.OFB.key() + "/" + paddingMode;
                    break;
                case 4:
                    transformation = KEY_ALGORITHM + "/" + AESType.CTR.key() + "/" + paddingMode;
                    break;
            }
            return transformation;
        }

        public String key() {
            return this.k;
        }

        public int value() {
            return this.v;
        }
    }


    // 算法名称/加密模式/填充方式
    public static final String CIPHER_ALGORITHM = "DESede/ECB/PKCS7Padding";

    /**
     * 加密
     */
    public static String encrypt3DES(String key, String msg) {
        try {
            // 生成密钥
            byte[] bytes = key.getBytes(StandardCharsets.UTF_8);
            System.out.println("密钥字节长度：" + bytes.length);
            SecretKey deskey = new SecretKeySpec(bytes, "DESede");
            // 加密工具
            @SuppressLint("GetInstance") Cipher c1 = Cipher.getInstance(CIPHER_ALGORITHM);
            // 加密
            c1.init(Cipher.ENCRYPT_MODE, deskey);
            byte[] msgBytes = msg.getBytes(StandardCharsets.UTF_8);
            byte[] doFinal = c1.doFinal(msgBytes);
            System.out.println("\n加密后的字节如下：");
            for (int i = 0; i < doFinal.length; i++) {
                System.out.print(doFinal[i] + "\t");
            }
            return HexUtils.bytes2Hex(doFinal);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 解密
     */
    public static String decrypt3DES(String key, String encryptMsg) {
        try {
            // 生成密钥
            byte[] bytes = key.getBytes(StandardCharsets.UTF_8);
            System.out.println("密钥字节长度：" + bytes.length);
            SecretKey deskey = new SecretKeySpec(bytes, "DESede");
            // 初始工具
            @SuppressLint("GetInstance") Cipher instance = Cipher.getInstance(CIPHER_ALGORITHM);
            // DECRYPT_MODE 解密模式
            instance.init(Cipher.DECRYPT_MODE, deskey);

            byte[] doFinal = instance.doFinal(HexUtils.hex2Bytes(encryptMsg));
            return new String(doFinal, StandardCharsets.UTF_8);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private static KEYAndVI keyAndVi(String secret){
        KEYAndVI keyAndVI = new KEYAndVI();
        byte[] key = hexStr2bytes(stringToHex(secret));
        byte[] iv = new byte[16];
        System.arraycopy(key, 0, iv, 0, 16);
        keyAndVI.key = key;
        keyAndVI.vi = iv;
        return keyAndVI;
    }

    private static String stringToHex(String input) {
        // 将字符串转换为字节数组
        byte[] bytes = input.getBytes();
        // 创建 BigInteger 对象
        BigInteger bigInteger = new BigInteger(1, bytes);
        // 将 BigInteger 转换为十六进制字符串
        String hex = bigInteger.toString(16);
        // 补齐前导零
        int paddingLength = (bytes.length * 2) - hex.length();
        if (paddingLength > 0) {
            return String.format("%0" + paddingLength + "d", 0) + hex;
        }
        return hex;
    }

    /**
     * AES加密
     */
    public static String encryptCBCPKCS7(String secret, String content) {
        try {
            KEYAndVI keyAndVI = keyAndVi(secret);
            SecretKeySpec secretKey = new SecretKeySpec(keyAndVI.key, KEY_ALGORITHM);
            Cipher cipher = Cipher.getInstance(AESType.CBC.transformation(PADDING_MODE_PKCS7));
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, new IvParameterSpec(keyAndVI.vi));
            // 获取加密内容的字节数组(这里要设置为utf-8)不然内容中如果有中文和英文混合中文就会解密为乱码
            byte[] byteEncode = content.getBytes(StandardCharsets.UTF_8);

            // 根据密码器的初始化方式加密
            byte[] byteAES = cipher.doFinal(byteEncode);

            // 将加密后的数据转换为字符串
            return Base64.encodeToString(byteAES, Base64.DEFAULT);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String encryptCBCPKCS7(String secret, byte[] byteEncode) {
        try {
            KEYAndVI keyAndVI = keyAndVi(secret);
            SecretKeySpec secretKey = new SecretKeySpec(keyAndVI.key, KEY_ALGORITHM);
            Cipher cipher = Cipher.getInstance(AESType.CBC.transformation(PADDING_MODE_PKCS7));
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, new IvParameterSpec(keyAndVI.vi));
            // 获取加密内容的字节数组(这里要设置为utf-8)不然内容中如果有中文和英文混合中文就会解密为乱码
//            byte[] byteEncode = content.getBytes(StandardCharsets.UTF_8);

            // 根据密码器的初始化方式加密
            byte[] byteAES = cipher.doFinal(byteEncode);

            // 将加密后的数据转换为字符串
            return Base64.encodeToString(byteAES, Base64.DEFAULT);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


    /**
     * AES解密
     */
    public static String decryptCBCPKCS7(String secret, String content) {
        try {
            KEYAndVI keyAndVI = keyAndVi(secret);
            SecretKey secretKey = new SecretKeySpec(keyAndVI.key, KEY_ALGORITHM);
            Cipher cipher = Cipher.getInstance(AESType.CBC.transformation(PADDING_MODE_PKCS7));
            cipher.init(javax.crypto.Cipher.DECRYPT_MODE, secretKey, new IvParameterSpec(keyAndVI.vi));

            // 将加密并编码后的内容解码成字节数组
            byte[] byteContent = Base64.decode(content, Base64.DEFAULT);
            // 解密
            byte[] byteDecode = cipher.doFinal(byteContent);
            return new String(byteDecode, StandardCharsets.UTF_8);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /*
     * 十六进制转byte[]数组
     */
    private static byte[] hexStr2bytes(String hex) {
        int len = hex.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(hex.charAt(i), 16) << 4)
                    + Character.digit(hex.charAt(i + 1), 16));
        }
        return data;
    }

    private static class KEYAndVI{
        public byte[] key;
        public byte[] vi;
    }

}
