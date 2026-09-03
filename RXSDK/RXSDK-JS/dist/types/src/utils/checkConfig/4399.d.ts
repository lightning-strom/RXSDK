import { InternalRuleItem, Rules } from '@/utils/async-validator';
export declare const PubCallBack: {
    complete: {
        require: boolean;
        asyncValidator: (rule: InternalRuleItem, value: any) => Promise<any>;
    };
};
export declare const m4399PayCheckParams: Rules;
export declare const initParamsCheck: Rules;
export declare const m4399LoginParamsCheck: Rules;
export declare const checkTrackParams: Rules;
export declare function ThrowError(errors: any, isJoin?: Boolean): string | undefined;
export declare const compensateOrderCheckParams: Rules;
export declare const m4399ShareScheduleInitParams: Rules;
export declare const m4399ShareScheduleReportParams: Rules;
export declare function pubCheck(paramsCheck: any, callback: IMethodParams, params: any): Promise<unknown>;
