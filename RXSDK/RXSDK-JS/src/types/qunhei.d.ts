interface QueriesQunHei {
  /** 昵称 */
  nname?: string
  /** 玩家id(唯一) */
  username: string
  /** 游戏服务器,(该参数为固定值1) */
  serverid: string
  /** 登录时间(UNIX时间戳) */
  time: string
  /** 防沉迷标识(1是成年，0是未成年) */
  isadult: string
  /** 头像地址 */
  uimg: string
  /** 玩家来源 */
  unid?: string
  /** 玩家标识 */
  qhchannel?: string
  /** 玩家标识id */
  qhchannelid?: string
  /** 是否显示分享，关注，邀请按钮(1=不显示，其他则显示) */
  showbtn?: string
  /** 验证签名 */
  flag: string
  /** 分享透传参数 */
  extra?: string
}