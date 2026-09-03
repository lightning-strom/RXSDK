export declare const instagramLogin: (params: {
    clientId: string;
    redirectUri?: string;
}) => Promise<unknown>;
export declare const checkInstagramRedirect: () => true | undefined;
export declare const instagramAuthByCode: () => Promise<unknown>;
