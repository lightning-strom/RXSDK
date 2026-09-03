interface Queries7k7k {
  /** 7k7k用户ID */
  userid: string
  /** 用户名(encodeURIComponent) */
  userName: string
  /** 过期时间戳 */
  time: string
  /** 是否成年 */
  isAdult: string
  /** 头像地址 */
  avatar: string
  /** 性别 */
  sex: string
  /** 平台自定义参数 */
  vaildCode: string
  /** 签名串 */
  sign: string
  /** 分享透传参数 */
  extra?: string
}

interface Is7k7kOrderInfo {
  /**
   * @param {int} code 支付安全码
   * @param {int} status 状态码
   */
  code: number,
  status: number,
}

interface API7k7k {
  /**
   * 角色登录
   *
   * @param {int} server 服务器编号，默认为0
   * @param {int} roleId 角色id，默认为0
   * @param {int} isNew 是否当前新创建角色，否为0，是为1
   * @param {String} roleName 角色名，默认为''
   * @param {int} level 等级，默认为1
   * @param {int} isVip 是否是VIP，否为0，是为1
   */
  roleLogin: (server?: number, roleId?: number, isNew?: 0 | 1, roleName?: string, level?: number, isVip?: 0 | 1) => void
  logout: () => void
  /**
   * 玩家点击充值，打开支付
   *
   * @param {Int} money 充值金额（人民币：元） 只能为整数
   * @param {String} mark 游戏的充值订单编号 最多64位
   * @param {String} server 服务器编号 不能为空或者0
   * @param {String} extra 透传参数，用于充值成功后的服务端回调地址
   */
  Pay: () => void
}
