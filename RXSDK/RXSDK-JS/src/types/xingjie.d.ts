interface RoleParamsXingJie {
  /** 仅创建角色时传true,更新信息时传false */
  isCreateRole?: boolean
  /** 角色创建时间 */
  roleCreateTime: number
  uid?: number
  username?: string
  /** 区服ID */
  serverId?: number
  /** 区服名称 */
  serverName?: string
  /** 游戏内角色ID */
  userRoleId?: string
  /** 游戏角色 */
  userRoleName?: string
  /** 角色游戏内货币余额 */
  userRoleBalance: number
  /** 角色VIP等级 */
  vipLevel?: number
  /** 角色等级 */
  userRoleLevel?: number
  /** 公会/社团ID */
  partyId: number
  /** 公会/社团名称 */
  partyName: string
  /** 角色性别 */
  gameRoleGender?: string
  /** 角色战力 */
  gameRolePower?: number
  /** 角色在帮派中的ID */
  partyRoleId?: number
  /** 角色在帮派中的名称 */
  partyRoleName?: string
  /** 角色职业ID */
  professionId?: string
  /** 角色职业名称 */
  profession?: string
  /** 角色好友列表 */
  friendlist?: string
}
