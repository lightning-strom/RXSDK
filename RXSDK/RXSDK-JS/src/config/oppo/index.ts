import { getSystemInfo } from "@/utils/oppo/utils"
import { ISystemInfo } from '@/config'

const systemInfo = getSystemInfo()


const getPlatformId = (): ISystemInfo['platformid'] => {
  const map: any = { android: 1, ios: 2, windows: 3, mac: 4 }
  return map[(systemInfo as any).platform] || 0
}

export const SYSTEM_INFO: Partial<ISystemInfo & WechatMinigame.SystemInfo> = Object.assign(
  {},
  systemInfo,
  {
    fromChannel: 'minigame',
    platformid: getPlatformId(),
  } as Partial<ISystemInfo>
)

export const USER_INFO: IResponseLoginWx = {} as any
