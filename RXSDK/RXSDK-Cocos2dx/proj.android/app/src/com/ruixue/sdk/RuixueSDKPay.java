/**
 * RuixueSDKPay.java
 * 瑞雪 SDK Android 原生层封装 - 支付模块
 * 
 * 依赖：
 * - 微信支付需添加: com.ruixue:rxsdk_weixin_withpay:${version}
 * - 星驿 App 支付需添加: com.ruixue:rxsdk_xingyi:4.0.14 或更高
 * - 星驿 H5 支付需添加: com.ruixue:rxsdk_h5pay:4.0.14 或更高
 * - 如未引入支付模块则此文件不应包含在项目中
 */

package com.ruixue.sdk;

import android.util.Log;

import com.ruixue.openapi.RXSDK;
import com.ruixue.RXRequestCallback;
import com.ruixue.billing.HQParams;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class RuixueSDKPay {
    
    private static final String TAG = "RuixueSDKPay";
    
    /**
     * 发起支付（由 C++ 层调用）
     * 
     * C++ 传入参数格式:
     * {
     *     "payType": "wechat",              // 支付类型: wechat / alipay / xy
     *     "goodsTag": "100钻石",             // 瑞雪后台计费点名称（必填）
     *     "tradeNo": "cp_order_001",         // CP 订单号（必填）
     *     "transmitArgs": "",                // CP 透传参数（可选）
     *     "gameCharacterId": "role_001",     // 角色 ID（可选）
     *     "gameServerId": "server_001",      // 区服 ID（可选）
     *     "indulgeAuth": 1,                  // 防沉迷验证 0-不验证 1-验证（可选，默认1）
     *     "ext": {"is_h5": 1}                // 星驿 H5 支付传 1；App 支付不传
     * }
     */
    public static void pay(final String paramsJson) {
        Log.d(TAG, "发起支付: paramsJson=" + paramsJson);
        
        if (!RuixueSDK.sInitialized) {
            RuixueSDK.callNativeResult("pay", RuixueSDK.buildResponse(-1, "SDK 未初始化", null));
            return;
        }
        
        if (RuixueSDK.sActivity == null) {
            RuixueSDK.callNativeResult("pay", RuixueSDK.buildResponse(-1, "Activity 未设置", null));
            return;
        }
        
        final JSONObject params = RuixueSDK.parseJson(paramsJson);
        
        RuixueSDK.sMainHandler.post(new Runnable() {
            @Override
            public void run() {
                try {
                    // 解析 C++ 传入的参数
                    String payType = params.optString("payType", "wechat");
                    String goodsTag = params.optString("goodsTag", "");
                    String tradeNo = params.optString("tradeNo", "");
                    String transmitArgs = params.optString("transmitArgs", "");
                    String gameCharacterId = params.optString("gameCharacterId", "");
                    String gameServerId = params.optString("gameServerId", "");
                    int indulgeAuth = params.optInt("indulgeAuth", 1);
                    
                    // 参数校验
                    if (goodsTag.isEmpty()) {
                        RuixueSDK.callNativeResult("pay", RuixueSDK.buildResponse(-1, "goodsTag（计费点名称）不能为空", null));
                        return;
                    }
                    if (tradeNo.isEmpty()) {
                        RuixueSDK.callNativeResult("pay", RuixueSDK.buildResponse(-1, "tradeNo（CP 订单号）不能为空", null));
                        return;
                    }
                    
                    // 构造游戏信息
                    HQParams.GameInfo gameInfo = new HQParams.GameInfo();
                    if (!gameCharacterId.isEmpty()) {
                        gameInfo.setCpGameCharacterId(gameCharacterId);
                    }
                    if (!gameServerId.isEmpty()) {
                        gameInfo.setCpGameAreaId(gameServerId);
                    }
                    
                    // 构造支付参数
                    Map<String, Object> payParams = new HashMap<>();
                    payParams.put("hq_type", payType);
                    payParams.put("goods_tag", goodsTag);
                    payParams.put("trade_no", tradeNo);
                    payParams.put("game_info", gameInfo.toMap());
                    payParams.put("indulge_auth", indulgeAuth);
                    
                    if (!transmitArgs.isEmpty()) {
                        payParams.put("transmit_args", transmitArgs);
                    }
                    
                    // 解析扩展参数
                    JSONObject extJson = params.optJSONObject("ext");
                    if (extJson != null) {
                        Map<String, Object> extMap = new HashMap<>();
                        java.util.Iterator<String> keys = extJson.keys();
                        while (keys.hasNext()) {
                            String key = keys.next();
                            extMap.put(key, extJson.opt(key));
                        }
                        payParams.put("ext", extMap);
                    }
                    
                    // 解析自定义透传参数
                    JSONObject customExtJson = params.optJSONObject("customExt");
                    if (customExtJson != null) {
                        Map<String, Object> customExtMap = new HashMap<>();
                        java.util.Iterator<String> keys = customExtJson.keys();
                        while (keys.hasNext()) {
                            String key = keys.next();
                            customExtMap.put(key, customExtJson.opt(key));
                        }
                        payParams.put("custom_ext", customExtMap);
                    }
                    
                    Log.d(TAG, "调用 RXSDK 支付: payType=" + payType + ", goodsTag=" + goodsTag + ", tradeNo=" + tradeNo);
                    
                    // 调用瑞雪 SDK 支付
                    RXSDK.getInstance().pay(RuixueSDK.sActivity, payParams, new RXRequestCallback() {
                        @Override
                        public void onResponse(JSONObject jsonObject) {
                            int code = jsonObject.optInt("code", -1);
                            if (code == 0) {
                                Log.d(TAG, "支付成功");
                                // 直接返回 SDK 完整响应
                                RuixueSDK.callNativeResult("pay", jsonObject.toString());
                            } else {
                                String msg = jsonObject.optString("msg", "支付失败");
                                String thirdcode = String.valueOf(jsonObject.opt("thirdcode"));
                                String thirdmsg = String.valueOf(jsonObject.opt("thirdmsg"));
                                Log.e(TAG, "支付失败: code=" + code + ", msg=" + msg
                                        + ", thirdcode=" + thirdcode + ", thirdmsg=" + thirdmsg);
                                // 直接返回 SDK 完整响应
                                RuixueSDK.callNativeResult("pay", jsonObject.toString());
                            }
                        }
                    });
                    
                } catch (Exception e) {
                    Log.e(TAG, "支付异常: " + e.getMessage(), e);
                    RuixueSDK.callNativeResult("pay", RuixueSDK.buildResponse(-1, "支付失败: " + e.getMessage(), null));
                }
            }
        });
    }
}
