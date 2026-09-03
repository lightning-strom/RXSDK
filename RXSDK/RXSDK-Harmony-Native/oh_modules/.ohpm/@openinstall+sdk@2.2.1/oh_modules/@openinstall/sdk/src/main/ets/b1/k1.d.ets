// @keepTs
// @ts-nocheck
import { o9 } from "./c1";
declare class i10 {
    private k8;
    private l8;
    private q8;
    init(o10: Map<string, string>): Promise<o9>;
    getWakeUp(params: Map<string, string>): Promise<o9>;
    reportShare(params: Map<string, string>): Promise<o9>;
    s8(params: Map<string, string>): Promise<o9>;
    h7(content: string): Promise<o9>;
    getUrl(host: string, path: string): string;
    post(url: string, extraData: string, l10: boolean): Promise<o9>;
    r8(j10: Map<string, string>): string;
}
declare const l15: i10;
export default l15;
