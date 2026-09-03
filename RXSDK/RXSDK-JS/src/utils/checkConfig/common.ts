import { InternalRuleItem, Rules } from 'async-validator'

export const sendCaptchaParamsCheck: Rules = {
  email: {
    type: 'email',
  },
  phone: {
    asyncValidator: (rule: InternalRuleItem, value: any) => {
      return new Promise((resolve, reject) => {
        if (/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value + '')) {
          resolve()
        } else {
          reject('phone params is not invalid')
        }
      })
    },
  },
  purpose: {
    type: 'enum',
    enum: [
      'register',
      'bindphone',
      'unbindphone',
      'resetpwd',
      'bindemail',
      'unbindemail',
      'login',
      'setpwd',
    ],
  },
}
export const bindPhoneParamsCheck: Rules = {
  phone: {
    type: 'string',
    required: true,
  },
  captcha_code: {
    type: 'string',
    required: true,
  },
  // password: {
  //   type: 'string',
  //   required: true,
  // },
}
export const changePhoneParamsCheck: Rules = {
  oldphone_captcha: {
    type: 'string',
    required: true,
  },
  newphone: {
    asyncValidator: (rule: InternalRuleItem, value: any) => {
      return new Promise((resolve, reject) => {
        if (/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value + '')) {
          resolve()
        } else {
          reject('phone params is not invalid')
        }
      })
    },
  },
  newphone_captcha: {
    type: 'string',
    required: true,
  },
}

export const verifyCodeParamsCheck: Rules = {
  captcha_code: {
    type: 'string',
    required: true,
  }
}

export const unBindPhoneParamsCheck: Rules = {
  phone: {
    type: 'string',
    required: true,
  },
  captcha_code: {
    type: 'string',
    required: true,
  },
}
export const bindEmailParamsCheck: Rules = {
  email: {
    type: 'string',
    required: true,
  },
  captcha_code: {
    type: 'string',
    required: true,
  },
  password: {
    type: 'string',
    required: true,
  },
}
export const unbindemailParamsCheck: Rules = {
  email: {
    type: 'string',
    required: true,
  },
  captcha_code: {
    type: 'string',
    required: true,
  },
}
export const deregisterParamsCheck: Rules = {
  idcard: {
    type: 'string',
    required: true,
  },
  realname: {
    type: 'string',
    required: true,
  },
  cpdata: {
    type: 'string',
    required: true,
  },
}
export const update_infoCheck: Rules = {
  nickname: {
    type: 'string',
    required: true,
  },
  avatarurl: {
    type: 'string',
    required: true,
  },
  region: {
    type: 'string',
    required: true,
  },
  sex: {
    type: 'enum',
    enum: [1, 0],
    required: true,
  },
}
