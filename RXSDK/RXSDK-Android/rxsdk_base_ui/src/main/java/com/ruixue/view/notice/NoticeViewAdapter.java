package com.ruixue.view.notice;

import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.appcompat.content.res.AppCompatResources;
import androidx.recyclerview.widget.RecyclerView;
import com.ruixue.ui.R;
import com.ruixue.view.notice.bean.NoticeItemBean;
import java.util.ArrayList;
import java.util.List;

public class NoticeViewAdapter extends RecyclerView.Adapter<NoticeViewAdapter.NoticeHolder>{


    private final List<NoticeItemBean.DataDTO> mData = new ArrayList<>();
    private NoticeClickCallback mListener;

    public NoticeViewAdapter(List<NoticeItemBean.DataDTO> data) {
        if (data != null) {
            mData.addAll(data);
        }
    }

    public void setOnClick(NoticeClickCallback listener) {
        this.mListener = listener;
    }

    @NonNull
    @Override
    public NoticeViewAdapter.NoticeHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext())
                .inflate(R.layout.layout_radio_button_item, viewGroup, false);
        return new NoticeViewAdapter.NoticeHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull NoticeViewAdapter.NoticeHolder noticeHolder, int i) {

        noticeHolder.title.setText(mData.get(i).getTitle());

        if (mData.get(i).isReaded()) {
            noticeHolder.read.setVisibility(View.INVISIBLE);
        }else {
            noticeHolder.read.setVisibility(View.VISIBLE);
        }

        if (mData.get(i).isSelected()) {
            noticeHolder.layout.setBackground(AppCompatResources.getDrawable(
                    noticeHolder.itemView.getContext(),
                    R.drawable.shape_notice_title_selected)
            );
            noticeHolder.title.setTextColor(Color.parseColor("#ff20C0B3"));
        }else {
            noticeHolder.layout.setBackground(AppCompatResources.getDrawable(
                    noticeHolder.itemView.getContext(),
                    R.drawable.shape_notice_title_unselected)
            );
            noticeHolder.title.setTextColor(Color.parseColor("#ff8B8B8B"));
        }

        noticeHolder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (mListener != null) {
                    mListener.onClick(i);
                }
            }
        });

    }

    public interface NoticeClickCallback {
        void onClick(int position);
    }

    @Override
    public int getItemCount() {
        return mData.size();
    }

    public List<NoticeItemBean.DataDTO> getData() {
        return mData;
    }

    public void notifyData() {
        notifyDataSetChanged();
    }

    public static class NoticeHolder extends RecyclerView.ViewHolder {

        RelativeLayout layout;
        TextView title;
        View read;

        public NoticeHolder(View itemView) {
            super(itemView);

            layout = itemView.findViewById(R.id.layout);
            title = itemView.findViewById(R.id.title);
            read = itemView.findViewById(R.id.readed);

        }
    }

}
