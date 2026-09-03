package com.ruixue.adapter;

import android.annotation.SuppressLint;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Filter;
import android.widget.Filterable;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.ruixue.ui.R;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


public class GroupAdapter extends RecyclerView.Adapter<GroupAdapter.ViewHolder> implements Filterable, View.OnClickListener {

    public interface OnItemClickListener<T> {
        void onItemClick(View itemView, T data);
    }

    private NameFilter mNameFilter;
    private final List<RegionData> mSourceDataList;
    private List<RegionData> mFilteredDataList;

    public void setOnItemClickListener(OnItemClickListener<RegionData> onItemClickListener) {
        this.mOnItemClickListener = onItemClickListener;
    }

    private OnItemClickListener<RegionData> mOnItemClickListener = null;


    public GroupAdapter(List<RegionData> datas) {
        if (datas != null) {
            Collections.sort(datas);
        }
        this.mFilteredDataList = datas;
        this.mSourceDataList = datas;
    }

    @Override
    public void onClick(View v) {
        if (mOnItemClickListener != null) {
            mOnItemClickListener.onItemClick(v, (RegionData) v.getTag());
        }
    }

    @NonNull
    @Override
    public GroupAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.rx_region_list_item, viewGroup, false);
        view.setOnClickListener(this);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull GroupAdapter.ViewHolder viewHolder, int i) {
        RegionData data = mFilteredDataList.get(i);
        viewHolder.setTag(data);
        viewHolder.mNameTextView.setText(data.getText());
        viewHolder.mRegionTextView.setText(data.getTel());
    }

    @Override
    public Filter getFilter() {
        if (mNameFilter == null) {
            mNameFilter = new NameFilter();
        }
        return mNameFilter;
    }

    @Override
    public int getItemCount() {
        return mFilteredDataList == null ? 0 : mFilteredDataList.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        public TextView mNameTextView;
        public TextView mRegionTextView;

        public void setTag(Object tag) {
            itemView.setTag(tag);
        }

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            mNameTextView = itemView.findViewById(R.id.tv_name);
            mRegionTextView = itemView.findViewById(R.id.tv_region);
        }
    }

    /**
     * 获取position对应的Item组名
     * @param position
     * @return
     */
    public String getGroupName(int position) {
        return mFilteredDataList.get(position).getGroupName();
    }

    /**
     * 判断position对应的Item是否是组的第一项
     * @param position
     * @return
     */
    public boolean isItemHeader(int position) {
        if (position == 0) {
            return true;
        } else if (mFilteredDataList != null && position < mFilteredDataList.size()) {
            String lastGroupName = mFilteredDataList.get(position - 1).getGroupName();
            String currentGroupName = mFilteredDataList.get(position).getGroupName();
            //判断上一个数据的组别和下一个数据的组别是否一致，如果不一致则是不同组，也就是为第一项（头部）
            return !lastGroupName.equals(currentGroupName);
        } else {
            return false;
        }
    }

    // 异步过滤数据，避免数据多耗时长堵塞主线程
    class NameFilter extends Filter {
        // 执行筛选
        @Override
        protected FilterResults performFiltering(CharSequence charSequence) {
            if (TextUtils.isEmpty(charSequence)) {
                mFilteredDataList = mSourceDataList;
            } else {
                String searchContent = charSequence.toString().toLowerCase();
                mFilteredDataList = new ArrayList<>();
                for (RegionData name : mSourceDataList) {
                    if (name.getText().toLowerCase().contains(searchContent)) {
                        mFilteredDataList.add(name);
                    }
                }
            }
            FilterResults filterResults = new FilterResults();
            filterResults.values = mFilteredDataList;
            return filterResults;
        }

        // 筛选结果
        @SuppressLint("NotifyDataSetChanged")
        @SuppressWarnings("unchecked")
        @Override
        protected void publishResults(CharSequence arg0, FilterResults results) {
            mFilteredDataList = (List<RegionData>) results.values;
            notifyDataSetChanged();
        }
    }
}
