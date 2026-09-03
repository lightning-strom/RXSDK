package com.ruixue.demo.helper;
import com.ruixue.demo.GlobalConfig;

import android.app.Activity;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.billing.BillingClient;
import com.ruixue.demo.config.DemoTestConfig;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.utils.ObjectUtils;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class PayTestHelper {
    public static final String TAG = PayTestHelper.class.getSimpleName();

    /** 由 BillingHelper / PayModule 设置，非空时覆盖所有支付的 goods_tag */
    public static volatile String selectedGoodsTag;


    //    {
//  "mode": 0,
//  "scene_tag": "string",
//  "window_id": 0,
//  "window_version": "string",
//  "cp_gift_tag": "string",
//  "cp_prop_tag": "string",
//  "cp_prop_number": 0,
//  "item_list": [
//    {
//      "number": 0,
//      "tag": "string"
//    }
//  ]
//}
    public static void exchange(Activity activity, RXJSONCallback callback) {
        Log.e(TAG, "cmmmand+p goto: " + ((new Throwable().getStackTrace()[0])).getFileName() + " " + ((new Throwable().getStackTrace()[0])).getLineNumber());

        RuiXueSdk.getApi().getOperationScene(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                RXLogger.i("" + data);
                Map<String, Object> pay = new HashMap<>();
                pay.put("exchange", true);
                pay.put("mode", 1); // 模式

                JSONArray list = data.optJSONArray("list");

                JSONObject wind1 = list.optJSONObject(1);
                pay.put("scene_tag", wind1.optString("tag")); // 场景标识
                JSONArray buttonList = wind1.optJSONArray("button_list");
                if (buttonList != null && buttonList.length() > 0) {
                    JSONObject button = buttonList.optJSONObject(0);
                    JSONArray windowList = button.optJSONArray("window_list");
                    if (windowList != null && windowList.length() > 0) {
                        JSONObject window = windowList.optJSONObject(0);
                        pay.put("window_id", window.optInt("id")); // 窗口 ID
                        pay.put("window_version", window.optString("version")); // 窗口版本
//
//                        JSONArray giftList = window.optJSONArray("gift_list");
//                        if (giftList != null && giftList.length() > 0) {
//                            JSONObject gift = giftList.optJSONObject(0);
//                            pay.put("cp_gift_tag", gift.optString("tag")); // 礼物标识
//
//                            JSONObject goods = gift.optJSONObject("goods");
//                            if (goods != null) {
//                                JSONArray props = goods.optJSONArray("props");
//                                if (props != null && props.length() > 0) {
//                                    JSONObject prop = props.optJSONObject(0);
//                                    pay.put("cp_prop_tag", prop.optString("tag")); // 道具标识
//                                    pay.put("cp_prop_number", prop.optInt("number")); // 道具数量
//                                }
//                            }
//                        }
                    }
                }

                pay.put("cp_prop_tag", "hi");
                pay.put("cp_prop_number", 11);
                pay.put("cp_gift_tag", "a3");


                // 构造 item_list
                List<Map<String, Object>> itemList = new ArrayList<>();

                if (buttonList != null) {
//                    for (int i = 0; i < buttonList.length(); i++) {
                    JSONObject button = buttonList.optJSONObject(0);
                    JSONArray windowList = button.optJSONArray("window_list");
                    if (windowList != null) {
//                            for (int j = 0; j < windowList.length(); j++) {
                        JSONObject window = windowList.optJSONObject(0);
                        JSONArray giftList = window.optJSONArray("gift_list");
                        if (giftList != null) {
//                    for (int k = 0; k < giftList.length(); k++) {
                            JSONObject gift = giftList.optJSONObject(1);//第二条
                            JSONObject rx_gift = gift.optJSONObject("rx_gift");
                            String giftname = gift.optString("name");
                            RXLogger.i("giftname:" + giftname);

                            if (rx_gift != null) {
                                JSONArray props = rx_gift.optJSONArray("list");
                                if (props != null) {
                                    for (int l = 0; l < props.length(); l++) {
                                        JSONObject prop = props.optJSONObject(l);
                                        if (prop != null) {
                                            Map<String, Object> item = new HashMap<>();
                                            item.put("number", prop.optInt("number"));
                                            item.put("tag", prop.optString("tag"));
                                            itemList.add(item);
                                        }
                                    }
                                }

                            }
                        }

//                }
//                            }
//                        }

                    }
                }


                pay.put("item_list", itemList); // 将 item_list 添加到 pay

                PayTestHelper.pay(activity, pay, callback);
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                callback.onFailed(cause);
            }
        });

    }

    public static void pay(Activity activity, String method, RXJSONCallback callback) {
        Log.e(TAG, "cmmmand+p goto: " + ((new Throwable().getStackTrace()[0])).getFileName() + " " + ((new Throwable().getStackTrace()[0])).getLineNumber());
        Map<String, Object> pay = new HashMap<>();
        if (!TextUtils.isEmpty(method)) {
            pay.put(BillingClient.KEY_HQ_TYPE, method);
        }
        PayTestHelper.pay(activity, pay, callback);
    }

    public static void pay(Activity activity, Map<String, Object> pay, RXJSONCallback callback) {
        Log.e(TAG, "cmmmand+p goto: " + ((new Throwable().getStackTrace()[0])).getFileName() + " " + ((new Throwable().getStackTrace()[0])).getLineNumber());

        if (!TextUtils.isEmpty(selectedGoodsTag)) {
            pay.put("goods_tag", selectedGoodsTag);
        } else {
            String goods_tag;
            if (GlobalConfig.getExt() == null) {
                goods_tag = DemoTestConfig.GOODS_TAG_DEFAULT;
            } else {
                goods_tag = (String) GlobalConfig.getExt().get("goods_tag");
            }
            if (!GlobalConfig.getConfig().isTest() && !TextUtils.isEmpty(goods_tag)) {
                pay.put("goods_tag", goods_tag);
            } else if (!pay.containsKey("goods_tag")) {
                pay.put("goods_tag", DemoTestConfig.GOODS_TAG_DEFAULT);
            }
        }
        pay.put("trade_no", String.valueOf(System.currentTimeMillis()));
        Map<String, Object> envExt = GlobalConfig.getExt();
        // bilibili 渠道才需要 game_money
        if (needGameMoney(pay, envExt)) {
            pay.put("game_money", 1);
        }
        // 仅配置显式给出 env 时才透传，避免默认塞 0
        if (envExt != null && envExt.containsKey("env") && !pay.containsKey("env")) {
            pay.put("env", ObjectUtils.toInt(envExt.get("env")));
        }
        if (!pay.containsKey("notify_url") && envExt != null) {
            Object notifyUrl = envExt.get("notify_url");
            if (notifyUrl != null && !TextUtils.isEmpty(String.valueOf(notifyUrl).trim())) {
                pay.put("notify_url", String.valueOf(notifyUrl).trim());
            }
        }

        RXSdkApi.getInstance().pay(activity, pay, callback);

    }

    private static boolean needGameMoney(@NonNull Map<String, Object> pay, @Nullable Map<String, Object> envExt) {
        if (isBilibiliType(pay.get("hq_type"))) {
            return true;
        }
        if (envExt == null) {
            return false;
        }
        return isBilibiliType(envExt.get("hq_type")) || isBilibiliType(envExt.get("type"));
    }

    private static boolean isBilibiliType(@Nullable Object type) {
        if (type == null) {
            return false;
        }
        String text = String.valueOf(type).trim().toLowerCase();
        return text.contains("bilibili") || "bili".equals(text);
    }
}
