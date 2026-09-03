// import { InternalRuleItem, Rules } from 'async-validator'
import { InternalRuleItem, Rules } from '@/utils/async-validator'
import { isBoolean, isObject, omit, pick } from '@/utils/is'

export const setcustomCheck: Rules = {
  custom: {
    type: 'string',
    required: true,
  },
}

const relationTypesCheck = (rule: InternalRuleItem, value: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!isObject(value)) {
      reject('types must be Object')
    }
    for (let key in value) {
      const item = value[key]
      if (!isBoolean(item)) {
        reject('types member value must be boolean')
      }
    }
    resolve(true)
  })
}

const relationCommonRule: Rules = {
  //对方 OpenID
  target: {
    type: 'string',
    required: true,
  },
  // CP 自定义关系类型
  type: {
    type: 'string',
    required: true,
  },
  //用户给Target设置的备注信息（最长512字符）
  target_remarks: {
    type: 'string',
  },
  //Target给用户设置的备注信息（最长512字符）
  user_remarks: {
    type: 'string',
  },
}

export const addRelationCheck: Rules = {
  types: {
    //CP 自定义关系类型列表，其值是一个 map 简直对列表，格式为：
    required: true,
    asyncValidator: relationTypesCheck,
  },
  ...omit(relationCommonRule, 'type')
}

export const deleteRelationCheck: Rules = {
  types: {
    //CP 自定义关系类型列表，其值是一个 map 简直对列表，格式为：
    required: true,
    asyncValidator: relationTypesCheck,
  },
  ...pick(relationCommonRule, 'target')
}

export const updateremarksCheck: Rules = omit(relationCommonRule, 'user_remarks')

export const hasRelationCheck: Rules = pick(relationCommonRule, ['target', 'type'])

export const relationListCheck: Rules = pick(relationCommonRule, 'type')

export const addFriendCheck: Rules = omit(relationCommonRule, 'type')

export const delfriendCheck: Rules = pick(relationCommonRule, 'target')

export const updatefriendremarksCheck: Rules = pick(relationCommonRule, ['target', 'target_remarks'])

export const addscoreCheck: Rules = {
  rank_id: {
    type: 'string',
    required: true,
  },
  score: {
    type: 'number',
    required: true,
  },
}

export const queryuserrankCheck: Rules = {
  rank_id: {
    type: 'string',
    required: true,
  },
  open_id: {
    type: 'string',
    required: true,
  },
}
export const getranklimitlistCheck: Rules = {
  rank_id: {
    type: 'string',
    required: true,
  },
  start_rank: {
    type: 'number',
    required: true,
  },
  end_rank: {
    type: 'number',
    required: true,
  },
}

export const getranklistCheck: Rules = {
  rank_id: {
    type: 'string',
    required: true,
  },
}



