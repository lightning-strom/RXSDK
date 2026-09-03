declare class SdkHelpCenter {
    static instance: SdkHelpCenter;
    static get I(): SdkHelpCenter;
    getHelpcenterMainLayout({ complete }: H5MethodParams): Promise<void>;
    getHelpcenterQuestionLayout(params: HelpcenterQuestionReq, { complete }: H5MethodParams): Promise<void>;
    getHelpcenterInfoLayout(params: H5HelpcenterQuestionReq, { complete }: H5MethodParams): Promise<void>;
    helpcenterResolution(params: H5HelpcenterResolution, { complete }: H5MethodParams): Promise<void>;
}
export default SdkHelpCenter;
