import { qs } from "@/utils/utils"
import { isFunction } from "@/utils/is"

export const getSystemInfo = () => {
  try {
    if (typeof window !== 'undefined' && !(window as any).wx) return {
      system: '',
    }
    return wx.getSystemInfoSync()
  }catch (e) {
    return {}
  }
}

/**
 * @name getSearchQueries
 * @desc 解析并存储 URL 参数
 */
export function getSearchQueries (ifStringify: true): string
export function getSearchQueries (): object
export function getSearchQueries (ifStringify?: true): object | string {
  let { query, referrerInfo: { extraData } } = wx.getLaunchOptionsSync()

  extraData = extraData || {}
  query = {
    ...query,
    ...extraData,
  }
  return ifStringify ? qs.stringify(query) : query
}

/**
 * @name listenVisibilityChange
 * @desc 监听显示/隐藏
 */
export const listenVisibilityChange = (callbak: (show?: boolean) => void) => {
  wx.onShow(() => {
    callbak(true)
  })
  wx.onHide(() => {
    callbak(false)
  })
}

/**
 * @name removeStorageByPrefix
 * @desc 删除指定前缀的storage缓存
 */

export const removeStorageByPrefix = (prefix: string, predict?: Function) => {
  const info = wx.getStorageInfoSync()
  // console.log('wx.getStorageInfoSync: ', info)
  const targetKeys: string[] = info.keys.filter((key: any) => isFunction(predict) ? predict(key) : key.startsWith(prefix))
  targetKeys.forEach((key: any) => wx.removeStorageSync(key))
}
