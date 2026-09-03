import { image } from "@kit.ImageKit";
import { FileUtil } from "./FileUtil";

export default class ImageUtil {
  private static readonly THUMB_SIZE: number = 32 * 1024

  static async getThumbBuffer(params: { filePath: string, quality?: number } & image.InitializationOptions): Promise<ArrayBuffer> {
    const filePath = params.filePath;
    if (!filePath) {
      throw new Error("Invalid file path provided.");
    }
    const imageSourceApi: image.ImageSource = image.createImageSource(filePath);
    const opts: image.InitializationOptions = {
      size: {
        height: params.size?.height || 20, // 默认高度为 20
        width: params.size?.width || 20, // 默认宽度为 20
      },
    };

    try {
      // 创建 PixelMap 对象
      const pixelMap: image.PixelMap = await imageSourceApi.createPixelMap(opts);
      const imagePackerApi: image.ImagePacker = image.createImagePacker();

      let quality = params.quality ?? 100;
      let buffer: ArrayBuffer;
      do {
        buffer = await imagePackerApi.packToData(pixelMap, {
          format: FileUtil.extensionToMime(FileUtil.getFileExtensionFromPath(filePath, false), "image/png"), // 支持 'image/jpeg', 'image/webp', 'image/png'
          quality: quality,
        });

        if (buffer.byteLength < this.THUMB_SIZE || quality <= 10) {
          break;
        }
        // 每次降低质量 10
        quality -= 10;
      } while (true);

      return buffer;
    } catch (error) {
      console.error("Error generating thumbnail buffer:", error);
      throw new Error("Failed to generate thumbnail buffer.");
    }
  }
}