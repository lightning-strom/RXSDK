declare class DateTime {
    getFormattedDate(v179?: Date): string;
    getFormatDate(r179: string, s179?: Date): string;
    get currentTimeSecond(): number;
    getUTCString(q179?: Date): string;
    getTimestamp(n179?: boolean, o179?: Date): number;
    timestampToDate(m179: number): Date;
    getTimezoneDecimal(): string;
    getTimezoneString(): string;
    getRFC3339(j179?: boolean): string;
}
declare const _default: DateTime;
export default _default;
