declare class SdkHelpcenter {
    static instance: SdkHelpcenter;
    static get I(): SdkHelpcenter;
    getHelpcenterMainLayout({ complete }: IMethodParams): Promise<void>;
    getHelpcenterQuestionLayout(params: HelpcenterQuestionReq, { complete }: IMethodParams): Promise<void>;
    getHelpcenterInfoLayout(params: HelpcenterQuestionReq, { complete }: IMethodParams): Promise<void>;
    helpcenterResolution(params: HelpcenterResolution, { complete }: IMethodParams): Promise<void>;
}
export default SdkHelpcenter;
