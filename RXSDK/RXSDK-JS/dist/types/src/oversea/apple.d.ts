export declare const appleLogin: (params: {
    clientId: string;
    scope: string;
    state: string;
    nonce: string;
    redirectURI: string;
    usePopup: boolean;
}) => Promise<unknown>;
