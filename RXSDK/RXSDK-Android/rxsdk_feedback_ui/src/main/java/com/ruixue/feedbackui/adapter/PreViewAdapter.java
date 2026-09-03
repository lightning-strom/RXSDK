package com.ruixue.feedbackui.adapter;

import android.text.TextUtils;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.lifecycle.Lifecycle;
import androidx.viewpager2.adapter.FragmentStateAdapter;

import com.ruixue.feedbackui.bean.FileItem;
import com.ruixue.feedbackui.fragment.PhotoDetailFragment;
import com.ruixue.feedbackui.fragment.VideoDetailFragment;

import java.util.ArrayList;
import java.util.List;

public class PreViewAdapter extends FragmentStateAdapter {

    private final List<Fragment> mFragmentList = new ArrayList<>();

    public PreViewAdapter(@NonNull FragmentManager fragmentManager, @NonNull Lifecycle lifecycle,
                          List<FileItem> list) {
        super(fragmentManager, lifecycle);

        if (list == null) {
            return;
        }

        for (int i = 0; i < list.size(); i++) {
            FileItem fileItem = list.get(i);
            String mimeType = fileItem.mineType;
            if (TextUtils.isEmpty(mimeType)) {
                continue;
            }
            if (mimeType.startsWith("video")) {
                VideoDetailFragment fragment = new VideoDetailFragment();
                fragment.setFileItem(fileItem);
                mFragmentList.add(fragment);
            }else if (mimeType.startsWith("image")) {
                PhotoDetailFragment fragment = new PhotoDetailFragment();
                fragment.setFileItem(fileItem);
                mFragmentList.add(fragment);
            }
        }

    }

    @NonNull
    @Override
    public Fragment createFragment(int i) {
        return mFragmentList.get(i);
    }

    @Override
    public int getItemCount() {
        return mFragmentList.size();
    }

}
