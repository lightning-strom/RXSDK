import preferences from "@ohos:data.preferences";
import { RXRequest, RequestMethod } from "@normalized:N&&&hmssdk/src/main/ets/net/RXRequest&4.0.0";
import DateTime from "@normalized:N&&&hmssdk/src/main/ets/utils/DateTime&4.0.0";
import Devices from "@normalized:N&&&hmssdk/src/main/ets/utils/Devices&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import { RXErrorCode } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { Context } from "@ohos:abilityAccessCtrl";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import Passport from "@normalized:N&&&hmssdk/src/main/ets/base/Passport&4.0.0";
import { RXUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/RXUtil&4.0.0";
import WindowLifecycle from "@normalized:N&&&hmssdk/src/main/ets/base/WindowLifecycle&4.0.0";
export type EventType = "track";
interface TracerBean {
    type: EventType;
    event: string;
    distinct_id: string;
    properties: Object;
    devicecode?: string;
    uuid?: string;
    time?: string;
    cpid?: number;
    product_id?: string;
    channel_id?: string;
    sub_channel_id?: string;
    platform_id?: number;
}
const TRACK_DATA_API = "v1/data/api/track";
const INVALID_TIMER_ID: number = -1;
export default abstract class BaseTracer extends WindowLifecycle {
    protected flushInterval: number = 60000;
    protected maxCacheCount: number = 20;
    protected maxReportCount: number = -1;
    protected dataCache: TracerBean[] = [];
    protected enableCompress: boolean = true;
    private timerID: number = INVALID_TIMER_ID;
    private isShow = true;
    private isInit: boolean = false;
    private mPreferences?: preferences.Preferences;
    protected context: Context;
    protected isEnable: boolean = true;
    protected isReporting: boolean = false;
    protected isPaused: boolean = false;
    constructor(h11?: Context) {
        super();
        this.context = h11;
    }
    onShown(): void {
        this.isShow = true;
        this.isPaused = false;
        this.startTimer();
    }
    onInactive(): void {
        this.isShow = false;
        if (!this.isPaused) {
            this.reportToServer();
        }
    }
    onResumed(g11?: any): void {
        this.isPaused = false;
    }
    onPaused(): void {
        this.isPaused = true;
        this.reportToServer();
    }
    abstract get cacheKey(): string;
    abstract get preferencesName(): string;
    public init(f11: Context) {
        this.context = f11;
        if (this.mPreferences === undefined && this.context) {
            this.mPreferences = preferences.getPreferencesSync(this.context, {
                name: this.preferencesName
            });
            this.loadCache();
            this.isShow = true;
            this.startTimer();
        }
    }
    get preferences() {
        return this.mPreferences;
    }
    get storageData(): string {
        if (this.mPreferences) {
            return this.mPreferences.getSync(this.cacheKey, "") as string;
        }
        else {
            return null;
        }
    }
    set storageData(e11: string) {
        if (this.mPreferences) {
            this.mPreferences.putSync(this.cacheKey, e11);
            this.mPreferences.flush();
            Logger.debug(`put ${this.cacheKey}:` + e11);
        }
        else {
            Logger.e("hadoop not init");
        }
    }
    getReportDataCache(c11: number = this.maxReportCount): TracerBean[] {
        if (!this.dataCache || c11 <= 0) {
            return this.dataCache;
        }
        const d11 = Math.max(0, this.dataCache?.length - c11);
        this.dataCache = this.dataCache?.slice(d11);
        return this.dataCache;
    }
    private loadCache() {
        if (!this.isInit) {
            try {
                let b11 = this.storageData;
                if (b11) {
                    Logger.d("load hadoop storage: " + JSON.stringify(b11 || "[]"));
                }
                this.isInit = true;
                if (this.dataCache && this.dataCache.length > 0) {
                    if (b11) {
                        this.dataCache.push(...JSON.parse(b11 || "[]") as TracerBean[] || []);
                    }
                }
                else {
                    this.dataCache = JSON.parse(b11 || "[]") || [];
                }
                return b11;
            }
            catch (a11) {
                a11.code ??= RXErrorCode.UNKNOWN_ERROR;
                a11.msg ??= a11.message;
                Logger.e(a11);
            }
        }
    }
    get cacheCount() {
        return this.dataCache?.length || 0;
    }
    protected clearCache(y10: number = -1) {
        try {
            if (y10 > 0) {
                y10 = Math.min(y10, this.dataCache?.length);
                this.dataCache = this.dataCache?.slice(y10) || [];
            }
            else {
                this.dataCache = [];
            }
            this.storageData = JSON.stringify(this.dataCache);
        }
        catch (z10) {
            Logger.e(z10);
        }
    }
    protected updateCache(w10?: TracerBean): number {
        let x10 = 0;
        if (w10) {
            x10 = this.dataCache?.push(w10);
            this.storageData = JSON.stringify(this.dataCache);
        }
        else {
            this.clearCache();
        }
        return x10;
    }
    protected startTimer() {
        if (this.isEnable && this.isShow) {
            this.stopTimer();
            this.timerID = setTimeout(() => {
                this.timerID = INVALID_TIMER_ID;
                this.reportToServer();
            }, this.flushInterval);
        }
    }
    protected stopTimer() {
        if (this.timerID !== INVALID_TIMER_ID) {
            clearTimeout(this.timerID);
            this.timerID = INVALID_TIMER_ID;
        }
    }
    async reportToServer(): Promise<RXResult> {
        if (this.isReporting) {
            return RXUtil.getRXResult(RXErrorCode.CANCEL, "data is reporting ,this report is will be ignored");
        }
        let r10 = this.getReportDataCache();
        let s10 = r10?.length;
        if (!r10 || s10 === 0) {
            return RXUtil.getRXResult(RXErrorCode.CANCEL, "No data to report");
        }
        const t10: Record<string, string> = {
            "Content-Type": "application/json",
            "ruixue-datacount": String(s10),
            ...(this.enableCompress ? {
                "content-encoding": "gzip"
            } : {})
        };
        try {
            this.isReporting = true;
            const v10 = await RXRequest.request<RXResult>({
                method: RequestMethod.POST,
                path: TRACK_DATA_API,
                data: r10,
                ignoreReport: true,
                headers: t10
            });
            if (v10.code === 0) {
                this.clearCache(s10);
            }
            else {
                if (v10.code === 302308) {
                    this.clearCache(s10);
                }
            }
            return v10;
        }
        catch (u10) {
            Logger.debug("report error:", JSON.stringify(u10));
            return RXUtil.formatResult(u10);
        }
        finally {
            this.isReporting = false;
            this.startTimer();
        }
    }
    validate(...p10: Object[]) {
        p10.forEach((q10) => {
            if (!q10) {
                return false;
            }
        });
        return true;
    }
    trackAtTime(m10: string, n10: Record<string, any>, o10?: string): boolean {
        return this.report("track", m10, o10, n10);
    }
    trackData(j10: string, k10: Record<string, any>, l10?: string): boolean {
        return this.report("track", j10, l10, k10);
    }
    track(g10: string, h10: string, i10: Record<string, any>): boolean {
        return this.report("track", g10, h10, i10);
    }
    private report(x9: EventType, y9: string, z9: string, a10: Object, b10: boolean = false): boolean {
        try {
            let d10 = SDKConfig;
            if (a10) {
                if (d10.regionTag) {
                    a10["rx_region_tag"] = d10.regionTag;
                }
                if (d10.cpRoleId) {
                    a10["#role_id"] = d10.cpRoleId;
                }
            }
            let e10: TracerBean = {
                type: x9,
                event: y9,
                distinct_id: z9 ?? (Passport.openid || Devices.distinctId),
                devicecode: Devices.deviceCode,
                uuid: Devices.genUUID(),
                time: DateTime.getRFC3339(),
                cpid: Number(d10.cpId),
                product_id: d10.productId,
                channel_id: d10.channelId,
                sub_channel_id: d10.subChannelId,
                platform_id: Devices.platformId,
                properties: {
                    "sdk_version": d10.VERSION,
                    "rx_app_info": { version: d10.APP_VERSION },
                    ...a10
                }
            };
            if (this.validate(e10.event, e10.cpid, e10.product_id, e10.channel_id) && (e10.distinct_id || e10.devicecode)) {
                let f10 = this.updateCache(e10);
                if (f10 >= this.maxCacheCount || b10) {
                    this.reportToServer();
                }
                else if (this.timerID === INVALID_TIMER_ID) {
                    this.startTimer();
                }
                Logger.debug("data cache len=" + f10);
                return true;
            }
            else {
                Logger.d("track data failed :" + JSON.stringify(e10));
                return false;
            }
        }
        catch (c10) {
            Logger.e(c10);
        }
    }
}
