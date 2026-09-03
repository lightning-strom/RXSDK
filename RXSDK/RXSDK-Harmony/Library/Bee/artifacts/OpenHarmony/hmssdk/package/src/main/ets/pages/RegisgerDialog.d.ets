// @keepTs
// @ts-nocheck
import { RCallback } from '../types/Index';
import { BaseDialog } from './BaseDialog';
import { RegisterParams } from './RegisterBuilder';
export declare class RegisterDialog extends BaseDialog<RegisterParams> {
    static getInstance(c130: UIContext): RegisterDialog;
    show(w129?: RCallback | undefined): this;
}
