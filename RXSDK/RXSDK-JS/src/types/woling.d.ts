interface QueriesWoLing {
  app_id: string
  c_id: string
  hash: string
  mem_id: string
  sign: string
  user_token: string
}

interface RoleParamsWoLing extends RoleLoginParams{
  'role-event'?: number
  'role-onlineTime'?: number
  'role-scene'?: string
  'role-axis'?: string
  'role-last_operation'?: string
}
