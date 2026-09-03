import { RXRequest } from "@normalized:N&&&hmssdk/src/main/ets/net/RXRequest&4.0.0";
import type { RCallback } from '../types/Index';
const RANK_ADDSCORE = "v1/social/rank/addscore";
const RANK_SETSCORE = "v1/social/rank/setscore";
const RANK_QUERYUSERRANK = "v1/social/rank/queryuserrank";
const RANK_GETRANKLIST = "v1/social/rank/getranklist";
const RANK_FRIENDSRANK = "v1/social/rank/friendsrank";
export interface IRanking {
    addScore(args: {
        rank_id: string;
        score: number;
    }, callback: RCallback);
    setScore(args: {
        rank_id: string;
        score: number;
    }, callback: RCallback);
    queryUserRank(args: {
        rank_id: string;
        open_id: string;
    }, callback: RCallback);
    getRankList(args: {
        rank_id: string;
        start_rank: number;
        end_rank: number;
    }, callback: RCallback);
    friendsRank(args: {
        rank_id: string;
    }, callback: RCallback);
}
class Ranking implements IRanking {
    addScore(r2: {
        rank_id: string;
        score: number;
    }, s2: RCallback<object>) {
        return RXRequest.post(RANK_ADDSCORE, r2, null, s2);
    }
    setScore(p2: {
        rank_id: string;
        score: number;
    }, q2: RCallback<object>) {
        return RXRequest.post(RANK_SETSCORE, p2, null, q2);
    }
    queryUserRank(n2: {
        rank_id: string;
        open_id: string;
    }, o2: RCallback<object>) {
        return RXRequest.post(RANK_QUERYUSERRANK, n2, null, o2);
    }
    getRankList(l2: {
        rank_id: string;
        start_rank: number;
        end_rank: number;
    }, m2: RCallback<object>) {
        return RXRequest.post(RANK_GETRANKLIST, l2, null, m2);
    }
    friendsRank(j2: {
        rank_id: string;
    }, k2: RCallback<object>) {
        return RXRequest.post(RANK_FRIENDSRANK, j2, null, k2);
    }
}
export default new Ranking();
