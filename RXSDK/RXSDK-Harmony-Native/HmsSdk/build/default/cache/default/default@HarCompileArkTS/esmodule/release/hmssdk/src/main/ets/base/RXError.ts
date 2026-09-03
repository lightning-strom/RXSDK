import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
export class RXError extends Error implements RXResult {
    code: number;
    msg?: string;
    thirdcode?: any;
    thirdmsg?: string;
    constructor(i25?: any, j25?: number, k25?: any, l25?: string) {
        if (typeof i25 == 'object') {
        }
        super(i25);
        this.code = j25 || RXErrorCode.UNKNOWN_ERROR;
        this.name = 'RXError';
        this.message = i25 ? i25 : l25 ? l25 : 'Unknown error occurred';
        this.msg = this.message;
        this.thirdcode = k25;
        this.thirdmsg = l25;
        Object.setPrototypeOf(this, RXError.prototype);
    }
}
