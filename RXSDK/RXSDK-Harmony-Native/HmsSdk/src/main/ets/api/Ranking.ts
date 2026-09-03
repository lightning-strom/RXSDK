import { RXRequest } from '../net/RXRequest';
import { RCallback } from '../types/Index'

/**
 * 排行榜
 */
const RANK_ADDSCORE = "v1/social/rank/addscore";
const RANK_SETSCORE = "v1/social/rank/setscore";
const RANK_QUERYUSERRANK = "v1/social/rank/queryuserrank";
const RANK_GETRANKLIST = "v1/social/rank/getranklist";
const RANK_FRIENDSRANK = "v1/social/rank/friendsrank";


export interface IRanking {
  /** 增加用户分数
   * @param hashMap  rank_id  string  是  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）  0_100_168_weekly
   *                 score  int  是  增加的分数值  100
   * @param callback callback
   */
  addScore(args: { rank_id: string , score: number }, callback: RCallback);

  /** 设置用户分数
   * @param hashMap  rank_id  string  是  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）  0_100_168_weekly
   *                 score  int  是  增加的分数值  100
   * @param callback callback
   */
  setScore(args: { rank_id: string, score: number }, callback: RCallback);

  /** 查询用户分数
   * @param hashMap  rank_id  string  是  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）  0_100_168_weekly
   *                 open_id  string  是  目标用户 OpenID  rxuSl4QZoNk0G1HY2-Za6GlO7wO-p_ej
   * @param callback callback
   */
  queryUserRank(args: { rank_id: string, open_id: string }, callback: RCallback);

  /** 获取排行榜列表
   * @param hashMap  rank_id  string  是  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）  0_100_168_weekly
   *                 start_rank  int  是  获取排行榜开始排名。取值[1,榜单容量)。可以用于分页加载  1
   *                 end_rank  int  是  获取排行榜结束排名。取值[1,榜单容量]。可以用于分页加载  2
   * @param callback callback
   */
  getRankList(args: { rank_id: string, start_rank: number, end_rank: number }, callback: RCallback);

  /** 获取好友排行榜列表
   * @param hashMap  rank_id  string  是  字符串本身带有类型信息，格式为：Flag_榜单容量_重置周期_自定义标识（flag是一个int64位标记，用以扩展和规定绑定属性）  0_100_168_weekly
   * @param callback callback
   */
  friendsRank(args: { rank_id: string }, callback: RCallback);

}


class Ranking implements IRanking {
  addScore(args: { rank_id: string, score: number }, callback: RCallback<object>) {
    return RXRequest.post(RANK_ADDSCORE, args, null, callback)
  }

  setScore(args: { rank_id: string, score: number }, callback: RCallback<object>) {
    return RXRequest.post(RANK_SETSCORE, args, null, callback)
  }

  queryUserRank(args: { rank_id: string, open_id: string }, callback: RCallback<object>) {
    return RXRequest.post(RANK_QUERYUSERRANK, args, null, callback)
  }

  getRankList(args: { rank_id: string, start_rank: number, end_rank: number }, callback: RCallback<object>) {
    return RXRequest.post(RANK_GETRANKLIST, args, null, callback)
  }

  friendsRank(args: { rank_id: string }, callback: RCallback<object>) {
    return RXRequest.post(RANK_FRIENDSRANK, args, null, callback)
  }
}

export default new Ranking()