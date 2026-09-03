import { RCallback } from "../types/Index";
export interface ISocial {
    /**
     * 上报/更新经纬度坐标
     *  @param args  字典参数
     *  <param name="types">坐标分组，由 CP 自定义</param>
        <param name="lon"经度</param>
        <param name="lat">纬度</param>
     * @param callback 回调函数
     */
    lbsUpdate(args: {
        types: string[];
        lon: number;
        lat: number;
    }, callback?: RCallback): any;
    /**
     * 获取指定半径内的其他用户信息
     * @param args  字典参数
     *<param name="types">坐标分组，由 CP 自定义</param>
     <param name="lon">WGS84 经度</param>
     <param name="lat">WGS84 纬度</param>
     <param name="radius">限定半径距离，单位：米</param>
     <param name="count">获取数量，0 表示获取全部</param>
     <param name="page">获取第几页的数据 从 1 开始</param>
     <param name="page_size">每页数量</param>
     * @param callback 回调函数
     */
    lbsRadius(args: {
        types: string;
        lon: number;
        lat: number;
        radius: number;
        count: number;
        page: number;
        page_size: number;
    }, callback?: RCallback): any;
    /**
     * 删除经纬度坐标
     *
     * @param args  字典参数
     * <param name="types">坐标分组，由 CP 自定义</param>
     * @param callback 回调函数
     */
    lbsDelete(args: {
        types: string[];
    }, callback?: RCallback): any;
    /**
     * 给用户设置CP的自定义信息
     *
     * @param args  字典参数
     *    <param name="custom">用户自定义信息</param>
     * @param callback 回调函数
     */
    userSetCustom(args: {
        custom: string;
    }, callback?: RCallback): any;
    /**
     * 添加自定关系
     *
     * @param args  target  string  是  对方 OpenID
     *                 types  any  是  "CP 自定义关系类型列表，其值是一个 字典简直对列表，格式为：{类型标识符(string):是否为双向关系}"
     *                 target_remarks  string  否  用户给Target设置的备注信息（最长512字符）
     *                 user_remarks  string  否  Target给用户设置的备注信息（最长512字符）
     * @param callback 回调函数
     */
    relationAdd(args: {
        target: string;
        types: Record<string, any>;
        target_remarks: string;
        user_remarks: string;
    }, callback?: RCallback): any;
    /**
     * 删除自定关系
     *
     * @param args  target  string  是  对方 OpenID
     *              types  any  是  "CP 自定义关系类型列表，其值是一个 字典简直对列表，格式为：{类型标识符(string):是否为双向关系}"
     * @param callback 回调函数
     */
    relationDelete(args: {
        target: string;
        types: Record<string, any>;
    }, callback?: RCallback): any;
    /**
     * 更新自定关系备注
     *
     * @param args target  string  是  对方 OpenID
     *                type  string  是  CP 自定义关系类型
     *                target_remarks  string  否  用户给Target设置的备注信息（最长512字符）
     */
    updateRemarks(args: {
        target: string;
        type: string;
        target_remark: string;
    }, callback?: RCallback): any;
    /**
     * 判断两用户是否存在某自定关系
     *
     * @param args  target  string  是  对方 OpenID
     *                 type  string  是  CP 自定义关系类型
     * @param callback callback
     */
    hasRelation(args: {
        target: string;
        type: string;
    }, callback?: RCallback): any;
    /**
     * 获取自定关系列表
     *
     * @param args  字典参数
     * <param name="type">CP 自定义关系类型</param>
     * @param callback 回调函数
     */
    relationList(args: {
        type: string;
    }, callback?: RCallback): any;
    /**
     * 添加好友列表
     *
     * @param args  字典参数
     *    <param name="target"></param>
      <param name="target_remarks"></param>
      <param name="user_remarks"></param>
     * @param callback 回调函数
     */
    addFriends(args: {
        target: string;
        target_remarks: string;
        user_remarks: string;
    }, callback?: RCallback): any;
    /**
     * 删除好友
     * @param args  字典参数
     *    <param name="target">对方 OpenID  </param>
     * @param callback 回调函数
     */
    removeFriends(args: {
        target: string;
    }, callback?: RCallback): any;
    /**
     * 更新好友关系备注
     *    <param name="target">对方 OpenID</param>
      <param name="target_remarks">用户给 Target 设置的备注信息（最长 512 字符）</param>
     */
    updateFriendRemarks(args: {
        target: string;
        target_remarks: string;
    }, callback?: RCallback): any;
    /**
     * 判断两用户是否为好友
     *   <param name="target">对方 OpenID  </param>
     */
    isFriend(args: {
        target: string;
    }, callback?: RCallback): any;
    /**
     * 获取好友列表
     *
     * @param args  字典参数
     * @param callback 回调函数
     */
    relationFriends(args?: Record<string, any>, callback?: RCallback): any;
}
