/**
 * RuixueSDKUI.java
 * 瑞雪 SDK Android 原生层封装 - UI 模块
 * 
 * 包含所有 UI 展示功能：登录UI、用户中心、找回密码、实名认证等
 * 依赖：rxsdk_base_ui（如未引入此模块，相关功能将不可用）
 */

package com.ruixue.sdk;

import android.util.Log;

import com.ruixue.RXRequestCallback;
import com.ruixue.openapi.RXLoginUIModel;
import com.ruixue.openapi.RXSdkUI;
import com.ruixue.openapi.RXUserCenterConfig;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class RuixueSDKUI {
    
    private static final String TAG = "RuixueSDKUI";
    
    /**
     * 显示登录 UI（由 C++ 层调用）
     */
    public static void showLoginUI(final String paramsJson) {
        Log.d(TAG, "调用 UI 登录, paramsJson=" + paramsJson);
        
        if (!RuixueSDK.sInitialized) {
            RuixueSDK.callNativeResult("showLoginUI", RuixueSDK.buildResponse(-1, "SDK 未初始化", null));
            return;
        }
        
        if (RuixueSDK.sActivity == null) {
            RuixueSDK.callNativeResult("showLoginUI", RuixueSDK.buildResponse(-1, "Activity 未设置", null));
            return;
        }
        
        RuixueSDK.sMainHandler.post(new Runnable() {
            @Override
            public void run() {
                JSONObject params = RuixueSDK.parseJson(paramsJson);
                
                RXLoginUIModel rxLoginUIModel = new RXLoginUIModel();
                String loginOpenid = params.optString("loginOpenid", null);
                if (loginOpenid != null && !loginOpenid.isEmpty()) {
                    rxLoginUIModel.setLoginOpenid(loginOpenid);
                }
                
                RXSdkUI.getInstance().showLoginUI(RuixueSDK.sActivity, rxLoginUIModel, new RXRequestCallback() {
                    @Override
                    public void onResponse(JSONObject response) {
                        RuixueSDK.callNativeResult("showLoginUI", response.toString());
                    }
                });
            }
        });
    }
    
    /**
     * 显示用户中心（由 C++ 层调用）
     */
    public static void showUserCenter(final String paramsJson) {
        Log.d(TAG, "显示用户中心: paramsJson=" + paramsJson);
        
        if (!RuixueSDK.sInitialized) {
            RuixueSDK.callNativeResult("userCenter", RuixueSDK.buildResponse(-1, "SDK 未初始化", null));
            return;
        }
        
        if (RuixueSDK.sActivity == null) {
            RuixueSDK.callNativeResult("userCenter", RuixueSDK.buildResponse(-1, "Activity 未设置", null));
            return;
        }
        
        RuixueSDK.sMainHandler.post(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject params = RuixueSDK.parseJson(paramsJson);
                    
                    // 配置按钮
                    Map<String, Object> ucMap = new HashMap<>();
                    JSONArray btnsArray = params.optJSONArray("btns");
                    if (btnsArray != null) {
                        String[] btns = new String[btnsArray.length()];
                        for (int i = 0; i < btnsArray.length(); i++) {
                            btns[i] = btnsArray.getString(i);
                        }
                        ucMap.put("btns", btns);
                    } else {
                        ucMap.put("btns", new String[]{
                            "real_name", "privacy_policy", "acount_cancel", 
                            "phone_management", "change_pwd"
                        });
                    }
                    
                    RXUserCenterConfig config = new RXUserCenterConfig();
                    
                    String transmitArgs = params.optString("transmit_args", null);
                    if (transmitArgs != null && !transmitArgs.isEmpty()) {
                        config.setTransmit_args(transmitArgs);
                    }
                    
                    if (params.has("game_user_id")) {
                        Object gameUserId = params.get("game_user_id");
                        config.setGame_user_id(gameUserId);
                    }
                    
                    String nickname = params.optString("nickname", null);
                    if (nickname != null && !nickname.isEmpty()) {
                        config.setNickname(nickname);
                    }
                    
                    String headImgUrl = params.optString("head_img_url", null);
                    if (headImgUrl != null && !headImgUrl.isEmpty()) {
                        config.setHead_img_url(headImgUrl);
                    }
                    
                    String queueName = params.optString("queue_name", "default");
                    config.setQueue_name(queueName);
                    
                    config.setConfigParams(ucMap);
                    
                    RXSdkUI.getInstance().userCenterUI(RuixueSDK.sActivity, config, new RXRequestCallback() {
                        @Override
                        public void onResponse(JSONObject response) {
                            int code = response.optInt("code", -1);
                            if (code == 0) {
                                JSONObject data = response.optJSONObject("data");
                                if (data != null) {
                                    String type = data.optString("type");
                                    Log.d(TAG, "用户中心回调类型: " + type);
                                }
                            }
                            RuixueSDK.callNativeResult("userCenter", response.toString());
                        }
                    }).show();
                    
                } catch (Exception e) {
                    Log.e(TAG, "显示用户中心失败: " + e.getMessage());
                    RuixueSDK.callNativeResult("userCenter", RuixueSDK.buildResponse(-1, "显示用户中心失败: " + e.getMessage(), null));
                }
            }
        });
    }
    
    /**
     * 显示找回密码 UI（由 C++ 层调用）
     */
    public static void showResetPasswordUI(final String paramsJson) {
        Log.d(TAG, "显示找回密码UI: paramsJson=" + paramsJson);
        
        if (!RuixueSDK.sInitialized) {
            RuixueSDK.callNativeResult("resetPassword", RuixueSDK.buildResponse(-1, "SDK 未初始化", null));
            return;
        }
        
        if (RuixueSDK.sActivity == null) {
            RuixueSDK.callNativeResult("resetPassword", RuixueSDK.buildResponse(-1, "Activity 未设置", null));
            return;
        }
        
        RuixueSDK.sMainHandler.post(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject params = RuixueSDK.parseJson(paramsJson);
                    
                    Map<String, Object> map = new HashMap<>();
                    
                    String username = params.optString("username", null);
                    if (username != null && !username.isEmpty()) {
                        map.put("username", username);
                    }
                    
                    int accountType = params.optInt("account_type", 2);
                    map.put("account_type", accountType);
                    
                    String passwordHint = params.optString("password_hint", null);
                    if (passwordHint != null && !passwordHint.isEmpty()) {
                        map.put("password_hint", passwordHint);
                    }
                    
                    RXSdkUI.getInstance().findPassWordUI(RuixueSDK.sActivity, map, new com.ruixue.callback.RXUICallback() {
                        @Override
                        public void onSuccess(JSONObject data) {
                            Log.d(TAG, "找回密码成功: " + data);
                            RuixueSDK.callNativeResult("resetPassword", RuixueSDK.buildResponse(0, "找回密码成功", data));
                        }
                        
                        @Override
                        public void onFailed(JSONObject cause) {
                            Log.e(TAG, "找回密码失败: " + cause);
                            int code = cause.optInt("code", -1);
                            String msg = cause.optString("msg", "找回密码失败");
                            RuixueSDK.callNativeResult("resetPassword", RuixueSDK.buildResponse(code, msg, cause));
                        }
                        
                        @Override
                        public void onError(com.ruixue.error.RXException e) {
                            Log.e(TAG, "找回密码错误: " + e.getMessage());
                            RuixueSDK.callNativeResult("resetPassword", RuixueSDK.buildResponse(-1, e.getMessage(), null));
                        }
                    }).show();
                    
                } catch (Exception e) {
                    Log.e(TAG, "找回密码异常: " + e.getMessage());
                    RuixueSDK.callNativeResult("resetPassword", RuixueSDK.buildResponse(-1, "异常: " + e.getMessage(), null));
                }
            }
        });
    }
    
    /**
     * 显示实名认证 UI（由 C++ 层调用）
     */
    public static void showRealNameAuthUI(final String paramsJson) {
        Log.d(TAG, "显示实名认证UI: paramsJson=" + paramsJson);
        
        if (!RuixueSDK.sInitialized) {
            RuixueSDK.callNativeResult("realNameAuth", RuixueSDK.buildResponse(-1, "SDK 未初始化", null));
            return;
        }
        
        if (RuixueSDK.sActivity == null) {
            RuixueSDK.callNativeResult("realNameAuth", RuixueSDK.buildResponse(-1, "Activity 未设置", null));
            return;
        }
        
        RuixueSDK.sMainHandler.post(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject params = RuixueSDK.parseJson(paramsJson);
                    boolean cancelable = params.optBoolean("cancelable", false);
                    
                    RXSdkUI.getInstance().realAuthUI(RuixueSDK.sActivity, cancelable, new com.ruixue.RXJSONCallback() {
                        @Override
                        public void onSuccess(JSONObject data) {
                            Log.d(TAG, "实名认证成功: " + data);
                            RuixueSDK.callNativeResult("realNameAuth", RuixueSDK.buildResponse(0, "实名认证成功", data));
                        }
                        
                        @Override
                        public void onFailed(JSONObject cause) {
                            Log.e(TAG, "实名认证失败: " + cause);
                            int code = cause.optInt("code", -1);
                            String msg = cause.optString("msg", "实名认证失败");
                            RuixueSDK.callNativeResult("realNameAuth", RuixueSDK.buildResponse(code, msg, cause));
                        }
                        
                        @Override
                        public void onError(com.ruixue.error.RXException e) {
                            Log.e(TAG, "实名认证错误: " + e.getMessage());
                            RuixueSDK.callNativeResult("realNameAuth", RuixueSDK.buildResponse(-1, e.getMessage(), null));
                        }
                    }).show();
                    
                } catch (Exception e) {
                    Log.e(TAG, "实名认证异常: " + e.getMessage());
                    RuixueSDK.callNativeResult("realNameAuth", RuixueSDK.buildResponse(-1, "异常: " + e.getMessage(), null));
                }
            }
        });
    }
    
    /**
     * 显示绑定手机 UI（由 C++ 层调用）
     */
    public static void showBindPhoneUI() {
        Log.d(TAG, "显示绑定手机UI");
        
        if (!RuixueSDK.sInitialized) {
            RuixueSDK.callNativeResult("bindPhone", RuixueSDK.buildResponse(-1, "SDK 未初始化", null));
            return;
        }
        
        if (RuixueSDK.sActivity == null) {
            RuixueSDK.callNativeResult("bindPhone", RuixueSDK.buildResponse(-1, "Activity 未设置", null));
            return;
        }
        
        RuixueSDK.sMainHandler.post(new Runnable() {
            @Override
            public void run() {
                try {
                    RXSdkUI.getInstance().bindPhoneUI(RuixueSDK.sActivity, new com.ruixue.callback.RXUICallback() {
                        @Override
                        public void onSuccess(JSONObject data) {
                            Log.d(TAG, "绑定手机成功: " + data);
                            RuixueSDK.callNativeResult("bindPhone", RuixueSDK.buildResponse(0, "绑定手机成功", data));
                        }
                        
                        @Override
                        public void onFailed(JSONObject cause) {
                            Log.e(TAG, "绑定手机失败: " + cause);
                            int code = cause != null ? cause.optInt("code", -1) : -1;
                            String msg = cause != null ? cause.optString("msg", "绑定手机失败") : "绑定手机失败";
                            RuixueSDK.callNativeResult("bindPhone", RuixueSDK.buildResponse(code, msg, cause));
                        }
                        
                        @Override
                        public void onError(com.ruixue.error.RXException e) {
                            Log.e(TAG, "绑定手机错误: " + e.getMessage());
                            RuixueSDK.callNativeResult("bindPhone", RuixueSDK.buildResponse(-1, e.getMessage(), null));
                        }
                    }).show();
                    
                } catch (Exception e) {
                    Log.e(TAG, "绑定手机异常: " + e.getMessage());
                    RuixueSDK.callNativeResult("bindPhone", RuixueSDK.buildResponse(-1, "异常: " + e.getMessage(), null));
                }
            }
        });
    }
    
    /**
     * 显示申请注销账号 UI（由 C++ 层调用）
     */
    public static void showDeleteAccountUI(final String paramsJson) {
        Log.d(TAG, "显示注销账号UI: paramsJson=" + paramsJson);
        
        if (!RuixueSDK.sInitialized) {
            RuixueSDK.callNativeResult("deleteAccount", RuixueSDK.buildResponse(-1, "SDK 未初始化", null));
            return;
        }
        
        if (RuixueSDK.sActivity == null) {
            RuixueSDK.callNativeResult("deleteAccount", RuixueSDK.buildResponse(-1, "Activity 未设置", null));
            return;
        }
        
        RuixueSDK.sMainHandler.post(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject params = RuixueSDK.parseJson(paramsJson);
                    
                    RXUserCenterConfig config = new RXUserCenterConfig();
                    
                    String gameUserId = params.optString("game_user_id", null);
                    if (gameUserId != null && !gameUserId.isEmpty()) {
                        config.setGame_user_id(gameUserId);
                    }
                    
                    String nickname = params.optString("nickname", null);
                    if (nickname != null && !nickname.isEmpty()) {
                        config.setNickname(nickname);
                    }
                    
                    config.setQueue_name("default");
                    
                    RXSdkUI.getInstance().applyForDeregisterUI(RuixueSDK.sActivity, config, new com.ruixue.callback.RXUICallback() {
                        @Override
                        public void onSuccess(JSONObject data) {
                            Log.d(TAG, "注销申请成功: " + data);
                            RuixueSDK.callNativeResult("deleteAccount", RuixueSDK.buildResponse(0, "注销申请成功", data));
                        }
                        
                        @Override
                        public void onFailed(JSONObject cause) {
                            Log.e(TAG, "注销申请失败: " + cause);
                            int code = cause != null ? cause.optInt("code", -1) : -1;
                            String msg = cause != null ? cause.optString("msg", "注销申请失败") : "注销申请失败";
                            RuixueSDK.callNativeResult("deleteAccount", RuixueSDK.buildResponse(code, msg, cause));
                        }
                        
                        @Override
                        public void onError(com.ruixue.error.RXException e) {
                            Log.e(TAG, "注销申请错误: " + e.getMessage());
                            RuixueSDK.callNativeResult("deleteAccount", RuixueSDK.buildResponse(-1, e.getMessage(), null));
                        }
                    }).show();
                    
                } catch (Exception e) {
                    Log.e(TAG, "注销账号异常: " + e.getMessage());
                    RuixueSDK.callNativeResult("deleteAccount", RuixueSDK.buildResponse(-1, "异常: " + e.getMessage(), null));
                }
            }
        });
    }
    
    /**
     * 显示撤销注销弹窗（由 C++ 层调用）
     */
    public static void showCancelDeleteUI(final String paramsJson) {
        Log.d(TAG, "显示撤销注销UI: paramsJson=" + paramsJson);
        
        if (!RuixueSDK.sInitialized) {
            RuixueSDK.callNativeResult("cancelDelete", RuixueSDK.buildResponse(-1, "SDK 未初始化", null));
            return;
        }
        
        if (RuixueSDK.sActivity == null) {
            RuixueSDK.callNativeResult("cancelDelete", RuixueSDK.buildResponse(-1, "Activity 未设置", null));
            return;
        }
        
        RuixueSDK.sMainHandler.post(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject params = RuixueSDK.parseJson(paramsJson);
                    boolean isLoginContinue = params.optBoolean("is_login_continue", true);
                    
                    RXSdkUI.getInstance().destroyAccountStatusView(RuixueSDK.sActivity, isLoginContinue, new com.ruixue.RXJSONCallback() {
                        @Override
                        public void onSuccess(JSONObject data) {
                            Log.d(TAG, "撤销注销成功: " + data);
                            RuixueSDK.callNativeResult("cancelDelete", RuixueSDK.buildResponse(0, "撤销注销成功", data));
                        }
                        
                        @Override
                        public void onFailed(JSONObject cause) {
                            Log.e(TAG, "撤销注销失败: " + cause);
                            int code = cause != null ? cause.optInt("code", -1) : -1;
                            String msg = cause != null ? cause.optString("msg", "撤销注销失败") : "撤销注销失败";
                            RuixueSDK.callNativeResult("cancelDelete", RuixueSDK.buildResponse(code, msg, cause));
                        }
                        
                        @Override
                        public void onError(com.ruixue.error.RXException e) {
                            Log.e(TAG, "撤销注销错误: " + e.getMessage());
                            RuixueSDK.callNativeResult("cancelDelete", RuixueSDK.buildResponse(-1, e.getMessage(), null));
                        }
                    }).show();
                    
                } catch (Exception e) {
                    Log.e(TAG, "撤销注销异常: " + e.getMessage());
                    RuixueSDK.callNativeResult("cancelDelete", RuixueSDK.buildResponse(-1, "异常: " + e.getMessage(), null));
                }
            }
        });
    }
    
    /**
     * 显示协议页面（由 C++ 层调用）
     */
    public static void showProtocolUI(final String paramsJson) {
        Log.d(TAG, "显示协议页面: paramsJson=" + paramsJson);
        
        if (!RuixueSDK.sInitialized) {
            Log.e(TAG, "SDK 未初始化");
            return;
        }
        
        if (RuixueSDK.sActivity == null) {
            Log.e(TAG, "Activity 未设置");
            return;
        }
        
        RuixueSDK.sMainHandler.post(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject params = RuixueSDK.parseJson(paramsJson);
                    
                    String key = params.optString("key", "00001");
                    
                    java.util.List<String> keyList = new java.util.ArrayList<>();
                    org.json.JSONArray keyListArray = params.optJSONArray("key_list");
                    if (keyListArray != null) {
                        for (int i = 0; i < keyListArray.length(); i++) {
                            keyList.add(keyListArray.optString(i));
                        }
                    }
                    if (keyList.isEmpty()) {
                        keyList.add("00001");
                        keyList.add("00002");
                    }
                    
                    RXSdkUI.getInstance().protocolView(RuixueSDK.sActivity, key, keyList).show();
                    
                } catch (Exception e) {
                    Log.e(TAG, "显示协议页面异常: " + e.getMessage());
                }
            }
        });
    }
    
    /**
     * 显示防沉迷提示弹窗（由 C++ 层调用）
     */
    public static void showAntiAddictionUI(final String paramsJson) {
        Log.d(TAG, "显示防沉迷提示: paramsJson=" + paramsJson);
        
        if (!RuixueSDK.sInitialized) {
            RuixueSDK.callNativeResult("antiAddiction", RuixueSDK.buildResponse(-1, "SDK 未初始化", null));
            return;
        }
        
        if (RuixueSDK.sActivity == null) {
            RuixueSDK.callNativeResult("antiAddiction", RuixueSDK.buildResponse(-1, "Activity 未设置", null));
            return;
        }
        
        RuixueSDK.sMainHandler.post(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject params = RuixueSDK.parseJson(paramsJson);
                    
                    String title = params.optString("title", "防沉迷提示");
                    String content = params.optString("content", "根据国家相关规定，您的游戏时间已到限制。");
                    String btnText = params.optString("btn_text", "知道了");
                    
                    RXSdkUI.getInstance().antiAdditionView(RuixueSDK.sActivity, title, content, btnText, new com.ruixue.RXJSONCallback() {
                        @Override
                        public void onSuccess(JSONObject data) {
                            Log.d(TAG, "防沉迷弹窗确认: " + data);
                            RuixueSDK.callNativeResult("antiAddiction", RuixueSDK.buildResponse(0, "用户确认", data));
                        }
                        
                        @Override
                        public void onFailed(JSONObject cause) {
                            Log.d(TAG, "防沉迷弹窗关闭: " + cause);
                            RuixueSDK.callNativeResult("antiAddiction", RuixueSDK.buildResponse(0, "用户关闭", cause));
                        }
                        
                        @Override
                        public void onError(com.ruixue.error.RXException e) {
                            Log.e(TAG, "防沉迷弹窗错误: " + e.getMessage());
                            RuixueSDK.callNativeResult("antiAddiction", RuixueSDK.buildResponse(-1, e.getMessage(), null));
                        }
                    }).show();
                    
                } catch (Exception e) {
                    Log.e(TAG, "防沉迷提示异常: " + e.getMessage());
                    RuixueSDK.callNativeResult("antiAddiction", RuixueSDK.buildResponse(-1, "异常: " + e.getMessage(), null));
                }
            }
        });
    }
    
    /**
     * 显示邮件中心（由 C++ 层调用）
     */
    public static void showMailCenterUI(final String paramsJson) {
        Log.d(TAG, "显示邮件中心: paramsJson=" + paramsJson);
        
        if (!RuixueSDK.sInitialized) {
            RuixueSDK.callNativeResult("mailCenter", RuixueSDK.buildResponse(-1, "SDK 未初始化", null));
            return;
        }
        
        if (RuixueSDK.sActivity == null) {
            RuixueSDK.callNativeResult("mailCenter", RuixueSDK.buildResponse(-1, "Activity 未设置", null));
            return;
        }
        
        RuixueSDK.sMainHandler.post(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject params = RuixueSDK.parseJson(paramsJson);
                    String cpUserId = params.optString("cp_user_id", "");
                    
                    RXSdkUI.getInstance().showMailCenter(RuixueSDK.sActivity, cpUserId).show();
                    RuixueSDK.callNativeResult("mailCenter", RuixueSDK.buildResponse(0, "邮件中心已打开", null));
                    
                } catch (Exception e) {
                    Log.e(TAG, "邮件中心异常: " + e.getMessage());
                    RuixueSDK.callNativeResult("mailCenter", RuixueSDK.buildResponse(-1, "异常: " + e.getMessage(), null));
                }
            }
        });
    }
    
    /**
     * 显示公告页面（由 C++ 层调用）
     */
    public static void showAnnouncementUI(final String paramsJson) {
        Log.d(TAG, "显示公告页面: paramsJson=" + paramsJson);
        
        if (!RuixueSDK.sInitialized) {
            RuixueSDK.callNativeResult("announcement", RuixueSDK.buildResponse(-1, "SDK 未初始化", null));
            return;
        }
        
        if (RuixueSDK.sActivity == null) {
            RuixueSDK.callNativeResult("announcement", RuixueSDK.buildResponse(-1, "Activity 未设置", null));
            return;
        }
        
        RuixueSDK.sMainHandler.post(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject params = RuixueSDK.parseJson(paramsJson);
                    int limit = params.optInt("limit", 10);

                    RXSdkUI.getInstance().showAnnounceView(RuixueSDK.sActivity, limit, new com.ruixue.view.notice.NoticeCallback() {
                        @Override
                        public void onLink(String link) {
                            Log.d(TAG, "公告链接点击: " + link);
                            JSONObject data = new JSONObject();
                            try {
                                data.put("link", link);
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                            RuixueSDK.callNativeResult("announcement", RuixueSDK.buildResponse(0, "链接点击", data));
                        }

                        @Override
                        public void hasAnnounceUI(boolean hasNotice) {
                            Log.d(TAG, "是否有公告: " + hasNotice);
                            JSONObject data = new JSONObject();
                            try {
                                data.put("has_notice", hasNotice);
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                            RuixueSDK.callNativeResult("announcement", RuixueSDK.buildResponse(0, hasNotice ? "有公告" : "无公告", data));
                        }
                    });
                    
                } catch (Exception e) {
                    Log.e(TAG, "公告页面异常: " + e.getMessage());
                    RuixueSDK.callNativeResult("announcement", RuixueSDK.buildResponse(-1, "异常: " + e.getMessage(), null));
                }
            }
        });
    }
    
    /**
     * 显示版本更新（由 C++ 层调用）
     */
    public static void showVersionUpdateUI(final String paramsJson) {
        Log.d(TAG, "显示版本更新: paramsJson=" + paramsJson);
        
        if (!RuixueSDK.sInitialized) {
            RuixueSDK.callNativeResult("versionUpdate", RuixueSDK.buildResponse(-1, "SDK 未初始化", null));
            return;
        }
        
        if (RuixueSDK.sActivity == null) {
            RuixueSDK.callNativeResult("versionUpdate", RuixueSDK.buildResponse(-1, "Activity 未设置", null));
            return;
        }
        
        RuixueSDK.sMainHandler.post(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject params = RuixueSDK.parseJson(paramsJson);
                    
                    String version = params.optString("version", "1.0.0");
                    String region = params.optString("region", "150000");
                    boolean showUI = params.optBoolean("show_ui", true);
                    
                    java.util.Map<String, Object> queryMap = new java.util.HashMap<>();
                    queryMap.put("type", "json");
                    
                    RXSdkUI.getInstance().showUpdateAppView(RuixueSDK.sActivity, version, region, queryMap, showUI, new com.ruixue.view.notice.MaintainNoticeCallback() {
                        @Override
                        public void onLink(String link) {
                            Log.d(TAG, "版本更新链接点击: " + link);
                            JSONObject data = new JSONObject();
                            try {
                                data.put("link", link);
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                            RuixueSDK.callNativeResult("versionUpdate", RuixueSDK.buildResponse(0, "链接点击", data));
                        }
                        
                        @Override
                        public void hasAnnounceUI(boolean hasUI) {
                            Log.d(TAG, "是否有更新UI: " + hasUI);
                        }
                        
                        @Override
                        public void onSuccess(String data) {
                            Log.d(TAG, "版本更新成功: " + data);
                            JSONObject jsonData = new JSONObject();
                            try {
                                jsonData.put("raw_data", data);
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                            RuixueSDK.callNativeResult("versionUpdate", RuixueSDK.buildResponse(0, "检查成功", jsonData));
                        }
                        
                        @Override
                        public void onFailed(int code, String msg, String traceId) {
                            Log.e(TAG, "版本更新失败: " + msg);
                            RuixueSDK.callNativeResult("versionUpdate", RuixueSDK.buildResponse(code, msg, null));
                        }
                    });
                    
                } catch (Exception e) {
                    Log.e(TAG, "版本更新异常: " + e.getMessage());
                    RuixueSDK.callNativeResult("versionUpdate", RuixueSDK.buildResponse(-1, "异常: " + e.getMessage(), null));
                }
            }
        });
    }
    
    /**
     * 显示帮助中心（由 C++ 层调用）
     */
    public static void showHelpCenterUI(final String paramsJson) {
        Log.d(TAG, "显示帮助中心: paramsJson=" + paramsJson);
        
        if (!RuixueSDK.sInitialized) {
            RuixueSDK.callNativeResult("helpCenter", RuixueSDK.buildResponse(-1, "SDK 未初始化", null));
            return;
        }
        
        if (RuixueSDK.sActivity == null) {
            RuixueSDK.callNativeResult("helpCenter", RuixueSDK.buildResponse(-1, "Activity 未设置", null));
            return;
        }
        
        RuixueSDK.sMainHandler.post(new Runnable() {
            @Override
            public void run() {
                try {
                    JSONObject params = RuixueSDK.parseJson(paramsJson);
                    
                    RXUserCenterConfig config = new RXUserCenterConfig();
                    config.setGame_user_id(params.optInt("game_user_id", 0));
                    config.setNickname(params.optString("nickname", ""));
                    config.setHead_img_url(params.optString("head_img_url", ""));
                    config.setQueue_name(params.optString("queue_name", "default"));
                    config.setTransmit_args(params.optString("transmit_args", ""));
                    
                    RXSdkUI.getInstance().helperCenterUI(RuixueSDK.sActivity, config, new RXRequestCallback() {
                        @Override
                        public void onResponse(JSONObject response) {
                            Log.d(TAG, "帮助中心回调: " + response);
                            RuixueSDK.callNativeResult("helpCenter", response.toString());
                        }
                    }).show();
                    
                } catch (Exception e) {
                    Log.e(TAG, "帮助中心异常: " + e.getMessage());
                    RuixueSDK.callNativeResult("helpCenter", RuixueSDK.buildResponse(-1, "异常: " + e.getMessage(), null));
                }
            }
        });
    }
}
