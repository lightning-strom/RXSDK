export default class URL {
    private urlString;
    protocol: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    searchParams: Record<string, string>;
    hash: string;
    constructor(c197: string);
    private parseSearchParams;
    toString(): string;
}
