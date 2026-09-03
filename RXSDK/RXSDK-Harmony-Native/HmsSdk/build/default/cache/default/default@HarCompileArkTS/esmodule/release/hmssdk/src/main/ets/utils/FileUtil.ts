import util from "@ohos:util";
import photoAccessHelper from "@ohos:file.photoAccessHelper";
import type common from "@ohos:app.ability.common";
import type { Context } from "@ohos:abilityAccessCtrl";
import dataSharePredicates from "@ohos:data.dataSharePredicates";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import type { BusinessError } from "@ohos:base";
import fileIo from "@ohos:file.fs";
import fileUri from "@ohos:file.fileuri";
import hash from "@ohos:file.hash";
import type { ReadOptions } from "@ohos:file.fs";
import type { ListFileOptions as lfo } from "@ohos:file.fs";
import fs from "@ohos:file.fs";
import PathUtil from "@normalized:N&&&hmssdk/src/main/ets/utils/PathUtil&4.0.0";
interface FileInfo {
    path: string;
    hash?: string;
}
interface ListFileOptions extends lfo {
}
class MediaDataHandler implements photoAccessHelper.MediaAssetDataHandler<ArrayBuffer> {
    private callback: (data?: ArrayBuffer) => void;
    constructor(b188: (data?: ArrayBuffer) => void) {
        this.callback = b188;
        this.onDataPrepared = this.onDataPrepared.bind(this);
    }
    onDataPrepared(a188: ArrayBuffer) {
        this.callback?.(a188);
    }
}
export class FileUtil {
    private static readonly mimeToExtMap: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/webp": "webp",
        "image/svg+xml": "svg",
        "image/bmp": "bmp",
        "image/tiff": "tiff",
        "image/vnd.microsoft.icon": "ico",
    };
    private static readonly extToMimeMap: Record<string, string> = {
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "gif": "image/gif",
        "webp": "image/webp",
        "svg": "image/svg+xml",
        "bmp": "image/bmp",
        "tiff": "image/tiff",
        "ico": "image/vnd.microsoft.icon",
    };
    static async getPhotoAssets(m187: Context, n187: string): Promise<ArrayBuffer> {
        let o187 = photoAccessHelper.getPhotoAccessHelper(m187);
        let p187: dataSharePredicates.DataSharePredicates = new dataSharePredicates.DataSharePredicates();
        p187.equalTo(photoAccessHelper.PhotoKeys.URI, n187.toString());
        let q187: photoAccessHelper.FetchOptions = {
            fetchColumns: [photoAccessHelper.PhotoKeys.TITLE],
            predicates: p187
        };
        try {
            let s187: photoAccessHelper.FetchResult<photoAccessHelper.PhotoAsset> = await o187.getAssets(q187);
            let t187: photoAccessHelper.PhotoAsset = await s187.getFirstObject();
            Logger.d('getAssets photoAsset.uri : ' + t187.uri);
            let u187: photoAccessHelper.RequestOptions = {
                deliveryMode: photoAccessHelper.DeliveryMode.HIGH_QUALITY_MODE,
            };
            let v187: ArrayBuffer = await new Promise<ArrayBuffer>((w187, x187) => {
                let y187 = photoAccessHelper.MediaAssetManager.requestImageData(m187, t187, u187, new MediaDataHandler((z187) => {
                    Logger.d(`${n187} : ${z187?.byteLength}`);
                    w187(z187);
                }));
            });
            Logger.d('requestImageData successfully');
            s187.close();
            return v187;
        }
        catch (r187) {
            Logger.error('getAssets failed with err: ' + r187);
        }
        return;
    }
    static writeFileSync(g187: string, h187: string | ArrayBuffer): void {
        let i187;
        try {
            i187 = fileIo.openSync(g187, fileIo.OpenMode.READ_WRITE | fileIo.OpenMode.CREATE);
            let k187: ArrayBuffer;
            if (typeof h187 === 'string') {
                k187 = new util.TextEncoder().encodeInto(h187).buffer;
            }
            else if (h187 instanceof ArrayBuffer) {
                k187 = h187;
            }
            else {
                throw new Error('Unsupported content type');
            }
            let l187 = fileIo.writeSync(i187.fd, k187);
            Logger.d(`written ${g187} content size ${l187}`);
        }
        catch (j187) {
            Logger.error("Error while creating or writing to the file:", j187);
        }
        finally {
            if (i187) {
                fileIo.closeSync(i187);
            }
        }
    }
    public static getFileName(e187: string): string {
        if (!e187) {
            return '';
        }
        const f187 = e187?.match(/([^\\/]+)$/);
        return f187 ? f187[0] : '';
    }
    public static getFileExtensionFromPath(b187: string, c187: boolean = true): string {
        if (!b187) {
            return '';
        }
        const d187 = b187.match(/\.([^./\\]+)$/);
        if (d187) {
            return c187 ? `.${d187[1]}` : d187[1];
        }
        return '';
    }
    public static mimeToExtension(z186: string, a187: string = ""): string {
        return this.mimeToExtMap[z186.toLowerCase()] || a187;
    }
    public static extensionToMime(x186: string, y186: string = "application/octet-stream"): string {
        this.getFileExtension(x186);
        return this.extToMimeMap[x186.toLowerCase()] || y186;
    }
    public static getUriFromPath(w186: string): string {
        return fileUri.getUriFromPath(w186);
    }
    public static getFileExtension(o186: string | ArrayBuffer, p186: boolean = true): string | null {
        if (typeof o186 === 'string') {
            const v186 = this.getFileExtensionFromPath(o186, false);
            return v186 ? (p186 ? `.${v186}` : v186) : null;
        }
        else if (o186 instanceof ArrayBuffer) {
            if (!o186 || o186.byteLength < 4) {
                return null;
            }
            const q186 = new Uint8Array(o186);
            const r186 = q186.slice(0, 4).join(' ');
            const s186: {
                [key: string]: string;
            } = {
                '255 216 255': 'jpg',
                '137 80 78 71': 'png',
                '71 73 70 56': 'gif',
                '66 77': 'bmp',
                '73 73 42 0': 'tiff',
                '77 77 0 42': 'tiff',
                '0 0 1 0': 'ico',
                '82 73 70 70': 'webp',
                '239 187 191': 'txt',
                '80 75 3 4': 'zip',
                '80 75 5 6': 'zip',
                '80 75 7 8': 'zip',
                '77 90': 'exe',
                '70 75 83 116': 'epub',
                '79 76 73 70': 'mp4',
                '73 116 97 108': '3gp',
                '82 97 114 33': 'rar',
                '79 103 103 83': 'ogg',
                '37 80 68 70': 'pdf',
                '255 251': 'mp3',
            };
            let t186 = s186[r186] || null;
            if (t186 === 'webp') {
                const u186 = q186.slice(8, 12).join(' ');
                if (u186 !== '87 69 66 70') {
                    t186 = null;
                }
            }
            return p186 ? `.${t186}` : t186;
        }
        return null;
    }
    public static access(n186: string): boolean {
        if (n186) {
            return fileIo.accessSync(n186);
        }
        else {
            false;
        }
    }
    public static isExists(m186: string): boolean {
        return this.access(m186);
    }
    public static getFileSize(i186: string): number {
        let j186;
        try {
            j186 = fileIo.statSync(i186);
        }
        catch (l186) {
            Logger.error("Error fetching file stats: ", l186);
            return -1;
        }
        let k186 = j186.size;
        return k186;
    }
    public static readFileInChunks(w185: string, x185: number): ArrayBuffer[] {
        let y185 = this.getFileSize(w185);
        if (y185 <= 0) {
            return [];
        }
        let z185;
        try {
            z185 = fileIo.openSync(w185, fileIo.OpenMode.READ_ONLY);
        }
        catch (h186) {
            Logger.error("Error opening file: ", h186);
            return [];
        }
        let a186: ArrayBuffer[] = [];
        try {
            let c186 = 0;
            while (c186 < y185) {
                let d186 = y185 - c186;
                let e186 = Math.min(x185, d186);
                let f186 = new ArrayBuffer(e186);
                let g186 = fileIo.readSync(z185.fd, f186, {
                    offset: c186, length: e186
                });
                if (g186 > 0) {
                    a186.push(f186);
                    c186 += g186;
                }
                else {
                    break;
                }
            }
            return a186;
        }
        catch (b186) {
            Logger.error("Error reading file: ", b186);
            return [];
        }
        finally {
            if (z185) {
                fileIo.closeSync(z185);
            }
        }
    }
    getSandboxDirectoryPath(v185: Context) {
        return v185.filesDir;
    }
    getCacheDirectoryPath(u185: Context) {
        return u185.cacheDir;
    }
    public static async readFile(r185: Context, s185: string): Promise<ArrayBuffer> {
        let t185: ArrayBuffer;
        if (s185.startsWith("file://")) {
            t185 = await FileUtil.getPhotoAssets(r185, s185);
        }
        else {
            t185 = FileUtil.readFileSync(s185);
        }
        return t185;
    }
    public static readFileSync(j185: string): ArrayBuffer {
        let k185 = this.getFileSize(j185);
        if (k185 <= 0) {
            Logger.error("File size is invalid or empty.");
            return;
        }
        let l185 = new ArrayBuffer(k185);
        let m185;
        try {
            m185 = fileIo.openSync(j185, fileIo.OpenMode.READ_ONLY);
        }
        catch (q185) {
            Logger.error("Error opening file: ", q185);
            return new ArrayBuffer(0);
        }
        try {
            let o185: ReadOptions = {
                length: l185.byteLength
            };
            let p185 = fileIo.readSync(m185.fd, l185, o185);
            if (p185 < k185) {
                l185 = l185.slice(0, p185);
            }
            return l185;
        }
        catch (n185) {
            Logger.error("Error reading file: ", n185);
            return new ArrayBuffer(0);
        }
        finally {
            if (m185) {
                fileIo.closeSync(m185);
            }
        }
    }
    static async deleteFile(h185: string) {
        const i185 = await fileIo.stat(h185);
        if (i185.isDirectory()) {
            fileIo.rmdirSync(h185);
        }
        else {
            fileIo.unlinkSync(h185);
        }
    }
    public static isRawDir(f185: common.UIAbilityContext, g185) {
        try {
            if (!g185 || g185.trim() === "") {
                return true;
            }
            else {
                return f185.resourceManager.isRawDir(g185);
            }
        }
        catch {
            return false;
        }
    }
    static dirname(a185: string): string {
        const b185 = a185.replace(/\\/g, '/');
        const c185 = b185.replace(/\/+$/, '');
        const d185 = c185.lastIndexOf('/');
        if (d185 === -1) {
            return '.';
        }
        const e185 = c185.substring(0, d185);
        return e185 === '' ? (b185.startsWith('/') ? '/' : '.') : e185;
    }
    static isDirectory(x184: string): boolean {
        try {
            const z184 = fs.statSync(x184);
            return z184.isDirectory();
        }
        catch (y184) {
            Logger.e(y184);
            return false;
        }
    }
    public static extractRawFiles(r184: common.UIAbilityContext, s184: string, t184?: string) {
        t184 ??= r184.filesDir;
        try {
            if (!this.isRawDir(r184, s184)) {
                this.copySingleFileFromRawToSandbox(r184, s184, t184);
                return;
            }
            else {
                this.copyWholeDirInRawFileIterate(r184, s184, t184);
            }
        }
        catch (u184) {
            let v184 = (u184 as BusinessError).code;
            let w184 = (u184 as BusinessError).message;
            Logger.error(`ExtractRawFiles failed, error code: ${v184}, message: ${w184}.`);
        }
    }
    public static copyWholeDirInRawFileIterate(e184: common.UIAbilityContext, f184: string, g184?: string) {
        if (e184 == null) {
            return;
        }
        g184 ??= e184.filesDir;
        let h184 = e184.resourceManager;
        try {
            let l184: Array<string> = h184.getRawFileListSync(f184);
            for (let m184 of l184) {
                let n184 = false;
                let o184 = (!f184 || f184 == "") ? "" : f184;
                let p184 = (!f184 || f184 == "") ? m184 : o184 + '/' + m184;
                let q184 = g184 + '/' + m184;
                n184 = h184.isRawDir(p184);
                if (n184) {
                    if (!fileIo.accessSync(q184)) {
                        this.makeDir(q184);
                    }
                    this.copyWholeDirInRawFileIterate(e184, p184, q184);
                }
                else {
                    this.copySingleFileFromRawToSandbox(e184, p184, q184);
                }
            }
        }
        catch (i184) {
            let j184 = (i184 as BusinessError).code;
            let k184 = (i184 as BusinessError).message;
            Logger.error(`this.CopyWholeDirInRawFileIterate failed, error code: ${j184}, message: ${k184}.`);
        }
    }
    static isAbsoluteSandboxPath(b184: string, c184?: common.UIAbilityContext) {
        if (!b184) {
            return false;
        }
        const d184 = c184?.filesDir
            ? c184.filesDir.split('/').slice(0, -1).join('/')
            : "/data/storage/el2/base/haps/entry";
        return b184.startsWith(d184);
    }
    public static copySingleFileFromRawToSandbox(t183: common.UIAbilityContext, u183: string, v183?: string) {
        let w183 = this.isAbsoluteSandboxPath(v183) ? v183 : t183.filesDir + v183 + u183;
        let x183 = this.dirname(w183);
        if (!fileIo.accessSync(x183)) {
            this.makeDir(x183);
        }
        let y183 = t183.resourceManager.getRawFileContentSync(u183);
        if (fileIo.accessSync(v183)) {
            fileIo.unlinkSync(v183);
        }
        let z183 = fileIo.openSync(w183, fileIo.OpenMode.READ_WRITE | fileIo.OpenMode.CREATE);
        let a184 = fileIo.writeSync(z183.fd, y183.buffer);
        Logger.d(`write ${u183} to ${v183} succeed and size is:` + a184);
        fileIo.closeSync(z183);
    }
    public static makeDir(r183: string, s183: boolean = true) {
        fileIo.mkdirSync(r183, s183);
    }
    public static getFileList(p183: string, q183?: ListFileOptions): string[] {
        Logger.d(p183);
        q183 ??= {
            recursion: true,
        };
        return fileIo.listFileSync(p183, q183);
    }
    public static async getFileListWithHash(g183: string, h183?: ListFileOptions, i183?: string): Promise<FileInfo[]> {
        h183 ??= {
            recursion: true,
        };
        const j183 = fileIo.listFileSync(g183, h183);
        const k183 = j183.map(async (m183) => {
            const n183 = `${g183}/${m183}`;
            const o183 = fileIo.statSync(n183);
            if (!o183.isDirectory()) {
                return {
                    path: m183,
                    hash: await this.calcFileHash(n183, i183)
                };
            }
            return null;
        });
        const l183 = (await Promise.all(k183)).filter(Boolean) as FileInfo[];
        return l183;
    }
    public static async calcFileHash(d183: string, e183?: string): Promise<string> {
        let f183 = await hash.hash(d183, e183 ?? "sha1");
        return f183;
    }
    public static copyDir(t182: string, u182: string, v182?: number) {
        if (!t182 || !u182) {
            Logger.e("sourceDir or destDir is null error");
            return;
        }
        Logger.info(`copy ${t182} to ${u182}`);
        try {
            let x182: ListFileOptions = {
                recursion: false,
                listNum: 0,
            };
            let y182 = fs.listFileSync(t182, x182);
            for (let z182 = 0; z182 < y182.length; z182++) {
                let a183: string = PathUtil.join(t182, y182[z182]);
                let b183: string = PathUtil.join(u182, y182[z182]);
                const c183 = fs.statSync(a183);
                if (c183.isFile()) {
                    if (v182 && v182 == 1 && fs.accessSync(b183)) {
                        Logger.w(`${b183} already exists`);
                    }
                    else {
                        fs.copyFile(a183, b183, v182);
                    }
                }
                else {
                    if (!fs.accessSync(b183)) {
                        Logger.info(`${b183} 无法访问,需要创建该目录`);
                        fs.mkdirSync(b183, true);
                    }
                    fs.copyDir(a183, b183, v182).then(() => {
                        Logger.info(`copy ${b183} finish`);
                    });
                }
            }
        }
        catch (w182) {
            Logger.e(w182);
        }
    }
}
