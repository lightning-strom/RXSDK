/**
 * ShareMediaType 定义
 * 用于表示分享的媒体类型
 */
export type ShareMediaType = 'link' | 'image' | 'landing' | 'a2m' | 'card' | 'text' | 'text_image' | 'video' | 'music' | 'atlas';
/**
 * ShareMediaType 常量定义
 */
export declare enum ShareMediaTypes {
    WEBPAGE = "link",
    IMAGE = "image",
    LANDING = "landing",
    A2M = "a2m",
    CARD = "card",
    TEXT = "text",
    TEXT_IMAGE = "text_image",
    VIDEO = "video",
    MUSIC = "music",
    ATLAS = "atlas"
}
export type ShareMediaTypesKey = keyof typeof ShareMediaTypes;
export type ShareMediaTypesValue = typeof ShareMediaTypes[ShareMediaTypesKey];
