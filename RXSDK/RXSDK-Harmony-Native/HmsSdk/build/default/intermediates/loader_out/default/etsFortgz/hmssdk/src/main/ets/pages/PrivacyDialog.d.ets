// @keepTs
// @ts-nocheck
import { RCallback } from '../types/Index';
import { BaseDialog } from './BaseDialog';
import { PrivacyParams } from './PrivacyBuilder';
export declare class PrivacyDialog extends BaseDialog<PrivacyParams> {
    private _key?;
    private _key_list?;
    setKeyData(b124: string[], c124: string): this;
    static getInstance(a124: UIContext): PrivacyDialog;
    show(y123?: RCallback | undefined): this;
}
