package com.ruixue.feedbackui.fragment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.bumptech.glide.Glide;
import com.luck.picture.lib.entity.LocalMedia;
import com.ruixue.feedbackui.R;
import com.ruixue.feedbackui.bean.FileItem;
import com.ruixue.view.photoview.PhotoView;

public class PhotoDetailFragment extends Fragment {

    private FileItem mFileItem;

    public PhotoDetailFragment() {}

    public void setFileItem(FileItem fileItem) {
        this.mFileItem = fileItem;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.layout_feedback_photodetail, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        PhotoView photoView = view.findViewById(R.id.photo_view);

        if (mFileItem != null && getContext() != null) {
            Glide.with(getContext()).load(mFileItem.path).into(photoView);
        }

    }
}
