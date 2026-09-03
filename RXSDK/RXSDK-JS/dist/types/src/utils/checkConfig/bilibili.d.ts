import { InternalRuleItem, Rules } from '@/utils/async-validator';
export declare const PubCallBack: {
    complete: {
        require: boolean;
        asyncValidator: (rule: InternalRuleItem, value: any) => Promise<any>;
    };
};
export declare const bilibiliPayCheckParams: Rules;
export declare const initParamsCheck: Rules;
export declare const bilibiliLoginParamsCheck: Rules;
export declare const checkTrackParams: Rules;
export declare function ThrowError(errors: any, isJoin?: Boolean): string | undefined;
export declare const compensateOrderCheckParams: Rules;
export declare const bilibiliShareScheduleInitParams: Rules;
export declare const bilibiliShareScheduleReportParams: Rules;
export declare const bilibiliShareCheckParams: Rules;
export declare function pubCheck(paramsCheck: any, callback: IMethodParams, params: any): Promise<unknown>;
