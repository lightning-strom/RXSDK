interface ReportDataParams {
  /** 上报类型 */
  type: string
  app_id?: string
  /** 游戏名称 */
  game_name?: string
  open_id?: string
  /** 游戏角色 */
  game_role?: string
  /** 游戏所属区域 */
  game_region?: string
  /** 用户名称 */
  user_name?: string
  /** 用户等级 */
  user_level?: string
  /** 角色名称 */
  role?: string
  /** 游戏区 */
  region?: string
  /** 等级 */
  level?: number
  /** 战斗力 */
  ce?: number
  /** 局数 */
  round?: number
  /** 获利金额（例如斗地主游戏欢乐豆） */
  revenue?: number
  /** 异常信息 */
  message?: string
  /** json对象 {} */
  extend_info?: any
}