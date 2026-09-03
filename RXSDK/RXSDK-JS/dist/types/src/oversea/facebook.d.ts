export declare const facebookInit: (params: {
    appId: string;
    cookie: boolean;
    xfbml: boolean;
    version: string;
}) => Promise<unknown>;
export declare const facebookLogin: (params: {
    app_associated_business: boolean;
    scope: string;
}) => Promise<unknown>;
export declare const facebookShare: (shareData: {
    title: string;
    description: string;
    image: string;
    href: string;
}) => Promise<unknown>;
