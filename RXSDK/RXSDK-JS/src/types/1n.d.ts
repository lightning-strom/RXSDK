interface Queries1n {
  /** 透传信息，在支付跳转时原样返回 */
  channelExt: string
  /** CP方分配给运营方的账号（没有则游戏ID） */
  email: string
  /** 游戏编号----运营方为游戏分配的唯一编号 */
  game_appid: string
  /** 当前时间戳 */
  new_time: string
  /** 用于CP要求平台特别传输其他参数，默认是访问ip */
  loginplatform2cp: string
  /** 用户唯一ID */
  user_id: string
  /** 调起登录和支付sdk的域名 */
  sdklogindomain: string
  /** 调起登录和支付sdk的模块,，不是固定值,拉起登录和支付时需原样返回（运营方特殊要求） */
  sdkloginmodel: string
  /** 按照上方签名机制进行签名 */
  sign: string
  /** 用户头像，不参与加密 */
  icon: string
  /** 用户昵称，不参与加密 */
  nickname: string
}

interface RoleParams1N {
  /** 运营方登录时传递的user_id */
  user_id: string
  /** 游戏编号----运营方为游戏分配的唯一编号 */
  game_appid: string
  /** 区服id */
  server_id: string
  /** 区服名称 */
  server_name: string
  /** 角色id */
  role_id: string
  /** 角色名 */
  role_name: string
  /** 角色等级 */
  level: string
  /** 按照上方签名机制进行签名 */
  sign: string
}

interface PayParams1N {
  /** 金额，单位为分 */
  amount: string
  /** 原样返回登陆时透传的信息 */
  channelExt: string
  /** 游戏编号----运营方为游戏分配的唯一编号 */
  game_appid: string
  /** 道具名称 */
  props_name: string
  /** 订单编号（CP方订单号） */
  trade_no: string
  /** 运营方用户ID */
  user_id: string
  /** 登录时的传递的参数 */
  sdkloginmodel: string
  /** 按照上方签名机制进行签名 */
  sign: string
  /** 区服id（不参与加密） */
  server_id: string
  /** 区服名称（不参与加密） */
  server_name: string
  /** 角色id（不参与加密） */
  role_id: string
  /** 角色名（不参与加密）   */
  role_name: string
}

interface PayOrder1N extends IRequestPay {
  ext: {
    channelExt: string
    user_id: string
    game_role_name: string
    sdkloginmodel: string
    server_id: string,
    server_name: string,
    role_id: string,
    role_name: string,
  },
}

interface PayResult1N {
  status: number // 1 成功
}

interface API1N {
  jointCreateRole: (data: Stringified<RoleParams1N>) => void
  h5paySdk: (data: PayParams1N, callback?: (data: PayResult1N) => void) => void
}
