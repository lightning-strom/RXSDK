import { InternalRuleItem, Rules } from '@/utils/async-validator'
export const huaweiQuickLoginParamsCheck: Rules = {
  appid: {
    type: 'string',
  },
  login_openid: {
    type: 'string',
  },
}
