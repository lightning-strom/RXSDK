import SdkCommon from '@/h5/SdkCommon';

declare global {
    var qg: any;
}
declare class SdkH5Ruixue extends SdkCommon {
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
    private initConfig;
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
     * 检测是否是微信浏览器
     */
    private isWeChatBrowser;
    private isMobileWechat;
    private isMobile;
    private checkOrientation;
    private getIframeSrc;
    private getInitParams;
    private createModalIframe;
    private realName;
    private forgetPassword;
    private resetPassword;
    private logoff;
    private game_user_id;
    private theme;
    private openHelpCenter;
    private openService;
    private h5Login;
    /**
     * H5瑞雪登录方法
     * @param params 登录参数
     * @param callback 可选回调函数
     */
    private login;
    /**
     * H5瑞雪支付方法
     * @param params 支付参数
     * @param callback 可选回调函数
     */
    pay(params: H5RUIXUEPayParam, callback: H5MethodParams): Promise<void>;
    share(callback: IMethodParams): Promise<void>;
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

export { SdkH5Ruixue as default };
