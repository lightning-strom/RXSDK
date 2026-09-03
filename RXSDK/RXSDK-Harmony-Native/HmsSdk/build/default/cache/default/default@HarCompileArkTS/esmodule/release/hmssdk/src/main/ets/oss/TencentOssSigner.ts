import { CryptoUtil } from "@normalized:N&&&hmssdk/src/main/ets/utils/CryptoUtil&4.0.0";
import type URL from '../utils/URL';
import type { CredentialsBean } from './OssClient';
export default class TencentOssSigner {
    static generateSignature(p65: Record<string, string>, q65: Set<string>, r65: CredentialsBean, s65: URL): string {
        const t65 = `${r65.start_unix_time};${r65.expiration_unix_time}`;
        const u65 = [];
        const v65: Record<string, string[]> = {};
        for (const [z65, a66] of Object.entries(p65)) {
            v65[z65] = [a66];
        }
        const w65 = this.source(v65, q65, s65, t65);
        const x65 = this.getSignKey(r65.access_key_secret, t65);
        const y65 = this.hmacSha1(w65, x65);
        u65.push(`q-sign-algorithm=sha1`);
        u65.push(`q-ak=${r65.access_key_id}`);
        u65.push(`q-sign-time=${t65}`);
        u65.push(`q-key-time=${t65}`);
        u65.push(`q-header-list=${this.getRealHeaderList(q65).toLowerCase()}`);
        u65.push(`q-url-param-list=`);
        u65.push(`q-signature=${y65}`);
        return u65.join('&');
    }
    private static source(h65: Record<string, string[]>, i65: Set<string>, j65: URL, k65: string): string {
        const l65: string[] = [];
        l65.push('put');
        l65.push(decodeURIComponent(j65.pathname));
        l65.push('');
        const m65 = this.headersStringForKeys(h65, i65);
        l65.push(m65);
        let n65 = l65.join('\n') + "\n";
        const o65: string[] = [];
        o65.push('sha1');
        o65.push(k65);
        o65.push(this.sha1(n65));
        return o65.join('\n') + "\n";
    }
    private static getSignKey(f65: string, g65: string): string {
        return this.hmacSha1(g65, f65);
    }
    private static getRealHeaderList(e65: Set<string>): string {
        return this.sortAndJoinSemicolon(e65);
    }
    private static sortAndJoinSemicolon(c65: Set<string>): string {
        if (!c65) {
            return '';
        }
        const d65 = Array.from(c65).sort();
        return d65.join(';');
    }
    private static headersStringForKeys(q64: Record<string, string[]>, r64: Set<string>): string {
        const s64 = Array.from(r64)
            .map((b65) => encodeURIComponent(b65).toLowerCase())
            .sort();
        const t64 = Object.keys(q64).reduce((z64, a65) => {
            z64[a65.toLowerCase()] = a65;
            return z64;
        }, {} as Record<string, string>);
        const u64: string[] = [];
        for (const v64 of s64) {
            const w64 = t64[v64];
            const x64 = q64[w64];
            if (x64) {
                for (const y64 of x64) {
                    u64.push(`${v64}=${encodeURIComponent(y64)}`);
                }
            }
        }
        return u64.join('&');
    }
    private static sha1(p64: string): string {
        return CryptoUtil.sha1Sync(p64).toLowerCase();
    }
    private static hmacSha1(n64: string, o64: string): string {
        return CryptoUtil.hmacSha1StringSync(n64, o64, 'hex');
    }
}
