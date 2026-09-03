package com.ruixue.utils;

import com.ruixue.support.BaseUnitTest;

import org.junit.After;
import org.junit.Test;

import java.util.Locale;
import java.util.TimeZone;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

/**
 * DateUtils 单元测试：校验固定 Locale 输出与时区格式稳定性。
 */
public class DateUtilsTest extends BaseUnitTest {

    private final Locale originalLocale = Locale.getDefault();
    private final TimeZone originalTimeZone = TimeZone.getDefault();

    @After
    public void tearDown() {
        Locale.setDefault(originalLocale);
        TimeZone.setDefault(originalTimeZone);
    }

    @Test
    public void testGetMsTime_usesAsciiDigitsUnderArabicLocale() {
        Locale.setDefault(new Locale("ar", "EG"));

        String msTime = DateUtils.getMsTime();

        assertFalse(containsArabicIndicDigits(msTime));
    }

    @Test
    public void testGetTimeZoneDecimal_usesAsciiDigitsUnderArabicLocale() {
        Locale.setDefault(new Locale("ar", "EG"));
        TimeZone.setDefault(TimeZone.getTimeZone("GMT+08:00"));

        String tz = DateUtils.getTimeZoneDecimal();

        assertEquals("8.00", tz);
        assertFalse(containsArabicIndicDigits(tz));
    }

    @Test
    public void testGetTimeZone_returnsIsoOffset() {
        TimeZone.setDefault(TimeZone.getTimeZone("GMT+08:00"));

        String tz = DateUtils.getTimeZone();

        assertEquals("+08:00", tz);
    }

    @Test
    public void testCompareDate_invalidInputReturnsFalse() {
        assertFalse(DateUtils.compareDate("bad-date", "2026-01-01"));
    }

    @Test
    public void testGetDaySub_invalidInputReturnsZero() {
        assertEquals(0, DateUtils.getDaySub("bad-date", "2026-01-01"));
    }

    private boolean containsArabicIndicDigits(String value) {
        for (int i = 0; i < value.length(); i++) {
            char c = value.charAt(i);
            if ((c >= '\u0660' && c <= '\u0669') || (c >= '\u06F0' && c <= '\u06F9')) {
                return true;
            }
        }
        return false;
    }
}
