import SdkCommon from './SdkCommon';
declare class SDKUI extends SdkCommon {
    constructor(platform: string);
    initConfig: any;
    /**
     * 检测是否是微信浏览器
     */
    isWeChatBrowser(): boolean;
    isMobileWechat(): boolean;
    private orientation;
    private isMobile;
    private checkOrientation;
    private getIframeSrc;
    private getInitParams;
    createModalIframe(params: {
        path: string;
        base?: string;
        initParams?: any;
        loginParams?: any;
        backgroundColor?: string;
        theme?: string;
        game_user_id?: string;
        protocol?: any;
    }): Promise<any>;
    openAgreement(params: {
        agreementKey: string;
        agreementTitle: string;
    }): Promise<any>;
    openProtocol(params: {
        protocol: any;
    }): Promise<any>;
    openPay(params: {
        url: string;
        hq_type?: string;
        pay_type?: string;
    }): Promise<any>;
    private game_user_id;
    private theme;
    openHelpCenter(params: {
        theme?: string;
        game_user_id?: string;
    }): Promise<any>;
    openService(params: {
        from_application?: string;
        theme?: string;
        game_user_id?: string;
        default_lang?: string;
    }): Promise<any>;
    h5Login(loginParams: any): Promise<any>;
    realName(callback?: H5MethodParams): Promise<any>;
    forgetPassword(callback?: H5MethodParams): Promise<any>;
    resetPassword(callback?: H5MethodParams): Promise<any>;
    logoffH5Preview(callback?: H5MethodParams): Promise<any>;
    logoff(callback?: H5MethodParams): Promise<any>;
}
export default SDKUI;
