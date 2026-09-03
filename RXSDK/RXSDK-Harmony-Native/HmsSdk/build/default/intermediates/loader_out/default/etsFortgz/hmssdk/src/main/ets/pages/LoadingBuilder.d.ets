// @keepTs
// @ts-nocheck
export declare class LoadingParams {
    timeout: number;
    text?: string;
    bgColor: ResourceColor;
    onCloseClick?: () => void;
    constructor(d92?: () => void);
}
@Builder
export declare function loadingBuilder(v91: LoadingParams): void;
