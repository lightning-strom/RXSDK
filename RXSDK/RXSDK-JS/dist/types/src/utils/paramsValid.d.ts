import { Rules, Values } from '@/utils/async-validator';
export declare function checkParamsValid(rules: Rules, checkValue: {
    [key: string]: any;
}): Promise<Values>;
export declare function invalidInitParams(params: {
    [key: string]: any;
}, rules: Rules): void;
export declare function ThrowError(errors: any, isJoin?: Boolean): string | undefined;
export declare function pubCheck(paramsCheck: any, callback: IMethodParams, params: any): Promise<unknown>;
