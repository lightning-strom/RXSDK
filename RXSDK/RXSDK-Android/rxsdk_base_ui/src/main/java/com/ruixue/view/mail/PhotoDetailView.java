package com.ruixue.view.mail;

import android.content.Context;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.viewpager.widget.ViewPager;

import com.ruixue.openapi.RXView;
import com.ruixue.ui.R;
import com.ruixue.widget.BaseDialog;

import java.util.ArrayList;
import java.util.List;

public class PhotoDetailView extends RXView {

    private final List<String> mData = new ArrayList<>();
    private int position = 0;

    public PhotoDetailView(@NonNull Context context, int themeResId) {
        super(context, themeResId);
    }

    public PhotoDetailView(@NonNull Context context, List<String> list, int i) {
        super(context);
        this.mData.addAll(list);
        this.position = i;
    }

    public static PhotoDetailView create(Context activity, List<String> list, int i) {
        return new PhotoDetailView(activity, list, i);
    }

    @Override
    protected int getResId() {
        return R.layout.layout_photo_detail;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        ViewPager viewPager = view.findViewById(R.id.view_pager);

        PhotoDetailPagerAdapter adapter = new PhotoDetailPagerAdapter(mData, this::close);

        viewPager.setAdapter(adapter);
        viewPager.setCurrentItem(position);
    }


}
