package com.ruixue.demo.v2.category;

import static com.ruixue.demo.config.TestButtonConfig.ACCENT;

import android.app.Activity;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.demo.helper.PayTestHelper;
import com.ruixue.demo.config.TestButtonConfig.ButtonGroup;
import com.ruixue.demo.v2.DemoCategory;
import com.ruixue.demo.v2.DemoManager;

import org.json.JSONObject;

/**
 * 支付相关 API 示例
 * <p>
 * <b>包含功能：</b>
 * <ul>
 *   <li>{@link #doPay(String)} - 发起支付（微信/支付宝/易宝）</li>
 * </ul>
 * <p>
 * <b>支持的支付方式：</b>
 * <ul>
 *   <li>"wechat" - 微信支付</li>
 *   <li>"alipay" - 支付宝支付</li>
 *   <li>"yeepay" - 易宝支付</li>
 * </ul>
 *
 * @since 2.0
 * @see com.ruixue.demo.helper.PayTestHelper 支付测试辅助类
 */
public class PayDemo extends DemoCategory {

    public PayDemo(@NonNull Activity activity, @NonNull DemoManager.ResultCallback callback) {
        super(activity, callback);
    }

    @Override
    public String getName() {
        return "支付";
    }

    @Override
    public String getEmoji() {
        return "💰";
    }

    @Override
    protected void registerButtons(ButtonGroup group) {
        group.addButton(button("pay_wechat", "微信支付", ACCENT, () -> doPay("wechat")));
        group.addButton(button("pay_alipay", "支付宝", ACCENT, () -> doPay("alipay")));
        group.addButton(button("pay_yeepay", "易宝支付", ACCENT, () -> doPay("yeepay")));
    }

    // ==================== API 示例方法 ====================

    /** 发起支付 */
    public void doPay(String method) {
        showResult("发起" + getPayMethodName(method) + "支付...");

        PayTestHelper.pay(activity, method, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                showResult(getPayMethodName(method) + "支付成功:\n" + (data != null ? data.toString() : ""));
                showToast("支付成功");
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                showResult(getPayMethodName(method) + "支付失败:\n" + cause.toString());
            }
        });
    }

    // ==================== 辅助方法 ====================

    private String getPayMethodName(String method) {
        switch (method) {
            case "wechat":
                return "微信";
            case "alipay":
                return "支付宝";
            case "yeepay":
                return "易宝";
            default:
                return method;
        }
    }
}
