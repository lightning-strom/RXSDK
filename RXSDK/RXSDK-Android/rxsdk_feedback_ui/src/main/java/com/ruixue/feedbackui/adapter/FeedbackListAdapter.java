package com.ruixue.feedbackui.adapter;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.ruixue.feedbackui.R;
import com.ruixue.feedbackui.bean.FeedbackListItem;

import java.util.ArrayList;
import java.util.List;

public class FeedbackListAdapter extends RecyclerView.Adapter<FeedbackListAdapter.ViewHolder>{

    List<FeedbackListItem.DataDTO.ListDTO> mData = new ArrayList<>();
    private ItemClickCallback mCallback;

    public FeedbackListAdapter() {
    }

    public FeedbackListAdapter(List<FeedbackListItem.DataDTO.ListDTO> data) {
        if (data != null) {
            mData.addAll(data);
        }
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.layout_feedback_list_item, parent, false);
        return new FeedbackListAdapter.ViewHolder(view);
    }

    public void setCallback(ItemClickCallback callback) {
        this.mCallback = callback;
    }

    public interface ItemClickCallback {
        void onClick(int id);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Context context = holder.itemView.getContext();
        holder.feedback_title.setText(mData.get(position).getContent());
        holder.feedback_time.setText(mData.get(position).getCreatedAt());
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (mCallback != null) {
                    mCallback.onClick(mData.get(position).getId());
                }
            }
        });
        if (mData.get(position).getStatus() == 1) {
            holder.feedback_title.setTypeface(null, Typeface.BOLD);
            holder.feedback_title.setTextColor(Color.parseColor("#444444"));
            holder.feedback_state.setText(context.getResources().getString(R.string.feedback_unhandled));
            holder.feedback_state.setTextColor(Color.parseColor("#DC6E6E"));
            holder.feedback_time.setTypeface(null, Typeface.BOLD);
            holder.feedback_time.setTextColor(Color.parseColor("#444444"));
        }else {
            holder.feedback_title.setTypeface(null, Typeface.NORMAL);
            holder.feedback_title.setTextColor(Color.parseColor("#616161"));
            holder.feedback_state.setText(context.getResources().getString(R.string.feedback_handled));
            holder.feedback_state.setTextColor(Color.parseColor("#20C0B3"));
            holder.feedback_time.setTypeface(null, Typeface.NORMAL);
            holder.feedback_time.setTextColor(Color.parseColor("#616161"));
        }
    }

    @Override
    public int getItemCount() {
        return mData.size();
    }

    public void addAll(List<FeedbackListItem.DataDTO.ListDTO> list) {
        if (list != null) {
            mData.addAll(list);
            notifyDataSetChanged();
        }
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {

        TextView feedback_title;
        TextView feedback_state;
        TextView feedback_time;

        public ViewHolder(View itemView) {
            super(itemView);
            feedback_title = itemView.findViewById(R.id.feedback_title);
            feedback_state = itemView.findViewById(R.id.feedback_state);
            feedback_time = itemView.findViewById(R.id.feedback_time);
        }
    }

}
