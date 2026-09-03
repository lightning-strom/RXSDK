import { BusinessError } from "@ohos.base";
import request from "@ohos.request";
import { Context } from "@ohos.abilityAccessCtrl";
export default class Downloader {
    protected _context: Context;
    protected _url: string;
    protected _filePath: string;
    protected _downloadTask?: request.DownloadTask;
    get filePath(): string;
    get url(): string;
    /**
     * 静态工厂方法
     * 用于创建 Downloader 实例
     * @param url 下载链接
     * @param context 上下文
     * @returns Downloader 实例
     */
    static create(w57: string, x57: Context): Downloader;
    /**
     * 构造方法
     * @param url 下载链接
     * @param context 上下文
     */
    constructor(u57: string, v57: Context);
    /**
     * 开始下载
     */
    startDownload(h57?: (result: request.DownloadInfo) => void, i57?: (err: BusinessError) => void, j57?: (receivedSize: number, totalSize: number) => void): Promise<request.DownloadTask>;
    /**
     * 恢复下载任务
     */
    restore(): void;
    /**
     * 取消下载
     */
    cancelDownload(): void;
    downloadFile(): Promise<string>;
    /**
     * 获取下载链接
     * @returns 下载链接
     */
    getUrl(): string;
    setFilePath(a57: string): this;
}
