import { Context } from "@kit.AbilityKit";
import UrlUtil from "../utils/UrlUtil";
import Downloader from "./Downloader";

export default class ImageLoader extends Downloader {

  static async getImage(path: string, context: Context): Promise<string> {
    if (UrlUtil.isHttpUrl(path)) {
      return this.create(path, context).downloadFile()
    } else {
      return path
    }
  }

  /**
   * 构造方法
   * @param url 下载链接
   * @param context 上下文
   */
  constructor(url: string, context: Context) {
    super(url, context);
  }
}