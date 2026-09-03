// @keepTs
// @ts-nocheck
import { Storage } from "./u1";
export declare class v12 implements Storage {
    save(key: string, x12: string): Promise<boolean>;
    r9(key: string, w12: string): boolean;
    get(key: string): Promise<string>;
    getSync(key: string): string;
}
