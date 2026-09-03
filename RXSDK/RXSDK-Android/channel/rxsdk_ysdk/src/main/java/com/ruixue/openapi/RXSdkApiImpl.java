package com.ruixue.openapi;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.BitmapDrawable;
import android.util.SparseArray;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.PopupWindow;

import androidx.annotation.NonNull;

import com.google.gson.Gson;
import com.ruixue.RXJSONCallback;
import com.ruixue.RuiXueSdk;
import com.ruixue.base.SdkInfo;
import com.ruixue.callback.OnLogoutCallback;
import com.ruixue.error.RXErrorCode;
import com.ruixue.legal.AntiAddictDelegate;
import com.ruixue.legal.PrivacyCallback;
import com.ruixue.logger.RXLogger;
import com.ruixue.sdk.YSDKApiHelper;
import com.ruixue.sdk.YSDKBillingImpl;
import com.ruixue.sdk.YSDKSdkApiImpl;
import com.ruixue.utils.JSONUtil;
import com.ruixue.utils.ObjectUtils;
import com.ruixue.ysdk.R;
import com.tencent.smtt.sdk.WebSettings;
import com.tencent.smtt.sdk.WebView;
import com.tencent.smtt.sdk.WebViewClient;
import com.tencent.ysdk.api.YSDKApi;
import com.tencent.ysdk.framework.common.BaseRet;
import com.tencent.ysdk.framework.common.eFlag;
import com.tencent.ysdk.framework.common.ePlatform;
import com.tencent.ysdk.module.antiaddiction.listener.AntiAddictListener;
import com.tencent.ysdk.module.antiaddiction.model.AntiAddictRet;
import com.tencent.ysdk.module.user.PersonInfo;
import com.tencent.ysdk.module.user.UserListener;
import com.tencent.ysdk.module.user.UserLoginRet;
import com.tencent.ysdk.module.user.UserRelationRet;
import com.tencent.ysdk.module.user.WakeupRet;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

public class RXSdkApiImpl extends YSDKSdkApiImpl {

}
