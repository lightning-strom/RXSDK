import { ShareParams } from "../types/Index";

// Trigger 信息
export interface Trigger {
  id: number;
  tag: string;
  title: string;
  failed_msg: string;
  type: number;
  time_interval: number;
}

// Strategy 信息
export interface Strategy {
  id: number;
  platform: string;
  share_type: number;
  type: number;
  name: string;
  region: string;
  product_id: string;
  channel_id: string;
  status: number;
}

// Content 信息
export interface Content extends ShareParams {
  material_id: number;
  landing_id: number; //落地页ID，主要用于大数据上报
  meta_source: number; //1 使用瑞雪后台配置 2 落地页需为动态页，客户端传参
}

// Platforms 信息
export interface Platforms {
  wechat: number;
  qq: number;
  system: number;
}

// 根对象
export interface ShareData {
  trigger: Trigger;
  strategy: Strategy;
  content: Content;
  platforms: Platforms;
  platform: string;
  identity: string;
  browser_language: string;
  ad_content: Record<string, any>;
}