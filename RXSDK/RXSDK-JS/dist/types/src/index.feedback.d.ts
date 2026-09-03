declare class SdkFeedback {
    static instance: SdkFeedback;
    static get I(): SdkFeedback;
    getFeedbackKindList({ complete }: IMethodParams): Promise<void>;
    createFeedback(params: IReqCreateFeedback, { complete }: IMethodParams): Promise<void>;
    satisfactionEvaluation(params: IReqFeedbackEval, { complete }: IMethodParams): Promise<void>;
}
export default SdkFeedback;
