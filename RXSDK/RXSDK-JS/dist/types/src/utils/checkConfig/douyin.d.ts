import { InternalRuleItem, Rules } from '@/utils/async-validator';
export declare const PubCallBack: {
    complete: {
        require: boolean;
        asyncValidator: (rule: InternalRuleItem, value: any) => Promise<any>;
    };
};
export declare const initParamsCheck: Rules;
export declare const douyinLoginParamsCheck: Rules;
export declare const douyinPayCheckParams: Rules;
export declare const serviceCheckParams: Rules;
export declare const checkTrackParams: Rules;
export declare function ThrowError(errors: any, isJoin?: Boolean): string | undefined;
export declare function pubCheck(paramsCheck: any, callback: IMethodParams, params: any): Promise<unknown>;
