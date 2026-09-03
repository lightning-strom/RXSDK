interface H5UCLoginParam {
  method: 'minigame_uc'
  login_openid?: string, //二次登录的openid
  ext?: {
    [key: string]: any
  }
}

interface H5UCPayParam {
  pay_type: 'minigame_uc',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  }
  exchange?: boolean
}

interface H54399LoginParam {
  method: 'minigame_4399h5'
  login_openid?: string, //二次登录的openid
  ext?: {
    [key: string]: any
  }
}

interface H54399PayParam {
  pay_type: 'minigame_4399h5',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  }
  exchange?: boolean
}

interface H5QunheiLoginParam {
  method: 'minigame_qunhei'
  login_openid?: string, //二次登录的openid
  ext?: {
    [key: string]: any
  }
}

interface H5QunheiPayParam {
  pay_type: 'minigame_qunhei',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  }
  exchange?: boolean
}

interface H5QunheiVerifyParam {
  type: 1 | 2 | 3 // 1 - 检查是否开启验证接口 2 - 获取是否验证成功接口 3 - 拉起验证弹窗接口
}

interface H5QunheiServerAddParam {
  unid: string // 后台登录账号
  gid: number // 游戏id
  servernum: number // 开服数
  kftime: number // 开服日期(2019-11-08)
  ddtime: number // 开服时间(12:00)
  sign: number // 加密验证参数(加密规则：MD5(unid + servernum + gid + kftime + key)这里的key是提交到后台的登录key,加号为连接符)
}

interface H5QunheiUpOnlineParam {
  userid: string // 登录账号id
  gid: number // 游戏id
  type: number // 1上线，2下线
  serverid: number // 服务器id
  time: number // 行为时间,UnixTime 标准时间，单位秒。示 例：1616918879
  logintime: number // 打开游戏时间,UnixTime 标准时间，单位秒。示 例：1616918879
  sign: number // 加密验证参数(加密规则：MD5(userid + serverid + gid + time + key)这里的key是提交到后台的登录key,加号为连接符)
}

interface H5QunheiUpRoleParam {
  act: number // 1=创建角色，2=登录角色，3=角色升级
  username: string // 登录账号(登录接口username)
  serverid: number // 区服id
  servername: string // 区服名称
  rolename: string // 角色名称
  roleid: number // 角色id
  level: number // 角色等级(没有传0)
  power: number // 角色战力(没有传0)
  vip: number // vip等级(没有传0)
  rolecreatetime: string // 角色创建时间戳(没有传0)
  ver: string // 版本号固定值1
  sign: string // 验证签名(需要在后端计算签名)，md5(act_username_serverid_roleid_level_power_vip_rolecreatetime_ver_key) 这里传递的md5字串为小写字母,_需算入加密, 这里的key是提交到后台的登录key
}

interface H5BaiduLoginParam {
  method: 'minigame_baiduh5'
  login_openid?: string, //二次登录的openid
  ext?: {
    [key: string]: any
  }
}

interface H5BaiduPayParam {
  pay_type: 'minigame_baiduh5',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  }
}

interface H5QiqiLoginParam {
  method: 'minigame_77'
  login_openid?: string, //二次登录的openid
  ext?: {
    [key: string]: any
  }
}

interface H5QiqiPayParam {
  pay_type: 'minigame_77',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  }
  exchange?: boolean
}

interface H5XunleiLoginParam {
  method: 'minigame_xunlei'
  login_openid?: string, //二次登录的openid
  ext?: {
    [key: string]: any
  }
}

interface H5XunleiPayParam {
  pay_type: 'minigame_xunlei',
  // call_type?: 'superPay' | 'openPayPanel'
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  }
  exchange?: boolean
}

interface H5XunleiSyncServerParam {
  game_id: string // 游戏标识
  time: number // 当前时间戳
  servers: string // 区服列表 json 串 "[{"name":"迅雷一服","server_id":12222222,"open_at":"2024-04-16 18:00:00"}]"
  sign: string // 签名
}

interface H5XunleiMessageSyncParam {
  game_id: string // 游戏标识
  account: string // 迅雷平台账号
  server_id: string // 区服 ID
  server_create_time: string // 开服时间
  role_id: string // 角色 ID
  role_name: string // 角色名称
  msg: string // 消息内容
  msg_type: 1 | 2 | 3 // 消息类型 ，1 - 世界 、 2 - 私聊、 3 - 其它
  sign: string // 签名
  ts: number // 时间戳（unix timestamp）
}

interface H5XunleiActionReportcParam {
  gameId: string // 游戏 Id
  event: 1 | 2 // 事件类型，1 - 创建角色，2 - 登录角色
  roleId: string // 角色标识
  roleName: string // 角色名称
  serverId?: string // 区服标识
  serverName?: string // 区服名称
}

interface H5ZuiyouLoginParam {
  method: 'minigame_zuiyou'
  login_openid?: string, //二次登录的openid
  ext?: {
    [key: string]: any
  }
}

interface H5ZuiyouPayParam {
  pay_type: 'minigame_zuiyou',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  }
  exchange?: boolean
}

interface H5RemianLoginParam {
  method: 'remianh5'
  login_openid?: string, //二次登录的openid
  ext?: {
    [key: string]: any
  }
}

interface H5RemianPayParam {
  pay_type: 'remianh5',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  region_id?: string, //地区ID
  ext: { //扩展字段
    [key: string]: any
  }
  exchange?: boolean
}

interface H5TestLoginParam {
  method: 'h5_test'
  login_openid?: string, //二次登录的openid
  ext?: {
    [key: string]: any
  }
}

interface H5TestPayParam {
  pay_type: 'h5_test',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段，用于百度页游支付
    gameId?: number, //百度分配的游戏ID
    cpServerId?: number | string, //区服编号
    amount?: number, //充值金额（单位：分）
    roleId?: string, //角色ID，非必填
    cpExtra?: string //补充信息，非必填
    [key: string]: any
  }
  exchange?: boolean
}

interface H5IQiYiLoginParam {
  method: 'minigame_iqiyi'
  login_openid?: string, //二次登录的openid
  ext?: {
    [key: string]: any
  }
}

interface H5IQiYiPayParam {
  pay_type: 'minigame_iqiyi',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  }
  exchange?: boolean
}
interface H5NewBaiduLoginParam {
  method: 'baiduh5'
  login_openid?: string, //二次登录的openid
  ext?: {
    [key: string]: any
  }
}
interface H5NewBaiduPayParam {
  pay_type: 'baiduh5',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  gameId?: number, //百度分配的游戏ID
  ext: { //扩展字段
    [key: string]: any
  }
  exchange?: boolean
}



interface H5HaluoLoginParam {
  method: 'minigame_haluo'
  login_openid?: string, //二次登录的openid
  ext?: {
    [key: string]: any
  }
}

interface H5HaluoPayParam {
  pay_type: 'minigame_haluo',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  }
  exchange?: boolean
}


interface H5ShandwLoginParam {
  method: 'minigame_shandw'
  login_openid?: string, //二次登录的openid
  ext?: {
    [key: string]: any
  }
}

interface H5ShandwPayParam {
  pay_type: 'minigame_shandw',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  pay_channel?: string, // 支付方式，默认为""，"alipay":调取支付宝支付，"weixin":调取微信支付
  ext: { //扩展字段
    [key: string]: any
  }
  exchange?: boolean
}

interface H5LenovoLoginParam {
  method: 'minigame_lenovo'
  login_openid?: string, //二次登录的openid
  ext?: {
    [key: string]: any
  }
}

interface H5LenovoPayParam {
  pay_type: 'minigame_lenovo',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  extraCommonParam: string, // 透传参数json格式
  server: string, // 区服名称
  role: string, // 角色名称
  ext: { //扩展字段
    [key: string]: any
  }
  exchange?: boolean
}

interface H5VngLoginParam {
  method: 'minigame_xunlei'
  login_openid?: string, //二次登录的openid
  ext?: {
    [key: string]: any
  }
}

interface H5VngPayParam {
  pay_type: 'minigame_xunlei',
  // call_type?: 'superPay' | 'openPayPanel'
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  },
  serverId: string,
  roleId: string,
  roleName: string,
  addInfo: string,
  exchange?: boolean,
}

interface H5FacebookLoginParam {
  method: 'minigame_fb'
  login_openid?: string, //二次登录的openid
  ext?: {
    [key: string]: any
  }
}

interface H5FacebookPayParam {
  pay_type: 'minigame_fb',
  // call_type?: 'superPay' | 'openPayPanel'
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  },
  serverId: string,
  roleId: string,
  roleName: string,
  addInfo: string,
  exchange?: boolean,
}

interface H5QuickLoginParam {
  method: 'minigame_quick'
  login_openid?: string, //二次登录的openid
  ext?: {
    [key: string]: any
  }
}

interface H5GankLoginParam {
  method: 'unicornh5'
  login_openid?: string //二次登录的openid
  gameid: any // 该ID由渠道在游戏接入前分配，是游戏的唯一标识
  ext?: {
    [key: string]: any
  }
}

interface H5QuickPayParam {
  pay_type: 'minigame_xunlei',
  // call_type?: 'superPay' | 'openPayPanel'
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  },
  userRoleId: string
  userRoleName: string
  serverId: number
  userServer: string
  userLevel: number
  quantifier: string
  exchange?: boolean
}

interface H5GankPayParam {
  pay_type: 'minigame_djs',
  wid: number, // 商品id
  serverid?: string, // 区服id
  username?: string, // 角色名称
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
}

interface H5QuickRoleReportParam {
  isCreateRole: boolean // 仅创建角色时传true,更新信息时传false
  roleCreateTime: number // 角色创建时间戳（秒）
  serverId: number // 区服ID
  serverName: string // 区服名称
  userRoleId: string // 游戏内角色ID
  userRoleName: string // 游戏内角色名称
  userRoleBalance: number // 角色游戏内货币余额
  vipLevel: number // 角色VIP等级
  userRoleLevel: number // 角色等级
  partyId: number // 公会/社团ID
  partyName: string // 公会/社团名称
  gameRoleGender?: string // 角色性别
  gameRolePower?: string // 角色战力
  partyRoleId?: number // 角色在帮派中的ID
  partyRoleName?: string // 角色在帮派中的名称
  professionId?: string // 角色职业ID
  profession?: string // 角色职业名称
  friendlist?: string // 角色好友列表
}

interface H5AwyLoginParam {
  method: 'minigame_aiweiyou'
  login_openid?: string, //二次登录的openid
  ext?: {
    [key: string]: any
  }
}

interface H5AwyPayParam {
  pay_type: 'minigame_aiweiyou',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  }
  exchange?: boolean
}

interface H5SimoLoginParam {
  method: 'minigame_007'
  login_openid?: string, //二次登录的openid
  ext?: {
    [key: string]: any
  }
}

interface H5SimoPayParam {
  pay_type: 'minigame_007',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  },
  server_id: string
  server_name: string
  role_id: string
  role_name: string
  role_level: number
  exchange?: boolean
}

interface H5SimoUpRoleParam {
  server_id: string // 区服id
  server_name: string // 区服名称
  role_action: 'create' | 'enter' | 'up_level' // 事件 (create：创角,enter：进入服务器,up_level：角色升级)
  role_id: string // 角色id
  role_name: string // 角色名
  role_level: number // 角色等级(没有传0)
  combat_number: string // 角色战力(没有传0)
  vip: number // vip等级(没有传0)
  timestamp: number // 角色创建时间戳(没有传0)
  sign: string // 验证签名
}

interface H5GametokLoginParam {
  method?: string
  login_openid?: string
  ext?: {
    uid?: string
    avatar?: string
    userName?: string
    userCoins?: number
    level?: number
    gender?: number
    testAccount?: boolean
    guest?: boolean
    [key: string]: any
  }
  [key: string]: any
}

interface H5GametokPayParam {
  pay_type: 'gametokh5'
  productId: string
  goods_tag: string
  trade_no: string
  currency?: string
  indulge_auth?: number
  age?: number
  is_debug?: number
  env?: number
  exchange?: boolean
  [key: string]: any
}

interface H5GametokShareParam {
  gameShareUrl: string
  [key: string]: any
}

interface InitH5Params {
  // 产品 id
  productId: string
  // 渠道id
  channelId: string
  // 客户端id
  cpid: string
  // 游戏id
  gameid?: string | number
  // 游戏id
  gameId?: string | number
  // 请求域名队列
  baseUrlList: string[]
  // 回调函数
  complete: (data: any) => void
  appkey?: string
  productCode?: string
  productKey?: string
  single_player_mode?: boolean
  logSwitch?: boolean
}
interface InitGankH5Params {
  // 产品 id
  productId: string
  // 渠道id
  channelId: string
  // 客户端id
  cpid: string
  // 游戏id
  gameid?: string | number
  // 请求域名队列
  baseUrlList: string[]
  // 回调函数
  complete: (data: any) => void
  appkey?: string
  productCode?: string
  productKey?: string
  single_player_mode?: boolean
  logSwitch?: boolean
}

interface H5TrackForReq {
  type: 'track' //事件类型（目前默认为 track，SDK自动设置） 1
  time: string //事件发生时间，格式为 yyyy-mm-dd hh:ii:ss.fff（SDK自动设置）1
  distinct_id: string //用户唯一标识，一般为 OpenID（由CP调用时传入）1
  devicecode: string //uuid sdk内部处理
  event: string //埋点标识（由CP调用时传入）
  uuid: string //本事件 uuid（SDK自动设置）1

  platform_id: 4 | 3 //平台ID（SDK自动设置）1
  cpid: number //CPID（SDK自动设置）1
  product_id?: string //应用ID（SDK自动设置）1
  channel_id?: string //渠道ID（SDK自动设置）1
  ip?: string //事件发生 IP，字符串类型 1
  sub_channel_id?: string //子渠道ID（SDK自动设置）
  properties?: { //CP 自定义属性（由CP调用时传入）
    [key: string]: any
  }
}

interface H5UCGetShareData {
  query?: string // 查询字符串，必须是 key1=val1&key2=val2 的格式。
  target?: string // wechat:微信好友，qq: qq好友，不设置的话会调起分享面板
}

interface H5AwyShareData {
  imageUrl?: string //分享的图片url
  query?: string //分享的页面路径的参数
}

interface H5Response<T = unknown> {
  code: number
  msg: string
  data?: T
}

interface H5ResponseLogin extends H5Response {
  tid: string
  token: string
  openid: string
  username: string
  nickname: string
  avatarUrl: string
  sex: 0 | 1
  /** 0:女; 1:男 **/
  timestamp: number
  ext?: {
    channel_userid?: string
  } & any
  regtime: string
  wxOpenid?: string
  /** 三方平台的唯一标识 */
  uid?: number
  source_openid: string // 分享来源第一个用户
  source: string
  user_flag: string
  cp_user_id: string
}


interface H5MethodParams<T = any> {
  complete: (data: T) => void
  fail?: (err: T) => void
}

interface H5getShareData {
  func?: string //分享的埋点
  transmits?: string //透传的参数
  imageUrl?: string //分享的图片url
  title?: string //分享的标题
  query?: string //分享的页面路径的参数
  region?: string // 地区码，没有则不传，会取全国地区的数据
  readCache?: boolean // 是否读取缓存，默认读取
}

interface H5sendCaptcha {
  email?: string //邮箱   (和参数phone二选一 全填写默认为手机号码)
  phone?: string //手机号码 (和参数email二选一  全填写默认为手机号码)
  purpose:
    | 'register'
    | 'bindphone'
    | 'unbindphone'
    | 'resetpwd'
    | 'bindemail'
    | 'unbindemail'
    | 'login'
    | 'setpwd' //发送意图 见备注
}

interface H5BindPhone {
  phone: string //手机
  captcha_code: string //验证码
  password: string //密码
}

type H5unBindPhone = Omit<H5BindPhone, 'password'>

type H5BindEmail = Omit<H5BindPhone, 'phone'> & { email: string }

type H5unBindEmail = Omit<H5BindEmail, 'password'>

type H5ReqMediaCheckAsync = {
  // 图片地址
  urls: string[]
  /**
   * 阿里鉴黄规则
   *    porn：图片智能鉴黄
   *    terrorism：图片暴恐涉政
   *    ad：图文违规
   *    qrcode：图片二维码
   *    live：图片不良场景
   *    logo：图片logo
   */
  scenes: string[]
}

type H5MediaCheckAsyncReqParams = Omit<H5ReqMediaCheckAsync, 'version' | 'openid'>

type H5megSecCheck = {
  content: string //	是	需检测的文本内容，文本字数的上限为2500字，需使用UTF-8编码
  version: 2 //是	接口版本号，2.0版本为固定值2
  scene: 1 | 2 | 3 | 4 //是	场景枚举值（1 资料；2 评论；3 论坛；4 社交日志）
  openid: string //是	用户的openid（用户需在近两小时访问过小程序）
  title?: string //否	文本标题，需使用UTF-8编码
  nickname?: string //否	用户昵称，需使用UTF-8编码
  signature?: string //否	个性签名，该参数仅在资料类场景有效(scene=1)，需使用UTF-8编码
}

type H5OmitMegSecCheck = Omit<H5megSecCheck, 'version' | 'openid'>

// 脚本类型
type H5ScriptType = 'js' | 'lua' | 'u3d'
// 输出文件后缀
type H5OutputFileSuffix = 'json' | 'lua'

interface H5CheckVersionParams {
  type?: H5ScriptType
  format?: H5OutputFileSuffix
}

interface H5CheckAppVersion extends H5CheckVersionParams {
  // 客户端版本号， 3段或4段
  clientversion: string
  // 客户端设备码 没有传唯一值，缓存使用
  devicecode?: string
  // 地区码， 默认0
  region?: number
}

interface H5CheckVersion extends H5CheckAppVersion {
  // key客户端游戏id value版本
  games?: object
  // key客户端活动别名 value版本
  activities?: object
}

interface H5CheckGameVersion extends H5CheckVersionParams {
  // 游戏id
  gameid: number
  // 客户端版本号
  gameversion: number
  // 优先检查这个版本，没用再返回最新版本
  gamecheckversion?: number
}

interface H5CheckActivityVersion extends H5CheckVersionParams {
  // 活动别名
  activityshortname: string
  // 客户端版本号
  activityversion: number
  // 优先检查这个版本，没用再返回最新版本
  activitycheckversion?: number
}

interface H5ReqBusinessData {
  // 窗口key
  window_key: string
  // 事件
  event: string
  // 前置事件，可传空
  before_event?: string
}

interface H5ReqBusinessOrder {
  // CP方订单号
  trade_no: string
  // 窗口签名
  sign: string
}

interface H5ReqCreateFeedback {
  product_id?: string
  channel_id?: string
  game_id: number
  kind_id: number
  kind_name: string
  // 紧急程度 1:紧急 2:不紧急
  priority: 1 | 2
  content: string
  picture: string
  player_gameid: string
  // 作废是否发邮件 1:发 2:不发
  send_voided_mails: 1 | 2
}

interface H5ReqFeedbackEval {
  key_number: number
  pleased_status: number
  reason: string
}

interface H5HelpcenterQuestionReq {
  // 问题编号
  id: number
}

interface H5HelpcenterResolution {
  // 问题编号
  id: number
  // 解决状态 true 已解决 false 未解决
  status: boolean
}

interface H5addRelation {
  target: string //对方 OpenID
  types: {
    //CP 自定义关系类型列表，其值是一个 map 简直对列表，格式为：
    [key: string]: boolean
  }
  target_remarks?: string //用户给Target设置的备注信息（最长512字符）
  user_remarks?: string //Target给用户设置的备注信息（最长512字符）
}

type h5_somes = 'target_remarks' | 'user_remarks'
type h5_some3 = 'types'
type h5_somes2 = 'user_remarks'

type H5deleteRelation = Omit<H5addRelation, h5_somes>
type H5updateremarks = Omit<H5addRelation, h5_somes2 | h5_some3> & H5relationlists
type H5HasRelation = Omit<H5addRelation, h5_somes | h5_some3> & H5relationlists
type H5addFriend = Omit<H5addRelation, h5_some3>
type H5relationlists = {
  type: string
}
type H5deleFriend = Pick<H5addRelation, 'target'>
type H5updatefriendremarks = Pick<H5addRelation, 'target' | 'target_remarks'>
type H5isfriend = Pick<H5addRelation, 'target'>

type H5addscroe = {
  rank_id: string
  score: number
}
type H5getranklist = {
  rank_id: string
}
type H5getranklistLimit = H5getranklist & {
  start_rank: number
  end_rank: number
}

interface H5getShareData {
  func?: string //分享的埋点
  transmits?: string //透传的参数
  imageUrl?: string //分享的图片url
  title?: string //分享的标题
  query?: string //分享的页面路径的参数
  region?: string // 地区码，没有则不传，会取全国地区的数据
  readCache?: boolean // 是否读取缓存，默认读取
  custom_ext?: any
}

interface H5ReqShareScheduleInit {
  funcs?: string[]
  type?: string
  open_id?: string
}

interface H5ReqShareScheduleReport {
  product_id?: string
  channel_id?: string
  // 埋点
  func: string
  // 平台 目前只有 wechat qq
  platform?: string
  // 客户端：app， 小游戏：mini
  type?: string
  // 瑞雪openid
  open_id?: string
  sub_channel_id?: string
  region?: string
  transmits: string
  // share 分享 ad 广告
  scheduling_type: string
  scheduling_event: boolean
  // scheduling_strategy_id: string
  properties?: object
}

interface H5OppoLoginParam {
  method: 'minigame_oppo'
  login_openid?: string, //二次登录的openid
  ext?: {
    [key: string]: any
  }
}

interface H5OppoPayParam {
  count?: number,
  onlyGetOrder?: boolean,
  pay_type: 'minigame_oppo',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  }
  exchange?: boolean
}


interface H5VivoLoginParam {
  method: 'minigame_oppo'
  login_openid?: string, //二次登录的openid
  ext?: {
    [key: string]: any
  }
}

interface H5VivoPayParam {
  onlyGetOrder?: boolean,
  pay_type: 'minigame_oppo',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  }
  exchange?: boolean
}

interface H5XiaomiLoginParam {
  method: 'minigame_xiaomi'
  login_openid?: string, //二次登录的openid
  ext?: {
    [key: string]: any
  }
}

interface H5XiaomiPayParam {
  onlyGetOrder?: boolean,
  pay_type: 'minigame_xiaomi',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  }
  exchange?: boolean
}

interface H5HuaweiLoginParam {
  login_openid?: string //二次登录的openid
  method?: string
  ext?: {
    [key: string]: any
  }
}

interface H5HuaweiPayParam {
  onlyGetOrder?: boolean,
  pay_type: 'minigame_huawei',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  }
  exchange?: boolean
}

interface H5HonorLoginParam {
  login_openid?: string //二次登录的openid
  method?: string
  ext?: {
    [key: string]: any
  }
  needAuthCode?: boolean
  isProfileRequired?: boolean
}

interface H5HonorPayParam {
  onlyGetOrder?: boolean,
  pay_type: 'minigame_honor',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  ext: { //扩展字段
    [key: string]: any
  }
  exchange?: boolean
}

interface H5RuixueLoginParam {
  login_openid?: string //二次登录的openid
  method?: string
  username?: string
  captcha_code?: string
  ext?: {
    [key: string]: any
  }
  stopCallback?: boolean
}

interface InitOverseaH5Params {
  // 产品 id
  productId: string
  // 渠道id
  channelId: string
  // 客户端id
  cpid: string
  // 请求域名队列
  baseUrlList: string[]
  overseaChannelList?: string[]
  // 回调函数
  complete: (data: any) => void
}

interface H5OverseaLoginParam {
  method: string
  idToken?: string
  custom_params?: any
  google_config: {
    client_id: string
  },
  apple_config: {
    clientId: string
    scope: string
    state: string
    nonce: string
    redirectURI: string
    usePopup: boolean
  },
  facebook_config: {
    appId: string
    cookie: boolean
    xfbml: boolean
    version: boolean
    app_associated_business: boolean
    scope: string
  },
  instagram_config: {
    clientId: string
    redirectUri?: string
  },
  tiktok_config: {
    clientKey: string
    scope?: string
    redirectUri?: string
  },
  zalo_config: {
    appId: string
  }
}

interface H5OverseaShareParams {
  func: string
  shareData?: any
  href: string
  platform: string
  transmits?: string //透传的参数
  imageUrl?: string
  desc?: string //分享文案，不传则默认使用后台配置内容或游戏简介
  content?: string // 自定义吱口令文案，最多 28 个字符。
  title?: string //转发标题，不传则默认使用后台配置或当前小游戏的名称
  query?: string //查询字符串，必须是 key1=val1&key2=val2 的格式。
  needNotFuncQuery?: boolean
  inviter_region?: string
  inviter_openid?: string
}

interface H5RUIXUEPayParam {
  pay_type: 'aums' | 'lakala' | 'checkstand',
  hq_type?: 'minih5' | 'qrcode',
  goods_tag: string, //商品标识
  currency?: 'CNY',//币种 默认传: CNY
  is_debug?: 0 | 1, //0 或 1 默认为0 正式  1 测试
  trade_no: string, //CP订单号
  transmit_args?: string, // 客户端透传参数
  env?: 0 | 1, //是否使用沙盒环境支付 0 正式 1 沙盒
  indulge_auth: 0 | 1, //是否进行防沉迷支付验证 0 不进行 1进行
  age?: number, //用户年龄,indulge_auth为1时必传该字段
  notify_url?: string,
  webview?: 0 | 1, // 是否使用webview支付 0 不使用 1 使用
  ext: { //扩展字段
    [key: string]: any
  }
  exchange?: boolean
}
