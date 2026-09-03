class UrlUtil {
    getHostFromUrl(r198: string): string {
        const s198 = r198.match(/^(?:https?:\/\/)?([^\/:?#]+)(?:[\/:?#]|$)/i);
        return s198 ? s198[1] : "";
    }
    public toQueryString(d198: string | object | ArrayBuffer): string {
        if (d198 == null) {
            return "";
        }
        if (typeof d198 !== 'object') {
            return String(d198);
        }
        if (d198 instanceof ArrayBuffer) {
            const o198 = new Uint8Array(d198);
            const p198 = Array.from(o198)
                .map(q198 => q198.toString(16).padStart(2, '0'))
                .join('');
            return p198;
        }
        else if (d198 instanceof Map) {
            let j198 = [];
            d198.forEach((k198, l198) => {
                let m198 = Array.isArray(k198) ? k198.map(n198 => encodeURIComponent(n198)).join(',') : encodeURIComponent(k198);
                j198.push(`${encodeURIComponent(l198)}=${m198}`);
            });
            return j198.join('&');
        }
        else {
            return Object.keys(d198)
                .map(f198 => {
                const g198 = d198[f198];
                if (g198 === undefined) {
                    return null;
                }
                let h198 = Array.isArray(g198) ? g198.map(i198 => encodeURIComponent(i198)).join(',') : encodeURIComponent(g198);
                if (h198) {
                    return `${encodeURIComponent(f198)}=${h198}`;
                }
                else {
                    return null;
                }
            })
                .filter(e198 => e198 !== null)
                .join('&');
        }
    }
    public joinQuery(a198: string, b198: string | object | ArrayBuffer) {
        const c198 = this.toQueryString(b198);
        if (c198) {
            if (a198.indexOf('?') === -1) {
                a198 += '?';
            }
            else if (!a198.endsWith('&')) {
                a198 += '&';
            }
            a198 += c198;
        }
        return a198;
    }
    public isHttpUrl(y197: string): boolean {
        if (!y197) {
            return false;
        }
        const z197 = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
        return z197.test(y197);
    }
    getPathFromUrl(w197) {
        const x197 = w197.match(/^(?:https?:\/\/[^\/]+)?([^?#]*)/i);
        return x197 ? x197[1] : "";
    }
    getProtocolFromUrl(u197) {
        const v197 = u197.match(/^([a-z]+):\/\//i);
        return v197 ? v197[1] : "";
    }
    removeQueryParam(l197, m197) {
        const n197 = l197.split('?');
        if (n197.length < 2) {
            return l197;
        }
        const o197 = n197[0];
        const p197 = n197[1];
        const q197 = p197.split('&');
        const r197 = q197.filter(s197 => {
            const t197 = s197.split('=')[0];
            return t197 !== m197;
        });
        if (r197.length === 0) {
            return o197;
        }
        return `${o197}?${r197.join('&')}`;
    }
    getQueryParamValue(f197, g197) {
        const h197 = f197.split('&');
        for (const i197 of h197) {
            const [j197, k197] = i197.split('=');
            if (j197 === g197) {
                return decodeURIComponent(k197);
            }
        }
        return null;
    }
}
export default new UrlUtil();
