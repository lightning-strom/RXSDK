// @keepTs
// @ts-nocheck
export declare class CaptchaVerifyParams {
    onCloseClick?: (event?: ClickEvent) => void;
    onSliderCaptchaCallback?: (data: object) => void;
    _url: string;
    constructor(c71: string, d71?: (event?: ClickEvent) => void);
}
@Builder
export declare function captchaVerifyBuilder(u70: CaptchaVerifyParams): void;
