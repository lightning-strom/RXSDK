package com.ruixue.openapi;

import android.app.Activity;
import android.app.Application;
import android.content.Context;

import androidx.annotation.NonNull;

import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.billing.BillingClient;

import com.ruixue.callback.OnAppExitCallback;
import com.ruixue.legal.PrivacyCallback;
import com.ruixue.logger.RXLogger;
import com.ruixue.sdk.MiBillingImpl;
import com.ruixue.sdk.MiSdkApiImpl;
import com.ruixue.utils.JSONUtil;
import com.xiaomi.gamecenter.sdk.MiCommplatform;
import com.xiaomi.gamecenter.sdk.MiErrorCode;
import com.xiaomi.gamecenter.sdk.OnExitListner;
import com.xiaomi.gamecenter.sdk.OnInitProcessListener;
import com.xiaomi.gamecenter.sdk.OnLoginProcessListener;
import com.xiaomi.gamecenter.sdk.entry.MiAccountInfo;
import com.xiaomi.gamecenter.sdk.entry.MiAppInfo;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

//doc https://dev.mi.com/distribute/doc/details?pId=1377
public class RXSdkApiImpl extends MiSdkApiImpl {
}
