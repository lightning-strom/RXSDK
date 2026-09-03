import SdkCommonUI from '@/h5/SdkCommomUI';
declare global {
    var qg: any;
}
declare class SdkH5Ruixue extends SdkCommonUI {
    _hasAd: {
        ['rewarded']: boolean | undefined;
    };
    _ad: any | null;
    private businessRuleDefaultRefreshTime;
    private businessRulesInfo;
    private businessRuleInvoking;
    private businessWindowsQueue;
    private trackPublicPropsFailCount;
    private funcs;
    private payMessageHandler;
    private scheduleInitMap;
    private scheuleReportProps;
    subChannelId: any;
    private is_promoter;
    private game_id;
    private promoInfo;
    constructor(initParams: InitH5Params);
    /**
     * 用于设置自定义返回错误 Msg
     */
    setErrorMsg(errMsg: [key: string]): void;
    /**
     * 清空返回错误 Msg
     */
    clearErrorMsg(): void;
    private calculateValueSizeWithEncoding;
    track(params: any, callback: any): Promise<void>;
    /**
     * H5瑞雪登录方法
     * @param params 登录参数
     * @param callback 可选回调函数
     */
    private login;
    /**
     * H5瑞雪支付方法（复用 createModalIframe）
     * @param params 支付参数
     * @param callback 回调函数
     *
     * 整体流程：
     * 1. 构建支付参数 payParams（模拟假数据）
     * 2. 注册 message 监听器（先注册，保证不丢消息）
     * 3. 调用 createModalIframe 创建模态框
     * 4. iframe 加载完成后发送 PAY_IFRAME_READY
     * 5. SDK 收到 READY 后发送 payParams 给 iframe
     * 6. 用户完成支付后，iframe 发送 PAY_RESULT
     * 7. SDK 收到结果，调用 callback，清理资源
     */
    pay(params: H5RUIXUEPayParam, callback: H5MethodParams): Promise<void>;
    share(callback: IMethodParams): Promise<void>;
    closePay(): void;
    rewardedVideoAd(data: any, callback: H5MethodParams): Promise<void>;
    setScheuleReportProps(data: any): void;
    getPublicProperties(): {
        code: number;
        data: any;
    };
    /**
     * 设置公共属性
     * 设置后CP无需每次上报都传，由SDK填入properties中。
     */
    setPublicProperties(params: {
        [key: string]: any;
    }): {
        code: any;
        msg: any;
        thirdcode: any;
        thirdmsg: any;
    } | {
        code: number;
    };
    /**
     * 修改设置的公共数据。
     */
    updatePublicProperties(params: {
        [key: string]: any;
    }): {
        code: any;
        msg: any;
        thirdcode: any;
        thirdmsg: any;
    } | {
        code: number;
    };
    /**
     * 删除公共属性
     */
    deletePublicProperties(params: string[]): {
        code: any;
        msg: any;
        thirdcode: any;
        thirdmsg: any;
    } | {
        code: number;
    };
    private getInitConfig;
    private publicSubchannelCheck;
    private getAttributionData;
    private checkNeedActivate;
    private getLoginQsAndGenerateStruct;
    private ActivePrefix;
    /**
     * 用于设置子渠道，通行证记录来源（分包）、子渠道参数
     */
    private setSubChannelId;
}
export default SdkH5Ruixue;
