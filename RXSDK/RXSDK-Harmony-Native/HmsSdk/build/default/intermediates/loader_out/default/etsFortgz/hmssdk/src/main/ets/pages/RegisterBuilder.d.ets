// @keepTs
// @ts-nocheck
export declare class RegisterParams {
    onCommitClick?: (username: string, password?: string) => void;
    onCloseClick?: (event?: ClickEvent) => void;
    constructor(l130?: (username: string, password?: string) => void, m130?: (event?: ClickEvent) => void);
}
@Builder
export declare function registerBuilder(d130: RegisterParams): void;
