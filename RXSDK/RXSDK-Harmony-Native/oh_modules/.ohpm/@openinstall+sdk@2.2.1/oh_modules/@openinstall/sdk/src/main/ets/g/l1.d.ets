// @keepTs
// @ts-nocheck
export declare class w7 {
    static read(filePath: string): Promise<string>;
    static write(filePath: string, content: string, append: boolean): Promise<void>;
}
