import { BusinessError, request } from '@kit.BasicServicesKit';
import { Content } from '@kit.ArkUI';
import { Context } from '@kit.AbilityKit';
import { http } from '@kit.NetworkKit';
import { fileIo } from '@kit.CoreFileKit';
import { FileUtil } from '../utils/FileUtil';
import PathUtil from '../utils/PathUtil';
import { Logger } from '../utils/Logger';
import { CryptoUtil } from '../utils/CryptoUtil';

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

  /**
   * 静态工厂方法
   * 用于创建 Downloader 实例
   * @param url 下载链接
   * @param context 上下文
   * @returns Downloader 实例
   */
  static create(path: string, context: Context): Downloader {
    return new Downloader(path, context);
  }

  /**
   * 构造方法
   * @param url 下载链接
   * @param context 上下文
   */
  constructor(url: string, context: Context) {
    this._url = url;
    this._context = context;
    this._filePath = PathUtil.joinPath(context.cacheDir, FileUtil.getFileName(this._url) || CryptoUtil.md5Sync(this._url));
  }


  /**
   * 开始下载
   */
  startDownload(onComplete?: (result: request.DownloadInfo) => void, onFail?: (err: BusinessError) => void,
    onProgress?: (receivedSize: number, totalSize: number) => void): Promise<request.DownloadTask> {
    console.log(`Starting download from ${this._url} `);
    try {
      const context = this._context;
      const url = this._url;
      if (fileIo.accessSync(this._filePath)) {
        fileIo.unlinkSync(this._filePath); // 删除已存在的文件
      }
      return request.downloadFile(context, {
        url,
        filePath: this._filePath,

      })
        .then((data: request.DownloadTask) => {
          this._downloadTask = data;
          // 绑定下载进度事件
          if (onProgress) {
            data.on('progress', (receivedSize: number, totalSize: number) => {
              const progress = ((receivedSize / totalSize) * 100).toFixed(2);
              console.info(`Download progress: ${progress}% (${receivedSize}/${totalSize} bytes)`);
              onProgress?.(receivedSize, totalSize)
            });
          }
          // 绑定完成事件
          data.on('complete', async () => {
            try {
              let downloadInfo: request.DownloadInfo = await data.getTaskInfo()
              console.log(`downloadInfo:  ${downloadInfo} `);
              onComplete?.(downloadInfo)
            } catch (e) {
              onFail?.(e)
            }
          });

          // 绑定移除事件
          data.on('remove', () => {
            console.info('Download task removed.');
          });
          // 绑定失败事件
          data.on('fail', (errCode: number) => {
            console.error(`Download task failed. Error code: ${errCode}`);
            onFail?.({
              code: errCode,
              name: 'downloadFileError',
              message: `Download task failed. Error code: ${errCode}`
            })
          });
          return data
        })
    } catch (err) {
      //   13400002 文件路径异常  该错误码表示文件路径异常，可能原因文件路径错误或文件路径下文件已存在。 在调用uploadFile或downloadFile接口时，文件路径不合法或文件路径下文件已存在。
      console.error(`Unexpected error during download request: ${JSON.stringify(err)}`);
      onFail?.(err)
    }
  }

  /**
   * 恢复下载任务
   */
  restore(): void {
    if (this._downloadTask) {
      this._downloadTask.restore((err: BusinessError, result: boolean) => {
        if (err) {
          console.error(`Failed to resume the download task. Code: ${err.code}, message: ${err.message}`);
          return;
        }
        console.info('Succeeded in resuming the download task.');
      });
    } else {
      console.warn('No active download task to restore.');
    }
  }

  /**
   * 取消下载
   */
  cancelDownload(): void {
    if (this._downloadTask) {
      this._downloadTask.delete();
      console.log(`Download from ${this._url} has been cancelled.`);
      this._downloadTask = undefined;
    } else {
      console.warn(`No active download to cancel for ${this._url}.`);
    }
  }

  async downloadFile(): Promise<string> {
    let httpRequest = http.createHttp()
    let opt: http.HttpRequestOptions = {
      method: http.RequestMethod.GET,
      expectDataType: http.HttpDataType.ARRAY_BUFFER
    }
    try {
      Logger.d(`download File ${this._url}`);
      if (this._url) {
        let data = await httpRequest.request(this._url, opt);
        if (data?.responseCode == http.ResponseCode.OK) {
          FileUtil.writeFileSync(this.filePath, data.result as ArrayBuffer)
          return this.filePath
        } else {
          Logger.e(`download File responseCode: ${data?.responseCode}`);
          return null;
        }


      } else {
        Logger.e(`download File url null error `);
        return null;
      }
    } catch (e) {
      Logger.e(e)
      return null;
    } finally {
      httpRequest.destroy();
    }
  }


  /**
   * 获取下载链接
   * @returns 下载链接
   */
  getUrl(): string {
    return this._url;
  }

  setFilePath(path: string) {
    this._filePath = path
    return this
  }
}