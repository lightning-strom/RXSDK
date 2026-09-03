package com.ruixue.openapi;

import android.app.Activity;
import android.content.Context;
import android.content.res.AssetManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.Build;
import android.os.LocaleList;
import android.view.ContextThemeWrapper;
import android.view.Window;

import androidx.annotation.NonNull;
import androidx.annotation.StyleRes;

import com.ruixue.RuiXueSdk;
import com.ruixue.base.LocaleContextWrapper;
import com.ruixue.base.R;
import com.ruixue.logger.RXLogger;
import com.ruixue.unity.UnityUICommonFun;
import com.ruixue.widget.BaseDialog;
import com.ruixue.widget.CommonDialog;

import java.util.Locale;
import java.util.Objects;

public abstract class RXView implements BaseDialog.ViewCreateListener, IRXView {

    private CommonDialog mDialog;
    private Context context;
    private boolean isLandscape;
    private boolean cancelable = true;


    public CommonDialog getDialog() {
        return mDialog;
    }

    public RXView(@NonNull Context context, int themeResId) {
        init(context, themeResId);
    }

    public RXView(@NonNull Context context) {
        init(context, getStyleId());
    }


    public static Context createLocalizedThemedContext(Context context, @StyleRes int themeResId) {
        Configuration config = context.getResources().getConfiguration();
        Locale locale = RXGlobalData.getLocale();
        config.setLocale(locale);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            config.setLocales(new LocaleList(locale));
        }
        Context localizedContext = context.createConfigurationContext(config);
        return new ContextThemeWrapper(context, themeResId) {
            @Override
            public Resources getResources() {
                return localizedContext.getResources();
            }

            @Override
            public AssetManager getAssets() {
                return localizedContext.getAssets();
            }
        };
    }

    private void init(@NonNull Context context, int themeResId) {
        this.context = context;
        Context baseContext = context;
        if (RuiXueSdk.isOasVersion()) {
            if (context instanceof ContextThemeWrapper) {
                RXGlobalData.updateLanguage(context);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {

                    RXLogger.i("language " + context.getResources().getConfiguration().getLocales().toLanguageTags());
                }
            } else if (themeResId != 0) {
                baseContext = RuiXueSdk.getCurrentActivity();
                if (baseContext == null) {
                    baseContext = context;
                }
                this.context = baseContext;
                baseContext = Objects.requireNonNull((createLocalizedThemedContext(context, themeResId)));
            }
        }
        isLandscape = context.getResources().getConfiguration().orientation == Configuration.ORIENTATION_LANDSCAPE;
        int resId = getResId();
        this.mDialog = new CommonDialog.Builder(baseContext, resId).setThemeResId(themeResId).viewCreateListener(this).build();
    }

    public Context getContext() {
        return context;
    }

    public boolean isLandscape() {
        return isLandscape;
    }

    protected abstract int getResId();

    protected int getStyleId() {
        return R.style.ScaleFade;
    }

    @Override
    public RXView setCancelable(boolean flag) {
        this.cancelable = flag;

        if (this.mDialog != null)
            try {
                this.mDialog.setCancelable(flag);
            } catch (Exception e) {
                e.printStackTrace();
            }
        return this;
    }

    @Override
    public RXView setCanceledOnTouchOutside(boolean cancel) {
        this.mDialog.setCanceledOnTouchOutside(cancel);
        return this;
    }

    @Override
    public boolean isCancelable() {
        return cancelable;
    }

    public Window getWindow() {
        if (this.mDialog != null) {
            return this.mDialog.getWindow();
        } else {
            return null;
        }
    }

    @Override
    public boolean isShowing() {
        return this.mDialog != null && this.mDialog.isShowing();
    }

    public void hide() {
        if (isShowing()) {
            this.mDialog.hide();
        }
    }

    @Override
    public void show() {
        try {
            if (this.mDialog != null && !this.isShowing()) {
                this.mDialog.show();
            }
        } catch (Exception e) {
            e.printStackTrace();
            close();
        }
    }

    public void unityShow(Activity activity) {
        UnityUICommonFun.runOnUINoTurn(activity, this::show);
    }

    public void close() {
        try {
            if (this.mDialog != null) {
                this.mDialog.dismiss();
                this.mDialog = null;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void cancel() {
        if (this.mDialog != null) {
            this.mDialog.cancel();
        }
    }

    @Override
    public void dismiss() {
        close();
    }

    public void unityDismiss(Activity activity) {
        UnityUICommonFun.runOnUINoTurn(activity, this::dismiss);
    }
}