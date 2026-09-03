import { ShareParams, SharePlatform, ShareScene } from "../types/Index";
import { ShareMediaType } from "../types/ShareTypes";
import systemShare from "@hms.collaboration.systemShare";
export declare class ShareObject implements ShareParams {
    platform: SharePlatform;
    share_scene: ShareScene;
    material_type: ShareMediaType;
    title?: string;
    content?: string;
    image?: string | ArrayBuffer;
    url?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    wh: number;
    package_name?: string;
    class_name?: string;
    force_user_system_chooser: boolean;
    border_size: number;
    mini_type: number;
    username?: string;
    path?: string;
    constructor(z169?: Partial<ShareParams>);
    /**
     * 获取平台
     */
    getPlatform(): string;
    /**
     * 设置平台
     */
    setPlatform(y169: SharePlatform | string): void;
    /**
     * 获取素材类型
     */
    getType(): ShareMediaType;
    /**
     * 设置素材类型
     */
    setType(x169: ShareMediaType): void;
    /**
     * 判断字符串是否非空
     */
    isNotEmpty(w169: string | undefined): boolean;
    /**
     * 检查分享参数是否合法
     */
    checkShareParam(): boolean;
    /**
     * 获取分享场景
     */
    getShareScene(): ShareScene;
    /**
     * 设置分享场景
     */
    setShareScene(v169: ShareScene): void;
    /**
     * 二维码宽高不一致时取最大值
     */
    getWh(): number;
    /**
     * 转换为对象
     */
    toRecord(): Record<string, any>;
    getShareUtd(): string;
    toSystemShareData(): Promise<systemShare.SharedData>;
    toSharedRecord(): Promise<systemShare.SharedRecord>;
    /**
     * 从对象创建实例
     */
    static fromRecord(o169: Record<string, any>): ShareObject;
}
