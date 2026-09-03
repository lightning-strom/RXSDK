// @keepTs
// @ts-nocheck
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
export class NearbyLog {
    public static info(f50: any, ...g50: any[]): void {
        Logger.info("nearby->", f50, ...g50);
    }
    public static error(d50: any, ...e50: any[]): void {
        Logger.error("nearby->", d50, ...e50);
    }
}
