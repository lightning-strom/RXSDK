// @keepTs
// @ts-nocheck
export declare class ChangePasswordParams {
    isFirstSet: boolean;
    onCommitClick?: (password: string, oldPassword?: string) => void;
    onCloseClick?: (event?: ClickEvent) => void;
    constructor(l73: boolean, m73?: (password: string, oldPassword?: string) => void, n73?: (event?: ClickEvent) => void);
}
@Builder
export declare function changePasswordBuilder(d73: ChangePasswordParams): void;
