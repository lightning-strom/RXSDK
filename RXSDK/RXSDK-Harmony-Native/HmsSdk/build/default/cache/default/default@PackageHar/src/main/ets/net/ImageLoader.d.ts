import { Context } from "@ohos.abilityAccessCtrl";
import Downloader from "./Downloader";
export default class ImageLoader extends Downloader {
    static getImage(b61: string, c61: Context): Promise<string>;
    /**
     * 构造方法
     * @param url 下载链接
     * @param context 上下文
     */
    constructor(z60: string, a61: Context);
}
