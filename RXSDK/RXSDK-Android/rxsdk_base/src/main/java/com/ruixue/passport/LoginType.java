package com.ruixue.passport;

import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.annotation.StringDef;

import com.ruixue.utils.ResUtils;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.util.HashSet;

public class LoginType extends LoginMethod {
    public LoginType(@NonNull String method, String ext) {
        super(method, ext);
    }
}


