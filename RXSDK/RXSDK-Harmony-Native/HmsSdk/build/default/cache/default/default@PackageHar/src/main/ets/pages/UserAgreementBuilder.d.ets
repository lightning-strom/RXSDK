// @keepTs
// @ts-nocheck
export declare class UserAgreementParams {
    title: ResourceStr;
    confirmText: ResourceStr;
    cancelText: ResourceStr;
    content: string;
    onConfirm?: (event?: ClickEvent) => void;
    onCancel?: (event?: ClickEvent) => void;
    constructor(d141: string, e141?: (event?: ClickEvent) => void, f141?: (event?: ClickEvent) => void);
}
@Builder
export declare function userAgreementBuilder(v140: UserAgreementParams): void;
