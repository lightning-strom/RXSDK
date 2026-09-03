package com.ruixue.openapi;

import android.app.Activity;
import android.app.Application;
import android.os.Bundle;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.base.socializelib.config.SharePlatform;
import com.base.socializelib.interfcace.ShareLisener;
import com.base.socializelib.share.shareparam.ShareImage;
import com.base.socializelib.share.shareparam.ShareParamImage;
import com.bsgamesdk.android.callbacklistener.AccountCallBackListener;
import com.bsgamesdk.android.callbacklistener.BSGameSdkError;
import com.bsgamesdk.android.callbacklistener.CallbackListener;
import com.bsgamesdk.android.callbacklistener.ExitCallbackListener;
import com.bsgamesdk.android.callbacklistener.InitCallbackListener;
import com.gsc.pub.GSCPubCommon;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.error.RXErrorCode;
import com.ruixue.error.RXException;
import com.ruixue.passport.LoginMethod;
import com.ruixue.sdk.BiliBiliBillingImpl;
import com.ruixue.billing.BillingClient;
import com.ruixue.sdk.BiliBiliSdkApiImpl;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ThreadUtils;

import org.json.JSONObject;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class RXSdkApiImpl extends BiliBiliSdkApiImpl {

}
