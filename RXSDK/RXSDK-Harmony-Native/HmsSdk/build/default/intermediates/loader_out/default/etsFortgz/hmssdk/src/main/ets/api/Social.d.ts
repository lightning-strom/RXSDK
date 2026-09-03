import { RCallback } from '../types/Index';
import { ISocial } from './ISocial';
declare class Social implements ISocial {
    lbsRadius(z6: {
        types: string;
        lon: number;
        lat: number;
        radius: number;
        count: number;
        page: number;
        page_size: number;
    }, a7?: RCallback): Promise<import("../types/Index").RXResult<object>>;
    lbsDelete(x6: {
        types: string[];
    }, y6?: RCallback): Promise<import("../types/Index").RXResult<object>>;
    userSetCustom(v6: {
        custom: string;
    }, w6?: RCallback): Promise<import("../types/Index").RXResult<object>>;
    relationAdd(t6: {
        target: string;
        types: Record<string, any>;
        target_remarks: string;
        user_remarks: string;
    }, u6?: RCallback): Promise<import("../types/Index").RXResult<object>>;
    relationDelete(r6: {
        target: string;
        types: Record<string, any>;
    }, s6?: RCallback): Promise<import("../types/Index").RXResult<object>>;
    updateRemarks(p6: {
        target: string;
        type: string;
        target_remark: string;
    }, q6?: RCallback): Promise<import("../types/Index").RXResult<object>>;
    hasRelation(n6: {
        target: string;
        type: string;
    }, o6?: RCallback): Promise<import("../types/Index").RXResult<object>>;
    relationList(l6: {
        type: string;
    }, m6?: RCallback): Promise<import("../types/Index").RXResult<object>>;
    addFriends(j6: {
        target: string;
        target_remarks: string;
        user_remarks: string;
    }, k6?: RCallback): Promise<import("../types/Index").RXResult<object>>;
    removeFriends(h6: {
        target: string;
    }, i6?: RCallback): Promise<import("../types/Index").RXResult<object>>;
    updateFriendRemarks(f6: {
        target: string;
        target_remarks: string;
    }, g6?: RCallback): Promise<import("../types/Index").RXResult<object>>;
    isFriend(d6: {
        target: string;
    }, e6?: RCallback): Promise<import("../types/Index").RXResult<object>>;
    relationFriends(b6?: Record<string, any>, c6?: RCallback): Promise<import("../types/Index").RXResult<object>>;
    lbsUpdate(z5: {
        types: string[];
        lon: number;
        lat: number;
    }, a6?: RCallback): Promise<import("../types/Index").RXResult<object>>;
}
declare const _default: Social;
export default _default;
