package com.ruixue.feedbackui.view;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Rect;
import android.graphics.drawable.ColorDrawable;
import android.text.Html;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.PopupWindow;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.google.gson.Gson;
import com.ruixue.RXRequestCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.feedbackui.R;
import com.ruixue.feedbackui.activity.PreviewActivity;
import com.ruixue.feedbackui.adapter.FeedbackAttachAdapter;
import com.ruixue.feedbackui.adapter.PreViewItemAdapter;
import com.ruixue.feedbackui.bean.FeedbackDetailItem;
import com.ruixue.feedbackui.bean.FileItem;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXView;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.LoadingDialog;
import com.ruixue.utils.RichTextUtils;
import com.ruixue.utils.ThreadUtils;
import com.ruixue.widget.BaseDialog;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class RXFeedbackDetailView extends RXView {

    private Activity mActivity;
    private PopupWindow popupWindow;
    private int mFeedId;
    private ImageView popAttchIcon;
    private TextView popAttachTitle;
    private TextView popAttachLimit;
    private TextView popAttachCount;
    private TextView popAttachDescribe;

    private LinearLayoutManager attachLinearLayoutManager;

    private TextView user_feedback_content;
    private RecyclerView user_recycler_view;
    private TextView gm_feedback_content;
    private RecyclerView gm_recycler_view;
    private RecyclerView attach_recycler_view;
    private LinearLayout recover_layout;
    private LinearLayout prop_layout;
    private Button sure_btn;

    private int isProp;
    private int get_prop;

    private final Set<String> picSuffix = new HashSet<>();
    private final Set<String> videoSuffix = new HashSet<>();

    LoadingDialog loadingDialog = LoadingDialog.create(getContext());
    LoadingDialog pageLoading = LoadingDialog.create(getContext());

    public RXFeedbackDetailView(@NonNull Activity activity, int mFeedId) {
        super(activity);

        picSuffix.add("png");
        picSuffix.add("jpg");
        picSuffix.add("jpeg");

        videoSuffix.add("mp4");

        this.mActivity = activity;
        this.mFeedId = mFeedId;
    }

    public static RXFeedbackDetailView create(Activity activity, int id) {
        return new RXFeedbackDetailView(activity, id);
    }

    @Override
    protected int getResId() {
        return isLandscape() ? R.layout.layout_feedback_detail_landscape_view
                : R.layout.layout_feedback_detail_portrait_view;
    }

    private void initPopupWindow(Activity activity) {
        // 获取PopupWindow的布局
        View popupView = activity.getLayoutInflater()
                .inflate(R.layout.layout_mail_attch_detail, null);

        popAttchIcon = popupView.findViewById(R.id.attch_icon);
        popAttachTitle = popupView.findViewById(R.id.attach_title);
        popAttachLimit = popupView.findViewById(R.id.attach_limit);
        popAttachCount = popupView.findViewById(R.id.attach_count);
        popAttachDescribe = popupView.findViewById(R.id.attach_describe);

        // 创建PopupWindow实例
        popupWindow = new PopupWindow(popupView,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT,
                true);

        // 设置PopupWindow的背景（可选）
        popupWindow.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));

        // 设置PopupWindow是否可以触摸外部消失（可选）
        popupWindow.setOutsideTouchable(true);

    }

    // 显示PopupWindow的方法（根据实际需要调用）
    private void showPopupWindow(View parentView, int position, FeedbackDetailItem.DataDTO.PropDTO item) {
        if (popupWindow != null && !popupWindow.isShowing()) {

            int height = (int) parentView.getContext().getResources().getDimension(R.dimen.dp_160);
            int width = (int) parentView.getContext().getResources().getDimension(R.dimen.dp_158);
            int offsetY = -(parentView.getHeight() + height - 30);
            int offsetX = 0;

            int visiblePosition = attachLinearLayoutManager.findFirstVisibleItemPosition();

            if (isLandscape()) {
                if (position < visiblePosition + 3) {
                    if ("ar".equals(RXGlobalData.getLanguage())) {
                        offsetX = -width;
                    }else {
                        offsetX = 0;
                    }
                }else {
                    if ("ar".equals(RXGlobalData.getLanguage())) {
                        offsetX = -(parentView.getWidth());
                    }else {
                        offsetX = -(width - parentView.getWidth());
                    }
                }
            }else {
                if (position < visiblePosition + 2) {
                    if ("ar".equals(RXGlobalData.getLanguage())) {
                        offsetX = -width;
                    }else {
                        offsetX = 0;
                    }
                }else {
                    if ("ar".equals(RXGlobalData.getLanguage())) {
                        offsetX = -(parentView.getWidth());
                    }else {
                        offsetX = -(width - parentView.getWidth());
                    }
                }
            }

            Glide.with(getContext()).load(item.getIcon()).into(popAttchIcon);
            popAttachTitle.setText(item.getName());
            if (item.getTimeLimit() == 0) {
                popAttachLimit.setText(getContext().getResources().getString(R.string.mail_permanently_valid));
            }else {
                String limitDataString = String.format
                        (getContext().getResources().getString(R.string.mail_limit_expiration),
                                item.getTimeLimit() + ""
                        );

                popAttachLimit.setText(Html.fromHtml(limitDataString));
            }

            popAttachCount.setText(item.getCount());
            RichTextUtils.setRichText(getContext(), popAttachDescribe, item.getDescribe());

            popupWindow.showAsDropDown(parentView, offsetX, offsetY);
        }
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {

        initPopupWindow(mActivity);

        view.findViewById(R.id.close).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dismiss();
            }
        });

        sure_btn = view.findViewById(R.id.sure_btn);

        user_feedback_content = view.findViewById(R.id.user_feedback_content);
        user_recycler_view = view.findViewById(R.id.user_recycler_view);

        gm_feedback_content = view.findViewById(R.id.gm_feedback_content);
        gm_recycler_view = view.findViewById(R.id.gm_recycler_view);

        recover_layout = view.findViewById(R.id.recover_layout);
        prop_layout = view.findViewById(R.id.prop_layout);

        attach_recycler_view = view.findViewById(R.id.attach_recycler_view);


        LinearLayoutManager userLinearLayoutManager  = new LinearLayoutManager(dialog.getContext(),
                LinearLayoutManager.HORIZONTAL, false);
        user_recycler_view.setLayoutManager(userLinearLayoutManager);

        LinearLayoutManager gmLinearLayoutManager  = new LinearLayoutManager(dialog.getContext(),
                LinearLayoutManager.HORIZONTAL, false);
        gm_recycler_view.setLayoutManager(gmLinearLayoutManager);

        attachLinearLayoutManager  = new LinearLayoutManager(dialog.getContext(),
                LinearLayoutManager.HORIZONTAL, false);
        attach_recycler_view.setLayoutManager(attachLinearLayoutManager);

        attach_recycler_view.addItemDecoration(new SpacesItemDecoration());
        requestDetail();

        sure_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isProp == 1 && get_prop == 0) {
                    getprop();
                }else {
                    dismiss();
                }
            }
        });

    }

    private void getprop() {
        loadingDialog.show();
        RuiXueSdk.getRXSdkApi().feedbackGetprop(mFeedId, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject data) {
                loadingDialog.dismiss();
                try {
                    int code = data.optInt("code");
                    if (code != 0) {
                        return;
                    }
                    requestDetail();
                }catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

    }

    private void requestDetail() {
        ThreadUtils.getInstance().runOnBgThreadUseExecutor(new Runnable() {
            @Override
            public void run() {
                RuiXueSdk.getRXSdkApi().getFeedbackDetail(mFeedId, new RXRequestCallback() {
                    @Override
                    public void onResponse(JSONObject jsonObject) {
                        pageLoading.dismiss();
                        if (jsonObject != null) {
                            try {
                                showContent(jsonObject);
                            }catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                    }
                });

            }
        });

    }

    private void showContent(JSONObject jsonObject) {
        Gson gson = new Gson();
        FeedbackDetailItem feedbackDetailItem =
                gson.fromJson(jsonObject.toString(), FeedbackDetailItem.class);
        if (feedbackDetailItem.getCode() == 0 && feedbackDetailItem.getData() != null) {
            FeedbackDetailItem.DataDTO data = feedbackDetailItem.getData();

            isProp = data.getIsProp();
            get_prop = data.getGetProp();
            sure_btn.setVisibility(View.VISIBLE);
            if (isProp == 1 && get_prop == 0) {
                sure_btn.setBackground(getContext().getDrawable(R.drawable.shape_feedback_detail_submit));
                sure_btn.setText(getContext().getResources().getString(R.string.feedback_gm_reward));
            }else {
                sure_btn.setBackground(getContext().getDrawable(R.drawable.bg_feedback_delete_btn));
                sure_btn.setText(getContext().getResources().getString(R.string.feedback_gm_close));
            }

            user_feedback_content.setText(data.getContent());
            if (data.getAttachments() != null) {
                List<String> attach = data.getAttachments();
                ArrayList<FileItem> userAttach = new ArrayList<>();

                for (int i = 0; i < attach.size(); i++) {
                    FileItem fileItem = new FileItem();
                    fileItem.id = i;
                    fileItem.path = attach.get(i);
                    String suffix = getExtension(attach.get(i));
                    if (videoSuffix.contains(suffix)) {
                        fileItem.mineType = "video/" + suffix;
                    }else {
                        fileItem.mineType = "image/" + suffix;
                    }
                    fileItem.progress = -1;
                    userAttach.add(fileItem);
                }

                PreViewItemAdapter userAdapter = new PreViewItemAdapter(userAttach);
                user_recycler_view.setAdapter(userAdapter);
                userAdapter.setCallback(new PreViewItemAdapter.PreviewClickCallback() {
                    @Override
                    public void onClick(int position) {
                        Intent intent = new Intent(getContext(), PreviewActivity.class);
                        intent.putParcelableArrayListExtra(PreviewActivity.DATA_LIST, userAttach);
                        intent.putExtra(PreviewActivity.DATA_POSITION, position);
                        getContext().startActivity(intent);
                    }
                });
            }

            if (data.getStatus() == 1) {
                recover_layout.setVisibility(View.GONE);
                return;
            }
            recover_layout.setVisibility(View.VISIBLE);

            gm_feedback_content.setText(data.getRecoverContent());
            if (data.getRecoverAttachments() != null) {
                List<String> recoverAttach = data.getRecoverAttachments();
                ArrayList<FileItem> gmAttach = new ArrayList<>();
                for (int i = 0; i < recoverAttach.size(); i++) {
                    FileItem gmFileItem = new FileItem();
                    gmFileItem.id = i;
                    gmFileItem.path = recoverAttach.get(i);
                    String suffix = getExtension(recoverAttach.get(i));
                    if (videoSuffix.contains(suffix)) {
                        gmFileItem.mineType = "video/" + suffix;
                    }else {
                        gmFileItem.mineType = "image/" + suffix;
                    }
                    gmFileItem.progress = -1;
                    gmAttach.add(gmFileItem);
                }
                PreViewItemAdapter gmAdapter = new PreViewItemAdapter(gmAttach);
                gm_recycler_view.setAdapter(gmAdapter);
                gmAdapter.setCallback(new PreViewItemAdapter.PreviewClickCallback() {
                    @Override
                    public void onClick(int position) {
                        Intent intent = new Intent(getContext(), PreviewActivity.class);
                        intent.putParcelableArrayListExtra(PreviewActivity.DATA_LIST, gmAttach);
                        intent.putExtra(PreviewActivity.DATA_POSITION, position);
                        getContext().startActivity(intent);
                    }
                });
            }

            if (data.getIsProp() == 0) {
                prop_layout.setVisibility(View.GONE);
                return;
            }

            prop_layout.setVisibility(View.VISIBLE);

            if (data.getProp() != null) {
                List<FeedbackDetailItem.DataDTO.PropDTO> propList = data.getProp();
                FeedbackAttachAdapter attachAdapter = new FeedbackAttachAdapter(propList);
                attachAdapter.setObtainStatus(data.getGetProp());
                attach_recycler_view.setAdapter(attachAdapter);
                attachAdapter.setItemClickCallBack(new FeedbackAttachAdapter.ItemClickCallBack() {
                    @Override
                    public void onItemClick(View view, int position, FeedbackDetailItem.DataDTO.PropDTO item) {
                        showPopupWindow(view, position, item);
                    }
                });
            }
        }
    }

    public static String getExtension(String filePath) {
        int dotIndex = filePath.lastIndexOf('.');
        if (dotIndex == -1) {
            return ""; // 没有找到扩展名
        }
        return filePath.substring(dotIndex + 1);
    }


    public class SpacesItemDecoration extends RecyclerView.ItemDecoration {

        @Override
        public void getItemOffsets(Rect outRect, View view, RecyclerView parent, RecyclerView.State state) {

            outRect.right = 0;
            outRect.left = 0;
            outRect.top = 0;
            outRect.bottom = 0;

            if (isLandscape()) {
                if(parent.getChildLayoutPosition(view) == 0){
                    if ("ar".equals(RXGlobalData.getLanguage())) {
                        outRect.right = 0;
                    } else {
                        outRect.left = 0;
                    }
                }else {
                    if ("ar".equals(RXGlobalData.getLanguage())) {

                        outRect.right = AppUtils.dp2px(view.getContext(), 6);

                    } else {
                        outRect.left = AppUtils.dp2px(view.getContext(), 6);
                    }
                }
            }else {
                if(parent.getChildLayoutPosition(view) == 0){
                    if ("ar".equals(RXGlobalData.getLanguage())) {
                        outRect.right = 0;
                    } else {
                        outRect.left = 0;
                    }
                }else {
                    if ("ar".equals(RXGlobalData.getLanguage())) {
                        outRect.right = AppUtils.dp2px(view.getContext(), 6);
                    } else {
                        outRect.left = AppUtils.dp2px(view.getContext(), 6);
                    }
                }
            }
        }
    }

}
