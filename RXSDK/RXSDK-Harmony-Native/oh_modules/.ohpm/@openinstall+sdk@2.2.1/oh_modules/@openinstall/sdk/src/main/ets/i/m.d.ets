// @keepTs
// @ts-nocheck
import { p13, o13 } from "./t1";
import { o2 } from "./u";
import { OpCallback, OpData } from "../e";
export declare class f1 extends o13 {
    private u10;
    private v10;
    private callback;
    constructor(h14: Nullable<string>, callback: OpCallback<OpData>);
    w10(): Promise<p13>;
    protected o10(): Promise<p13>;
    protected q10(result: string): void;
    protected r10(error: o2): void;
    s8(y13: Nullable<string>): void;
}
