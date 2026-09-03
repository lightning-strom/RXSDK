// @keepTs
// @ts-nocheck
interface Protocol {
    key?: string;
    key_list?: string[];
}
export declare class PrivacyParams {
    onCloseClick?: (event?: ClickEvent) => void;
    protocol?: Protocol;
    constructor(w123: Protocol, x123?: (event?: ClickEvent) => void);
}
@Builder
export declare function privacyBuilder(o123: PrivacyParams): void;
export {};
