package com.ruixue.view.notice;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.ruixue.ui.R;
import com.ruixue.view.notice.bean.NoticeItemBean;

import java.util.ArrayList;
import java.util.List;

public class ImageListAdapter extends RecyclerView.Adapter<ImageListAdapter.NoticeHolder>{

    private final List<NoticeItemBean.ImageDTO> mData = new ArrayList<>();

    private NoticeViewAdapter.NoticeClickCallback mListener;

    public ImageListAdapter(List<NoticeItemBean.ImageDTO> data) {
        if (data != null) {
            mData.addAll(data);
        }
    }

    public void setOnClick(NoticeViewAdapter.NoticeClickCallback listener) {
        this.mListener = listener;
    }

    @NonNull
    @Override
    public NoticeHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext())
                .inflate(R.layout.layout_image_item, viewGroup, false);
        return new ImageListAdapter.NoticeHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull NoticeHolder noticeHolder, int i) {

        Glide.with(noticeHolder.itemView.getContext()).load(mData.get(i).getImageUrl()).into(noticeHolder.imageView);
        noticeHolder.imageView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (mListener != null) {
                    mListener.onClick(i);
                }
            }
        });

    }

    @Override
    public int getItemCount() {
        return mData.size();
    }

    public static class NoticeHolder extends RecyclerView.ViewHolder {

        ImageView imageView;

        public NoticeHolder(View itemView) {
            super(itemView);

            imageView = itemView.findViewById(R.id.image);

        }
    }

}
