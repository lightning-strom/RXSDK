package com.ruixue.adapter;

import android.content.Context;
import android.graphics.Paint;
import android.text.TextPaint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.ruixue.legal.LegalData;
import com.ruixue.ui.R;

import java.util.List;

public class TermsAdapter extends BaseAdapter {

    private final Context mContext;
    private final List<LegalData.TermsBean> datas;
    private final OnItemClickInter<TermsAdapter> onItemClickInter;

    public TermsAdapter(Context context, List<LegalData.TermsBean> _datas, OnItemClickInter<TermsAdapter> onItemClickInter) {
        this.mContext = context;
        this.datas = _datas;
        this.onItemClickInter = onItemClickInter;
    }


    @Override
    public int getCount() {
        return datas.size();
    }

    @Override
    public Object getItem(int position) {
        return null;
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder viewHolder;

        if (convertView == null) {
            convertView = LayoutInflater.from(mContext).inflate(R.layout.rx_xieyi_item, parent, false);
            viewHolder = new ViewHolder();
            viewHolder.name = convertView.findViewById(R.id.name);
            viewHolder.bg_select = convertView.findViewById(R.id.bg_select);
            convertView.setTag(viewHolder);
        } else {
            viewHolder = (ViewHolder) convertView.getTag();
        }
        if (datas != null && datas.size() > 0) {
            LegalData.TermsBean terms = datas.get(position);
            viewHolder.name.setText(terms.getTitle());
            TextPaint paint = viewHolder.name.getPaint();

            if (terms.isSelected()) {
                viewHolder.bg_select.setVisibility(View.VISIBLE);
                viewHolder.name.setTextColor(mContext.getResources().getColor(R.color.color_10998e));
//                viewHolder.name.getPaint().setFakeBoldText(true);
                paint.setStyle(Paint.Style.FILL_AND_STROKE);
                paint.setStrokeWidth(0.7f);
//                viewHolder.name.setTextSize(14);
            } else {
                viewHolder.bg_select.setVisibility(View.GONE);
                viewHolder.name.setTextColor(mContext.getResources().getColor(R.color.black));
//                viewHolder.name.getPaint().setFakeBoldText(false);
                paint.setStyle(Paint.Style.FILL);
                paint.setStrokeWidth(0.7f);
//                viewHolder.name.setTextSize(12);
            }

        }
        // 这里只是模拟，实际开发可能需要加载网络图片，可以使用ImageLoader这样的图片加载框架来异步加载图片
        viewHolder.name.setOnClickListener(v -> {
            this.onItemClickInter.click(this, position);
        });

        return convertView;
    }


    static class ViewHolder {
        ImageView bg_select;
        TextView name;
//        View kk;
    }
}