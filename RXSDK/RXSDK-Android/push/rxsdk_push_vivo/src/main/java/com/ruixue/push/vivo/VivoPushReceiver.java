package com.ruixue.push.vivo;

import android.content.Context;
import android.text.TextUtils;

import com.ruixue.push.log.PushLog;
import com.vivo.push.model.UPSNotificationMessage;
import com.vivo.push.model.UnvarnishedMessage;
import com.vivo.push.sdk.OpenClientPushMessageReceiver;

public class VivoPushReceiver extends OpenClientPushMessageReceiver {
    private static final String TAG = "RXPushVivo";
    private static final String PUSH_VIVO = "vivopush";

    @Override
    public void onReceiveRegId(Context context, String regId) {
        PushLog.d(" onReceiveRegId= " + regId);
        if (!TextUtils.isEmpty(regId)) {
//            PushMsgRepeter.callRegisterSucceed(regId, PUSH_VIVO);
        }
    }

    @Override
    public void onTransmissionMessage(Context context, UnvarnishedMessage unvarnishedMessage) {
        super.onTransmissionMessage(context, unvarnishedMessage);
//        Toast.makeText(context, " 收到透传通知： " + unvarnishedMessage.getMessage(), Toast.LENGTH_LONG).show();
        PushLog.d(" onTransmissionMessage= " + unvarnishedMessage.getMessage());
    }

    /**
     * 注意:该接口仅用于解决v3.0.0. 0_480之前的版本升级PushSDK过程中发送的老版本打开自定义通知（skiptype=3）需要依赖点击回调完成跳转时使用，
     * 新版本通知点击该点击回调是不可用
     *
     * @param context
     * @param msg
     */
    @Override
    public void onNotificationMessageClicked(Context context, UPSNotificationMessage msg) {
        super.onNotificationMessageClicked(context, msg);
        PushLog.d(" onTransmissionMessage= " + msg.toString());
    }
}
