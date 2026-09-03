package com.ruixue.view.mail;

import android.app.Activity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.ruixue.ui.R;
import com.ruixue.view.mail.bean.MailDetailBean;

import java.util.ArrayList;
import java.util.List;

public class MailAttachAdapter extends RecyclerView.Adapter<MailAttachAdapter.MailAttachHolder> {

    private Activity mActivity;
    private List<MailDetailBean.PropsDTO> mData;
    private int mStatus = 1;
    private ItemClickCallBack mItemClickCallBack;

    public interface ItemClickCallBack {
        void onItemClick(View view, int position, MailDetailBean.PropsDTO mailItem);
    }

    public MailAttachAdapter(Activity activity, List<MailDetailBean.PropsDTO> mData) {
        this.mActivity = activity;
        this.mData = mData;
    }

    public void setItemClickCallBack(ItemClickCallBack itemClickCallBack) {
        this.mItemClickCallBack = itemClickCallBack;
    }

    @NonNull
    @Override
    public MailAttachHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext())
                .inflate(R.layout.layout_mail_attach_item, viewGroup, false);
        return new MailAttachAdapter.MailAttachHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MailAttachHolder mailAttachHolder, int i) {
        mailAttachHolder.attachCount.setText(mData.get(i).getCountFormat());
        Glide.with(mActivity).load(mData.get(i).getIcon()).into(mailAttachHolder.attchIcon);
        if (mStatus == 2) {
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

    public void addAll(List<MailDetailBean.PropsDTO> list) {
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

    public static class MailAttachHolder extends RecyclerView.ViewHolder {

        TextView attachCount;
        ImageView attchIcon;
        TextView abtainStatus;


        public MailAttachHolder(@NonNull View itemView) {
            super(itemView);
            attachCount = itemView.findViewById(R.id.attach_count);
            attchIcon = itemView.findViewById(R.id.attch_icon);
            abtainStatus = itemView.findViewById(R.id.abtain_status);
        }
    }

}
