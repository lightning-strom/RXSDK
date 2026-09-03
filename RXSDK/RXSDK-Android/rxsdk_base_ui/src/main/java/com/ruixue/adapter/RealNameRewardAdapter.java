package com.ruixue.adapter;


import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.ruixue.passport.Reward;
import com.ruixue.ui.R;

import java.util.ArrayList;
import java.util.List;

// Created by wangliang on 2025/3/13.
public class RealNameRewardAdapter extends RecyclerView.Adapter<RealNameRewardAdapter.ViewHolder> {

    private final List<Reward.RewardItem> mData = new ArrayList<>();

    @NonNull
    @Override
    public RealNameRewardAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.layout_item_real_name_reward, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        if (position < 0 || position >= mData.size()) {
            return;
        }
        Reward.RewardItem item = mData.get(position);

        holder.rewardCountTv.setText(item.getNum_format());
        if (TextUtils.isEmpty(item.getIcon())) {
            holder.rewardIconIv.setVisibility(View.GONE);
        } else {
            Glide.with(holder.rewardIconIv.getContext()).load(item.getIcon()).into(holder.rewardIconIv);
        }
        holder.spacer.setVisibility(position == mData.size() - 1 ? View.GONE : View.VISIBLE);
    }

    @Override
    public int getItemCount() {
        return mData.size();
    }

    public void setData(List<Reward.RewardItem> data) {
        if (!mData.isEmpty()) {
            mData.clear();
        }

        if (data != null) {
            mData.addAll(data);
        }
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        public ImageView rewardIconIv;
        public TextView rewardCountTv;
        public View spacer;


        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            rewardIconIv = itemView.findViewById(R.id.iv_reward_icon);
            rewardCountTv = itemView.findViewById(R.id.tv_reward_count);
            spacer = itemView.findViewById(R.id.spacer);
        }
    }
}
