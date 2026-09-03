import { ShareParams, SharePlatform, SharePlatforms, ShareScene } from "../types/Index";
import { ShareMediaType, ShareMediaTypes } from "../types/ShareTypes";
import { uniformTypeDescriptor } from "@kit.ArkData";
import { systemShare } from "@kit.ShareKit";
import Downloader from "../net/Downloader";
import SDKConfig from "../sdk/SDKConfig";
import { FileUtil } from "../utils/FileUtil";
import ImageUtil from "../utils/ImageUtil";
import { Logger } from "../utils/Logger";

const typeMapping: Record<string, string> = {
  [ShareMediaTypes.WEBPAGE]: uniformTypeDescriptor.UniformDataType.HYPERLINK,
  [ShareMediaTypes.IMAGE]: uniformTypeDescriptor.UniformDataType.IMAGE,
  [ShareMediaTypes.VIDEO]: uniformTypeDescriptor.UniformDataType.VIDEO,
  [ShareMediaTypes.TEXT]: uniformTypeDescriptor.UniformDataType.PLAIN_TEXT,
  [ShareMediaTypes.TEXT_IMAGE]: uniformTypeDescriptor.UniformDataType.RICH_TEXT,
  [ShareMediaTypes.MUSIC]: uniformTypeDescriptor.UniformDataType.AUDIO,
  [ShareMediaTypes.LANDING]: uniformTypeDescriptor.UniformDataType.IMAGE,
};

export class ShareObject implements ShareParams {
  platform: SharePlatform = SharePlatforms.WECHAT; // 默认平台
  share_scene: ShareScene; // 分享场景
  material_type: ShareMediaType; // 素材类型
  title?: string; // 标题
  content?: string; // 描述
  image?: string | ArrayBuffer; // 图片地址
  url?: string; // 链接地址
  x: number = 0; // 二维码左上角 X 坐标
  y: number = 0; // 二维码左上角 Y 坐标
  width: number = 0; // 二维码宽度
  height: number = 0; // 二维码高度
  wh: number = 0; // 宽高统一值
  package_name?: string; // 包名
  class_name?: string; // 类名
  force_user_system_chooser: boolean = true; // 是否强制使用系统选择器
  border_size: number = 0; // 边框大小
  mini_type: number = 0; //release
  username?: string;
  path?: string;

  constructor(init?: Partial<ShareParams>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  /**
   * 获取平台
   */
  getPlatform(): string {
    return this.platform;
  }

  /**
   * 设置平台
   */
  setPlatform(platform: SharePlatform | string): void {
    this.platform = platform as SharePlatform;
  }

  /**
   * 获取素材类型
   */
  getType(): ShareMediaType {
    return this.material_type;
  }

  /**
   * 设置素材类型
   */
  setType(type: ShareMediaType): void {
    this.material_type = type;
  }

  /**
   * 判断字符串是否非空
   */
  isNotEmpty(value: string | undefined): boolean {
    return value != null && value.trim() !== '';
  }

  /**
   * 检查分享参数是否合法
   */
  checkShareParam(): boolean {
    return this.isNotEmpty(this.material_type);
  }

  /**
   * 获取分享场景
   */
  getShareScene(): ShareScene {
    return this.share_scene;
  }

  /**
   * 设置分享场景
   */
  setShareScene(shareScene: ShareScene): void {
    this.share_scene = shareScene;
  }

  /**
   * 二维码宽高不一致时取最大值
   */
  getWh(): number {
    return this.wh > 0 ? this.wh : Math.max(this.width, this.height);
  }

  /**
   * 转换为对象
   */
  toRecord(): Record<string, any> {
    return { ...this };
  }

  getShareUtd() {
    return typeMapping[this.material_type];
  }

  async toSystemShareData(): Promise<systemShare.SharedData> {
    let shareData: systemShare.SharedData = new systemShare.SharedData(await this.toSharedRecord());
    return shareData
  }

  async toSharedRecord(): Promise<systemShare.SharedRecord> {
    let utd = this.getShareUtd() || uniformTypeDescriptor.UniformDataType.HYPERLINK
    let filePath
    if (this.image && typeof this.image == 'string') {
      filePath = await Downloader.create(this.image, SDKConfig.context).downloadFile()
    }

    if (utd == uniformTypeDescriptor.UniformDataType.HYPERLINK) {
      const sharedRecord: systemShare.SharedRecord = {
        utd: utd,
        content: this.url,
        title: this.title,
        description: this.content,
      };

      if (filePath) {
        sharedRecord.thumbnailUri = FileUtil.getUriFromPath(filePath);
        sharedRecord.thumbnail = new Uint8Array(
          await ImageUtil.getThumbBuffer({
            filePath: filePath,
            size: { width: this.width, height: this.height },
          })
        );
        return sharedRecord;

      } else if (this.image instanceof ArrayBuffer) {
        sharedRecord.thumbnail = new Uint8Array(this.image);
        return sharedRecord;
      } else {
        Logger.e("filePath null error")
      }
    } else if (utd == uniformTypeDescriptor.UniformDataType.IMAGE) {
      let ret: systemShare.SharedRecord = {
        utd: utd,
        thumbnailUri: FileUtil.getUriFromPath(filePath),
      }
      return ret
    } else if (utd == uniformTypeDescriptor.UniformDataType.PLAIN_TEXT) {
      let ret: systemShare.SharedRecord = {
        utd: utd,
        content: this.content,
        title: this.title,
      }
      return ret
    } else {
      Logger.e(`material_type error ${this.material_type}  utd ${utd}`)
    }
  }

  /**
   * 从对象创建实例
   */
  static fromRecord(mapObj: Record<string, any>): ShareObject {
    return new ShareObject(mapObj);
  }
}