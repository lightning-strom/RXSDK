import type { RCallback } from "../types/Index";
export interface ISocial {
    lbsUpdate(args: {
        types: string[];
        lon: number;
        lat: number;
    }, callback?: RCallback);
    lbsRadius(args: {
        types: string;
        lon: number;
        lat: number;
        radius: number;
        count: number;
        page: number;
        page_size: number;
    }, callback?: RCallback);
    lbsDelete(args: {
        types: string[];
    }, callback?: RCallback);
    userSetCustom(args: {
        custom: string;
    }, callback?: RCallback);
    relationAdd(args: {
        target: string;
        types: Record<string, any>;
        target_remarks: string;
        user_remarks: string;
    }, callback?: RCallback);
    relationDelete(args: {
        target: string;
        types: Record<string, any>;
    }, callback?: RCallback);
    updateRemarks(args: {
        target: string;
        type: string;
        target_remark: string;
    }, callback?: RCallback);
    hasRelation(args: {
        target: string;
        type: string;
    }, callback?: RCallback);
    relationList(args: {
        type: string;
    }, callback?: RCallback);
    addFriends(args: {
        target: string;
        target_remarks: string;
        user_remarks: string;
    }, callback?: RCallback);
    removeFriends(args: {
        target: string;
    }, callback?: RCallback);
    updateFriendRemarks(args: {
        target: string;
        target_remarks: string;
    }, callback?: RCallback);
    isFriend(args: {
        target: string;
    }, callback?: RCallback);
    relationFriends(args?: Record<string, any>, callback?: RCallback);
}
