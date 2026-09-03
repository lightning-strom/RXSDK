import { RXResult } from "../types/Index";
declare class Push {
    get brandName(): string;
    reportNotifyStatus(g2: string, h2: string, i2: number): Promise<RXResult>;
    addTags(f2: string[]): Promise<RXResult>;
    delTags(e2: string[]): Promise<RXResult>;
    bindAlias(d2: string): Promise<RXResult>;
    unbindDevice(c2: string): Promise<RXResult>;
    bindDevice(b2: string): Promise<RXResult>;
}
declare const _default: Push;
export default _default;
