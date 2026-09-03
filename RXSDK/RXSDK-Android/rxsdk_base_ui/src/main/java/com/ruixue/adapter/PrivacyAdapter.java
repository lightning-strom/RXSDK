package com.ruixue.adapter;


import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.TextView;

import androidx.annotation.NonNull;

import com.ruixue.logger.RXLogger;
import com.ruixue.passport.Account;
import com.ruixue.passport.AccountHelper;
import com.ruixue.ui.R;
import com.ruixue.utils.RichTextUtils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class PrivacyAdapter extends BaseAdapter {

    private final List<String> mDataList;
    private final Context mContext;

    public void setOnCheckedChangeListener(CompoundButton.OnCheckedChangeListener mOnCheckedChangeListener) {
        this.mOnCheckedChangeListener = mOnCheckedChangeListener;
    }

    private CompoundButton.OnCheckedChangeListener mOnCheckedChangeListener;

    public PrivacyAdapter(Context context, Collection<String> accountList) {
        this.mDataList = accountList == null ? new ArrayList<>() : new ArrayList<>(accountList);
        this.mContext = context;
    }

    @Override
    public int getCount() {
        return mDataList.size();
    }

    @Override
    public Object getItem(int i) {
        if (i >= 0 && i < mDataList.size()) {
            return mDataList.get(i);
        } else {
            return null;
        }
    }

    @Override
    public long getItemId(int i) {
        return i;
    }


    @Override
    public View getView(int i, View convertView, ViewGroup viewGroup) {
        ViewHolder holder;
        if (convertView == null) {
            convertView = LayoutInflater.from(mContext).inflate(R.layout.rx_privacy_list_item, null);
            holder = new ViewHolder(convertView);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
//            Log.v(RuiXueSdk.TAG, "positon " + i + " convertView is not null, " + convertView);
        }
        String msg = mDataList.get(i);
        RichTextUtils.updateTextViewClickable(mContext, holder.textView, msg, true);
        if (mOnCheckedChangeListener != null) {
            holder.checkBox.setOnCheckedChangeListener(mOnCheckedChangeListener);
        }
        return convertView;
    }

    public static class ViewHolder {
        CheckBox checkBox;
        TextView textView;

        public void setChecked(boolean checked) {
            checkBox.setChecked(checked);
        }

        public boolean isCheckBox() {
            return checkBox.isChecked();
        }

        public ViewHolder(@NonNull View convertView) {
            checkBox = convertView.findViewById(R.id.cbx_privacy);
            textView = convertView.findViewById(R.id.tv_privacy);
        }
    }
}