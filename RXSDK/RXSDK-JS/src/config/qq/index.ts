import { getSystemInfo } from "@/utils/qq/utils"
import { ISystemInfo } from '@/config'

const systemInfo = getSystemInfo()

const getPlatformId = (): ISystemInfo['platformid'] => {
  const map: any = { Android: 1, iOS: 2 }
  return (systemInfo.system && map[systemInfo.system.split(' ')[0]]) || 0
}

export const SYSTEM_INFO: Partial<ISystemInfo & WechatMinigame.SystemInfo> = Object.assign(
  {},
  systemInfo,
  {
    fromChannel: 'qq',
    platformid: getPlatformId(),
  } as Partial<ISystemInfo>
)

export const USER_INFO: IResponseLoginWx = {} as any
