import SDKConfig from "@normalized:N&&&hmssdk/src/main/ets/sdk/SDKConfig&4.0.0";
import { AlgName, CryptoUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/CryptoUtil&4.0.0";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
import URL from "@normalized:N&&&hmssdk/src/main/ets/utils/URL&4.0.0";
import { OssClient } from "@normalized:N&&&hmssdk/src/main/ets/oss/OssClient&4.0.0";
import type { OssConfigBean } from "@normalized:N&&&hmssdk/src/main/ets/oss/OssClient&4.0.0";
import TencentOssSigner from "@normalized:N&&&hmssdk/src/main/ets/oss/TencentOssSigner&4.0.0";
class AuthConstants {
    static readonly Q_SIGN_ALGORITHM = "q-sign-algorithm";
    static readonly Q_AK = "q-ak";
    static readonly Q_SIGN_TIME = "q-sign-time";
    static readonly Q_KEY_TIME = "q-key-time";
    static readonly Q_HEADER_LIST = "q-header-list";
    static readonly Q_URL_PARAM_LIST = "q-url-param-list";
    static readonly Q_SIGNATURE = "q-signature";
    static readonly SHA1 = "sha1";
    static readonly EXPIRE_TIME_RESERVE_IN_SECONDS = 60;
}
export default class OssClientTencent extends OssClient {
    generateOSSHeaders(b64: OssConfigBean, c64: string, d64: ArrayBuffer): Record<string, string> {
        const e64 = `${b64.domain}/${c64}`;
        let f64 = "application/octet-stream";
        const g64 = new URL(e64);
        const h64 = g64.host;
        let i64: string = CryptoUtil.hashStringSync(d64, AlgName.MD5, "base64");
        let j64: number = d64.byteLength;
        const k64: Record<string, string> = {
            "Content-Length": j64?.toString(),
            "User-Agent": `ruixue-sdk-${SDKConfig.VERSION}`,
            "Host": h64,
            "Content-MD5": i64,
        };
        const l64 = new Set<string>([
            "Content-Length",
            "Content-MD5",
        ]);
        const m64 = TencentOssSigner.generateSignature(k64, l64, b64.credentials, g64);
        k64.Authorization = m64;
        k64["Content-Type"] = f64;
        k64["x-cos-security-token"] = b64.credentials.security_token;
        Logger.d("test Authorization:" + m64);
        return k64;
    }
}
