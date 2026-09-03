// @keepTs
// @ts-nocheck
import common from '@ohos.app.ability.common';
import { k6 } from "./h1";
export declare class u6 {
    private k7;
    private uploadFile;
    private l7;
    private m7;
    constructor(context: common.Context, fileName: string);
    isEmpty(): boolean;
    append(event: k6): Promise<void>;
    j7(): Promise<void>;
    g7(): Promise<string>;
    count(content: string): number;
    n7(src: string, maxSize: number): number;
    string(event: k6): string;
}
