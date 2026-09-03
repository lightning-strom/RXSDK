package com.ruixue.feedbackui.view;

import android.content.Context;
import android.content.pm.ActivityInfo;
import android.provider.MediaStore;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RelativeLayout;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.luck.picture.lib.basic.PictureSelectionModel;
import com.luck.picture.lib.basic.PictureSelector;
import com.luck.picture.lib.config.SelectMimeType;
import com.luck.picture.lib.config.SelectModeConfig;
import com.luck.picture.lib.engine.ImageEngine;
import com.luck.picture.lib.engine.UriToFileTransformEngine;
import com.luck.picture.lib.engine.VideoPlayerEngine;
import com.luck.picture.lib.entity.LocalMedia;
import com.luck.picture.lib.interfaces.OnKeyValueResultCallbackListener;
import com.luck.picture.lib.interfaces.OnQueryFilterListener;
import com.luck.picture.lib.interfaces.OnResultCallbackListener;
import com.luck.picture.lib.language.LanguageConfig;
import com.luck.picture.lib.style.BottomNavBarStyle;
import com.luck.picture.lib.style.PictureSelectorStyle;
import com.luck.picture.lib.style.SelectMainStyle;
import com.luck.picture.lib.style.TitleBarStyle;
import com.luck.picture.lib.utils.DensityUtil;
import com.luck.picture.lib.utils.SandboxTransformUtils;
import com.ruixue.RXJSONCallback;
import com.ruixue.RXRequestCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.feedbackui.R;
import com.ruixue.feedbackui.adapter.PreViewItemAdapter;
import com.ruixue.feedbackui.bean.FileItem;
import com.ruixue.feedbackui.engine.ExoPlayerEngine;
import com.ruixue.feedbackui.engine.GlideEngine;
import com.ruixue.listener.OnMultiClickListener;
import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.RXView;
import com.ruixue.oss.OSSSdkWrapper;
import com.ruixue.oss.RXProgressListener;
import com.ruixue.utils.LoadingDialog;
import com.ruixue.utils.ThreadUtils;
import com.ruixue.widget.BaseDialog;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class RXCreateFeedBackView extends RXView {

    public PreViewItemAdapter preViewAdapter;
    private RelativeLayout addFile;
    public ArrayList<LocalMedia> originalData;
    public EditText content_edittext;
    public EditText phone_number;
    boolean isUploadAll = false;
    Map<String, FileItem> uploadResMap = new ConcurrentHashMap<>();

    LoadingDialog loadingDialog = LoadingDialog.create(getContext());

    public RXCreateFeedBackView(@NonNull Context context) {
        super(context);
    }

    public static RXCreateFeedBackView create(Context context) {
        return new RXCreateFeedBackView(context);
    }

    @Override
    protected int getResId() {
        return isLandscape() ? R.layout.layout_create_feedback_landscape
                : R.layout.layout_create_feedback_protrait;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {

        view.findViewById(R.id.close).setOnClickListener(new OnMultiClickListener() {
            @Override
            public void onMultiClick(View v) {
                dismiss();
            }
        });

        RecyclerView recyclerView = view.findViewById(R.id.recycler_view);
        addFile = view.findViewById(R.id.add_file);
        content_edittext = view.findViewById(R.id.content_edittext);
        phone_number = view.findViewById(R.id.phone_number);
        TextView text_limit = view.findViewById(R.id.text_limit);
        Button sure_btn = view.findViewById(R.id.sure_btn);

        content_edittext.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (s != null) {
                    text_limit.setText(s.length() + "/" + "200");
                }
            }

            @Override
            public void afterTextChanged(Editable s) {

            }
        });

        addFile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showSelector();
            }
        });

        LinearLayoutManager linearLayoutManager  = new LinearLayoutManager(dialog.getContext(),
                LinearLayoutManager.HORIZONTAL, false);

        recyclerView.setLayoutManager(linearLayoutManager);

        preViewAdapter = new PreViewItemAdapter();
        recyclerView.setAdapter(preViewAdapter);


        preViewAdapter.setCallback(new PreViewItemAdapter.PreviewClickCallback() {
            @Override
            public void onClick(int position) {
//                ArrayList<FileItem> list = preViewAdapter.getData();
//                if (list != null) {
//                    Intent intent = new Intent(getContext(), PreviewActivity.class);
//                    intent.putExtra(PreviewActivity.DATA_LIST, list);
//                    intent.putExtra(PreviewActivity.DATA_POSITION, position);
//                    getContext().startActivity(intent);
//                }
                showSelector();
            }
        });

        sure_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (preViewAdapter.getData() != null) {
                    uploadResMap.clear();
                    String content = content_edittext.getText().toString().trim();
                    if (content.isEmpty()) {
                        ToastUtils.showToast(getContext(),
                                getContext().getResources().getString(R.string.feedback_content_null));
                        return;
                    }

                    submitFile();
                }
            }
        });

    }


    private void showSelector() {
        SelectMainStyle numberSelectMainStyle = new SelectMainStyle();
        numberSelectMainStyle.setSelectNumberStyle(true);
        numberSelectMainStyle.setPreviewSelectNumberStyle(false);
        numberSelectMainStyle.setPreviewDisplaySelectGallery(true);
        numberSelectMainStyle.setSelectBackground(R.drawable.ps_default_num_selector);
        numberSelectMainStyle.setPreviewSelectBackground(R.drawable.ps_preview_checkbox_selector);
        numberSelectMainStyle.setSelectNormalBackgroundResources(R.drawable.ps_select_complete_normal_bg);
        numberSelectMainStyle.setSelectNormalTextColor(ContextCompat.getColor(getContext(), R.color.ps_color_53575e));
        numberSelectMainStyle.setSelectNormalText(R.string.ps_send);

//        numberSelectMainStyle.setSelectNormalBackgroundResources(R.drawable.ps_select_complete_bg);
//        numberSelectMainStyle.setSelectNormalTextColor(ContextCompat.getColor(getContext(), R.color.ps_color_white));
//        numberSelectMainStyle.setSelectNormalText(R.string.ps_send);

        numberSelectMainStyle.setAdapterPreviewGalleryBackgroundResource(R.drawable.ps_preview_gallery_bg);
        numberSelectMainStyle.setAdapterPreviewGalleryItemSize(DensityUtil.dip2px(getContext(), 52));
        numberSelectMainStyle.setPreviewSelectText(R.string.ps_select);
        numberSelectMainStyle.setPreviewSelectTextSize(14);
        numberSelectMainStyle.setPreviewSelectTextColor(ContextCompat.getColor(getContext(), R.color.ps_color_white));
        numberSelectMainStyle.setPreviewSelectMarginRight(DensityUtil.dip2px(getContext(), 6));
        numberSelectMainStyle.setSelectBackgroundResources(R.drawable.ps_select_complete_bg);
        numberSelectMainStyle.setSelectText(R.string.ps_send_num);
        numberSelectMainStyle.setSelectTextColor(ContextCompat.getColor(getContext(), R.color.ps_color_white));
        numberSelectMainStyle.setMainListBackgroundColor(ContextCompat.getColor(getContext(), R.color.ps_color_black));
        numberSelectMainStyle.setCompleteSelectRelativeTop(true);
        numberSelectMainStyle.setPreviewSelectRelativeBottom(true);
        numberSelectMainStyle.setAdapterItemIncludeEdge(false);

        // 头部TitleBar 风格
        TitleBarStyle numberTitleBarStyle = new TitleBarStyle();
        numberTitleBarStyle.setHideCancelButton(true);
        numberTitleBarStyle.setAlbumTitleRelativeLeft(true);
        numberTitleBarStyle.setTitleAlbumBackgroundResource(R.drawable.ps_album_bg);
        numberTitleBarStyle.setTitleDrawableRightResource(R.drawable.ps_ic_grey_arrow);
        numberTitleBarStyle.setPreviewTitleLeftBackResource(R.drawable.ps_ic_normal_back);

        // 底部NavBar 风格
        BottomNavBarStyle numberBottomNavBarStyle = new BottomNavBarStyle();
        numberBottomNavBarStyle.setBottomPreviewNarBarBackgroundColor(ContextCompat.getColor(getContext(), R.color.ps_color_half_grey));
        numberBottomNavBarStyle.setBottomPreviewNormalText(R.string.ps_preview);
        numberBottomNavBarStyle.setBottomPreviewNormalTextColor(ContextCompat.getColor(getContext(), R.color.ps_color_9b));
        numberBottomNavBarStyle.setBottomPreviewNormalTextSize(16);
        numberBottomNavBarStyle.setCompleteCountTips(false);
        numberBottomNavBarStyle.setBottomPreviewSelectText(R.string.ps_preview_num);
        numberBottomNavBarStyle.setBottomPreviewSelectTextColor(ContextCompat.getColor(getContext(), R.color.ps_color_white));


        PictureSelectorStyle selectorStyle = new PictureSelectorStyle();


        selectorStyle.setTitleBarStyle(numberTitleBarStyle);
        selectorStyle.setBottomBarStyle(numberBottomNavBarStyle);
        selectorStyle.setSelectMainStyle(numberSelectMainStyle);

        ImageEngine imageEngine = GlideEngine.createGlideEngine();
        VideoPlayerEngine videoPlayerEngine = new ExoPlayerEngine();

        int chooseMode = SelectMimeType.ofAll();

        PictureSelectionModel selectionModel = PictureSelector.create(getContext())
                .openGallery(chooseMode)
                .setSelectorUIStyle(selectorStyle)
                .setImageEngine(imageEngine)
                .setVideoPlayerEngine(videoPlayerEngine)
                .isAutoVideoPlay(false)
                .isLoopAutoVideoPlay(true)
                .isUseSystemVideoPlayer(false)
                .isPageSyncAlbumCount(true)
                .setQueryFilterListener(new OnQueryFilterListener() {
                    @Override
                    public boolean onFilter(LocalMedia media) {
                        return false;
                    }
                })
                .setSelectionMode(SelectModeConfig.MULTIPLE)
                .setQuerySortOrder(MediaStore.MediaColumns.DATE_MODIFIED + " DESC")
                .isFastSlidingSelect(true)
                .isWithSelectVideoImage(true)
                .isPreviewFullScreenMode(true)
                .isVideoPauseResumePlay(true)
                .setRequestedOrientation(isLandscape() ? ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE : ActivityInfo.SCREEN_ORIENTATION_PORTRAIT)
                .isPreviewZoomEffect(true)
                .isPreviewImage(true)
                .setSandboxFileEngine(new MeSandboxFileEngine())
                .isPreviewVideo(true)
                .isPreviewAudio(false)
                .isDisplayCamera(false)
                .setDefaultLanguage(LanguageConfig.ENGLISH)
                .isGif(false)
                .setMaxSelectNum(5)
                .setMaxVideoSelectNum(5)
                .isMaxSelectEnabledMask(true)
                .isOriginalControl(true)
                .setSelectedData(originalData);
        selectionModel.forResult(new MeOnResultCallbackListener());
    }

    private static class MeSandboxFileEngine implements UriToFileTransformEngine {

        @Override
        public void onUriToFileAsyncTransform(Context context, String srcPath, String mineType, OnKeyValueResultCallbackListener call) {
            if (call != null) {
                call.onCallback(srcPath, SandboxTransformUtils.copyPathToSandbox(context, srcPath, mineType));
            }
        }
    }

    private class MeOnResultCallbackListener implements OnResultCallbackListener<LocalMedia> {
        @Override
        public void onResult(ArrayList<LocalMedia> result) {

            originalData = result;

            if (result == null || result.isEmpty()) {
                preViewAdapter.clearData();
                return;
            }

            List<FileItem> list = new ArrayList<>();

            for (int i = 0; i < result.size(); i++) {

                FileItem fileItem = new FileItem();
                fileItem.id = result.get(i).getId();
                fileItem.path = result.get(i).getAvailablePath();
                fileItem.mineType = result.get(i).getMimeType();
                fileItem.objectKey = getFeedbackObjectKey(result.get(i).getMimeType());

                list.add(fileItem);

//                if (!preViewAdapter.containData(fileItem)) {
//                    preViewAdapter.addData(fileItem);
//                }
            }

            preViewAdapter.addAllData(list);

            if (result.size() >= 5) {
                addFile.setVisibility(View.GONE);
            }else {
                addFile.setVisibility(View.VISIBLE);
            }
        }

        @Override
        public void onCancel() {
            originalData = new ArrayList<>();
            preViewAdapter.clearData();
            addFile.setVisibility(View.VISIBLE);
        }
    }

    public void submitFile() {
        loadingDialog.show();

        if (preViewAdapter.getData().size() <= 0) {
            submitAll();
            return;
        }

        for (int i = 0; i < preViewAdapter.getData().size(); i++) {
            FileItem fileItem = preViewAdapter.getData().get(i);
            OSSSdkWrapper.getInstance().uploadFile(getContext(), fileItem.objectKey,
                    fileItem.path, new UpLoadRXJSONCallback(fileItem), new UpLoadProgressListener());
        }
    }

    class UpLoadProgressListener implements RXProgressListener {

        @Override
        public void onProgress(String objectKey, long bytesWritten, long contentLength) {
            ThreadUtils.getInstance().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    int progress = (int) ((bytesWritten * 100) / contentLength);
                    preViewAdapter.setSingleDataProgress(objectKey, progress);
                }
            });
        }
    }

    class UpLoadRXJSONCallback extends RXJSONCallback {

        FileItem mFileItem;

        public UpLoadRXJSONCallback(FileItem fileItem) {
            this.mFileItem = fileItem;
        }

        @Override
        public void onSuccess(@Nullable JSONObject data) {
            if (data != null) {
                ThreadUtils.getInstance().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        String url = data.optString("url");
                        preViewAdapter.setServerUrl(mFileItem.objectKey, url);
                        preViewAdapter.setSingleDataProgress(mFileItem.objectKey, 100);
                        Log.d("CreateFeedBackView", "上传成功：" + data);
                        uploadResMap.put(mFileItem.objectKey, mFileItem);
                        submitAll();
                    }
                });
            }
        }

        @Override
        public void onFailed(@NonNull JSONObject cause) {
            ThreadUtils.getInstance().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Log.d("CreateFeedBackView", "失败错误原因。。。。： " + cause);
                    if (mFileItem.failCount < 2) {
                        Log.d("CreateFeedBackView", "失败正在重试。。。。:" + mFileItem.failCount);
                        mFileItem.failCount++;
                        preViewAdapter.setSingleDataProgress(mFileItem.objectKey, 0);
                        OSSSdkWrapper.getInstance().uploadFile(getContext(), mFileItem.objectKey,
                                mFileItem.path, new UpLoadRXJSONCallback(mFileItem), new UpLoadProgressListener());
                    } else {
                        Log.d("CreateFeedBackView", "重试结束，无法成功。。。。。。。");
                        preViewAdapter.setSingleDataProgress(mFileItem.objectKey, -2);
                        uploadResMap.put(mFileItem.objectKey, mFileItem);
                        submitAll();
                    }
                }
            });
        }
    }

    private synchronized void submitAll() {
        ArrayList<FileItem> urlList = preViewAdapter.getData();
        if (urlList.size() != uploadResMap.size()) {
            return;
        }

        int i = 0;

        String[] arr = new String[urlList.size()];
        for (Map.Entry<String, FileItem> entry : uploadResMap.entrySet()) {
            arr[i] = urlList.get(i).serverUrl;
            i++;

            if (entry.getValue().progress == -2) {
                ToastUtils.showToast(getContext(),
                        getContext().getResources().getString(R.string.feedback_submit_fail));
                loadingDialog.dismiss();
                return;
            }
        }

        String content = content_edittext.getText().toString().trim();
        String phone = phone_number.getText().toString().trim();

        isUploadAll = true;

        feedbackCreate(content, arr, phone, null, new RXJSONCallback() {
            @Override
            public void onSuccess(@Nullable JSONObject data) {
                loadingDialog.dismiss();
                ToastUtils.showToast(getContext(),
                        getContext().getResources().getString(R.string.feedback_submit_success));
                dismiss();
                isUploadAll = false;
            }

            @Override
            public void onFailed(@NonNull JSONObject cause) {
                loadingDialog.dismiss();
                try {
                    Log.d("CreateFeedBackView", "错误信息：" + cause.toString());
                    String errorStr = cause.optString("msg");
                    ToastUtils.showToast(getContext(), errorStr);
                }catch (Exception e) {
                    e.printStackTrace();
                }
                isUploadAll = false;
            }
        });
    }

    public void feedbackCreate(String content, String[] attachments, String phone, String[] tags,
                               RXJSONCallback callback) {
        RuiXueSdk.getRXSdkApi().feedbackCreate(content, attachments, phone, tags, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject data) {
                try {
                    int code = data.optInt("code");
                    if (code != 0) {
                        if (callback != null) {
                            callback.onFailed(data);
                        }
                        return;
                    }
                    if (callback != null) {
                        callback.onSuccess(data);
                    }
                }catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    public String getFeedbackObjectKey(String mineType) {
        String suffix = "";
        if (mineType.startsWith("video")){
            suffix = "mp4";
        }else {
            suffix = "png";
        }
        String openid = TextUtils.isEmpty(RuiXueSdk.getOpenid()) ? "default" : RuiXueSdk.getOpenid();
        return  "android_feedback_file/" + openid + "_" + UUID.randomUUID().toString() + "." + suffix;
    }

    public static String getExtension(String mineType) {
        int dotIndex = mineType.lastIndexOf('/');
        if (dotIndex == -1) {
            return ""; // 没有找到扩展名
        }
        return mineType.substring(dotIndex + 1);
    }

}
