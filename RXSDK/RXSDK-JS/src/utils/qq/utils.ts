import { COMMON_ERROR_CODE } from '@/config/const'
import { qs, asyncFunc } from '@/utils/utils'
import { isFunction } from 'lodash-es'

interface GetUserInfoParams {
  // 系统屏幕宽度
  screenWidth: number
  // 系统屏幕高度
  screenHeight: number
  // 用户信息按钮
  button?: ILoginQQ['button']
  // 获取用户信息所用字段，是否需要登录态
  withCredentials?: boolean
  // 显示用户信息的语言
  lang?: 'en' | 'zh_CN' | 'zh_TW'
  // 是否自动销毁用户信息按钮
  autoClose?: boolean
  // 是否检查已经授权过用户信息，已授权过直接返回用户信息，未授权过创建用户信息按钮
  isCheck?: boolean
  // 设置用户信息按钮
  setInstance: (
    instance: WechatMinigame.UserInfoButton | null
  ) => WechatMinigame.UserInfoButton | null
}

export const getSystemInfo = () => {
  if (typeof window !== 'undefined' && !(window as any).qq)
    return {
      system: '',
    }
  return qq.getSystemInfoSync()
}

export const getUserInfo = ({
  screenWidth,
  screenHeight,
  button,
  withCredentials = true,
  lang = 'zh_CN',
  autoClose = true,
  isCheck = true,
  setInstance,
}: GetUserInfoParams): Promise<any> =>
  new Promise(async (resolve, reject) => {
    if (isCheck) {
      const auth = await asyncFunc(qq.getSetting)
      if (auth.authSetting['scope.userInfo']) {
        const data = await asyncFunc(qq.getUserInfo, {
          withCredentials,
          lang,
        })
        console.info('sdk getUserInfo by qq.getUserInfo: ', data)
        console.info('=====================')
        resolve(data)
        return
      }
    }
    const width = 200
    const height = 40
    const instance = setInstance(
      qq.createUserInfoButton(
        Object.assign(
          {
            type: 'text',
            text: '允许获取头像昵称',
            style: {
              left: (screenWidth - width) / 2,
              top: screenHeight - 80 - height / 2,
              width,
              height,
              lineHeight: height,
              backgroundColor: '#ffffff',
              color: '#0bb20c',
              textAlign: 'center',
              fontSize: 16,
              borderRadius: 4,
              borderColor: '#d9d9da',
              borderWidth: 1,
            },
            withCredentials,
            lang,
          },
          button
        )
      )
    )
    console.log('instance:', instance)
    instance &&
      instance.onTap((res: any) => {
        if (res.errMsg.includes(':ok')) {
          console.info('sdk getUserInfo by qq.createUserInfoButton: ', res)
          console.info('=====================')
          resolve(res)
        } else {
          const error: any = new Error(res.errMsg)
          error.code = COMMON_ERROR_CODE.USER_INFO_AUTH_DENY
          reject(error)
        }
        if (autoClose) {
          instance && instance.destroy()
          setInstance(null)
        }
      })
  })

/**
 * @name getSearchQueries
 * @desc 解析并存储 URL 参数
 */
export function getSearchQueries(ifStringify: true): string
export function getSearchQueries(): object
export function getSearchQueries(ifStringify?: true): object | string {
  let {
    query,
    referrerInfo: { extraData },
  } = wx.getLaunchOptionsSync()
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
  qq.onShow(() => {
    callbak(true)
  })
  qq.onHide(() => {
    callbak(false)
  })
}

/**
 * @name removeStorageByPrefix
 * @desc 删除指定前缀的storage缓存
 */

export const removeStorageByPrefix = (prefix: string, predict?: Function) => {
  const info = qq.getStorageInfoSync()
  const targetKeys: string[] = info.keys.filter((key: any) => isFunction(predict) ? predict(key) : key.startsWith(prefix))
  targetKeys.forEach((key: any) => qq.removeStorageSync(key))
}
