import { CryptoUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/CryptoUtil&4.0.0";
import { OssClient } from "@normalized:N&&&hmssdk/src/main/ets/oss/OssClient&4.0.0";
import type { OssConfigBean } from "@normalized:N&&&hmssdk/src/main/ets/oss/OssClient&4.0.0";
export default class OssClientAli extends OssClient {
    generateOSSHeaders(j63: OssConfigBean, k63: string, l63: ArrayBuffer): Record<string, string> {
        let m63 = j63.bucket;
        let n63 = "application/octet-stream";
        let o63 = "";
        let p63 = new Date().toUTCString();
        let q63 = `/${m63}/${k63}`;
        let r63 = j63.credentials.security_token;
        let s63 = `x-oss-security-token:${r63}\n`;
        let t63 = `${this.method}\n${o63}\n${n63}\n${p63}\n${s63}${q63}`;
        let u63 = j63.credentials.access_key_secret;
        const v63 = CryptoUtil.hmacSha1StringSync(t63, u63, 'base64');
        const w63 = j63.credentials.access_key_id;
        const x63 = `OSS ${w63}:${v63}`;
        const y63: Record<string, string> = {
            Authorization: x63,
            "Content-Type": n63,
            "x-oss-security-token": r63,
            Date: p63,
        };
        return y63;
    }
}
