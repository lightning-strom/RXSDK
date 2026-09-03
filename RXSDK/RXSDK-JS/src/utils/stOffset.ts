import { SYSTEM_INFO } from '@/config'

/**
 * 根据服务器时间字符串计算并刷新 st_offset
 */
export const updateStOffsetWithServerTime = (serverTime: any) => {
  if (!serverTime) return
  const serverTimeNum = Number(serverTime)
  if (!serverTimeNum || isNaN(serverTimeNum)) return
  SYSTEM_INFO.st_offset = String(serverTimeNum - Date.now())
}

/**
 * 调用 /v1/sdkconfig/detection 接口刷新 st_offset
 * 各入口按需注入自己的 api 函数（普通包 / 华为包）
 */
export const refreshStOffset = async (
  getServerTimeApi: (data?: any) => Promise<any>
) => {
  try {
    const res: any = await getServerTimeApi()
    const serverTime = res?.data?.time
    updateStOffsetWithServerTime(serverTime)
  } catch (err) {
    console.warn('refreshStOffset failed', err)
  }
}

let stOffsetRegistered = false

/**
 * H5：初始化成功后注册页面可见性监听
 * 切到前台（visibilitychange 且可见）时调用接口刷新 st_offset
 */
export const setupStOffsetRefreshForH5 = (
  getServerTimeApi: (data?: any) => Promise<any>
) => {
  if (stOffsetRegistered) return
  if (typeof document === 'undefined' || typeof document.addEventListener !== 'function') return
  stOffsetRegistered = true
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      refreshStOffset(getServerTimeApi)
    }
  }, false)
}

/**
 * 小游戏：初始化成功后注册 onShow 监听
 * 切到前台时调用接口刷新 st_offset
 */
export const setupStOffsetRefreshForMiniGame = (
  platformGlobal: any,
  getServerTimeApi: (data?: any) => Promise<any>
) => {
  if (stOffsetRegistered) return
  if (!platformGlobal || typeof platformGlobal.onShow !== 'function') return
  stOffsetRegistered = true
  platformGlobal.onShow(() => {
    refreshStOffset(getServerTimeApi)
  })
}
