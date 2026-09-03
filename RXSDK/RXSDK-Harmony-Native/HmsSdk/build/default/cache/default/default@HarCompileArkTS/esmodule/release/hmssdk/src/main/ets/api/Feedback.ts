import { RXRequest } from "@normalized:N&&&hmssdk/src/main/ets/net/RXRequest&4.0.0";
import type { FeedbackItemBean, IFeedback, RCallback } from '../types/Index';
enum FBAPI {
    Create = "v1/feedbackapi/player_feedback/create",
    List = "v1/feedbackapi/player_feedback/list",
    Detail = "v1/feedbackapi/player_feedback/detail",
    GetProp = "v1/feedbackapi/player_feedback/getprop"
}
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
interface FeedBackArgs {
    content: string;
    attachments?: string[];
    phone: string;
    tags?: String[];
}
interface FeedBackListArgs {
    page: number;
    size: number;
    status?: number;
}
class Feedback implements IFeedback {
    public async feedbackCreate(j: string, k: string[], l: string, m?: string[]) {
        return await RXRequest.post<object>(FBAPI.Create, {
            content: j,
            attachments: k,
            phone: l,
            tags: m
        });
    }
    public async getFeedbackList(e: number = 1, f: number = 20, g?: number, h?: RCallback) {
        let i = {
            page: e,
            size: f
        };
        if (g && g != 0) {
            i["status"] = g;
        }
        return await RXRequest.get<object>(FBAPI.List, i, null, h);
    }
    public async getFeedbackDetail(c: number, d?: RCallback) {
        return await RXRequest.get<object>(FBAPI.Detail, {
            id: c
        }, null, d);
    }
    public async feedbackGetprop(a: number, b?: RCallback) {
        return await RXRequest.post<object>(FBAPI.GetProp, {
            id: a
        }, null, b);
    }
}
export default new Feedback();
