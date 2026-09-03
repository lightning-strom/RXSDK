declare global {
    var AppleID: any;
}
declare class SdkH5Oversea {
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
    constructor(initParams: InitOverseaH5Params);
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
    private checkInstagramRedirect;
    private login;
    getShareScheduling(params: {
        funcs?: string[];
    }): {
        code: any;
        msg: any;
        thirdcode: any;
        thirdmsg: any;
    } | {
        code: number;
        data: any;
    };
    shareSchedulingInit(params: H5ReqShareScheduleInit, callback: H5MethodParams): Promise<void>;
    shareSchedulingReport(params: H5ReqShareScheduleReport, callback: H5MethodParams): Promise<void>;
    getShareData(params: H5getShareData & {
        platform: string;
    }, callback: H5MethodParams, stopCallback?: boolean): Promise<any>;
    shareTo(platform: string, params: {
        title: string;
        description: string;
        image: string;
    }): void;
    private facebookInit;
    private googleInit;
    share(params: H5OverseaShareParams, callback: IMethodParams): Promise<void>;
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
    /**
     * 轮训获取公共属性
     *
     */
    private loopGetPublicProps;
    private getLoginQsAndGenerateStruct;
    private ActivePrefix;
    /**
     * 用于设置子渠道，通行证记录来源（分包）、子渠道参数
     */
    private setSubChannelId;
}

export { SdkH5Oversea as default };
