import { SYSTEM_INFO, USER_INFO } from '@/config'
import v4 from 'uuid/v4'
import { COMMON_ERROR_CODE } from '@/config/const'
import { asyncFunc, printLog, customGetStorageSync, customSetStorageSync } from '@/utils/utils'

import { trackApi } from '@/api/api'
import { formatDate } from '@/utils/day'
import { PLATFORM } from '@/config/enum'
// @ts-ignore
// import { cryptoJS } from '../index.crypto.js'

export const cpkey = '4ca7dacc9332d74e1292c83f0aa3b376'

// 请求队列 Map，用于管理相同参数的请求队列
// key: 请求的唯一标识（url + 参数的字符串化），value: 队列信息
interface RequestQueueItem {
  resolve: (value: any) => void
  reject: (error: any) => void
  options: any
  urlIndex: number
  refreshNum: number
  enableHttpDNS: boolean
}

interface RequestQueue {
  isProcessing: boolean
  queue: RequestQueueItem[]
  currentPromise?: Promise<any>
}

// 缓存成功的结果（code === 0 时）
// key: 请求的唯一标识，value: { result: 成功的结果数据, timestamp: 缓存时间戳 }
interface CacheItem {
  result: any
  timestamp: number
}

// 请求队列 Map，用于管理相同参数的请求队列
const requestQueueMap = new Map<string, RequestQueue>()
// 缓存成功的结果
const successResultCache = new Map<string, CacheItem>()

// 缓存配置
const CACHE_CONFIG = {
  MAX_CACHE_SIZE: 10, // 最大缓存数量，防止内存泄漏
  MAX_CACHE_AGE: 0.1 * 60 * 1000 // 缓存最大存活时间：6秒
}

// 清理过期的缓存
function cleanExpiredCache() {
  try {
    const now = Date.now()
    const keysToDelete: string[] = []
    
    try {
      successResultCache.forEach((item, key) => {
        try {
          if (now - item.timestamp > CACHE_CONFIG.MAX_CACHE_AGE) {
            keysToDelete.push(key)
          }
        } catch (error) {
          // printLog(`[缓存清理] 检查缓存项失败，跳过，queueKey: ${key}`, error)
        }
      })
    } catch (error) {
      // printLog(`[缓存清理] 遍历缓存失败`, error)
    }
    
    keysToDelete.forEach(key => {
      try {
        successResultCache.delete(key)
        // printLog(`[缓存清理] 清理过期缓存，queueKey: ${key}`)
      } catch (error) {
        // printLog(`[缓存清理] 删除缓存项失败，queueKey: ${key}`, error)
      }
    })
    
    // 如果缓存数量超过限制，清理最旧的缓存
    try {
      if (successResultCache.size > CACHE_CONFIG.MAX_CACHE_SIZE) {
        const sortedEntries = Array.from(successResultCache.entries())
          .sort((a, b) => a[1].timestamp - b[1].timestamp)
        
        const toDelete = sortedEntries.slice(0, successResultCache.size - CACHE_CONFIG.MAX_CACHE_SIZE)
        toDelete.forEach(([key]) => {
          try {
            successResultCache.delete(key)
            // printLog(`[缓存清理] 缓存数量超过限制，清理最旧缓存，queueKey: ${key}`)
          } catch (error) {
            // printLog(`[缓存清理] 删除最旧缓存失败，queueKey: ${key}`, error)
          }
        })
      }
    } catch (error) {
      // printLog(`[缓存清理] 清理超出限制的缓存失败`, error)
    }
  } catch (error) {
    // 清理缓存失败不影响其他功能
    // printLog(`[缓存清理] 清理缓存过程发生异常，但不影响其他功能`, error)
  }
}

// 生成请求的唯一标识
function generateRequestKey(path: string, data: any): string {
  try {
    let dataStr = ''
    try {
      dataStr = JSON.stringify(data || {})
    } catch (error) {
      // JSON.stringify 失败时，使用 toString 作为后备
      // printLog(`[请求队列] JSON.stringify 失败，使用后备方案`, error)
      try {
        dataStr = String(data || '')
      } catch (stringError) {
        dataStr = '{}'
        // printLog(`[请求队列] 转换为字符串失败，使用默认值`, stringError)
      }
    }
    return `${path || ''}_${dataStr}`
  } catch (error) {
    // 如果所有操作都失败，返回一个基于时间戳的唯一标识
    // printLog(`[请求队列] 生成 queueKey 完全失败，使用时间戳`, error)
    return `${path || ''}_${Date.now()}_${Math.random()}`
  }
}

// 检查结果是否应该被缓存（code === 0 status >  1 即可缓存）
function shouldCacheResult(result: any): boolean {
  try {
    if (!result) {
      // printLog(`[缓存检查] result 为空`)
      return false
    }
    try {
      if (result.code === 0 && result?.data?.status && result?.data?.status >  1) {
        // printLog(`[缓存检查] 满足缓存条件，code: ${result.code}`)
        return true
      }
      // printLog(`[缓存检查] code 不为 0, code: ${result.code}`)
      return false
    } catch (error) {
      // printLog(`[缓存检查] 检查 code 失败`, error)
      return false
    }
  } catch (error) {
    // 缓存检查失败，不缓存结果
    // printLog(`[缓存检查] 缓存检查过程异常，不缓存`, error)
    return false
  }
}

// 缓存成功的结果
function cacheSuccessResult(queueKey: string, result: any) {
  try {
    if (shouldCacheResult(result)) {
      try {
        // 清理过期缓存，防止内存泄漏
        cleanExpiredCache()
      } catch (error) {
        // printLog(`[缓存设置] 清理过期缓存失败，但不影响当前缓存设置`, error)
      }
      
      try {
        // printLog(`[请求队列] 请求成功且 code === 0，缓存结果，queueKey: ${queueKey}, 当前缓存数量: ${successResultCache.size}`)
        successResultCache.set(queueKey, {
          result,
          timestamp: Date.now()
        })
      } catch (error) {
        // printLog(`[缓存设置] 设置缓存失败，queueKey: ${queueKey}`, error)
      }
    } else {
      // printLog(`[请求队列] 请求结果不符合缓存条件，不缓存，queueKey: ${queueKey}, code: ${result?.code}`)
    }
  } catch (error) {
    // 缓存设置失败不影响请求结果
    // printLog(`[缓存设置] 缓存结果过程发生异常，但不影响请求`, error)
  }
}

// 处理队列中的请求（添加异常处理和防止死循环机制）
const processQueueRetryCount = new Map<string, number>() // 记录每个队列的处理次数，防止死循环
const MAX_PROCESS_RETRY = 100 // 最大处理次数，防止死循环

async function processQueue(queueKey: string) {
  // 防止死循环：检查处理次数
  const retryCount = processQueueRetryCount.get(queueKey) || 0
  if (retryCount > MAX_PROCESS_RETRY) {
    // printLog(`[队列处理] 处理次数超过限制，强制清理队列，queueKey: ${queueKey}, 重试次数: ${retryCount}`)
    try {
      const queue = requestQueueMap.get(queueKey)
      if (queue) {
        // 清理队列中的所有请求
        queue.queue.forEach(item => {
          try {
            item.reject(new Error('队列处理次数超过限制，请求被取消'))
          } catch (error) {
            // printLog(`[队列处理] 清理队列项失败`, error)
          }
        })
      }
      requestQueueMap.delete(queueKey)
      successResultCache.delete(queueKey)
      processQueueRetryCount.delete(queueKey)
    } catch (error) {
      // printLog(`[队列处理] 强制清理队列失败`, error)
    }
    return
  }
  
  try {
    const queue = requestQueueMap.get(queueKey)
    if (!queue || queue.isProcessing || queue.queue.length === 0) {
      // 重置重试计数
      processQueueRetryCount.delete(queueKey)
      return
    }

    queue.isProcessing = true
    // 增加重试计数
    processQueueRetryCount.set(queueKey, retryCount + 1)
    
    const item = queue.queue.shift()
    
    if (!item) {
      queue.isProcessing = false
      processQueueRetryCount.delete(queueKey)
      // 如果队列为空，删除该队列并清空缓存
      // 这是队列真正处理完成的标志（队列为空且没有正在处理的请求）
      try {
        if (queue.queue.length === 0) {
          // printLog(`[队列处理] 队列项为空，队列处理完成，删除队列并清空缓存，queueKey: ${queueKey}`)
          requestQueueMap.delete(queueKey)
          successResultCache.delete(queueKey)
        }
      } catch (error) {
        // printLog(`[队列处理] 清理队列失败`, error)
      }
      return
    }

    // printLog(`[队列处理] 开始处理队列中的请求，queueKey: ${queueKey}, 剩余队列长度: ${queue.queue.length}`)
    
    // 检查是否有缓存的结果
    let cacheItem: CacheItem | undefined
    try {
      cacheItem = successResultCache.get(queueKey)
      // printLog(`[队列处理] 检查缓存，queueKey: ${queueKey}, 缓存是否存在: ${!!cacheItem}`)
    } catch (error) {
      // printLog(`[队列处理] 检查缓存失败，继续执行请求`, error)
    }
    
    if (cacheItem) {
      try {
        // 检查缓存是否过期
        const now = Date.now()
        if (now - cacheItem.timestamp > CACHE_CONFIG.MAX_CACHE_AGE) {
          // printLog(`[队列处理] 缓存已过期，清理缓存，queueKey: ${queueKey}`)
          try {
            successResultCache.delete(queueKey)
          } catch (error) {
            // printLog(`[队列处理] 删除过期缓存失败`, error)
          }
        } else {
          // printLog(`[队列处理] 使用缓存结果，直接返回 code 101，queueKey: ${queueKey}`)
          // 直接返回缓存的响应，但 code 改为 101
          const cachedResponse = {
            ...cacheItem.result,
            code: 101
          }
          
          try {
            item.resolve(cachedResponse)
          } catch (error) {
            // printLog(`[队列处理] 返回缓存结果失败`, error)
          }
          
          queue.isProcessing = false
          // 重置重试计数
          processQueueRetryCount.delete(queueKey)
          
          // 处理队列中的下一个请求
          try {
            if (queue.queue.length > 0) {
              // printLog(`[队列处理] 继续处理下一个请求，queueKey: ${queueKey}, 剩余队列长度: ${queue.queue.length}`)
              // 使用 setTimeout 防止调用栈溢出
              setTimeout(() => {
                processQueue(queueKey).catch(err => {
                  // printLog(`[队列处理] 处理下一个请求失败`, err)
                })
              }, 0)
            } else {
              // 队列为空且没有正在处理的请求，删除该队列并清空缓存
              // 这是队列真正处理完成的标志
              // printLog(`[队列处理] 队列处理完成（队列为空且无正在处理的请求），删除队列并清空缓存，queueKey: ${queueKey}`)
              try {
                requestQueueMap.delete(queueKey)
                successResultCache.delete(queueKey)
              } catch (error) {
                // printLog(`[队列处理] 清理队列和缓存失败`, error)
              }
            }
          } catch (error) {
            // printLog(`[队列处理] 处理队列后续逻辑失败`, error)
            // 确保队列状态被重置
            try {
              queue.isProcessing = false
              if (queue.queue.length === 0) {
                requestQueueMap.delete(queueKey)
                successResultCache.delete(queueKey)
              }
            } catch (cleanupError) {
              // printLog(`[队列处理] 清理队列状态失败`, cleanupError)
            }
          }
          return
        }
      } catch (error) {
        // printLog(`[队列处理] 处理缓存逻辑失败，继续执行请求`, error)
      }
    }

    const startTime = Date.now()

    try {
      // 添加超时控制，防止请求卡死
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('队列请求超时')), 30000) // 30秒超时
      })
      
      // 执行原有的请求逻辑
      const result = await Promise.race([
        doRequestOriginal(item.options, item.urlIndex, item.refreshNum, item.enableHttpDNS),
        timeoutPromise
      ])
      
      const duration = Date.now() - startTime
      // printLog(`[队列处理] 请求成功完成，queueKey: ${queueKey}, 耗时: ${duration}ms`)
      
      // 如果请求成功且 data.status > 1，缓存结果
      try {
        cacheSuccessResult(queueKey, result)
      } catch (error) {
        // printLog(`[队列处理] 缓存结果失败，但不影响请求结果`, error)
      }
      
      try {
        item.resolve(result)
      } catch (error) {
        // printLog(`[队列处理] 返回请求结果失败`, error)
      }
    } catch (error) {
      const duration = Date.now() - startTime
      // printLog(`[队列处理] 请求失败，queueKey: ${queueKey}, 耗时: ${duration}ms`, error)
      try {
        item.reject(error)
      } catch (rejectError) {
        // printLog(`[队列处理] 拒绝请求失败`, rejectError)
      }
    } finally {
      try {
        queue.isProcessing = false
        // 处理队列中的下一个请求
        if (queue.queue.length > 0) {
          // printLog(`[队列处理] 继续处理下一个请求，queueKey: ${queueKey}, 剩余队列长度: ${queue.queue.length}`)
          // 使用 setTimeout 防止调用栈溢出
          setTimeout(() => {
            processQueue(queueKey).catch(err => {
              // printLog(`[队列处理] 处理下一个请求失败`, err)
              // 如果处理失败，确保队列状态被重置
              try {
                const failedQueue = requestQueueMap.get(queueKey)
                if (failedQueue) {
                  failedQueue.isProcessing = false
                  if (failedQueue.queue.length === 0) {
                    requestQueueMap.delete(queueKey)
                    successResultCache.delete(queueKey)
                    processQueueRetryCount.delete(queueKey)
                  }
                }
              } catch (cleanupError) {
                // printLog(`[队列处理] 清理失败队列状态失败`, cleanupError)
              }
            })
          }, 0)
        } else {
          // 队列为空且没有正在处理的请求，删除该队列并清空缓存
          // 这是队列真正处理完成的标志
          // printLog(`[队列处理] 队列处理完成（队列为空且无正在处理的请求），删除队列并清空缓存，queueKey: ${queueKey}`)
          try {
            requestQueueMap.delete(queueKey)
            successResultCache.delete(queueKey)
            processQueueRetryCount.delete(queueKey)
          } catch (error) {
            // printLog(`[队列处理] 清理队列和缓存失败`, error)
          }
        }
      } catch (error) {
        // printLog(`[队列处理] finally 块执行失败，强制清理`, error)
        // 强制清理，防止队列卡死
        try {
          queue.isProcessing = false
          if (queue.queue.length === 0) {
            requestQueueMap.delete(queueKey)
            successResultCache.delete(queueKey)
            processQueueRetryCount.delete(queueKey)
          }
        } catch (cleanupError) {
          // printLog(`[队列处理] 强制清理失败`, cleanupError)
        }
      }
    }
  } catch (error) {
    // 外层异常捕获，确保不影响其他功能
    // printLog(`[队列处理] processQueue 执行异常，强制清理队列，queueKey: ${queueKey}`, error)
    try {
      const queue = requestQueueMap.get(queueKey)
      if (queue) {
        queue.isProcessing = false
        // 清理队列中的所有请求
        queue.queue.forEach(queueItem => {
          try {
            queueItem.reject(new Error('队列处理异常，请求被取消'))
          } catch (rejectError) {
            // printLog(`[队列处理] 清理队列项失败`, rejectError)
          }
        })
      }
      requestQueueMap.delete(queueKey)
      successResultCache.delete(queueKey)
      processQueueRetryCount.delete(queueKey)
    } catch (cleanupError) {
      printLog(`[队列处理] 异常清理失败`, cleanupError)
    }
  }
}


function crypto(): any {
  // @ts-ignore
  // return cryptoJS()
  return wx.crypto
}

/**
 * AES-CBC 加密字符串
 * @param {string} data 需要加密的字符串
 * @param {string} key 加密密钥
 * @param {string} iv 初始化向量
 * @returns {string} 加密后的 Base64 编码字符串
 */
export function AesEncryptBase64String(data: any, key: any, iv: any) {
  const CryptoJS = crypto()
  // 将密钥和初始化向量转换为 WordArray
  const keyWordArray = CryptoJS.enc.Utf8.parse(key)
  const ivWordArray = CryptoJS.enc.Utf8.parse(iv)

  // 使用 AES-CBC 加密
  const encrypted = CryptoJS.AES.encrypt(data, keyWordArray, {
    iv: ivWordArray,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })

  // 返回 Base64 编码的加密结果
  return encrypted.toString()
}

/**
 * AES-CBC 解密字符串
 * @param {string} encryptedData 加密后的 Base64 编码字符串
 * @param {string} key 加密密钥
 * @param {string} iv 初始化向量
 * @returns {string} 解密后的原始字符串
 */
export function AesDecryptBase64String(encryptedData: any, key: any, iv: any) {
  const CryptoJS = crypto()
  // 将密钥和初始化向量转换为 WordArray
  const keyWordArray = CryptoJS.enc.Utf8.parse(key)
  const ivWordArray = CryptoJS.enc.Utf8.parse(iv)

  // 使用 AES-CBC 解密
  const decrypted = CryptoJS.AES.decrypt(encryptedData, keyWordArray, {
    iv: ivWordArray,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })

  // 将解密结果转换为 UTF-8 字符串
  return decrypted.toString(CryptoJS.enc.Utf8)
}

/**
 * 生成 MD5 加密字符串
 * @param {string} message - 需要加密的字符串
 * @returns {string} - 加密后的 MD5 字符串
 */
export function generateMD5(message: string) {
  const CryptoJS = crypto()
  if (CryptoJS)
    return CryptoJS.MD5(message).toString()
  return ''
}

const getDevicecode = () => {
  try {
    var devicecode = customGetStorageSync('rx_devicecode')
    if (devicecode) {
      // @ts-ignore
      return devicecode.code
    } else {
      let code = v4()
      customSetStorageSync('rx_devicecode', { code, openIds: {} })
      return code
    }
  } catch (err) {
    return v4()
  }
}

function checkNeedAesEncrypt(url: string) {
  if (!crypto()) {
    return false
  }
  if (!SYSTEM_INFO.CP_OF) {
    return false
  }
  return !url.includes('/v1/sdkconfig/init')
}

// 接口白名单：初始化未成功之前能走请求的接口
const apiWhiteList = ['/v1/sdkconfig/init', '/v1/vcapi/update', '/v1/vcapi/update_module_version']
const refreshCode = [302206, 302207, 302002]

function moveToStart(arr: string[], index: number) {
  // 移除指定索引的元素并获取它
  const element = arr.splice(index, 1)[0]
  // 在数组开始位置插入这个元素
  arr.unshift(element)
  return arr
}

const refreshTokenReq = (): Promise<any> =>
  doRequest({
    method: 'POST',
    url: '/v1/passport/token/refresh'
  })

const getHeaders = (path: string) => {
  const accessWhiteSpace = [
    '/v1/passport/account/login_by_credential',
    '/v1/passport/account/login_by_token'
  ]
  const getDevicecode = () => {
    try {
      var devicecode = customGetStorageSync('rx_devicecode')
      if (devicecode) {
        // @ts-ignore
        return devicecode.code
      } else {
        let code = v4()
        customSetStorageSync('rx_devicecode', { code, openIds: {} })
        return code
      }
    } catch (err) {
      return v4()
    }
  }
  const devicecode = getDevicecode()

  let headers: any = {
    ['ruixue-language']: 'zh-CN',
    ['ruixue-cpid']: SYSTEM_INFO.cpid,
    ['ruixue-productid']: SYSTEM_INFO.productId,
    ['ruixue-channelid']: SYSTEM_INFO.channelId,
    ['ruixue-platformid']: '4',
    ['ruixue-devicecode']: devicecode,
    ['ruixue-version']: SYSTEM_INFO.__RX_SDK_VERSION,
    ['ruixue-traceid']: v4(),
    ['ruixue-tzoffset']: SYSTEM_INFO.timezone + ''
  }

  let rxToken = customGetStorageSync('rxToken')
  if (!accessWhiteSpace.includes(path)) {
    // @ts-ignore
    Reflect.set(headers, 'ruixue-accesstoken', rxToken?.access || '')
  }
  if (path == '/v1/passport/token/refresh') {
    console.log('refresh')
    headers['ruixue-datacount'] = '1'
    // @ts-ignore
    headers['ruixue-refreshtoken'] = rxToken?.refresh
  }
  if (path.includes('/v1/data/api/track')) {
    headers = {
      ['ruixue-datacount']: '1'
    }
  }

  if (checkNeedAesEncrypt(path)) {
    headers['ruixue-encipher'] = '1'
    headers['ruixue-devicecode'] = devicecode
    headers['ruixue-version'] = SYSTEM_INFO.__RX_SDK_VERSION
    headers['ruixue-platformid'] = '4'
  }

  if (SYSTEM_INFO.region_tag) {
    headers['ruixue-region'] = `${SYSTEM_INFO.region_tag}`
  }

  if (SYSTEM_INFO.cp_role_id) {
    headers['ruixue-cp-role-id'] = `${SYSTEM_INFO.cp_role_id}`
  }

  if (SYSTEM_INFO.miniVersion) {
    headers['ruixue-appinfo'] = `version=${SYSTEM_INFO.miniVersion}`
  }
  return headers
}

function removeKeyFromObject(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => key !== 'ruixue-encipher')
  )
}

function isJsonString(str: any) {
  try {
    const parsed = JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

const retryRequest = (options: any, resolve: any, reject: any) => {
  const header = removeKeyFromObject(options.header)
  printLog(`${options.url}`)
  printLog(`options`, options)
  printLog(`timeout`, SYSTEM_INFO.timeout || 7000)
  wx.request({
    ...options,
    header,
    timeout: SYSTEM_INFO.timeout || 7000,
    data: options.data,
    success: (res: any) => {
      printLog(`${options.url}`)
      printLog(`res`, res.data)
      resolve(res.data)
    },
    fail: (res: any) => {
      printLog(`${options.url}`)
      printLog(`err`, res)
      reject(res)
    }
  })
}

function trackEncrypt(options: any, key: string) {
  trackApi([
    {
      event: '#rx_error',
      type: 'track',
      time: formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      uuid: v4(),
      sub_channel_id: USER_INFO.subchannelid,
      distinct_id: USER_INFO.openid,
      platform_id: 4,
      product_id: SYSTEM_INFO.productId,
      cpid: Number(SYSTEM_INFO.cpid),
      channel_id: SYSTEM_INFO.channelId,
      devicecode: getDevicecode(),
      properties: {
        error_action: 'encrypt',
        error_type: 'sdk',
        trace_id: v4(),
        rx_version: SYSTEM_INFO.__RX_SDK_VERSION,
        type_tripartite: PLATFORM.WECHAT,
        request_address: options.url || '',
        request_header: options.header || '',
        request_body: options.data || '',
        key
      }
    }
  ]).catch((e) => {
    console.log(e)
  })
}

function trackDecrypt(options: any, res: any, key: string) {
  if (options.url.includes('/v1/data/api/track')) {
    return
  }
  trackApi([
    {
      event: '#rx_error',
      type: 'track',
      time: formatDate('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      uuid: v4(),
      sub_channel_id: USER_INFO.subchannelid,
      distinct_id: USER_INFO.openid,
      platform_id: 4,
      product_id: SYSTEM_INFO.productId,
      cpid: Number(SYSTEM_INFO.cpid),
      channel_id: SYSTEM_INFO.channelId,
      devicecode: getDevicecode(),
      properties: {
        error_action: 'decrypt',
        error_type: 'sdk',
        trace_id: v4(),
        rx_version: SYSTEM_INFO.__RX_SDK_VERSION,
        type_tripartite: PLATFORM.WECHAT,
        request_address: options.url || '',
        request_header: options.header || '',
        request_body: options.data || '',
        request_response: res?.data,
        key
      }
    }
  ]).catch((e) => {
    console.log(e)
  })
}

const myRequest = (options: any) => {
  const devicecode = getDevicecode()
  const key = generateMD5(devicecode + cpkey)
  printLog(`${options.url}`)
  printLog(`options`, options)
  return new Promise((resolve, reject) => {
    let data = options.data
    const isAes = checkNeedAesEncrypt(options.url)

    try {
      data = (isAes && options.method.toLowerCase() != 'get') ? AesEncryptBase64String(JSON.stringify(options.data), key, key.slice(0, 16)) : options.data
      if (isAes && options.method.toLowerCase() != 'get') {
        printLog('Encrypt Data:', data)
      }
    } catch (e) {
      trackEncrypt(options, key)
      retryRequest(options, resolve, reject)
      return
    }
    printLog(`timeout`, SYSTEM_INFO.timeout || 7000)
    wx.request({
      ...options,
      data,
      timeout: SYSTEM_INFO.timeout || 7000,
      success: (res: any) => {
        if ([302015, 302016].includes(res.data?.code)) {
          printLog('request 解密失败', options.url, res.data?.code)
          trackDecrypt(options, res, key)
          retryRequest(options, resolve, reject)
        } else {
          let data = res.data?.data
          if (isAes && data) {
            try {
              if (res.data?.code === 0) {
                data = AesDecryptBase64String(data, key, key.slice(0, 16))
                printLog('Decrypt Data:', data)
                const result = {
                  ...res.data,
                  data: isJsonString(data) ? JSON.parse(data) : data
                }
                printLog(`${options.url}`)
                printLog(`res`, result)
                resolve(result)
              } else {
                resolve(res.data)
              }
            } catch (e) {
              printLog('response 解密失败', options.url, e)
              trackDecrypt(options, res, key)
              retryRequest(options, resolve, reject)
            }
          } else {
            printLog(`${options.url}`)
            printLog(`res`, res.data)
            resolve(res.data)
          }
        }
      },
      fail: (res: any) => {
        printLog(`${options.url}`)
        printLog(`err`, res)
        reject(res)
      }
    })
  })
}

function isHttpOrHttps(url: string) {
  return /^(http:\/\/|https:\/\/)/.test(url)
}

async function resetOptions(options: any) {
  const _options = JSON.parse(JSON.stringify(options))
  try {
    if (_options.url == '/v1/passport/account/login_by_credential') {
      const { code } = await asyncFunc(wx.login)
      _options.data.ext.code = code
    }
  } catch (e) {
    console.log(e)
  }

  try {
    if (_options.url == '/v1/passport/user/sync_info') {
      const { code } = await asyncFunc(wx.login)
      _options.data.code = code
    }
  } catch (e) {
    console.log(e)
  }

  try {
    if (_options.url == '/v1/passport/captcha/send_auth') {
      const { code } = await asyncFunc(wx.login)
      _options.data.minigame_code = code
    }
  } catch (e) {
    console.log(e)
  }

  return _options
}

// 原有的 doRequest 逻辑（完全保持不变）
async function doRequestOriginal(options: any, urlIndex = 0, refreshNum = 0, enableHttpDNS = false): Promise<any> {
  SYSTEM_INFO.reqUrlIndex = urlIndex
  
  const path = options.url
  if (!apiWhiteList.find((item: string) => options.url.startsWith(item)) && !SYSTEM_INFO.SDK_INIT_FINISHED) {
    printLog('sdk doRequest options: ', JSON.stringify(options))
    const error: any = {
      msg: '初始化错误，或未初始化',
      code: COMMON_ERROR_CODE.INIT_PARAMS_ERROR,
      thirdcode: COMMON_ERROR_CODE.INIT_PARAMS_ERROR,
      thrdmsg: '初始化错误，或未初始化',
      url: options.url
    }
    return Promise.reject(error)
  }
  const headers: any = getHeaders(path)
  const useHttpDNS = !!SYSTEM_INFO.httpDNSServiceId && enableHttpDNS
  const enableHttpDNSOptions = useHttpDNS ? {
    enableHttpDNS: true,
    httpDNSServiceId: SYSTEM_INFO.httpDNSServiceId
  } : {}

  if (useHttpDNS) {
    printLog('---useHttpDNS---')
    printLog(SYSTEM_INFO.httpDNSServiceId)
  }

  try {
    const url = isHttpOrHttps(path) ? path : SYSTEM_INFO.baseUrlList[urlIndex] + path
    const res: any = await myRequest({
      url,
      method: options.method,
      data: options.data || options.params,
      header: {
        ...headers,
        ...(options.header || {})  // 支持合并自定义 header
      },
      enableHttp2: true,
      ...enableHttpDNSOptions
    })
    if (res.code == 0) {
      return Promise.resolve(res)
    }

    if (refreshCode.includes(res.code)) {
      if (refreshNum === 5) {
        refreshNum = 0
        return Promise.reject({ code: 1000000, msg: 'refresh token failed,please login again' })
      } else {
        refreshNum++
        return refreshTokenReq().then(async (refreshRes) => {
          customSetStorageSync('rxToken', refreshRes.data)
          const _options = await resetOptions(options)
          return doRequestOriginal(_options, urlIndex, refreshNum, enableHttpDNS)
        })
      }
    } else {
      const msg = res.msg || res.message || res.errorMsg || 'Error'
      const error: any = new Error(msg)
      error.code = res.code || COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR
      error.data = res.data || res
      error.thirdcode = res.thirdcode
      error.thirdmsg = res.thirdmsg

      error.client_ip = res.client_ip || ''
      error.isServerError = true
      return Promise.reject(error)
    }
  } catch (e: any) {
    if (urlIndex < SYSTEM_INFO.baseUrlList.length - 1) {
      urlIndex++
      const _options = await resetOptions(options)
      return doRequestOriginal(_options, urlIndex, refreshNum, enableHttpDNS)
    } else {
      urlIndex = 0
      if (!enableHttpDNS && (e.errMsg?.includes('ERR_NAME_NOT_RESOLVED') || e.errMsg?.includes('ERR_CONNECTION_TIMED_OUT'))) {
        const _options = await resetOptions(options)
        return doRequestOriginal(_options, urlIndex, refreshNum, true)
      }
    }

    const url = isHttpOrHttps(path) ? path : SYSTEM_INFO.baseUrlList[urlIndex] + path
    return Promise.reject({
      url,
      request_header: headers,
      request_body: options.data || options.params,
      code: e.code || e.errno || COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR,
      msg: e.msg || e.message || e.errMsg || 'Error',
      thirdcode: e.thirdcode ||e.errno || e.code || COMMON_ERROR_CODE.UNKNOW_NETWORK_ERROR,
      thirdmsg: e.thirdmsg || e.msg || e.message || e.errMsg || 'Error',
      ...e
    })
  }
}

// 新的 doRequest 函数，添加队列机制（仅在特定条件下）
export async function doRequest(options: any, urlIndex = 0, refreshNum = 0, enableHttpDNS = false): Promise<any> {
  try {
    const apiFilter = ['/v1/ke/user_get_order_info']
    const path = options?.url
    
    // 如果请求的 URL 在 apiFilter 中，使用队列机制
    let needQueue = false
    try {
      needQueue = apiFilter.some(filter => path && path?.includes?.(filter))
    } catch (error) {
      // printLog(`[请求队列] 检查是否需要队列管理失败，直接执行原逻辑`, error)
      return doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)
    }
    
    if (needQueue) {
      try {
        // 生成请求的唯一标识（url + 参数）
        const requestData = options.data || options.params || {}
        let queueKey: string
        try {
          queueKey = generateRequestKey(path, requestData)
        } catch (error) {
          // printLog(`[请求队列] 生成 queueKey 失败，直接执行原逻辑`, error)
          return doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)
        }
        
        // printLog(`[请求队列] 检测到需要队列管理的请求，path: ${path}, queueKey: ${queueKey}`)
        
        // 优先检查缓存，如果有缓存直接返回，不创建队列
        let cacheItem: CacheItem | undefined
        try {
          cacheItem = successResultCache.get(queueKey)
          // printLog(`[请求队列] 检查缓存，queueKey: ${queueKey}, 缓存是否存在: ${!!cacheItem}`)
        } catch (error) {
          // printLog(`[请求队列] 检查缓存失败，继续执行队列逻辑`, error)
        }
        
        if (cacheItem) {
          try {
            // 检查缓存是否过期
            const now = Date.now()
            if (now - cacheItem.timestamp > CACHE_CONFIG.MAX_CACHE_AGE) {
              // printLog(`[请求队列] 缓存已过期，清理缓存，queueKey: ${queueKey}`)
              try {
                successResultCache.delete(queueKey)
              } catch (error) {
                // printLog(`[请求队列] 删除过期缓存失败`, error)
              }
            } else {
              // printLog(`[请求队列] 使用缓存结果，直接返回 code 101（跳过所有队列逻辑），queueKey: ${queueKey}`)
              // 直接返回缓存的响应，但 code 改为 101
              try {
                const cachedResponse = {
                  ...cacheItem.result,
                  code: 101
                }
                return Promise.resolve(cachedResponse)
              } catch (error) {
                // printLog(`[请求队列] 构建缓存响应失败，继续执行队列逻辑`, error)
              }
            }
          } catch (error) {
            // printLog(`[请求队列] 处理缓存逻辑失败，继续执行队列逻辑`, error)
          }
        }
        
        // 获取或创建队列
        let queue: RequestQueue | undefined
        try {
          queue = requestQueueMap.get(queueKey)
          if (!queue) {
            queue = {
              isProcessing: false,
              queue: []
            }
            try {
              requestQueueMap.set(queueKey, queue)
              // printLog(`[请求队列] 创建新队列，queueKey: ${queueKey}`)
            } catch (error) {
              //  printLog(`[请求队列] 创建队列失败，直接执行原逻辑`, error)
              return doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)
            }
          }
        } catch (error) {
          // printLog(`[请求队列] 获取或创建队列失败，直接执行原逻辑`, error)
          return doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)
        }
        
        // 如果当前没有正在处理的请求，直接执行
        if (!queue.isProcessing && queue.queue.length === 0) {
          // printLog(`[请求队列] 队列为空，立即执行请求，queueKey: ${queueKey}`)
          return new Promise((resolve, reject) => {
            try {
              // 立即开始处理
              queue!.isProcessing = true
              const startTime = Date.now()
              
              // 添加超时控制，防止请求卡死
              const timeoutPromise = new Promise((_, timeoutReject) => {
                setTimeout(() => timeoutReject(new Error('队列请求超时')), 30000) // 30秒超时
              })
              
              // 调用原有的 doRequest 逻辑
              Promise.race([
                doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS),
                timeoutPromise
              ])
                .then((result) => {
                  try {
                    const duration = Date.now() - startTime
                    // printLog(`[请求队列] 请求成功完成，queueKey: ${queueKey}, 耗时: ${duration}ms`)
                    
                    // 如果请求成功且 data.status > 1，缓存结果
                    try {
                      cacheSuccessResult(queueKey, result)
                    } catch (error) {
                      // printLog(`[请求队列] 缓存结果失败，但不影响请求结果`, error)
                    }
                    
                    // 验证缓存是否已设置
                    try {
                      const hasCache = successResultCache.has(queueKey)
                      // printLog(`[请求队列] 缓存设置完成，queueKey: ${queueKey}, 缓存是否存在: ${hasCache}`)
                    } catch (error) {
                      // printLog(`[请求队列] 验证缓存失败`, error)
                    }
                    
                    resolve(result)
                    
                    // 在 resolve 之后，确保缓存已设置完成，再处理队列中的下一个请求
                    try {
                      queue!.isProcessing = false
                      if (queue!.queue.length > 0) {
                        // printLog(`[请求队列] 请求完成，开始处理队列中的下一个请求，queueKey: ${queueKey}, 队列长度: ${queue!.queue.length}`)
                        // 处理队列中的下一个请求（缓存已设置，应该能检查到）
                        // 使用 setTimeout 防止调用栈溢出
                        setTimeout(() => {
                          processQueue(queueKey).catch(err => {
                            // printLog(`[请求队列] 处理下一个请求失败`, err)
                          })
                        }, 0)
                      } else {
                        // 队列为空，删除队列
                        // 注意：这里不清空缓存，因为后续可能还有相同参数的请求，缓存会在 processQueue 中所有请求处理完成时清空
                        // printLog(`[请求队列] 队列为空，删除队列（保留缓存供后续请求使用），queueKey: ${queueKey}`)
                        try {
                          requestQueueMap.delete(queueKey)
                        } catch (error) {
                          // printLog(`[请求队列] 删除队列失败`, error)
                        }
                      }
                    } catch (error) {
                      // printLog(`[请求队列] 处理队列后续逻辑失败`, error)
                      // 确保队列状态被重置
                      try {
                        queue!.isProcessing = false
                        if (queue!.queue.length === 0) {
                          requestQueueMap.delete(queueKey)
                        }
                      } catch (cleanupError) {
                        // printLog(`[请求队列] 清理队列状态失败`, cleanupError)
                      }
                    }
                  } catch (error) {
                    // printLog(`[请求队列] 处理请求成功回调失败`, error)
                    // 确保 reject 被调用
                    try {
                      reject(error)
                    } catch (rejectError) {
                      // printLog(`[请求队列] reject 失败`, rejectError)
                    }
                  }
                })
                .catch((error) => {
                  try {
                    const duration = Date.now() - startTime
                    // printLog(`[请求队列] 请求失败，queueKey: ${queueKey}, 耗时: ${duration}ms`, error)
                    reject(error)
                    
                    queue!.isProcessing = false
                    // 处理队列中的下一个请求
                    try {
                      if (queue!.queue.length > 0) {
                        // printLog(`[请求队列] 请求失败，继续处理队列中的下一个请求，queueKey: ${queueKey}, 队列长度: ${queue!.queue.length}`)
                        // 使用 setTimeout 防止调用栈溢出
                        setTimeout(() => {
                          processQueue(queueKey).catch(err => {
                            // printLog(`[请求队列] 处理下一个请求失败`, err)
                          })
                        }, 0)
                      } else {
                        // 队列为空，删除队列
                        // 注意：这里不清空缓存，因为后续可能还有相同参数的请求，缓存会在 processQueue 中所有请求处理完成时清空
                        // printLog(`[请求队列] 队列为空，删除队列（保留缓存供后续请求使用），queueKey: ${queueKey}`)
                        try {
                          requestQueueMap.delete(queueKey)
                        } catch (error) {
                          // printLog(`[请求队列] 删除队列失败`, error)
                        }
                      }
                    } catch (error) {
                      // printLog(`[请求队列] 处理队列后续逻辑失败`, error)
                      // 确保队列状态被重置
                      try {
                        queue!.isProcessing = false
                        if (queue!.queue.length === 0) {
                          requestQueueMap.delete(queueKey)
                        }
                      } catch (cleanupError) {
                        // printLog(`[请求队列] 清理队列状态失败`, cleanupError)
                      }
                    }
                  } catch (error) {
                    // printLog(`[请求队列] 处理请求失败回调失败`, error)
                  }
                })
            } catch (error) {
              // printLog(`[请求队列] 创建 Promise 失败，直接执行原逻辑`, error)
              // 确保队列状态被重置
              try {
                queue!.isProcessing = false
              } catch (cleanupError) {
                // printLog(`[请求队列] 重置队列状态失败`, cleanupError)
              }
              return doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)
            }
          })
        } else {
          // 有正在处理的请求或队列中有请求，加入队列
          // 注意：这里不需要再检查缓存，因为已经在上面检查过了
          // printLog(`[请求队列] 请求加入队列，queueKey: ${queueKey}, 当前队列长度: ${queue.queue.length}, 是否正在处理: ${queue.isProcessing}`)
          return new Promise((resolve, reject) => {
            try {
              queue!.queue.push({
                resolve,
                reject,
                options,
                urlIndex,
                refreshNum,
                enableHttpDNS
              })
              
              // printLog(`[请求队列] 请求已加入队列，queueKey: ${queueKey}, 队列长度: ${queue!.queue.length}`)
              
              // 如果当前没有正在处理，开始处理队列
              if (!queue!.isProcessing) {
                // printLog(`[请求队列] 开始处理队列，queueKey: ${queueKey}`)
                // 使用 setTimeout 防止调用栈溢出
                setTimeout(() => {
                  processQueue(queueKey).catch(err => {
                    // printLog(`[请求队列] 处理队列失败`, err)
                    // 如果处理失败，确保队列状态被重置
                    try {
                      const failedQueue = requestQueueMap.get(queueKey)
                      if (failedQueue) {
                        failedQueue.isProcessing = false
                      }
                    } catch (cleanupError) {
                      // printLog(`[请求队列] 清理失败队列状态失败`, cleanupError)
                    }
                  })
                }, 0)
              }
            } catch (error) {
              // printLog(`[请求队列] 加入队列失败，直接执行原逻辑`, error)
              // 如果加入队列失败，直接执行原逻辑
              doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)
                .then(resolve)
                .catch(reject)
            }
          })
        }
      } catch (error) {
        // 队列处理逻辑发生异常，直接执行原逻辑，不影响其他功能
        // printLog(`[请求队列] 队列处理逻辑异常，直接执行原逻辑`, error)
        return doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)
      }
    }
  } catch (error) {
    // 最外层异常捕获，确保不影响其他功能
    // printLog(`[请求队列] doRequest 执行异常，直接执行原逻辑`, error)
    return doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)
  }
  
  // 不在 apiFilter 中的请求，直接执行原有逻辑（完全不受影响）
  return doRequestOriginal(options, urlIndex, refreshNum, enableHttpDNS)
}

// 清理所有残留的队列和缓存（用于调试和清理）
export function clearAllQueuesAndCache() {
  try {
    const queueCount = requestQueueMap.size
    const cacheCount = successResultCache.size
    requestQueueMap.clear()
    successResultCache.clear()
    // printLog(`[请求队列] 清理所有队列和缓存，队列数量: ${queueCount}, 缓存数量: ${cacheCount}`)
  } catch (error) {
    
  }
 
}
