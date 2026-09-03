/*
 * Copyright (c) 2022. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package com.ruixue.wechat;

import android.text.TextUtils;

import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelbiz.SubscribeMessage;
import com.tencent.mm.opensdk.modelbiz.WXLaunchMiniProgram;
import com.tencent.mm.opensdk.modelbiz.WXOpenBusinessView;
import com.tencent.mm.opensdk.modelmsg.SendAuth;

import org.json.JSONException;
import org.json.JSONObject;

public abstract class WXCallback {
    public void onResp(BaseResp baseResp) {
        switch (baseResp.getType()) {
            //微信登录
            case ConstantsAPI.COMMAND_SENDAUTH:
                //ErrCode	ERR_OK = 0(用户同意) ERR_AUTH_DENIED = -4（用户拒绝授权） ERR_USER_CANCEL = -2（用户取消）
                //code	用户换取 access_token 的 code，仅在 ErrCode 为 0 时有效
                //state	第三方程序发送时用来标识其请求的唯一性的标志，由第三方程序调用 sendReq 时传入，由微信终端回传，state 字符串长度不能超过 1K
                //lang	微信客户端当前语言
                //country	微信用户当前国家信息
                if (baseResp instanceof SendAuth.Resp) {
                    SendAuth.Resp authResp = (SendAuth.Resp) baseResp;
                    onAuthResp(authResp.errCode, authResp.code, authResp.lang, authResp.country, authResp.state);
                } else {
                    onAuthResp(baseResp.errCode, "", "", "", "");
                }
                break;
            //微信分享
            case ConstantsAPI.COMMAND_SENDMESSAGE_TO_WX:
                onShareResp(baseResp.errCode);
                break;
            //微信支付
            case ConstantsAPI.COMMAND_PAY_BY_WX:
                onPayResp(baseResp.errCode);
                break;
            case ConstantsAPI.COMMAND_LAUNCH_WX_MINIPROGRAM:
                if (baseResp instanceof WXLaunchMiniProgram.Resp) {
                    WXLaunchMiniProgram.Resp launchMiniProResp = (WXLaunchMiniProgram.Resp) baseResp;
                    //对应小程序组件 <button open-type="launchApp"> 中的 app-parameter 属性
                    onLaunchMiniResp(baseResp.errCode, launchMiniProResp.extMsg);
                } else {
                    onLaunchMiniResp(baseResp.errCode, baseResp.errStr);
                }
                break;
            case ConstantsAPI.COMMAND_OPEN_BUSINESS_VIEW:
                if (baseResp instanceof WXOpenBusinessView.Resp) {
                    //result 必填 string【结果信息】success：展示页面成功。fail：展示页面失败。cancel：用户取消。发生场景：用户未确认收款，点击取消，返回APP
                    WXOpenBusinessView.Resp resp = (WXOpenBusinessView.Resp) baseResp;
                    int code = resp.errCode;
                    try {
                        String msg = resp.errStr;
                        if (!TextUtils.isEmpty(resp.extMsg)) {
                            JSONObject jsonObject = new JSONObject(resp.extMsg);
                            String result = jsonObject.optString("result");
                            msg = TextUtils.isEmpty(result) ? resp.extMsg : result;
                        }
                        onOpenBusinessViewResp(code, msg, resp.businessType);
                    } catch (Exception e) {
                        onOpenBusinessViewResp(code, resp.extMsg, resp.businessType);
                    }

                } else {
                    onOpenBusinessViewResp(baseResp.errCode, baseResp.errStr, null);
                }
                break;
            case ConstantsAPI.COMMAND_SUBSCRIBE_MESSAGE:
                if (baseResp instanceof SubscribeMessage.Resp) {
                    SubscribeMessage.Resp subcResp = (SubscribeMessage.Resp) baseResp;
                    onSubscribeResp(baseResp.errCode, subcResp.scene, subcResp.openId, subcResp.templateID, subcResp.action, subcResp.reserved);
                } else {
                    onSubscribeResp(baseResp.errCode, 0, "", "", "", "");
                }
                break;
            default:
                System.out.println("onResp type:" + baseResp.getType());
                break;
        }
    }

    /**
     * @param errCode {@link  BaseResp.ErrCode}
     */
    public void onShareResp(int errCode) {
    }

    /**
     * @param errCode {@link  BaseResp.ErrCode}
     */
    public void onPayResp(int errCode) {

    }

    public void onOpenBusinessViewResp(int errCode, String extMsg, String businessType) {

    }


    /**
     * @param errCode {@link  BaseResp.ErrCode} ERR_OK = 0(用户同意) ERR_AUTH_DENIED = -4（用户拒绝授权） ERR_USER_CANCEL = -2（用户取消）
     * @param code    用户换取 access_token 的 code，仅在 errCode 为 0 时有效
     * @param lang    微信客户端当前语言
     * @param county  微信用户当前国家信息
     * @param state   第三方程序发送时用来标识其请求的唯一性的标志，由第三方程序调用 sendReq 时传入，由微信终端回传，state 字符串长度不能超过 1K
     */
    public void onAuthResp(int errCode, String code, String lang, String county, String state) {

    }

    /**
     * @param errCode {@link  BaseResp.ErrCode}
     * @param extMsg  对应小程序组件 <button open-type="launchApp"> 中的 app-parameter 属性
     */
    public void onLaunchMiniResp(int errCode, String extMsg) {
    }

    /**
     * @param errCode     {@link  BaseResp.ErrCode}
     * @param openid      :oyAaTjt-xXvP87pubE4eUOF-ttD4   用户唯一标识，仅在用户确认授权时才有
     * @param template_id :7YuTL__ilzyZB9DXcDt2mHx-CAS_E7KtsQkhIGVhhRM 订阅消息模板 ID
     * @param action      :confirm  用户点击动作，"confirm"代表用户确认授权，"cancel"代表用户取消授权
     * @param reserved    :hello    订阅场景值
     * @param scene       :1000     请求带入原样返回
     */
    public void onSubscribeResp(int errCode, int scene, String openid, String template_id, String action, String reserved) {
    }

}
