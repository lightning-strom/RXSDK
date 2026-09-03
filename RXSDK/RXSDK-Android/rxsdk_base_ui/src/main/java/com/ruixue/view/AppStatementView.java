package com.ruixue.view;

import android.content.Context;
import android.text.TextUtils;
import android.view.View;
import android.widget.GridView;
import android.widget.ImageView;
import android.widget.ScrollView;
import android.widget.TextView;

import com.ruixue.adapter.OnItemClickInter;
import com.ruixue.adapter.TermsAdapter;
import com.ruixue.legal.LegalData;
import com.ruixue.openapi.RXView;
import com.ruixue.ui.R;
import com.ruixue.utils.RichTextUtils;
import com.ruixue.widget.BaseDialog;

import java.util.List;

/**
 * 声明界面
 */
public class AppStatementView extends RXView {
    private  LegalData legalData;
    private  String defaultKey;
    private  TextView msg;

    public AppStatementView(Context context) {
        super(context);
    }


    /**
     * 声明
     *
     * @param context context
     * @param legalData legalData
     * @param defaultKey defaultKey
     */
    public static AppStatementView create(Context context, LegalData legalData, String defaultKey) {
        return new AppStatementView(context).setData(legalData, defaultKey);
    }

    public AppStatementView setData(LegalData legalData, String defaultKey) {
        this.legalData = legalData;
        this.defaultKey = defaultKey;
        return this;
    }

    @Override
    public int getResId() {
        return R.layout.rx_xieyi;
    }


    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        ImageView close = view.findViewById(R.id.close);
        close.setVisibility(isCancelable() ? View.VISIBLE : View.GONE);
        close.setEnabled(isCancelable());
        close.setOnClickListener(v -> {
            dialog.dismiss();
        });
        ScrollView scroll = view.findViewById(R.id.srcoll);
        msg = view.findViewById(R.id.msg);
        GridView gridView = view.findViewById(R.id.gview);
        loadData(scroll, gridView);
    }

    private void loadData(ScrollView scroll, GridView gridView) {
        if (null != legalData && legalData.getTerms() != null) {
            List<LegalData.TermsBean> data_list = legalData.getTerms();
            if (data_list.size() > 0) {
                LegalData.TermsBean termsBean = data_list.get(0);
                termsBean.setSelect(true);
                RichTextUtils.setRichText(getContext(), msg, termsBean.getContent());
            }

            TermsAdapter termsAdapter = new TermsAdapter(getContext(), data_list, new OnItemClickInter<TermsAdapter>() {
                @Override
                public void click(TermsAdapter adapter, int postion) {
                    for (int i = 0; i < data_list.size(); i++) {
                        LegalData.TermsBean terms = data_list.get(i);
                        if (i == postion) {
                            terms.setSelect(true);
                            RichTextUtils.setRichText(getContext(), msg, terms.getContent());
                            scroll.scrollTo(0, 0);
                        } else {
                            terms.setSelect(false);
                        }
                        adapter.notifyDataSetChanged();
                    }
                }
            });

            gridView.setAdapter(termsAdapter);
            if (!TextUtils.isEmpty(defaultKey)) {
                boolean flag = false;
                for (int i = 0; i < data_list.size(); i++) {
                    LegalData.TermsBean terms = data_list.get(i);
                    if (terms.getKey().equals(defaultKey)) {
                        flag = true;
                        terms.setSelect(true);
                        RichTextUtils.setRichText(getContext(), msg, terms.getContent());
                        gridView.smoothScrollToPosition(i);
                    } else {
                        terms.setSelect(false);
                    }
                }
                if (!flag && data_list.size() > 0) {
                    data_list.get(0).setSelect(true);
                    RichTextUtils.setRichText(getContext(), msg, data_list.get(0).getContent());
                }
                termsAdapter.notifyDataSetChanged();
            }
        }
    }
}
