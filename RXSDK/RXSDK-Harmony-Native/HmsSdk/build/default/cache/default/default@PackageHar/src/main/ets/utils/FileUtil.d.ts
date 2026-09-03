import common from "@ohos.app.ability.common";
import { Context } from "@ohos.abilityAccessCtrl";
import { ListFileOptions as lfo } from "@ohos.file.fs";
interface FileInfo {
    path: string;
    hash?: string;
}
interface ListFileOptions extends lfo {
}
export declare class FileUtil {
    private static readonly mimeToExtMap;
    private static readonly extToMimeMap;
    static getPhotoAssets(m187: Context, n187: string): Promise<ArrayBuffer>;
    static writeFileSync(g187: string, h187: string | ArrayBuffer): void;
    static getFileName(e187: string): string;
    /**
     * 获取文件路径中的扩展名
     * @param filePath - 文件路径
     * @returns 文件扩展名（包含点，如 ".txt"；如果没有扩展名则返回空字符串）
     */
    static getFileExtensionFromPath(b187: string, c187?: boolean): string;
    /**
     * 根据 MIME 类型获取扩展名
     * @param mimeType - MIME 类型，例如 "image/jpeg"
     * @param defaultExt - 未匹配时的默认扩展名，默认为空字符串
     * @returns 对应的扩展名或默认值
     */
    static mimeToExtension(z186: string, a187?: string): string;
    /**
     * 根据扩展名获取 MIME 类型
     * @param extension - 文件扩展名，例如 "jpg"
     * @param defaultMime - 未匹配时的默认 MIME 类型，默认为 "application/octet-stream"
     * @returns 对应的 MIME 类型或默认值
     */
    static extensionToMime(x186: string, y186?: string): string;
    static getUriFromPath(w186: string): string;
    /**
     * 获取图片扩展名
     * @param filePathOrBuffer - 文件路径或图片数据的 ArrayBuffer
     * @param includeDot - 是否包含点，默认为 true
     * @returns 图片扩展名字符串（如 '.jpg'、'png'）或 `null`（无法识别）
     */
    static getFileExtension(o186: string | ArrayBuffer, p186?: boolean): string | null;
    static access(n186: string): boolean;
    static isExists(m186: string): boolean;
    static getFileSize(i186: string): number;
    static readFileInChunks(w185: string, x185: number): ArrayBuffer[];
    getSandboxDirectoryPath(v185: Context): string;
    getCacheDirectoryPath(u185: Context): string;
    static readFile(r185: Context, s185: string): Promise<ArrayBuffer>;
    static readFileSync(j185: string): ArrayBuffer;
    static deleteFile(h185: string): Promise<void>;
    static isRawDir(f185: common.UIAbilityContext, g185: any): boolean;
    static dirname(a185: string): string;
    static isDirectory(x184: string): boolean;
    static extractRawFiles(r184: common.UIAbilityContext, s184: string, t184?: string): void;
    static copyWholeDirInRawFileIterate(e184: common.UIAbilityContext, f184: string, g184?: string): void;
    static isAbsoluteSandboxPath(b184: string, c184?: common.UIAbilityContext): boolean;
    static copySingleFileFromRawToSandbox(t183: common.UIAbilityContext, u183: string, v183?: string): void;
    static makeDir(r183: string, s183?: boolean): void;
    static getFileList(p183: string, q183?: ListFileOptions): string[];
    static getFileListWithHash(g183: string, h183?: ListFileOptions, i183?: string): Promise<FileInfo[]>;
    static calcFileHash(d183: string, e183?: string): Promise<string>;
    static copyDir(t182: string, u182: string, v182?: number): void;
}
export {};
