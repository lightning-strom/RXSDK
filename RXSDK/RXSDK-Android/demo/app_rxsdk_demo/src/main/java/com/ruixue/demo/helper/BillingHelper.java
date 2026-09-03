package com.ruixue.demo.helper;

import android.app.Activity;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;

import com.ruixue.demo.GlobalConfig;
import com.ruixue.demo.config.DemoTestConfig;
import com.ruixue.logger.RXLogger;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 计费点选择辅助类
 * <p>
 * 从当前 init_configs.json 配置项的 ext.billing_items 加载可选计费点，
 * 提供 Spinner 绑定和当前选中 goods_tag 查询。
 */
public class BillingHelper {

    private static final String TAG = "BillingHelper";

    public static class BillingItem {
        public final String label;
        public final String goodsTag;
        public final String orderType;

        public BillingItem(String label, String goodsTag) {
            this(label, goodsTag, null);
        }

        public BillingItem(String label, String goodsTag, String orderType) {
            this.label = label;
            this.goodsTag = goodsTag;
            this.orderType = orderType;
        }

        @Override
        public String toString() {
            return label;
        }
    }

    public interface OnGoodsTagChangedListener {
        void onChanged(String goodsTag);
    }

    private final List<BillingItem> items = new ArrayList<>();
    private BillingItem selected;
    private String customTag;
    private OnGoodsTagChangedListener changeListener;

    public BillingHelper() {
        loadItems();
    }

    @SuppressWarnings("unchecked")
    private void loadItems() {
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
                            items.add(new BillingItem(label, tag, orderType));
                        }
                    }
                }
            }
        } catch (Exception e) {
            RXLogger.w(TAG, "loadBillingItems failed: " + e.getMessage());
        }

        if (items.isEmpty()) {
            String defaultTag = DemoTestConfig.GOODS_TAG_DEFAULT;
            Map<String, Object> ext = GlobalConfig.getExt();
            if (ext != null && ext.get("goods_tag") != null) {
                defaultTag = String.valueOf(ext.get("goods_tag"));
            }
            items.add(new BillingItem(defaultTag, defaultTag));
            if (!DemoTestConfig.GOODS_TAG_DEFAULT.equals(defaultTag)) {
                items.add(new BillingItem(DemoTestConfig.GOODS_TAG_DEFAULT,
                        DemoTestConfig.GOODS_TAG_DEFAULT));
            }
            items.add(new BillingItem(DemoTestConfig.GOODS_TAG_PAYGIFT,
                    DemoTestConfig.GOODS_TAG_PAYGIFT));
            items.add(new BillingItem(DemoTestConfig.GOODS_TAG_RUIXUE_H5_ALT,
                    DemoTestConfig.GOODS_TAG_RUIXUE_H5_ALT));
            items.add(new BillingItem(DemoTestConfig.GOODS_TAG_RUIXUE_H5,
                    DemoTestConfig.GOODS_TAG_RUIXUE_H5));
        }

        if (!items.isEmpty()) {
            selected = items.get(0);
        }
    }

    public void setOnGoodsTagChangedListener(OnGoodsTagChangedListener listener) {
        this.changeListener = listener;
    }

    /**
     * 绑定 Spinner 和自定义输入框
     *
     * @param activity    Activity
     * @param spinner     计费点下拉列表
     * @param customInput 自定义 goods_tag 输入（可为 null）
     * @param tagPreview  当前 goods_tag 预览文本（可为 null）
     */
    public void bind(Activity activity, Spinner spinner, EditText customInput, TextView tagPreview) {
        ArrayAdapter<BillingItem> adapter = new ArrayAdapter<>(activity,
                android.R.layout.simple_spinner_item, items);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(adapter);

        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                selected = items.get(position);
                updatePreview(tagPreview);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {}
        });

        if (customInput != null) {
            customInput.addTextChangedListener(new TextWatcher() {
                @Override
                public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

                @Override
                public void onTextChanged(CharSequence s, int start, int before, int count) {}

                @Override
                public void afterTextChanged(Editable s) {
                    customTag = s.toString().trim();
                    updatePreview(tagPreview);
                }
            });
        }

        updatePreview(tagPreview);
    }

    private void updatePreview(TextView preview) {
        String tag = getSelectedGoodsTag();
        if (preview != null) {
            preview.setText("goods_tag: " + tag);
        }
        if (changeListener != null) {
            changeListener.onChanged(tag);
        }
    }

    /** 获取当前选中的 goods_tag（自定义输入优先） */
    public String getSelectedGoodsTag() {
        if (!TextUtils.isEmpty(customTag)) return customTag;
        return selected != null ? selected.goodsTag : DemoTestConfig.GOODS_TAG_DEFAULT;
    }

    /** 获取当前选中项的 order_type（如订阅类型，可能为 null） */
    public String getSelectedOrderType() {
        if (!TextUtils.isEmpty(customTag)) return null;
        return selected != null ? selected.orderType : null;
    }
}
