// @keepTs
// @ts-nocheck
import { RealNameResult, Reward, RXCallback, RXResult } from '../types/Index';
import { RealNameParams } from './RealNameBuilder';
import { BaseDialog } from './BaseDialog';
export declare class RealNameDialog extends BaseDialog<RealNameParams, RealNameResult> {
    private _props?;
    get props(): Reward[] | undefined;
    setProps(v129: Reward[] | undefined): this;
    static getInstance(u129: UIContext): RealNameDialog;
    show(o129?: RXCallback<RXResult<RealNameResult>> | undefined): this;
    onClose(): void;
    private commitRealName;
    private commitAlipayRealName;
    private handleRealNameResult;
    private registerIifaaValidateCallback;
    private getIifaaThirdPartSchema;
}
