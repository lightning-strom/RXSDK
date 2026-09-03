export type ShareMediaType = 'link' | 'image' | 'landing' | 'a2m' | 'card' | 'text' | 'text_image' | 'video' | 'music' | 'atlas';
export enum ShareMediaTypes {
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
