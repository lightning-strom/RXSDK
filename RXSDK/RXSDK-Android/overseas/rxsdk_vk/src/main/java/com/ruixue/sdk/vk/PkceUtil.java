package com.ruixue.sdk.vk;

import android.util.Base64;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.UUID;

/**
 * PKCE (Proof Key for Code Exchange) 工具类。
 * 按 RFC 7636 规范生成 code_verifier / code_challenge。
 */
final class PkceUtil {

    private static final String ALLOWED_CHARS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    private static final int VERIFIER_LENGTH = 64;

    private PkceUtil() {
    }

    static String generateCodeVerifier() {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(VERIFIER_LENGTH);
        for (int i = 0; i < VERIFIER_LENGTH; i++) {
            sb.append(ALLOWED_CHARS.charAt(random.nextInt(ALLOWED_CHARS.length())));
        }
        return sb.toString();
    }

    static String generateCodeChallenge(String codeVerifier) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(codeVerifier.getBytes("ISO-8859-1"));
            return Base64.encodeToString(hash, Base64.URL_SAFE | Base64.NO_PADDING | Base64.NO_WRAP);
        } catch (Exception e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }

    static String generateState() {
        return UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "");
    }
}
