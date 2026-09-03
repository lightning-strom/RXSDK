package com.ruixue.socialize.common;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/5/16
 */

import android.content.Context;
import android.content.res.Resources;
import android.text.TextUtils;

import androidx.annotation.NonNull;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

public final class ResUtil {
    private static ResUtil R = null;
    private Map<String, Integer> map = new HashMap<>();
    private Context context = null;
//    private Map<String, ResUtil.SocializeResource> mResources;
    private static String mPackageName = "";

    private ResUtil(Context var1) {
        this.context = var1.getApplicationContext();
    }

    public static synchronized ResUtil get(Context var0) {
        if (R == null) {
            R = new ResUtil(var0);
        }
        return R;
    }

    public int layout(String var1) {
        return getResourceId(this.context, "layout", var1);
    }

    public int id(String var1) {
        return getResourceId(this.context, "id", var1);
    }

    public int drawable(String var1) {
        return getResourceId(this.context, "drawable", var1);
    }

    public int style(String var1) {
        return getResourceId(this.context, "style", var1);
    }

    public int string(String var1) {
        return getResourceId(this.context, "string", var1);
    }

    public int color(String var1) {
        return getResourceId(this.context, "color", var1);
    }

    public int dimen(String var1) {
        return getResourceId(this.context, "dimen", var1);
    }

    public int raw(String var1) {
        return getResourceId(this.context, "raw", var1);
    }

    public int anim(String var1) {
        return getResourceId(this.context, "anim", var1);
    }

    public int styleable(String var1) {
        return getResourceId(this.context, "styleable", var1);
    }

//    public ResUtil(Context var1, Map<String, ResUtil.SocializeResource> var2) {
//        this.mResources = var2;
//        this.context = var1;
//    }

    public static int getResourceId(Context context, String defType, @NonNull String name) {
        Resources var3 = context.getResources();
        if (TextUtils.isEmpty(mPackageName)) {
            mPackageName = context.getPackageName();
        }
        int var4 = var3.getIdentifier(name, defType, mPackageName);
        if (var4 <= 0) {
            throw new RuntimeException("getResourceId error: " + mPackageName +" "+ defType+" " + name);
        } else {
            return var4;
        }
    }

    public static String getString(Context var0, String var1) {
        int var2 = getResourceId(var0, "string", var1);
        return var0.getString(var2);
    }

//    public synchronized Map<String, ResUtil.SocializeResource> batch() {
//        if (this.mResources == null) {
//            return this.mResources;
//        } else {
//            Set var1 = this.mResources.keySet();
//
//            ResUtil.SocializeResource var4;
//            for (Iterator var2 = var1.iterator(); var2.hasNext(); var4.mIsCompleted = true) {
//                String var3 = (String) var2.next();
//                var4 = (ResUtil.SocializeResource) this.mResources.get(var3);
//                var4.mId = getResourceId(this.context, var4.mType, var4.mName);
//            }
//
//            return this.mResources;
//        }
//    }
//
//    public static class SocializeResource {
//        public String mType;
//        public String mName;
//        public boolean mIsCompleted = false;
//        public int mId;
//
//        public SocializeResource(String var1, String var2) {
//            this.mType = var1;
//            this.mName = var2;
//        }
//    }
}