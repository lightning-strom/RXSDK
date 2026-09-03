// @keepTs
// @ts-nocheck
import { p13, o13 } from "./t1";
import { o2 } from "./u";
import { OpCallback, OpData } from "../e";
export declare class c1 extends o13 {
    private n10;
    private callback;
    constructor(s13: number, callback: OpCallback<OpData>);
    protected o10(): Promise<p13>;
    protected q10(result: string): void;
    protected r10(error: o2): void;
}
