import { ISystemInfo } from '@/config'
import { getUCSystemInfoSync } from '@/h5/utils'

export const getSystemInfo = () => {
  switch (process.env.TYPE) {
    case 'h5_uc':
      return getUCSystemInfoSync()
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

export const USER_INFO: H5ResponseLogin = {} as any
