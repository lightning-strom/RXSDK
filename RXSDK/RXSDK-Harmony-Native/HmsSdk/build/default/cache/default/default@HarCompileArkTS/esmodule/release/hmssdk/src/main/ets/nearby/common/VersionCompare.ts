// @keepTs
// @ts-nocheck
import { getSandboxFileContent } from "@normalized:N&&&hmssdk/src/main/ets/nearby/common/FileUtils&4.0.0";
import { GlobalData } from "@normalized:N&&&hmssdk/src/main/ets/nearby/common/GlobalData&4.0.0";
import { NearbyLog } from "@normalized:N&&&hmssdk/src/main/ets/nearby/common/NearbyLog&4.0.0";
export function compareVersion(r50: string): number {
    let s50 = getVersionName();
    if (s50 === "") {
        return -1;
    }
    const t50 = s50.split('.').map(b51 => parseInt(b51));
    const u50 = r50.split('.').map(a51 => parseInt(a51));
    if (t50.length < 3 || u50.length < 3)
        return -1;
    for (let z50 = 0; z50 < 3; z50++) {
        if (t50[z50] !== u50[z50])
            return -1;
    }
    const v50 = Math.max(t50.length, u50.length);
    for (let w50 = 3; w50 < v50; w50++) {
        const x50 = w50 < t50.length ? t50[w50] : 0;
        const y50 = w50 < u50.length ? u50[w50] : 0;
        if (x50 > y50)
            return -1;
        else if (x50 < y50)
            return 1;
    }
    return 0;
}
interface VersionInfo {
    MajorVersion: string;
    MinorVersion: string;
    FixVersion: string;
    BuildVersion: string;
}
export function getVersionName(): string {
    try {
        let o50 = getSandboxFileContent(GlobalData.versionFilePath);
        let p50: VersionInfo = JSON.parse(o50);
        let q50 = `${p50.MajorVersion}.${p50.MinorVersion}.${p50.FixVersion}.${p50.BuildVersion}`;
        NearbyLog.info(" 获取本机资源版本号=" + q50);
        return q50;
    }
    catch (n50) {
        NearbyLog.info(" 获取版本名称错误" + n50);
    }
    return "";
}
export function parseVersionNameFromUri(h50: string): string | null {
    const i50 = h50.indexOf('?');
    if (i50 === -1)
        return null;
    const j50 = h50.substring(i50 + 1);
    const k50 = j50.split('&');
    for (const l50 of k50) {
        const m50 = l50.split('=');
        if (m50[0] === 'versionName') {
            return m50[1];
        }
    }
    return null;
}
