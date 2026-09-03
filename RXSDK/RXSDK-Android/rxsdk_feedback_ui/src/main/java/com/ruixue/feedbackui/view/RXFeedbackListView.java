package com.ruixue.feedbackui.view;

import android.content.Context;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.gson.Gson;
import com.ruixue.RXRequestCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.feedbackui.R;
import com.ruixue.feedbackui.adapter.FeedbackListAdapter;
import com.ruixue.feedbackui.bean.FeedbackListItem;
import com.ruixue.net.RXRequest;
import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.RXView;
import com.ruixue.utils.LoadingDialog;
import com.ruixue.utils.ThreadUtils;
import com.ruixue.widget.BaseDialog;
import org.json.JSONObject;
import java.util.HashMap;
import java.util.List;

public class RXFeedbackListView extends RXView {

    private RecyclerView recyclerView;
    private int currentPage = 1;
    private boolean isLoading = false;

    private FeedbackListAdapter adapter;

    LoadingDialog loadingDialog = LoadingDialog.create(getContext());

    public RXFeedbackListView(@NonNull Context context) {
        super(context);
    }

    public static RXFeedbackListView create(Context context) {
        return new RXFeedbackListView(context);
    }

    @Override
    protected int getResId() {
        return isLandscape() ? R.layout.layout_feedback_list_landscape_view
                : R.layout.layout_feedback_list_portrait_view;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        recyclerView = view.findViewById(R.id.feedback_list);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        currentPage = 1;
        isLoading = false;

        adapter = new FeedbackListAdapter();
        recyclerView.setAdapter(adapter);

        view.findViewById(R.id.close).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dismiss();
            }
        });

        view.findViewById(R.id.close_btn).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dismiss();
            }
        });

        loadingDialog.show();

        getFeedbackList(1);

        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
                super.onScrolled(recyclerView, dx, dy);

                LinearLayoutManager layoutManager = (LinearLayoutManager) recyclerView.getLayoutManager();
                int totalItemCount = layoutManager.getItemCount();
                int lastVisibleItemPosition = layoutManager.findLastVisibleItemPosition();

                // 判断是否滚动到底部且未正在加载
                if (!isLoading && lastVisibleItemPosition >= totalItemCount - 3) {
                    getPageFeedbackList();
                }
            }
        });

    }

    private void getPageFeedbackList() {
        if (isLoading) {
            return;
        }
        isLoading = true;
        getFeedbackList(++currentPage);
    }

    private void getFeedbackList(int page) {

        HashMap<String, Object> feedbackQuery = new HashMap<>();
        feedbackQuery.put("page", page);
        feedbackQuery.put("size", 20);
        ThreadUtils.getInstance().runOnBgThreadUseExecutor(new Runnable() {
            @Override
            public void run() {
                RXRequest.create("v1/feedbackapi/player_feedback/list")
                        .setNeedLoggedIn(true)
                        .setBody(feedbackQuery)
                        .get(new RXRequestCallback() {
                            @Override
                            public void onResponse(JSONObject jsonObject) {
                                loadingDialog.dismiss();
                                try {
                                    showContent(jsonObject);
                                }catch (Exception e) {
                                    e.printStackTrace();
                                }
                            }
                        });

            }
        });
    }

    public void showContent(JSONObject jsonObject) {
        if (jsonObject != null) {
            Gson gson = new Gson();
            FeedbackListItem feedbackListItem =
                    gson.fromJson(jsonObject.toString(), FeedbackListItem.class);
            if (feedbackListItem.getCode() == 0) {
                List<FeedbackListItem.DataDTO.ListDTO> listDTO = feedbackListItem.getData().getList();
                if (listDTO == null || !listDTO.isEmpty()) {
                    isLoading = false;
                    adapter.addAll(listDTO);
                }
                adapter.setCallback(new FeedbackListAdapter.ItemClickCallback() {
                    @Override
                    public void onClick(int id) {
                        RXFeedbackDetailView.create(RuiXueSdk.getCurrentActivity(), id).show();
                    }
                });

            }else {
                isLoading = false;
                ToastUtils.showToast(getContext(),
                        getContext().getResources().getString(R.string.mail_load_fail));
            }
        }else {
            isLoading = false;
        }
    }

}
