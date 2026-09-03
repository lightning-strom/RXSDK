/**
 * RuixueSDKShare.java
 * 瑞雪 SDK Android 原生层封装 - 分享模块
 * 
 * 包含：一键分享、自定义分享
 * 依赖：分享模块（如未引入则此文件不应包含在项目中）
 */

package com.ruixue.sdk;

import android.util.Log;

import com.ruixue.openapi.RXSDK;
import com.ruixue.openapi.RXShareConfig;
import com.ruixue.openapi.RXCustomShareConfig;
import com.ruixue.RXRequestCallback;

import org.json.JSONObject;

public class RuixueSDKShare {
    
    private static final String TAG = "RuixueSDKShare";
    
    /**
     * 一键分享（由 C++ 层调用）
     * 
     * C++ 传入参数格式:
     * {
     *     "func": "share_func_id",           // 埋点标识（必填）
     *     "platform": "wechat",              // 分享平台（必填）: wechat/system/facebook/messenger/line/tiktok/zalo
     *     "shareScene": 0,                   // 0 好友, 1 朋友圈（可选）
     *     "region": "CN",                    // 地区码（可选）
     *     "transmits": "custom_data",        // 透传参数（可选）
     *     "iOSScheme": "yourapp://",         // iOS 唤醒协议（可选）
     *     "androidScheme": "yourapp://",     // Android 唤醒协议（可选）
     *     "useScheme": "1",                  // 是否使用游戏协议（可选）
     *     "useShortUrl": true,               // 是否使用短链接（可选）
     *     "autoReport": true                 // 是否自动上报（可选，默认 true）
     * }
     */
    public static void share(final String paramsJson) {
        Log.d(TAG, "一键分享: paramsJson=" + paramsJson);
        
        if (!RuixueSDK.sInitialized) {
            RuixueSDK.callNativeResult("share", RuixueSDK.buildResponse(-1, "SDK 未初始化", null));
            return;
        }
        
        if (RuixueSDK.sActivity == null) {
            RuixueSDK.callNativeResult("share", RuixueSDK.buildResponse(-1, "Activity 未设置", null));
            return;
        }
        
        final JSONObject params = RuixueSDK.parseJson(paramsJson);
        
        RuixueSDK.sMainHandler.post(new Runnable() {
            @Override
            public void run() {
                try {
                    String func = params.optString("func", "");
                    String platform = params.optString("platform", "wechat");
                    
                    if (func.isEmpty()) {
                        RuixueSDK.callNativeResult("share", RuixueSDK.buildResponse(-1, "func（埋点标识）不能为空", null));
                        return;
                    }
                    
                    RXShareConfig config = new RXShareConfig();
                    config.setFunc(func);
                    config.setPlatform(platform);
                    
                    // 可选参数
                    if (params.has("shareScene")) {
                        config.setShareScene(params.optInt("shareScene", 0));
                    }
                    if (params.has("region")) {
                        config.setRegion(params.optString("region"));
                    }
                    if (params.has("transmits")) {
                        config.setTransmits(params.optString("transmits"));
                    }
                    if (params.has("iOSScheme")) {
                        config.setiOSScheme(params.optString("iOSScheme"));
                    }
                    if (params.has("androidScheme")) {
                        config.setAndroidScheme(params.optString("androidScheme"));
                    }
                    if (params.has("useScheme")) {
                        config.setUseScheme(params.optString("useScheme"));
                    }
                    if (params.has("useShortUrl")) {
                        config.setUseShortUrl(params.optBoolean("useShortUrl", false));
                    }
                    if (params.has("autoReport")) {
                        config.setAutoReport(params.optBoolean("autoReport", true));
                    }
                    
                    Log.d(TAG, "调用 RXSDK 一键分享: func=" + func + ", platform=" + platform);
                    
                    RXSDK.getInstance().share(RuixueSDK.sActivity, config, new RXRequestCallback() {
                        @Override
                        public void onResponse(JSONObject jsonObject) {
                            int code = jsonObject.optInt("code", -1);
                            if (code == 0) {
                                Log.d(TAG, "一键分享成功");
                            } else {
                                Log.e(TAG, "一键分享失败: " + jsonObject.optString("msg"));
                            }
                            RuixueSDK.callNativeResult("share", jsonObject.toString());
                        }
                    });
                    
                } catch (Exception e) {
                    Log.e(TAG, "一键分享异常: " + e.getMessage(), e);
                    RuixueSDK.callNativeResult("share", RuixueSDK.buildResponse(-1, "分享失败: " + e.getMessage(), null));
                }
            }
        });
    }
    
    /**
     * 自定义分享（由 C++ 层调用）
     * 
     * C++ 传入参数格式:
     * {
     *     "platform": "wechat",                      // 分享平台（必填）
     *     "type": "link",                            // 分享类型（必填）: text/image/link/url
     *     "title": "分享标题",                        // 分享标题（可选）
     *     "content": "分享描述",                      // 分享描述（可选）
     *     "url": "https://example.com/share",        // 分享链接（可选）
     *     "image": "https://example.com/image.png",  // 图片 URL 或本地路径（可选）
     *     "shareScene": 0,                           // 0 好友, 1 朋友圈（可选）
     *     "thirdAppid": "wx1234567890",              // 三方 appid（可选）
     *     "iOSScheme": "yourapp://",                 // iOS 唤醒协议（可选）
     *     "androidScheme": "yourapp://",             // Android 唤醒协议（可选）
     *     "useScheme": "1"                           // 是否使用游戏协议（可选）
     * }
     */
    public static void shareCustom(final String paramsJson) {
        Log.d(TAG, "自定义分享: paramsJson=" + paramsJson);
        
        if (!RuixueSDK.sInitialized) {
            RuixueSDK.callNativeResult("shareCustom", RuixueSDK.buildResponse(-1, "SDK 未初始化", null));
            return;
        }
        
        if (RuixueSDK.sActivity == null) {
            RuixueSDK.callNativeResult("shareCustom", RuixueSDK.buildResponse(-1, "Activity 未设置", null));
            return;
        }
        
        final JSONObject params = RuixueSDK.parseJson(paramsJson);
        
        RuixueSDK.sMainHandler.post(new Runnable() {
            @Override
            public void run() {
                try {
                    String platform = params.optString("platform", "wechat");
                    String type = params.optString("type", "link");
                    
                    RXCustomShareConfig config = new RXCustomShareConfig();
                    config.setPlatform(platform);
                    config.setType(type);
                    
                    // 可选参数
                    if (params.has("title")) {
                        config.setTitle(params.optString("title"));
                    }
                    if (params.has("content")) {
                        config.setDescription(params.optString("content"));
                    }
                    if (params.has("url")) {
                        config.setUrl(params.optString("url"));
                    }
                    if (params.has("image")) {
                        config.setImage(params.optString("image"));
                    }
                    if (params.has("shareScene")) {
                        config.setShareScene(params.optInt("shareScene", 0));
                    }
                    if (params.has("thirdAppid")) {
                        config.setThirdAppid(params.optString("thirdAppid"));
                    }
                    if (params.has("iOSScheme")) {
                        config.setIOSProtocol(params.optString("iOSScheme"));
                    }
                    if (params.has("androidScheme")) {
                        config.setAndroidProtocol(params.optString("androidScheme"));
                    }
                    if (params.has("useScheme")) {
                        config.setUseScheme(params.optString("useScheme"));
                    }
                    
                    Log.d(TAG, "调用 RXSDK 自定义分享: platform=" + platform + ", type=" + type);
                    
                    RXSDK.getInstance().shareCustom(RuixueSDK.sActivity, config, new RXRequestCallback() {
                        @Override
                        public void onResponse(JSONObject jsonObject) {
                            int code = jsonObject.optInt("code", -1);
                            if (code == 0) {
                                Log.d(TAG, "自定义分享成功");
                            } else {
                                Log.e(TAG, "自定义分享失败: " + jsonObject.optString("msg"));
                            }
                            RuixueSDK.callNativeResult("shareCustom", jsonObject.toString());
                        }
                    });
                    
                } catch (Exception e) {
                    Log.e(TAG, "自定义分享异常: " + e.getMessage(), e);
                    RuixueSDK.callNativeResult("shareCustom", RuixueSDK.buildResponse(-1, "分享失败: " + e.getMessage(), null));
                }
            }
        });
    }
    
    /**
     * 打开客服（由 C++ 层调用）
     */
    public static void openCustomerService() {
        Log.d(TAG, "打开客服");
        // TODO: 调用瑞雪 SDK 客服功能
    }
}
