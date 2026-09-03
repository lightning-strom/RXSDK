// @keepTs
// @ts-nocheck
import pushCommon from "@hms:core.push.pushCommon";
import pushService from "@hms:core.push.pushService";
import { Singleton } from "@normalized:N&&&hmssdk/src/main/ets/types/Types&4.0.0";
import { RXError, RXUtil } from "@normalized:N&&&hmssdk/src/main/ets/sdk/RXIndex&4.0.0";
import type { RXResult } from "@normalized:N&&&hmssdk/src/main/ets/sdk/RXIndex&4.0.0";
import Push from "@normalized:N&&&hmssdk/src/main/ets/api/Push&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
export enum ReportType {
    Arrived = 2,
    Click = 3
}
export interface IPush {
    getDeviceToken(): Promise<string>;
    registerToken(): Promise<RXResult>;
    unRegisterToken(): Promise<RXResult>;
    bindAlias(appProfileId: string): Promise<RXResult>;
    unBindAlias(appProfileId: string): Promise<RXResult>;
}
export class PushManager extends Singleton<PushManager> implements IPush {
    token: string = "";
    taskIdCache: Map<string, number> = new Map<string, number>();
    async getDeviceToken(): Promise<string> {
        if (!this.token) {
            this.token = await pushService.getToken();
        }
        return this.token;
    }
    async reportNotifyStatus(r24: string, s24: ReportType): Promise<void> {
        try {
            if (!r24) {
                if (SDKConfig.isInit) {
                    Push.reportNotifyStatus(await this.getDeviceToken(), r24, s24);
                }
                else {
                    this.taskIdCache.set(r24, s24);
                }
            }
        }
        catch (t24) {
            Logger.e(t24);
        }
    }
    async registerToken(): Promise<RXResult> {
        try {
            let k24 = await this.getDeviceToken();
            let l24 = Push.bindDevice(k24);
            if (this.taskIdCache.size > 0) {
                const m24 = Array.from(this.taskIdCache.entries());
                for (let n24 = 0; n24 < m24.length; n24++) {
                    const o24 = m24[n24][0];
                    const p24 = m24[n24][1];
                    let q24 = await Push.reportNotifyStatus(k24, o24, p24);
                    if (q24.code == 0) {
                        this.taskIdCache.delete(o24);
                        console.log(`reportNotify success: ${o24}  ${p24}`);
                    }
                }
            }
            return l24;
        }
        catch (j24) {
            Logger.e(j24);
            return RXUtil.getRXResult(j24);
        }
    }
    async unRegisterToken(): Promise<RXResult> {
        try {
            let h24 = await this.getDeviceToken();
            if (!h24) {
                throw new RXError("token is null");
            }
            let i24 = await Push.unbindDevice(h24);
            if (i24.code == 0) {
                pushService.deleteToken();
                this.token = "";
            }
            return i24;
        }
        catch (g24) {
            Logger.e(g24);
            return RXUtil.getRXResult(g24);
        }
    }
    async bindAlias(e24: string): Promise<RXResult> {
        try {
            pushService.bindAppProfileId(pushCommon.AppProfileType.PROFILE_TYPE_APPLICATION_ACCOUNT, e24);
            return Push.bindAlias(e24);
        }
        catch (f24) {
            Logger.e(f24);
            return RXUtil.getRXResult(f24);
        }
    }
    async unBindAlias(c24: string): Promise<RXResult> {
        try {
            pushService.unbindAppProfileId(c24);
            return Push.bindAlias("");
        }
        catch (d24) {
            Logger.e(d24);
            return RXUtil.getRXResult(d24);
        }
    }
}
