package com.ruixue.openapi;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/8/3
 */
public enum PasswordStrength {

    Default(0),
    Custom(1),
    Average(2),
    Strong(3);
    // 存储枚举对应的 int 值
    private final int value;


    PasswordStrength(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }


    public static PasswordStrength fromValue(int value) {

        for (PasswordStrength strength : PasswordStrength.values()) {
            if (strength.value == value) {
                return strength;
            }
        }

        return Default;
    }
}
