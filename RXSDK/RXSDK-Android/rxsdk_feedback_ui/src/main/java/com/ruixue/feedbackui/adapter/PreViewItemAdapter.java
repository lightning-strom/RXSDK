package com.ruixue.feedbackui.adapter;

import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.resource.bitmap.RoundedCorners;
import com.ruixue.feedbackui.R;
import com.ruixue.feedbackui.bean.FileItem;
import com.ruixue.feedbackui.util.FeedbackUtil;
import com.ruixue.utils.AppUtils;

import java.util.ArrayList;
import java.util.List;

public class PreViewItemAdapter extends RecyclerView.Adapter<PreViewItemAdapter.PreViewItemHolder>{

    private final ArrayList<FileItem> mData = new ArrayList<>();
    private PreviewClickCallback mCallback;

    public PreViewItemAdapter() {

    }

    public PreViewItemAdapter(List<FileItem> list) {
        if (list != null) {
            mData.addAll(list);
        }
    }

    @NonNull
    @Override
    public PreViewItemAdapter.PreViewItemHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        int layoutId = FeedbackUtil.getOrientation(parent.getContext()) ? R.layout.layout_feedback_preview_item_landscape
                : R.layout.layout_feedback_preview_item_portrait;
        View view = LayoutInflater.from(parent.getContext())
                .inflate(layoutId, parent, false);
        return new PreViewItemAdapter.PreViewItemHolder(view);
    }

    public interface PreviewClickCallback {
        void onClick(int position);
    }

    public void setCallback(PreviewClickCallback callback) {
        this.mCallback = callback;
    }

    @Override
    public void onBindViewHolder(@NonNull PreViewItemAdapter.PreViewItemHolder holder, int position) {
        FileItem fileItem = mData.get(position);
        if (fileItem == null) {
            return;
        }
        String mineType = fileItem.mineType;
        if (TextUtils.isEmpty(mineType)) {
            return;
        }

        holder.imageView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (mCallback != null) {
                    mCallback.onClick(position);
                }
            }
        });

        RoundedCorners roundedCorners = new RoundedCorners(AppUtils.dp2px(holder.itemView.getContext(), 6));

        Glide.with(holder.itemView.getContext())
                .load(fileItem.path)
                .transform(roundedCorners)
                .into(holder.imageView);

        if(fileItem.progress == -1){
            holder.progressRate.setVisibility(View.GONE);
            if (mineType.startsWith("video")) {
                holder.player.setVisibility(View.VISIBLE);
            }else {
                holder.player.setVisibility(View.GONE);
            }
        }else if (fileItem.progress == -2) {
            holder.player.setVisibility(View.GONE);
            holder.progressRate.setVisibility(View.VISIBLE);
//            holder.progressRate.setText("失败");
        } else if (fileItem.progress < 100 && fileItem.progress >= 0) {
            holder.progressRate.setVisibility(View.VISIBLE);
            holder.progressRate.setText(fileItem.progress + "%");
            holder.player.setVisibility(View.GONE);
        }else {
            holder.progressRate.setVisibility(View.GONE);
            holder.player.setVisibility(View.VISIBLE);

            if (mineType.startsWith("video")) {
                holder.player.setVisibility(View.VISIBLE);
            }else {
                holder.player.setVisibility(View.GONE);
            }

        }
    }

    @Override
    public int getItemCount() {
        return mData.size();
    }

    public void clearData() {
        mData.clear();
        notifyDataSetChanged();
    }

    public void addAllData(List<FileItem> list) {
        if (list != null) {
            mData.clear();
            mData.addAll(list);
            notifyDataSetChanged();
        }
    }

    public void addData(FileItem data) {
        if (data != null) {
            mData.add(data);
            notifyDataSetChanged();
        }
    }

    public boolean containData(FileItem data) {
        if (data != null) {
            for (int i = 0; i < mData.size(); i++) {
                String availablePath = mData.get(i).path;
                if (availablePath != null && availablePath.equals(data.path)) {
                    return true;
                }
            }
        }
        return false;
    }

    public int getCurrentProgress(long id) {
        for (int i = 0; i < mData.size(); i++) {
            if (mData.get(i).id == id) {
                return mData.get(i).progress;
            }
        }
        return -1;
    }

    public void setServerUrl(String objectKey, String url) {
        for (int i = 0; i < mData.size(); i++) {
            if (mData.get(i).objectKey.equals(objectKey)) {
                mData.get(i).serverUrl = url;
            }
        }
    }

    public void setSingleDataProgress(String objectKey, int progress) {
        for (int i = 0; i < mData.size(); i++) {
            if (mData.get(i).objectKey.equals(objectKey)) {
                mData.get(i).progress = progress;
            }
        }
        notifyDataSetChanged();
    }


    public ArrayList<FileItem> getData() {
        return mData;
    }


    public static class PreViewItemHolder extends RecyclerView.ViewHolder {

        ImageView imageView;
        TextView progressRate;
        ImageView player;

        public PreViewItemHolder(@NonNull View itemView) {
            super(itemView);
            imageView = itemView.findViewById(R.id.preview_img);
            progressRate = itemView.findViewById(R.id.progress_rate);
            player = itemView.findViewById(R.id.player);

        }
    }
}
