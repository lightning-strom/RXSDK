package com.ruixue.view.mail;

import android.app.Activity;
import android.graphics.Typeface;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.ruixue.ui.R;
import com.ruixue.view.mail.bean.MailItemBean;

import java.util.List;

public class MailListAdapter extends RecyclerView.Adapter<MailListAdapter.MailViewHolder> {

    private final List<MailItemBean> mData;
    private final Activity mActivity;
    private final String mUserId;
    private final MailDetailView.DisMissCallBack mDisMissCallBack;

    public MailListAdapter(Activity activity, List<MailItemBean> mData, String userId,
                           MailDetailView.DisMissCallBack disMissCallBack) {
        this.mActivity = activity;
        this.mData = mData;
        this.mUserId = userId;
        this.mDisMissCallBack = disMissCallBack;
    }

    @NonNull
    @Override
    public MailViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext())
                .inflate(R.layout.layout_mail_list_item, viewGroup, false);
        return new MailViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MailViewHolder mailViewHolder, int i) {
        mailViewHolder.mailTitle.setText(mData.get(i).getTitle());
        if (mData.get(i).getStatus() == 3) {
            mailViewHolder.mailTitle.setTypeface(null, Typeface.BOLD);
            mailViewHolder.mMailTime.setTypeface(null, Typeface.BOLD);
        }else {
            mailViewHolder.mailTitle.setTypeface(null, Typeface.NORMAL);
            mailViewHolder.mMailTime.setTypeface(null, Typeface.NORMAL);
        }
        mailViewHolder.mMailTime.setText(mData.get(i).getSendTime());
        if (mData.size() - 1 == i) {
            mailViewHolder.mDevidedLine.setVisibility(View.GONE);
        }else {
            mailViewHolder.mDevidedLine.setVisibility(View.VISIBLE);
        }
        if (mData.get(i).getStatus() == 3) {
            mailViewHolder.mailIcon.setImageResource(R.drawable.ic_mail_close);
        }else {
            mailViewHolder.mailIcon.setImageResource(R.drawable.ic_mail_open);
        }
        mailViewHolder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                MailDetailView.create(mActivity, mData.get(i).getRxMailId(), mUserId, mDisMissCallBack).show();
            }
        });
    }

    @Override
    public int getItemCount() {
        return mData != null ? mData.size() : 0;
    }

    public void addData(List<MailItemBean> list) {
        mData.clear();
        mData.addAll(list);
        notifyDataSetChanged();
    }

    public static class MailViewHolder extends RecyclerView.ViewHolder {

        ImageView mailIcon;
        TextView mailTitle;
        View mDevidedLine;
        TextView mMailTime;

        public MailViewHolder(View itemView) {
            super(itemView);
            mailIcon = itemView.findViewById(R.id.mail_icon);
            mailTitle = itemView.findViewById(R.id.mail_title);
            mMailTime = itemView.findViewById(R.id.mail_time);
            mDevidedLine = itemView.findViewById(R.id.devided_line);
        }
    }

}
