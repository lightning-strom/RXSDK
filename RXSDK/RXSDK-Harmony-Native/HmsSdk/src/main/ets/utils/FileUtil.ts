import { buffer, util } from "@kit.ArkTS";
import { photoAccessHelper } from "@kit.MediaLibraryKit";
import { common, Context } from "@kit.AbilityKit";
import { dataSharePredicates } from "@kit.ArkData";
import { Logger } from "./Logger";
import { BusinessError } from "@kit.BasicServicesKit";
import { fileIo, fileUri, hash, ReadOptions, ListFileOptions as lfo } from "@kit.CoreFileKit";
import fs from '@ohos.file.fs';
import PathUtil from "./PathUtil";

interface FileInfo {
  path: string;
  hash?: string;
}

interface ListFileOptions extends lfo {}

class MediaDataHandler implements photoAccessHelper.MediaAssetDataHandler<ArrayBuffer> {
  private callback: (data?: ArrayBuffer) => void

  constructor(callback: (data?: ArrayBuffer) => void) {
    this.callback = callback;
    this.onDataPrepared = this.onDataPrepared.bind(this);
  }

  onDataPrepared(data: ArrayBuffer) {
    this.callback?.(data)
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

  static async getPhotoAssets(context: Context, uri: string): Promise<ArrayBuffer> {
    let phAccessHelper = photoAccessHelper.getPhotoAccessHelper(context);
    let predicates: dataSharePredicates.DataSharePredicates = new dataSharePredicates.DataSharePredicates();
    // let uri = 'file://media/Photo/1/IMG_datetime_0001/displayName.jpg' // 需保证此uri已存在。
    predicates.equalTo(photoAccessHelper.PhotoKeys.URI, uri.toString());
    let fetchOptions: photoAccessHelper.FetchOptions = {
      fetchColumns: [photoAccessHelper.PhotoKeys.TITLE],
      predicates: predicates
    };

    try {
      let fetchResult: photoAccessHelper.FetchResult<photoAccessHelper.PhotoAsset> = await phAccessHelper.getAssets(fetchOptions);
      let photoAsset: photoAccessHelper.PhotoAsset = await fetchResult.getFirstObject();
      Logger.d('getAssets photoAsset.uri : ' + photoAsset.uri);
      // 获取属性值，以标题为例；对于非默认查询的属性，get前需要在fetchColumns中添加对应列名
      //Logger.d('title : ' + photoAsset.get(photoAccessHelper.PhotoKeys.TITLE));
      // 请求图片资源数据
      let requestOptions: photoAccessHelper.RequestOptions = {
        deliveryMode: photoAccessHelper.DeliveryMode.HIGH_QUALITY_MODE,
      }

      let data: ArrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        let reqId = photoAccessHelper.MediaAssetManager.requestImageData(context, photoAsset, requestOptions, new MediaDataHandler((data) => {
          Logger.d(`${uri} : ${data?.byteLength}`);
          resolve(data)
        }));
      })
      Logger.d('requestImageData successfully');
      fetchResult.close();
      return data;
    } catch (err) {
      Logger.error('getAssets failed with err: ' + err);
    }
    return;
  }

  static writeFileSync(path: string, content: string | ArrayBuffer): void {
    let file;
    try {
      // 新建并打开文件，如果文件不存在则创建
      file = fileIo.openSync(path, fileIo.OpenMode.READ_WRITE | fileIo.OpenMode.CREATE);

      let arrayBufferContent: ArrayBuffer;

      if (typeof content === 'string') {
        arrayBufferContent = new  util.TextEncoder().encodeInto(content).buffer
      } else if (content instanceof ArrayBuffer) {
        arrayBufferContent = content; // 如果是 ArrayBuffer 类型，直接使用
      } else {
        throw new Error('Unsupported content type');
      }

      let writeLen = fileIo.writeSync(file.fd, arrayBufferContent);
      Logger.d(`written ${path} content size ${writeLen}`);

    } catch (error) {
      Logger.error("Error while creating or writing to the file:", error);
    } finally {
      if (file) {
        fileIo.closeSync(file);
      }
    }
  }

  //Logger.log(MyClass.getFileName('/path/to/file.txt'));       // 输出: file.txt
  public static getFileName(filePath: string): string {
    if (!filePath) {
      return '';
    }
    const match = filePath?.match(/([^\\/]+)$/); // 支持 / 或 \\ 作为分隔符
    return match ? match[0] : ''
  }

  /**
   * 获取文件路径中的扩展名
   * @param filePath - 文件路径
   * @returns 文件扩展名（包含点，如 ".txt"；如果没有扩展名则返回空字符串）
   */
  public static getFileExtensionFromPath(filePath: string, includeDot: boolean = true): string {
    if (!filePath) {
      return '';
    }
    const match = filePath.match(/\.([^./\\]+)$/); // 匹配最后一个点及其后内容
    if (match) {
      return includeDot ? `.${match[1]}` : match[1];
    }
    return '';
  }

  /**
   * 根据 MIME 类型获取扩展名
   * @param mimeType - MIME 类型，例如 "image/jpeg"
   * @param defaultExt - 未匹配时的默认扩展名，默认为空字符串
   * @returns 对应的扩展名或默认值
   */
  public static mimeToExtension(mimeType: string, defaultExt: string = ""): string {
    return this.mimeToExtMap[mimeType.toLowerCase()] || defaultExt;
  }

  /**
   * 根据扩展名获取 MIME 类型
   * @param extension - 文件扩展名，例如 "jpg"
   * @param defaultMime - 未匹配时的默认 MIME 类型，默认为 "application/octet-stream"
   * @returns 对应的 MIME 类型或默认值
   */
  public static extensionToMime(extension: string, defaultMime: string = "application/octet-stream"): string {
    this.getFileExtension(extension)
    return this.extToMimeMap[extension.toLowerCase()] || defaultMime;
  }

  public static getUriFromPath(filePath: string): string {
    return fileUri.getUriFromPath(filePath)
  }

  /**
   * 获取图片扩展名
   * @param filePathOrBuffer - 文件路径或图片数据的 ArrayBuffer
   * @param includeDot - 是否包含点，默认为 true
   * @returns 图片扩展名字符串（如 '.jpg'、'png'）或 `null`（无法识别）
   */
  public static getFileExtension(filePathOrBuffer: string | ArrayBuffer, includeDot: boolean = true): string | null {
    if (typeof filePathOrBuffer === 'string') {
      const ext = this.getFileExtensionFromPath(filePathOrBuffer, false);
      return ext ? (includeDot ? `.${ext}` : ext) : null;
    } else if (filePathOrBuffer instanceof ArrayBuffer) {
      if (!filePathOrBuffer || filePathOrBuffer.byteLength < 4) {
        return null;
      }
      const uint8Array = new Uint8Array(filePathOrBuffer);
      const magicNumbers = uint8Array.slice(0, 4).join(' ');
      const magicToExtMap: { [key: string]: string } = {
        '255 216 255': 'jpg', // JPEG 文件头: FF D8 FF
        '137 80 78 71': 'png', // PNG 文件头: 89 50 4E 47
        '71 73 70 56': 'gif', // GIF 文件头: 47 49 46 38
        '66 77': 'bmp', // BMP 文件头: 42 4D
        '73 73 42 0': 'tiff', // TIFF 文件头 (Intel): 49 49 2A 00
        '77 77 0 42': 'tiff', // TIFF 文件头 (Motorola): 4D 4D 00 2A
        '0 0 1 0': 'ico', // ICO 文件头: 00 00 01 00
        '82 73 70 70': 'webp', // WEBP 文件头: 52 49 46 46
        '239 187 191': 'txt', // TXT 文件头 (UTF-8 BOM): EF BB BF
        '80 75 3 4': 'zip', // ZIP 文件头: 50 4B 03 04
        '80 75 5 6': 'zip', // ZIP 空文件头: 50 4B 05 06
        '80 75 7 8': 'zip', // ZIP 分卷文件头: 50 4B 07 08
        '77 90': 'exe', // EXE/DLL 文件头: 4D 5A (MZ)
        '70 75 83 116': 'epub', // EPUB 文件头: 50 4B 03 04 (ZIP 容器)
        '79 76 73 70': 'mp4', // MP4 文件头: 66 74 79 70 (ftyp)
        '73 116 97 108': '3gp', // 3GP 文件头: 66 74 79 70 (ftyp3gp)
        '82 97 114 33': 'rar', // RAR 文件头: 52 61 72 21
        '79 103 103 83': 'ogg', // OGG 文件头: 4F 67 67 53
        '37 80 68 70': 'pdf', // PDF 文件头: 25 50 44 46
        '255 251': 'mp3', // MP3 文件头: FF FB
      };

      let ext = magicToExtMap[magicNumbers] || null;
      if (ext === 'webp') {
        const webpCheck = uint8Array.slice(8, 12).join(' ');
        if (webpCheck !== '87 69 66 70') {
          ext = null;
        }
      }
      return includeDot ? `.${ext}` : ext;
    }
    return null;
  }

  public static access(path: string): boolean {
    if (path) {
      return fileIo.accessSync(path)
    } else {
      false
    }
  }

  public static isExists(path: string): boolean {
    return this.access(path)
  }

  public static getFileSize(path: string): number {
    let fileStat;
    try {
      fileStat = fileIo.statSync(path);
    } catch (error) {
      Logger.error("Error fetching file stats: ", error);
      return -1;
    }
    let fileSize = fileStat.size;
    return fileSize;
  }

  //文件读取分为多个块
  public static readFileInChunks(path: string, chunkSize: number): ArrayBuffer[] {
    let fileSize = this.getFileSize(path)
    if (fileSize <= 0) {
      return [];
    }
    let file;
    try {
      file = fileIo.openSync(path, fileIo.OpenMode.READ_ONLY); // 以只读方式打开文件
    } catch (error) {
      Logger.error("Error opening file: ", error);
      return []; // 如果打开文件失败，返回空的数组
    }

    let chunks: ArrayBuffer[] = [];
    try {
      let offset = 0;

      while (offset < fileSize) {
        let remainingSize = fileSize - offset;
        let currentChunkSize = Math.min(chunkSize, remainingSize);
        let arrayBuffer = new ArrayBuffer(currentChunkSize);
        // 读取一个块
        let readLen = fileIo.readSync(file.fd, arrayBuffer, {
          offset: offset, length: currentChunkSize
        });
        if (readLen > 0) {
          chunks.push(arrayBuffer);
          offset += readLen;
        } else {
          break;
        }
      }

      return chunks;
    } catch (error) {
      Logger.error("Error reading file: ", error);
      return [];
    } finally {

      if (file) {
        fileIo.closeSync(file);
      }
    }
  }

  // 获取沙箱目录路径
  getSandboxDirectoryPath(context: Context) {
    return context.filesDir
  }

  // 缓存目录路径
  getCacheDirectoryPath(context: Context) {
    return context.cacheDir
  }

  public static async readFile(context: Context, filePath: string): Promise<ArrayBuffer> {
    let data: ArrayBuffer
    if (filePath.startsWith("file://")) {
      data = await FileUtil.getPhotoAssets(context, filePath)
    } else {
      data = FileUtil.readFileSync(filePath)
    }
    return data
  }

  public static readFileSync(path: string): ArrayBuffer {
    let fileSize = this.getFileSize(path)
    if (fileSize <= 0) {
      Logger.error("File size is invalid or empty.");
      return
    }
    let arrayBuffer = new ArrayBuffer(fileSize);
    let file;
    try {
      file = fileIo.openSync(path, fileIo.OpenMode.READ_ONLY); // 以只读方式打开文件
    } catch (error) {
      Logger.error("Error opening file: ", error);
      return new ArrayBuffer(0);
    }

    try {
      let option: ReadOptions = {
        length: arrayBuffer.byteLength
      };
      let readLen = fileIo.readSync(file.fd, arrayBuffer, option);

      if (readLen < fileSize) {
        arrayBuffer = arrayBuffer.slice(0, readLen);
      }
      return arrayBuffer;
    } catch (error) {
      Logger.error("Error reading file: ", error);
      return new ArrayBuffer(0);
    } finally {
      if (file) {
        fileIo.closeSync(file);
      }
    }
  }

  static async deleteFile(path: string) {
    const stat = await fileIo.stat(path);
    if (stat.isDirectory()) {
      fileIo.rmdirSync(path);
    } else {
      fileIo.unlinkSync(path);
    }
  }

  public static isRawDir(context: common.UIAbilityContext, rawFilePath) {
    try {
      if (!rawFilePath || rawFilePath.trim() === "") {
        return true
      } else {
        return context.resourceManager.isRawDir(rawFilePath)
      }
    } catch {
      return false;
    }
  }

  static dirname(path: string): string {
    // 步骤1：统一路径分隔符为 /（处理 Windows 的 \）
    const normalizedPath = path.replace(/\\/g, '/');
    // 步骤2：去除尾部的 /（避免 /a/b/ 被误判）
    const trimmedPath = normalizedPath.replace(/\/+$/, '');
    // 步骤3：找到最后一个 / 的位置
    const lastSlashIndex = trimmedPath.lastIndexOf('/');
    if (lastSlashIndex === -1) {
      // 没有路径分隔符（如 "file.txt" 或 "C:file.txt"），返回当前目录 .
      return '.';
    }
    // 步骤4：提取最后一个 / 左侧的部分（即目录）
    const dir = trimmedPath.substring(0, lastSlashIndex);
    // 特殊情况：若目录为空（如 "/file.txt"），返回 / 或 .（根据是否为根路径）
    return dir === '' ? (normalizedPath.startsWith('/') ? '/' : '.') : dir;
  }

  static isDirectory(dirPath: string): boolean {
    try {
      const stats = fs.statSync(dirPath);
      return stats.isDirectory();
    } catch (err) {
      Logger.e(err)
      return false;
    }
  }


  public static extractRawFiles(context: common.UIAbilityContext, rawFilePath: string, destPath?: string) {
    destPath ??= context.filesDir
    try {
      if (!this.isRawDir(context, rawFilePath)) {
        this.copySingleFileFromRawToSandbox(context, rawFilePath, destPath);
        return;
      } else {
        this.copyWholeDirInRawFileIterate(context, rawFilePath, destPath);
      }

    } catch (error) {
      let code = (error as BusinessError).code;
      let message = (error as BusinessError).message;
      Logger.error(`ExtractRawFiles failed, error code: ${code}, message: ${message}.`);
    }
  }

  public static copyWholeDirInRawFileIterate(context: common.UIAbilityContext, rawFilePath: string, destPath?: string) {
    if (context == null) {
      return;
    }
    destPath ??= context.filesDir
    let resourceManager = context.resourceManager;
    try {
      let rawFileDirs: Array<string> = resourceManager.getRawFileListSync(rawFilePath);
      for (let dir of rawFileDirs) {
        let isDir = false;
        // 传入""表示获取rawfile根目录下的文件列表
        let rawChildDirPath = (!rawFilePath || rawFilePath == "") ? "" : rawFilePath;
        let rawChildFilePath = (!rawFilePath || rawFilePath == "") ? dir : rawChildDirPath + '/' + dir;
        let destChildFilePath = destPath + '/' + dir;
        isDir = resourceManager.isRawDir(rawChildFilePath);
        if (isDir) {
          // 目标文件夹是否存在，不存在则新建一个空文件夹
          if (!fileIo.accessSync(destChildFilePath)) {
            this.makeDir(destChildFilePath);
          }
          this.copyWholeDirInRawFileIterate(context, rawChildFilePath, destChildFilePath);
        } else {
          this.copySingleFileFromRawToSandbox(context, rawChildFilePath, destChildFilePath);
        }
      }
    } catch (error) {
      let code = (error as BusinessError).code;
      let message = (error as BusinessError).message;
      Logger.error(`this.CopyWholeDirInRawFileIterate failed, error code: ${code}, message: ${message}.`);
    }
  }

  static isAbsoluteSandboxPath(path: string, context?: common.UIAbilityContext) {
    if (!path) {
      return false;
    }
    const sandboxRoot = context?.filesDir
      ? context.filesDir.split('/').slice(0, -1).join('/')
      : "/data/storage/el2/base/haps/entry";
    return path.startsWith(sandboxRoot);
  }

  public static copySingleFileFromRawToSandbox(context: common.UIAbilityContext, rawFilePath: string, destPath?: string) {
    let destPathFul = this.isAbsoluteSandboxPath(destPath) ? destPath : context.filesDir + destPath + rawFilePath
    let destParentPath = this.dirname(destPathFul);
    if (!fileIo.accessSync(destParentPath)) {
      this.makeDir(destParentPath);
    }
    let content = context.resourceManager.getRawFileContentSync(rawFilePath);
    //remove first if exist
    if (fileIo.accessSync(destPath)) {
      fileIo.unlinkSync(destPath);
    }
    let file = fileIo.openSync(destPathFul, fileIo.OpenMode.READ_WRITE | fileIo.OpenMode.CREATE);
    let writeLen = fileIo.writeSync(file.fd, content.buffer);
    Logger.d(`write ${rawFilePath} to ${destPath} succeed and size is:` + writeLen);
    fileIo.closeSync(file);
  }

  public static makeDir(path: string, recursion: boolean = true) {
    fileIo.mkdirSync(path, recursion);
  }

  public static getFileList(path: string, options?: ListFileOptions): string[] {
    Logger.d(path)
    options ??= {
      recursion: true,
    }
    return fileIo.listFileSync(path, options);
  }

  public static async getFileListWithHash(path: string, options?: ListFileOptions, algorithm?: string): Promise<FileInfo[]> {
    options ??= {
      recursion: true,
    };
    const files = fileIo.listFileSync(path, options)
    const promises = files.map(async name => {
      const fullPath = `${path}/${name}`;
      const stat = fileIo.statSync(fullPath);
      if (!stat.isDirectory()) {
        return {
          path: name,
          hash: await this.calcFileHash(fullPath, algorithm)
        };
      }
      return null;
    });
    const results = (await Promise.all(promises)).filter(Boolean) as FileInfo[];
    return results;

  }

  public static async calcFileHash(file: string, algorithm?: string): Promise<string> {
    let hash1 = await hash.hash(file, algorithm ?? "sha1")

    return hash1
  }

  public static copyDir(sourceDir: string, destDir: string, mode?: number) {
    if (!sourceDir || !destDir) {
      Logger.e("sourceDir or destDir is null error")
      return;
    }
    Logger.info(`copy ${sourceDir} to ${destDir}`)
    try {
      let listFileOption: ListFileOptions = {
        recursion: false,
        listNum: 0,
      }
      let dir = fs.listFileSync(sourceDir, listFileOption);
      for (let i = 0; i < dir.length; i++) {
        let srcPath: string = PathUtil.join(sourceDir, dir[i])
        let destPath: string = PathUtil.join(destDir, dir[i])
        const stats = fs.statSync(srcPath);
        if (stats.isFile()) {
          if (mode && mode == 1 && fs.accessSync(destPath)) {
            Logger.w(`${destPath} already exists`)
          } else {
            fs.copyFile(srcPath, destPath, mode)
          }
        } else {
          if (!fs.accessSync(destPath)) {
            Logger.info(`${destPath} 无法访问,需要创建该目录`);
            fs.mkdirSync(destPath, true);
          }
          fs.copyDir(srcPath, destPath, mode).then(() => {
            Logger.info(`copy ${destPath} finish`);
          })
        }
      }
    } catch (e) {
      Logger.e(e);
    }
  }


  // async copyCompressedFileToCacheDirectory() {
  //   try {
  //     let dest = fs.openSync(this.cacheDirectoryPath + "/rawfile.zip", fs.OpenMode.CREATE | fs.OpenMode.READ_WRITE)
  //     let bufsize = 4096
  //     let buf = new ArrayBuffer(bufsize)
  //     let off = 0, len = 0, readedLen = 0
  //     /**
  //      * 通过buffer将rawfile文件内容copy到沙箱路径
  //      */
  //     while (len = fs.readSync(this.data!.fd, buf, { offset: this.data!.offset + off, length: bufsize })) {
  //       readedLen += len
  //       fs.writeSync(dest.fd, buf, { offset: off, length: len })
  //       off = off + len
  //       if ((this.data!.length - readedLen) < bufsize) {
  //         bufsize = this.data!.length - readedLen
  //       }
  //     }
  //     await fs.close(dest.fd)
  //   } catch (e) {
  //     console.log("拷贝失败" + e)
  //   }
  //   this.showAlertDialog("压缩文件拷贝成功")
  //
  // }
  //
  // // 将压缩文件解压到沙箱目录
  // async unzipCompressedFileToSandboxDirectory() {
  //   // 对沙箱路径下的压缩文件进行解压
  //   await zlib.decompressFile(this.cacheDirectoryPath + "/rawfile.zip", this.sandboxDirectoryPath)
  //   await this.context.resourceManager.closeRawFd("rawfile.zip")
  //   console.info("解压完成")
  //   this.showAlertDialog("解压文件完成")
  // }
}