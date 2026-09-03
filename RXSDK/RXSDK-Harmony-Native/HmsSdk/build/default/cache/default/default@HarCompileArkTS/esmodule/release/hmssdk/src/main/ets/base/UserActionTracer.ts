import type { Context } from "@ohos:abilityAccessCtrl";
import ApiPath from "@normalized:N&&&hmssdk/src/main/ets/constants/ApiPath&4.0.0";
import { PassportPath } from "@normalized:N&&&hmssdk/src/main/ets/constants/PassportPath&4.0.0";
import { SDKEventType } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import type { RXResult } from "@normalized:N&&&hmssdk/src/main/ets/types/Index&4.0.0";
import DateTime from "@normalized:N&&&hmssdk/src/main/ets/utils/DateTime&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import { RXEvent } from "@normalized:N&&&hmssdk/src/main/ets/utils/RXEvent&4.0.0";
import { UserAction, UserScene } from "@normalized:N&&&hmssdk/src/main/ets/base/UserActionEnum&4.0.0";
import type { UserTraceData } from "@normalized:N&&&hmssdk/src/main/ets/base/UserActionEnum&4.0.0";
import BaseTracer from "@normalized:N&&&hmssdk/src/main/ets/base/BaseTracer&4.0.0";
const sensitiveKey = Symbol('_event');
const START_TIME_MARK: string = "start_time_mark";
const OVER_MARK: string = "over_mark";
const RX_USER_ACTION: string = "#rx_user_action";
interface IUserEvent {
    [eventName: string]: Record<string, any>;
}
class UserActionTracer extends BaseTracer {
    private [sensitiveKey]: RXEvent<IUserEvent>;
    private startTimeMark: number;
    private maxReportEndInterval: number;
    get cacheKey(): string {
        return "data_cache";
    }
    get preferencesName(): string {
        return "rx_user_action_log";
    }
    constructor(d26?: Context) {
        super(d26);
        this[sensitiveKey] = new RXEvent();
        this.event.on(SDKEventType.OnPlayerAction, this.onPlayerAction.bind(this));
    }
    public get event() {
        return this[sensitiveKey];
    }
    public init(c26: Context) {
        super.init(c26);
        this.startTimeMark = this.preferences?.getSync(START_TIME_MARK, 0) as number;
        this.isEnable = !this.preferences?.getSync(OVER_MARK, false) as boolean;
        if (!this.isEnable) {
            Logger.d("user action report is over");
        }
    }
    public setConfig(z25: boolean, a26: number = 3600, b26: number = 10) {
        this.maxReportEndInterval = a26;
        this.maxReportCount = b26;
        if (!z25) {
            this.isEnable = false;
            Logger.d("user action set disable");
            this.clearCache();
            this.stopTimer();
        }
    }
    async reportToServer(): Promise<RXResult> {
        let y25 = await super.reportToServer();
        if (!this.isEnable && y25.code < 1000) {
            this.stopTimer();
            Logger.d("user action set over report");
        }
        return y25;
    }
    private setOver() {
        this.preferences?.put(OVER_MARK, true);
        this.isEnable = false;
        if (this.cacheCount > 0) {
            this.reportToServer();
        }
        else {
            this.stopTimer();
        }
    }
    public traceAction(t25: UserScene, u25: UserAction | string, v25?: Record<string, any>): boolean | void {
        try {
            let x25 = { scene: t25, action: u25, ...v25 };
            Logger.d("user action:" + this.isEnable + " properties:" + JSON.stringify(x25));
            this.trackUserAction(x25);
        }
        catch (w25) {
            Logger.e(w25);
        }
    }
    public dispatch(q25: Record<string, any>): boolean | void {
        Logger.d("user action:" + this.isEnable + ",properties:" + JSON.stringify(q25));
        try {
            let s25 = q25 as UserTraceData;
            if (!s25.action) {
                s25.action = s25.error_code == 0 ? UserAction.Success : UserAction.Fail;
            }
            if (!s25.scene) {
                if (s25.api?.includes(ApiPath.SDK_CONFIG_INIT)) {
                    s25.scene = UserScene.Init;
                }
                else if (s25.api?.includes("v1/passport/account/login")) {
                    s25.scene = UserScene.Login;
                    s25.method ??= s25.request_body["method"];
                    s25.action = s25.error_code == 0 ? UserAction.LoginSuccess : UserAction.LoginFail;
                }
                else if (s25.api?.includes("v1/vcapi/update")) {
                    s25.scene = UserScene.VersionCheck;
                }
                else if (s25.api?.includes(PassportPath.CERTIFICATION)) {
                    s25.scene = UserScene.RealAuth;
                }
                else if (s25.api?.includes("v1/passport/captcha/send")) {
                    s25.scene = UserScene.Login;
                    s25.method ??= s25.request_body["method"];
                    s25.action = s25.error_code == 0 ? UserAction.CaptchaCodeSuccess : UserAction.CaptchaCodeFail;
                }
                else {
                    Logger.d("ignore report " + s25.api);
                    return;
                }
            }
            this.trackUserAction(s25);
        }
        catch (r25) {
            Logger.e(r25);
        }
    }
    public onPlayerAction(p25: Record<string, any>): boolean | void {
        Logger.d("user action onPlayerAction:" + JSON.stringify(p25));
        this.trackUserAction(p25);
    }
    public async trackUserAction(m25: Record<string, any>, n25?: string) {
        try {
            if (this.isEnable) {
                if (!m25) {
                    Logger.d("user action trackUserAction properties undefined");
                    return;
                }
                n25 ??= m25.distinct_id;
                this.trackData(RX_USER_ACTION, m25, n25);
                if (this.startTimeMark <= 0) {
                    this.startTimeMark = DateTime.getTimestamp();
                    this.preferences?.put(START_TIME_MARK, this.startTimeMark);
                }
                if (this.startTimeMark > 0 && (DateTime.getTimestamp() - this.startTimeMark) > this.maxReportEndInterval) {
                    this.setOver();
                }
            }
            else {
                Logger.d("user action trackUserAction not enable");
            }
        }
        catch (o25) {
            Logger.e(o25);
        }
    }
    public async stopTrackUserAction() {
        this.setOver();
    }
}
export default new UserActionTracer();
