/*
 * Copyright (c) 2022. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
 * Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan.
 * Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna.
 * Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus.
 * Vestibulum commodo. Ut rhoncus gravida arcu.
 */

package com.ruixue.wechat;

public abstract class WXAuthResp extends WXCallback {

    /**
     * @param errCode {@link  com.tencent.mm.opensdk.modelbase.BaseResp.ErrCode}
     *                ERR_OK = 0(用户同意) ERR_AUTH_DENIED = -4（用户拒绝授权） ERR_USER_CANCEL = -2（用户取消）
     * @param code    用户换取 access_token 的 code，仅在 errCode 为 0 时有效
     * @param lang    微信客户端当前语言
     * @param county  微信用户当前国家信息
     * @param state   用于保持请求和回调的状态，授权请求后原样带回给第三方。该参数可用于防止 csrf 攻击（跨站请求伪造攻击），建议第三方带上该参数，可设置为简单的随机数加 session 进行校验。在state传递的过程中会将该参数作为url的一部分进行处理，因此建议对该参数进行url encode操作，防止其中含有影响url解析的特殊字符（如'#'、'&'等）导致该参数无法正确回传。
     */
    @Override
    public abstract void onAuthResp(int errCode, String code, String lang, String county, String state);

}
