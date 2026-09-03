export default class URL {
    private urlString: string;
    protocol: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    searchParams: Record<string, string>;
    hash: string;
    constructor(c197: string) {
        this.urlString = c197;
        const d197 = /^(https?):\/\/([^\/:?#]+)(:\d+)?(\/[^?#]*)?(\?[^#]*)?(#.*)?$/i;
        const e197 = c197.match(d197);
        if (!e197) {
            console.log(c197);
            throw new Error(`Invalid URL: ${c197}`);
        }
        this.protocol = e197[1];
        this.host = e197[2] || '';
        this.port = e197[3] ? e197[3].slice(1) : '';
        this.hostname = this.host.split(':')[0];
        this.pathname = e197[4] || '/';
        this.search = e197[5] || '';
        this.hash = e197[6] || '';
        this.searchParams = this.parseSearchParams(this.search);
    }
    private parseSearchParams(w196: string): Record<string, string> {
        const x196: Record<string, string> = {};
        if (w196.startsWith('?')) {
            const y196 = w196.slice(1).split('&');
            for (const z196 of y196) {
                const [a197, b197] = z196.split('=');
                if (a197) {
                    x196[decodeURIComponent(a197)] = b197 ? decodeURIComponent(b197) : '';
                }
            }
        }
        return x196;
    }
    toString(): string {
        let v196 = '';
        if (this.protocol) {
            v196 += `${this.protocol}://`;
        }
        if (this.host) {
            v196 += this.host;
        }
        if (this.port) {
            v196 += `:${this.port}`;
        }
        v196 += this.pathname;
        if (this.search) {
            v196 += this.search;
        }
        if (this.hash) {
            v196 += this.hash;
        }
        return v196;
    }
}
