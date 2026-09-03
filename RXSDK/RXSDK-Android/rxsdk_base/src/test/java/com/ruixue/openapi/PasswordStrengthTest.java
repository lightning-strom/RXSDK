package com.ruixue.openapi;

import com.ruixue.support.BaseUnitTest;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertSame;

/**
 * PasswordStrength 枚举单元测试：getValue、fromValue、非法值回退 Default。
 */
public class PasswordStrengthTest extends BaseUnitTest {

    @Test
    public void testGetValue() {
        assertEquals(0, PasswordStrength.Default.getValue());
        assertEquals(1, PasswordStrength.Custom.getValue());
        assertEquals(2, PasswordStrength.Average.getValue());
        assertEquals(3, PasswordStrength.Strong.getValue());
    }

    @Test
    public void testFromValue_known() {
        assertSame(PasswordStrength.Default, PasswordStrength.fromValue(0));
        assertSame(PasswordStrength.Custom, PasswordStrength.fromValue(1));
        assertSame(PasswordStrength.Average, PasswordStrength.fromValue(2));
        assertSame(PasswordStrength.Strong, PasswordStrength.fromValue(3));
    }

    @Test
    public void testFromValue_unknown_returnsDefault() {
        assertSame(PasswordStrength.Default, PasswordStrength.fromValue(-1));
        assertSame(PasswordStrength.Default, PasswordStrength.fromValue(4));
        assertSame(PasswordStrength.Default, PasswordStrength.fromValue(100));
    }

    @Test
    public void testValues() {
        PasswordStrength[] values = PasswordStrength.values();
        assertEquals(4, values.length);
    }
}
