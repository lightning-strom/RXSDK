package com.ruixue.demo.activity;

import android.graphics.Typeface;
import android.text.TextUtils;
import android.view.View;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.core.content.ContextCompat;

import com.ruixue.demo.v2.DemoManager;
import com.ruixue.demo.social.SocialConsoleHost;
import com.ruixue.demo.social.SocialResultFormatter;
import com.ruixue.demo.social.SocialTestFormData;
import com.ruixue.demo.v2.category.SocialDemo;
import com.ruixue.net.ToastUtils;
import com.ruixue.qipai.R;

/**
 * 社交功能测试界面
 *
 * @see SocialDemo 社交功能 API
 */
public class SocialTestActivity extends BaseTestActivity implements View.OnClickListener, SocialConsoleHost {

    private SocialDemo socialDemo;
    private EditText etTargetOpenId;
    private EditText etQueryOpenId;
    private EditText etFriendRemark;
    private EditText etUserRemark;
    private EditText etRelationKey;
    private EditText etRelationRemark;
    private EditText etRankId;
    private EditText etScore;
    private EditText etRankStart;
    private EditText etRankEnd;
    private EditText etLon;
    private EditText etLat;
    private EditText etRadius;
    private EditText etPage;
    private EditText etPageSize;
    private EditText etLbsType;
    private TextView tvResultTitle;
    private TextView tvResultSummary;
    private TextView tvFlowStatus;
    private TextView tvLog;
    private LinearLayout llResultItems;

    @Override
    protected int getLayoutId() {
        return R.layout.activity_social;
    }

    @Override
    protected void initViews() {
        bindViews();

        // 创建 SocialDemo 实例
        socialDemo = new SocialDemo(this, new DemoManager.ResultCallback() {
            @Override
            public void onResult(String message) {
                updateRawLog(message);
            }

            @Override
            public void onToast(String message) {
                ToastUtils.showToast(SocialTestActivity.this, message);
            }
        }, this);

        clearResultPanel();
    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.btn_clear_social_result) {
            clearResultPanel();
            ToastUtils.showToast(this, "已清空结果");
            return;
        }
        socialDemo.onClick(v);
    }

    @Override
    public SocialTestFormData getFormData() {
        return new SocialTestFormData(
                readText(etTargetOpenId),
                readText(etQueryOpenId),
                readText(etFriendRemark),
                readText(etUserRemark),
                readText(etRelationKey),
                readText(etRelationRemark),
                readText(etRankId),
                readText(etScore),
                readText(etRankStart),
                readText(etRankEnd),
                readText(etLon),
                readText(etLat),
                readText(etRadius),
                readText(etPage),
                readText(etPageSize),
                readText(etLbsType)
        );
    }

    @Override
    public void renderResult(SocialResultFormatter.DisplayData data) {
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
                for (SocialResultFormatter.ResultCard card : data.cards) {
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
        etTargetOpenId = findViewById(R.id.et_social_target_openid);
        etQueryOpenId = findViewById(R.id.et_social_query_openid);
        etFriendRemark = findViewById(R.id.et_social_friend_remark);
        etUserRemark = findViewById(R.id.et_social_user_remark);
        etRelationKey = findViewById(R.id.et_social_relation_key);
        etRelationRemark = findViewById(R.id.et_social_relation_remark);
        etRankId = findViewById(R.id.et_social_rank_id);
        etScore = findViewById(R.id.et_social_score);
        etRankStart = findViewById(R.id.et_social_rank_start);
        etRankEnd = findViewById(R.id.et_social_rank_end);
        etLon = findViewById(R.id.et_social_lon);
        etLat = findViewById(R.id.et_social_lat);
        etRadius = findViewById(R.id.et_social_radius);
        etPage = findViewById(R.id.et_social_page);
        etPageSize = findViewById(R.id.et_social_page_size);
        etLbsType = findViewById(R.id.et_social_lbs_type);
        tvResultTitle = findViewById(R.id.tv_social_result_title);
        tvResultSummary = findViewById(R.id.tv_social_result_summary);
        tvFlowStatus = findViewById(R.id.tv_social_flow_status);
        tvLog = findViewById(R.id.tv_log);
        llResultItems = findViewById(R.id.ll_social_result_items);
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

    private void addResultCard(SocialResultFormatter.ResultCard card) {
        addResultCard(card.title, card.subtitle, card.fields, card.interactive,
                card.fillTargetOpenId, card.fillFriendRemark);
    }

    private void addResultCard(String title, String subtitle, java.util.List<String> fields) {
        addResultCard(title, subtitle, fields, false, "", "");
    }

    private void addResultCard(String title,
                               String subtitle,
                               java.util.List<String> fields,
                               boolean interactive,
                               String fillTargetOpenId,
                               String fillFriendRemark) {
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

        TextView tvTitle = new TextView(this);
        tvTitle.setText(title);
        tvTitle.setTypeface(Typeface.DEFAULT_BOLD);
        tvTitle.setTextSize(13);
        tvTitle.setTextColor(ContextCompat.getColor(this, R.color.rx_text_primary));
        card.addView(tvTitle);

        TextView tvSubtitle = new TextView(this);
        tvSubtitle.setText(interactive ? subtitle + " · 点击回填参数" : subtitle);
        tvSubtitle.setTextSize(12);
        tvSubtitle.setTextColor(ContextCompat.getColor(this, R.color.rx_text_secondary));
        tvSubtitle.setPadding(0, dp(4), 0, dp(6));
        card.addView(tvSubtitle);

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
            tip.setText("点击后会自动回填到上方 target openid 和好友备注");
            tip.setTextSize(11);
            tip.setTextColor(ContextCompat.getColor(this, R.color.rx_text_secondary));
            tip.setPadding(0, dp(2), 0, 0);
            card.addView(tip);
            card.setClickable(true);
            card.setOnClickListener(v -> applyFriendSelection(fillTargetOpenId, fillFriendRemark));
        }

        llResultItems.addView(card);
    }

    private void applyFriendSelection(String targetOpenId, String friendRemark) {
        if (TextUtils.isEmpty(targetOpenId)) {
            ToastUtils.showToast(this, "该卡片没有可回填的 openid");
            return;
        }
        if (etTargetOpenId != null) {
            etTargetOpenId.setText(targetOpenId);
            etTargetOpenId.setSelection(etTargetOpenId.getText().length());
        }
        if (etFriendRemark != null) {
            etFriendRemark.setText(friendRemark == null ? "" : friendRemark);
            etFriendRemark.setSelection(etFriendRemark.getText().length());
        }
        String summary = "已回填好友参数: openid=" + targetOpenId;
        if (!TextUtils.isEmpty(friendRemark)) {
            summary += "，备注=" + friendRemark;
        }
        appendFlowLog(summary);
        ToastUtils.showToast(this, "已回填到目标 openid 和好友备注");
    }

    private String readText(EditText editText) {
        return editText == null || editText.getText() == null ? "" : editText.getText().toString();
    }

    private int dp(int value) {
        return (int) (value * getResources().getDisplayMetrics().density);
    }
}
