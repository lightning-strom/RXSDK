import type { BusinessError } from "@ohos:base";
import request from "@ohos:request";
import type { Context } from "@ohos:abilityAccessCtrl";
import http from "@ohos:net.http";
import fileIo from "@ohos:file.fs";
import { FileUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/FileUtil&4.0.0";
import PathUtil from "@normalized:N&&&hmssdk/src/main/ets/utils/PathUtil&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import { CryptoUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/CryptoUtil&4.0.0";
export default class Downloader {
    protected _context: Context;
    protected _url: string;
    protected _filePath: string;
    protected _downloadTask?: request.DownloadTask;
    public get filePath(): string {
        return this._filePath;
    }
    public get url(): string {
        return this._url;
    }
    static create(w57: string, x57: Context): Downloader {
        return new Downloader(w57, x57);
    }
    constructor(u57: string, v57: Context) {
        this._url = u57;
        this._context = v57;
        this._filePath = PathUtil.joinPath(v57.cacheDir, FileUtil.getFileName(this._url) || CryptoUtil.md5Sync(this._url));
    }
    startDownload(h57?: (result: request.DownloadInfo) => void, i57?: (err: BusinessError) => void, j57?: (receivedSize: number, totalSize: number) => void): Promise<request.DownloadTask> {
        console.log(`Starting download from ${this._url} `);
        try {
            const l57 = this._context;
            const m57 = this._url;
            if (fileIo.accessSync(this._filePath)) {
                fileIo.unlinkSync(this._filePath);
            }
            return request.downloadFile(l57, {
                url: m57,
                filePath: this._filePath,
            })
                .then((n57: request.DownloadTask) => {
                this._downloadTask = n57;
                if (j57) {
                    n57.on('progress', (r57: number, s57: number) => {
                        const t57 = ((r57 / s57) * 100).toFixed(2);
                        console.info(`Download progress: ${t57}% (${r57}/${s57} bytes)`);
                        j57?.(r57, s57);
                    });
                }
                n57.on('complete', async () => {
                    try {
                        let q57: request.DownloadInfo = await n57.getTaskInfo();
                        console.log(`downloadInfo:  ${q57} `);
                        h57?.(q57);
                    }
                    catch (p57) {
                        i57?.(p57);
                    }
                });
                n57.on('remove', () => {
                    console.info('Download task removed.');
                });
                n57.on('fail', (o57: number) => {
                    console.error(`Download task failed. Error code: ${o57}`);
                    i57?.({
                        code: o57,
                        name: 'downloadFileError',
                        message: `Download task failed. Error code: ${o57}`
                    });
                });
                return n57;
            });
        }
        catch (k57) {
            console.error(`Unexpected error during download request: ${JSON.stringify(k57)}`);
            i57?.(k57);
        }
    }
    restore(): void {
        if (this._downloadTask) {
            this._downloadTask.restore((f57: BusinessError, g57: boolean) => {
                if (f57) {
                    console.error(`Failed to resume the download task. Code: ${f57.code}, message: ${f57.message}`);
                    return;
                }
                console.info('Succeeded in resuming the download task.');
            });
        }
        else {
            console.warn('No active download task to restore.');
        }
    }
    cancelDownload(): void {
        if (this._downloadTask) {
            this._downloadTask.delete();
            console.log(`Download from ${this._url} has been cancelled.`);
            this._downloadTask = undefined;
        }
        else {
            console.warn(`No active download to cancel for ${this._url}.`);
        }
    }
    async downloadFile(): Promise<string> {
        let b57 = http.createHttp();
        let c57: http.HttpRequestOptions = {
            method: http.RequestMethod.GET,
            expectDataType: http.HttpDataType.ARRAY_BUFFER
        };
        try {
            Logger.d(`download File ${this._url}`);
            if (this._url) {
                let e57 = await b57.request(this._url, c57);
                if (e57?.responseCode == http.ResponseCode.OK) {
                    FileUtil.writeFileSync(this.filePath, e57.result as ArrayBuffer);
                    return this.filePath;
                }
                else {
                    Logger.e(`download File responseCode: ${e57?.responseCode}`);
                    return null;
                }
            }
            else {
                Logger.e(`download File url null error `);
                return null;
            }
        }
        catch (d57) {
            Logger.e(d57);
            return null;
        }
        finally {
            b57.destroy();
        }
    }
    getUrl(): string {
        return this._url;
    }
    setFilePath(a57: string) {
        this._filePath = a57;
        return this;
    }
}
