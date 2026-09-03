class DateTime {
    getFormattedDate(v179 = new Date()): string {
        return this.getFormatDate("yyMMddHHmmssSSS", v179);
    }
    public getFormatDate(r179: string, s179: Date = new Date()): string {
        const t179: {
            [key: string]: string;
        } = {
            'yyyy': s179.getFullYear().toString(),
            'yy': (s179.getFullYear() % 100).toString().padStart(2, '0'),
            'MM': (s179.getMonth() + 1).toString().padStart(2, '0'),
            'dd': s179.getDate().toString().padStart(2, '0'),
            'HH': s179.getHours().toString().padStart(2, '0'),
            'mm': s179.getMinutes().toString().padStart(2, '0'),
            'ss': s179.getSeconds().toString().padStart(2, '0'),
            'SSS': s179.getMilliseconds().toString().padStart(3, '0'),
        };
        return r179.replace(/yyyy|yy|MM|dd|HH|mm|ss|SSS/g, (u179) => t179[u179]);
    }
    get currentTimeSecond() {
        return Math.round(Date.now() / 1000);
    }
    getUTCString(q179: Date = new Date()) {
        return q179.toUTCString();
    }
    public getTimestamp(n179: boolean = false, o179: Date = new Date()): number {
        const p179 = o179.getTime();
        return n179 ? p179 : Math.floor(p179 / 1000);
    }
    public timestampToDate(m179: number): Date {
        if (m179.toString().length === 13) {
            return new Date(m179);
        }
        else {
            return new Date(m179 * 1000);
        }
    }
    public getTimezoneDecimal(): string {
        return (-new Date().getTimezoneOffset() / 60).toFixed(2);
    }
    public getTimezoneString(): string {
        let l179 = -new Date().getTimezoneOffset();
        return (l179 > 0 ? "+" : "-") + ("00" + (Math.floor(l179 / 60))).substr(-2) + ":" + ("00" + (l179 % 60)).substr(-2);
    }
    getRFC3339(j179: boolean = true): string {
        let k179 = new Date().toISOString();
        return j179 ? k179.replace('/Z/', this.getTimezoneString()) : k179;
    }
}
export default new DateTime();
