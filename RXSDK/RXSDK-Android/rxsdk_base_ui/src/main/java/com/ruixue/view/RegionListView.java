package com.ruixue.view;

import android.content.Context;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.ImageView;

import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.ruixue.adapter.GroupAdapter;
import com.ruixue.adapter.GroupDecoration;
import com.ruixue.adapter.RegionData;
import com.ruixue.openapi.RXView;
import com.ruixue.ui.R;
import com.ruixue.widget.BaseDialog;

import java.util.List;

public class RegionListView extends RXView {

    private int height = 0;
    private int width = 0;
    private final List<RegionData> mDataList;

    private GroupAdapter.OnItemClickListener<RegionData> mOnItemClickListener = null;

    public RegionListView(Context context, String jsonArray) {
        super(context);
        mDataList = RegionData.fromJson(jsonArray);
    }

    public RegionListView(Context context, List<RegionData> dataList) {
        super(context);
        this.mDataList = dataList;
    }

    public RegionListView setOnItemClickListener(GroupAdapter.OnItemClickListener<RegionData> onItemClickListener) {
        this.mOnItemClickListener = onItemClickListener;
        return this;
    }

    @Override
    public int getStyleId() {
        return com.ruixue.base.R.style.Dialog_None_Ani;
    }

    @Override
    public int getResId() {
        return R.layout.rx_region_list;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        ImageView close = view.findViewById(R.id.close);
        close.setOnClickListener(v -> {
            dialog.dismiss();
        });

        ViewGroup.LayoutParams layoutParams = view.findViewById(R.id.cv_root).getLayoutParams();
        if (height != 0) {
            layoutParams.height = height;
        }
        if (width != 0) {
            layoutParams.width = width;
        }
        EditText et_search = view.findViewById(R.id.et_search);
        ImageView iv_del = view.findViewById(R.id.iv_del);
        //Arrays.asList(testDataList.get(0),testDataList.get(1))
        GroupAdapter groupAdapter = new GroupAdapter(mDataList);
        RecyclerView recyclerView = view.findViewById(R.id.rv_list);
        recyclerView.addItemDecoration(new GroupDecoration(getContext()));
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(getContext());
        recyclerView.setLayoutManager(linearLayoutManager);
        recyclerView.setAdapter(groupAdapter);
        groupAdapter.setOnItemClickListener(new GroupAdapter.OnItemClickListener<RegionData>() {
            @Override
            public void onItemClick(View itemView, RegionData data) {
                if (mOnItemClickListener != null) {
                    mOnItemClickListener.onItemClick(itemView, data);
                }
                dismiss();
            }
        });
        et_search.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                groupAdapter.getFilter().filter(s);
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });
        iv_del.setOnClickListener(v -> et_search.setText(""));
    }

    public static RegionListView create(Context activity, List<RegionData> data) {
        return new RegionListView(activity, data);
    }

    public static RegionListView create(Context activity, String data) {
        return new RegionListView(activity, data);
    }

    public static RegionListView create(Context context) {
        String json = com.ruixue.utils.AssetsUtil.getString(context, "region.dat");
        return new RegionListView(context, json);
    }
}
