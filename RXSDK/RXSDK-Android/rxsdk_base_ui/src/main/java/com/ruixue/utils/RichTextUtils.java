package com.ruixue.utils;

import android.content.Context;
import android.graphics.Color;
import android.net.Uri;
import android.text.Html;
import android.text.Spannable;
import android.text.SpannableStringBuilder;
import android.text.TextPaint;
import android.text.method.LinkMovementMethod;
import android.text.style.ClickableSpan;
import android.text.style.URLSpan;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.RXDataCache;
import com.ruixue.error.RXException;
import com.ruixue.legal.LegalData;
import com.ruixue.logger.RXLogger;
import com.ruixue.net.ToastUtils;
import com.ruixue.openapi.RXSdkApi;
import com.ruixue.ui.R;
import com.ruixue.view.AppPrivacyView;
import com.ruixue.view.LoginPrivacyTextView;
import com.ruixue.view.RXWebView;
import com.zzhoujay.richtext.ImageHolder;
import com.zzhoujay.richtext.RichText;
import com.zzhoujay.richtext.RichType;
import com.zzhoujay.richtext.callback.ImageFixCallback;
import com.zzhoujay.richtext.callback.OnImageClickListener;
import com.zzhoujay.richtext.callback.OnUrlClickListener;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/6/27
 */
public class RichTextUtils {

    public static void setRichTextImage(Context context, TextView tv, String richStr, int width, int height, OnImageClickListener onImageClickListener) {
        try {
            Pattern pattern = Pattern.compile("text-indent\\s*:\\s*(\\d*)em\\b");
            Matcher matcher = pattern.matcher(richStr);

            if (matcher.find() && matcher.group(1) != null && !("").equals(matcher.group(1))) {
                richStr = matcher.replaceAll("text-indent: " + Integer.parseInt(matcher.group(1)) * 16 + "px");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        RichText.initCacheDir(context);
        RichText.fromHtml(StringUtils.unicodeToString(richStr)).fix(new ImageFixCallback() {
            @Override
            public void onInit(ImageHolder imageHolder) {
                imageHolder.setWidth(width);
                imageHolder.setHeight(height);
            }

            @Override
            public void onLoading(ImageHolder imageHolder) {
            }

            @Override
            public void onSizeReady(ImageHolder imageHolder, int i, int i1, ImageHolder.SizeHolder sizeHolder) {
            }

            @Override
            public void onImageReady(ImageHolder imageHolder, int i, int i1) {
            }

            @Override
            public void onFailure(ImageHolder imageHolder, Exception e) {
            }
        }).type(RichType.html).borderColor(Color.parseColor("#20C0B3")).scaleType(ImageHolder.ScaleType.center).clickable(true).urlClick(new OnUrlClickListener() {
            @Override
            public boolean urlClicked(String url) {
                RXWebView.create(context, url).show();
                return true;
            }
        }).imageClick(onImageClickListener).into(tv);
    }


    public interface LinkCallback {
        void onLick(String link);
    }

    public static void setRichTextImageUrl(Context context, TextView tv, String richStr, int width, LinkCallback linkCallback) {
        try {
            Pattern pattern = Pattern.compile("text-indent\\s*:\\s*(\\d*)em\\b");
            Matcher matcher = pattern.matcher(richStr);

            if (matcher.find() && matcher.group(1) != null && !("").equals(matcher.group(1))) {
                richStr = matcher.replaceAll("text-indent: " + Integer.parseInt(matcher.group(1)) * 16 + "px");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        RichText.initCacheDir(context);
        RichText.fromHtml(StringUtils.unicodeToString(richStr)).fix(new ImageFixCallback() {
            @Override
            public void onInit(ImageHolder imageHolder) {
//                        imageHolder.setWidth(width);
//                        imageHolder.setHeight(height);
            }

            @Override
            public void onLoading(ImageHolder imageHolder) {
            }

            @Override
            public void onSizeReady(ImageHolder imageHolder, int i, int i1, ImageHolder.SizeHolder sizeHolder) {
            }

            @Override
            public void onImageReady(ImageHolder imageHolder, int i, int i1) {
            }

            @Override
            public void onFailure(ImageHolder imageHolder, Exception e) {
            }
        }).type(RichType.html).borderColor(Color.parseColor("#20C0B3")).scaleType(ImageHolder.ScaleType.fit_xy).clickable(true).urlClick(new OnUrlClickListener() {
            @Override
            public boolean urlClicked(String url) {
                if (linkCallback != null) {
                    linkCallback.onLick(url);
                }
                return true;
            }
        }).imageClick(new OnImageClickListener() {
            @Override
            public void imageClicked(List<String> list, int i) {
//                        if (linkCallback != null) {
//                            linkCallback.onLick(list.get(i));
//                        }
            }
        }).into(tv);
    }

    /**
     * 在 webview 内打开 richText 链接
     * @param context
     * @param tv
     * @param richStr
     */
    public static void setRichText(Context context, TextView tv, String richStr) {
        RichText.fromHtml(StringUtils.unicodeToString(richStr)).borderColor(Color.parseColor("#20C0B3")).type(RichType.html).clickable(true).urlClick(new OnUrlClickListener() {
            @Override
            public boolean urlClicked(String url) {
                RXWebView.create(context, url).show();
                return true;
            }
        }).into(tv);
    }

    public static void setRichText(Context context, TextView tv, String richStr, OnClickLinkListener linkListener) {
        RichText.fromHtml(StringUtils.unicodeToString(richStr)).borderColor(Color.parseColor("#20C0B3")).type(RichType.html).clickable(true).urlClick(new OnUrlClickListener() {
            @Override
            public boolean urlClicked(String url) {
                if (linkListener == null || !linkListener.onClick(Uri.parse(url))) {
                    RXWebView.create(context, url).show();
                }
                return true;
            }
        }).into(tv);
    }

    public static void updateTextViewClickable(Context context, TextView textView, String textStr, OnClickLinkListener linkListener, OnClickedLinkCallback onClickedLinkCallback) {
        updateTextViewClickable(context, textView, textStr, false, linkListener, onClickedLinkCallback);
    }

    public static void updateTextViewClickable(Context context, TextView textView, String textStr, OnClickLinkListener linkListener) {
        updateTextViewClickable(context, textView, textStr, false, linkListener, null);
    }

    public static void updateTextViewClickable(Context context, TextView textView, String textStr, OnClickedLinkCallback callback) {
        updateTextViewClickable(context, textView, textStr, false, null, callback);
    }

    public static void updateTextViewClickable(Context context, TextView textView, String textStr) {
        updateTextViewClickable(context, textView, textStr, false, null, null);
    }

    public static void updateTextViewClickable(Context context, TextView textView, String textStr, boolean underlineText) {
        updateTextViewClickable(context, textView, textStr, underlineText, null, null);
    }

    public static void updateTextViewClickable(Context context, TextView textView, String textStr, boolean underlineText, OnClickLinkListener linkListener, OnClickedLinkCallback clickedLinkCallback) {
        textView.setHighlightColor(Color.TRANSPARENT);
        textView.setText(Html.fromHtml(textStr));
        textView.setMovementMethod(LinkMovementMethod.getInstance());
        CharSequence text = textView.getText();
        /*
         * 以下是textview的内容(这里给了3个示例链接和一个普通字符串)
         */
        if (text instanceof Spannable) {
            int end = text.length();
            Spannable sp = (Spannable) textView.getText();
            URLSpan[] spans = sp.getSpans(0, end, URLSpan.class);
            SpannableStringBuilder style = new SpannableStringBuilder(text);
            style.clearSpans();    // should clear old spans
            for (URLSpan span : spans) {
                int startSpan = sp.getSpanStart(span);
                int endSpan = sp.getSpanEnd(span);
                String name = text.toString().substring(startSpan, endSpan);
                ClickableSpan mySpan = RichTextUtils.createClickableSpan(context, name, span.getURL(), underlineText, linkListener, clickedLinkCallback);
                style.setSpan(mySpan, startSpan, endSpan, Spannable.SPAN_EXCLUSIVE_INCLUSIVE);

                try {
                    if (textView instanceof LoginPrivacyTextView) {
                        LoginPrivacyTextView loginPrivacyTextView = (LoginPrivacyTextView) textView;
                        loginPrivacyTextView.setName(name);
                    }
                } catch (Exception e) {
                    RXLogger.e(e.getMessage());
                    e.printStackTrace();
                }

            }
            textView.setText(style);
        }
    }

    public static ClickableSpan createClickableSpan(Context context, String richStr) {
        return new RXClickableSpan(context, richStr);
    }

    public static ClickableSpan createClickableSpan(Context context, String name, String richStr) {
        return new RXClickableSpan(context, name, richStr);
    }

    public static ClickableSpan createClickableSpan(Context context, String name, String richStr, boolean underlineText, OnClickLinkListener linkListener, OnClickedLinkCallback onClickedLinkCallback) {
        return new RXClickableSpan(context, name, richStr, underlineText).setOnClickLinkListener(linkListener).setOnClickedLinkCallback(onClickedLinkCallback);
    }

    // 点击链接后的回调，只用来处理埋点业务，不涉及到点击逻辑, 区别与 OnClickLinkListener
    public interface OnClickedLinkCallback {
        void onClicked(String url);
    }

    public interface OnClickLinkListener {
        boolean onClick(Uri uri);
    }

    protected static class RXClickableSpan extends ClickableSpan {


        OnClickLinkListener onClickLinkListener;
        OnClickedLinkCallback onClickedLinkCallback;
        private boolean underlineText = false;
        private final String mSpan;
        private String mName = null;
        private final Context context;

        public RXClickableSpan setOnClickLinkListener(OnClickLinkListener onClickLinkListener) {
            this.onClickLinkListener = onClickLinkListener;
            return this;
        }

        public RXClickableSpan setOnClickedLinkCallback(OnClickedLinkCallback onClickedLinkCallback) {
            this.onClickedLinkCallback = onClickedLinkCallback;
            return this;
        }

        RXClickableSpan(Context context, String name, String span, boolean underlineText) {
            this.mName = name;
            this.mSpan = span;
            this.context = context;
            this.underlineText = underlineText;
        }

        RXClickableSpan(Context context, String name, String span) {
            this.mName = name;
            this.mSpan = span;
            this.context = context;
        }

        RXClickableSpan(Context context, String span) {
            mSpan = span;
            this.context = context;
        }

        @Override
        public void onClick(View widget) {
            Log.e(RuiXueSdk.TAG, "span:" + mSpan);
            if (widget instanceof TextView) {
                ((TextView) widget).setHighlightColor(Color.TRANSPARENT);
            }
            Uri uri = Uri.parse(mSpan);
            if (onClickLinkListener == null || !onClickLinkListener.onClick(uri)) {
                parseScheme(uri);
            }

            if (onClickedLinkCallback != null) {
                onClickedLinkCallback.onClicked(mSpan);
            }
        }

        private void parseScheme(Uri uri) {
            if (uri.getScheme().equals(RuiXueSdk.SCHEME)) {
                final JSONObject[] mTermsDataCache = {RXDataCache.getTermsDataCache()};
                if (mTermsDataCache[0] != null && mTermsDataCache[0].has(uri.getAuthority())) {
                    JSONObject tdata = mTermsDataCache[0].optJSONObject(uri.getAuthority());
                    showAppPrivacyView(tdata);
                } else {
                    Map<String, Object> map = new HashMap<>();
                    String keys = LegalData.KEY_SERVICE_AGREEMENT + "," + LegalData.KEY_PRIVACY_POLICY;
                    if (!LegalData.KEY_SERVICE_AGREEMENT.equals(uri.getAuthority()) && !LegalData.KEY_PRIVACY_POLICY.equals(uri.getAuthority())) {
                        keys += "," + uri.getAuthority();
                    }
                    map.put("keys", keys);

                    LoadingDialog loadingDialog = LoadingDialog.create(context);
                    loadingDialog.showDelay(100);
                    loadingDialog.closeDelay(15000);
                    loadingDialog.setCancelable(true);
                    RXSdkApi.getInstance().legalTerms(map, new RXJSONCallback() {
                        @Override
                        public void onError(RXException e) {
                            loadingDialog.dismiss();
                            UIToast.showNetErrorToast(context, e.getCode());
                        }

                        @Override
                        public void onSuccess(@Nullable JSONObject data) {
                            mTermsDataCache[0] = data;
                            RXDataCache.setTermsDataCache(data);
                            if (mTermsDataCache[0] != null) {
                                JSONObject tdata = mTermsDataCache[0].optJSONObject(uri.getAuthority());
                                showAppPrivacyView(tdata);
                            } else {
                                ToastUtils.showToast(context, R.string.rx_txt_legal_no_configurde);
                            }
                            loadingDialog.dismiss();
                        }

                        @Override
                        public void onFailed(@NonNull JSONObject cause) {
                            loadingDialog.dismiss();
                            ToastUtils.showToast(context, cause.optString("msg", context.getString(R.string.rx_txt_legal_no_configurde)));
                        }
                    });
                }
            } else {
//                Intent intent = new Intent(Intent.ACTION_VIEW);
//                intent.setData(Uri.parse(mSpan));
//                context.startActivity(intent);
                RXWebView.create(context, mSpan).setTitle(mName).show();
            }
        }

        private void showAppPrivacyView(JSONObject tdata) {

            if (tdata != null) {
                AppPrivacyView.create(context, tdata.optString("content"), null).setTitle(tdata.optString("title", mName)).setFullScreen().setShowButtons(false).show();
            } else {
                UIToast.showToast(context, R.string.rx_txt_legal_no_configurde);
            }
        }

        @Override
        public void updateDrawState(@NonNull TextPaint ds) {
            super.updateDrawState(ds);
            ds.setColor(Color.parseColor("#20C0B3"));
            //            ds.clearShadowLayer();
            ds.setUnderlineText(underlineText);
        }
    }

}
