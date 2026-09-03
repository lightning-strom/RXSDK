package com.ruixue.demo.activity;

import android.app.AlertDialog;
import android.graphics.Typeface;
import android.text.TextUtils;
import android.view.View;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;

import com.ruixue.RXJSONCallback;
import com.ruixue.demo.share.ShareConsoleHost;
import com.ruixue.demo.share.ShareResultFormatter;
import com.ruixue.demo.share.ShareTestFormData;
import com.ruixue.demo.share.ShareTestMeta;
import com.ruixue.demo.share.ShareTestMeta.PlatformMeta;
import com.ruixue.demo.share.ShareTestMeta.SceneOption;
import com.ruixue.demo.v2.DemoManager;
import com.ruixue.demo.v2.category.ShareDemo;
import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.qipai.R;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class ShareTestActivity extends BaseTestActivity implements View.OnClickListener, ShareConsoleHost {

    private ShareDemo shareDemo;
    private EditText etFunc;
    private EditText etPlatform;
    private EditText etRegion;
    private EditText etShareScene;
    private EditText etMaterialType;
    private EditText etTitle;
    private EditText etContent;
    private EditText etImage;
    private EditText etUrl;
    private EditText etTransmits;
    private EditText etProtocolAndroid;
    private EditText etProtocolIos;
    private EditText etUseScheme;
    private EditText etUseShortUrl;
    private EditText etShowContentInCircle;
    private EditText etStrategyId;
    private EditText etProperties;
    private TextView tvLabelShareScene;
    private TextView tvLabelShareTitle;
    private TextView tvLabelShareContent;
    private TextView tvLabelShareImage;
    private TextView tvLabelShareUrl;
    private TextView tvLabelUseScheme;
    private TextView tvLabelUseShortUrl;
    private TextView tvLabelShowContentInCircle;
    private TextView tvPlatformHint;
    private TextView tvMaterialHint;
    private TextView tvCompatibilityHint;
    private TextView tvRequiredHint;
    private TextView tvResultTitle;
    private TextView tvResultSummary;
    private TextView tvFlowStatus;
    private TextView tvLog;
    private LinearLayout llResultItems;

    @Override
    protected int getLayoutId() {
        return R.layout.activity_share_test;
    }

    @Override
    protected void initViews() {
        bindViews();
        setupSelectorFields();
        shareDemo = new ShareDemo(this, new DemoManager.ResultCallback() {
            @Override
            public void onResult(String message) {
                updateRawLog(message);
            }

            @Override
            public void onToast(String message) {
                ToastUtils.showToast(ShareTestActivity.this, message);
            }
        }, this);
        applyFormData(ShareTestFormData.defaultValues(), "已加载默认分享参数");
        clearResultPanel();
    }

    @Override
    public void onClick(View view) {
        int id = view.getId();
        if (id == R.id.btn_clear_share_result) {
            clearResultPanel();
            ToastUtils.showToast(this, "已清空结果");
            return;
        }
        if (id == R.id.et_share_platform || id == R.id.btn_share_pick_platform) {
            showPlatformPicker();
            return;
        }
        if (id == R.id.et_share_material_type || id == R.id.btn_share_pick_material_type) {
            showMaterialTypePicker();
            return;
        }
        if (id == R.id.et_share_scene) {
            showShareScenePicker();
            return;
        }
        if (id == R.id.et_share_use_scheme) {
            showUseSchemePicker();
            return;
        }
        if (id == R.id.et_share_use_short_url) {
            showUseShortUrlPicker();
            return;
        }
        if (id == R.id.btn_share_pick_func || id == R.id.btn_share_pick_func_inline) {
            showFuncPicker();
            return;
        }
        if (id == R.id.btn_share_show_platforms) {
            loadPlatformConfig();
            return;
        }
        shareDemo.onClick(view);
    }

    @NonNull
    @Override
    public ShareTestFormData getFormData() {
        return new ShareTestFormData(
                readText(etFunc),
                readText(etPlatform),
                readText(etRegion),
                readText(etShareScene),
                readText(etMaterialType),
                readText(etTitle),
                readText(etContent),
                readText(etImage),
                readText(etUrl),
                readText(etTransmits),
                readText(etProtocolAndroid),
                readText(etProtocolIos),
                readText(etUseScheme),
                readText(etUseShortUrl),
                readText(etShowContentInCircle),
                readText(etStrategyId),
                readText(etProperties)
        );
    }

    @Override
    public void renderResult(@NonNull ShareResultFormatter.DisplayData data) {
        if (tvResultTitle != null) {
            tvResultTitle.setText(data.title);
        }
        if (tvResultSummary != null) {
            tvResultSummary.setText(data.summary);
        }
        if (llResultItems != null) {
            llResultItems.removeAllViews();
            if (data.cards == null || data.cards.isEmpty()) {
                addResultCard("结果详情", "无结构化结果", data.detailLines, false,
                        ShareResultFormatter.SelectionData.empty());
            } else {
                for (ShareResultFormatter.ResultCard card : data.cards) {
                    addResultCard(card.title, card.subtitle, card.fields,
                            card.interactive, card.selectionData);
                }
            }
        }
        updateRawLog(data.rawText);
    }

    @Override
    public void clearFlowLog() {
        if (tvFlowStatus != null) {
            tvFlowStatus.setText("快捷测试流状态会显示在这里");
        }
    }

    @Override
    public void appendFlowLog(@NonNull String message) {
        if (tvFlowStatus == null) {
            return;
        }
        CharSequence existing = tvFlowStatus.getText();
        if (existing == null || existing.length() == 0
                || "快捷测试流状态会显示在这里".contentEquals(existing)) {
            tvFlowStatus.setText(message);
        } else {
            tvFlowStatus.setText(existing + "\n" + message);
        }
    }

    @Override
    public void applyFormData(@NonNull ShareTestFormData formData, @NonNull String summary) {
        setEditText(etFunc, formData.func);
        setEditText(etPlatform, formData.platform);
        setEditText(etRegion, formData.region);
        setEditText(etShareScene, formData.shareScene);
        setEditText(etMaterialType, formData.materialType);
        setEditText(etTitle, formData.title);
        setEditText(etContent, formData.content);
        setEditText(etImage, formData.image);
        setEditText(etUrl, formData.url);
        setEditText(etTransmits, formData.transmits);
        setEditText(etProtocolAndroid, formData.protocolAndroid);
        setEditText(etProtocolIos, formData.protocolIos);
        setEditText(etUseScheme, formData.useScheme);
        setEditText(etUseShortUrl, formData.useShortUrl);
        setEditText(etShowContentInCircle, formData.getShowContentInCircleValue());
        setEditText(etStrategyId, formData.schedulingStrategyId);
        setEditText(etProperties, formData.getPropertiesJsonValue());
        refreshDynamicHints();
        appendFlowLog(summary);
    }

    private void bindViews() {
        etFunc = findViewById(R.id.et_share_func);
        etPlatform = findViewById(R.id.et_share_platform);
        etRegion = findViewById(R.id.et_share_region);
        etShareScene = findViewById(R.id.et_share_scene);
        etMaterialType = findViewById(R.id.et_share_material_type);
        etTitle = findViewById(R.id.et_share_title);
        etContent = findViewById(R.id.et_share_content);
        etImage = findViewById(R.id.et_share_image);
        etUrl = findViewById(R.id.et_share_url);
        etTransmits = findViewById(R.id.et_share_transmits);
        etProtocolAndroid = findViewById(R.id.et_share_protocol_android);
        etProtocolIos = findViewById(R.id.et_share_protocol_ios);
        etUseScheme = findViewById(R.id.et_share_use_scheme);
        etUseShortUrl = findViewById(R.id.et_share_use_short_url);
        etShowContentInCircle = findViewById(R.id.et_share_show_content_in_circle);
        etStrategyId = findViewById(R.id.et_share_strategy_id);
        etProperties = findViewById(R.id.et_share_properties);
        tvLabelShareScene = findViewById(R.id.tv_label_share_scene);
        tvLabelShareTitle = findViewById(R.id.tv_label_share_title);
        tvLabelShareContent = findViewById(R.id.tv_label_share_content);
        tvLabelShareImage = findViewById(R.id.tv_label_share_image);
        tvLabelShareUrl = findViewById(R.id.tv_label_share_url);
        tvLabelUseScheme = findViewById(R.id.tv_label_share_use_scheme);
        tvLabelUseShortUrl = findViewById(R.id.tv_label_share_use_short_url);
        tvLabelShowContentInCircle = findViewById(R.id.tv_label_share_show_content_in_circle);
        tvPlatformHint = findViewById(R.id.tv_share_platform_hint);
        tvMaterialHint = findViewById(R.id.tv_share_material_hint);
        tvCompatibilityHint = findViewById(R.id.tv_share_compatibility_hint);
        tvRequiredHint = findViewById(R.id.tv_share_required_hint);
        tvResultTitle = findViewById(R.id.tv_share_result_title);
        tvResultSummary = findViewById(R.id.tv_share_result_summary);
        tvFlowStatus = findViewById(R.id.tv_share_flow_status);
        tvLog = findViewById(R.id.tv_log);
        llResultItems = findViewById(R.id.ll_share_result_items);
    }

    private void setupSelectorFields() {
        setupSelectorField(etPlatform);
        setupSelectorField(etMaterialType);
        setupSelectorField(etShareScene);
        setupSelectorField(etUseScheme);
        setupSelectorField(etUseShortUrl);
    }

    private void setupSelectorField(@Nullable EditText editText) {
        if (editText == null) {
            return;
        }
        editText.setFocusable(false);
        editText.setFocusableInTouchMode(false);
        editText.setLongClickable(false);
        editText.setTextIsSelectable(false);
        editText.setOnClickListener(this);
    }

    private void showPlatformPicker() {
        List<String> keys = new ArrayList<>(ShareTestMeta.PLATFORMS.keySet());
        String[] labels = new String[keys.size()];
        for (int i = 0; i < keys.size(); i++) {
            PlatformMeta meta = ShareTestMeta.getPlatform(keys.get(i));
            labels[i] = meta == null
                    ? keys.get(i)
                    : meta.label + " (" + keys.get(i) + ")";
        }
        showOptionDialog("选择分享平台", labels, which -> {
            String key = keys.get(which);
            PlatformMeta meta = ShareTestMeta.getPlatform(key);
            setEditText(etPlatform, key);
            if (meta != null) {
                setEditText(etShareScene, String.valueOf(meta.defaultScene));
            }
            refreshDynamicHints();
            appendFlowLog("已切换分享平台: " + key);
        });
    }

    private void showMaterialTypePicker() {
        List<String> keys = new ArrayList<>(ShareTestMeta.MATERIAL_DESCRIPTIONS.keySet());
        String[] labels = new String[keys.size()];
        for (int i = 0; i < keys.size(); i++) {
            String key = keys.get(i);
            labels[i] = key + " - " + ShareTestMeta.MATERIAL_DESCRIPTIONS.get(key);
        }
        showOptionDialog("选择素材类型", labels, which -> {
            String key = keys.get(which);
            setEditText(etMaterialType, key);
            refreshDynamicHints();
            appendFlowLog("已切换素材类型: " + key);
        });
    }

    private void showShareScenePicker() {
        String platform = readText(etPlatform);
        PlatformMeta platformMeta = ShareTestMeta.getPlatform(platform);
        List<SceneOption> options = ShareTestMeta.getShareSceneOptions(platform);
        String[] labels = new String[options.size()];
        for (int i = 0; i < options.size(); i++) {
            labels[i] = options.get(i).label;
        }
        showOptionDialog("选择 shareScene", labels, which -> {
            String value = options.get(which).value;
            setEditText(etShareScene, value);
            refreshDynamicHints();
            appendFlowLog("已切换 shareScene: " + value
                    + (platformMeta == null ? "" : "（" + platformMeta.label + "）"));
        });
    }

    private void showUseSchemePicker() {
        String[] labels = new String[]{
                "1 - 尝试使用游戏协议唤起应用",
                "0 - 不尝试唤起应用，直接走商店/落地页"
        };
        showOptionDialog("选择 use_scheme", labels, which -> {
            String value = which == 0 ? "1" : "0";
            setEditText(etUseScheme, value);
            refreshDynamicHints();
            appendFlowLog("已切换 use_scheme: " + value);
        });
    }

    private void showUseShortUrlPicker() {
        String[] labels = new String[]{
                "false - 不启用短链",
                "true - 启用短链"
        };
        showOptionDialog("选择 useShortUrl", labels, which -> {
            String value = which == 0 ? "false" : "true";
            setEditText(etUseShortUrl, value);
            refreshDynamicHints();
            appendFlowLog("已切换 useShortUrl: " + value);
        });
    }

    private void showFuncPicker() {
        Map<String, Object> schedulingMap = RXSdkApi.getInstance().getShareScheduling();
        if (schedulingMap == null || schedulingMap.isEmpty()) {
            ToastUtils.showToast(this, "暂无埋点缓存，请先执行调度初始化或获取分享数据");
            return;
        }
        List<String> funcs = new ArrayList<>(schedulingMap.keySet());
        String[] labels = new String[funcs.size()];
        for (int i = 0; i < funcs.size(); i++) {
            labels[i] = buildSchedulingLabel(funcs.get(i), schedulingMap.get(funcs.get(i)));
        }
        updateRawLog(prettyJson(new JSONObject(schedulingMap).toString()));
        showOptionDialog("选择分享埋点", labels, which -> {
            String func = funcs.get(which);
            setEditText(etFunc, func);
            appendFlowLog("已从埋点列表选择: " + func);
        });
    }

    private void loadPlatformConfig() {
        RXSdkApi.getInstance().getSharePlatforms(new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                renderResult(buildPlatformDisplayData(data));
                appendFlowLog("已拉取分享平台配置");
                ToastUtils.showToast(ShareTestActivity.this, "已刷新平台列表");
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                renderResult(ShareResultFormatter.fromJson("平台列表失败", cause));
                ToastUtils.showToast(ShareTestActivity.this, "拉取平台列表失败");
            }
        });
    }

    private void refreshDynamicHints() {
        String platform = readText(etPlatform);
        String materialType = ShareTestMeta.normalizeMaterialType(readText(etMaterialType));
        PlatformMeta platformMeta = ShareTestMeta.getPlatform(platform);
        List<String> requiredFields = ShareTestMeta.getRequiredFields(materialType);

        if (tvPlatformHint != null) {
            if (platformMeta == null) {
                tvPlatformHint.setText("平台提示：点击上方平台字段可选择 system / wechat / facebook / messenger / line / tiktok / zalo / snapchat。");
            } else {
                tvPlatformHint.setText("平台提示：" + platformMeta.label + "，支持 "
                        + join(platformMeta.supportedTypes) + "。"
                        + platformMeta.sceneHint + " "
                        + platformMeta.callbackHint);
            }
        }

        if (tvMaterialHint != null) {
            String desc = ShareTestMeta.MATERIAL_DESCRIPTIONS.get(materialType);
            if (TextUtils.isEmpty(desc)) {
                desc = "点击上方素材类型可选择 text / image / link / landing / video。";
            }
            tvMaterialHint.setText("素材提示：" + desc);
        }

        if (tvCompatibilityHint != null) {
            if (platformMeta == null || TextUtils.isEmpty(materialType)) {
                tvCompatibilityHint.setText("联动校验：选择平台和素材类型后，会在这里提示是否匹配。");
                tvCompatibilityHint.setTextColor(ContextCompat.getColor(this, R.color.rx_text_secondary));
            } else if (platformMeta.supports(materialType)) {
                tvCompatibilityHint.setText("联动校验：当前组合 " + platform + " + " + materialType
                        + " 在文档支持范围内，可直接测试。");
                tvCompatibilityHint.setTextColor(ContextCompat.getColor(this, R.color.rx_success));
            } else {
                tvCompatibilityHint.setText("联动校验：当前组合 " + platform + " + " + materialType
                        + " 不在文档支持范围内，建议改用 " + join(platformMeta.supportedTypes) + "。");
                tvCompatibilityHint.setTextColor(ContextCompat.getColor(this, R.color.rx_error));
            }
        }

        if (tvRequiredHint != null) {
            List<String> hints = new ArrayList<>();
            if (!requiredFields.isEmpty()) {
                hints.add("当前素材建议必填: " + TextUtils.join(" / ", requiredFields));
            }
            if (platformMeta != null && ShareTestMeta.usesShareScene(platform)) {
                hints.add("当前平台建议确认 shareScene");
            }
            hints.add("后台取数链路建议保留 protocol_android / protocol_ios");
            hints.add("use_scheme=" + readText(etUseScheme) + "，useShortUrl=" + readText(etUseShortUrl));
            tvRequiredHint.setText("必填提示：" + TextUtils.join("；", hints));
        }

        updateFieldVisibility(requiredFields, platform, materialType);
    }

    private void clearResultPanel() {
        if (tvResultTitle != null) {
            tvResultTitle.setText("最近结果");
        }
        if (tvResultSummary != null) {
            tvResultSummary.setText("尚未执行操作");
        }
        if (llResultItems != null) {
            llResultItems.removeAllViews();
            addResultCard(
                    "使用说明",
                    "等待执行",
                    Collections.singletonList("点击上方任一分享按钮后，这里会展示结构化结果卡片，支持回填表单参数。"),
                    false,
                    ShareResultFormatter.SelectionData.empty()
            );
        }
        clearFlowLog();
        updateRawLog("尚未执行操作");
    }

    private void updateRawLog(String message) {
        if (tvLog != null) {
            tvLog.setText(message);
        }
    }

    private void addResultCard(String title,
                               String subtitle,
                               java.util.List<String> fields,
                               boolean interactive,
                               ShareResultFormatter.SelectionData selectionData) {
        if (llResultItems == null) {
            return;
        }
        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setBackgroundResource(R.drawable.rx_card_bg);
        card.setPadding(dp(10), dp(10), dp(10), dp(10));

        LinearLayout.LayoutParams cardLp = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        );
        cardLp.bottomMargin = dp(8);
        card.setLayoutParams(cardLp);

        TextView titleView = new TextView(this);
        titleView.setText(title);
        titleView.setTypeface(Typeface.DEFAULT_BOLD);
        titleView.setTextSize(13);
        titleView.setTextColor(ContextCompat.getColor(this, R.color.rx_text_primary));
        card.addView(titleView);

        TextView subtitleView = new TextView(this);
        subtitleView.setText(interactive ? subtitle + " · 点击回填参数" : subtitle);
        subtitleView.setTextSize(12);
        subtitleView.setTextColor(ContextCompat.getColor(this, R.color.rx_text_secondary));
        subtitleView.setPadding(0, dp(4), 0, dp(6));
        card.addView(subtitleView);

        if (fields != null) {
            for (String field : fields) {
                TextView line = new TextView(this);
                line.setText(field);
                line.setTextSize(12);
                line.setTextColor(ContextCompat.getColor(this, R.color.rx_text_primary));
                line.setPadding(0, 0, 0, dp(4));
                card.addView(line);
            }
        }

        if (interactive) {
            TextView tip = new TextView(this);
            tip.setText("点击后会自动回填分享参数、短链或策略ID");
            tip.setTextSize(11);
            tip.setTextColor(ContextCompat.getColor(this, R.color.rx_text_secondary));
            tip.setPadding(0, dp(2), 0, 0);
            card.addView(tip);
            card.setClickable(true);
            card.setOnClickListener(v -> applySelection(selectionData));
        }

        llResultItems.addView(card);
    }

    private void applySelection(@NonNull ShareResultFormatter.SelectionData selectionData) {
        if (!selectionData.hasValue()) {
            ToastUtils.showToast(this, "该卡片没有可回填的分享参数");
            return;
        }
        ShareTestFormData merged = getFormData().withSelection(selectionData);
        applyFormData(merged, "已根据结果卡片回填分享参数");

        StringBuilder summary = new StringBuilder("已回填分享参数");
        if (!TextUtils.isEmpty(selectionData.platform)) {
            summary.append(": platform=").append(selectionData.platform);
        }
        if (!TextUtils.isEmpty(selectionData.materialType)) {
            summary.append("，material_type=").append(selectionData.materialType);
        }
        if (!TextUtils.isEmpty(selectionData.schedulingStrategyId)) {
            summary.append("，strategyId=").append(selectionData.schedulingStrategyId);
        }
        if (!TextUtils.isEmpty(selectionData.url)) {
            summary.append("，url=").append(selectionData.url);
        }
        appendFlowLog(summary.toString());
        ToastUtils.showToast(this, "已回填到分享测试参数");
    }

    private void showOptionDialog(@NonNull String title,
                                  @NonNull String[] labels,
                                  @NonNull OptionConsumer consumer) {
        new AlertDialog.Builder(this)
                .setTitle(title)
                .setItems(labels, (dialog, which) -> consumer.onSelected(which))
                .setNegativeButton("取消", null)
                .show();
    }

    @NonNull
    private ShareResultFormatter.DisplayData buildPlatformDisplayData(@Nullable JSONObject json) {
        if (json == null) {
            return ShareResultFormatter.fromText("平台列表", "无平台配置返回");
        }
        JSONObject data = json.optJSONObject("data");
        JSONObject source = data != null ? data : json;
        List<ShareResultFormatter.ResultCard> cards = new ArrayList<>();
        List<String> detailLines = new ArrayList<>();
        JSONArray names = source.names();
        if (names != null) {
            for (int i = 0; i < names.length(); i++) {
                String key = names.optString(i);
                if ("code".equals(key) || "msg".equals(key) || "message".equals(key)) {
                    continue;
                }
                Object value = source.opt(key);
                if (!ShareTestMeta.PLATFORMS.containsKey(key)
                        && !(value instanceof JSONObject)
                        && !(value instanceof JSONArray)) {
                    continue;
                }
                PlatformMeta meta = ShareTestMeta.getPlatform(key);
                List<String> fields = new ArrayList<>();
                if (meta != null) {
                    fields.add("平台: " + meta.label + " (" + key + ")");
                    fields.add("文档支持素材: " + join(meta.supportedTypes));
                    fields.add("默认 shareScene: " + meta.defaultScene);
                } else {
                    fields.add("平台: " + key);
                }
                appendPlatformValue(fields, "", value, 0);
                ShareResultFormatter.SelectionData selectionData =
                        new ShareResultFormatter.SelectionData(
                                "",
                                key,
                                "",
                                meta == null ? "" : String.valueOf(meta.defaultScene),
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                                ""
                        );
                cards.add(new ShareResultFormatter.ResultCard(
                        meta == null ? key : meta.label,
                        "点击可回填 platform 和 shareScene",
                        fields,
                        true,
                        selectionData
                ));
                detailLines.add("platform." + key + ": 已生成可回填卡片");
            }
        }
        if (cards.isEmpty()) {
            return ShareResultFormatter.fromJson("平台列表", json);
        }
        String raw = prettyJson(json.toString());
        if (detailLines.isEmpty()) {
            detailLines.add("已拉取平台配置，详情见卡片");
        }
        return new ShareResultFormatter.DisplayData(
                "平台列表",
                "已加载 " + cards.size() + " 个平台配置，点击卡片可回填 platform/shareScene",
                detailLines,
                raw,
                cards
        );
    }

    private String buildSchedulingLabel(@NonNull String func, @Nullable Object value) {
        if (value == null) {
            return func;
        }
        JSONObject object = toJsonObject(value);
        if (object == null) {
            return func;
        }
        List<String> parts = new ArrayList<>();
        String title = firstNotEmpty(object.optString("title"),
                object.optString("name"), object.optString("tag"));
        if (!TextUtils.isEmpty(title)) {
            parts.add(title);
        }
        String type = object.optString("type");
        if (!TextUtils.isEmpty(type)) {
            parts.add("type=" + type);
        }
        String platform = object.optString("platform");
        if (!TextUtils.isEmpty(platform)) {
            parts.add("platform=" + platform);
        }
        return parts.isEmpty() ? func : func + " | " + TextUtils.join(" | ", parts);
    }

    @Nullable
    private JSONObject toJsonObject(@Nullable Object value) {
        if (value instanceof JSONObject) {
            return (JSONObject) value;
        }
        if (value instanceof Map) {
            return new JSONObject((Map<?, ?>) value);
        }
        if (value instanceof String) {
            String text = ((String) value).trim();
            if (text.startsWith("{")) {
                try {
                    return new JSONObject(text);
                } catch (JSONException ignored) {
                }
            }
        }
        return null;
    }

    @NonNull
    private String firstNotEmpty(String... values) {
        for (String value : values) {
            if (!TextUtils.isEmpty(value)) {
                return value;
            }
        }
        return "";
    }

    @NonNull
    private String join(@NonNull String[] values) {
        return TextUtils.join("/", values);
    }

    /**
     * 根据当前平台 + 素材类型调整字段可见性：必填 → 高亮 + 可见；不适用 → 折叠隐藏；
     * 其它 → 保留但弱化显示。
     */
    private void updateFieldVisibility(@NonNull List<String> requiredFields,
                                       @NonNull String platform,
                                       @NonNull String materialType) {
        boolean hasMaterialType = !TextUtils.isEmpty(materialType);
        // shareScene：仅在 wechat/facebook/zalo 下需要
        applyFieldState(tvLabelShareScene, etShareScene,
                ShareTestMeta.usesShareScene(platform), true);

        // 素材字段：必填 → 显示且高亮；不在必填列表 → 隐藏
        applyFieldState(tvLabelShareTitle, etTitle,
                requiredFields.contains("title"),
                !hasMaterialType);
        applyFieldState(tvLabelShareContent, etContent,
                requiredFields.contains("content"),
                !hasMaterialType);
        applyFieldState(tvLabelShareImage, etImage,
                requiredFields.contains("image"),
                !hasMaterialType);
        applyFieldState(tvLabelShareUrl, etUrl,
                requiredFields.contains("url"),
                !hasMaterialType);

        // use_scheme / useShortUrl：常驻显示但不高亮
        applyFieldState(tvLabelUseScheme, etUseScheme, false, true);
        applyFieldState(tvLabelUseShortUrl, etUseShortUrl, false, true);

        // show_content_in_circle：仅微信朋友圈自定义分享需要
        applyFieldState(tvLabelShowContentInCircle, etShowContentInCircle, false,
                "wechat".equals(platform) && "1".equals(readText(etShareScene)));
    }

    /**
     * @param label            字段 label
     * @param editText         字段输入
     * @param required         是否必填（true → 高亮 + 显示）
     * @param keepVisibleWhenNotRequired 非必填时是否保留显示（true → 保留但弱化；false → 隐藏）
     */
    private void applyFieldState(@Nullable TextView label,
                                 @Nullable EditText editText,
                                 boolean required,
                                 boolean keepVisibleWhenNotRequired) {
        int visibility = required || keepVisibleWhenNotRequired ? View.VISIBLE : View.GONE;
        if (label != null) {
            label.setVisibility(visibility);
            label.setTextColor(ContextCompat.getColor(this,
                    required ? R.color.rx_success : R.color.rx_text_primary));
        }
        if (editText != null) {
            editText.setVisibility(visibility);
            editText.setAlpha(required ? 1f : 0.82f);
        }
    }

    private void appendPlatformValue(@NonNull List<String> fields,
                                     @NonNull String prefix,
                                     @Nullable Object value,
                                     int depth) {
        if (value == null || value == JSONObject.NULL || depth > 1 || fields.size() > 8) {
            return;
        }
        if (value instanceof JSONObject) {
            JSONObject object = (JSONObject) value;
            JSONArray names = object.names();
            if (names == null) {
                return;
            }
            for (int i = 0; i < names.length() && fields.size() <= 8; i++) {
                String key = names.optString(i);
                appendPlatformValue(fields,
                        prefix.isEmpty() ? key : prefix + "." + key,
                        object.opt(key),
                        depth + 1);
            }
            return;
        }
        if (value instanceof JSONArray) {
            JSONArray array = (JSONArray) value;
            fields.add((prefix.isEmpty() ? "items" : prefix) + ": " + array.toString());
            return;
        }
        fields.add((prefix.isEmpty() ? "配置" : prefix) + ": " + String.valueOf(value));
    }

    @NonNull
    private String prettyJson(@Nullable String raw) {
        if (TextUtils.isEmpty(raw)) {
            return "";
        }
        String trimmed = raw.trim();
        try {
            if (trimmed.startsWith("{")) {
                return new JSONObject(trimmed).toString(2);
            }
            if (trimmed.startsWith("[")) {
                return new JSONArray(trimmed).toString(2);
            }
        } catch (JSONException ignored) {
        }
        return raw;
    }

    private void setEditText(@Nullable EditText editText, @Nullable String value) {
        if (editText == null) {
            return;
        }
        String safe = value == null ? "" : value;
        editText.setText(safe);
        editText.setSelection(editText.getText().length());
    }

    private String readText(@Nullable EditText editText) {
        return editText == null || editText.getText() == null
                ? ""
                : editText.getText().toString().trim();
    }

    private int dp(int value) {
        return Math.round(getResources().getDisplayMetrics().density * value);
    }

    private interface OptionConsumer {
        void onSelected(int which);
    }
}
