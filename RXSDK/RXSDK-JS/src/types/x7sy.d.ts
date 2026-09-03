interface QueriesX7SY {
  /** 当前游戏的 game_key */
  game_key: string
  /** 时间戳是 1970-1-1 至今秒数，表示进入游戏的时间。 */
  stime: string
  /** 认证票据，用于获取小 7 游戏中心唯一用户
   * 是一个MD5 后的 32 位的字符串，每次请求都是不同的
   * */
  ticket: string
  sign: string
}

interface X7SYRoleParams {
  game_key: string
  user_id: string
  role_name: string
  game_area: string
  role_sign: string
  complete (data: X7SYRoleCallbackData): void
}

interface X7SYRoleCallbackData {
  errorno: number
  errormsg: string
}

interface X7SYPayParams {
  pay_obj: {
    /** 游戏道具描述 */
    description: string
    /** 透传参数 */
    extends_data: string
    /** 用户所在的游戏区信息 */
    game_area: string
    /** 用户所在的游戏服信息（如果区服不分，直接传与game_area相同值即可） */
    game_group: string
    game_key: string
    /** 用户在游戏中的等级 */
    game_level: string
    /** 游戏的唯一订单号 */
    game_orderid: string
    /** 道具支付金额 */
    game_price: string
    /** 用户的角色信息 */
    game_role_id: string
    /** 固定是-1，当一个游戏中存在多个支付回调地址的时候就需要修改这个参数，否则填写固定值-1就行了。 */
    notify_id: -1
    /** 当前时间戳(秒) */
    stime: string
    /** 游戏道具名称: 道具名称_道具价格  */
    subject: string
    /** 小 7 游戏中心提供的用户的唯一标识 */
    user_id: string
    pay_sign: string
    /** 游戏角色名称 */
    game_role_name: string
  }
  complete (data: X7SYRoleCallbackData): void
}

interface X7SYOrderParams extends IRequestPay {
  ext: {
    game_area: string
    game_group: string
    game_role_id: string
    user_id: string
    game_role_name: string
  },
}

interface X7SYShareParams {
  game_logo: string
  show_name: string
  one_game_info: string
  complete (data: X7SYRoleCallbackData): void
}

declare class xqhGame {
  game_role_callback: (data: X7SYRoleParams) => void
  pay (data: X7SYPayParams): void
  h5game_share (data: X7SYShareParams): void
}
