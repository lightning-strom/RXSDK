package com.ruixue.openapi;

import android.app.Activity;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.error.RXException;
import com.ruixue.legal.AntiAddictDelegate;
import com.ruixue.logger.RXLogger;
import com.ruixue.openapi.RXSdkApi;

import java.util.Map;

/**
 * @Desc: ruixue
 * @Author: ROC LEE
 * @Date: 2022/4/29
 */
class RXSdkApiImplDefault extends RXSdkApi {
    @Override
    public SdkInfo getSdkInfo() {
        return new SdkInfo.Builder().setName("ruixue").setExt("RXSdkApiDefault").setVersion(RuiXueSdk.getSdkVersion()).build();
    }

    @Override
    public void login(Activity activity, Map<String, Object> map, RXJSONCallback callback) {
        RXLogger.e("渠道库检测失败，未接入瑞雪渠道sdk，请参照文档{ 三方服务 -> Android 渠道接入说明 }, 检查渠道库是否正确接入。");
        RXLogger.e("参考文档 https://doc.ruixueyun.com/admin/#/edit?path=3abc1c4c-255d-4603-b2b3-0a8917455799,aef09ab2-0582-4262-84f6-fadb2b59cb85,c5afddff-9d62-4bc5-8145-1e9329f00caf");
        callback.onError(new RXException("未接入瑞雪渠道sdk，参照文档检查渠道库是否正确接入，详情请查看logcat。"));
    }

}
