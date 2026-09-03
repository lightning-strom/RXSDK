import image from "@ohos:multimedia.image";
import { FileUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/FileUtil&4.0.0";
export default class ImageUtil {
    private static readonly THUMB_SIZE: number = 32 * 1024;
    static async getThumbBuffer(q188: {
        filePath: string;
        quality?: number;
    } & image.InitializationOptions): Promise<ArrayBuffer> {
        const r188 = q188.filePath;
        if (!r188) {
            throw new Error("Invalid file path provided.");
        }
        const s188: image.ImageSource = image.createImageSource(r188);
        const t188: image.InitializationOptions = {
            size: {
                height: q188.size?.height || 20,
                width: q188.size?.width || 20,
            },
        };
        try {
            const v188: image.PixelMap = await s188.createPixelMap(t188);
            const w188: image.ImagePacker = image.createImagePacker();
            let x188 = q188.quality ?? 100;
            let y188: ArrayBuffer;
            do {
                y188 = await w188.packToData(v188, {
                    format: FileUtil.extensionToMime(FileUtil.getFileExtensionFromPath(r188, false), "image/png"),
                    quality: x188,
                });
                if (y188.byteLength < this.THUMB_SIZE || x188 <= 10) {
                    break;
                }
                x188 -= 10;
            } while (true);
            return y188;
        }
        catch (u188) {
            console.error("Error generating thumbnail buffer:", u188);
            throw new Error("Failed to generate thumbnail buffer.");
        }
    }
}
