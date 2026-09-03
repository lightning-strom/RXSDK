package com.ruixue.view;

import android.app.Activity;
import android.content.Context;
import android.widget.ImageView;

import com.ruixue.ui.R;
import com.ruixue.widget.FloatIconView;

/**
 * @ProjectName: ruixue-sdk-android
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2023/6/26
 */
public class RXServicesFloatView extends FloatIconView {

    ImageView imageView;

    public static RXServicesFloatView create(Context activity) {
        return new RXServicesFloatView(activity);
    }

    public RXServicesFloatView(Context activity) {
        super(activity, R.layout.rx_services_float_btn);
        imageView = view.findViewById(R.id.iv_msg_flag);
        imageView.setVisibility(GONE);
    }

    public void setImageViewVisible(int viewVisible) {
        imageView.setVisibility(viewVisible);
    }
}
