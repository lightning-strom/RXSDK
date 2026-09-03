/**
 * ShareMediaType 定义
 * 用于表示分享的媒体类型
 */
export type ShareMediaType =
    | 'link' // 分享链接
    | 'image' // 分享图片
    | 'landing' // 分享图片并增加二维码
    | 'a2m' // App 分享至小游戏
    | 'card' // 小程序卡片
    | 'text' // 分享文本
    | 'text_image' // 图文分享
    | 'video' // 视频分享
    | 'music' // 音乐分享
    | 'atlas'; // 多图分享

/**
 * ShareMediaType 常量定义
 */
export enum  ShareMediaTypes {
  WEBPAGE= 'link', // 分享链接
  IMAGE= 'image', // 分享图片
  LANDING= 'landing', // 分享图片并增加二维码
  A2M= 'a2m', // App 分享至小游戏
  CARD= 'card', // 小程序卡片
  TEXT= 'text', // 分享文本
  TEXT_IMAGE= 'text_image', // 图文分享
  VIDEO= 'video', // 视频分享
  MUSIC= 'music', // 音乐分享
  ATLAS= 'atlas', // 多图分享
}


export type ShareMediaTypesKey = keyof typeof ShareMediaTypes;

export type ShareMediaTypesValue = typeof ShareMediaTypes[ShareMediaTypesKey];