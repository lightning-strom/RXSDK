package com.ruixue.demo.overseas;

import android.app.Activity;
import android.app.AlertDialog;
import android.text.TextUtils;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ListView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.callback.RXStringCallback;
import com.ruixue.demo.GlobalConfig;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXShareConfig;
import com.google.gson.GsonBuilder;
import com.ruixue.sdk.apkpure.ApkpureSdkWrapper;
import com.ruixue.sdk.google.GoogleSdkWrapper;
import com.ruixue.sdk.rustore.RuStoreSdkWrapper;
import com.vgamepop.android.asdk.base.ValueGetListener;
import com.vgamepop.android.asdk.core.net.entity.Product;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class OverseasHelper {

    private static final String TAG = OverseasHelper.class.getSimpleName();
    private static final int CALLBACK_FROM_SERVER = 0;

    // ==================== 计费点配置 ====================

    public static class BillingItem {
        public final String label;
        public final String goodsTag;
        public final String orderType;
        public final String hqType;

        public BillingItem(String label, String goodsTag) {
            this(label, goodsTag, null, null);
        }

        public BillingItem(String label, String goodsTag, String orderType, String hqType) {
            this.label = label;
            this.goodsTag = goodsTag;
            this.orderType = orderType;
            this.hqType = hqType;
        }

        @NonNull
        @Override
        public String toString() {
            return label;
        }
    }

    private static final List<BillingItem> BILLING_ITEMS = new ArrayList<>();

    static {
        loadBillingItems();
    }

    @SuppressWarnings("unchecked")
    private static void loadBillingItems() {
        try {
            Map<String, Object> ext = GlobalConfig.getExt();
            if (ext != null && ext.containsKey("billing_items")) {
                Object raw = ext.get("billing_items");
                if (raw instanceof List) {
                    for (Object obj : (List<?>) raw) {
                        if (obj instanceof Map) {
                            Map<String, Object> m = (Map<String, Object>) obj;
                            String tag = String.valueOf(m.get("tag"));
                            String label = m.containsKey("label") ? String.valueOf(m.get("label")) : tag;
                            String orderType = m.containsKey("order_type") ? String.valueOf(m.get("order_type")) : null;
                            BILLING_ITEMS.add(new BillingItem(label, tag, orderType, null));
                        }
                    }
                }
            }
        } catch (Exception e) {
            RXLogger.w(TAG, "loadBillingItems from config failed, using defaults: " + e.getMessage());
        }
        if (BILLING_ITEMS.isEmpty()) {
            BILLING_ITEMS.add(new BillingItem("bytest (默认测试)", "bytest"));
            BILLING_ITEMS.add(new BillingItem("rxdy (Google订阅)", "rxdy", "subscribe", null));
            BILLING_ITEMS.add(new BillingItem("rxdy1 (Google订阅)", "rxdy1", "subscribe", null));
            BILLING_ITEMS.add(new BillingItem("rxdy2 (Google订阅)", "rxdy2", "subscribe", null));
            BILLING_ITEMS.add(new BillingItem("842000029", "842000029"));
            BILLING_ITEMS.add(new BillingItem("841000049", "841000049"));
            BILLING_ITEMS.add(new BillingItem("841009999", "841009999"));
            BILLING_ITEMS.add(new BillingItem("rxrupay (RuStore已发布商品)", "rxrupay", null, "rustore"));
            BILLING_ITEMS.add(new BillingItem("vgamepop", "vgamepop"));
            // homeland Apkpure 渠道计费点示例（与下单 goods_tag 对齐）
            BILLING_ITEMS.add(new BillingItem("月卡 (11000240)", "11000240"));
        }
    }

    public interface OnBillingItemSelected {
        void onSelected(BillingItem item);
    }

    public static void showBillingPicker(Activity activity, @Nullable String hqType, OnBillingItemSelected listener) {
        LinearLayout layout = new LinearLayout(activity);
        layout.setOrientation(LinearLayout.VERTICAL);
        int pad = (int) (16 * activity.getResources().getDisplayMetrics().density);
        layout.setPadding(pad, pad, pad, 0);

        EditText input = new EditText(activity);
        input.setHint("输入自定义 goods_tag / productId");
        input.setSingleLine();
        layout.addView(input);

        ListView listView = new ListView(activity);
        ArrayAdapter<BillingItem> adapter = new ArrayAdapter<>(activity, android.R.layout.simple_list_item_1,
                BILLING_ITEMS);
        listView.setAdapter(adapter);
        layout.addView(listView);

        AlertDialog dialog = new AlertDialog.Builder(activity)
                .setTitle("选择计费点")
                .setView(layout)
                .setPositiveButton("使用自定义", (d, which) -> {
                    String custom = input.getText().toString().trim();
                    if (!TextUtils.isEmpty(custom)) {
                        listener.onSelected(new BillingItem(custom, custom, null, hqType));
                    }
                })
                .setNegativeButton("取消", null)
                .create();

        listView.setOnItemClickListener((parent, view, position, id) -> {
            BillingItem selected = BILLING_ITEMS.get(position);
            if (hqType != null) {
                selected = new BillingItem(selected.label, selected.goodsTag, selected.orderType, hqType);
            }
            dialog.dismiss();
            listener.onSelected(selected);
        });

        dialog.show();
    }

    private static RXJSONCallback createPayCallback(Activity activity) {
        return new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                if (data != null)
                    RXLogger.e(data.toString());
                ToastUtils.showToast(activity, data == null ? "支付成功" : data.toString());
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.e(cause.toString());
                ToastUtils.showToast(activity, cause.toString());
            }
        };
    }

    private static void doPay(Activity activity, BillingItem item) {
        doPay(activity, item, null);
    }

    private static void doPay(Activity activity, BillingItem item, @Nullable Integer callbackFrom) {
        Map<String, Object> pay = new HashMap<>();
        pay.put("goods_tag", item.goodsTag);
        pay.put("transmit_args", "billing test");
        pay.put("trade_no", String.valueOf(System.currentTimeMillis()));
        if (!TextUtils.isEmpty(item.orderType)) {
            pay.put("order_type", item.orderType);
        }
        if (!TextUtils.isEmpty(item.hqType)) {
            pay.put("hq_type", item.hqType);
        }
        if (callbackFrom != null) {
            pay.put("callback_from", callbackFrom);
        }
        RXSdkApi.getInstance().pay(activity, pay, createPayCallback(activity));
    }

    public static void payWithPicker(Activity activity, @Nullable String hqType) {
        showBillingPicker(activity, hqType, item -> doPay(activity, item));
    }

    public static void payWithPickerServerMode(Activity activity, @Nullable String hqType) {
        showBillingPicker(activity, hqType, item -> doPay(activity, item, CALLBACK_FROM_SERVER));
    }

    // ==================== 通用登录 ====================

    public static void login(Activity activity, String method) {
        login(activity, method, null);
    }

    public static void login(Activity activity, String method, Map<String, Object> hashMap) {
        Map<String, Object> map = new HashMap<>();
        if (hashMap != null) {
            map.putAll(hashMap);
        }
        if (!TextUtils.isEmpty(method)) {
            map.put("method", method);
        }

        if ("facebook".equals(map.get("method"))) {
            Map<String, Object> extmap = new HashMap<>();
            extmap.put("app_associated_business", true);
            map.put("ext", extmap);
        }

        if ("google".equals(map.get("method")) && !map.containsKey("clientId")) {
            try {
                int resId = activity.getResources().getIdentifier(
                        "google_client_id", "string", activity.getPackageName());
                if (resId != 0) {
                    map.put("clientId", activity.getString(resId));
                }
            } catch (Exception e) {
                RXLogger.w("OverseasHelper", "Failed to resolve google_client_id: " + e.getMessage());
            }
        }

        RXSdkApi.getInstance().login(activity, map, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                activity.runOnUiThread(() -> {
                    String loginMethod = String.valueOf(map.get("method"));
                    ToastUtils.showToast(activity, loginMethod + " 登录成功");
                });
                RXLogger.i(method + " 登录成功, data=" + data);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                activity.runOnUiThread(() -> {
                    String loginMethod = String.valueOf(map.get("method"));
                    ToastUtils.showToast(activity, loginMethod + " 登录失败: " + cause.optString("msg"));
                });
                RXLogger.e(method + " 登录失败：" + cause);
            }
        });
    }

    public static void loginByAccount(Activity activity, String userName, String password) {
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("username", userName);
        hashMap.put("password", password);
        login(activity, "username", hashMap);
    }

    // ==================== 通用支付 ====================

    public static void pay(Activity activity, String goodTag) {
        String tag = goodTag;
        if (TextUtils.isEmpty(tag)) {
            Map<String, Object> ext = GlobalConfig.getExt();
            if (ext != null && ext.get("goods_tag") != null)
                tag = String.valueOf(ext.get("goods_tag"));
        }
        if (TextUtils.isEmpty(tag))
            tag = "bytest";
        doPay(activity, new BillingItem(tag, tag));
    }

    public static void payGoogleSubscribe(Activity activity, @Nullable String goodsTag) {
        String tag = TextUtils.isEmpty(goodsTag) ? "rxdy" : goodsTag;
        doPay(activity, new BillingItem(tag, tag, "subscribe", null));
    }

    public static void payOgood(Activity activity, boolean openBrowser) {
        String tag = null;
        Map<String, Object> ext = GlobalConfig.getExt();
        if (ext != null && ext.get("goods_tag") != null)
            tag = String.valueOf(ext.get("goods_tag"));
        if (TextUtils.isEmpty(tag))
            tag = "bytest";
        BillingItem item = new BillingItem(tag, tag, null, "ogood");
        Map<String, Object> pay = new HashMap<>();
        pay.put("goods_tag", item.goodsTag);
        pay.put("hq_type", "ogood");
        if (openBrowser)
            pay.put("openBrowser", true);
        pay.put("transmit_args", "billing test");
        pay.put("trade_no", String.valueOf(System.currentTimeMillis()));
        RXSdkApi.getInstance().pay(activity, pay, createPayCallback(activity));
    }

    // ==================== Google ====================

    public static void getProductInfo(Activity activity) {
        List<String> productIdList = GoogleSdkWrapper.getInstance().getProductIdList();
        GoogleSdkWrapper.getInstance().getProductsInfo(productIdList, new RXStringCallback() {
            @Override
            public void onSuccess(@Nullable String data) {
                RXLogger.i("product info: " + data);
            }

            @Override
            public void onFailed(int code, String msg, @Nullable String traceId) {
                activity.runOnUiThread(() -> ToastUtils.showToast(activity, code + msg));
                RXLogger.e("queryProductDetailsAsync:" + msg);
            }
        });
    }

    public static void ruStoreReview(Activity activity) {
        RuStoreSdkWrapper.getInstance().alertAppReview(activity, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                RXLogger.i("rustore review success");
                ToastUtils.showToast(activity, "RuStore评分成功");
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.e("rustore review failed: " + cause);
                ToastUtils.showToast(activity, "评分失败: " + cause);
            }
        });
    }

    public static void ruStoreGetProductsInfoWithPicker(Activity activity) {
        showBillingPicker(activity, "rustore", item -> {
            String productId = item.goodsTag == null ? "" : item.goodsTag.trim();
            if (TextUtils.isEmpty(productId)) {
                ToastUtils.showToast(activity, "请先选择有效的商品 ID(goods_tag)");
                return;
            }
            RuStoreSdkWrapper.getInstance().getProductsInfo(Collections.singletonList(productId), new RXJSONCallback() {
                @Override
                public void onSuccess(@Nullable JSONObject data) {
                    RXLogger.i("rustore getProductsInfo success: " + data);
                    ToastUtils.showToast(activity, data == null ? "RuStore商品查询成功" : data.toString());
                }

                @Override
                public void onFailed(@NonNull JSONObject cause) {
                    RXLogger.e("rustore getProductsInfo failed: " + cause);
                    ToastUtils.showToast(activity, "RuStore商品查询失败: " + cause);
                }
            });
        });
    }

    // ==================== VGamePop (Apkpure) ====================

    public static void loginVGamePop(Activity activity) {
        login(activity, "apkpure");
    }

    // ==================== 分享测试 ====================

    public static void shareRedditTest(Activity activity) {
        RXShareConfig config = new RXShareConfig();
        config.setPlatform("reddit");
        config.setFunc("reddit_test");
        config.setAndroidScheme("//com.example.reddit");
        config.setiOSScheme("//com.example.reddit");
        config.setUseScheme("1");
        RuiXueSdk.getApi().share(activity, config, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                RXLogger.i("share success: " + data);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.e("share failed: " + cause);
            }
        });
    }

    /**
     * 拉取 VGamePop 商品。必须先 {@link ApkpureSdkWrapper#init}（传入 {@code apkpure_appid}），
     * 否则 ASDK 常见报错 {@code ASDK not initialized. reason: app info empty}。
     */
    public static void getVGamePopProducts(Activity activity) {
        Map<String, Object> params = new HashMap<>();
        Map<String, Object> ext = GlobalConfig.getExt();
        if (ext != null) {
            params.putAll(ext);
        }
        Object appId = params.get("apkpure_appid");
        if (appId == null || TextUtils.isEmpty(String.valueOf(appId))) {
            String hint = "rxconfig 缺少 ext.apkpure_appid（包名 " + activity.getPackageName() + "）";
            RXLogger.e(TAG, "getVGamePopProducts: " + hint);
            ToastUtils.showToast(activity, hint);
            return;
        }

        ApkpureSdkWrapper.getInstance().init(activity, params, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                ApkpureSdkWrapper.getInstance().getProductsInfo(new ValueGetListener<List<Product>>() {
                    @Override
                    public void onSucceed(List<Product> value) {
                        String json = new GsonBuilder().setPrettyPrinting().create().toJson(value);
                        RXLogger.i("VGP商品 Gson JSON (" + value.size() + "):\n" + json);

                        StringBuilder sb = new StringBuilder("VGP商品(" + value.size() + "):\n");
                        for (Product p : value) {
                            sb.append(p.getId()).append(" - ").append(p.getName())
                                    .append(" ").append(p.getPrice()).append(p.getUnit()).append("\n");
                        }
                        activity.runOnUiThread(() -> ToastUtils.showToast(activity, sb.toString()));
                    }

                    @Override
                    public void onFailed(Throwable throwable) {
                        String msg = throwable != null ? throwable.getMessage() : "unknown";
                        RXLogger.e(TAG, "VGP getProducts failed: " + msg);
                        activity.runOnUiThread(() -> ToastUtils.showToast(activity, "获取商品失败: " + msg));
                    }
                });
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                RXLogger.e(TAG, "VGP init failed (getProducts 前置): " + cause);
                activity.runOnUiThread(() -> ToastUtils.showToast(activity,
                        "VGP 初始化失败: " + cause + "\n核对 apkpure_appid、包名与控制台 SHA1"));
            }
        });
    }

}