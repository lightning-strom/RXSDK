package com.ruixue.utils;

import android.annotation.SuppressLint;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.CountDownTimer;
import android.text.SpannableString;
import android.view.View;
import android.widget.TextView;

import com.ruixue.logger.RXLogger;
import com.ruixue.ui.R;

/**
 * 验证码倒计时 重新验证
 */
public class CountDownTimerTextView extends CountDownTimer {
    private final TextView mTextView;
    private int visibilityFlag = View.VISIBLE;
    private String text = "";
    private OnFinishListener finishListener;

    public static CountDownTimerTextView create(TextView textView, long millisInFuture, long countDownInterval) {
        return new CountDownTimerTextView(textView, millisInFuture - 1000L, countDownInterval);
    }

    /**
     * @param textView          The TextView
     * @param millisInFuture    The number of millis in the future from the call
     *                          to {@link #start()} until the countdown is done and {@link #onFinish()}
     *                          is called.
     * @param countDownInterval The interval along the way to receiver
     *                          {@link #onTick(long)} callbacks.
     */
    public CountDownTimerTextView(TextView textView, long millisInFuture, long countDownInterval) {
        super(millisInFuture, countDownInterval);
        this.mTextView = textView;
    }

    //倒计时后缀文字
    public CountDownTimerTextView setTextSuffix(String text) {
        this.text = text;
        return this;
    }

    public CountDownTimerTextView setFinishVisible(int visibilityFlag) {
        this.visibilityFlag = visibilityFlag;
        return this;
    }

    public CountDownTimerTextView setFinishListener(OnFinishListener finishListener) {
        this.finishListener = finishListener;
        return this;
    }

    public interface OnFinishListener {
        void onFinish();
    }

    public void stop() {
        this.cancel();
        onFinish();
    }

    @Override
    public void onTick(long millisUntilFinished) {
        mTextView.setClickable(false); //设置不可点击
        mTextView.setBackgroundResource(R.color.transparent);
        String countdown = mTextView.getContext().getString(R.string.rx_tips_regain) + "(" + (millisUntilFinished + 1000) / 1000L + ")" + text;
        mTextView.setText(countdown);  //设置倒计时时间
        mTextView.setTextColor(Color.parseColor("#a3a3a3"));
        /**
         * 超链接 URLSpan
         * 文字背景颜色 BackgroundColorSpan
         * 文字颜色 ForegroundColorSpan
         * 字体大小 AbsoluteSizeSpan
         * 粗体、斜体 StyleSpan
         * 删除线 StrikethroughSpan
         * 下划线 UnderlineSpan
         * 图片 ImageSpan
         * http://blog.csdn.net/ah200614435/article/details/7914459
         */
        SpannableString spannableString = new SpannableString(mTextView.getText().toString());  //获取按钮上的文字
//        ForegroundColorSpan span = new ForegroundColorSpan(Color.RED);
        /**
         * public void setSpan(Object what, int start, int end, int flags) {
         * 主要是start跟end，start是起始位置,无论中英文，都算一个。
         * 从0开始计算起。end是结束位置，所以处理的文字，包含开始位置，但不包含结束位置。
         */
//        UnderlineSpan span = new UnderlineSpan();
//        spannableString.setSpan(span, 0, mTextView.getText().toString().length(), Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);//将倒计时的时间设置为红色
        mTextView.setText(spannableString);
    }

    @Override
    public void onFinish() {
        mTextView.setText(R.string.rx_txt_get_captcha);
        mTextView.setClickable(true);//重新获得点击
        mTextView.setTextColor(Color.parseColor("#25b2a6"));
//        mTextView.setBackgroundResource(R.drawable.register_text_underline);
        mTextView.setVisibility(visibilityFlag);
        if (finishListener != null) {
            finishListener.onFinish();
        }
    }
}
