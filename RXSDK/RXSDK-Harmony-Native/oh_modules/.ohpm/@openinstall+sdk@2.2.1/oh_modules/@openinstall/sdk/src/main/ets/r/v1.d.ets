// @keepTs
// @ts-nocheck
import { Storage } from "./u1";
export declare class k12 implements Storage {
    private i9;
    private q9;
    save(key: string, s12: string): Promise<boolean>;
    r9(key: string, r12: string): boolean;
    get(key: string): Promise<string>;
    getSync(key: string): string;
}
