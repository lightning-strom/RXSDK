import util from "@ohos:util";
import { Logger } from "@normalized:N&&&hmssdk/src/main/ets/utils/Logger&4.0.0";
const centerLineRegex: RegExp = new RegExp('-', 'g');
const underLineRegex: RegExp = new RegExp('_', 'g');
const textDecoder = util.TextDecoder.create("utf-8", { ignoreBOM: true });
const base64 = new util.Base64Helper();
const TAG: string = 'TextUtil';
const BASE64_PAD_MOD = 4;
const BASE64_PAD_INVALID = 1;
export class JWTUtil {
    private static base64Decode(f189: string): string {
        return textDecoder.decodeWithStream(base64.decodeSync(f189));
    }
    private static base64UrlDecode(d189: string): string {
        d189 = d189.replace(centerLineRegex, '+').replace(underLineRegex, '/');
        const e189 = d189.length % BASE64_PAD_MOD;
        if (e189) {
            if (e189 === BASE64_PAD_INVALID) {
                throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
            }
            d189 += new Array(5 - e189).join('=');
        }
        return this.base64Decode(d189);
    }
    public static decodeJwtObj(z188: string): string {
        let a189: string[] = z188.split('.');
        let b189: string = '';
        if (a189.length < 3) {
            return b189;
        }
        try {
            b189 = JWTUtil.base64UrlDecode(a189[1]);
        }
        catch (c189) {
            Logger.error(TAG, `decodeJwtObj parse err: ${JSON.stringify(c189)}`);
        }
        return b189;
    }
}
