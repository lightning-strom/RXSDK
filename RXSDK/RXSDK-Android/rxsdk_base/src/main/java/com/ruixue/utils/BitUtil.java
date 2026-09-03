package com.ruixue.utils;

public class BitUtil {

    public static int getBitOn(int x, int offset) {
        return ((x & (1 << offset)) >> offset);
    }

    public static boolean IsBitOn(int x, int offset) {
        return getBitOn(x, offset) == 1;
    }

}
