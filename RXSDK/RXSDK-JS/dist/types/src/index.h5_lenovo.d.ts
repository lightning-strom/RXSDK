import SdkCommon from './h5/SdkCommon';
declare global {
    var lenovocp: any;
}
declare class SdkH5Lenovo extends SdkCommon {
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
    private mandatoryParams;
    private optionalParams;
    private initUrlParams;
    constructor(initParams: InitH5Params);
    private openId;
    private login;
    pay(params: H5LenovoPayParam, callback: H5MethodParams): Promise<void>;
    schedulingAction(params: any, callback: H5MethodParams): Promise<void>;
    getAdShareData(params: H5getShareData, callback?: H5MethodParams): Promise<any>;
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
    getShareData(params: H5getShareData, callback: H5MethodParams, stopCallback?: boolean): Promise<any>;
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
    private loadScript;
    getAllBusinessData(callback: H5MethodParams): Promise<void>;
    getBusinessData(params: H5ReqBusinessData, callback: H5MethodParams): Promise<void>;
    refreshBusinessData(callback?: H5MethodParams, isRecord?: boolean): Promise<void>;
    private dispatchBusinessWindowsQueue;
    requestBusinessOrder(params: H5ReqBusinessOrder, callback: H5MethodParams): Promise<void>;
    private clearPromoterTimer;
    private startPromoterTimer;
    private getPromoDisplayKEY;
    private exchangePromoCDKEY;
    private checkIsPromoter;
}
export default SdkH5Lenovo;
