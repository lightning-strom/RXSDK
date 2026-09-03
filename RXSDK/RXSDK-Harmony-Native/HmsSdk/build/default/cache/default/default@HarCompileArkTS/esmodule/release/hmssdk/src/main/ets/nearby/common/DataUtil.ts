// @keepTs
// @ts-nocheck
import fs from "@ohos:file.fs";
import { NearbyLog } from "@normalized:N&&&hmssdk/src/main/ets/nearby/common/NearbyLog&4.0.0";
export class DataUtil {
    static toMB(u47: number): string {
        return (u47 / 1024 / 1024).toFixed(2);
    }
    static getFolderSize(n47: string): number {
        let o47 = 0;
        try {
            const q47 = fs.listFileSync(n47);
            q47.forEach((r47: string) => {
                const s47 = `${n47}${n47.endsWith('/') ? '' : '/'}${r47}`;
                const t47 = fs.statSync(s47);
                if (t47.isDirectory()) {
                    o47 += DataUtil.getFolderSize(s47);
                }
                else {
                    o47 += t47.size;
                }
            });
        }
        catch (p47) {
            NearbyLog.error(`Error calculating folder size: ${p47.message}`);
        }
        return o47;
    }
}
