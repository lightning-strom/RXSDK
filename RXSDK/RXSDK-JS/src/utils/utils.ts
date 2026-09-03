import { ERROR_CODE } from '@/config/const'
import { SYSTEM_INFO, USER_INFO } from '@/config'
import LZString from 'lz-string'
import v4 from 'uuid/v4'

export function printLog(...args: any) {
  if (SYSTEM_INFO.logSwitch) {
    console.info(args)
  }
}

export const qs = {
  stringify: function (obj: any): string {
    let str = ''
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        str += '&' + key + '=' + obj[key]
      }
    }
    return str.slice(1)
  },
  parse: function (params: string): object {
    if (!params) return {}
    const query = params.split('&')
    const res: any = {}
    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        const arr = query[key].split('=')
        res[arr[0]] = arr[1]
      }
    }
    return res
  }
}

export const asyncFunc = <F extends (...args: any) => any>(
  func: F,
  options?: Parameters<F>[0],
  params?: Parameters<F>[]
): Promise<any> =>
  new Promise((resolve, reject) => {
    func(Object.assign({}, options, {
      success: resolve,
      fail: reject,
      cancel: resolve
    }), ...(params || []))
  })

export const getConfigErrMsg = (code: any, thirdcode: any, thirdmsg: any) => {
  const msg = SYSTEM_INFO.errMsg[code] || SYSTEM_INFO.errMsg.default || ''
  return msg.replace(/\$code\$/g, code || '').replace(/\$thirdcode\$/g, thirdcode || '').replace(/\$thirdmsg\$/g, thirdmsg || '')
}

export const handleError = (err: any, code?: any): any => {
  err = err || {}
  const _code: any = code || err.code || err.errCode || err.errorCode || err.err_code || err.error || err.errNo || err.errno || ERROR_CODE
  const _thirdcode: any = err.thirdcode || err.thirdCode || err.errCode || err.errorCode || err.err_code || err.errNo || err.errno || err.error || err.code
  const _thirdmsg: any = err.message || err.errMsg || err.errorMsg || err.msg || err.errorMessage || err.errorDescription || err.data
  if (_code == 2001) {
    return {
      isServerError: err.isServerError,
      thirdcode: _thirdcode || 9001,
      thirdmsg: _thirdmsg,
      code: err.isServerError ? _thirdcode : _code,
      msg: err.isServerError ? _thirdmsg : getConfigErrMsg(_code, _thirdcode, _thirdmsg) || _thirdmsg || err || '初始化错误，或未初始化'
    }
  }
  if (err.isServerError) {
    console.log('handleError server error', err.code, err.msg, err.thirdcode, err.thirdmsg)
    return {
      isServerError: err.isServerError,
      thirdcode: err.thirdcode,
      thirdmsg: err.thirdmsg,
      code: err.code || 9001,
      msg: err.msg || err.message
    }
  }
  return {
    isServerError: err.isServerError || false,
    thirdcode: _thirdcode || 9001,
    thirdmsg: _thirdmsg,
    code: _code,
    msg: getConfigErrMsg(_code, _thirdcode, _thirdmsg) || _thirdmsg || err
  }
}

export const handleSuccess = (result: any, tag: string): void => {
  console.info(tag)
  console.info('sdk handleSuccess:', [result])
}

export const isDropOrder = (errCode: number) => {
  return (
    [152407, 152401, 182001, 142601, 142602, 152403, 152404].includes(errCode) ||
    (errCode >= 1000 && errCode < 2000)
  )
}

// 支付凭证已经使用过
const VOUCHERUSED = 302408
// 支付凭证无效
const VOUCHEREXPIRED = 302409

export const isExpiredCode = (errCode: number) => {
  return [VOUCHERUSED, VOUCHEREXPIRED].includes(errCode)
}
/**
 * 编码 URI 及 base64 处理的字符串
 */
// export const encodeURIBase64 = (str?: string) => {
//   if (!str) return ''
//   try {
//     return btoa(encodeURIComponent(str))
//   } catch (error) {
//     console.error(error)
//     return str
//   }
// }

/**
 * 反编码 URI 及 base64 处理的字符串
 */
// export const decodeURIBase64 = (str?: string) => {
//   if (!str) return ''
//   try {
//     return decodeURIComponent(atob(str))
//   } catch (error) {
//     console.error(error)
//     return str
//   }
// }

// export const loadScript = function (url: string) {
//   return new Promise((resolve, reject) => {
//     const script = document.createElement('script')
//     const params = url.indexOf('?') > -1 ? '&timestamp=' : '?timestamp='
//     script.src = `${/^(https?:)?\/\//.test(url) ? '' : '//'}${url}${params}${Date.now()}`
//     script.onload = resolve
//     script.onerror = reject
//     document.body.appendChild(script)
//   })
// }

export const formatTrackParams = ({
  eventName,
  apiName,
  reqParams = {},
  errorInfo = {},
  loginInfo = {},
  ...otherParams
}: any) => {
  const eventNamePrefix = '#rxsdk_'
  return {
    event: eventNamePrefix + eventName,
    properties: {
      api_name: apiName,
      systemInfo: SYSTEM_INFO,
      req_params: { ...reqParams },
      error_info: { ...errorInfo },
      login_info: { ...loginInfo },
      ...otherParams
    }
  }
}

// 内存存储对象
const memoryStore: Record<string, any> = {}
// 过期时间映射
const expireMap: Record<string, number> = {}
// 检查wx存储方法是否可用

// 辅助函数：判断是否为函数
function isFunction(fn: any): fn is Function {
  return typeof fn === 'function'
}


// 获取存储
export const customGetStorageSync = (key: string): any => {
  // 检查是否过期
  if (expireMap[key] && Date.now() > expireMap[key]) {
    customRemoveStorageSync(key)
    return null
  }

  try {
    if (SYSTEM_INFO.isWxAvailable) {
      return wx.getStorageSync(key)
    } else {
      printLog('memoryStore', memoryStore)
      return memoryStore[key] || null
    }
  } catch (error) {
    return memoryStore[key] || null
  }

}

// 设置存储
export const customSetStorageSync = (key: string, value: any, expire?: number): void => {
  try {
    if (SYSTEM_INFO.isWxAvailable) {
      wx.setStorageSync(key, value)
    } else {
      memoryStore[key] = value
      // printLog('memoryStore', memoryStore)
    }
  } catch (error) {
    // 降级到内存存储
    memoryStore[key] = value
    // printLog('memoryStore', memoryStore)
  }

  // 设置过期时间
  if (expire && typeof expire === 'number') {
    expireMap[key] = Date.now() + expire * 1000
  }
}

// 删除存储
export const customRemoveStorageSync = (key: string): void => {
  try {
    if (SYSTEM_INFO.isWxAvailable) {
      wx.removeStorageSync(key)
    }
  } catch (error) {
    // 忽略错误
  }

  // 同时删除内存中的数据
  delete memoryStore[key]
  delete expireMap[key]
}

// 删除存储（别名方法，保持与wx API一致）
export const removeStorageSync = (key: string): void => {
  customRemoveStorageSync(key)
}

// 根据前缀删除存储
export const removeStorageByPrefix = (prefix: string, predict?: (key: string) => boolean): void => {
  let targetKeys: string[] = []

  try {
    if (SYSTEM_INFO.isWxAvailable) {
      const info = wx.getStorageInfoSync()
      targetKeys = info.keys.filter((key: string) =>
        isFunction(predict) ? predict(key) : key.startsWith(prefix)
      )
      targetKeys.forEach((key: string) => wx.removeStorageSync(key))
    }
  } catch (error) {
    // 忽略错误
  }

  // 同时删除内存中的数据
  const memoryKeys = Object.keys(memoryStore)
  targetKeys = memoryKeys.filter((key: string) =>
    isFunction(predict) ? predict(key) : key.startsWith(prefix)
  )
  targetKeys.forEach((key: string) => {
    delete memoryStore[key]
    delete expireMap[key]
  })
}

// 上报数据存储相关常量
const TRACK_KEYS_STORAGE_KEY = 'rx_track_collect_keys' // 存储所有时间戳key的列表
const TRACK_DATA_PREFIX = 'rx_track_collect_' // 数据存储key前缀
const TRACK_LOCK_KEY = 'rx_track_collect_lock' // 当前被锁定的时间戳key（单个）
const MAX_ITEMS_PER_KEY = 100 // 每个key最多存储的数据条数
const MAX_KEYS = 5 // 最多存储的时间戳数量（严格控制）

// 定时器ID
let trackReportTimerId: any = null
// 当前定时器间隔
let currentTrackInterval: number = 60000
// 最小上报间隔（毫秒）
const MIN_FLUSH_INTERVAL = 100
// 默认上报间隔（1分钟）
const DEFAULT_FLUSH_INTERVAL = 60000
// 上报API函数引用
let currentTrackApiFunc: ((data: any) => Promise<any>) | null = null
// 默认缓存数据上限
const DEFAULT_MAX_CACHE_COUNT = 100
// 最小缓存数据上限
const MIN_MAX_CACHE_COUNT = 100
// 最大缓存数据上限
const MAX_MAX_CACHE_COUNT = 1000
// 当前缓存数据上限
let currentMaxCacheCount: number = DEFAULT_MAX_CACHE_COUNT
// 是否正在执行立即上报（用于暂停定时上报）
let isImmediateReporting: boolean = false
// 上报失败冷却时间（毫秒），防止失败后频繁重试
const REPORT_FAIL_COOLDOWN = 10000
// 上次上报失败时间
let lastReportFailTime: number = 0
// 锁超时时间（毫秒），超过此时间的锁自动失效
const LOCK_TIMEOUT = 30000

/**
 * 将上报数据存入storage
 * key为时间戳，每个key最多存100条数据，严格控制最多5个时间戳
 * 如果当前key被锁定（正在上报中），则创建新的时间戳继续写入
 * 如果已达到5个上限且无法删除，则丢弃新数据
 * 注意：此函数内部已做完善的异常处理，不会抛出错误
 */
export const saveTrackDataToStorage = (data: any): void => {
  try {
    // 数据验证，防止存储无效数据
    if (data === undefined || data === null) {
      console.warn('存储数据为空，跳过')
      return
    }

    // 获取当前所有时间戳key列表
    let trackKeys: string[] = []
    try {
      trackKeys = customGetStorageSync(TRACK_KEYS_STORAGE_KEY) || []
      // 确保是数组
      if (!Array.isArray(trackKeys)) {
        trackKeys = []
      }
    } catch (e) {
      console.error('获取时间戳列表失败，使用空数组:', e)
      trackKeys = []
    }

    // 获取被锁定的时间戳key（单个，正在上报中的），使用超时机制
    const lockedKey: string = getValidLock() || ''

    // 获取最新的时间戳key
    let currentKey = trackKeys.length > 0 ? trackKeys[trackKeys.length - 1] : null
    let currentData: any[] = []

    if (currentKey) {
      try {
        currentData = customGetStorageSync(`${TRACK_DATA_PREFIX}${currentKey}`) || []
        // 确保是数组
        if (!Array.isArray(currentData)) {
          currentData = []
        }
      } catch (e) {
        console.error('获取当前时间戳数据失败，使用空数组:', e)
        currentData = []
      }
    }

    // 判断是否需要创建新的时间戳key：
    // 1. 当前key不存在
    // 2. 当前key已满100条
    // 3. 当前key被锁定（正在上报中）
    const isCurrentKeyLocked = currentKey === lockedKey
    const needNewKey = !currentKey || currentData.length >= MAX_ITEMS_PER_KEY || isCurrentKeyLocked

    if (needNewKey) {
      // 严格控制5个上限
      if (trackKeys.length >= MAX_KEYS) {
        // 找到最旧的未被锁定的key删除
        const oldestKeyIndex = trackKeys.findIndex(key => key !== lockedKey)
        if (oldestKeyIndex !== -1) {
          const oldestKey = trackKeys.splice(oldestKeyIndex, 1)[0]
          try {
            customRemoveStorageSync(`${TRACK_DATA_PREFIX}${oldestKey}`)
          } catch (e) {
            // 忽略删除错误
          }
          console.log('删除最旧的未锁定时间戳:', oldestKey)
        } else {
          // 所有key都被锁定（理论上最多只有1个被锁定），丢弃新数据
          console.warn('已达到5个时间戳上限且无法删除，丢弃新数据')
          return
        }
      }

      const newKey = String(Date.now())

      // 添加新的时间戳key
      trackKeys.push(newKey)
      try {
        customSetStorageSync(TRACK_KEYS_STORAGE_KEY, trackKeys)
      } catch (e) {
        console.error('保存时间戳列表失败:', e)
        return
      }

      // 存储数据到新的key
      try {
        customSetStorageSync(`${TRACK_DATA_PREFIX}${newKey}`, [data])
      } catch (e) {
        console.error('保存数据失败:', e)
        return
      }
    } else {
      // 当前key未满且未被锁定，追加数据
      currentData.push(data)
      try {
        customSetStorageSync(`${TRACK_DATA_PREFIX}${currentKey}`, currentData)
      } catch (e) {
        console.error('保存数据失败:', e)
        return
      }
    }

    console.log('数据已存储, 当前时间戳数量:', trackKeys.length)
  } catch (error) {
    console.error('存储数据失败:', error)
  }
}

/**
 * 获取存储的上报数据（按时间戳顺序）
 * @returns 最旧的一批数据及其对应的时间戳key
 */
export const getTrackDataFromStorage = (): { key: string; data: any[] } | null => {
  try {
    const trackKeys: string[] = customGetStorageSync(TRACK_KEYS_STORAGE_KEY) || []

    if (trackKeys.length === 0) {
      return null
    }

    // 获取最旧的时间戳key（第一个）
    const oldestKey = trackKeys[0]
    const data = customGetStorageSync(`${TRACK_DATA_PREFIX}${oldestKey}`) || []

    return { key: oldestKey, data }
  } catch (error) {
    console.error('Failed to get track data from storage:', error)
    return null
  }
}

/**
 * 锁定指定的时间戳key，防止继续写入
 * 存储结构：{ key: string, lockedAt: number }
 */
export const lockTrackKey = (key: string): void => {
  customSetStorageSync(TRACK_LOCK_KEY, {
    key: key,
    lockedAt: Date.now()
  })
}

/**
 * 解锁时间戳key
 */
export const unlockTrackKey = (): void => {
  customRemoveStorageSync(TRACK_LOCK_KEY)
}

/**
 * 获取有效的锁（如果锁已超时，自动解锁并返回 null）
 * @returns 锁定的 key，如果无锁或锁已超时返回 null
 */
export const getValidLock = (): string | null => {
  try {
    const lock = customGetStorageSync(TRACK_LOCK_KEY)
    
    // 没有锁
    if (!lock) {
      return null
    }
    
    // 兼容旧数据：如果是字符串格式（旧版本的锁），当作已超时处理
    if (typeof lock === 'string') {
      console.warn('检测到旧版本锁格式，自动清除:', lock)
      unlockTrackKey()
      return null
    }
    
    // 检查锁是否超时
    const lockAge = Date.now() - lock.lockedAt
    if (lockAge > LOCK_TIMEOUT) {
      console.warn(`锁已超时 (${Math.round(lockAge / 1000)}秒)，自动解锁:`, lock.key)
      unlockTrackKey()
      return null
    }
    
    // 锁有效
    return lock.key
  } catch (e) {
    console.error('获取锁失败:', e)
    return null
  }
}

/**
 * 删除已上报的数据（单个时间戳）
 */
export const removeTrackData = (key: string): void => {
  try {
    let trackKeys: string[] = customGetStorageSync(TRACK_KEYS_STORAGE_KEY) || []

    // 从列表中移除该key
    trackKeys = trackKeys.filter(k => k !== key)
    customSetStorageSync(TRACK_KEYS_STORAGE_KEY, trackKeys)

    // 删除对应的数据
    customRemoveStorageSync(`${TRACK_DATA_PREFIX}${key}`)

    // 解锁
    unlockTrackKey()

    console.log('数据已删除, 剩余时间戳数量:', trackKeys.length)
  } catch (error) {
    console.error('删除数据失败:', error)
  }
}

/**
 * 获取当前缓存数据总量
 * @returns 所有时间戳中的数据总条数
 */
export const getTotalCacheCount = (): number => {
  try {
    const trackKeys: string[] = customGetStorageSync(TRACK_KEYS_STORAGE_KEY) || []
    let totalCount = 0

    for (const key of trackKeys) {
      const data = customGetStorageSync(`${TRACK_DATA_PREFIX}${key}`) || []
      if (Array.isArray(data)) {
        totalCount += data.length
      }
    }

    return totalCount
  } catch (error) {
    console.error('获取缓存数据总量失败:', error)
    return 0
  }
}

/**
 * 更新缓存数据上限
 * @param maxCount 新的缓存上限，必须是100-1000之间的正整数
 */
export const updateMaxCacheCount = (maxCount: number): void => {
  // 确保在有效范围内
  const validCount = Math.min(Math.max(Math.round(maxCount), MIN_MAX_CACHE_COUNT), MAX_MAX_CACHE_COUNT)
  if (validCount !== currentMaxCacheCount) {
    currentMaxCacheCount = validCount
  }
}

/**
 * 获取当前缓存数据上限
 */
export const getCurrentMaxCacheCount = (): number => {
  return currentMaxCacheCount
}

/**
 * 重置上报失败冷却时间（用于测试或手动恢复）
 */
export const resetReportCooldown = (): void => {
  lastReportFailTime = 0
}

/**
 * 触发立即上报（当缓存数据达到上限时调用）
 * 暂停定时上报，执行一次完整上报，完成后重启定时器
 * 注意：此函数内部已做完善的异常处理，不会抛出错误
 */
export const triggerImmediateReport = async (): Promise<void> => {
  // 前置检查，快速返回
  if (!currentTrackApiFunc) {
    console.warn('无法触发立即上报：定时器未初始化')
    return
  }

  if (isImmediateReporting) {
    console.log('正在执行立即上报，跳过')
    return
  }

  // 设置标志位要在 try 外面，确保即使后续代码出错也能正确设置
  isImmediateReporting = true

  try {
    // 暂停定时上报
    if (trackReportTimerId) {
      try {
        clearInterval(trackReportTimerId)
      } catch (e) {
        // 忽略清除定时器的错误
      }
      trackReportTimerId = null
      console.log('暂停定时上报，开始立即上报')
    }

    // 执行上报（已有内部异常处理）
    await reportTrackDataOnce(currentTrackApiFunc)

    console.log('立即上报完成，重启定时器')

  } catch (error) {
    console.error('立即上报异常:', error)
    // 记录失败时间，防止频繁重试
    lastReportFailTime = Date.now()
  } finally {
    // 确保标志位被重置
    isImmediateReporting = false

    // 重启定时器（使用 try-catch 保护）
    try {
      if (currentTrackApiFunc && !trackReportTimerId) {
        trackReportTimerId = setInterval(() => {
          try {
            if (!isImmediateReporting) {
              console.log('定时上报数据')
              reportTrackDataOnce(currentTrackApiFunc!)
            }
          } catch (e) {
            console.error('定时上报回调异常:', e)
          }
        }, currentTrackInterval)
        console.log('定时上报已重启，间隔:', currentTrackInterval, '毫秒')
      }
    } catch (e) {
      console.error('重启定时器失败:', e)
    }
  }
}

/**
 * 检查是否需要立即上报（缓存数据量达到上限）
 * @returns 是否需要立即上报
 */
export const shouldTriggerImmediateReport = (): boolean => {
  try {
    // 如果正在上报中，不触发
    if (isImmediateReporting) {
      return false
    }

    // 如果上次上报失败且在冷却时间内，不触发
    if (lastReportFailTime > 0 && (Date.now() - lastReportFailTime) < REPORT_FAIL_COOLDOWN) {
      return false
    }

    const totalCount = getTotalCacheCount()
    return totalCount >= currentMaxCacheCount
  } catch (error) {
    console.error('检查是否需要立即上报失败:', error)
    return false
  }
}

/**
 * 压缩数据
 * @param data 要压缩的数据
 * @returns 压缩后的 base64 字符串，失败返回空字符串
 */
export const compressData = (data: any): string => {
  try {
    const jsonStr = JSON.stringify(data)
    return LZString.compressToBase64(jsonStr) || ''
  } catch (error) {
    console.error('压缩数据失败:', error)
    return ''
  }
}

/**
 * 解压数据
 * @param compressed 压缩后的 base64 字符串
 * @returns 解压后的数据
 */
export const decompressData = (compressed: string): any => {
  const jsonStr = LZString.decompressFromBase64(compressed)
  if (!jsonStr) return null
  return JSON.parse(jsonStr)
}

/**
 * 上报单个时间戳的数据
 * @param trackApiFunc 上报API函数
 * @param key 时间戳key
 * @returns 是否上报成功
 */
const reportSingleTimestamp = async (trackApiFunc: (data: any) => Promise<any>, key: string): Promise<boolean> => {
  try {
    const data = customGetStorageSync(`${TRACK_DATA_PREFIX}${key}`) || []

    if (data.length === 0) {
      // 数据为空，直接删除该key
      removeTrackData(key)
      return true
    }

    // 锁定当前时间戳
    lockTrackKey(key)

    // 压缩数据
    const compressedData = compressData(data)

    // 压缩失败，跳过本次上报，解锁并返回失败
    if (!compressedData) {
      console.error('压缩数据为空，跳过上报:', key)
      unlockTrackKey()
      lastReportFailTime = Date.now()
      return false
    }

    let originalSize = 0
    try {
      originalSize = JSON.stringify(data).length
    } catch (e) {
      // 忽略统计错误
    }
    const compressedSize = compressedData.length
    if (originalSize > 0) {
      console.log(`上报数据, 时间戳: ${key}, 数据条数: ${data.length}, 原始大小: ${originalSize} 字节, 压缩后: ${compressedSize} 字节, 压缩率: ${((1 - compressedSize / originalSize) * 100).toFixed(1)}%`)
    } else {
      console.log(`上报数据, 时间戳: ${key}, 数据条数: ${data.length}, 压缩后: ${compressedSize} 字节`)
    }

    // 调用上报API
    await trackApiFunc(compressedData)

    // 上报成功，删除已上报的数据（会自动解锁）
    removeTrackData(key)

    // 上报成功，重置失败冷却时间
    lastReportFailTime = 0

    console.log('时间戳上报成功:', key)
    return true
  } catch (error) {
    console.error('时间戳上报失败:', key, error)
    // 上报失败，解锁，记录失败时间
    unlockTrackKey()
    lastReportFailTime = Date.now()
    return false
  }
}

// 每次上报的最大时间戳数量
const MAX_REPORT_KEYS_PER_ROUND = 5

/**
 * 简单上报（忽略锁、缓存等逻辑，直接上报）
 * 用于记录执行日志，无论成功失败都不影响主流程
 * @param trackApiFunc 上报API函数
 * @param data 要上报的数据
 */
export const reportSimple = async (trackApiFunc: ((data: any) => Promise<any>) | null, data: any): Promise<void> => {
  if (!trackApiFunc || !data) return
  try {
    const compressedData = compressData(Array.isArray(data) ? data : [data])
    if (compressedData) {
      await trackApiFunc(compressedData)
    }
  } catch (e) {
    // 忽略错误，不影响主流程
  }
}

/**
 * 执行分批上报（按时间戳顺序逐个上报，每轮最多5个）
 * 每次触发时，按先后顺序逐个上报时间戳数据，每轮最多上报5个时间戳
 * 注意：此函数内部已做完善的异常处理，不会抛出错误
 * @param trackApiFunc 上报API函数
 */
export const reportTrackDataOnce = async (trackApiFunc: (data: any) => Promise<any>): Promise<void> => {
  // 记录执行状态，用于 finally 中上报
  let reportStatus = 'started'
  let reportedCount = 0
  let errorMsg = ''

  try {
    // 检查是否有正在锁定的key（说明上一次上报还没完成），使用超时机制
    const lockedKey = getValidLock()

    if (lockedKey) {
      console.log('有正在上报中的时间戳，跳过本次:', lockedKey)
      reportStatus = 'skipped_locked'
      return
    }

    let trackKeys: string[] = []
    try {
      trackKeys = customGetStorageSync(TRACK_KEYS_STORAGE_KEY) || []
    } catch (e) {
      console.error('获取时间戳列表失败:', e)
      reportStatus = 'error_get_keys'
      return
    }

    if (!Array.isArray(trackKeys) || trackKeys.length === 0) {
      console.log('没有需要上报的数据')
      reportStatus = 'no_data'
      return
    }

    // 本轮最多上报5个时间戳
    const keysToReport = trackKeys.slice(0, MAX_REPORT_KEYS_PER_ROUND)
    const remainingCount = trackKeys.length - keysToReport.length

    console.log(`开始分批上报, 本轮上报 ${keysToReport.length} 个时间戳${remainingCount > 0 ? `, 剩余 ${remainingCount} 个等待下轮上报` : ''}`)

    // 按顺序逐个上报（本轮最多5个）
    for (const key of keysToReport) {
      try {
        const success = await reportSingleTimestamp(trackApiFunc, key)

        if (!success) {
          // 上报失败，停止本次上报任务，等待下次触发
          console.log('上报失败，停止本次上报任务')
          reportStatus = 'partial_fail'
          break
        }

        reportedCount++
      } catch (e) {
        console.error('单个时间戳上报异常:', key, e)
        errorMsg = String(e)
        reportStatus = 'error_single'
        // 尝试解锁，防止锁死
        try {
          unlockTrackKey()
        } catch (unlockError) {
          // 忽略解锁错误
        }
        break
      }
    }

    if (reportStatus === 'started') {
      reportStatus = 'success'
    }
    console.log(`本轮上报完成, 成功上报 ${reportedCount} 个时间戳`)

  } catch (error) {
    console.error('上报任务异常:', error)
    reportStatus = 'error'
    errorMsg = String(error)
    // 尝试解锁，防止锁死
    try {
      unlockTrackKey()
    } catch (unlockError) {
      // 忽略解锁错误
    }
  } finally {
    // 只有在有数据的情况下才记录执行日志（没有数据时不上报）
    if (reportStatus !== 'no_data') {
      try {
        reportSimple(currentTrackApiFunc, {
          type: 'track',
          event: '#rxsdk_report_log',
          uuid: v4(),
          distinct_id: USER_INFO.openid,
          platform_id: 4,
          product_id: SYSTEM_INFO.productId,
          cpid: Number(SYSTEM_INFO.cpid),
          channel_id: SYSTEM_INFO.channelId,
          devicecode: SYSTEM_INFO.deviceCode || '',
          properties: {
            status: reportStatus,
            count: reportedCount,
            error: errorMsg || undefined
          }
        })
      } catch (error) {
        // 忽略日志上报错误
      }
    }
  }
}

/**
 * 启动定时上报定时器
 * @param trackApiFunc 上报API函数（接收压缩后的字符串）
 * @param interval 上报间隔，默认1分钟（60000毫秒）
 */
export const startTrackReportTimer = (trackApiFunc: (data: any) => Promise<any>, interval: number = DEFAULT_FLUSH_INTERVAL): void => {
  // 保存API函数引用，用于后续动态更新间隔
  currentTrackApiFunc = trackApiFunc

  // 确保间隔不小于最小值
  const validInterval = Math.max(interval, MIN_FLUSH_INTERVAL)
  currentTrackInterval = validInterval

  // 如果已有定时器，先清除
  if (trackReportTimerId) {
    clearInterval(trackReportTimerId)
    trackReportTimerId = null
  }

  // 初始化时先清除可能残留的锁（防止上次异常退出导致锁未释放）
  try {
    unlockTrackKey()
    console.log('初始化时清除残留锁')
  } catch (e) {
    // 忽略清除锁的错误
  }

  console.log('启动定时上报定时器, 间隔:', validInterval, '毫秒')

  // 启动定时器
  trackReportTimerId = setInterval(() => {
    try {
      // 如果正在执行立即上报，跳过本次定时上报
      if (isImmediateReporting) {
        console.log('正在执行立即上报，跳过定时上报')
        return
      }
      console.log('定时上报数据')
      reportTrackDataOnce(trackApiFunc)
    } catch (error) {
      console.error('定时上报回调异常:', error)
    }
  }, validInterval)
}

/**
 * 动态更新上报间隔
 * @param interval 新的上报间隔（毫秒），最小值为200毫秒
 */
export const updateTrackReportInterval = (interval: number): void => {
  // 确保间隔不小于最小值
  const validInterval = Math.max(interval, MIN_FLUSH_INTERVAL)

  // 如果间隔没有变化，不需要重启定时器
  if (validInterval === currentTrackInterval) {
    return
  }

  // 如果没有API函数引用，无法重启定时器
  if (!currentTrackApiFunc) {
    console.warn('无法更新上报间隔：定时器未初始化')
    return
  }

  console.log('更新上报间隔:', currentTrackInterval, '->', validInterval, '毫秒')

  // 重启定时器
  startTrackReportTimer(currentTrackApiFunc, validInterval)
}

/**
 * 停止定时上报定时器
 */
export const stopTrackReportTimer = (): void => {
  if (trackReportTimerId) {
    clearInterval(trackReportTimerId)
    trackReportTimerId = null
    console.log('Track report timer stopped')
  }
}
