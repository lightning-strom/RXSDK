import preferences from '@ohos.data.preferences';
import { RXRequest, RequestMethod } from '../net/RXRequest';
import DateTime from '../utils/DateTime';
import Devices from '../utils/Devices';
import { Logger } from '../utils/Logger';
import { RXErrorCode, RXResult } from '../types/Index';
import { Context } from '@kit.AbilityKit';
import SDKConfig from '../sdk/SDKConfig';
import Passport from './Passport';
import { RXUtil } from '../utils/RXUtil';
import WindowLifecycle from './WindowLifecycle';

export type EventType = "track"

interface TracerBean {
  type: EventType
  event: string
  distinct_id: string
  properties: Object
  devicecode?: string
  uuid?: string
  time?: string
  cpid?: number
  product_id?: string
  channel_id?: string
  sub_channel_id?: string
  platform_id?: number
}

const TRACK_DATA_API = "v1/data/api/track";
const INVALID_TIMER_ID: number = -1

export default abstract class BaseTracer extends WindowLifecycle {
  protected flushInterval: number = 60000
  protected maxCacheCount: number = 20
  protected maxReportCount: number = -1
  protected dataCache: TracerBean[] = []
  protected enableCompress: boolean = true
  private timerID: number = INVALID_TIMER_ID
  private isShow = true
  private isInit: boolean = false
  private mPreferences?: preferences.Preferences
  protected context: Context;
  protected isEnable: boolean = true;
  protected isReporting: boolean = false;
  protected isPaused: boolean = false;

  constructor(context?: Context) {
    super()
    this.context = context;
  }

  //1
  onShown(): void {
    this.isShow = true
    this.isPaused = false
    this.startTimer()
  }

  //3
  onInactive(): void {
    this.isShow = false
    if (!this.isPaused) {
      this.reportToServer()
    }
  }

  //5
  onResumed(data?: any): void {
    this.isPaused = false
  }

  //6
  onPaused(): void {
    this.isPaused = true
    this.reportToServer()
  }


  abstract get cacheKey(): string

  abstract get preferencesName(): string

  public init(context: Context) {
    this.context = context;
    if (this.mPreferences === undefined && this.context) {
      this.mPreferences = preferences.getPreferencesSync(this.context, {
        name: this.preferencesName
      })
      this.loadCache()
      this.isShow = true
      this.startTimer();
    }
  }

  get preferences() {
    return this.mPreferences
  }

  get storageData(): string {
    if (this.mPreferences) {
      return this.mPreferences.getSync(this.cacheKey, "") as string
    } else {
      return null
    }
  }

  set storageData(value: string) {
    if (this.mPreferences) {
      this.mPreferences.putSync(this.cacheKey, value)
      this.mPreferences.flush()
      Logger.debug(`put ${this.cacheKey}:` + value)
    } else {
      Logger.e("hadoop not init")
    }
  }

  getReportDataCache(maxCount: number = this.maxReportCount): TracerBean[] {
    if (!this.dataCache || maxCount <= 0) {
      return this.dataCache
    }
    const startIndex = Math.max(0, this.dataCache?.length - maxCount);
    this.dataCache = this.dataCache?.slice(startIndex);
    return this.dataCache
  }

  private loadCache() {
    if (!this.isInit) {
      try {
        let data = this.storageData
        if (data) {
          Logger.d("load hadoop storage: " + JSON.stringify(data || "[]"))
        }

        this.isInit = true
        if (this.dataCache && this.dataCache.length > 0) {
          if (data) {
            this.dataCache.push(...JSON.parse(data || "[]") as TracerBean[] || [])
          }
        } else {
          this.dataCache = JSON.parse(data || "[]") || [];
        }
        return data
      } catch (err) {
        err.code ??= RXErrorCode.UNKNOWN_ERROR
        err.msg ??= err.message
        Logger.e(err)
      }
    }
  }

  get cacheCount() {
    return this.dataCache?.length || 0
  }

  protected clearCache(count: number = -1) {
    try {
      if (count > 0) {
        count = Math.min(count, this.dataCache?.length);
        this.dataCache = this.dataCache?.slice(count) || []
      } else {
        this.dataCache = []
      }
      this.storageData = JSON.stringify(this.dataCache)
    } catch (e) {
      Logger.e(e)
    }
  }

  protected updateCache(data?: TracerBean): number {
    let len = 0
    if (data) {
      len = this.dataCache?.push(data)
      this.storageData = JSON.stringify(this.dataCache)
    } else {
      this.clearCache()
    }
    return len
  }

  protected startTimer() {
    if (this.isEnable && this.isShow) {
      this.stopTimer()
      this.timerID = setTimeout(() => {
        this.timerID = INVALID_TIMER_ID
        this.reportToServer()
      }, this.flushInterval)
      // Logger.debug("start timer " + this.timerID)
    }
  }

  protected stopTimer() {
    if (this.timerID !== INVALID_TIMER_ID) {
      clearTimeout(this.timerID)
      this.timerID = INVALID_TIMER_ID;
    }
  }


  async reportToServer(): Promise<RXResult> {
    if (this.isReporting) {
      return RXUtil.getRXResult(RXErrorCode.CANCEL, "data is reporting ,this report is will be ignored")
    }
    let reportData = this.getReportDataCache()
    let reportCount = reportData?.length
    if (!reportData || reportCount === 0) {
      return RXUtil.getRXResult(RXErrorCode.CANCEL, "No data to report")
    }
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "ruixue-datacount": String(reportCount),
      ...(this.enableCompress ? {
        "content-encoding": "gzip"
      } : {})
    };

    try {
      this.isReporting = true
      const resp = await RXRequest.request<RXResult>({
        method: RequestMethod.POST,
        path: TRACK_DATA_API,
        data: reportData,
        ignoreReport: true,
        headers
      });
      if (resp.code === 0) {
        this.clearCache(reportCount);
      } else {
        if (resp.code === 302308) {
          this.clearCache(reportCount);
        }
      }
      return resp;
    } catch (err) {
      Logger.debug("report error:", JSON.stringify(err));
      return RXUtil.formatResult(err)
    } finally {
      this.isReporting = false
      this.startTimer();
    }
  }

  validate(...args: Object[]) {
    args.forEach((item) => {
      if (!item) {
        return false
      }
    })
    return true
  }

  trackAtTime(event: string, properties: Record<string, any>, distinct_id?: string,): boolean {
    return this.report("track", event, distinct_id, properties)
  }

  trackData(event: string, properties: Record<string, any>, distinct_id?: string): boolean {
    return this.report("track", event, distinct_id, properties)
  }

  track(event: string, distinct_id: string, properties: Record<string, any>): boolean {
    return this.report("track", event, distinct_id, properties)
  }


  private report(type: EventType, event: string, distinct_id: string, properties: Object, immediately: boolean = false): boolean {
    try {
      let config = SDKConfig
      if (properties) {
        if (config.regionTag) {
          properties["rx_region_tag"] = config.regionTag
        }
        if (config.cpRoleId) {
          properties["#role_id"] = config.cpRoleId
        }
      }

      let params: TracerBean = {
        type: type,
        event: event,
        distinct_id: distinct_id ?? (Passport.openid || Devices.distinctId),
        devicecode: Devices.deviceCode,
        uuid: Devices.genUUID(),
        time: DateTime.getRFC3339(),
        cpid: Number(config.cpId),
        product_id: config.productId,
        channel_id: config.channelId,
        sub_channel_id: config.subChannelId,
        platform_id: Devices.platformId,
        properties: {
          "sdk_version": config.VERSION,
          "rx_app_info": { version: config.APP_VERSION },
          ...properties
        }
      }

      if (this.validate(params.event, params.cpid, params.product_id, params.channel_id) && (params.distinct_id || params.devicecode)) {
        let len = this.updateCache(params)
        if (len >= this.maxCacheCount || immediately) {
          this.reportToServer()
        } else if (this.timerID === INVALID_TIMER_ID) {
          this.startTimer()
        }
        Logger.debug("data cache len=" + len)
        return true
      } else {
        Logger.d("track data failed :" + JSON.stringify(params))
        return false
      }
    } catch (e) {
      Logger.e(e)
    }
  }
}


