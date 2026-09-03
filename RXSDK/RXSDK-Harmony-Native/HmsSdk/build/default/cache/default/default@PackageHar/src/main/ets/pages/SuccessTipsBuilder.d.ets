// @keepTs
// @ts-nocheck
export declare class SuccessTipsParams {
    title: ResourceStr;
    icon: ResourceStr;
    description: ResourceStr;
    onConfirm?: (event?: ClickEvent) => void;
    constructor(f?: (event?: ClickEvent) => void);
}
@Builder
export declare function successTipsBuilder(f133: SuccessTipsParams): void;
