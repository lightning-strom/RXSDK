import { RXRequest } from "@normalized:N&&&hmssdk/src/main/ets/net/RXRequest&4.0.0";
import type { RCallback } from '../types/Index';
import type { ISocial } from './ISocial';
const LBS_UPDATE = "v1/social/lbs/update";
const USER_SET_CUSTOM = "v1/social/user/setcustom";
const LBS_RADIUS = "v1/social/lbs/radius";
const LBS_DELETE = "v1/social/lbs/delete";
const RELATION_ADD = "v1/social/relation/add";
const RELATION_DELETE = "v1/social/relation/delete";
const RELATION_UPDATE_REMARKS = "v1/social/relation/updateremarks";
const RELATION_HAS_RELATION = "v1/social/relation/hasrelation";
const RELATION_LIST = "v1/social/relation/list";
const RELATION_ADD_FRIEND = "v1/social/relation/addfriend";
const RELATION_DEL_FRIEND = "v1/social/relation/delfriend";
const RELATION_UPDATE_FRIEND_REMARKS = "v1/social/relation/updatefriendremarks";
const RELATION_IS_FRIEND = "v1/social/relation/isfriend";
const RELATION_FRIENDS = "v1/social/relation/friends";
const RANK_ADDSCORE = "v1/social/rank/addscore";
const RANK_SETSCORE = "v1/social/rank/setscore";
const RANK_QUERYUSERRANK = "v1/social/rank/queryuserrank";
const RANK_GETRANKLIST = "v1/social/rank/getranklist";
const RANK_FRIENDSRANK = "v1/social/rank/friendsrank";
class Social implements ISocial {
    lbsRadius(z6: {
        types: string;
        lon: number;
        lat: number;
        radius: number;
        count: number;
        page: number;
        page_size: number;
    }, a7?: RCallback) {
        return RXRequest.post(LBS_RADIUS, z6, null, a7);
    }
    lbsDelete(x6: {
        types: string[];
    }, y6?: RCallback) {
        return RXRequest.post(LBS_DELETE, x6, null, y6);
    }
    userSetCustom(v6: {
        custom: string;
    }, w6?: RCallback) {
        return RXRequest.post(USER_SET_CUSTOM, v6, null, w6);
    }
    relationAdd(t6: {
        target: string;
        types: Record<string, any>;
        target_remarks: string;
        user_remarks: string;
    }, u6?: RCallback) {
        return RXRequest.post(RELATION_ADD, t6, null, u6);
    }
    relationDelete(r6: {
        target: string;
        types: Record<string, any>;
    }, s6?: RCallback) {
        return RXRequest.post(RELATION_DELETE, r6, null, s6);
    }
    updateRemarks(p6: {
        target: string;
        type: string;
        target_remark: string;
    }, q6?: RCallback) {
        return RXRequest.post(RELATION_UPDATE_REMARKS, p6, null, q6);
    }
    hasRelation(n6: {
        target: string;
        type: string;
    }, o6?: RCallback) {
        return RXRequest.post(RELATION_HAS_RELATION, n6, null, o6);
    }
    relationList(l6: {
        type: string;
    }, m6?: RCallback) {
        return RXRequest.post(RELATION_LIST, l6, null, m6);
    }
    addFriends(j6: {
        target: string;
        target_remarks: string;
        user_remarks: string;
    }, k6?: RCallback) {
        return RXRequest.post(RELATION_ADD_FRIEND, j6, null, k6);
    }
    removeFriends(h6: {
        target: string;
    }, i6?: RCallback) {
        return RXRequest.post(RELATION_DEL_FRIEND, h6, null, i6);
    }
    updateFriendRemarks(f6: {
        target: string;
        target_remarks: string;
    }, g6?: RCallback) {
        return RXRequest.post(RELATION_UPDATE_FRIEND_REMARKS, f6, null, g6);
    }
    isFriend(d6: {
        target: string;
    }, e6?: RCallback) {
        return RXRequest.post(RELATION_IS_FRIEND, d6, null, e6);
    }
    relationFriends(b6?: Record<string, any>, c6?: RCallback) {
        return RXRequest.post(RELATION_FRIENDS, b6, null, c6);
    }
    lbsUpdate(z5: {
        types: string[];
        lon: number;
        lat: number;
    }, a6?: RCallback) {
        return RXRequest.post(LBS_UPDATE, z5, null, a6);
    }
}
export default new Social();
