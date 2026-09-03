import { SYSTEM_INFO } from '@/config'

const SDK_VERSION = SYSTEM_INFO.__RX_SDK_VERSION


let logger: any = null;

const getLogger = () => wx?.getLogManager ? logger = logger || wx?.getLogManager({ level: 0 }) : null

/**
 * 从基础库2.7.1开始，微信小程序端即可使用实时日志，微信小游戏端则从基础库2.14.4开始支持。
 */
// const realtimeLogger = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null

export default {
  info(identifier: string, ...args: any[]) {
    getLogger()
    if (!logger) return
    logger.info.apply(logger, [`[RX_SDK_LOG_${SDK_VERSION}]`, identifier, " >>> ", ...args])
  },
  warn(identifier: string, ...args: any[]) {
    getLogger()
    if (!logger) return
    logger.warn.apply(logger, [`[RX_SDK_LOG_${SDK_VERSION}]`, identifier, " >>> ", ...args])
  },
  // error(identifier: string, ...args: any[]) {
  //   if (!logger) return
  //   logger.error.apply(logger, [`[RX_SDK_LOG_${SDK_VERSION}]`, identifier, " >>> ", ...args])
  // },
}
