package com.ruixue.demo.activity;

import android.graphics.Typeface;
import android.text.TextUtils;
import android.view.View;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.core.content.ContextCompat;

import com.ruixue.demo.v2.DemoManager;
import com.ruixue.demo.gamearea.GameAreaConsoleHost;
import com.ruixue.demo.gamearea.GameAreaResultFormatter;
import com.ruixue.demo.gamearea.GameAreaTestFormData;
import com.ruixue.demo.v2.category.GameAreaDemo;
import com.ruixue.net.ToastUtils;
import com.ruixue.qipai.R;

/**
 * 游戏区服测试界面
 *
 * @see GameAreaDemo 区服功能 API
 */
public class GameAreaActivity extends BaseTestActivity implements View.OnClickListener, GameAreaConsoleHost {

    private GameAreaDemo gameAreaDemo;
    private EditText etAreaId;
    private EditText etAreaName;
    private EditText etAreaStatus;
    private EditText etAreaType;
    private EditText etAreaGuild;
    private EditText etAreaPower;
    private EditText etCharacterId;
    private EditText etCharacterName;
    private EditText etCharacterLevel;
    private EditText etCharacterFaction;
    private EditText etCharacterProfession;
    private EditText etCharacterStatus;
    private EditText etCharacterType;
    private EditText etCharacterVip;
    private EditText etCpUserId;
    private TextView tvResultTitle;
    private TextView tvResultSummary;
    private TextView tvFlowStatus;
    private TextView tvLog;
    private LinearLayout llResultItems;

    @Override
    protected int getLayoutId() {
        return R.layout.game_area_test;
    }

    @Override
    protected void initViews() {
        bindViews();
        gameAreaDemo = new GameAreaDemo(this, new DemoManager.ResultCallback() {
            @Override
            public void onResult(String message) {
                updateRawLog(message);
            }

            @Override
            public void onToast(String message) {
                ToastUtils.showToast(GameAreaActivity.this, message);
            }
        }, this);
        clearResultPanel();
    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.btn_clear_game_result) {
            clearResultPanel();
            ToastUtils.showToast(this, "已清空结果");
            return;
        }
        gameAreaDemo.onClick(v);
    }

    @Override
    public GameAreaTestFormData getFormData() {
        return new GameAreaTestFormData(
                readText(etAreaId),
                readText(etAreaName),
                readText(etAreaStatus),
                readText(etAreaType),
                readText(etAreaGuild),
                readText(etAreaPower),
                readText(etCharacterId),
                readText(etCharacterName),
                readText(etCharacterLevel),
                readText(etCharacterFaction),
                readText(etCharacterProfession),
                readText(etCharacterStatus),
                readText(etCharacterType),
                readText(etCharacterVip),
                readText(etCpUserId)
        );
    }

    @Override
    public void renderResult(GameAreaResultFormatter.DisplayData data) {
        if (tvResultTitle != null) {
            tvResultTitle.setText(data.title);
        }
        if (tvResultSummary != null) {
            tvResultSummary.setText(data.summary);
        }
        if (llResultItems != null) {
            llResultItems.removeAllViews();
            if (data.cards == null || data.cards.isEmpty()) {
                addResultCard("结果详情", "无结构化结果", data.detailLines);
            } else {
                for (GameAreaResultFormatter.ResultCard card : data.cards) {
                    addResultCard(card);
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
    public void appendFlowLog(String message) {
        if (tvFlowStatus == null) {
            return;
        }
        CharSequence existing = tvFlowStatus.getText();
        if (existing == null || existing.length() == 0 || "快捷测试流状态会显示在这里".contentEquals(existing)) {
            tvFlowStatus.setText(message);
        } else {
            tvFlowStatus.setText(existing + "\n" + message);
        }
    }

    private void bindViews() {
        etAreaId = findViewById(R.id.et_game_area_id);
        etAreaName = findViewById(R.id.et_game_area_name);
        etAreaStatus = findViewById(R.id.et_game_area_status);
        etAreaType = findViewById(R.id.et_game_area_type);
        etAreaGuild = findViewById(R.id.et_game_area_guild);
        etAreaPower = findViewById(R.id.et_game_area_power);
        etCharacterId = findViewById(R.id.et_game_character_id);
        etCharacterName = findViewById(R.id.et_game_character_name);
        etCharacterLevel = findViewById(R.id.et_game_character_level);
        etCharacterFaction = findViewById(R.id.et_game_character_faction);
        etCharacterProfession = findViewById(R.id.et_game_character_profession);
        etCharacterStatus = findViewById(R.id.et_game_character_status);
        etCharacterType = findViewById(R.id.et_game_character_type);
        etCharacterVip = findViewById(R.id.et_game_character_vip);
        etCpUserId = findViewById(R.id.et_game_cp_user_id);
        tvResultTitle = findViewById(R.id.tv_game_result_title);
        tvResultSummary = findViewById(R.id.tv_game_result_summary);
        tvFlowStatus = findViewById(R.id.tv_game_flow_status);
        tvLog = findViewById(R.id.tv_log);
        llResultItems = findViewById(R.id.ll_game_result_items);
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
            addResultCard("使用说明", "等待执行", java.util.Collections.singletonList("点击上方任一操作按钮后，这里会展示结构化卡片结果。"));
        }
        clearFlowLog();
        updateRawLog("尚未执行操作");
    }

    private void updateRawLog(String message) {
        if (tvLog != null) {
            tvLog.setText(message);
        }
    }

    private void addResultCard(String title, String subtitle, java.util.List<String> fields) {
        addResultCard(title, subtitle, fields, false, GameAreaResultFormatter.SelectionData.empty());
    }

    private void addResultCard(GameAreaResultFormatter.ResultCard card) {
        addResultCard(card.title, card.subtitle, card.fields, card.interactive, card.selectionData);
    }

    private void addResultCard(String title,
                               String subtitle,
                               java.util.List<String> fields,
                               boolean interactive,
                               GameAreaResultFormatter.SelectionData selectionData) {
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
            tip.setText("点击后会自动回填区服/角色参数");
            tip.setTextSize(11);
            tip.setTextColor(ContextCompat.getColor(this, R.color.rx_text_secondary));
            tip.setPadding(0, dp(2), 0, 0);
            card.addView(tip);
            card.setClickable(true);
            card.setOnClickListener(v -> applySelection(selectionData));
        }

        llResultItems.addView(card);
    }

    private void applySelection(GameAreaResultFormatter.SelectionData selectionData) {
        if (selectionData == null || !selectionData.hasValue()) {
            ToastUtils.showToast(this, "该卡片没有可回填的区服或角色参数");
            return;
        }
        setIfPresent(etAreaId, selectionData.areaId);
        setIfPresent(etAreaName, selectionData.areaName);
        setIfPresent(etAreaStatus, selectionData.areaStatus);
        setIfPresent(etAreaType, selectionData.areaType);
        setIfPresent(etAreaGuild, selectionData.areaGuild);
        setIfPresent(etAreaPower, selectionData.areaPower);
        setIfPresent(etCharacterId, selectionData.characterId);
        setIfPresent(etCharacterName, selectionData.characterName);
        setIfPresent(etCharacterLevel, selectionData.characterLevel);
        setIfPresent(etCharacterFaction, selectionData.characterFaction);
        setIfPresent(etCharacterProfession, selectionData.characterProfession);
        setIfPresent(etCharacterStatus, selectionData.characterStatus);
        setIfPresent(etCharacterType, selectionData.characterType);
        setIfPresent(etCharacterVip, selectionData.characterVipLevel);
        setIfPresent(etCpUserId, selectionData.cpUserId);

        StringBuilder summary = new StringBuilder("已回填区服参数");
        if (!TextUtils.isEmpty(selectionData.areaId)) {
            summary.append(": areaId=").append(selectionData.areaId);
        }
        if (!TextUtils.isEmpty(selectionData.characterId)) {
            summary.append("，characterId=").append(selectionData.characterId);
        }
        if (!TextUtils.isEmpty(selectionData.cpUserId)) {
            summary.append("，cpUserId=").append(selectionData.cpUserId);
        }
        appendFlowLog(summary.toString());
        ToastUtils.showToast(this, "已回填到区服/角色测试参数");
    }

    private void setIfPresent(EditText editText, String value) {
        if (editText == null || TextUtils.isEmpty(value)) {
            return;
        }
        editText.setText(value);
        editText.setSelection(editText.getText().length());
    }

    private String readText(EditText editText) {
        return editText == null || editText.getText() == null ? "" : editText.getText().toString();
    }

    private int dp(int value) {
        return (int) (value * getResources().getDisplayMetrics().density);
    }
}
