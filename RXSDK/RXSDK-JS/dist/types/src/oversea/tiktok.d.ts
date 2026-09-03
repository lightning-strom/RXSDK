export declare const tiktokLogin: (params: {
    clientKey: string;
    scope?: string;
    redirectUri?: string;
}) => Promise<unknown>;
export declare const tiktokAuthByCode: () => Promise<unknown>;
