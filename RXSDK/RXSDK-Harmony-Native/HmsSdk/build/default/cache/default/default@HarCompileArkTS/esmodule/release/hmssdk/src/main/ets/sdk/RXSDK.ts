// @keepTs
// @ts-nocheck
import Func from "@normalized:N&&&hmssdk/src/main/ets/utils/Func&4.0.0";
import { RXApi } from "@normalized:N&&&hmssdk/src/main/ets/sdk/RXIndex&4.0.0";
export class RXSDK {
    async init(p158: string): Promise<string> {
        return Func.call(() => RXApi.getInstance().init(JSON.parse(p158)));
    }
    async login(o158: string): Promise<string> {
        return Func.call(() => RXApi.getInstance().login(JSON.parse(o158)));
    }
}
