package com.ruixue.view.mail;

import android.app.Activity;
import android.content.DialogInterface;
import android.graphics.Color;
import android.graphics.Rect;
import android.graphics.drawable.ColorDrawable;
import android.text.Html;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.PopupWindow;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import com.google.gson.Gson;
import com.ruixue.RXRequestCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.RXGlobalData;
import com.ruixue.openapi.RXView;
import com.ruixue.ui.R;
import com.ruixue.utils.AppUtils;
import com.ruixue.utils.LoadingDialog;
import com.ruixue.utils.RichTextUtils;
import com.ruixue.view.mail.bean.MailDetailBean;
import com.ruixue.widget.BaseDialog;
import com.zzhoujay.richtext.callback.OnImageClickListener;

import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;

public class MailDetailView extends RXView {

    private PopupWindow popupWindow;
    private Activity mActivity;
    private LinearLayoutManager linearLayoutManager;
    private GridLayoutManager gridLayoutManager;
    private int mMailId;
    private int mMailStatus;

    private TextView mailTitle;
    private TextView mailContent;
    private Button sureBtn;
    private  MailAttachAdapter mailAttachAdapter;
    private  ImageView popAttchIcon;
    private TextView popAttachTitle;
    private TextView popAttachLimit;
    private TextView popAttachCount;
    private TextView popAttachDescribe;
    private ImageView leftArror;
    private ImageView rightArror;
    private DisMissCallBack mDisMissCallBack;
    private String mUserId;

    private LoadingDialog mLoadingDetailDialog;

    public MailDetailView(@NonNull Activity activity, int mailId, String userId, DisMissCallBack disMissCallBack) {
        super(activity);
        this.mActivity = activity;
        this.mMailId = mailId;
        this.mUserId = userId;
        this.mDisMissCallBack = disMissCallBack;
    }

    interface DisMissCallBack {
        void onDisMiss();
    }

    public static MailDetailView create(Activity activity, int mailId, String userId, DisMissCallBack disMissCallBack) {
        return new MailDetailView(activity, mailId, userId, disMissCallBack);
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
    private void showPopupWindow(View parentView, int position, MailDetailBean.PropsDTO mailitem) {
        if (popupWindow != null && !popupWindow.isShowing()) {

            int height = (int) parentView.getContext().getResources().getDimension(com.ruixue.base.R.dimen.dp_160);
            int width = (int) parentView.getContext().getResources().getDimension(com.ruixue.base.R.dimen.dp_158);
            int offsetY = -(parentView.getHeight() + height - 30);
            int offsetX = 0;

            int visiblePosition = linearLayoutManager.findFirstVisibleItemPosition();

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

            Glide.with(mActivity).load(mailitem.getIcon()).into(popAttchIcon);
            popAttachTitle.setText(mailitem.getName());
            if (mailitem.getIsPermanent() == 0) {
                popAttachLimit.setText(mActivity.getResources().getString(R.string.mail_permanently_valid));
            }else {
                String limitDataString = String.format
                        (mActivity.getResources().getString(R.string.mail_limit_expiration),
                                mailitem.getTimeLimit() + ""
                        );

                popAttachLimit.setText(Html.fromHtml(limitDataString));


                /*popAttachLimit.setText(mailitem.getTimeLimit() + "");*/
            }

            popAttachCount.setText(mailitem.getCountFormat());
            RichTextUtils.setRichText(getContext(), popAttachDescribe, mailitem.getDescribe());

            popupWindow.showAsDropDown(parentView, offsetX, offsetY);
        }
    }

    @Override
    protected int getResId() {
        return isLandscape() ? R.layout.layout_mail_detail_landscape_view
                : R.layout.layout_mail_detail_portrait_view;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {

        initPopupWindow(mActivity);

        mLoadingDetailDialog = LoadingDialog.create(getContext());

        RecyclerView recyclerView = view.findViewById(R.id.mail_attach_recycler);
        FrameLayout back = view.findViewById(R.id.back);
        FrameLayout close = view.findViewById(R.id.close);
        mailTitle = view.findViewById(R.id.mail_title);
        mailContent = view.findViewById(R.id.mail_content);
        sureBtn = view.findViewById(R.id.sure_btn);
        leftArror = view.findViewById(R.id.ic_left_arror);
        rightArror = view.findViewById(R.id.ic_right_arror);

        back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                close();
            }
        });

        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                close();
            }
        });

        sureBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (mMailStatus == 2) {
                    requestDelete(mUserId, mMailId);
                }else {
                    requestGetAward(mUserId, mMailId);
                }
            }
        });

        getDialog().setOnDismissListener(new OnDismissListener() {
            @Override
            public void onDismiss(DialogInterface dialog) {
                if (mDisMissCallBack != null) {
                    mDisMissCallBack.onDisMiss();
                }
            }
        });

            linearLayoutManager  = new LinearLayoutManager(dialog.getContext(),
                    LinearLayoutManager.HORIZONTAL, false);
            recyclerView.setLayoutManager(linearLayoutManager);

            recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
                @Override
                public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                    super.onScrolled(recyclerView, dx, dy);

                    if (linearLayoutManager.findFirstVisibleItemPosition() == 0) {
                        leftArror.setVisibility(View.INVISIBLE);
                    }else {
                        leftArror.setVisibility(View.VISIBLE);
                    }

                    int totalItemCount = linearLayoutManager.getItemCount();
                    int lastVisibleItemPosition = linearLayoutManager.findLastCompletelyVisibleItemPosition();
                    boolean isAtEnd = lastVisibleItemPosition >= totalItemCount - 1;
                    if (isAtEnd) {
                        rightArror.setVisibility(View.INVISIBLE);
                    }else {
                        rightArror.setVisibility(View.VISIBLE);
                    }
                }
            });

        mailAttachAdapter = new MailAttachAdapter(mActivity, new ArrayList<>());
        recyclerView.addItemDecoration(new SpacesItemDecoration());
        recyclerView.setAdapter(mailAttachAdapter);

        mailAttachAdapter.setItemClickCallBack(new MailAttachAdapter.ItemClickCallBack() {
            @Override
            public void onItemClick(View view, int position, MailDetailBean.PropsDTO mailItem) {
                showPopupWindow(view, position, mailItem);
            }
        });

        getDialog().setOnShowListener(new OnShowListener() {
            @Override
            public void onShow(DialogInterface dialog) {
                mLoadingDetailDialog.show();
                requestMailDetail(mMailId);
            }
        });

    }

    private void requestMailDetail(int id) {
        RuiXueSdk.getRXSdkApi().getEmailDetail(mUserId, id, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject data) {
                if (mLoadingDetailDialog != null) {
                    mLoadingDetailDialog.dismiss();
                }
                try {
                    int code = data.optInt("code");
                    if (code != 0) {
                        return;
                    }
                    MailDetailBean mailDetailBean =
                            new Gson().fromJson(data.optJSONObject("data").toString(), MailDetailBean.class);
                    mailTitle.setText(mailDetailBean.getTitle());
//                            String htmStr = "<html><head><style type=\"text/css\"></style></head><body><img src=' https://pco-member-imgs.oss-cn-qingdao.aliyuncs.com/images/f3c2bd84-7a9f-743d-5fee-e46b4746f36a/notification/20190918/5d81e31bb44b9.png'/><p>这里是邮箱的正文，这里支持富文本，可以<strong>加粗</strong>，<span style=\"color: red;\">描红</span>、<em>斜体</em>，感谢您在过去24小时内通过邮箱与我们联系，相关的邮件领取详情，如果是你本人或获得授权的其他人查看了你通过邮箱领取详情，则无需再进行其他操作。这里是邮箱的正文。</p> <img src=' https://pco-member-imgs.oss-cn-qingdao.aliyuncs.com/images/f3c2bd84-7a9f-743d-5fee-e46b4746f36a/notification/20190918/5d81e31bb44b9.png'/>  <img src=' https://pco-member-imgs.oss-cn-qingdao.aliyuncs.com/images/f3c2bd84-7a9f-743d-5fee-e46b4746f36a/notification/20190918/5d81e31bb44b9.png'/></body></html>";
                    RichTextUtils.setRichTextImage(getContext(), mailContent, mailDetailBean.getContent(),
                            AppUtils.dp2px(mActivity, 67),
                            AppUtils.dp2px(mActivity, 59), new OnImageClickListener() {
                                @Override
                                public void imageClicked(List<String> list, int i) {
                                    PhotoDetailView.create(mActivity, list, i).show();
                                }
                            });
                    mailAttachAdapter.setObtainStatus(mailDetailBean.getStatus());
                    if (mailDetailBean.getProps() != null) {

                        leftArror.setVisibility(View.INVISIBLE);

                        if (isLandscape()) {
                            if (mailDetailBean.getProps().size() > 6) {
                                leftArror.setVisibility(View.VISIBLE);
                            }else {
                                leftArror.setVisibility(View.INVISIBLE);
                            }
                        }else {
                            if (mailDetailBean.getProps().size() > 4) {
                                leftArror.setVisibility(View.VISIBLE);
                            }else {
                                leftArror.setVisibility(View.INVISIBLE);
                            }
                        }

                        mailAttachAdapter.addAll(mailDetailBean.getProps());
                    }
                    mMailStatus = mailDetailBean.getStatus();
                    if (mailDetailBean.getStatus() == 2 || mailDetailBean.getProps() == null
                            || mailDetailBean.getProps().isEmpty()) {
                        mMailStatus = 2;
                        sureBtn.setText(mActivity.getResources().getString(R.string.mail_delete_email));
                        sureBtn.setBackgroundResource(R.drawable.shape_btn_attach_delete);
                    }else {
                        sureBtn.setText(mActivity.getResources().getString(R.string.mail_claim_the_item));
                        sureBtn.setBackgroundResource(R.drawable.shape_btn_attach_abtain);
                    }
                }catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    private void requestGetAward(String userId, int mailId) {
        LoadingDialog loadingDialog = LoadingDialog.create(getContext());
        loadingDialog.show();
        RuiXueSdk.getRXSdkApi().getEmailAward(userId, 1, mailId, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject data) {
                loadingDialog.dismiss();
                try {
                    int code = data.optInt("code");
                    if (code != 0) {
                        ToastUtils.showToast(getContext(), mActivity.getResources().getString(R.string.mail_receive_fial));
                        return;
                    }
                    requestMailDetail(mailId);
                    ToastUtils.showToast(getContext(), mActivity.getResources().getString(R.string.mail_receive_successful));
                }catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    public void requestDelete(String userid, int mailid) {
        LoadingDialog loadingDialog = LoadingDialog.create(getContext());
        loadingDialog.show();
        RuiXueSdk.getRXSdkApi().deleteEmail(userid, 1, mailid, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject data) {
                loadingDialog.dismiss();
                try {
                    int code = data.optInt("code");
                    if (code != 0) {
                        ToastUtils.showToast(getContext(), mActivity.getResources().getString(R.string.mail_delete_fail));
                        return;
                    }
                    ToastUtils.showToast(getContext(), mActivity.getResources().getString(R.string.mail_delete_successful));
                    close();
                }catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
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

                        outRect.right = AppUtils.dp2px(view.getContext(), 12);

                    } else {
                        outRect.left = AppUtils.dp2px(view.getContext(), 12);
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
                        outRect.right = AppUtils.dp2px(view.getContext(), 12);
                    } else {
                        outRect.left = AppUtils.dp2px(view.getContext(), 12);
                    }
                }
            }
        }
    }

}
