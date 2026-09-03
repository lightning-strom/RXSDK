import SdkFeedback from './index.feedback';
declare class SdkCommon {
    static get feedback(): SdkFeedback;
    constructor(initParams: ISdkInitParams);
    sendCaptcha(params: IsendCaptcha, callback: IMethodParams): Promise<void>;
    bindPhone(params: IBindPhone, callback: IMethodParams): Promise<void>;
    unBindPhone(params: IunBindPhone, callback: IMethodParams): Promise<void>;
    bindEmail(params: IBindEmail, callback: IMethodParams): Promise<void>;
    UnbindEmail(params: IunBindEmail, callback: IMethodParams): Promise<void>;
    deregister(params: any, callback: IMethodParams): Promise<void>;
    deregisterCancel(CPcallback: IMethodParams): Promise<void>;
    getInfo(CPcallback: IMethodParams): Promise<void>;
    getUserInfoByField(params: any, callback: IMethodParams): Promise<void>;
    updateInfo(params: any, callback: IMethodParams): Promise<void>;
    checkAppVersion(params: ICheckAppVersion, callback: IMethodParams): Promise<void>;
    checkVersion(params: ICheckVersion, callback: IMethodParams): Promise<void>;
    checkGameVersion(params: ICheckGameVersion, callback: IMethodParams): Promise<void>;
    checkActivityVersion(params: ICheckActivityVersion, callback: IMethodParams): Promise<void>;
    getFeedbackKindList(callback: IMethodParams): Promise<void>;
    createFeedback(params: IReqCreateFeedback, callback: IMethodParams): Promise<void>;
    satisfactionEvaluation(params: IReqFeedbackEval, callback: IMethodParams): Promise<void>;
    getTempNotice(callback: IMethodParams): Promise<void>;
    getH5LoginConfig(callback: IMethodParams): Promise<void>;
    tradeQuery(params: any, callback: IMethodParams): Promise<void>;
}
export default SdkCommon;
