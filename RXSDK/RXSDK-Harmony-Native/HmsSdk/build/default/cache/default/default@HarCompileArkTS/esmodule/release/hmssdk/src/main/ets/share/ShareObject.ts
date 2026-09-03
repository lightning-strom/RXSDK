import { SharePlatforms } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { ShareParams, SharePlatform, ShareScene } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import { ShareMediaTypes } from "@normalized:N&&&hmssdk/src/main/ets/types/ShareTypes&4.0.0";
import type { ShareMediaType } from "@normalized:N&&&hmssdk/src/main/ets/types/ShareTypes&4.0.0";
import uniformTypeDescriptor from "@ohos:data.uniformTypeDescriptor";
import systemShare from "@hms:collaboration.systemShare";
import Downloader from "@normalized:N&&&hmssdk/src/main/ets/net/Downloader&4.0.0";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import { FileUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/FileUtil&4.0.0";
import ImageUtil from "@normalized:N&&&hmssdk/src/main/ets/utils/ImageUtil&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
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
    platform: SharePlatform = SharePlatforms.WECHAT;
    share_scene: ShareScene;
    material_type: ShareMediaType;
    title?: string;
    content?: string;
    image?: string | ArrayBuffer;
    url?: string;
    x: number = 0;
    y: number = 0;
    width: number = 0;
    height: number = 0;
    wh: number = 0;
    package_name?: string;
    class_name?: string;
    force_user_system_chooser: boolean = true;
    border_size: number = 0;
    mini_type: number = 0;
    username?: string;
    path?: string;
    constructor(z169?: Partial<ShareParams>) {
        if (z169) {
            Object.assign(this, z169);
        }
    }
    getPlatform(): string {
        return this.platform;
    }
    setPlatform(y169: SharePlatform | string): void {
        this.platform = y169 as SharePlatform;
    }
    getType(): ShareMediaType {
        return this.material_type;
    }
    setType(x169: ShareMediaType): void {
        this.material_type = x169;
    }
    isNotEmpty(w169: string | undefined): boolean {
        return w169 != null && w169.trim() !== '';
    }
    checkShareParam(): boolean {
        return this.isNotEmpty(this.material_type);
    }
    getShareScene(): ShareScene {
        return this.share_scene;
    }
    setShareScene(v169: ShareScene): void {
        this.share_scene = v169;
    }
    getWh(): number {
        return this.wh > 0 ? this.wh : Math.max(this.width, this.height);
    }
    toRecord(): Record<string, any> {
        return { ...this };
    }
    getShareUtd() {
        return typeMapping[this.material_type];
    }
    async toSystemShareData(): Promise<systemShare.SharedData> {
        let u169: systemShare.SharedData = new systemShare.SharedData(await this.toSharedRecord());
        return u169;
    }
    async toSharedRecord(): Promise<systemShare.SharedRecord> {
        let p169 = this.getShareUtd() || uniformTypeDescriptor.UniformDataType.HYPERLINK;
        let q169;
        if (this.image && typeof this.image == 'string') {
            q169 = await Downloader.create(this.image, SDKConfig.context).downloadFile();
        }
        if (p169 == uniformTypeDescriptor.UniformDataType.HYPERLINK) {
            const t169: systemShare.SharedRecord = {
                utd: p169,
                content: this.url,
                title: this.title,
                description: this.content,
            };
            if (q169) {
                t169.thumbnailUri = FileUtil.getUriFromPath(q169);
                t169.thumbnail = new Uint8Array(await ImageUtil.getThumbBuffer({
                    filePath: q169,
                    size: { width: this.width, height: this.height },
                }));
                return t169;
            }
            else if (this.image instanceof ArrayBuffer) {
                t169.thumbnail = new Uint8Array(this.image);
                return t169;
            }
            else {
                Logger.e("filePath null error");
            }
        }
        else if (p169 == uniformTypeDescriptor.UniformDataType.IMAGE) {
            let s169: systemShare.SharedRecord = {
                utd: p169,
                thumbnailUri: FileUtil.getUriFromPath(q169),
            };
            return s169;
        }
        else if (p169 == uniformTypeDescriptor.UniformDataType.PLAIN_TEXT) {
            let r169: systemShare.SharedRecord = {
                utd: p169,
                content: this.content,
                title: this.title,
            };
            return r169;
        }
        else {
            Logger.e(`material_type error ${this.material_type}  utd ${p169}`);
        }
    }
    static fromRecord(o169: Record<string, any>): ShareObject {
        return new ShareObject(o169);
    }
}
