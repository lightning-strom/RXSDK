import { SYSTEM_INFO, ISystemInfo } from "@/config"
import { qs } from "@/utils/utils"

export const setSystemInfo = (info: Partial<ISystemInfo>) => {
  const appVersion = window.navigator.appVersion
  const map = {
    Android: 1,
    Mac: 2,
  }
  Object.assign(SYSTEM_INFO, {
    platformid: map[appVersion.replace(/^\S.*?(Android|Mac).*?\S$/g, '$1') as keyof typeof map] || 0
  } as ISystemInfo, info)
}

/**
 * @name getSearchQueries
 * @desc 解析并存储 URL 参数
 */
export const getSearchQueries = <T extends Object>(isString?: boolean): T => {
  const search = window.location.search.slice(1)
  return (isString ? search : qs.parse(search)) as T
}

/**
 * @name listenVisibilityChange
 * @desc 监听显示/隐藏
 */
export const listenVisibilityChange = (callbak: (show?: boolean) => void) => {
  document.addEventListener('visibilitychange', () => {
    callbak(!document.hidden)
  }, false)
}
