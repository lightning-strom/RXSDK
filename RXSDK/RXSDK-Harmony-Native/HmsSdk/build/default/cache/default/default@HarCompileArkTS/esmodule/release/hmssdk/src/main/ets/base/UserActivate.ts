import { RXRequest, RequestMethod } from "@normalized:N&&&hmssdk/src/main/ets/net/RXRequest&4.0.0";
import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import type { RCallback, RXResult } from "../types/Index";
import Devices from "@normalized:N&&&hmssdk/src/main/ets/utils/Devices&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import Objects from "@normalized:N&&&hmssdk/src/main/ets/utils/Objects&4.0.0";
import ApiPath from "@normalized:N&&&hmssdk/src/main/ets/constants/ApiPath&4.0.0";
import type { Context } from "@ohos:abilityAccessCtrl";
interface UserAttributionParams {
    device: Record<string, any>;
    distinct_id?: string;
    user_attrs?: Record<string, any>;
    user_source?: Record<string, any>;
    source_ad?: Record<string, any>;
    activate?: {
        result: any;
    };
}
class UserActivate {
    private ipv4: string = undefined;
    private activateResult: object;
    private isLoginSuccess: boolean = false;
    private userActivatedReTryCount: number = 2;
    async getDevice(): Promise<Record<string, any>> {
        let d27: Record<string, any> = {};
        d27.oaid = await Devices.getOAID(SDKConfig.context);
        d27.ipv4 = await this.getIp();
        d27.package_name = Devices.bundleName;
        if (SDKConfig.isModReport) {
            d27.model = Devices.model;
        }
        if (SDKConfig.isNetReport) {
            d27.network_standard = Devices.getNetCapabilities();
        }
        return d27;
    }
    onLoginSuccess() {
        this.isLoginSuccess = true;
    }
    async getAttributionData(s26?: Context): Promise<UserAttributionParams> {
        const t26: UserAttributionParams = {
            device: await this.getDevice(),
        };
        const u26: Record<string, any> = Devices.getRXPasteboardData(true, s26);
        if (u26 && "user_source" in u26) {
            const b27 = u26["user_source"] as string;
            if (b27 && b27.trim() !== "") {
                delete u26["user_source"];
                if (Object.keys(u26).length > 0) {
                    if ((b27 === "attr" || b27 === "attrs") &&
                        !("user_attrs" in t26)) {
                        t26.user_attrs = u26;
                    }
                    else if (!("user_source" in t26) && b27 !== "ad") {
                        const c27: Record<string, any> = {};
                        c27[b27] = u26;
                        t26.user_source = c27;
                    }
                }
            }
        }
        let v26 = SDKConfig.pushTaskId;
        if (v26 && v26.trim() !== "") {
            let z26: Record<string, any> = t26["user_source"] || {};
            if (z26) {
                const a27: Record<string, any> = { taskid: v26 };
                z26["push"] = a27;
                t26["user_source"] = z26;
            }
        }
        const w26 = SDKConfig.subChannelId;
        if (w26 && w26.trim() !== "") {
            let x26: Record<string, any> = t26["user_source"] || {};
            if (x26) {
                const y26: Record<string, any> = {
                    sub_channel_id: w26,
                    package_type: "promoter",
                };
                x26["sub_package"] = y26;
                t26["user_source"] = x26;
            }
        }
        if (Devices.getLoginCount() < 1) {
            if (Devices.distinctId) {
                t26.distinct_id = Devices.distinctId;
            }
            if (this.activateResult) {
                t26.activate = { result: this.activateResult };
            }
        }
        return t26;
    }
    async getIp(): Promise<string> {
        const p26 = SDKConfig.ipUrl;
        if (!p26) {
            Logger.i("init ip.api is not configured.");
            return this.ipv4;
        }
        if (this.ipv4) {
            return this.ipv4;
        }
        try {
            const r26 = await RXRequest.request({
                path: p26,
                method: RequestMethod.GET,
            });
            this.ipv4 = r26?.["ip"] || r26?.["client_ip"];
        }
        catch (q26) {
            Logger.e("Failed to fetch IP: " + q26);
        }
        return this.ipv4;
    }
    async init(l26: Context, m26: Record<string, any> = {}, n26?: RCallback): Promise<RXResult<object>> {
        if (!Devices.isActivated && Devices.getLoginCount() < 1) {
            let o26 = await this.activate(m26, l26);
            Logger.log(`sdk activate result:${JSON.stringify(o26)}`);
            n26?.(o26);
            return o26;
        }
    }
    async activate(e26: Record<string, any> = {}, f26: Context, g26 = 0): Promise<RXResult<object>> {
        e26 = Objects.deepAssign(e26, await this.getAttributionData());
        e26.activate_time = new Date().getTime() - SDKConfig.START_TIME;
        let h26 = await RXRequest.request<RXResult<object>>({
            path: ApiPath.FIRST_ACTIVATED,
            data: e26,
            method: RequestMethod.POST,
        }, null).then(k26 => {
            if (k26.code == 0) {
                Devices.setActivated();
                this.activateResult = k26.data;
            }
            return k26;
        });
        if (h26.code != 0 && g26 < this.userActivatedReTryCount) {
            return await new Promise<RXResult<object>>((i26, j26) => {
                setTimeout(() => {
                    i26(this.activate(e26, f26, g26 + 1));
                }, 100);
            });
        }
        else {
            return h26;
        }
    }
}
export default new UserActivate();
