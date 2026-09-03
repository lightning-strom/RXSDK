import { RXErrorCode, RXResult } from "../types/Index";

export class RXError extends Error implements RXResult {
  code: number
  msg?: string
  thirdcode?: any
  thirdmsg?: string

  constructor(message?: any, code?: number, thirdCode?: any, thirdMsg?: string) {
    if (typeof message == 'object') {

    }
    super(message);
    this.code = code || RXErrorCode.UNKNOWN_ERROR;
    this.name = 'RXError';
    this.message = message ? message : thirdMsg ? thirdMsg : 'Unknown error occurred';
    this.msg = this.message;
    this.thirdcode = thirdCode;
    this.thirdmsg = thirdMsg;
    Object.setPrototypeOf(this, RXError.prototype);
  }
}
