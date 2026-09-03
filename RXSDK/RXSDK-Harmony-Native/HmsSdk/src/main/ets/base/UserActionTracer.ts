import { Context } from '@kit.AbilityKit';
import ApiPath from '../constants/ApiPath';
import { PassportPath } from '../constants/PassportPath';

import { RXResult, SDKEventType } from '../types/Index';
import DateTime from '../utils/DateTime';
import { Logger } from '../utils/Logger';
import { RXEvent } from '../utils/RXEvent';

import { UserAction, UserScene, UserTraceData } from './UserActionEnum';
import BaseTracer from './BaseTracer';
const sensitiveKey = Symbol('_event');
const START_TIME_MARK: string = "start_time_mark"
const OVER_MARK: string = "over_mark"
const RX_USER_ACTION: string = "#rx_user_action"

interface IUserEvent {
  [eventName: string]: Record<string, any>;
}


class UserActionTracer extends BaseTracer {
  private [sensitiveKey]: RXEvent<IUserEvent>;
  private startTimeMark: number;
  private maxReportEndInterval: number;

  get cacheKey(): string {
    return "data_cache"
  }

  get preferencesName(): string {
    return "rx_user_action_log"
  }

  constructor(context?: Context) {
    super(context)
    this[sensitiveKey] = new RXEvent()
    this.event.on(SDKEventType.OnPlayerAction, this.onPlayerAction.bind(this))
  }

  public get event() {
    return this[sensitiveKey]
  }

  public init(context: Context) {
    super.init(context)
    this.startTimeMark = this.preferences?.getSync(START_TIME_MARK, 0) as number;
    this.isEnable = !this.preferences?.getSync(OVER_MARK, false) as boolean;
    if (!this.isEnable) {
      Logger.d("user action report is over")
    }
  }

  public setConfig(enable: boolean, maxReportInterval: number = 3600, reportCount: number = 10) {
    this.maxReportEndInterval = maxReportInterval;
    this.maxReportCount = reportCount
    if (!enable) {
      this.isEnable = false
      Logger.d("user action set disable")
      this.clearCache()
      this.stopTimer()
    }
  }

  async reportToServer(): Promise<RXResult> {
    let result = await super.reportToServer()
    if (!this.isEnable && result.code < 1000) {
      this.stopTimer()
      Logger.d("user action set over report")
    }
    return result
  }

  private setOver() {
    this.preferences?.put(OVER_MARK, true)
    this.isEnable = false
    if (this.cacheCount > 0) {
      this.reportToServer()
    } else {
      this.stopTimer()
    }
  }

  public traceAction(scene: UserScene, action: UserAction | string, event?: Record<string, any>): boolean | void {
    try {
      let ue = { scene: scene, action: action, ...event }
      Logger.d("user action:" + this.isEnable + " properties:" + JSON.stringify(ue))
      this.trackUserAction(ue)
    } catch (e) {
      Logger.e(e)
    }
  }

  public dispatch(event: Record<string, any>): boolean | void {
    Logger.d("user action:" + this.isEnable + ",properties:" + JSON.stringify(event))
    try {
      let td = event as UserTraceData
      if (!td.action) {
        td.action = td.error_code == 0 ? UserAction.Success : UserAction.Fail
      }
      if (!td.scene) {
        if (td.api?.includes(ApiPath.SDK_CONFIG_INIT)) {
          td.scene = UserScene.Init
        } else if (td.api?.includes("v1/passport/account/login")) {
          td.scene = UserScene.Login
          td.method ??= td.request_body["method"]
          td.action = td.error_code == 0 ? UserAction.LoginSuccess : UserAction.LoginFail
        } else if (td.api?.includes("v1/vcapi/update")) {
          td.scene = UserScene.VersionCheck
        } else if (td.api?.includes(PassportPath.CERTIFICATION)) {
          td.scene = UserScene.RealAuth
        } else if (td.api?.includes("v1/passport/captcha/send")) {
          td.scene = UserScene.Login
          td.method ??= td.request_body["method"]
          td.action = td.error_code == 0 ? UserAction.CaptchaCodeSuccess : UserAction.CaptchaCodeFail
        } else {
          Logger.d("ignore report " + td.api)
          return
        }
      }

      // this.event.emit(SDKEventType.OnPlayerAction, event)
      this.trackUserAction(td)

    } catch (e) {
      Logger.e(e)
    }
  }

  public onPlayerAction(event: Record<string, any>): boolean | void {
    Logger.d("user action onPlayerAction:" + JSON.stringify(event))
    this.trackUserAction(event)
  }

  public async trackUserAction(properties: Record<string, any>, distinct_id?: string) {
    try {
      if (this.isEnable) {
        if (!properties) {
          Logger.d("user action trackUserAction properties undefined")
          return
        }
        distinct_id ??= properties.distinct_id
        this.trackData(RX_USER_ACTION, properties, distinct_id)
        if (this.startTimeMark <= 0) {
          this.startTimeMark = DateTime.getTimestamp()
          this.preferences?.put(START_TIME_MARK, this.startTimeMark)
        }
        if (this.startTimeMark > 0 && (DateTime.getTimestamp() - this.startTimeMark) > this.maxReportEndInterval) {
          this.setOver()
        }
      } else {
        Logger.d("user action trackUserAction not enable")
      }
    } catch (e) {
      Logger.e(e)
    }
  }

  public async stopTrackUserAction() {
    this.setOver()
  }
}

export default new UserActionTracer()