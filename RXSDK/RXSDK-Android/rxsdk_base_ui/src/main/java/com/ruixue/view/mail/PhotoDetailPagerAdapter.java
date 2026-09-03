package com.ruixue.view.mail;

import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import androidx.viewpager.widget.PagerAdapter;
import com.bumptech.glide.Glide;
import com.ruixue.view.photoview.PhotoView;
import java.util.ArrayList;
import java.util.List;

public class PhotoDetailPagerAdapter  extends PagerAdapter {

    private final List<String> mData = new ArrayList<>();
    private PhotoClickCallBack mCallBack;

    interface PhotoClickCallBack {
        void OnClickCallBack();
    }

    public PhotoDetailPagerAdapter(List<String> list, PhotoClickCallBack callBack) {
        this.mCallBack = callBack;
        this.mData.addAll(list);
    }

    @Override
    public int getCount() {
        return mData.size();
    }

    @Override
    public View instantiateItem(ViewGroup container, int position) {
        PhotoView photoView = new PhotoView(container.getContext());

        photoView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (mCallBack != null) {
                    mCallBack.OnClickCallBack();
                }
            }
        });

        Glide.with(container.getContext()).load(mData.get(position).trim()).into(photoView);
        container.addView(photoView, ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        return photoView;

    }

    @Override
    public void destroyItem(ViewGroup container, int position, Object object) {
        container.removeView((View) object);
    }

    @Override
    public boolean isViewFromObject(View view, Object object) {
        return view == object;
    }

}
