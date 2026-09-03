package com.ruixue.feedbackui.adapter;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.ruixue.feedbackui.R;
import com.ruixue.feedbackui.bean.FeedbackDetailItem;

import java.util.List;

public class FeedbackAttachAdapter extends RecyclerView.Adapter<FeedbackAttachAdapter.ViewHolder> {

    private Activity mActivity;
    private List<FeedbackDetailItem.DataDTO.PropDTO> mData;
    private int mStatus = 2;
    private ItemClickCallBack mItemClickCallBack;

    public interface ItemClickCallBack {
        void onItemClick(View view, int position, FeedbackDetailItem.DataDTO.PropDTO item);
    }

    public FeedbackAttachAdapter(List<FeedbackDetailItem.DataDTO.PropDTO> mData) {
//        this.mActivity = activity;
        this.mData = mData;
    }

    public FeedbackAttachAdapter(Activity activity, List<FeedbackDetailItem.DataDTO.PropDTO> mData) {
        this.mActivity = activity;
        this.mData = mData;
    }

    public void setItemClickCallBack(ItemClickCallBack itemClickCallBack) {
        this.mItemClickCallBack = itemClickCallBack;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext())
                .inflate(R.layout.layout_feedback_attach_item, viewGroup, false);
        return new FeedbackAttachAdapter.ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder mailAttachHolder, int i) {
        mailAttachHolder.attachCount.setText(mData.get(i).getCount());
        Glide.with(mailAttachHolder.itemView.getContext()).load(mData.get(i).getIcon()).into(mailAttachHolder.attchIcon);
        if (mStatus == 1) {
            mailAttachHolder.abtainStatus.setVisibility(View.VISIBLE);
        }else {
            mailAttachHolder.abtainStatus.setVisibility(View.GONE);
        }
        mailAttachHolder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mItemClickCallBack.onItemClick(v, i, mData.get(i));
            }
        });
    }

    @Override
    public int getItemCount() {
        return mData != null ? mData.size() : 0;
    }

    public void addAll(List<FeedbackDetailItem.DataDTO.PropDTO> list) {
        mData.clear();
/*        List<MailDetailBean.PropsDTO> testList = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            MailDetailBean.PropsDTO test = new MailDetailBean.PropsDTO();
            test.setName("test" + 1);
            test.setCount(i);
            testList.add(test);
        }
        mData.addAll(testList);*/
        mData.addAll(list);
        notifyDataSetChanged();
    }

    public void setObtainStatus(int status) {
        this.mStatus = status;
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {

        TextView attachCount;
        ImageView attchIcon;
        TextView abtainStatus;


        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            attachCount = itemView.findViewById(R.id.attach_count);
            attchIcon = itemView.findViewById(R.id.attch_icon);
            abtainStatus = itemView.findViewById(R.id.abtain_status);
        }
    }

}
