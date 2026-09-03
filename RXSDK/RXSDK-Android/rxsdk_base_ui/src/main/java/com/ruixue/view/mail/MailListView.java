package com.ruixue.view.mail;

import android.app.Activity;
import android.content.DialogInterface;
import android.view.View;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.ruixue.RXRequestCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.RXView;
import com.ruixue.ui.R;
import com.ruixue.utils.LoadingDialog;
import com.ruixue.view.mail.bean.MailItemBean;
import com.ruixue.widget.BaseDialog;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class MailListView extends RXView {

    private final Activity mActivity;
    private MailListAdapter mailListAdapter;
    private final String mUserId ;
    private LoadingDialog mViewCreateloadingDialog;
    private ImageView deleteIcon;
    private Button sureBtn;

    public MailListView(@NonNull Activity activity, String userId) {
        super(activity);
        this.mActivity = activity;
        this.mUserId = userId;
    }

    public static MailListView create(Activity activity, String userId) {
        return new MailListView(activity, userId);
    }

    @Override
    protected int getResId() {
        return isLandscape() ? R.layout.layout_mail_list_landscape_view
                : R.layout.layout_mail_list_portrait_view;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {

        RecyclerView recyclerView = view.findViewById(R.id.mail_list);
        FrameLayout close = view.findViewById(R.id.close);
        deleteIcon = view.findViewById(R.id.delete_icon);
        sureBtn = view.findViewById(R.id.sure_btn);
        close.setOnClickListener(v -> close());

        deleteIcon.setOnClickListener(v -> requestDelete(mUserId));
        sureBtn.setOnClickListener(v -> requestGetAward());

        recyclerView.setLayoutManager(new LinearLayoutManager(dialog.getContext()));
        mailListAdapter = new MailListAdapter(mActivity, new ArrayList<>(), mUserId, this::requestList);
        recyclerView.setAdapter(mailListAdapter);

        mViewCreateloadingDialog = LoadingDialog.create(getContext());

        getDialog().setOnShowListener(new OnShowListener() {
            @Override
            public void onShow(DialogInterface dialog) {
                mViewCreateloadingDialog.show();
                requestList();
            }
        });

    }

    private void requestGetAward() {
        LoadingDialog loadingDialog = LoadingDialog.create(getContext());
        loadingDialog.show();
        RuiXueSdk.getRXSdkApi().getEmailAward(mUserId, 2, 0, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject data) {
                try {
                    loadingDialog.dismiss();
                    int code = data.optInt("code");
                    if (code != 0) {
                        ToastUtils.showToast(getContext(), mActivity.getResources().getString(R.string.mail_receive_fial));
                        return;
                    }
                    ToastUtils.showToast(getContext(), mActivity.getResources().getString(R.string.mail_receive_successful));
                    requestList();
                }catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    private void requestList() {
        RuiXueSdk.getRXSdkApi().getEmailList(mUserId, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject data) {
                if (mViewCreateloadingDialog != null) {
                    mViewCreateloadingDialog.dismiss();
                }

                try {
                    int code = data.optInt("code");
                    if (code != 0) {
                        ToastUtils.showToast(getContext(), mActivity.getResources().getString(R.string.mail_load_fail));
                        return;
                    }
                    JSONArray mailJsonlist = data.optJSONObject("data").optJSONArray("list");
                    int allCount = data.optJSONObject("data").optInt("all_count");
                    int notReceivedCount = data.optJSONObject("data").optInt("not_received_count");

                    if (allCount > 0) {
                        deleteIcon.setImageResource(R.drawable.ic_mail_enable_delete);
                        deleteIcon.setClickable(true);
                    }else {
                        deleteIcon.setImageResource(R.drawable.ic_mail_disable_delete);
                        deleteIcon.setClickable(false);
                    }

                    if (notReceivedCount > 0) {
                        sureBtn.setBackgroundResource(R.drawable.shape_btn_1_normal);
                        sureBtn.setClickable(true);
                    }else {
                        sureBtn.setBackgroundResource(R.drawable.shape_btn_1_disable);
                        sureBtn.setClickable(false);
                    }

                    List<MailItemBean> mailList = new ArrayList<>();
                    for (int i = 0; i < mailJsonlist.length(); i++) {
                        MailItemBean mailItemBean = new MailItemBean();
                        mailItemBean.setTitle(mailJsonlist.getJSONObject(i).optString("title"));
                        mailItemBean.setSendAt(mailJsonlist.getJSONObject(i).optString("send_at"));
                        mailItemBean.setStatus(mailJsonlist.getJSONObject(i).optInt("status"));
                        mailItemBean.setRxMailId(mailJsonlist.getJSONObject(i).optInt("rx_mail_id"));
                        mailItemBean.setSendTime(mailJsonlist.getJSONObject(i).optString("send_time"));
                        mailList.add(mailItemBean);
                    }
                    mailListAdapter.addData(mailList);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    public void requestDelete(String userid) {
        LoadingDialog loadingDialog = LoadingDialog.create(getContext());
        loadingDialog.show();
        RuiXueSdk.getRXSdkApi().deleteEmail(userid, 2, 0, new RXRequestCallback() {
            @Override
            public void onResponse(JSONObject data) {
                try {
                    loadingDialog.dismiss();
                    int code = data.optInt("code");
                    if (code != 0) {
                        ToastUtils.showToast(getContext(), mActivity.getResources().getString(R.string.mail_delete_fail));
                        return;
                    }
                    ToastUtils.showToast(getContext(), mActivity.getResources().getString(R.string.mail_delete_successful));
                    requestList();
                }catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }


}
