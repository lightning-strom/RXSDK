// @keepTs
// @ts-nocheck
import { RCallback } from '../types/Index';
import { BaseDialog } from './BaseDialog';
import { CaptchaVerifyParams } from './CaptchaVerifyBuilder';
export declare class CaptchaVerifyDialog extends BaseDialog<CaptchaVerifyParams, object> {
    appid: string;
    setAppid(c73: string): this;
    static getInstance(b73: UIContext): CaptchaVerifyDialog;
    show(y72?: RCallback): Promise<this>;
}
