package com.ruixue.view.notice;

import static android.content.Context.MODE_PRIVATE;
import android.content.Context;
import android.content.SharedPreferences;
import android.text.TextUtils;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.gson.Gson;
import com.ruixue.RuiXueSdk;
import com.ruixue.openapi.RXView;
import com.ruixue.ui.R;
import com.ruixue.utils.RichTextUtils;
import com.ruixue.view.notice.bean.NoticeItemBean;
import com.ruixue.widget.BaseDialog;

import java.util.List;

public class NoticeView extends RXView {

    public final static String TAG = NoticeView.class.getName();
    private int limit = 0;
    private NoticeCallback noticeLinkCallback;
    private List<NoticeItemBean.DataDTO> data;
    private int code;
    private ScrollView typeText;
    private RecyclerView imageRecyclerView;
    private TextView content;

    public NoticeView(@NonNull Context context, int themeResId) {
        super(context, themeResId);
    }

    public NoticeView(@NonNull Context context, int limit, NoticeCallback noticeLinkCallback) {
        super(context);
        this.limit = limit;
        this.noticeLinkCallback = noticeLinkCallback;
        fetchData();
    }

    private void fetchData() {
        SharedPreferences announcementPreferences = RuiXueSdk.getContext()
                .getSharedPreferences("rx_announcement_list", MODE_PRIVATE);
        String announcementList = announcementPreferences
                .getString("announcement_list", "");
        if (!TextUtils.isEmpty(announcementList)) {
            NoticeItemBean noticeItemBean = new Gson().fromJson(announcementList, NoticeItemBean.class);
            data = noticeItemBean.getData();
            code = noticeItemBean.getCode();
        }
    }

    public NoticeView(@NonNull Context context, List<NoticeItemBean.DataDTO> data, NoticeCallback noticeLinkCallback) {
        super(context);
        this.limit = 1;
        this.noticeLinkCallback = noticeLinkCallback;
        this.data = data;
        this.code = 0;
    }

    public static NoticeView create(Context context, int limit, NoticeCallback linkCallback) {
        return new NoticeView(context, limit, linkCallback);
    }

    public static NoticeView maintainCreate(Context context, List<NoticeItemBean.DataDTO> data, NoticeCallback linkCallback) {
        return new NoticeView(context, data, linkCallback);
    }

    @Override
    protected int getResId() {
        return isLandscape() ? R.layout.layout_notice_landscape_view
                : R.layout.layout_notice_portrait_view;
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {

        RecyclerView recyclerView = view.findViewById(R.id.recycler_view);
        FrameLayout close = view.findViewById(R.id.close);
        TextView title = view.findViewById(R.id.title);
        content = view.findViewById(R.id.content);
        typeText = view.findViewById(R.id.type_text);
        imageRecyclerView = view.findViewById(R.id.type_img);

        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dismiss();
            }
        });

        recyclerView.setLayoutManager(new LinearLayoutManager(dialog.getContext()));
        if (code == 0 && data != null && !data.isEmpty()) {
            SharedPreferences readStatusPreferences = RuiXueSdk.getContext().
                    getSharedPreferences("rx_announcement_readstatus", MODE_PRIVATE);
            for (int i = 0; i < data.size(); i++) {
                NoticeItemBean.DataDTO dataDTO = data.get(i);
                dataDTO.setReaded(readStatusPreferences.getBoolean(dataDTO.getId() + "", false));
            }

            NoticeItemBean.DataDTO fistItemdataDTO = data.get(0);
            fistItemdataDTO.setReaded(true);
            readStatusPreferences.edit().putBoolean(data.get(0).getId() + "", true).apply();
            fistItemdataDTO.setSelected(true);
            title.setText(fistItemdataDTO.getTitle());

            setContent(fistItemdataDTO);
            if (limit == 1) {
                recyclerView.setVisibility(View.GONE);
                return;
            }

            if (limit < data.size()) {
                data = data.subList(0, limit);
            }

            NoticeViewAdapter adapter = new NoticeViewAdapter(data);
            recyclerView.setAdapter(adapter);

            adapter.setOnClick(new NoticeViewAdapter.NoticeClickCallback() {
                @Override
                public void onClick(int position) {
                    List<NoticeItemBean.DataDTO> currentData = adapter.getData();
                    readStatusPreferences.edit().putBoolean(currentData.get(position).getId() + "", true).apply();
                    currentData.get(position).setReaded(true);
                    title.setText(currentData.get(position).getTitle());
                    setContent(currentData.get(position));
                    for (int i = 0; i < currentData.size(); i++) {
                        currentData.get(i).setSelected(i == position);
                    }
                    adapter.notifyData();
                }
            });
        }
    }

    private void setContent(NoticeItemBean.DataDTO dataDTO) {
        if (dataDTO.getContentType() == 1) {
            typeText.setVisibility(View.VISIBLE);
            imageRecyclerView.setVisibility(View.GONE);
//            String testStr = "<html><head><style type=\"text/css\"></style><img src='https://t7.baidu.com/it/u=27018761,936335273&fm=193&f=GIF'/> </head><body><p>这里是邮箱的正文，这里支持富文本，可以<strong>加粗</strong>，<span style=\"color: red;\">描红</span>、<em>斜体</em>，感谢您在过去24小时内通过邮箱与我们联系，相关的邮件领取详情，如果是你本人或获得授权的其他人查看了你通过邮箱领取详情，则无需再进行其他操作。这里是邮箱的正文。</p><p><a href=\\\"https://www.baidu.com\\\">访问百度</a></p> </body></html>";
//            setRichText(content, testStr);
            if (TextUtils.isEmpty(dataDTO.getContent())) {
                setRichText(content, "");
            }else {
                setRichText(content, dataDTO.getContent());
            }
        }else {
            typeText.setVisibility(View.GONE);
            imageRecyclerView.setVisibility(View.VISIBLE);
            imageRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
            ImageListAdapter imageListAdapter = new ImageListAdapter(dataDTO.getImages());
            imageListAdapter.setOnClick(new NoticeViewAdapter.NoticeClickCallback() {
                @Override
                public void onClick(int imgPos) {
                    try {
                        String link = dataDTO.getImages().get(imgPos).getLinkUrl();
                        if (noticeLinkCallback != null) {
                            noticeLinkCallback.onLink(link);
                        }
                    }catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });
            imageRecyclerView.setAdapter(imageListAdapter);
        }
    }

    @Override
    public void show() {
        if (code != 0 || data == null || data.isEmpty()) {
            if (noticeLinkCallback != null) {
                noticeLinkCallback.hasAnnounceUI(false);
            }
            return;
        }
        if (noticeLinkCallback != null) {
            noticeLinkCallback.hasAnnounceUI(true);
        }

        super.show();
    }

    public void loginShow() {
        if (code != 0 || data == null || data.isEmpty()) {
            if (noticeLinkCallback != null) {
                noticeLinkCallback.hasAnnounceUI(false);
            }
            return;
        }
        if (data.get(0).getIsPopup() == 1 && limit == 1) {
            if (noticeLinkCallback != null) {
                noticeLinkCallback.hasAnnounceUI(true);
            }
            show();
        }
    }


    public void setRichText(TextView tv, String richStr) {
        try {
            float width;
            int height;

            if (isLandscape()) {
                if (limit == 1) {
                    width = getContext().getResources().getDimension(com.ruixue.base.R.dimen.dp_430);
                }else {
                    width = getContext().getResources().getDimension(com.ruixue.base.R.dimen.dp_320);
                }
            }else {
                if (limit == 1) {
                    width = getContext().getResources().getDimension(com.ruixue.base.R.dimen.dp_279);
                }else {
                    width = getContext().getResources().getDimension(com.ruixue.base.R.dimen.dp_172);
                }
            }
            RichTextUtils.setRichTextImageUrl(getContext(), tv, richStr, (int) width, new RichTextUtils.LinkCallback() {
                        @Override
                        public void onLick(String link) {
                            if (noticeLinkCallback != null) {
                                noticeLinkCallback.onLink(link);
                            }
                        }
                    });
        }catch (Exception e) {
            e.printStackTrace();
        }
    }

}
