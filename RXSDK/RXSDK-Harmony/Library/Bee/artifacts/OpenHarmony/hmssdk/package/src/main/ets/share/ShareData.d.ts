import { ShareParams } from "../types/Index";
export interface Trigger {
    id: number;
    tag: string;
    title: string;
    failed_msg: string;
    type: number;
    time_interval: number;
}
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
export interface Content extends ShareParams {
    material_id: number;
    landing_id: number;
    meta_source: number;
}
export interface Platforms {
    wechat: number;
    qq: number;
    system: number;
}
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
