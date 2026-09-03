// @keepTs
// @ts-nocheck
import { o2 } from "./u";
import { p13, o13 } from "./t1";
import { OpCallback } from "../e";
export declare class g1 extends o13 {
    private readonly b11;
    private readonly c11;
    private readonly callback;
    constructor(c15: string, d15: string, callback: OpCallback<void>);
    reportShare(): Promise<p13>;
    protected o10(): Promise<p13>;
    protected q10(result: string): void;
    protected r10(error: o2): void;
}
