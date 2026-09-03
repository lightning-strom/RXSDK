import image from "@ohos.multimedia.image";
export default class ImageUtil {
    private static readonly THUMB_SIZE;
    static getThumbBuffer(q188: {
        filePath: string;
        quality?: number;
    } & image.InitializationOptions): Promise<ArrayBuffer>;
}
