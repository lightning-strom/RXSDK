import { Context } from "@ohos.abilityAccessCtrl";
import { RXResult } from '../types/Index';
import { RXEvent } from '../utils/RXEvent';
import { UserAction, UserScene } from './UserActionEnum';
import BaseTracer from './BaseTracer';
declare const sensitiveKey: unique symbol;
interface IUserEvent {
    [eventName: string]: Record<string, any>;
}
declare class UserActionTracer extends BaseTracer {
    private [sensitiveKey];
    private startTimeMark;
    private maxReportEndInterval;
    get cacheKey(): string;
    get preferencesName(): string;
    constructor(d26?: Context);
    get event(): RXEvent<IUserEvent>;
    init(c26: Context): void;
    setConfig(z25: boolean, a26?: number, b26?: number): void;
    reportToServer(): Promise<RXResult>;
    private setOver;
    traceAction(t25: UserScene, u25: UserAction | string, v25?: Record<string, any>): boolean | void;
    dispatch(q25: Record<string, any>): boolean | void;
    onPlayerAction(p25: Record<string, any>): boolean | void;
    trackUserAction(m25: Record<string, any>, n25?: string): Promise<void>;
    stopTrackUserAction(): Promise<void>;
}
declare const _default: UserActionTracer;
export default _default;
