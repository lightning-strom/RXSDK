package com.ruixue.view;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Handler;
import android.text.TextUtils;
import android.view.View;

import com.ruixue.RuiXueSdk;
import com.ruixue.openapi.RXUserCenterConfig;
import com.ruixue.utils.ThreadUtils;
import com.ruixue.widget.BaseDialog;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/7/3
 */
public class RXHelperCenter extends RXServiceWeb {

    Handler handler = ThreadUtils.getMainLooperHandler();

    private Runnable delayedRunnable;

    public static RXHelperCenter create(Context activity) {
        String url = RuiXueSdk.getFirstBaseUrl() + "static/passport/#/helpcenter/questioncatalogue-new";
        return create(activity, url);
    }

    public static RXHelperCenter create(Context activity, String url) {
        RXHelperCenter rxServiceView = getInstance(activity);
        if (TextUtils.isEmpty(rxServiceView.getUrl()) || !rxServiceView.getUrl().equals(url))
            rxServiceView.loadUrl(url);
        return rxServiceView;
    }

    public void cancelSetCloseEnable() {
        if (delayedRunnable != null) {
            handler.removeCallbacks(delayedRunnable);
            delayedRunnable = null;
        }
    }

    @Override
    public void setCloseEnable(boolean visible) {
        if (!visible) {
            cancelSetCloseEnable();
        }
        super.setCloseEnable(visible);
    }

    @Override
    public void onCreateView(BaseDialog dialog, View view) {
        super.onCreateView(dialog, view);
        setCloseEnable(false);
        delayedRunnable = () -> setCloseEnable(true);
        handler.postDelayed(delayedRunnable, 5000);
    }

    @SuppressLint("StaticFieldLeak")
    public static RXHelperCenter instance;

    public static RXHelperCenter getInstance(Context activity) {
        if (instance == null) {
            instance = new RXHelperCenter(activity);
        }
        return instance;
    }

    @Override
    public void onClose() {
        super.onClose();
        cancelSetCloseEnable();
        instance = null;
    }

    public RXHelperCenter(Context context) {
        super(context);
    }

    public RXHelperCenter setUserCenterConfig(RXUserCenterConfig rxUserCenterConfig) {
        if (rxUserCenterConfig != null) {
            setSyncInfoEnable(rxUserCenterConfig.isSyncInfoEnable());
            setCustomParams(rxUserCenterConfig.getCustomParams());
            if (rxUserCenterConfig.getOnViewCloseListener() != null)
                setOnCloseListener(rxUserCenterConfig.getOnViewCloseListener());
        }
        return this;
    }

}
