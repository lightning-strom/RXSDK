interface QueriesYiLeWan {
  app_key: string
  fuse_passport: string
  fuse_token: string
  fuse_uid: string
  game_code: string
}

interface RoleParamsYiLeWan extends RoleLoginParams{
  /** 上报数据类型：选择服务器 1 |创建角色 2 |进入游戏 3 |等级提升 4 |退出游戏 5 |进入副本 6 |退出副本 7 |vip升级 8 */
  dataType: number, 
  /** 角色创建时间，从1970年到现在的时间，单位秒(长整型) */
  roleCreateTime: number,
  /** 角色等级变化时间，从1970年到现在的时间，单位秒(长整型) */
  roleLevelUpTime: number,
  /* 职业ID(String) */
  professionID: string,
  /* 职业名称 */
  professionName: string,
  /* 帮会，公会ID */
  partyID: string,
  /* 帮会，公会名称 */
  partyName: string,
  /* 帮会，公会会长ID */
  partyMasterID: string,
  /* 帮会，公会会长名称 */
  partyMasterName: string,
  /** 角色重生次数 */
  player_rein?: string,
}