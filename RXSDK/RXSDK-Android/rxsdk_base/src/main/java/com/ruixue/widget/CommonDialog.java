package com.ruixue.widget;

import android.content.Context;

import androidx.annotation.LayoutRes;
import androidx.annotation.NonNull;



public class CommonDialog extends BaseDialog {
    public CommonDialog(@NonNull Context context, int resource, int themeResId) {
        super(context, resource, themeResId);
    }

    CommonDialog(Builder builder) {
        super(builder.context, builder.resource, builder.themeResId, builder.viewCreateListener);
    }

    public static class Builder {
        private final Context context;
        private final int resource;
        private int themeResId = AniStyle.ScaleFade;
        private ViewCreateListener viewCreateListener;

        public Builder(Context context, @LayoutRes int resource) {
            this.context = context;
            this.resource = resource;
        }

        public Builder setThemeResId(int themeResId) {
            if (themeResId != 0) {
                this.themeResId = themeResId;
            }
            return this;
        }


        public Builder viewCreateListener(ViewCreateListener listener) {
            this.viewCreateListener = listener;
            return this;
        }

        public CommonDialog build() {
            return new CommonDialog(this);
        }
    }
}
