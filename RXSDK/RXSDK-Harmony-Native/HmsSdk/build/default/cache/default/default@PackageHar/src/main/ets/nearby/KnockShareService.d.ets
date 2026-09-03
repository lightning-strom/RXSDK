// @keepTs
// @ts-nocheck
export declare class KnockShareService {
    private static instance;
    static isSender: boolean;
    constructor(b53: UIContext);
    static getInstance(a53: UIContext): KnockShareService;
    init(): void;
}
