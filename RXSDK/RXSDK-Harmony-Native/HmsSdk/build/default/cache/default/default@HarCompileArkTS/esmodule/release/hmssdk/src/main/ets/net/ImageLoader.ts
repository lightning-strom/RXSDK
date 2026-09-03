import type { Context } from "@ohos:abilityAccessCtrl";
import UrlUtil from "@normalized:N&&&hmssdk/src/main/ets/utils/UrlUtil&4.0.0";
import Downloader from "@normalized:N&&&hmssdk/src/main/ets/net/Downloader&4.0.0";
export default class ImageLoader extends Downloader {
    static async getImage(b61: string, c61: Context): Promise<string> {
        if (UrlUtil.isHttpUrl(b61)) {
            return this.create(b61, c61).downloadFile();
        }
        else {
            return b61;
        }
    }
    constructor(z60: string, a61: Context) {
        super(z60, a61);
    }
}
