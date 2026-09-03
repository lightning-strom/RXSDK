import { FeedbackItemBean, IFeedback, RCallback } from '../types/Index';
export interface FeedbackListBean {
    page: number;
    size: number;
    total: number;
    list: FeedbackItemBean[];
}
export interface FeedbackPropBean {
    name: string;
    tag: string;
    num: string;
    time_limit: number;
    icon: string;
    count: string;
    describe: string;
}
/**
 *https://doc.ruixueyun.com/#/view?viewPath=0df8e106-be3d-4df1-97fe-cf6129ea811c&title=%E5%93%8D%E5%BA%94%E7%BB%93%E6%9E%84(JSON)&tab=&index=3
 */
export interface FeedbackDetailBean {
    id: number;
    content: string;
    attachments: string[];
    created_at: string;
    status: number;
    recover_at: string;
    recover_attachments: string[];
    recover_content: string;
    is_prop: number;
    prop: FeedbackPropBean[];
    get_prop: number;
}
declare class Feedback implements IFeedback {
    /**
     * 创建意见反馈
     * @param content 返回内容
     * @param attachments 上传附件
     * @param phone 电话号
     * @param tags 标签标识， 游戏透传
     * @param callback 回调
     */
    feedbackCreate(j: string, k: string[], l: string, m?: string[]): Promise<import("../types/Index").RXResult<object>>;
    /**
     * 获取列表T
     * @param page 页数， 从1开始
     * @param size 每页大小
     * @param status 1 未处理 2已处理
     * @param callback 回调
     */
    getFeedbackList(e?: number, f?: number, g?: number, h?: RCallback): Promise<import("../types/Index").RXResult<object>>;
    /**
     * 获取反馈详情
     * @param id 反馈id
     * @param callback 回调
     */
    getFeedbackDetail(c: number, d?: RCallback): Promise<import("../types/Index").RXResult<object>>;
    /**
     * 领取道具
     * @param id 反馈id
     * @param callback 回调
     */
    feedbackGetprop(a: number, b?: RCallback): Promise<import("../types/Index").RXResult<object>>;
}
declare const _default: Feedback;
export default _default;
