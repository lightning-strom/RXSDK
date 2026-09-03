import { ISystemInfo } from '@/config'

export const getSystemInfo = () => {
  switch (process.env.TYPE) {
    case 'baidu':
      if (typeof window !== 'undefined' && !(window as any).swan) return {
        system: ''
      }
      return swan.getSystemInfoSync()
    case 'alipay':
      if (typeof window !== 'undefined' && !(window as any).my) return {
        system: ''
      }
      return my.getSystemInfoSync()
    case 'taobao':
      if (typeof window !== 'undefined' && !(window as any).my) return {
        system: ''
      }
      return my.getSystemInfoSync()
    case 'ks':
      if (typeof window !== 'undefined' && !(window as any).ks) return {
        system: ''
      }
      return ks.getSystemInfoSync()
    case 'jd':
      if (typeof window !== 'undefined' && !(window as any).ks) return {
        system: ''
      }
      return jd.getSystemInfoSync()
    case 'bilibili':
      if (typeof window !== 'undefined' && !(window as any).bl) return {
        system: ''
      }
      return bl.getSystemInfoSync()
    case 'douyin':
      if (typeof window !== 'undefined' && !(window as any).tt) return {
        system: ''
      }
      return tt.getSystemInfoSync()
    case 'gamebox':
      if (typeof window !== 'undefined' && !(window as any).gamebox) return {
        system: ''
      }
      return gamebox.getSystemInfoSync()
    case '4399':
      if (typeof window !== 'undefined' && !(window as any).gamebox) return {
        system: ''
      }
      return gamebox.getSystemInfoSync()
    case 'meituan':
      if (typeof window !== 'undefined' && !(window as any).wx) return {
        system: ''
      }
      return wx.getSystemInfoSync()
    default:
      return {}
  }
}

const systemInfo = getSystemInfo()

const getPlatformId = (): ISystemInfo['platformid'] => {
  const map: any = { android: 1, ios: 2, windows: 3, mac: 4 }
  return map[(systemInfo as any).platform] || 0
}

export const SYSTEM_INFO: Partial<ISystemInfo> = Object.assign(
  getSystemInfo,
  {
    fromChannel: 'minigame',
    platformid: getPlatformId()
  } as Partial<ISystemInfo>
)

export const USER_INFO: RpkResponseLogin = {} as any
