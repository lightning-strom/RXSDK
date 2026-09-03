package com.ruixue.view;

import android.content.Context;
import android.content.res.Configuration;
import android.graphics.Color;
import android.text.TextUtils;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.annotation.DrawableRes;
import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.error.RXErrorCode;
import com.ruixue.legal.LegalData;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.openapi.RXView;
import com.ruixue.ui.R;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.RichTextUtils;
import com.ruixue.widget.BaseDialog;

import java.util.Collection;

/**
 * 用户协议 隐私保护界面
 */
public class AppPrivacyView extends RXView {

    public AppPrivacyView(Context context) {
        super(context);
        setCancelable(false);
    }

    private String mTitleStr = "";
    private String mProtocolStr = "协议加载失败，请检查配置,或重新打开。";
    private int height = 0;
    private int width = 0;
    private int agreeButtonBgResId = 0;
    private int disagreeButtonBgResId = 0;
    private int agreeButtonTextColor = 0;
    private int disagreeButtonTextColor = 0;
    private RXJSONCallback callback;
    boolean isShowButtons = true;
    boolean isRichStyle = false;
    Collection<String> keyList;

    /**
     * 用户协议
     * @param context  activity
     * @param callback callback
     */
    @Deprecated
    public static AppPrivacyView create(@NonNull Context context, LegalData.TermsBean termsBean, RXJSONCallback callback) {

        return new AppPrivacyView(context).setData(termsBean).setCallback(callback);
    }

    /**
     * 用户协议·
     * @param context  activity
     * @param callback callback
     */
    public static AppPrivacyView create(@NonNull Context context, String content, RXJSONCallback callback) {
        return new AppPrivacyView(context).setTitle("用户协议和隐私政策").setContent(content).setRichStyle(false).setCallback(callback);
    }

    @Deprecated
    public AppPrivacyView setKeyList(Collection<String> keyList) {
        this.keyList = keyList;
        return this;
    }

    @Deprecated
    public AppPrivacyView setData(LegalData.TermsBean termsBean) {
        if (termsBean != null) {
            setTitle(termsBean.getTitle());
            setContent(termsBean.getContent());
        }
        return this;
    }

    /**
     * @param title 设置标题
     */
    public AppPrivacyView setTitle(String title) {
        this.mTitleStr = title;
        return this;
    }

    /**
     * @param protocol 设置协议内容
     */
    public AppPrivacyView setContent(String protocol) {
        this.mProtocolStr = protocol;
        isRichStyle = mProtocolStr.length() > 250;
        return this;
    }

    /**
     * @param height 高度单位 dp
     */
    public AppPrivacyView setHeight(int height) {
        this.height = height;
        return this;
    }

    public boolean isRichStyle() {
        return isRichStyle;
    }

    public AppPrivacyView setRichStyle(boolean richStyle) {
        isRichStyle = richStyle;
        return this;
    }

    /**
     * @param width 宽度单位 dp
     */
    public AppPrivacyView setWidth(int width) {
        this.width = width;
        return this;
    }

    public AppPrivacyView setBigSize() {
        setHeight(getContext().getResources().getDimensionPixelSize(com.ruixue.base.R.dimen.dp_370));
        setWidth(getContext().getResources().getDimensionPixelSize(com.ruixue.base.R.dimen.dp_478));
        return this;
    }

    public AppPrivacyView setFullScreen() {
        setWidth(ViewGroup.LayoutParams.MATCH_PARENT);
        setHeight(ViewGroup.LayoutParams.MATCH_PARENT);
        return this;
    }

    public AppPrivacyView setCallback(RXJSONCallback callback) {
        this.callback = callback;
        return this;
    }

    /**
     * 是否 显示同意 不同意 按钮
     * @param visible 是否显示
     */
    public AppPrivacyView setShowButtons(boolean visible) {
        this.isShowButtons = visible;
        if (!visible)
            setCancelable(true);
        return this;
    }

    public AppPrivacyView setAgreeButtonTextColor(int agreeButtonTextColor) {
        this.agreeButtonTextColor = agreeButtonTextColor;
        return this;
    }

    public AppPrivacyView setDisagreeButtonTextColor(int disagreeButtonTextColor) {
        this.disagreeButtonTextColor = disagreeButtonTextColor;
        return this;
    }

    /**
     * @param resId 同意按钮样式
     */
    public AppPrivacyView setAgreeButtonResId(@DrawableRes int resId) {
        agreeButtonBgResId = resId;
        return this;
    }


    /**
     * @param resId 不同意按钮样式
     */
    public AppPrivacyView setDisagreeButtonBg(@DrawableRes int resId) {
        disagreeButtonBgResId = resId;
        return this;
    }

    @Override
    public int getResId() {
        return R.layout.rx_privacy;
    }

    public AppPrivacyView setContentTextSize(int contentTextSize) {
        this.contentTextSize = contentTextSize;
        return this;
    }

    int contentTextSize = 0;


    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        ImageView close = view.findViewById(R.id.close);
        close.setVisibility((!isShowButtons || isCancelable()) ? View.VISIBLE : View.GONE);
        close.setEnabled(!isShowButtons || isCancelable());
        close.setOnClickListener(v -> {
            dialog.cancel();
        });
        dialog.setOnCancelListener(dialog1 -> {
            if (callback != null) {
                callback.onFailed(RXErrorCode.UI_CLOSE.toJSONObject());
            }
        });
        TextView title = view.findViewById(R.id.title);
        TextView content = view.findViewById(R.id.content);
        LinearLayout btn_ll_layout = view.findViewById(R.id.btn_ll_layout);
        btn_ll_layout.setVisibility(isShowButtons ? View.VISIBLE : View.GONE);

        CardView cardView = view.findViewById(R.id.layout);
        RelativeLayout.LayoutParams layoutParams = (RelativeLayout.LayoutParams) cardView.getLayoutParams();
        if (height != 0) {
            layoutParams.height = height;
            if (height == ViewGroup.LayoutParams.MATCH_PARENT) {
                layoutParams.topMargin = 0;
                layoutParams.bottomMargin = 0;
            }
        }
        if (width != 0) {
            layoutParams.width = width;
            if (width == ViewGroup.LayoutParams.MATCH_PARENT) {
                layoutParams.setMarginStart(0);
                layoutParams.setMarginEnd(0);
                layoutParams.leftMargin = 0;
                layoutParams.rightMargin = 0;
                Configuration configuration = getContext().getResources().getConfiguration();
                boolean isLandscape = configuration.orientation == Configuration.ORIENTATION_LANDSCAPE;
                if (isLandscape) {
                    int horPx = getContext().getResources().getDimensionPixelSize(com.ruixue.base.R.dimen.dp_20);
                    RelativeLayout.LayoutParams closeLayoutParams = (RelativeLayout.LayoutParams) close.getLayoutParams();
                    closeLayoutParams.setMarginEnd(horPx);
                    layoutParams.rightMargin = horPx;
                    int txhorPx = getContext().getResources().getDimensionPixelSize(com.ruixue.base.R.dimen.dp_15);
                    content.setPadding(txhorPx, 0, txhorPx, 0);
                }
            }
        }
        cardView.setLayoutParams(layoutParams);
        cardView.setCardBackgroundColor(isShowButtons ? Color.parseColor("#ffffff") : Color.parseColor("#F4FCFB"));
        if (contentTextSize > 0) {
            content.setTextSize(contentTextSize);
        }
        if (!TextUtils.isEmpty(mTitleStr)) {
            title.setText(mTitleStr);
        }
        RichTextUtils.OnClickLinkListener linkListener = uri -> {
            if (uri.getScheme().equals(RuiXueSdk.SCHEME)) {
                if (keyList != null) {
                    AppPrivacyH5View.create(getContext(), uri.getAuthority(), keyList).setTitle(mTitleStr).show();
                } else {
                    return false;
                }
            } else {
                RXWebView.create(getContext(), uri.toString()).setTitle(mTitleStr).show();
            }
            return true;
        };
        if (isRichStyle) {
            RichTextUtils.setRichText(getContext(), content, mProtocolStr, linkListener);
        } else {
            RichTextUtils.updateTextViewClickable(getContext(), content, mProtocolStr, linkListener);
        }
        Button sure_btn = view.findViewById(R.id.sure_btn);
        ViewGroup.LayoutParams lp1 = sure_btn.getLayoutParams();
//        lp1.width = isLandscape() ? AppUtils.dp2px(getContext(), 140) : AppUtils.dp2px(getContext(), 120);
        sure_btn.setLayoutParams(lp1);
        if (agreeButtonBgResId != 0) {
            sure_btn.setBackgroundResource(agreeButtonBgResId);
        }
        if (agreeButtonTextColor != 0) {
            sure_btn.setTextColor(agreeButtonTextColor);
        }
        sure_btn.setOnClickListener(v -> {
            dialog.dismiss();
            RXSdkApi.getInstance().setPrivacyAgree(getContext(), null);
            if (callback != null) {
                callback.onSuccess(null);
            }
        });
        Button close_btn = view.findViewById(R.id.cancel_btn);
        if (disagreeButtonBgResId != 0) {
            close_btn.setBackgroundResource(disagreeButtonBgResId);
        }
        if (disagreeButtonTextColor != 0) {
            close_btn.setTextColor(disagreeButtonTextColor);
        }
        ViewGroup.LayoutParams lp2 = close_btn.getLayoutParams();
//        lp2.width = isLandscape() ? AppUtils.dp2px(getContext(), 140) : AppUtils.dp2px(getContext(), 120);
        close_btn.setLayoutParams(lp2);
        close_btn.setOnClickListener(v -> {
            dialog.dismiss();
//            RXSdkApi.getInstance().setPrivacyAgree(getContext(), false, null);
            if (callback != null) {
                callback.onFailed(JSONUtil.toJSONObject(RXErrorCode.DISAGREE_PRIVACY));
            }
        });
    }
}
