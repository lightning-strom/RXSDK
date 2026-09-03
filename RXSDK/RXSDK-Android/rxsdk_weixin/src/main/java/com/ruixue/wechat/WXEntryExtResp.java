package com.ruixue.wechat;

import android.content.Context;

import com.ruixue.reflect.BaseReflectClass;
import com.tencent.mm.opensdk.modelbase.BaseResp;

import java.lang.reflect.Method;

public class WXEntryExtResp extends BaseReflectClass {
    private static final String PLUGIN_NAME = "RX_PLUGIN_PAY_UNIFYPAY";

    public static boolean onResp(Context ctx, BaseResp baseResp) {

        final String packageClassName = getMetaDataVal(ctx, PLUGIN_NAME);
        Class<?> pluginClass = getClass(packageClassName);
        if (pluginClass != null) {
            try {
                Method method = pluginClass.getMethod("onWXResp", Context.class, BaseResp.class);
                method.invoke(null, ctx, baseResp);
                return true;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return false;
    }
}
