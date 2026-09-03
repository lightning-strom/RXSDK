package com.ruixue.sdk.catappult;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.billing.HQType;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.callback.RXStringCallback;
import com.ruixue.openapi.PluginSdk;

import java.util.List;
import java.util.Map;
import java.util.Objects;

public class CatappultSdkWrapper extends PluginSdk {
    public static final String APTOIDE = "aptoide";

    static class Single {
        final static CatappultSdkWrapper INSTANCE = new CatappultSdkWrapper();
    }

    public static CatappultSdkWrapper getInstance() {
        return Single.INSTANCE;
    }

    public final CatappultBillingImpl billing;

    public CatappultSdkWrapper() {
        this.billing = new CatappultBillingImpl();
    }

    @Override
    public String getName() {
        return APTOIDE;
    }

    @Override
    public boolean init(Context context, Map<String, Object> paramsMap, @Nullable RXJSONCallback callback) {
        billing.init(context, (String) paramsMap.get("catappult_public_key"));
        return true;
    }

    @Override
    public boolean doLogin(Activity activity, Map<String, Object> paramsMap, @NonNull RXJSONCallback callback) {
        return false;
    }

    @Override
    public boolean onLoginResp(int code) {
        return false;
    }

    @Override
    public boolean doLogout(Activity activity, @Nullable OnLogoutCallback callback) {
        return false;
    }

    @Override
    public boolean doPay(Activity activity, Map<String, Object> hashMap, RXJSONCallback callback) {
        if (Objects.equals(hashMap.get(HQType.KEY), APTOIDE)) {
            billing.pay(activity, hashMap, callback);
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param skusList 商品id列表
     * @param callback 商品 json 信息
     */
    public void getProductsInfo(@NonNull List<String> skusList, @NonNull RXStringCallback callback) {
        billing.queryProductDetailsAsync(skusList, callback);
    }

    /**
     * @deprecated Use {@link #getProductsInfo(List, RXStringCallback)}.
     */
    @Deprecated
    public void getProducts(@NonNull List<String> skusList, @NonNull RXStringCallback callback) {
        getProductsInfo(skusList, callback);
    }

    /**
     * @deprecated Use {@link #getProductsInfo(List, RXStringCallback)}.
     */
    @Deprecated
    public void queryProductDetailsAsync(@NonNull List<String> skusList, @NonNull RXStringCallback callback) {
        getProductsInfo(skusList, callback);
    }


    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        billing.onActivityResult(activity, requestCode, resultCode, data);
    }
}