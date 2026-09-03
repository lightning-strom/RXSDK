import { payCallback } from '@/api/api'
import { USER_INFO } from '@/config/index'
import { customGetStorageSync, removeStorageSync } from '@/utils/utils'

// 支付凭证已经使用过
const VOUCHERUSED = 302408
// 支付凭证无效
const VOUCHEREXPIRED = 302409

function fibonacci(n: number) {
  if (n === 1) return 1
  let first = 1,
    second = 1
  for (let i = 3; i <= n; i++) {
    ;[first, second] = [second, first + second]
  }
  return second
}

export const useSupplementOrder = () => {
  let timeoutId: NodeJS.Timeout | null = null
  let start = 0
  // 自动补单五次
  const max = 5
  // 是否正处于自动补单中
  let isSupplying = false
  // 无效的支付凭证错误码
  const expiredVoucherCode = [VOUCHERUSED, VOUCHEREXPIRED]

  const toggleSupplyStatus = (bool: boolean) => isSupplying = bool

  const isDropOrder = (errCode: number) => {
    return (
      [152407, 152401, 182001, 142601, 142602, 152403, 152404].includes(errCode) ||
      (errCode >= 1000 && errCode < 2000)
    )
  }

  const dynamicSupplementOrder = async () => {
    const isHasCompensateOrder = customGetStorageSync(`rx_${USER_INFO.tid}`)
    if (isHasCompensateOrder) {
      console.info('sdk 进入自动补单', start)
      toggleSupplyStatus(true)
      //补单逻辑
      try {
        const { notify_url, wx_openid, order_no, amount, env, zone_id, pf } = isHasCompensateOrder

        await payCallback(notify_url, {
          wx_openid,
          order_no,
          amount,
          env,
          zone_id,
          pf,
        })
        // 补单成功后删除补单凭证，清除补单状态和定时器
        removeStorageSync(`rx_${USER_INFO.tid}`)
        reset()
      } catch (err: any) {
        if (expiredVoucherCode.includes(err?.code)) {
          // 如果支付回调接口失败的原因是支付凭证已经用过或者是失效，清除补单支付凭证
          removeStorageSync(`rx_${USER_INFO.tid}`)
          reset()
          return
        }
        // console.log('res: ')
        repeat(fibonacci(start))
      }
    } else {
      /**
       * 进入场景
       * 自动补单轮训中，手动调用支付接口，触发补单，成功后删除补单凭证，自动补单轮训下次找不到补单凭证，需要清除补单状态和定时器
       */
      reset()
    }
  }

  const repeat = (ms: number) => {
    timeoutId && clearTimeout(timeoutId)
    start++
    if (start > max) {
      toggleSupplyStatus(false)
      return
    }
    timeoutId = setTimeout(() => dynamicSupplementOrder(), ms * 5000)
  }

  const handleDynamicSupplementOrder = () => {
    if(isSupplying) {
      console.info('sdk 自动补单进行中，请勿cue')
      return
    }
    // dynamicSupplementOrder()
    repeat(fibonacci(start))
  }

  const reset = () => {
    start = 1
    timeoutId && clearTimeout(timeoutId)
    toggleSupplyStatus(false)
  }

  return {
    expiredVoucherCode,
    isDropOrder,
    handleDynamicSupplementOrder,
    dynamicSupplementOrder,
  }
}
