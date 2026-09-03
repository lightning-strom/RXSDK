// @keepTs
// @ts-nocheck
export interface Storage {
    save(key: string, installId: string): Promise<boolean>;
    r9(key: string, installId: string): boolean;
    get(key: string): Promise<string>;
    getSync(key: string): string;
}
