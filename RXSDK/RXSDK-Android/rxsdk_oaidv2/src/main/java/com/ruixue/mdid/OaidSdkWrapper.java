package com.ruixue.mdid;

import android.annotation.SuppressLint;
import android.content.Context;
import android.util.Log;

import com.bun.miitmdid.core.InfoCode;
import com.bun.miitmdid.core.MdidSdkHelper;
import com.bun.miitmdid.interfaces.IIdentifierListener;
import com.bun.miitmdid.interfaces.IdSupplier;
import com.bun.miitmdid.pojo.IdSupplierImpl;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Method;
import java.util.concurrent.atomic.AtomicBoolean;

public final class OaidSdkWrapper extends OaidSdkWrapperV2 {


    private static class Single {
        static OaidSdkWrapperV2 sInstance = new OaidSdkWrapperV2();
    }


    public static OaidSdkWrapperV2 getInstance() {
        return Single.sInstance;
    }

    public static int getVersion() {
        return 2;
    }

    public static void initOaidSdkV2(Context ctx, String certString) {
        getInstance().initOaidSdk(ctx, certString);
    }
}