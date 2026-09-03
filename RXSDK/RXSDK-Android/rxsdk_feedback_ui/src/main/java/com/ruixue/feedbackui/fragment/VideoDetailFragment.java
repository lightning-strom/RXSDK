package com.ruixue.feedbackui.fragment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.google.android.exoplayer2.ExoPlayer;
import com.google.android.exoplayer2.MediaItem;
import com.google.android.exoplayer2.ui.StyledPlayerView;
import com.ruixue.feedbackui.R;
import com.ruixue.feedbackui.bean.FileItem;

public class VideoDetailFragment extends Fragment {

    private FileItem mFileItem;
    private ExoPlayer mExoPlayer;

    public VideoDetailFragment() {
    }

    public void setFileItem(FileItem fileItem) {
        this.mFileItem = fileItem;
    }

    @Nullable
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.layout_feedback_videodetail, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        StyledPlayerView styledPlayerView = view.findViewById(R.id.player_view);

        if (mFileItem != null && getContext() != null) {
            styledPlayerView.setControllerAutoShow(true);
            styledPlayerView.setShowNextButton(false);
            styledPlayerView.setShowPreviousButton(false);
            styledPlayerView.setShowFastForwardButton(false);
            styledPlayerView.setShowRewindButton(false);
            mExoPlayer = new ExoPlayer.Builder(getContext()).build();
            MediaItem mediaItem = MediaItem.fromUri(mFileItem.path);
            mExoPlayer.setMediaItem(mediaItem);
            mExoPlayer.prepare();
            styledPlayerView.setPlayer(mExoPlayer);
        }

    }

    @Override
    public void onPause() {
        super.onPause();
        if (mExoPlayer != null) {
            mExoPlayer.stop();
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (mExoPlayer != null) {
            mExoPlayer.stop();
            mExoPlayer.release();
        }
    }
}
