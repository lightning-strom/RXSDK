import { RCallback } from '../types/Index';
export interface IRanking {
    /** 增加用户分数
     * @param hashMap  rank_id  string  是  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）  0_100_168_weekly
     *                 score  int  是  增加的分数值  100
     * @param callback callback
     */
    addScore(args: {
        rank_id: string;
        score: number;
    }, callback: RCallback): any;
    /** 设置用户分数
     * @param hashMap  rank_id  string  是  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）  0_100_168_weekly
     *                 score  int  是  增加的分数值  100
     * @param callback callback
     */
    setScore(args: {
        rank_id: string;
        score: number;
    }, callback: RCallback): any;
    /** 查询用户分数
     * @param hashMap  rank_id  string  是  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）  0_100_168_weekly
     *                 open_id  string  是  目标用户 OpenID  rxuSl4QZoNk0G1HY2-Za6GlO7wO-p_ej
     * @param callback callback
     */
    queryUserRank(args: {
        rank_id: string;
        open_id: string;
    }, callback: RCallback): any;
    /** 获取排行榜列表
     * @param hashMap  rank_id  string  是  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）  0_100_168_weekly
     *                 start_rank  int  是  获取排行榜开始排名。取值[1,榜单容量)。可以用于分页加载  1
     *                 end_rank  int  是  获取排行榜结束排名。取值[1,榜单容量]。可以用于分页加载  2
     * @param callback callback
     */
    getRankList(args: {
        rank_id: string;
        start_rank: number;
        end_rank: number;
    }, callback: RCallback): any;
    /** 获取好友排行榜列表
     * @param hashMap  rank_id  string  是  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）  0_100_168_weekly
     * @param callback callback
     */
    friendsRank(args: {
        rank_id: string;
    }, callback: RCallback): any;
}
declare class Ranking implements IRanking {
    addScore(r2: {
        rank_id: string;
        score: number;
    }, s2: RCallback<object>): Promise<import("../types/Index").RXResult<object>>;
    setScore(p2: {
        rank_id: string;
        score: number;
    }, q2: RCallback<object>): Promise<import("../types/Index").RXResult<object>>;
    queryUserRank(n2: {
        rank_id: string;
        open_id: string;
    }, o2: RCallback<object>): Promise<import("../types/Index").RXResult<object>>;
    getRankList(l2: {
        rank_id: string;
        start_rank: number;
        end_rank: number;
    }, m2: RCallback<object>): Promise<import("../types/Index").RXResult<object>>;
    friendsRank(j2: {
        rank_id: string;
    }, k2: RCallback<object>): Promise<import("../types/Index").RXResult<object>>;
}
declare const _default: Ranking;
export default _default;
