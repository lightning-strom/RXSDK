export default class p5 {
    static readonly NONE: p5;
    static readonly y10: p5;
    static readonly SUCCESS: p5;
    static readonly ERROR: p5;
    static readonly FAIL: p5;
    readonly value: number;
    readonly display: string;
    constructor(value: number, display: string);
    static valueOf(value: number): p5;
}
