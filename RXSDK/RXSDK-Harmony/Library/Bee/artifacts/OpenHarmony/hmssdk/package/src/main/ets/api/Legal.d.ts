import { RCallback } from '../types/Index';
declare class Legal {
    legal(o1?: RCallback): Promise<import("../types/Index").RXResult<object>>;
    legalTerms(m1: {
        product_id?: string;
        channel_id?: string;
        keys?: string;
        position?: string;
    }, n1?: RCallback): Promise<import("../types/Index").RXResult<object>>;
}
declare const _default: Legal;
export default _default;
