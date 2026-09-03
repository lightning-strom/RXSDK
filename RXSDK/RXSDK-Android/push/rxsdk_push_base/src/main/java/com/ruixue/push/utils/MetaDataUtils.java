package com.ruixue.push.utils;

import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Bundle;

public class MetaDataUtils {

    public static Bundle getBundle(Context context) {
        Bundle metaData = null;
        try {
            metaData = context.getPackageManager().getApplicationInfo(context.getPackageName(), PackageManager.GET_META_DATA).metaData;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return metaData;
    }

    public static String getString(Context context, String metaName) {
        Bundle metaData = getBundle(context);
        if (metaData != null) {
           Object val= metaData.get(metaName);
           return String.valueOf(val);
        }else{
             return "";
        }
    }

}
