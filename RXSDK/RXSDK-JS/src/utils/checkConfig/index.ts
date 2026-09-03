// import { InternalRuleItem, Rules } from 'async-validator'
import { InternalRuleItem, Rules } from '@/utils/async-validator'
import { isArray, isFunction } from '@/utils/is'


export function TypeOfValue(value: any) {
  let type = Object.prototype.toString.call(value)
  return type.substring(8, type.length - 1).toLowerCase()
}

// export const PubCallBack = {
//   complete: {
//     require: true,
//     asyncValidator: (rule: InternalRuleItem, value: any): Promise<any> => {
//       return new Promise((resolve, reject) => {
//         if (isFunction(value)) {
//           resolve(1)
//         } else {
//           reject(`callback complete property must be function type but got ${TypeOfValue(value)}`)
//         }
//       })
//     },
//   },
// }


export const initParamsCheck: Rules = {
  productId: {
    type: 'string',
    required: true,
  },
  channelId: {
    type: 'string',
    required: true,
  },
  cpid: {
    type: 'string',
    required: true,
  },
  baseUrlList: {
    validator(_, value: any) {
      if (isArray(value)) {
        if (value.length == 0) {
          return new Error(`baseUrlList params can not an empty Array`)
        } else if (value.length > 2) {
          return new Error(`baseUrlList params maxLength is 2`)
        } else {
          return true
        }
      } else {
        return new Error(`baseUrlList params Expecting string[],but got ${TypeOfValue(value)}`)
      }
    },
  },
  complete: {
    required: true,
    validator(_: InternalRuleItem, value: any) {
      if (isFunction(value)) {
        return true
      } else {
        return new Error(`callback complete property must be function type but got ${TypeOfValue(value)}`)
      }
    },
  }
}

export const huaweiInitParamsCheck: Rules = {
  productId: {
    type: 'string',
    required: true,
  },
  channelId: {
    type: 'string',
    required: true,
  },
  cpid: {
    type: 'string',
    required: true,
  },
  appid: {
    type: 'string',
    required: true,
  },
  publicKey: {
    type: 'string',
    required: true,
  },
  baseUrlList: {
    validator(_, value: any) {
      if (isArray(value)) {
        if (value.length == 0) {
          return new Error(`baseUrlList params can not an empty Array`)
        } else if (value.length > 2) {
          return new Error(`baseUrlList params maxLength is 2`)
        } else {
          return true
        }
      } else {
        return new Error(`baseUrlList params Expecting string[],but got ${TypeOfValue(value)}`)
      }
    },
  },
  complete: {
    required: true,
    validator(_: InternalRuleItem, value: any) {
      if (isFunction(value)) {
        return true
      } else {
        return new Error(`callback complete property must be function type but got ${TypeOfValue(value)}`)
      }
    },
  }
}

export const taobaoInitParamsCheck: Rules = {
  productId: {
    type: 'string',
    required: true,
  },
  channelId: {
    type: 'string',
    required: true,
  },
  cpid: {
    type: 'string',
    required: true,
  },
  baseUrlList: {
    validator(_, value: any) {
      if (isArray(value)) {
        if (value.length == 0) {
          return new Error(`baseUrlList params can not an empty Array`)
        } else if (value.length > 2) {
          return new Error(`baseUrlList params maxLength is 2`)
        } else {
          return true
        }
      } else {
        return new Error(`baseUrlList params Expecting string[],but got ${TypeOfValue(value)}`)
      }
    },
  },
  complete: {
    required: true,
    validator(_: InternalRuleItem, value: any) {
      if (isFunction(value)) {
        return true
      } else {
        return new Error(`callback complete property must be function type but got ${TypeOfValue(value)}`)
      }
    },
  }
}

export const checkTrackParams:Rules = {
  event:{
    type:'string',
    required:true
  },
  properties:{
    type:'object'
  }
}

export const checkAppVersionParams: Rules = {
  clientversion: {
    type: 'string',
    required: true,
  },
  devicecode: {
    type: 'string',
    required: true,
  },
  region: {
    type: 'number',
  },
  type: {
    type: 'enum',
    enum: ['js' , 'lua' , 'u3d'],
  },
  format: {
    type: 'enum',
    enum: ['json' , 'lua'],
  },
  games: {
    type: 'object',
  },
  activities: {
    type: 'object',
  },
}

export const checkGameVersionParams: Rules = {
  gameid: {
    type: 'number',
    required: true,
  },
  gameversion: {
    type: 'number',
    required: true,
  },
  gamecheckversion: {
    type: 'number',
  },
  type: {
    type: 'enum',
    enum: ['js' , 'lua' , 'u3d'],
  },
  format: {
    type: 'enum',
    enum: ['json' , 'lua'],
  },
}

export const checkActivityVersionParams: Rules = {
  activityshortname: {
    type: 'string',
    required: true,
  },
  activityversion: {
    type: 'number',
    required: true,
  },
  activitycheckversion: {
    type: 'number',
  },
  type: {
    type: 'enum',
    enum: ['js' , 'lua' , 'u3d'],
  },
  format: {
    type: 'enum',
    enum: ['json' , 'lua'],
  },
}

export const checkIReqBusinessData: Rules = {
  window_key: {
    type: 'string',
    required: true,
  },
  event: {
    type: 'string',
    required: true,
  },
  before_event: {
    type: 'string',
  }
}

export const checkIReqBusinessOrder: Rules = {
  trade_no: {
    type: 'string',
    required: true,
  },
  sign: {
    type: 'string',
    required: true,
  },
}

export const shareScheduleReportParams: Rules = {
  func: {
    type: 'string',
    required: true,
  },
  scheduling_type: {
    type: 'enum',
    enum: ['share' , 'ad'],
    required: true,
  },
  scheduling_event: {
    type: 'boolean',
    required: true,
  },
  // scheduling_strategy_id: {
  //   type: 'string',
  //   required: true,
  // },
  properties: {
    type: 'object',
  }
}

export const shareScheduleInitParams: Rules = {
  funcs: {
    type: 'array',
  },
}
