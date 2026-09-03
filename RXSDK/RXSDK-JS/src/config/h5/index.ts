import { ISystemInfo } from '@/config'

const getPlatformId = () => {
  const map: any = { Android: 1, iOS: 2 }
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    return map.iOS
  }
  if (/Android/i.test(navigator.userAgent)) {
    return map.Android
  }
}

export const SYSTEM_INFO: Partial<ISystemInfo> = {
  platformid: getPlatformId(),
  fromChannel: 'weile',
}
