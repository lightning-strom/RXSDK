export declare const getSignature: ({ openid, token, appid, }: {
    openid: string;
    token: string;
    appid: string;
}) => {
    sign: string;
    nonce: string;
    openid: string;
    ts: number;
    appid: string;
};
